#!/usr/bin/env node
// tools/scripts/backfill-scope-level.mjs — S034-A (one-shot backfill)
// Scans all .md and .yaml files, detects correct scope_level by path rule,
// adds scope_level: SN to frontmatter if missing. Skips if already present.
//
// Path rules (Opus Turn 52):
//   .claude/core-spines/L1_*.md | packages/principles/principles/P-*.yaml → S0
//   libs/**                                                                  → S1
//   apps/*/                                                                  → S2
//   docs/plan/** | tools/ | packages/ (non-principles)                      → S1 (governance)
//   .claude/core-spines/L2_* | .claude/core-spines/L3_*                     → S1
//   unclear                                                                  → needs-manual-review
//
// Usage: node tools/scripts/backfill-scope-level.mjs [--dry-run]

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, resolve, relative, basename } from 'path';

const ROOT = resolve(process.cwd());
const DRY_RUN = process.argv.includes('--dry-run');

const SCAN_DIRS = [
  'docs/plan',
  'packages/principles/principles',
  '.claude/core-spines',
  'libs',
  'apps',
  'tools',
  'packages',
];

// Files/patterns to skip
const SKIP_PATTERNS = [
  /node_modules/,
  /\.next\//,
  /dist\//,
  /generated\//,
  /pnpm-lock/,
  /package-lock/,
];

function detectScopeLevel(relPath) {
  // S0: Constitutional docs
  if (relPath.match(/^\.claude\/core-spines\/L[01]_/)) return 'S0';
  if (relPath.match(/^packages\/principles\/principles\/P-/)) return 'S0';

  // S1: Platform-wide
  if (relPath.startsWith('libs/')) return 'S1';
  if (relPath.startsWith('packages/')) return 'S1';
  if (relPath.match(/^\.claude\/core-spines\//)) return 'S1';
  if (relPath.startsWith('docs/plan/')) return 'S1'; // governance docs are S1
  if (relPath.startsWith('tools/')) return 'S1';

  // S2: App-scope
  if (relPath.match(/^apps\/[^/]+\//)) return 'S2';

  return null; // needs-manual-review
}

function hasFrontmatter(content) {
  return content.replace(/\r/g, '').startsWith('---');
}

function hasScopeLevel(content) {
  const clean = content.replace(/\r/g, '');
  if (!clean.startsWith('---')) return false;
  const end = clean.indexOf('\n---', 3);
  if (end === -1) return false;
  return /^scope_level:/m.test(clean.slice(0, end));
}

function insertScopeLevel(content, level) {
  const clean = content.replace(/\r/g, '');
  const end = clean.indexOf('\n---', 3);
  if (end === -1) return content;
  // Insert before closing ---
  const fm = clean.slice(0, end);
  const rest = clean.slice(end);
  return fm + `\nscope_level: ${level}` + rest;
}

function getAllFiles(dir, exts) {
  const results = [];
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return results;
  function walk(d) {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, entry.name);
      const rel = relative(ROOT, full);
      if (SKIP_PATTERNS.some(p => p.test(rel))) continue;
      if (entry.isDirectory()) walk(full);
      else if (exts.some(e => entry.name.endsWith(e))) results.push(full);
    }
  }
  walk(abs);
  return results;
}

let updated = 0, skipped = 0, noFrontmatter = 0, needsManual = [];

for (const dir of SCAN_DIRS) {
  for (const filePath of getAllFiles(dir, ['.md', '.yaml'])) {
    const relPath = relative(ROOT, filePath).replace(/\\/g, '/');

    // Skip generated slices (they're auto-generated)
    if (relPath.match(/packages\/principles\/principles\/P-.*\.yaml$/)) {
      skipped++; continue; // already S0 target but generated files — skip
    }

    let content;
    try { content = readFileSync(filePath, 'utf8'); } catch { continue; }

    if (!hasFrontmatter(content)) { noFrontmatter++; continue; }
    if (hasScopeLevel(content)) { skipped++; continue; }

    const level = detectScopeLevel(relPath);
    if (!level) {
      needsManual.push(relPath);
      continue;
    }

    if (!DRY_RUN) {
      writeFileSync(filePath, insertScopeLevel(content, level), 'utf8');
    }
    updated++;
    if (process.argv.includes('--verbose')) {
      console.log(`  ${DRY_RUN ? '[DRY]' : ''} ${relPath} → ${level}`);
    }
  }
}

console.log('\n[backfill-scope-level] Summary:');
console.log(`  Updated:            ${updated} files${DRY_RUN ? ' (dry-run)' : ''}`);
console.log(`  Skipped (has level): ${skipped} files`);
console.log(`  No frontmatter:     ${noFrontmatter} files`);
console.log(`  Needs manual review: ${needsManual.length} files`);
if (needsManual.length > 0) {
  console.log('\n  Files needing manual scope_level:');
  needsManual.slice(0, 10).forEach(f => console.log(`    ⚠ ${f}`));
  if (needsManual.length > 10) console.log(`    ... and ${needsManual.length - 10} more`);
}
if (!DRY_RUN && updated > 0) {
  console.log(`\n  Run node tools/verify.mjs to confirm. Spot-check ${Math.min(10, updated)} files before committing.`);
}
