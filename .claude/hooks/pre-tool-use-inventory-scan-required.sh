#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-inventory-scan-required
# @csps-name pre-tool-use-inventory-scan-required
# @csps-description PreToolUse hook — S075 G2: BLOCKING (promoted from ADVISORY S067).
#   P-META-029 HUMBLE-CONSOLIDATION + ECA (Existing-Coverage Attestation).
#   When Edit/Write contains proposal-language (create/build/add/NEW:) without
#   an ECA block (## Checked-Against: / INVENTORY: / checked_against:), BLOCK.
#   ECA = attestation of inventory performed: name the tool call + what was found.
#   CARVE-OUT: if content contains checked_against / INVENTORY: / ## Checked-Against →
#   attestation present → pass through. Also passes if no proposal-language.
# @csps-version 2.0.0 S075-G2-BLOCKING
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces P-META-029 B_HUMBLE_CONSOLIDATION D12-assumed-coverage

set -euo pipefail
readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

STDIN=$(cat)

TOOL_NAME=$(echo "$STDIN" | node -e "process.stdin.setEncoding('utf8');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(j.tool_name||j.toolName||'');}catch(e){}});" 2>/dev/null || echo "")
if [ "$TOOL_NAME" != "Write" ] && [ "$TOOL_NAME" != "Edit" ]; then exit 0; fi

CONTENT=$(echo "$STDIN" | node -e "process.stdin.setEncoding('utf8');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);const i=j.tool_input||j.toolInput||{};process.stdout.write(i.content||i.new_string||'');}catch(e){}});" 2>/dev/null || echo "")

# Only check PROTO/plan files (docs/plan/, tools/data/hardwire-register)
FILE_PATH=$(echo "$STDIN" | node -e "process.stdin.setEncoding('utf8');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);const i=j.tool_input||j.toolInput||{};process.stdout.write(i.file_path||i.path||'');}catch(e){}});" 2>/dev/null || echo "")
if ! echo "$FILE_PATH" | grep -qiE '(docs/plan/protos|PROTO-|PLAN-|hardwire-register)'; then exit 0; fi

# Check for proposal-language
PROPOSAL_PATTERN='(^|\n)(NEW:|## BATCH|## WS[0-9]|Build:|## G[0-9]|add.*validator|build.*hook|create.*script|I propose|we should build)'
if ! echo "$CONTENT" | grep -qiE "$PROPOSAL_PATTERN"; then exit 0; fi

# Check for ECA attestation block (checked_against / INVENTORY / ## Checked-Against)
ECA_PATTERN='(checked_against:|INVENTORY:|## Checked-Against|attestation:|# WHAT ALREADY EXISTS|verified.*file evidence)'
if echo "$CONTENT" | grep -qiE "$ECA_PATTERN"; then exit 0; fi

# BLOCKING — proposal without ECA
printf '{
  "systemMessage": "[INVENTORY-SCAN-REQUIRED] BLOCKED: Proposal-language detected in %s without Existing-Coverage Attestation (ECA).\n\nECA required: cite the inventory you performed THIS turn.\nFormat: ## Checked-Against\n- ran: node tools/scripts/platform-inventory-scan.mjs\n- found: [what exists that covers this]\n- gap: [what does NOT exist, justifying this build]\n\nD12 (assumed-coverage): existence-claims without tool-call attestation are the root of duplication/bloat.\nP-META-029: inventory-first. Run inventory, cite output, then build.",
  "continue": false,
  "stopReason": "proposal without ECA — inventory-first required"
}' "$FILE_PATH"
exit 1
