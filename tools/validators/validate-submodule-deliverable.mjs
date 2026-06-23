#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-submodule-deliverable
 * @csps-name validate-submodule-deliverable
 * @csps-description PROTO-S088-PHASE-0.3-HARDEN Gate A:
 *   Blocks when any tracked git submodule has:
 *   (a) UNTRACKED source files under src/**, app/**, components/**, scripts/**
 *       — uncommitted deliverables are invisible on deploy
 *   (b) MODIFIED-but-UNCOMMITTED tracked source files in the same globs
 *   (c) PARENT POINTER STALE vs the submodule's current committed HEAD
 *       — parent points at older SHA, deploy would use wrong code
 *
 *   Reads .gitmodules to discover all tracked submodules.
 *   Uses `git -C <path> status --short --untracked-files=all` for source checks.
 *   Uses `git submodule status` vs `git -C <path> rev-parse HEAD` for pointer check.
 *
 *   BLOCK-TEST: plants a temporary untracked file under submodule src/, runs itself,
 *   confirms exit_code=1 (BLOCKING), then removes the planted file.
 *   Activated by: node validate-submodule-deliverable.mjs --block-test
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces PROTO-S088-PHASE-0.3-HARDEN
 * @csps-prevention-class SUBMODULE-BLINDSPOT UNCOMMITTED-DELIVERABLE STALE-POINTER
 *
 * Coverage levels:
 *   BLOCKING (exit 1): untracked/modified source files OR stale parent pointer
 *   PASSES  (exit 0): all submodules clean
 *
 * run_tier: STANDARD
 * always_rerun: true  (git state changes outside file content)
 * load_mode: on-demand
 */

import { execSync, spawnSync } from 'node:child_process';
import { existsSync, writeFileSync, unlinkSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = resolve(fileURLToPath(import.meta.url), '../..');
const ROOT = resolve(__dir, '..'); // repo root

// Source globs that must not have uncommitted changes
const SOURCE_GLOBS = ['src/', 'app/', 'components/', 'scripts/'];

// Read .gitmodules to get all submodule paths
function getSubmodules() {
  const gmPath = join(ROOT, '.gitmodules');
  if (!existsSync(gmPath)) return [];

  try {
    const raw = execSync('git config --file .gitmodules --get-regexp "submodule\\..*\\.path"', {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return raw.trim().split('\n').map(line => {
      const parts = line.split(' ');
      return parts[1]; // path value
    }).filter(Boolean);
  } catch {
    return [];
  }
}

// Check if a submodule has untracked/modified source files
function checkSubmoduleSource(subPath) {
  const absPath = join(ROOT, subPath);
  if (!existsSync(absPath)) return [];

  let statusOut;
  try {
    statusOut = execSync('git status --short --untracked-files=all', {
      cwd: absPath,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch {
    return [`[ERROR] could not run git status in ${subPath}`];
  }

  const findings = [];
  for (const line of statusOut.split('\n')) {
    if (!line.trim()) continue;
    const xy = line.slice(0, 2);
    const filePath = line.slice(3).trim();

    // ?? = untracked, M<space> = modified in working tree, <space>M = modified in staging
    const isUntracked = xy === '??';
    const isModified = xy.includes('M') || xy.includes('A') || xy.includes('D');
    if (!isUntracked && !isModified) continue;

    // Check if it falls under a source glob
    const matchesGlob = SOURCE_GLOBS.some(g => filePath.startsWith(g));
    if (matchesGlob) {
      const status = isUntracked ? 'UNTRACKED' : 'MODIFIED-UNCOMMITTED';
      findings.push(`${status}: ${subPath}/${filePath}`);
    }
  }
  return findings;
}

// Check if parent pointer matches submodule HEAD
function checkPointerStaleness(subPath) {
  const absPath = join(ROOT, subPath);
  if (!existsSync(absPath)) return [];

  let submoduleHead;
  try {
    submoduleHead = execSync('git rev-parse HEAD', {
      cwd: absPath,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return [`[ERROR] could not get submodule HEAD for ${subPath}`];
  }

  // Get what the parent repo THINKS the submodule points at
  let parentPointer;
  try {
    const lsOut = execSync(`git ls-tree HEAD "${subPath}"`, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    // format: "160000 commit <sha>\t<path>"
    const parts = lsOut.split(/\s+/);
    parentPointer = parts[2];
  } catch {
    // Not yet committed to parent — pointer definitely stale
    return [`STALE-POINTER: ${subPath} — not committed in parent HEAD`];
  }

  if (!parentPointer) {
    return [`STALE-POINTER: ${subPath} — could not read parent pointer`];
  }

  if (parentPointer !== submoduleHead) {
    return [
      `STALE-POINTER: ${subPath} — parent HEAD points at ${parentPointer.slice(0,8)} but submodule HEAD is ${submoduleHead.slice(0,8)}`,
    ];
  }
  return [];
}

// ── Block-test mode ───────────────────────────────────────────────────────────
async function runBlockTest() {
  console.log('[block-test] SUBMODULE-DELIVERABLE BLOCK-TEST');

  // Find first submodule with a src/ directory
  const submodules = getSubmodules();
  if (submodules.length === 0) {
    console.log('[block-test] SKIP — no submodules registered');
    process.exit(0);
  }

  let targetSub = null;
  for (const s of submodules) {
    const srcDir = join(ROOT, s, 'src');
    if (existsSync(srcDir)) {
      targetSub = s;
      break;
    }
  }

  if (!targetSub) {
    console.log('[block-test] SKIP — no submodule has src/ directory');
    process.exit(0);
  }

  const plantedFile = join(ROOT, targetSub, 'src', '__block_test_planted__.ts');
  console.log(`[block-test] Planting untracked file: ${plantedFile}`);
  writeFileSync(plantedFile, '// block-test planted file — delete if found\n');

  // Run ourselves (without --block-test)
  const selfPath = fileURLToPath(import.meta.url);
  const result = spawnSync('node', [selfPath], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: 'pipe',
  });

  // Cleanup before asserting
  try { unlinkSync(plantedFile); } catch {}

  if (result.status !== 1) {
    console.error(`[block-test] FAIL — expected exit_code=1 with planted file, got exit_code=${result.status}`);
    console.error('[block-test] stdout:', result.stdout);
    console.error('[block-test] stderr:', result.stderr);
    process.exit(1);
  }

  const hasBlocking = result.stdout.includes('UNTRACKED:') || result.stdout.includes('blocking=1');
  if (!hasBlocking) {
    console.error('[block-test] FAIL — output does not contain UNTRACKED or blocking=1');
    console.error('[block-test] stdout:', result.stdout);
    process.exit(1);
  }

  console.log('[block-test] PASS — validator correctly blocked on planted untracked file');
  console.log('[block-test] Validator output:', result.stdout.trim().split('\n').slice(-4).join(' | '));
  process.exit(0);
}

// ── Main ──────────────────────────────────────────────────────────────────────
if (process.argv.includes('--block-test')) {
  await runBlockTest();
}

// --pointer-only mode: ONLY check pointer staleness (skip untracked source files).
// Used by pre-commit hook: git eol normalization temporarily makes submodule working-tree
// files appear MODIFIED during commit, causing false-positives for the source check.
// The source check is reliable in verify.mjs (post-commit, stable working tree).
const POINTER_ONLY_MODE = process.argv.includes('--pointer-only');

const submodules = getSubmodules();
const allFindings = [];

for (const sub of submodules) {
  const sourceFindings = POINTER_ONLY_MODE ? [] : checkSubmoduleSource(sub);
  const pointerFindings = checkPointerStaleness(sub);
  allFindings.push(...sourceFindings, ...pointerFindings);
}

const blocking = allFindings.length;
const passes = submodules.length;

if (blocking > 0) {
  console.log('[validate-submodule-deliverable] BLOCKING FINDINGS:');
  for (const f of allFindings) {
    console.log(`  ✗ ${f}`);
  }
  console.log(`blocking=${blocking} advisory=0 passes=${passes}`);
  process.exit(1);
}

console.log(`[validate-submodule-deliverable] PASS — all ${passes} submodule(s) clean`);
console.log(`blocking=0 advisory=0 passes=${passes}`);
process.exit(0);
