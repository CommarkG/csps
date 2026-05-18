#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/
 * core_spine: GVRN
 * governing_principle: P-META-019
 * behavioral_contract: B_STRUCTURAL_PREVENTION_DISCIPLINE
 * role: Checks enforcement_trio presence on PI items AND all 62 behavioral contracts
 * @csps-enforces P-ARCH-031
 *
 * @csps-id csps.tools.validators.validate-enforcement-trio-assigned
 * @csps-name validate-enforcement-trio-assigned
 * @csps-description Enforcement Trio Gate: (1) PI items — checks enforcement_trio: field.
 * (2) Behavioral contracts — checks T1/T2/T3 declaration in contract body.
 * ADVISORY for all. 52+ contracts T3-only or unenforced = structural drift risk.
 * Constitutional: rules without tier assignment = suggestions, not governance (OPUS-2 Turn 84 §1).
 * @csps-version 2.0.0 (S041 — extended to cover 62 behavioral contracts)
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:developer
 * @csps-enforces P-ARCH-031 P-META-019
 *
 * Coverage:
 *   ✓ PI files: checks enforcement_trio: field on ratified/implementing PIs
 *   ✓ Behavioral contracts: checks T1+T2+T3 declarations in behavioral-contracts.md
 *   ✗ Does not validate correctness of assignments — only presence
 *
 * Exit: 0 always (ADVISORY)
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const PLAN_ITEMS_DIR = resolve(ROOT, 'docs/plan/_handoff/VAULT/plan-items');
const CONTRACTS_FILE = resolve(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts.md');

// ── PART 1: PI Items (original behavior) ──────────────────────────────────────

let piChecked = 0;
let active = 0;
let missingTrio = 0;

if (existsSync(PLAN_ITEMS_DIR)) {
  const files = readdirSync(PLAN_ITEMS_DIR).filter(f => /^PI-\d{3}-.*\.yaml$/.test(f));
  piChecked = files.length;

  for (const file of files) {
    const content = readFileSync(resolve(PLAN_ITEMS_DIR, file), 'utf-8');
    const hasActiveStatus = /^\s*status:\s*(ratified|implementing)/m.test(content);
    if (!hasActiveStatus) continue;
    active++;

    const piId = file.match(/^(PI-\d{3})/)?.[1] ?? file;
    if (!/enforcement_trio:/m.test(content)) {
      missingTrio++;
      console.warn(
        `[validate-enforcement-trio-assigned] ADVISORY: ${piId} has no enforcement_trio: field.\n` +
        `  File: docs/plan/_handoff/VAULT/plan-items/${file}\n` +
        `  Fix: add enforcement_trio: with tier1_hook, tier2_validator, tier3_session fields.`
      );
    }
  }
}

console.log(`[validate-enforcement-trio-assigned] pi_checked=${piChecked} active=${active} missing_trio=${missingTrio}`);

// ── PART 2: Behavioral Contracts (new — S041 OPEN-046) ────────────────────────

if (!existsSync(CONTRACTS_FILE)) {
  console.log(`[validate-enforcement-trio-assigned] behavioral-contracts.md not found — skipping contract scan`);
  process.exit(0);
}

const contractsContent = readFileSync(CONTRACTS_FILE, 'utf-8');
const lines = contractsContent.split('\n');

// Find all contract definitions (## B_* headers)
const contracts = [];
let currentContract = null;
let currentBody = [];

for (const line of lines) {
  if (/^## B_/.test(line)) {
    if (currentContract) {
      contracts.push({ name: currentContract, body: currentBody.join('\n') });
    }
    currentContract = line.replace(/^## /, '').split(' ')[0].trim();
    currentBody = [];
  } else if (currentContract) {
    currentBody.push(line);
  }
}
if (currentContract) {
  contracts.push({ name: currentContract, body: currentBody.join('\n') });
}

const contractsChecked = contracts.length;
const hasT1 = (body) => /T1\s*(hook|:|\s+[`.])/.test(body) || /tier1_hook/.test(body) || /\bT1\b/.test(body);
const hasT2 = (body) => /T2\s*(valid|:|\s+[`.])/.test(body) || /tier2_valid/.test(body) || /\bT2\b/.test(body);
const hasT3 = (body) => /T3\s*(sess|inject|:|\s+[`.])/.test(body) || /tier3_sess/.test(body) || /\bT3\b/.test(body);

let fullTrio = 0;
let partialEnforcement = 0;
let noEnforcement = 0;
const t3Only = [];
const unenforcedList = [];

for (const { name, body } of contracts) {
  const t1 = hasT1(body);
  const t2 = hasT2(body);
  const t3 = hasT3(body);
  const total = (t1 ? 1 : 0) + (t2 ? 1 : 0) + (t3 ? 1 : 0);

  if (total === 3) {
    fullTrio++;
  } else if (total === 0) {
    noEnforcement++;
    unenforcedList.push(name);
  } else {
    partialEnforcement++;
    if (t3 && !t1 && !t2) {
      t3Only.push(name);
    } else {
      // partial but not T3-only
      unenforcedList.push(`${name} (partial: T1=${t1} T2=${t2} T3=${t3})`);
    }
  }
}

console.log(`\n[validate-enforcement-trio-assigned] CONTRACT SCAN:`);
console.log(`  contracts_checked=${contractsChecked} full_trio=${fullTrio} t3_only=${t3Only.length} partial=${partialEnforcement - t3Only.length} no_enforcement=${noEnforcement}`);

if (t3Only.length > 0) {
  console.warn(`\n  ⚠ T3-ONLY contracts (session injection only — will drift by turn 10):`);
  t3Only.forEach(name => console.warn(`    - ${name}`));
}

if (unenforcedList.length > 0) {
  console.warn(`\n  ⚠ UNENFORCED / PARTIAL contracts:`);
  unenforcedList.slice(0, 20).forEach(name => console.warn(`    - ${name}`));
  if (unenforcedList.length > 20) {
    console.warn(`    ... and ${unenforcedList.length - 20} more`);
  }
}

if (t3Only.length + noEnforcement > 0) {
  const driftRisk = t3Only.length + noEnforcement;
  console.warn(`\n  ADVISORY: ${driftRisk} contracts at drift risk (T3-only or unenforced).`);
  console.warn(`  These contracts exist as documented rules only — no mechanical enforcement fires if violated.`);
  console.warn(`  Priority: add T1 hook + T2 validator to contracts with highest governance impact.`);
  console.warn(`  Reference: OPEN-049 (S041) — enforcement_tier field to be added to each contract.`);
}

console.log(`\n[validate-enforcement-trio-assigned] advisory_gaps=${t3Only.length + noEnforcement} full_enforcement=${fullTrio}`);
process.exit(0);
