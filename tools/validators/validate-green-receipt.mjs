#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-green-receipt
 * @csps-name validate-green-receipt
 * @csps-description B_DETERMINISTIC_GATE item 3 (PROTO-S086-CLOSE):
 *   Validates that any "green claim" (DONE/COMPLETE/RATIFIED/verify exit_code=0)
 *   cites a HEAD that matches the current green-receipt in tools/data/green-receipt.json.
 *
 *   verify.mjs writes a green-receipt when it exits 0:
 *     { HEAD, exit_code, blocking_set_hash, ts }
 *
 *   This validator checks:
 *   1. tools/data/green-receipt.json exists (advisory if missing)
 *   2. The HEAD in the receipt matches `git rev-parse HEAD` (current commit)
 *      → BLOCKING if HEAD mismatch: the receipt is for a different commit than what's
 *        currently on disk. This means verify ran on different code than the claims cite.
 *   3. The receipt exit_code is 0 (BLOCKING if receipt says exit_code=1)
 *
 *   WHEN TO RUN: run as part of session-close gate / HANDOFF pre-flight.
 *   At every verify run, the receipt is refreshed IF exit_code=0.
 *   If this validator is BLOCKING: run `node tools/verify.mjs --skip-install` first.
 *
 *   always_rerun: true (git HEAD state changes outside file content)
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_DETERMINISTIC_GATE PROTO-S086-CLOSE
 * @csps-prevention-class STALE-GREEN-CLAIM
 *
 * Coverage Levels:
 *   BLOCKING (exit 1): HEAD mismatch (receipt is stale) or receipt exit_code=1
 *   ADVISORY (exit 0): receipt file missing (verify not yet run this session)
 *
 * run_tier: STANDARD
 * always_rerun: true
 * load_mode: on-demand
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const RECEIPT_PATH = join(ROOT, 'tools/data/green-receipt.json');

let blocking = 0;
let advisory = 0;

// ── 1. Check receipt exists ──────────────────────────────────────────────────
if (!existsSync(RECEIPT_PATH)) {
  console.log('[validate-green-receipt] PASS (advisory)');
  console.log('  blocking=0 advisory=1');
  console.log('  ADVISORY: tools/data/green-receipt.json not found — run `node tools/verify.mjs --skip-install` to create it');
  process.exit(0);
}

let receipt;
try {
  receipt = JSON.parse(readFileSync(RECEIPT_PATH, 'utf-8'));
} catch (e) {
  console.error('[validate-green-receipt] FAIL');
  console.error(`  blocking=1 advisory=0`);
  console.error(`  BLOCKING: green-receipt.json is invalid JSON: ${e.message}`);
  process.exit(1);
}

// ── 2. Check receipt exit_code ───────────────────────────────────────────────
if (receipt.exit_code !== 0) {
  console.error('[validate-green-receipt] FAIL');
  console.error(`  blocking=1 advisory=0`);
  console.error(`  BLOCKING: green-receipt shows exit_code=${receipt.exit_code} — last verify run FAILED. Run verify first.`);
  process.exit(1);
}

// ── 3. Check HEAD match ──────────────────────────────────────────────────────
let currentHead;
try {
  currentHead = execSync('git rev-parse HEAD', { cwd: ROOT, encoding: 'utf-8' }).trim();
} catch (e) {
  console.log('[validate-green-receipt] PASS (advisory)');
  console.log('  blocking=0 advisory=1');
  console.log(`  ADVISORY: could not determine current HEAD (git error: ${e.message})`);
  process.exit(0);
}

if (receipt.HEAD !== currentHead) {
  console.error('[validate-green-receipt] FAIL');
  console.error(`  blocking=1 advisory=0`);
  console.error(`  BLOCKING: HEAD mismatch`);
  console.error(`    receipt HEAD: ${receipt.HEAD?.slice(0, 12)}`);
  console.error(`    current HEAD: ${currentHead.slice(0, 12)}`);
  console.error(`    The green receipt was written for a different commit.`);
  console.error(`    FIX: run \`node tools/verify.mjs --skip-install\` to refresh the receipt for the current HEAD.`);
  process.exit(1);
}

// ── PASS ─────────────────────────────────────────────────────────────────────
console.log('[validate-green-receipt] PASS');
console.log(`  blocking=0 advisory=0`);
console.log(`  HEAD=${currentHead.slice(0, 12)} receipt_ts=${receipt.ts}`);
console.log(`  validators_run=${receipt.validators_run} blocking_set_hash=${receipt.blocking_set_hash}`);
console.log(`[validate-green-receipt] ✓ Green receipt is current for HEAD ${currentHead.slice(0, 8)}`);

process.exit(0);
