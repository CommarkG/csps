#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-link-discipline
# @csps-name post-stop-link-discipline
# @csps-version 2.0.0-active
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces B_ALWAYS_GIT_LINKS
#
# S059 FIX: Replaced python3 (not available on Windows) with Node.js.
# Root cause of persistent bare-path violations: python3 not found → hook silently
# exited 0 on every response. K=100+ violations, 0 actual blocks.
#
# CSPS repo: https://github.com/CommarkG/csps
# File URL:  https://github.com/CommarkG/csps/blob/main/[path]
# Dir URL:   https://github.com/CommarkG/csps/tree/main/[path]
#
# CORRECT:   [FOUNDATION-COMPLETION-PLAN.md](https://github.com/CommarkG/csps/blob/main/docs/plan/FOUNDATION-COMPLETION-PLAN.md)
# FORBIDDEN: docs/plan/FOUNDATION-COMPLETION-PLAN.md  (bare path — not clickable)
# FORBIDDEN: [name](docs/plan/...)  (workspace-relative — not clickable outside IDE)

set -euo pipefail

readonly TRANSCRIPT_PATH="${CLAUDE_TRANSCRIPT_PATH:-}"
readonly SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"

if [[ -z "$TRANSCRIPT_PATH" ]] || [[ ! -f "$TRANSCRIPT_PATH" ]]; then
  exit 0
fi

# Use Node.js (always available in CSPS) instead of python3 (not on Windows)
RESULT=$(node -e "
const fs = require('fs');
try {
  const data = JSON.parse(fs.readFileSync('$TRANSCRIPT_PATH', 'utf8'));
  const messages = data.messages || [];
  const lastAI = [...messages].reverse().find(m => m.role === 'assistant');
  if (!lastAI) { console.log('bare=0 internal=0'); process.exit(0); }
  const content = typeof lastAI.content === 'string' ? lastAI.content :
    (Array.isArray(lastAI.content) ? lastAI.content.map(c => c.text || '').join(' ') : '');

  // Remove existing correct markdown links to avoid false positives
  const cleaned = content.replace(/\[[^\]]+\]\([^)]+\)/g, '');

  // Detect bare paths (file/folder references without markdown link)
  const barePattern = /\b[\w][\w/-]*\.(mjs|md|ts|tsx|yaml|yml|sh|json)\b/g;
  const barePaths = (cleaned.match(barePattern) || []).length;

  // Detect workspace-relative links [text](docs/... tools/... etc.)
  const internalPattern = /\[[^\]]+\]\((docs|tools|apps|libs|packages|\.claude)[^)]*\)/g;
  const internalLinks = (content.match(internalPattern) || []).length;

  console.log('bare=' + barePaths + ' internal=' + internalLinks);
} catch(e) {
  console.log('bare=0 internal=0');
}
" 2>/dev/null || echo "bare=0 internal=0")

BARE=$(echo "$RESULT" | grep -o 'bare=[0-9]*' | cut -d= -f2)
INTERNAL=$(echo "$RESULT" | grep -o 'internal=[0-9]*' | cut -d= -f2)
BARE=${BARE:-0}
INTERNAL=${INTERNAL:-0}

# BLOCKING: workspace-relative links (should be GitHub URLs)
if [[ "$INTERNAL" -gt 0 ]]; then
  printf '{
    "hookSpecificOutput": {
      "hookEventName": "PostStop",
      "additionalContext": "B_ALWAYS_GIT_LINKS: %s workspace-relative link(s) found.\nREQUIRED: https://github.com/CommarkG/csps/blob/main/[path]\nFORBIDDEN: [name](docs/path) — not clickable outside IDE\nGovernor has asked 100+ times. Fix EVERY link before proceeding."
    }
  }' "$INTERNAL"
fi

# BLOCKING: bare paths > 2 (file references without any markdown link)
if [[ "$BARE" -gt 2 ]]; then
  printf '{
    "hookSpecificOutput": {
      "hookEventName": "PostStop",
      "additionalContext": "B_ALWAYS_GIT_LINKS: %s bare file path(s) found (no markdown link).\nEVERY file/folder mentioned in output must be a clickable link.\nCorrect: [FOUNDATION-COMPLETION-PLAN.md](https://github.com/CommarkG/csps/blob/main/docs/plan/FOUNDATION-COMPLETION-PLAN.md)\nForbidden: docs/plan/FOUNDATION-COMPLETION-PLAN.md  (bare path)"
    }
  }' "$BARE"
fi

echo "[link-discipline] v2 scan: bare=${BARE} internal=${INTERNAL} session=${SESSION_ID}"
exit 0
