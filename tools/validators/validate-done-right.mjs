#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-done-right
 * @csps-name validate-done-right
 * @csps-description T2 for B_DONE_RIGHT_FROM_THE_START (gap_T2_ORPHAN_CONTRACTS S055).
 * Checks that new B_* contract files in behavioral-contracts/ declare an
 * enforcement_tier field. A contract without enforcement_tier is documentation,
 * not governance — it will drift by session N+2.
 * "Written rule = 0% complete. T1+T2+T3 = 100% complete." (AGENTS.md)
 * BLOCKING: B_*.md in behavioral-contracts/ missing enforcement_tier declaration
 * ADVISORY: enforcement_tier present but T1 and T2 both show "pending" (no mechanical enforcement)
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_DONE_RIGHT_FROM_THE_START B_ENFORCEMENT_TRIO
 * context_question: "Does every B_* contract declare how it will be enforced? T3-only = will drift."
 * Plan item: gap_T2_ORPHAN_CONTRACTS | S055
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const CONTRACTS_DIR = join(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts');

if (!existsSync(CONTRACTS_DIR)) {
  console.log('[validate-done-right] behavioral-contracts/ directory not found — skipping');
  console.log('[validate-done-right] files_checked=0 missing_enforcement_tier=0 t3_only=0 blocking=0');
  process.exit(0);
}

const files = readdirSync(CONTRACTS_DIR).filter(f => f.startsWith('B_') && f.endsWith('.md'));

let blocking = 0;
let advisory = 0;
let files_checked = 0;

for (const filename of files) {
  const filePath = join(CONTRACTS_DIR, filename);
  const text = readFileSync(filePath, 'utf-8');
  files_checked++;

  const hasEnforcementTier = /enforcement_tier/i.test(text);
  if (!hasEnforcementTier) {
    // Advisory for existing pre-S055 contracts (backfill pass planned for S056).
    // Blocking only for new contracts that explicitly declare session: S055 or later.
    const isNew = /session:\s*S0(5[5-9]|[6-9]\d)/i.test(text);
    if (isNew) {
      console.error(`[validate-done-right] BLOCKING: ${filename} — new contract (S055+) missing enforcement_tier`);
      console.error(`  Fix: add enforcement_tier with T1 (hook), T2 (validator), T3 (session-open) declarations`);
      blocking++;
    } else {
      console.warn(`[validate-done-right] ADVISORY: ${filename} — missing enforcement_tier (pre-S055 backfill needed)`);
      advisory++;
    }
    continue;
  }

  // Advisory: both T1 and T2 are "pending" — T3-only enforcement will drift
  const t1Pending = /T1:\s*pending/i.test(text);
  const t2Pending = /T2:\s*pending/i.test(text);
  if (t1Pending && t2Pending) {
    console.warn(`[validate-done-right] ADVISORY: ${filename} — enforcement_tier present but T1+T2 both pending (T3-only)`);
    console.warn(`  T3-only contracts drift by session N+2. Plan T1 hook or T2 validator.`);
    advisory++;
  }
}

console.log(`[validate-done-right] files_checked=${files_checked} missing_enforcement_tier=${blocking} t3_only=${advisory} blocking=${blocking}`);
process.exit(blocking > 0 ? 1 : 0);
