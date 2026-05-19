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

node -e "
const fs = require('fs');
const {join} = require('path');
const ROOT = process.argv[1];

// ── Read + increment turn counter ──────────────────────────────────────────
const trackerPath = join(ROOT, 'tools/zf-session-tracker.json');
let tracker = {};
try { tracker = JSON.parse(fs.readFileSync(trackerPath, 'utf8')); } catch(e) {}
tracker.turn_count_this_session = (tracker.turn_count_this_session || 0) + 1;
const turn = tracker.turn_count_this_session;
try { fs.writeFileSync(trackerPath, JSON.stringify(tracker, null, 2)); } catch(e) {}

// ── Quality degradation warning at turn thresholds ────────────────────────
if (turn === 40) {
  console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext:
    '⚠️ [QUALITY GATE — TURN 40] Context quality is degrading. Rules from early turns are less salient.\n' +
    'Consider: write HANDOFF + open a fresh tab, even with tokens remaining.\n' +
    'Quality matters more than token savings. (Governor directive S044)'
  }}));
  process.exit(0);
}
if (turn >= 60 && turn % 10 === 0) {
  console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext:
    '🚨 [QUALITY GATE — TURN ' + turn + '] STRONG RECOMMENDATION: Move to a new tab NOW.\n' +
    'Context at this length has significant governance drift risk.\n' +
    'Action: pnpm dna:bundle --target=new-ai-tab → write HANDOFF → open fresh tab.'
  }}));
  process.exit(0);
}

// ── Only output on refresh turns (every 25) ────────────────────────────────
const REFRESH_EVERY = 25;
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
" "$REPO_ROOT"

exit 0
