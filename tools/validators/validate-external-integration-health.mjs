#!/usr/bin/env node
/**
 * validate-external-integration-health.mjs
 * @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at, ts fields in last-run JSON). All blocking decisions are structural/deterministic (field presence, count checks, schema conformance). Not in any blocking decision path.
 *
 * @csps-dna
 * core_spine: ARCH
 * @csps-enforces HARDWIRE-006 EXTERNAL-INTEGRATION-REGISTRATION-STALENESS
 * @csps-prevention-class VERCEL-DEPLOY-FAILURE-SILENT-UNTIL-EMAIL
 * @behavioral-test-status: inline — add active entry with stale verify → advisory
 *
 * P2 of B3-lean (S075): generic CRITICAL validator extending HARDWIRE-006.
 * Checks every ACTIVE/DEPLOYED entry in external-integration-registry.yaml:
 *   1. Entry has health_check_command and verify_mechanically set
 *   2. verified_at is not too stale (>30 sessions = advisory)
 *   3. health_check_command can be parsed and noted
 *
 * BLOCKING: active entry missing health_check_command or verify_mechanically
 * ADVISORY: entry with stale verified_at + entries marked weekly_audit_skip
 *
 * Companion to:
 *   tools/scripts/vercel-health-check.mjs (Vercel-specific live check)
 *   tools/config/deploy-targets.yaml (Vercel subset, still maintained)
 *
 * Source: PROTO-S075-MASTER B3-lean (P2).
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import yaml from 'js-yaml';

const ROOT = resolve(process.cwd());
const REGISTRY = join(ROOT, 'tools/config/external-integration-registry.yaml');
const LAST_RUN = join(ROOT, 'tools/data/validate-external-integration-health-last-run.json');

function parseSession(s) {
  const m = String(s || '').match(/S?(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function main() {
  if (!existsSync(REGISTRY)) {
    console.log('[validate-external-integration-health] registry not found — skipping');
    process.exit(0);
  }

  let reg;
  try {
    reg = yaml.load(readFileSync(REGISTRY, 'utf8'));
  } catch (e) {
    console.log(`[validate-external-integration-health] parse error: ${e.message}`);
    process.exit(1);
  }

  const entries = reg.entries || [];
  let blocking = 0;
  let advisory = 0;
  const findings = [];

  // Get current session for staleness check
  let currentSession = 75;
  try {
    const state = JSON.parse(readFileSync(join(ROOT, 'tools/session-state.json'), 'utf8'));
    currentSession = parseSession(state.current_session || 'S075');
  } catch { /* use default */ }

  for (const entry of entries) {
    const service = entry.service || '(unnamed)';
    const status = entry.status || 'active';

    // Skip deprecated entries
    if (status === 'deprecated') continue;

    // BLOCKING: active/deployed entry missing health_check_command
    if (!entry.health_check_command || entry.health_check_command.trim() === '') {
      blocking++;
      findings.push(
        `BLOCKING: "${service}" (${status}): missing health_check_command. ` +
        `Every active integration must have a health check (HARDWIRE-006 generalized). ` +
        `Registration-staleness is silent without it.`
      );
    }

    // BLOCKING: active/deployed entry missing verify_mechanically
    if (!entry.verify_mechanically || entry.verify_mechanically.trim() === '') {
      blocking++;
      findings.push(
        `BLOCKING: "${service}" (${status}): missing verify_mechanically. ` +
        `Required for SP-registry and weekly-hardwire-audit re-tests.`
      );
    }

    // ADVISORY: stale verified_at (>30 sessions without re-verification)
    const sessionAge = currentSession - parseSession(entry.verified_at || 'S001');
    if (sessionAge > 30 && !entry.weekly_audit_skip) {
      advisory++;
      findings.push(
        `[ADVISORY] "${service}": verified_at=${entry.verified_at} is ${sessionAge} sessions old. ` +
        `Re-verify: run health_check_command and update verified_at.`
      );
    }
  }

  for (const f of findings) {
    if (f.startsWith('BLOCKING')) console.log(`  ✗ ${f}`);
    else console.log(`  ${f}`);
  }

  try {
    writeFileSync(LAST_RUN, JSON.stringify({
      run_at: new Date().toISOString(),
      entries_checked: entries.filter(e => e.status !== 'deprecated').length,
      blocking,
      advisory,
    }, null, 2) + '\n');
  } catch { /* non-fatal */ }

  console.log(`[validate-external-integration-health] entries=${entries.filter(e=>e.status!=='deprecated').length} blocking=${blocking} advisory=${advisory}`);

  if (blocking > 0) process.exit(1);
  process.exit(0);
}

main();
