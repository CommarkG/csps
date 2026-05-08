#!/usr/bin/env node
/**
 * validate-moat-coverage.mjs — every moat element has an active recurring audit
 *
 * Per moat-registry.md §2. Checks that all 15 CSPS moat elements have at least
 * one active validator covering them in pnpm verify OR a registered weekly/monthly
 * hook covering them. Surfaces moat elements with no mechanical coverage (audit gap).
 *
 * This is the mechanical enforcement of "every moat element is aligned with CORE
 * via recurring audits" — the unique CSPS property that no competitor can replicate.
 *
 * EXIT-CODED: 0 = all moat elements have coverage / 1 = coverage gaps found
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// Moat element registry with their expected coverage validators
const MOAT_ELEMENTS = [
  {
    id: 'M-01', name: 'Session-as-governed-artifact',
    coverage_validators: ['rzf_evidence', 'session_artifact_sync', 'topic_plan_progress'],
    cadence: 'every-session',
  },
  {
    id: 'M-02', name: 'Behavioral contract system',
    coverage_validators: ['behavioral_contract_slices_sync'],
    cadence: 'every-session',
  },
  {
    id: 'M-03', name: 'Error-pattern learning (EP-NNN)',
    coverage_validators: ['plan_know_how'],
    coverage_hooks: ['cron-weekly-tag-status-deep-audit.sh'],
    cadence: 'weekly',
  },
  {
    id: 'M-04', name: 'Depth-aware knowledge loading',
    coverage_validators: ['slice_freshness', 'principle_slices_sync'],
    cadence: 'every-session',
  },
  {
    id: 'M-05', name: 'Core Spines precedence',
    coverage_validators: ['corespine_depth_markers', 'frontmatter_validate'],
    cadence: 'every-session',
  },
  {
    id: 'M-06', name: 'Construction gate (plan-before-build)',
    coverage_validators: ['no_implementation_without_plan'],
    cadence: 'every-session',
  },
  {
    id: 'M-07', name: 'ZF moat (RZF+CEC+per-session)',
    coverage_validators: ['rzf_evidence'],
    cadence: 'every-session',
  },
  {
    id: 'M-08', name: 'Questions as first-class',
    coverage_hooks: ['cron-weekly-tag-status-deep-audit.sh'],
    cadence: 'weekly',
    advisory: true,  // validate-vault-connections not built yet
  },
  {
    id: 'M-09', name: 'Positive harvest (SG-NNN)',
    coverage_hooks: ['cron-weekly-tag-status-deep-audit.sh'],
    cadence: 'weekly',
    advisory: true,
  },
  {
    id: 'M-10', name: 'Vault methodology',
    coverage_validators: ['session_artifact_sync'],
    cadence: 'every-session',
    advisory: true,  // validate-vault-connections not built yet
  },
  {
    id: 'M-11', name: 'Council + orchestration',
    coverage_validators: ['aap_frontmatter_coverage'],
    cadence: 'every-session',
  },
  {
    id: 'M-12', name: 'Implementation status state machine',
    coverage_validators: ['impl_status'],
    cadence: 'every-session',
  },
  {
    id: 'M-13', name: 'Core Cross-Synergy (CSEP pipeline)',
    coverage_hooks: ['cron-weekly-tag-status-deep-audit.sh'],
    cadence: 'monthly',
    advisory: true,  // validate-csep-coverage not built yet
  },
  {
    id: 'M-14', name: 'System-health organism',
    coverage_validators: ['corespine_depth_markers'],
    coverage_hooks: ['cron-weekly-tag-status-deep-audit.sh'],
    cadence: '4-cadences',
  },
  {
    id: 'M-15', name: 'CORE alignment enforcement',
    coverage_validators: ['corespine_depth_markers', 'frontmatter_validate', 'principle_slices_sync'],
    cadence: 'every-session',
  },
  // S018-S019: New moat elements from Core Alignment sessions
  {
    id: 'M-16', name: 'Gradual Execution Protocol (GEP) — ratification ≠ proven',
    description: 'Every ratified plan requires Stage 1 proof before full-scope. 3-stage: 1-3 cases → 10% → full scope. Iterations are the fast track.',
    coverage_validators: ['behavioral_contract_slices_sync'],  // B_HUMBLE_EXECUTION_PIPELINE
    coverage_hooks: [],
    cadence: 'per-session',
    advisory: true,  // enforcement_stage: planned — promoting to active when validate-execution-stages ships
  },
  {
    id: 'M-17', name: 'Core Dynamic Plan (CDP) — unified lifecycle state machine',
    description: 'Every platform element has cdp_status (raw→sealed), making governance lifecycle queryable and consistent.',
    coverage_validators: ['frontmatter_validate'],  // cdp_status closed enum enforced
    coverage_hooks: [],
    cadence: 'per-session',
    advisory: true,
  },
  {
    id: 'M-18', name: 'Question Protocol — F+C+G+Q full context formula',
    description: 'Questions as encrypted context and intents. Full context only when fundamental data + connections + goal + well-defined questions are all present.',
    coverage_validators: [],  // validate-question-coverage.mjs planned
    coverage_hooks: [],
    cadence: 'per-session',
    advisory: true,
  },
];

function getActiveValidatorsFromVerify() {
  const verifyPath = join(ROOT, 'tools/verify.mjs');
  if (!existsSync(verifyPath)) return new Set();
  const text = readFileSync(verifyPath, 'utf8');
  const names = new Set();
  for (const m of text.matchAll(/name:\s*'([^']+)'/g)) {
    names.add(m[1]);
  }
  return names;
}


async function main() {
  const activeValidators = getActiveValidatorsFromVerify();
  const hooksDir = join(ROOT, '.claude/hooks');
  const activeHooks = new Set(
    existsSync(hooksDir) ? readdirSync(hooksDir).map(h => h) : []
  );

  const warnings = [];
  const advisories = [];
  let covered = 0;

  for (const moat of MOAT_ELEMENTS) {
    const validatorCoverage = (moat.coverage_validators ?? [])
      .some(v => activeValidators.has(v));
    const hookCoverage = (moat.coverage_hooks ?? [])
      .some(h => activeHooks.has(h));

    const hasCoverage = validatorCoverage || hookCoverage;

    if (hasCoverage) {
      covered++;
    } else if (moat.advisory) {
      advisories.push(`[ADVISORY] ${moat.id} ${moat.name}: coverage deferred (validate-vault-connections or CSEP validator not built yet)`);
    } else {
      warnings.push(`[CRITICAL] ${moat.id} ${moat.name}: NO ACTIVE COVERAGE — moat element unchecked!`);
    }
  }

  if (warnings.length > 0) {
    console.error(`\n${warnings.length} CRITICAL gap(s) — moat elements without coverage:`);
    for (const w of warnings) console.error(`  ✗ ${w}`);
  }
  if (advisories.length > 0) {
    console.warn(`\n${advisories.length} advisory gap(s) — deferred coverage:`);
    for (const a of advisories) console.warn(`  ⚠ ${a}`);
  }

  const summary = `[validate-moat-coverage] total=${MOAT_ELEMENTS.length} covered=${covered} critical_gaps=${warnings.length} advisory_gaps=${advisories.length}`;
  console.log(`\n${summary}`);

  if (warnings.length > 0) process.exit(1);
  process.exit(0);
}

main().catch(err => { console.error('[validate-moat-coverage] fatal:', err); process.exit(1); });
