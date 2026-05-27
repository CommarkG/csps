#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-inventory-scan-required
# @csps-name pre-tool-use-inventory-scan-required
# @csps-description PreToolUse hook — ADVISORY S067. P-META-029 HUMBLE-CONSOLIDATION.
#   When Edit/Write contains proposal-language without inventory-scan context,
#   emits advisory warning. BLOCKING in S068 after adoption period.
#   Per Item 2 ratification: phased rollout ADVISORY→BLOCKING.
#   PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 5.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE P-META-029
# inherits_from: PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 5

set -euo pipefail
readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Read stdin
STDIN=$(cat)

# Only fire on Write/Edit tool calls
TOOL_NAME=$(echo "$STDIN" | node -e "process.stdin.setEncoding('utf8');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(j.tool_name||j.toolName||'');}catch(e){}});" 2>/dev/null || echo "")
if [ "$TOOL_NAME" != "Write" ] && [ "$TOOL_NAME" != "Edit" ]; then exit 0; fi

# Get content
CONTENT=$(echo "$STDIN" | node -e "process.stdin.setEncoding('utf8');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);const i=j.tool_input||j.toolInput||{};process.stdout.write(i.content||i.new_string||'');}catch(e){}});" 2>/dev/null || echo "")

# Check for proposal-language (D7 action-bias pattern)
PROPOSAL_PATTERN='NEW:|add.*validator|build.*hook|create.*script|I propose|we should build|let.s create'
if ! echo "$CONTENT" | grep -qiE "$PROPOSAL_PATTERN"; then exit 0; fi

# ADVISORY: emit warning but exit 0 (BLOCKING in S068)
echo "[inventory-scan-required][ADVISORY S067] Proposal-language detected without inventory-scan context." >&2
echo "  P-META-029 HUMBLE-CONSOLIDATION: run inventory scan first:" >&2
echo "  node tools/scripts/platform-inventory-scan.mjs --query=\"<what you're building>\"" >&2
echo "  Confirm nothing equivalent exists before proceeding. BLOCKING from S068." >&2

exit 0
