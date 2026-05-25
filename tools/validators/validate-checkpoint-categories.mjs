#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-checkpoint-categories
 * @csps-name validate-checkpoint-categories
 * @csps-description T2 for B_CHECKPOINT_8_CATEGORIES. Checks that scope expansion
 * language in recent council content cites PCR (Pros/Cons/Recommendation) or explicit
 * ratification need. Scope expansion, constitutional changes, cross-tier operations,
 * irreversible operations, and strategy pivots are checkpoint-category events that
 * require structured decision framing before proceeding. Advisory only: exits 0 always.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_CHECKPOINT_8_CATEGORIES B_PCR_FOR_DECISIONS P-OP-003
 * context_question: "Does any recent council entry invoke a checkpoint-category event without citing PCR or ratification?"
 * Plan item: gap_T2_ORPHAN_CONTRACTS | S061
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const COUNCIL_DIR = join(ROOT, 'tools/council');
const RECENT_LINE_LIMIT = 100;
const CONTEXT_WINDOW = 15; // lines before and after trigger

// Trigger phrases that indicate a checkpoint-category event
const TRIGGER_PHRASES = [
  'scope expansion',
  'constitutional change',
  'cross-tier',
  'irreversible operation',
  'strategy pivot',
  'expand scope',
  'expanding scope',
  'irreversible',
  'constitutional amendment',
  'tier boundary',
];

// Acknowledgment phrases that satisfy the checkpoint gate
const PCR_ACKNOWLEDGMENTS = [
  'pcr',
  'pros/cons/recommendation',
  'pros / cons / recommendation',
  'stop and ask',
  'ratification needed',
  'ratification required',
  'needs ratification',
  'governor approval',
  'governor must ratify',
  'blocking: ratify',
  'requires approval',
];

let blocking = 0;
let advisory = 0;
let files_checked = 0;
let triggers_found = 0;
let unchecked_expansions = 0;

function hasPcrAcknowledgment(lines, triggerLineIdx) {
  const start = Math.max(0, triggerLineIdx - CONTEXT_WINDOW);
  const end = Math.min(lines.length - 1, triggerLineIdx + CONTEXT_WINDOW);
  const windowText = lines.slice(start, end + 1).join('\n').toLowerCase();
  return PCR_ACKNOWLEDGMENTS.some(phrase => windowText.includes(phrase.toLowerCase()));
}

if (!existsSync(COUNCIL_DIR)) {
  console.log(`[validate-checkpoint-categories] council dir not found, skipping`);
  console.log(`[validate-checkpoint-categories] files_checked=0 triggers_found=0 unchecked_expansions=0 advisory=0`);
  process.exit(0);
}

const entries = readdirSync(COUNCIL_DIR, { withFileTypes: true });
for (const entry of entries) {
  if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
  files_checked++;
  const filePath = join(COUNCIL_DIR, entry.name);
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const recentLines = lines.slice(0, RECENT_LINE_LIMIT);

  for (let i = 0; i < recentLines.length; i++) {
    const lower = recentLines[i].toLowerCase();
    const triggeredPhrase = TRIGGER_PHRASES.find(phrase => lower.includes(phrase.toLowerCase()));
    if (!triggeredPhrase) continue;

    triggers_found++;
    const acknowledged = hasPcrAcknowledgment(recentLines, i);

    if (!acknowledged) {
      unchecked_expansions++;
      advisory++;
      console.warn(`[validate-checkpoint-categories] ADVISORY: ${entry.name}:${i + 1} — checkpoint-category event "${triggeredPhrase}" without PCR/ratification acknowledgment`);
      console.warn(`  Trigger: ${recentLines[i].trim().slice(0, 100)}`);
      console.warn(`  Fix: Include "PCR", "Pros/Cons/Recommendation", or "ratification needed" near checkpoint-category language.`);
    }
  }
}

if (unchecked_expansions > 0) {
  console.warn(`[validate-checkpoint-categories] ${unchecked_expansions} checkpoint-category event(s) found without PCR acknowledgment. Apply B_PCR_FOR_DECISIONS before proceeding with these operations.`);
}

console.log(`[validate-checkpoint-categories] files_checked=${files_checked} triggers_found=${triggers_found} unchecked_expansions=${unchecked_expansions} advisory=${advisory}`);
process.exit(0); // ADVISORY-only: judgment-based, never blocks
