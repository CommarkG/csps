// S022 Schema Phase A: batch-stamp domain_path: platform on governed artifacts
// Adds domain_path: platform to any .md/.yaml file with CSPS frontmatter that lacks it.
// Safe: domain_path is OPTIONAL — adding it changes nothing for validators.
// Run once from repo root. Delete after use.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const SCAN_DIRS = [
  'docs/plan',
  'libs/policies',
  '.claude/skills',
];
const EXTENSIONS = ['.md', '.yaml', '.yml'];

let stamped = 0;
let skipped = 0;
let already = 0;

function walk(dir) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const fp = join(dir, e.name);
    if (e.isDirectory()) { walk(fp); continue; }
    if (!EXTENSIONS.some(x => e.name.endsWith(x))) continue;
    processFile(fp);
  }
}

function processFile(fp) {
  let content;
  try { content = readFileSync(fp, 'utf8'); } catch { return; }

  // Must start with frontmatter
  if (!content.startsWith('---')) { skipped++; return; }

  // Find closing ---
  const fmEnd = content.indexOf('\n---', 3);
  if (fmEnd === -1) { skipped++; return; }

  const fmBlock = content.slice(0, fmEnd);
  const rest = content.slice(fmEnd);

  // Already has domain_path
  if (/^\s*domain_path:/m.test(fmBlock)) { already++; return; }

  // Must have id: field (confirms it's a governed CSPS artifact, not a README stub)
  if (!/^\s*id:/m.test(fmBlock)) { skipped++; return; }

  // Insert domain_path: platform before closing ---
  const newContent = fmBlock + '\ndomain_path: platform' + rest;

  try {
    writeFileSync(fp, newContent, 'utf8');
    stamped++;
    if (stamped <= 10 || stamped % 50 === 0) console.log(`  stamped: ${fp.replace(ROOT, '').replace(/\\/g, '/')}`);
  } catch (e) {
    console.error(`  ERROR writing ${fp}: ${e.message}`);
  }
}

for (const d of SCAN_DIRS) walk(join(ROOT, d));

console.log(`\nDone: stamped=${stamped} already=${already} skipped=${skipped}`);
