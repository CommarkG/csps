/**
 * Threshold intake tests — processGovernorInput + intake log written
 * Run: node_modules/.bin/tsx libs/threshold/tests/intake.test.ts
 * Plan item: INFRA-FLOW-VALIDATION | S056 | Layer 3
 */

import { existsSync, rmSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { processGovernorInput, getRecentIntake } from '../src/intake.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../../..');
const INTAKE_LOG = join(ROOT, '.csps', 'threshold', 'intake-log.yaml');

let passed = 0;
let failed = 0;

function assert(name: string, actual: unknown, expected: unknown): void {
  if (actual === expected) { console.log(`  ✓ ${name}`); passed++; }
  else { console.error(`  ✗ ${name}\n    expected: ${JSON.stringify(expected)}\n    actual:   ${JSON.stringify(actual)}`); failed++; }
}
function assertTruthy(name: string, v: unknown): void {
  if (v) { console.log(`  ✓ ${name}`); passed++; }
  else { console.error(`  ✗ ${name} — expected truthy, got ${JSON.stringify(v)}`); failed++; }
}

// ── Test 1: governor_directive classified correctly ────────────────────────
console.log('\nTest 1: processGovernorInput — governor_directive type');
const record1 = processGovernorInput(
  'Build libs/threshold/intake.ts and wire to session pipeline',
  'S056',
  { type: 'governor_directive', source: 'governor_directive' }
);
assert('type is governor_directive', record1.input.type, 'governor_directive');
assert('spine_tag is GVRN', record1.input.spine_tag, 'GVRN');
assert('urgency is high', record1.input.urgency, 'high');
assert('session is S056', record1.input.session, 'S056');
assertTruthy('id generated', record1.id.startsWith('thr-S056'));
assertTruthy('routing has pipelines', record1.routing.pipelines.length > 0);
assert('routes to PE_INTAKE', record1.routing.pipelines.includes('PE_INTAKE'), true);

// ── Test 2: intake log written ────────────────────────────────────────────
console.log('\nTest 2: intake log written to .csps/threshold/intake-log.yaml');
assert('intake log exists', existsSync(INTAKE_LOG), true);
const recent = getRecentIntake(5);
assertTruthy('intake log contains session marker', recent.includes('S056'));
assertTruthy('intake log contains type', recent.includes('governor_directive'));

// ── Test 3: error type inference works ────────────────────────────────────
console.log('\nTest 3: inferred type from raw text');
const errRecord = processGovernorInput(
  'pnpm verify error: validate-foo.mjs exited with code 1',
  'S056'
);
assert('error type inferred from text', errRecord.input.type, 'error');
assert('error spine is VALD', errRecord.input.spine_tag, 'VALD');
assert('error urgency is high', errRecord.input.urgency, 'high');

// ── Summary ───────────────────────────────────────────────────────────────
console.log(`\n─── Results: ${passed} passed, ${failed} failed ───`);
if (failed > 0) { console.error('[intake-test] FAIL'); process.exit(1); }
else { console.log('[intake-test] PASS: all tests passed'); }
