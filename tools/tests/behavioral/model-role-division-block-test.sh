#!/usr/bin/env bash
# Behavioral test: validate-model-role-division.mjs
# Tests: A=active_model=opus+volume-no-delegation→BLOCKING · B=same+delegation recorded→PASS ·
#        C=active_model unknown+volume-no-delegation→ADVISORY(not blocking) ·
#        D=no volume (<=threshold commits)+empty log→PASS (clean baseline)
# S089 — B_MODEL_ROLE_DIVISION (Opus directs/core-seeds; Sonnet/Haiku build; token-economy spine)
#
# Runs entirely inside an isolated tmp git repo (BLOCK-TEST-CONVENTION.md RULE 2 — cd-first +
# relative paths only). The real repo's tools/data/opus-dispatch-log.yaml and
# tools/session-state.json are NEVER touched by this script.
set -uo pipefail
PASS=0; FAIL=0

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
V="$ROOT/tools/validators/validate-model-role-division.mjs"
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
}

# Commits 6 non-trivial implementation-shaped files across separate commits so each single
# commit exceeds the validator's own <=3-files trivial-scope proxy (4 files/commit here).
commit_volume_impl() {
  for i in 1 2 3 4 5 6; do
    mkdir -p "tools/validators"
    printf 'x' > "tools/validators/fake-impl-$i-a.mjs"
    printf 'x' > "tools/validators/fake-impl-$i-b.mjs"
    printf 'x' > "tools/validators/fake-impl-$i-c.mjs"
    printf 'x' > "tools/validators/fake-impl-$i-d.mjs"
    git add "tools/validators/fake-impl-$i-a.mjs" "tools/validators/fake-impl-$i-b.mjs" \
            "tools/validators/fake-impl-$i-c.mjs" "tools/validators/fake-impl-$i-d.mjs"
    git commit -q -m "[TESTSESS] fake implementation commit $i"
  done
}

# ── TEST A: active_model=opus, volume implementation, zero delegations → BLOCKING ──
setup_repo
echo '{"current_session":"TESTSESS","active_model":"opus"}' > tools/session-state.json
git add tools/session-state.json
git commit -q -m "[TESTSESS] initial commit"
commit_volume_impl
cat > tools/data/opus-dispatch-log.yaml << 'YML'
dispatches: []
YML
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=1" && echo "$OUT" | grep -q "active_model=opus"; then
  echo "  ✓ TEST A: active_model=opus + volume-no-delegation → BLOCKING"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST A: expected blocking=1 active_model=opus, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── TEST B: same state, but a delegation is recorded this session → PASS ──
cat > tools/data/opus-dispatch-log.yaml << 'YML'
dispatches:
  - session: TESTSESS
    dispatch_id: test-delegation-1
    scope_tier: corespine
    task: "test delegation recorded"
    verdict_recorded: true
    opus_verdict_ref: "test-ref"
YML
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=0" && echo "$OUT" | grep -q "delegations_this_session=1"; then
  echo "  ✓ TEST B: delegation recorded → PASS"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST B: expected blocking=0 delegations_this_session=1, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── TEST C: active_model unknown (field absent), same volume-no-delegation → ADVISORY only ──
setup_repo
echo '{"current_session":"TESTSESS"}' > tools/session-state.json
git add tools/session-state.json
git commit -q -m "[TESTSESS] initial commit"
commit_volume_impl
cat > tools/data/opus-dispatch-log.yaml << 'YML'
dispatches: []
YML
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=0" && echo "$OUT" | grep -q "advisory=1" && echo "$OUT" | grep -q "active_model=unknown"; then
  echo "  ✓ TEST C: active_model=unknown + volume-no-delegation → ADVISORY, not BLOCKING"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST C: expected blocking=0 advisory=1 active_model=unknown, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── TEST D: no volume (0 non-trivial commits) + empty log → clean baseline PASS ──
setup_repo
echo '{"current_session":"TESTSESS","active_model":"opus"}' > tools/session-state.json
git add tools/session-state.json
git commit -q -m "[TESTSESS] initial commit"
cat > tools/data/opus-dispatch-log.yaml << 'YML'
dispatches: []
YML
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=0" && echo "$OUT" | grep -q "impl_commits=0"; then
  echo "  ✓ TEST D: no volume commits + empty log → PASS"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST D: expected blocking=0 impl_commits=0, got: $OUT"
  FAIL=$((FAIL+1))
fi

echo ""
echo "[model-role-division-block-test] PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
