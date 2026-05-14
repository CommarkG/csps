#!/usr/bin/env node
// validate-file-complexity.mjs — E2 session (S030)
// Dual-gate file complexity check — week-4 deferred slug from S018, now LIVE.
//
// Gate A: file line count > 300
// Gate B: distinct H2 section count (## headings) >= 3
// Files passing BOTH gates WITHOUT mini_tree_root: true → ADVISORY
// Files with complexity_exempt: true in frontmatter → skip
//
// Enforces: mini-tree-split-protocol.md — files exceeding dual-gate are split candidates
// Registered: audit-runner.md slug 'file-complexity-threshold'
// Wire: tools/verify.mjs

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, resolve, relative } from 'path';

const ROOT = resolve(process.cwd());
const SCAN_ROOT = join(ROOT, 'docs/plan');
const LINE_THRESHOLD = 300;
const H2_THRESHOLD = 3;

function hasFrontmatterField(content, field) {
  if (!content.startsWith('---')) return false;
  const end = content.indexOf('\n---', 3);
  if (end === -1) return false;
  const fm = content.slice(0, end);
  return fm.includes(`${field}: true`);
}

function getAllMdFiles(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  function walk(d) {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(join(d, entry.name));
      else if (entry.name.endsWith('.md')) results.push(join(d, entry.name));
    }
  }
  walk(dir);
  return results;
}

let advisory = 0;
const candidates = [];

for (const filePath of getAllMdFiles(SCAN_ROOT)) {
  let content;
  try { content = readFileSync(filePath, 'utf8'); } catch { continue; }

  // Skip if complexity_exempt: true in frontmatter
  if (hasFrontmatterField(content, 'complexity_exempt')) continue;

  // Skip if already a mini-tree intro
  if (hasFrontmatterField(content, 'mini_tree_root')) continue;

  const lines = content.split('\n');
  const lineCount = lines.length;
  const h2Count = lines.filter(l => l.match(/^## /)).length;

  if (lineCount > LINE_THRESHOLD && h2Count >= H2_THRESHOLD) {
    const relPath = relative(ROOT, filePath);
    candidates.push({ path: relPath, lines: lineCount, h2: h2Count });
    advisory++;
  }
}

if (advisory === 0) {
  console.log('[validate-file-complexity] ✓ No files exceed the dual-gate threshold');
} else {
  console.log(`[validate-file-complexity] ${advisory} file(s) exceed dual-gate (lines>${LINE_THRESHOLD} AND H2>=${H2_THRESHOLD}) without mini_tree_root: true:`);
  for (const c of candidates.sort((a, b) => b.lines - a.lines).slice(0, 15)) {
    console.log(`  ⚠ ${c.path} — ${c.lines} lines, ${c.h2} H2 sections`);
    console.log(`    Consider splitting into mini-tree: tools/templates/mini-tree-intro.template.md`);
  }
  if (candidates.length > 15) {
    console.log(`  ... and ${candidates.length - 15} more`);
  }
}
console.log(`[validate-file-complexity] scanned=${getAllMdFiles(SCAN_ROOT).length} advisory=${advisory}`);
process.exit(0); // ADVISORY only — never blocks
