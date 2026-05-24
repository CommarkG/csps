#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-zf-termination-gate
# @csps-name pre-tool-use-zf-termination-gate
# @csps-description PreToolUse hook — fires on Write/Edit to tools/council/ files.
#   Blocks if new content claims "ZF ACHIEVED" but Cycle 2+ has no filename citation.
#   Complements validate-zf-cycle-format.mjs (T2 — runs in pnpm verify after write).
#   This is T1 — catches the violation BEFORE the file is written.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_ZF_TERMINATION_DISCIPLINE validate-zf-cycle-format
# Source: tools/vault/ai-conception/B_ZF_TERMINATION_DISCIPLINE.md
# T2: tools/validators/validate-zf-cycle-format.mjs (already scans sonnet-turn.md)
# Rollback: remove this file — all council writes unblocked immediately

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

# Only fires on Write or Edit
[[ "$TOOL_NAME" != "Write" ]] && [[ "$TOOL_NAME" != "Edit" ]] && exit 0

# Extract file path
FILE_PATH=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try { const j=JSON.parse(d); process.stdout.write(j.tool_input?.file_path||''); }
    catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

# Only fires on files in tools/council/
if [[ "$FILE_PATH" != */tools/council/* ]] && [[ "$FILE_PATH" != *tools/council/* ]]; then
  exit 0
fi

# Extract new content
CONTENT=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try {
      const j=JSON.parse(d);
      process.stdout.write(j.tool_input?.content || j.tool_input?.new_string || '');
    } catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

# If content doesn't contain ZF ACHIEVED → pass
echo "$CONTENT" | grep -q "ZF ACHIEVED" || exit 0

# Check that at least one Cycle 2+ line contains a filename
# Filename pattern: word.extension (same as validate-zf-cycle-format.mjs)
FILE_PATTERN='[[:alnum:]_-][[:alnum:]_-]*\.(md|mjs|sh|ts|tsx|yaml|yml|json|sql|prisma|zmodel)'

HAS_FILE_IN_CYCLE=false
while IFS= read -r line; do
  # Match "Cycle N:" where N >= 2 (including "ZF Cycle N:")
  if echo "$line" | grep -qE '(ZF\s+)?Cycle\s+[2-9][0-9]*[:\s]|Cycle\s+[1-9][0-9]+[:\s]'; then
    if echo "$line" | grep -qE "$FILE_PATTERN"; then
      HAS_FILE_IN_CYCLE=true
      break
    fi
  fi
done <<< "$CONTENT"

if [ "$HAS_FILE_IN_CYCLE" = "false" ]; then
  FILE_NAME=$(basename "$FILE_PATH")
  printf '{
    "decision": "block",
    "systemMessage": "ZF TERMINATION GATE [BLOCKING]: ZF ACHIEVED claimed but Cycle 2+ cites no specific files.\nFile: %s\n\nCycle 2 must NAME what was re-examined:\n  Example: \"Cycle 2: re-examined tools/config/unified-plan.yaml line 994 and\n  validate-pe-dashboard.mjs output — 0 new findings.\"\n\nRule: ZF ACHIEVED is valid ONLY when the last cycle named specific files/validators.\n\"Cycle 2: no new findings\" without naming = nominal ZF = BLOCKED.\n\nSee: tools/vault/ai-conception/B_ZF_TERMINATION_DISCIPLINE.md"
  }' "$FILE_NAME"
  exit 1
fi

exit 0
