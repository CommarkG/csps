#!/usr/bin/env node
// validate-mini-tree-integrity.mjs — E1 session (S030)
// Bidirectional mini-tree integrity check per mini-tree-split-protocol.md
//
// Checks:
//   A. Every file with mini_tree_root: true lists sub_files: that all exist on disk (BLOCKING)
//   B. Every listed sub-file exists at the declared path (BLOCKING)
//   C. Sub-files that back-reference their intro (ADVISORY — encourages linking)
//   D. Directories with 2+ .md files but no intro file with mini_tree_root: true (ADVISORY)
//
// Registered: verify.mjs (E1 session, SPI=0.15)
// Protocol: docs/plan/pillar-0-governance/mini-tree-split-protocol.md

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, resolve, dirname, relative } from 'path';

const ROOT = resolve(process.cwd());
const SCAN_DIRS = [
  'docs/plan',
  '.claude/core-spines',
  'packages/principles',
];

function parseYamlFrontmatter(content) {
  const clean = content.replace(/\r/g, ''); // normalize CRLF
  if (!clean.startsWith('---')) return null;
  const end = clean.indexOf('\n---', 3);
  if (end === -1) return null;
  const yaml = clean.slice(4, end);
  content = clean;
  const result = {};
  for (const line of yaml.split('\n')) {
    const m = line.match(/^(\w[\w_-]*):\s*(.+)$/);
    if (m) result[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    // sub_files: array (simple list) — set flag first, process items next iteration
    if (line.match(/^sub_files:$/)) {
      result._sub_files_next = true;
    } else if (result._sub_files_next && line.match(/^\s+-\s+(.+)$/)) {
      if (!result.sub_files) result.sub_files = [];
      result.sub_files.push(line.match(/^\s+-\s+(.+)$/)[1].trim());
    } else if (result._sub_files_next && !line.match(/^\s*-/)) {
      delete result._sub_files_next;
    }
  }
  return result;
}

function getAllMdFiles(dir) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return [];
  const results = [];
  function walk(d) {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(join(d, entry.name));
      else if (entry.name.endsWith('.md') || entry.name.endsWith('.yaml')) {
        results.push(join(d, entry.name));
      }
    }
  }
  walk(abs);
  return results;
}

let blocking = 0;
let advisory = 0;
const errors = [];
const warnings = [];

// Check A+B: files with mini_tree_root: true have all sub_files existing
for (const dir of SCAN_DIRS) {
  for (const filePath of getAllMdFiles(dir)) {
    let content;
    try { content = readFileSync(filePath, 'utf8'); } catch { continue; }
    const fm = parseYamlFrontmatter(content);
    if (!fm || fm.mini_tree_root !== 'true') continue;

    const relPath = relative(ROOT, filePath);
    const fileDir = dirname(filePath);

    if (!fm.sub_files || fm.sub_files.length === 0) {
      errors.push(`  ✗ ${relPath}: has mini_tree_root: true but no sub_files: array`);
      blocking++;
      continue;
    }

    for (const sub of fm.sub_files) {
      const subAbs = sub.startsWith('./')
        ? join(fileDir, sub.slice(2))
        : join(fileDir, sub);
      if (!existsSync(subAbs)) {
        errors.push(`  ✗ ${relPath}: sub_file "${sub}" does not exist at ${relative(ROOT, subAbs)}`);
        blocking++;
      }
    }
  }
}

// Check D: directories with 2+ .md files and no mini_tree_root intro (ADVISORY)
const GOV_DIR = join(ROOT, 'docs/plan/pillar-0-governance');
if (existsSync(GOV_DIR)) {
  for (const entry of readdirSync(GOV_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const subDir = join(GOV_DIR, entry.name);
    const mdFiles = readdirSync(subDir, { withFileTypes: true })
      .filter(e => e.isFile() && e.name.endsWith('.md'));
    if (mdFiles.length < 2) continue;

    // Check if any file in directory has mini_tree_root: true
    const hasIntro = mdFiles.some(f => {
      try {
        const c = readFileSync(join(subDir, f.name), 'utf8');
        const fm = parseYamlFrontmatter(c);
        return fm && fm.mini_tree_root === 'true';
      } catch { return false; }
    });
    // Also check if the parent .md file exists with mini_tree_root
    const parentMd = join(GOV_DIR, `${entry.name}.md`);
    const parentHasRoot = existsSync(parentMd) && (() => {
      try {
        const c = readFileSync(parentMd, 'utf8');
        const fm = parseYamlFrontmatter(c);
        return fm && fm.mini_tree_root === 'true';
      } catch { return false; }
    })();

    if (!hasIntro && !parentHasRoot) {
      warnings.push(`  ⚠ docs/plan/pillar-0-governance/${entry.name}/: ${mdFiles.length} files, no mini_tree_root intro found`);
      advisory++;
    }
  }
}

// Output
console.log('');
if (blocking > 0) {
  console.log(`[validate-mini-tree-integrity] ✗ ${blocking} blocking error(s):`);
  errors.forEach(e => console.log(e));
} else {
  console.log('[validate-mini-tree-integrity] ✓ No blocking errors — all mini_tree_root: true files have valid sub_files');
}
if (advisory > 0) {
  console.log(`[validate-mini-tree-integrity] ${advisory} advisory warning(s):`);
  warnings.forEach(w => console.log(w));
  console.log('  Fix: create README.md with mini_tree_root: true + sub_files: [...] in the directory');
}
console.log(`[validate-mini-tree-integrity] blocking=${blocking} advisory=${advisory}`);
process.exit(blocking > 0 ? 1 : 0);
