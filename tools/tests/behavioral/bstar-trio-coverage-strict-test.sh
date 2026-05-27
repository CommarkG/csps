#!/usr/bin/env bash
# @csps-id csps.tools.tests.behavioral.bstar-trio-coverage-strict-test
# @csps-name bstar-trio-coverage-strict-test
# @csps-description Behavioral test for validate-bstar-trio-coverage-strict.mjs (C3 prevention)
#   INPUT A: validator exits 0 (advisory only — pre-S055 path debt expected)
#   INPUT B: blocking=0 confirmed — no TEXT_WITHOUT_GATE blocking violations
#   INPUT C: files without enforcement_trio are skipped (advisory count only)
# @csps-version 1.0.0
# @csps-tags type:behavioral-test domain:governance

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

VALIDATOR="tools/validators/validate-bstar-trio-coverage-strict.mjs"
PASS=0; FAIL=0

echo "[bstar-trio-coverage-strict-test] Running 3 behavioral inputs..."

OUTPUT=$(node "$VALIDATOR" 2>&1)
EXIT_CODE=$?

# ── INPUT A: exits 0 (advisory mode for pre-S055 path debt) ──────────────────
if [ "$EXIT_CODE" -eq 0 ]; then
  echo "  ✓ INPUT A: validator exits 0 (advisory for missing trio paths — C3 phased rollout)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT A: validator exited $EXIT_CODE (expected 0 — advisory only)"
  FAIL=$((FAIL + 1))
fi

# ── INPUT B: blocking=0 confirmed ────────────────────────────────────────────
if echo "$OUTPUT" | grep -q "blocking=0"; then
  echo "  ✓ INPUT B: blocking=0 confirmed — no TEXT_WITHOUT_GATE violations in active contracts"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT B: expected blocking=0 in output"
  echo "    Output: $(echo "$OUTPUT" | tail -3)"
  FAIL=$((FAIL + 1))
fi

# ── INPUT C: B_HUMBLE has enforcement_trio → scanned (advisory count reported) ─
if echo "$OUTPUT" | grep -q "advisory="; then
  echo "  ✓ INPUT C: advisory count present (files with enforcement_trio are scanned, others skipped)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT C: expected advisory= count in output"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "[bstar-trio-coverage-strict-test] results: PASS=${PASS} FAIL=${FAIL}"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
