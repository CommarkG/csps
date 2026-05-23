#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-positive-reflexivity
 * @csps-name validate-positive-reflexivity
 * @csps-description POSITIVE-REFLEXIVITY enforcement. Checks that every K>=2 entry
 * in improvement-register.yaml has either:
 *   (a) a corresponding draft in tools/data/pending-plan-items.yaml, OR
 *   (b) a matching plan item already in tools/config/unified-plan.yaml
 * If neither: BLOCKING. If draft exists but not promoted: ADVISORY.
 * "Positive findings that accumulate at K>=2 without a plan item draft are falling through."
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE
 * context_question: "Are there K>=2 positive improvements without a draft plan item? Those block session close."
 * Wired: tools/verify.mjs cycle 'positive_reflexivity'
 * Plan item: POSITIVE-REFLEXIVITY | S055
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const IMPROVEMENT_FILE = resolve(ROOT, 'tools/data/improvement-register.yaml');
const PENDING_FILE = resolve(ROOT, 'tools/data/pending-plan-items.yaml');
const PLAN_FILE = resolve(ROOT, 'tools/config/unified-plan.yaml');

const SKIP_STATUSES = new Set(['propagated', 'closed']);

function parseImprovementEntries(text) {
  const entries = [];
  const lines = text.split('\n');
  let current = null;

  for (const line of lines) {
    if (/^\s{2}-\s+id:\s+/.test(line)) {
      if (current) entries.push(current);
      current = { id: line.replace(/.*id:\s*/, '').trim() };
    } else if (current && /^\s{4}k_count:\s+/.test(line)) {
      current.k_count = Number(line.replace(/.*k_count:\s*/, '').trim());
    } else if (current && /^\s{4}status:\s+/.test(line)) {
      current.status = line.replace(/.*status:\s*/, '').trim();
    }
  }
  if (current) entries.push(current);
  return entries;
}

function parsePendingDraftIds(text) {
  const ids = new Set();
  const matches = text.matchAll(/source_id:\s*(\S+)/g);
  for (const m of matches) ids.add(m[1]);
  return ids;
}

function planHasEntry(planText, impId) {
  const derived = impId.replace(/^imp_/, '').replace(/_/g, '-').toUpperCase();
  return planText.includes(impId) || planText.includes(derived);
}

if (!existsSync(IMPROVEMENT_FILE)) {
  console.log('[validate-positive-reflexivity] improvement-register.yaml not found — skipping');
  console.log('[validate-positive-reflexivity] entries=0 missing_drafts=0 advisory_drafts=0 blocking=0');
  process.exit(0);
}

const improvementRaw = readFileSync(IMPROVEMENT_FILE, 'utf-8');
const pendingRaw = existsSync(PENDING_FILE) ? readFileSync(PENDING_FILE, 'utf-8') : '';
const planRaw = existsSync(PLAN_FILE) ? readFileSync(PLAN_FILE, 'utf-8') : '';

const entries = parseImprovementEntries(improvementRaw);
const draftIds = parsePendingDraftIds(pendingRaw);

let blocking = 0;
let advisory = 0;
let covered = 0;

for (const entry of entries) {
  const k = entry.k_count ?? 0;
  if (k < 2) continue;
  if (SKIP_STATUSES.has(entry.status)) { covered++; continue; }

  const hasDraft = draftIds.has(entry.id);
  const hasPlanItem = planHasEntry(planRaw, entry.id);

  if (hasPlanItem) {
    covered++;
  } else if (hasDraft) {
    console.warn(`[validate-positive-reflexivity] ADVISORY: ${entry.id} — K=${k}, draft exists, not yet promoted to unified-plan.yaml`);
    advisory++;
  } else {
    console.error(`[validate-positive-reflexivity] BLOCKING: ${entry.id} — K=${k} improvement has no draft and no plan item`);
    console.error(`  Fix: run "node tools/generators/generate-plan-item-draft.mjs" to create draft`);
    blocking++;
  }
}

console.log(`[validate-positive-reflexivity] entries=${entries.length} covered=${covered} advisory_drafts=${advisory} blocking=${blocking}`);
process.exit(blocking > 0 ? 1 : 0);
