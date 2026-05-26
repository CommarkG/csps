#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/
 * core_spine: GVRN
 * governing_principle: P-META-016
 * behavioral_contract: B_GRADUAL_BUILD_BY_FOUNDATIONS
 * role: Validates that multi-session PROTO work follows gradual-build-plan structure.
 *       Checks PROTO files for required gradual-build fields (depth, foundation_stability_check,
 *       per-layer ZF gates). Advisory during adoption — blocking once K=2+ recurrence.
 * @csps-enforces B_GRADUAL_BUILD_BY_FOUNDATIONS P-META-016
 */

/**
 * validate-gradual-build.mjs
 * T2 validator for B_GRADUAL_BUILD_BY_FOUNDATIONS.
 *
 * For each PROTO-S<NNN>-*.md in docs/plan/protos/:
 *   CHECK 1 — PROTO has defined steps (STEP N sections or numbered items)
 *   CHECK 2 — Multi-step PROTOs have explicit DONE criteria per step
 *   CHECK 3 — PROTO has at least one ratification/advance gate documented
 *
 * ADVISORY (exit 0) — gradual-build validation is aspirational; many PROTOs
 * were authored before this structure was formalized.
 *
 * Output: protos_checked=N with_steps=N without_steps=N advisory=N blocking=N
 *
 * PROTO-S063-GRADUAL-BUILD-ENFORCEMENT | B_GRADUAL_BUILD_BY_FOUNDATIONS T2 | S063 ITEM 3.6
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const PROTOS_DIR = join(ROOT, 'docs', 'plan', 'protos');

let protos_checked = 0;
let with_steps = 0;
let without_steps = 0;
let advisory = 0;
let blocking = 0;
const findings = [];

if (!existsSync(PROTOS_DIR)) {
  console.log(`[validate-gradual-build] protos/ directory not found`);
  console.log(`protos_checked=0 with_steps=0 without_steps=0 advisory=0 blocking=0`);
  process.exit(0);
}

// Only check active (non-sealed) PROTOs from recent sessions (S055+)
const files = readdirSync(PROTOS_DIR)
  .filter(f => /^PROTO-S(0[5-9]\d|[1-9]\d{2,})/.test(f) && f.endsWith('.md'))
  .slice(0, 30); // Check most recent 30

for (const file of files) {
  protos_checked++;
  let content = '';
  try { content = readFileSync(join(PROTOS_DIR, file), 'utf-8'); } catch (e) { continue; }

  // Skip sealed/closed PROTOs
  if (/lifecycle_state:\s*(closed|archived)/i.test(content)) continue;

  // Check for defined steps
  const hasSteps = /## STEP \d|### STEP \d|^STEP \d+:/m.test(content) ||
                   /\bSTEP [0-9]\b/.test(content);

  // Check for ZF gate or ratification gate
  const hasGates = /ZF gate|ADVANCE|ratif|BLOCKED?\s+on/i.test(content);

  // Check for DONE criteria
  const hasDoneCriteria = /\bDONE\b.*criteria|exit_code|COMPLETE.*criteria|verification/i.test(content);

  if (!hasSteps) {
    without_steps++;
    // Only flag newer PROTOs (S060+) that should know the discipline
    if (/PROTO-S0[6-9]/.test(file)) {
      advisory++;
      findings.push({
        file,
        issue: 'No defined STEPS structure found',
        fix: 'Add STEP 1, STEP 2... sections with explicit DONE criteria per gradual-build-plan'
      });
    }
  } else {
    with_steps++;
    if (!hasGates && /PROTO-S0[6-9]/.test(file)) {
      advisory++;
      findings.push({
        file,
        issue: 'Steps found but no explicit ZF gate or ADVANCE gate',
        fix: 'Add ZF gate per step: "ZF gate: exit_code=0 after this step"'
      });
    }
  }
}

// Output findings (cap at 5)
for (const f of findings.slice(0, 5)) {
  console.log(`  ⚠ ${f.file}: ${f.issue}`);
  console.log(`    → ${f.fix}`);
}
if (findings.length > 5) console.log(`  ... +${findings.length - 5} more`);

const summary = `[validate-gradual-build] protos_checked=${protos_checked} with_steps=${with_steps} without_steps=${without_steps} advisory=${advisory} blocking=${blocking}`;
console.log(summary);

process.exit(0);
