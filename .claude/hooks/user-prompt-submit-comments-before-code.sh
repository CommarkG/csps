#!/usr/bin/env bash
# @csps-id csps.claude.hooks.user-prompt-submit-comments-before-code
# @csps-name user-prompt-submit-comments-before-code
# @csps-description UserPromptSubmit hook — COMMENTS-BEFORE-CODE discipline.
#   Fires when user input contains a multi-batch PROTO pattern (B1→BN / BATCH 1→N).
#   Injects a reminder: respond with COMMENTS FIRST, apply D12/D8/D11 to the proposal,
#   wait for Opus confirmation before building anything.
#   This closes the AI-D2 default (authority-pleasing starts building without critique).
#   Governor S075 directive: "build starts only after Opus confirms direction is sound."
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_COMMENTS_BEFORE_CODE D2-authority-pleasing

set -euo pipefail

PROMPT="$("$REPO_ROOT/tools/lib/hook-read-prompt.sh")"
[ -z "$PROMPT" ] && exit 0

# Detect multi-batch PROTO pattern in user prompt
# Patterns: "B1 ... B2", "BATCH 1 ... BATCH 2", "BUILD QUEUE ... B1 B2", "≥2 batches"
MULTI_BATCH=false
if echo "$PROMPT" | grep -qiE '(B1.*B2|BATCH\s*1.*BATCH\s*2|BUILD QUEUE|multi.batch|≥2 batch|WS1.*WS2|WS2.*WS3)'; then
  MULTI_BATCH=true
fi

[ "$MULTI_BATCH" = "false" ] && exit 0

# Check if this looks like a council PROTO (has I AM: / THIS IS: markers)
if ! echo "$PROMPT" | grep -qiE '(I AM:|THIS IS:|DO NOW:|PROTO-S[0-9])'; then
  exit 0
fi

printf '{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "[COMMENTS-BEFORE-CODE] Multi-batch PROTO detected. COMMENTS FIRST — no build tool calls yet.\n\n1. Apply D12 (assumed-coverage): which claims need tool-call evidence?\n2. Apply D8 (naming-novelty): which new artifacts have existing equivalents?\n3. Apply D11 (rigid-rule-satisfaction): which rules satisfy format without intent?\n4. Flag scheduling risks (PART 3 deferred?).\n5. WAIT for Opus confirmation before executing any batch.\n\nAnti-D2: build starts ONLY after council confirms direction is sound."
  }
}'

exit 0
