#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-page-dna
 * @csps-name validate-page-dna
 * @csps-description S043-E: scans csps-playground HTML pages for window.CURRENT_PAGE.dna field.
 *   Advisory — pages without DNA block are flagged as incomplete.
 *   DNA block required: { spine, pipeline, completionStatus }.
 *   Reads playground HTML from ../../../csps-playground (sibling directory) or alternate path.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-enforces P-META-020
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// Find playground directory
const PLAYGROUND_PATHS = [
  resolve(ROOT, '../../csps-playground'),
  resolve(ROOT, '../../../csps-playground'),
];

let PLAYGROUND = null;
for (const p of PLAYGROUND_PATHS) {
  if (existsSync(p)) { PLAYGROUND = p; break; }
}

if (!PLAYGROUND) {
  console.log('[validate-page-dna] playground not found — skipping (advisory)');
  process.exit(0);
}

// Scan all platform/ HTML files
function findHtmlFiles(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findHtmlFiles(fullPath));
    } else if (entry.name.endsWith('.html') && entry.name !== 'styles.css') {
      results.push(fullPath);
    }
  }
  return results;
}

const platformDir = join(PLAYGROUND, 'platform');
const htmlFiles = findHtmlFiles(platformDir);

let checked = 0;
let missing = 0;
let present = 0;
const missingList = [];

for (const file of htmlFiles) {
  const content = readFileSync(file, 'utf-8');
  checked++;
  // Check for CURRENT_PAGE.dna or dna: field in CURRENT_PAGE object
  const hasDna = /window\.CURRENT_PAGE\s*=\s*\{[^}]*dna\s*:/.test(content)
    || /CURRENT_PAGE\.dna\s*=/.test(content);
  if (hasDna) {
    present++;
  } else {
    missing++;
    const rel = file.replace(PLAYGROUND, '').replace(/\\/g, '/');
    missingList.push(rel);
  }
}

// S054: Also check apps/csps-playground/src/app/platform/**/*.tsx for export const pageDNA
// Next.js pages use pageDNA export instead of window.CURRENT_PAGE.dna (different mechanism)
const ROOT_REPO = resolve(join(PLAYGROUND, '../../Claude Code/Csps'), '.');
const TSX_SRC = join(PLAYGROUND, '../Claude Code/Csps/apps/csps-playground/src/app/platform');
let tsxChecked = 0;
let tsxPresent = 0;
let tsxMissing = 0;
const tsxMissingList = [];

function scanTsx(dir) {
  if (!existsSync(dir)) return;
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.')) { scanTsx(full); continue; }
      // Only check page.tsx files (not client components, layouts, or util files)
      if (entry.name !== 'page.tsx') continue;
      const content = readFileSync(full, 'utf-8');
      tsxChecked++;
      // Check for 'const pageDNA' OR 'export const pageDNA' — Next.js pages can't use export const
      if (/(?:export\s+)?const\s+pageDNA\s*=/.test(content)) {
        tsxPresent++;
      } else {
        tsxMissing++;
        tsxMissingList.push(full.replace(/.*apps\/csps-playground\//, 'apps/csps-playground/').replace(/\\/g, '/'));
      }
    }
  } catch { /* skip unreadable */ }
}
if (existsSync(TSX_SRC)) scanTsx(TSX_SRC);

console.log(`[validate-page-dna] pages_checked=${checked} dna_present=${present} dna_missing=${missing}`);
console.log(`[validate-page-dna] tsx_checked=${tsxChecked} tsx_dna_present=${tsxPresent} tsx_dna_missing=${tsxMissing}`);

if (missing > 0) {
  console.warn(`[validate-page-dna] ADVISORY: ${missing} static HTML page(s) missing DNA block (window.CURRENT_PAGE.dna):`);
  missingList.slice(0, 5).forEach(f => console.warn(`  → ${f}`));
  if (missingList.length > 5) console.warn(`  ... and ${missingList.length - 5} more`);
  console.warn(`  Fix: add dna: { spine: ['GVRN'], pipeline: 'Platform' } to window.CURRENT_PAGE`);
}

if (tsxMissing > 0) {
  console.warn(`[validate-page-dna] ADVISORY: ${tsxMissing} Next.js page(s) missing pageDNA export:`);
  tsxMissingList.forEach(f => console.warn(`  → ${f}`));
  console.warn(`  Fix: add export const pageDNA = { spine, audience, purpose, inheritsFrom, contextQuestion, cspsApproved, dnaVersion }`);
}

process.exit(0); // ADVISORY
