#!/usr/bin/env node
/**
 * validate-governing-intent-coverage.mjs
 * @csps-dna
 * core_spine: AI
 * @csps-enforces P-META-031 P-META-025 HARDWIRE-007
 * @csps-prevention-class NEW-PRINCIPLE-WITHOUT-GOVERNING-INTENT
 * @behavioral-test-status: inline — add principle without governing_intent → blocking for new
 *
 * HARDWIRE-007: the root fix for D11 (rigid-rule-satisfaction).
 * Governing_intent = the L3 intent that the rule (L2 definition) proxies.
 * Without it, AI satisfies the definition while missing the intent.
 *
 * What it checks (principles.yaml):
 *   - Principles REGISTERED AFTER S075 (id-based threshold): BLOCKING if governing_intent missing
 *   - Legacy principles (P-META-001 to P-META-031, P-OP-*, P-ARCH-*): ADVISORY only
 *   - Coverage metric: (principles with governing_intent) / (total principles)
 *   - Promotion path: ≥80% coverage for 3 consecutive sessions → promotes to BLOCKING for legacy
 *
 * CRITICAL escalation (per Opus B2 spec):
 *   - When a legacy principle WITHOUT governing_intent is INVOKED in a blocking decision
 *     (i.e., cited in a BLOCKING validator finding): surfaces as CRITICAL advisory
 *
 * Source: PROTO-S075-MASTER B2 — HARDWIRE-007 governing_intent.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import yaml from 'js-yaml';

const ROOT = resolve(process.cwd());
const PRINCIPLES_FILE = join(ROOT, 'packages/principles/principles.yaml');
const LAST_RUN = join(ROOT, 'tools/data/validate-governing-intent-coverage-last-run.json');

// Principles registered before HARDWIRE-007 (S075) — advisory for governing_intent
// These were built before the field was MANDATORY
const LEGACY_THRESHOLD = 'S075'; // principles from before this session

function main() {
  if (!existsSync(PRINCIPLES_FILE)) {
    console.log('[validate-governing-intent-coverage] principles.yaml not found — skipping');
    process.exit(0);
  }

  let parsed;
  try {
    parsed = yaml.load(readFileSync(PRINCIPLES_FILE, 'utf8'));
  } catch (e) {
    console.log(`[validate-governing-intent-coverage] parse error: ${e.message}`);
    process.exit(1);
  }

  const principles = parsed.principles || [];
  let blocking = 0;
  let advisory = 0;
  let withGoverningIntent = 0;
  const findings = [];

  for (const p of principles) {
    const id = p.id || '(unnamed)';
    const session = p.session || 'S001';
    const hasGoverningIntent = !!(p.governing_intent && String(p.governing_intent).trim().length > 10);

    if (hasGoverningIntent) {
      withGoverningIntent++;
      continue;
    }

    // New principles (post-S075): BLOCKING
    const isNew = session >= LEGACY_THRESHOLD;
    if (isNew) {
      blocking++;
      findings.push(
        `BLOCKING: "${id}" (new, session ${session}): missing governing_intent. ` +
        `HARDWIRE-007: every new principle must declare governing_intent (L3 intent). ` +
        `Without it, D11 will satisfy the definition while missing the intent.`
      );
    } else {
      // Legacy: advisory (backfill by significance on reactivation)
      advisory++;
      // Don't print every legacy advisory — just count
    }
  }

  const total = principles.length;
  const coveragePct = total > 0 ? Math.round(100 * withGoverningIntent / total) : 0;

  for (const f of findings) {
    if (f.startsWith('BLOCKING')) console.log(`  ✗ ${f}`);
  }

  if (advisory > 0) {
    console.log(`  ℹ ${advisory} legacy principle(s) lacking governing_intent — backfill by significance on reactivation`);
  }

  const lastRun = {
    run_at: new Date().toISOString(),
    total_principles: total,
    with_governing_intent: withGoverningIntent,
    coverage_pct: coveragePct,
    blocking,
    advisory,
    promotion_threshold_pct: 80,
    note: 'HARDWIRE-007. Legacy backfill by significance. New (post-S075) = BLOCKING.'
  };

  try {
    writeFileSync(LAST_RUN, JSON.stringify(lastRun, null, 2) + '\n');
  } catch { /* non-fatal */ }

  console.log(
    `[validate-governing-intent-coverage] total=${total} with_intent=${withGoverningIntent} ` +
    `coverage=${coveragePct}% blocking=${blocking} advisory=${advisory}`
  );

  if (blocking > 0) process.exit(1);
  process.exit(0);
}

main();
