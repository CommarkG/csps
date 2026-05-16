#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-persona-chain-complete
 * @csps-name validate-persona-chain-complete
 * @csps-description Persona Chain Gate: for each PI-NNN file with status: implementing,
 * checks that the persona_chain_log: field exists and all 6 review personas have run
 * (consolidation/balance/domain/ux/critic/synergy). ADVISORY if any step is missing
 * or has status other than 'complete'. Implements OPEN-008.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:developer
 * @csps-enforces P-ARCH-031
 *
 * Coverage Levels:
 *   ✓ Checks: all PI files with status: implementing
 *   ✓ Detects: missing persona_chain_log field, incomplete or missing persona steps
 *   ✗ Does not verify: quality of persona review, only presence + status: complete
 *
 * Exit: 0 always (ADVISORY only)
 * Output: pi_checked=N implementing=N advisories=N
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const PLAN_ITEMS_DIR = resolve(ROOT, 'docs/plan/_handoff/VAULT/plan-items');

const REQUIRED_PERSONAS = ['consolidation', 'balance', 'domain', 'ux', 'critic', 'synergy'];

let piChecked = 0;
let implementing = 0;
let advisories = 0;

if (!existsSync(PLAN_ITEMS_DIR)) {
  console.log(`[validate-persona-chain-complete] plan-items dir not found pi_checked=0 implementing=0 advisories=0`);
  process.exit(0);
}

const files = readdirSync(PLAN_ITEMS_DIR).filter(f => /^PI-\d{3}-.*\.yaml$/.test(f));
piChecked = files.length;

for (const file of files) {
  const content = readFileSync(resolve(PLAN_ITEMS_DIR, file), 'utf-8');

  if (!/^\s*status:\s*implementing/m.test(content)) continue;
  implementing++;

  const piId = file.match(/^(PI-\d{3})/)?.[1] ?? file;

  // Check persona_chain_log field exists
  if (!/persona_chain_log:/m.test(content)) {
    advisories++;
    console.warn(
      `[validate-persona-chain-complete] ADVISORY: ${piId} has no persona_chain_log field.\n` +
      `  File: docs/plan/_handoff/VAULT/plan-items/${file}\n` +
      `  Fix: add persona_chain_log: with all 6 personas (${REQUIRED_PERSONAS.join('/')}) before implementing.\n` +
      `  Each entry: - persona: <name>\\n    status: complete | not-run`
    );
    continue;
  }

  // Check each required persona
  const missingOrIncomplete = [];
  for (const persona of REQUIRED_PERSONAS) {
    // Look for "persona: <name>" followed by "status: complete" nearby
    const personaPattern = new RegExp(`persona:\\s*${persona}[\\s\\S]{0,100}status:\\s*(complete)`, 'm');
    if (!personaPattern.test(content)) {
      missingOrIncomplete.push(persona);
    }
  }

  if (missingOrIncomplete.length > 0) {
    advisories++;
    console.warn(
      `[validate-persona-chain-complete] ADVISORY: ${piId} persona chain incomplete.\n` +
      `  Missing or not-complete: ${missingOrIncomplete.join(', ')}\n` +
      `  File: docs/plan/_handoff/VAULT/plan-items/${file}\n` +
      `  Fix: run all 6 persona reviews and set status: complete for each before implementing.`
    );
  }
}

console.log(`[validate-persona-chain-complete] pi_checked=${piChecked} implementing=${implementing} advisories=${advisories}`);
process.exit(0);
