#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-rzf-reminder
# @csps-name post-stop-rzf-reminder
# @csps-description PostStop hook (ACTIVE S040). BLOCKING enforcement of RZF-before-response mandate.
# Governor directive: ZF must happen BEFORE presenting any prompt or architectural claim.
# Blocks the response if substantive content exists without ZF evidence.
#
# Checks for BOTH formats:
#   - Sonnet format: "ZF Cycle 1:" ... "Status: ZF ACHIEVED"
#   - OPUS-2 format: "## RZF VERIFICATION"
#
# B_RZF_BEFORE_PROMPT: every substantive response must contain ZF evidence.
# T1 enforcement — fires after every response, blocks if missing.
# @csps-version 2.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces P-META-006 P-META-008 B_RZF_BEFORE_PROMPT

set -euo pipefail

readonly TRANSCRIPT_PATH="${CLAUDE_TRANSCRIPT_PATH:-}"
readonly SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"

if [ -z "$TRANSCRIPT_PATH" ] || [ ! -f "$TRANSCRIPT_PATH" ]; then
  exit 0
fi

LAST_ASSISTANT=$(python3 -c "
import json, sys
try:
  with open('$TRANSCRIPT_PATH') as f:
    lines = [l.strip() for l in f if l.strip()]
  for line in reversed(lines):
    try:
      msg = json.loads(line)
      if msg.get('type') == 'assistant':
        content = msg.get('message', {}).get('content', '')
        if isinstance(content, list):
          text = ' '.join(c.get('text','') for c in content if isinstance(c,dict) and c.get('type')=='text')
        elif isinstance(content, str):
          text = content
        else:
          text = ''
        print(text[:3000])
        break
    except: pass
except: pass
" 2>/dev/null || echo "")

MSG_LEN=${#LAST_ASSISTANT}
if [ "$MSG_LEN" -lt 150 ]; then
  exit 0
fi

# Check for ZF evidence — EITHER Sonnet inline format OR OPUS-2 section format
HAS_ZF=0
if echo "$LAST_ASSISTANT" | grep -q "## RZF VERIFICATION"; then
  HAS_ZF=1
elif echo "$LAST_ASSISTANT" | grep -qE "ZF Cycle [12]:|Status: ZF ACHIEVED"; then
  HAS_ZF=1
elif echo "$LAST_ASSISTANT" | grep -qE "ZF Cycle 1.*finding|Cycle 1: 0"; then
  HAS_ZF=1
fi

if [ "$HAS_ZF" -eq 1 ]; then
  exit 0
fi

# Check for substantive content requiring ZF — broader than before
HAS_SUBSTANTIVE=0
MSG_UPPER=$(echo "$LAST_ASSISTANT" | tr '[:lower:]' '[:upper:]')

# Substantive indicators (expanded)
SUBSTANTIVE_PATTERNS=(
  "DONE" "COMPLETE" "RATIFIED" "IMPLEMENTED" "CLOSED"
  "EXIT_CODE=0" "PNPM VERIFY" "COMMIT" "PUSH"
  "ARCHITECTURAL" "GOVERNANCE" "PRINCIPLE" "CONTRACT"
  "STRUCTURAL" "PERMANENT" "ENFORCE" "BLOCKING"
  "SONNET, THIS IS OPUS" "OPUS, THIS IS SONNET"
  "PROTO-0" "STEP: " "DIRECTIVE" "HANDOFF"
)

for pattern in "${SUBSTANTIVE_PATTERNS[@]}"; do
  if echo "$MSG_UPPER" | grep -q "$pattern"; then
    HAS_SUBSTANTIVE=1
    break
  fi
done

if [ "$HAS_SUBSTANTIVE" -eq 0 ]; then
  exit 0
fi

# BLOCK — RZF missing from substantive response
printf '%s\n' '{"continue":false,"systemMessage":"🚫 RZF GATE BLOCKED: Substantive response presented WITHOUT Zero-Findings verification.\n\nGOVERNOR DIRECTIVE: ZF must happen BEFORE presenting any prompt, directive, or architectural claim.\n\nRequired format before finalizing this response:\n  ZF Cycle 1: [what could be wrong with this response?]\n  Cycle 2: Re-examined [Cycle 1 area] — [what was checked] — 0 new findings.\n  Status: ZF ACHIEVED\n\nDo NOT repeat the response. Run ZF cycles, state findings, THEN re-present with ZF evidence included."}'
exit 1
