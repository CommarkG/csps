#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-rzf-reminder
# @csps-name post-stop-rzf-reminder
# @csps-description PostStop hook (ACTIVE S037-B). Scans the last assistant message for
# "## RZF VERIFICATION". If the response is >200 chars AND the RZF section is missing,
# injects a system message forcing the AI to run Zero-Findings cycles before continuing.
# Implements OPEN-006. Per L1-principles: every substantive architectural turn must end
# with RZF evidence. Advisory injection — exit 1 with continue:false.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces P-META-006 P-META-008

set -euo pipefail

readonly TRANSCRIPT_PATH="${CLAUDE_TRANSCRIPT_PATH:-}"
readonly SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"

# If no transcript, skip gracefully
if [ -z "$TRANSCRIPT_PATH" ] || [ ! -f "$TRANSCRIPT_PATH" ]; then
  exit 0
fi

# Extract last assistant message text from JSONL transcript
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
          text = ' '.join(
            c.get('text', '') for c in content
            if isinstance(c, dict) and c.get('type') == 'text'
          )
        elif isinstance(content, str):
          text = content
        else:
          text = ''
        print(text[:2000])
        break
    except:
      pass
except:
  pass
" 2>/dev/null || echo "")

# Skip if response is short (non-substantive) or empty
MSG_LEN=${#LAST_ASSISTANT}
if [ "$MSG_LEN" -lt 200 ]; then
  exit 0
fi

# Check for RZF VERIFICATION section
if echo "$LAST_ASSISTANT" | grep -q "## RZF VERIFICATION"; then
  exit 0
fi

# Check for DONE/COMPLETE/RATIFIED/IMPLEMENTED/CLOSED claims — only fire on substantive claims
HAS_SUBSTANTIVE_CLAIM=0
CLAIM_KEYWORDS=("DONE" "COMPLETE" "RATIFIED" "IMPLEMENTED" "CLOSED" "verified" "exit_code=0" "pnpm verify" "all validators" "structural" "architectural" "governance" "principle" "contract")

MSG_UPPER=$(echo "$LAST_ASSISTANT" | tr '[:lower:]' '[:upper:]')
for keyword in "${CLAIM_KEYWORDS[@]}"; do
  if echo "$MSG_UPPER" | grep -qi "${keyword^^}"; then
    HAS_SUBSTANTIVE_CLAIM=1
    break
  fi
done

if [ "$HAS_SUBSTANTIVE_CLAIM" -eq 0 ]; then
  exit 0
fi

# Inject RZF gate — output JSON for Claude Code hook injection
printf '%s\n' '{"continue":false,"systemMessage":"RZF GATE: This response made substantive architectural claims without running Zero-Findings cycles. Per L1-principles (P-META-006 + P-META-008): every substantive architectural turn must end with ## RZF VERIFICATION + Cycle 1 (what did I miss?) + Status (ZF ACHIEVED or findings list). Run ZF now before the Governor acts on this output. Format: ## RZF VERIFICATION\\nCycle 1: [findings or 0]\\nStatus: ZF ACHIEVED"}'
exit 1
