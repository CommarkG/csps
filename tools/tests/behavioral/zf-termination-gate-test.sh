#!/usr/bin/env bash
# Behavioral test: pre-tool-use-zf-termination-gate.sh
# Verifies the hook blocks council writes with ZF ACHIEVED but no filename in Cycle 2.
#
# Usage: bash tools/tests/behavioral/zf-termination-gate-test.sh
# Exit: 0 = all cases pass | 1 = behavioral guarantee violated

set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
HOOK="${REPO_ROOT}/.claude/hooks/pre-tool-use-zf-termination-gate.sh"
COUNCIL_FILE="${REPO_ROOT}/tools/council/sonnet-turn.md"

PASS=0
FAIL=0

check() {
  local name="$1" expected_exit="$2"
  local json="$3"
  local actual_exit=0
  echo "$json" | bash "$HOOK" > /dev/null 2>&1 || actual_exit=$?
  if [ "$actual_exit" -eq "$expected_exit" ]; then
    echo "  ✓ $name (exit=$actual_exit, expected=$expected_exit)"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $name (exit=$actual_exit, expected=$expected_exit)"
    FAIL=$((FAIL + 1))
  fi
}

json_encode() {
  echo "$1" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>process.stdout.write(JSON.stringify(d)))"
}

echo ""
echo "pre-tool-use-zf-termination-gate.sh behavioral test"
echo ""

# INPUT A: council write with ZF ACHIEVED + Cycle 2 without filename → ADVISORY (exit=0)
CONTENT_A='ZF Cycle 1: found issues with plan items.
Cycle 2: re-examined everything — no new findings.
STATUS: ZF ACHIEVED'
JSON_A=$(printf '{"tool_name":"Write","tool_input":{"file_path":"%s","content":%s}}' \
  "$COUNCIL_FILE" "$(json_encode "$CONTENT_A")")
check "INPUT A → ADVISORY (exit=0)" 0 "$JSON_A"

# INPUT B: council write with ZF ACHIEVED + Cycle 2 WITH filename → PASS (exit=0)
CONTENT_B='ZF Cycle 1: found issues in unified-plan.yaml line 994.
Cycle 2: re-examined tools/config/unified-plan.yaml and validate-pe-dashboard.mjs output — 0 new findings.
STATUS: ZF ACHIEVED'
JSON_B=$(printf '{"tool_name":"Write","tool_input":{"file_path":"%s","content":%s}}' \
  "$COUNCIL_FILE" "$(json_encode "$CONTENT_B")")
check "INPUT B (ZF ACHIEVED + Cycle 2 with validate-pe-dashboard.mjs named) → PASS" 0 "$JSON_B"

# INPUT C: non-council file write → PASS (exit=0)
CONTENT_C='ZF Cycle 1: something.
Cycle 2: nothing new. ZF ACHIEVED'
JSON_C=$(printf '{"tool_name":"Write","tool_input":{"file_path":"/app/MyPage.tsx","content":%s}}' \
  "$(json_encode "$CONTENT_C")")
check "INPUT C (non-council file, no filename in Cycle 2) → PASS" 0 "$JSON_C"

# INPUT D: council write with NO ZF ACHIEVED → PASS (exit=0)
CONTENT_D='This is a draft response without any ZF cycles or claims.'
JSON_D=$(printf '{"tool_name":"Write","tool_input":{"file_path":"%s","content":%s}}' \
  "$COUNCIL_FILE" "$(json_encode "$CONTENT_D")")
check "INPUT D (council write with no ZF ACHIEVED) → PASS" 0 "$JSON_D"

# INPUT E: Edit tool on council file with nominal ZF → ADVISORY (exit=0)
CONTENT_E='ZF Cycle 1: found gap.
Cycle 2: re-examined topics — no issues. ZF ACHIEVED.'
JSON_E=$(printf '{"tool_name":"Edit","tool_input":{"file_path":"%s","new_string":%s}}' \
  "$COUNCIL_FILE" "$(json_encode "$CONTENT_E")")
check "INPUT E → ADVISORY (exit=0)" 0 "$JSON_E"

echo ""
echo "$((PASS + FAIL)) test(s): $PASS passed, $FAIL failed"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "BEHAVIORAL GUARANTEE VIOLATED: pre-tool-use-zf-termination-gate.sh is not blocking nominal ZF cycles."
  exit 1
fi

echo "Behavioral guarantee confirmed: ZF termination gate blocks nominal cycles, passes file-citing cycles."
exit 0
