#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-validators
 * @csps-name validate-validators
 * @csps-description VALIDATE-VALIDATORS meta-validator layer (Methodology 5 — Self-Healing).
 * Reads tools/verify-last-run.md (last pnpm verify output) and checks:
 *   1. How many validators are DEFERRED (registered but never run)?
 *   2. How many validators produced empty parse_output (no metrics captured)?
 *   3. How many validators ran with exit_code=0 but produced 0 on ALL numeric fields?
 * Advisory on all three. The gap: a validator can be registered in audit-runner.md,
 * pass with exit_code=0, and still scan nothing — because its path has no matching files
 * or its parse_output regex stopped matching the output format.
 * "Existence ≠ active" (AP-001). This validator enforces it for validators themselves.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces AP-001 B_STRUCTURAL_PREVENTION_DISCIPLINE
 * context_question: "Are there validators registered but not producing metrics? Those are silent failures."
 * Wired: tools/verify.mjs cycle 'validate_validators'
 * Plan item: VALIDATE-VALIDATORS | S055
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const LAST_RUN_FILE = resolve(ROOT, 'tools/verify-last-run.md');

const STANDARD_KEYS = new Set(['name', 'command', 'status', 'exit_code', 'duration_seconds', 'skip_reason', 'tail']);

if (!existsSync(LAST_RUN_FILE)) {
  console.log('[validate-validators] verify-last-run.md not found — run pnpm verify first');
  console.log('[validate-validators] total=0 deferred=0 empty_output=0 zero_numeric=0 blocking=0');
  process.exit(0);
}

const text = readFileSync(LAST_RUN_FILE, 'utf-8');
const jsonMatch = text.match(/```(?:yaml|json)?\n([\s\S]+?)\n```/);

if (!jsonMatch) {
  console.log('[validate-validators] Could not parse verify-last-run.md — no JSON block found');
  console.log('[validate-validators] total=0 deferred=0 empty_output=0 zero_numeric=0 blocking=0');
  process.exit(0);
}

let data;
try {
  data = JSON.parse(jsonMatch[1]);
} catch (e) {
  console.log('[validate-validators] JSON parse error in verify-last-run.md');
  console.log('[validate-validators] total=0 deferred=0 empty_output=0 zero_numeric=0 blocking=0');
  process.exit(0);
}

const cycles = data.pre_close_verification?.cycles ?? [];

const deferred = cycles.filter(c => c.status === 'DEFERRED-WITH-REASON');
const ran = cycles.filter(c => c.status !== 'DEFERRED-WITH-REASON');

// Validators with no parseable metrics (no keys beyond standard set)
const emptyOutput = ran.filter(c => {
  const extraKeys = Object.keys(c).filter(k => !STANDARD_KEYS.has(k));
  return extraKeys.length === 0;
});

// Validators that ran + have numeric fields but ALL are 0 (excluding exit_code, duration)
const zeroNumeric = ran.filter(c => {
  const numericEntries = Object.entries(c).filter(
    ([k, v]) => typeof v === 'number' && k !== 'exit_code' && k !== 'duration_seconds'
  );
  return numericEntries.length > 0 && numericEntries.every(([, v]) => v === 0);
});

let advisory = 0;

if (deferred.length > 0) {
  advisory++;
  console.warn(`[validate-validators] ADVISORY: ${deferred.length} validator(s) DEFERRED (never run last session)`);
  for (const v of deferred) {
    console.warn(`  - ${v.name}: ${v.skip_reason ?? '(no reason)'}`);
  }
}

if (emptyOutput.length > 0) {
  advisory++;
  console.warn(`[validate-validators] ADVISORY: ${emptyOutput.length} validator(s) produced no parseable metrics last run`);
  for (const v of emptyOutput) {
    console.warn(`  - ${v.name} (status=${v.status}, exit_code=${v.exit_code ?? '?'})`);
  }
  console.warn(`  Cause: parse_output regex didn't match validator output, OR validator output changed format`);
  console.warn(`  Fix: review each validator's parse_output function in tools/verify.mjs`);
}

if (zeroNumeric.length > 0) {
  advisory++;
  console.warn(`[validate-validators] ADVISORY: ${zeroNumeric.length} validator(s) ran with all-zero numeric metrics`);
  for (const v of zeroNumeric) {
    const numKeys = Object.entries(v)
      .filter(([k]) => !STANDARD_KEYS.has(k))
      .map(([k, val]) => `${k}=${val}`)
      .join(', ');
    console.warn(`  - ${v.name}: ${numKeys}`);
  }
  console.warn(`  Cause: scan path may have no matching files, OR validator legitimately found 0 items`);
}

console.log(`[validate-validators] total=${cycles.length} deferred=${deferred.length} empty_output=${emptyOutput.length} zero_numeric=${zeroNumeric.length} advisory=${advisory} blocking=0`);
process.exit(0);
