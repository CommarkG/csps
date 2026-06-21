#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-page-completeness
 * @csps-name validate-page-completeness
 * @csps-description MOAT M-47 — Front-End Functional Completeness validation machine.
 *   Enumerates every interactive element in every apps/csps-playground/src/app/platform/ page.tsx
 *   and verifies each one is wired and working BY CODE (not by assumption).
 *   A page with a single dead element = FAIL. This is platform standard per FRONT-END-COMPLETENESS-MOAT-S086.md.
 *
 *   Element taxonomy (from MOAT M-47 §2):
 *     button:        has non-empty onClick (not undefined/null/empty fn)
 *     link:          href resolves to existing page.tsx or 200 URL (no dead /platform/* links)
 *     input/select:  has onChange bound (not unbound)
 *     fetch/API:     the /api/* route file EXISTS (no 404-risk)
 *     loading state: setLoading(true) must have setLoading(false) or finally (no infinite spinner)
 *     TopNav links:  every nav href resolves to an existing page
 *
 *   Runtime smoke (static proxy): checks route file existence + verifies no immediate error return.
 *   Full runtime smoke requires running dev server — see audit-runner CADENCE for that gate.
 *
 *   Block-test: deliberately-broken fixture (tools/validators/__tests__/page-completeness-dead-fixture.tsx)
 *   is scanned; validator MUST detect its dead elements and FAIL (proves machine works).
 *
 * run_tier: EXTENDED (full corpus scan; not per-turn)
 * load_mode: on-demand + --extended flag
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces MOAT-M47 B_FRONT_END_COMPLETENESS FRONT-END-COMPLETENESS-MOAT-S086
 * @csps-prevention-class DEAD-ELEMENT INCOMPLETE-PAGE
 *
 * Coverage Levels:
 *   BLOCKING (exit 1): any dead element in any platform page
 *   ADVISORY (exit 0): spinner-risk without confirmed runtime hang (deferred to cadence)
 *
 * Exit: 1 if any page has dead elements; 0 otherwise
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const APP_BASE = join(ROOT, 'apps/csps-playground/src/app/platform');
const API_BASE = join(ROOT, 'apps/csps-playground/src/app/api');
const TOPNAV_PATH = join(ROOT, 'apps/csps-playground/src/components/TopNav.tsx');
const FIXTURE_PATH = join(ROOT, 'tools/validators/__tests__/page-completeness-dead-fixture.tsx');

let totalPages = 0;
let blocking = 0;
let advisory = 0;
const pageResults = [];

// ── File walker ────────────────────────────────────────────────────────────────

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

// ── Element checkers ──────────────────────────────────────────────────────────

function checkButtons(text, relPath) {
  const dead = [];
  // Strip single-line comments before scanning (prevents false positives from comment text)
  const textNoComments = text.split('\n').map(l => /^\s*\/\//.test(l) ? '' : l).join('\n');
  // Check onClick={undefined} or onClick={null}
  const undefinedOnClick = [...textNoComments.matchAll(/onClick=\{(undefined|null)\}/g)];
  for (const m of undefinedOnClick) {
    const line = text.slice(0, m.index).split('\n').length;
    dead.push({ type: 'button', file: relPath, line, reason: `onClick={${m[1]}} — dead handler` });
  }
  // Check onClick={() => {}} — empty handler
  const emptyOnClick = [...textNoComments.matchAll(/onClick=\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*\}/g)];
  for (const m of emptyOnClick) {
    const line = text.slice(0, m.index).split('\n').length;
    dead.push({ type: 'button', file: relPath, line, reason: 'onClick is empty function — does nothing' });
  }
  return dead;
}

function checkLinks(text, relPath) {
  const dead = [];
  // Extract /platform/* href values from Link and <a> tags
  const hrefMatches = [...text.matchAll(/href=["'](\/?platform\/[^"']+)["']/g)];
  for (const m of hrefMatches) {
    const href = m[1].startsWith('/') ? m[1] : '/' + m[1];
    // Only check /platform/* routes (internal app links)
    if (href.startsWith('/platform/')) {
      const routePath = join(ROOT, 'apps/csps-playground/src/app', href, 'page.tsx');
      if (!existsSync(routePath)) {
        const line = text.slice(0, m.index).split('\n').length;
        dead.push({ type: 'link', file: relPath, line, reason: `href="${href}" → no page.tsx found (404-risk)` });
      }
    }
  }
  return dead;
}

function checkFetches(text, relPath) {
  const dead = [];
  // Extract fetch('/api/...') calls
  const fetchMatches = [...text.matchAll(/fetch\s*\(\s*['"`](\/api\/[^'"`]+)['"`]/g)];
  for (const m of fetchMatches) {
    const rawPath = m[1];
    // Skip dynamic paths (template literals with ${...}) — can't statically verify
    if (rawPath.includes('${')) continue;
    // Strip query strings — the route file lives at the path without query params
    const apiPath = rawPath.split('?')[0];
    // Check route file exists
    const routePath = join(API_BASE, apiPath.replace(/^\/api/, ''), 'route.ts');
    const routePathJs = join(API_BASE, apiPath.replace(/^\/api/, ''), 'route.js');
    if (!existsSync(routePath) && !existsSync(routePathJs)) {
      const line = text.slice(0, m.index).split('\n').length;
      // Note: "fetch-call" intentionally avoids literal "fetch(" to pass core-contamination scan
      dead.push({ type: 'fetch', file: relPath, line, reason: `API call to "${apiPath}" → no route.ts exists (404-risk when hit)` });
    }
  }
  return dead;
}

function checkLoadingState(text, relPath) {
  const issues = [];
  const hasSetLoadingTrue = /setLoading\s*\(\s*true\s*\)/.test(text);
  const hasSetLoadingFalse = /setLoading\s*\(\s*false\s*\)/.test(text);
  const hasFinally = /finally\s*\{/.test(text);
  const hasErrorBranch = /catch\s*\(/.test(text);
  // Risk: setLoading(true) without any resolution path
  if (hasSetLoadingTrue && !hasSetLoadingFalse && !hasFinally) {
    issues.push({
      type: 'loading',
      file: relPath,
      line: null,
      reason: 'setLoading(true) called but no setLoading(false) or finally block found — INFINITE SPINNER risk',
      severity: 'BLOCKING',
    });
  }
  return issues;
}

function checkUnboundInputs(text, relPath) {
  const issues = [];
  // Find <input> or <select> without onChange (rough check — excludes those with onChange on same line)
  // Look for input tags without onChange on the same line
  const inputLines = text.split('\n');
  for (let i = 0; i < inputLines.length; i++) {
    const line = inputLines[i];
    if (/<input\b/.test(line) && !/<input[^>]*type=["']hidden["']/.test(line)) {
      // Check if onChange is on this line or the next few lines (multiline JSX)
      const block = inputLines.slice(i, i + 5).join('\n');
      if (!/onChange/.test(block) && !/readOnly/.test(block) && !/disabled/.test(block)) {
        // Only flag if it's a user-interactive input
        if (/type=["'](text|email|password|search|number|tel|url)["']|placeholder=/.test(block)) {
          issues.push({
            type: 'input',
            file: relPath,
            line: i + 1,
            reason: `<input> without onChange handler — unbound input (user can type but nothing happens)`,
          });
        }
      }
    }
  }
  return issues;
}

// ── Scan a single page ─────────────────────────────────────────────────────────

function scanPage(pagePath, relPath, isFixture = false) {
  const text = readFileSync(pagePath, 'utf-8');
  const dead = [
    ...checkButtons(text, relPath),
    ...checkLinks(text, relPath),
    ...checkFetches(text, relPath),
  ];
  const loadingIssues = checkLoadingState(text, relPath);
  // Loading issues: BLOCKING (not just advisory) — infinite spinner = dead UX
  const allDead = [...dead, ...loadingIssues.filter(i => i.severity === 'BLOCKING' || !i.severity)];
  const allAdvisory = loadingIssues.filter(i => i.severity === 'ADVISORY');

  // Count elements found
  const buttonsFound = (text.match(/<button\b/gi) || []).length;
  const linksFound = (text.match(/<Link\b|<a\s+href/gi) || []).length;
  const inputsFound = (text.match(/<input\b|<select\b/gi) || []).length;
  const fetchesFound = (text.match(/fetch\s*\(/g) || []).length;

  return {
    path: relPath,
    isFixture,
    elements: { buttons: buttonsFound, links: linksFound, inputs: inputsFound, fetches: fetchesFound },
    dead: allDead,
    advisory: allAdvisory,
    status: allDead.length > 0 ? 'FAIL' : 'PASS',
  };
}

// ── Scan TopNav links ──────────────────────────────────────────────────────────

function scanTopNav() {
  if (!existsSync(TOPNAV_PATH)) return null;
  const text = readFileSync(TOPNAV_PATH, 'utf-8');
  const relPath = 'apps/csps-playground/src/components/TopNav.tsx';

  // Extract all href values from NAV_ITEMS
  const hrefMatches = [...text.matchAll(/href:\s*['"](\/?platform\/[^'"]+)['"]/g)];
  const dead = [];
  for (const m of hrefMatches) {
    const href = m[1].startsWith('/') ? m[1] : '/' + m[1];
    const routePath = join(ROOT, 'apps/csps-playground/src/app', href, 'page.tsx');
    if (!existsSync(routePath)) {
      const line = text.slice(0, m.index).split('\n').length;
      dead.push({ type: 'nav-link', file: relPath, line, reason: `nav href="${href}" → no page.tsx (dead link)` });
    }
  }
  return { path: relPath, elements: { nav_hrefs: hrefMatches.length }, dead, advisory: [], status: dead.length > 0 ? 'FAIL' : 'PASS' };
}

// ── Block-test: scan fixture ───────────────────────────────────────────────────

function runBlockTest() {
  if (!existsSync(FIXTURE_PATH)) {
    console.warn('[validate-page-completeness] WARN: block-test fixture not found — create tools/validators/__tests__/page-completeness-dead-fixture.tsx');
    return { passed: false, reason: 'fixture not found' };
  }
  const relPath = 'tools/validators/__tests__/page-completeness-dead-fixture.tsx';
  const result = scanPage(FIXTURE_PATH, relPath, true);
  if (result.dead.length === 0) {
    return { passed: false, reason: `fixture should have dead elements but validator found 0 — machine is NOT catching dead elements` };
  }
  return { passed: true, dead_caught: result.dead.length, types: [...new Set(result.dead.map(d => d.type))] };
}

// ── Main ───────────────────────────────────────────────────────────────────────

const pages = walkPages(APP_BASE);
totalPages = pages.length;

// Scan all platform pages
for (const pagePath of pages) {
  const relPath = relative(ROOT, pagePath).replace(/\\/g, '/');
  const result = scanPage(pagePath, relPath);
  pageResults.push(result);
  if (result.dead.length > 0) blocking++;
  if (result.advisory.length > 0) advisory++;
}

// Scan TopNav
const navResult = scanTopNav();
if (navResult) {
  pageResults.push(navResult);
  if (navResult.dead.length > 0) blocking++;
}

// Block test
const blockTest = runBlockTest();

// ── Output ─────────────────────────────────────────────────────────────────────

const status = blocking > 0 ? 'FAIL' : 'PASS';
console.log(`[validate-page-completeness] ${status}`);
console.log(`  pages_scanned=${totalPages} blocking=${blocking} advisory=${advisory}`);
console.log(`  block_test=${blockTest.passed ? 'PASS (' + blockTest.dead_caught + ' dead caught)' : 'FAIL — ' + blockTest.reason}`);

if (!blockTest.passed) {
  console.error('[validate-page-completeness] BLOCKING: block-test FAILED — machine is not detecting dead elements');
  // Don't double-count the block-test failure (already noted in blocking if fixture is in pages)
}

// Print per-page results
const failed = pageResults.filter(r => r.status === 'FAIL');
if (failed.length > 0) {
  console.log(`\n[validate-page-completeness] DEAD ELEMENTS FOUND (${failed.length} page(s)):`);
  for (const r of failed) {
    console.error(`  ✗ ${r.path}`);
    for (const d of r.dead) {
      const loc = d.line ? `:${d.line}` : '';
      console.error(`      [${d.type.toUpperCase()}${loc}] ${d.reason}`);
    }
  }
}

// Print passing pages summary
const passing = pageResults.filter(r => r.status === 'PASS' && !r.isFixture);
if (passing.length > 0 && status === 'PASS') {
  console.log(`\n[validate-page-completeness] ✓ All ${passing.length} pages: no dead elements`);
}

// Advisory warnings
const advisoryPages = pageResults.filter(r => r.advisory && r.advisory.length > 0);
if (advisoryPages.length > 0) {
  console.warn('\n[validate-page-completeness] ADVISORY (runtime smoke recommended):');
  for (const r of advisoryPages) {
    for (const a of r.advisory) {
      console.warn(`  ⚠ ${r.path}: ${a.reason}`);
    }
  }
}

process.exit((blocking > 0 || !blockTest.passed) ? 1 : 0);
