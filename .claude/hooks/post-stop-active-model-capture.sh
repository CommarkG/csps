#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-active-model-capture
# @csps-name post-stop-active-model-capture
# @csps-description Stop hook -- ADVISORY/self-populating. Captures the model-identity
#   self-declaration a tab makes in its own Step-0 first response ("Opus here." / "Sonnet here."
#   -- see tools/scripts/generate-startup-block.mjs opusBlock/sonnetBlock STEP 0) and records it
#   into tools/session-state.json active_model.
#
#   WHY A STOP HOOK (not SessionStart/UserPromptSubmit): SessionStart and UserPromptSubmit fire
#   BEFORE the model produces its response, so neither can see the declaration text -- there is no
#   earlier hook event where "which model is literally responding" is observable. Stop hooks
#   receive CLAUDE_TRANSCRIPT_PATH (the full JSONL transcript, including assistant prose) AFTER
#   the model responds -- the same access pattern already used by post-stop-banned-phrase.sh and
#   post-stop-existence-claim-scan.sh to scan assistant text for patterns.
#
#   IDEMPOTENT / WHOLE-TRANSCRIPT SCAN: re-scans the ENTIRE transcript every turn (not just the
#   last message) and keeps the FIRST declaration found in transcript order, because the
#   declaration is a one-time Step-0 event near session start, not a per-turn one. Re-running on
#   turn 2, 3, ... finds the same turn-1 declaration and is a no-op once active_model already
#   matches it.
#
#   HONEST LIMITATION: this captures what the tab SAID about itself in Step 0, not an
#   independently-verified fact about model identity -- same class of limitation
#   validate-model-role-division.mjs documents for its own signal. A tab that skips or misstates
#   Step 0 leaves active_model stale/unknown; this hook narrows that gap, it does not close it.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_MODEL_ROLE_DIVISION

set -euo pipefail
readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

TRANSCRIPT_PATH="${CLAUDE_TRANSCRIPT_PATH:-}"
[ -z "$TRANSCRIPT_PATH" ] && exit 0
[ ! -f "$TRANSCRIPT_PATH" ] && exit 0

SESSION_STATE="${REPO_ROOT}/tools/session-state.json"
[ -f "$SESSION_STATE" ] || exit 0

# Pattern B (BLOCK-TEST-CONVENTION.md RULE 2): paths passed via process.argv, never interpolated
# into the eval string -- avoids MSYS-path-not-translated failures on Windows node.exe.
DECLARED=$(node -e "
const fs = require('fs');
try {
  const lines = fs.readFileSync(process.argv[1], 'utf8').split('\n').filter(Boolean);
  for (const line of lines) {
    let e;
    try { e = JSON.parse(line); } catch { continue; }
    if (e.type !== 'assistant') continue;
    const content = (e.message && e.message.content) || '';
    let text = '';
    if (Array.isArray(content)) {
      text = content.filter(c => c && c.type === 'text').map(c => c.text || '').join(' ');
    } else if (typeof content === 'string') {
      text = content;
    }
    let m = text.match(/(?:^|[\n\r])\s*(Opus|Sonnet) here\./);
    if (!m) m = text.match(/ACTIVE MODEL:\s*(Opus|Sonnet)/i);
    if (m) { process.stdout.write(m[1].toLowerCase()); process.exit(0); }
  }
} catch (e) {}
" "$TRANSCRIPT_PATH" 2>/dev/null || echo "")

[ -z "$DECLARED" ] && exit 0

RESULT=$(node -e "
const fs = require('fs');
const p = process.argv[1];
const declared = process.argv[2];
try {
  const raw = fs.readFileSync(p, 'utf8');
  const d = JSON.parse(raw);
  if (d.active_model === declared) { process.stdout.write('unchanged'); process.exit(0); }
  d.active_model = declared;
  fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n', 'utf8');
  process.stdout.write('updated');
} catch (e) {
  process.stdout.write('error:' + e.message);
}
" "$SESSION_STATE" "$DECLARED" 2>/dev/null || echo "error")

if [ "$RESULT" = "updated" ]; then
  echo "[active-model-capture] tools/session-state.json active_model set to '${DECLARED}' (from Step-0 self-declaration)"
elif [ "$RESULT" = "unchanged" ]; then
  echo "[active-model-capture] active_model already '${DECLARED}' -- no change"
else
  echo "[active-model-capture] could not update session-state.json (${RESULT})"
fi

exit 0
