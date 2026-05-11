#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-agent-alignment
# @csps-name pre-tool-use-agent-alignment
# @csps-description B_BOUNDARY_ALIGNMENT_PROTOCOL Type B — Agent() call prompt must
#   contain UNDERSTANDING BLOCK preamble before spawn. Checks for any of:
#   "INTENT ABSORBED" / "BOUNDARY CROSSING" / "UNDERSTANDING BLOCK" / "I understand the request".
#   ADVISORY Phase 1 (S024); BLOCKING week-4 (B_STRUCTURAL_PREVENTION_DISCIPLINE K=2).
# @csps-version 1.0.0-advisory
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_BOUNDARY_ALIGNMENT_PROTOCOL B_AGENT_ALIGNMENT_PROTOCOL P-META-022

set -euo pipefail

STDIN_JSON=$(cat)

TOOL_NAME=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try { const j=JSON.parse(d); process.stdout.write(j.tool_name||''); }
    catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

# Only fire on Agent tool calls
[[ "$TOOL_NAME" != "Agent" ]] && exit 0

PROMPT=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try { const j=JSON.parse(d); process.stdout.write(j.tool_input?.prompt||''); }
    catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

# Check for UNDERSTANDING BLOCK patterns (any form counts)
if echo "$PROMPT" | grep -qiE \
  "INTENT ABSORBED|BOUNDARY CROSSING|UNDERSTANDING BLOCK|I understand the request|alignment preamble|CSPS alignment|You are.*CSPS"; then
  exit 0
fi

# Advisory — missing understanding block in agent prompt
printf '{
  "systemMessage": "⚠ [agent-alignment] ADVISORY (B_BOUNDARY_ALIGNMENT_PROTOCOL Type B): Agent() prompt missing UNDERSTANDING BLOCK.\\n\\nAdd to start of agent prompt:\\n\\n  BOUNDARY CROSSING — Type B (AI→subagent):\\n    I understand the request as: [Layer 3 intent — not Layer 1 expression]\\n    I will produce: [specific output expected back]\\n    This serves: [platform goal]\\n\\nPhase 1: advisory (proceeding). Week-4 promotion to BLOCKING per B_STRUCTURAL_PREVENTION_DISCIPLINE K=2."
}'

exit 0
