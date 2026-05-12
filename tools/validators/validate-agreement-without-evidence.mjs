#!/usr/bin/env node
/**
 * validate-agreement-without-evidence.mjs — Catches SP-002: Agreement Bias
 *
 * ROOT CAUSE TARGETED: AI says "good point", "exactly", "that's right", "I agree"
 * before checking whether the claim is actually correct. Training rewards affirmation
 * as "being helpful." CSPS requires push-back with evidence, not comfort.
 *
 * Sample pair: SP-002 (sample-library.yaml)
 * Teaching moment: "Do I have evidence this is correct, or am I agreeing because
 * agreement is comfortable? What would a top expert say?"
 *
 * What it checks (Phase 1 advisory — catches patterns in recent session artifacts):
 *   1. sonnet-turn.md: agreement phrases without PCR or evidence following
 *   2. HANDOFF files: if "good point" or "exactly" appear (should not)
 *
 * Phase 2 (S027): scan session transcripts for T2 trigger vocabulary
 *
 * Audit slug: agreement-without-evidence
 * Part of CHUNK 5 enforcement roadmap (enforcement-coverage.md)
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const SONNET_TURN = join(ROOT, 'tools/council/sonnet-turn.md');
const HANDOFF_DIR = join(ROOT, 'docs/plan/_handoff');

// T2 trigger vocabulary from trigger-vocabulary.md (agreement bias category)
const AGREEMENT_TRIGGERS = [
  /\bgood point\b/i,
  /\bgreat idea\b/i,
  /\bthat'?s? right\b/i,
  /\bI agree\b(?! because)/i,  // "I agree" without "because" following
  /\babsolutely\b(?! not)/i,
  /\bexactly\b(?!:)/i,  // "exactly" without colon (citation) following
];

// Evidence indicators that make agreement acceptable
const EVIDENCE_INDICATORS = [
  'because',
  'evidence:',
  'confirmed:',
  'push-back:',
  'counter',
  'however',
  'actually',
  'but ',
  'PARTIAL',
  'NO —',
];

const advisories = [];

function hasNearbyEvidence(text, matchIdx, windowSize = 200) {
  const after = text.slice(matchIdx, matchIdx + windowSize).toLowerCase();
  return EVIDENCE_INDICATORS.some(ind => after.includes(ind.toLowerCase()));
}

// Check sonnet-turn.md
if (existsSync(SONNET_TURN)) {
  const content = readFileSync(SONNET_TURN, 'utf8');
  for (const pattern of AGREEMENT_TRIGGERS) {
    let m;
    const regex = new RegExp(pattern.source, pattern.flags + 'g');
    while ((m = regex.exec(content)) !== null) {
      if (!hasNearbyEvidence(content, m.index)) {
        const lineNum = content.slice(0, m.index).split('\n').length;
        advisories.push({
          file: 'tools/council/sonnet-turn.md',
          trigger: m[0],
          line: lineNum,
          issue: `T2 agreement trigger "${m[0]}" without evidence nearby (SP-002: agreement bias). Add "because [reason]" or push-back evidence.`,
        });
      }
    }
  }
}

// Check last 2 HANDOFF files
if (existsSync(HANDOFF_DIR)) {
  const handoffFiles = readdirSync(HANDOFF_DIR)
    .filter(f => f.startsWith('HANDOFF-') && f.endsWith('.md'))
    .sort().slice(-2);
  for (const hf of handoffFiles) {
    const content = readFileSync(join(HANDOFF_DIR, hf), 'utf8');
    for (const pattern of AGREEMENT_TRIGGERS) {
      const regex = new RegExp(pattern.source, pattern.flags + 'g');
      let m;
      while ((m = regex.exec(content)) !== null) {
        if (!hasNearbyEvidence(content, m.index)) {
          advisories.push({
            file: hf,
            trigger: m[0],
            issue: `T2 agreement trigger "${m[0]}" in HANDOFF file — governance docs should not model agreement bias.`,
          });
        }
      }
    }
  }
}

if (advisories.length > 0) {
  advisories.slice(0, 6).forEach(a => {
    console.log(`  ⚠ [SP-002] ${a.file}:${a.line || '?'} "${a.trigger}": ${a.issue}`);
  });
  if (advisories.length > 6) console.log(`  ... and ${advisories.length - 6} more`);
  console.log('[validate-agreement-without-evidence] teaching_moment: "Do I have evidence for this, or just comfort?"');
} else {
  console.log('[validate-agreement-without-evidence] no unsupported agreement patterns detected ✓');
}

console.log(`[validate-agreement-without-evidence] checked=2 advisories=${advisories.length}`);
process.exit(0); // advisory
