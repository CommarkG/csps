#!/usr/bin/env node
/**
 * findings-actuator.mjs — Self-Learning Pipeline: Findings → Action Items
 *
 * PROTO-S088-SELF-LEARNING | S088
 * Problem: gap-recurrence-register.yaml + improvement-register.yaml accumulate findings
 *   but NOTHING reads them and converts them to action. Graveyard of insights.
 * Fix: this script reads all finding sources, identifies unacted items, surfaces them.
 *
 * RF-EVERYWHERE (S088 Opus directive): Single act-forcing loop for ALL sources:
 *   1. gap-recurrence-register.yaml (recurring gaps k≥2)
 *   2. improvement-register.yaml (unpropagated improvements k≥2)
 *   3. floating-artifacts-register.yaml (overdue floaters — escalation BLOCK is T2 gate)
 *   4. council-harvest.yaml (disposition:findings-actuator entries not yet closed)
 *
 * TRIGGERED BY:
 *   1. session-open.sh (SEED-C cadence, background) — surfaces at every session start
 *   2. validate-prevention-coverage.mjs (verify pipeline) — blocks when drift is severe
 *   3. node tools/scripts/findings-actuator.mjs (manual run)
 *
 * OUTPUT:
 *   - tools/data/findings-actuator-last-run.json (machine-readable, for validator)
 *   - stderr: human-readable summary for session-open injection
 *
 * @csps-id csps.scripts.findings-actuator
 * @csps-version 1.1.0
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:script domain:self-learning audience:ai-agent governance:VALD
 * @csps-dna core_spine: VALD
 * @csps-enforces B_PAGE_COMPLETE gap-recurrence-register improvement-register floating-artifacts-register council-harvest
 * @determinism-exempt: new Date() used ONLY for ran_at metadata in output JSON. No clock in decisions.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const GAP_REGISTER     = join(ROOT, 'tools/data/gap-recurrence-register.yaml');
const IMP_REGISTER     = join(ROOT, 'tools/data/improvement-register.yaml');
const STANDARDS        = join(ROOT, 'tools/data/ratified-standards.yaml');
const FLOATER_REGISTER = join(ROOT, 'tools/data/floating-artifacts-register.yaml');
const HARVEST_REGISTER = join(ROOT, 'tools/data/council-harvest.yaml');
const LAST_RUN         = join(ROOT, 'tools/data/findings-actuator-last-run.json');

// ─── Simple YAML entry parser ──────────────────────────────────────────────────
// Parses the key fields we need from CSPS register YAML (no external YAML lib required)
function parseRegisterEntries(raw) {
  const entries = [];
  // Split on "  - id:" blocks
  const blocks = raw.split(/\n  - id:/);
  for (const block of blocks.slice(1)) {
    // After split on "\n  - id:", each block starts with " gap_FOO\n..." or ": gap_FOO\n..."
    const id        = block.split('\n')[0].replace(/^[\s:]+/, '').replace(/"/g, '').trim();
    const kCount    = parseInt((block.match(/\n    k_count:\s*(\d+)/) || [])[1] || '0', 10);
    const status    = (block.match(/\n    status:\s*([^\n]+)/) || [])[1]?.trim() || 'unknown';
    const firstSeen = (block.match(/\n    first_(?:seen|found):\s*([^\n]+)/) || [])[1]?.trim() || '';
    const observation = (block.match(/\n    (?:observation|finding):\s*"?([^"\n]{0,120})/) || [])[1]?.trim() || '';
    // A1 S088: richer output for per-finding BLOCK checks in validate-prevention-coverage.mjs
    const mustAddressBySession = (block.match(/\n    must_address_by_session:\s*"?([^"\n"]+)"?/) || [])[1]?.trim() || '';
    const ageEscalation = (block.match(/\n    age_escalation_status:\s*([^\n]+)/) || [])[1]?.trim() || '';
    if (id) entries.push({ id, kCount, status, firstSeen, observation, mustAddressBySession, ageEscalation });
  }
  return entries;
}

// ─── Get validator IDs from ratified-standards.yaml ────────────────────────────
function getRatifiedAuditEntries(raw) {
  const entries = new Set();
  const matches = raw.matchAll(/\n    audit_entry:\s*([^\n]+)/g);
  for (const m of matches) entries.add(m[1].trim());
  // Also grab IDs
  const ids = raw.matchAll(/^  - id:\s*([^\n]+)/gm);
  for (const m of ids) entries.add(m[1].trim());
  return entries;
}

// ─── Parse overdue floaters from floating-artifacts-register.yaml ─────────────
function parseOverdueFloaters(raw) {
  const entries = [];
  const blocks = raw.split(/\n  - id: /);
  for (const block of blocks.slice(1)) {
    const lines = block.split('\n');
    const id = lines[0].trim();
    const get = (key) => {
      const l = lines.find(x => x.trim().startsWith(key + ':'));
      return l ? l.split(':').slice(1).join(':').trim().replace(/^"(.*)"$/, '$1') : null;
    };
    const escalation = get('escalation_state');
    const terminal = get('terminal_state');
    if (escalation === 'overdue' && (!terminal || terminal === 'null')) {
      entries.push({
        id, artifact_path: get('artifact_path'), closure_by: get('closure_by'),
      });
    }
  }
  return entries;
}

// ─── Parse unrouted council harvest entries ────────────────────────────────────
// Surfaces harvest entries with disposition:findings-actuator that are NOT yet closed.
// "Closed" = status:closed → routing obligation fulfilled.
function parseUnroutedHarvest(raw) {
  const entries = [];
  const blocks = raw.split(/\n  - id: /);
  for (const block of blocks.slice(1)) {
    const lines = block.split('\n');
    const id = lines[0].trim();
    const get = (key) => {
      const l = lines.find(x => x.trim().startsWith(key + ':'));
      return l ? l.split(':').slice(1).join(':').trim().replace(/^"(.*)"$/, '$1') : null;
    };
    const disposition = get('disposition');
    const status = get('status');
    const question = (block.match(/\n    question:\s*"?([^"\n]{0,100})/) || [])[1]?.trim() || '';
    if (disposition === 'findings-actuator' && status !== 'closed') {
      entries.push({ id, status, question });
    }
  }
  return entries;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const result = {
  ran_at: new Date().toISOString(),
  unacted_high_k: [],    // k>=2, not resolved, no matching validator
  unacted_improvement: [],  // status open/cec_run not complete, k>=2
  unacted_floaters: [],    // overdue floaters with terminal_state:null (RF-everywhere)
  unrouted_harvest: [],    // council-harvest disposition:findings-actuator not yet closed
  acted_this_session: [], // items with fix_commit or propagated_to
  total_gap_entries: 0,
  total_imp_entries: 0,
  summary: '',
};

// Load ratified standards (the "acted" surface)
let ratifiedSet = new Set();
if (existsSync(STANDARDS)) {
  const raw = readFileSync(STANDARDS, 'utf8');
  ratifiedSet = getRatifiedAuditEntries(raw);
}

// Process gap-recurrence-register
if (existsSync(GAP_REGISTER)) {
  const raw = readFileSync(GAP_REGISTER, 'utf8');
  const entries = parseRegisterEntries(raw);
  result.total_gap_entries = entries.length;

  for (const e of entries) {
    if (e.kCount < 2) continue;  // only care about recurring gaps
    const isResolved = ['resolved', 'fix_committed', 'behavioral_test_passing', 'structural_fix_committed'].includes(e.status);
    const hasValidator = [...ratifiedSet].some(s => s.toLowerCase().includes(e.id.toLowerCase().replace('gap_', '').slice(0, 15)));
    if (!isResolved) {
      result.unacted_high_k.push({
        id: e.id,
        k_count: e.kCount,
        status: e.status,
        first_seen: e.firstSeen,
        observation: e.observation,
        has_matching_standard: hasValidator,
        must_address_by_session: e.mustAddressBySession,
        age_escalation_status: e.ageEscalation,
      });
    }
  }
}

// Process improvement-register
if (existsSync(IMP_REGISTER)) {
  const raw = readFileSync(IMP_REGISTER, 'utf8');
  const entries = parseRegisterEntries(raw);
  result.total_imp_entries = entries.length;

  for (const e of entries) {
    if (e.kCount < 2) continue;  // only propagate multi-session findings
    // Terminal statuses for improvements — aligned with validate-prevention-coverage.mjs TERMINAL_STATUSES
    const isComplete = ['closed', 'propagated', 'fix_committed', 'behavioral_test_passing',
                        'structural_fix_committed', 'resolved', 'sealed'].includes(e.status);
    if (!isComplete) {
      result.unacted_improvement.push({
        id: e.id,
        k_count: e.kCount,
        status: e.status,
        first_seen: e.firstSeen,
        observation: e.observation,
        must_address_by_session: e.mustAddressBySession,
        age_escalation_status: e.ageEscalation,
      });
    }
  }
}

// ─── Source 3: floating-artifacts-register.yaml (RF-everywhere) ───────────────
if (existsSync(FLOATER_REGISTER)) {
  const raw = readFileSync(FLOATER_REGISTER, 'utf8');
  result.unacted_floaters = parseOverdueFloaters(raw);
}

// ─── Source 4: council-harvest.yaml (unrouted findings-actuator entries) ──────
if (existsSync(HARVEST_REGISTER)) {
  const raw = readFileSync(HARVEST_REGISTER, 'utf8');
  result.unrouted_harvest = parseUnroutedHarvest(raw);
}

// ─── Summary ──────────────────────────────────────────────────────────────────
const highKGaps     = result.unacted_high_k.length;
const highKImprove  = result.unacted_improvement.length;
const overdueFloat  = result.unacted_floaters.length;
const unroutedHarv  = result.unrouted_harvest.length;
const totalUnacted  = highKGaps + highKImprove + overdueFloat + unroutedHarv;

result.summary = [
  `${totalUnacted} unacted findings`,
  `${highKGaps} recurring gaps k≥2`,
  `${highKImprove} unpropagated improvements k≥2`,
  overdueFloat > 0 ? `${overdueFloat} overdue floaters` : null,
  unroutedHarv > 0 ? `${unroutedHarv} unrouted harvest entries` : null,
].filter(Boolean).join(', ');

// Write machine-readable output
try {
  mkdirSync(join(ROOT, 'tools/data'), { recursive: true });
  writeFileSync(LAST_RUN, JSON.stringify(result, null, 2));
} catch { /* non-fatal */ }

// ─── Stderr injection (session-open readable) ─────────────────────────────────
if (totalUnacted === 0) {
  process.stderr.write(`\n[FINDINGS-ACTUATOR] ✓ All finding sources clear (gaps=${result.total_gap_entries}, impr=${result.total_imp_entries}, floaters=0, harvest-unrouted=0)\n`);
} else {
  process.stderr.write(`\n[FINDINGS-ACTUATOR] ⚠ ${result.summary}\n`);
  if (highKGaps > 0) {
    process.stderr.write(`[FINDINGS-ACTUATOR] GAP-REGISTER unacted (k≥2, not resolved):\n`);
    for (const g of result.unacted_high_k.slice(0, 5)) {
      process.stderr.write(`[FINDINGS-ACTUATOR]   k=${g.k_count} ${g.id} [${g.status}] — ${g.observation.slice(0, 80)}\n`);
    }
    if (highKGaps > 5) process.stderr.write(`[FINDINGS-ACTUATOR]   ...and ${highKGaps - 5} more. See tools/data/findings-actuator-last-run.json\n`);
  }
  if (highKImprove > 0) {
    process.stderr.write(`[FINDINGS-ACTUATOR] IMPROVEMENT-REGISTER unacted (k≥2, not propagated):\n`);
    for (const i of result.unacted_improvement.slice(0, 3)) {
      process.stderr.write(`[FINDINGS-ACTUATOR]   k=${i.k_count} ${i.id} [${i.status}] — ${i.observation.slice(0, 80)}\n`);
    }
  }
  if (overdueFloat > 0) {
    process.stderr.write(`[FINDINGS-ACTUATOR] FLOATERS OVERDUE (terminal decision required):\n`);
    for (const f of result.unacted_floaters) {
      process.stderr.write(`[FINDINGS-ACTUATOR]   ${f.id} → ${f.artifact_path} (closure_by: ${f.closure_by})\n`);
    }
    process.stderr.write(`[FINDINGS-ACTUATOR]   → validate-floater-escalation.mjs BLOCKS if gap > 3 sessions\n`);
  }
  if (unroutedHarv > 0) {
    process.stderr.write(`[FINDINGS-ACTUATOR] COUNCIL-HARVEST unrouted (disposition:findings-actuator, not closed):\n`);
    for (const h of result.unrouted_harvest.slice(0, 3)) {
      process.stderr.write(`[FINDINGS-ACTUATOR]   ${h.id} [${h.status}] — ${h.question.slice(0, 80)}\n`);
    }
    process.stderr.write(`[FINDINGS-ACTUATOR]   → route to gap-recurrence-register.yaml OR mark status:closed\n`);
  }
  process.stderr.write(`[FINDINGS-ACTUATOR] Act: pick highest-priority item → build validator OR mark resolved with evidence\n`);
  process.stderr.write(`[FINDINGS-ACTUATOR] SSoT: gap-register + improvement-register + floater-register + council-harvest\n`);
}

process.exit(0); // findings-actuator never blocks by itself — validator does
