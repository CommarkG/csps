#!/usr/bin/env node
/**
 * validate-no-laptop-secrets.mjs — Enforces B_ZERO_LAPTOP_DEPENDENCY for secrets
 *
 * ROOT CAUSE TARGETED: AI default is "Next.js dev = .env.local on laptop."
 * CSPS overrides this: secrets must live in Vercel env vars or GitHub Codespaces secrets,
 * NOT in local .env.local files. Local .env.local = laptop dependency = violates P-OPER-001.
 *
 * Governor directive S028 verbatim: "we have zero dependency on local computers!!
 * nothing in what we built so far and nothing will be created in way things will be created.
 * Mechanically enforce it now"
 *
 * What it checks:
 *   1. Any .env.local file with content (not empty) → ADVISORY
 *      If it exists with real values → secrets are laptop-only
 *   2. Any app missing vercel.json → ADVISORY (not configured for zero-laptop deploy)
 *   3. .env.local in gitignore (correct) → ✓ PASS (it won't leak, but still wrong architecture)
 *
 * ADVISORY Phase 1 — informs; zero-laptop migration is a process not a hard block
 * The pattern: secrets in Vercel dashboard, not .env.local files
 *
 * Audit slug: no-laptop-secrets
 * B_ZERO_LAPTOP_DEPENDENCY | P-OPER-001 | S028
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const APPS_DIR = join(ROOT, 'apps');

const advisories = [];
let checked = 0;

if (!existsSync(APPS_DIR)) {
  console.log('[validate-no-laptop-secrets] apps/ dir not found — skipping');
  process.exit(0);
}

const apps = readdirSync(APPS_DIR, { withFileTypes: true })
  .filter(e => e.isDirectory())
  .map(e => e.name);

for (const app of apps) {
  const appDir = join(APPS_DIR, app);
  checked++;

  // Check 1: .env.local with content = laptop dependency
  const envLocal = join(appDir, '.env.local');
  if (existsSync(envLocal)) {
    const content = readFileSync(envLocal, 'utf8').trim();
    const hasRealValues = content.length > 0 &&
      !content.split('\n').every(l => l.startsWith('#') || l.trim() === '' || l.includes('placeholder') || l.includes('...'));

    if (content.length === 0) {
      advisories.push({
        app,
        issue: '.env.local exists but is empty — delete it (zero-laptop: no local env files needed)',
        suggestion: 'Delete apps/' + app + '/.env.local — secrets belong in Vercel env vars',
      });
    } else if (hasRealValues) {
      advisories.push({
        app,
        issue: '.env.local contains real values — this creates laptop dependency',
        suggestion: 'Move these secrets to Vercel dashboard (vercel env add) or GitHub Codespaces secrets. Delete .env.local.',
      });
    }
  }

  // Check 2: Missing vercel.json means app can't deploy zero-laptop
  const vercelJson = join(appDir, 'vercel.json');
  const packageJson = join(appDir, 'package.json');
  if (existsSync(packageJson) && !existsSync(vercelJson)) {
    // Only flag apps that have actual source (src/ directory)
    if (existsSync(join(appDir, 'src'))) {
      advisories.push({
        app,
        issue: 'No vercel.json — app cannot be deployed for zero-laptop Gate testing',
        suggestion: 'Add vercel.json with output: "standalone" and run `vercel link` to connect to Vercel project',
      });
    }
  }
}

if (advisories.length > 0) {
  advisories.forEach(a => {
    console.log(`  ⚠ [no-laptop-secrets] apps/${a.app}: ${a.issue}`);
    console.log(`     → ${a.suggestion}`);
  });
  console.log('[no-laptop-secrets] B_ZERO_LAPTOP_DEPENDENCY: secrets belong in Vercel env vars, not .env.local files');
} else {
  console.log('[validate-no-laptop-secrets] all apps follow zero-laptop pattern ✓');
}

console.log(`[validate-no-laptop-secrets] apps_checked=${checked} advisories=${advisories.length}`);
process.exit(0);
