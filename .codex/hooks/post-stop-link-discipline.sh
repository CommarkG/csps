#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-link-discipline
# @csps-name post-stop-link-discipline
# @csps-version 1.0.0-active
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces B_ALWAYS_GIT_LINKS
#
# S019 UPGRADE: Active enforcement — scans last AI response for workspace-relative
# links and emits a BLOCKING reminder to use GitHub URLs instead.
#
# CSPS repo: https://github.com/CommarkG/csps
# File URL:  https://github.com/CommarkG/csps/blob/main/[path]
# Dir URL:   https://github.com/CommarkG/csps/tree/main/[path]
#
# DETECTS: [text](docs/...) | [text](tools/...) | [text](apps/...) | [text](libs/...) | [text](packages/...)
# CORRECT: [text](https://github.com/CommarkG/csps/blob/main/...)

set -euo pipefail

readonly TRANSCRIPT_PATH="${CLAUDE_TRANSCRIPT_PATH:-}"
readonly SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"
readonly TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

# Check if we have a transcript to scan
if [[ -z "$TRANSCRIPT_PATH" ]] || [[ ! -f "$TRANSCRIPT_PATH" ]]; then
  echo "[link-discipline] no transcript available for scan — session=${SESSION_ID}"
  exit 0
fi

# Scan last AI message for workspace-relative markdown links
# Pattern: [any text](docs/... or tools/... or apps/... or libs/... or packages/...)
INTERNAL_LINKS=$(python3 -c "
import json, re, sys
try:
    with open('$TRANSCRIPT_PATH') as f:
        data = json.load(f)
    messages = data.get('messages', [])
    last_ai = next((m for m in reversed(messages) if m.get('role') == 'assistant'), None)
    if not last_ai: sys.exit(0)
    content = str(last_ai.get('content', ''))
    # Find [text](internal-path) patterns
    pattern = r'\[([^\]]+)\]\((docs|tools|apps|libs|packages|\.claude)[^)]*\)'
    matches = re.findall(pattern, content)
    if matches:
        print(str(len(matches)))
    else:
        print('0')
except Exception as e:
    print('0')
" 2>/dev/null || echo "0")

if [[ "$INTERNAL_LINKS" != "0" ]] && [[ -n "$INTERNAL_LINKS" ]]; then
  printf '{
    "hookSpecificOutput": {
      "hookEventName": "PostStop",
      "additionalContext": "B_ALWAYS_GIT_LINKS VIOLATION — %s workspace-relative link(s) detected in last response.\n\nREQUIRED: Use full GitHub URLs.\n  File: https://github.com/CommarkG/csps/blob/main/[path]\n  Dir:  https://github.com/CommarkG/csps/tree/main/[path]\n\nFORBIDDEN: [name](docs/path) or [name](tools/path) — these are NOT clickable outside the IDE.\n\nGovernor has asked for this 3+ times (K=3). This is now MECHANICAL ENFORCEMENT.\nEdit the response links to use GitHub URLs before this counts as correct."
    }
  }' "$INTERNAL_LINKS"
fi

echo "[link-discipline] scan complete — internal_links_found=${INTERNAL_LINKS:-0} session=${SESSION_ID} timestamp=${TIMESTAMP}"
exit 0
