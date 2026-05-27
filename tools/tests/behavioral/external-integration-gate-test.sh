#!/usr/bin/env bash
# @csps-id csps.tools.tests.behavioral.external-integration-gate-test
# @csps-name external-integration-gate-test
# @csps-description Behavioral test for pre-tool-use-external-integration-gate.sh (C5 prevention)
#   INPUT A: Edit tool targeting vercel.md → ADVISORY emitted (stderr), exit 0
#   INPUT B: Edit tool targeting non-integration file → hook silent, exit 0
#   INPUT C: Write tool targeting .env pattern → ADVISORY emitted, exit 0
# @csps-version 1.0.0
# @csps-tags type:behavioral-test domain:governance

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

HOOK=".claude/hooks/pre-tool-use-external-integration-gate.sh"
PASS=0; FAIL=0

echo "[external-integration-gate-test] Running 3 behavioral inputs..."

# ── INPUT A: Edit to vercel.md → ADVISORY in stderr, exit 0 ──────────────────
INPUT_A='{"tool_name":"Edit","tool_input":{"file_path":"docs/plan/pillar-0-governance/external-integrations/vercel.md"}}'
STDERR_A=$(echo "$INPUT_A" | bash "$HOOK" 2>&1 1>/dev/null)
EXIT_A=$?
if [ "$EXIT_A" -eq 0 ] && echo "$STDERR_A" | grep -q "C5-external-integration-gate"; then
  echo "  ✓ INPUT A: Edit to vercel.md → ADVISORY emitted, exit 0 (C5 correct)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT A: exit=$EXIT_A, stderr missing C5 warning"
  FAIL=$((FAIL + 1))
fi

# ── INPUT B: Edit to non-integration file → silent pass ──────────────────────
INPUT_B='{"tool_name":"Edit","tool_input":{"file_path":"tools/validators/validate-zf-cycle-format.mjs"}}'
STDERR_B=$(echo "$INPUT_B" | bash "$HOOK" 2>&1 1>/dev/null)
EXIT_B=$?
if [ "$EXIT_B" -eq 0 ] && [ -z "$STDERR_B" ]; then
  echo "  ✓ INPUT B: Edit to non-integration file → silent, exit 0"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT B: unexpected output or exit $EXIT_B"
  FAIL=$((FAIL + 1))
fi

# ── INPUT C: Write to .env file → ADVISORY emitted ───────────────────────────
INPUT_C='{"tool_name":"Write","tool_input":{"file_path":"apps/budget-planner/.env.local"}}'
STDERR_C=$(echo "$INPUT_C" | bash "$HOOK" 2>&1 1>/dev/null)
EXIT_C=$?
if [ "$EXIT_C" -eq 0 ] && echo "$STDERR_C" | grep -q "C5-external-integration-gate"; then
  echo "  ✓ INPUT C: Write to .env.local → ADVISORY emitted, exit 0"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT C: exit=$EXIT_C or missing advisory"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "[external-integration-gate-test] results: PASS=${PASS} FAIL=${FAIL}"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
