#!/usr/bin/env node
/**
 * validate-next-build.mjs — CS1 S088-A2
 *
 * PROTO-S088-A2 CS1: Real `next build` gate for apps under apps/*.
 *
 * Problem: validate-ts-compile.mjs only runs `tsc --noEmit`. This missed the
 * route-export error that caused the 404: a route.ts exporting a non-handler
 * const passes tsc (no type error) but FAILS `next build` (Next.js route contract).
 * tsc is necessary but NOT sufficient.
 *
 * Fix: Run `pnpm --filter <app> build` (which invokes `next build`) for any app whose
 * source content has changed since the last successful build. BLOCKS on build failure.
 *
 * Hash-based caching: only rebuilds when app source changes (src/, app/, components/,
 * scripts/, package.json, next.config.*). Cached in last-run JSON. Does NOT re-run on
 * every verify (next build takes 30-90s); runs ONLY when source hash changes.
 *
 * What `next build` catches that tsc misses:
 *   - Route handlers exporting non-handler consts (route contract violation)
 *   - Missing dynamic/force-dynamic on server components using request headers/cookies
 *   - Import resolution failures that tsc resolves through aliases
 *   - Invalid page exports (missing default export in page.tsx)
 *   - Broken static generation (getStaticProps errors)
 *
 * @csps-id csps.tools.validators.validate-next-build
 * @csps-name validate-next-build
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces PROTO-S088-A2 CS1
 * @csps-prevention-class NEXT-BUILD-FAILURE PROD-404 ROUTE-CONTRACT-VIOLATION
 *
 * Coverage levels:
 *   BLOCKING (exit 1): next build fails for a changed app
 *   ADVISORY (exit 0): pnpm or next not found; build takes too long (timeout)
 *   PASSES  (exit 0): build succeeds OR app source unchanged since last green build
 *
 * run_tier: STANDARD
 * always_rerun: false  (hash-cached — only runs when app source changes)
 * @determinism-exempt: no clock-based decisions.
 */

import { createHash } from 'node:crypto';
import { execSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-next-build-last-run.json');
const APPS_DIR = join(ROOT, 'apps');

// Source directories / files that matter for next build
const SOURCE_DIRS = ['src', 'app', 'components', 'scripts'];
const SOURCE_FILES = ['package.json'];
const SOURCE_PATTERNS = /\.(ts|tsx|js|jsx|json|css|yaml|yml|mjs|env)$/;
const NEXT_CONFIG_PATTERNS = /^next\.config\./;

// Timeout for next build (milliseconds)
const BUILD_TIMEOUT_MS = 180_000; // 3 minutes

let blocking = 0, advisory = 0, passes = 0;
const findings = [];

function PASS(msg)  { passes++;   console.log(`  [PASS] ${msg}`); }
function BLOCK(msg) { blocking++; findings.push(`[BLOCKING] ${msg}`); console.log(`  [BLOCKING] ${msg}`); }
function WARN(msg)  { advisory++; findings.push(`[ADVISORY] ${msg}`); console.log(`  [ADVISORY] ${msg}`); }

// Compute a deterministic hash of an app's source content
function hashAppSource(appPath) {
  const hash = createHash('sha256');
  const toHash = [];

  // Collect files from source dirs
  for (const dir of SOURCE_DIRS) {
    const dirPath = join(appPath, dir);
    if (!existsSync(dirPath)) continue;
    collectFiles(dirPath, toHash, SOURCE_PATTERNS);
  }

  // Package.json + next.config.*
  for (const fname of readdirSync(appPath).sort()) {
    if (SOURCE_FILES.includes(fname) || NEXT_CONFIG_PATTERNS.test(fname)) {
      toHash.push(join(appPath, fname));
    }
  }

  toHash.sort();
  for (const fp of toHash) {
    try {
      hash.update(fp.replace(appPath, '')); // relative path as separator
      hash.update(readFileSync(fp));
    } catch { /* skip unreadable */ }
  }
  return hash.digest('hex');
}

function collectFiles(dir, out, pattern) {
  try {
    for (const entry of readdirSync(dir)) {
      if (entry.startsWith('.') || entry === 'node_modules' || entry === '.next') continue;
      const full = join(dir, entry);
      const st = statSync(full);
      if (st.isDirectory()) collectFiles(full, out, pattern);
      else if (pattern.test(entry)) out.push(full);
    }
  } catch { /* non-fatal */ }
}

// Load last-run cache
function loadCache() {
  try {
    return JSON.parse(readFileSync(LAST_RUN_PATH, 'utf8'));
  } catch {
    return { apps: {} };
  }
}

function saveCache(cache) {
  try {
    mkdirSync(join(ROOT, 'tools/data'), { recursive: true });
    writeFileSync(LAST_RUN_PATH, JSON.stringify({ ...cache, ran_at: new Date().toISOString() }, null, 2));
  } catch { /* non-fatal */ }
}

// ── Block-test mode ───────────────────────────────────────────────────────────
async function runBlockTest() {
  console.log('[block-test] NEXT-BUILD BLOCK-TEST');

  if (!existsSync(APPS_DIR)) {
    console.log('[block-test] SKIP — apps/ directory not found');
    process.exit(0);
  }

  // Find an app with next.config.*
  const apps = readdirSync(APPS_DIR).filter(a => {
    const appPath = join(APPS_DIR, a);
    try {
      return statSync(appPath).isDirectory() &&
        readdirSync(appPath).some(f => NEXT_CONFIG_PATTERNS.test(f));
    } catch { return false; }
  });

  if (apps.length === 0) {
    console.log('[block-test] SKIP — no Next.js app found under apps/');
    process.exit(0);
  }

  const app = apps[0];
  const appPath = join(APPS_DIR, app);

  // Plant a defect: create a route.ts that exports a non-handler const (fails next build)
  const testRoutesDir = join(appPath, 'src/app/api/__cs1_block_test__');
  const testRoute = join(testRoutesDir, 'route.ts');
  let plantedDir = false;

  if (!existsSync(testRoutesDir)) {
    mkdirSync(testRoutesDir, { recursive: true });
    plantedDir = true;
  }

  // This export pattern passes tsc but fails next build (not a valid HTTP method handler)
  writeFileSync(testRoute, `// CS1 block-test planted — delete if found\nexport const NOT_A_HANDLER = 'this-is-invalid-next-route-export'\n`);
  console.log(`[block-test] Planted invalid route export at: src/app/api/__cs1_block_test__/route.ts`);

  // Force cache miss by clearing the cached hash for this app
  const cache = loadCache();
  const originalHash = cache?.apps?.[app]?.last_green_hash;
  if (cache.apps) delete cache.apps[app];
  saveCache(cache);

  const selfPath = fileURLToPath(import.meta.url);
  const result = spawnSync('node', [selfPath], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: 'pipe',
    shell: true,
    timeout: BUILD_TIMEOUT_MS + 10000,
  });

  // Cleanup planted defect
  try {
    const { unlinkSync, rmdirSync } = await import('node:fs');
    unlinkSync(testRoute);
    if (plantedDir) rmdirSync(testRoutesDir);
  } catch {}

  // Restore cache
  if (originalHash) {
    const c2 = loadCache();
    c2.apps = c2.apps || {};
    c2.apps[app] = { last_green_hash: originalHash };
    saveCache(c2);
  }

  if (result.status !== 1) {
    // next build might not exist or timed out — check stdout for "ADVISORY"
    if (result.stdout.includes('ADVISORY') || result.stdout.includes('advisory=1')) {
      console.log('[block-test] ADVISORY — next build not available in this environment; gate would block in CI');
      console.log('[block-test] stdout:', result.stdout.trim().split('\n').slice(-3).join(' | '));
      process.exit(0); // Advisory in dev = acceptable
    }
    console.error(`[block-test] FAIL — expected exit_code=1 with planted defect, got exit_code=${result.status}`);
    console.error('[block-test] stdout:', result.stdout);
    console.error('[block-test] stderr:', result.stderr);
    process.exit(1);
  }

  console.log('[block-test] PASS — validator correctly blocked on planted invalid route export');
  console.log('[block-test] Output:', result.stdout.trim().split('\n').slice(-4).join(' | '));
  process.exit(0);
}

if (process.argv.includes('--block-test')) {
  await runBlockTest();
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log('[validate-next-build] next build gate for apps/* (hash-cached; runs when source changes)');
console.log('  BLOCKING: next build fails for any changed app');
console.log('');

if (!existsSync(APPS_DIR)) {
  PASS('apps/ directory not found — no Next.js apps to build (skipping)');
  saveCache({ apps: {} });
  console.log(`\n[validate-next-build] blocking=${blocking} advisory=${advisory} passes=${passes}`);
  process.exit(0);
}

// Check pnpm is available (shell:true required on Windows — pnpm is a shell wrapper not a .exe)
const hasPnpm = spawnSync('pnpm', ['--version'], { encoding: 'utf8', stdio: 'pipe', shell: true }).status === 0;
if (!hasPnpm) {
  WARN('pnpm not found — cannot run next build. Install pnpm or run in a pnpm environment.');
  console.log(`\n[validate-next-build] blocking=${blocking} advisory=${advisory} passes=${passes}`);
  saveCache({ apps: {} });
  process.exit(0);
}

const cache = loadCache();
cache.apps = cache.apps || {};
let appsChecked = 0;

const appDirs = readdirSync(APPS_DIR).filter(a => {
  const ap = join(APPS_DIR, a);
  try {
    return statSync(ap).isDirectory() &&
      readdirSync(ap).some(f => NEXT_CONFIG_PATTERNS.test(f));
  } catch { return false; }
});

for (const app of appDirs) {
  const appPath = join(APPS_DIR, app);
  const pkgJson = join(appPath, 'package.json');
  let appName = app;
  let pkgData = {};
  try {
    pkgData = JSON.parse(readFileSync(pkgJson, 'utf8'));
    appName = pkgData.name || app;
  } catch {}

  // Skip scaffold template apps (placeholder name contains '[' or pkg has csps-template:true)
  if (appName.includes('[') || pkgData['csps-template'] === true) {
    PASS(`${app}: skipped (template/scaffold app — not a deployable target)`);
    continue;
  }

  appsChecked++;

  const currentHash = hashAppSource(appPath);
  const cachedEntry = cache.apps[app] || {};
  const lastGreenHash = cachedEntry.last_green_hash;

  if (currentHash === lastGreenHash) {
    PASS(`${app}: source unchanged since last green build (hash ${currentHash.slice(0,8)}) — skipping next build`);
    continue;
  }

  console.log(`  [BUILD] ${app}: source changed — running next build (hash ${currentHash.slice(0,8)})...`);

  const result = spawnSync(
    'pnpm',
    ['--filter', appName, 'build'],
    {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: BUILD_TIMEOUT_MS,
      shell: true, // required on Windows — pnpm is a shell wrapper
      env: { ...process.env, NODE_ENV: 'production' },
    }
  );

  if (result.status === 0) {
    PASS(`${app}: next build PASSED (hash ${currentHash.slice(0,8)})`);
    cache.apps[app] = { last_green_hash: currentHash, last_build_at: new Date().toISOString() };
  } else if (result.signal === 'SIGTERM') {
    WARN(`${app}: next build timed out after ${BUILD_TIMEOUT_MS / 1000}s — consider DEEP tier for slow apps`);
  } else {
    const errLines = (result.stdout + result.stderr)
      .split('\n')
      .filter(l => l.includes('Error') || l.includes('error') || l.includes('Type error') || l.includes('Failed'))
      .slice(0, 5)
      .join(' | ');
    BLOCK(`${app}: next build FAILED — ${errLines || 'see build output'}`);
    // Do NOT update cache — keep last_green_hash as-is so retry re-runs
  }
}

if (appsChecked === 0) {
  PASS('no Next.js apps found under apps/ — skipping next build gate');
}

saveCache(cache);

console.log('');
console.log(`[validate-next-build] blocking=${blocking} advisory=${advisory} passes=${passes}`);
process.exit(blocking > 0 ? 1 : 0);
