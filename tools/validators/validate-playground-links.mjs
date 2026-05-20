#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-playground-links
 * @csps-name validate-playground-links
 * @csps-description Ratified item VALIDATE-PLAYGROUND-LINKS (S047).
 *   Scans apps/csps-playground/platform/ for subdirectories containing index.html.
 *   Checks that each such path appears as a link in the parent index.html.
 *   T2 BLOCKING: if any directory with index.html is not linked in the parent index.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-enforces P-ARCH-COMPLETE-DEFAULT VALIDATE-PLAYGROUND-LINKS
 *
 * Exit: 1 if any directory with index.html is missing from parent index links.
 */

import { readdirSync, existsSync, readFileSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const PLATFORM_DIR = join(ROOT, 'apps/csps-playground/platform');
const PLATFORM_INDEX = join(PLATFORM_DIR, 'index.html');

if (!existsSync(PLATFORM_DIR)) {
  console.log('[validate-playground-links] platform directory not found — skipping');
  process.exit(0);
}

if (!existsSync(PLATFORM_INDEX)) {
  console.log('[validate-playground-links] platform/index.html not found — skipping');
  process.exit(0);
}

const indexContent = readFileSync(PLATFORM_INDEX, 'utf8');
const subdirs = readdirSync(PLATFORM_DIR).filter(d => {
  const full = join(PLATFORM_DIR, d);
  return statSync(full).isDirectory() && existsSync(join(full, 'index.html'));
});

const missing = subdirs.filter(d => {
  const pattern = new RegExp(`/platform/${d}/`, 'i');
  const pattern2 = new RegExp(`href=["'][^"']*${d}[/"']`, 'i');
  return !pattern.test(indexContent) && !pattern2.test(indexContent);
});

console.log(`[validate-playground-links] found=${subdirs.length} missing=${missing.length}`);

if (missing.length > 0) {
  console.log('[validate-playground-links] BLOCKING: the following platform pages are not linked in index.html:');
  missing.forEach(d => console.log(`  ⛔ /platform/${d}/ — add to apps/csps-playground/platform/index.html`));
  process.exit(1);
}

console.log('[validate-playground-links] ✓ All platform pages are linked');
process.exit(0);
