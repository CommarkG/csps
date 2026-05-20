#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-rule14-read-before-write
# @csps-name pre-tool-use-rule14-read-before-write
# @csps-description PreToolUse BLOCKING hook — Rule 14 (Read Before Write).
#   Fires before Write tool calls from the Opus tab.
#   If tools/council/sonnet-turn.md was committed more recently than
#   tools/council/opus-turn.md → BLOCK with exit 2.
#   This mechanically prevents Opus from writing a PROTO directive before reading
#   Sonnet's latest report. AP-001 applied to itself: this rule is ENFORCED, not DOCUMENTED.
#   Training default: "write directive without checking what Sonnet last said."
#   Satisfaction point: "I know what Sonnet did from context."
#   Override: check the file — context degrades; the file is permanent.
#   BLOCKING (exit 2). This is not advisory. Governance that is advisory is documentation.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces communication-protocol-shared.md Rule 14 AP-001 B_EXISTS_NOT_EQUALS_ACTIVE

set -euo pipefail

SONNET_TURN="tools/council/sonnet-turn.md"
OPUS_TURN="tools/council/opus-turn.md"

# Only check when writing to council files or across session boundaries
# This hook fires on ALL Write calls — filter for Opus directive writes
TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"
FILE_PATH=$(echo "$TOOL_INPUT" | node -e "
try {
  let d = '';
  process.stdin.on('data', c => d += c);
  process.stdin.on('end', () => {
    try {
      const j = JSON.parse(d);
      console.log(j.file_path || j.path || '');
    } catch { console.log(''); }
  });
} catch { console.log(''); }
" 2>/dev/null || echo "")

# Only fire for writes to opus-turn.md (Opus directive writes)
NORMALIZED=$(echo "$FILE_PATH" | tr '\\' '/')
IS_OPUS_TURN=$(echo "$NORMALIZED" | grep -q "opus-turn.md" && echo "true" || echo "false")
if [ "$IS_OPUS_TURN" = "false" ]; then
  exit 0
fi

# Check if git is available
if ! command -v git >/dev/null 2>&1; then
  exit 0
fi

# Get git commit timestamps (seconds since epoch)
SONNET_TS=$(git log -1 --format="%ct" -- "$SONNET_TURN" 2>/dev/null || echo "0")
OPUS_TS=$(git log -1 --format="%ct" -- "$OPUS_TURN" 2>/dev/null || echo "0")

# If sonnet-turn.md has no commits yet, nothing to read — pass
if [ "$SONNET_TS" = "0" ]; then
  exit 0
fi

# If sonnet-turn.md was committed more recently than opus-turn.md → BLOCK
if [ "$SONNET_TS" -gt "$OPUS_TS" ]; then
  echo ""
  echo "⛔ [RULE-14 BLOCK] Sonnet has an unread report in tools/council/sonnet-turn.md"
  echo "  Sonnet last committed: $(git log -1 --format='%ci' -- '$SONNET_TURN' 2>/dev/null)"
  echo "  Opus last wrote: $(git log -1 --format='%ci' -- '$OPUS_TURN' 2>/dev/null || echo 'never')"
  echo ""
  echo "  READ tools/council/sonnet-turn.md (top section) BEFORE writing any PROTO directive."
  echo "  This is BLOCKING because advisory didn't work. AP-001: EXISTS ≠ ACTIVE."
  echo "  Ref: communication-protocol-shared.md Rule 14"
  echo ""
  exit 2
fi

exit 0
