#!/usr/bin/env bash
# field-wiring-block-test.sh — Planted-violation FAIL→PASS proof for validate-field-wiring.mjs
#
# Borrowed + reproduced from CSP S346 "floater rule" (field level). Proves the DEAD-FIELD gate
# is mechanical (the package's ADOPT bar + CSPS meta-standard: a principle isn't done until a
# hardwired gate produces a measurable result).
#
# BEHAVIORAL TESTS (all via FIELD_WIRING_TARGETS env override — never touches real repo data):
#   TEST A (FAIL): fixture field missing `influence:` → validator exits 1 (DEAD FIELD BLOCKS)
#   TEST B (PASS): same field, influence added → validator exits 0 (wired)
#   TEST C (PASS): empty targets file → exits 0 (gate armed, no targets)
#
# Usage: bash tools/tests/behavioral/field-wiring-block-test.sh
# Exit 0 = all pass. BLOCK-TEST-CONVENTION.md RULE 2: relative paths.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
VALIDATOR="$REPO_ROOT/tools/validators/validate-field-wiring.mjs"

PASS_COUNT=0
FAIL_COUNT=0
pass() { PASS_COUNT=$((PASS_COUNT+1)); echo "  [PASS] $1"; }
fail() { FAIL_COUNT=$((FAIL_COUNT+1)); echo "  [FAIL] $1"; }

echo ""
echo "[field-wiring-block-test] DEAD-FIELD gate planted-violation proof"
echo ""

cd "$REPO_ROOT"
# RULE 2: repo-relative paths only — node-on-Windows cannot resolve MSYS /tmp paths.
TMP_REL="tools/tests/behavioral/.tmp-fw"
FIXTURE_REL="$TMP_REL/goal-record-fixture.yaml"
TARGETS_REL="$TMP_REL/targets.txt"
mkdir -p "$REPO_ROOT/$TMP_REL"
trap 'rm -rf "$REPO_ROOT/$TMP_REL"' EXIT
FIXTURE="$REPO_ROOT/$FIXTURE_REL"
TARGETS="$TARGETS_REL"          # passed to FIELD_WIRING_TARGETS; cwd=REPO_ROOT resolves it
echo "$FIXTURE_REL" > "$REPO_ROOT/$TARGETS_REL"

# ── TEST A: DEAD FIELD (missing influence) → must BLOCK (exit 1) ────────────────────────────
cat > "$FIXTURE" << 'FIX_A'
field_wiring:
  goal_id:
    save: "POST /api/goal -> goal-record.json"
    read: "GoalStep.tsx loads goal_id from localStorage"
    influence: "tags every pipeline part (backpack slot)"
  resolution_signal:
    save: "POST /api/goal -> goal-record.json"
    read: "ClosureStep.tsx reads resolution_signal"
    # influence MISSING — saved + read but changes nothing = DEAD FIELD
FIX_A

ACTUAL_A=0
FIELD_WIRING_TARGETS="$TARGETS" node "$VALIDATOR" > /dev/null 2>&1 || ACTUAL_A=$?
if [ "$ACTUAL_A" -eq 1 ]; then
  pass "TEST A: resolution_signal missing influence → exits 1 (DEAD FIELD BLOCKS)"
else
  fail "TEST A: expected exit 1, got $ACTUAL_A — gate failed to block a dead field"
fi

# ── TEST B: wire the influence → must PASS (exit 0) ──────────────────────────────────────────
cat > "$FIXTURE" << 'FIX_B'
field_wiring:
  goal_id:
    save: "POST /api/goal -> goal-record.json"
    read: "GoalStep.tsx loads goal_id from localStorage"
    influence: "tags every pipeline part (backpack slot)"
  resolution_signal:
    save: "POST /api/goal -> goal-record.json"
    read: "ClosureStep.tsx reads resolution_signal"
    influence: "gates Stage-9 closure; rendered in the closure check"
FIX_B

ACTUAL_B=0
FIELD_WIRING_TARGETS="$TARGETS" node "$VALIDATOR" > /dev/null 2>&1 || ACTUAL_B=$?
if [ "$ACTUAL_B" -eq 0 ]; then
  pass "TEST B: influence added → exits 0 (field wired save+read+influence)"
else
  fail "TEST B: expected exit 0, got $ACTUAL_B — gate blocked a fully-wired field"
fi

# ── TEST C: empty targets → armed but clean (exit 0) ─────────────────────────────────────────
EMPTY_REL="$TMP_REL/empty.txt"
printf '# no targets\n' > "$REPO_ROOT/$EMPTY_REL"
ACTUAL_C=0
FIELD_WIRING_TARGETS="$EMPTY_REL" node "$VALIDATOR" > /dev/null 2>&1 || ACTUAL_C=$?
if [ "$ACTUAL_C" -eq 0 ]; then
  pass "TEST C: empty targets → exits 0 (gate armed, no false block)"
else
  fail "TEST C: expected exit 0, got $ACTUAL_C — gate blocked with no targets"
fi

echo ""
echo "[field-wiring-block-test] PASS=$PASS_COUNT FAIL=$FAIL_COUNT"
if [ "$FAIL_COUNT" -eq 0 ]; then
  echo "[field-wiring-block-test] ✓ 3/3 PASS — DEAD-FIELD gate proven FAIL→PASS"
  exit 0
else
  echo "[field-wiring-block-test] ✗ $FAIL_COUNT test(s) FAILED"
  exit 1
fi
