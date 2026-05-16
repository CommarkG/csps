#!/usr/bin/env bash
# post-stop-error-harvest.sh — S036 Turn 76 §2 (Governor confirmed 2026-05-16)
# Scans last Governor message for correction keywords.
# When detected, injects HARVEST GATE prompt before Sonnet responds.
# Prevents error pattern recurrence by forcing EP-ERR creation on correction.

set -euo pipefail

readonly SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"
readonly TRANSCRIPT_PATH="${CLAUDE_TRANSCRIPT_PATH:-}"
readonly TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

if [ -z "$TRANSCRIPT_PATH" ] || [ ! -f "$TRANSCRIPT_PATH" ]; then
  exit 0
fi

# Read last user message from transcript (Python for reliability)
LAST_MESSAGE=$(python3 -c "
import json, sys
try:
  with open('$TRANSCRIPT_PATH') as f:
    lines = [l.strip() for l in f if l.strip()]
    for line in reversed(lines):
      try:
        msg = json.loads(line)
        if msg.get('type') == 'user':
          content = msg.get('message', {}).get('content', '')
          if isinstance(content, list):
            content = ' '.join(c.get('text','') for c in content if isinstance(c, dict))
          print(content[:500])
          break
      except: pass
except: pass
" 2>/dev/null || echo "")

# Correction keywords (case-insensitive)
KEYWORDS=("stop" "wrong" "no," "this is not" "you forgot" "that's wrong" "incorrect" "mistake" "error in" "you missed")

FOUND_KEYWORD=""
MSG_LOWER=$(echo "$LAST_MESSAGE" | tr '[:upper:]' '[:lower:]')

for kw in "${KEYWORDS[@]}"; do
  if echo "$MSG_LOWER" | grep -q "$kw"; then
    FOUND_KEYWORD="$kw"
    break
  fi
done

if [ -n "$FOUND_KEYWORD" ]; then
  printf '{"hookSpecificOutput":{"hookEventName":"Stop","additionalContext":"HARVEST GATE (post-stop-error-harvest.sh): Governor correction detected (keyword: %s). BEFORE responding: (1) Is this a recurring error pattern? (2) If yes — create EP-ERR-NNN-[pattern-kebab].md in docs/plan/_handoff/VAULT/error-registry/ NOW, before responding. (3) Check existing patterns first: ls docs/plan/_handoff/VAULT/error-registry/. (4) Pattern format: id + pattern_name + trigger + sample_incident + mechanical_prevention + principle_reference + status."}}\n' "$FOUND_KEYWORD"
fi

exit 0
