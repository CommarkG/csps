#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/ + PROTO-S066-WAVE-1 Core Seed pattern
 * core_spine: VALD
 * governing_principle: P-META-007
 * behavioral_contract: B_STRUCTURAL_PREVENTION_DISCIPLINE
 * role: Scans ALL PROTO-*.md files in docs/plan/protos/ (not just staged).
 *       Catches PROTOs added before the hook existed. Advisory sweep for historical PROTOs;
 *       BLOCKING for S066+ new PROTOs that should have been gated by the pre-commit hook.
 * @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE P-META-007
 */

/**
 * validate-proto-core-seed.mjs
 * Companion validator for pre-commit-proto-core-seed-mandatory.sh
 * Sweeps all PROTO-*.md, not just staged files.
 *
 * For each PROTO: checks frontmatter (plan_item_id, core_seed_present, gate_tier)
 * and body sections (## Core Seed, ## DONE WHEN, ## ZF gate).
 *
 * Output: protos_checked=N passing=N failing=N advisory=N blocking=N
 * Writes summary to tools/data/validate-proto-core-seed-last-run.json
 *
 * PROTO-S066-WAVE-1 STEP 2 companion validator | S066
 */

import { readdirSync, readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const PROTOS_DIR = join(ROOT, 'docs', 'plan', 'protos');

// Grandfathered PROTOs (pre-hook era) — advisory only, not blocking
const GRANDFATHERED = new Set([
  'PROTO-S052-A.md',
  'PROTO-S062-A.md',
  'PROTO-S062-DEPLOY.md',
  'PROTO-S062-K.md',
  'PROTO-S065-PAP.md',
]);

let protos_checked = 0, passing = 0, failing_advisory = 0, failing_blocking = 0;
const findings = [];

if (!existsSync(PROTOS_DIR)) {
  console.log(`[validate-proto-core-seed] protos/ directory not found`);
  process.exit(0);
}

const files = readdirSync(PROTOS_DIR).filter(f => f.startsWith('PROTO-') && f.endsWith('.md'));

for (const file of files) {
  protos_checked++;
  const content = readFileSync(join(PROTOS_DIR, file), 'utf-8');
  const isGrandfathered = GRANDFATHERED.has(file);

  const missing = [];

  // Frontmatter checks
  if (!/^plan_item_id:/m.test(content)) missing.push('plan_item_id');
  if (!/^core_seed_present:\s*true/m.test(content)) missing.push('core_seed_present: true');
  if (!/^gate_tier:\s*(auto-execute|check-in|full-advance)/m.test(content)) missing.push('gate_tier');

  // Body section checks (case-insensitive per F-NEW-5)
  if (!/^## *core seed/im.test(content)) missing.push('## Core Seed');
  if (!/^## .*(done when)/im.test(content)) missing.push('## DONE WHEN (or ## ... DONE WHEN)');
  if (!/^## *zf( gate)?/im.test(content)) missing.push('## ZF gate');

  if (missing.length === 0) {
    passing++;
  } else if (isGrandfathered) {
    failing_advisory++;
    findings.push({ file, missing, severity: 'ADVISORY', reason: 'grandfathered (pre-hook era)' });
  } else {
    failing_blocking++;
    findings.push({ file, missing, severity: 'BLOCKING', reason: 'new PROTO, must have all required fields' });
  }
}

// Output findings
for (const f of findings) {
  const icon = f.severity === 'BLOCKING' ? '✗' : '⚠';
  console.log(`  ${icon} ${f.file} (${f.reason}): missing ${f.missing.join(', ')}`);
}

const summary = `[validate-proto-core-seed] protos_checked=${protos_checked} passing=${passing} failing_advisory=${failing_advisory} failing_blocking=${failing_blocking}`;
console.log(summary);

// Write last-run JSON
writeFileSync(
  join(ROOT, 'tools', 'data', 'validate-proto-core-seed-last-run.json'),
  JSON.stringify({ protos_checked, passing, failing_advisory, failing_blocking, findings, ran_at: new Date().toISOString() }, null, 2),
  'utf-8'
);

if (failing_blocking > 0) process.exit(1);
process.exit(0);
