#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-ai-behavior-spine-slices
 * @csps-name validate-ai-behavior-spine-slices
 * @csps-description Phase 7 sync validator — Candidate #4. Verifies every ## section in
 * ai-behavior-spine.md has a slice at docs/plan/pillar-0-governance/ai-behavior-spine/<slug>.md.
 * Exit codes: 0 = all present, 1 = missing, 2 = fatal
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT       = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SOURCE     = join(ROOT, 'docs/plan/pillar-0-governance/ai-behavior-spine.md');
const SLICES_DIR = join(ROOT, 'docs/plan/pillar-0-governance/ai-behavior-spine');
const INDEX_PATH = join(ROOT, 'docs/plan/pillar-0-governance/ai-behavior-spine-index.yaml');

function slugify(n) {
  return n.toLowerCase().replace(/\s*\(.*?\)/g,'').trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

async function main() {
  let src; try { src = readFileSync(SOURCE,'utf8'); } catch(e) { console.error(`FATAL: ${e.message}`); process.exit(2); }
  const names = [...src.matchAll(/^## (.+)$/gm)].map(m => m[1]);
  const errors = []; const warnings = [];

  for (const name of names) {
    const p = join(SLICES_DIR, `${slugify(name)}.md`);
    if (!existsSync(p)) errors.push(`missing: ai-behavior-spine/${slugify(name)}.md`);
  }

  try {
    const idx = readFileSync(INDEX_PATH,'utf8');
    const m = idx.match(/total_count:\s*(\d+)/);
    const cnt = m ? Number(m[1]) : null;
    if (!cnt) warnings.push('ai-behavior-spine-index.yaml missing total_count');
    else if (cnt !== names.length) warnings.push(`index total_count=${cnt} but source has ${names.length}`);
  } catch { warnings.push('ai-behavior-spine-index.yaml not found'); }

  if (warnings.length) for (const w of warnings) console.warn(`  ⚠ ${w}`);
  const summary = `[validate-ai-behavior-spine-slices] source_sections=${names.length} missing=${errors.length} index_ok=${!warnings.length}`;

  if (errors.length) {
    console.error(`\n${errors.length} error(s) — run \`node tools/generators/split-ai-behavior-spine.mjs\` to fix:`);
    for (const e of errors) console.error(`  ✗ ${e}`);
    console.error(`\n${summary}`); process.exit(1);
  }
  console.log(`✓ all ${names.length} ai-behavior-spine slices present`);
  console.log(summary); process.exit(0);
}

main().catch(e => { console.error('[validate-ai-behavior-spine-slices] fatal:', e); process.exit(2); });
