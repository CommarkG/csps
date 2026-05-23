/**
 * @csps-id csps.libs.vocabulary-service.service
 * @csps-name vocabulary-service/service
 * @csps-description Two-layer vocabulary lookup. App overrides global for same token.
 * Lookup order: AppVocabulary first (domain-specific wins), then UserVocabulary (global fallback).
 * Architecture per PROFILING-HUB-SCHEMA.md Decision 2.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:service domain:behavior-hub audience:developers
 * @csps-enforces B_PLATFORM_FIRST_OPTIMIZATION
 * context_question: Why does app vocabulary take precedence over global vocabulary?
 */

import type { UserVocabulary, AppVocabulary, VocabEntry, VocabLookupResult } from './types.js';
import { loadUserVocabulary, loadAppVocabulary, saveUserVocabulary, saveAppVocabulary } from './store.js';

function findEntry(entries: VocabEntry[], misrecognized: string): VocabEntry | undefined {
  return entries.find(e => e.misrecognized.toLowerCase() === misrecognized.toLowerCase());
}

/**
 * Look up the intended word for a misrecognized token.
 * App-specific vocabulary takes precedence over global (user-level) vocabulary.
 */
export function lookup(
  userId: string,
  misrecognized: string,
  appSlug?: string
): VocabLookupResult {
  // Layer 1: app-specific vocabulary (highest precedence)
  if (appSlug) {
    const appVocab = loadAppVocabulary(userId, appSlug);
    if (appVocab) {
      const entry = findEntry(appVocab.entries, misrecognized);
      if (entry) {
        return { intended: entry.intended, confidence: entry.confidence, source: 'app' };
      }
    }
  }

  // Layer 2: global user vocabulary (fallback)
  const userVocab = loadUserVocabulary(userId);
  if (userVocab) {
    const entry = findEntry(userVocab.entries, misrecognized);
    if (entry) {
      return { intended: entry.intended, confidence: entry.confidence, source: 'global' };
    }
  }

  return { intended: misrecognized, confidence: 0, source: 'not_found' };
}

/**
 * Record a correction. Updates the appropriate vocabulary layer and increments frequency.
 */
export function recordCorrection(
  userId: string,
  misrecognized: string,
  intended: string,
  appSlug?: string
): void {
  const now = new Date().toISOString();

  if (appSlug) {
    let appVocab = loadAppVocabulary(userId, appSlug) ?? {
      userId, appSlug, scope: 'app' as const, entries: [],
    };
    const existing = findEntry(appVocab.entries, misrecognized);
    if (existing) {
      existing.intended = intended;
      existing.frequency += 1;
      existing.confidence = Math.min(0.99, 0.5 + existing.frequency * 0.05);
      existing.lastUpdated = now;
    } else {
      appVocab.entries.push({ misrecognized, intended, confidence: 0.5, frequency: 1, lastUpdated: now });
    }
    saveAppVocabulary(appVocab as AppVocabulary);
    return;
  }

  let userVocab = loadUserVocabulary(userId) ?? {
    userId, scope: 'global' as const, entries: [],
  };
  const existing = findEntry(userVocab.entries, misrecognized);
  if (existing) {
    existing.intended = intended;
    existing.frequency += 1;
    existing.confidence = Math.min(0.99, 0.5 + existing.frequency * 0.05);
    existing.lastUpdated = now;
  } else {
    userVocab.entries.push({ misrecognized, intended, confidence: 0.5, frequency: 1, lastUpdated: now });
  }
  saveUserVocabulary(userVocab as UserVocabulary);
}
