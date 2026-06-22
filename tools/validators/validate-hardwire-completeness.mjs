#!/usr/bin/env node
/**
 * validate-hardwire-completeness.mjs
 * @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at, ts fields in last-run JSON). All blocking decisions are structural/deterministic (field presence, count checks, schema conformance). Not in any blocking decision path.
 *
 * @csps-dna
 * core_spine: GVRN
 * @csps-enforces HARDWIRE-PROTOCOL D7-ACTION-BIAS
 * @csps-prevention-class HARDWIRE-DONE-WITHOUT-BLOCK-TEST
 * @behavioral-test-status: inline — add row with empty block_test_output → exit 1
 *
 * Validates that every row in tools/data/hardwire-register.yaml has:
 *   1. All 5 surface fields present (t1_hook, t2_validator, t3_session, sp_registry_entry, audit_runner_row)
 *   2. block_test_output is non-empty (the BLOCKED output was observed and pasted)
 *   3. status: hardwire-done rows have session_sealed set
 *
 * BLOCKING (exit 1) if any hardwire-done row has empty block_test_output.
 * ADVISORY if in-progress row has empty block_test_output (work in flight).
 *
 * Source: PROTO-S074-HARDWIRE-BUILD BATCH 2 (H1).
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import yaml from 'js-yaml';

const ROOT = resolve(process.cwd());
const REGISTER_PATH = join(ROOT, 'tools/data/hardwire-register.yaml');
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-hardwire-completeness-last-run.json');

const REQUIRED_SURFACES = ['t1_hook', 't2_validator', 't3_session', 'sp_registry_entry', 'audit_runner_row'];
const PENDING_SENTINEL = 'PENDING';

function main() {
  if (!existsSync(REGISTER_PATH)) {
    console.log('[validate-hardwire-completeness] register not found — skipping');
    process.exit(0);
  }

  let reg;
  try {
    reg = yaml.load(readFileSync(REGISTER_PATH, 'utf8'));
  } catch (e) {
    console.log(`[validate-hardwire-completeness] parse error: ${e.message}`);
    process.exit(1);
  }

  const rows = reg.rows || [];
  let blocking = 0;
  let advisory = 0;
  const findings = [];

  for (const row of rows) {
    const id = row.id || '(unnamed)';
    const status = row.status || 'in-progress';
    const surfaces = row.surfaces || {};
    const blockTest = row.block_test_output || '';
    const isDone = status === 'hardwire-done';

    // Check surfaces
    for (const surface of REQUIRED_SURFACES) {
      if (!surfaces[surface] || surfaces[surface].toString().trim() === '') {
        if (isDone) {
          blocking++;
          findings.push(`BLOCKING: "${id}" (hardwire-done) — surface "${surface}" is empty`);
        } else {
          advisory++;
          findings.push(`[ADVISORY] "${id}" (in-progress) — surface "${surface}" is empty`);
        }
      }
    }

    // Check block_test_output
    if (!blockTest || blockTest.trim() === '' || blockTest.startsWith(PENDING_SENTINEL)) {
      if (isDone) {
        blocking++;
        findings.push(`BLOCKING: "${id}" (hardwire-done) — block_test_output empty/pending. HARDWIRE-DONE requires pasting the actual BLOCKED output.`);
      } else {
        advisory++;
        findings.push(`[ADVISORY] "${id}" (in-progress) — block_test_output pending (OK while in-progress)`);
      }
    }

    // Check session_sealed for hardwire-done
    if (isDone && !row.session_sealed) {
      advisory++;
      findings.push(`[ADVISORY] "${id}" (hardwire-done) — session_sealed not set`);
    }
  }

  for (const f of findings) {
    if (f.startsWith('BLOCKING')) console.log(`  ✗ ${f}`);
    else console.log(`  ${f}`);
  }

  const lastRun = {
    run_at: new Date().toISOString(),
    rows_checked: rows.length,
    blocking,
    advisory,
  };

  try {
    writeFileSync(LAST_RUN_PATH, JSON.stringify(lastRun, null, 2) + '\n');
  } catch { /* non-fatal */ }

  console.log(`[validate-hardwire-completeness] rows=${rows.length} blocking=${blocking} advisory=${advisory}`);

  if (blocking > 0) process.exit(1);
  process.exit(0);
}

main();
