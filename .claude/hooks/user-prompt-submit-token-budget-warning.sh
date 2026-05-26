#!/usr/bin/env bash
# @csps-id csps.claude.hooks.user-prompt-submit-token-budget-warning
# @csps-name user-prompt-submit-token-budget-warning
# @csps-description UserPromptSubmit hook — reads token usage estimate written by
#   post-stop-token-tracker.sh and emits escalating large-format warnings when
#   approaching context limits. Three levels:
#     CAUTION  (70%+): start wrapping up, plan handoff
#     WARNING  (80%+): finish current task, prepare handoff now
#     CRITICAL (90%+): jump to new tab NOW, write handoff first
#   Uses hookSpecificOutput.additionalContext so warnings appear as system-reminder
#   blocks — prominently visible before AI processes the next request.
#   User directive S062. B_TOKEN_BUDGET awareness.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_TOKEN_BUDGET

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly STATE_FILE="${REPO_ROOT}/tools/data/token-usage-state.json"

# Read estimate from state file
PCT=$(node -e "
const fs = require('fs');
try {
  const s = JSON.parse(fs.readFileSync('${STATE_FILE}', 'utf8'));
  process.stdout.write(String(s.estimated_token_pct || 0));
} catch(e) { process.stdout.write('0'); }
" 2>/dev/null || echo "0")

# No warning needed
if [ -z "$PCT" ] || [ "$PCT" -lt 70 ]; then
  exit 0
fi

# Generate appropriate warning level
if [ "$PCT" -ge 90 ]; then

printf '{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "\n╔══════════════════════════════════════════════════════════════════╗\n║           \U0001F6A8  \U0001F6A8  CONTEXT CRITICAL: ~%s%% CONSUMED  \U0001F6A8  \U0001F6A8        ║\n╠══════════════════════════════════════════════════════════════════╣\n║  ████████████████████████████████████████████████████████████████  ║\n║                                                                  ║\n║  JUMP TO NEW TAB NOW. Context will exhaust within 1-2 tasks.   ║\n║                                                                  ║\n║  STEPS (5 min):                                                  ║\n║  1. /slim-handoff  → write HANDOFF-S062-to-C5.md               ║\n║  2. Open new tab                                                 ║\n║  3. Paste startup block from handoff                             ║\n║                                                                  ║\n║  ⚠️  Estimate is approximate (±15%%). Act NOW to avoid abrupt cut. ║\n╚══════════════════════════════════════════════════════════════════╝\n"
  }
}' "$PCT"

elif [ "$PCT" -ge 80 ]; then

printf '{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "\n╔══════════════════════════════════════════════════════════════╗\n║        ⚠️  WARNING: ~%s%% CONTEXT CONSUMED  ⚠️              ║\n╠══════════════════════════════════════════════════════════════╣\n║  ████████████████████████████████████████████████░░░░░░░░░░░░  ║\n║                                                              ║\n║  Finish this task. THEN prepare handoff.                     ║\n║  Start /slim-handoff at end of next task.                    ║\n║  2-3 tasks remaining before context exhausts.                ║\n╚══════════════════════════════════════════════════════════════╝\n"
  }
}' "$PCT"

elif [ "$PCT" -ge 70 ]; then

printf '{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "\n╔════════════════════════════════════════════════════════╗\n║    ℹ️  CAUTION: ~%s%% CONTEXT CONSUMED                 ║\n╠════════════════════════════════════════════════════════╣\n║  █████████████████████████████████████████░░░░░░░░░░░░░░  ║\n║                                                        ║\n║  Start wrapping up. 3-4 tasks before limit.            ║\n║  Plan handoff for end of this work unit.               ║\n╚════════════════════════════════════════════════════════╝\n"
  }
}' "$PCT"

fi

exit 0
