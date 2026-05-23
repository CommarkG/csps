/**
 * @csps-id csps.libs.behavior-hub
 * @csps-name behavior-hub
 * @csps-description Per-user behavioral intelligence hub. YAML Phase 1 — no DB required.
 * createProfile / getProfile / updateProfile + BehaviorProfile types.
 * Phase 2: ZModel/Prisma promotion (blocked on Supabase DB provision).
 * Phase 3: AIDefaultOverride + CE integration (blocked on Phase 2).
 * Design: docs/SIA/PROFILING-HUB-SCHEMA.md
 * Plan item: BEHAVIOR-HUB | S056 | Layer 1 R1 Schema
 * @csps-version 0.1.0
 * @csps-owner group:finky
 * @csps-lifecycle experimental
 * @csps-lifecycle-state active
 * @csps-tags type:library domain:behavior-hub audience:platform
 */

export { createProfile, getProfile, updateProfile } from './service.js';
export { readProfile, writeProfile, profileExists } from './store.js';
export type {
  BehaviorProfile,
  BehaviorProfileDelta,
  AIBehaviorProfile,
  HumanBehaviorProfile,
  TonePreference,
  VocabCorrection,
} from './types.js';
