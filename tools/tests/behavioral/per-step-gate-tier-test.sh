#!/usr/bin/env bash
# @csps-id csps.tools.tests.behavioral.per-step-gate-tier-test
# @csps-name per-step-gate-tier-test
# @csps-description Behavioral test for validate-per-step-gate-tier.mjs (C13 prevention)
#   INPUT A: validator exits 0 (advisory only S067)
#   INPUT B: blocking=0 confirmed
#   INPUT C: protos_checked > 0 (scanned actual PROTO files)
# @csps-version 1.0.0
# @csps-tags type:behavioral-test domain:governance

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
VALIDATOR="tools/validators/validate-per-step-gate-tier.mjs"
PASS=0; FAIL=0

echo "[per-step-gate-tier-test] Running 3 behavioral inputs..."

OUTPUT=$(node "$VALIDATOR" 2>&1)
EXIT_CODE=$?

# INPUT A: exits 0 (advisory only)
if [ "$EXIT_CODE" -eq 0 ]; then
  echo "  ✓ INPUT A: validator exits 0 (C13 advisory mode S067 — scope inheritance ADVISORY)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT A: expected exit 0, got $EXIT_CODE"
  FAIL=$((FAIL + 1))
fi

# INPUT B: blocking=0
if echo "$OUTPUT" | grep -q "blocking=0"; then
  echo "  ✓ INPUT B: blocking=0 confirmed — no AUTO_EXECUTE_SCOPE blocking violations"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT B: missing blocking=0"
  FAIL=$((FAIL + 1))
fi

# INPUT C: protos scanned
PROTO_COUNT=$(echo "$OUTPUT" | grep -o "protos_checked=[0-9]*" | grep -o "[0-9]*" || echo "0")
if [ "$PROTO_COUNT" -gt 0 ]; then
  echo "  ✓ INPUT C: protos_checked=${PROTO_COUNT} — PROTO files scanned for per-step gate declarations"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT C: expected protos_checked > 0"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "[per-step-gate-tier-test] results: PASS=${PASS} FAIL=${FAIL}"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
