#!/usr/bin/env bash
# boundary-prompt-format-test.sh
#
# Behavioral test for validate-boundary-prompt-format.mjs
# Per B_STRUCTURAL_PREVENTION_DISCIPLINE: structural fix must have behavioral test.
# Rationale: FREESTYLE-BOUNDARY-PROMPT-WITHOUT-FORMAL-HEADERS prevention class.
#
# Tests (per Opus directive):
#   INPUT A: boundary prompt with all 4 headers + CROSS-REVIEW ATTESTATION → file NOT flagged
#   INPUT B: boundary prompt missing "I AM:" header → file flagged in advisory output
#   INPUT C: file with only frontmatter (no boundary headers) → file flagged as pre-discipline
#   EXIT:    validator always exits 0 (advisory only in S072)
#
# Test strategy: create test files in VAULT using node (safe on Windows — avoids heredoc encoding
# issues with Unicode separator chars). Run validator. Check per-file presence/absence in output.
# Global advisory count is NOT checked — the corpus always has pre-discipline advisories.
#
# Usage: bash tools/tests/behavioral/boundary-prompt-format-test.sh
# Exit: 0 = all pass | 1 = failures found

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

VALIDATOR="tools/validators/validate-boundary-prompt-format.mjs"
VAULT_DIR="docs/plan/_handoff/VAULT"
PASS=0
FAIL=0
ERRORS=()

# Create a test file via node (avoids Windows heredoc encoding issues with Unicode chars)
create_test_file() {
  local path="$1"
  local content="$2"
  node -e "require('fs').writeFileSync('${path}', ${content})"
}

echo "[boundary-prompt-format-test] Running behavioral tests..."
echo ""

# ── INPUT A: compliant boundary prompt — all 4 headers + attestation ──────────

TEST_FILE_A="${VAULT_DIR}/chat-jump-prompt-TEST-A-behavioral.md"

create_test_file "$TEST_FILE_A" "'I AM: OPUS-TEST, test director, STEST\nYOU ARE: Sonnet, test builder STEST\nTHIS IS: behavioral-test boundary prompt — INPUT A (compliant)\nDO NOW: This is the first action for test A\n\nCROSS-REVIEW ATTESTATION (per S071 Turn 26 discipline):\n  Reviewed by: boundary-prompt-format-test.sh\n  Catches folded: none — compliant test input\n'"

echo "Input A: fully compliant (4 headers + attestation) — should NOT appear in advisory output"
VALIDATOR_OUTPUT=$(node "$VALIDATOR" 2>&1)

if echo "$VALIDATOR_OUTPUT" | tr -d '\r' | grep -q "TEST-A-behavioral"; then
  echo "  ✗ INPUT A: test file appeared in advisory output (should be clean)"
  echo "    Matching line: $(echo "$VALIDATOR_OUTPUT" | tr -d '\r' | grep "TEST-A-behavioral" | head -1)"
  FAIL=$((FAIL + 1))
  ERRORS+=("INPUT A: clean file flagged")
else
  echo "  ✓ INPUT A: test file not flagged (compliant prompt correctly passes)"
  PASS=$((PASS + 1))
fi

# ── INPUT B: missing I AM: header ─────────────────────────────────────────────

TEST_FILE_B="${VAULT_DIR}/chat-jump-prompt-TEST-B-behavioral.md"

# 3 of 4 headers present; I AM: intentionally missing
create_test_file "$TEST_FILE_B" "'YOU ARE: Sonnet, test builder STEST\nTHIS IS: behavioral-test boundary prompt — INPUT B\nDO NOW: This is the first action for test B\n\nCROSS-REVIEW ATTESTATION (per S071 Turn 26 discipline):\n  Reviewed by: test framework\n  Note: sender identity header omitted from this test file\n'"

echo ""
echo "Input B: missing I AM: header — should appear in advisory output"
VALIDATOR_OUTPUT=$(node "$VALIDATOR" 2>&1)

if echo "$VALIDATOR_OUTPUT" | tr -d '\r' | grep -q "TEST-B-behavioral"; then
  echo "  ✓ INPUT B: test file flagged (advisory correctly fires for missing I AM: header)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT B: test file NOT flagged — advisory should have fired for missing I AM:"
  FAIL=$((FAIL + 1))
  ERRORS+=("INPUT B: missing-header file not flagged")
fi

# ── INPUT C: pre-discipline format (no headers at all) ─────────────────────────

TEST_FILE_C="${VAULT_DIR}/chat-jump-prompt-TEST-C-behavioral.md"

# No boundary prompt headers — pure prose (pre-discipline format)
create_test_file "$TEST_FILE_C" "'# Pre-Discipline Test Artifact\n\nThis file contains no boundary prompt headers.\nIt represents the pre-discipline format.\nThe validator should flag it as missing all 4 headers.\n'"

echo ""
echo "Input C: pre-discipline format (no headers) — should appear in advisory output"
VALIDATOR_OUTPUT=$(node "$VALIDATOR" 2>&1)

if echo "$VALIDATOR_OUTPUT" | tr -d '\r' | grep -q "TEST-C-behavioral"; then
  echo "  ✓ INPUT C: pre-discipline file flagged (advisory correctly fires)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT C: pre-discipline file NOT flagged — advisory should have fired"
  FAIL=$((FAIL + 1))
  ERRORS+=("INPUT C: pre-discipline file not flagged")
fi

# ── Exit code check: validator always exits 0 (advisory only in S072) ──────────

echo ""
echo "Exit code check: validator must always exit 0 (advisory-only in S072)"
VALIDATOR_EXIT=0
node "$VALIDATOR" > /dev/null 2>&1 || VALIDATOR_EXIT=$?

if [ "$VALIDATOR_EXIT" = "0" ]; then
  echo "  ✓ EXIT CODE: validator exits 0 (advisory-only confirmed)"
  PASS=$((PASS + 1))
else
  echo "  ✗ EXIT CODE: validator exited $VALIDATOR_EXIT (should be 0 in advisory mode)"
  FAIL=$((FAIL + 1))
  ERRORS+=("EXIT CODE: non-zero exit")
fi

# ── INPUT D: sonnet-turn.md sections with prose 'I AM:' → NOT flagged as prompts ─────
# Regression test for the line-start detection fix.
# sonnet-turn.md milestone reports describe "I AM:" in their text but are NOT boundary prompts.
# If detection regresses to text.includes(), these sections would be falsely flagged.
# This tests COUNCIL FILE section detection (sections with prose mentions ≠ boundary prompts).

echo ""
echo "Input D: sonnet-turn.md milestone sections with prose 'I AM:' — should NOT appear in advisory"
VALIDATOR_OUTPUT=$(node "$VALIDATOR" 2>&1)

# Check that sonnet-turn.md 'What was built' section is NOT flagged
# (it contains "I AM /" in its description text but is NOT a boundary prompt)
if echo "$VALIDATOR_OUTPUT" | tr -d '\r' | grep -q "sonnet-turn.md.*What was built"; then
  echo "  ✗ INPUT D: false positive — 'What was built' section flagged (prose 'I AM:' triggering detection)"
  FAIL=$((FAIL + 1))
  ERRORS+=("INPUT D: false positive on sonnet-turn.md prose mention")
else
  echo "  ✓ INPUT D: sonnet-turn.md 'What was built' not flagged (line-start detection holding)"
  PASS=$((PASS + 1))
fi

# ── Cleanup ───────────────────────────────────────────────────────────────────

rm -f "$TEST_FILE_A" "$TEST_FILE_B" "$TEST_FILE_C"

# ── Results ───────────────────────────────────────────────────────────────────

echo ""
echo "────────────────────────────────────────"
echo "[boundary-prompt-format-test] Results: PASS=$PASS FAIL=$FAIL"

if [ "$FAIL" -gt 0 ]; then
  echo "FAILURES: ${ERRORS[*]}"
  exit 1
fi

echo "[boundary-prompt-format-test] ALL PASS ✅"
exit 0
