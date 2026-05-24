#!/usr/bin/env bash
# Behavioral test: pre-tool-use-humble-step-gate.sh
# Verifies the hook shows advisory when STEP 1 has >10 sub-items.
#
# Usage: bash tools/tests/behavioral/humble-step-gate-test.sh
# Exit: 0 = all cases pass | 1 = behavioral guarantee violated
# Note: Hook is advisory (always exits 0). Tests check advisory IS or IS NOT shown.

set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
HOOK="${REPO_ROOT}/.claude/hooks/pre-tool-use-humble-step-gate.sh"
COUNCIL_FILE="${REPO_ROOT}/tools/council/sonnet-turn.md"

PASS=0
FAIL=0

json_encode() {
  echo "$1" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>process.stdout.write(JSON.stringify(d)))"
}

check_advisory() {
  local name="$1" expect="$2" json="$3"
  local output
  output=$(echo "$json" | bash "$HOOK" 2>&1) || true
  local shown=false
  echo "$output" | grep -q "HUMBLE FIRST STEP ADVISORY" && shown=true

  if [ "$expect" = "yes" ] && [ "$shown" = "true" ]; then
    echo "  ✓ $name — advisory shown (expected)"
    PASS=$((PASS + 1))
  elif [ "$expect" = "no" ] && [ "$shown" = "false" ]; then
    echo "  ✓ $name — no advisory (expected)"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $name — shown=$shown expected=$expect"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "pre-tool-use-humble-step-gate.sh behavioral test"
echo ""

# INPUT A: PROTO with STEP 1 having 15 sub-items → ADVISORY shown
# Use a temp file to avoid shell escaping issues with multi-line content
TMP_A=$(mktemp /tmp/humble-test-A-XXXXXX.md)
{
  echo "FROM SONNET — PROTO-A"
  echo ""
  echo "STEP 1 — Big first step:"
  for i in $(seq 1 15); do
    echo "  sub-item ${i}: doing something complex"
  done
  echo "STEP 2 — second step:"
  echo "  only 2 items here"
} > "$TMP_A"
CONTENT_A=$(cat "$TMP_A")
rm -f "$TMP_A"
JSON_A=$(printf '{"tool_name":"Write","tool_input":{"file_path":"%s","content":%s}}' \
  "$COUNCIL_FILE" "$(json_encode "$CONTENT_A")")
check_advisory "INPUT A (STEP 1 with 15 sub-items) → ADVISORY" "yes" "$JSON_A"

# INPUT B: PROTO with STEP 1 having 5 sub-items → NO advisory
TMP_B=$(mktemp /tmp/humble-test-B-XXXXXX.md)
{
  echo "FROM SONNET — PROTO-B"
  echo ""
  echo "STEP 1 — Small first step:"
  echo "  item 1"
  echo "  item 2"
  echo "  item 3"
  echo "  item 4"
  echo "  item 5"
  echo "STEP 2 — next:"
} > "$TMP_B"
CONTENT_B=$(cat "$TMP_B")
rm -f "$TMP_B"
JSON_B=$(printf '{"tool_name":"Write","tool_input":{"file_path":"%s","content":%s}}' \
  "$COUNCIL_FILE" "$(json_encode "$CONTENT_B")")
check_advisory "INPUT B (STEP 1 with 5 sub-items) → NO advisory" "no" "$JSON_B"

# INPUT C: non-council file → NO advisory
CONTENT_C="STEP 1 — Big step with 15 items:\n$(for i in $(seq 1 15); do printf '  item %d\n' $i; done)\nSTEP 2:"
JSON_C=$(printf '{"tool_name":"Write","tool_input":{"file_path":"/app/NotCouncil.tsx","content":%s}}' \
  "$(json_encode "$CONTENT_C")")
check_advisory "INPUT C (non-council file with big STEP 1) → NO advisory" "no" "$JSON_C"

echo ""
echo "$((PASS + FAIL)) test(s): $PASS passed, $FAIL failed"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "BEHAVIORAL GUARANTEE VIOLATED: pre-tool-use-humble-step-gate.sh not detecting overscoped STEP 1."
  exit 1
fi

echo "Behavioral guarantee confirmed: STEP 1 with >10 sub-items triggers advisory."
exit 0
