#!/usr/bin/env node
/**
 * @determinism-exempt: new Date()/Date.now() used only in last-run JSON metadata (ran_at field).
 * All blocking decisions are structural/deterministic (file presence, field presence, count checks).
 * No time-dependent logic in any blocking decision path.
 *
 * @csps-dna
 * core_spine: GVRN
 * governing_principle: PROTO-S088-JOURNEY-CORE-SPINE
 * @csps-enforces PROTO-S088-JOURNEY-CORE-SPINE
 * @behavioral-test-status: structurally-proven — PASS path verified (all files present); FAIL path
 *   proven by design (if JOURNEY-CORE-SPINE.md missing → exit 1; if trunk missing C1-C5 → exit 1).
 *
 * validate-journey-conformance.mjs — Journey Core Spine structural conformance
 *
 * Validates that the Journey Core Spine definition is structurally complete:
 *   1. JOURNEY-CORE-SPINE.md exists (sealed L0 definition; conformance anchor)
 *   2. tools/config/core-spine-registry.yaml journeys entry has:
 *      (a) trunk with all 5 invariant IDs: C1, C2, C3, C4, C5
 *      (b) trunk with all 5 phase IDs: P1, P2, P3, P4, P5
 *      (c) branches with all 4 required variants: fast, standard, governed, exploratory
 *   3. docs/plan/pillar-0-governance/journey-closed-enums.yaml has all 9 required enum keys
 *   4. tools/data/seed2-gate-mode-matrix.json (SEED-2 gate matrix) exists
 *
 * BLOCKING on structural violations (missing files, missing required IDs/variants/enums).
 * ADVISORY on non-structural gaps (informational only).
 *
 * Registered: audit-runner.md `journey_conformance` (PROTO-S088-JOURNEY-CORE-SPINE).
 *
 * @csps-id csps.tools.validators.validate-journey-conformance
 * @csps-name validate-journey-conformance
 * @csps-description Structural conformance of Journey Core Spine (PROTO-S088).
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-prevention-class JOURNEY-SPINE-INCOMPLETE
 *
 * load_mode: standard
 * justification: structural check; journey spine changes only on boundary-crossing events
 */

import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const CORE_SPINE_DOC  = resolve(ROOT, 'docs/plan/pillar-0-governance/JOURNEY-CORE-SPINE.md');
const REGISTRY_PATH   = resolve(ROOT, 'tools/config/core-spine-registry.yaml');
const ENUMS_PATH      = resolve(ROOT, 'docs/plan/pillar-0-governance/journey-closed-enums.yaml');
const GATE_MATRIX_PATH = resolve(ROOT, 'tools/data/seed2-gate-mode-matrix.json');
const LAST_RUN_PATH   = resolve(ROOT, 'tools/data/validate-journey-conformance-last-run.json');

let blocking = 0;
let advisory = 0;
const findings = [];
const passes = [];

function addBlocking(msg) {
  findings.push({ level: 'BLOCKING', msg });
  blocking++;
  console.log(`  ✗ [BLOCKING] ${msg}`);
}

function addAdvisory(msg) {
  findings.push({ level: 'ADVISORY', msg });
  advisory++;
  console.log(`  ⚠ [ADVISORY] ${msg}`);
}

function addPass(msg) {
  passes.push(msg);
  console.log(`  ✓ ${msg}`);
}

console.log('[validate-journey-conformance] checking Journey Core Spine structural conformance...\n');

// ── CHECK 1: JOURNEY-CORE-SPINE.md exists (sealed L0 definition) ──────────
console.log('CHECK 1: JOURNEY-CORE-SPINE.md (sealed L0 definition)');
if (!existsSync(CORE_SPINE_DOC)) {
  addBlocking('JOURNEY-CORE-SPINE.md missing — sealed L0 definition required as conformance anchor');
} else {
  const docContent = readFileSync(CORE_SPINE_DOC, 'utf-8');
  if (!docContent.includes('status: sealed')) {
    addAdvisory('JOURNEY-CORE-SPINE.md exists but status is not "sealed"');
  } else {
    addPass('JOURNEY-CORE-SPINE.md exists and status: sealed');
  }
}

// ── CHECK 2: core-spine-registry.yaml journeys entry ──────────────────────
console.log('\nCHECK 2: core-spine-registry.yaml journeys entry');
if (!existsSync(REGISTRY_PATH)) {
  addBlocking('core-spine-registry.yaml missing — cannot validate journeys entry');
} else {
  const raw = readFileSync(REGISTRY_PATH, 'utf-8').replace(/\r\n/g, '\n');

  // Find journeys entry block (starts at "  - id: journeys")
  const journeysMarker = '\n  - id: journeys\n';
  const journeysIdx = raw.indexOf(journeysMarker);
  if (journeysIdx === -1) {
    addBlocking('core-spine-registry.yaml: journeys entry (id: journeys) missing');
  } else {
    // Scope the block: from marker to next spine entry ("  - id: <name>") or end of file
    const afterMarker = raw.slice(journeysIdx + 1);
    const nextEntryMatch = afterMarker.search(/\n  - id: \w/);
    const journeysBlock = nextEntryMatch === -1 ? afterMarker : afterMarker.slice(0, nextEntryMatch);

    addPass('journeys entry found in core-spine-registry.yaml');

    // 2a: trunk exists
    if (!journeysBlock.includes('trunk:')) {
      addBlocking('journeys entry: trunk section missing');
    } else {
      addPass('journeys entry: trunk section present');

      // 2b: trunk has C1-C5 invariant IDs
      const REQUIRED_INVARIANTS = ['C1', 'C2', 'C3', 'C4', 'C5'];
      const missingInvariants = REQUIRED_INVARIANTS.filter(
        id => !journeysBlock.includes(`id: ${id}\n`) && !journeysBlock.includes(`id: ${id}\r\n`)
      );
      if (missingInvariants.length > 0) {
        addBlocking(`journeys trunk: missing invariant IDs — ${missingInvariants.join(', ')}`);
      } else {
        addPass(`journeys trunk: all invariants present — C1, C2, C3, C4, C5`);
      }

      // 2c: trunk has P1-P5 phase IDs
      const REQUIRED_PHASES = ['P1', 'P2', 'P3', 'P4', 'P5'];
      const missingPhases = REQUIRED_PHASES.filter(
        id => !journeysBlock.includes(`id: ${id}\n`) && !journeysBlock.includes(`id: ${id}\r\n`)
      );
      if (missingPhases.length > 0) {
        addBlocking(`journeys trunk: missing phase IDs — ${missingPhases.join(', ')}`);
      } else {
        addPass(`journeys trunk: all phases present — P1, P2, P3, P4, P5`);
      }
    }

    // 2d: branches has 4 required variants
    const REQUIRED_VARIANTS = ['fast', 'standard', 'governed', 'exploratory'];
    const variantMatches = journeysBlock.match(/\bvariant:\s+(\w+)/g) || [];
    const foundVariants = variantMatches.map(m => m.replace(/\bvariant:\s+/, '').trim());
    const missingVariants = REQUIRED_VARIANTS.filter(v => !foundVariants.includes(v));
    if (missingVariants.length > 0) {
      addBlocking(`journeys branches: missing variants — ${missingVariants.join(', ')} (found: ${foundVariants.join(', ')})`);
    } else {
      addPass(`journeys branches: all 4 variants present — ${REQUIRED_VARIANTS.join(', ')}`);
    }
  }
}

// ── CHECK 3: journey-closed-enums.yaml has all 9 required enum keys ────────
console.log('\nCHECK 3: journey-closed-enums.yaml enum completeness');
if (!existsSync(ENUMS_PATH)) {
  addBlocking('journey-closed-enums.yaml missing — SEED-6 enum reference required');
} else {
  const enumsRaw = readFileSync(ENUMS_PATH, 'utf-8').replace(/\r\n/g, '\n');
  const REQUIRED_ENUMS = [
    'VariantType', 'RiskClass', 'BranchAxis', 'PersonaTier',
    'GateMode', 'PolicyResult', 'RippleSeverity', 'ChangeClass', 'DefinitionScope'
  ];
  const missingEnums = REQUIRED_ENUMS.filter(e => !enumsRaw.includes(`${e}:`));
  if (missingEnums.length > 0) {
    addBlocking(`journey-closed-enums.yaml: missing enum keys — ${missingEnums.join(', ')}`);
  } else {
    addPass(`journey-closed-enums.yaml: all ${REQUIRED_ENUMS.length} enum keys present`);
  }
}

// ── CHECK 4: seed2-gate-mode-matrix.json exists ───────────────────────────
console.log('\nCHECK 4: seed2-gate-mode-matrix.json (SEED-2 gate matrix)');
if (!existsSync(GATE_MATRIX_PATH)) {
  addBlocking('seed2-gate-mode-matrix.json missing — SEED-2 gate matrix required for PEG enforcement');
} else {
  addPass('seed2-gate-mode-matrix.json exists');
}

// ── RESULT ────────────────────────────────────────────────────────────────
const result = {
  blocking,
  advisory,
  passes: passes.length,
  findings,
  checks_run: 4,
  files_checked: [
    'docs/plan/pillar-0-governance/JOURNEY-CORE-SPINE.md',
    'tools/config/core-spine-registry.yaml (journeys entry)',
    'docs/plan/pillar-0-governance/journey-closed-enums.yaml',
    'tools/data/seed2-gate-mode-matrix.json',
  ],
  ran_at: new Date().toISOString(),
};

writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2));

console.log('');
if (blocking > 0) {
  console.log(`[validate-journey-conformance] FAIL blocking=${blocking} advisory=${advisory} passes=${passes.length}`);
  process.exit(1);
} else {
  console.log(`[validate-journey-conformance] PASS blocking=0 advisory=${advisory} passes=${passes.length} checks=${result.checks_run}`);
  process.exit(0);
}
