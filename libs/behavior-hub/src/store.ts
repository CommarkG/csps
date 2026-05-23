/**
 * @csps-id csps.libs.behavior-hub.store
 * YAML profile read/write — Phase 1 (no DB).
 * Phase 2: ZModel/Prisma promotion (blocked on DB infrastructure).
 * Design: docs/SIA/PROFILING-HUB-SCHEMA.md Decision 1 (YAML Phase 1)
 * Plan item: BEHAVIOR-HUB | S056
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BehaviorProfile } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROFILES_DIR = resolve(__dirname, '../profiles');

function profilePath(userId: string, appSlug: string): string {
  return join(PROFILES_DIR, userId, `${appSlug}.yaml`);
}

function ensureDir(filePath: string): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

/** Minimal YAML serializer for BehaviorProfile — avoids adding yaml dep */
function toYaml(profile: BehaviorProfile): string {
  return JSON.stringify(profile, null, 2)
    .replace(/^{/, '')
    .replace(/}$/, '')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

/** Minimal YAML parser — BehaviorProfile is JSON-compatible, parse as JSON */
function fromYaml(text: string): BehaviorProfile {
  // Phase 1 profiles are stored as JSON-in-YAML (valid YAML superset)
  const clean = text.trim();
  if (clean.startsWith('{')) return JSON.parse(clean) as BehaviorProfile;
  // Wrap stripped JSON back into object
  return JSON.parse(`{${clean}}`) as BehaviorProfile;
}

export function readProfile(userId: string, appSlug: string): BehaviorProfile | null {
  const path = profilePath(userId, appSlug);
  if (!existsSync(path)) return null;
  return fromYaml(readFileSync(path, 'utf-8'));
}

export function writeProfile(profile: BehaviorProfile): void {
  const path = profilePath(profile.userId, profile.appSlug);
  ensureDir(path);
  writeFileSync(path, toYaml(profile), 'utf-8');
}

export function profileExists(userId: string, appSlug: string): boolean {
  return existsSync(profilePath(userId, appSlug));
}
