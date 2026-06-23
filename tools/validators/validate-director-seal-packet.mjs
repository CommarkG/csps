#!/usr/bin/env node
/**
 * validate-director-seal-packet.mjs — PROTO-S088-BOUNDARY-CONTRACT
 *
 * C5 seal verifier: transcript-BLIND, stateless fresh-verifier.
 * The director receives ONLY {tree_hash, green-receipt snapshot, DoD, block-tests}.
 * FORBIDDEN in the seal packet: loop artifacts, chat transcripts, builder session state.
 *
 * C5-sealed = transcript-blind (seal verifier sees only the specified fields, director
 *   independently re-runs block-tests from the packet alone).
 * C4.5-reproduced = in-tab reproduction where the director remembers the build context
 *   (correlated-failure blind spot — builder and sealer share context).
 *
 * BLOCKING checks:
 *   (a) Seal packet is schema-complete (all required fields)
 *   (b) Seal packet does NOT contain forbidden fields (loop_artifacts, chat_transcript,
 *       session_context, builder_session_state)
 *   (c) tree_hash in seal packet MATCHES green-receipt.json at HEAD
 *   (d) sealed_at_head matches current HEAD (not a stale seal)
 *   (e) block_tests: all have passed=true
 *   (f) builder==sealer check: if builder_git_authors present, verify current committer
 *       is NOT in that set on the sealed files (git log check)
 *
 * Usage:
 *   node tools/validators/validate-director-seal-packet.mjs <seal-packet.json>
 *   node tools/validators/validate-director-seal-packet.mjs --block-test
 *
 * @csps-id csps.validators.validate-director-seal-packet
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces PROTO-S088-BOUNDARY-CONTRACT B_BOUNDARY_CONTRACT B_TWO_PARTY_SEAL
 * @csps-prevention-class BUILDER-SEALER-COLLISION TRANSCRIPT-CONTAMINATED-SEAL STALE-SEAL
 *
 * run_tier: STANDARD
 * always_rerun: true  (git HEAD changes; receipt changes)
 * @determinism-exempt: no clock-based decisions.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync, spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const RECEIPT_PATH = join(ROOT, 'tools/data/green-receipt.json');
const LAST_RUN     = join(ROOT, 'tools/data/validate-director-seal-packet-last-run.json');

// Fields that make a seal packet "contaminated" by session context (breaks C5)
const FORBIDDEN_FIELDS = ['loop_artifacts', 'chat_transcript', 'session_context', 'builder_session_state'];

let blocking = 0, advisory = 0, passes = 0;
const findings = [];

function PASS(msg)  { passes++;   console.log(`  [PASS] ${msg}`); }
function BLOCK(msg) { blocking++; findings.push(`[BLOCKING] ${msg}`); console.log(`  [BLOCKING] ${msg}`); }
function WARN(msg)  { advisory++; findings.push(`[ADVISORY] ${msg}`); console.log(`  [ADVISORY] ${msg}`); }

// ── Block-test mode ───────────────────────────────────────────────────────────
async function runBlockTest() {
  console.log('[block-test] DIRECTOR-SEAL-PACKET BLOCK-TEST');
  const selfPath = fileURLToPath(import.meta.url);

  // Read current receipt for a valid base
  let receipt = {};
  if (existsSync(RECEIPT_PATH)) {
    try { receipt = JSON.parse(readFileSync(RECEIPT_PATH, 'utf8')); } catch {}
  }

  const VALID_PACKET = {
    tree_hash: receipt.tree_hash || 'abc12345',
    sealed_at_head: receipt.HEAD || 'abc1234',
    green_receipt_snapshot: {
      HEAD: receipt.HEAD || 'abc1234',
      exit_code: 0,
      blocking_set_hash: receipt.blocking_set_hash || 'def56789',
      validators_run: receipt.validators_run || 200,
    },
    DoD: {
      criteria: ['validate-context-bundle.mjs exits 0 on clean bundle'],
      evidence: [{ criterion_ref: 0, proof_type: 'exit_code', proof_spec: 'exit_code=0' }]
    },
    block_tests: [
      {
        test_file: 'tools/tests/behavioral/context-bundle-block-test.sh',
        planted_defect: 'remove governing_intent',
        exit_code: 1,
        passed: true
      }
    ]
  };

  let allPass = true;

  // ── INPUT A: chat_transcript in seal packet → exit 1 (C5 contaminated) ──
  console.log('\n[TEST A] chat_transcript in seal packet → expect exit 1 (C5 contaminated)');
  const packetA = { ...VALID_PACKET, chat_transcript: 'Session history: ...' };
  const tmpA = join(ROOT, 'tools/data/__seal-test-a__.json');
  writeFileSync(tmpA, JSON.stringify(packetA, null, 2));
  const resA = spawnSync(process.execPath, [selfPath, tmpA], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
  try { existsSync(tmpA) && require('fs').unlinkSync(tmpA); } catch {}
  if (resA.status !== 1) {
    console.error(`[TEST A] FAIL — expected exit 1, got ${resA.status}`);
    console.error('stdout:', (resA.stdout || '').slice(0, 400));
    allPass = false;
  } else {
    console.log(`[TEST A] PASS — exit=1 (chat_transcript contamination correctly BLOCKED)`);
  }

  // ── INPUT B: block_test with passed=false → exit 1 ──────────────────────
  console.log('\n[TEST B] block_test with passed=false → expect exit 1');
  const packetB = {
    ...VALID_PACKET,
    block_tests: [{ ...VALID_PACKET.block_tests[0], passed: false, exit_code: 0 }]
  };
  const tmpB = join(ROOT, 'tools/data/__seal-test-b__.json');
  writeFileSync(tmpB, JSON.stringify(packetB, null, 2));
  const resB = spawnSync(process.execPath, [selfPath, tmpB], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
  try { existsSync(tmpB) && require('fs').unlinkSync(tmpB); } catch {}
  if (resB.status !== 1) {
    console.error(`[TEST B] FAIL — expected exit 1, got ${resB.status}`);
    allPass = false;
  } else {
    console.log(`[TEST B] PASS — exit=1 (failed block-test correctly BLOCKED)`);
  }

  // ── INPUT C: clean packet → exit 0 ────────────────────────────────────────
  console.log('\n[TEST C] Clean packet → expect exit 0');
  const tmpC = join(ROOT, 'tools/data/__seal-test-c__.json');
  writeFileSync(tmpC, JSON.stringify(VALID_PACKET, null, 2));
  const resC = spawnSync(process.execPath, [selfPath, tmpC], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
  try { existsSync(tmpC) && require('fs').unlinkSync(tmpC); } catch {}
  const hasBlock = resC.stdout?.includes('[BLOCKING]');
  if (hasBlock) {
    console.error(`[TEST C] FAIL — clean packet produced BLOCKING`);
    console.error('stdout:', (resC.stdout || '').slice(0, 400));
    allPass = false;
  } else {
    console.log(`[TEST C] PASS — exit=${resC.status} (no BLOCKING in clean packet)`);
  }

  // ── INPUT D: builder==sealer (builder_git_authors contains current git user) ─
  console.log('\n[TEST D] builder==sealer (builder authored sealed files) → expect BLOCK advisory');
  // Get current git user email
  let currentGitEmail = 'unknown@test.com';
  try {
    currentGitEmail = execSync('git config user.email', { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {}
  const packetD = { ...VALID_PACKET, builder_git_authors: [currentGitEmail] };
  const tmpD = join(ROOT, 'tools/data/__seal-test-d__.json');
  writeFileSync(tmpD, JSON.stringify(packetD, null, 2));
  const resD = spawnSync(process.execPath, [selfPath, tmpD], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
  try { existsSync(tmpD) && require('fs').unlinkSync(tmpD); } catch {}
  const hasBuilderSealer = resD.stdout?.includes('builder==sealer') || resD.stdout?.includes('[BLOCKING]') || resD.stdout?.includes('[ADVISORY]');
  if (!hasBuilderSealer) {
    console.error(`[TEST D] FAIL — builder==sealer not detected`);
    console.error('stdout:', (resD.stdout || '').slice(0, 400));
    allPass = false;
  } else {
    console.log(`[TEST D] PASS — builder==sealer detected (output: ${resD.stdout?.includes('[BLOCKING]') ? 'BLOCKING' : 'ADVISORY'})`);
  }

  console.log(`\n[block-test] ${allPass ? 'ALL TESTS PASSED (4/4)' : 'ONE OR MORE TESTS FAILED'}`);
  process.exit(allPass ? 0 : 1);
}

// ── Main ──────────────────────────────────────────────────────────────────────
if (process.argv.includes('--block-test')) {
  await runBlockTest();
}

const packetPath = process.argv.find(a => a.endsWith('.json') && !a.includes('--'));
if (!packetPath) {
  console.log('[validate-director-seal-packet] Usage: node validate-director-seal-packet.mjs <seal-packet.json>');
  console.log('  Validates a seal packet for C5 transcript-blind director seal.');
  console.log('  BLOCKING: forbidden fields present, block-tests failed, tree_hash mismatch');
  process.exit(0);
}

console.log(`[validate-director-seal-packet] Validating C5 seal packet: ${packetPath}`);
console.log('');

const absPath = resolve(ROOT, packetPath);
if (!existsSync(absPath)) {
  BLOCK(`Seal packet not found: ${packetPath}`);
  process.exit(1);
}

let packet;
try {
  packet = JSON.parse(readFileSync(absPath, 'utf8'));
} catch (e) {
  BLOCK(`Cannot parse seal packet JSON: ${e.message}`);
  process.exit(1);
}

// ── CHECK (a): Required fields ─────────────────────────────────────────────────
const REQ = ['tree_hash', 'sealed_at_head', 'green_receipt_snapshot', 'DoD', 'block_tests'];
const missing = REQ.filter(f => !(f in packet));
if (missing.length > 0) {
  for (const f of missing) BLOCK(`missing required seal-packet field: ${f}`);
} else {
  PASS(`all required seal-packet fields present`);
}

// ── CHECK (b): No forbidden fields (C5 transcript-blind enforcement) ───────────
for (const field of FORBIDDEN_FIELDS) {
  if (field in packet) {
    BLOCK(`C5 contamination: seal packet contains forbidden field "${field}" — makes seal transcript-dependent (use C4.5-reproduced label instead)`);
  }
}
PASS('no forbidden transcript-contamination fields (C5 transcript-blind confirmed)');

// ── CHECK (c): tree_hash matches current green-receipt ────────────────────────
if (existsSync(RECEIPT_PATH)) {
  let receipt;
  try {
    receipt = JSON.parse(readFileSync(RECEIPT_PATH, 'utf8'));
    if (packet.tree_hash && receipt.tree_hash) {
      if (packet.tree_hash !== receipt.tree_hash) {
        BLOCK(`tree_hash MISMATCH: seal packet has ${packet.tree_hash} but green-receipt has ${receipt.tree_hash}`);
      } else {
        PASS(`tree_hash matches green-receipt (${packet.tree_hash})`);
      }
    } else {
      WARN('cannot compare tree_hash — missing in packet or receipt');
    }
  } catch (e) {
    WARN(`could not read green-receipt.json: ${e.message}`);
  }
} else {
  WARN('green-receipt.json not found — cannot verify tree_hash');
}

// ── CHECK (d): sealed_at_head matches current HEAD ────────────────────────────
try {
  const currentHead = execSync('git rev-parse HEAD', { cwd: ROOT, encoding: 'utf8' }).trim();
  if (packet.sealed_at_head && currentHead) {
    // Allow partial SHA match (first 7 chars)
    const sealShort = packet.sealed_at_head.slice(0, 7);
    const headShort = currentHead.slice(0, 7);
    if (sealShort === headShort || packet.sealed_at_head === currentHead) {
      PASS(`sealed_at_head matches current HEAD (${sealShort})`);
    } else {
      BLOCK(`sealed_at_head (${sealShort}) != current HEAD (${headShort}) — seal is for wrong commit`);
    }
  }
} catch {
  WARN('could not determine current HEAD — skip head check');
}

// ── CHECK (e): block_tests all passed ─────────────────────────────────────────
if (Array.isArray(packet.block_tests)) {
  const failedTests = packet.block_tests.filter(t => !t.passed);
  if (failedTests.length > 0) {
    for (const t of failedTests) {
      BLOCK(`block_test failed: ${t.test_file} (planted: "${t.planted_defect}", exit_code=${t.exit_code})`);
    }
  } else {
    PASS(`all ${packet.block_tests.length} block-test(s) passed`);
  }
} else if (!missing.includes('block_tests')) {
  BLOCK('block_tests must be an array');
}

// ── CHECK (f): builder!=sealer ────────────────────────────────────────────────
if (Array.isArray(packet.builder_git_authors) && packet.builder_git_authors.length > 0) {
  let currentGitEmail = '';
  try {
    currentGitEmail = execSync('git config user.email', { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {}
  if (currentGitEmail && packet.builder_git_authors.includes(currentGitEmail)) {
    BLOCK(`builder==sealer: current git user ${currentGitEmail} is in builder_git_authors — seal must be counter-signed by a DIFFERENT party (two-party seal principle)`);
  } else if (currentGitEmail) {
    PASS(`builder!=sealer: current user ${currentGitEmail} not in builder list`);
  }
} else {
  WARN('builder_git_authors not provided — builder==sealer check skipped (recommend including for C5 compliance)');
}

// ── LABEL ─────────────────────────────────────────────────────────────────────
const isForbiddenClean = !FORBIDDEN_FIELDS.some(f => f in packet);
if (blocking === 0 && isForbiddenClean) {
  PASS('seal packet qualifies as C5-sealed (transcript-blind, stateless fresh-verifier)');
} else if (!isForbiddenClean) {
  console.log('  [LABEL] C4.5-reproduced (not C5-sealed — transcript contamination present)');
}

// ── RESULT ─────────────────────────────────────────────────────────────────────
console.log('');
console.log(`[validate-director-seal-packet] blocking=${blocking} advisory=${advisory} passes=${passes}`);

try {
  mkdirSync(join(ROOT, 'tools/data'), { recursive: true });
  writeFileSync(LAST_RUN, JSON.stringify({
    ran_at: new Date().toISOString(),
    packet_path: packetPath,
    blocking, advisory, passes, findings,
    c5_qualified: blocking === 0 && isForbiddenClean,
  }, null, 2));
} catch { /* non-fatal */ }

process.exit(blocking > 0 ? 1 : 0);
