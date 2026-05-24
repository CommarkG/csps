#!/usr/bin/env bash
# WHO: CI and local dev running behavioral test suite
# WHAT: Verifies alignment gate shows advisory for new files without alignment block
# PREVENTS: Alignment gate silently failing to fire
# SCOPE: Tests advisory behavior only — hook never blocks (exit=0 always)
#
# Behavioral test: pre-tool-use-alignment-gate.sh
# Usage: bash tools/tests/behavioral/alignment-gate-test.sh
# Exit: 0 = all cases pass | 1 = behavioral guarantee violated

set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
HOOK="${REPO_ROOT}/.claude/hooks/pre-tool-use-alignment-gate.sh"

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
  echo "$output" | grep -q "ALIGNMENT GATE" && shown=true

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
echo "pre-tool-use-alignment-gate.sh behavioral test"
echo ""

# INPUT A: New .sh file with no alignment block → ADVISORY shown
CONTENT_A='#!/usr/bin/env bash
# Some hook that does stuff
echo "doing something"
exit 0'
JSON_A=$(printf '{"tool_name":"Write","tool_input":{"file_path":"/tmp/new-hook-test.sh","content":%s}}' \
  "$(json_encode "$CONTENT_A")")
check_advisory "INPUT A (new .sh file without alignment block) → ADVISORY" "yes" "$JSON_A"

# INPUT B: New .sh file WITH alignment block → NO advisory
CONTENT_B='#!/usr/bin/env bash
# WHO: Developer running governance checks
# WHAT: Validates something important
# PREVENTS: Silent governance gaps
echo "doing something"
exit 0'
JSON_B=$(printf '{"tool_name":"Write","tool_input":{"file_path":"/tmp/new-hook-with-alignment.sh","content":%s}}' \
  "$(json_encode "$CONTENT_B")")
check_advisory "INPUT B (new .sh file with // WHO: alignment block) → NO advisory" "no" "$JSON_B"

# INPUT C: New .mjs file WITH @csps-id → NO advisory (csps-id satisfies requirement)
CONTENT_C='#!/usr/bin/env node
/**
 * @csps-id csps.validators.my-validator
 * @csps-description Does something useful
 */
console.log("hi")'
JSON_C=$(printf '{"tool_name":"Write","tool_input":{"file_path":"/tmp/new-validator.mjs","content":%s}}' \
  "$(json_encode "$CONTENT_C")")
check_advisory "INPUT C (new .mjs with @csps-id) → NO advisory" "no" "$JSON_C"

# INPUT D: Edit to existing file (not new) → NO advisory (gate skips existing files)
# Use a file that actually exists
JSON_D=$(printf '{"tool_name":"Write","tool_input":{"file_path":"%s/tools/verify.mjs","content":%s}}' \
  "$REPO_ROOT" "$(json_encode "$CONTENT_A")")
check_advisory "INPUT D (Write to existing file — gate skips) → NO advisory" "no" "$JSON_D"

# INPUT E: New .yaml file → NO advisory (gate only fires on code files)
JSON_E=$(printf '{"tool_name":"Write","tool_input":{"file_path":"/tmp/config.yaml","content":"key: value"}}')
check_advisory "INPUT E (new .yaml file — gate only checks code files) → NO advisory" "no" "$JSON_E"

echo ""
echo "$((PASS + FAIL)) test(s): $PASS passed, $FAIL failed"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "BEHAVIORAL GUARANTEE VIOLATED: pre-tool-use-alignment-gate.sh not working correctly."
  exit 1
fi

echo "Behavioral guarantee confirmed: alignment gate shows advisory for new code files without alignment block."
exit 0
