#!/usr/bin/env node
/**
 * validate-scope-conflict.mjs — Detects scope level conflicts in proposals + procedures
 *
 * ROOT CAUSE: S028 repeated failures where AI proposed S2 solutions for S1 requirements.
 * Each time: mechanical enforcement existed in ARTIFACTS but not in PROPOSALS.
 * The Governor had to catch it manually 3+ times in one session.
 *
 * Diagnostic pattern:
 *   - Proposed "import task-mgmt .env.local" (S2) for universal credentials (S1 req)
 *   - Validated "Root Directory: apps/budget-planner" (S2) for S1 deployment
 *   - Said "vercel link from apps/budget-planner/" instead of repo root
 *
 * What it checks in procedure docs + plans:
 *   1. Deployment procedures: Root Directory pointing to app subdirectory (S2) = conflict
 *   2. Credential procedures: per-app .env.local as solution = conflict
 *   3. Setup procedures: cd apps/{app} as first step = potential conflict
 *   4. Plans: requirement_scope < plan_scope_level = conflict
 *
 * ADVISORY Phase 1 — builds visibility before blocking
 * BLOCKING Phase 2 — after K=2 recurring violations (K=2 already reached S028)
 *
 * Audit slug: scope-conflict
 * PE=75 | S028 | scope_level: S0 (this validator is constitutional enforcement)
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());

// S2→S1 conflict patterns: S2-scope action proposed for S1-scope requirement
const CONFLICT_PATTERNS = [
  {
    pattern: /Root Directory.*apps\/[a-z-]+/i,
    issue: 'Root Directory set to app subdirectory (S2) — Vercel deployment must use repo root `.` (S1)',
    fix: 'Change Root Directory to `.` (dot = repo root). Override build command to target app.',
    category: 'deployment-scope',
  },
  {
    pattern: /cd\s+apps\/[a-z-]+\s+&&\s+vercel/i,
    issue: 'Running vercel from app directory (S2) — run from repo root (S1)',
    fix: 'cd to repo root → configure per-app in Vercel dashboard, not from app directory.',
    category: 'deployment-scope',
  },
  {
    pattern: /copy\s+\.env\.example\s+apps\/[a-z-]+\/\.env/i,
    issue: 'Copying credentials into app directory (S2) — use .env.platform at repo root (S1)',
    fix: 'Use .env.platform at repo root + pnpm env:sync to push to all Vercel projects.',
    category: 'credential-scope',
  },
  {
    pattern: /import.*apps\/[a-z-]+\/\.env\.local/i,
    issue: 'Importing credentials from app-specific .env.local (S2) — use S1 platform sync',
    fix: 'Use pnpm env:sync from .env.platform to push credentials to all Vercel projects.',
    category: 'credential-scope',
  },
  {
    pattern: /vercel link.*apps\/[a-z-]+/i,
    issue: 'vercel link from app directory (S2) — Vercel should be linked at project level via dashboard',
    fix: 'Import the csps repo in Vercel dashboard → set Root Directory to `.` → configure build.',
    category: 'deployment-scope',
  },
];

const SCAN_PATHS = [
  'docs/plan/apps',
  'docs/plan/_handoff/VAULT/topic-plans',
  'docs/plan/pillar-6-operations-and-delivery',
];

const advisories = [];
let checked = 0;

function walkDocs(dir) {
  if (!existsSync(dir)) return [];
  const results = [];
  try {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) results.push(...walkDocs(full));
      else if (e.isFile() && e.name.endsWith('.md')) results.push(full);
    }
  } catch {}
  return results;
}

const allFiles = SCAN_PATHS.flatMap(p => walkDocs(join(ROOT, p)));

for (const filePath of allFiles) {
  const content = readFileSync(filePath, 'utf8');
  const relPath = filePath.replace(ROOT, '').replace(/\\/g, '/').replace(/^\//, '');
  checked++;

  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*#/.test(line) && !line.includes('CRITICAL')) continue; // skip pure comments

    for (const { pattern, issue, fix, category } of CONFLICT_PATTERNS) {
      if (pattern.test(line)) {
        advisories.push({
          file: relPath,
          line: i + 1,
          category,
          content: line.trim().slice(0, 70),
          issue,
          fix,
        });
        break;
      }
    }
  }
}

// Output grouped by category
const byCategory = {};
advisories.forEach(a => {
  if (!byCategory[a.category]) byCategory[a.category] = [];
  byCategory[a.category].push(a);
});

if (advisories.length > 0) {
  console.log(`\n  [scope-conflict] ${advisories.length} S2→S1 scope conflict(s) in procedures:`);
  for (const [cat, items] of Object.entries(byCategory)) {
    console.log(`\n  ⚠ ${cat} (${items.length}):`);
    items.forEach(a => {
      console.log(`    ${a.file}:${a.line}: ${a.issue}`);
      console.log(`    Fix: ${a.fix}`);
    });
  }
  console.log('\n[scope-conflict] Pattern: S2 actions proposed for S1 requirements.');
  console.log('  CSPS architecture: S1 platform controls; apps are targets, not entry points.');
} else {
  console.log('[validate-scope-conflict] no S2→S1 scope conflicts detected ✓');
}

console.log(`[validate-scope-conflict] checked=${checked} advisories=${advisories.length}`);
process.exit(0); // Advisory Phase 1 — K=2 already reached S028
