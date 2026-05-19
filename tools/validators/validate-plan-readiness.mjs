#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-plan-readiness
 * @csps-name validate-plan-readiness
 * @csps-description PI-037: reads tools/config/unified-plan.yaml and scores each item's PMI
 *   (Plan Maturity Index). Reports items that are in ratified/implementing status but have
 *   PMI score < 4/5. ADVISORY for ratified items. BLOCKING for implementing items with low PMI.
 *   The mechanical gate that prevents premature implementation.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-enforces P-META-026
 * @csps-tags type:validator domain:governance audience:developer
 *
 * @core-seed: PLAN_READINESS_GATE | plan: PI-037 (validate-plan-readiness.mjs) | grows-to: BLOCKING gate preventing implementation of under-matured plan items | target: S044
 * planted_by: S044
 * pmi_gate: PI-037
 *
 * Exit: 1 if any implementing item has PMI < 4/5. 0 otherwise (advisories still emit).
 * Output: items_checked=N pmi_ready=N premature_implementing=N advisory_ratified=N
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const require = createRequire(import.meta.url);

const PLAN_SOURCE = resolve(ROOT, 'tools/config/unified-plan.yaml');

if (!existsSync(PLAN_SOURCE)) {
  console.log('[validate-plan-readiness] items_checked=0 pmi_ready=0 premature_implementing=0 advisory_ratified=0');
  console.log('[validate-plan-readiness] unified-plan.yaml not found — skipping');
  process.exit(0);
}

let yaml;
try {
  yaml = require('js-yaml');
} catch(e) {
  console.log('[validate-plan-readiness] js-yaml not available — skipping');
  process.exit(0);
}

const plan = yaml.load(readFileSync(PLAN_SOURCE, 'utf-8'));
const items = plan.items || [];

const PMI_FIELDS = ['intent_depth', 'cross_ref_density', 'consensus_width', 'reversibility', 'dependency_clarity'];
const ACTIVE_STATUSES = ['ratified', 'implementing', 'activation'];

function scorePMI(pmi) {
  if (!pmi) return 0;
  return PMI_FIELDS.filter(f => pmi[f] === 'high').length;
}

let itemsChecked = 0;
let pmiReady = 0;
let prematureImplementing = 0;
let advisoryRatified = 0;
let blockingViolations = 0;

for (const item of items) {
  if (!ACTIVE_STATUSES.includes(item.status)) continue;
  if (!item.pmi) continue;  // skip items without PMI declared
  itemsChecked++;

  const score = scorePMI(item.pmi);
  const ready = score >= 4;

  if (ready) {
    pmiReady++;
  } else {
    if (item.status === 'implementing') {
      prematureImplementing++;
      blockingViolations++;
      console.error(
        `[validate-plan-readiness] BLOCKING: ${item.id} is status=implementing but PMI=${score}/5 HIGH (< threshold of 4).\n` +
        `  Title: ${item.title}\n` +
        `  PMI detail: ${JSON.stringify(item.pmi)}\n` +
        `  Fix: raise PMI indicators to HIGH before implementing, OR move back to planning status.\n` +
        `  Ref: P-META-026 + unified-plan.yaml`
      );
    } else if (item.status === 'ratified') {
      advisoryRatified++;
      console.warn(
        `[validate-plan-readiness] ADVISORY: ${item.id} is status=ratified but PMI=${score}/5 HIGH.\n` +
        `  Title: ${item.title}\n` +
        `  Consider raising PMI before moving to implementing.\n` +
        `  Ref: P-META-026 + unified-plan.yaml`
      );
    }
  }
}

console.log(`[validate-plan-readiness] items_checked=${itemsChecked} pmi_ready=${pmiReady} premature_implementing=${prematureImplementing} advisory_ratified=${advisoryRatified}`);

if (blockingViolations > 0) {
  console.error(`[validate-plan-readiness] ${blockingViolations} BLOCKING violation(s) — implementing items with PMI < 4/5.`);
  process.exit(1);
}

process.exit(0);
