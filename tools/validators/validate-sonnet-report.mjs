#!/usr/bin/env node
// validate-sonnet-report.mjs
// Checks that tools/council/sonnet-turn.md has a "# Sonnet Report" section
// for the current session (from session-state.json current_session).
// ADVISORY now → BLOCKING week-4.

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const SONNET_TURN = resolve('tools/council/sonnet-turn.md');
const SESSION_STATE = resolve('tools/session-state.json');

if (!existsSync(SONNET_TURN)) {
  console.log('[validate-sonnet-report] sonnet-turn.md not found — advisory');
  process.exit(0);
}

const state = JSON.parse(readFileSync(SESSION_STATE, 'utf8'));
const session = state.current_session || 'unknown';
const content = readFileSync(SONNET_TURN, 'utf8');

const hasReport = content.includes(`# Sonnet Report`) ||
                  content.includes(`Sonnet Report — ${session}`);
const hasIntentAbsorbed = content.includes('INTENT ABSORBED');

const warnings = [];
if (!hasReport) warnings.push(`No "Sonnet Report" section found for session ${session}`);
if (!hasIntentAbsorbed) warnings.push('No "INTENT ABSORBED" section found');

if (warnings.length > 0) {
  warnings.forEach(w => console.log(`  ⚠ ${w}`));
  console.log('[validate-sonnet-report] stage=advisory (week-4: blocking)');
  process.exit(0); // advisory — does not fail verify yet
}

console.log('[validate-sonnet-report] sonnet-turn.md has both INTENT ABSORBED + Sonnet Report ✓');
process.exit(0);
