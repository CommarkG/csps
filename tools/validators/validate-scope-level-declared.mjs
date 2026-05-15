#!/usr/bin/env node
// validate-scope-level-declared.mjs — ADR-0027 Phase 1 (S032)
// Checks that governed .md files in docs/plan/ and .claude/core-spines/
// have scope_level: S[0-5] declared in frontmatter.
//
// Phase 1: ADVISORY (flag missing, don't block)
// Phase 2 (S033+): BLOCKING after backfill script runs
// Phase 3 (S034+): BLOCKING in CI
//
// Wired: tools/verify.mjs cycle 'scope_level_declared'
// Slug: 'scope-level-declared' in audit-runner.md
// Authority: ADR-0027 + Opus Turn 21 S028

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, resolve, relative } from 'path';

const ROOT = resolve(process.cwd());
const SCAN_DIRS = [
  'docs/plan/pillar-0-governance',
  '.claude/core-spines',
];
// Files known to predate the requirement — grandfathered until backfill
const EXEMPT_PATTERNS = [
  /VAULT\//,        // VAULT files — too many to backfill immediately
  /HANDOFF-/,       // HANDOFF files
  /closing-summary/, // closing summaries
  /governor-brief/,  // governor briefs
  /_intake\//,      // intake directories
];

const VALID_SCOPE_LEVELS = new Set(['S0', 'S1', 'S2', 'S3', 'S4', 'S5']);

function hasFrontmatterField(content, field) {
  const clean = content.replace(/\r/g, '');
  if (!clean.startsWith('---')) return null;
  const end = clean.indexOf('\n---', 3);
  if (end === -1) return null;
  const fm = clean.slice(0, end);
  const m = fm.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
}

function getAllMdFiles(dir) {
  const results = [];
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return results;
  function walk(d) {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(join(d, entry.name));
      else if (entry.name.endsWith('.md')) results.push(join(d, entry.name));
    }
  }
  walk(abs);
  return results;
}

let missing = 0;
let invalid = 0;
let checked = 0;
let exempt = 0;
const issues = [];

for (const dir of SCAN_DIRS) {
  for (const filePath of getAllMdFiles(dir)) {
    const relPath = relative(ROOT, filePath);

    // Check exemptions
    if (EXEMPT_PATTERNS.some(p => p.test(relPath))) {
      exempt++;
      continue;
    }

    let content;
    try { content = readFileSync(filePath, 'utf8'); } catch { continue; }

    const scopeLevel = hasFrontmatterField(content, 'scope_level');
    checked++;

    if (!scopeLevel) {
      issues.push(`  ⚠ ${relPath}: missing scope_level (add scope_level: S[0-5])`);
      missing++;
    } else if (!VALID_SCOPE_LEVELS.has(scopeLevel)) {
      issues.push(`  ⚠ ${relPath}: invalid scope_level "${scopeLevel}" (must be S0-S5)`);
      invalid++;
    }
  }
}

const advisory = missing + invalid;

if (advisory === 0) {
  console.log(`[validate-scope-level-declared] ✓ All ${checked} checked files have valid scope_level`);
} else {
  console.log(`[validate-scope-level-declared] ${advisory} files missing/invalid scope_level (ADVISORY — Phase 1):`);
  issues.slice(0, 20).forEach(i => console.log(i));
  if (issues.length > 20) console.log(`  ... and ${issues.length - 20} more`);
  console.log(`  Fix: add scope_level: S[0-5] to frontmatter per ADR-0027`);
  console.log(`  Backfill script: tools/scripts/backfill-scope-level.mjs (Phase 2)`);
}
console.log(`[validate-scope-level-declared] checked=${checked} missing=${missing} invalid=${invalid} exempt=${exempt}`);
process.exit(0); // ADVISORY only — Phase 1
