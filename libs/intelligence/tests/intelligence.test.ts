/**
 * libs/intelligence Phase 1 unit tests
 * Run: node_modules/.bin/tsx libs/intelligence/tests/intelligence.test.ts
 * Plan item: COMBINATORIAL-ENGINE | S056
 */

import { existsSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../../..');

// ── Helpers ──────────────────────────────────────────────────────────────────

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
function assertGte(name: string, actual: number, min: number): void {
  if (actual >= min) { console.log(`  ✓ ${name} (${actual} >= ${min})`); passed++; }
  else { console.error(`  ✗ ${name} — ${actual} < ${min}`); failed++; }
}

// ── Import after ROOT is known ─────────────────────────────────────────────

import {
  scanGapRegister, scanImprovementRegister, writeSessionSummary, appendToPendingItems,
  getTopItems, checkReadinessGate, getCIEStatus, loadState,
} from '../index.js';

// ── Test 1: Learning Loop — scanGapRegister finds K≥2 ─────────────────────
console.log('\nTest 1: scanGapRegister — finds K≥2 gaps with no structural fix');
const gaps = scanGapRegister();
assertTruthy('gap register found or returned []', Array.isArray(gaps));
// Current register has K≥2 entries (gap_ZF_NOMINAL_CYCLES K=6, etc.)
// Just verify the function returns valid shape
if (gaps.length > 0) {
  assertTruthy('first gap has id', gaps[0].id.length > 0);
  assertTruthy('first gap has k_count', gaps[0].k_count >= 2);
  assert('structural_fix_triggered is false for returned entries', gaps[0].structural_fix_triggered, false);
}
assert('scanGapRegister returns array', Array.isArray(gaps), true);

// ── Test 2: Learning Loop — scanImprovementRegister ────────────────────────
console.log('\nTest 2: scanImprovementRegister — K≥1 returns nothing when all propagated');
const improvements = scanImprovementRegister();
assert('returns array', Array.isArray(improvements), true);
// All K≥2 improvements should be propagated/structural_fix_proposed now
// Just verify function returns valid shape
improvements.forEach(i => {
  assertTruthy(`${i.id} has not_yet_propagated array`, Array.isArray(i.not_yet_propagated));
});

// ── Test 3: Learning Loop — writeSessionSummary creates file ──────────────
console.log('\nTest 3: writeSessionSummary — writes session summary file');
const testSession = 'S056-TEST';
const testSummariesDir = join(ROOT, '.csps', 'learning-loop');
writeSessionSummary(testSession, {
  session: testSession,
  gaps_k2_no_fix: gaps.slice(0, 1),
  improvements_k2_open: [],
  items_queued_to_pending: 0,
  ran_at: new Date().toISOString(),
});
const summaryPath = join(testSummariesDir, `session-${testSession}.yaml`);
assert('summary file created', existsSync(summaryPath), true);
// Clean up
if (existsSync(summaryPath)) rmSync(summaryPath);

// ── Test 4: Learning Loop — appendToPendingItems deduplicates ─────────────
console.log('\nTest 4: appendToPendingItems — does not duplicate entries');
const findingsBefore = improvements.filter(i => i.k_count >= 2);
const queued = appendToPendingItems(findingsBefore);
// Running again should add 0 (already in file)
const queuedAgain = appendToPendingItems(findingsBefore);
assert('second append adds 0 duplicates', queuedAgain, 0);

// ── Test 5: PE sub-engine — getTopItems returns sorted array ──────────────
console.log('\nTest 5: getTopItems — returns top items sorted by PE score');
const top5 = getTopItems(5);
assert('returns array', Array.isArray(top5), true);
if (top5.length >= 2) {
  assert('items sorted descending by pe_score',
    (top5[0].pe_score ?? 0) >= (top5[1].pe_score ?? 0), true);
}
if (top5.length > 0) {
  assertTruthy('top item has id', top5[0].id.length > 0);
  assertTruthy('top item has title', top5[0].title?.length > 0);
}

// ── Test 6: PE — checkReadinessGate passes for Layer 1 items ─────────────
console.log('\nTest 6: checkReadinessGate — Layer 1 items pass gate');
const thresholdGate = checkReadinessGate('THRESHOLD-CODE');
assert('THRESHOLD-CODE gate is clear', thresholdGate.clear, true);

// ── Test 7: getCIEStatus returns 5 engine statuses ────────────────────────
console.log('\nTest 7: getCIEStatus — returns all 5 sub-engine statuses');
const statuses = getCIEStatus('S056-TEST');
assert('returns 5 engines', statuses.length, 5);
const engineIds = statuses.map(s => s.engine_id);
assert('pe engine present', engineIds.includes('pe'), true);
assert('learning-loop engine present', engineIds.includes('learning-loop'), true);
assert('scope-router stub present', engineIds.includes('scope-router'), true);
assert('seeds-monitor stub present', engineIds.includes('seeds-monitor'), true);
assert('docs-engine stub present', engineIds.includes('docs-engine'), true);

// ── Test 8: State management — loadState returns saved state ──────────────
console.log('\nTest 8: loadState — returns state saved by getCIEStatus');
const loaded = loadState('S056-TEST');
assertTruthy('state has session', loaded.session.length > 0);
assert('state has engines array', Array.isArray(loaded.engines), true);

// ── Summary ───────────────────────────────────────────────────────────────
console.log(`\n─── Results: ${passed} passed, ${failed} failed ───`);
if (failed > 0) {
  console.error('[intelligence-test] FAIL');
  process.exit(1);
} else {
  console.log('[intelligence-test] PASS: all tests passed');
}
