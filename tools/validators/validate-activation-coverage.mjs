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
 *   If NONE and not in activation-coverage-exempt.yaml: BLOCKING (exit 1).
 *   Exempt contracts: see tools/config/activation-coverage-exempt.yaml (24 legacy contracts).
 *   NEW contracts not in exempt list → BLOCKING immediately.
 * @csps-version 2.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-enforces AP-001 B_EXISTS_NOT_EQUALS_ACTIVE VALIDATE-ACTIVATION-COVERAGE
 *
 * Exit: 1 if any non-exempt contract has 0 activation surfaces. 0 otherwise.
 * Output: contracts_checked=N activated=N no_activation=N blocking=N advisory=N
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const require = createRequire(import.meta.url);

// Load exempt list
const EXEMPT_PATH = join(ROOT, 'tools/config/activation-coverage-exempt.yaml');
let exemptIds = new Set();
try {
  const yaml = require('js-yaml');
  const exemptData = yaml.load(readFileSync(EXEMPT_PATH, 'utf8'));
  if (exemptData && exemptData.exemptions) {
    for (const e of exemptData.exemptions) exemptIds.add(e.id);
  }
} catch {
  // Exempt list not available — continue without exemptions
}

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
let blocking = 0;
let advisory = 0;

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
    const isExempt = exemptIds.has(id);
    if (isExempt) {
      advisory++;
      console.log(`  ADVISORY [AP-001] ${id}: no activation (exempt — see activation-coverage-exempt.yaml)`);
    } else {
      blocking++;
      console.log(`  ⛔ BLOCKING [AP-001] ${id}: no activation mechanism found. NOT in exempt list. Add T1/T2/DNA or add to exempt with reason.`);
    }
  }
}

console.log(`[validate-activation-coverage] contracts_checked=${contractsChecked} activated=${activated} no_activation=${noActivation} blocking=${blocking} advisory=${advisory}`);
if (blocking > 0) {
  console.log(`[validate-activation-coverage] ✗ ${blocking} B_* contracts BLOCKING — no activation + not exempt`);
  console.log(`[validate-activation-coverage] Fix: add T1/T2/session-open/DNA or add to tools/config/activation-coverage-exempt.yaml`);
  process.exit(1);
}
if (advisory > 0) {
  console.log(`[validate-activation-coverage] ADVISORY: ${advisory} contracts exempt (scheduled activation — see exempt list)`);
}
process.exit(0);
