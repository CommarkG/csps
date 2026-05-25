#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-definition-before-enforcement
 * @csps-name validate-definition-before-enforcement
 * @csps-description T2 for B_DEFINITION_BEFORE_ENFORCEMENT. Checks that every
 * principle with enforcement_tier declared also has governing_intent (or equivalent
 * definition field) present. Enforcement without definition = pattern-matching, not
 * verification. The rule must be sharp before the mechanism is attached.
 * ADVISORY-only: exits 0 always. Surfaces count for governance review.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_DEFINITION_BEFORE_ENFORCEMENT P-META-019
 * context_question: "Does any principle carry enforcement_tier without a governing_intent or satisfaction_point?"
 * Plan item: gap_T2_ORPHAN_CONTRACTS | S061
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const PRINCIPLES_FILE = join(ROOT, 'packages/principles/principles.yaml');

let blocking = 0;
let advisory = 0;
let files_checked = 0;
let principles_checked = 0;
let with_enforcement_tier = 0;
let missing_definition = 0;

// Fields that count as "definition present"
const DEFINITION_FIELDS = [
  'governing_intent:',
  'governing_principle:',
  'satisfaction_point:',
  'intent:',
  'purpose:',
];

if (!existsSync(PRINCIPLES_FILE)) {
  console.log(`[validate-definition-before-enforcement] principles file not found, skipping`);
  console.log(`[validate-definition-before-enforcement] principles_checked=0 with_enforcement_tier=0 missing_definition=0 advisory=0`);
  process.exit(0);
}

files_checked = 1;
const raw = readFileSync(PRINCIPLES_FILE, 'utf-8');

// Split into principle blocks. Each block starts with "  - id:" (2-space indent)
// The first block may start at position 0 if the file begins with "- id:" (no indent)
const blocks = raw.split(/\n  - id:/);

for (let idx = 0; idx < blocks.length; idx++) {
  const block = blocks[idx];
  if (!block.trim()) continue;

  // Extract the id for reporting
  const idMatch = block.match(/^[\s\S]*?(?:^|\n)\s*id:\s*(.+)/m) ||
                  block.match(/^([^\n]+)/); // fallback: first line is the id value after split
  const principleId = idMatch ? idMatch[1].trim() : `block-${idx}`;

  principles_checked++;

  const hasEnforcementTier = /enforcement_tier:/i.test(block);
  if (!hasEnforcementTier) continue;

  with_enforcement_tier++;

  const hasDefinition = DEFINITION_FIELDS.some(field =>
    block.toLowerCase().includes(field.toLowerCase())
  );

  if (!hasDefinition) {
    missing_definition++;
    advisory++;
    console.warn(`[validate-definition-before-enforcement] ADVISORY: principle "${principleId}" has enforcement_tier but no governing_intent/satisfaction_point. Define the rule before the mechanism.`);
  }
}

if (missing_definition > 0) {
  console.warn(`[validate-definition-before-enforcement] ${missing_definition} principle(s) have enforcement_tier without definition. Add governing_intent: or satisfaction_point: before adding T1/T2 validators.`);
}

console.log(`[validate-definition-before-enforcement] principles_checked=${principles_checked} with_enforcement_tier=${with_enforcement_tier} missing_definition=${missing_definition} advisory=${advisory}`);
process.exit(0); // ADVISORY-only: never blocks
