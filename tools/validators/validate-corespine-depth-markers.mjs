#!/usr/bin/env node
/**
 * validate-corespine-depth-markers.mjs — L1_CORE HUB file_depth_markers validator
 *
 * SELF-DESCRIBING (6-commitment #5):
 *   Authority chain: P-ARCH-028 (csps-core-spines) + depth-discipline.md + EXT-20260505-004-D Improvement #8
 *   What it checks:
 *     (a) All 5 L1_CORE_*.md files exist at .claude/core-spines/
 *     (b) Each L1_CORE_*.md has file_depth_markers frontmatter (l1_lines/l2_lines fields)
 *     (c) All 16 L2_DOMAIN_*.md files exist (per P-ARCH-028 3-layer doctrine)
 *     (d) All 5 L3_INSTANCES_*.md files exist
 *   Sister composition: validate-frontmatter.mjs (general frontmatter coverage)
 *   Usage: node tools/validators/validate-corespine-depth-markers.mjs
 *
 * EXIT-CODED (6-commitment #3):
 *   0 = PASS (all checks green)
 *   1 = WARN (missing depth_markers on existing files; ADVISORY window)
 *
 * GRADUATION-AWARE (6-commitment #6):
 *   ADVISORY window; FAIL_CLOSED when depth-markers backfill on L1_CORE files complete + validated
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const CORE_SPINES_DIR = join(ROOT, '.claude/core-spines');

const CANONICAL_SPINES = ['GVRN', 'ARCH', 'AI', 'OPER', 'VALD'];

function hasFrontmatterField(text, field) {
  const fmMatch = text.match(/^---\n[\s\S]*?\n---/);
  if (!fmMatch) return false;
  return fmMatch[0].includes(`${field}:`);
}

async function main() {
  const errors = [];
  const warnings = [];
  let checked = 0;

  if (!existsSync(CORE_SPINES_DIR)) {
    errors.push('.claude/core-spines/ directory not found');
    console.error(`[validate-corespine-depth-markers] FATAL: ${errors[0]}`);
    process.exit(1);
  }

  // ── (a) L1_CORE files existence + depth_markers ────────────────────────────
  for (const spine of CANONICAL_SPINES) {
    const path = join(CORE_SPINES_DIR, `L1_CORE_${spine}.md`);
    if (!existsSync(path)) {
      errors.push(`missing L1_CORE_${spine}.md`);
      continue;
    }
    const text = readFileSync(path, 'utf8');
    checked++;
    if (!hasFrontmatterField(text, 'file_depth_markers')) {
      warnings.push(`L1_CORE_${spine}.md missing file_depth_markers — add l1_lines/l2_lines/l3_lines per depth-discipline.md §2`);
    }
  }

  // ── (b) L2_DOMAIN files existence (spot-check expected count) ─────────────
  const allFiles = readdirSync(CORE_SPINES_DIR);
  const l2Files = allFiles.filter(f => f.startsWith('L2_DOMAIN_'));
  const l3Files = allFiles.filter(f => f.startsWith('L3_INSTANCES_'));

  if (l2Files.length < 16) {
    warnings.push(`L2_DOMAIN files: found ${l2Files.length}, expected ≥16 (per P-ARCH-028 3-layer doctrine)`);
  } else {
    checked += l2Files.length;
  }

  if (l3Files.length < 5) {
    warnings.push(`L3_INSTANCES files: found ${l3Files.length}, expected 5 (one per spine)`);
  } else {
    checked += l3Files.length;
  }

  // ── Report ─────────────────────────────────────────────────────────────────
  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} warning(s) [ADVISORY — file_depth_markers backfill pending]:`);
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
  }
  if (errors.length > 0) {
    console.error(`\n${errors.length} error(s):`);
    for (const e of errors) console.error(`  ✗ ${e}`);
  }

  const summary = `[validate-corespine-depth-markers] checked=${checked} l1_core=${CANONICAL_SPINES.length - errors.length}/5 l2_domain=${l2Files.length} l3_instances=${l3Files.length} errors=${errors.length} warnings=${warnings.length}`;
  console.log(`\n${summary}`);

  if (errors.length > 0) process.exit(1);
  if (warnings.length > 0) process.exit(1); // ADVISORY window: warn-only; same as exit 1 per convention
  process.exit(0);
}

main().catch(err => {
  console.error('[validate-corespine-depth-markers] fatal:', err);
  process.exit(1);
});
