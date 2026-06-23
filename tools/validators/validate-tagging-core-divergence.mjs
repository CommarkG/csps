#!/usr/bin/env node
/**
 * validate-tagging-core-divergence.mjs — PROTO-S088-HARVEST-GATE BUILD 2
 *
 * Prevents SSoT drift between:
 *   - tools/config/tagging-core-enums.yaml (THE canonical closed-enum SSoT)
 *   - tools/validators/validate-frontmatter.mjs (where enums are currently hardcoded)
 *
 * BLOCKING: any enum value in validate-frontmatter.mjs that is NOT in tagging-core-enums.yaml
 *           any enum value in tagging-core-enums.yaml that is NOT in validate-frontmatter.mjs
 *
 * ADVISORY: enum dimension exists in SSoT but has no enforcement path (no validator reads it)
 *
 * Rationale: Validators re-defining enums inline (instead of importing from SSoT) is the
 * root cause of status-enum drift. Every time an enum changes, every validator that hardcodes
 * it must be updated — drift is guaranteed. This validator catches the drift.
 *
 * Migration path: the short-term fix is this divergence check. The long-term fix is
 * validators importing from tagging-core-enums.yaml directly. That refactoring is tracked
 * in gap_TAGGING_CORE_IMPORT_REFACTOR (improvement register, added by this build).
 *
 * Block-test (--block-test):
 *   INPUT A: plant extra value in SSoT not in frontmatter validator → exit 1
 *   INPUT B: plant extra value in frontmatter validator not in SSoT → exit 1
 *   INPUT C: clean state (SSoT and validator match) → exit 0
 *
 * @csps-id csps.validators.validate-tagging-core-divergence
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces TAGGING-CORE-INDEX BUILD-2 B_SAVINGS_AND_SSOT_UNIFIED
 * @csps-prevention-class ENUM-DRIFT SSOT-FRAGMENTATION STATUS-CONSOLIDATION
 *
 * run_tier: STANDARD
 * always_rerun: false
 * @determinism-exempt: no clock-based decisions.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const ENUM_SSOT       = join(ROOT, 'tools/config/tagging-core-enums.yaml');
const FRONTMATTER_VAL = join(ROOT, 'tools/validators/validate-frontmatter.mjs');
const LAST_RUN        = join(ROOT, 'tools/data/validate-tagging-core-divergence-last-run.json');

let blocking = 0, advisory = 0, passes = 0;
const findings = [];

function PASS(msg)  { passes++;   console.log(`  [PASS] ${msg}`); }
function BLOCK(msg) { blocking++; findings.push(`[BLOCKING] ${msg}`); console.log(`  [BLOCKING] ${msg}`); }
function WARN(msg)  { advisory++; findings.push(`[ADVISORY] ${msg}`); console.log(`  [ADVISORY] ${msg}`); }

// ── Parse YAML enum arrays from SSoT ─────────────────────────────────────────
// Extracts all `values:` lists from the YAML, grouped by dimension key.
function parseSSoTEnums(raw) {
  const result = {};
  // Match dimension blocks: "dimensionName:\n  ssot: ...\n  values:\n    - val"
  const dimensionPattern = /^(\w[\w_-]*):\n(?:[ \t]+[^\n]+\n)*?[ \t]+values:\n((?:[ \t]+-[^\n]+\n?)+)/gm;
  for (const m of raw.matchAll(dimensionPattern)) {
    const dim = m[1].trim();
    const valBlock = m[2];
    const values = [...valBlock.matchAll(/- ([^\n#]+)/g)].map(v => v[1].trim());
    if (values.length > 0) result[dim] = new Set(values);
  }
  return result;
}

// ── Parse hardcoded arrays from validate-frontmatter.mjs ─────────────────────
// Looks for: const LIFECYCLE_STATE_VALUES = ['a', 'b', ...] patterns
function parseFrontmatterEnums(raw) {
  const result = {};
  // Pattern: const SOME_VALUES = ['val1', 'val2', ...]
  const constPattern = /^const\s+(\w+_VALUES)\s*=\s*\[([\s\S]*?)\];/gm;
  for (const m of raw.matchAll(constPattern)) {
    const constName = m[1];
    const arrayContent = m[2];
    // Extract string values
    const values = [...arrayContent.matchAll(/'([^']+)'/g)].map(v => v[1]);
    if (values.length > 0) result[constName] = new Set(values);
  }
  return result;
}

// Map SSoT dimension names → validator const names
const DIMENSION_TO_CONST = {
  lifecycle_state:  'LIFECYCLE_STATE_VALUES',
  stage:            'STAGE_VALUES',
  quality_state:    'QUALITY_STATE_VALUES',
  cdp_status:       'CDP_STATUS_VALUES',
  enforcement_stage: 'ENFORCEMENT_STAGE_VALUES',
  impl_status:      'IMPL_STATUS_VALUES',
  diataxis_type:    'DIATAXIS_TYPE_VALUES',
  core_spine:       'CORE_SPINE_VALUES',
};

// ── Block-test mode ───────────────────────────────────────────────────────────
async function runBlockTest() {
  console.log('[block-test] TAGGING-CORE-DIVERGENCE BLOCK-TEST');

  const origSSoT = existsSync(ENUM_SSOT) ? readFileSync(ENUM_SSOT, 'utf8') : null;
  const origVal  = existsSync(FRONTMATTER_VAL) ? readFileSync(FRONTMATTER_VAL, 'utf8') : null;
  const selfPath = fileURLToPath(import.meta.url);
  let allPass = true;

  // ── INPUT A: plant extra value in SSoT not in validator → exit 1 ─────────
  console.log('\n[TEST A] Planting extra lifecycle value in SSoT not in validator → expect exit 1');
  if (origSSoT) {
    const planted = origSSoT.replace(
      /lifecycle_state:\n(\s+ssot: frontmatter\n)/,
      'lifecycle_state:\n$1  # PLANTED_TEST_VALUE injected for block-test\n'
    ).replace(
      /    - active          # default/,
      '    - BLOCK_TEST_EXTRA_VALUE\n    - active          # default'
    );
    writeFileSync(ENUM_SSOT, planted, 'utf8');
  }

  const resA = spawnSync(process.execPath, [selfPath], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
  if (origSSoT) writeFileSync(ENUM_SSOT, origSSoT, 'utf8');

  if (resA.status !== 1) {
    console.error(`[TEST A] FAIL — expected exit 1, got ${resA.status}`);
    console.error('stdout:', (resA.stdout || '(empty)').slice(0, 400));
    allPass = false;
  } else {
    console.log(`[TEST A] PASS — exit=1 (SSoT extra value correctly BLOCKED)`);
  }

  // ── INPUT B: plant extra value in validator not in SSoT → exit 1 ─────────
  console.log('\n[TEST B] Planting extra lifecycle value in validator not in SSoT → expect exit 1');
  if (origVal) {
    const planted = origVal.replace(
      /const LIFECYCLE_STATE_VALUES = \[/,
      "const LIFECYCLE_STATE_VALUES = ['BLOCK_TEST_EXTRA_VAL_B', "
    );
    writeFileSync(FRONTMATTER_VAL, planted, 'utf8');
  }

  const resB = spawnSync(process.execPath, [selfPath], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
  if (origVal) writeFileSync(FRONTMATTER_VAL, origVal, 'utf8');

  if (resB.status !== 1) {
    console.error(`[TEST B] FAIL — expected exit 1, got ${resB.status}`);
    console.error('stdout:', (resB.stdout || '(empty)').slice(0, 400));
    allPass = false;
  } else {
    console.log(`[TEST B] PASS — exit=1 (validator extra value correctly BLOCKED)`);
  }

  // ── INPUT C: clean state → exit 0 ────────────────────────────────────────
  console.log('\n[TEST C] Clean state → expect exit 0');
  const resC = spawnSync(process.execPath, [selfPath], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
  if (resC.status !== 0) {
    const hasBlocking = resC.stdout?.includes('[BLOCKING]');
    if (hasBlocking) {
      console.error(`[TEST C] FAIL — clean state produced BLOCKING`);
      console.error('stdout:', (resC.stdout || '').slice(0, 400));
      allPass = false;
    } else {
      // Advisory only is OK
      console.log(`[TEST C] PASS — exit=${resC.status} (no BLOCKING in output)`);
    }
  } else {
    console.log(`[TEST C] PASS — exit=0 (clean state)`);
  }

  console.log(`\n[block-test] ${allPass ? 'ALL TESTS PASSED' : 'ONE OR MORE TESTS FAILED'}`);
  process.exit(allPass ? 0 : 1);
}

if (process.argv.includes('--block-test')) {
  await runBlockTest();
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log('[validate-tagging-core-divergence] Closed-enum SSoT divergence gate');
console.log('  SSoT: tools/config/tagging-core-enums.yaml');
console.log('  BLOCKING: enum values in code != SSoT (added or removed without updating both)');
console.log('');

if (!existsSync(ENUM_SSOT)) {
  BLOCK(`tools/config/tagging-core-enums.yaml missing — SSoT not found`);
  console.log(`\n[validate-tagging-core-divergence] blocking=${blocking} advisory=${advisory} passes=${passes}`);
  process.exit(1);
}

if (!existsSync(FRONTMATTER_VAL)) {
  BLOCK(`tools/validators/validate-frontmatter.mjs missing — cannot compare`);
  console.log(`\n[validate-tagging-core-divergence] blocking=${blocking} advisory=${advisory} passes=${passes}`);
  process.exit(1);
}

let ssotEnums, fmEnums;
try {
  ssotEnums = parseSSoTEnums(readFileSync(ENUM_SSOT, 'utf8'));
  PASS(`SSoT loaded: ${Object.keys(ssotEnums).length} dimensions`);
} catch (e) {
  BLOCK(`Failed to parse tagging-core-enums.yaml: ${e.message}`);
  console.log(`\n[validate-tagging-core-divergence] blocking=${blocking} advisory=${advisory} passes=${passes}`);
  process.exit(1);
}

try {
  fmEnums = parseFrontmatterEnums(readFileSync(FRONTMATTER_VAL, 'utf8'));
  PASS(`validate-frontmatter.mjs loaded: ${Object.keys(fmEnums).length} *_VALUES consts`);
} catch (e) {
  BLOCK(`Failed to parse validate-frontmatter.mjs: ${e.message}`);
  console.log(`\n[validate-tagging-core-divergence] blocking=${blocking} advisory=${advisory} passes=${passes}`);
  process.exit(1);
}

// ── CHECK: compare each mapped dimension ─────────────────────────────────────
for (const [dim, constName] of Object.entries(DIMENSION_TO_CONST)) {
  const ssotVals = ssotEnums[dim];
  const codeVals = fmEnums[constName];

  if (!ssotVals) {
    WARN(`Dimension "${dim}" not in SSoT — add it to tagging-core-enums.yaml`);
    continue;
  }
  if (!codeVals) {
    WARN(`No ${constName} in validate-frontmatter.mjs — dimension "${dim}" not enforced (add to validator or mark as advisory-only in SSoT)`);
    continue;
  }

  // Values in SSoT but not in code
  const inSSoTNotCode = [...ssotVals].filter(v => !codeVals.has(v));
  // Values in code but not in SSoT
  const inCodeNotSSoT = [...codeVals].filter(v => !ssotVals.has(v));

  if (inSSoTNotCode.length > 0) {
    BLOCK(`${dim}: SSoT has values NOT in ${constName}: [${inSSoTNotCode.join(', ')}] — update validator OR remove from SSoT`);
  }
  if (inCodeNotSSoT.length > 0) {
    BLOCK(`${dim}: ${constName} has values NOT in SSoT: [${inCodeNotSSoT.join(', ')}] — add to tagging-core-enums.yaml or remove from validator`);
  }
  if (inSSoTNotCode.length === 0 && inCodeNotSSoT.length === 0) {
    PASS(`${dim}: SSoT ↔ ${constName} match (${ssotVals.size} values)`);
  }
}

// ── RESULT ────────────────────────────────────────────────────────────────────
console.log('');
console.log(`[validate-tagging-core-divergence] blocking=${blocking} advisory=${advisory} passes=${passes}`);

try {
  mkdirSync(join(ROOT, 'tools/data'), { recursive: true });
  writeFileSync(LAST_RUN, JSON.stringify({
    ran_at: new Date().toISOString(),
    blocking, advisory, passes, findings,
    ssot_dimensions: Object.keys(ssotEnums).length,
    code_consts: Object.keys(fmEnums).length,
    mappings_checked: Object.keys(DIMENSION_TO_CONST).length,
  }, null, 2));
} catch { /* non-fatal */ }

process.exit(blocking > 0 ? 1 : 0);
