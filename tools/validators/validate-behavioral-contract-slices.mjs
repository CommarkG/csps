#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-behavioral-contract-slices
 * @csps-name validate-behavioral-contract-slices
 * @csps-description Phase 7 sync validator — Candidate #2. Verifies that every B_* section
 * header in behavioral-contracts.md has a corresponding slice file at
 * docs/plan/pillar-0-governance/behavioral-contracts/B_NAME.md, and that
 * behavioral-contracts-index.yaml total_count matches the source count.
 * Run `node tools/generators/split-behavioral-contracts.mjs` to regenerate missing slices.
 * Per token-optimization §9.8 Candidate #2 3b + B_SAVINGS_AND_SSOT_UNIFIED + B_TOKEN_BUDGET R1.
 *
 * Exit codes: 0 = all present, 1 = missing slices, 2 = fatal
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT       = resolve(__dirname, '../..');
const SOURCE     = join(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts.md');
const SLICES_DIR = join(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts');
const INDEX_PATH = join(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts-index.yaml');

function extractBNames(text) {
  return [...text.matchAll(/^## (B_[A-Z0-9_]+)/gm)].map(m => m[1]);
}

function extractIndexCount(text) {
  const m = text.match(/total_count:\s*(\d+)/);
  return m ? Number(m[1]) : null;
}

async function main() {
  let sourceText;
  try {
    sourceText = readFileSync(SOURCE, 'utf8');
  } catch (e) {
    console.error(`[validate-behavioral-contract-slices] FATAL: ${e.message}`);
    process.exit(2);
  }

  const names    = extractBNames(sourceText);
  const errors   = [];
  const warnings = [];

  for (const name of names) {
    const p = join(SLICES_DIR, `${name}.md`);
    if (!existsSync(p)) {
      errors.push(`missing slice: docs/plan/pillar-0-governance/behavioral-contracts/${name}.md`);
    }
  }

  try {
    const indexText  = readFileSync(INDEX_PATH, 'utf8');
    const indexCount = extractIndexCount(indexText);
    if (indexCount === null) {
      warnings.push('behavioral-contracts-index.yaml missing total_count');
    } else if (indexCount !== names.length) {
      warnings.push(`index total_count=${indexCount} but source has ${names.length} — run generator to sync`);
    }
  } catch {
    warnings.push('behavioral-contracts-index.yaml not found — run generator to create');
  }

  if (warnings.length > 0) {
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
  }

  const summary = `[validate-behavioral-contract-slices] source_contracts=${names.length} missing=${errors.length} index_ok=${warnings.length === 0}`;

  if (errors.length > 0) {
    console.error(`\n${errors.length} error(s) — run \`node tools/generators/split-behavioral-contracts.mjs\` to fix:`);
    for (const e of errors) console.error(`  ✗ ${e}`);
    console.error(`\n${summary}`);
    process.exit(1);
  }

  console.log(`✓ all ${names.length} behavioral contract slices present`);
  console.log(summary);
  process.exit(0);
}

main().catch(err => { console.error('[validate-behavioral-contract-slices] fatal:', err); process.exit(2); });
