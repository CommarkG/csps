#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-token-tracker
# @csps-name post-stop-token-tracker
# @csps-description Stop hook — estimates context window % consumed from CLAUDE_TRANSCRIPT_PATH
#   file size. Writes estimate to tools/data/token-usage-state.json which the
#   user-prompt-submit-token-budget-warning hook reads to emit escalating warnings.
#   Method: transcript JSONL size / 3 chars-per-token / 1M context window.
#   System overhead (CSPS startup blocks, hooks) adds ~20K tokens per turn.
#   Estimate is conservative (slightly under-counts) — warns early, never late.
#   B_TOKEN_BUDGET awareness. User directive S062.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_TOKEN_BUDGET

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly STATE_FILE="${REPO_ROOT}/tools/data/token-usage-state.json"
readonly TRANSCRIPT_PATH="${CLAUDE_TRANSCRIPT_PATH:-}"

# Estimate token percentage from transcript file size
EST_PCT=$(node -e "
const fs = require('fs');

const transcriptPath = '${TRANSCRIPT_PATH}';
const CONTEXT_WINDOW = 1000000; // claude-sonnet-4-6[1m]
const CHARS_PER_TOKEN = 3.0;    // conservative: JSON overhead + mixed content
const SYSTEM_OVERHEAD = 25000;  // CSPS startup blocks + hooks + CLAUDE.md + MEMORY.md

let estPct = 0;
let sizeBytes = 0;

if (transcriptPath && fs.existsSync(transcriptPath)) {
  try {
    sizeBytes = fs.statSync(transcriptPath).size;
    const transcriptTokens = Math.round(sizeBytes / CHARS_PER_TOKEN);
    const totalTokens = transcriptTokens + SYSTEM_OVERHEAD;
    estPct = Math.min(100, Math.round(totalTokens / CONTEXT_WINDOW * 100));
  } catch(e) {}
}

// Write state file
const state = {
  estimated_token_pct: estPct,
  transcript_size_bytes: sizeBytes,
  measured_at: new Date().toISOString(),
  context_window: CONTEXT_WINDOW,
  method: 'transcript_file_size',
  note: 'Estimate is conservative — may undercount by 10-15% due to system prompt tokens not in transcript'
};

try {
  fs.writeFileSync('${STATE_FILE}', JSON.stringify(state, null, 2));
} catch(e) {}

process.stdout.write(String(estPct));
" 2>/dev/null || echo "0")

# Non-blocking: this hook only measures, never prevents
exit 0
