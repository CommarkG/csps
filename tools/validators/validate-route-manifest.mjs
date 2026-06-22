#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-route-manifest
 * @csps-name validate-route-manifest
 * @csps-description B_PAGE_COMPLETE Item 1 — Every page.tsx in csps-playground must be
 *   registered in route-manifest.ts. Unregistered pages are orphans and cannot ship.
 *   Orphan = page.tsx exists on disk but has no route-manifest.ts entry.
 *   Enforcement: BLOCKING (exit 1) on any orphan. ADVISORY on intentional-orphan pages
 *   (nav_access='internal') and manifest entries with no page.tsx (planned routes).
 *
 *   Prevent-by-construction: you cannot commit a new page.tsx without a manifest entry.
 *   validate-route-manifest.mjs is the backstop; the manifest IS the gate.
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_PAGE_COMPLETE PROTO-S087-PAGE-COMPLETE
 * @csps-prevention-class ORPHAN-PAGE NAV-GAP
 *
 * run_tier: STANDARD
 * @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at field in last-run JSON).
 *   All blocking decisions are structural/deterministic (file presence + manifest registration checks).
 *   Not in any blocking decision path.
 *
 * Coverage:
 *   BLOCKING: page.tsx exists but has no manifest entry (true orphan)
 *   ADVISORY: manifest entry has no page.tsx (planned route — ok to plan ahead)
 *   ADVISORY: page with nav_access='internal' (known intentional orphan — explicitly registered)
 *
 * Block-test: a test orphan page is created at fixture path → validator must FAIL → path removed → PASS.
 *   (RED→GREEN tested in PROTO-S087-PAGE-COMPLETE build verification)
 */

// @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at, ts fields in last-run JSON). All blocking decisions are structural/deterministic (field presence, count checks, schema conformance). Not in any blocking decision path.

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const APP_BASE = join(ROOT, 'apps/csps-playground/src/app');
const MANIFEST_PATH = join(ROOT, 'apps/csps-playground/src/config/route-manifest.ts');
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-route-manifest-last-run.json');

// ── Parse route-manifest.ts paths ─────────────────────────────────────────────
// Read the manifest as text and extract path: '...' values
// (avoids TypeScript runtime dependency)

function parseManifestPaths() {
  if (!existsSync(MANIFEST_PATH)) {
    return { found: false, paths: [] };
  }
  const text = readFileSync(MANIFEST_PATH, 'utf-8');
  // Match path: '...' or path: "..."
  const matches = [...text.matchAll(/path:\s*['"]([^'"]+)['"]/g)];
  return {
    found: true,
    paths: matches.map(m => m[1]),
  };
}

// ── Walk page.tsx files ────────────────────────────────────────────────────────

function walkPages(dir, results = []) {
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', 'generated'].includes(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) walkPages(fullPath, results);
    else if (entry.name === 'page.tsx') results.push(fullPath);
  }
  return results;
}

// ── Derive route path from file path ──────────────────────────────────────────

function filePathToRoute(pagePath) {
  // Convert: apps/csps-playground/src/app/platform/foo/page.tsx → /platform/foo
  // Convert: apps/csps-playground/src/app/page.tsx → /
  const rel = relative(APP_BASE, pagePath).replace(/\\/g, '/');
  // Remove trailing /page.tsx
  const withoutPage = rel.replace(/\/page\.tsx$/, '').replace(/^page\.tsx$/, '');
  if (!withoutPage) return '/';
  // Dynamic segments: (group) → strip; [param] → keep as-is; [[...param]] → keep as-is
  const cleaned = withoutPage
    .split('/')
    .filter(seg => !seg.startsWith('(') || !seg.endsWith(')')) // strip route groups
    .join('/');
  return '/' + cleaned;
}

// ── Normalize manifest path for comparison ─────────────────────────────────────
// Some manifest paths use [slug] notation; file system uses [slug] directory names
// We compare them directly after deriving from filesystem.

// ── Main ───────────────────────────────────────────────────────────────────────

const { found: manifestFound, paths: manifestPaths } = parseManifestPaths();

if (!manifestFound) {
  console.error('[validate-route-manifest] BLOCKING: route-manifest.ts not found at', MANIFEST_PATH);
  process.exit(1);
}

const manifestSet = new Set(manifestPaths);
const pages = walkPages(APP_BASE);

let blocking = 0;
let advisory = 0;
const orphans = [];      // page.tsx exists but not in manifest
const internals = [];    // page.tsx in manifest with nav_access='internal'
const planned = [];      // manifest entry without page.tsx

// Check each page.tsx
for (const pagePath of pages) {
  const route = filePathToRoute(pagePath);
  if (!manifestSet.has(route)) {
    orphans.push({ route, file: relative(ROOT, pagePath).replace(/\\/g, '/') });
    blocking++;
  }
}

// Read manifest text to identify internal routes
const manifestText = existsSync(MANIFEST_PATH) ? readFileSync(MANIFEST_PATH, 'utf-8') : '';

// Check for planned routes (in manifest but no page.tsx)
for (const manifestPath of manifestPaths) {
  // Skip dynamic routes — they won't have a literal page.tsx at exact path
  if (manifestPath.includes('[')) continue;
  // Derive expected page.tsx path
  const expectedFile = manifestPath === '/'
    ? join(APP_BASE, 'page.tsx')
    : join(APP_BASE, manifestPath.replace(/^\//, ''), 'page.tsx');
  if (!existsSync(expectedFile)) {
    planned.push({ route: manifestPath, expected: relative(ROOT, expectedFile).replace(/\\/g, '/') });
    advisory++;
  }
}

// Advisory: count internal (intentionally-orphaned) entries
// (not a problem but worth reporting)
const internalMatches = [...manifestText.matchAll(/nav_access:\s*['"]internal['"]/g)];
const internalCount = internalMatches.length;

// ── Output ─────────────────────────────────────────────────────────────────────

const status = blocking > 0 ? 'FAIL' : 'PASS';
console.log(`[validate-route-manifest] ${status}`);
console.log(`  pages_found=${pages.length} manifest_entries=${manifestPaths.length} blocking=${blocking} advisory=${advisory}`);
console.log(`  orphans=${orphans.length} planned=${planned.length} internal_registered=${internalCount}`);

if (orphans.length > 0) {
  console.error('\n[validate-route-manifest] BLOCKING — UNREGISTERED PAGES (add to route-manifest.ts):');
  for (const o of orphans) {
    console.error(`  ✗ ${o.route}  ←  ${o.file}`);
  }
  console.error('\n  Fix: add entry to apps/csps-playground/src/config/route-manifest.ts');
}

if (planned.length > 0) {
  console.warn('\n[validate-route-manifest] ADVISORY — manifest entries with no page.tsx (planned routes):');
  for (const p of planned) {
    console.warn(`  ⚠ ${p.route}  (expected: ${p.expected})`);
  }
}

if (internalCount > 0 && status === 'PASS') {
  console.log(`\n[validate-route-manifest] ℹ ${internalCount} internal route(s) registered (nav_access='internal') — known intentional orphans`);
}

if (status === 'PASS') {
  console.log(`[validate-route-manifest] ✓ All ${pages.length} pages registered in route-manifest.ts`);
}

// Write last-run JSON
try {
  const data = {
    ran_at: new Date().toISOString(),
    status,
    pages_found: pages.length,
    manifest_entries: manifestPaths.length,
    blocking,
    advisory,
    orphans,
    planned,
    internal_registered: internalCount,
  };
  mkdirSync(dirname(LAST_RUN_PATH), { recursive: true });
  writeFileSync(LAST_RUN_PATH, JSON.stringify(data, null, 2));
} catch {
  // non-fatal
}

process.exit(blocking > 0 ? 1 : 0);
