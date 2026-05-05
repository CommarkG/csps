#!/usr/bin/env bash
# ============================================================================
# .claude/hooks/user-prompt-submit-intake.sh
# ============================================================================
# UserPromptSubmit hook — fires BEFORE the AI sees the user's message.
# This is the mechanical chat-channel intake gate that was missing pre-S002 turn 5.
#
# Purpose: scan the user's incoming chat message for upload/paste/treasure-mention
# patterns. If detected, output a guardrail message that the AI MUST respond to
# by running the manual-protocol.md. The hook does NOT block the message; it
# nudges + logs, so the AI cannot silently bypass.
#
# Source-of-truth: docs/plan/_intake/manual-protocol.md
#                  docs/plan/_intake/source-types.md (HUMAN_CHAT enum value)
# Enforces: P-META-005 Learning Loop, P-META-004 Stewardship, AGENTS.md hard NO
#           "Never proceed past a user upload, paste, or shared URL without
#            running the manual intake protocol..."
# ============================================================================

set -euo pipefail

CAPTURE_LOG="${CSPS_CHAT_INTAKE_LOG:-${HOME}/.claude/chat-intake-capture.jsonl}"
SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"
TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
USER_MESSAGE="${CLAUDE_USER_PROMPT:-${1:-}}"

mkdir -p "$(dirname "$CAPTURE_LOG")"

# Pattern detection: trigger phrases per manual-protocol.md Step 5 ("When this protocol fires")
TRIGGER_DETECTED=false
TRIGGER_REASONS=()

# 1. File-attachment / upload mentions
if echo "$USER_MESSAGE" | grep -Eqi '(uploaded|attached|see (the|attached) file|here.{1,10}(file|doc|pdf|content)|treasure|paste below)'; then
  TRIGGER_DETECTED=true
  TRIGGER_REASONS+=("upload_or_paste_mention")
fi

# 2. URL paste (any http/https URL in the message)
if echo "$USER_MESSAGE" | grep -Eq 'https?://'; then
  TRIGGER_DETECTED=true
  TRIGGER_REASONS+=("url_paste")
fi

# 3. Save / remember / include / capture instructions
if echo "$USER_MESSAGE" | grep -Eqi '(save (this|that)|remember (this|that)|include (this|that)|capture (this|that)|don.{1,3}t forget|process (this|that))'; then
  TRIGGER_DETECTED=true
  TRIGGER_REASONS+=("save_remember_include_directive")
fi

# 4. Long content (>2000 chars) — likely a paste of substantial material
MSG_LEN="${#USER_MESSAGE}"
if [ "$MSG_LEN" -gt 2000 ]; then
  TRIGGER_DETECTED=true
  TRIGGER_REASONS+=("long_content_$MSG_LEN_chars")
fi

# 5. Code-block or document-fence patterns (may indicate paste of structured content)
if echo "$USER_MESSAGE" | grep -Eq '^(===|---|```)' || echo "$USER_MESSAGE" | grep -Eq '\n(===|---|```)'; then
  TRIGGER_DETECTED=true
  TRIGGER_REASONS+=("structured_content_fence")
fi

# Log every fire (whether trigger detected or not — for audit precision tuning)
TRIGGER_REASONS_JSON="$(printf '%s\n' "${TRIGGER_REASONS[@]:-}" | python -c "import sys,json; print(json.dumps([l.strip() for l in sys.stdin if l.strip()]))" 2>/dev/null || echo "[]")"
cat >> "$CAPTURE_LOG" <<EOF
{"event":"user-prompt-submit","session_id":"$SESSION_ID","timestamp":"$TIMESTAMP","msg_len":$MSG_LEN,"trigger_detected":$TRIGGER_DETECTED,"trigger_reasons":$TRIGGER_REASONS_JSON}
EOF

# Output to AI context (visible in the AI's input as a system-style note):
if [ "$TRIGGER_DETECTED" = "true" ]; then
  cat <<EOF
[user-prompt-intake] Pattern detected: ${TRIGGER_REASONS[*]:-none}
[user-prompt-intake] Source type: HUMAN_CHAT (per source-types.md)
[user-prompt-intake] AGENTS.md hard NO active: AI must run docs/plan/_intake/manual-protocol.md
[user-prompt-intake]   1. Acknowledge with assigned EXT-ID
[user-prompt-intake]   2. Save raw to docs/plan/_intake/processed/EXT-<ID>-<slug>/
[user-prompt-intake]   3. Run prompt-injection scan
[user-prompt-intake]   4. Extract + classify into LEAF-level contexts (use sub-IDs for multi-section)
[user-prompt-intake]   5. Append to docs/plan/_intake/extractions-ledger.md
[user-prompt-intake]   6. Surface every EXT-ID in closing summary
[user-prompt-intake] If treasure has no clear leaf: route via docs/plan/_intake/unknown-path-protocol.md
[user-prompt-intake] Failure to do so = P-META-005 violation; logged to chat-intake-capture.jsonl
EOF
else
  echo "[user-prompt-intake] No upload/paste/treasure pattern detected. Standard chat."
fi

exit 0
