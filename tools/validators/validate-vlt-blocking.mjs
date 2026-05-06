#!/usr/bin/env node
/**
 * validate-vlt-blocking.mjs — VLT state clarity enforcer
 *
 * ROOT CAUSE TARGETED: AI treated VLT registration (acknowledged) as equivalent
 * to VLT resolution (Governor ratification). This caused Phase 5 advance to be
 * proposed while 5 VLTs were PENDING — the "advance-without-pe-triad-check"
 * anti-pattern from P-META-021 sample set.
 *
 * THE DISTINCTION:
 *   REGISTERED = "I acknowledged this decision exists"
 *   RESOLVED   = "Governor ratified an answer; recorded in session-state.json"
 *
 *   Treating REGISTERED as RESOLVED = building on unknown foundations.
 *   Per B_CONSENSUS_BEFORE_PROCEEDING: PENDING VLTs block phase advance.
 *
 * What it checks:
 *   Reads tools/session-state.json blocking_decisions[]
 *   For each entry with status: PENDING → warns with blocking context
 *   Counts pending items by session → surface for Governor attention
 *
 * EXIT-CODED: 0 always (advisory). Week-4 promotes to error when
 *   session-artifact-sync detects a phase advance claim while VLTs pending.
 *
 * WHY THIS MATTERS MORE THAN "JUST CHECK THE LIST":
 *   Every artifact built while a VLT is PENDING inherits the VLT's uncertainty.
 *   If VLT-S015-003 (connection pooling) is unresolved, every production
 *   deployment decision is built on an assumed answer. The compound error
 *   scales with every artifact downstream. Surfacing PENDING VLTs is not
 *   bureaucracy — it is load-bearing structural validation.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const STATE_FILE = join(ROOT, 'tools/session-state.json');

async function main() {
  if (!existsSync(STATE_FILE)) {
    console.log('[validate-vlt-blocking] session-state.json not found; skipping');
    process.exit(0);
  }

  const state = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  const decisions = state.blocking_decisions ?? [];
  const pending = decisions.filter(d => d.status === 'PENDING');
  const total = decisions.length;

  if (pending.length === 0) {
    console.log(`[validate-vlt-blocking] vlt_total=${total} pending=0 — all VLTs resolved`);
    process.exit(0);
  }

  console.warn(`\n[validate-vlt-blocking] ${pending.length} PENDING VLT(s) — Governor ratification required:`);
  console.warn('');
  console.warn('  REGISTRATION ≠ RESOLUTION (B_CONSENSUS_BEFORE_PROCEEDING):');
  console.warn('  Registering a VLT acknowledges it exists.');
  console.warn('  Resolving a VLT means Governor ratified an answer.');
  console.warn('  Building on a PENDING VLT = building on unknown foundations.');
  console.warn('');

  for (const vlt of pending) {
    console.warn(`  ⚠ ${vlt.id}: ${vlt.question || '(no question recorded)'}`);
    if (vlt.blocks) {
      console.warn(`    BLOCKS: ${vlt.blocks}`);
    }
    if (vlt.discovered_at) {
      console.warn(`    Surfaced: ${vlt.discovered_at}`);
    }
    console.warn('');
  }

  console.warn('  To resolve: update session-state.json blocking_decisions[].status');
  console.warn('  from "PENDING" to "RESOLVED" with decision text after Governor ratifies.');
  console.warn('');

  const summary = `[validate-vlt-blocking] vlt_total=${total} pending=${pending.length} resolved=${total - pending.length}`;
  console.log(summary);

  // Advisory only — exit 0
  process.exit(0);
}

main().catch(err => {
  console.error('[validate-vlt-blocking] fatal:', err);
  process.exit(1);
});
