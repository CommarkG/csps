#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-quality-alignment
 * @csps-name validate-quality-alignment
 * @csps-description Quality Alignment Gate: checks that OPUS-2 and Sonnet both follow
 * shared quality processes. Scans last 5 # Opus Turn N blocks for ## RZF VERIFICATION;
 * scans sonnet-turn.md for INTENT ABSORBED entries. ADVISORY if rate < 80% on either side.
 * Also checks RZF quality: for turns with SONNET DIRECTIVE, Cycle 2 must have ≥10 words
 * (not just "0 new findings" — the nominal RZF anti-pattern EP-ERR-008).
 * Implements OPEN-022 — shared quality discipline across both actors.
 * @csps-version 1.1.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces P-META-008 P-META-006
 *
 * Coverage Levels:
 *   ✓ Checks: last 5 Opus turns for ## RZF VERIFICATION
 *   ✓ Checks: sonnet-turn.md for INTENT ABSORBED entries
 *   ✓ Checks: turns with SONNET DIRECTIVE — Cycle 2 must have ≥10 words (EP-ERR-008 nominal RZF)
 *   ✗ Does not check: turns older than the last 5
 *
 * Exit: 0 always (ADVISORY)
 * Output: opus_rzf_rate=N% sonnet_intent_rate=N% directive_rzf_quality_rate=N% status=OK|ADVISORY
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
let directiveRzfQualityRate = 100;
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

// ─── Directive RZF quality rate (turns with SONNET DIRECTIVE — Cycle 2 ≥10 words) ─────────────

if (existsSync(OPUS_TURN_FILE)) {
  const content = readFileSync(OPUS_TURN_FILE, 'utf-8');
  const turns = content.split(/(?=^# Opus Turn \d+)/m).filter(b => /^# Opus Turn \d+/.test(b.trim())).slice(0, 5);

  const turnsWithDirective = turns.filter(b => /^##\s+SONNET DIRECTIVE/m.test(b));

  if (turnsWithDirective.length > 0) {
    let qualityCount = 0;
    for (const turn of turnsWithDirective) {
      // Find the RZF VERIFICATION block
      const rzfMatch = turn.match(/^##\s+RZF VERIFICATION([\s\S]*?)(?=\n##|\n# Opus Turn|\*OPUS-2|$)/m);
      if (!rzfMatch) continue; // no RZF = already caught by opusRzfRate check

      const rzfBlock = rzfMatch[1];
      // Find Cycle 2 content
      const cycle2Match = rzfBlock.match(/Cycle 2:(.*?)(?=Cycle \d+:|Status:|$)/is);
      if (!cycle2Match) continue;

      const cycle2Text = cycle2Match[1].trim();
      const wordCount = cycle2Text.split(/\s+/).filter(w => w.length > 0).length;

      if (wordCount >= 10) {
        qualityCount++;
      } else {
        const turnMatch = turn.match(/^# Opus Turn (\d+)/);
        const turnNum = turnMatch?.[1] ?? '?';
        console.warn(
          `[validate-quality-alignment] ADVISORY: Turn ${turnNum} has SONNET DIRECTIVE but Cycle 2 is nominal (${wordCount} words < 10).\n` +
          `  Cycle 2 text: "${cycle2Text.slice(0, 80)}..."\n` +
          `  EP-ERR-008 (nominal-rzf-cycle): Cycle 2 must name WHAT was re-examined, not just "0 new findings".\n` +
          `  Correct: "Re-examined: (a) Does F1 mitigation introduce orphans? No. 0 new findings."`
        );
      }
    }

    directiveRzfQualityRate = Math.round((qualityCount / turnsWithDirective.length) * 100);

    if (directiveRzfQualityRate < (THRESHOLD * 100)) {
      status = 'ADVISORY';
      console.warn(
        `[validate-quality-alignment] ADVISORY: Directive RZF quality rate = ${directiveRzfQualityRate}% (turns with SONNET DIRECTIVE, Cycle 2 ≥10 words).\n` +
        `  Minimum: 80%. Nominal RZF (EP-ERR-008): "Cycle 2: 0 new findings" is not a real second cycle.\n` +
        `  Fix: Cycle 2 must name what was re-examined — each finding's mitigation, adjacent gaps checked.`
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

console.log(`[validate-quality-alignment] opus_rzf_rate=${opusRzfRate}% sonnet_intent_rate=${sonnetIntentRate}% directive_rzf_quality_rate=${directiveRzfQualityRate}% status=${status}`);
process.exit(0);
