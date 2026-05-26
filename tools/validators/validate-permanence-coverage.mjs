#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-permanence-coverage
 * @csps-name validate-permanence-coverage
 * @csps-description T2 validator: tracks mechanical enforcement coverage across all
 *   behavioral contracts. FRONTMATTER-FIRST: reads enforcement_trio: YAML block
 *   prepended by migrate-enforcement-trio.mjs (PROTO-S062-A STEP 2). Body-scan
 *   fallback for unmigrated files (advisory only). Reports DUAL METRIC:
 *   frontmatter-canonical (ground truth) vs body-scan (lenient, advisory).
 *   Also checks principles.yaml for enforcement_tier field.
 *   Blocking on regression below canonical baseline. Body-scan advisory only.
 *   Produces permanence coverage score surfaced in D1 session-open context.
 *   Design: docs/plan/_handoff/VAULT/inner-ai-defaults/permanence-mechanics.md
 * @csps-version 2.0.0
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
 * DUAL-METRIC DESIGN (PROTO-S062-A STEP 2 — FINDING-S062-PERMANENCE-DRIFT):
 *   FRONTMATTER-CANONICAL (ground truth): reads enforcement_trio: block.
 *     - full_trio: t1+t2+t3 all status != 'none'
 *     - partial: at least one status='none' (genuine coverage gap)
 *     - no_frontmatter: contract predates migration (body-scan fallback only)
 *   BODY-SCAN (lenient, advisory only): reads prose cross-references.
 *     - Counts hook/validator mentions in body text — over-counts via cross-refs
 *     - Used as fallback for no_frontmatter contracts ONLY
 *     - Historical: was the primary method before PROTO-S062-A STEP 2
 *     - 100% body-scan ≠ 100% actual enforcement — measurement gap documented.
 *
 * BASELINES (post PROTO-S062-A STEP 2 migration):
 *   BASELINE_HAS_FRONTMATTER = 66  (all 66 contracts migrated)
 *   BASELINE_FRONTMATTER_FULL_TRIO = 32  (30 clean-parse + 2 supply-needed)
 *   Blocking: regression below these baselines. Not blocking: partial (status:none
 *   represents genuine coverage gaps to fix in STEP 4+, not validator errors).
 *
 * EXIT: 0 (advisory) unless regression detected below migration baseline.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const CONTRACT_SLICES_DIR = join(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts');

// ── Frontmatter parsing ───────────────────────────────────────────────────────

/**
 * Extract YAML frontmatter section from file content.
 * Returns the string between opening --- and closing ---, or null.
 */
function extractFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  const endIdx = content.indexOf('\n---', 3);
  if (endIdx === -1) return null;
  return content.substring(4, endIdx + 1);
}

/**
 * Parse enforcement_trio block from frontmatter YAML.
 * Returns { t1_status, t2_status, t3_status } or null if no trio block found.
 * Status values: 'active' | 'stub' | 'none' | null (not declared)
 */
function parseEnforcementTrioFM(fm) {
  if (!fm || !/^\s*enforcement_trio:/im.test(fm)) return null;

  function getTierStatus(fm, tier) {
    // Match "  t1:\n" and capture the indented lines following it
    const tierRegex = new RegExp(`(?:^|\\n)[ \\t]+${tier}:\\s*\\n((?:[ \\t]{4}[^\\n]*\\n)*)`, 'm');
    const block = fm.match(tierRegex)?.[1];
    if (!block) return null;
    const status = block.match(/status:\s*(\w+)/)?.[1];
    return status || null;
  }

  const t1_status = getTierStatus(fm, 't1');
  const t2_status = getTierStatus(fm, 't2');
  const t3_status = getTierStatus(fm, 't3');

  // Only return result if at least one tier was found
  if (t1_status === null && t2_status === null && t3_status === null) return null;

  return { t1_status, t2_status, t3_status };
}

// ── Body-scan detection (legacy, advisory only) ───────────────────────────────

function bodyScanHasT1(content) {
  return /\.claude\/hooks\/[^\s)]+\.sh/i.test(content) ||
    /- hook:.*\.(sh|mjs)/.test(content) ||
    /- T1:/.test(content);
}

function bodyScanHasT2(content) {
  return /validate-[a-z-]+\.mjs/i.test(content) ||
    (/`[a-z][a-z-]+`/.test(content) && /validator/i.test(content)) ||
    /- T2:/.test(content) ||
    /- validator/i.test(content);
}

function bodyScanHasT3(content) {
  return /- schema:/i.test(content) ||
    /- memory:/i.test(content) ||
    /session-open-context/i.test(content) ||
    /startup\.template/i.test(content) ||
    /- T3:/.test(content) ||
    /feedback_.*\.md/i.test(content);
}

function bodyScanHasMechanicalSection(content) {
  return /mechanical surfaces/i.test(content) ||
    /enforcement_trio/i.test(content) ||
    /enforcement trio/i.test(content) ||
    /enforcement_tier:/i.test(content) ||
    /\*\*enforcement:\*\*/i.test(content) ||
    /^#+\s*enforcement/im.test(content) ||
    /\*\*enforcement\s+tier\*\*/i.test(content);
}

// ── Scan behavioral contract slices ──────────────────────────────────────────

let contracts_checked = 0;

// FRONTMATTER-CANONICAL counters (ground truth)
let fm_has_trio = 0;         // has enforcement_trio frontmatter block
let fm_full_trio = 0;        // all 3 statuses != 'none'
let fm_partial = 0;          // at least one status='none'
let fm_t1_active = 0;        // t1 status=active or stub
let fm_t2_active = 0;        // t2 status=active or stub
let fm_t3_active = 0;        // t3 status=active or stub
let no_frontmatter = 0;      // no enforcement_trio frontmatter (pre-migration)

// BODY-SCAN counters (advisory, fallback only)
let bs_full_trio = 0;        // body-scan found T1+T2+T3
let bs_has_t1 = 0;
let bs_has_t2 = 0;
let bs_no_enforcement = 0;   // no enforcement section at all (body scan)

const fm_partial_list = [];
const no_frontmatter_list = [];
const fm_t1_none_list = [];
const fm_t2_none_list = [];

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

    // ── PRIMARY: frontmatter-canonical ──────────────────────────────────────
    const fm = extractFrontmatter(content);
    const trio = fm ? parseEnforcementTrioFM(fm) : null;

    if (trio) {
      fm_has_trio++;
      const t1_active = trio.t1_status && trio.t1_status !== 'none';
      const t2_active = trio.t2_status && trio.t2_status !== 'none';
      const t3_active = trio.t3_status && trio.t3_status !== 'none';

      if (t1_active) fm_t1_active++;
      else fm_t1_none_list.push(contractName);

      if (t2_active) fm_t2_active++;
      else fm_t2_none_list.push(contractName);

      if (t3_active) fm_t3_active++;

      if (t1_active && t2_active && t3_active) {
        fm_full_trio++;
      } else {
        fm_partial++;
        fm_partial_list.push(contractName);
      }
    } else {
      // No enforcement_trio frontmatter — fall back to body scan (advisory)
      no_frontmatter++;
      no_frontmatter_list.push(contractName);

      // Body-scan fallback for this contract
      const hasMech = bodyScanHasMechanicalSection(content);
      if (!hasMech) {
        bs_no_enforcement++;
      } else {
        const t1 = bodyScanHasT1(content);
        const t2 = bodyScanHasT2(content);
        const t3 = bodyScanHasT3(content);
        if (t1) bs_has_t1++;
        if (t2) bs_has_t2++;
        if (t1 && t2 && t3) bs_full_trio++;
      }
    }
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
    const allPrinciples = raw.split(/\n  - id:/).slice(1);
    principles_checked = allPrinciples.length;
    principles_with_enforcement_tier = allPrinciples.filter(p => /enforcement_tier:/i.test(p)).length;
  }
} catch { /* principles unavailable */ }

// ── Coverage calculations ─────────────────────────────────────────────────────

const fm_full_trio_pct = contracts_checked > 0
  ? Math.round((fm_full_trio / contracts_checked) * 100)
  : 0;

const fm_has_trio_pct = contracts_checked > 0
  ? Math.round((fm_has_trio / contracts_checked) * 100)
  : 0;

const fm_t1_pct = contracts_checked > 0
  ? Math.round((fm_t1_active / contracts_checked) * 100)
  : 0;

const fm_t2_pct = contracts_checked > 0
  ? Math.round((fm_t2_active / contracts_checked) * 100)
  : 0;

// Legacy body-scan score (inclusive of body-scan fallbacks + migrated contracts)
// For contracts WITH frontmatter: use frontmatter status to determine T1/T2/T3
// For contracts WITHOUT frontmatter: use body-scan results
const bs_legacy_t1 = fm_t1_active + bs_has_t1;
const bs_legacy_t2 = fm_t2_active + bs_has_t2;
const bs_legacy_full_trio = fm_full_trio + bs_full_trio;
const bs_legacy_full_trio_pct = contracts_checked > 0
  ? Math.round((bs_legacy_full_trio / contracts_checked) * 100)
  : 0;

// ── Baselines (post PROTO-S062-A STEP 2 migration) ───────────────────────────
// These are set after the S062 migration — do not reduce them without Opus ratification.
// BASELINE_HAS_FRONTMATTER: all 66 contracts migrated → enforcement_trio frontmatter present.
//   Any drop = a contract lost its frontmatter block (regression, BLOCKING).
// BASELINE_FRONTMATTER_FULL_TRIO: 32 contracts with all 3 tiers non-none after S062 migration.
//   Any drop = a migrated contract regressed (BLOCKING).
// BASELINE_NO_ORPHANS: 0 contracts with no enforcement section (body or frontmatter).
//   Any increase = new orphan shipped (BLOCKING).
const BASELINE_HAS_FRONTMATTER = 66;
const BASELINE_FRONTMATTER_FULL_TRIO = 32;
const BASELINE_NO_ORPHANS = 0;

// ── Output ────────────────────────────────────────────────────────────────────

const warnings = [];
const errors = [];

// BLOCKING: regression — enforcement_trio frontmatter lost from a contract
if (fm_has_trio < BASELINE_HAS_FRONTMATTER) {
  const dropped = BASELINE_HAS_FRONTMATTER - fm_has_trio;
  errors.push(
    `BLOCKING: enforcement_trio frontmatter REGRESSED — ${dropped} contract(s) lost their ` +
    `canonical frontmatter block (baseline: ${BASELINE_HAS_FRONTMATTER}, current: ${fm_has_trio}). ` +
    'Run migrate-enforcement-trio.mjs --apply to restore. ' +
    `Contracts without frontmatter: ${no_frontmatter_list.join(', ')}`
  );
}

// BLOCKING: regression — full_trio canonical count dropped
if (fm_full_trio < BASELINE_FRONTMATTER_FULL_TRIO) {
  const dropped = BASELINE_FRONTMATTER_FULL_TRIO - fm_full_trio;
  errors.push(
    `BLOCKING: frontmatter-canonical full_trio REGRESSED — ${dropped} contract(s) dropped below ` +
    `migration baseline (baseline: ${BASELINE_FRONTMATTER_FULL_TRIO}, current: ${fm_full_trio}). ` +
    'A previously clean contract lost its T1/T2/T3 declarations.'
  );
}

// BLOCKING: new orphan contracts (no enforcement section at all)
const total_no_enforcement = bs_no_enforcement;
if (total_no_enforcement > BASELINE_NO_ORPHANS) {
  errors.push(
    `BLOCKING: ${total_no_enforcement} contract(s) have NO enforcement declaration ` +
    `(baseline: ${BASELINE_NO_ORPHANS}). ` +
    `New orphans: ${total_no_enforcement - BASELINE_NO_ORPHANS} contract(s) shipped without enforcement. ` +
    'Fix: run migrate-enforcement-trio.mjs --apply on new contracts.'
  );
}

// ADVISORY: contracts with no frontmatter (pre-migration, using body-scan fallback)
if (no_frontmatter > 0) {
  warnings.push(
    `[ADVISORY] ${no_frontmatter} contract(s) have no enforcement_trio frontmatter ` +
    '(using body-scan fallback — lenient measurement). ' +
    'Run migrate-enforcement-trio.mjs --apply to migrate: ' +
    no_frontmatter_list.join(', ')
  );
}

// ADVISORY: partial frontmatter (status:none for at least one tier)
if (fm_partial > 0) {
  warnings.push(
    `[ADVISORY] ${fm_partial} contract(s) have partial enforcement_trio frontmatter ` +
    '(at least one tier status=none — genuine coverage gap, not a migration error). ' +
    'These require STEP 4 (generic T1 hook) or STEP 6 (T3 session-open injection) ' +
    `to resolve. Contracts: ${fm_partial_list.slice(0, 8).join(', ')}` +
    (fm_partial_list.length > 8 ? ` ... +${fm_partial_list.length - 8} more` : '')
  );
}

// ADVISORY: T2 canonical coverage below 50%
const fm_t2_canonical_pct = contracts_checked > 0
  ? Math.round((fm_t2_active / contracts_checked) * 100) : 0;
if (fm_t2_canonical_pct < 50) {
  warnings.push(
    `[ADVISORY] T2 canonical coverage: ${fm_t2_canonical_pct}% ` +
    `(${fm_t2_active}/${contracts_checked} with active/stub validator in frontmatter). ` +
    'Validators are minimum viable enforcement. ' +
    `Top-5 missing T2: ${fm_t2_none_list.slice(0, 5).join(', ')}`
  );
}

// ADVISORY: T1 canonical coverage below 25%
const fm_t1_canonical_pct = contracts_checked > 0
  ? Math.round((fm_t1_active / contracts_checked) * 100) : 0;
if (fm_t1_canonical_pct < 25) {
  warnings.push(
    `[ADVISORY] T1 hook canonical coverage: ${fm_t1_canonical_pct}% ` +
    `(${fm_t1_active}/${contracts_checked} with active/stub hook in frontmatter). ` +
    'T1 is the ONLY enforcement that prevents violations before they enter the codebase. ' +
    `Top-5 missing T1: ${fm_t1_none_list.slice(0, 5).join(', ')}`
  );
}

if (warnings.length > 0) {
  console.warn('\n[validate-permanence-coverage] Advisory:');
  warnings.forEach(w => console.warn('  ⚠ ' + w));
}

const summary = [
  '[validate-permanence-coverage]',
  `  FRONTMATTER-CANONICAL (ground truth, post PROTO-S062-A migration):`,
  `    has_trio=${fm_has_trio}/${contracts_checked} (${fm_has_trio_pct}% with enforcement_trio frontmatter)`,
  `    full_trio=${fm_full_trio} (${fm_full_trio_pct}% T1+T2+T3 all active/stub — CANONICAL SCORE)`,
  `    partial=${fm_partial} (at least one status=none — genuine coverage gap)`,
  `    t1_active=${fm_t1_active} (${fm_t1_pct}%)  t2_active=${fm_t2_active} (${fm_t2_pct}%)  t3_active=${fm_t3_active}`,
  `    no_frontmatter=${no_frontmatter} (pre-migration, using body-scan fallback)`,
  `  BODY-SCAN LEGACY (lenient, advisory — over-counts via cross-references):`,
  `    bs_full_trio_effective=${bs_legacy_full_trio} (${bs_legacy_full_trio_pct}% — do NOT use as coverage target)`,
  `  BASELINE: has_frontmatter=${BASELINE_HAS_FRONTMATTER}  full_trio_canonical=${BASELINE_FRONTMATTER_FULL_TRIO}`,
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
