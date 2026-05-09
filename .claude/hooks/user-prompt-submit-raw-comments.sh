#!/usr/bin/env bash
# @csps-id csps.claude.hooks.user-prompt-submit-raw-comments
# @csps-name user-prompt-submit-raw-comments
# @csps-description UserPromptSubmit hook — saves every Governor comment raw and unchanged
#   with session ID + date + time. Per Governor directive S021: "I have a future idea on how
#   to use them." Append-only log. Never modifies, never filters, never summarizes.
#   The raw comment IS the artifact.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:developer
# @csps-enforces B_GOVERNOR_PROMPTS

set -euo pipefail

RAW_COMMENT="${CLAUDE_USER_PROMPT:-${1:-}}"
SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"
TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
DATE_PART="$(date -u +"%Y-%m-%d")"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Output directory — one file per day, append-only
COMMENTS_DIR="${REPO_ROOT}/docs/plan/_handoff/VAULT/governor-comments"
mkdir -p "$COMMENTS_DIR" 2>/dev/null || true
OUTPUT_FILE="${COMMENTS_DIR}/${DATE_PART}.md"

# Skip empty prompts
[ -z "$RAW_COMMENT" ] && exit 0

# Append raw comment with metadata header
{
  echo ""
  echo "---"
  echo "## [${TIMESTAMP}] session=${SESSION_ID}"
  echo ""
  echo "${RAW_COMMENT}"
  echo ""
} >> "$OUTPUT_FILE" 2>/dev/null || true

# Silent — no output to avoid cluttering session start
exit 0
