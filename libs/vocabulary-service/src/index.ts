/**
 * @csps-id csps.libs.vocabulary-service.index
 * @csps-name vocabulary-service/index
 * @csps-description @csps/vocabulary-service — BEHAVIOR-HUB Phase 1 public API.
 * All 30 CSPS apps import this. Never reimplemented per-app (B_PLATFORM_FIRST_OPTIMIZATION).
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:service domain:behavior-hub audience:developers
 * @csps-enforces B_PLATFORM_FIRST_OPTIMIZATION B_APPS_ARE_TRIALS
 * context_question: What is the contract this package provides and what must never be reimplemented per-app?
 */

export type { VocabEntry, UserVocabulary, AppVocabulary, VocabLookupResult } from './types.js';
export { lookup, recordCorrection } from './service.js';
export { loadUserVocabulary, loadAppVocabulary, saveUserVocabulary, saveAppVocabulary } from './store.js';
