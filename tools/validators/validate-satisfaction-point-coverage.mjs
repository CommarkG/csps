#!/usr/bin/env node
/**
 * validate-satisfaction-point-coverage.mjs
 * @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at, ts fields in last-run JSON). All blocking decisions are structural/deterministic (field presence, count checks, schema conformance). Not in any blocking decision path.
 *
 * @csps-dna
 * core_spine: GVRN
 * @csps-enforces D7-ACTION-BIAS HARDWIRE-SATISFACTION-POINT-REQUIRED
 * @csps-prevention-class DONE-WITHOUT-MECHANICAL-SATISFACTION-POINT
 * @behavioral-test-status: inline — add entry with empty verify_mechanically → exit 1
 *
 * Validates that every entry in tools/data/satisfaction-point-registry.yaml has a
 * non-empty, non-descriptive verify_mechanically field.
 *
 * BLOCKING (exit 1) if:
 *   - verify_mechanically is empty/missing
 *   - verify_mechanically contains only description (no shell command pattern)
 *
 * Source: PROTO-S074-HARDWIRE BATCH 1 (H4). Kills D7: "done" = verify_mechanically passes,
 * not "content written."
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import yaml from 'js-yaml';

const ROOT = resolve(process.cwd());
const REGISTRY_PATH = join(ROOT, 'tools/data/satisfaction-point-registry.yaml');
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-satisfaction-point-coverage-last-run.json');

// A verify_mechanically value is "descriptive" (not a command) if it:
// - has no shell operators (node, bash, grep, exit, ||, &&, 2>&1, etc.)
// - looks like a prose description
function isDescriptive(value) {
  if (!value || value.trim() === '') return true;
  const commandPatterns = [/\bnode\b/, /\bgrep\b/, /\bexit\b/, /\bpnpm\b/, /\bbash\b/, /2>&1/, /&&/, /\|\|/, /\$\(/, /process\.exit/];
  return !commandPatterns.some(p => p.test(value));
}

function main() {
  if (!existsSync(REGISTRY_PATH)) {
    console.log('[validate-satisfaction-point-coverage] registry not found — skipping');
    process.exit(0);
  }

  let reg;
  try {
    reg = yaml.load(readFileSync(REGISTRY_PATH, 'utf8'));
  } catch (e) {
    console.log(`[validate-satisfaction-point-coverage] parse error: ${e.message}`);
    process.exit(1);
  }

  const entries = reg.entries || [];
  let blocking = 0;
  let advisory = 0;
  const findings = [];

  for (const entry of entries) {
    const thing = entry.thing || '(unnamed)';
    const vm = entry.verify_mechanically || '';

    if (!vm || vm.trim() === '') {
      blocking++;
      findings.push(`BLOCKING: "${thing}" — verify_mechanically is empty. Add a shell command that exits 0 when SP achieved.`);
    } else if (isDescriptive(vm)) {
      blocking++;
      findings.push(`BLOCKING: "${thing}" — verify_mechanically looks descriptive (no shell command). Must be runnable: exits 0 = SP achieved, exits 1 = not.`);
    }
  }

  for (const f of findings) {
    console.log(`  ✗ ${f}`);
  }

  const lastRun = {
    run_at: new Date().toISOString(),
    entries_checked: entries.length,
    blocking,
    advisory,
  };

  try {
    writeFileSync(LAST_RUN_PATH, JSON.stringify(lastRun, null, 2) + '\n');
  } catch { /* non-fatal */ }

  console.log(`[validate-satisfaction-point-coverage] entries=${entries.length} blocking=${blocking} advisory=${advisory}`);

  if (blocking > 0) process.exit(1);
  process.exit(0);
}

main();
