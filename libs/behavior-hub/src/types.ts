/**
 * @csps-id csps.libs.behavior-hub.types
 * BehaviorProfile TypeScript types.
 * Design: docs/SIA/PROFILING-HUB-SCHEMA.md
 * Plan item: BEHAVIOR-HUB | S056 | Layer 1 R1 Schema
 * Phase 1: root + AI layer stubs. Phase 2: Human layer + ZModel. Phase 3: AIDefaultOverride.
 */

/** Vocabulary correction entry — bridges to @csps/vocabulary-service */
export interface VocabCorrection {
  misrecognized: string;
  intended: string;
  scope: 'global' | 'app';
  confidence: number;
  frequency: number;
}

/** Tone preference — how the user likes responses styled */
export interface TonePreference {
  dimension: string;
  value: string;
  confidence: number;
}

/** AI Behavior Profile — Phase 1: tone_preferences only. Phase 3 adds overrides. */
export interface AIBehaviorProfile {
  tone_preferences: TonePreference[];
  /** Phase 3 — BLOCKED until ZModel promotion + CE complete */
  ai_default_overrides?: Record<string, unknown>[];
  /** Phase 3 — BLOCKED until ZModel promotion complete */
  satisfaction_thresholds?: Record<string, unknown>;
}

/**
 * Avatar human_profile — PROTO-CIE-1 S059
 * Demographic, psychographic, behavioral, and JTBD dimensions.
 * Design: docs/SIA/AVATAR-SCHEMA.md
 * Phase 2: populated via onboarding + implicit signals.
 */
export interface AvatarHumanProfile {
  demographic?: {
    age_range?: '18-24' | '25-34' | '35-44' | '45-54' | '55+';
    context?: 'private' | 'professional' | 'student' | 'enterprise' | 'freelance';
    primary_language?: string;
    cultural_context?: string;
  };
  psychographic?: {
    motivation?: 'achievement' | 'security' | 'belonging' | 'expression' | 'curiosity';
    decision_style?: 'intuitive' | 'analytical' | 'collaborative' | 'authoritative';
    tech_comfort?: 'basic' | 'regular' | 'advanced' | 'expert';
  };
  behavioral?: {
    usage_frequency?: 'sporadic' | 'weekly' | 'daily' | 'power-user';
    adoption_pattern?: 'early-adopter' | 'pragmatist' | 'conservative' | 'laggard';
    onboarding_preference?: 'guided' | 'self-directed' | 'skip';
  };
  jtbd?: {
    primary_job?: string;
    situation?: string;
    desired_outcome?: string;
  };
}

/**
 * Human Behavior Profile — Phase 2 onwards.
 * Phase 1: empty shell with stubs.
 * Phase 2 EXTENDED with Avatar human_profile (PROTO-CIE-1).
 */
export interface HumanBehaviorProfile {
  /** Phase 2 */
  motivation_patterns?: unknown[];
  /** Phase 2 */
  friction_points?: unknown[];
  /** Phase 2 */
  usage_patterns?: unknown[];
  /** Phase 2 */
  correction_history?: unknown[];
  /** Avatar Phase 2 — structured demographic/psychographic/behavioral/JTBD */
  avatar?: AvatarHumanProfile;
}

/**
 * BehaviorProfile — root object, one per userId × appSlug.
 * Design: docs/SIA/PROFILING-HUB-SCHEMA.md § Core Schema
 * YAML Phase 1 storage: libs/behavior-hub/profiles/{userId}/{appSlug}.yaml
 */
export interface BehaviorProfile {
  userId: string;
  appSlug: string;
  createdAt: string;
  updatedAt: string;
  ai_profile: AIBehaviorProfile;
  human_profile: HumanBehaviorProfile;
  /** Phase 1: vocabulary corrections cached from @csps/vocabulary-service */
  vocabulary_corrections?: VocabCorrection[];
}

/** Partial update — only the fields to merge */
export type BehaviorProfileDelta = Partial<
  Pick<BehaviorProfile, 'ai_profile' | 'human_profile' | 'vocabulary_corrections'>
>;
