#!/usr/bin/env bash
# @csps-id csps.tools.tests.behavioral.sonnet-checkpoint-relay-test
# @csps-name sonnet-checkpoint-relay-test
# @csps-description Behavioral test for validate-sonnet-checkpoint-relay.mjs (C7 prevention)
#   INPUT A: validator exits 0 (advisory only)
#   INPUT B: blocking=0 confirmed — no asymmetric relay violations
#   INPUT C: checkpoints_checked > 0 (sonnet-turn.md has CHECKPOINT sections)
# @csps-version 1.0.0
# @csps-tags type:behavioral-test domain:governance

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
VALIDATOR="tools/validators/validate-sonnet-checkpoint-relay.mjs"
PASS=0; FAIL=0

echo "[sonnet-checkpoint-relay-test] Running 3 behavioral inputs..."

OUTPUT=$(node "$VALIDATOR" 2>&1)
EXIT_CODE=$?

# INPUT A: exits 0 (advisory only S067)
if [ "$EXIT_CODE" -eq 0 ]; then
  echo "  ✓ INPUT A: validator exits 0 (C7 advisory mode S067)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT A: expected exit 0, got $EXIT_CODE"
  FAIL=$((FAIL + 1))
fi

# INPUT B: blocking=0
if echo "$OUTPUT" | grep -q "blocking=0"; then
  echo "  ✓ INPUT B: blocking=0 confirmed — no asymmetric relay blocking violations"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT B: missing blocking=0"
  FAIL=$((FAIL + 1))
fi

# INPUT C: checkpoints scanned (>= 1)
CHECKPOINT_COUNT=$(echo "$OUTPUT" | grep -o "checkpoints_checked=[0-9]*" | grep -o "[0-9]*" || echo "0")
if [ "$CHECKPOINT_COUNT" -gt 0 ]; then
  echo "  ✓ INPUT C: checkpoints_checked=${CHECKPOINT_COUNT} — sonnet-turn.md CHECKPOINT sections found"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT C: expected checkpoints_checked > 0 (sonnet-turn.md should have CHECKPOINTs)"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "[sonnet-checkpoint-relay-test] results: PASS=${PASS} FAIL=${FAIL}"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
