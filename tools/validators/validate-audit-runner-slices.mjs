#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-audit-runner-slices
 * @csps-name validate-audit-runner-slices
 * @csps-description Phase 7 sync validator — Candidate #3. Verifies every ### pipeline section
 * in audit-runner.md has a corresponding slice at docs/plan/pillar-0-governance/audit-runner/pipeline-<slug>.md.
 * Run `node tools/generators/split-audit-runner.mjs` to regenerate.
 * Exit codes: 0 = all present, 1 = missing, 2 = fatal
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT      = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SOURCE    = join(ROOT, 'docs/plan/pillar-0-governance/audit-runner.md');
const SLICES_DIR= join(ROOT, 'docs/plan/pillar-0-governance/audit-runner');
const INDEX_PATH= join(ROOT, 'docs/plan/pillar-0-governance/audit-runner-index.yaml');

function slugify(name) {
  return name.toLowerCase()
    .replace(/\s*\(.*?\)/g, '').trim()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  let src;
  try { src = readFileSync(SOURCE, 'utf8'); } catch (e) {
    console.error(`[validate-audit-runner-slices] FATAL: ${e.message}`); process.exit(2);
  }

  const names    = [...src.matchAll(/^### (.+)$/gm)].map(m => m[1]);
  const errors   = [];
  const warnings = [];

  for (const name of names) {
    const slug = `pipeline-${slugify(name)}`;
    const p = join(SLICES_DIR, `${slug}.md`);
    if (!existsSync(p)) errors.push(`missing: audit-runner/${slug}.md`);
  }

  try {
    const idx = readFileSync(INDEX_PATH, 'utf8');
    const m = idx.match(/total_count:\s*(\d+)/);
    const cnt = m ? Number(m[1]) : null;
    if (cnt === null) warnings.push('audit-runner-index.yaml missing total_count');
    else if (cnt !== names.length) warnings.push(`index total_count=${cnt} but source has ${names.length}`);
  } catch { warnings.push('audit-runner-index.yaml not found — run generator to create'); }

  if (warnings.length > 0) for (const w of warnings) console.warn(`  ⚠ ${w}`);

  const summary = `[validate-audit-runner-slices] source_pipelines=${names.length} missing=${errors.length} index_ok=${warnings.length === 0}`;

  if (errors.length > 0) {
    console.error(`\n${errors.length} error(s) — run \`node tools/generators/split-audit-runner.mjs\` to fix:`);
    for (const e of errors) console.error(`  ✗ ${e}`);
    console.error(`\n${summary}`); process.exit(1);
  }

  console.log(`✓ all ${names.length} audit-runner pipeline slices present`);
  console.log(summary); process.exit(0);
}

main().catch(e => { console.error('[validate-audit-runner-slices] fatal:', e); process.exit(2); });
