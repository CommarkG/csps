#!/usr/bin/env node
/**
 * @csps-id csps.tools.generators.generate-plan-item-draft
 * @csps-name generate-plan-item-draft
 * @csps-description POSITIVE-REFLEXIVITY generator. Reads improvement-register.yaml,
 * finds entries where k_count >= 2 AND status NOT IN [propagated, closed],
 * and writes draft plan item YAML snippets to tools/data/pending-plan-items.yaml.
 * Drafts are reviewed and promoted by Opus → tools/config/unified-plan.yaml.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:generator domain:governance audience:ai-agent
 * @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE
 * context_question: "Has every K>=2 improvement been reviewed and either drafted or promoted?"
 * Wired: run manually (pnpm generate:plan-drafts) or by validate-positive-reflexivity.mjs
 * Plan item: POSITIVE-REFLEXIVITY | S055
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
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
    } else if (current && /^\s{4}finding:\s+/.test(line)) {
      current.finding = line.replace(/.*finding:\s*"?/, '').replace(/"?\s*$/, '').trim();
    } else if (current && /^\s{4}k_count:\s+/.test(line)) {
      current.k_count = Number(line.replace(/.*k_count:\s*/, '').trim());
    } else if (current && /^\s{4}status:\s+/.test(line)) {
      current.status = line.replace(/.*status:\s*/, '').trim();
    } else if (current && /^\s{4}first_found:\s+/.test(line)) {
      current.first_found = line.replace(/.*first_found:\s*/, '').trim();
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
  return planText.includes(impId) || planText.includes(impId.replace(/^imp_/, '').toLowerCase());
}

function derivePlanId(impId) {
  return impId.replace(/^imp_/, '').replace(/_/g, '-').toUpperCase();
}

function buildDraftYaml(entry) {
  const planId = derivePlanId(entry.id);
  const today = new Date().toISOString().slice(0, 10);
  return `
  - source_id: ${entry.id}
    generated: ${today}
    first_found: ${entry.first_found ?? 'unknown'}
    k_count: ${entry.k_count}
    suggested_id: ${planId}
    suggested_title: "${entry.finding?.slice(0, 80) ?? '(see improvement-register)'}"
    suggested_pe_score: 75
    status: draft
    review_note: "K>=${entry.k_count} positive finding — needs Opus review and promotion to unified-plan.yaml"`;
}

if (!existsSync(IMPROVEMENT_FILE)) {
  console.log('[generate-plan-item-draft] improvement-register.yaml not found — nothing to draft');
  process.exit(0);
}

const improvementRaw = readFileSync(IMPROVEMENT_FILE, 'utf-8');
const planRaw = existsSync(PLAN_FILE) ? readFileSync(PLAN_FILE, 'utf-8') : '';
const pendingRaw = existsSync(PENDING_FILE) ? readFileSync(PENDING_FILE, 'utf-8') : '';

const entries = parseImprovementEntries(improvementRaw);
const existingDraftIds = parsePendingDraftIds(pendingRaw);

const needsDraft = entries.filter(e =>
  (e.k_count ?? 0) >= 2 &&
  !SKIP_STATUSES.has(e.status) &&
  !existingDraftIds.has(e.id) &&
  !planHasEntry(planRaw, e.id)
);

if (needsDraft.length === 0) {
  console.log('[generate-plan-item-draft] No new drafts needed — all K>=2 improvements are propagated, closed, or already drafted.');
  process.exit(0);
}

const newDraftsYaml = needsDraft.map(buildDraftYaml).join('\n');

let updatedPending;
if (pendingRaw.includes('drafts: []')) {
  updatedPending = pendingRaw.replace('drafts: []', `drafts:${newDraftsYaml}`);
} else if (pendingRaw.includes('\ndrafts:')) {
  updatedPending = pendingRaw.trimEnd() + '\n' + newDraftsYaml + '\n';
} else {
  updatedPending = pendingRaw.trimEnd() + '\ndrafts:' + newDraftsYaml + '\n';
}

writeFileSync(PENDING_FILE, updatedPending, 'utf-8');

for (const e of needsDraft) {
  console.log(`[generate-plan-item-draft] DRAFTED: ${e.id} (K=${e.k_count}) → ${derivePlanId(e.id)}`);
}
console.log(`[generate-plan-item-draft] drafted=${needsDraft.length} → tools/data/pending-plan-items.yaml`);
