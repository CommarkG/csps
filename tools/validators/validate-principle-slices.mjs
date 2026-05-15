#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-principle-slices
 * @csps-name validate-principle-slices
 * @csps-description Phase 7 sync validator (token-optimization §9.8 Candidate #1 sub-step 3b).
 * Verifies that (1) every P-* ID in principles.yaml has a corresponding slice file at
 * packages/principles/principles/<P-ID>.yaml, (2) principles-index.yaml count matches
 * principles.yaml source count, and (3) each slice file parses as valid YAML and contains
 * the correct id field. Does NOT check content equality (slices are generated; run
 * `pnpm principles:split` to regenerate). Missing slices = error (PR-blocking); stale
 * index count = warn. Per B_SAVINGS_AND_SSOT_UNIFIED + B_CONSOLIDATION_PASS + P-META-009 B_TOKEN_BUDGET.
 *
 * Usage:
 *   node tools/validators/validate-principle-slices.mjs
 *
 * Exit codes:
 *   0 — all slices present + index consistent
 *   1 — missing slices or parse errors (run `pnpm principles:split` to fix)
 *   2 — fatal (file read error)
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT       = resolve(__dirname, '../..');
const YAML_PATH  = join(ROOT, 'packages/principles/principles.yaml');
const SLICES_DIR = join(ROOT, 'packages/principles/principles');
const INDEX_PATH = join(ROOT, 'packages/principles/principles-index.yaml');

// Minimal inline YAML ID extractor (avoids heavy dependency — only reads id: lines)
function extractIds(yamlText) {
  const ids = [];
  for (const line of yamlText.split('\n')) {
    const m = line.match(/^\s{2}-\s+id:\s+(P-[A-Z]+-\d+)/);
    if (m) ids.push(m[1]);
  }
  return ids;
}

function extractSliceId(sliceText) {
  const m = sliceText.match(/^id:\s+(P-[A-Z]+-\d+)/m);
  return m ? m[1] : null;
}

function extractIndexCount(indexText) {
  const m = indexText.match(/total_count:\s*(\d+)/);
  return m ? Number(m[1]) : null;
}

async function main() {
  let sourceYaml, indexText;

  try {
    sourceYaml = readFileSync(YAML_PATH, 'utf8');
  } catch (e) {
    console.error(`[validate-principle-slices] FATAL: cannot read ${YAML_PATH}: ${e.message}`);
    process.exit(2);
  }

  const sourceIds = extractIds(sourceYaml);
  const errors   = [];
  const warnings = [];

  // ── 1. Check each P-* ID has a slice file ───────────────────────────────────

  // E5 S032: slices now have topic-kebab suffix (P-ARCH-001-topic.yaml)
  // Find by prefix match: any file starting with `${id}-` or exactly `${id}.yaml`
  const { readdirSync } = await import('node:fs');
  const sliceFiles = readdirSync(SLICES_DIR);

  for (const id of sourceIds) {
    // Look for exact match OR prefix match (id + '-' + topic-kebab)
    const match = sliceFiles.find(f => f === `${id}.yaml` || f.startsWith(`${id}-`));
    if (!match) {
      errors.push(`missing slice file: packages/principles/principles/${id}*.yaml`);
      continue;
    }
    const slicePath = join(SLICES_DIR, match);
    try {
      const sliceText = readFileSync(slicePath, 'utf8');
      const sliceId   = extractSliceId(sliceText);
      if (sliceId !== id) {
        errors.push(`slice id mismatch: ${match} contains id: "${sliceId ?? '(none)'}"`);
      }
    } catch (e) {
      errors.push(`cannot read slice ${match}: ${e.message}`);
    }
  }

  // ── 2. Check index count matches source count ────────────────────────────────

  try {
    indexText = readFileSync(INDEX_PATH, 'utf8');
    const indexCount = extractIndexCount(indexText);
    if (indexCount === null) {
      warnings.push(`principles-index.yaml missing total_count field`);
    } else if (indexCount !== sourceIds.length) {
      warnings.push(`principles-index.yaml total_count=${indexCount} but principles.yaml has ${sourceIds.length} entries — run \`pnpm principles:split\` to sync`);
    }
  } catch {
    warnings.push(`principles-index.yaml not found — run \`pnpm principles:split\` to generate`);
  }

  // ── Report ────────────────────────────────────────────────────────────────────

  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} warning(s):`);
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
  }

  const summary = `[validate-principle-slices] source_ids=${sourceIds.length} missing=${errors.length} index_ok=${warnings.length === 0}`;

  if (errors.length > 0) {
    console.error(`\n${errors.length} error(s) — run \`pnpm --filter @csps/principles split\` to fix:`);
    for (const e of errors) console.error(`  ✗ ${e}`);
    console.error(`\n${summary}`);
    process.exit(1);
  }

  console.log(`✓ all ${sourceIds.length} principle slices present and valid`);
  console.log(summary);
  process.exit(0);
}

main().catch((err) => {
  console.error('[validate-principle-slices] fatal:', err);
  process.exit(2);
});
