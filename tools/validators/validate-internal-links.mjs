#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-internal-links
 * @csps-name validate-internal-links
 * @csps-description B_PAGE_COMPLETE Item 3 — All internal hrefs in ALL source files
 *   must resolve to an existing page.tsx. Dead internal links = 404-risk on first click.
 *   Broader than M-47 (which only scans platform page.tsx files):
 *   this scanner covers components/, hooks/, lib/, config/, and any .tsx/.ts file
 *   that contains href= or router.push('/...') calls.
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_PAGE_COMPLETE PROTO-S087-PAGE-COMPLETE MOAT-M47
 * @csps-prevention-class DEAD-INTERNAL-LINK NAV-404
 *
 * run_tier: STANDARD
 * @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at field in last-run JSON).
 *   All blocking decisions are structural/deterministic (file presence checks on href targets).
 *   Not in any blocking decision path.
 *
 * Coverage:
 *   BLOCKING: href="/..." or router.push('/...') pointing to a non-existent page route
 *   ADVISORY: href values that are external (http:// etc.) — not verified here
 *   SKIP: dynamic hrefs with template literals (${...}) — can't verify statically
 *   SKIP: anchor hrefs (#section) — fragment-only
 *
 * Scanned patterns:
 *   href="/" or href='/...' (string literal only — template literals skipped)
 *   href: '...' (object notation in NAV_ITEMS etc.)
 *   router.push('/...')
 *   router.replace('/...')
 */

// @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at, ts fields in last-run JSON). All blocking decisions are structural/deterministic (field presence, count checks, schema conformance). Not in any blocking decision path.

import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const APP_BASE = join(ROOT, 'apps/csps-playground/src/app');
const SRC_BASE = join(ROOT, 'apps/csps-playground/src');
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-internal-links-last-run.json');

// ── File walker ────────────────────────────────────────────────────────────────

function walkSrc(dir, results = []) {
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', 'generated', '__tests__'].includes(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) walkSrc(fullPath, results);
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) results.push(fullPath);
  }
  return results;
}

// ── Check if an internal path resolves to a page ──────────────────────────────

function resolves(href) {
  // Normalize: strip query strings and fragments
  const path = href.split('?')[0].split('#')[0];
  if (!path || path === '/') {
    // Root route
    return existsSync(join(APP_BASE, 'page.tsx'));
  }
  // Check for page.tsx at this path
  const candidate = join(APP_BASE, path.replace(/^\//, ''), 'page.tsx');
  if (existsSync(candidate)) return true;
  // Check if path matches a dynamic route (parent dir has [slug] child)
  // e.g. /platform/sia/my-slug → /platform/sia/[slug]/page.tsx
  const segments = path.replace(/^\//, '').split('/');
  if (segments.length > 1) {
    const parent = join(APP_BASE, segments.slice(0, -1).join('/'));
    if (existsSync(parent)) {
      // Check if any child is a dynamic segment
      try {
        for (const child of readdirSync(parent, { withFileTypes: true })) {
          if (child.isDirectory() && child.name.startsWith('[')) {
            const dynPage = join(parent, child.name, 'page.tsx');
            if (existsSync(dynPage)) return true;
          }
        }
      } catch { /* skip */ }
    }
  }
  return false;
}

// ── Extract internal hrefs from a source file ─────────────────────────────────

function extractInternalLinks(text, filePath) {
  const links = [];
  const relPath = relative(ROOT, filePath).replace(/\\/g, '/');

  // Pattern 1: href="..." or href='...' (JSX attribute, string literal)
  // Excludes template literals (${...}) — can't verify statically
  const hrefJsx = [...text.matchAll(/href=["'](\/?[^"'$`{]+)["']/g)];
  for (const m of hrefJsx) {
    const href = m[1];
    if (href.startsWith('http') || href.startsWith('//') || href.startsWith('#') || href.startsWith('mailto:')) continue;
    if (!href.startsWith('/')) continue; // skip relative-without-slash
    const line = text.slice(0, m.index).split('\n').length;
    links.push({ href, file: relPath, line, source: 'href-attr' });
  }

  // Pattern 2: href: '...' (object property, e.g. NAV_ITEMS)
  const hrefObj = [...text.matchAll(/href:\s*['"](\/?[^"'$`{]+)['"]/g)];
  for (const m of hrefObj) {
    const href = m[1];
    if (href.startsWith('http') || href.startsWith('//') || href.startsWith('#') || href.startsWith('mailto:')) continue;
    if (!href.startsWith('/')) continue;
    const line = text.slice(0, m.index).split('\n').length;
    links.push({ href, file: relPath, line, source: 'href-prop' });
  }

  // Pattern 3: router.push('/...') or router.replace('/...')
  const routerPush = [...text.matchAll(/router\.(push|replace)\(\s*['"](\/?[^"'$`{]+)['"]/g)];
  for (const m of routerPush) {
    const href = m[2];
    if (!href.startsWith('/')) continue;
    if (href.startsWith('http')) continue;
    const line = text.slice(0, m.index).split('\n').length;
    links.push({ href, file: relPath, line, source: `router.${m[1]}` });
  }

  return links;
}

// ── Main ───────────────────────────────────────────────────────────────────────

const files = walkSrc(SRC_BASE);
let blocking = 0;
let advisory = 0;
const deadLinks = [];
const seenHrefs = new Set();

for (const filePath of files) {
  let text;
  try {
    text = readFileSync(filePath, 'utf-8');
  } catch { continue; }

  // Skip single-line commented links
  const lines = text.split('\n').map(l => /^\s*\/\//.test(l) ? '' : l).join('\n');

  const links = extractInternalLinks(lines, filePath);
  for (const link of links) {
    const key = `${link.href}`;
    if (!resolves(link.href)) {
      // Deduplicate same href from different files — count once per href-file combo
      const uniqKey = `${link.file}:${link.href}:${link.line}`;
      if (!seenHrefs.has(uniqKey)) {
        seenHrefs.add(uniqKey);
        deadLinks.push(link);
        blocking++;
      }
    }
  }
}

// ── Output ─────────────────────────────────────────────────────────────────────

const status = blocking > 0 ? 'FAIL' : 'PASS';
console.log(`[validate-internal-links] ${status}`);
console.log(`  files_scanned=${files.length} blocking=${blocking} advisory=${advisory}`);

if (deadLinks.length > 0) {
  console.error('\n[validate-internal-links] BLOCKING — DEAD INTERNAL LINKS:');
  for (const d of deadLinks) {
    console.error(`  ✗ ${d.file}:${d.line}  href="${d.href}"  [via ${d.source}]`);
  }
  console.error('\n  Fix: create the missing page.tsx OR update the href to a valid route');
}

if (status === 'PASS') {
  console.log(`[validate-internal-links] ✓ All internal links resolve`);
}

// Write last-run JSON
try {
  const data = {
    ran_at: new Date().toISOString(),
    status,
    files_scanned: files.length,
    blocking,
    advisory,
    dead_links: deadLinks,
  };
  mkdirSync(dirname(LAST_RUN_PATH), { recursive: true });
  writeFileSync(LAST_RUN_PATH, JSON.stringify(data, null, 2));
} catch {
  // non-fatal
}

process.exit(blocking > 0 ? 1 : 0);
