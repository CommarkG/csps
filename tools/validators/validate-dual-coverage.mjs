#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-dual-coverage
 * @csps-name validate-dual-coverage
 * @csps-description SEED-C: every drift-prone obligation must have BOTH a handoff step
 *   (SOFT: context-dependent) AND a context-independent recurring audit (HARD).
 *
 *   Context-independence test (ALL THREE required):
 *     SOURCE: reads only persistent artifacts (files/registers/git/db)
 *     CADENCE: fires on a schedule (cron/session-open/verify-gate), not on memory
 *     SINK: writes findings to a persistent register surfaced at session-close
 *
 *   Drift-prone obligations checked:
 *     moats         -> validate-moat-coverage.mjs (standard tier = cadence via pnpm verify)
 *     file-length   -> validate-file-complexity.mjs (standard)
 *     load_mode     -> validate-token-efficiency.mjs (extended — needs cadence upgrade)
 *     parks/obligs  -> validate-register-reference-integrity.mjs (extended, built S085)
 *     principles    -> principles_validate (standard)
 *     journey trunk -> validate-trunk-matches-seed.mjs (standard, built S085)
 *     push-status   -> validate-push-status.mjs (critical, always-rerun)
 *     register-refs -> validate-register-reference-integrity.mjs (extended, built S085)
 *     handoff-moat  -> validate-handoff-completeness.mjs (SEED-B extension, standard)
 *
 *   ADVISORY: obligation has handoff step but no recurring audit twin
 *   BLOCKING at K=2 (when gap-recurrence-register shows K>=2 for same obligation)
 *   run_tier: EXTENDED
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces SEED-C P-META-033
 * @csps-prevention-class HANDOFF-ONLY-OBLIGATION
 *
 * load_mode: on-demand
 * justification: EXTENDED structural check, not per-turn
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const VERIFY_PATH = resolve(ROOT, 'tools/verify.mjs');
const GAP_REGISTER_PATH = resolve(ROOT, 'tools/data/gap-recurrence-register.yaml');

// Context-independence test:
// SOURCE: validator reads persistent files (always true for our validators)
// CADENCE: standard tier = runs on every verify (proxy for cadence; cron is the ideal)
//          extended = manual only (fails CADENCE until cron is wired)
//          always_rerun = external state, best coverage
// SINK: validator writes to tools/data/*-last-run.json (audit trail)

// Drift-prone obligations and their required audit twins
const OBLIGATIONS = [
  {
    id: 'moats',
    name: 'Moat registry coverage',
    description: 'M-NN moat elements each have active recurring audit coverage',
    required_validator: 'moat_coverage',
    required_tier: 'EXTENDED',  // cornerstone but EXTENDED in current verify.mjs
    context_independent: false,  // EXTENDED = manual, not scheduled cadence
    cadence_gap: 'moat_coverage is EXTENDED (manual). Needs cron or session-open cadence to pass SOURCE+CADENCE test.',
    sink: 'tools/data/validate-moat-coverage-last-run.json',
    handoff_step: 'SEED-B MOAT REVIEW block in boundary-prompt.template.md',
  },
  {
    id: 'file_length',
    name: 'File complexity (code + docs)',
    description: '>300 LOC docs and >500 LOC code files surface as split candidates',
    required_validator: 'file_complexity_validate',
    required_tier: 'STANDARD',
    context_independent: true,  // standard = runs on every verify = cadence approximation
    cadence_gap: null,
    sink: 'tools/data/validate-file-complexity-last-run.json',
    handoff_step: 'none (implicit: any new large file should declare @split_plan)',
  },
  {
    id: 'load_mode',
    name: 'Token-efficiency (load_mode declarations)',
    description: 'New always-on hooks/settings declare load_mode; eager without justification blocked',
    required_validator: 'token_efficiency',
    required_tier: 'EXTENDED',
    context_independent: false,  // EXTENDED = not cadenced
    cadence_gap: 'token_efficiency is EXTENDED. Needs STANDARD tier or cron to satisfy CADENCE test.',
    sink: 'tools/data/validate-token-efficiency-last-run.json',
    handoff_step: 'R9 token guardian T1 hook (pre-tool-use-token-guardian.sh) = creation-level prevention',
  },
  {
    id: 'register_refs',
    name: 'Register reference integrity (SEED-A)',
    description: 'Every PARK-/PROTO-/M-/VLT-/imp_/gap_/SEED- ID resolves to canonical register',
    required_validator: 'register_reference_integrity',
    required_tier: 'EXTENDED',
    context_independent: false,  // EXTENDED = not cadenced; NEW S085
    cadence_gap: 'register_reference_integrity is EXTENDED (built S085). Needs session-open cadence to satisfy CADENCE.',
    sink: 'tools/data/validate-register-reference-integrity-last-run.json',
    handoff_step: 'None yet — this IS the audit twin for ghost-ref. Phase 2: block at handoff gate.',
  },
  {
    id: 'principles',
    name: 'Principle registry coverage',
    description: 'All principles validate (count consistent, slices synced, no staleness)',
    required_validator: 'principles_validate',
    required_tier: 'STANDARD',
    context_independent: true,
    cadence_gap: null,
    sink: 'packages/principles/validate-output.json',
    handoff_step: 'Session-close §10.0 verify evidence includes principles_validate',
  },
  {
    id: 'journey_trunk',
    name: 'Journey trunk matches SEED-1 (SEED-B drift guard)',
    description: 'core-spine-registry journeys.trunk C1-C5 + P1-P5 verbatim from SEED-1',
    required_validator: 'trunk_matches_seed',
    required_tier: 'STANDARD',
    context_independent: true,
    cadence_gap: null,
    sink: 'tools/data/validate-trunk-matches-seed-last-run.json',
    handoff_step: 'SEED-1 EXPANSION protocol (boundary-crossing required for trunk change)',
  },
  {
    id: 'push_status',
    name: 'Unpushed commits (governance work pushed)',
    description: 'All governed-path changes are pushed to remote (zero-laptop discipline)',
    required_validator: 'push_status',
    required_tier: 'CRITICAL',
    context_independent: true,  // always_rerun = external state check
    cadence_gap: null,
    sink: 'tools/data/validate-push-status-last-run.json',
    handoff_step: 'Session-close mandate: push before handoff',
  },
  {
    id: 'handoff_moat',
    name: 'MOAT REVIEW in handoffs (SEED-B)',
    description: 'Every HANDOFF-*.md includes ## MOAT REVIEW block',
    required_validator: 'handoff_completeness',
    required_tier: 'STANDARD',
    context_independent: true,
    cadence_gap: null,
    sink: 'tools/data/validate-handoff-completeness-last-run.json',
    handoff_step: 'SEED-B ## MOAT REVIEW required section in boundary-prompt.template.md',
  },
];

// ── Load verify.mjs to check validator presence + tier ──────────────────────
let verifyContent = '';
if (existsSync(VERIFY_PATH)) {
  verifyContent = readFileSync(VERIFY_PATH, 'utf8');
}

function getValidatorTier(name) {
  // Find the validator entry by name in verify.mjs
  const nameRegex = new RegExp(`name:\\s*'${name}'`);
  const match = verifyContent.match(nameRegex);
  if (!match) return null;
  // Look backwards for run_tier
  const before = verifyContent.slice(0, match.index);
  const tierMatch = before.slice(-500).match(/run_tier:\s*'([A-Z]+)'/);
  if (tierMatch) return tierMatch[1];
  // Default tier (no explicit run_tier = STANDARD)
  return 'STANDARD';
}

// ── Check K=2 from gap-recurrence-register ───────────────────────────────────
const gap_register = existsSync(GAP_REGISTER_PATH) ? readFileSync(GAP_REGISTER_PATH, 'utf8') : '';

function getKCount(obligation_id) {
  const re = new RegExp(`gap_DUAL_COVERAGE_${obligation_id.toUpperCase()}[\\s\\S]*?k_count:\\s*(\\d+)`, 'i');
  const m = gap_register.match(re);
  return m ? Number(m[1]) : 0;
}

// ── Evaluate each obligation ─────────────────────────────────────────────────
let advisory = 0;
let blocking = 0;
let obligations_checked = 0;
let dual_covered = 0;
const findings = [];

for (const ob of OBLIGATIONS) {
  obligations_checked++;
  const tier = getValidatorTier(ob.required_validator);
  const validator_present = tier !== null;
  const passes_context_independence = ob.context_independent && validator_present;

  if (!validator_present) {
    findings.push({
      severity: 'ADVISORY',
      obligation: ob.id,
      issue: `Missing audit twin: validator '${ob.required_validator}' not found in verify.mjs`,
      action: `Build ${ob.required_validator} and register in verify.mjs STANDARD tier`,
    });
    advisory++;
  } else if (!passes_context_independence) {
    const k = getKCount(ob.id);
    const severity = k >= 2 ? 'BLOCKING' : 'ADVISORY';
    findings.push({
      severity,
      obligation: ob.id,
      issue: `Audit twin EXISTS (${ob.required_validator}, tier=${tier}) but fails context-independence test`,
      cadence_gap: ob.cadence_gap,
      k_count: k,
    });
    if (severity === 'BLOCKING') blocking++;
    else advisory++;
  } else {
    dual_covered++;
  }
}

// ── Output ────────────────────────────────────────────────────────────────────
const status = blocking > 0 ? 'FAIL' : 'PASS';
console.log(`[validate-dual-coverage] ${status}`);
console.log(`  obligations_checked=${obligations_checked} dual_covered=${dual_covered} advisory=${advisory} blocking=${blocking}`);

if (findings.length > 0) {
  console.log('\n[validate-dual-coverage] findings:');
  for (const f of findings) {
    console.log(`  ${f.severity} (${f.obligation}): ${f.issue}`);
    if (f.cadence_gap) console.log(`    cadence_gap: ${f.cadence_gap}`);
    if (f.k_count !== undefined) console.log(`    k_count=${f.k_count} (BLOCKING at k>=2)`);
    if (f.action) console.log(`    action: ${f.action}`);
  }
}

if (blocking === 0 && advisory === 0) {
  console.log('\n[validate-dual-coverage] All drift-prone obligations have context-independent audit twins.');
}

console.log('\n[validate-dual-coverage] Context-independence test (SEED-C):');
console.log('  SOURCE: reads only persistent artifacts (files/registers/git/db)');
console.log('  CADENCE: fires on schedule (cron/session-open/verify-gate); EXTENDED tier = not yet cadenced');
console.log('  SINK: writes findings to persistent register at session-close');
console.log('  Cadence gap: EXTENDED validators need cron wiring (PARK-040 scope, B5/B6)');

process.exit(blocking > 0 ? 1 : 0);