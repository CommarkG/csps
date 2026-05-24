#!/usr/bin/env bash
# Behavioral test: pre-tool-use-ux-creation-gate.sh
# Verifies the hook blocks new page.tsx files without pageDNA.purpose.
#
# Usage: bash tools/tests/behavioral/ux-creation-gate-test.sh
# Exit: 0 = all cases pass | 1 = behavioral guarantee violated

set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
HOOK="${REPO_ROOT}/.claude/hooks/pre-tool-use-ux-creation-gate.sh"

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

echo ""
echo "pre-tool-use-ux-creation-gate.sh behavioral test"
echo ""

# INPUT A: page.tsx with no pageDNA → BLOCK (exit=1)
CONTENT_A='export default function MyPage() { return <div>Hello</div> }'
JSON_A=$(printf '{"tool_name":"Write","tool_input":{"file_path":"/app/my-feature/page.tsx","content":%s}}' "$(echo "$CONTENT_A" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>process.stdout.write(JSON.stringify(d)))")")
check "INPUT A (page.tsx with no pageDNA) → BLOCK" 1 "$JSON_A"

# INPUT B: page.tsx with pageDNA but no purpose field → BLOCK (exit=1)
CONTENT_B='const pageDNA = { spine: "OPER", audience: "developer" }
export default function MyPage() { return <div>Hello</div> }'
JSON_B=$(printf '{"tool_name":"Write","tool_input":{"file_path":"/app/my-feature/page.tsx","content":%s}}' "$(echo "$CONTENT_B" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>process.stdout.write(JSON.stringify(d)))")")
check "INPUT B (page.tsx with pageDNA but no purpose) → BLOCK" 1 "$JSON_B"

# INPUT C: page.tsx with pageDNA including purpose → PASS (exit=0)
CONTENT_C='const pageDNA = { purpose: "Turn your app idea into a plan item.", spine: "GVRN" }
export default function MyPage() { return <div>Hello</div> }'
JSON_C=$(printf '{"tool_name":"Write","tool_input":{"file_path":"/app/my-feature/page.tsx","content":%s}}' "$(echo "$CONTENT_C" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>process.stdout.write(JSON.stringify(d)))")")
check "INPUT C (page.tsx with pageDNA including purpose) → PASS" 0 "$JSON_C"

# INPUT D: Write to non-page file → PASS (exit=0)
CONTENT_D='export function MyComponent() { return <div>Not a page</div> }'
JSON_D=$(printf '{"tool_name":"Write","tool_input":{"file_path":"/app/components/MyComponent.tsx","content":%s}}' "$(echo "$CONTENT_D" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>process.stdout.write(JSON.stringify(d)))")")
check "INPUT D (Write to component, not page.tsx) → PASS" 0 "$JSON_D"

# INPUT E: Edit tool (not Write) on page.tsx → PASS (exit=0) — Edit is for modifications
JSON_E='{"tool_name":"Edit","tool_input":{"file_path":"/app/page.tsx","old_string":"old","new_string":"new"}}'
check "INPUT E (Edit tool on page.tsx, not Write) → PASS" 0 "$JSON_E"

echo ""
echo "$((PASS + FAIL)) test(s): $PASS passed, $FAIL failed"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "BEHAVIORAL GUARANTEE VIOLATED: pre-tool-use-ux-creation-gate.sh is not catching missing pageDNA.purpose."
  exit 1
fi

echo "Behavioral guarantee confirmed: page.tsx without pageDNA.purpose is blocked."
exit 0
