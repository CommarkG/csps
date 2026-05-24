#!/usr/bin/env bash
# WHO: Every AI session building platform files
# WHAT: Advisory gate — checks new files for alignment block (WHO/WHAT/PREVENTS)
# PREVENTS: Files created without documented purpose, scope, and risk context
# RISK: False positives on non-code files; overly strict for tiny utility files
# SCOPE: New files only (not edits to existing); advisory during 30-day adoption period
#
# @csps-id csps.claude.hooks.pre-tool-use-alignment-gate
# @csps-name pre-tool-use-alignment-gate
# @csps-description PreToolUse hook — fires on Write to NEW files only.
#   ADVISORY: checks first 30 lines for alignment block (WHO/WHAT/PREVENTS).
#   New files without alignment context are harder to maintain and review.
#   Advisory during adoption period — upgrade to blocking when 80% adoption reached.
# @csps-version 1.0.0-advisory
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces UX-PREVENTION-ARCHITECTURE Loop7
# Source: docs/SIA/UX-PREVENTION-ARCHITECTURE.md Loop 7
# Rollback: remove this file — advisory message removed immediately

STDIN_JSON=$(cat)

TOOL_NAME=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try { const j=JSON.parse(d); process.stdout.write(j.tool_name||''); }
    catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

# Only fires on Write (new/full file creation)
[[ "$TOOL_NAME" != "Write" ]] && exit 0

FILE_PATH=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try { const j=JSON.parse(d); process.stdout.write(j.tool_input?.file_path||''); }
    catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

# Only fires on NEW files (not edits to existing)
[[ -f "$FILE_PATH" ]] && exit 0

# Only fires on code/script files (not yaml/json/md data files)
if [[ "$FILE_PATH" != *.sh ]] && [[ "$FILE_PATH" != *.ts ]] && [[ "$FILE_PATH" != *.tsx ]] && \
   [[ "$FILE_PATH" != *.mjs ]] && [[ "$FILE_PATH" != *.js ]]; then
  exit 0
fi

CONTENT=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try { const j=JSON.parse(d); process.stdout.write(j.tool_input?.content||''); }
    catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

# Check first 30 lines for alignment block keywords
FIRST_30=$(echo "$CONTENT" | head -30)
HAS_ALIGNMENT=false
if echo "$FIRST_30" | grep -qiE '(//|#)\s+WHO:|ALIGNMENT|@csps-id'; then
  HAS_ALIGNMENT=true
fi

if [ "$HAS_ALIGNMENT" = "false" ]; then
  FILE_NAME=$(basename "$FILE_PATH")
  printf '{
    "systemMessage": "ALIGNMENT GATE [ADVISORY]: New file missing alignment block.\nFile: %s\n\nConsider adding at the top:\n  // WHO: [who uses this file or function]\n  // WHAT: [what it does]\n  // PREVENTS: [what problem it prevents]\n  // RISK: [key risk or constraint]\n  // SCOPE: [scope boundaries — what it does NOT do]\n\nAlignment blocks make files self-documenting and easier to review.\nAlternative: @csps-id frontmatter also satisfies this requirement.\n(Advisory only — not blocking during 30-day adoption period)\nSee: docs/SIA/UX-PREVENTION-ARCHITECTURE.md Loop 7"
  }' "$FILE_NAME"
fi

# Always exit 0 — advisory only
exit 0
