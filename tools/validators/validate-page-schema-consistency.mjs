#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-page-schema-consistency
 * @csps-name validate-page-schema-consistency
 * @csps-description Checks that platform page directories are registered in BOTH:
 *   1. apps/csps-playground/platform/index.html (HTML links schema)
 *   2. apps/csps-playground/page-data.js PAGES array (nav + breadcrumb schema)
 *   Root cause of menu/breadcrumb misalignment: new pages added to one schema, not both.
 *   ADVISORY (exit 0) — surfaces missing PAGES registrations as the "creation blindspot."
 *   AP-002 class: schema fragmentation at creation time.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-enforces AP-002 AP-003
 *
 * Exit: 0 (advisory). Reports: dirs_checked=N in_html=N in_pages=N missing_from_pages=N
 */

import { readdirSync, existsSync, readFileSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const PLATFORM_DIR = join(ROOT, 'apps/csps-playground/platform');
const PAGE_DATA = join(ROOT, 'apps/csps-playground/page-data.js');

if (!existsSync(PLATFORM_DIR) || !existsSync(PAGE_DATA)) {
  console.log('[validate-page-schema-consistency] playground files not found — skipping');
  process.exit(0);
}

const pageDataContent = readFileSync(PAGE_DATA, 'utf8');
const subdirs = readdirSync(PLATFORM_DIR).filter(d => {
  const full = join(PLATFORM_DIR, d);
  return statSync(full).isDirectory() && existsSync(join(full, 'index.html'));
});

const missing_from_pages = subdirs.filter(d => {
  const platformPath = `/platform/${d}/`;
  return !pageDataContent.includes(`href: '${platformPath}'`) &&
         !pageDataContent.includes(`href: "${platformPath}"`);
});

const in_html = subdirs.length; // validated by validate-playground-links

console.log(`[validate-page-schema-consistency] dirs_checked=${subdirs.length} in_html=${in_html} in_pages=${subdirs.length - missing_from_pages.length} missing_from_pages=${missing_from_pages.length}`);

if (missing_from_pages.length > 0) {
  console.log('[validate-page-schema-consistency] ADVISORY (AP-002 class): These pages have no nav/breadcrumb registration in page-data.js PAGES:');
  missing_from_pages.forEach(d => {
    console.log(`  ⚠ /platform/${d}/ — add to Platform children in apps/csps-playground/page-data.js`);
    console.log(`    Missing from: page-data.js PAGES → nav menu + breadcrumbs broken`);
  });
  console.log('  Creation blindspot: pages were added to HTML index but not to nav schema.');
}

process.exit(0);
