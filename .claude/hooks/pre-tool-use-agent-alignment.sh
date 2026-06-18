#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-agent-alignment
# @csps-name pre-tool-use-agent-alignment
# @csps-description B_BOUNDARY_ALIGNMENT_PROTOCOL Type B — Agent() call prompt must
#   contain UNDERSTANDING BLOCK preamble before spawn. Checks for any of:
#   "INTENT ABSORBED" / "BOUNDARY CROSSING" / "UNDERSTANDING BLOCK" / "I understand the request".
#   BLOCKING (S044 PROTO-034 Step 4 — K=2 overdue, INV-004 upgrade).
# @csps-version 1.1.0-blocking
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

# CONTEXT BUDGET gate (S084 Haiku-overflow incident) — BLOCKING.
# Root cause: in a heavy-MCP env the inherited tool-definition surface alone overflows a subagent's
# context window BEFORE the task loads. The spawn-vs-inline decision must be MECHANICAL, not remembered
# (PARK-037: no dependency on cognitive/context pressure). Every Agent spawn must carry a CONTEXT-BUDGET:
# attestation line proving the spawner ran the gate (spawn-warranted + tools-restricted + pointers-only).
if ! echo "$PROMPT" | grep -qiE "CONTEXT-BUDGET"; then
  printf '{"continue": false, "stopReason": "BLOCKED [agent-alignment] CONTEXT-BUDGET gate (S084 Haiku-overflow): every Agent() spawn must address the context budget. If the task is <=3 grep/read/SQL checks, DO NOT SPAWN — run it INLINE (Read/Grep/Bash); a spawn that overflows produces zero work. If a spawn IS warranted: restrict tools (Explore, not the full MCP surface) + pass file PATHS + line ranges (never file contents/corpus), then add this line to the prompt: CONTEXT-BUDGET: spawn-warranted | tools-restricted | pointers-only. Ref: tools/templates/haiku-spawn-template.md 1.5 + feedback_subagent_spawn_context_budget."}'
  exit 1
fi

# Extra advisory signal: a large prompt is a payload-not-pointer smell even with attestation present.
PROMPT_LEN=${#PROMPT}
if (( PROMPT_LEN > 8000 )); then
  echo "[agent-alignment] ADVISORY: Agent prompt is ${PROMPT_LEN} chars — verify you are passing POINTERS (paths+ranges), not pasted file contents." 1>&2
fi

# Check for UNDERSTANDING BLOCK patterns (any form counts)
if echo "$PROMPT" | grep -qiE \
  "INTENT ABSORBED|BOUNDARY CROSSING|UNDERSTANDING BLOCK|I understand the request|alignment preamble|CSPS alignment|You are.*CSPS"; then
  exit 0
fi

# BLOCKING — missing understanding block in agent prompt
printf '{"continue": false, "stopReason": "BLOCKED [agent-alignment] B_BOUNDARY_ALIGNMENT_PROTOCOL Type B: Agent() prompt missing UNDERSTANDING BLOCK. Add to start of agent prompt: BOUNDARY CROSSING — Type B (AI→subagent): / I understand the request as: [Layer 3 intent] / I will produce: [specific output] / This serves: [platform goal]. INV-004 enforcement — S044 PROTO-034 Step 4 upgrade from ADVISORY to BLOCKING."}'

exit 1
