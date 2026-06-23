#!/usr/bin/env node
/**
 * validate-deploy-root-selfcontained.mjs — CS3 S088-A2
 *
 * PROTO-S088-A2 CS3: Deploy-root self-containment gate.
 *
 * Problem: /api/journey-spine returned spine_doc="fallback" and enums="fallback" in prod
 * because the route reads canonical files at runtime via ../../ paths (fails in Vercel
 * serverless — no parent repo available). Fix: copy-registry.mjs copies canonical files
 * into apps/csps-playground/src/data/ (bundled at build time). This validator ensures:
 *
 *   CHECK 1: src/data/ copies exist for all governed canonical sources
 *   CHECK 2: each copy MATCHES the canonical file exactly (bit-for-bit or content hash)
 *   CHECK 3: no route.ts in the app reads ../../ as a PRIMARY path (must use src/data/ first)
 *
 * BLOCKING: any copy missing, copy diverges from canonical, or ../../ is primary path
 * ADVISORY: if copy-registry.mjs is missing (prebuild script not installed)
 *
 * Behavioral block-test (built-in --block-test mode):
 *   Modifies src/data/journey-core-spine.md to differ from canonical by one byte,
 *   runs itself, confirms exit_code=1 (BLOCKING), then restores original.
 *
 * @csps-id csps.tools.validators.validate-deploy-root-selfcontained
 * @csps-name validate-deploy-root-selfcontained
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces PROTO-S088-A2 CS3
 * @csps-prevention-class DEPLOY-ROOT-DRIFT FALLBACK-SERVING PROD-404
 *
 * Coverage levels:
 *   BLOCKING (exit 1): copy missing or diverges from canonical; ../../ primary path
 *   ADVISORY (exit 0): copy-registry.mjs script missing
 *   PASSES  (exit 0): all copies present, match canonical, no primary ../../ reads
 *
 * run_tier: STANDARD
 * always_rerun: true
 * @determinism-exempt: no clock-based decisions. Reads file content only.
 */

import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execSync, spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const LAST_RUN = join(ROOT, 'tools/data/validate-deploy-root-selfcontained-last-run.json');

// App under test (first entry in .gitmodules with src/data/ path)
const APP_PATH = join(ROOT, 'apps/csps-playground');
const APP_DATA = join(APP_PATH, 'src/data');
const COPY_REGISTRY = join(APP_PATH, 'scripts/copy-registry.mjs');

// Canonical sources → expected copies in src/data/
const GOVERNED_COPIES = [
  {
    canonical: join(ROOT, 'docs/plan/pillar-0-governance/JOURNEY-CORE-SPINE.md'),
    copy: join(APP_DATA, 'journey-core-spine.md'),
    label: 'JOURNEY-CORE-SPINE.md',
    api_route: 'journey-spine',
  },
  {
    canonical: join(ROOT, 'docs/plan/pillar-0-governance/journey-closed-enums.yaml'),
    copy: join(APP_DATA, 'journey-closed-enums.yaml'),
    label: 'journey-closed-enums.yaml',
    api_route: 'journey-spine',
  },
  {
    canonical: join(ROOT, 'tools/config/core-spine-registry.yaml'),
    copy: join(APP_DATA, 'core-spine-registry.yaml'),
    label: 'core-spine-registry.yaml',
    api_route: 'core-spine-registry',
  },
];

let blocking = 0, advisory = 0, passes = 0;
const findings = [];

function PASS(msg)  { passes++;   console.log(`  [PASS] ${msg}`); }
function BLOCK(msg) { blocking++; findings.push(`[BLOCKING] ${msg}`); console.log(`  [BLOCKING] ${msg}`); }
function WARN(msg)  { advisory++; findings.push(`[ADVISORY] ${msg}`); console.log(`  [ADVISORY] ${msg}`); }

function md5(content) {
  return createHash('md5').update(content).digest('hex');
}

// ── Block-test mode ───────────────────────────────────────────────────────────
async function runBlockTest() {
  console.log('[block-test] DEPLOY-ROOT-SELFCONTAINED BLOCK-TEST');

  const firstCopy = GOVERNED_COPIES[0];
  if (!existsSync(firstCopy.canonical) || !existsSync(firstCopy.copy)) {
    console.log('[block-test] SKIP — canonical or copy file not found; run copy-registry.mjs first');
    process.exit(0);
  }

  const originalCopy = readFileSync(firstCopy.copy, 'utf8');

  // Plant defect: append a byte to the copy to make it diverge from canonical
  writeFileSync(firstCopy.copy, originalCopy + '\n<!-- BLOCK-TEST-PLANTED-DEFECT -->');
  console.log(`[block-test] Planted divergence in ${firstCopy.label} copy`);

  const selfPath = fileURLToPath(import.meta.url);
  const result = spawnSync('node', [selfPath], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: 'pipe',
  });

  // Restore immediately
  writeFileSync(firstCopy.copy, originalCopy);

  if (result.status !== 1) {
    console.error(`[block-test] FAIL — expected exit_code=1 with diverged copy, got exit_code=${result.status}`);
    console.error('[block-test] stdout:', result.stdout);
    process.exit(1);
  }

  const hasBlocking = result.stdout.includes('BLOCKING') || result.stdout.includes('blocking=');
  if (!hasBlocking) {
    console.error('[block-test] FAIL — output has no BLOCKING signal');
    process.exit(1);
  }

  console.log('[block-test] PASS — validator correctly blocked on diverged copy');
  console.log('[block-test] Output:', result.stdout.trim().split('\n').slice(-4).join(' | '));
  process.exit(0);
}

if (process.argv.includes('--block-test')) {
  await runBlockTest();
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log('[validate-deploy-root-selfcontained] Deploy-root self-containment gate');
console.log('  BLOCKING: any governed copy missing, diverges from canonical, or app not found');
console.log('');

if (!existsSync(APP_PATH)) {
  BLOCK(`apps/csps-playground not found at ${APP_PATH} — submodule not initialized?`);
  // Can't proceed
  console.log('');
  console.log(`[validate-deploy-root-selfcontained] blocking=${blocking} advisory=${advisory} passes=${passes}`);
  process.exit(1);
}

// ── CHECK 1: copy-registry.mjs exists (prebuild script present) ──────────────
if (!existsSync(COPY_REGISTRY)) {
  WARN('scripts/copy-registry.mjs missing in csps-playground — prebuild copy step not installed');
} else {
  PASS('scripts/copy-registry.mjs exists (prebuild copy step installed)');
}

// ── CHECK 2: each governed copy exists and matches canonical ─────────────────
for (const { canonical, copy, label, api_route } of GOVERNED_COPIES) {
  if (!existsSync(canonical)) {
    BLOCK(`Canonical source missing: ${label} — does the file exist in the parent repo?`);
    continue;
  }
  if (!existsSync(copy)) {
    BLOCK(`${label} copy missing in src/data/ — run: node apps/csps-playground/scripts/copy-registry.mjs. API route /${api_route} will fall back to static constants.`);
    continue;
  }

  const canonicalContent = readFileSync(canonical, 'utf8');
  const copyContent = readFileSync(copy, 'utf8');
  // Normalize line endings for comparison (Windows CRLF vs LF)
  const canonNorm = canonicalContent.replace(/\r\n/g, '\n');
  const copyNorm = copyContent.replace(/\r\n/g, '\n');

  if (canonNorm !== copyNorm) {
    const canonHash = md5(canonNorm);
    const copyHash  = md5(copyNorm);
    BLOCK(`${label} copy DIVERGES from canonical (canonical_hash=${canonHash.slice(0,8)} copy_hash=${copyHash.slice(0,8)}). Run copy-registry.mjs to refresh. API route /${api_route} is serving stale data.`);
  } else {
    PASS(`${label} copy matches canonical (${md5(canonNorm).slice(0,8)})`);
  }
}

// ── CHECK 3: no route reads ../../ as PRIMARY (fallback is OK, primary is not) ─
// Scan app/api route files for ../../ path usage in the first-choice existsSync check.
// Pattern: existsSync(join(cwd, '../../...')) as the ONLY / FIRST try — never as fallback.
// Heuristic: if route.ts has ../../ in existsSync WITHOUT a preceding src/data/ check, flag it.
const API_DIR = join(APP_PATH, 'src/app/api');
if (existsSync(API_DIR)) {
  let routeFiles;
  try {
    const raw = execSync(`git -C "${APP_PATH}" ls-files "src/app/api/**/*.ts" 2>/dev/null || find "${API_DIR}" -name "route.ts"`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    routeFiles = raw.trim().split('\n').filter(Boolean).map(f =>
      f.startsWith('/') ? f : join(APP_PATH, f)
    );
  } catch {
    routeFiles = [];
  }

  let primaryParentPaths = 0;
  for (const rf of routeFiles) {
    if (!existsSync(rf)) continue;
    const content = readFileSync(rf, 'utf8');
    // Look for ../../ paths in existsSync calls that are NOT inside fallback comments
    // Pattern: first existsSync call in a file uses ../../ without src/data/ appearing earlier
    const hasSrcDataFirst = content.indexOf('src/data/') < content.indexOf('../../');
    const hasParentPath = content.includes('../../');
    if (hasParentPath && !hasSrcDataFirst) {
      const relPath = rf.replace(APP_PATH + '/', '');
      BLOCK(`Route ${relPath} reads ../../ WITHOUT a src/data/ primary check — will fail in Vercel prod`);
      primaryParentPaths++;
    }
  }
  if (primaryParentPaths === 0) {
    PASS(`route scan: no primary ../../ paths (all ${routeFiles.length} route(s) use src/data/ first)`);
  }
} else {
  WARN('src/app/api not found — skipping route scan (app structure may differ)');
}

// ── RESULT ────────────────────────────────────────────────────────────────────
console.log('');
console.log(`[validate-deploy-root-selfcontained] blocking=${blocking} advisory=${advisory} passes=${passes}`);

try {
  mkdirSync(join(ROOT, 'tools/data'), { recursive: true });
  writeFileSync(LAST_RUN, JSON.stringify({
    ran_at: new Date().toISOString(),
    blocking, advisory, passes, findings,
    governed_copies_checked: GOVERNED_COPIES.length,
  }, null, 2));
} catch { /* non-fatal */ }

process.exit(blocking > 0 ? 1 : 0);
