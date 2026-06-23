#!/usr/bin/env bash
# prevention-coverage-k3-block-test.sh
# Behavioral block-test for validate-prevention-coverage.mjs A1 changes (S088-A1)
#
# PLANTED DEFECT TESTS:
#   INPUT A: k=3 open gap in actuator JSON → validator exits 1 (P-META-019 violation)
#   INPUT B: overdue gap in actuator JSON → validator exits 1 (overdue BLOCK)
#   INPUT C: clean state (no k≥3, no overdue) → validator exits 0
#
# To drain gap_VALIDATOR_BEHAVIORAL_TEST_COVERAGE per master plan Track A.
# FSE surface 5 of 5 (T1/T2/T3/gitattributes/this block-test).
#
# Usage: bash tools/tests/behavioral/prevention-coverage-k3-block-test.sh
# Exit 0 = all tests pass; Exit 1 = one or more tests failed.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
VALIDATOR="${REPO_ROOT}/tools/validators/validate-prevention-coverage.mjs"
ACTUATOR_RUN="${REPO_ROOT}/tools/data/findings-actuator-last-run.json"
ACTUATOR_SCRIPT="${REPO_ROOT}/tools/scripts/findings-actuator.mjs"

PASS_COUNT=0
FAIL_COUNT=0
RESULTS=()

pass() { PASS_COUNT=$((PASS_COUNT + 1)); RESULTS+=("[PASS] $1"); }
fail() { FAIL_COUNT=$((FAIL_COUNT + 1)); RESULTS+=("[FAIL] $1"); }

# Save original actuator files to restore after test
ORIG_ACTUATOR_RUN=""
if [ -f "$ACTUATOR_RUN" ]; then
  ORIG_ACTUATOR_RUN="$(cat "$ACTUATOR_RUN")"
fi

# Temporarily stub actuator script to prevent re-run overwriting our planted data
# (validator calls findings-actuator.mjs synchronously — we need to control its output)
STUB_ACTUATOR="${REPO_ROOT}/tools/scripts/findings-actuator.mjs.bak"
cp "$ACTUATOR_SCRIPT" "$STUB_ACTUATOR"

cleanup() {
  # Restore actuator script
  if [ -f "$STUB_ACTUATOR" ]; then
    mv "$STUB_ACTUATOR" "$ACTUATOR_SCRIPT"
  fi
  # Restore original last-run JSON
  if [ -n "$ORIG_ACTUATOR_RUN" ]; then
    echo "$ORIG_ACTUATOR_RUN" > "$ACTUATOR_RUN"
  fi
}
trap cleanup EXIT

echo ""
echo "=== prevention-coverage-k3-block-test ==="
echo "Testing per-finding k≥3 BLOCK and overdue BLOCK in validate-prevention-coverage.mjs"
echo ""

# ─── Create a no-op actuator stub that does NOT overwrite the planted last-run ───
cat > "$ACTUATOR_SCRIPT" << 'STUBEOF'
#!/usr/bin/env node
// STUB — reads existing last-run JSON without overwriting (behavioral test mode)
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const LAST_RUN = join(ROOT, 'tools/data/findings-actuator-last-run.json');
// Read existing (planted) data and re-write so validator finds it
const data = JSON.parse(readFileSync(LAST_RUN, 'utf8'));
writeFileSync(LAST_RUN, JSON.stringify(data, null, 2));
process.exit(0);
STUBEOF

# ─── INPUT A: k=3 open gap → must BLOCK ──────────────────────────────────────
echo "[TEST A] Planted: k=3 open gap → expect exit 1 (P-META-019 BLOCK)"
cat > "$ACTUATOR_RUN" << 'EOF_A'
{
  "ran_at": "2026-01-01T00:00:00.000Z",
  "unacted_high_k": [
    {
      "id": "gap_PLANTED_K3_DEFECT",
      "k_count": 3,
      "status": "open",
      "first_seen": "S001",
      "observation": "PLANTED DEFECT: k=3 open — must trigger P-META-019 BLOCK",
      "has_matching_standard": false,
      "must_address_by_session": "S070",
      "age_escalation_status": "on-time"
    }
  ],
  "unacted_improvement": [],
  "acted_this_session": [],
  "total_gap_entries": 5,
  "total_imp_entries": 2,
  "summary": "1 unacted findings (1 recurring gaps k≥2, 0 unpropagated improvements k≥2)"
}
EOF_A

A_EXIT=0
node "$VALIDATOR" > /dev/null 2>&1 || A_EXIT=$?
if [ "$A_EXIT" -ne 0 ]; then
  pass "INPUT A: k=3 open gap → exit=$A_EXIT (correctly BLOCKED)"
else
  fail "INPUT A: k=3 open gap → exit=0 (MISSED — should have blocked on P-META-019)"
fi

# ─── INPUT B: overdue gap → must BLOCK ────────────────────────────────────────
echo "[TEST B] Planted: age_escalation_status:overdue, open → expect exit 1"
cat > "$ACTUATOR_RUN" << 'EOF_B'
{
  "ran_at": "2026-01-01T00:00:00.000Z",
  "unacted_high_k": [
    {
      "id": "gap_PLANTED_OVERDUE_DEFECT",
      "k_count": 2,
      "status": "open",
      "first_seen": "S050",
      "observation": "PLANTED DEFECT: overdue item — must trigger overdue BLOCK",
      "has_matching_standard": false,
      "must_address_by_session": "S060",
      "age_escalation_status": "overdue"
    }
  ],
  "unacted_improvement": [],
  "acted_this_session": [],
  "total_gap_entries": 5,
  "total_imp_entries": 0,
  "summary": "1 unacted findings"
}
EOF_B

B_EXIT=0
node "$VALIDATOR" > /dev/null 2>&1 || B_EXIT=$?
if [ "$B_EXIT" -ne 0 ]; then
  pass "INPUT B: overdue gap (k=2) → exit=$B_EXIT (correctly BLOCKED)"
else
  fail "INPUT B: overdue gap → exit=0 (MISSED — should have blocked on overdue)"
fi

# ─── INPUT C: clean state → must PASS ─────────────────────────────────────────
echo "[TEST C] Clean: all k=2 on-time → expect exit 0"
cat > "$ACTUATOR_RUN" << 'EOF_C'
{
  "ran_at": "2026-01-01T00:00:00.000Z",
  "unacted_high_k": [
    {
      "id": "gap_CLEAN_K2_ITEM",
      "k_count": 2,
      "status": "open",
      "first_seen": "S080",
      "observation": "Clean k=2 item — should only be advisory, not blocking",
      "has_matching_standard": false,
      "must_address_by_session": "S095",
      "age_escalation_status": "on-time"
    }
  ],
  "unacted_improvement": [],
  "acted_this_session": [],
  "total_gap_entries": 5,
  "total_imp_entries": 0,
  "summary": "1 unacted findings"
}
EOF_C

C_EXIT=0
node "$VALIDATOR" > /dev/null 2>&1 || C_EXIT=$?
if [ "$C_EXIT" -eq 0 ]; then
  pass "INPUT C: k=2 on-time → exit=0 (correctly advisory, not blocked)"
else
  fail "INPUT C: k=2 on-time → exit=$C_EXIT (false BLOCK — advisory should not block)"
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
  echo "[BLOCK-TEST FAILED] $FAIL_COUNT test(s) failed — validator does not enforce k≥3/overdue blocking"
  exit 1
fi

echo "[BLOCK-TEST PASSED] All $PASS_COUNT tests confirmed — per-finding k≥3 and overdue blocking works"
exit 0
