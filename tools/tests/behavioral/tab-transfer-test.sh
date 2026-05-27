#!/usr/bin/env bash
# @csps-id csps.tools.tests.behavioral.tab-transfer-test
# @csps-name tab-transfer-test
# @csps-description Behavioral test for validate-tab-transfer-completeness.mjs + pre-tool-use-false-assumption-gate.sh
#   INPUT A: HANDOFF missing false-assumption section → validator advisory, exit 0
#   INPUT B: tab-transfer-template.md self-validates (recursive consistency)
#   INPUT C: Write to HANDOFF with <10 FA items → hook emits advisory (exit 0)
# @csps-version 1.0.0
# @csps-tags type:behavioral-test domain:governance

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

VALIDATOR="tools/validators/validate-tab-transfer-completeness.mjs"
HOOK=".claude/hooks/pre-tool-use-false-assumption-gate.sh"
PASS=0; FAIL=0

echo "[tab-transfer-test] Running 3 behavioral inputs..."

# ── INPUT A: pre-S067 HANDOFFs missing FA section → advisory (exit 0) ─────────
OUTPUT_A=$(node "$VALIDATOR" 2>&1)
EXIT_A=$?
if [ "$EXIT_A" -eq 0 ] && echo "$OUTPUT_A" | grep -q "ADVISORY.*HANDOFF-S0"; then
  echo "  ✓ INPUT A: pre-S067 HANDOFFs flagged as ADVISORY (missing FA — expected), exit 0"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT A: unexpected exit $EXIT_A or missing advisory for pre-S067 HANDOFFs"
  FAIL=$((FAIL + 1))
fi

# ── INPUT B: template self-validates (recursive consistency ✓) ─────────────────
if echo "$OUTPUT_A" | grep -q "self-validates"; then
  echo "  ✓ INPUT B: tab-transfer-template.md self-validates (recursive consistency confirmed)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT B: template failed self-validation"
  echo "    Output: $(echo "$OUTPUT_A" | head -3)"
  FAIL=$((FAIL + 1))
fi

# ── INPUT C: Write to HANDOFF with <10 FA items → hook emits advisory ──────────
TOOL_INPUT='{"tool_name":"Write","tool_input":{"file_path":"docs/plan/_handoff/HANDOFF-S999-to-S1000.md","content":"# HANDOFF\n## WHAT ARE THE FALSE ASSUMPTIONS HERE?\n❌ only one item\n## Zone A\nContent here."}}'
STDERR_C=$(echo "$TOOL_INPUT" | bash "$HOOK" 2>&1 1>/dev/null)
EXIT_C=$?
if [ "$EXIT_C" -eq 0 ] && echo "$STDERR_C" | grep -q "B_META_QUESTION-gate"; then
  echo "  ✓ INPUT C: Write to HANDOFF with <10 FA items → hook advisory emitted, exit 0"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT C: exit=$EXIT_C, missing hook advisory"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "[tab-transfer-test] results: PASS=${PASS} FAIL=${FAIL}"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
