#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-tool-use-cec-trigger
# @csps-name post-tool-use-cec-trigger
# @csps-description PostToolUse hook on Write|Edit — detects when a principle, behavioral
#   contract, or methodology doc was written/edited and injects a CEC (Complete Extraction
#   Cycle) requirement. Per P-META-006 CEC: when a new principle/insight is ratified,
#   walk the platform asking "where does this essence enhance other elements?" until 0
#   new opportunities remain. Without this trigger, CEC silently skips after every
#   new principle registration — the exact pattern that left P-META-020 at 3/5 FSE
#   surfaces after ratification.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces P-META-006 P-META-007 B_CEC B_FIVE_SURFACE_ENGRAVING

set -euo pipefail

# Read file path from stdin
FILE_PATH=$(node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try {
      const j=JSON.parse(d);
      process.stdout.write(j.tool_input?.file_path||j.tool_input?.path||'');
    } catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

[[ -z "$FILE_PATH" ]] && exit 0

# Detect ratification-triggering writes
NEEDS_CEC=false
CEC_REASON=""

if [[ "$FILE_PATH" == *"principles.yaml"* ]]; then
  NEEDS_CEC=true
  CEC_REASON="principles.yaml was modified — new or amended principle may require CEC propagation"
elif [[ "$FILE_PATH" == *"principles/P-"* ]] && [[ "$FILE_PATH" == *".yaml" ]]; then
  NEEDS_CEC=true
  CEC_REASON="principle slice file written — ratification triggers CEC obligation"
elif [[ "$FILE_PATH" == *"behavioral-contracts.md"* ]]; then
  NEEDS_CEC=true
  CEC_REASON="behavioral-contracts.md modified — new B_* contract may require CEC propagation"
elif [[ "$FILE_PATH" == *"concept-first-governance"* ]] || [[ "$FILE_PATH" == *"methodology"* ]]; then
  NEEDS_CEC=true
  CEC_REASON="methodology document written — verify propagation to validators, templates, contracts, memory"
fi

# CEC-TRIGGER-IMPROVEMENT (S055): check improvement-register for open not_yet_propagated
# items whose descriptions keyword-match this file path — positive pipeline fires at write-time
if [[ "$NEEDS_CEC" == "false" ]] && [[ -n "$FILE_PATH" ]]; then
  IMP_CHECK_SCRIPT="$(cd "$(dirname "$0")" && pwd)/../../tools/helpers/cec-improvement-check.mjs"
  if [[ -f "$IMP_CHECK_SCRIPT" ]]; then
    IMP_RESULT=$(node "$IMP_CHECK_SCRIPT" "$FILE_PATH" 2>/dev/null || echo '{"matches":[],"open_count":0}')
    MATCH_COUNT=$(echo "$IMP_RESULT" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{process.stdout.write(String(JSON.parse(d).matches?.length??0));}catch{process.stdout.write('0');}});" 2>/dev/null || echo "0")
    if [[ "$MATCH_COUNT" != "0" && "$MATCH_COUNT" != "" ]]; then
      NEEDS_CEC=true
      CEC_REASON="improvement-register: ${MATCH_COUNT} open improvement(s) have not_yet_propagated targets matching this path. Positive pipeline: verify these improvements were intentionally applied here."
    fi
  fi
fi

[[ "$NEEDS_CEC" == "false" ]] && exit 0

# Inject CEC requirement
printf '{
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "CEC TRIGGER FIRED — %s\\n\\nCOMPLETE EXTRACTION CYCLE REQUIRED (P-META-006 + B_CEC):\\nWalk every platform surface asking: WHERE does the essence of this new element enhance other artifacts?\\n\\nCEC surfaces to walk (iterate until 0 new opportunities found):\\n  1. principles.yaml cross_references — does new principle compose with existing ones?\\n  2. behavioral-contracts.md — does new element need a B_* contract body?\\n  3. audit-runner.md — does new element need a validator slug?\\n  4. inner-ai-defaults registry — does new element reframe any category file?\\n  5. closing-summary-template.md — does new element require a new §10.0x section?\\n  6. memory/ — does new element need a feedback_ entry for cross-session persistence?\\n  7. AGENTS.md — does new element need a hard NO addition?\\n  8. L2 domain files — does new element reframe any L2 spine domain doctrine?\\n\\nWHY CEC IS NON-NEGOTIABLE:\\nP-META-020 ratified at Phase 2A but reached only 3/5 FSE surfaces because CEC was\\nnot mechanically triggered. The essence (context as compass) should have propagated to:\\nmemory (done after ZF audit), B_* contract body (still missing), closing-summary §10.0k\\n(done after ZF audit). The structural failure was: no trigger fired when principles.yaml\\nwas written. This hook IS that trigger. Walk until 0 opportunities remain."
  }
}' "$CEC_REASON"

exit 0
