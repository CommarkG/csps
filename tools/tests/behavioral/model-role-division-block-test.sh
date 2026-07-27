#!/usr/bin/env bash
# Behavioral test: validate-model-role-division.mjs + post-stop-active-model-capture.sh
# Tests: A=active_model=opus+volume-no-delegation→BLOCKING · B=same+delegation recorded→PASS ·
#        C=active_model unknown+volume-no-delegation→ADVISORY(not blocking) ·
#        D=no volume (<=threshold commits)+empty log→PASS (clean baseline)
#        E=capture hook: transcript has "Opus here." → active_model written to session-state.json
#        F=capture hook: re-run same transcript → idempotent no-op (already set)
#        G=capture hook: transcript has "Sonnet here." → active_model=sonnet written
#        H=capture hook: no declaration in transcript → session-state.json untouched
# S089 — B_MODEL_ROLE_DIVISION (Opus directs/core-seeds; Sonnet/Haiku build; token-economy spine)
#
# Runs entirely inside an isolated tmp git repo (BLOCK-TEST-CONVENTION.md RULE 2 — cd-first +
# relative paths only). The real repo's tools/data/opus-dispatch-log.yaml and
# tools/session-state.json are NEVER touched by this script. TESTS E-H copy the real hook
# script into the tmp repo's own .claude/hooks/ so its dirname(BASH_SOURCE)-based REPO_ROOT
# resolution naturally lands inside the isolated repo (same convention as every sibling
# post-stop-*.sh hook — see BLOCK-TEST-CONVENTION.md RULE 2).
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

# ── TESTS E-H: post-stop-active-model-capture.sh (the field population mechanism) ──
HOOK_SRC="$ROOT/.claude/hooks/post-stop-active-model-capture.sh"

setup_hook_repo() {
  rm -rf "$TMP"/.git "$TMP"/tools "$TMP"/.claude
  mkdir -p "$TMP/tools" "$TMP/.claude/hooks"
  cp "$HOOK_SRC" "$TMP/.claude/hooks/post-stop-active-model-capture.sh"
  chmod +x "$TMP/.claude/hooks/post-stop-active-model-capture.sh"
}

write_transcript() {
  # $1 = declaration line to embed in an assistant message (or "" for none)
  local decl="$1"
  cat > "$TMP/fake-transcript.jsonl" << JSONL
{"type":"user","message":{"role":"user","content":"hello"}}
{"type":"assistant","message":{"role":"assistant","content":[{"type":"text","text":"${decl}Some other response text follows here."}]}}
JSONL
}

# ── TEST E: transcript has "Opus here." declaration → active_model written ──
setup_hook_repo
echo '{"current_session":"TESTSESS","session_role":"opus-advisor"}' > tools/session-state.json
write_transcript 'Opus here. Session TESTSESS. Direct-open tab.\n'
OUT=$(cd "$TMP" && CLAUDE_TRANSCRIPT_PATH="$TMP/fake-transcript.jsonl" bash .claude/hooks/post-stop-active-model-capture.sh 2>&1) || true
RESULT_MODEL=$(cd "$TMP" && node -e "console.log(JSON.parse(require('fs').readFileSync('tools/session-state.json','utf8')).active_model)" 2>/dev/null || echo "MISSING")
if [ "$RESULT_MODEL" = "opus" ] && echo "$OUT" | grep -q "active_model set to 'opus'"; then
  echo "  ✓ TEST E: transcript declares 'Opus here.' → active_model=opus written"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST E: expected active_model=opus, got model='$RESULT_MODEL' output: $OUT"
  FAIL=$((FAIL+1))
fi

# ── TEST F: re-run same transcript against already-updated state → idempotent no-op ──
OUT=$(cd "$TMP" && CLAUDE_TRANSCRIPT_PATH="$TMP/fake-transcript.jsonl" bash .claude/hooks/post-stop-active-model-capture.sh 2>&1) || true
if echo "$OUT" | grep -q "already 'opus' -- no change"; then
  echo "  ✓ TEST F: re-running same declaration → idempotent no-op"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST F: expected idempotent no-op message, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── TEST G: transcript has "Sonnet here." declaration → active_model=sonnet written ──
setup_hook_repo
echo '{"current_session":"TESTSESS","session_role":"sonnet-builder"}' > tools/session-state.json
write_transcript 'Sonnet here. Session TESTSESS. Direct-open tab.\n'
OUT=$(cd "$TMP" && CLAUDE_TRANSCRIPT_PATH="$TMP/fake-transcript.jsonl" bash .claude/hooks/post-stop-active-model-capture.sh 2>&1) || true
RESULT_MODEL=$(cd "$TMP" && node -e "console.log(JSON.parse(require('fs').readFileSync('tools/session-state.json','utf8')).active_model)" 2>/dev/null || echo "MISSING")
if [ "$RESULT_MODEL" = "sonnet" ]; then
  echo "  ✓ TEST G: transcript declares 'Sonnet here.' → active_model=sonnet written"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST G: expected active_model=sonnet, got model='$RESULT_MODEL' output: $OUT"
  FAIL=$((FAIL+1))
fi

# ── TEST H: no declaration anywhere in transcript → session-state.json untouched ──
setup_hook_repo
echo '{"current_session":"TESTSESS"}' > tools/session-state.json
write_transcript ''
OUT=$(cd "$TMP" && CLAUDE_TRANSCRIPT_PATH="$TMP/fake-transcript.jsonl" bash .claude/hooks/post-stop-active-model-capture.sh 2>&1) || true
HAS_FIELD=$(cd "$TMP" && node -e "console.log('active_model' in JSON.parse(require('fs').readFileSync('tools/session-state.json','utf8')))" 2>/dev/null || echo "ERROR")
if [ "$HAS_FIELD" = "false" ] && [ -z "$OUT" ]; then
  echo "  ✓ TEST H: no declaration in transcript → session-state.json untouched, silent no-op"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST H: expected untouched file + silent exit, got has_field=$HAS_FIELD output: $OUT"
  FAIL=$((FAIL+1))
fi

echo ""
echo "[model-role-division-block-test] PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
