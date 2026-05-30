#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-ux-creation-gate
# @csps-name pre-tool-use-ux-creation-gate
# @csps-description PreToolUse hook — fires on Write to page.tsx files.
#   Blocks if content is missing pageDNA with a purpose field.
#   Ensures every new page answers Q4 (Why am I here?) before creation.
#   Does NOT fire on Edit (only on full file creation via Write).
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:ux audience:ai-agent
# @csps-enforces B_PAGE_CONTEXT P-META-019
# Source: docs/SIA/UX-PREVENTION-ARCHITECTURE.md Loop 1
# Rollback: remove this file — all page.tsx writes immediately unblocked

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

# Only fires on Write (new/full file creation)
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

# Only fires on page.tsx files
if [[ "$FILE_PATH" != */page.tsx ]] && [[ "$FILE_PATH" != *page.tsx ]]; then
  exit 0
fi

# Extract content
CONTENT=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try { const j=JSON.parse(d); process.stdout.write(j.tool_input?.content||''); }
    catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

# Check for pageDNA declaration
HAS_PAGE_DNA=false
if echo "$CONTENT" | grep -q "const pageDNA"; then
  HAS_PAGE_DNA=true
fi

# Check for purpose field in pageDNA
HAS_PURPOSE=false
if echo "$CONTENT" | grep -qE 'purpose\s*:'; then
  HAS_PURPOSE=true
fi

FILE_NAME=$(basename "$(dirname "$FILE_PATH")")/page.tsx

if [ "$HAS_PAGE_DNA" = "false" ]; then
  printf '{
  
    "systemMessage": "UX CREATION GATE [BLOCKING]: New page.tsx is missing pageDNA.\nFile: %s\n\nBefore creating this page, add:\n\n  const pageDNA = {\n    purpose: \"[one plain-language sentence — what does this page help the user DO?]\",\n    options: \"[2-4 things the user can do here]\",\n    nextStep: \"[where does the user go after this page?]\",\n    // ... other fields\n  }\n\nThese are UX requirements, not metadata.\nSee: docs/SIA/UX-UI-STANDARDS.md §5 Pre-ship Checklist Q4/Q5/Q7."
  }' "$FILE_NAME"
  exit 0
fi

if [ "$HAS_PURPOSE" = "false" ]; then
  printf '{
  
    "systemMessage": "UX CREATION GATE [BLOCKING]: pageDNA is missing the purpose field.\nFile: %s\n\nAdd to pageDNA:\n  purpose: \"[one plain-language sentence — what does this page help the user DO?]\"\n\nExample:\n  purpose: \"Turn your app idea into a structured CSPS plan item — takes about 5 minutes.\"\n\nNo engineering jargon. One sentence. User-facing language.\nSee: docs/SIA/UX-UI-STANDARDS.md §5 Pre-ship Checklist Q4."
  }' "$FILE_NAME"
  exit 0
fi


# M3 S071 Facet B — Vercel mirror advisory check (SACRED-EDIT-APPROVED: M3 hook extension)
# ADD: when creating a ratifiable + user-facing governance artifact WITHOUT a /platform/<slug> mirror
# → outputs an ADVISORY (not blocking). Pre-tool-use; exit 0 always.

# Fire only on Write of .md / .yaml governance files in docs/plan/
if [[ "$TOOL_NAME" == "Write" ]] && [[ "$FILE_PATH" == */docs/plan/*.md || "$FILE_PATH" == */docs/plan/*.yaml ]]; then
  CONTENT2="$CONTENT"
  # Check if artifact is ratifiable (has status: draft or ratified)
  IS_RATIFIABLE=false
  if echo "$CONTENT2" | grep -qE '^status:s*(draft|ratified|protected)'; then
    IS_RATIFIABLE=true
  fi
  # Check if audience is user-facing (any non-ai-agent audience)
  IS_USER_FACING=false
  if echo "$CONTENT2" | grep -qE 'audience:.*developer|audience:.*account|audience:.*team|audience:.*end.user|audience:.*governor'; then
    IS_USER_FACING=true
  fi
  # If ratifiable + user-facing, advise about mirror
  if [[ "$IS_RATIFIABLE" == "true" ]] && [[ "$IS_USER_FACING" == "true" ]]; then
    SLUG=$(basename "$(dirname "$FILE_PATH")" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g')
    MIRROR_EXISTS=false
    if ls apps/csps-playground/src/app/platform/"$SLUG"/ 2>/dev/null; then
      MIRROR_EXISTS=true
    fi
    if [[ "$MIRROR_EXISTS" == "false" ]]; then
      echo "[ux-creation-gate] ADVISORY (M3 Facet B): ratifiable user-facing artifact created without /platform/$SLUG mirror." >&2
      echo "[ux-creation-gate] Per vercel-mirror-rule.md: consider building apps/csps-playground/src/app/platform/$SLUG/page.tsx" >&2
      echo "[ux-creation-gate] Advisory only — proceed. Wire mirror before ratification (INSPECT step)." >&2
    fi
  fi
fi

exit 0
