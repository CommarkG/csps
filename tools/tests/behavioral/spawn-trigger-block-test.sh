#!/usr/bin/env bash
# Behavioral test: validate-spawn-trigger.mjs
# Tests: A=high-scope-dispatch+unverified→BLOCKING · B=same-dispatch+verified→PASS ·
#        C=high-scope-commit+zero-dispatch-log-activity→BLOCKING · D=no-high-scope-commits+empty-log→PASS
# S089 — B_SPAWN_TRIGGER_GATE (one-tab operating discipline: Opus-agent dispatch, mechanically enforced)
#
# Runs entirely inside an isolated tmp git repo (BLOCK-TEST-CONVENTION.md RULE 2 — cd-first +
# relative paths only). The real repo's tools/data/opus-dispatch-log.yaml is NEVER touched by
# this script.
set -uo pipefail
PASS=0; FAIL=0

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
V="$ROOT/tools/validators/validate-spawn-trigger.mjs"
TMP="$(mktemp -d)"

cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

setup_repo() {
  rm -rf "$TMP"/.git "$TMP"/tools
  mkdir -p "$TMP/tools/data" "$TMP/tools/validators"
  cd "$TMP" || exit 1
  git init -q
  git config user.email "test@test.com"
  git config user.name "test"
  echo '{"current_session":"TESTSESS"}' > tools/session-state.json
  git add tools/session-state.json
  git commit -q -m "[TESTSESS] initial commit"
}

# ── TEST A: HIGH-scope dispatch this session, verdict_recorded=false → BLOCKING ──
setup_repo
cat > tools/data/opus-dispatch-log.yaml << 'YML'
dispatches:
  - session: TESTSESS
    dispatch_id: test-dispatch-1
    scope_tier: corespine
    task: "test HIGH-scope dispatch, no verdict yet"
    verdict_recorded: false
    opus_verdict_ref: ""
YML
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=1"; then
  echo "  ✓ TEST A: HIGH-scope dispatch + verdict_recorded=false → BLOCKING"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST A: expected blocking=1, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── TEST B: same dispatch, verdict_recorded=true + opus_verdict_ref set → PASS ──
cat > tools/data/opus-dispatch-log.yaml << 'YML'
dispatches:
  - session: TESTSESS
    dispatch_id: test-dispatch-1
    scope_tier: corespine
    task: "test HIGH-scope dispatch, no verdict yet"
    verdict_recorded: true
    opus_verdict_ref: "tools/council/opus-turn.md#TESTSESS-verdict-1"
YML
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=0"; then
  echo "  ✓ TEST B: HIGH-scope dispatch + verdict recorded → PASS"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST B: expected blocking=0, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── TEST C: HIGH-scope governance commit this session, zero dispatch-log activity → BLOCKING ──
setup_repo
mkdir -p docs/plan/pillar-0-governance/behavioral-contracts
echo "## B_FAKE_TEST_CONTRACT" > docs/plan/pillar-0-governance/behavioral-contracts/B_FAKE_TEST_CONTRACT.md
git add docs/plan/pillar-0-governance/behavioral-contracts/B_FAKE_TEST_CONTRACT.md
git commit -q -m "[TESTSESS] add fake behavioral contract"
cat > tools/data/opus-dispatch-log.yaml << 'YML'
dispatches: []
YML
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=1" && echo "$OUT" | grep -q "high_scope_commits=1"; then
  echo "  ✓ TEST C: HIGH-scope commit + 0 dispatch-log activity → BLOCKING"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST C: expected blocking=1 high_scope_commits=1, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── TEST D: no HIGH-scope commits this session, empty log → PASS (clean baseline) ──
setup_repo
cat > tools/data/opus-dispatch-log.yaml << 'YML'
dispatches: []
YML
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=0" && echo "$OUT" | grep -q "high_scope_commits=0"; then
  echo "  ✓ TEST D: no HIGH-scope commits + empty log → PASS"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST D: expected blocking=0 high_scope_commits=0, got: $OUT"
  FAIL=$((FAIL+1))
fi

echo ""
echo "[spawn-trigger-block-test] PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
