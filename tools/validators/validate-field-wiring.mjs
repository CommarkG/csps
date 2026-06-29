#!/usr/bin/env node
/**
 * validate-field-wiring.mjs — Field-Level Wiring Gate (save → read → influence)
 *
 * BORROWED + REPRODUCED from CSP S346 collaboration package ("floater rule", field level),
 * evaluated on merit and rebuilt in CSPS idiom (NOT imported — external content is a claim,
 * reproduced independently per dna-guardian discipline). DISTINCT from validate-floater-
 * escalation.mjs, which is ARTIFACT-level (does a decision reach a terminal state?). THIS gate
 * is FIELD-level: is a declared data field actually wired end-to-end, or is it a dead field?
 *
 * Prevention class: DEAD-FIELD — saved-but-never-read | read-but-never-influences-output.
 *   = EXISTS≠ACTIVE applied to data. Closes the canonical-build gap "goal_id backpack slot
 *   documented-not-enforced". A field that does not influence anything is decoration.
 *
 * RULE: every consequential data field must declare THREE wiring sites:
 *   save:      where the value is written / persisted   (e.g. "POST /api/goal -> goal-record.json")
 *   read:      where it is read back                    (e.g. "GoalStep.tsx loads from localStorage")
 *   influence: what output / behavior it changes        (e.g. "renders goal_statement in header + gates B4")
 * A field missing ANY of the three (or empty) is a DEAD FIELD → BLOCKING.
 *
 * TARGETS: tools/data/field-wiring-targets.txt — one schema path per line (# comments ok).
 *   Each listed schema must carry a top-level `field_wiring:` map; each entry must have non-empty
 *   save + read + influence. No targets registered yet → PASS (advisory note). Override the targets
 *   file via env FIELD_WIRING_TARGETS (used by the planted-violation block-test).
 *
 * Expansion: when Sonnet builds the goal-record schema (B1), add its path to the targets file —
 *   the gate then enforces save→read→influence on goal_id, resolution_signal, governor_signature, …
 *
 * @csps-id csps.validators.validate-field-wiring
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces DEAD-FIELD save-read-influence field_wiring
 * @csps-prevention-class DEAD-FIELD EXISTS-NOT-ACTIVE-FOR-DATA
 *
 * run_tier: STANDARD
 * always_rerun: false
 * @determinism-exempt: no — pure function of committed target files.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const TARGETS_FILE = process.env.FIELD_WIRING_TARGETS
  ? resolve(process.env.FIELD_WIRING_TARGETS)
  : join(ROOT, 'tools/data/field-wiring-targets.txt');

const REQUIRED_SITES = ['save', 'read', 'influence'];

let blocking = 0, advisory = 0, passes = 0;
let targetCount = 0, fieldCount = 0, deadCount = 0;
const findings = [];

function PASS(msg)  { passes++;   console.log(`  [PASS] ${msg}`); }
function BLOCK(msg) { blocking++; findings.push(`[BLOCKING] ${msg}`); console.log(`  [BLOCKING] ${msg}`); }
function WARN(msg)  { advisory++; findings.push(`[ADVISORY] ${msg}`); console.log(`  [ADVISORY] ${msg}`); }

function nonEmpty(v) {
  if (v == null) return false;
  if (typeof v === 'string') return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0 && v.some(nonEmpty);
  return true;
}

console.log('[validate-field-wiring] Field-level wiring gate (save -> read -> influence)');
console.log('');

if (!existsSync(TARGETS_FILE)) {
  WARN(`targets file missing (${TARGETS_FILE}) — no field-wiring targets registered yet`);
  emitAndExit();
}

const targetPaths = readFileSync(TARGETS_FILE, 'utf8')
  .split('\n')
  .map(l => l.replace(/#.*$/, '').trim())
  .filter(Boolean);

if (targetPaths.length === 0) {
  PASS('no field-wiring targets registered yet — gate is armed, awaiting first schema (e.g. goal-record at B1)');
  emitAndExit();
}

for (const rel of targetPaths) {
  targetCount++;
  const abs = isAbsolute(rel) ? rel : join(ROOT, rel);
  if (!existsSync(abs)) {
    BLOCK(`target schema not found: ${rel} — registered for field-wiring but missing`);
    continue;
  }
  let doc;
  try {
    doc = yaml.load(readFileSync(abs, 'utf8'));
  } catch (e) {
    BLOCK(`target ${rel}: YAML parse failed — ${e.message}`);
    continue;
  }
  const fw = doc && doc.field_wiring;
  if (!fw || typeof fw !== 'object' || Array.isArray(fw)) {
    BLOCK(`target ${rel}: missing top-level \`field_wiring:\` map — every registered schema must declare it`);
    continue;
  }
  const fields = Object.keys(fw);
  if (fields.length === 0) {
    BLOCK(`target ${rel}: \`field_wiring:\` is empty — declare at least one field`);
    continue;
  }
  for (const fname of fields) {
    fieldCount++;
    const wiring = fw[fname] || {};
    const missing = REQUIRED_SITES.filter(site => !nonEmpty(wiring[site]));
    if (missing.length > 0) {
      deadCount++;
      BLOCK(`DEAD FIELD ${rel}#${fname} — missing ${missing.join(' + ')} (a field that is not saved+read+influencing is decoration)`);
    } else {
      PASS(`${rel}#${fname} wired: save+read+influence all declared`);
    }
  }
}

function emitAndExit() {
  console.log('');
  console.log(`[validate-field-wiring] targets=${targetCount} fields=${fieldCount} dead=${deadCount} blocking=${blocking} advisory=${advisory} passes=${passes}`);
  process.exit(blocking > 0 ? 1 : 0);
}

emitAndExit();
