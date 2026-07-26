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
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const bsIdx = args.indexOf('--batch-size');
const BATCH_SIZE = bsIdx >= 0 ? parseInt(args[bsIdx + 1], 10) : 3;

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

writeFileSync(OUT, yamlLines.join('\n') + '\n', 'utf-8');

console.log(`[weekly-evolution-batch] queue=${allCandidates.length} selected=${selected.length} deferred=${deferred.length} batch_size=${BATCH_SIZE}`);
if (selected.length > 0) {
  console.log(`[weekly-evolution-batch] THIS WEEK'S BATCH (process these ${selected.length}, ZF iteration, propagation-verify before closing):`);
  for (const s of selected) console.log(`  - [${s.source}] k=${s.k_count} ${s.id}: ${(s.observation || '').slice(0, 70)}`);
}
process.exit(0);
