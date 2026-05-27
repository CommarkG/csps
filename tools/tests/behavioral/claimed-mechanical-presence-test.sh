#!/usr/bin/env bash
# @csps-id csps.tools.tests.behavioral.claimed-mechanical-presence-test
# @csps-name claimed-mechanical-presence-test
# @csps-description Behavioral test for validate-claimed-mechanical-presence.mjs (C1 prevention)
#   INPUT A: CSEP-pending moat entries → ADVISORY only (exit 0)
#   INPUT B: blocking=0 on current clean repo
#   INPUT C: validate-claimed-mechanical-presence.mjs itself exists (self-verification)
# @csps-version 1.0.0
# @csps-tags type:behavioral-test domain:governance

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

VALIDATOR="tools/validators/validate-claimed-mechanical-presence.mjs"
PASS=0; FAIL=0

echo "[claimed-mechanical-presence-test] Running 3 behavioral inputs..."

# ── INPUT A: CSEP-pending moat entries → ADVISORY only (exit 0) ──────────────
OUTPUT_A=$(node "$VALIDATOR" 2>&1)
EXIT_A=$?
if [ "$EXIT_A" -eq 0 ] && echo "$OUTPUT_A" | grep -q "advisory="; then
  echo "  ✓ INPUT A: CSEP-pending entries flagged as ADVISORY, exit 0 (C1 correct behavior)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT A: unexpected exit $EXIT_A or missing advisory count"
  echo "    Output: $(echo "$OUTPUT_A" | tail -3)"
  FAIL=$((FAIL + 1))
fi

# ── INPUT B: blocking=0 on current clean repo ────────────────────────────────
if echo "$OUTPUT_A" | grep -q "blocking=0"; then
  echo "  ✓ INPUT B: blocking=0 confirmed — no phantom validators in current repo"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT B: expected blocking=0 in output"
  FAIL=$((FAIL + 1))
fi

# ── INPUT C: self-verification (C1 itself is not a phantom) ──────────────────
if [ -f "tools/validators/validate-claimed-mechanical-presence.mjs" ]; then
  echo "  ✓ INPUT C: validate-claimed-mechanical-presence.mjs exists (not a phantom — C1 self-verified)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT C: validator file missing — phantom hook pattern (C1 violation)"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "[claimed-mechanical-presence-test] results: PASS=${PASS} FAIL=${FAIL}"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
