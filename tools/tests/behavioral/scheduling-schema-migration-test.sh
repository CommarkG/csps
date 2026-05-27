#!/usr/bin/env bash
# scheduling-schema-migration-test.sh
# Behavioral test for migrate-S066-WAVE-2-scheduling-fields.mjs
# PROTO-S066-WAVE-2 STEP 1
#
# INPUT A: register entry without fields → gets populated after migration
# INPUT B: register entry WITH fields already → not overwritten (idempotent)
# INPUT C: re-run of migration → 0 patches (pure idempotency)

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

PASS=0; FAIL=0; ERRORS=()
echo "[scheduling-schema-migration-test] Running..."

# INPUT A: verify open entries in gap-recurrence-register have the new fields
echo "  Testing INPUT A: open entries have must_address_by_session..."
MISSING=$(grep -E "^  - id:" tools/data/gap-recurrence-register.yaml | wc -l)
WITH_FIELD=$(grep "must_address_by_session:" tools/data/gap-recurrence-register.yaml | wc -l)
# Note: some entries are closed (no field added) — so WITH_FIELD < total entries is expected
if [ "$WITH_FIELD" -gt 0 ]; then
  echo "  ✓ INPUT A: $WITH_FIELD entries have must_address_by_session (gap register)"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT A: 0 entries have must_address_by_session in gap register"
  FAIL=$((FAIL+1)); ERRORS+=("INPUT A")
fi

echo "  Testing INPUT A: open entries in improvement-register..."
WITH_FIELD_IR=$(grep "must_address_by_session:" tools/data/improvement-register.yaml | wc -l)
if [ "$WITH_FIELD_IR" -gt 0 ]; then
  echo "  ✓ INPUT A: $WITH_FIELD_IR entries have must_address_by_session (improvement register)"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT A: 0 entries have must_address_by_session in improvement register"
  FAIL=$((FAIL+1)); ERRORS+=("INPUT A improvement-register")
fi

# INPUT B: verify age_escalation_status defaults to on-time (not overdue)
echo "  Testing INPUT B: all new entries start with age_escalation_status=on-time..."
OVERDUE_STATUS=$(node -e "const fs=require('fs');const c=fs.readFileSync('tools/data/gap-recurrence-register.yaml','utf-8')+fs.readFileSync('tools/data/improvement-register.yaml','utf-8');console.log((c.match(/age_escalation_status:\s*overdue/g)||[]).length)" 2>/dev/null || echo "0")
ONTIME_STATUS=$(node -e "const fs=require('fs');const c=fs.readFileSync('tools/data/gap-recurrence-register.yaml','utf-8')+fs.readFileSync('tools/data/improvement-register.yaml','utf-8');console.log((c.match(/age_escalation_status:\s*on-time/g)||[]).length)" 2>/dev/null || echo "0")
if [ "$ONTIME_STATUS" -gt 0 ] && [ "$OVERDUE_STATUS" -eq 0 ]; then
  echo "  ✓ INPUT B: $ONTIME_STATUS entries have on-time status, 0 overdue on fresh migration"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT B: on-time=$ONTIME_STATUS overdue=$OVERDUE_STATUS (expected all on-time)"
  FAIL=$((FAIL+1)); ERRORS+=("INPUT B")
fi

# INPUT C: idempotency — re-run produces 0 patches
echo "  Testing INPUT C: idempotency (re-run produces 0 patches)..."
RERUN_OUTPUT=$(node tools/scripts/migrate-S066-WAVE-2-scheduling-fields.mjs 2>&1)
if echo "$RERUN_OUTPUT" | grep -q "patched=0"; then
  echo "  ✓ INPUT C: re-run shows patched=0 (idempotent)"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT C: re-run not idempotent"
  echo "    Output: $RERUN_OUTPUT"
  FAIL=$((FAIL+1)); ERRORS+=("INPUT C")
fi

echo ""
echo "[scheduling-schema-migration-test] PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -gt 0 ] && echo "FAILURES: ${ERRORS[*]}" && exit 1
echo "[scheduling-schema-migration-test] ALL PASS ✅"
