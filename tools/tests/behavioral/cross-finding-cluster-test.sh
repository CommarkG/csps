#!/usr/bin/env bash
# @csps-id csps.tools.tests.behavioral.cross-finding-cluster-test
# @csps-name cross-finding-cluster-test
# @csps-description Behavioral test for validate-cross-finding-cluster.mjs (C6 prevention)
#   INPUT A: validator exits 0 (advisory only — always exits 0)
#   INPUT B: blocking=0 confirmed
#   INPUT C: advisory count reported (clusters found or none — either valid)
# @csps-version 1.0.0
# @csps-tags type:behavioral-test domain:governance

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
VALIDATOR="tools/validators/validate-cross-finding-cluster.mjs"
PASS=0; FAIL=0

echo "[cross-finding-cluster-test] Running 3 behavioral inputs..."

OUTPUT=$(node "$VALIDATOR" 2>&1)
EXIT_CODE=$?

# INPUT A: exits 0 always (advisory only)
if [ "$EXIT_CODE" -eq 0 ]; then
  echo "  ✓ INPUT A: validator exits 0 (C6 advisory — always non-blocking)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT A: expected exit 0, got $EXIT_CODE"
  FAIL=$((FAIL + 1))
fi

# INPUT B: blocking=0 confirmed
if echo "$OUTPUT" | grep -q "blocking=0"; then
  echo "  ✓ INPUT B: blocking=0 confirmed — no blocking fragment-finding violations"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT B: missing blocking=0 in output"
  FAIL=$((FAIL + 1))
fi

# INPUT C: advisory count reported (valid either way)
if echo "$OUTPUT" | grep -q "advisory="; then
  echo "  ✓ INPUT C: advisory count present — validator reporting correctly"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT C: missing advisory count in output"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "[cross-finding-cluster-test] results: PASS=${PASS} FAIL=${FAIL}"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
