#!/usr/bin/env bash
# tools/lib/hook-read-prompt.sh — CANONICAL prompt reader for UserPromptSubmit hooks.
# AMENDMENT-1 S086: prevent-by-construction (single source, never hand-roll).
#
# Usage in any hook:
#   USER_MESSAGE="$(REPO="$REPO_ROOT" . "$REPO_ROOT/tools/lib/hook-read-prompt.sh")"
#   or more simply (if REPO_ROOT is set):
#   USER_MESSAGE="$("$REPO_ROOT/tools/lib/hook-read-prompt.sh")"
#
# Sources:
#   1. STDIN JSON field .prompt (Claude Code primary: hooks receive input as JSON on stdin)
#   2. CLAUDE_USER_PROMPT env var (fallback; Claude Code does NOT set this as of S086)
#   3. $1 positional arg (fallback for manual invocation)
#
# Output: the prompt text (stdout), empty string if none.
# Never exits non-zero (safe to use in $(...) without set -e workarounds).

STDIN_JSON="$(cat 2>/dev/null || true)"
_PROMPT=""
if [ -n "$STDIN_JSON" ]; then
  _PROMPT="$(STDIN_JSON="$STDIN_JSON" node -e \
    'try{const j=JSON.parse(process.env.STDIN_JSON||"{}");process.stdout.write(j.prompt||"")}catch(e){}' \
    2>/dev/null || true)"
fi
# Fallback chain
_PROMPT="${_PROMPT:-${CLAUDE_USER_PROMPT:-${1:-}}}"
printf '%s' "$_PROMPT"
