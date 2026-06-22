#!/usr/bin/env node
/**
 * validate-threshold-chain.mjs — BLOCKING structural validator for Phase-0.2 chain
 *
 * PROTO-S088-PHASE-0.2 | S088
 * Verifies: (1) chain + decompose scripts exist; (2) chain runs end-to-end on a test input;
 *           (3) chain output has all required fields; (4) CIE insights file has ≥1 entry.
 *
 * BLOCKING if any structural check fails. ADVISORY for non-structural gaps.
 * Writes last-run JSON to tools/data/validate-threshold-chain-last-run.json.
 *
 * @determinism-exempt: new Date().toISOString() is used ONLY to record ran_at metadata
 *   in the last-run JSON output file. The blocking decision (script exists / chain runs /
 *   required fields present / CIE entry exists) is purely deterministic — no clock value
 *   influences whether the validator exits 0 or 1. The timestamp is stored for audit trail
 *   only and never read back in the blocking path.
 *
 * @csps-dna core_spine: VALD
 * @csps-id csps.validators.validate-threshold-chain
 */

import { execSync }     from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, '../..');

const CHAIN_SCRIPT    = join(ROOT, 'tools/scripts/threshold-chain.mjs');
const DECOMPOSE_SCRIPT = join(ROOT, 'tools/scripts/threshold-decompose.mjs');
const CIE_LOG         = join(ROOT, '.csps/intelligence/cie-chain-insights.yaml');
const LAST_RUN        = join(ROOT, 'tools/data/validate-threshold-chain-last-run.json');

// ─── helpers ─────────────────────────────────────────────────────────────────

let blocking = 0, advisory = 0, passes = 0;
const findings = [];

function PASS(msg)  { passes++;   console.log(`  [PASS] ${msg}`); }
function BLOCK(msg) { blocking++; findings.push(`[BLOCKING] ${msg}`); console.log(`  [BLOCKING] ${msg}`); }
function WARN(msg)  { advisory++; findings.push(`[ADVISORY] ${msg}`); console.log(`  [ADVISORY] ${msg}`); }

// ─── CHECK 1: scripts exist ───────────────────────────────────────────────────
function checkScriptsExist() {
  if (existsSync(CHAIN_SCRIPT)) {
    PASS('threshold-chain.mjs exists');
  } else {
    BLOCK('threshold-chain.mjs missing — chain cannot run (tools/scripts/threshold-chain.mjs)');
  }

  if (existsSync(DECOMPOSE_SCRIPT)) {
    PASS('threshold-decompose.mjs exists');
  } else {
    BLOCK('threshold-decompose.mjs missing — decompose step missing (tools/scripts/threshold-decompose.mjs)');
  }
}

// ─── CHECK 2: chain runs end-to-end ──────────────────────────────────────────
function checkChainRunsEndToEnd() {
  if (!existsSync(CHAIN_SCRIPT)) {
    WARN('skip chain run — script missing (CHECK 1 already blocking)');
    return null;
  }

  try {
    // Run a real test input through the chain (dogfood: governor_directive, GVRN, high urgency)
    const out = execSync(
      `node "${CHAIN_SCRIPT}" --content "PROTO-S088-PHASE-0.2 threshold intake chain dogfood test" --session S088-validate --type governor_directive --spine GVRN --urgency high`,
      { cwd: ROOT, encoding: 'utf8', timeout: 15000, stdio: ['pipe', 'pipe', 'pipe'] }
    );

    let parsed;
    try { parsed = JSON.parse(out.trim()); } catch {
      BLOCK(`chain output is not valid JSON: ${out.slice(0, 200)}`);
      return null;
    }

    PASS('chain runs end-to-end (exit 0, valid JSON output)');
    return parsed;
  } catch (e) {
    BLOCK(`chain execution failed: ${String(e.message || e).slice(0, 200)}`);
    return null;
  }
}

// ─── CHECK 3: chain output has all required fields ────────────────────────────
function checkChainOutput(parsed) {
  if (!parsed) {
    WARN('skip output-field checks — chain did not produce output (CHECK 2 blocking)');
    return;
  }

  // Required: type (classify)
  if (parsed.type) {
    PASS(`classify.type present: ${parsed.type}`);
  } else {
    BLOCK('chain output missing classify.type — classification step not wired');
  }

  // Required: active_layers (decompose)
  if (typeof parsed.active_layers === 'number') {
    PASS(`decompose.layers present: ${parsed.active_layers} active layers`);
  } else {
    BLOCK('chain output missing active_layers — decompose step not wired');
  }

  // Required: pe_band (PE-significance)
  if (parsed.pe_band) {
    PASS(`pe_significance.band present: ${parsed.pe_band}`);
  } else {
    BLOCK('chain output missing pe_band — PE-significance step not wired');
  }

  // Required: route
  if (parsed.route) {
    PASS(`route present: ${parsed.route}`);
  } else {
    BLOCK('chain output missing route — routing step not wired');
  }

  // Required: cie_written (CIE write)
  if (parsed.cie_written === true) {
    PASS('cie_written=true — CIE insight was written');
  } else {
    BLOCK('cie_written=false — CIE write step failed or not wired');
  }

  // Advisory: active_layers >= 1 (at least one layer activated for any input)
  if (typeof parsed.active_layers === 'number' && parsed.active_layers >= 1) {
    PASS(`decompose activated ≥1 layer (${parsed.active_layers})`);
  } else {
    WARN('decompose activated 0 layers — decomposition may not be mapping types correctly');
  }
}

// ─── CHECK 4: CIE insights file exists and has entries ───────────────────────
function checkCieInsightsFile() {
  if (!existsSync(CIE_LOG)) {
    BLOCK(`CIE insights file missing: ${CIE_LOG.replace(ROOT, '').replace(/\\/g, '/')}`);
    return;
  }

  const raw = readFileSync(CIE_LOG, 'utf-8').replace(/\r\n/g, '\n');
  const entryCount = (raw.match(/^- id:/gm) || []).length;

  if (entryCount >= 1) {
    PASS(`CIE insights file has ${entryCount} entries`);
  } else {
    BLOCK('CIE insights file exists but has 0 entries — chain CIE-write not firing');
  }
}

// ─── CHECK 5: hook wired (advisory) ──────────────────────────────────────────
function checkHookWired() {
  const hookPath = join(ROOT, '.claude/hooks/user-prompt-submit-intake.sh');
  if (!existsSync(hookPath)) {
    WARN('user-prompt-submit-intake.sh not found — cannot verify hook wiring');
    return;
  }

  const hookContent = readFileSync(hookPath, 'utf-8');
  if (hookContent.includes('threshold-chain.mjs') && hookContent.includes('PHASE-0.2')) {
    PASS('intake hook wired to chain (PHASE-0.2 section present)');
  } else {
    WARN('intake hook does not contain threshold-chain.mjs call — enforcement point missing');
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
console.log('[validate-threshold-chain] Phase-0.2 chain structural validation');
console.log('  BLOCKING checks: scripts exist · chain runs · all fields present · CIE has entries');
console.log('  ADVISORY checks: hook wired');
console.log('');

checkScriptsExist();
const chainOutput = checkChainRunsEndToEnd();
checkChainOutput(chainOutput);
checkCieInsightsFile();
checkHookWired();

console.log('');
console.log(`[validate-threshold-chain] blocking=${blocking} advisory=${advisory} passes=${passes}`);

// Write last-run JSON
const lastRun = {
  ran_at:      new Date().toISOString(),
  blocking,
  advisory,
  passes,
  findings,
  chain_output_sample: chainOutput ? {
    type:          chainOutput.type,
    active_layers: chainOutput.active_layers,
    branches:      chainOutput.branches,
    pe_band:       chainOutput.pe_band,
    route:         chainOutput.route,
    cie_written:   chainOutput.cie_written,
  } : null,
};

try {
  mkdirSync(join(ROOT, 'tools/data'), { recursive: true });
  writeFileSync(LAST_RUN, JSON.stringify(lastRun, null, 2));
} catch { /* non-fatal */ }

process.exit(blocking > 0 ? 1 : 0);
