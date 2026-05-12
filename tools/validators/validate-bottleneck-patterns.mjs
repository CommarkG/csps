#!/usr/bin/env node
/**
 * validate-bottleneck-patterns.mjs — Detects structural bottlenecks before they become crises
 *
 * ROOT CAUSE TARGETED: AI implements for current scale without projecting to 30×.
 * N+1 queries "fine for now." O(N) validators "fast enough today." Scale problems
 * invisible until they become crises. (bottleneck-and-gradual-structures-S019.md §1)
 *
 * Three bottleneck classes checked:
 *
 * Class A — Query Bottlenecks (per-request cost)
 *   N+1 query patterns in API routes: findUnique({where: clerkId}) immediately
 *   followed by a second DB call (getEnhancedDb / enhance() / edb.). This means
 *   every API request makes 2+ queries when 1 would suffice.
 *   At 30 apps × 1,000 tenants × 100 concurrent users → O(N²) problem.
 *
 * Class B — Validator Runtime Bottlenecks (per-commit cost)
 *   O(N) file-walkers in validators: readdirSync with recursion, walkForSeeds,
 *   glob patterns across entire repo. At 30 apps, pnpm verify degrades from 30s to 300s.
 *   Identify but do not fix — report for human review.
 *
 * Class C — Missing index on tenant_id join columns (structural, per-query cost)
 *   ZModel entities accessed via tenant_id without @@index([tenantId]) annotation.
 *   Every tenant-scoped query becomes a full table scan at scale.
 *
 * All findings are ADVISORY (exit 0) — report patterns; suggest alternatives.
 * Phase 2 (S029): BLOCKING for new N+1 patterns added to already-indexed routes.
 *
 * Spec: bottleneck-and-gradual-structures-S019.md §1
 * Audit slug: bottleneck-patterns
 * PE=65 | S027 mandate
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';

const ROOT = resolve(process.cwd());
const APPS_DIR = join(ROOT, 'apps');
const VALIDATORS_DIR = join(ROOT, 'tools/validators');

const advisories = [];
let classA_checked = 0;
let classB_checked = 0;
let classC_checked = 0;

// ─── Class A: N+1 Query Pattern Detection ────────────────────────────────────

function walkForApiRoutes(dir) {
  if (!existsSync(dir)) return [];
  const results = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkForApiRoutes(fullPath));
    } else if (entry.isFile() && (entry.name === 'route.ts' || entry.name === 'route.tsx')) {
      results.push(fullPath);
    }
  }
  return results;
}

// Pattern: auth lookup (findUnique by clerkId/userId) followed closely by DB call
const N1_PATTERNS = [
  // findUnique for user auth + immediate DB call
  { name: 'findUnique-then-enhance', regex: /findUnique\s*\(\s*\{[^}]*clerkId/s, followup: /getEnhancedDb|enhance\(|edb\./s },
  // Prisma direct access + RLS bypass risk
  { name: 'raw-prisma-in-route', regex: /new PrismaClient|import \{ PrismaClient \}/, followup: null },
];

if (existsSync(APPS_DIR)) {
  const appDirs = readdirSync(APPS_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);

  for (const appName of appDirs) {
    const apiDir = join(APPS_DIR, appName, 'src/app/api');
    const routes = walkForApiRoutes(apiDir);

    for (const routePath of routes) {
      classA_checked++;
      const content = readFileSync(routePath, 'utf8');
      const relPath = routePath.replace(ROOT, '').replace(/^[/\\]/, '').replace(/\\/g, '/');

      for (const pattern of N1_PATTERNS) {
        if (!pattern.regex.test(content)) continue;
        if (pattern.followup && !pattern.followup.test(content)) continue;

        if (pattern.name === 'findUnique-then-enhance') {
          // Check if auth lookup and enhanced DB call are close together (within 20 lines)
          const lines = content.split('\n');
          let authLineIdx = -1;
          for (let i = 0; i < lines.length; i++) {
            if (/findUnique.*clerkId|findUnique.*userId/.test(lines[i])) {
              authLineIdx = i;
            }
            if (authLineIdx >= 0 && /getEnhancedDb|enhance\(|const edb/.test(lines[i])) {
              const distance = i - authLineIdx;
              if (distance >= 0 && distance <= 25) {
                advisories.push({
                  class: 'A',
                  file: relPath,
                  line: i + 1,
                  pattern: 'N+1 query: auth lookup + DB call',
                  issue: `Line ${authLineIdx + 1}-${i + 1}: findUnique(clerkId) immediately followed by getEnhancedDb. Consider session-claim pattern: cache tenantId in JWT claim to eliminate the auth lookup query per request. At 100 req/s × 30 apps = 3,000 extra DB queries/s.`,
                  suggestion: 'Use Clerk JWT session claim for tenantId (libs/auth/session-claim.ts) — eliminates the DB auth lookup entirely.',
                });
                authLineIdx = -1; // reset to avoid duplicate
                break;
              }
            }
          }
        }

        if (pattern.name === 'raw-prisma-in-route') {
          advisories.push({
            class: 'A',
            file: relPath,
            pattern: 'Raw PrismaClient in API route',
            issue: `PrismaClient instantiated in route — bypasses RLS (ZenStack enhance). Every tenant sees all data. Use getEnhancedDb() from @/lib/db.`,
            suggestion: 'Replace new PrismaClient() with import { getEnhancedDb } from "@/lib/db"',
          });
        }
      }
    }
  }
}

// ─── Class B: O(N) Validator Runtime Bottleneck Detection ────────────────────

const ON_PATTERNS = [
  // Recursive directory walk without cache
  /readdirSync\([^)]+,\s*\{[^}]*recursive/,
  // walkForSeeds-style recursion
  /function\s+walk\w*\([^)]*dir/,
  // globSync on whole repo
  /globSync\s*\([^)]*\*\*[^)]*\)/,
];

if (existsSync(VALIDATORS_DIR)) {
  const validatorFiles = readdirSync(VALIDATORS_DIR)
    .filter(f => f.endsWith('.mjs') && f !== 'validate-bottleneck-patterns.mjs');

  for (const vf of validatorFiles) {
    classB_checked++;
    const content = readFileSync(join(VALIDATORS_DIR, vf), 'utf8');
    const lineCount = content.split('\n').length;

    // Check for multi-level recursive walk (potential O(N²) at 30 apps)
    let recursiveWalkCount = 0;
    for (const pat of ON_PATTERNS) {
      if (pat.test(content)) recursiveWalkCount++;
    }

    if (recursiveWalkCount >= 2) {
      advisories.push({
        class: 'B',
        file: `tools/validators/${vf}`,
        pattern: 'O(N) recursive file walker',
        issue: `${vf}: ${recursiveWalkCount} recursive walk patterns detected. At 30 apps, this will scale super-linearly. Estimated pnpm verify impact: +2-5s per validator at 30 apps.`,
        suggestion: 'Add a manifest-based approach: pre-compute the file list from a gitignore-aware glob at startup rather than recursive readdirSync at every validator run.',
      });
    }
  }
}

// ─── Class C: Missing tenant_id index on ZModel entities ─────────────────────

const SCHEMA_DIR = join(ROOT, 'packages/database');

function findZModelFiles(dir) {
  if (!existsSync(dir)) return [];
  const results = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.includes('node_modules')) {
      results.push(...findZModelFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.zmodel')) {
      results.push(full);
    }
  }
  return results;
}

const zmodelFiles = findZModelFiles(SCHEMA_DIR);
for (const zf of zmodelFiles) {
  classC_checked++;
  const content = readFileSync(zf, 'utf8');
  const relPath = zf.replace(ROOT, '').replace(/^[/\\]/, '').replace(/\\/g, '/');

  // Find model blocks that have tenantId but no @@index on tenantId
  const modelBlocks = content.matchAll(/model\s+(\w+)\s*\{([^}]+)\}/gs);
  for (const [_, modelName, body] of modelBlocks) {
    const hasTenantId = /tenantId/.test(body);
    const hasIndex = /@@index\s*\(\s*\[\s*tenantId/.test(body);

    if (hasTenantId && !hasIndex) {
      advisories.push({
        class: 'C',
        file: relPath,
        pattern: `Missing @@index([tenantId]) on model ${modelName}`,
        issue: `Model ${modelName} has tenantId but no @@index([tenantId]). Every tenant-scoped query is a full table scan. At 1M rows per tenant × 100 tenants = 100M row scans per query.`,
        suggestion: `Add @@index([tenantId]) to model ${modelName} in ${relPath}.`,
      });
    }
  }
}

// ─── Output ───────────────────────────────────────────────────────────────────

const byClass = { A: [], B: [], C: [] };
advisories.forEach(a => byClass[a.class].push(a));

if (advisories.length > 0) {
  if (byClass.A.length > 0) {
    console.log(`\n  [Class A — Query Bottlenecks] ${byClass.A.length} pattern(s):`);
    byClass.A.slice(0, 3).forEach(a => {
      console.log(`  ⚠ ${a.file}: ${a.pattern}`);
      console.log(`     → ${a.issue}`);
      console.log(`     Suggestion: ${a.suggestion}`);
    });
    if (byClass.A.length > 3) console.log(`  ... and ${byClass.A.length - 3} more Class A`);
  }
  if (byClass.B.length > 0) {
    console.log(`\n  [Class B — Validator Runtime] ${byClass.B.length} pattern(s):`);
    byClass.B.slice(0, 3).forEach(b => {
      console.log(`  ⚠ ${b.file}: ${b.pattern}`);
      console.log(`     → ${b.issue}`);
    });
  }
  if (byClass.C.length > 0) {
    console.log(`\n  [Class C — Missing Tenant Index] ${byClass.C.length} pattern(s):`);
    byClass.C.slice(0, 3).forEach(c => {
      console.log(`  ⚠ ${c.file}: ${c.pattern}`);
      console.log(`     → ${c.issue}`);
    });
    if (byClass.C.length > 3) console.log(`  ... and ${byClass.C.length - 3} more Class C`);
  }
  console.log('\n[validate-bottleneck-patterns] scale-projection: "At 30 apps × 1,000 tenants — what is the O() complexity? What breaks at 10× current load?"');
} else {
  console.log('[validate-bottleneck-patterns] no bottleneck patterns detected ✓');
}

console.log(`[validate-bottleneck-patterns] routes_checked=${classA_checked} validators_checked=${classB_checked} models_checked=${classC_checked} advisories=${advisories.length}`);
process.exit(0); // advisory
