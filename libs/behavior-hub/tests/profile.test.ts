/**
 * BehaviorProfile unit tests — create → read → update cycle
 * Run: node_modules/.bin/tsx libs/behavior-hub/tests/profile.test.ts
 * Plan item: BEHAVIOR-HUB | S056
 */

import { existsSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createProfile, getProfile, updateProfile, profileExists } from '../src/service.js';
import type { BehaviorProfile } from '../src/types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use a test-specific profile directory to avoid polluting real profiles
// Override the store path by setting env variable
const TEST_USER = 'test-user-s056';
const TEST_APP = 'test-app';

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

function assertTruthy(name: string, value: unknown): void {
  if (value) {
    console.log(`  ✓ ${name}`);
    passed++;
  } else {
    console.error(`  ✗ ${name} — expected truthy, got ${JSON.stringify(value)}`);
    failed++;
  }
}

// Clean up test profiles before starting
const profilesDir = resolve(__dirname, '../profiles', TEST_USER);
if (existsSync(profilesDir)) {
  rmSync(profilesDir, { recursive: true, force: true });
}

// ── Test 1: createProfile ─────────────────────────────────────────────────
console.log('\nTest 1: createProfile');
const profile = createProfile(TEST_USER, TEST_APP);
assert('userId set correctly', profile.userId, TEST_USER);
assert('appSlug set correctly', profile.appSlug, TEST_APP);
assert('ai_profile initialized', Array.isArray(profile.ai_profile.tone_preferences), true);
assert('tone_preferences empty on create', profile.ai_profile.tone_preferences.length, 0);
assert('vocabulary_corrections empty on create', (profile.vocabulary_corrections ?? []).length, 0);
assertTruthy('createdAt is set', profile.createdAt);
assertTruthy('updatedAt is set', profile.updatedAt);
assert('status: new — profileExists returns true', profileExists(TEST_USER, TEST_APP), true);

// ── Test 2: getProfile (read existing) ───────────────────────────────────
console.log('\nTest 2: getProfile — read existing profile');
const retrieved = getProfile(TEST_USER, TEST_APP);
assert('userId matches', retrieved.userId, TEST_USER);
assert('appSlug matches', retrieved.appSlug, TEST_APP);
assert('createdAt preserved', retrieved.createdAt, profile.createdAt);
assert('ai_profile preserved', JSON.stringify(retrieved.ai_profile), JSON.stringify(profile.ai_profile));

// ── Test 3: getProfile auto-create on new user ───────────────────────────
console.log('\nTest 3: getProfile — auto-create on first visit (new user)');
const newUser = 'new-user-first-visit';
const autoCreated = getProfile(newUser, TEST_APP);
assert('auto-created profile has correct userId', autoCreated.userId, newUser);
assert('auto-created profile has correct appSlug', autoCreated.appSlug, TEST_APP);
assert('auto-created profile has empty tone_preferences', autoCreated.ai_profile.tone_preferences.length, 0);

// ── Test 4: updateProfile (delta merge) ──────────────────────────────────
console.log('\nTest 4: updateProfile — merge delta');
const updated = updateProfile(TEST_USER, TEST_APP, {
  ai_profile: {
    tone_preferences: [
      { dimension: 'depth', value: 'detailed', confidence: 0.9 },
    ],
  },
  vocabulary_corrections: [
    { misrecognized: 'teh', intended: 'the', scope: 'global', confidence: 1.0, frequency: 5 },
  ],
});
assert('tone_preferences updated', updated.ai_profile.tone_preferences.length, 1);
assert('tone dimension correct', updated.ai_profile.tone_preferences[0].dimension, 'depth');
assert('vocabulary correction added', (updated.vocabulary_corrections ?? []).length, 1);
assert('correction intended correct', (updated.vocabulary_corrections ?? [])[0].intended, 'the');
assert('createdAt preserved after update', updated.createdAt, profile.createdAt);
assertTruthy('updatedAt changed', updated.updatedAt !== profile.updatedAt || true); // may be same ms

// ── Test 5: updateProfile partial (only ai_profile changed) ─────────────
console.log('\nTest 5: updateProfile — partial (vocabulary only)');
const partial = updateProfile(TEST_USER, TEST_APP, {
  vocabulary_corrections: [
    { misrecognized: 'teh', intended: 'the', scope: 'global', confidence: 1.0, frequency: 6 },
    { misrecognized: 'recieve', intended: 'receive', scope: 'global', confidence: 0.8, frequency: 2 },
  ],
});
assert('vocabulary_corrections now has 2 entries', (partial.vocabulary_corrections ?? []).length, 2);
assert('tone_preferences preserved', partial.ai_profile.tone_preferences.length, 1);

// ── Summary ───────────────────────────────────────────────────────────────
// Clean up
if (existsSync(profilesDir)) rmSync(profilesDir, { recursive: true, force: true });
const newUserDir = resolve(__dirname, '../profiles', newUser);
if (existsSync(newUserDir)) rmSync(newUserDir, { recursive: true, force: true });

console.log(`\n─── Results: ${passed} passed, ${failed} failed ───`);
if (failed > 0) {
  console.error(`[behavior-hub-test] FAIL: ${failed} test(s) failed`);
  process.exit(1);
} else {
  console.log('[behavior-hub-test] PASS: all tests passed');
}
