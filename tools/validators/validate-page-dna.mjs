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

console.log(`[validate-page-dna] pages_checked=${checked} dna_present=${present} dna_missing=${missing}`);

if (missing > 0) {
  console.warn(`[validate-page-dna] ADVISORY: ${missing} playground page(s) missing DNA block (window.CURRENT_PAGE.dna):`);
  missingList.forEach(f => console.warn(`  → ${f}`));
  console.warn(`  Fix: add dna: { spine: ['GVRN'], pipeline: 'Platform' } to window.CURRENT_PAGE`);
  console.warn(`  Reference: S043-E DNA enforcement`);
}

process.exit(0); // ADVISORY
