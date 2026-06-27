#!/usr/bin/env bash
# decision-ledger-block-test.sh — Behavioral block-test for validate-decision-ledger.mjs
#
# S089 hardwire batch item A block-test (Opus counter-sign requirement)
#
# BEHAVIORAL TESTS:
#   TEST A: plant OPUS plan file with Decision Ledger section + NO rejected options → exits 1 (BLOCKS)
#   TEST B: plant OPUS plan file with well-formed Decision Ledger (has rejected + reasoning) → exits 0 (PASS)
#   TEST C: restore state (no temp file) → exits 0 (clean)
#
# Usage: bash tools/tests/behavioral/decision-ledger-block-test.sh
# Exit 0 = all tests pass; Exit 1 = one or more tests failed.
# BLOCK-TEST-CONVENTION.md RULE 2: relative paths, no MSYS absolute in node -e.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
VALIDATOR="$REPO_ROOT/tools/validators/validate-decision-ledger.mjs"
PLAN_DIR="$REPO_ROOT/docs/plan/_handoff"
TEMP_FILE="$PLAN_DIR/OPUS-S000-BLOCK-TEST-TEMP.md"

PASS_COUNT=0
FAIL_COUNT=0

pass() { PASS_COUNT=$((PASS_COUNT+1)); echo "  [PASS] $1"; }
fail() { FAIL_COUNT=$((FAIL_COUNT+1)); echo "  [FAIL] $1"; }

echo ""
echo "[decision-ledger-block-test] S089 item A behavioral proof"
echo ""

# ── TEST A: malformed Decision Ledger (exists, no rejected entries) → exits 1 (BLOCKING) ──
cat > "$TEMP_FILE" << 'PLANT_A'
---
id: csps.test.block-test-temp
name: OPUS-S000-BLOCK-TEST-TEMP
diataxis_type: how-to
---

# Block Test Temp Plan

## 4. DECISION LEDGER — chosen + REJECTED-with-reasoning

| Decision | CHOSEN | Source |
|---|---|---|
| Test decision | Keep current approach | Block test |

(No rejected options listed — malformed ledger)
PLANT_A

cd "$REPO_ROOT"
ACTUAL_A=0
node "$VALIDATOR" > /dev/null 2>&1 || ACTUAL_A=$?

if [ "$ACTUAL_A" -eq 1 ]; then
  pass "TEST A: Decision Ledger with no rejected entries → exits 1 BLOCKING"
else
  fail "TEST A: expected exit 1 (malformed ledger), got $ACTUAL_A"
fi

rm -f "$TEMP_FILE"

# ── TEST B: well-formed Decision Ledger (has rejected + reasoning) → exits 0 (PASS) ────
cat > "$TEMP_FILE" << 'PLANT_B'
---
id: csps.test.block-test-temp
name: OPUS-S000-BLOCK-TEST-TEMP
diataxis_type: how-to
---

# Block Test Temp Plan — Well-formed

## 4. DECISION LEDGER — chosen + REJECTED-with-reasoning

| Decision | CHOSEN | REJECTED (+ why) | Source |
|---|---|---|---|
| Test decision | Keep current approach | **REJECTED: Full rewrite** — high risk, no incremental path; would break existing validators | Block test S089 |
PLANT_B

ACTUAL_B=0
node "$VALIDATOR" > /dev/null 2>&1 || ACTUAL_B=$?

if [ "$ACTUAL_B" -eq 0 ]; then
  pass "TEST B: Decision Ledger with rejected-option + reasoning → exits 0 PASS"
else
  fail "TEST B: expected exit 0 (well-formed ledger), got $ACTUAL_B"
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
echo "[decision-ledger-block-test] PASS=$PASS_COUNT FAIL=$FAIL_COUNT"

if [ "$FAIL_COUNT" -eq 0 ]; then
  echo "[decision-ledger-block-test] ✓ 3/3 PASS — Decision Ledger malformed-ledger BLOCK gate proven"
  exit 0
else
  echo "[decision-ledger-block-test] ✗ $FAIL_COUNT test(s) FAILED"
  exit 1
fi
