/**
 * @csps-id csps.libs.behavior-hub.service
 * BehaviorProfile service — create / get / update.
 * Design: docs/SIA/PROFILING-HUB-SCHEMA.md Decision 3 (first-visit profile creation)
 * Plan item: BEHAVIOR-HUB | S056
 */

import type { BehaviorProfile, BehaviorProfileDelta } from './types.js';
import { readProfile, writeProfile, profileExists } from './store.js';
export { profileExists } from './store.js';

function defaultProfile(userId: string, appSlug: string): BehaviorProfile {
  const now = new Date().toISOString();
  return {
    userId,
    appSlug,
    createdAt: now,
    updatedAt: now,
    ai_profile: {
      tone_preferences: [],
    },
    human_profile: {},
    vocabulary_corrections: [],
  };
}

/**
 * Create a new BehaviorProfile for userId × appSlug.
 * Throws if profile already exists (use getProfile to get-or-create).
 */
export function createProfile(userId: string, appSlug: string): BehaviorProfile {
  if (profileExists(userId, appSlug)) {
    throw new Error(`BehaviorProfile already exists: ${userId}/${appSlug}. Use getProfile() instead.`);
  }
  const profile = defaultProfile(userId, appSlug);
  writeProfile(profile);
  return profile;
}

/**
 * Get profile for userId × appSlug.
 * Creates a default profile if one doesn't exist (first-visit creation).
 * Per PROFILING-HUB-SCHEMA.md Decision 3: empty profile is a valid state.
 */
export function getProfile(userId: string, appSlug: string): BehaviorProfile {
  const existing = readProfile(userId, appSlug);
  if (existing) return existing;
  return createProfile(userId, appSlug);
}

/**
 * Merge delta into existing profile.
 * Creates profile first if it doesn't exist.
 * Deep-merges arrays (replaces, does not concatenate).
 */
export function updateProfile(
  userId: string,
  appSlug: string,
  delta: BehaviorProfileDelta,
): BehaviorProfile {
  const existing = getProfile(userId, appSlug);
  const updated: BehaviorProfile = {
    ...existing,
    updatedAt: new Date().toISOString(),
    ai_profile: delta.ai_profile
      ? { ...existing.ai_profile, ...delta.ai_profile }
      : existing.ai_profile,
    human_profile: delta.human_profile
      ? { ...existing.human_profile, ...delta.human_profile }
      : existing.human_profile,
    vocabulary_corrections:
      delta.vocabulary_corrections !== undefined
        ? delta.vocabulary_corrections
        : existing.vocabulary_corrections,
  };
  writeProfile(updated);
  return updated;
}
