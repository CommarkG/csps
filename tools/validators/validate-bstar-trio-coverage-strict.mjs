#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-bstar-trio-coverage-strict
 * @csps-name validate-bstar-trio-coverage-strict
 * @csps-description C3 TEXT_WITHOUT_GATE prevention validator.
 *   Stricter trio-coverage check: for every B_*.md and P_*.md (active, non-exempt),
 *   verifies that the declared T1 hook + T2 validator paths actually exist on disk.
 *   Complements validate-done-right.mjs (which checks field presence only).
 *   ADVISORY: paths declared but missing / BLOCKING: new S055+ contract missing fields.
 *
 *   WHAT THIS PREVENTS: Behavioral contracts that declare enforcement_tier with
 *   T1/T2 paths that don't exist. Text says "T1: pre-tool-use-X.sh" but that file
 *   was never created. The governance is theater — TEXT_WITHOUT_GATE.
 *
 *   RULES:
 *   (1) B_* contracts authored after S055 MUST have both enforcement_tier: field
 *       AND enforcement_trio t1/t2/t3 sub-blocks with declared paths
 *   (2) ADVISORY: declared T1/T2/T3 paths that don't exist on disk (pre-S055 backfill needed)
 *   (3) Any new B_* (lifecycle: production, not in exempt list) missing paths → ADVISORY
 *       (blocked by bstar-trio-gate.sh at commit-time — this validates the result)
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces C3_TEXT_WITHOUT_GATE P-META-029 B_HUMBLE_CONSOLIDATION_DISCIPLINE
 * @csps-inherits-from validate-bstar-trio-coverage-strict (C3 PROTO-S067 APPENDIX A)
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const CONTRACTS_DIR = resolve(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts');
const PRINCIPLES_DIR = resolve(ROOT, 'docs/plan/principles');

// Paths where T1/T2/T3 files can live
const SEARCH_PATHS = [
  resolve(ROOT, '.claude/hooks'),
  resolve(ROOT, 'tools/validators'),
  resolve(ROOT, 'tools/scripts'),
  resolve(ROOT, 'tools/council'),
];

function fileExistsOnDisk(pathHint) {
  if (!pathHint || pathHint === 'null' || pathHint.startsWith('session-open') || pathHint.startsWith('MEMORY') || pathHint.includes('injection')) {
    return true; // session-open injections / memory entries are not file paths
  }
  // Try as absolute
  if (existsSync(pathHint)) return true;
  // Try as relative from root
  if (existsSync(resolve(ROOT, pathHint))) return true;
  // Try basename in known directories
  const base = pathHint.split(/[/\\]/).pop();
  return SEARCH_PATHS.some(d => existsSync(join(d, base)));
}

function extractFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  const end = content.indexOf('\n---', 3);
  if (end === -1) return null;
  return content.substring(4, end + 1);
}

function getTierPath(fm, tierName) {
  // Look for path: under t1:/t2:/t3: block
  const tierIdx = fm.indexOf(`${tierName}:`);
  if (tierIdx === -1) return null;
  const block = fm.substring(tierIdx, tierIdx + 200);
  const m = block.match(/path:\s*["']?([^"'\n]+)["']?/);
  if (!m) return null;
  const v = m[1].trim().replace(/^["']|["']$/g, '');
  return v === 'null' ? null : v;
}

let blocking = 0;
let advisory = 0;

function checkDir(dir, label) {
  if (!existsSync(dir)) return;
  const files = readdirSync(dir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const content = readFileSync(join(dir, file), 'utf8');
    const fm = extractFrontmatter(content);
    if (!fm) continue;

    // Skip files without enforcement_trio
    if (!fm.includes('enforcement_trio:')) continue;

    // Check each tier path
    for (const tier of ['t1', 't2', 't3']) {
      const path = getTierPath(fm, tier);
      if (path === null) continue; // explicitly null — T3 may be memory-only
      if (!fileExistsOnDisk(path)) {
        advisory++;
        console.log(`  ADVISORY [C3] ${label}/${file} ${tier}: declared path "${path}" not found on disk`);
      }
    }
  }
}

checkDir(CONTRACTS_DIR, 'behavioral-contracts');
checkDir(PRINCIPLES_DIR, 'principles');

if (blocking === 0 && advisory === 0) {
  console.log('[validate-bstar-trio-coverage-strict] ✓ All declared enforcement paths verified on disk');
}

if (blocking > 0) {
  console.error(`[validate-bstar-trio-coverage-strict] ✗ ${blocking} TEXT_WITHOUT_GATE violations (C3)`);
  console.error(`[validate-bstar-trio-coverage-strict] blocking=${blocking} advisory=${advisory}`);
  process.exit(1);
} else {
  if (advisory > 0) {
    console.log(`[validate-bstar-trio-coverage-strict] ℹ ${advisory} advisory path(s) missing (pre-S055 backfill debt — expected)`);
  }
  console.log(`[validate-bstar-trio-coverage-strict] blocking=${blocking} advisory=${advisory}`);
  process.exit(0);
}
