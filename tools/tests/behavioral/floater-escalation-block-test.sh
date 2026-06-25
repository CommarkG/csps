#!/usr/bin/env bash
# floater-escalation-block-test.sh — Behavioral block-test for validate-floater-escalation.mjs
#
# S088 enterprise layer item 2 block-test (Opus counter-sign requirement)
#
# BEHAVIORAL TESTS:
#   TEST A: plant overdue floater with gap > 3 sessions (closure_by=S001, gap=87) → exits 1 (BLOCKS)
#   TEST B: plant overdue floater with gap ≤ 3 sessions (closure_by=S086, gap=2) → exits 0 (ADVISORY only)
#   TEST C: restore original register → exits 0 (green, no overdue)
#
# Usage: bash tools/tests/behavioral/floater-escalation-block-test.sh
# Exit 0 = all tests pass; Exit 1 = one or more tests failed.
# BLOCK-TEST-CONVENTION.md RULE 2: relative paths, no MSYS absolute in node -e.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
VALIDATOR="$REPO_ROOT/tools/validators/validate-floater-escalation.mjs"
REGISTER="$REPO_ROOT/tools/data/floating-artifacts-register.yaml"

PASS_COUNT=0
FAIL_COUNT=0

pass() { PASS_COUNT=$((PASS_COUNT+1)); echo "  [PASS] $1"; }
fail() { FAIL_COUNT=$((FAIL_COUNT+1)); echo "  [FAIL] $1"; }

echo ""
echo "[floater-escalation-block-test] S088 item 2 behavioral proof"
echo ""

# Backup register before any mutations
BACKUP="$(mktemp)"
cp "$REGISTER" "$BACKUP"

# ── TEST A: plant overdue floater with large gap (S001, gap=87 > threshold=3) ──────────────
# Expected: validator EXITS 1 (BLOCKING)
cat >> "$REGISTER" << 'PLANT_A'

  - id: block-test-overdue-gap-large-TEMP
    artifact_path: docs/SIA/BLOCK-TEST-TEMP.md
    status: draft
    created_session: S001
    closure_owner: group:finky
    closure_decision: "block-test plant — will be removed after test"
    closure_by: "S001"
    escalation_state: overdue
    terminal_state: null
PLANT_A

cd "$REPO_ROOT"
ACTUAL_A=0
node "$VALIDATOR" > /dev/null 2>&1 || ACTUAL_A=$?

if [ "$ACTUAL_A" -eq 1 ]; then
  pass "TEST A: overdue floater closure_by=S001 (gap=87 > 3) → exits 1 BLOCKING"
else
  fail "TEST A: expected exit 1, got $ACTUAL_A — validator failed to BLOCK on large gap"
fi

# Restore register between tests
cp "$BACKUP" "$REGISTER"

# ── TEST B: plant overdue floater with small gap (S086, gap=2 ≤ threshold=3) ──────────────
# Expected: validator EXITS 0 (ADVISORY only — grace window)
cat >> "$REGISTER" << 'PLANT_B'

  - id: block-test-overdue-gap-small-TEMP
    artifact_path: docs/SIA/BLOCK-TEST-TEMP.md
    status: draft
    created_session: S086
    closure_owner: group:finky
    closure_decision: "block-test plant — will be removed after test"
    closure_by: "S086"
    escalation_state: overdue
    terminal_state: null
PLANT_B

ACTUAL_B=0
node "$VALIDATOR" > /dev/null 2>&1 || ACTUAL_B=$?

if [ "$ACTUAL_B" -eq 0 ]; then
  pass "TEST B: overdue floater closure_by=S086 (gap=2 ≤ 3) → exits 0 ADVISORY only (grace window)"
else
  fail "TEST B: expected exit 0, got $ACTUAL_B — validator incorrectly BLOCKED within grace window"
fi

# Restore register
cp "$BACKUP" "$REGISTER"
rm -f "$BACKUP"

# ── TEST C: no overdue floaters → clean ────────────────────────────────────────────────────
ACTUAL_C=0
node "$VALIDATOR" > /dev/null 2>&1 || ACTUAL_C=$?

if [ "$ACTUAL_C" -eq 0 ]; then
  pass "TEST C: restored register (overdue=0) → exits 0 clean"
else
  fail "TEST C: expected exit 0, got $ACTUAL_C — validator blocked on clean register"
fi

# ── Result ──────────────────────────────────────────────────────────────────────────────────
echo ""
echo "[floater-escalation-block-test] PASS=$PASS_COUNT FAIL=$FAIL_COUNT"

if [ "$FAIL_COUNT" -eq 0 ]; then
  echo "[floater-escalation-block-test] ✓ 3/3 PASS — act-forcing BLOCK gate proven"
  exit 0
else
  echo "[floater-escalation-block-test] ✗ $FAIL_COUNT test(s) FAILED"
  exit 1
fi
