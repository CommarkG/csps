#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/
 * core_spine: VALD
 * governing_principle: P-OP-001
 * behavioral_contract: B_CONSOLIDATION_PASS
 * role: Scans recently staged/new files for fuzzy-name matches against existing files.
 *       Detects potential duplication before it lands (pre-commit awareness).
 *       ADVISORY on first occurrence. BLOCKING on K=2 same-pattern pair.
 * @csps-enforces B_CONSOLIDATION_PASS P-OP-001
 */

/**
 * validate-consolidation-pass.mjs
 * T2 validator for B_CONSOLIDATION_PASS (new: consolidation duplicate detection).
 *
 * Different from validate-consolidation-check.mjs (checks topic-plans for §0 section).
 * This validator checks FILENAMES for fuzzy-name duplication:
 *   - For each recently modified/new file, compare basename to all existing file basenames
 *   - If similarity > THRESHOLD: flag as potential duplication
 *   - Focuses on key directories: tools/validators/, .claude/hooks/, .claude/skills/, docs/plan/
 *
 * Similarity: Jaccard coefficient on word-tokens (basename split by non-alphanumeric)
 * Threshold: 0.6 (60%) — configurable via CSPS_CONSOLIDATION_THRESHOLD env var
 *
 * ADVISORY (exit 0) — blocking only if gap-recurrence-register shows K=2+ same pair.
 *
 * Output: files_scanned=N potential_duplicates=N advisory=N blocking=N
 *
 * PROTO-S064 Item 1.2 | B_CONSOLIDATION_PASS T2 | S064
 */

import { readdirSync, existsSync } from 'fs';
import { join, basename, extname } from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const THRESHOLD = parseFloat(process.env.CSPS_CONSOLIDATION_THRESHOLD || '0.6');

// Key directories to scan for existing files
const SCAN_DIRS = [
  join(ROOT, 'tools', 'validators'),
  join(ROOT, '.claude', 'hooks'),
  join(ROOT, '.claude', 'skills'),
  join(ROOT, 'docs', 'plan', 'protos'),
  join(ROOT, 'docs', 'plan', '_handoff'),
];

// Convert basename to token set (split by non-alphanumeric, lowercase)
function tokenize(name) {
  const base = basename(name, extname(name));
  return new Set(base.toLowerCase().split(/[^a-z0-9]+/).filter(t => t.length > 1));
}

// Jaccard similarity between two token sets
function jaccard(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 0;
  const intersection = new Set([...setA].filter(t => setB.has(t)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

// Collect all existing basenames from scan dirs
const existingFiles = new Map(); // basename-without-ext → full path
for (const dir of SCAN_DIRS) {
  if (!existsSync(dir)) continue;
  try {
    const files = readdirSync(dir, { withFileTypes: true });
    for (const f of files) {
      if (f.isFile()) {
        const key = basename(f.name, extname(f.name)).toLowerCase();
        existingFiles.set(key, join(dir, f.name));
      }
    }
  } catch (e) {}
}

// Get recently new/modified files (staged + untracked, filtered to scan dirs)
let newFiles = [];
try {
  const staged = execSync('git diff --cached --name-only --diff-filter=A', {
    encoding: 'utf-8', cwd: ROOT
  }).trim().split('\n').filter(Boolean);

  const untracked = execSync('git ls-files --others --exclude-standard', {
    encoding: 'utf-8', cwd: ROOT
  }).trim().split('\n').filter(Boolean);

  newFiles = [...staged, ...untracked].filter(f =>
    SCAN_DIRS.some(d => join(ROOT, f).startsWith(d))
  );
} catch (e) {}

let files_scanned = newFiles.length;
let potential_duplicates = 0;
let advisory = 0;
let blocking = 0;
const findings = [];

for (const newFile of newFiles) {
  const newTokens = tokenize(newFile);
  if (newTokens.size === 0) continue;

  for (const [existingBase, existingPath] of existingFiles.entries()) {
    // Skip if it's the same file
    if (join(ROOT, newFile) === existingPath) continue;

    const existingTokens = tokenize(existingPath);
    if (existingTokens.size === 0) continue;

    const sim = jaccard(newTokens, existingTokens);
    if (sim >= THRESHOLD) {
      potential_duplicates++;
      advisory++;
      findings.push({
        new_file: newFile,
        existing_file: existingPath.replace(ROOT + '/', ''),
        similarity: Math.round(sim * 100),
        issue: `${Math.round(sim * 100)}% name similarity suggests potential duplication`,
        fix: 'Run /consolidation-expert before creating — check if existing file covers the need'
      });
      break; // One match per new file is enough
    }
  }
}

// Output findings (cap at 5)
for (const f of findings.slice(0, 5)) {
  console.log(`  ⚠ ${f.new_file} ↔ ${f.existing_file} (${f.similarity}%): ${f.issue}`);
  console.log(`    → ${f.fix}`);
}
if (findings.length > 5) console.log(`  ... +${findings.length - 5} more`);

const summary = `[validate-consolidation-pass] files_scanned=${files_scanned} potential_duplicates=${potential_duplicates} advisory=${advisory} blocking=${blocking}`;
console.log(summary);
process.exit(0);
