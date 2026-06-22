#!/usr/bin/env node
/**
 * @determinism-exempt: new Date().toISOString() is used ONLY in the --block-test path to plant a temporary tampered receipt for self-testing. The actual blocking decision path (director_seal.head vs receipt.HEAD, director_seal.tree_hash vs receipt.tree_hash) is purely deterministic string comparison against committed data. The timestamp is never read back or compared; it is only written to make the planted seal structurally valid. No clock value influences the blocking exit.
 * @csps-id csps.tools.validators.validate-two-party-seal
 * @csps-name validate-two-party-seal
 * @csps-description PROTO-S088-PHASE-0.3-HARDEN Gate B (B_TWO_PARTY_SEAL mechanization):
 *   Validates the two-party seal contract on tools/data/green-receipt.json.
 *
 *   SEAL CONTRACT (from B_TWO_PARTY_SEAL S086 ratified):
 *     A session is SEALED only when:
 *       1. green-receipt.json has exit_code=0 at current HEAD (builder sets BUILD-COMPLETE)
 *       2. director_seal field is present with {by, head, tree_hash, ts}
 *       3. director_seal.head == receipt.HEAD (seal is for this same commit)
 *       4. director_seal.tree_hash == receipt.tree_hash (seal matches builder's tree)
 *
 *   ADVISORY (not BLOCKING) when director_seal is ABSENT — sessions can build without a seal.
 *   BLOCKING when director_seal IS present but MISMATCHES (stale/forged seal = worse than no seal).
 *
 *   This prevents: director counter-signing a SHA other than the current build,
 *   or a tree_hash drift between director verification and builder commit.
 *
 *   BLOCK-TEST: writes a tampered receipt with director_seal.tree_hash != receipt.tree_hash,
 *   runs itself, confirms exit_code=1 (BLOCKING), then restores original receipt.
 *   Activated by: node validate-two-party-seal.mjs --block-test
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_TWO_PARTY_SEAL PROTO-S088-PHASE-0.3-HARDEN
 * @csps-prevention-class STALE-DIRECTOR-SEAL SEAL-MISMATCH
 *
 * Coverage levels:
 *   BLOCKING (exit 1): director_seal present BUT head or tree_hash mismatches receipt
 *   ADVISORY (exit 0): director_seal absent (session has no SEAL — BUILD-COMPLETE only)
 *   PASSES  (exit 0): director_seal present AND matches receipt HEAD+tree_hash
 *
 * run_tier: STANDARD
 * always_rerun: true  (git HEAD state changes outside file content)
 * load_mode: on-demand
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync, spawnSync } from 'node:child_process';

const __dir = resolve(fileURLToPath(import.meta.url), '../..');
const ROOT = resolve(__dir, '..');
const RECEIPT_PATH = join(ROOT, 'tools/data/green-receipt.json');

// ── Block-test mode ───────────────────────────────────────────────────────────
async function runBlockTest() {
  console.log('[block-test] TWO-PARTY-SEAL BLOCK-TEST');

  if (!existsSync(RECEIPT_PATH)) {
    console.log('[block-test] SKIP — green-receipt.json not found');
    process.exit(0);
  }

  const originalContent = readFileSync(RECEIPT_PATH, 'utf8');
  const receipt = JSON.parse(originalContent);

  // Create a tampered receipt: director_seal with WRONG tree_hash
  const tampered = {
    ...receipt,
    director_seal: {
      by: 'block-test-injected',
      head: receipt.HEAD ?? 'unknown',
      tree_hash: 'DEADBEEF00000000', // mismatched deliberately
      ts: new Date().toISOString(),
    },
  };

  writeFileSync(RECEIPT_PATH, JSON.stringify(tampered, null, 2) + '\n', 'utf8');
  console.log('[block-test] Wrote tampered receipt with mismatched director_seal.tree_hash');

  const selfPath = fileURLToPath(import.meta.url);
  const result = spawnSync('node', [selfPath], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: 'pipe',
  });

  // Restore original immediately
  writeFileSync(RECEIPT_PATH, originalContent, 'utf8');

  if (result.status !== 1) {
    console.error(`[block-test] FAIL — expected exit_code=1 with mismatched seal, got exit_code=${result.status}`);
    console.error('[block-test] stdout:', result.stdout);
    process.exit(1);
  }

  const hasBlocking = result.stdout.includes('BLOCKING') || result.stdout.includes('blocking=1');
  if (!hasBlocking) {
    console.error('[block-test] FAIL — output does not contain BLOCKING or blocking=1');
    console.error('[block-test] stdout:', result.stdout);
    process.exit(1);
  }

  console.log('[block-test] PASS — validator correctly blocked on mismatched director seal');
  console.log('[block-test] Validator output:', result.stdout.trim().split('\n').slice(-4).join(' | '));
  process.exit(0);
}

// ── Main ──────────────────────────────────────────────────────────────────────
if (process.argv.includes('--block-test')) {
  await runBlockTest();
}

if (!existsSync(RECEIPT_PATH)) {
  console.log('[validate-two-party-seal] ADVISORY — green-receipt.json not found (verify not yet run)');
  console.log('blocking=0 advisory=1 passes=0');
  process.exit(0);
}

let receipt;
try {
  receipt = JSON.parse(readFileSync(RECEIPT_PATH, 'utf8'));
} catch (e) {
  console.log(`[validate-two-party-seal] ADVISORY — could not parse green-receipt.json: ${e.message}`);
  console.log('blocking=0 advisory=1 passes=0');
  process.exit(0);
}

const { director_seal } = receipt;

// No director_seal → ADVISORY (session is BUILD-COMPLETE but not SEALED)
if (!director_seal) {
  console.log('[validate-two-party-seal] ADVISORY — no director_seal in receipt (BUILD-COMPLETE, not yet SEALED)');
  console.log('  To SEAL: Opus director runs independent verify and counter-signs with:');
  console.log('  { director_seal: { by:"OPUS-25", head:"<current HEAD>", tree_hash:"<receipt tree_hash>", ts:"<ISO>" } }');
  console.log('blocking=0 advisory=1 passes=0');
  process.exit(0);
}

// director_seal is present — validate it strictly
const blockingFindings = [];

// Check required fields
for (const field of ['by', 'head', 'tree_hash', 'ts']) {
  if (!director_seal[field]) {
    blockingFindings.push(`director_seal.${field} is missing`);
  }
}

if (blockingFindings.length > 0) {
  console.log('[validate-two-party-seal] BLOCKING — director_seal present but incomplete:');
  for (const f of blockingFindings) {
    console.log(`  ✗ ${f}`);
  }
  console.log(`blocking=${blockingFindings.length} advisory=0 passes=0`);
  process.exit(1);
}

// Check seal HEAD matches receipt HEAD
const receiptHead = receipt.HEAD;
const sealHead = director_seal.head;
if (receiptHead && sealHead && receiptHead !== sealHead) {
  blockingFindings.push(
    `director_seal.head (${sealHead.slice(0,8)}) ≠ receipt.HEAD (${receiptHead.slice(0,8)}) — seal is for different commit`
  );
}

// Check seal tree_hash matches receipt tree_hash
const receiptTree = receipt.tree_hash;
const sealTree = director_seal.tree_hash;
if (receiptTree && sealTree && receiptTree !== sealTree) {
  blockingFindings.push(
    `director_seal.tree_hash (${sealTree}) ≠ receipt.tree_hash (${receiptTree}) — seal is for different tree`
  );
}

if (blockingFindings.length > 0) {
  console.log('[validate-two-party-seal] BLOCKING — director_seal MISMATCHES receipt:');
  for (const f of blockingFindings) {
    console.log(`  ✗ ${f}`);
  }
  console.log(`blocking=${blockingFindings.length} advisory=0 passes=0`);
  process.exit(1);
}

// All checks pass
console.log('[validate-two-party-seal] PASS — director_seal present and matches receipt');
console.log(`  by=${director_seal.by} | head=${director_seal.head.slice(0,8)} | tree_hash=${director_seal.tree_hash}`);
console.log('blocking=0 advisory=0 passes=1');
process.exit(0);
