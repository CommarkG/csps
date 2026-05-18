#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-banned-phrase
# @csps-name post-stop-banned-phrase
# @csps-description PostStop hook — ADVISORY. Scans last AI response for two banned phrase classes:
#   1. Confirmation-seeking phrases (B_NO_CONFIRMATION_SEEKING)
#   2. Governor navigation directives (B_ZERO_NAVIGATION_FOR_GOVERNOR — CONSTITUTIONAL S040)
# Promoted from STUB to ADVISORY S040 (week-4 → BLOCKING exit 1 on first class,
# BLOCKING exit 1 for navigation class already).
# @csps-version 1.1.0-advisory
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_NO_CONFIRMATION_SEEKING B_ZERO_NAVIGATION_FOR_GOVERNOR

set -euo pipefail

readonly TRANSCRIPT_PATH="${CLAUDE_TRANSCRIPT_PATH:-}"
readonly SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"
readonly TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

echo "[banned-phrase] scanning — session=${SESSION_ID} timestamp=${TIMESTAMP}"

# No transcript → skip
if [ -z "$TRANSCRIPT_PATH" ] || [ ! -f "$TRANSCRIPT_PATH" ]; then
  echo "[banned-phrase] no transcript — skipping scan"
  exit 0
fi

# Extract last assistant message (reuses post-stop-rzf-reminder.sh pattern)
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
        print(text[:5000])
        break
    except: pass
except: pass
" 2>/dev/null || echo "")

MSG_LEN=${#LAST_ASSISTANT}
# Skip trivially short responses
if [ "$MSG_LEN" -lt 50 ]; then
  echo "[banned-phrase] response too short (${MSG_LEN} chars) — skipping"
  exit 0
fi

VIOLATIONS=""
NAVIGATION_VIOLATIONS=""

# ── CLASS 1: Confirmation-seeking phrases (B_NO_CONFIRMATION_SEEKING) ──────────
CONFIRMATION_PATTERNS=(
  "shall I continue"
  "should I proceed"
  "would you like me to"
  "do you want me to"
  "let me know if"
  "is that OK"
  "ready for me to"
  "tell Opus"
  "Tell Opus"
)

for pattern in "${CONFIRMATION_PATTERNS[@]}"; do
  if echo "$LAST_ASSISTANT" | grep -qi "$pattern"; then
    VIOLATIONS="${VIOLATIONS}  VIOLATION: confirmation-seeking phrase detected: '${pattern}'\n"
  fi
done

# ── CLASS 2: Governor navigation directives (B_ZERO_NAVIGATION_FOR_GOVERNOR) ───
# CONSTITUTIONAL S040 — these must become BLOCKING immediately
NAVIGATION_PATTERNS=(
  "paste the prompt from"
  "paste the block from"
  "see above for the full"
  "from my prior response"
  "from my earlier response"
  "from the prior response"
  "as I shared earlier"
  "as presented earlier"
  "refer to the block I"
  "the prompt I provided"
  "earlier in this conversation"
  "paste what I shared"
  "from before in this"
)

for pattern in "${NAVIGATION_PATTERNS[@]}"; do
  if echo "$LAST_ASSISTANT" | grep -qi "$pattern"; then
    NAVIGATION_VIOLATIONS="${NAVIGATION_VIOLATIONS}  VIOLATION: navigation directive found: '${pattern}'\n"
  fi
done

# ── Report ───────────────────────────────────────────────────────────────────────

if [ -n "$VIOLATIONS" ]; then
  echo ""
  echo "⚠ [banned-phrase] B_NO_CONFIRMATION_SEEKING — confirmation-seeking phrase(s) detected:"
  echo -e "$VIOLATIONS"
  echo "  Rule: Use the 4-condition gate instead. If all 4 met: execute. If any missing: state understanding + proposed answer."
  echo "  Week-4: this becomes exit 1 (BLOCKING)"
  echo ""
fi

if [ -n "$NAVIGATION_VIOLATIONS" ]; then
  echo ""
  echo "❌ [banned-phrase] B_ZERO_NAVIGATION_FOR_GOVERNOR VIOLATION — navigation directive(s) detected:"
  echo -e "$NAVIGATION_VIOLATIONS"
  echo "  CONSTITUTIONAL RULE (S040): Full content must be inline in THE SAME MESSAGE."
  echo "  Governor starts from zero. 'See above' = navigation failure = UX disgrace."
  echo "  REQUIRED: Repeat the full content here, ready to copy, no scrolling needed."
  echo ""
fi

if [ -z "$VIOLATIONS" ] && [ -z "$NAVIGATION_VIOLATIONS" ]; then
  echo "[banned-phrase] CLEAN — no banned phrases detected (len=${MSG_LEN})"
fi

# ADVISORY: exit 0 (week-4: Class 1 → exit 1, Class 2 → exit 1 immediately)
# NOTE: Class 2 (navigation) is already CONSTITUTIONAL — upgrade to exit 1 at next session
exit 0
