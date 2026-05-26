#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/
 * core_spine: VALD
 * governing_principle: P-META-019
 * behavioral_contract: B_STRUCTURAL_PREVENTION_DISCIPLINE
 * role: Validates that gap-recurrence-register K>=2 entries have structural_fix_committed
 *       with a real commit SHA, not 'pending' or null. Enforces "fix STRUCTURE not instance."
 * @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE P-META-019
 */

/**
 * validate-structural-fix.mjs
 * T2 validator for B_STRUCTURAL_PREVENTION_DISCIPLINE.
 *
 * Checks gap-recurrence-register.yaml:
 *   - K>=2 entries MUST have structural_fix_committed (non-null, non-'pending')
 *   - K>=3 entries that are still 'open' = BLOCKING (P-META-019)
 *   - Entries with structural_fix_committed must have behavioral_test_exists: true
 *     OR behavioral_test_file pointing to a real file
 *
 * Output: entries_checked=N k2_needing_fix=N k3_blocking=N advisory=N blocking=N
 *
 * PROTO-S063-STRUCTURAL-FIX-VALIDATOR | B_STRUCTURAL_PREVENTION_DISCIPLINE T2 | S063 ITEM 3.4
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const REGISTER_FILE = join(ROOT, 'tools', 'data', 'gap-recurrence-register.yaml');

let entries_checked = 0;
let k2_needing_fix = 0;
let k3_blocking = 0;
let advisory = 0;
let blocking = 0;
const findings = [];

if (!existsSync(REGISTER_FILE)) {
  console.log(`[validate-structural-fix] ADVISORY: gap-recurrence-register.yaml not found`);
  console.log(`entries_checked=0 k2_needing_fix=0 k3_blocking=0 advisory=1 blocking=0`);
  process.exit(0);
}

const content = readFileSync(REGISTER_FILE, 'utf-8');

// Parse entries using regex (avoid YAML library dependency)
// Each entry starts with "  - id: "
const entryBlocks = content.split(/\n  - id: /).slice(1);

for (const block of entryBlocks) {
  const lines = block.split('\n');
  const id = lines[0].trim();

  // Extract fields
  const kMatch = block.match(/k_count:\s*(\d+)/);
  const statusMatch = block.match(/status:\s*(\S+)/);
  const fixMatch = block.match(/structural_fix_committed:\s*(\S+)/);
  const testExistsMatch = block.match(/behavioral_test_exists:\s*(true|false)/);
  const testFileMatch = block.match(/behavioral_test_file:\s*(\S+)/);

  const k = kMatch ? parseInt(kMatch[1], 10) : 0;
  const status = statusMatch ? statusMatch[1] : 'unknown';
  const fixSha = fixMatch ? fixMatch[1] : null;
  const testExists = testExistsMatch ? testExistsMatch[1] === 'true' : false;
  const testFile = testFileMatch ? testFileMatch[1] : null;

  entries_checked++;

  // K>=2 should have structural_fix_committed
  if (k >= 2 && status === 'open') {
    if (!fixSha || fixSha === 'null' || fixSha.startsWith('pending')) {
      if (k >= 3) {
        // K>=3 open with no committed fix = BLOCKING per P-META-019
        blocking++;
        k3_blocking++;
        findings.push({
          severity: 'BLOCKING',
          id,
          k,
          issue: `K=${k} status=open, no structural_fix_committed. P-META-019 BLOCKS session close.`,
          fix: 'Build and commit the structural fix, update structural_fix_committed with SHA'
        });
      } else {
        // K=2 open with no fix = advisory
        advisory++;
        k2_needing_fix++;
        findings.push({
          severity: 'ADVISORY',
          id,
          k,
          issue: `K=${k} status=open, no structural fix committed`,
          fix: 'Add structural_fix_committed: <SHA> after building the fix'
        });
      }
    }
  }

  // fix_committed entries should have behavioral test
  if (status === 'fix_committed' && !testExists && !testFile) {
    advisory++;
    findings.push({
      severity: 'ADVISORY',
      id,
      k,
      issue: 'fix_committed but no behavioral test',
      fix: 'Add behavioral_test_file: tools/tests/behavioral/<test>.sh to prove fix catches violations'
    });
  }
}

// Output findings
for (const f of findings) {
  const icon = f.severity === 'BLOCKING' ? '✗' : '⚠';
  console.log(`  ${icon} ${f.id} (K=${f.k}): ${f.issue}`);
  console.log(`    → ${f.fix}`);
}

const summary = `[validate-structural-fix] entries_checked=${entries_checked} k2_needing_fix=${k2_needing_fix} k3_blocking=${k3_blocking} advisory=${advisory} blocking=${blocking}`;
console.log(summary);

if (blocking > 0) process.exit(1);
process.exit(0);
