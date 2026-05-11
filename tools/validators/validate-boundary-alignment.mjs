#!/usr/bin/env node
// validate-boundary-alignment.mjs
// B_BOUNDARY_ALIGNMENT_PROTOCOL — Phase 1 (Type E + B boundaries)
// Checks that:
//   1. sonnet-turn.md Sonnet Report contains ALIGNMENT CHECK pattern (Type E)
//   2. closing-summary for current session has §10.0r filled (not template placeholder)
// ADVISORY now → Type B BLOCKING week-4.

import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve, join } from 'path';

const SONNET_TURN    = resolve('tools/council/sonnet-turn.md');
const SESSION_STATE  = resolve('tools/session-state.json');
const CLOSING_DIR    = resolve('docs/plan/_handoff/VAULT');

const state   = JSON.parse(readFileSync(SESSION_STATE, 'utf8'));
const session = state.current_session || 'unknown';

const warnings = [];
let   checks   = 0;

// ── Check 1: sonnet-turn.md has ALIGNMENT CHECK (Type E: AI→Sonnet Report) ──
if (existsSync(SONNET_TURN)) {
  checks++;
  const content = readFileSync(SONNET_TURN, 'utf8');
  const hasAlignmentCheck = content.includes('ALIGNMENT CHECK') ||
                            content.includes('Match: YES') ||
                            content.includes('Match: PARTIAL') ||
                            content.includes('Match: NO') ||
                            content.includes('what was built:');
  if (!hasAlignmentCheck) {
    warnings.push(
      `sonnet-turn.md Sonnet Report missing ALIGNMENT CHECK block ` +
      `(B_BOUNDARY_ALIGNMENT_PROTOCOL Type E — AI→human output)`
    );
  }
} else {
  warnings.push('sonnet-turn.md not found — cannot verify Type E alignment block');
}

// ── Check 2: closing-summary for current session has §10.0r filled ──
const closingPath = join(CLOSING_DIR, `closing-summary-${session}.md`);
if (existsSync(closingPath)) {
  checks++;
  const cs = readFileSync(closingPath, 'utf8');
  const hasDriftFilled = /drift:\s*(YES|NO|PARTIAL)/.test(cs);
  if (!hasDriftFilled) {
    warnings.push(
      `closing-summary-${session}.md §10.0r drift field not filled ` +
      `(expected: drift: YES / NO / PARTIAL)`
    );
  }
}
// If no closing-summary yet: advisory skip (session still open)

if (warnings.length > 0) {
  warnings.forEach(w => console.log(`  ⚠ ${w}`));
  console.log('[validate-boundary-alignment] stage=advisory (week-4: Type B blocking)');
  console.log(`checks=${checks} warnings=${warnings.length}`);
  process.exit(0);
}

console.log(`[validate-boundary-alignment] all boundary alignment blocks present ✓`);
console.log(`checks=${checks} warnings=0`);
process.exit(0);
