#!/usr/bin/env bash
# @csps-id csps.tools.tests.behavioral.scope-fence-test
# @csps-name scope-fence-test
# @csps-description Behavioral test suite for .claude/hooks/pre-tool-use-scope-fence.sh.
#   Pipes realistic PreToolUse JSON payloads at the hook and asserts exit codes.
#   Covers: in-scope allow (repo/memory-dir/scratchpad), out-of-scope block
#   (the real sibling-project leak + a generic sibling), non-write pass-through,
#   Windows backslash-path normalization, and fail-open-on-parse-error edge cases.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:test domain:governance audience:ai-agent
# @csps-enforces B_BOUNDARY_ALIGNMENT_PROTOCOL

set -uo pipefail

HOOK="$(dirname "$0")/../../../.claude/hooks/pre-tool-use-scope-fence.sh"
FAIL=0

check() {
  local name="$1" expected="$2" payload="$3"
  echo "$payload" | bash "$HOOK" >/dev/null 2>&1
  local actual=$?
  if [[ "$actual" == "$expected" ]]; then
    echo "PASS  $name (exit=$actual)"
  else
    echo "FAIL  $name (expected=$expected actual=$actual)"
    FAIL=1
  fi
}

check "A: Write under CSPS repo -> ALLOW" 0 \
  '{"tool_name":"Write","tool_input":{"file_path":"c:/Users/finky/Desktop/Claude Code/Csps/tools/data/foo.yaml","content":"x"}}'

check "B: Edit under CSPS memory dir -> ALLOW" 0 \
  '{"tool_name":"Edit","tool_input":{"file_path":"c:/Users/finky/.claude/projects/c--Users-finky-Desktop-Claude-Code-Csps/memory/foo.md","old_string":"a","new_string":"b"}}'

check "C: Write under Claude temp/scratchpad -> ALLOW" 0 \
  '{"tool_name":"Write","tool_input":{"file_path":"c:/Users/finky/AppData/Local/Temp/claude/somefolder/x.txt","content":"x"}}'

check "D: Edit sibling 'Trial Marketing visuals app' (real leak) -> BLOCK" 2 \
  '{"tool_name":"Edit","tool_input":{"file_path":"c:/Users/finky/Desktop/Claude Code/Trial Marketing visuals app/.claude/checks/validate_handoff.py","old_string":"a","new_string":"b"}}'

check "E: Edit sibling 'Cisem' -> BLOCK" 2 \
  '{"tool_name":"Edit","tool_input":{"file_path":"c:/Users/finky/Desktop/Claude Code/Cisem/x.md","old_string":"a","new_string":"b"}}'

check "F1: Bash tool call -> PASS (not a write tool)" 0 \
  '{"tool_name":"Bash","tool_input":{"command":"ls -la"}}'

check "F2: Read tool call on out-of-scope path -> PASS (not a write tool)" 0 \
  '{"tool_name":"Read","tool_input":{"file_path":"c:/Users/finky/Desktop/Claude Code/Cisem/x.md"}}'

check "G: Windows backslash path under CSPS -> ALLOW (normalization proof)" 0 \
  '{"tool_name":"Write","tool_input":{"file_path":"C:\\\\Users\\\\finky\\\\Desktop\\\\Claude Code\\\\Csps\\\\x.md","content":"x"}}'

check "EDGE1: prefix-lookalike sibling 'Csps-clone' -> BLOCK (no naive prefix match)" 2 \
  '{"tool_name":"Write","tool_input":{"file_path":"c:/Users/finky/Desktop/Claude Code/Csps-clone/x.md","content":"x"}}'

check "EDGE2: malformed JSON -> fail-open ALLOW" 0 \
  'not json at all {{{'

check "EDGE3: Write with missing file_path -> fail-open ALLOW" 0 \
  '{"tool_name":"Write","tool_input":{"content":"x"}}'

if [[ "$FAIL" == "0" ]]; then
  echo "ALL SCOPE-FENCE TESTS PASSED"
else
  echo "SCOPE-FENCE TESTS FAILED"
fi
exit "$FAIL"
