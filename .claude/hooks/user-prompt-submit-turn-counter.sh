#!/usr/bin/env bash
# @csps-id csps.claude.hooks.user-prompt-submit-turn-counter
# @csps-name user-prompt-submit-turn-counter
# @csps-description UserPromptSubmit hook — tracks turn count and re-injects the
#   governance constitution every 25 turns. Solves in-conversation drift: rules
#   ratified at turn 1 lose salience by turn 40. Mechanical re-injection prevents
#   this without requiring any human action.
#   Governor directive S040 Turn 6 — "install a turn counter that refreshes all".
#   T1 enforcement of B_INHERITANCE_POLICY: conversation-level governance.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_INHERITANCE_POLICY P-META-006 B_COGNITIVE_CONTEXT_DISCIPLINE

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# ── Get current session via session-source.mjs (S069 fix — uses PROTO-S067 STEP 1 lib) ─────
# Same pattern as user-prompt-submit-intake.sh — avoids local session computation (F-NEW-17)
_CURRENT_SESSION=$(node "${REPO_ROOT}/tools/lib/session-source.mjs" 2>/dev/null || echo "S000")

node -e "
const fs = require('fs');
const {join} = require('path');
const ROOT = process.argv[1];

// ── Session already read in bash — pass via argv[2] ────────────────────────
const currentSession = process.argv[2] || 'S000';

// ── Read tracker + detect session boundary ─────────────────────────────────
const trackerPath = join(ROOT, 'tools/zf-session-tracker.json');
let tracker = {};
try { tracker = JSON.parse(fs.readFileSync(trackerPath, 'utf8')); } catch(e) {}

const trackerSession = tracker.session || tracker.session_id || 'unknown';
if (trackerSession !== currentSession) {
  // Session boundary crossed → reset session-scoped fields; preserve monotonic counters
  tracker.session = currentSession;
  tracker.session_id = currentSession;
  tracker.session_reset_at = new Date().toISOString();
  tracker.turn_count_this_session = 1;
  tracker.zf_deep_runs_this_session = 0;
  tracker.zf_deep_last_run_at = null;
  tracker.zf_deep_last_status = 'not-run-this-session';
  tracker.harvest_done_this_session = false;
  tracker.harvest_done_at = null;
  // verify_runs / blocking_found_total / orchestrator_cycles = monotonic, preserved intentionally
} else {
  tracker.turn_count_this_session = (tracker.turn_count_this_session || 0) + 1;
}
const turn = tracker.turn_count_this_session;
try { fs.writeFileSync(trackerPath, JSON.stringify(tracker, null, 2)); } catch(e) {}

// ── Quality degradation warning at turn thresholds ────────────────────────
// Research basis (S044 update): CSPS governance sessions are ~5x more cognitively
// demanding than simple coding. PRACE empirically shows rules drift by turn 10 without T1+T2.
// Governance protocols drift at ~25-30 turns. "Lost in the middle" LLM research confirms
// attention quality drops for context in the middle of long conversations.
// Old thresholds (40/60) were validated as TOO LATE from S044 session evidence (140 turns,
// drift visible from ~40+). New validated thresholds: warn at 20, strong at 30.
if (turn === 20) {
  console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext:
    '⚠️ [QUALITY GATE — TURN 20] Context quality beginning to degrade. CSPS governance rules are less salient.\n' +
    'Research: governance protocols drift at ~25-30 turns (5x complexity vs simple coding).\n' +
    'Recommendation: wrap up current PROTO, write HANDOFF within 10 more turns.\n' +
    'Tab-closing-protocol.md Section 1: target close at turn 25-30.'
  }}));
  process.exit(0);
}
if (turn === 30) {
  console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext:
    '🚨 [QUALITY GATE — TURN 30] STRONG RECOMMENDATION: Move to a new tab NOW.\n' +
    'This is the validated governance drift threshold for CSPS complexity sessions.\n' +
    'Action: pnpm dna:bundle --target=new-ai-tab → write HANDOFF → open fresh tab.\n' +
    'Ref: tab-closing-protocol.md | S044 research: 140-turn session showed drift from turn 40+.'
  }}));
  process.exit(0);
}
if (turn >= 40 && turn % 10 === 0) {
  console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext:
    '🚨 [QUALITY GATE — TURN ' + turn + '] PAST optimal threshold. Governance drift is significant.\n' +
    'Context at this length: rule violations and protocol skips are near-certain.\n' +
    'Action NOW: pnpm dna:bundle --target=new-ai-tab → write HANDOFF → open fresh tab.'
  }}));
  process.exit(0);
}

// ── Only output on refresh turns (every 15 — reduced from 25 per S044 research) ──
const REFRESH_EVERY = 15; // was 25 — S044 research: more frequent re-injection reduces drift
if (turn % REFRESH_EVERY !== 0) {
  // No output — hook fires silently
  console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: '' } }));
  process.exit(0);
}

// ── Read session context for refresh ──────────────────────────────────────
let session = '?', mandate = 'unknown', role = 'sonnet-builder', blocking = 'NONE';
try {
  const d = JSON.parse(fs.readFileSync(join(ROOT, 'tools/session-state.json'), 'utf8'));
  session = d.current_session || '?';
  mandate = (d.session_mandate || {}).primary || 'unknown';
  role = d.session_role || 'sonnet-builder';
  const unresolved = (d.blocking_decisions || []).filter(x => x.status !== 'RESOLVED').map(x => x.id);
  blocking = unresolved.length ? unresolved.join(', ') : 'NONE';
} catch(e) {}

const isOpus = role === 'opus-advisor';
const roleLabel = isOpus ? 'OPUS ADVISOR (no implementation, no git push)' : 'SONNET BUILDER (implementation + execution)';

// ── Build refresh message ──────────────────────────────────────────────────
const refresh = [
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  'GOVERNANCE REFRESH — TURN ' + turn + ' (auto-injected every ' + REFRESH_EVERY + ' turns)',
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  '',
  'SESSION: ' + session + ' | MANDATE: ' + mandate,
  'ROLE: ' + roleLabel,
  'BLOCKING: ' + blocking,
  '',
  'ACTIVE BEHAVIORAL CONTRACTS (mandatory — not optional):',
  '  B_OPTIMAL_NEXT_STEP: End EVERY substantive response with ▶ OPTIMAL NEXT STEP block.',
  '  B_INHERITANCE_POLICY: All gaps → OPEN-NNN immediately. No passive observation.',
  '  B_VALIDATE_BEFORE_ASSUME: Every state claim cites a tool call IN THIS RESPONSE.',
  '  B_NO_WILD_IMPLEMENTATION: proceed/approved authorizes ONE thing only.',
  '  B_STRUCTURAL_PREVENTION: when enforcement skipped → fix STRUCTURE not instance.',
  '  B_APPS_ARE_TRIALS: apps/* ephemeral. libs/* permanent. Every fix = Component A+B.',
  '',
  'ZF DISCIPLINE (non-negotiable):',
  '  DONE/RATIFIED/COMPLETE requires THIS-SESSION verify evidence — not memory.',
  '  Run cycles until findings = 0. Name what was re-examined in Cycle 2+.',
  '  Nominal ZF = primary structural failure mode.',
  '',
  isOpus
    ? 'OPUS QUALITY COMMITMENT:\n  Produce plans + directives. Apply pre-directive ZF before every output.\n  Register every gap as OPEN-NNN in SAME turn (not passive observation).\n  Execute directly when tool access available — no relay targets.'
    : 'SONNET EXECUTION STANDARD:\n  Build = wire + call + verify (pnpm build + verify.mjs exit_code=0).\n  Component A (app) + Component B (libs) on every meaningful change.\n  Commit only when both verifications pass.',
  '',
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
].join('\\n');

console.log(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext: refresh
  }
}));
" "$REPO_ROOT" "$_CURRENT_SESSION"

exit 0
