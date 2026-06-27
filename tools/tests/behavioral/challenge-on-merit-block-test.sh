#!/usr/bin/env bash
# challenge-on-merit-block-test.sh — Behavioral block-test for validate-challenge-on-merit.mjs
#
# S089 hardwire batch item B block-test (Opus counter-sign requirement)
#
# BEHAVIORAL TESTS:
#   TEST A: plant council file with bare "you're right" (no merit reasoning) → exits 1 (BLOCKS)
#   TEST B: plant council file with "you're right because [merit reasoning]" → exits 0 (PASS)
#   TEST C: restore state (no temp file) → exits 0 (clean)
#
# Usage: bash tools/tests/behavioral/challenge-on-merit-block-test.sh
# Exit 0 = all tests pass; Exit 1 = one or more tests failed.
# BLOCK-TEST-CONVENTION.md RULE 2: relative paths, no MSYS absolute in node -e.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
VALIDATOR="$REPO_ROOT/tools/validators/validate-challenge-on-merit.mjs"
COUNCIL_DIR="$REPO_ROOT/tools/council"
TEMP_FILE="$COUNCIL_DIR/block-test-merit-TEMP.md"

PASS_COUNT=0
FAIL_COUNT=0

pass() { PASS_COUNT=$((PASS_COUNT+1)); echo "  [PASS] $1"; }
fail() { FAIL_COUNT=$((FAIL_COUNT+1)); echo "  [FAIL] $1"; }

echo ""
echo "[challenge-on-merit-block-test] S089 item B behavioral proof"
echo ""

# ── TEST A: bare filler phrase with no merit reasoning → exits 1 (BLOCKING) ────────────
cat > "$TEMP_FILE" << 'PLANT_A'
# SROF-BLOCK-TEST-TEMP | Sonnet → Opus

You're right, we should proceed with that approach.

Also, great point about the validation layer.

## Summary
Decision made.
PLANT_A

cd "$REPO_ROOT"
ACTUAL_A=0
node "$VALIDATOR" > /dev/null 2>&1 || ACTUAL_A=$?

if [ "$ACTUAL_A" -eq 1 ]; then
  pass "TEST A: 'you're right' with no merit-reasoning → exits 1 BLOCKING"
else
  fail "TEST A: expected exit 1 (undefended filler), got $ACTUAL_A"
fi

rm -f "$TEMP_FILE"

# ── TEST B: filler WITH adjacent merit reasoning → exits 0 (PASS) ────────────────────
cat > "$TEMP_FILE" << 'PLANT_B'
# SROF-BLOCK-TEST-TEMP | Sonnet → Opus

You're right that the floater threshold should be 3 because the evidence shows
that 1-2 session gaps are common in normal operations, and only at gap=3+ does
the pattern indicate systematic neglect rather than planned deferral.
PLANT_B

ACTUAL_B=0
node "$VALIDATOR" > /dev/null 2>&1 || ACTUAL_B=$?

if [ "$ACTUAL_B" -eq 0 ]; then
  pass "TEST B: 'you're right because [merit reasoning]' → exits 0 PASS"
else
  fail "TEST B: expected exit 0 (defended filler), got $ACTUAL_B"
fi

rm -f "$TEMP_FILE"

# ── TEST C: no temp file → exits 0 (clean state) ───────────────────────────────────────
ACTUAL_C=0
node "$VALIDATOR" > /dev/null 2>&1 || ACTUAL_C=$?

if [ "$ACTUAL_C" -eq 0 ]; then
  pass "TEST C: no temp file present → exits 0 clean"
else
  fail "TEST C: expected exit 0 (clean), got $ACTUAL_C"
fi

# ── Result ──────────────────────────────────────────────────────────────────────────────
echo ""
echo "[challenge-on-merit-block-test] PASS=$PASS_COUNT FAIL=$FAIL_COUNT"

if [ "$FAIL_COUNT" -eq 0 ]; then
  echo "[challenge-on-merit-block-test] ✓ 3/3 PASS — challenge-on-merit BLOCK gate proven"
  exit 0
else
  echo "[challenge-on-merit-block-test] ✗ $FAIL_COUNT test(s) FAILED"
  exit 1
fi
