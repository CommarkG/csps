#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-tool-use-design-token-check
# @csps-name post-tool-use-design-token-check
# @csps-description PostToolUse hook — advisory only, never blocks.
#   Fires on Write/Edit to .tsx or .ts files.
#   Checks for hardcoded hex colors NOT in design-tokens.yaml.
#   Advisory during adoption period — upgrade to blocking at 80% token adoption.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:ux audience:ai-agent
# @csps-enforces B_PAGE_CONTEXT design-tokens
# Source: docs/SIA/UX-PREVENTION-ARCHITECTURE.md Loop 3
# Rollback: remove this file — no change to any file behavior (advisory only)
# NOTE: Always exits 0. Advisory messages only. NEVER blocks.

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TOKENS_FILE="${REPO_ROOT}/tools/config/design-tokens.yaml"

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

# Extract file path (PostToolUse: tool_input contains original params)
FILE_PATH=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try { const j=JSON.parse(d); process.stdout.write(j.tool_input?.file_path||''); }
    catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

# Only fires on .tsx or .ts files
if [[ "$FILE_PATH" != *.tsx ]] && [[ "$FILE_PATH" != *.ts ]]; then
  exit 0
fi

# Read actual file content from disk (it's already been written for PostToolUse)
[[ ! -f "$FILE_PATH" ]] && exit 0
FILE_CONTENT=$(cat "$FILE_PATH" 2>/dev/null || echo "")

# Extract all hex colors from the file (6-digit and 3-digit)
HEX_COLORS=$(echo "$FILE_CONTENT" | grep -oE '#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}' | sort -u 2>/dev/null || echo "")

[[ -z "$HEX_COLORS" ]] && exit 0

# Skip if design tokens file doesn't exist
[[ ! -f "$TOKENS_FILE" ]] && exit 0

# Extract all hex values from design-tokens.yaml
TOKEN_VALUES=$(grep -oE '"#[0-9a-fA-F]{6}"|"#[0-9a-fA-F]{3}"' "$TOKENS_FILE" 2>/dev/null | tr -d '"' | sort -u || echo "")

# Check each hex color found in file
UNREGISTERED=()
while IFS= read -r hex; do
  [[ -z "$hex" ]] && continue
  # Skip if line containing this color has // token-exception
  if echo "$FILE_CONTENT" | grep -F "$hex" | grep -q "token-exception"; then
    continue
  fi
  # Check if this hex exists in design tokens
  if ! echo "$TOKEN_VALUES" | grep -qiF "$hex"; then
    UNREGISTERED+=("$hex")
  fi
done <<< "$HEX_COLORS"

# Advisory message (never blocks)
if [ "${#UNREGISTERED[@]}" -gt 0 ]; then
  UNREGISTERED_LIST=$(printf '%s, ' "${UNREGISTERED[@]}" | sed 's/, $//')
  FILE_NAME=$(basename "$FILE_PATH")
  printf '{
    "systemMessage": "DESIGN TOKEN ADVISORY: Hardcoded color(s) detected in %s: %s\n\nThese values may already exist as tokens in tools/config/design-tokens.yaml.\nUsing tokens ensures all CSPS apps update together when values change.\nCheck the token registry and replace if a token exists.\n\nTo suppress: add // token-exception: [reason] to the line.\n(Advisory only — not blocking during adoption period)"
  }' "$FILE_NAME" "$UNREGISTERED_LIST"
fi

# Always exit 0 — advisory only
exit 0
