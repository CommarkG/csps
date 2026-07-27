#!/usr/bin/env node
/**
 * @csps-id csps.tools.scripts.weekly-evolution-batch
 * @csps-name weekly-evolution-batch
 * @csps-description Layer 3 of the Weekly Evolution Engine (GOVERNANCE-SELF-IMPROVEMENT-PLAYBOOK
 *   -from-CDS-2026-07-26.md Part 2). Reads findings-actuator's unacted queue (gap-recurrence +
 *   improvement registers), rate-limits to the TOP N highest-priority items, and writes a
 *   structured weekly batch file. Does NOT do the actual root-cause/fix/propagate work itself
 *   (that needs AI reasoning) — it SELECTS and QUEUES calmly, so a large backlog is worked over
 *   many weeks, never dumped in one overwhelming burst.
 * @csps-version 1.0.0 (S089)
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:script domain:self-learning audience:ai-agent governance:VALD
 * @csps-dna core_spine: VALD
 * @csps-enforces B_IMPLEMENTATION_WIRING_CYCLE
 *
 * RATE LIMIT: max BATCH_SIZE items per run (default 3) — "done calmly" per the playbook, not
 * exhaustively. Remaining queue items stay queued, carried to next week, never dropped.
 *
 * Usage: node tools/scripts/weekly-evolution-batch.mjs [--batch-size N]
 * Output: tools/data/weekly-evolution-batch.yaml (committed — the durable, readable record)
 *
 * S089 RVV WIRING: also runs a small, separately rate-limited (LEDGER_BATCH_SIZE, default 2)
 * sweep of tools/data/value-ledger.yaml — surfaces DECLARED-ONLY/DORMANT/DEAD entries and
 * stale entries (last_reviewed >4 sessions behind current) as `ledger_review_this_week` in the
 * SAME output file. This is minimal composition, not a fork: it reuses this script's existing
 * rate-limit/select/defer pattern and its existing output file — it does NOT duplicate
 * validate-value-ledger.mjs's schema/freshness logic (reads the ledger, does not re-validate it)
 * and does NOT build a second weekly-batch mechanism. The actual root-cause/re-verify work on a
 * flagged entry still needs AI reasoning, same as the gap/improvement batch above.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { load } from 'js-yaml';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const bsIdx = args.indexOf('--batch-size');
const BATCH_SIZE = bsIdx >= 0 ? parseInt(args[bsIdx + 1], 10) : 3;
const lbsIdx = args.indexOf('--ledger-batch-size');
const LEDGER_BATCH_SIZE = lbsIdx >= 0 ? parseInt(args[lbsIdx + 1], 10) : 2;
// Mirrors validate-value-ledger.mjs's STALE_THRESHOLD_SESSIONS (kept as a local constant here
// too, same rationale: the VALUE is shared, not the code — see that validator's header comment).
const LEDGER_STALE_THRESHOLD_SESSIONS = 4;

// Refresh findings-actuator's view first — never trust a stale last-run.
execSync(`node "${resolve(ROOT, 'tools/scripts/findings-actuator.mjs')}"`, { cwd: ROOT, stdio: 'ignore' });

const LAST_RUN = resolve(ROOT, 'tools/data/findings-actuator-last-run.json');
const OUT = resolve(ROOT, 'tools/data/weekly-evolution-batch.yaml');

let findings = { unacted_high_k: [], unacted_improvement: [], unacted_floaters: [], unrouted_harvest: [] };
if (existsSync(LAST_RUN)) {
  findings = JSON.parse(readFileSync(LAST_RUN, 'utf-8'));
}

// Priority: k_count descending (highest recurrence = most proven, most worth fixing now).
// Ties broken by age_escalation_status (overdue > on-time).
function priorityScore(item) {
  const overdueBonus = item.age_escalation_status === 'overdue' ? 1000 : 0;
  return overdueBonus + (item.k_count || 0) * 10;
}

const allCandidates = [
  ...findings.unacted_high_k.map(i => ({ ...i, source: 'gap-recurrence-register' })),
  ...findings.unacted_improvement.map(i => ({ ...i, source: 'improvement-register' })),
].sort((a, b) => priorityScore(b) - priorityScore(a));

const selected = allCandidates.slice(0, BATCH_SIZE);
const deferred = allCandidates.slice(BATCH_SIZE);

const now = readFileSync(resolve(ROOT, 'tools/session-state.json'), 'utf-8');
const currentSession = JSON.parse(now).current_session || 'unknown';

const yamlLines = [
  'id: csps.data.weekly-evolution-batch',
  'name: weekly-evolution-batch',
  'description: >',
  '  Layer 3 of the Weekly Evolution Engine. Rate-limited (max ' + BATCH_SIZE + ' items) selection',
  '  of the highest-priority unacted findings from gap-recurrence-register.yaml +',
  '  improvement-register.yaml. Process root-cause -> solution -> apply -> propagation-sweep ->',
  '  propagation-verify for each selected item this session, using ZF iteration (fresh angle per',
  '  cycle until nothing new). Then mark propagation_required + propagation_verified in the',
  '  source register (validate-propagation-verified-gate.mjs BLOCKS a false claim).',
  '  Deferred items are NOT dropped -- they remain queued and re-selected next run by priority.',
  `generated_session: ${currentSession}`,
  `total_queue_size: ${allCandidates.length}`,
  `batch_size: ${BATCH_SIZE}`,
  `selected_count: ${selected.length}`,
  `deferred_count: ${deferred.length}`,
  'selected:',
];

for (const s of selected) {
  yamlLines.push(`  - id: ${s.id}`);
  yamlLines.push(`    source: ${s.source}`);
  yamlLines.push(`    k_count: ${s.k_count}`);
  yamlLines.push(`    status: ${s.status}`);
  yamlLines.push(`    observation: "${(s.observation || '').replace(/"/g, "'")}"`);
  yamlLines.push(`    age_escalation_status: ${s.age_escalation_status || 'unknown'}`);
  yamlLines.push(`    action: "root-cause -> solution -> apply -> propagation-sweep -> propagation-verify (ZF iteration)"`);
}
if (selected.length === 0) yamlLines.push('  []  # queue empty this run');

yamlLines.push('deferred_to_next_run:');
for (const d of deferred) {
  yamlLines.push(`  - id: ${d.id}`);
  yamlLines.push(`    source: ${d.source}`);
  yamlLines.push(`    k_count: ${d.k_count}`);
}
if (deferred.length === 0) yamlLines.push('  []  # nothing deferred');

// ── S089 RVV ledger sweep — minimal wiring, reads value-ledger.yaml, does not re-validate it ──
const LEDGER_PATH = resolve(ROOT, 'tools/data/value-ledger.yaml');
let ledgerEntries = [];
if (existsSync(LEDGER_PATH)) {
  try {
    const doc = load(readFileSync(LEDGER_PATH, 'utf-8'));
    ledgerEntries = (doc && doc.entries) || [];
  } catch (e) {
    // Malformed ledger is validate-value-ledger.mjs's job to BLOCK on — this sweep just skips.
    ledgerEntries = [];
  }
}

let ledgerCurrentSessionNum = null;
{
  const m = /^S0*(\d+)$/.exec(currentSession || '');
  if (m) ledgerCurrentSessionNum = Number(m[1]);
}

function ledgerFlagReason(e) {
  if (['DECLARED-ONLY', 'DORMANT', 'DEAD'].includes(e.tag)) return `tag=${e.tag}`;
  if (ledgerCurrentSessionNum !== null) {
    const m = /^S0*(\d+)$/.exec(e.last_reviewed || '');
    if (m && (ledgerCurrentSessionNum - Number(m[1])) > LEDGER_STALE_THRESHOLD_SESSIONS) {
      return `stale (last_reviewed=${e.last_reviewed}, ${ledgerCurrentSessionNum - Number(m[1])} sessions behind)`;
    }
  }
  return null;
}

const ledgerCandidates = ledgerEntries
  .map(e => ({ e, reason: ledgerFlagReason(e) }))
  .filter(x => x.reason !== null);
const ledgerSelected = ledgerCandidates.slice(0, LEDGER_BATCH_SIZE);
const ledgerDeferred = ledgerCandidates.slice(LEDGER_BATCH_SIZE);

yamlLines.push(`ledger_review_this_week:`);
for (const { e, reason } of ledgerSelected) {
  yamlLines.push(`  - element_id: ${e.element_id}`);
  yamlLines.push(`    reason: "${reason}"`);
  yamlLines.push(`    action: "re-verify from ground truth this session; update tag/last_reviewed/last_activation_proof in value-ledger.yaml"`);
}
if (ledgerSelected.length === 0) yamlLines.push('  []  # nothing flagged this run');

yamlLines.push(`ledger_deferred_to_next_run:`);
for (const { e, reason } of ledgerDeferred) {
  yamlLines.push(`  - element_id: ${e.element_id}`);
  yamlLines.push(`    reason: "${reason}"`);
}
if (ledgerDeferred.length === 0) yamlLines.push('  []  # nothing deferred');

writeFileSync(OUT, yamlLines.join('\n') + '\n', 'utf-8');

console.log(`[weekly-evolution-batch] queue=${allCandidates.length} selected=${selected.length} deferred=${deferred.length} batch_size=${BATCH_SIZE}`);
if (selected.length > 0) {
  console.log(`[weekly-evolution-batch] THIS WEEK'S BATCH (process these ${selected.length}, ZF iteration, propagation-verify before closing):`);
  for (const s of selected) console.log(`  - [${s.source}] k=${s.k_count} ${s.id}: ${(s.observation || '').slice(0, 70)}`);
}
console.log(`[weekly-evolution-batch] ledger_entries=${ledgerEntries.length} ledger_flagged=${ledgerCandidates.length} ledger_selected=${ledgerSelected.length} ledger_deferred=${ledgerDeferred.length} ledger_batch_size=${LEDGER_BATCH_SIZE}`);
if (ledgerSelected.length > 0) {
  console.log(`[weekly-evolution-batch] LEDGER REVIEW THIS WEEK (re-verify from ground truth):`);
  for (const { e, reason } of ledgerSelected) console.log(`  - ${e.element_id}: ${reason}`);
}
process.exit(0);
