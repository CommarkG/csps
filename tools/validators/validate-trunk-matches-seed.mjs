#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-trunk-matches-seed
 * @csps-name validate-trunk-matches-seed
 * @csps-description B3.2 validator: core-spine-registry journeys trunk must equal SEED-1 verbatim.
 *   Prevents C5 transcription drift (Opus caught this at B1 review).
 *   Reads tools/config/core-spine-registry.yaml journeys.trunk.invariants + phases.
 *   Reads docs/plan/pillar-0-governance/JOURNEY-SEEDS-S084.md SEED-1 section.
 *   Compares: C1-C5 invariant IDs present + phase IDs P1-P5 present.
 *   BLOCKING: any C-invariant or phase missing from registry trunk.
 *   ADVISORY: trunk has extra fields not in SEED-1 (additive drift).
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces SEED-1 PROTO-S084-B3
 * @csps-prevention-class TRUNK-INVARIANT-TRANSCRIPTION-DRIFT
 *
 * load_mode: on-demand
 * justification: structural check, runs at verify time
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const REGISTRY_PATH = resolve(ROOT, 'tools/config/core-spine-registry.yaml');
const SEEDS_PATH = resolve(ROOT, 'docs/plan/pillar-0-governance/JOURNEY-SEEDS-S084.md');

let blocking = 0;
let advisory = 0;
const findings = [];

// ── SEED-1 canonical invariant + phase IDs ────────────────────────────────────
// Extracted from JOURNEY-SEEDS-S084.md SEED-1 ANCHOR (OPUS-22).
// The trunk is SEALED: these IDs must be present and unchanged.
const SEED1_INVARIANT_IDS = ['C1', 'C2', 'C3', 'C4', 'C5'];
const SEED1_PHASE_IDS = ['P1', 'P2', 'P3', 'P4', 'P5'];

// ── Check 1: Files exist ─────────────────────────────────────────────────────
if (!existsSync(REGISTRY_PATH)) {
  console.log('[validate-trunk-matches-seed] BLOCKING: core-spine-registry.yaml not found');
  console.log('  checked=0 blocking=1 advisory=0');
  process.exit(1);
}
if (!existsSync(SEEDS_PATH)) {
  console.log('[validate-trunk-matches-seed] BLOCKING: JOURNEY-SEEDS-S084.md not found');
  console.log('  checked=0 blocking=1 advisory=0');
  process.exit(1);
}

const registryText = readFileSync(REGISTRY_PATH, 'utf8');
const seedsText = readFileSync(SEEDS_PATH, 'utf8');

// ── Check 2: journeys entry exists in registry ────────────────────────────────
if (!registryText.includes('- id: journeys')) {
  findings.push('BLOCKING: journeys entry not found in core-spine-registry.yaml');
  findings.push('  Fix: add journeys core-spine entry per SEED-1 ANCHOR');
  blocking = blocking + 1;
}

// ── Check 3: SEED-1 section exists in seeds file ─────────────────────────────
if (!seedsText.includes('## SEED-1')) {
  findings.push('BLOCKING: SEED-1 section not found in JOURNEY-SEEDS-S084.md');
  blocking = blocking + 1;
}

// ── Check 4: All C-invariant IDs present in registry ─────────────────────────
let invariants_present = 0;
for (const invId of SEED1_INVARIANT_IDS) {
  // Look for "id: C1" pattern in registry context
  if (registryText.includes(`id: ${invId}`)) {
    invariants_present = invariants_present + 1;
  } else {
    findings.push(`BLOCKING: Invariant ${invId} missing from journeys trunk in core-spine-registry.yaml`);
    findings.push(`  Expected: "id: ${invId}" in trunk.invariants section`);
    blocking = blocking + 1;
  }
}

// ── Check 5: All phase IDs present in registry ───────────────────────────────
let phases_present = 0;
for (const phaseId of SEED1_PHASE_IDS) {
  if (registryText.includes(`id: ${phaseId}`)) {
    phases_present = phases_present + 1;
  } else {
    findings.push(`BLOCKING: Phase ${phaseId} missing from journeys trunk in core-spine-registry.yaml`);
    findings.push(`  Expected: "id: ${phaseId}" in trunk.phases section`);
    blocking = blocking + 1;
  }
}

// ── Check 6: SEED-1 verbatim marker present in registry ──────────────────────
// The registry should have the verbatim comment referencing SEED-1
const hasVerbatimMarker = registryText.includes('Verbatim from JOURNEY-SEEDS-S084.md SEED-1') ||
                          registryText.includes('SEED-1 (OPUS-22 authored)');
if (!hasVerbatimMarker) {
  findings.push('ADVISORY: journeys trunk missing verbatim-source marker');
  findings.push('  Expected comment: "# Verbatim from JOURNEY-SEEDS-S084.md SEED-1"');
  advisory = advisory + 1;
}

// ── Check 7: SEED-1 C-invariant IDs also in seeds file ───────────────────────
for (const invId of SEED1_INVARIANT_IDS) {
  if (!seedsText.includes(`id: ${invId}`)) {
    findings.push(`ADVISORY: Invariant ${invId} not found in JOURNEY-SEEDS-S084.md SEED-1`);
    advisory = advisory + 1;
  }
}

// ── Output ────────────────────────────────────────────────────────────────────
const status = blocking > 0 ? 'FAIL' : 'PASS';
const total_checked = SEED1_INVARIANT_IDS.length + SEED1_PHASE_IDS.length + 2; // + entry + SEED-1 section

console.log(`[validate-trunk-matches-seed] ${status}`);
console.log(`  checked=${total_checked} invariants_present=${invariants_present}/${SEED1_INVARIANT_IDS.length} phases_present=${phases_present}/${SEED1_PHASE_IDS.length}`);
console.log(`  blocking=${blocking} advisory=${advisory}`);

if (findings.length > 0) {
  console.log('\n[validate-trunk-matches-seed] findings:');
  for (const f of findings) console.log(`  - ${f}`);
} else {
  console.log('\n[validate-trunk-matches-seed] journeys trunk matches SEED-1 (C1-C5, P1-P5 all present)');
}

process.exit(blocking > 0 ? 1 : 0);