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

# CONTEXT BUDGET advisory (S084 Haiku-overflow incident) — NON-BLOCKING nudge.
# Large embedded prompt content is a proxy for payload-not-pointer; in a heavy-MCP env the
# inherited tool surface + pasted content overflows the subagent context window before it runs.
# Pointers (paths + line ranges) over payloads; small mechanical scans run INLINE, not spawned.
PROMPT_LEN=${#PROMPT}
if (( PROMPT_LEN > 8000 )); then
  echo "[agent-alignment] ADVISORY CONTEXT-BUDGET: Agent prompt is ${PROMPT_LEN} chars — likely pasting payload, not pointers. Pass file PATHS + line ranges (not contents); restrict tools (Explore, not full MCP surface); run ≤3-op mechanical scans INLINE. See tools/templates/haiku-spawn-template.md §1.5 + feedback_subagent_spawn_context_budget." 1>&2
fi

# Check for UNDERSTANDING BLOCK patterns (any form counts)
if echo "$PROMPT" | grep -qiE \
  "INTENT ABSORBED|BOUNDARY CROSSING|UNDERSTANDING BLOCK|I understand the request|alignment preamble|CSPS alignment|You are.*CSPS"; then
  exit 0
fi

# BLOCKING — missing understanding block in agent prompt
printf '{"continue": false, "stopReason": "BLOCKED [agent-alignment] B_BOUNDARY_ALIGNMENT_PROTOCOL Type B: Agent() prompt missing UNDERSTANDING BLOCK. Add to start of agent prompt: BOUNDARY CROSSING — Type B (AI→subagent): / I understand the request as: [Layer 3 intent] / I will produce: [specific output] / This serves: [platform goal]. INV-004 enforcement — S044 PROTO-034 Step 4 upgrade from ADVISORY to BLOCKING."}'

exit 1
