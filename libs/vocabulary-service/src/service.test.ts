/**
 * @csps-id csps.libs.vocabulary-service.service-test
 * @csps-name vocabulary-service/service-test
 * @csps-description Behavioral tests for two-layer vocabulary lookup.
 * Run: tsx src/service.test.ts
 * Tests the three behavioral guarantees:
 *   (1) App-specific entry overrides global for same misrecognized token
 *   (2) Global entry returned when app has no matching entry
 *   (3) not_found returned when neither layer has the token
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:test domain:behavior-hub audience:developers
 * @csps-enforces B_PLATFORM_FIRST_OPTIMIZATION
 */

import assert from 'node:assert/strict';
import { mkdirSync, rmSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { saveUserVocabulary, saveAppVocabulary } from './store.js';
import { lookup } from './service.js';
import type { UserVocabulary, AppVocabulary } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROFILES_DIR = resolve(__dirname, '../profiles');
const TEST_USER = 'test-user-behavioral';
const TEST_APP = 'test-app';
const TEST_DIR = resolve(PROFILES_DIR, TEST_USER);

// Setup: clean test profiles
if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true });
mkdirSync(TEST_DIR, { recursive: true });

const globalVocab: UserVocabulary = {
  userId: TEST_USER,
  scope: 'global',
  entries: [
    { misrecognized: 'grocery list', intended: 'groceries', confidence: 0.95, frequency: 7, lastUpdated: '2026-05-23T00:00:00Z' },
    { misrecognized: 'global only token', intended: 'globalOnlyResult', confidence: 0.8, frequency: 3, lastUpdated: '2026-05-23T00:00:00Z' },
  ],
};

const appVocab: AppVocabulary = {
  userId: TEST_USER,
  appSlug: TEST_APP,
  scope: 'app',
  entries: [
    { misrecognized: 'grocery list', intended: 'shopping-cart-items', confidence: 0.99, frequency: 12, lastUpdated: '2026-05-23T00:00:00Z' },
  ],
};

saveUserVocabulary(globalVocab);
saveAppVocabulary(appVocab);

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err instanceof Error ? err.message : String(err)}`);
    failed++;
  }
}

console.log('\n@csps/vocabulary-service — behavioral guarantee tests\n');

// Test 1: App-specific entry overrides global for same token
test('app-specific entry overrides global for same misrecognized token', () => {
  const result = lookup(TEST_USER, 'grocery list', TEST_APP);
  assert.equal(result.source, 'app', `Expected source=app, got source=${result.source}`);
  assert.equal(result.intended, 'shopping-cart-items', `Expected 'shopping-cart-items', got '${result.intended}'`);
  assert.ok(result.confidence > 0.9, `Expected high confidence, got ${result.confidence}`);
});

// Test 2: Global entry returned when app has no matching entry
test('global entry returned when app has no matching entry', () => {
  const result = lookup(TEST_USER, 'global only token', TEST_APP);
  assert.equal(result.source, 'global', `Expected source=global, got source=${result.source}`);
  assert.equal(result.intended, 'globalOnlyResult', `Expected 'globalOnlyResult', got '${result.intended}'`);
});

// Test 3: not_found returned when neither layer has the token
test('not_found returned when neither layer has the token', () => {
  const result = lookup(TEST_USER, 'completely unknown token', TEST_APP);
  assert.equal(result.source, 'not_found', `Expected source=not_found, got source=${result.source}`);
  assert.equal(result.confidence, 0, `Expected confidence=0, got ${result.confidence}`);
});

// Test 4: No appSlug → skips app layer, uses global directly
test('global-only lookup (no appSlug) returns global entry', () => {
  const result = lookup(TEST_USER, 'grocery list');
  assert.equal(result.source, 'global', `Expected source=global (no appSlug), got ${result.source}`);
  assert.equal(result.intended, 'groceries', `Expected 'groceries', got '${result.intended}'`);
});

// Cleanup
rmSync(TEST_DIR, { recursive: true });

console.log(`\n${passed + failed} test(s): ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error('\nBehavioral guarantee failures — app-overrides-global contract violated');
  process.exit(1);
}
console.log('app-override: confirmed');
process.exit(0);
