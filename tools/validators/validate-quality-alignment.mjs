#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-quality-alignment
 * @csps-name validate-quality-alignment
 * @csps-description Quality Alignment Gate: checks that OPUS-2 and Sonnet both follow
 * shared quality processes. Scans last 5 # Opus Turn N blocks for ## RZF VERIFICATION;
 * scans sonnet-turn.md for INTENT ABSORBED entries. ADVISORY if rate < 80% on either side.
 * Implements OPEN-022 — shared quality discipline across both actors.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces P-META-008 P-META-006
 *
 * Coverage Levels:
 *   ✓ Checks: last 5 Opus turns for ## RZF VERIFICATION
 *   ✓ Checks: sonnet-turn.md for INTENT ABSORBED entries
 *   ✗ Does not check: quality of RZF or INTENT ABSORBED — only presence
 *   ✗ Does not check: turns older than the last 5
 *
 * Exit: 0 always (ADVISORY)
 * Output: opus_rzf_rate=N% sonnet_intent_rate=N% status=OK|ADVISORY
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const OPUS_TURN_FILE = resolve(ROOT, 'tools/council/opus-turn.md');
const SONNET_TURN_FILE = resolve(ROOT, 'tools/council/sonnet-turn.md');

const THRESHOLD = 0.8; // 80% minimum rate
let opusRzfRate = 100;
let sonnetIntentRate = 100;
let status = 'OK';

// ─── OPUS-2 RZF rate (last 5 turns) ─────────────────────────────────────────

if (existsSync(OPUS_TURN_FILE)) {
  const content = readFileSync(OPUS_TURN_FILE, 'utf-8');
  const turns = content.split(/(?=^# Opus Turn \d+)/m).filter(b => /^# Opus Turn \d+/.test(b.trim())).slice(0, 5);

  if (turns.length > 0) {
    const withRzf = turns.filter(b => /^##\s+RZF VERIFICATION/m.test(b)).length;
    opusRzfRate = Math.round((withRzf / turns.length) * 100);

    if (opusRzfRate < (THRESHOLD * 100)) {
      status = 'ADVISORY';
      console.warn(
        `[validate-quality-alignment] ADVISORY: OPUS-2 RZF rate = ${opusRzfRate}% (last ${turns.length} turns).\n` +
        `  Minimum: 80%. Some OPUS-2 turns are missing ## RZF VERIFICATION sections.\n` +
        `  Rule 9 (communication-protocol-shared.md): Every directive block must be preceded by ZF cycle.\n` +
        `  See validate-directive-has-rzf.mjs for specifics.`
      );
    }
  }
}

// ─── Sonnet INTENT ABSORBED rate ─────────────────────────────────────────────

if (existsSync(SONNET_TURN_FILE)) {
  const content = readFileSync(SONNET_TURN_FILE, 'utf-8');

  // Count ## blocks (session entries) and INTENT ABSORBED occurrences
  const sessionHeaders = (content.match(/^#+ Sonnet Session/gm) || []).length;
  const intentAbsorbed = (content.match(/INTENT ABSORBED/gi) || []).length;

  if (sessionHeaders > 0) {
    sonnetIntentRate = Math.round(Math.min(100, (intentAbsorbed / sessionHeaders) * 100));

    if (sonnetIntentRate < (THRESHOLD * 100)) {
      status = 'ADVISORY';
      console.warn(
        `[validate-quality-alignment] ADVISORY: Sonnet INTENT ABSORBED rate = ${sonnetIntentRate}% (${intentAbsorbed}/${sessionHeaders} sessions).\n` +
        `  Minimum: 80%. Some Sonnet sessions start implementation without writing INTENT ABSORBED first.\n` +
        `  Protocol: Write INTENT ABSORBED to sonnet-turn.md before touching any file (Rule 1 analogue).`
      );
    }
  }
}

console.log(`[validate-quality-alignment] opus_rzf_rate=${opusRzfRate}% sonnet_intent_rate=${sonnetIntentRate}% status=${status}`);
process.exit(0);
