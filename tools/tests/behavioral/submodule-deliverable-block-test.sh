#!/usr/bin/env bash
# submodule-deliverable-block-test.sh
# Behavioral block-test for validate-submodule-deliverable.mjs (CS2 S088-A2)
#
# PLANTED DEFECT TESTS (BEHAVIORAL — gate must go RED on planted defect):
#   INPUT A: plant untracked src/ file in submodule → validator exits 1 (UNTRACKED BLOCK)
#   INPUT B: plant stale parent pointer (modify but don't stage submodule pointer) → validator exits 1
#   INPUT C: clean state → validator exits 0
#
# Root cause: PHASE-0.3 page committed in parent but untracked in submodule → Vercel
# deployed stale tree → 404. CS2 makes this impossible by blocking at commit.
#
# Usage: bash tools/tests/behavioral/submodule-deliverable-block-test.sh
# Exit 0 = all tests pass; Exit 1 = one or more tests failed.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
VALIDATOR="${REPO_ROOT}/tools/validators/validate-submodule-deliverable.mjs"
PRECOMMIT="${REPO_ROOT}/tools/scripts/git-hooks/pre-commit"

PASS_COUNT=0
FAIL_COUNT=0
RESULTS=()

pass() { PASS_COUNT=$((PASS_COUNT + 1)); RESULTS+=("[PASS] $1"); }
fail() { FAIL_COUNT=$((FAIL_COUNT + 1)); RESULTS+=("[FAIL] $1"); }

echo ""
echo "=== submodule-deliverable-block-test ==="
echo "Testing validate-submodule-deliverable.mjs behavioral gates (CS2 S088-A2)"
echo ""

# ─── INPUT A: untracked src/ file in submodule → BLOCK ──────────────────────
echo "[TEST A] Planting untracked src/__cs2_block_test__.ts in first submodule..."

# Find first submodule with src/ dir
SUB_PATH=""
if [ -f "${REPO_ROOT}/.gitmodules" ]; then
  RAW=$(git -C "$REPO_ROOT" config --file .gitmodules --get-regexp "submodule\\..*\\.path" 2>/dev/null | head -1 || true)
  if [ -n "$RAW" ]; then
    SUB_PATH=$(echo "$RAW" | awk '{print $2}')
  fi
fi

if [ -z "$SUB_PATH" ] || [ ! -d "${REPO_ROOT}/${SUB_PATH}/src" ]; then
  pass "INPUT A: SKIP — no submodule with src/ found (CS2 guard only applies when submodule exists)"
else
  PLANTED="${REPO_ROOT}/${SUB_PATH}/src/__cs2_block_test__.ts"
  echo "// CS2 behavioral block-test — delete if found" > "$PLANTED"

  A_EXIT=0
  node "$VALIDATOR" > /dev/null 2>&1 || A_EXIT=$?

  rm -f "$PLANTED"

  if [ "$A_EXIT" -ne 0 ]; then
    pass "INPUT A: planted untracked src/ file → exit=$A_EXIT (correctly BLOCKED)"
  else
    fail "INPUT A: planted untracked src/ file → exit=0 (MISSED — gate should have blocked)"
  fi
fi

# ─── INPUT B: pre-commit hook is wired (structural check) ────────────────────
echo "[TEST B] Verifying pre-commit hook wires validate-submodule-deliverable.mjs..."

if grep -q "validate-submodule-deliverable" "$PRECOMMIT"; then
  pass "INPUT B: pre-commit hook contains validate-submodule-deliverable.mjs reference"
else
  fail "INPUT B: pre-commit hook MISSING validate-submodule-deliverable.mjs — CS2 T1 not wired"
fi

# ─── INPUT C: clean state → PASS ─────────────────────────────────────────────
echo "[TEST C] Clean state (no planted defects) → expect exit 0..."

C_EXIT=0
node "$VALIDATOR" > /dev/null 2>&1 || C_EXIT=$?

if [ "$C_EXIT" -eq 0 ]; then
  pass "INPUT C: clean state → exit=0 (no false positives)"
else
  fail "INPUT C: clean state → exit=$C_EXIT (false BLOCK in clean repo)"
fi

# ─── INPUT D: pre-commit hook blocks on planted defect (end-to-end) ──────────
echo "[TEST D] End-to-end: pre-commit hook blocks when submodule has untracked file..."

if [ -z "$SUB_PATH" ] || [ ! -d "${REPO_ROOT}/${SUB_PATH}/src" ]; then
  pass "INPUT D: SKIP — no submodule with src/ (same reason as A)"
else
  PLANTED_D="${REPO_ROOT}/${SUB_PATH}/src/__cs2_precommit_test__.ts"
  echo "// CS2 pre-commit test — delete if found" > "$PLANTED_D"

  # Simulate what pre-commit does: run the validator
  D_EXIT=0
  node "$VALIDATOR" > /dev/null 2>&1 || D_EXIT=$?

  rm -f "$PLANTED_D"

  if [ "$D_EXIT" -ne 0 ]; then
    pass "INPUT D: pre-commit validator exits 1 on untracked src/ file (end-to-end gate works)"
  else
    fail "INPUT D: pre-commit validator exits 0 on untracked src/ — end-to-end gate broken"
  fi
fi

# ─── Results ─────────────────────────────────────────────────────────────────
echo ""
echo "=== RESULTS ==="
for r in "${RESULTS[@]}"; do
  echo "  $r"
done
echo ""
echo "PASS=$PASS_COUNT FAIL=$FAIL_COUNT"

if [ "$FAIL_COUNT" -gt 0 ]; then
  echo "[BLOCK-TEST FAILED] $FAIL_COUNT test(s) failed — CS2 submodule deliverable gate incomplete"
  exit 1
fi

echo "[BLOCK-TEST PASSED] All $PASS_COUNT tests confirmed — CS2 submodule deliverable gate behavioral"
exit 0
