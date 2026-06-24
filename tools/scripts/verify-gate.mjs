#!/usr/bin/env node
/**
 * verify-gate.mjs — CS4 STAGE-BEFORE-VERIFY WRAPPER (S088)
 *
 * Problem: running `node tools/verify.mjs` BEFORE `git add` means:
 *   - green-receipt tree_hash = git ls-files --stage (the INDEX)
 *   - unstaged edits are NOT in the index → receipt omits them → stale-receipt on next check
 *   - this caused ~4 stale-receipt false reds in S088
 *
 * Fix: `node tools/scripts/verify-gate.mjs` (or `pnpm verify:gate`) does:
 *   1. `git add -A` (stage all tracked changes + new files)
 *   2. `node tools/verify.mjs --skip-install --no-cache` (verify with staged index)
 *   3. Leaves changes staged (does NOT commit)
 *   4. Receipt tree_hash now INCLUDES the edits — no stale-receipt on next run
 *
 * Usage:
 *   node tools/scripts/verify-gate.mjs
 *   pnpm verify:gate                        # via package.json script
 *
 * When to use:
 *   - After editing files before a DONE/BUILD-COMPLETE claim
 *   - As the default verify during active build sessions
 *   - Replaces the manual "git add -A && node tools/verify.mjs" habit
 *
 * When NOT to use:
 *   - After a commit (receipt is already fresh; use plain verify)
 *   - When you want to check only committed state (use plain verify)
 *
 * @csps-id csps.scripts.verify-gate
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:script domain:governance audience:ai-agent
 * @csps-enforces PROTO-S088-A4-CS4 B_PRE_CLOSE_VERIFICATION B_DETERMINISTIC_GATE
 * @csps-prevention-class STALE-RECEIPT UNSTAGED-VERIFY RECEIPT-MISMATCH
 * @determinism-exempt: no clock-based decisions. git add -A is idempotent.
 */

import { execSync, spawnSync } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const VERIFY_SCRIPT = join(ROOT, 'tools/verify.mjs');

// ── Argument handling ────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const NO_STAGE = args.includes('--no-stage');   // skip git add (useful for testing)
const VERBOSE  = args.includes('--verbose');
const HELP     = args.includes('--help') || args.includes('-h');

if (HELP) {
  console.log(`
verify-gate.mjs — CS4 STAGE-BEFORE-VERIFY WRAPPER

  node tools/scripts/verify-gate.mjs [options]

Options:
  --no-stage    Skip git add -A (use staged-as-is)
  --verbose     Show git status before staging
  --help, -h    Show this help

What it does:
  1. git add -A          — stage all changes (ensures receipt includes unstaged edits)
  2. node verify.mjs ... — run verify with the updated index
  3. Exit code from verify.mjs is passed through

Why:
  green-receipt tree_hash = git ls-files --stage (the INDEX).
  Running verify without staging means unstaged edits are invisible to the receipt.
  This causes stale-receipt false reds on the NEXT run (receipt shows old tree_hash).

  verify-gate.mjs eliminates this: stage FIRST, then verify = receipt is always current.
`);
  process.exit(0);
}

// ── STEP 1: git add -A ────────────────────────────────────────────────────────
if (!NO_STAGE) {
  try {
    if (VERBOSE) {
      const status = execSync('git status --short', { cwd: ROOT, encoding: 'utf8' });
      if (status.trim()) {
        console.log('[verify-gate] Unstaged changes detected:');
        status.trim().split('\n').forEach(l => console.log(`  ${l}`));
      }
    }
    execSync('git add -A', { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
    console.log('[verify-gate] ✓ git add -A — all changes staged');
  } catch (e) {
    console.error(`[verify-gate] git add -A failed: ${e.message}`);
    // Non-fatal — continue with verify anyway
  }
} else {
  console.log('[verify-gate] --no-stage: skipping git add (using current staged state)');
}

// ── STEP 2: run verify ────────────────────────────────────────────────────────
if (!existsSync(VERIFY_SCRIPT)) {
  console.error(`[verify-gate] verify.mjs not found at ${VERIFY_SCRIPT}`);
  process.exit(1);
}

console.log('[verify-gate] Running: node tools/verify.mjs --skip-install --no-cache');
const result = spawnSync(
  process.execPath,
  [VERIFY_SCRIPT, '--skip-install', '--no-cache'],
  { cwd: ROOT, encoding: 'utf8', stdio: 'inherit' }
);

// ── STEP 3: pass through exit code ────────────────────────────────────────────
const exitCode = result.status ?? 1;
if (exitCode === 0) {
  console.log('[verify-gate] ✓ verify:gate PASSED — receipt tree_hash includes all staged changes');
} else {
  console.error(`[verify-gate] ✗ verify:gate FAILED — exit_code=${exitCode}`);
}

process.exit(exitCode);
