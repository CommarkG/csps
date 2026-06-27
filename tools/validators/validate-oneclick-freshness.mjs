#!/usr/bin/env node
/**
 * validate-oneclick-freshness.mjs — OneClick File Freshness Gate
 *
 * B_ONECLICK_FRESHNESS (S089): .csps/oneclick.md must exist and stay current.
 * Prevents G5 permanence failure: oneclick written in chat → compacted away.
 * New approach: file is machine-generated from git state → committed → permanent.
 *
 * BLOCKING:
 *   .csps/oneclick.md does not exist (session resume is impossible without it)
 *
 * ADVISORY:
 *   oneclick.md HEAD hash does not match current git HEAD (file is stale — run verify again)
 *
 * NEVER BLOCKS:
 *   Content quality (non-structural); generation speed; session number mismatch
 *
 * Block-test: rename .csps/oneclick.md temporarily → expect exit 1.
 *
 * @csps-id csps.validators.validate-oneclick-freshness
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_ONECLICK_FRESHNESS B_SESSION_CONTINUITY
 * @csps-prevention-class G5-PERMANENCE-FAILURE CONTEXT-LOSS COMPACTION-BLINDSPOT
 *
 * run_tier: STANDARD
 * always_rerun: false
 *
 * @determinism-exempt: Date.now() used only for last-run JSON metadata (ran_at timestamp).
 *   All blocking/advisory decisions are purely structural (file existence + HEAD hash match).
 *   No blocking logic depends on current time.
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const ONECLICK = join(ROOT, '.csps/oneclick.md');
const LAST_RUN = join(ROOT, 'tools/data/validate-oneclick-freshness-last-run.json');

let blocking = 0, advisory = 0, passes = 0;
const findings = [];

function PASS(msg)  { passes++;   console.log(`  [PASS] ${msg}`); }
function BLOCK(msg) { blocking++; findings.push(`[BLOCKING] ${msg}`); console.log(`  [BLOCKING] ${msg}`); }
function WARN(msg)  { advisory++; findings.push(`[ADVISORY] ${msg}`); console.log(`  [ADVISORY] ${msg}`); }

console.log('[validate-oneclick-freshness] OneClick file freshness gate');
console.log('');

// ── Check 1: file must exist (BLOCKING) ──────────────────────────────────────

if (!existsSync(ONECLICK)) {
  BLOCK('.csps/oneclick.md does not exist — run: node tools/generate-oneclick.mjs');
} else {
  PASS('.csps/oneclick.md exists');

  // ── Check 2: HEAD in file must match current git HEAD (ADVISORY if stale) ──

  let currentHEAD = 'unknown';
  try {
    currentHEAD = execSync('git rev-parse HEAD', { cwd: ROOT, encoding: 'utf8' }).trim().slice(0, 12);
  } catch { /* non-fatal */ }

  try {
    const content = readFileSync(ONECLICK, 'utf8');
    // File stores HEAD as: <!-- Source: git HEAD=<12chars> | ... -->  or HEAD = <12chars>
    const fileHEAD = content.match(/HEAD=([a-f0-9]{8,40})/)?.[1]?.slice(0, 12) ?? null;

    if (!fileHEAD) {
      WARN('.csps/oneclick.md: could not parse HEAD hash from file — may be malformed');
    } else if (fileHEAD !== currentHEAD) {
      WARN(`.csps/oneclick.md is stale: file HEAD=${fileHEAD} but current HEAD=${currentHEAD} — run: node tools/generate-oneclick.mjs (or run verify twice)`);
    } else {
      PASS(`.csps/oneclick.md is current (HEAD=${currentHEAD})`);
    }

    // ── Check 3: file must have paste-ready block ──────────────────────────────

    if (!content.includes('continuation (post-compact resume)') && !content.includes('Paste the block below')) {
      WARN('.csps/oneclick.md: paste-ready block missing or malformed — regenerate: node tools/generate-oneclick.mjs');
    } else {
      PASS('.csps/oneclick.md: paste-ready block present');
    }
  } catch (e) {
    WARN(`.csps/oneclick.md: could not read file — ${e.message}`);
  }
}

// ── RESULT ────────────────────────────────────────────────────────────────────

console.log('');
console.log(`[validate-oneclick-freshness] blocking=${blocking} advisory=${advisory} passes=${passes}`);

try {
  mkdirSync(join(ROOT, 'tools/data'), { recursive: true });
  writeFileSync(LAST_RUN, JSON.stringify({
    ran_at: new Date().toISOString(),
    blocking, advisory, passes, findings,
    oneclick_exists: existsSync(ONECLICK),
  }, null, 2));
} catch { /* non-fatal */ }

process.exit(blocking > 0 ? 1 : 0);
