/**
 * Threshold classifier unit tests — 3 input types classified correctly
 * Design: docs/SIA/R1-04-THRESHOLD.md § 3
 * Run: node_modules/.bin/tsx libs/threshold/tests/classifier.test.ts
 * Plan item: THRESHOLD-CODE | S056
 */

import { classify } from '../src/classifier.js';
import { route } from '../src/router.js';

let passed = 0;
let failed = 0;

function assert(name: string, actual: unknown, expected: unknown): void {
  if (actual === expected) {
    console.log(`  ✓ ${name}`);
    passed++;
  } else {
    console.error(`  ✗ ${name}`);
    console.error(`    expected: ${JSON.stringify(expected)}`);
    console.error(`    actual:   ${JSON.stringify(actual)}`);
    failed++;
  }
}

// ── Test 1: governor_directive ──────────────────────────────────────────────
console.log('\nTest 1: governor_directive classification');
const gov = classify({ type: 'governor_directive', session: 'S056', source: 'governor_directive' });
assert('type is governor_directive', gov.type, 'governor_directive');
assert('spine_tag inferred as GVRN', gov.spine_tag, 'GVRN');
assert('scope_tag inferred as S1', gov.scope_tag, 'S1');
assert('urgency inferred as high', gov.urgency, 'high');
assert('status is new', gov.status, 'new');
assert('session is S056', gov.session, 'S056');
assert('id starts with thr-S056', gov.id.startsWith('thr-S056'), true);

// ── Test 2: error classification ────────────────────────────────────────────
console.log('\nTest 2: error classification');
const err = classify({ type: 'error', session: 'S056', source: 'sonnet_report', urgency: 'high' });
assert('type is error', err.type, 'error');
assert('spine_tag inferred as VALD', err.spine_tag, 'VALD');
assert('scope_tag inferred as S1', err.scope_tag, 'S1');
assert('urgency is high (explicit)', err.urgency, 'high');
assert('status is new', err.status, 'new');

// ── Test 3: core_seed classification ────────────────────────────────────────
console.log('\nTest 3: core_seed classification');
const seed = classify({ type: 'core_seed', session: 'S056', source: 'opus_design' });
assert('type is core_seed', seed.type, 'core_seed');
assert('spine_tag inferred as GVRN', seed.spine_tag, 'GVRN');
assert('scope_tag inferred as S3', seed.scope_tag, 'S3');
assert('urgency inferred as medium', seed.urgency, 'medium');

// ── Test 4: spine_tag override ─────────────────────────────────────────────
console.log('\nTest 4: explicit spine_tag override');
const overridden = classify({ type: 'correction', session: 'S056', source: 'governor_directive', spine_tag: 'ARCH' });
assert('explicit spine_tag ARCH overrides inferred AI', overridden.spine_tag, 'ARCH');

// ── Test 5: router — governor_directive routes to PE_INTAKE ────────────────
console.log('\nTest 5: router — governor_directive → PE_INTAKE');
const govRouted = route(gov);
assert('routes to PE_INTAKE', govRouted.pipelines.includes('PE_INTAKE'), true);
assert('not escalated by default', govRouted.escalated, false);

// ── Test 6: router — high-urgency error escalates to AUDIT_QUEUE ───────────
console.log('\nTest 6: router — error (urgency=high) → AUDIT_QUEUE escalated');
const errRouted = route(err);
assert('routes to AUDIT_QUEUE', errRouted.pipelines.includes('AUDIT_QUEUE'), true);
assert('escalated=true', errRouted.escalated, true);

// ── Test 7: router — core_seed routes to CORE_SEED_REGISTRY ─────────────────
console.log('\nTest 7: router — core_seed → CORE_SEED_REGISTRY');
const seedRouted = route(seed);
assert('routes to CORE_SEED_REGISTRY', seedRouted.pipelines.includes('CORE_SEED_REGISTRY'), true);

// ── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n─── Results: ${passed} passed, ${failed} failed ───`);
if (failed > 0) {
  console.error(`[threshold-classifier-test] FAIL: ${failed} test(s) failed`);
  process.exit(1);
} else {
  console.log('[threshold-classifier-test] PASS: all tests passed');
}
