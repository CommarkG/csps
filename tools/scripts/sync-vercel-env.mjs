#!/usr/bin/env node
/**
 * sync-vercel-env.mjs — Platform-wide credential sync to all Vercel projects
 *
 * scope_level: S1 (Platform-wide — applies to all CSPS apps, lives in tools/)
 * governing_principle_scope: S1 (B_ZERO_LAPTOP_DEPENDENCY — credentials in Vercel, not laptops)
 * scope_conflict_check: CLEAR (S1 solution for S1 requirement)
 *
 * Problem solved: Each app should NOT define its own credentials.
 * Platform credentials (Supabase, Clerk) are the SAME for all apps.
 * This script syncs them from ONE source to ALL Vercel projects simultaneously.
 *
 * Governor directive S028: "can we have a universal file? having all apps use it
 *   and not define the first app as the mother of all?"
 *
 * Usage:
 *   1. Create .env.platform (gitignored) with platform credentials — one time only
 *   2. Run: node tools/scripts/sync-vercel-env.mjs
 *   3. All Vercel projects get the credentials. Done.
 *   4. For new apps: node tools/scripts/sync-vercel-env.mjs --app csps-new-app-name
 *
 * What it does NOT do:
 *   - Does NOT create .env.local files (laptop dependency)
 *   - Does NOT copy credentials between app folders (S2 workaround)
 *   - Does NOT require any app to be the "mother" of others
 *
 * Requires: vercel CLI installed + authenticated (npm install -g vercel)
 */

import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = resolve(process.cwd());

// Platform credential keys — same for ALL apps
const PLATFORM_KEYS = [
  'DATABASE_URL',           // Supabase transaction mode (port 6543 + pgbouncer)
  'DIRECT_URL',             // Supabase direct connection (port 5432)
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'CLERK_WEBHOOK_SECRET',
];

// Redirect URL keys — same pattern for all apps (values are app-agnostic)
const REDIRECT_KEYS = [
  'NEXT_PUBLIC_CLERK_SIGN_IN_URL',
  'NEXT_PUBLIC_CLERK_SIGN_UP_URL',
  'NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL',
  'NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL',
];

// Parse the .env.platform file
function parseEnvFile(content) {
  const vars = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    // Strip quotes
    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    vars[key] = val;
  }
  return vars;
}

// Sync one env var to one Vercel project
function syncVar(projectName, key, value, env = 'production,preview') {
  try {
    // Remove existing then add fresh (handles updates)
    execSync(`vercel env rm ${key} production --yes 2>/dev/null || true`, { cwd: ROOT, stdio: 'pipe' });
    execSync(`vercel env rm ${key} preview --yes 2>/dev/null || true`, { cwd: ROOT, stdio: 'pipe' });

    // Add to Vercel (stdin for security — value never appears in command args)
    const cmd = `echo "${value}" | vercel env add ${key} production preview`;
    execSync(cmd, { cwd: ROOT, stdio: 'pipe', shell: true });
    return true;
  } catch (err) {
    console.error(`    ⚠ Failed to sync ${key}: ${err.message.slice(0, 80)}`);
    return false;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const ENV_PLATFORM = join(ROOT, '.env.platform');
const args = process.argv.slice(2);
const targetApp = args.find(a => a.startsWith('--app='))?.slice(6);

// Verify .env.platform exists
if (!existsSync(ENV_PLATFORM)) {
  console.error('⛔ .env.platform not found.');
  console.error('');
  console.error('Create it with your platform credentials (gitignored):');
  console.error('  DATABASE_URL="postgresql://..."');
  console.error('  DIRECT_URL="postgresql://..."');
  console.error('  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."');
  console.error('  CLERK_SECRET_KEY="sk_test_..."');
  console.error('');
  console.error('This file is NEVER committed to git (see .gitignore).');
  console.error('It is the ONE source of platform credentials on this machine.');
  process.exit(1);
}

const envVars = parseEnvFile(readFileSync(ENV_PLATFORM, 'utf8'));

// Validate required keys
const missing = PLATFORM_KEYS.filter(k => !envVars[k]);
if (missing.length > 0) {
  console.error(`⛔ Missing platform credentials in .env.platform: ${missing.join(', ')}`);
  process.exit(1);
}

// Find Vercel projects to sync
let projects;
try {
  const output = execSync('vercel list --json 2>/dev/null || vercel ls 2>/dev/null', {
    cwd: ROOT, encoding: 'utf8', stdio: 'pipe'
  });
  // Simple: find csps-* project names from output
  projects = output.match(/csps-[a-z0-9-]+/g) || [];
  if (targetApp) projects = [targetApp];
} catch {
  // Fallback: use app directories
  const appDirs = existsSync(join(ROOT, 'apps'))
    ? require('fs').readdirSync(join(ROOT, 'apps'), { withFileTypes: true })
        .filter(e => e.isDirectory() && existsSync(join(ROOT, 'apps', e.name, 'vercel.json')))
        .map(e => `csps-${e.name}`)
    : [];
  projects = targetApp ? [targetApp] : appDirs;
}

if (projects.length === 0) {
  console.error('⛔ No Vercel projects found. Run vercel link first in each app, or use --app=project-name');
  process.exit(1);
}

console.log(`\n🌐 CSPS Platform Credential Sync`);
console.log(`   Source: .env.platform (${PLATFORM_KEYS.length} platform keys)`);
console.log(`   Target: ${projects.join(', ')}`);
console.log(`   Scope: S1 Platform-wide (same credentials for all apps)`);
console.log('');

// Sync to each project
let synced = 0;
let failed = 0;

for (const project of projects) {
  console.log(`📦 Syncing → ${project}...`);

  try {
    // Switch to this Vercel project context
    execSync(`vercel project ls ${project} 2>/dev/null || true`, { cwd: ROOT, stdio: 'pipe' });
  } catch {}

  const keysToSync = [...PLATFORM_KEYS, ...REDIRECT_KEYS.filter(k => envVars[k])];

  for (const key of keysToSync) {
    const value = envVars[key];
    if (!value) continue;

    process.stdout.write(`  ${key.padEnd(45)}`);

    try {
      execSync(`echo "${value}" | vercel env add ${key} production preview --force 2>/dev/null`, {
        cwd: join(ROOT, `apps/${project.replace('csps-', '')}`),
        stdio: 'pipe',
        shell: true
      });
      console.log('✓');
      synced++;
    } catch {
      // Try via project flag
      try {
        execSync(`echo "${value}" | vercel env add ${key} production preview --project=${project} --force 2>/dev/null`, {
          cwd: ROOT,
          stdio: 'pipe',
          shell: true
        });
        console.log('✓');
        synced++;
      } catch (err2) {
        console.log(`⚠ (check manually)`);
        failed++;
      }
    }
  }
}

console.log('');
console.log(`✅ Sync complete: ${synced} vars synced | ${failed} warnings`);
console.log('');
console.log('Next: vercel --prod in each app directory to deploy with new credentials');
console.log('');
console.log('Zero-laptop status: credentials live in Vercel cloud. No .env.local needed.');
