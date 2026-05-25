#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-autonomy-conditions
 * @csps-name validate-autonomy-conditions
 * @csps-description T2 for B_AUTONOMY_4_CONDITIONS. Scans recent council files for
 * autonomous-action language that does not cite all 4 conditions: ratified scope,
 * reversible, mechanical, no cross-actor. Autonomous execution without citing all 4
 * conditions is a governance gap — the AI may proceed in scope it was never ratified
 * to enter. Advisory only: judgment-based detection, exits 0 always.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_AUTONOMY_4_CONDITIONS P-META-019
 * context_question: "Does any recent council entry invoke autonomous execution without citing all 4 gate conditions?"
 * Plan item: gap_T2_ORPHAN_CONTRACTS | S061
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const COUNCIL_DIR = join(ROOT, 'tools/council');
const RECENT_LINE_LIMIT = 100;
const CONTEXT_WINDOW = 10; // lines before and after trigger

// Trigger phrases that indicate autonomous execution being invoked
const TRIGGER_PHRASES = [
  'ai can proceed',
  'proceed autonomously',
  'autonomous execution',
  'without asking',
  'ai proceeds without',
  'proceed without confirmation',
  'execute without',
  'autonomously execute',
];

// The 4 condition marker sets — at least one from each group must appear nearby
const CONDITION_GROUPS = [
  // Condition 1: ratified scope
  ['ratified', 'within.*scope', 'authorized', 'approved scope', 'within scope'],
  // Condition 2: reversible
  ['reversible'],
  // Condition 3: mechanical
  ['mechanical'],
  // Condition 4: no cross-actor
  ['no.*cross-actor', 'cross-actor', 'no cross', 'single actor', 'no.*cross actor'],
];

let blocking = 0;
let advisory = 0;
let files_checked = 0;
let triggers_found = 0;
let missing_condition_count = 0;

function checkConditions(lines, triggerLineIdx) {
  const start = Math.max(0, triggerLineIdx - CONTEXT_WINDOW);
  const end = Math.min(lines.length - 1, triggerLineIdx + CONTEXT_WINDOW);
  const windowText = lines.slice(start, end + 1).join('\n').toLowerCase();

  const missingGroups = [];
  for (let g = 0; g < CONDITION_GROUPS.length; g++) {
    const group = CONDITION_GROUPS[g];
    const found = group.some(pattern => {
      try {
        return new RegExp(pattern, 'i').test(windowText);
      } catch {
        return windowText.includes(pattern.toLowerCase());
      }
    });
    if (!found) missingGroups.push(g + 1);
  }
  return missingGroups;
}

if (!existsSync(COUNCIL_DIR)) {
  console.log(`[validate-autonomy-conditions] council dir not found, skipping`);
  console.log(`[validate-autonomy-conditions] files_checked=0 triggers_found=0 missing_condition_count=0 advisory=0`);
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
    const triggered = TRIGGER_PHRASES.some(phrase => lower.includes(phrase));
    if (!triggered) continue;

    triggers_found++;
    const missingGroups = checkConditions(recentLines, i);

    if (missingGroups.length > 0) {
      missing_condition_count += missingGroups.length;
      advisory++;
      const conditionNames = ['ratified-scope', 'reversible', 'mechanical', 'no-cross-actor'];
      const missing = missingGroups.map(g => conditionNames[g - 1]).join(', ');
      console.warn(`[validate-autonomy-conditions] ADVISORY: ${entry.name}:${i + 1} — autonomous execution trigger found, missing condition(s): [${missing}]`);
      console.warn(`  Trigger: ${recentLines[i].trim().slice(0, 100)}`);
      console.warn(`  Fix: Cite all 4 conditions (ratified scope, reversible, mechanical, no-cross-actor) near the autonomous execution invocation.`);
    }
  }
}

console.log(`[validate-autonomy-conditions] files_checked=${files_checked} triggers_found=${triggers_found} missing_condition_count=${missing_condition_count} advisory=${advisory}`);
process.exit(0); // ADVISORY-only: judgment-based, never blocks
