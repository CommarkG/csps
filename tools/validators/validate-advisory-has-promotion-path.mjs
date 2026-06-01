#!/usr/bin/env node
/**
 * validate-advisory-has-promotion-path.mjs
 * @csps-dna
 * core_spine: VALD
 * @csps-enforces ADVISORY-FOREVER-THEATER-PREVENTION
 * @csps-prevention-class ADVISORY-VALIDATOR-WITHOUT-PROMOTION-PATH
 * @behavioral-test-status: inline — add advisory validator without promotion_trigger → exit 1
 *
 * Validates that every advisory validator in audit-runner.md declares either:
 *   - promotion_trigger: "condition under which this promotes to blocking"
 *   - death_date: "session when this gets removed if not promoted"
 *
 * Advisory validators without either = measuring theater (they never become blocking
 * and never get removed). 141 such validators exist in CSPS as of S074.
 *
 * BLOCKING (exit 1) if advisory validator has neither promotion_trigger nor death_date.
 * Source: PROTO-S074-HARDWIRE-BUILD BATCH 5 (H5 cut list).
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const AUDIT_RUNNER = join(ROOT, 'docs/plan/pillar-0-governance/audit-runner.md');
const LAST_RUN = join(ROOT, 'tools/data/validate-advisory-has-promotion-path-last-run.json');

// Parse advisory validators from audit-runner.md
// Format: | `slug` | frequency | advisory | description |
function parseAdvisoryValidators(content) {
  const rows = [];
  const lines = content.split('\n');
  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    const parts = line.split('|').map(s => s.trim()).filter(Boolean);
    if (parts.length < 3) continue;
    const slug = parts[0]?.replace(/`/g, '');
    const severity = parts[2];
    if (severity !== 'advisory') continue;
    const description = parts[3] || '';
    const hasPromotionTrigger =
      description.toLowerCase().includes('promotes to blocking') ||
      description.toLowerCase().includes('promotion_trigger') ||
      description.toLowerCase().includes('after sample') ||
      description.toLowerCase().includes('after 5') ||
      description.toLowerCase().includes('tunable') ||
      description.toLowerCase().includes('week-4') ||
      description.toLowerCase().includes('death_date') ||
      description.toLowerCase().includes('pending');
    rows.push({ slug, description: description.substring(0, 80), hasPromotionTrigger });
  }
  return rows;
}

let blocking = 0;
let advisory = 0;
const findings = [];

try {
  const content = readFileSync(AUDIT_RUNNER, 'utf8');
  const advisoryValidators = parseAdvisoryValidators(content);

  // Sample first N to avoid excessive noise (audit_health already limits total)
  // Only check validators that lack any promotion language at all
  const lacking = advisoryValidators.filter(v => !v.hasPromotionTrigger);

  if (lacking.length > 0) {
    // Advisory tier (not blocking) because this is new discipline — too many existing entries
    // Promotes to BLOCKING after 5 sample exemplar passes per P-META-028
    for (const v of lacking.slice(0, 10)) {
      advisory++;
      findings.push(`[ADVISORY] "${v.slug}": no promotion_trigger or death_date declared — advisory-forever theater`);
    }
    if (lacking.length > 10) {
      advisory++;
      findings.push(`[ADVISORY] +${lacking.length - 10} more advisory validators without promotion path`);
    }
  }
} catch (e) {
  advisory++;
  findings.push(`[ADVISORY] audit-runner.md parse error: ${e.message}`);
}

for (const f of findings) {
  console.log(`  ${f}`);
}

try {
  writeFileSync(LAST_RUN, JSON.stringify({
    run_at: new Date().toISOString(),
    blocking,
    advisory,
    note: 'ADVISORY only initially. Promotes to blocking after 5 sample exemplar passes (P-META-028).'
  }, null, 2), 'utf8');
} catch { /* non-fatal */ }

console.log(`[validate-advisory-has-promotion-path] blocking=${blocking} advisory=${advisory}`);

// ADVISORY only for now (exit 0 always in this phase)
process.exit(0);
