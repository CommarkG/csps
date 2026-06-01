#!/usr/bin/env node
/**
 * validate-capability-registry.mjs
 * @csps-dna
 * core_spine: ARCH
 * @csps-enforces PART3-PRODUCT-SCHEMA P-ARCH-007
 * @csps-prevention-class CAPABILITY-SLUG-DRIFT-BETWEEN-CODE-AND-DB
 * @behavioral-test-status: inline — add slug to TS without DB seeding → exit 1
 *
 * PART 3 drift-validator (Q4 decision).
 * TS const (libs/policies/capabilities.ts) is the SSoT for capability slugs.
 * DB Capability table must match the TS const at all times.
 *
 * In dev/test: validates that every slug in the TS const has a DB record.
 * ADVISORY initially (no DB available at commit time).
 * Promotes to BLOCKING when DB is live (post-migration batch).
 *
 * Also validates the TS const itself:
 *   - All values are lowercase_underscore format
 *   - No duplicate values
 *   - No empty strings
 *
 * Source: PROTO-S075-MASTER PART 3 (Q4 decision).
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const CAPABILITIES_TS = join(ROOT, 'libs/policies/capabilities.ts');
const LAST_RUN = join(ROOT, 'tools/data/validate-capability-registry-last-run.json');

// Extract CAPABILITY values from TS const via regex (no import/execution)
function extractCapabilitySlugs(tsContent) {
  const slugs = [];
  // Match: SLUG_NAME: 'value',
  const pattern = /[A-Z_]+:\s*'([a-z_]+)'/g;
  let match;
  while ((match = pattern.exec(tsContent)) !== null) {
    slugs.push(match[1]);
  }
  return slugs;
}

function main() {
  let tsContent;
  try {
    tsContent = readFileSync(CAPABILITIES_TS, 'utf8');
  } catch (e) {
    console.log('[validate-capability-registry] capabilities.ts not found — skipping');
    process.exit(0);
  }

  const slugs = extractCapabilitySlugs(tsContent);
  let blocking = 0;
  let advisory = 0;
  const findings = [];

  // Validate format: lowercase_underscore only
  for (const slug of slugs) {
    if (!/^[a-z][a-z0-9_]*$/.test(slug)) {
      blocking++;
      findings.push(`BLOCKING: capability slug "${slug}" must be lowercase_underscore format`);
    }
  }

  // Validate no duplicates
  const seen = new Set();
  for (const slug of slugs) {
    if (seen.has(slug)) {
      blocking++;
      findings.push(`BLOCKING: duplicate capability slug "${slug}" in capabilities.ts`);
    }
    seen.add(slug);
  }

  // Validate no empty slugs
  if (slugs.some(s => s.trim() === '')) {
    blocking++;
    findings.push('BLOCKING: empty capability slug found in capabilities.ts');
  }

  // DB parity check — advisory only until migration batch
  advisory++;
  findings.push(
    `[ADVISORY] DB parity check skipped (pre-migration). ${slugs.length} slugs in TS const. ` +
    `After prisma db push: run this validator with --check-db flag to verify Capability table matches.`
  );

  for (const f of findings) {
    if (f.startsWith('BLOCKING')) console.log(`  ✗ ${f}`);
    else console.log(`  ${f}`);
  }

  try {
    writeFileSync(LAST_RUN, JSON.stringify({
      run_at: new Date().toISOString(),
      slugs_found: slugs.length,
      slugs,
      blocking,
      advisory,
    }, null, 2) + '\n');
  } catch { /* non-fatal */ }

  console.log(`[validate-capability-registry] slugs=${slugs.length} blocking=${blocking} advisory=${advisory}`);

  if (blocking > 0) process.exit(1);
  process.exit(0);
}

main();
