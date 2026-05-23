#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-ai-conception-enforcement
 * @csps-name validate-ai-conception-enforcement
 * @csps-description Structural fix for gap_T1_AI_CONCEPTION_VAULT (K=5, open since S042).
 * Scans tools/vault/ai-conception/ files for enforcement_tier field.
 * "Existence ≠ Active" (AP-001) — AI conception contracts that exist but have no
 * enforcement_tier are documentation theater, not governance.
 * ADVISORY: enforcement_tier field missing (pre-S055 baseline — most will show missing)
 * ADVISORY: enforcement_tier.T1 missing (no hook wired)
 * ADVISORY: enforcement_tier.T2 missing (no validator wired)
 * Advisory-only for now. Will graduate to BLOCKING for new S056+ files after backfill.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces AP-001 B_STRUCTURAL_PREVENTION_DISCIPLINE
 * context_question: "How many AI conception vault contracts have declared T1+T2 enforcement? That number is your governance enforcement rate for this tier."
 * Plan item: gap_T1_AI_CONCEPTION_VAULT | S055
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const VAULT_DIR = join(ROOT, 'tools/vault/ai-conception');

if (!existsSync(VAULT_DIR)) {
  console.log('[validate-ai-conception-enforcement] ai-conception/ vault not found — skipping');
  console.log('[validate-ai-conception-enforcement] files_checked=0 missing_tier=0 missing_t1=0 missing_t2=0 advisory=0 blocking=0');
  process.exit(0);
}

const files = readdirSync(VAULT_DIR).filter(f => f.endsWith('.md'));

let files_checked = 0;
let missing_tier = 0;
let missing_t1 = 0;
let missing_t2 = 0;
let advisory = 0;

for (const filename of files) {
  const text = readFileSync(join(VAULT_DIR, filename), 'utf-8');
  files_checked++;

  const hasTier = /enforcement_tier/i.test(text);
  const hasT1 = /T1:/i.test(text);
  const hasT2 = /T2:/i.test(text);

  if (!hasTier) {
    console.warn(`[validate-ai-conception-enforcement] ADVISORY: ${filename} — no enforcement_tier field`);
    console.warn(`  Add: enforcement_tier: { T1: pending, T2: pending, T3: session-open }`);
    missing_tier++;
    advisory++;
  } else {
    if (!hasT1) {
      console.warn(`[validate-ai-conception-enforcement] ADVISORY: ${filename} — enforcement_tier present but T1 not declared`);
      missing_t1++;
      advisory++;
    }
    if (!hasT2) {
      console.warn(`[validate-ai-conception-enforcement] ADVISORY: ${filename} — enforcement_tier present but T2 not declared`);
      missing_t2++;
      advisory++;
    }
  }
}

const enforcement_rate_pct = files_checked > 0
  ? Math.round(((files_checked - missing_tier) / files_checked) * 100)
  : 0;

console.log(`[validate-ai-conception-enforcement] files_checked=${files_checked} missing_tier=${missing_tier} missing_t1=${missing_t1} missing_t2=${missing_t2} enforcement_rate=${enforcement_rate_pct}% advisory=${advisory} blocking=0`);
process.exit(0);
