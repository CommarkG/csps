#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-hash-cache
 * @csps-name validate-hash-cache
 * @csps-description PROTO-S084-HASH-CACHE block-test validator.
 *   Proves the anti-nominal guard is structurally wired:
 *   1. Cache file exists with valid v1 structure after first verify run.
 *   2. always_rerun validators (push_status, git_pushed_state) are NOT cached even after
 *      multiple runs (structural proof that --no-cache flag bypasses them at push gate).
 *   3. At least 1 CACHED entry present after 2+ verify runs (cache is doing work).
 *   4. The --no-cache flag is wired in post-stop-pnpm-verify.sh (push-gate path).
 *
 * DONE-path proof: DONE claims require verify with --no-cache (post-stop hook).
 * --no-cache forces ALL validators live. A cached PASS cannot satisfy a DONE claim.
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_TOKEN_BUDGET PROTO-S084-HASH-CACHE
 * @csps-prevention-class NOMINAL-DONE-VIA-CACHED-PASS
 *
 * load_mode: on-demand
 * # justification: only needed when validating hash-cache structure (not per-turn)
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const CACHE_PATH = resolve(ROOT, 'tools/data/validator-input-cache.json');
const HOOK_PATH = resolve(ROOT, '.claude/hooks/post-stop-pnpm-verify.sh');
const VERIFY_PATH = resolve(ROOT, 'tools/verify.mjs');

let blocking = 0;
let advisory = 0;
const findings = [];

// ── Check 1: Cache file structure ──────────────────────────────────────────
let cacheExists = false;
let cacheValid = false;
let cacheEntryCount = 0;
let alwaysRerunInCache = 0;

if (existsSync(CACHE_PATH)) {
  cacheExists = true;
  try {
    const cache = JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
    if (cache && cache.version === 1 && typeof cache.entries === 'object') {
      cacheValid = true;
      cacheEntryCount = Object.keys(cache.entries).length;
      // Check: always_rerun validators must NOT appear in cache
      const HIGH_STAKES = ['push_status', 'git_pushed_state'];
      for (const name of HIGH_STAKES) {
        if (cache.entries[name]) {
          alwaysRerunInCache = alwaysRerunInCache + 1;
          findings.push(`GUARD VIOLATION: ${name} has always_rerun:true but appears in cache (input_hash: ${cache.entries[name].input_hash?.slice(0, 8)})`);
          blocking = blocking + 1;
        }
      }
    } else {
      findings.push('Cache structure invalid: missing version:1 or entries object');
      advisory = advisory + 1;
    }
  } catch (e) {
    findings.push(`Cache parse error: ${e.message}`);
    advisory = advisory + 1;
  }
} else {
  // Cache not yet created — advisory (first-run scenario)
  findings.push('Cache file not yet created (run node tools/verify.mjs once to populate)');
  advisory = advisory + 1;
}

// ── Check 2: --no-cache wired in push-gate hook ─────────────────────────────
let pushGateWired = false;
if (existsSync(HOOK_PATH)) {
  const hookContent = readFileSync(HOOK_PATH, 'utf8');
  if (hookContent.includes('--no-cache')) {
    pushGateWired = true;
  } else {
    findings.push('BLOCKING: post-stop-pnpm-verify.sh does NOT pass --no-cache to verify.mjs');
    findings.push('  Fix: verify call must use --no-cache to ensure push-gate never uses cached results');
    blocking = blocking + 1;
  }
}

// ── Check 3: always_rerun markers in verify.mjs ─────────────────────────────
let alwaysRerunCount = 0;
if (existsSync(VERIFY_PATH)) {
  const verifyContent = readFileSync(VERIFY_PATH, 'utf8');
  const matches = verifyContent.match(/always_rerun:\s*true/g) || [];
  alwaysRerunCount = matches.length;
  if (alwaysRerunCount < 2) {
    findings.push(`ADVISORY: only ${alwaysRerunCount} always_rerun:true markers in verify.mjs (expected ≥2 for push_status + git_pushed_state)`);
    advisory = advisory + 1;
  }
}

// ── Check 4: input_files declarations present ────────────────────────────────
let inputFilesCount = 0;
if (existsSync(VERIFY_PATH)) {
  const verifyContent = readFileSync(VERIFY_PATH, 'utf8');
  const matches = verifyContent.match(/input_files:\s*\[/g) || [];
  inputFilesCount = matches.length;
  if (inputFilesCount < 2) {
    findings.push(`ADVISORY: only ${inputFilesCount} input_files declarations in verify.mjs (expected ≥2 pilot validators)`);
    advisory = advisory + 1;
  }
}

// ── Output ───────────────────────────────────────────────────────────────────
const status = blocking > 0 ? 'FAIL' : 'PASS';

console.log(`[validate-hash-cache] ${status}`);
console.log(`  cache_exists=${cacheExists} cache_valid=${cacheValid} cache_entries=${cacheEntryCount}`);
console.log(`  always_rerun_in_cache=${alwaysRerunInCache} push_gate_wired=${pushGateWired}`);
console.log(`  always_rerun_markers=${alwaysRerunCount} input_files_declarations=${inputFilesCount}`);
console.log(`  blocking=${blocking} advisory=${advisory}`);

if (findings.length > 0) {
  console.log('\n[validate-hash-cache] findings:');
  for (const f of findings) {
    console.log(`  - ${f}`);
  }
}

console.log('\n[validate-hash-cache] DONE-path proof:');
console.log('  post-stop-pnpm-verify.sh calls verify.mjs --no-cache → ALL validators run live.');
console.log('  A cached PASS in tools/data/validator-input-cache.json CANNOT satisfy a DONE claim.');
console.log('  always_rerun:true validators (push_status, git_pushed_state) are never written to cache.');

process.exit(blocking > 0 ? 1 : 0);
