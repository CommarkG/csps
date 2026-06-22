#!/usr/bin/env node
/**
 * @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at, ts fields in last-run JSON). All blocking decisions are structural/deterministic (field presence, count checks, schema conformance). Not in any blocking decision path.
 *
 * @csps-dna
 * core_spine: VALD
 * governing_principle: P-ARCH-028
 * @csps-enforces SEED-2 gate_mode matrix hard-floor rules
 * run_tier: EXTENDED
 *
 * validate-gate-mode-matrix.mjs — B2 validator
 *
 * Checks GateDef.gateModeMatrix JSON objects against:
 *   1. Valid structure: 4 mechanisms × 4 risk_classes
 *   2. Valid values: GateModeValue (blocking|advisory|silent)
 *   3. SEED-2 hard floors (tighten-only; never relax below floor)
 *
 * SEED-2 hard floors (source: JOURNEY-SEEDS-S084.md SEED-2 ANCHOR):
 *   THRESHOLD: P1 = blocking for ALL risk classes (hard floor; can never relax)
 *   THRESHOLD: P5 = blocking for standard/elevated/critical
 *   ZF: P3+ = blocking for standard; P2+ = blocking for elevated; P1+ = blocking for critical
 *   PE: P3 = blocking for standard/elevated/critical
 *   CIE: NEVER silent (advisory minimum for all risk classes at all phases)
 *
 * Run:  node tools/validators/validate-gate-mode-matrix.mjs
 * Tier: EXTENDED (runs with node tools/verify.mjs --extended)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-gate-mode-matrix-last-run.json');

const VALID_MECHANISMS  = ['THRESHOLD', 'ZF', 'PE', 'CIE'];
const VALID_RISK_CLASSES = ['low', 'standard', 'elevated', 'critical'];
const VALID_MODES       = ['blocking', 'advisory', 'silent'];

// Mode rank: higher = stricter. Floor check: actual must be >= floor rank.
const MODE_RANK = { blocking: 2, advisory: 1, silent: 0 };

// SEED-2 hard floors per mechanism × risk_class × phase.
// null = no floor constraint for that cell.
const HARD_FLOORS = {
  THRESHOLD: {
    low:      { P1: 'blocking', P2: null,       P3: null,       P4: null,       P5: null       },
    standard: { P1: 'blocking', P2: null,       P3: null,       P4: null,       P5: 'blocking' },
    elevated: { P1: 'blocking', P2: null,       P3: null,       P4: null,       P5: 'blocking' },
    critical: { P1: 'blocking', P2: null,       P3: null,       P4: null,       P5: 'blocking' },
  },
  ZF: {
    low:      { P1: null,       P2: null,       P3: null,       P4: null,       P5: null       },
    standard: { P1: null,       P2: null,       P3: 'blocking', P4: 'blocking', P5: 'blocking' },
    elevated: { P1: null,       P2: 'blocking', P3: 'blocking', P4: 'blocking', P5: 'blocking' },
    critical: { P1: 'blocking', P2: 'blocking', P3: 'blocking', P4: 'blocking', P5: 'blocking' },
  },
  PE: {
    low:      { P1: null,       P2: null,       P3: null,       P4: null,       P5: null       },
    standard: { P1: null,       P2: null,       P3: 'blocking', P4: null,       P5: null       },
    elevated: { P1: null,       P2: null,       P3: 'blocking', P4: null,       P5: null       },
    critical: { P1: null,       P2: null,       P3: 'blocking', P4: null,       P5: null       },
  },
  CIE: {
    // CIE NEVER silent — advisory minimum at every cell
    low:      { P1: 'advisory', P2: 'advisory', P3: 'advisory', P4: 'advisory', P5: 'advisory' },
    standard: { P1: 'advisory', P2: 'advisory', P3: 'advisory', P4: 'advisory', P5: 'advisory' },
    elevated: { P1: 'advisory', P2: 'advisory', P3: 'advisory', P4: 'advisory', P5: 'advisory' },
    critical: { P1: 'advisory', P2: 'advisory', P3: 'advisory', P4: 'advisory', P5: 'advisory' },
  },
};

// SEED-2 VERBATIM reference matrices — one per PEG (columns from the full SEED-2 matrix).
// Sonnet COPIES; does not re-derive. Source: JOURNEY-SEEDS-S084.md SEED-2 F4.
const SEED2_REFERENCE = {
  'PEG-1': {
    THRESHOLD: { low: 'blocking', standard: 'blocking', elevated: 'blocking', critical: 'blocking' },
    ZF:        { low: 'silent',   standard: 'silent',   elevated: 'advisory', critical: 'blocking' },
    PE:        { low: 'silent',   standard: 'silent',   elevated: 'silent',   critical: 'silent'   },
    CIE:       { low: 'advisory', standard: 'advisory', elevated: 'advisory', critical: 'advisory' },
  },
  'PEG-2': {
    THRESHOLD: { low: 'advisory', standard: 'advisory', elevated: 'advisory', critical: 'advisory' },
    ZF:        { low: 'advisory', standard: 'advisory', elevated: 'blocking', critical: 'blocking' },
    PE:        { low: 'silent',   standard: 'silent',   elevated: 'silent',   critical: 'advisory' },
    CIE:       { low: 'advisory', standard: 'advisory', elevated: 'advisory', critical: 'advisory' },
  },
  'PEG-3': {
    THRESHOLD: { low: 'advisory', standard: 'advisory', elevated: 'advisory', critical: 'advisory' },
    ZF:        { low: 'advisory', standard: 'blocking', elevated: 'blocking', critical: 'blocking' },
    PE:        { low: 'advisory', standard: 'blocking', elevated: 'blocking', critical: 'blocking' },
    CIE:       { low: 'advisory', standard: 'advisory', elevated: 'advisory', critical: 'advisory' },
  },
  'PEG-4': {
    THRESHOLD: { low: 'advisory', standard: 'advisory', elevated: 'advisory', critical: 'advisory' },
    ZF:        { low: 'advisory', standard: 'blocking', elevated: 'blocking', critical: 'blocking' },
    PE:        { low: 'silent',   standard: 'silent',   elevated: 'silent',   critical: 'advisory' },
    CIE:       { low: 'advisory', standard: 'advisory', elevated: 'advisory', critical: 'advisory' },
  },
  'PEG-5': {
    THRESHOLD: { low: 'advisory', standard: 'blocking', elevated: 'blocking', critical: 'blocking' },
    ZF:        { low: 'advisory', standard: 'blocking', elevated: 'blocking', critical: 'blocking' },
    PE:        { low: 'silent',   standard: 'silent',   elevated: 'advisory', critical: 'advisory' },
    CIE:       { low: 'advisory', standard: 'advisory', elevated: 'advisory', critical: 'advisory' },
  },
};

let checked = 0;
let blocking_count = 0;
let advisory_count = 0;
const findings = [];

function addFinding(level, msg) {
  findings.push({ level, msg });
  if (level === 'BLOCKING') blocking_count++;
  else advisory_count++;
  console.log(`  ${level === 'BLOCKING' ? '✗' : '⚠'} [${level}] ${msg}`);
}

/**
 * Validate one gateModeMatrix JSON object for a given pegId.
 * Structure: { MECHANISM: { risk_class: 'blocking'|'advisory'|'silent' } }
 */
function validateMatrix(pegId, matrix, label) {
  checked++;
  if (!matrix || typeof matrix !== 'object') {
    addFinding('BLOCKING', `${label} pegId=${pegId}: gateModeMatrix is not a valid object`);
    return;
  }

  const phaseKey = pegId.replace('PEG-', 'P');  // PEG-1 → P1, PEG-3 → P3, etc.

  for (const mech of VALID_MECHANISMS) {
    if (!(mech in matrix)) {
      addFinding('BLOCKING', `${label} pegId=${pegId}: missing mechanism "${mech}"`);
      continue;
    }
    const mechObj = matrix[mech];
    if (typeof mechObj !== 'object' || mechObj === null) {
      addFinding('BLOCKING', `${label} pegId=${pegId}: mechanism "${mech}" must be an object`);
      continue;
    }
    for (const rc of VALID_RISK_CLASSES) {
      if (!(rc in mechObj)) {
        addFinding('BLOCKING', `${label} pegId=${pegId}: [${mech}] missing risk_class "${rc}"`);
        continue;
      }
      const mode = mechObj[rc];
      if (!VALID_MODES.includes(mode)) {
        addFinding('BLOCKING', `${label} pegId=${pegId}: [${mech}][${rc}]="${mode}" not in {blocking,advisory,silent}`);
        continue;
      }
      // Hard floor check
      const floor = HARD_FLOORS[mech]?.[rc]?.[phaseKey];
      if (floor && MODE_RANK[mode] < MODE_RANK[floor]) {
        addFinding('BLOCKING',
          `${label} pegId=${pegId}: [${mech}][${rc}]="${mode}" violates SEED-2 hard floor "${floor}" ` +
          `(must be >= ${floor}; tighten-only, never relax below floor)`);
      }
    }
  }
}

// ── Self-verify SEED-2 reference matrices ────────────────────────────────────
console.log('[validate-gate-mode-matrix] verifying SEED-2 reference matrices...');
for (const [pegId, matrix] of Object.entries(SEED2_REFERENCE)) {
  validateMatrix(pegId, matrix, 'SEED-2-reference');
}
const seed2Violations = findings.filter(f => f.msg.includes('SEED-2-reference')).length;
if (seed2Violations === 0) {
  console.log(`  ✓ All 5 SEED-2 reference matrices pass hard-floor checks`);
}

// ── Check gate-mode-matrix-seed.json if present ───────────────────────────────
const seedDataPath = join(ROOT, 'tools/data/gate-mode-matrix-seed.json');
if (existsSync(seedDataPath)) {
  console.log('[validate-gate-mode-matrix] checking seed data...');
  try {
    const seedData = JSON.parse(readFileSync(seedDataPath, 'utf-8'));
    if (Array.isArray(seedData.gates)) {
      for (const gate of seedData.gates) {
        if (gate.pegId && gate.gateModeMatrix) {
          validateMatrix(gate.pegId, gate.gateModeMatrix, 'seed-data');
        }
      }
    }
  } catch (e) {
    addFinding('ADVISORY', `seed data parse error: ${e.message}`);
  }
}

console.log(`[validate-gate-mode-matrix] checked=${checked} blocking=${blocking_count} advisory=${advisory_count}`);

const result = {
  checked,
  blocking: blocking_count,
  advisory: advisory_count,
  seed2_reference_verified: seed2Violations === 0,
  findings: findings.slice(0, 30),
  ran_at: new Date().toISOString(),
};
writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2));

if (blocking_count > 0) process.exit(1);
process.exit(0);
