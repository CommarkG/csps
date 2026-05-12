#!/usr/bin/env node
/**
 * validate-diataxis-type.mjs — Enforces diataxis_type mandatory for pillar-0-governance artifacts
 *
 * The Diátaxis framework (diataxis.fr) categorizes documentation into 4 types:
 *   tutorial    — learning-oriented; step-by-step for beginners
 *   how-to      — task-oriented; achieves a specific goal
 *   reference   — information-oriented; describes the system
 *   explanation — understanding-oriented; clarifies concepts/decisions
 *
 * Every pillar-0-governance .md file must declare which type it is.
 * This enables: navigation clarity, AI context loading (CONCEPT_LOAD spine), coverage audits.
 *
 * BLOCKING: pillar-0-governance .md files missing diataxis_type entirely
 * ADVISORY: diataxis_type present but not a valid enum value
 *
 * Audit slug: diataxis-type
 * PE=67 | S027 mandate
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const PILLAR_DIR = join(ROOT, 'docs/plan/pillar-0-governance');

// Valid diataxis_type values per Diátaxis framework + CSPS usage
const VALID_TYPES = new Set(['tutorial', 'how-to', 'reference', 'explanation']);

// Files exempt from diataxis_type requirement (slice outputs, indices, generated files)
const EXEMPT_PATTERNS = [
  /^audit-runner-index\.yaml$/,
  /\.yaml$/,
  /^README\.md$/,  // index files are structural, not documentation
];

const blocking = [];
const advisories = [];
let checked = 0;

if (!existsSync(PILLAR_DIR)) {
  console.log('[validate-diataxis-type] pillar-0-governance dir not found — skipping');
  console.log('[validate-diataxis-type] checked=0 blocking=0 advisories=0');
  process.exit(0);
}

const files = readdirSync(PILLAR_DIR)
  .filter(f => f.endsWith('.md') || f.endsWith('.yaml'))
  .filter(f => !EXEMPT_PATTERNS.some(p => p.test(f)));

for (const filename of files) {
  const content = readFileSync(join(PILLAR_DIR, filename), 'utf8');

  // Only process files with frontmatter
  if (!content.startsWith('---')) continue;

  const fmEnd = content.indexOf('\n---', 3);
  if (fmEnd < 0) continue;

  const frontmatter = content.slice(0, fmEnd);
  checked++;

  const diataxisMatch = frontmatter.match(/^diataxis_type:\s*(.+)$/m);
  if (!diataxisMatch) {
    blocking.push({
      file: filename,
      issue: `diataxis_type: missing — add one of: tutorial | how-to | reference | explanation`,
    });
    continue;
  }

  const value = diataxisMatch[1].trim();
  if (!VALID_TYPES.has(value)) {
    advisories.push({
      file: filename,
      value,
      issue: `diataxis_type: "${value}" is not a valid enum — valid: tutorial | how-to | reference | explanation`,
    });
  }
}

if (blocking.length > 0) {
  console.error(`⛔ [diataxis-type] ${blocking.length} pillar-0-governance file(s) missing diataxis_type:`);
  blocking.forEach(b => console.error(`  ⛔ ${b.file}: ${b.issue}`));
}

if (advisories.length > 0) {
  advisories.forEach(a => console.log(`  ⚠ [diataxis-type] ${a.file}: ${a.issue}`));
}

if (blocking.length === 0 && advisories.length === 0) {
  console.log('[validate-diataxis-type] all pillar-0-governance artifacts have valid diataxis_type ✓');
}

console.log(`[validate-diataxis-type] checked=${checked} blocking=${blocking.length} advisories=${advisories.length}`);
process.exit(blocking.length > 0 ? 1 : 0);
