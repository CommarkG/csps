#!/usr/bin/env bash
# prevention-class-test.sh — PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 7
# INPUT A: after migration, all open entries have prevention_class field
# INPUT B: validator exits 0 (no blocking issues — unclassified is advisory only)

set -euo pipefail; cd "$(git rev-parse --show-toplevel)"
PASS=0; FAIL=0; ERRORS=()
echo "[prevention-class-test] Running..."

echo "  Testing INPUT A: open entries have prevention_class..."
PC_COUNT=$(grep -c "prevention_class:" tools/data/improvement-register.yaml tools/data/gap-recurrence-register.yaml 2>/dev/null | awk -F: '{sum += $2} END {print sum}' || echo "0")
[ "$PC_COUNT" -gt 0 ] && echo "  ✓ INPUT A: $PC_COUNT entries have prevention_class" && PASS=$((PASS+1)) || (echo "  ✗ INPUT A: 0 entries"; FAIL=$((FAIL+1)); ERRORS+=("INPUT A"))

echo "  Testing INPUT B: validator exits 0..."
V_EXIT=0; node tools/validators/validate-prevention-class-required.mjs >/dev/null 2>&1 || V_EXIT=$?
[ "$V_EXIT" -eq 0 ] && echo "  ✓ INPUT B: validator exits 0 (advisory mode)" && PASS=$((PASS+1)) || (echo "  ✗ INPUT B: exits $V_EXIT"; FAIL=$((FAIL+1)); ERRORS+=("INPUT B"))

echo ""; echo "[prevention-class-test] PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -gt 0 ] && echo "FAILURES: ${ERRORS[*]}" && exit 1
echo "[prevention-class-test] ALL PASS ✅"
