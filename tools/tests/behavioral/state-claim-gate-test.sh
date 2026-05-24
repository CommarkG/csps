#!/usr/bin/env bash
# Behavioral test: pre-tool-use-state-claim-gate.sh
# Verifies the hook shows advisory when state claims lack verification evidence.
#
# Usage: bash tools/tests/behavioral/state-claim-gate-test.sh
# Exit: 0 = all cases pass | 1 = behavioral guarantee violated
# Note: Hook is advisory (always exits 0). Tests check that advisory IS shown (A) or NOT shown (B).

set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
HOOK="${REPO_ROOT}/.claude/hooks/pre-tool-use-state-claim-gate.sh"
COUNCIL_FILE="${REPO_ROOT}/tools/council/sonnet-turn.md"

PASS=0
FAIL=0

json_encode() {
  echo "$1" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>process.stdout.write(JSON.stringify(d)))"
}

# check_exit: verify exit code is 0 (advisory always exits 0)
# check_output: verify advisory message IS or IS NOT in stdout
check_advisory_shown() {
  local name="$1" expect_advisory="$2" json="$3"
  local output
  output=$(echo "$json" | bash "$HOOK" 2>&1) || true
  local has_advisory=false
  echo "$output" | grep -q "STATE CLAIM ADVISORY" && has_advisory=true

  if [ "$expect_advisory" = "yes" ] && [ "$has_advisory" = "true" ]; then
    echo "  ✓ $name — advisory shown (expected)"
    PASS=$((PASS + 1))
  elif [ "$expect_advisory" = "no" ] && [ "$has_advisory" = "false" ]; then
    echo "  ✓ $name — no advisory (expected)"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $name — advisory_shown=$has_advisory expected=$expect_advisory"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "pre-tool-use-state-claim-gate.sh behavioral test"
echo ""

# INPUT A: council entry with validators=157 but no evidence → ADVISORY shown
CONTENT_A='FROM SONNET | FOR OPUS TAB — S059 PROTO-X
validators=157, exit_code=0, commit: abc1234
All good.'
JSON_A=$(printf '{"tool_name":"Write","tool_input":{"file_path":"%s","content":%s}}' \
  "$COUNCIL_FILE" "$(json_encode "$CONTENT_A")")
check_advisory_shown "INPUT A (validators=157 without verification evidence)" "yes" "$JSON_A"

# INPUT B: entry with validators=157 AND "Confirmed" evidence → NO advisory
CONTENT_B='FROM SONNET | FOR OPUS TAB — S059 PROTO-X
Confirmed via this-session node tools/verify.mjs run: validators=157, exit_code=0
Confirmed via git rev-parse HEAD: commit abc1234.'
JSON_B=$(printf '{"tool_name":"Write","tool_input":{"file_path":"%s","content":%s}}' \
  "$COUNCIL_FILE" "$(json_encode "$CONTENT_B")")
check_advisory_shown "INPUT B (validators=157 WITH 'Confirmed' evidence)" "no" "$JSON_B"

# INPUT C: non-council file → NO advisory (hook skips)
CONTENT_C='validators=157 exit_code=0 commit: abc1234'
JSON_C=$(printf '{"tool_name":"Write","tool_input":{"file_path":"/app/SomePage.tsx","content":%s}}' \
  "$(json_encode "$CONTENT_C")")
check_advisory_shown "INPUT C (non-council file with state claims)" "no" "$JSON_C"

# INPUT D: council file with no state claims → NO advisory
CONTENT_D='FROM SONNET | FOR OPUS TAB — PROTO-X COMPLETE
Build complete. All files written. Awaiting Opus direction.'
JSON_D=$(printf '{"tool_name":"Write","tool_input":{"file_path":"%s","content":%s}}' \
  "$COUNCIL_FILE" "$(json_encode "$CONTENT_D")")
check_advisory_shown "INPUT D (council write with no state claims)" "no" "$JSON_D"

echo ""
echo "$((PASS + FAIL)) test(s): $PASS passed, $FAIL failed"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "BEHAVIORAL GUARANTEE VIOLATED: pre-tool-use-state-claim-gate.sh advisory not working correctly."
  exit 1
fi

echo "Behavioral guarantee confirmed: state claims without evidence trigger advisory."
exit 0
