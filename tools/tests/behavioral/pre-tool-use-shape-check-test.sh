#!/usr/bin/env bash
# pre-tool-use-shape-check-test.sh
# Behavioral test for shape-check-gate.mjs
# PROTO-S066-WAVE-1 STEP 1 behavioral test (Expert C INPUT-A/B/C pattern)
#
# INPUT A: violating (>200 chars, no SHAPE block) → exit=0 + warning on stderr (ADVISORY)
# INPUT B: passing (SHAPE block present) → exit=0 + NO warning
# INPUT C: exempt (write <200 chars) → exit=0 + NO warning
# INPUT D: exempt (SHAPE-TIER: conversational declared) → exit=0 + NO warning

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

GATE="tools/scripts/shape-check-gate.mjs"
PASS=0; FAIL=0; ERRORS=()

run_test() {
  local name="$1" input="$2" expected_exit="$3" expect_warning="$4"

  local actual_exit=0
  local stderr_out
  stderr_out=$(echo "$input" | node "$GATE" 2>&1 >/dev/null) || actual_exit=$?

  local exit_ok=false
  local warning_ok=false

  [ "$actual_exit" = "$expected_exit" ] && exit_ok=true

  if [ "$expect_warning" = "true" ]; then
    echo "$stderr_out" | grep -q "ADVISORY" && warning_ok=true || warning_ok=false
  else
    echo "$stderr_out" | grep -q "ADVISORY" && warning_ok=false || warning_ok=true
  fi

  if $exit_ok && $warning_ok; then
    echo "  ✓ $name (exit=$actual_exit warning_expected=$expect_warning)"
    PASS=$((PASS+1))
  else
    echo "  ✗ $name — exit_ok=$exit_ok warning_ok=$warning_ok (got exit=$actual_exit)"
    echo "    stderr: $stderr_out"
    FAIL=$((FAIL+1)); ERRORS+=("$name")
  fi
}

echo "[pre-tool-use-shape-check-test] Running..."

# Generate 250-char content (above 200-char threshold) for tests
LONG_CONTENT=$(printf '%.0s' {1..25})
LONG_STR="This is a substantive Opus response that is definitively longer than 200 characters so it should be checked for the mandatory SHAPE block requirement per PROTO-S066-WAVE-1. It discusses architectural decisions governance patterns and structural enforcement discipline in depth across multiple dimensions."

# INPUT A: violating — Write to opus-turn.md, >200 chars, NO SHAPE block → exit=0 + warning
run_test "INPUT A: no SHAPE block → ADVISORY (exit=0 + warning)" \
  "{\"tool_name\":\"Write\",\"tool_input\":{\"file_path\":\"tools/council/opus-turn.md\",\"content\":\"$LONG_STR\"}}" \
  0 true

# INPUT B: passing — Write to opus-turn.md, >200 chars, SHAPE block present → exit=0, no warning
run_test "INPUT B: SHAPE block present → exit=0, no warning" \
  "{\"tool_name\":\"Write\",\"tool_input\":{\"file_path\":\"tools/council/opus-turn.md\",\"content\":\"SHAPE: architectural | SHAPE-TIER: substantive | WHY: cross-spine impact\\n$LONG_STR\"}}" \
  0 false

# INPUT C: exempt — Write to opus-turn.md, <200 chars → exit=0, no warning
run_test "INPUT C: short content (<200 chars) → exempt, no warning" \
  '{"tool_name":"Write","tool_input":{"file_path":"tools/council/opus-turn.md","content":"Short response."}}' \
  0 false

# INPUT D: exempt — SHAPE-TIER: conversational declared → exit=0, no warning
run_test "INPUT D: SHAPE-TIER: conversational declared → exempt, no warning" \
  "{\"tool_name\":\"Write\",\"tool_input\":{\"file_path\":\"tools/council/opus-turn.md\",\"content\":\"SHAPE-TIER: conversational\\n$LONG_STR\"}}" \
  0 false

# INPUT E: different file → exit=0, no warning (not opus-turn.md)
run_test "INPUT E: different target file → pass through, no warning" \
  "{\"tool_name\":\"Write\",\"tool_input\":{\"file_path\":\"tools/council/sonnet-turn.md\",\"content\":\"$LONG_STR\"}}" \
  0 false

echo ""
echo "[pre-tool-use-shape-check-test] PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -gt 0 ] && echo "FAILURES: ${ERRORS[*]}" && exit 1
echo "[pre-tool-use-shape-check-test] ALL PASS ✅"
