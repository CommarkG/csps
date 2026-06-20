#!/usr/bin/env node
// validate-file-complexity.mjs — E2 session (S030), extended P1.1 S085
// Dual-gate file complexity check — now covers BOTH governance .md files AND code files.
//
// GATE-MD: docs/plan/**/*.md — lines>300 AND H2>=3 WITHOUT mini_tree_root: true -> ADVISORY
// GATE-CODE: tools/**/*.mjs, libs/**/*.ts, apps/**/*.ts — lines>500 WITHOUT @complexity_exempt -> ADVISORY
//            NEW in P1.1 (S085): code files >500 LOC escaped the split policy; verify.mjs=2460 LOC found.
// CREATION-PROTOCOL: new code files >500 LOC should declare a split-plan (@split_plan: comment) — ADVISORY.
//
// Why code gate is HIGHER (500 vs 300): code is inherently denser; split policy applies above 500 LOC.
// Exemptions: frontmatter 'complexity_exempt: true' (md) | first-20-lines '@complexity_exempt' comment (code)
//
// Enforces: mini-tree-split-protocol.md + P1.1 code-file-split-policy
// Registered: audit-runner.md slug 'file-complexity-threshold'

import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { join, resolve, relative } from 'path';

const ROOT = resolve(process.cwd());
const SCAN_MD_ROOT = join(ROOT, 'docs/plan');
const CODE_ROOTS = [
  { dir: join(ROOT, 'tools'), exts: ['.mjs', '.ts'], threshold: 500 },
  { dir: join(ROOT, 'libs'), exts: ['.mjs', '.ts'], threshold: 500 },
  { dir: join(ROOT, 'apps'), exts: ['.ts', '.tsx'], threshold: 500 },
];
const MD_LINE_THRESHOLD = 300;
const MD_H2_THRESHOLD = 3;
const EXCLUDE_DIRS = ['node_modules', '.next', 'dist', 'generated', '.zenstack'];

function hasFrontmatterField(content, field) {
  if (!content.startsWith('---')) return false;
  const end = content.indexOf('\n---', 3);
  if (end === -1) return false;
  const fm = content.slice(0, end);
  return fm.includes(`${field}: true`);
}

function hasCodeExempt(content) {
  // Check first 25 lines for @complexity_exempt comment
  const first25 = content.split('\n').slice(0, 25).join('\n');
  return first25.includes('@complexity_exempt') || first25.includes('complexity_exempt: true');
}

function hasSplitPlan(content) {
  // Check first 30 lines for @split_plan: comment
  const first30 = content.split('\n').slice(0, 30).join('\n');
  return first30.includes('@split_plan:');
}

function walkDir(dir, exts, results = []) {
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDE_DIRS.includes(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) walkDir(fullPath, exts, results);
    else if (exts.some(e => entry.name.endsWith(e))) results.push(fullPath);
  }
  return results;
}

function getAllMdFiles(dir) {
  return walkDir(dir, ['.md']);
}

// ── MD gate ──────────────────────────────────────────────────────────────────
let md_advisory = 0;
const md_candidates = [];
const md_files = getAllMdFiles(SCAN_MD_ROOT);

for (const filePath of md_files) {
  let content;
  try { content = readFileSync(filePath, 'utf8'); } catch { continue; }
  if (hasFrontmatterField(content, 'complexity_exempt')) continue;
  if (hasFrontmatterField(content, 'mini_tree_root')) continue;
  const lines = content.split('\n');
  const lineCount = lines.length;
  const h2Count = lines.filter(l => l.match(/^## /)).length;
  if (lineCount > MD_LINE_THRESHOLD && h2Count >= MD_H2_THRESHOLD) {
    md_candidates.push({ path: relative(ROOT, filePath), lines: lineCount, h2: h2Count });
    md_advisory++;
  }
}

// ── CODE gate ─────────────────────────────────────────────────────────────────
let code_advisory = 0;
let code_no_split_plan = 0;
let code_scanned = 0;
const code_candidates = [];

for (const { dir, exts, threshold } of CODE_ROOTS) {
  for (const filePath of walkDir(dir, exts)) {
    let content;
    try { content = readFileSync(filePath, 'utf8'); } catch { continue; }
    if (hasCodeExempt(content)) continue;
    code_scanned++;
    const lineCount = content.split('\n').length;
    if (lineCount > threshold) {
      const relPath = relative(ROOT, filePath);
      const splitPlan = hasSplitPlan(content);
      if (!splitPlan) code_no_split_plan++;
      code_candidates.push({ path: relPath, lines: lineCount, has_split_plan: splitPlan });
      code_advisory++;
    }
  }
}

// ── Output ────────────────────────────────────────────────────────────────────
const advisory = md_advisory + code_advisory;

// MD results
if (md_advisory === 0) {
  console.log('[validate-file-complexity] md: no files exceed dual-gate (lines>300 AND H2>=3)');
} else {
  console.log(`[validate-file-complexity] md: ${md_advisory} file(s) exceed dual-gate:`);
  for (const c of md_candidates.sort((a, b) => b.lines - a.lines).slice(0, 10)) {
    console.log(`  md-advisory: ${c.path} — ${c.lines} lines, ${c.h2} H2`);
  }
}

// CODE results (P1.1 new)
if (code_advisory === 0) {
  console.log(`[validate-file-complexity] code: no files exceed ${500}-LOC threshold`);
} else {
  console.log(`[validate-file-complexity] code: ${code_advisory} file(s) exceed 500-LOC threshold (P1.1 S085 extension):`);
  for (const c of code_candidates.sort((a, b) => b.lines - a.lines).slice(0, 10)) {
    const splitNote = c.has_split_plan ? ' [has @split_plan]' : ' [NO @split_plan — ADVISORY]';
    console.log(`  code-advisory: ${c.path} — ${c.lines} lines${splitNote}`);
  }
  if (code_no_split_plan > 0) {
    console.log(`  ${code_no_split_plan} code file(s) >500 LOC without a @split_plan declaration.`);
    console.log(`  Fix: add '// @split_plan: <describe refactor>' in first 30 lines.`);
  }
}

const scanned = md_files.length + code_scanned;
console.log(`[validate-file-complexity] scanned=${scanned} md_scanned=${md_files.length} code_scanned=${code_scanned} advisory=${advisory} md_advisory=${md_advisory} code_advisory=${code_advisory}`);
process.exit(0); // ADVISORY only — never blocks