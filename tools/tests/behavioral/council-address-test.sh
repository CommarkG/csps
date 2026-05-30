#!/usr/bin/env bash
# council-address-test.sh
#
# Behavioral test for pre-tool-use-council-address-required.sh (T1 BLOCKING hook)
# Per B_STRUCTURAL_PREVENTION_DISCIPLINE: structural fix must have behavioral test.
# PROTO-S072-COUNCIL-ADDRESS M-CA — 5/5 tests per DONE-WHEN spec.
#
# Tests:
#   A: opus-turn.md write with new turn entry but NO address → exit 2 (BLOCK)
#   B: opus-turn.md write with 4-line I AM:/YOU ARE: header → exit 0 (PASS)
#   C: sonnet-turn.md write with conversational "Opus, this is Sonnet." → exit 0 (PASS)
#   D: non-council file (tools/verify.mjs) → exit 0 (PASS — not checked)
#   E: small edit to opus-turn.md with no new-turn marker → exit 0 (PASS — no marker)
#
# Usage: bash tools/tests/behavioral/council-address-test.sh
# Exit: 0 = all pass | 1 = failures found

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

HOOK=".claude/hooks/pre-tool-use-council-address-required.sh"
PASS=0
FAIL=0
ERRORS=()

run_test() {
  local name="$1"
  local input="$2"
  local expected_exit="$3"

  local actual_exit=0
  echo "$input" | CLAUDE_TOOL_INPUT="$input" bash "$HOOK" > /dev/null 2>&1 || actual_exit=$?

  if [ "$actual_exit" = "$expected_exit" ]; then
    echo "  ✓ $name (exit=$actual_exit)"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $name — expected exit $expected_exit, got $actual_exit"
    FAIL=$((FAIL + 1))
    ERRORS+=("$name")
  fi
}

echo "[council-address-test] Running behavioral tests..."
echo ""

# Note: hook reads CLAUDE_TOOL_INPUT which is Claude Code's native format —
# just the tool parameters (no tool_name/tool_input wrapper), e.g.:
# Write: {"file_path":"...", "content":"..."}
# Edit:  {"file_path":"...", "new_string":"..."}
# This matches Claude Code's actual hook invocation format (CLAUDE_TOOL_INPUT env var).

# ── INPUT A: new turn entry in opus-turn.md WITHOUT address → BLOCK (exit 2) ─
run_test "INPUT A: opus-turn unaddressed new entry → BLOCK" \
  '{"file_path":"tools/council/opus-turn.md","content":"# OPUS-15 S072 DIRECTIVE\n\nHere is my new directive without any address header.\n"}' \
  2

# ── INPUT B: new turn entry in opus-turn.md WITH 4-line header → PASS (exit 0) ─
run_test "INPUT B: opus-turn 4-line I AM:/YOU ARE: header → PASS" \
  '{"file_path":"tools/council/opus-turn.md","content":"# OPUS-15 S072 DIRECTIVE\nI AM: OPUS-15, architectural director, S072\nYOU ARE: Sonnet, builder S072\nTHIS IS: test directive\nDO NOW: test action\n"}' \
  0

# ── INPUT C: sonnet-turn.md with conversational opener → PASS (exit 0) ─────
run_test "INPUT C: sonnet-turn conversational opener → PASS" \
  '{"file_path":"tools/council/sonnet-turn.md","new_string":"# FROM SONNET | S072\n\nOpus, this is Sonnet. M1 done at commit abc1234.\n"}' \
  0

# ── INPUT D: non-council file write → PASS (exit 0) ──────────────────────────
run_test "INPUT D: non-council file (verify.mjs) → PASS" \
  '{"file_path":"tools/verify.mjs","new_string":"// some code change without address"}' \
  0

# ── INPUT E: small edit to opus-turn.md without new-turn marker → PASS (exit 0) ─
run_test "INPUT E: small edit to opus-turn.md (no new-turn marker) → PASS" \
  '{"file_path":"tools/council/opus-turn.md","old_string":"old text","new_string":"fixed typo here"}' \
  0

echo ""
echo "────────────────────────────────────────"
echo "[council-address-test] Results: PASS=$PASS FAIL=$FAIL"

if [ "$FAIL" -gt 0 ]; then
  echo "FAILURES: ${ERRORS[*]}"
  exit 1
fi

echo "[council-address-test] ALL PASS ✅"
exit 0
