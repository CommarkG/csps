#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-context-question-gate
# @csps-name pre-tool-use-context-question-gate
# @csps-description T1 gate for documentation-in-schema. Blocks creation of new governed .md files
#   in docs/, tools/vault/, tools/council/ without context_question field in frontmatter.
#   Existing files: pass (only gates NEW file creation). Non-.md files: pass.
#   Files outside governed dirs: pass.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:developer
# @csps-enforces documentation-in-schema validate-context-question-coverage

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Read tool input from stdin
TOOL_INPUT=$(cat 2>/dev/null || echo "{}")

# Extract file_path and content from JSON tool input
FILE_PATH=$(echo "$TOOL_INPUT" | node -e "
  let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
    try{const j=JSON.parse(d);process.stdout.write(j.tool_input?.file_path||j.file_path||'')}
    catch{process.stdout.write('')}
  });
" 2>/dev/null || echo "")

CONTENT=$(echo "$TOOL_INPUT" | node -e "
  let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
    try{const j=JSON.parse(d);process.stdout.write(j.tool_input?.content||j.content||'')}
    catch{process.stdout.write('')}
  });
" 2>/dev/null || echo "")

# Only check .md files in governed directories
if ! echo "$FILE_PATH" | grep -qE "(docs/|tools/vault/|tools/council/).+\.md$"; then
  exit 0
fi

# Only gate NEW files (if file already exists, skip — we're editing not creating)
if [ -f "${REPO_ROOT}/${FILE_PATH}" ] || [ -f "$FILE_PATH" ]; then
  exit 0
fi

# Only check files with frontmatter
if ! echo "$CONTENT" | grep -q "^---"; then
  exit 0
fi

# Check for context_question field in frontmatter
if echo "$CONTENT" | grep -q "^context_question:"; then
  exit 0
fi

# BLOCKING: new governed .md without context_question
echo ""
echo "❌ [context-question-gate] BLOCKED: new governed file missing context_question"
echo "   File: $FILE_PATH"
echo "   Add to frontmatter:"
echo '   context_question: "Before [using/reading this], what must be verified about [prerequisite]?"'
echo ""
echo "   Purpose: documentation-in-schema — every artifact should answer"
echo "   the question that prevents a false assumption about it."
echo ""
exit 2
