#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-permanence-coverage
 * @csps-name validate-permanence-coverage
 * @csps-description T2 validator: tracks mechanical enforcement coverage across all
 *   behavioral contracts. Scans each B_* slice for T1 (hook), T2 (validator), and T3
 *   (session injection) declarations in the Mechanical surfaces block.
 *   Also checks principles.yaml for enforcement_tier field.
 *   Advisory during adoption period → blocking when coverage drops below threshold.
 *   Produces permanence coverage score surfaced in D1 session-open context.
 *   Design: docs/plan/_handoff/VAULT/inner-ai-defaults/permanence-mechanics.md
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:platform
 * @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE permanence-mechanics.md
 * @csps-ns_quality self-improving, governed-without-rigidity
 *
 * WHAT THIS PREVENTS:
 *   "I wrote the contract" feels permanent. It is not.
 *   A contract without T1+T2+T3 is text. This validator tracks the delta.
 *   Every session: permanence coverage score is visible. Drift is quantified.
 *
 * EXIT: 0 always (ADVISORY during adoption).
 *   Future: exit 1 when coverage drops below 30% with production contracts.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const CONTRACT_SLICES_DIR = join(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts');

// ── Scan behavioral contract slices ──────────────────────────────────────────

let contracts_checked = 0;
let has_t1 = 0;        // has a hook declaration in Mechanical surfaces
let has_t2 = 0;        // has a validator declaration
let has_t3 = 0;        // has schema/memory declaration (T3 = startup awareness path)
let full_trio = 0;     // has T1 + T2 + T3
let t3_only = 0;       // has T3 but not T1 or T2
let partial = 0;       // has some but not all
let no_enforcement = 0; // no mechanical surfaces block at all

const missing_t1 = [];
const missing_t2 = [];
const t3_only_list = [];

try {
  if (!existsSync(CONTRACT_SLICES_DIR)) {
    console.warn('[validate-permanence-coverage] Contract slices dir not found: ' + CONTRACT_SLICES_DIR);
    process.exit(0);
  }

  const files = readdirSync(CONTRACT_SLICES_DIR)
    .filter(f => f.match(/^B_.*\.md$/));

  for (const file of files) {
    const content = readFileSync(join(CONTRACT_SLICES_DIR, file), 'utf8');
    const contractName = basename(file, '.md');
    contracts_checked++;

    // T1: hook declaration — look for `.claude/hooks/` or "hook:" in Mechanical surfaces
    const hasHookDecl = /\.claude\/hooks\/[^\s)]+\.sh/i.test(content) ||
      /- hook:.*\.(sh|mjs)/.test(content) ||
      /- T1:/.test(content);

    // T2: validator declaration — look for validate-*.mjs or validator slug in backticks
    const hasValidatorDecl = /validate-[a-z-]+\.mjs/i.test(content) ||
      /`[a-z][a-z-]+`/.test(content) && /validator/i.test(content) ||
      /- T2:/.test(content) ||
      /- validator/i.test(content);

    // T3: schema/memory/startup — session awareness path
    const hasT3Decl = /- schema:/i.test(content) ||
      /- memory:/i.test(content) ||
      /session-open-context/i.test(content) ||
      /startup\.template/i.test(content) ||
      /- T3:/.test(content) ||
      /feedback_.*\.md/i.test(content);

    // Has mechanical surfaces section at all?
    const hasMechanicalSection = /mechanical surfaces/i.test(content) ||
      /enforcement_trio/i.test(content);

    if (!hasMechanicalSection) {
      no_enforcement++;
      missing_t1.push(contractName);
      missing_t2.push(contractName);
      continue;
    }

    if (hasHookDecl) has_t1++;
    if (hasValidatorDecl) has_t2++;
    if (hasT3Decl) has_t3++;

    const isFullTrio = hasHookDecl && hasValidatorDecl && hasT3Decl;
    const isT3Only = !hasHookDecl && !hasValidatorDecl && hasT3Decl;
    const isPartial = !isFullTrio && !isT3Only && hasMechanicalSection;

    if (isFullTrio) full_trio++;
    else if (isT3Only) { t3_only++; t3_only_list.push(contractName); }
    else if (isPartial) partial++;

    if (!hasHookDecl) missing_t1.push(contractName);
    if (!hasValidatorDecl) missing_t2.push(contractName);
  }
} catch (e) {
  console.warn('[validate-permanence-coverage] Scan error: ' + e.message);
  process.exit(0);
}

// ── Principles enforcement_tier check ────────────────────────────────────────

let principles_checked = 0;
let principles_with_enforcement_tier = 0;

try {
  const principlesPath = join(ROOT, 'packages/principles/principles.yaml');
  if (existsSync(principlesPath)) {
    const raw = readFileSync(principlesPath, 'utf8');
    const allPrinciples = raw.split(/\n- id:/).slice(1);
    principles_checked = allPrinciples.length;
    principles_with_enforcement_tier = allPrinciples.filter(p => /enforcement_tier:/i.test(p)).length;
  }
} catch { /* principles unavailable */ }

// ── Coverage calculations ─────────────────────────────────────────────────────

const coverage_pct = contracts_checked > 0
  ? Math.round((full_trio / contracts_checked) * 100)
  : 0;

const t1_coverage_pct = contracts_checked > 0
  ? Math.round((has_t1 / contracts_checked) * 100)
  : 0;

const t2_coverage_pct = contracts_checked > 0
  ? Math.round((has_t2 / contracts_checked) * 100)
  : 0;

// ── Output ────────────────────────────────────────────────────────────────────

const warnings = [];
const errors = [];

// Advisory: contracts with no enforcement at all
if (no_enforcement > 5) {
  warnings.push(
    `${no_enforcement}/${contracts_checked} contracts have NO mechanical surfaces section. ` +
    'Add enforcement_trio or Mechanical surfaces to each. ' +
    'Permanence-mechanics.md: contract without T1+T2+T3 is text, not governance.'
  );
}

// Advisory: T2 coverage below 50%
if (t2_coverage_pct < 50) {
  warnings.push(
    `T2 coverage: ${t2_coverage_pct}% (${has_t2}/${contracts_checked} contracts have named validators). ` +
    'Validators are the minimum viable enforcement. ' +
    'K≥2 for this gap would block. First 5 missing T2: ' +
    missing_t2.slice(0, 5).join(', ')
  );
}

// Advisory: T1 coverage below 25%
if (t1_coverage_pct < 25) {
  warnings.push(
    `T1 hook coverage: ${t1_coverage_pct}% (${has_t1}/${contracts_checked} contracts have named pre-tool hooks). ` +
    'T1 is the ONLY enforcement that prevents violations BEFORE they enter the codebase. ' +
    'Without T1: the rule is aspirational.'
  );
}

if (warnings.length > 0) {
  console.warn('\nAdvisory:');
  warnings.forEach(w => console.warn('  ⚠ ' + w));
}

const summary = [
  '[validate-permanence-coverage]',
  `  contracts_checked=${contracts_checked}`,
  `  full_trio=${full_trio} (${coverage_pct}% T1+T2+T3 coverage)`,
  `  has_t1=${has_t1} (${t1_coverage_pct}%)  has_t2=${has_t2} (${t2_coverage_pct}%)  has_t3=${has_t3}`,
  `  t3_only=${t3_only}  partial=${partial}  no_enforcement=${no_enforcement}`,
  `  principles_checked=${principles_checked}  with_enforcement_tier=${principles_with_enforcement_tier}`,
  `  advisory=${warnings.length} | blocking=${errors.length}`,
].join('\n');

if (errors.length > 0) {
  errors.forEach(e => console.error('  ✗ ' + e));
  console.error(summary);
  process.exit(1);
}

console.log(summary);
process.exit(0);
