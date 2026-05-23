/**
 * @csps-id csps.libs.vocabulary-service.types
 * @csps-name vocabulary-service/types
 * @csps-description BEHAVIOR-HUB Phase 1 — two-layer vocabulary type definitions.
 * UserVocabulary (global, cross-app) + AppVocabulary (per-app silo).
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:schema domain:behavior-hub audience:developers
 * @csps-enforces B_PLATFORM_FIRST_OPTIMIZATION
 * context_question: What is the key architectural decision that separates global from app vocabulary?
 */

export interface VocabEntry {
  misrecognized: string  // what was heard by STT
  intended: string       // what the user meant
  confidence: number     // 0.0–1.0, derived from correction frequency
  frequency: number      // number of times this correction occurred
  lastUpdated: string    // ISO 8601 timestamp
}

export interface UserVocabulary {
  userId: string
  scope: 'global'
  entries: VocabEntry[]
}

export interface AppVocabulary {
  userId: string
  appSlug: string        // isolation key — corrections stay in this silo
  scope: 'app'
  entries: VocabEntry[]
}

export interface VocabLookupResult {
  intended: string
  confidence: number
  source: 'app' | 'global' | 'not_found'
}
