#!/usr/bin/env bash
# @csps-id csps.claude.hooks.session-open
# @csps-name session-open
# @csps-description SessionStart hook — mandatory context + reasoning load BEFORE AI activation.
#   Reads session-state.json, open-plan-levels, and injects the conceptual frame required
#   by P-META-020 before any input is processed. AI MUST acknowledge this context before
#   proceeding. Prevents cold-start drift, plan-promise-abandonment, and nominal-ZF.
#   Per P-META-020 (Concept-First Governance): context is the compass; validators are samples.
#   Per B_COGNITIVE_CONTEXT_DISCIPLINE: Layer 1 (Permanent Constitution) loads at session-open.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces P-META-020 B_COGNITIVE_CONTEXT_DISCIPLINE P-META-006

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

node -e "
const fs = require('fs');
const {join} = require('path');
const ROOT = process.argv[1];

// Read session state
let session = '?', mandate = 'unknown', blocking = 'NONE', verifyState = 'unknown';
try {
  const d = JSON.parse(fs.readFileSync(join(ROOT, 'tools/session-state.json'), 'utf8'));
  session = d.current_session || '?';
  mandate = (d.session_mandate || {}).primary || 'unknown';
  const unresolved = (d.blocking_decisions || []).filter(x => x.status !== 'RESOLVED').map(x => x.id);
  blocking = unresolved.length ? unresolved.join(', ') : 'NONE';
  verifyState = (d.platform_state || {}).pnpm_verify || 'unknown';
} catch(e) { /* session-state not found */ }

// Read open-plan-levels summary
let openLevels = 'validator not run';
try {
  const {execSync} = require('child_process');
  const out = execSync('node tools/validators/validate-open-plan-levels.mjs 2>&1', {cwd: ROOT, encoding: 'utf8', timeout: 10000});
  const match = out.match(/plans_checked=\d+ plans_with_open=\d+ total_open_items=\d+/);
  openLevels = match ? match[0] : 'see validate-open-plan-levels.mjs';
} catch(e) { openLevels = 'validator error — run manually'; }

const context = [
  '╔══════════════════════════════════════════════════════════════════╗',
  '║         CSPS SESSION ACTIVATION — CONTEXT LOAD REQUIRED         ║',
  '║   P-META-020: Read this fully before processing any request.    ║',
  '╚══════════════════════════════════════════════════════════════════╝',
  '',
  'SESSION STATE:',
  '  Session: ' + session,
  '  Mandate: ' + mandate,
  '  Blocking: ' + blocking,
  '  Platform verify: ' + verifyState,
  '  Open plan levels: ' + openLevels,
  '',
  'CONCEPT-FIRST ACTIVATION PROTOCOL (P-META-020 — non-negotiable):',
  'Before processing ANY request this session, identify the governing L2 spine:',
  '  User directive / ratification  → GVRN L2 (decision rights)',
  '  Schema / code implementation   → ARCH L2 (data domain)',
  '  AI behavior / defaults         → AI L2 (inner-defaults domain)',
  '  Validation / evidence claims   → VALD L2 (coverage discipline)',
  '  External content / research    → AI L2 (alignment domain) + VAULT_DEFER',
  '',
  'WHY THIS MATTERS (the reasoning that makes rules unnecessary):',
  '  The plan-promise-abandonment pattern orphaned foundation-slices L3 for 3',
  '  sessions because context degraded to a checkbox. The AI believed it was done',
  '  because pnpm verify passed — but the UNDERSTANDING of why L3 mattered was gone.',
  '  Loading the conceptual frame NOW means every decision this session navigates',
  '  from understanding, not from rule lookup. Rules are finite. Situations are',
  '  infinite. Only deep concept understanding handles the long tail.',
  '',
  'WHY CONTINUOUS ITERATION UNTIL REAL ZERO FINDINGS:',
  '  Nominal ZF (touching timestamps, bypassing checks) is worse than acknowledged',
  '  failure because it gives false confidence at exactly the moment a developer',
  '  builds on top of it. Every open item is an obligation. Deferring is valid —',
  '  forgetting is not. Each iteration either eliminates a finding or explicitly',
  '  defers it with documented reasoning. Silent accumulation = structural debt',
  '  that compounds across 30 apps. The platform survives by compounding ZF cycles,',
  '  not by accumulating nominal ones.',
  '',
  'ACTIVE MECHANICAL ENFORCEMENT THIS SESSION:',
  '  pre-tool-use-plan-coverage-gate.sh  — blocks libs/apps writes without plan',
  '  post-stop-pnpm-verify.sh            — runs verify + ZF reasoning every stop',
  '  user-prompt-submit-next-step-reminder — every turn ends with next step + WHY',
  '  validate-open-plan-levels.mjs       — 112 advisory items (classify each)',
  '',
  '═══════════════════════════════════════════════════════════════════',
].join('\\n');

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: context
  }
}));
" "$REPO_ROOT" 2>/dev/null || printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"[session-open] context load failed — read tools/session-state.json manually"}}'

exit 0
