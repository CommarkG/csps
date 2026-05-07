#!/usr/bin/env node
/**
 * validate-audit-slug-coverage.mjs — every active validator has a registered audit slug
 *
 * ROOT CAUSE TARGETED: Phase 9 validators were added to pnpm verify without registering
 * audit slugs in audit-runner.md. This validator prevents that gap from recurring.
 *
 * What it checks:
 *   For every tools/validators/validate-*.mjs file, verify a matching audit slug exists
 *   in docs/plan/pillar-0-governance/audit-runner.md.
 *   "Matching" = slug name derived from filename (validate-X.mjs → slug `X`).
 *
 * Derived slug conventions (per audit-runner.md naming patterns):
 *   validate-aap-frontmatter.mjs       → aap_frontmatter_coverage OR agent-alignment-coverage
 *   validate-frontmatter.mjs           → frontmatter_validate (verify.mjs cycle name)
 *   validate-principle-slices.mjs      → principle-slices-sync OR principle_slices_sync
 *   validate-token-budget.mjs          → token-budget-validate-all-modes
 *   validate-corespine-depth-markers.mjs → corespine-hub-depth-markers
 *
 * EXIT-CODED: 0 = all validators registered / 1 = orphan validator found
 * ADVISORY WINDOW: warn-only; strict mode (--strict) exits 2
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const VALIDATORS_DIR = join(ROOT, 'tools/validators');
const AUDIT_RUNNER_PATH = join(ROOT, 'docs/plan/pillar-0-governance/audit-runner.md');
const STRICT = process.argv.includes('--strict');

// Known slug mappings where filename → slug isn't a simple transform
const KNOWN_MAPPINGS = {
  'validate-aap-frontmatter': ['aap_frontmatter_coverage', 'agent-alignment-coverage', 'aap-9-field-coverage'],
  'validate-frontmatter': ['frontmatter_validate', 'frontmatter-validate'],
  'validate-principle-slices': ['principle-slices-sync', 'principle_slices_sync'],
  'validate-behavioral-contract-slices': ['behavioral_contract_slices_sync', 'behavioral-contract-slices-sync'],
  'validate-audit-runner-slices': ['audit_runner_slices_sync', 'audit-runner-slices-sync'],
  'validate-ai-behavior-spine-slices': ['ai_behavior_spine_slices_sync', 'ai-behavior-spine-slices-sync'],
  'validate-principle-count-staleness': ['principle_count_staleness', 'principle-count-staleness'],
  'validate-token-budget': ['token-budget-validate-all-modes', 'token_budget_validate'],
  'validate-corespine-depth-markers': ['corespine-hub-depth-markers', 'corespine_depth_markers'],
  'validate-audit-slug-coverage': ['audit-slug-coverage', 'validator-to-audit-slug-orphan-detection'],
  'validate-topic-plan-progress': ['topic-plan-progress', 'topic_plan_progress'],
  'validate-plan-know-how': ['plan-know-how', 'plan_know_how', 'know-how-consultation'],
  'validate-git-pushed-state': ['git-pushed-state', 'git_pushed_state'],
  'validate-intake-event': ['intake-event-schema-validation', 'intake-event', 'intake_event_validate'],
  'validate-source-class-coverage': ['intake-source-class-coverage', 'source-class-coverage', 'intake_source_class_coverage'],
  'validate-rzf-evidence': ['rzf-evidence', 'rzf_evidence', 'nominal-rzf-detection'],
  'validate-slice-freshness': ['slice-freshness', 'slice_freshness', 'slice-drift-detection'],
  'validate-no-implementation-without-plan': ['no-implementation-without-plan', 'no_implementation_without_plan', 'construction-gate'],
  'validate-impl-status': ['impl-status', 'impl_status', 'implementation-quality-state-machine'],
  'validate-moat-coverage': ['moat-coverage', 'moat_coverage', 'moat-element-audit-coverage'],
  'validate-import-quarantine': ['import-quarantine', 'import_quarantine'],
  'validate-nothing-stands-alone': ['nothing-stands-alone', 'nothing_stands_alone', 'nothing-stands-alone-audit'],
  'validate-council-coverage': ['council-coverage', 'council_coverage'],
  'validate-universal-alignment': ['universal-alignment', 'universal_alignment', 'universal-alignment-gate'],
  'validate-inner-ai-defaults-freshness': ['ai-defaults-freshness', 'ai_defaults_freshness', 'inner-ai-defaults-freshness'],
  'validate-model-tier-currency': ['model-tier-currency', 'model_tier_currency', 'tier-registry-currency'],
  'validate-session-receipt': ['session-receipt', 'session_receipt', 'receipt-chain-validation'],
  'validate-catch-completeness': ['catch-completeness', 'catch_completeness', 'catch-to-ep-completeness'],
  'validate-foundation-schema-drift': ['foundation-slices-schema-drift', 'foundation-schema-drift', 'foundation_schema_drift'],
  'validate-bedrock': ['bedrock', 'bedrock-completion', 'bedrock_completion'],
};

function validatorBasename(filename) {
  return basename(filename, '.mjs');
}

function deriveSlugs(baseName) {
  if (KNOWN_MAPPINGS[baseName]) return KNOWN_MAPPINGS[baseName];
  // Generic: strip 'validate-' prefix → derive slug
  const slug = baseName.replace(/^validate-/, '');
  return [slug, slug.replace(/-/g, '_'), slug.replace(/_/g, '-')];
}

async function main() {
  if (!existsSync(VALIDATORS_DIR) || !existsSync(AUDIT_RUNNER_PATH)) {
    console.error('[validate-audit-slug-coverage] FATAL: validators dir or audit-runner.md not found');
    process.exit(1);
  }

  const validatorFiles = readdirSync(VALIDATORS_DIR)
    .filter(f => f.startsWith('validate-') && f.endsWith('.mjs'));

  const auditRunnerText = readFileSync(AUDIT_RUNNER_PATH, 'utf8');

  const errors = [];
  const warnings = [];
  const checked = [];

  for (const vf of validatorFiles) {
    const baseName = validatorBasename(vf);
    const slugCandidates = deriveSlugs(baseName);
    const found = slugCandidates.some(slug =>
      auditRunnerText.includes(`\`${slug}\``) || auditRunnerText.includes(`'${slug}'`)
    );

    checked.push({ file: vf, slugCandidates, found });

    if (!found) {
      warnings.push(
        `ORPHAN validator: ${vf} — no matching audit slug in audit-runner.md\n` +
        `  Expected one of: ${slugCandidates.map(s => `\`${s}\``).join(' / ')}\n` +
        `  Fix: add row to audit-runner.md per audit-row.template.md then re-run`
      );
    }
  }

  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} warning(s) — orphan validators detected:`);
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
  }

  const summary = `[validate-audit-slug-coverage] validators_checked=${checked.length} orphans=${warnings.length} registered=${checked.length - warnings.length}`;
  console.log(`\n${summary}`);

  if (warnings.length > 0 && STRICT) process.exit(2);
  if (warnings.length > 0) process.exit(1);
  process.exit(0);
}

main().catch(err => {
  console.error('[validate-audit-slug-coverage] fatal:', err);
  process.exit(1);
});
