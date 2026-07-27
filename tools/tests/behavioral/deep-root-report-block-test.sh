#!/usr/bin/env bash
# Behavioral test: validate-deep-root-report.mjs
# Tests: A=trigger-commit+no-report-fields→BLOCKING · B=same-commit+all-7-fields-present→PASS ·
#        C=no-trigger-commits+empty-council-files→PASS (clean baseline) ·
#        D=trigger-commit+6-of-7-fields (missing PRESERVATION)→BLOCKING
# S089 — B_DEEP_ROOT_TRIGGER (PRESENCE-only check: field labels present, not reasoning depth)
#
# Runs entirely inside an isolated tmp git repo (BLOCK-TEST-CONVENTION.md RULE 2 — cd-first +
# relative paths only). The real repo's tools/council/*.md and tools/data/*.yaml are NEVER
# touched by this script.
set -uo pipefail
PASS=0; FAIL=0

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
V="$ROOT/tools/validators/validate-deep-root-report.mjs"
TMP="$(mktemp -d)"

cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

setup_repo() {
  rm -rf "$TMP"/.git "$TMP"/tools "$TMP"/docs
  mkdir -p "$TMP/tools/data" "$TMP/tools/validators" "$TMP/tools/council" \
           "$TMP/docs/plan/_handoff/VAULT/inner-ai-defaults"
  cd "$TMP" || exit 1
  git init -q
  git config user.email "test@test.com"
  git config user.name "test"
  echo '{"current_session":"TESTSESS"}' > tools/session-state.json
  git add tools/session-state.json
  git commit -q -m "[TESTSESS] initial commit"
}

# ── TEST A: trigger commit (new D-default file), council files have NO report fields → BLOCKING ──
setup_repo
echo "# D-TEST new default" > docs/plan/_handoff/VAULT/inner-ai-defaults/D-TEST-fake-default.md
git add docs/plan/_handoff/VAULT/inner-ai-defaults/D-TEST-fake-default.md
git commit -q -m "[TESTSESS] add fake D-default"
echo "no report here, just conversation" > tools/council/sonnet-turn.md
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=1" && echo "$OUT" | grep -q "trigger_commits=1"; then
  echo "  ✓ TEST A: trigger commit + no report fields → BLOCKING"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST A: expected blocking=1 trigger_commits=1, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── TEST B: same commit, council file now has all 7 REPORT SCHEMA fields → PASS ──
cat > tools/council/sonnet-turn.md << 'MD'
## DEEP-ROOT REPORT
TRIGGER: fake trigger for test
DEFAULT REACTION: fake reaction for test
SATISFACTION POINT: fake stop for test
FALSE ASSUMPTION: fake premise for test
DEEP ROOT: D-TEST
PREVENTION: fake prevention for test
PRESERVATION: routed to default-correction-registry.yaml for test
MD
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=0" && echo "$OUT" | grep -q "schema_fields_present=7/7"; then
  echo "  ✓ TEST B: trigger commit + all 7 fields present → PASS"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST B: expected blocking=0 schema_fields_present=7/7, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── TEST C: no trigger commits this session, empty council files → PASS (clean baseline) ──
setup_repo
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=0" && echo "$OUT" | grep -q "trigger_commits=0"; then
  echo "  ✓ TEST C: no trigger commits + empty council files → PASS"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST C: expected blocking=0 trigger_commits=0, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── TEST D: trigger commit, council file has 6/7 fields (missing PRESERVATION) → BLOCKING ──
setup_repo
mkdir -p docs/plan/pillar-0-governance/behavioral-contracts
echo "## B_FAKE_TEST_CONTRACT" > docs/plan/pillar-0-governance/behavioral-contracts/B_FAKE_TEST_CONTRACT.md
git add docs/plan/pillar-0-governance/behavioral-contracts/B_FAKE_TEST_CONTRACT.md
git commit -q -m "[TESTSESS] add fake behavioral contract"
cat > tools/council/opus-turn.md << 'MD'
## DEEP-ROOT REPORT
TRIGGER: fake trigger for test
DEFAULT REACTION: fake reaction for test
SATISFACTION POINT: fake stop for test
FALSE ASSUMPTION: fake premise for test
DEEP ROOT: D-TEST
PREVENTION: fake prevention for test
MD
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=1" && echo "$OUT" | grep -q "schema_fields_present=6/7"; then
  echo "  ✓ TEST D: trigger commit + 6/7 fields (missing PRESERVATION) → BLOCKING"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST D: expected blocking=1 schema_fields_present=6/7, got: $OUT"
  FAIL=$((FAIL+1))
fi

echo ""
echo "[deep-root-report-block-test] PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
