#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-activation-coverage
 * @csps-name validate-activation-coverage
 * @csps-description AP-001 T2: checks B_* behavioral contracts for activation mechanisms.
 *   AP-001: "EXISTS ≠ ACTIVE" — a governance artifact must be activated by T1/T2/T3/DNA.
 *   For each B_* contract file in behavioral-contracts/, checks if at least ONE of:
 *     - A T1 hook in .claude/hooks/ references this contract ID
 *     - A T2 validator in tools/validators/ references this contract ID
 *     - An entry in dna-registry.yaml with always_include: true
 *     - session-open.sh references the contract
 *   If NONE: advisory "AP-001 violation — no activation mechanism found."
 *   ADVISORY (exit 0). Graduates to BLOCKING after 3 sessions of stabilization.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-enforces AP-001 B_EXISTS_NOT_EQUALS_ACTIVE VALIDATE-ACTIVATION-COVERAGE
 *
 * Exit: 0 (advisory) — contracts_checked=N activated=N no_activation=N
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const CONTRACTS_DIR = join(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts');
const HOOKS_DIR = join(ROOT, '.claude/hooks');
const VALIDATORS_DIR = join(ROOT, 'tools/validators');
const DNA_REGISTRY = join(ROOT, 'tools/config/dna-registry.yaml');
const SESSION_OPEN = join(ROOT, '.claude/hooks/session-open.sh');

// Load searchable content for activation checks
const hooksContent = existsSync(HOOKS_DIR)
  ? readdirSync(HOOKS_DIR).filter(f => f.endsWith('.sh')).map(f => readFileSync(join(HOOKS_DIR, f), 'utf8')).join('\n')
  : '';
const validatorsContent = existsSync(VALIDATORS_DIR)
  ? readdirSync(VALIDATORS_DIR).filter(f => f.endsWith('.mjs')).map(f => readFileSync(join(VALIDATORS_DIR, f), 'utf8')).join('\n')
  : '';
const dnaContent = existsSync(DNA_REGISTRY) ? readFileSync(DNA_REGISTRY, 'utf8') : '';
const sessionOpenContent = existsSync(SESSION_OPEN) ? readFileSync(SESSION_OPEN, 'utf8') : '';

if (!existsSync(CONTRACTS_DIR)) {
  console.log('[validate-activation-coverage] behavioral-contracts/ not found — skipping');
  process.exit(0);
}

const contractFiles = readdirSync(CONTRACTS_DIR).filter(f => f.startsWith('B_') && f.endsWith('.md'));
let contractsChecked = 0;
let activated = 0;
let noActivation = 0;

for (const file of contractFiles) {
  const id = file.replace('.md', '');
  contractsChecked++;

  // Check 4 activation mechanisms
  const inHook = hooksContent.includes(id);
  const inValidator = validatorsContent.includes(id);
  const inDna = dnaContent.includes(id) && dnaContent.includes('always_include: true');
  const inSessionOpen = sessionOpenContent.includes(id);

  if (inHook || inValidator || inDna || inSessionOpen) {
    activated++;
  } else {
    noActivation++;
    console.log(`  ADVISORY [AP-001] ${id}: no activation mechanism found (T1/T2/session-open/DNA-always_include). Exists ≠ active.`);
  }
}

console.log(`[validate-activation-coverage] contracts_checked=${contractsChecked} activated=${activated} no_activation=${noActivation}`);
if (noActivation > 0) {
  console.log(`[validate-activation-coverage] ADVISORY: ${noActivation} B_* contracts have no activation mechanism — documentation only.`);
  console.log(`[validate-activation-coverage] Ref: docs/plan/pillar-0-governance/anti-patterns.md AP-001`);
}
process.exit(0); // advisory — graduates to blocking after 3 sessions
