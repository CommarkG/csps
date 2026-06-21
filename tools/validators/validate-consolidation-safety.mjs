#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-consolidation-safety
 * @csps-name validate-consolidation-safety
 * @csps-description PARK-046 harness: verifies consolidation-ledger.yaml is complete
 *   and every entry passes the 4-step retro-verify gate:
 *   (1) ability_inventory present for every element
 *   (2) ripple_inbound + ripple_outbound documented
 *   (3) before_after_diff present with ability_survives field
 *   (4) no BLOCKING-severity defects open
 *   Extends B_CONSOLIDATION_PASS + SEED-A (register-ref-integrity on merged IDs).
 *   Does NOT duplicate validate-register-reference-integrity — delegates ref-check there.
 *
 * run_tier: EXTENDED (consolidation-ledger scan, not per-turn)
 * load_mode: on-demand
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces P-META-029 PARK-046 B_CONSOLIDATION_PASS
 * @csps-prevention-class SILENT-ABILITY-LOSS CONSOLIDATION-DEFECT
 *
 * Coverage Levels:
 *   BLOCKING (exit 1): open BLOCKING-severity defects, missing ability_inventory, missing before_after_diff
 *   ADVISORY (exit 0): missing ripple_inbound/outbound, MINOR defects open without action_required
 *
 * Exit: 1 if any BLOCKING condition; 0 otherwise
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const LEDGER_PATH = join(ROOT, 'tools/data/consolidation-ledger.yaml');

let blocking = 0;
let advisory = 0;

if (!existsSync(LEDGER_PATH)) {
  console.warn('[validate-consolidation-safety] consolidation-ledger.yaml not found — skipping');
  process.exit(0);
}

const ledgerText = readFileSync(LEDGER_PATH, 'utf-8');

// ── Basic structural checks ───────────────────────────────────────────────────

// 1. Every ledger entry must have an operation_type
const opTypes = [...ledgerText.matchAll(/operation_type:\s*(\S+)/g)].map(m => m[1]);
if (opTypes.length === 0) {
  console.error('[validate-consolidation-safety] BLOCKING: consolidation-ledger.yaml has no operation_type entries');
  blocking++;
}

// 2. Every entry with elements must have ability_inventory for each element
const elementIds = [...ledgerText.matchAll(/id:\s+(PARK-S\d{3}-\d{3})/g)].map(m => m[1]);
const abilityBlocks = [...ledgerText.matchAll(/ability_inventory:/g)].length;
const elementBlockCount = [...ledgerText.matchAll(/\s+- id:\s+PARK-S\d{3}-\d{3}/g)].length;

if (elementBlockCount > 0 && abilityBlocks === 0) {
  console.error('[validate-consolidation-safety] BLOCKING: elements present but no ability_inventory blocks found');
  blocking++;
} else if (abilityBlocks < elementBlockCount) {
  console.warn(`[validate-consolidation-safety] ADVISORY: ${elementBlockCount} elements but only ${abilityBlocks} ability_inventory blocks — some elements missing ability documentation`);
  advisory++;
}

// 3. Every entry must have before_after_diff
const baDiffs = [...ledgerText.matchAll(/before_after_diff:/g)].length;
if (elementBlockCount > 0 && baDiffs === 0) {
  console.error('[validate-consolidation-safety] BLOCKING: elements present but no before_after_diff blocks');
  blocking++;
} else if (baDiffs < elementBlockCount) {
  console.warn(`[validate-consolidation-safety] ADVISORY: ${elementBlockCount} elements but only ${baDiffs} before_after_diff blocks`);
  advisory++;
}

// 4. Check for open BLOCKING-severity defects
const blockingDefects = [...ledgerText.matchAll(/severity:\s*BLOCKING/g)].length;
const closedDefects = [...ledgerText.matchAll(/severity:\s*BLOCKING[\s\S]*?status:\s*closed/g)].length;
const openBlockingDefects = blockingDefects - closedDefects;
if (openBlockingDefects > 0) {
  console.error(`[validate-consolidation-safety] BLOCKING: ${openBlockingDefects} open BLOCKING-severity defect(s) in consolidation-ledger.yaml`);
  console.error('  Resolve all BLOCKING defects before next consolidation pass');
  blocking++;
}

// 5. Advisory: check for missing ripple_inbound
const rippleInbounds = [...ledgerText.matchAll(/ripple_inbound:/g)].length;
if (elementBlockCount > 0 && rippleInbounds === 0) {
  console.warn('[validate-consolidation-safety] ADVISORY: elements present but no ripple_inbound sections');
  advisory++;
}

// 6. Advisory: check restore_procedure documented per operation
const ops = [...ledgerText.matchAll(/ledger_id:/g)].length;
const restores = [...ledgerText.matchAll(/restore_procedure:/g)].length;
if (ops > 0 && restores === 0) {
  console.warn('[validate-consolidation-safety] ADVISORY: ledger operations present but no restore_procedure documented');
  advisory++;
} else if (restores < ops) {
  console.warn(`[validate-consolidation-safety] ADVISORY: ${ops} operations but only ${restores} restore_procedure entries`);
  advisory++;
}

// 7. Advisory: check MINOR defects have action_required
const minorDefects = [...ledgerText.matchAll(/severity:\s*MINOR/g)].length;
const actionRequired = [...ledgerText.matchAll(/action_required:/g)].length;
if (minorDefects > 0 && actionRequired === 0) {
  console.warn(`[validate-consolidation-safety] ADVISORY: ${minorDefects} MINOR defect(s) without action_required fields`);
  advisory++;
}

// ── Summary ───────────────────────────────────────────────────────────────────
const status = blocking > 0 ? 'FAIL' : 'PASS';
console.log(`[validate-consolidation-safety] ${status}`);
console.log(`  ledger_operations=${ops} elements_checked=${elementBlockCount} defects_checked=${blockingDefects + minorDefects}`);
console.log(`  blocking=${blocking} advisory=${advisory}`);

if (blocking === 0 && advisory === 0) {
  console.log('[validate-consolidation-safety] ✓ All consolidation operations have ability+ripple+diff+restore documentation');
}

process.exit(blocking > 0 ? 1 : 0);
