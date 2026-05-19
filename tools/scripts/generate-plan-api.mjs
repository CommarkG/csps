/**
 * @csps-id csps.tools.scripts.generate-plan-api
 * @csps-name generate-plan-api
 * @csps-description Reads tools/config/unified-plan.yaml → outputs tools/data/plan-api.json
 *   AND csps-playground/api/plan.json (served at csps-playground.vercel.app/api/plan.json).
 *   This is the bridge between the ONE SOURCE (unified-plan.yaml) and the playground's live data.
 *   Run: pnpm plan:export
 *
 * @core-seed: PLAN_API_LIVE_DATA | plan: S043-A (generate-plan-api.mjs) | grows-to: planning-hub live data binding reading from plan-api.json | target: S043
 * planted_by: S043
 * pmi_gate: OPEN-055
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-enforces P-META-026
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const PLAN_SOURCE = resolve(ROOT, 'tools/config/unified-plan.yaml');
const CSPS_OUTPUT = resolve(ROOT, 'tools/data/plan-api.json');
// Playground path — relative to CSPS repo (sibling directory)
const PLAYGROUND_OUTPUT = resolve(ROOT, '../../csps-playground/api/plan.json');
// Fallback playground path
const PLAYGROUND_ALT = resolve(ROOT, '../../../csps-playground/api/plan.json');

// ── Parse unified-plan.yaml ───────────────────────────────────────────────────
const raw = readFileSync(PLAN_SOURCE, 'utf-8');
const plan = yaml.load(raw);

const now = new Date().toISOString();

// ── Derive PMI score per item ─────────────────────────────────────────────────
const PMI_FIELDS = ['intent_depth', 'cross_ref_density', 'consensus_width', 'reversibility', 'dependency_clarity'];

function scorePMI(pmi) {
  if (!pmi) return { pmi_score: 0, pmi_ready: false, pmi_detail: null };
  const highs = PMI_FIELDS.filter(f => pmi[f] === 'high').length;
  const detail = {};
  PMI_FIELDS.forEach(f => { detail[f] = pmi[f] || 'unset'; });
  return { pmi_score: highs, pmi_ready: highs >= 4, pmi_detail: detail };
}

// ── Process items ─────────────────────────────────────────────────────────────
const items = (plan.items || []).map(item => {
  const pmiResult = scorePMI(item.pmi);
  return {
    id: item.id,
    title: item.title,
    status: item.status,
    category: item.category,
    owner: item.owner,
    pe_score: item.pe_score || 0,
    tags: item.tags || [],
    depends_on: item.depends_on || [],
    caq_questions: item.caq_questions || [],
    notes: item.notes || '',
    ...pmiResult,
    has_core_seed: !!item.core_seed,
    core_seed: item.core_seed || null,
    activation_exit: item.activation_exit || null,
    activation_period: item.activation_period || null,
  };
});

// ── Extract core seeds (flat list for easy rendering) ─────────────────────────
const core_seeds = items
  .filter(item => item.has_core_seed)
  .map(item => ({
    item_id: item.id,
    item_title: item.title,
    item_status: item.status,
    ...item.core_seed,
  }));

// ── Compute status counts ─────────────────────────────────────────────────────
const STATUS_KEYS = ['intake', 'planning', 'ratified', 'implementing', 'activation', 'done'];
const status_counts = {};
STATUS_KEYS.forEach(s => { status_counts[s] = 0; });
items.forEach(item => {
  if (status_counts[item.status] !== undefined) status_counts[item.status]++;
  else status_counts[item.status] = 1;
});

// ── Assemble output ───────────────────────────────────────────────────────────
const output = {
  meta: {
    version: plan.metadata?.version || '1.0',
    source: 'tools/config/unified-plan.yaml',
    generated_at: now,
    created_session: plan.metadata?.created_session || 'unknown',
    last_updated: plan.metadata?.last_updated || 'unknown',
    total_items: items.length,
    status_counts,
    pmi_ready_count: items.filter(i => i.pmi_ready).length,
    seeds_planted: core_seeds.length,
  },
  items,
  core_seeds,
};

const json = JSON.stringify(output, null, 2);

// ── Write to CSPS tools/data/ ─────────────────────────────────────────────────
const cspsDir = dirname(CSPS_OUTPUT);
if (!existsSync(cspsDir)) mkdirSync(cspsDir, { recursive: true });
writeFileSync(CSPS_OUTPUT, json, 'utf-8');
console.log(`[plan:export] Written → ${CSPS_OUTPUT}`);
console.log(`[plan:export] Items: ${items.length} | Status counts: ${JSON.stringify(status_counts)}`);
console.log(`[plan:export] PMI-ready: ${output.meta.pmi_ready_count}/${items.length} | Seeds: ${core_seeds.length}`);

// ── Write to playground api/plan.json ────────────────────────────────────────
// Check playground ROOT (not api/ subdir — it may not exist yet)
const PLAYGROUND_ROOT = resolve(ROOT, '../../csps-playground');
const PLAYGROUND_ROOT_ALT = resolve(ROOT, '../../../csps-playground');
let playgroundPath = null;
if (existsSync(PLAYGROUND_ROOT)) {
  playgroundPath = resolve(PLAYGROUND_ROOT, 'api/plan.json');
} else if (existsSync(PLAYGROUND_ROOT_ALT)) {
  playgroundPath = resolve(PLAYGROUND_ROOT_ALT, 'api/plan.json');
}

if (playgroundPath) {
  const playgroundDir = dirname(playgroundPath);
  if (!existsSync(playgroundDir)) mkdirSync(playgroundDir, { recursive: true });
  writeFileSync(playgroundPath, json, 'utf-8');
  console.log(`[plan:export] Playground → ${playgroundPath}`);
} else {
  // Write a copy to CSPS root for manual copy if needed
  const fallback = resolve(ROOT, 'tools/data/plan-api-for-playground.json');
  writeFileSync(fallback, json, 'utf-8');
  console.log(`[plan:export] Playground not found at expected path. Copy ${fallback} to csps-playground/api/plan.json`);
}

console.log(`[plan:export] Done. generated_at=${now}`);
