#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-sacred-parts-guard
# @csps-name pre-tool-use-sacred-parts-guard
# @csps-description PreToolUse hook — blocks Write/Edit on sacred UI files without Governor ratification.
#   Sacred files: layout.tsx, middleware.ts, next.config.js, sign-in/*, sign-up/*
#   Change requires: explicit PROTO-NNN directive SHA in the task OR Governor approval in THIS response.
#   Solves: "the menu disappeared while building" — any nav/auth/layout change must be deliberate.
#   Governor directive S040: "sacred parts must be mechanically enforced, changes only with ratification."
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces B_APPS_ARE_TRIALS P-META-026

set -euo pipefail

# Only fires on Write and Edit tool calls
TOOL_NAME="${CLAUDE_TOOL_NAME:-}"
TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"

if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Extract file path from tool input
FILE_PATH=$(echo "$TOOL_INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('file_path', d.get('path', '')))
except:
    print('')
" 2>/dev/null || echo "")

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Sacred file patterns
SACRED=false
REASON=""

if echo "$FILE_PATH" | grep -qE "/(layout|middleware)\.(tsx?|js)$"; then
  SACRED=true
  REASON="layout.tsx or middleware.ts (auth routing + global styles)"
fi

if echo "$FILE_PATH" | grep -qE "/next\.config\.(js|ts)$"; then
  SACRED=true
  REASON="next.config.js (build configuration)"
fi

if echo "$FILE_PATH" | grep -qE "/(sign-in|sign-up)/"; then
  SACRED=true
  REASON="auth pages (sign-in/sign-up)"
fi

if [ "$SACRED" = "false" ]; then
  exit 0
fi

# ALLOW if this is a new app scaffold (template copy — file doesn't exist yet)
# ALLOW if the active task includes a ratification signal
ACTIVE_TASK="${CLAUDE_TASK_DESCRIPTION:-}"
if echo "$ACTIVE_TASK" | grep -qiE "proto-[0-9]+|ratif|scaffold|new app|copy.*template"; then
  exit 0
fi

# WARN but do not block (advisory mode — blocking mode requires Governor upgrade)
echo "[sacred-parts-guard] ⚠ ADVISORY: Editing sacred file: $FILE_PATH"
echo "[sacred-parts-guard] Reason: $REASON"
echo "[sacred-parts-guard] Sacred files require explicit Governor ratification before editing."
echo "[sacred-parts-guard] If you have a PROTO-NNN directive for this change, continue."
echo "[sacred-parts-guard] If not: state the rationale in this response before editing."
echo "[sacred-parts-guard] Future: OPEN-037 upgrade to BLOCKING after Governor confirms advisory is sufficient."

# Exit 0 = advisory (let the edit proceed with warning)
# Exit 2 = blocking (uncomment when Governor upgrades to blocking mode)
exit 0
