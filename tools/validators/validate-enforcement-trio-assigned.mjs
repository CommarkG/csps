#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-enforcement-trio-assigned
 * @csps-name validate-enforcement-trio-assigned
 * @csps-description Enforcement Trio Gate: for each PI-NNN file with status: ratified or
 * implementing, checks that the enforcement_trio: field exists. ADVISORY for all (transition
 * period — legacy PIs pre-S037 don't have the field). Constitutional: rules without tier
 * assignment = suggestions, not governance (OPUS-2 Turn 84 §1).
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:developer
 * @csps-enforces P-ARCH-031
 *
 * Coverage Levels:
 *   ✓ Checks: all PI files with status: ratified | implementing
 *   ✓ Detects: missing enforcement_trio: field
 *   ✗ Does not validate: correctness of tier assignments — only presence
 *
 * Exit: 0 always (ADVISORY — transition period until PI backfill)
 * Output: pi_checked=N active=N missing_trio=N
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const PLAN_ITEMS_DIR = resolve(ROOT, 'docs/plan/_handoff/VAULT/plan-items');

let piChecked = 0;
let active = 0;
let missingTrio = 0;

if (!existsSync(PLAN_ITEMS_DIR)) {
  console.log(`[validate-enforcement-trio-assigned] plan-items dir not found pi_checked=0 active=0 missing_trio=0`);
  process.exit(0);
}

const files = readdirSync(PLAN_ITEMS_DIR).filter(f => /^PI-\d{3}-.*\.yaml$/.test(f));
piChecked = files.length;

for (const file of files) {
  const content = readFileSync(resolve(PLAN_ITEMS_DIR, file), 'utf-8');

  // Only check ratified or implementing PIs
  const hasActiveStatus = /^\s*status:\s*(ratified|implementing)/m.test(content);
  if (!hasActiveStatus) continue;
  active++;

  const piId = file.match(/^(PI-\d{3})/)?.[1] ?? file;

  if (!/enforcement_trio:/m.test(content)) {
    missingTrio++;
    console.warn(
      `[validate-enforcement-trio-assigned] ADVISORY: ${piId} has no enforcement_trio: field.\n` +
      `  File: docs/plan/_handoff/VAULT/plan-items/${file}\n` +
      `  Fix: add enforcement_trio: with tier1_hook, tier2_validator, tier3_session, permanence fields.\n` +
      `  Example:\n` +
      `    enforcement_trio:\n` +
      `      tier1_hook: null  # or hook name if violation detectable in AI output\n` +
      `      tier2_validator: validate-wiring-completeness.mjs  # or validator name\n` +
      `      tier3_session: "check wiring checklist at session-open"\n` +
      `      permanence: medium  # high|medium|low based on tier coverage\n` +
      `  Rationale: rules without tier assignment = suggestions (OPUS-2 Turn 84 §1)`
    );
  }
}

console.log(`[validate-enforcement-trio-assigned] pi_checked=${piChecked} active=${active} missing_trio=${missingTrio}`);
process.exit(0);
