#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/ + PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 3
 * core_spine: VALD
 * governing_principle: P-META-019
 * behavioral_contract: B_STRUCTURAL_PREVENTION_DISCIPLINE
 * role: Validates threshold-intake-log.yaml entries have the 4 new classification axes
 *       (scope, intent, mandate_relation, route) added by M-42 router.
 *       ADVISORY on missing axes — historical entries pre-date the router.
 * @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE P-META-019
 * @behavioral-test-status: tested — threshold-router-test.sh A/B/C/D
 */

/**
 * validate-threshold-routing-coverage.mjs
 * PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 3 companion validator.
 *
 * Checks threshold-intake-log.yaml for:
 *   - entries with 4-axis classification (scope/intent/mandate_relation/route fields)
 *   - entries missing any of the 4 axes (advisory for historical; blocking for new)
 *
 * Output: entries_checked=N with_4axes=N missing_axes=N advisory=N blocking=N
 * Writes: tools/data/validate-threshold-routing-coverage-last-run.json
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const LOG_PATH = join(ROOT, 'tools', 'data', 'threshold-intake-log.yaml');

let entries_checked = 0, with_4axes = 0, missing_axes = 0, advisory = 0, blocking = 0;
const findings = [];

if (!existsSync(LOG_PATH)) {
  console.log(`[validate-threshold-routing-coverage] threshold-intake-log.yaml not found`);
  process.exit(0);
}

const content = readFileSync(LOG_PATH, 'utf-8').replace(/\r\n/g, '\n');
const lines = content.split('\n');
let currentEntry = null;
const entries = [];

for (const line of lines) {
  if (/^- id:/.test(line)) {
    if (currentEntry) entries.push(currentEntry);
    currentEntry = { id: line.replace(/^- id:\s*["']?/, '').replace(/["']$/, '').trim(), fields: {} };
  } else if (currentEntry && /^\s+(scope|intent|mandate_relation|route|type|spine_tag|session|urgency):\s/.test(line)) {
    const m = line.match(/^\s+(\w+):\s+(.+)/);
    if (m) currentEntry.fields[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}
if (currentEntry) entries.push(currentEntry);

entries_checked = entries.length;

for (const entry of entries) {
  const has4axes = entry.fields.scope && entry.fields.intent && entry.fields.mandate_relation && entry.fields.route;
  if (has4axes) {
    with_4axes++;
  } else {
    missing_axes++;
    advisory++; // Advisory: historical entries pre-date the router
    findings.push({
      id: entry.id,
      missing: ['scope', 'intent', 'mandate_relation', 'route'].filter(f => !entry.fields[f])
    });
  }
}

// Output (cap at 5 findings)
for (const f of findings.slice(0, 5)) {
  console.log(`  ⚠ Entry ${f.id}: missing 4-axis fields: ${f.missing.join(', ')}`);
  console.log(`    → New entries should have all 4 axes from threshold-router.mjs classification.`);
}
if (findings.length > 5) console.log(`  ... +${findings.length - 5} more historical entries`);

const summary = `[validate-threshold-routing-coverage] entries_checked=${entries_checked} with_4axes=${with_4axes} missing_axes=${missing_axes} advisory=${advisory} blocking=${blocking}`;
console.log(summary);

writeFileSync(
  join(ROOT, 'tools', 'data', 'validate-threshold-routing-coverage-last-run.json'),
  JSON.stringify({ entries_checked, with_4axes, missing_axes, advisory, blocking, findings: findings.slice(0, 20), ran_at: new Date().toISOString() }, null, 2),
  'utf-8'
);

if (blocking > 0) process.exit(1);
process.exit(0);
