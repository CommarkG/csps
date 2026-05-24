#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-add-not-replace-gate
# @csps-name pre-tool-use-add-not-replace-gate
# @csps-description PreToolUse hook — fires on Write to existing .tsx files.
#   Blocks if new content is < 50% of existing content (potential REPLACE).
#   DO NOT REPLACE comment at line 1 → 0% tolerance (any reduction blocked).
#   Exit 1 = BLOCK with JSON message. Exit 0 = pass.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:ux audience:ai-agent
# @csps-enforces B_PAGE_CONTEXT feedback_add_not_replace
# Source: docs/SIA/UX-PREVENTION-ARCHITECTURE.md Loop 4
# Rollback: remove this file — all Write operations immediately unblocked

# THRESHOLD: fraction of existing content that triggers the gate
# 0.5 = new content < 50% of existing → BLOCK
THRESHOLD=0.5

STDIN_JSON=$(cat)

# Extract tool name
TOOL_NAME=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try { const j=JSON.parse(d); process.stdout.write(j.tool_name||''); }
    catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

# Only fires on Write (full file replacement)
[[ "$TOOL_NAME" != "Write" ]] && exit 0

# Extract file path
FILE_PATH=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try { const j=JSON.parse(d); process.stdout.write(j.tool_input?.file_path||''); }
    catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

# Only fires on .tsx files
[[ "$FILE_PATH" != *.tsx ]] && exit 0

# Only fires if file already exists
[[ ! -f "$FILE_PATH" ]] && exit 0

# Extract new content
NEW_CONTENT=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try { const j=JSON.parse(d); process.stdout.write(j.tool_input?.content||''); }
    catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

# Count lines
EXISTING_LINES=$(wc -l < "$FILE_PATH" 2>/dev/null || echo "0")
NEW_LINES=$(echo "$NEW_CONTENT" | wc -l 2>/dev/null || echo "0")

# Don't block trivial files (< 20 lines existing — might be stubs)
if [ "$EXISTING_LINES" -lt 20 ]; then
  exit 0
fi

# Check for DO NOT REPLACE at line 1 (strict mode)
FIRST_LINE=$(head -n 1 "$FILE_PATH" 2>/dev/null || echo "")
if echo "$FIRST_LINE" | grep -q "DO NOT REPLACE"; then
  # Strict: any write to a protected file is blocked unless it grows the file
  if [ "$NEW_LINES" -le "$EXISTING_LINES" ]; then
    REMOVED_PCT=$(( (EXISTING_LINES - NEW_LINES) * 100 / EXISTING_LINES ))
    printf '{
      "decision": "block",
      "systemMessage": "ADD NOT REPLACE GATE [BLOCKING]: File has // DO NOT REPLACE protection.\nExisting: %d lines. New: %d lines. Removing %d%% of content.\n\nThis file requires explicit Governor directive: \"REPLACE %s\"\nWithout that directive, this Write is BLOCKED.\n\nOptions:\n  1. Use Edit tool to add/modify specific sections\n  2. Add new content BELOW existing content\n  3. Get Governor directive if replacement is truly needed\n\nSee: AGENTS.md ADD not REPLACE rule (S059)."
    }' "$EXISTING_LINES" "$NEW_LINES" "$REMOVED_PCT" "$(basename "$FILE_PATH")"
    exit 1
  fi
  exit 0
fi

# Standard check: new content < THRESHOLD of existing
# Use awk for float comparison
SHOULD_BLOCK=$(awk -v existing="$EXISTING_LINES" -v new_l="$NEW_LINES" -v thresh="$THRESHOLD" '
  BEGIN {
    if (existing > 0 && new_l < existing * thresh) print "yes"; else print "no"
  }
')

if [ "$SHOULD_BLOCK" = "yes" ]; then
  REMOVED_PCT=$(( (EXISTING_LINES - NEW_LINES) * 100 / EXISTING_LINES ))
  printf '{
    "decision": "block",
    "systemMessage": "ADD NOT REPLACE GATE [BLOCKING]: This Write would remove %d%% of existing content.\nExisting: %d lines. New: %d lines.\n\nREPLACE operations require explicit Governor directive: \"REPLACE %s\"\nWithout that directive, this operation is BLOCKED.\n\nOptions:\n  1. Add a new section BELOW existing content\n  2. Use Edit tool to modify specific sections\n  3. Get Governor directive if replacement is truly needed\n\nSee: AGENTS.md — ADD not REPLACE rule (S059).\nSource: docs/SIA/UX-PREVENTION-ARCHITECTURE.md Loop 4"
  }' "$REMOVED_PCT" "$EXISTING_LINES" "$NEW_LINES" "$(basename "$FILE_PATH")"
  exit 1
fi

exit 0
