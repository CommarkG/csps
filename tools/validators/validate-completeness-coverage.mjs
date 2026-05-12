#!/usr/bin/env node
/**
 * validate-completeness-coverage.mjs — Meta-completeness: is the completeness system itself complete?
 *
 * ROOT CAUSE TARGETED: completeness-module.md §4 identifies a meta-gap — the completeness
 * system has 6 contracts but no validator checks that all 6 are active and that this module
 * is referenced from each. Without meta-completeness, the system can silently degrade.
 *
 * What it checks (Phase 1 — advisory):
 *   1. All 6 B_* completeness contracts exist in behavioral-contracts.md
 *   2. completeness-module.md exists (the SSoT)
 *   3. Each completeness contract has a cross-reference to completeness-module.md
 *   4. validate-open-plan-levels.mjs (ZF gate) is in pnpm verify
 *   5. post-stop-pnpm-verify.sh exists (session close completeness)
 *
 * Phase 2 (S027): BLOCKING for missing contracts + Phase 3 close gate enforcement.
 *
 * Governor directive: "define completeness verification regarding itself — meta-completeness"
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = resolve(process.cwd());
const CONTRACTS_FILE = join(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts.md');
const COMPLETENESS_MODULE = join(ROOT, 'docs/plan/pillar-0-governance/completeness-module.md');
const VERIFY_FILE = join(ROOT, 'tools/verify.mjs');
const STOP_HOOK = join(ROOT, '.claude/hooks/post-stop-pnpm-verify.sh');

const REQUIRED_CONTRACTS = [
  'B_RZF',                    // Level 1: finding completeness
  'B_CEC',                    // Level 2: value completeness
  'B_PRE_CLOSE_VERIFICATION', // Level 3: session completeness
  'B_PROTOCOL_LITERAL_EXECUTION', // Level 3: protocol completeness
  'B_CATCH_TO_ENGRAVING',     // Level 3: catch completeness
  'B_QC_AUDIT',               // Level 4: meta-completeness (audit of audits)
];

const advisories = [];
const blockings = [];

// Check 1: completeness-module.md SSoT exists
if (!existsSync(COMPLETENESS_MODULE)) {
  blockings.push('completeness-module.md SSoT not found — the completeness definition has no canonical home');
} else {
  // Check completeness-module.md content
  const moduleContent = readFileSync(COMPLETENESS_MODULE, 'utf8');
  const hasMetaScore = moduleContent.includes('Meta-completeness score');
  if (!hasMetaScore) {
    advisories.push('completeness-module.md §4 missing meta-completeness score field');
  }
}

// Check 2: All 6 B_* contracts exist in behavioral-contracts.md
if (existsSync(CONTRACTS_FILE)) {
  const contractsText = readFileSync(CONTRACTS_FILE, 'utf8');
  for (const contract of REQUIRED_CONTRACTS) {
    if (!contractsText.includes(`## ${contract}`)) {
      blockings.push(`Missing completeness contract: ${contract} not found in behavioral-contracts.md`);
    }
  }
}

// Check 3: validate-open-plan-levels.mjs is in pnpm verify (ZF gate)
if (existsSync(VERIFY_FILE)) {
  const verifyText = readFileSync(VERIFY_FILE, 'utf8');
  if (!verifyText.includes('validate-open-plan-levels')) {
    blockings.push('validate-open-plan-levels.mjs not in pnpm verify — ZF Level 1 finding completeness gate missing');
  }
}

// Check 4: post-stop-pnpm-verify.sh exists (session close completeness)
if (!existsSync(STOP_HOOK)) {
  blockings.push('post-stop-pnpm-verify.sh missing — session close completeness not enforced');
}

// Check 4b: Each B_* completeness contract should reference completeness-module.md
// Phase 2 addition: advisory for contracts not yet cross-referenced
if (existsSync(CONTRACTS_FILE)) {
  const contractsText = readFileSync(CONTRACTS_FILE, 'utf8');
  for (const contract of REQUIRED_CONTRACTS) {
    const contractIdx = contractsText.indexOf(`## ${contract}`);
    if (contractIdx === -1) continue; // already caught above
    // Find end of this contract's body (next ##)
    const nextContractIdx = contractsText.indexOf('\n## ', contractIdx + 1);
    const body = contractsText.slice(contractIdx, nextContractIdx > 0 ? nextContractIdx : contractIdx + 5000);
    if (!body.includes('completeness-module')) {
      advisories.push(`${contract} does not reference completeness-module.md — add cross-reference for SSoT chain`);
    }
  }
}

// Check 5: closingtext template has §10.0 section (session completeness)
const CLOSING_TEMPLATE = join(ROOT, 'docs/plan/_handoff/VAULT/closing-summary-template.md');
if (existsSync(CLOSING_TEMPLATE)) {
  const closingText = readFileSync(CLOSING_TEMPLATE, 'utf8');
  const hasZF = closingText.includes('§10.0') && closingText.includes('pnpm verify');
  if (!hasZF) {
    advisories.push('closing-summary-template.md missing §10.0 pnpm verify requirement');
  }
}

// Report
const total = REQUIRED_CONTRACTS.length + 4; // contracts + SSoT + ZF gate + stop hook + template
const passed = total - blockings.length - advisories.length;

if (blockings.length > 0) {
  console.log(`${blockings.length} BLOCKING — completeness system has structural gaps:`);
  blockings.forEach(b => console.log(`  ✗ ${b}`));
}
if (advisories.length > 0) {
  console.log(`${advisories.length} advisory:`);
  advisories.forEach(a => console.log(`  ⚠ ${a}`));
}
if (blockings.length === 0 && advisories.length === 0) {
  console.log(`[validate-completeness-coverage] completeness system is meta-complete ✓`);
  console.log(`All ${REQUIRED_CONTRACTS.length} completeness contracts active + SSoT + gates verified`);
}

console.log(`[validate-completeness-coverage] contracts=${REQUIRED_CONTRACTS.length} blocking=${blockings.length} advisory=${advisories.length}`);
process.exit(blockings.length > 0 ? 1 : 0);
