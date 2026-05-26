#!/usr/bin/env bash
# done-claim-validator-gate-test.sh
#
# Behavioral test for claim-validator-gate.mjs
# Per B_STRUCTURAL_PREVENTION_DISCIPLINE: structural fix must have behavioral test.
# Per gap_DONE_CLAIM_BEFORE_VALIDATOR_CONFIRMS K=4 S062 proposed_fix spec.
#
# Tests:
#   INPUT A: claim keyword + stale verify → BLOCK (exit 2)
#   INPUT B: claim keyword + fresh verify → ALLOW (exit 0)
#   INPUT C: no claim keyword + stale verify → ALLOW (exit 0)
#   INPUT D: not Bash tool → ALLOW (exit 0)
#   INPUT E: non-commit Bash command → ALLOW (exit 0)
#
# Usage: bash tools/tests/behavioral/done-claim-validator-gate-test.sh
# Exit: 0 = all pass | 1 = failures found

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

GATE="tools/scripts/claim-validator-gate.mjs"
VERIFY_FILE="tools/verify-last-run.md"
PASS=0
FAIL=0
ERRORS=()

# Helper: run a test case
run_test() {
  local name="$1"
  local input="$2"
  local expected_exit="$3"

  local actual_exit=0
  echo "$input" | node "$GATE" > /dev/null 2>&1 || actual_exit=$?

  if [ "$actual_exit" = "$expected_exit" ]; then
    echo "  ✓ $name (exit=$actual_exit)"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $name — expected exit $expected_exit, got $actual_exit"
    FAIL=$((FAIL + 1))
    ERRORS+=("$name")
  fi
}

echo "[done-claim-validator-gate-test] Running behavioral tests..."
echo ""

# Get HEAD commit timestamp
HEAD_TIME=$(git log -1 --format=%ct 2>/dev/null || echo "0")
STALE_TIME=$((HEAD_TIME - 3600))   # 1 hour before HEAD = stale
FRESH_TIME=$((HEAD_TIME + 60))     # 1 minute after HEAD = fresh

# ── INPUT A: claim keyword + stale verify → BLOCK (exit 2) ──────────────────
echo "  Setting stale verify timestamp..."
node -e "const fs=require('fs');const d=new Date(${STALE_TIME}*1000);try{fs.utimesSync('${VERIFY_FILE}',d,d);}catch(e){}" 2>/dev/null || true

run_test "INPUT A: DONE claim + stale verify → BLOCK" \
  '{"tool_name":"Bash","tool_input":{"command":"git commit -m \"feat: STEP 3 DONE — all validators passing\""}}' \
  2

run_test "INPUT A2: SEALED claim + stale verify → BLOCK" \
  '{"tool_name":"Bash","tool_input":{"command":"git commit -m \"ops: PROTO-S063-A SEALED — 3 steps complete\""}}' \
  2

run_test "INPUT A3: COMPLETE claim + stale verify → BLOCK" \
  '{"tool_name":"Bash","tool_input":{"command":"git commit -m \"ops: S063 COMPLETE — all mandates closed\""}}' \
  2

# ── INPUT B: claim keyword + fresh verify → ALLOW (exit 0) ──────────────────
echo "  Setting fresh verify timestamp..."
node -e "const fs=require('fs');const d=new Date(${FRESH_TIME}*1000);try{fs.utimesSync('${VERIFY_FILE}',d,d);}catch(e){}" 2>/dev/null || true

run_test "INPUT B: DONE claim + fresh verify → ALLOW" \
  '{"tool_name":"Bash","tool_input":{"command":"git commit -m \"feat: STEP 3 DONE — all validators passing\""}}' \
  0

run_test "INPUT B2: RATIFIED claim + fresh verify → ALLOW" \
  '{"tool_name":"Bash","tool_input":{"command":"git commit -m \"ops: PROTO RATIFIED by Opus\""}}' \
  0

# ── INPUT C: no claim keyword + stale verify → ALLOW (exit 0) ───────────────
echo "  Setting stale verify timestamp..."
node -e "const fs=require('fs');const d=new Date(${STALE_TIME}*1000);try{fs.utimesSync('${VERIFY_FILE}',d,d);}catch(e){}" 2>/dev/null || true

run_test "INPUT C: no keyword (ops: update) → ALLOW" \
  '{"tool_name":"Bash","tool_input":{"command":"git commit -m \"ops: update session state\""}}' \
  0

run_test "INPUT C2: no keyword (fix: frontmatter) → ALLOW" \
  '{"tool_name":"Bash","tool_input":{"command":"git commit -m \"fix: frontmatter lifecycle_state\""}}' \
  0

run_test "INPUT C3: no keyword (feat: add validator) → ALLOW" \
  '{"tool_name":"Bash","tool_input":{"command":"git commit -m \"feat: add validate-five-surface.mjs\""}}' \
  0

# ── INPUT D: non-Bash tool → ALLOW (exit 0) ──────────────────────────────────
run_test "INPUT D: Edit tool (not Bash) → ALLOW" \
  '{"tool_name":"Edit","tool_input":{"file_path":"tools/verify.mjs","old_string":"x","new_string":"y"}}' \
  0

# ── INPUT E: Bash command without git commit → ALLOW (exit 0) ────────────────
run_test "INPUT E: Bash ls command → ALLOW" \
  '{"tool_name":"Bash","tool_input":{"command":"ls -la && echo done"}}' \
  0

run_test "INPUT E2: Bash git push (no commit) → ALLOW" \
  '{"tool_name":"Bash","tool_input":{"command":"git push origin main"}}' \
  0

# Restore real verify-last-run.md by running verify
node tools/verify.mjs --skip-install > /dev/null 2>&1 || true

echo ""
echo "────────────────────────────────────────"
echo "[done-claim-validator-gate-test] Results: PASS=$PASS FAIL=$FAIL"

if [ "$FAIL" -gt 0 ]; then
  echo "FAILURES: ${ERRORS[*]}"
  exit 1
fi

echo "[done-claim-validator-gate-test] ALL PASS ✅"
exit 0
