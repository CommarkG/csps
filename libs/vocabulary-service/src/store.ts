/**
 * @csps-id csps.libs.vocabulary-service.store
 * @csps-name vocabulary-service/store
 * @csps-description YAML profile read/write for UserVocabulary + AppVocabulary.
 * Phase 1: YAML files only. Phase 2: ZModel/Prisma (blocked on DB infrastructure).
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:service domain:behavior-hub audience:developers
 * @csps-enforces B_PLATFORM_FIRST_OPTIMIZATION
 * context_question: Why is store.ts YAML-only in Phase 1?
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { UserVocabulary, AppVocabulary, VocabEntry } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROFILES_DIR = resolve(__dirname, '../profiles');

function profilePath(userId: string, appSlug?: string): string {
  const userDir = resolve(PROFILES_DIR, userId);
  return appSlug
    ? resolve(userDir, `${appSlug}.yaml`)
    : resolve(userDir, 'vocabulary.yaml');
}

function parseSimpleYaml(text: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = text.split('\n');
  let inEntries = false;
  let current: Record<string, unknown> = {};
  const entries: VocabEntry[] = [];

  for (const line of lines) {
    if (line.startsWith('  - ') || (inEntries && line.startsWith('    '))) {
      inEntries = true;
      const trimmed = line.trimStart();
      if (trimmed.startsWith('- ')) {
        if (Object.keys(current).length > 0) entries.push(current as unknown as VocabEntry);
        current = {};
        const [key, ...rest] = trimmed.slice(2).split(':');
        if (key && rest.length) current[key.trim()] = parseValue(rest.join(':').trim());
      } else {
        const colonIdx = trimmed.indexOf(':');
        if (colonIdx > 0) {
          const key = trimmed.slice(0, colonIdx).trim();
          const val = trimmed.slice(colonIdx + 1).trim();
          current[key] = parseValue(val);
        }
      }
    } else if (line.startsWith('entries:')) {
      inEntries = true;
    } else if (!line.startsWith(' ') && line.includes(':')) {
      inEntries = false;
      if (Object.keys(current).length > 0) { entries.push(current as unknown as VocabEntry); current = {}; }
      const colonIdx = line.indexOf(':');
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim();
      if (key !== 'entries') result[key] = parseValue(val);
    }
  }
  if (Object.keys(current).length > 0) entries.push(current as unknown as VocabEntry);
  if (entries.length > 0) result['entries'] = entries;
  return result;
}

function parseValue(v: string): string | number | boolean {
  const s = v.replace(/^["']|["']$/g, '');
  if (s === 'true') return true;
  if (s === 'false') return false;
  const n = Number(s);
  if (!isNaN(n) && s !== '') return n;
  return s;
}

function serializeYaml(vocab: UserVocabulary | AppVocabulary): string {
  const isApp = vocab.scope === 'app';
  const header = [
    `userId: "${vocab.userId}"`,
    isApp ? `appSlug: "${(vocab as AppVocabulary).appSlug}"` : null,
    `scope: "${vocab.scope}"`,
    'entries:',
  ].filter(Boolean).join('\n');

  const entryLines = vocab.entries.map(e => [
    `  - misrecognized: "${e.misrecognized}"`,
    `    intended: "${e.intended}"`,
    `    confidence: ${e.confidence}`,
    `    frequency: ${e.frequency}`,
    `    lastUpdated: "${e.lastUpdated}"`,
  ].join('\n')).join('\n');

  return header + (vocab.entries.length ? '\n' + entryLines : '') + '\n';
}

export function loadUserVocabulary(userId: string): UserVocabulary | null {
  const path = profilePath(userId);
  if (!existsSync(path)) return null;
  const parsed = parseSimpleYaml(readFileSync(path, 'utf-8'));
  return {
    userId: String(parsed['userId'] ?? userId),
    scope: 'global',
    entries: (parsed['entries'] as unknown as VocabEntry[]) ?? [],
  };
}

export function loadAppVocabulary(userId: string, appSlug: string): AppVocabulary | null {
  const path = profilePath(userId, appSlug);
  if (!existsSync(path)) return null;
  const parsed = parseSimpleYaml(readFileSync(path, 'utf-8'));
  return {
    userId: String(parsed['userId'] ?? userId),
    appSlug: String(parsed['appSlug'] ?? appSlug),
    scope: 'app',
    entries: (parsed['entries'] as unknown as VocabEntry[]) ?? [],
  };
}

export function saveUserVocabulary(vocab: UserVocabulary): void {
  const path = profilePath(vocab.userId);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, serializeYaml(vocab), 'utf-8');
}

export function saveAppVocabulary(vocab: AppVocabulary): void {
  const path = profilePath(vocab.userId, vocab.appSlug);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, serializeYaml(vocab), 'utf-8');
}
