#!/usr/bin/env bash
# UserPromptSubmit hook — intake gate + session-state surfacing
# Per B_INTAKE_DISCIPLINE + session-state mechanical seed (S011)
set -euo pipefail

CAPTURE_LOG="${CSPS_CHAT_INTAKE_LOG:-${HOME}/.claude/chat-intake-capture.jsonl}"
USER_MESSAGE="${CLAUDE_USER_PROMPT:-${1:-}}"
MSG_LEN="${#USER_MESSAGE}"
TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

mkdir -p "$(dirname "$CAPTURE_LOG")" 2>/dev/null || true

TRIGGER_DETECTED=false
TRIGGER_REASONS=()

if echo "$USER_MESSAGE" | grep -Eqi '(uploaded|attached|see (the|attached) file|treasure|paste below)'; then
  TRIGGER_DETECTED=true; TRIGGER_REASONS+=("upload_or_paste_mention")
fi
if echo "$USER_MESSAGE" | grep -Eq 'https?://'; then
  TRIGGER_DETECTED=true; TRIGGER_REASONS+=("url_paste")
fi
if [ "$MSG_LEN" -gt 2000 ]; then
  TRIGGER_DETECTED=true; TRIGGER_REASONS+=("long_content")
fi

echo "{\"timestamp\":\"$TIMESTAMP\",\"msg_len\":$MSG_LEN,\"trigger\":$TRIGGER_DETECTED}" >> "$CAPTURE_LOG" 2>/dev/null || true

if [ "$TRIGGER_DETECTED" = "true" ]; then
  echo "[user-prompt-intake] Pattern detected: ${TRIGGER_REASONS[*]:-none}"
  echo "[user-prompt-intake] AGENTS.md hard NO: run docs/plan/_intake/manual-protocol.md"
else
  echo "[user-prompt-intake] No upload/paste/treasure pattern detected. Standard chat."
fi

# ─── SESSION STATE SURFACING — mechanical seed across sessions ──────────────
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
STATE_FILE="${REPO_ROOT}/tools/session-state.json"

if [ -f "$STATE_FILE" ]; then
  # Extract key info using grep (no python/node dependency)
  SESSION=$(grep -o '"current_session": "[^"]*"' "$STATE_FILE" | grep -o '"[^"]*"$' | tr -d '"' 2>/dev/null || echo "?")
  MANDATE=$(grep -o '"primary": "[^"]*"' "$STATE_FILE" | head -1 | grep -o '"[^"]*"$' | tr -d '"' 2>/dev/null || echo "")
  BLOCK1=$(grep -o '"id": "VLT[^"]*"' "$STATE_FILE" | head -1 | grep -o '"VLT[^"]*"' | tr -d '"' 2>/dev/null || echo "")
  
  if [ -n "$MANDATE" ]; then
    echo "[session-state] ${SESSION}: ${MANDATE}"
    [ -n "$BLOCK1" ] && echo "[session-state] BLOCKING: ${BLOCK1} — read tools/session-state.json"
  fi
fi

exit 0
