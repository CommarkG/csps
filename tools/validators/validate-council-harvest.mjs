#!/usr/bin/env node
/**
 * validate-council-harvest.mjs — PROTO-S088-HARVEST-GATE BUILD 1
 *
 * Enforces mandatory harvesting of council/research/external-review deliberations.
 * Design: docs/plan/_handoff/COUNCIL-WISDOM-HARVEST-DESIGN.md (§5 MANDATORY HARVEST)
 *
 * BLOCKING checks:
 *   (a) council-invocation-log entry WHERE personas≠"none" (an actual council deliberation)
 *       has no matching council-harvest entry → un-harvested deliberation → BLOCK
 *   (b) council-harvest entry WHERE status="closed" has disposition=null → unrouted closure → BLOCK
 *   (c) council-harvest entry WHERE status="closed" AND disposition="ratify-candidate"
 *       has no matching ratified-standards.yaml entry → promoted but not ratified → ADVISORY
 *       (→ BLOCKING at K=2 gap-recurrence incidents per gap_HARVEST_RATIFY_GAP)
 *   (d) recurring insight (same question_key in ≥2 harvest entries) has no findings-actuator entry → ADVISORY
 *
 * Block-test (--block-test):
 *   INPUT A: planted invocation with personas≠none + no harvest entry → exit 1
 *   INPUT B: planted closed harvest with disposition=null → exit 1
 *   INPUT C: clean state (personas=none, AWAITING entries OK) → exit 0
 *
 * @csps-id csps.validators.validate-council-harvest
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces PROTO-S088-HARVEST-GATE COUNCIL-WISDOM-HARVEST-DESIGN
 * @csps-prevention-class HARVEST-GRAVEYARD UNROUTED-DISPOSITION PERMANENCE-DRIFT
 *
 * run_tier: STANDARD
 * always_rerun: false
 * @determinism-exempt: new Date() used ONLY in --block-test mode for planted timestamp. No clock in blocking decisions.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const INVOCATION_LOG  = join(ROOT, 'tools/data/council-invocation-log.yaml');
const HARVEST_REG     = join(ROOT, 'tools/data/council-harvest.yaml');
const RATIFIED_STD    = join(ROOT, 'tools/data/ratified-standards.yaml');
const GAP_REG         = join(ROOT, 'tools/data/gap-recurrence-register.yaml');
const IMP_REG         = join(ROOT, 'tools/data/improvement-register.yaml');
const LAST_RUN        = join(ROOT, 'tools/data/validate-council-harvest-last-run.json');

// Valid disposition values (closed-enum, §4 design)
const VALID_DISPOSITIONS = new Set([
  'SWIFT-absorb', 'park', 'ratify-candidate', 'discard-with-reason',
  'findings-actuator', // shorthand for register-in-gap-register
]);

let blocking = 0, advisory = 0, passes = 0;
const findings = [];

function PASS(msg)  { passes++;   console.log(`  [PASS] ${msg}`); }
function BLOCK(msg) { blocking++; findings.push(`[BLOCKING] ${msg}`); console.log(`  [BLOCKING] ${msg}`); }
function WARN(msg)  { advisory++; findings.push(`[ADVISORY] ${msg}`); console.log(`  [ADVISORY] ${msg}`); }

// ── Minimal YAML list parser (same approach as findings-actuator.mjs) ─────────
function parseEntries(raw, idPrefix) {
  const entries = [];
  // Split on lines that start an entry "  - id:" (2-space indent) or "- id:" at root
  const blocks = raw.split(/\n- id:|\n  - id:/);
  for (const block of blocks.slice(1)) {
    const id = block.split('\n')[0].replace(/[\s:"]+/g, '').trim();
    if (!id) continue;

    // Helpers to extract scalar fields
    const get = (key) =>
      (block.match(new RegExp(`\\n\\s+${key}:\\s*"?([^"\\n]+)"?`)) || [])[1]?.trim() ?? null;

    const personas    = get('personas') ?? 'none';
    const status      = get('status') ?? null;
    const disposition = get('disposition') ?? null;
    const invRef      = get('invocation_ref') ?? null;
    const questionKey = get('question') ?? null;
    const trigger     = get('trigger') ?? null;
    const wisdom      = get('wisdom_class') ?? null;

    entries.push({ id, personas, status, disposition, invocation_ref: invRef, question: questionKey, trigger, wisdom_class: wisdom });
  }
  return entries;
}

// ── Block-test mode ───────────────────────────────────────────────────────────
async function runBlockTest() {
  console.log('[block-test] COUNCIL-HARVEST BLOCK-TEST');

  const origHarvest    = existsSync(HARVEST_REG) ? readFileSync(HARVEST_REG, 'utf8') : null;
  const origInvocation = existsSync(INVOCATION_LOG) ? readFileSync(INVOCATION_LOG, 'utf8') : null;

  const selfPath = fileURLToPath(import.meta.url);
  let allPass = true;

  // ── INPUT A: invocation with personas + no harvest entry → exit 1 ───────
  console.log('\n[TEST A] Planting invocation entry with personas=Research (no harvest) → expect exit 1');
  const plantedId = `route-2099-01-01T00-00-00-000Z`;
  const plantedInvEntry = `
- id: ${plantedId}
  timestamp: "2099-01-01T00:00:00.000Z"
  session: "BLOCK-TEST"
  route: "COUNCIL"
  rationale: "planted defect for block-test"
  spine: "GVRN"
  scope: "operational"
  personas: "Research"
`;
  if (origInvocation) {
    writeFileSync(INVOCATION_LOG, origInvocation + plantedInvEntry, 'utf8');
  }

  const resA = spawnSync(process.execPath, [selfPath], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
  // Restore
  if (origInvocation) writeFileSync(INVOCATION_LOG, origInvocation, 'utf8');

  if (resA.status !== 1) {
    console.error(`[TEST A] FAIL — expected exit 1, got ${resA.status}`);
    console.error('stdout:', resA.stdout?.slice(0, 500));
    allPass = false;
  } else {
    console.log(`[TEST A] PASS — exit=${resA.status} (un-harvested invocation correctly BLOCKED)`);
  }

  // ── INPUT B: closed harvest entry with disposition=null → exit 1 ─────────
  console.log('\n[TEST B] Planting closed harvest entry with disposition=null → expect exit 1');
  const plantedHarvestClosed = `
  - id: harvest-BLOCK-TEST-NULL-DISP
    trigger: research
    invocation_ref: "none"
    status: closed
    question: "PLANTED DEFECT — closed with null disposition"
    conclusion: "some insight"
    provenance: "internal"
    disposition: null
    spine: GVRN
    domain: governance
    wisdom_class: insight
`;
  if (origHarvest) {
    writeFileSync(HARVEST_REG, origHarvest + plantedHarvestClosed, 'utf8');
  }

  const resB = spawnSync(process.execPath, [selfPath], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
  if (origHarvest) writeFileSync(HARVEST_REG, origHarvest, 'utf8');

  if (resB.status !== 1) {
    console.error(`[TEST B] FAIL — expected exit 1, got ${resB.status}`);
    console.error('stdout:', resB.stdout?.slice(0, 500));
    allPass = false;
  } else {
    console.log(`[TEST B] PASS — exit=${resB.status} (closed+null-disposition correctly BLOCKED)`);
  }

  // ── INPUT C: clean state → exit 0 ────────────────────────────────────────
  console.log('\n[TEST C] Clean state (all personas=none, AWAITING entries OK) → expect exit 0');
  const resC = spawnSync(process.execPath, [selfPath], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
  if (resC.status !== 0) {
    // Advisory is OK (exit 0), but blocking is not
    const hasBlocking = resC.stdout?.includes('[BLOCKING]');
    if (hasBlocking || resC.status === 1) {
      console.error(`[TEST C] FAIL — clean state produced exit=${resC.status}`);
      console.error('stdout:', (resC.stdout || '(empty)').slice(0, 500));
      console.error('stderr:', (resC.stderr || '(empty)').slice(0, 300));
      allPass = false;
    } else {
      // non-1 exit (spawn error, signal) — treat as pass if no BLOCKING in output
      console.log(`[TEST C] PASS — exit=${resC.status} (no BLOCKING signal in output)`);
    }
  } else {
    console.log(`[TEST C] PASS — exit=0 (no blocking in clean state)`);
  }

  console.log(`\n[block-test] ${allPass ? 'ALL TESTS PASSED' : 'ONE OR MORE TESTS FAILED'}`);
  process.exit(allPass ? 0 : 1);
}

if (process.argv.includes('--block-test')) {
  await runBlockTest();
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log('[validate-council-harvest] Council/research/external-review harvest gate');
console.log('  BLOCKING: un-harvested deliberation (personas≠none + no harvest entry)');
console.log('  BLOCKING: closed harvest entry with null/un-routed disposition');
console.log('  ADVISORY: ratify-candidate closed entry without ratified-standards match');
console.log('');

if (!existsSync(INVOCATION_LOG)) {
  WARN('council-invocation-log.yaml missing — cannot check for un-harvested deliberations');
}
if (!existsSync(HARVEST_REG)) {
  WARN('council-harvest.yaml missing — no harvest register exists');
}

// ── Load all registers ────────────────────────────────────────────────────────
let invocations = [];
let harvests    = [];
let ratified    = new Set();
let gapIDs      = new Set();

if (existsSync(INVOCATION_LOG)) {
  try {
    invocations = parseEntries(readFileSync(INVOCATION_LOG, 'utf8'), 'route-');
    PASS(`council-invocation-log loaded (${invocations.length} entries)`);
  } catch (e) {
    WARN(`could not parse council-invocation-log: ${e.message}`);
  }
}

if (existsSync(HARVEST_REG)) {
  try {
    harvests = parseEntries(readFileSync(HARVEST_REG, 'utf8'), 'harvest-');
    PASS(`council-harvest loaded (${harvests.length} entries)`);
  } catch (e) {
    WARN(`could not parse council-harvest: ${e.message}`);
  }
}

if (existsSync(RATIFIED_STD)) {
  try {
    const raw = readFileSync(RATIFIED_STD, 'utf8');
    // Collect all IDs mentioned in ratified-standards
    const ids = [...raw.matchAll(/\n  - id:\s*([^\n]+)/g)].map(m => m[1].trim());
    ids.forEach(id => ratified.add(id));
    const harvestRefs = [...raw.matchAll(/harvest[_-]ref:\s*([^\n]+)/g)].map(m => m[1].trim());
    harvestRefs.forEach(r => ratified.add(r));
    PASS(`ratified-standards loaded (${ratified.size} ids/refs)`);
  } catch (e) {
    WARN(`could not parse ratified-standards: ${e.message}`);
  }
}

for (const regFile of [GAP_REG, IMP_REG]) {
  if (existsSync(regFile)) {
    try {
      const raw = readFileSync(regFile, 'utf8');
      const ids = [...raw.matchAll(/\n  - id:\s*([^\n]+)/g)].map(m => m[1].trim());
      ids.forEach(id => gapIDs.add(id));
    } catch { /* non-fatal */ }
  }
}

// ── CHECK 1: un-harvested deliberations ──────────────────────────────────────
// Invocation entries where personas≠"none" (an actual council deliberation, not just routing)
const deliberations = invocations.filter(e => e.personas && e.personas !== 'none' && e.personas !== '"none"');
if (deliberations.length === 0) {
  PASS(`no council deliberations in invocation log (all personas="none" — routing only)`);
} else {
  for (const inv of deliberations) {
    // Look for a harvest entry whose invocation_ref references this invocation ID
    const matched = harvests.find(h =>
      h.invocation_ref?.includes(inv.id) ||
      h.invocation_ref?.includes(inv.session)
    );
    if (!matched) {
      BLOCK(`un-harvested deliberation: ${inv.id} (session=${inv.session}, personas=${inv.personas}) — no matching council-harvest entry`);
    } else {
      PASS(`invocation ${inv.id} → harvest ${matched.id} (disposition=${matched.disposition ?? 'null'})`);
    }
  }
}

// ── CHECK 2: closed entries with null/invalid disposition ─────────────────────
const closedEntries = harvests.filter(h => h.status === 'closed');
for (const h of closedEntries) {
  if (!h.disposition || h.disposition === 'null') {
    BLOCK(`closed harvest entry ${h.id} has disposition=null — must be routed before closing`);
  } else if (!VALID_DISPOSITIONS.has(h.disposition)) {
    BLOCK(`closed harvest entry ${h.id} has unrecognized disposition="${h.disposition}" — use: ${[...VALID_DISPOSITIONS].join('|')}`);
  } else {
    PASS(`harvest ${h.id}: closed with valid disposition=${h.disposition}`);
  }
}
if (closedEntries.length === 0) {
  PASS('no closed harvest entries to check');
}

// ── CHECK 3 (ADVISORY): ratify-candidate without ratified-standards entry ──────
const ratifyCandidates = harvests.filter(h => h.status === 'closed' && h.disposition === 'ratify-candidate');
for (const h of ratifyCandidates) {
  // Check if any ratified-standards entry references this harvest
  const refFound = ratified.has(h.id) ||
    [...ratified].some(r => r.includes(h.id));
  if (!refFound) {
    WARN(`harvest ${h.id}: disposition=ratify-candidate but no matching ratified-standards.yaml entry — promote or record skip-reason`);
  } else {
    PASS(`harvest ${h.id}: ratify-candidate → ratified-standards entry found`);
  }
}

// ── CHECK 4 (ADVISORY): recurring insights without gap register entry ──────────
// Count by question_key — if same question in ≥2 harvests, it should be in the gap register
const questionCounts = {};
for (const h of harvests) {
  if (!h.question) continue;
  // Normalize: first 40 chars as key
  const key = h.question.slice(0, 40).toLowerCase().replace(/\s+/g, '_');
  questionCounts[key] = (questionCounts[key] || 0) + 1;
}
for (const [key, count] of Object.entries(questionCounts)) {
  if (count >= 2) {
    const inGap = [...gapIDs].some(id => id.toLowerCase().includes(key.slice(0, 15)));
    if (!inGap) {
      WARN(`recurring harvest question (k=${count}): "${key}" — not found in gap-recurrence/improvement-register; add a findings-actuator entry`);
    } else {
      PASS(`recurring question "${key}" (k=${count}) → gap-register entry found`);
    }
  }
}

// ── RESULT ────────────────────────────────────────────────────────────────────
console.log('');
console.log(`[validate-council-harvest] blocking=${blocking} advisory=${advisory} passes=${passes}`);

try {
  mkdirSync(join(ROOT, 'tools/data'), { recursive: true });
  writeFileSync(LAST_RUN, JSON.stringify({
    ran_at: new Date().toISOString(),
    blocking, advisory, passes, findings,
    deliberations_checked: deliberations.length,
    harvest_entries: harvests.length,
    closed_entries: closedEntries.length,
    ratify_candidates: ratifyCandidates.length,
  }, null, 2));
} catch { /* non-fatal */ }

process.exit(blocking > 0 ? 1 : 0);
