#!/usr/bin/env bash
# inventory-scan-test.sh — PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 5
# INPUT A: scan returns hits for known query → >0 results
# INPUT B: scan exits 0 always (advisory per Item 2)
# INPUT C: validator confirms 11 registries present

set -euo pipefail; cd "$(git rev-parse --show-toplevel)"
SCANNER="tools/scripts/platform-inventory-scan.mjs"
VALIDATOR="tools/validators/validate-inventory-scan-coverage.mjs"
PASS=0; FAIL=0; ERRORS=()
echo "[inventory-scan-test] Running..."

echo "  Testing INPUT A: scan returns hits for session-source..."
HITS=$(node "$SCANNER" --query=session-source 2>/dev/null | grep "hits=" | grep -oE "hits=[0-9]+" | cut -d= -f2 || echo "0")
if [ "$HITS" -gt 0 ]; then echo "  ✓ INPUT A: $HITS hits found"; PASS=$((PASS+1)); else echo "  ✗ INPUT A: 0 hits"; FAIL=$((FAIL+1)); ERRORS+=("INPUT A"); fi

echo "  Testing INPUT B: scan exits 0..."
SCAN_EXIT=0; node "$SCANNER" --query=consolidation >/dev/null 2>&1 || SCAN_EXIT=$?
[ "$SCAN_EXIT" -eq 0 ] && echo "  ✓ INPUT B: exits 0" && PASS=$((PASS+1)) || (echo "  ✗ INPUT B: exits $SCAN_EXIT"; FAIL=$((FAIL+1)); ERRORS+=("INPUT B"))

echo "  Testing INPUT C: 11 registries present..."
PRESENT=$(node "$VALIDATOR" 2>/dev/null | grep -oE "registries_present=[0-9]+" | cut -d= -f2 || echo "0")
[ "$PRESENT" -ge 11 ] && echo "  ✓ INPUT C: $PRESENT/11 registries present" && PASS=$((PASS+1)) || (echo "  ✗ INPUT C: only $PRESENT"; FAIL=$((FAIL+1)); ERRORS+=("INPUT C"))

echo ""; echo "[inventory-scan-test] PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -gt 0 ] && echo "FAILURES: ${ERRORS[*]}" && exit 1
echo "[inventory-scan-test] ALL PASS ✅"
