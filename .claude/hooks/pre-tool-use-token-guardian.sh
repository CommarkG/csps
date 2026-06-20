#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-token-guardian
# @csps-name pre-tool-use-token-guardian
# @csps-description PreToolUse hook — T1 Token-Efficiency Guardian (B_TOKEN_BUDGET R9, PROTO-S084-TEG).
#   BLOCKING: NEW always-on surfaces (.claude/hooks/*.sh, .claude/settings.json,
#   .mcp*.json) being written without load_mode declaration are blocked.
#   An 'load_mode: eager' element without '# justification:' is BLOCKED.
#   Default: on-demand. Existing files (Edit) only checked for eager-without-justification.
#   The Guardian itself must be lazy: fires only on Write/Edit to always-on surfaces.
#
# load_mode: eager
# justification: This IS the guardian — must fire on every Write/Edit to always-on surfaces
#                to catch unjustified eager additions at creation time (not after-the-fact).
#
# @csps-version 1.1.0
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces B_TOKEN_BUDGET R9
# fix: v1.0 used python3 (unavailable on Windows); v1.1 uses node -e (S084)

set -euo pipefail

TOOL_NAME="${CLAUDE_TOOL_NAME:-}"
TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"

# Only fires on Write and Edit tool calls
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# ── Extract file path ─────────────────────────────────────────────────────────

FILE_PATH=$(echo "$TOOL_INPUT" | node -e "
let d=''; process.stdin.on('data',c=>d+=c).on('end',()=>{
  try{const o=JSON.parse(d);console.log(o.file_path||o.path||'')}catch{console.log('')}
})
" 2>/dev/null || echo "")

if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

# ── Is this an always-on surface? ────────────────────────────────────────────

ALWAYS_ON=false
SURFACE_TYPE=""

# Hook scripts (.claude/hooks/*.sh)
if echo "$FILE_PATH" | grep -qE "(^|[/\\])\.claude[/\\]hooks[/\\][^/\\]+\.sh$"; then
  ALWAYS_ON=true
  SURFACE_TYPE="hook script (.claude/hooks/*.sh)"
fi

# Settings file (UserPromptSubmit/SessionStart injections)
if echo "$FILE_PATH" | grep -qE "(^|[/\\])\.claude[/\\]settings\.json$"; then
  ALWAYS_ON=true
  SURFACE_TYPE="settings.json (hook registration)"
fi

# MCP configuration
if echo "$FILE_PATH" | grep -qE "\.mcp\.(json|yaml|yml)$"; then
  ALWAYS_ON=true
  SURFACE_TYPE="MCP config"
fi

if [ "$ALWAYS_ON" = "false" ]; then
  exit 0
fi

# ── Extract content being written/edited ────────────────────────────────────

CONTENT=$(echo "$TOOL_INPUT" | node -e "
let d=''; process.stdin.on('data',c=>d+=c).on('end',()=>{
  try{const o=JSON.parse(d);console.log(o.content||o.new_string||'')}catch{console.log('')}
})
" 2>/dev/null || echo "")

# ── For Edit: only check if the NEW content adds 'load_mode: eager' ──────────

if [[ "$TOOL_NAME" == "Edit" ]]; then
  if echo "$CONTENT" | grep -qE "load_mode:\s*eager"; then
    if ! echo "$CONTENT" | grep -qiE "#\s*(justification|reason):"; then
      echo "[token-guardian] ✗ BLOCKED (EDIT): Adding 'load_mode: eager' to $SURFACE_TYPE without justification."
      echo "[token-guardian] File: $FILE_PATH"
      echo "[token-guardian] Fix: add a justification comment on the same or adjacent line:"
      echo "[token-guardian]   load_mode: eager"
      echo "[token-guardian]   # justification: <must-load-every-turn reason>"
      echo "[token-guardian] Per B_TOKEN_BUDGET R9: eager always-on elements must justify their per-turn cost."
      exit 2
    fi
  fi
  # Edits to settings.json: check for new hook registrations without load_mode on the hook file
  # (advisory only for settings edits — the hook file itself is the primary guard)
  exit 0
fi

# ── For Write (new file or overwrite): require load_mode on new hook files ──

if [[ "$TOOL_NAME" == "Write" ]]; then
  # Skip .claude/settings.json — JSON can't have comments; hook files are the primary declaration point
  if echo "$FILE_PATH" | grep -qE "settings\.json$"; then
    exit 0
  fi

  FILE_EXISTS=false
  if [[ -f "$FILE_PATH" ]]; then
    FILE_EXISTS=true
  fi

  if [ "$FILE_EXISTS" = "true" ]; then
    # Overwriting existing file: only block eager-without-justification
    if echo "$CONTENT" | grep -qE "load_mode:\s*eager"; then
      if ! echo "$CONTENT" | grep -qiE "#\s*(justification|reason):"; then
        echo "[token-guardian] ✗ BLOCKED (OVERWRITE): 'load_mode: eager' in $FILE_PATH lacks justification."
        echo "[token-guardian] Surface: $SURFACE_TYPE"
        echo "[token-guardian] Add: # justification: <must-load-every-turn reason>"
        exit 2
      fi
    fi
    exit 0
  fi

  # NEW file — require load_mode declaration in header
  if ! echo "$CONTENT" | grep -qE "load_mode:"; then
    echo "[token-guardian] ✗ BLOCKED (NEW FILE): Missing 'load_mode' declaration in new $SURFACE_TYPE."
    echo "[token-guardian] File: $FILE_PATH"
    echo ""
    echo "[token-guardian] Add to the file header section:"
    echo "[token-guardian]   # load_mode: on-demand    (preferred — only fires when its trigger condition is met)"
    echo "[token-guardian]   # load_mode: eager         # justification: <must-load-every-turn reason>"
    echo ""
    echo "[token-guardian] Per B_TOKEN_BUDGET R9: all new always-on surfaces must declare their load mode."
    echo "[token-guardian] Default is 'on-demand'. An eager hook with no trigger condition = load on every turn."
    exit 2
  fi

  # Has load_mode — block eager without justification
  if echo "$CONTENT" | grep -qE "load_mode:\s*eager"; then
    if ! echo "$CONTENT" | grep -qiE "#\s*(justification|reason):"; then
      echo "[token-guardian] ✗ BLOCKED (NEW FILE): '$FILE_PATH' declares 'load_mode: eager' without justification."
      echo "[token-guardian] Surface: $SURFACE_TYPE"
      echo "[token-guardian] Add: # justification: <why this must fire on every turn>"
      echo "[token-guardian] Default should be 'on-demand' unless there is a clear always-on requirement."
      exit 2
    fi
  fi

  echo "[token-guardian] ✓ load_mode declaration present in new $SURFACE_TYPE: $FILE_PATH"
  exit 0
fi

exit 0