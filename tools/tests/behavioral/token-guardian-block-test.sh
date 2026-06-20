#!/usr/bin/env bash
# Block-test for pre-tool-use-token-guardian.sh (B_TOKEN_BUDGET R9 T1)
# Proves: T1 refuses an unjustified eager add to an always-on surface.
#
# TEST A: NEW hook file with load_mode: eager + NO justification → expect EXIT 2 (BLOCKED)
# TEST B: NEW hook file with load_mode: on-demand → expect EXIT 0 (ALLOWED)
# TEST C: NEW hook file with load_mode: eager + justification → expect EXIT 0 (ALLOWED)
# TEST D: NEW hook file with NO load_mode → expect EXIT 2 (BLOCKED)
# TEST E: Non-hook file → expect EXIT 0 (not an always-on surface)

set -euo pipefail

HOOK_SCRIPT="$(git -C "$(dirname "$0")" rev-parse --show-toplevel 2>/dev/null || echo ".")/.claude/hooks/pre-tool-use-token-guardian.sh"

if [[ ! -f "$HOOK_SCRIPT" ]]; then
  echo "[token-guardian-block-test] ERROR: hook script not found at $HOOK_SCRIPT"
  exit 1
fi

PASS=0
FAIL=0

run_test() {
  local test_name="$1"
  local tool_name="$2"
  local tool_input="$3"
  local expected_exit="$4"

  local actual_exit=0
  CLAUDE_TOOL_NAME="$tool_name" CLAUDE_TOOL_INPUT="$tool_input" bash "$HOOK_SCRIPT" 2>/dev/null || actual_exit=$?

  if [[ "$actual_exit" -eq "$expected_exit" ]]; then
    echo "  ✓ $test_name (exit=$actual_exit, expected=$expected_exit)"
    PASS=$((PASS+1))
  else
    echo "  ✗ $test_name (exit=$actual_exit, expected=$expected_exit) ← FAIL"
    FAIL=$((FAIL+1))
  fi
}

HOOKS_DIR="$(git -C "$(dirname "$0")" rev-parse --show-toplevel 2>/dev/null || echo ".")/.claude/hooks"

echo "[token-guardian-block-test] Running 5 behavioral tests..."

# TEST A: eager without justification → BLOCK (exit 2)
run_test "A: eager-no-justification → BLOCKED" "Write" \
  "{\"file_path\": \"$HOOKS_DIR/test-new-eager-no-justification.sh\", \"content\": \"#!/bin/bash\\n# load_mode: eager\\necho hello\"}" \
  2

# TEST B: on-demand → ALLOW (exit 0)
run_test "B: on-demand → ALLOWED" "Write" \
  "{\"file_path\": \"$HOOKS_DIR/test-new-on-demand.sh\", \"content\": \"#!/bin/bash\\n# load_mode: on-demand\\necho hello\"}" \
  0

# TEST C: eager with justification → ALLOW (exit 0)
run_test "C: eager+justification → ALLOWED" "Write" \
  "{\"file_path\": \"$HOOKS_DIR/test-new-eager-with-justification.sh\", \"content\": \"#!/bin/bash\\n# load_mode: eager\\n# justification: must fire on every turn to catch X\\necho hello\"}" \
  0

# TEST D: no load_mode at all → BLOCK (exit 2)
run_test "D: no-load_mode → BLOCKED" "Write" \
  "{\"file_path\": \"$HOOKS_DIR/test-new-no-declaration.sh\", \"content\": \"#!/bin/bash\\necho hello\"}" \
  2

# TEST E: non-hook file → ALLOW (exit 0, not an always-on surface)
run_test "E: non-hook file → ALLOWED (not always-on surface)" "Write" \
  "{\"file_path\": \"/some/path/not-a-hook.ts\", \"content\": \"// some typescript file\"}" \
  0

echo ""
echo "[token-guardian-block-test] PASS=$PASS FAIL=$FAIL total=5"

if [[ "$FAIL" -gt 0 ]]; then
  exit 1
fi
exit 0
