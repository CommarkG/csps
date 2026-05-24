#!/usr/bin/env bash
# Behavioral test: pre-tool-use-voice-profile-gate.sh
# Verifies the hook blocks form components without voice profiles.
#
# Usage: bash tools/tests/behavioral/voice-profile-gate-test.sh
# Exit: 0 = all cases pass | 1 = behavioral guarantee violated

set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
HOOK="${REPO_ROOT}/.claude/hooks/pre-tool-use-voice-profile-gate.sh"

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
echo "pre-tool-use-voice-profile-gate.sh behavioral test"
echo ""

# INPUT A: Form component with no voiceProfile → BLOCK (exit=1)
CONTENT_A='export function MyForm() { return <form><input type="text" /></form> }'
JSON_A=$(printf '{"tool_name":"Write","tool_input":{"file_path":"/app/MyForm.tsx","content":%s}}' "$(echo "$CONTENT_A" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>process.stdout.write(JSON.stringify(d)))")")
check "INPUT A (form component with no voiceProfile) → BLOCK" 1 "$JSON_A"

# INPUT B: Form with voiceProfile prop → PASS (exit=0)
CONTENT_B='export function MyForm({ voiceProfile = "colleague" }) { return <form><input /></form> }'
JSON_B=$(printf '{"tool_name":"Write","tool_input":{"file_path":"/app/MyForm.tsx","content":%s}}' "$(echo "$CONTENT_B" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>process.stdout.write(JSON.stringify(d)))")")
check "INPUT B (form with voiceProfile prop) → PASS" 0 "$JSON_B"

# INPUT C: Form with useVoiceProfile hook → PASS (exit=0)
CONTENT_C='const vp = useVoiceProfile("colleague"); return <form><textarea /></form>'
JSON_C=$(printf '{"tool_name":"Write","tool_input":{"file_path":"/app/MyForm.tsx","content":%s}}' "$(echo "$CONTENT_C" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>process.stdout.write(JSON.stringify(d)))")")
check "INPUT C (form with useVoiceProfile hook) → PASS" 0 "$JSON_C"

# INPUT D: Non-form component (no input/textarea) → PASS (exit=0)
CONTENT_D='export function DataTable({ rows }) { return <div>{rows.map(r => <span key={r.id}>{r.name}</span>)}</div> }'
JSON_D=$(printf '{"tool_name":"Write","tool_input":{"file_path":"/app/DataTable.tsx","content":%s}}' "$(echo "$CONTENT_D" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>process.stdout.write(JSON.stringify(d)))")")
check "INPUT D (non-form display component) → PASS" 0 "$JSON_D"

# INPUT E: WizardClient without voiceProfile → BLOCK (exit=1)
CONTENT_E='export default function WizardClient() { return <div><input type="text" /></div> }'
JSON_E=$(printf '{"tool_name":"Write","tool_input":{"file_path":"/platform/wizard/WizardClient.tsx","content":%s}}' "$(echo "$CONTENT_E" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>process.stdout.write(JSON.stringify(d)))")")
check "INPUT E (WizardClient without voiceProfile) → BLOCK" 1 "$JSON_E"

# INPUT F: Non-.tsx file → PASS (exit=0)
JSON_F='{"tool_name":"Write","tool_input":{"file_path":"/config/form.yaml","content":"<form> no profile"}}'
check "INPUT F (non-.tsx file) → PASS" 0 "$JSON_F"

echo ""
echo "$((PASS + FAIL)) test(s): $PASS passed, $FAIL failed"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "BEHAVIORAL GUARANTEE VIOLATED: pre-tool-use-voice-profile-gate.sh is not enforcing voice profiles on forms."
  exit 1
fi

echo "Behavioral guarantee confirmed: forms without voice profiles are blocked."
exit 0
