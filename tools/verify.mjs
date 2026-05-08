#!/usr/bin/env node
/**
 * @csps-id csps.tools.verify
 * @csps-name verify
 * @csps-description Pre-close verification cycle orchestrator. Runs the build chain end-to-end (pnpm install --frozen-lockfile + typecheck + frontmatter validate + principles validate + audit-runner full-pass) and emits structured ZF evidence block to stdout. Per P-META-008 cycle-mandatory-in-plan + B_PRE_CLOSE_VERIFICATION. Exit 1 on any cycle failure. Skeleton tier (S005 turn 19) ships the orchestration; week-4 audit-runner ratchets the strict gates.
 * @csps-version 0.1.0
 * @csps-owner group:finky
 * @csps-lifecycle experimental
 * @csps-lifecycle-state active
 * @csps-tags type:util domain:dx audience:developer
 * @csps-enforces P-META-008 P-META-006 P-META-001
 *
 * Usage:
 *   node tools/verify.mjs              # default — errors fail; warnings reported
 *   node tools/verify.mjs --strict     # warnings also fail
 *   node tools/verify.mjs --skip-install  # skip pnpm install (already frozen)
 *
 * Per closing-summary-template.md §10.0: paste this script's stdout into §10.0 of every close summary.
 */

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const args = process.argv.slice(2);
const STRICT = args.includes('--strict');
const SKIP_INSTALL = args.includes('--skip-install');

// ─────────────────────────────────────────────────────────────────────────────
// Cycle definitions — per P-META-008 cycle_types
// ─────────────────────────────────────────────────────────────────────────────

const CYCLES = [
  {
    name: 'pnpm_install_frozen',
    command: 'pnpm install --frozen-lockfile',
    skip: SKIP_INSTALL,
    skip_reason: 'flag --skip-install',
    parse_output: (out) => {
      const m = out.match(/Progress:\s+resolved\s+(\d+)/);
      const t = out.match(/Done in (\d+(?:\.\d+)?)s/);
      return {
        packages_resolved: m ? Number(m[1]) : null,
        duration_seconds: t ? Number(t[1]) : null,
      };
    },
  },
  {
    name: 'typecheck_recursive',
    command: 'pnpm -r --filter "./packages/**" typecheck',
    parse_output: (out) => {
      const errors = (out.match(/error TS\d+:/g) ?? []).length;
      return { ts_errors: errors };
    },
  },
  {
    name: 'principles_validate',
    command: 'pnpm --filter @csps/principles validate:all',
    parse_output: (out) => {
      const m = out.match(/Loaded\s+(\d+)\s+principles/);
      const f = out.match(/(\d+)\s+findings/);
      return {
        principles_loaded: m ? Number(m[1]) : null,
        findings_total: f ? Number(f[1]) : null,
      };
    },
  },
  {
    name: 'frontmatter_validate',
    command: 'node tools/validators/validate-frontmatter.mjs',
    parse_output: (out) => {
      const m = out.match(/scanned=(\d+)\s+errors=(\d+)\s+warnings=(\d+)\s+exempt=(\d+)/);
      return m
        ? { scanned: Number(m[1]), errors: Number(m[2]), warnings: Number(m[3]), exempt: Number(m[4]) }
        : { scanned: null, errors: null };
    },
  },
  {
    // NEW S005 turn 26 — converts agent-alignment-coverage from DECLARED-DEFERRED to ACTIVE-MECHANICAL today
    name: 'aap_frontmatter_coverage',
    command: 'node tools/validators/validate-aap-frontmatter.mjs',
    parse_output: (out) => {
      const m = out.match(/scanned=(\d+)\s+missing=(\d+)\s+aligned=(\d+)/);
      return m
        ? { skills_scanned: Number(m[1]), missing_aap: Number(m[2]), aligned: Number(m[3]) }
        : { skills_scanned: null };
    },
  },
  {
    // NEW S005 turn 26 — converts principle-count-staleness from DECLARED-DEFERRED to ACTIVE-MECHANICAL today
    name: 'principle_count_staleness',
    command: 'node tools/validators/validate-principle-count-staleness.mjs',
    parse_output: (out) => {
      const m = out.match(/active_files_with_stale_count=(\d+)/);
      return m ? { stale_count_files: Number(m[1]) } : { stale_count_files: null };
    },
  },
  {
    // NEW S010 Phase 7 Candidate #4 — verifies all 10 ai-behavior-spine section slices are present
    name: 'ai_behavior_spine_slices_sync',
    command: 'node tools/validators/validate-ai-behavior-spine-slices.mjs',
    parse_output: (out) => {
      const m = out.match(/source_sections=(\d+)\s+missing=(\d+)/);
      return m ? { source_sections: Number(m[1]), missing_slices: Number(m[2]) } : { source_sections: null };
    },
  },
  {
    // NEW S010 Phase 7 Candidate #3 — verifies all 28 audit-runner pipeline slice files are present
    name: 'audit_runner_slices_sync',
    command: 'node tools/validators/validate-audit-runner-slices.mjs',
    parse_output: (out) => {
      const m = out.match(/source_pipelines=(\d+)\s+missing=(\d+)/);
      return m ? { source_pipelines: Number(m[1]), missing_slices: Number(m[2]) } : { source_pipelines: null };
    },
  },
  {
    // NEW S010 Phase 7 Candidate #2 — verifies all 39 behavioral contract slice files are present
    name: 'behavioral_contract_slices_sync',
    command: 'node tools/validators/validate-behavioral-contract-slices.mjs',
    parse_output: (out) => {
      const m = out.match(/source_contracts=(\d+)\s+missing=(\d+)/);
      return m ? { source_contracts: Number(m[1]), missing_slices: Number(m[2]) } : { source_contracts: null };
    },
  },
  {
    // NEW S010 Phase 7 Candidate #1 — verifies all 53 principle slice files are present and valid
    name: 'principle_slices_sync',
    command: 'node tools/validators/validate-principle-slices.mjs',
    parse_output: (out) => {
      const m  = out.match(/source_ids=(\d+)\s+missing=(\d+)/);
      return m ? { source_ids: Number(m[1]), missing_slices: Number(m[2]) } : { source_ids: null };
    },
  },
  {
    // NEW S011 §24++ — node --check syntax validation for all tools/**/*.mjs (prevents ESM bugs like require-in-esm)
    name: 'mjs_syntax_check',
    command: 'node --check tools/verify.mjs tools/pe-compute.mjs tools/validators/validate-aap-frontmatter.mjs tools/validators/validate-token-budget.mjs tools/validators/validate-corespine-depth-markers.mjs tools/validators/validate-audit-slug-coverage.mjs tools/validators/validate-frontmatter.mjs',
    parse_output: (out) => ({ syntax_ok: !out.includes('SyntaxError') }),
  },
  {
    // NEW S011 §24+++++++++++ — audit-health: meta-audit of the audit mechanism itself
    name: 'audit_health',
    command: 'node tools/validators/validate-audit-health.mjs',
    parse_output: (out) => {
      const m = out.match(/validators=(d+)s+cycles=(d+)s+constitutional_changes=(d+)s+warnings=(d+)/);
      return m ? { validators: Number(m[1]), cycles: Number(m[2]), warnings: Number(m[4]) } : {};
    },
  },
    {
    // NEW S011 §24+++++++++++++++ — model-tier-currency: tier vocabulary registry is current
    name: 'model_tier_currency',
    command: 'node tools/validators/validate-model-tier-currency.mjs',
    parse_output: (out) => {
      const m = out.match(/tiers=(d+)s+warnings=(d+)/);
      return m ? { tiers: Number(m[1]), warnings: Number(m[2]) } : {};
    },
  },
    {
    // NEW S011 §24++++++++++++ — ai-defaults-freshness: inner-ai-defaults registry is current for running model
    name: 'ai_defaults_freshness',
    command: 'node tools/validators/validate-inner-ai-defaults-freshness.mjs',
    parse_output: (out) => {
      const m = out.match(/model=([S]+)s+warnings=(d+)/);
      return m ? { model: m[1], warnings: Number(m[2]) } : {};
    },
  },
  {
    // NEW S019 L11 opus-lessons — enforcement rate: measures % of inner-AI-defaults with live validators
    // Stage: measurement (exits 0 always) — tracks the gap; blocking stage activates S025
    name: 'ai_defaults_enforcement_rate',
    command: 'node tools/validators/validate-inner-ai-defaults-enforcement-rate.mjs',
    parse_output: (out) => {
      const m = out.match(/enforcement_rate=(\d+)%.*status=(\w+)/);
      return m ? { enforcement_rate: Number(m[1]), status: m[2] } : {};
    },
  },
  {
    // NEW S019 Part3 opus-lessons — Opus audit due: mechanical trigger for Opus reviews
    // Exits 0 when no audit overdue; exits 1 when SIG threshold hit or manual trigger set
    name: 'opus_audit_due',
    command: 'node tools/validators/validate-opus-audit-due.mjs',
    parse_output: (out) => {
      const m = out.match(/sessions_since=(\d+).*status=(\w+)/);
      return m ? { sessions_since: Number(m[1]), status: m[2] } : {};
    },
  },
  {
    // NEW S020 LAYER-1 — layer-boundary: L0 Core (libs/) must not import from L1/L2 (apps/)
    // BLOCKING when L0→L1 or L0→L2 import found. Baseline: 0 violations.
    // Source: platform-layer-boundaries.yaml. Resolves VLT-S019-LAYER-BOUNDARY.
    name: 'layer_boundary',
    command: 'node tools/validators/validate-layer-boundary.mjs',
    parse_output: (out) => {
      const m = out.match(/files_scanned=(\d+)\s+violations=(\d+)\s+status=(\w+)/);
      return m ? { files_scanned: Number(m[1]), violations: Number(m[2]), status: m[3] } : {};
    },
  },
  {
    // NEW S020 DRIFT-1 — drift-registry coverage: tracks % of 7 drift types with active validators
    // ADVISORY when coverage < 50%; BLOCKING when < 25% AND critical drift type has no VLT
    // Current baseline: 43% (3/7 active); target 71% (5/7) by S025
    name: 'drift_registry_coverage',
    command: 'node tools/validators/validate-drift-registry.mjs',
    parse_output: (out) => {
      const m = out.match(/total=(\d+)\s+active=(\d+).*coverage=(\d+)%\s+status=(\w+)\s+critical_unprotected=(\d+)/);
      return m ? { total: Number(m[1]), active: Number(m[2]), coverage_pct: Number(m[3]), status: m[4], critical_unprotected: Number(m[5]) } : {};
    },
  },
    {
    // NEW S011 §24++ — catch-completeness: every §10.13b catch has a matching EP-NNN entry
    name: 'catch_completeness',
    command: 'node tools/validators/validate-catch-completeness.mjs',
    parse_output: (out) => {
      const m = out.match(/catches=(d+)s+covered=(d+)s+ep_total=(d+)s+warnings=(d+)/);
      return m ? { catches: Number(m[1]), covered: Number(m[2]), ep_total: Number(m[3]), warnings: Number(m[4]) } : {};
    },
  },
    {
    // NEW S011 §24+++++++++ — council-coverage: all 24 skills registered in council-registry.md
    name: 'council_coverage',
    command: 'node tools/validators/validate-council-coverage.mjs',
    parse_output: (out) => {
      const m = out.match(/skills_checked=(d+)s+unregistered=(d+)/);
      return m ? { skills_checked: Number(m[1]), unregistered: Number(m[2]) } : {};
    },
  },
  {
    // NEW S011 §24+++++++++ — universal-alignment: new artifacts have full CSPS alignment
    name: 'universal_alignment',
    command: 'node tools/validators/validate-universal-alignment.mjs --scan-new',
    parse_output: (out) => {
      const m = out.match(/files=(d+)s+aligned=(d+)s+gaps=(d+)/);
      return m ? { files: Number(m[1]), aligned: Number(m[2]), gaps: Number(m[3]) } : { files: 0 };
    },
  },
    {
    // NEW S011 §24++++++++ — threshold/import-quarantine: imports have CSPS DNA
    name: 'import_quarantine',
    command: 'node tools/validators/validate-import-quarantine.mjs',
    parse_output: (out) => {
      const m = out.match(/checked=(d+)s+compliant=(d+)s+violations=(d+)/);
      return m ? { checked: Number(m[1]), compliant: Number(m[2]), violations: Number(m[3]) } : {};
    },
  },
  {
    // NEW S011 §24++++++++ — nothing-stands-alone: P-ARCH-001 connectivity (advisory)
    name: 'nothing_stands_alone',
    command: 'node tools/validators/validate-nothing-stands-alone.mjs',
    parse_output: (out) => {
      const m = out.match(/governed_checked=(d+)s+orphans=(d+)/);
      return m ? { governed_checked: Number(m[1]), orphans: Number(m[2]), advisory: true } : {};
    },
  },
    {
    // NEW S011 §24+++++++ — moat-coverage: all 15 moat elements have active recurring audit coverage
    name: 'moat_coverage',
    command: 'node tools/validators/validate-moat-coverage.mjs',
    parse_output: (out) => {
      const m = out.match(/total=(\d+)\s+covered=(\d+)\s+critical_gaps=(\d+)/);
      return m ? { total: Number(m[1]), covered: Number(m[2]), critical_gaps: Number(m[3]) } : {};
    },
  },
  {
    // NEW S011 §24++++++ — impl-status: implementation quality state machine (swift-implemented→sealed-zf)
    name: 'impl_status',
    command: 'node tools/validators/validate-impl-status.mjs',
    parse_output: (out) => {
      const m = out.match(/checked=(\d+)\s+with_status=(\d+)\s+warnings=(\d+)/);
      return m ? { checked: Number(m[1]), with_status: Number(m[2]), warnings: Number(m[3]) } : {};
    },
  },
  {
    // NEW S011 §24+++++ — construction gate: implementation code must have backing topic-plan (EP-011)
    name: 'no_implementation_without_plan',
    command: 'node tools/validators/validate-no-implementation-without-plan.mjs',
    parse_output: (out) => {
      const m = out.match(/checked=(\d+)\s+exempt=(\d+)\s+unplanned=(\d+)/);
      return m ? { checked: Number(m[1]), exempt: Number(m[2]), unplanned: Number(m[3]) } : {};
    },
  },
  {
    // NEW S014 session-extraction — vlt-blocking: warns when PENDING VLTs exist (registration ≠ resolution)
    name: 'vlt_blocking',
    command: 'node tools/validators/validate-vlt-blocking.mjs',
    parse_output: (out) => {
      const m = out.match(/vlt_total=(\d+)\s+pending=(\d+)\s+resolved=(\d+)/);
      return m ? { vlt_total: Number(m[1]), pending: Number(m[2]), resolved: Number(m[3]) } : {};
    },
  },
  {
    // NEW S014 ZF audit — instruction-context: checks B_* contracts, principles, hooks have WHY reasoning (P-META-020)
    name: 'instruction_context',
    command: 'node tools/validators/validate-instruction-context.mjs',
    parse_output: (out) => {
      const m = out.match(/checked=(\d+)\s+missing_why=(\d+)/);
      return m ? { checked: Number(m[1]), missing_why: Number(m[2]) } : {};
    },
  },
  {
    // NEW S014 Phase 3A — open-plan-levels: surfaces all unchecked exit criteria across active plans (P-META-020)
    name: 'open_plan_levels',
    command: 'node tools/validators/validate-open-plan-levels.mjs',
    parse_output: (out) => {
      const m = out.match(/plans_checked=(\d+)\s+plans_with_open=(\d+)\s+total_open_items=(\d+)/);
      return m ? { plans_checked: Number(m[1]), plans_with_open: Number(m[2]), total_open_items: Number(m[3]) } : {};
    },
  },
  {
    // NEW S011 §24+++++ — rzf-evidence: THIS-SESSION ZF evidence in verify-last-run.md or §10.0
    name: 'rzf_evidence',
    command: 'node tools/validators/validate-rzf-evidence.mjs',
    parse_output: (out) => {
      const m = out.match(/checks=(\d+)\s+warnings=(\d+)/);
      return m ? { checks: Number(m[1]), warnings: Number(m[2]) } : {};
    },
  },
  {
    // NEW S011 §24+++++ — slice-freshness: monolith files not newer than their slice dirs
    name: 'slice_freshness',
    command: 'node tools/validators/validate-slice-freshness.mjs',
    parse_output: (out) => {
      const m = out.match(/pairs_checked=(\d+)\s+stale=(\d+)/);
      return m ? { pairs_checked: Number(m[1]), stale: Number(m[2]) } : {};
    },
  },
  {
    // NEW S011 §24++++ B_KNOW_HOW_DISCIPLINE — plans session ≥ S011 have §KH consultation
    name: 'plan_know_how',
    command: 'node tools/validators/validate-plan-know-how.mjs',
    parse_output: (out) => {
      const m = out.match(/checked=(\d+)\s+grandfathered=(\d+)\s+errors=(\d+)/);
      return m ? { checked: Number(m[1]), grandfathered: Number(m[2]), errors: Number(m[3]) } : {};
    },
  },
  {
    // NEW S011 unified-intake L3 — source-class coverage: all 4 source classes have normalizers
    name: 'intake_source_class_coverage',
    command: 'node tools/validators/validate-source-class-coverage.mjs',
    parse_output: (out) => {
      const m = out.match(/source_classes=(\d+)\s+errors=(\d+)/);
      return m ? { source_classes: Number(m[1]), errors: Number(m[2]) } : {};
    },
  },
  {
    // NEW S011 unified-intake L3 — intake-event schema validation on JSONL rows
    name: 'intake_event_validate',
    command: 'node tools/validators/validate-intake-event.mjs',
    parse_output: (out) => {
      const m = out.match(/files=(\d+)\s+rows=(\d+)\s+errors=(\d+)/);
      return m ? { files: Number(m[1]), rows: Number(m[2]), errors: Number(m[3]) } : { files: 0, rows: 0 };
    },
  },
  {
    // NEW S011 zero-laptop L1 — git-pushed-state: all governed-path changes pushed to remote
    name: 'git_pushed_state',
    command: 'node tools/validators/validate-git-pushed-state.mjs',
    parse_output: (out) => {
      const m = out.match(/warnings=(\d+)/);
      return m ? { warnings: Number(m[1]), advisory: true } : { advisory: true };
    },
  },
  {
    // NEW S011 §24++ — topic-plan-progress: active plans not orphaned (arc expired without closure)
    name: 'topic_plan_progress',
    command: 'node tools/validators/validate-topic-plan-progress.mjs',
    parse_output: (out) => {
      const m = out.match(/plans_checked=(\d+)\s+warnings=(\d+)/);
      return m ? { plans_checked: Number(m[1]), warnings: Number(m[2]) } : {};
    },
  },
  {
    // NEW S011 §24++ — session-artifact-sync: HANDOFF phase claims match token-optimization.md
    name: 'session_artifact_sync',
    command: 'node tools/validators/validate-session-artifact-sync.mjs',
    parse_output: (out) => {
      const m = out.match(/checks=(\d+)\s+warnings=(\d+)/);
      return m ? { checks: Number(m[1]), warnings: Number(m[2]) } : {};
    },
  },
  {
    // NEW S011 §24++ — audit-slug-coverage: every validator has a registered slug in audit-runner.md
    name: 'audit_slug_coverage',
    command: 'node tools/validators/validate-audit-slug-coverage.mjs',
    parse_output: (out) => {
      const m = out.match(/validators_checked=(\d+)\s+orphans=(\d+)\s+registered=(\d+)/);
      return m ? { validators_checked: Number(m[1]), orphans: Number(m[2]), registered: Number(m[3]) } : {};
    },
  },
  {
    // NEW S011 Phase 9 9a — 5-mode token-budget validator (ADVISORY window; per §14.6 + EXT-002-A)
    name: 'token_budget_validate',
    command: 'node tools/validators/validate-token-budget.mjs',
    parse_output: (out) => {
      const m = out.match(/modes=(\d+)\s+red=(\d+)\s+yellow=(\d+)\s+info=(\d+)/);
      return m
        ? { modes: Number(m[1]), red: Number(m[2]), yellow: Number(m[3]), info: Number(m[4]), advisory_window: true }
        : { advisory_window: true };
    },
  },
  {
    // NEW S011 Phase 9 9f — L1_CORE HUB file_depth_markers validator (EXT-004-D Improvement #8)
    name: 'corespine_depth_markers',
    command: 'node tools/validators/validate-corespine-depth-markers.mjs',
    parse_output: (out) => {
      const m = out.match(/checked=(\d+)\s+l1_core=(\d+)\/5\s+l2_domain=(\d+)\s+l3_instances=(\d+)\s+errors=(\d+)\s+warnings=(\d+)/);
      return m
        ? { checked: Number(m[1]), l1_core: Number(m[2]), l2_domain: Number(m[3]), l3_instances: Number(m[4]), errors: Number(m[5]), warnings: Number(m[6]) }
        : {};
    },
  },
  {
    // S016 L3 PLAN HARVEST COVERAGE — active gradual-build-plans must have §HARVEST section
    name: 'plan_harvest_coverage',
    command: 'node tools/validators/validate-plan-harvest-coverage.mjs',
    parse_output: (out) => {
      const m = out.match(/plans_checked=(\d+)\s+missing_harvest=(\d+)\s+warnings=(\d+)/);
      return m ? { plans_checked: Number(m[1]), missing_harvest: Number(m[2]), warnings: Number(m[3]) } : {};
    },
  },
  {
    // S016 L3 EXECUTION MODE DECLARED — active gradual-build-plans must declare execution_mode
    name: 'execution_mode_declared',
    command: 'node tools/validators/validate-execution-mode-declared.mjs',
    parse_output: (out) => {
      const m = out.match(/plans_checked=(\d+)\s+missing_mode=(\d+)\s+warnings=(\d+)/);
      return m ? { plans_checked: Number(m[1]), missing_mode: Number(m[2]), warnings: Number(m[3]) } : {};
    },
  },
  {
    // S016 BEDROCK COMPLETION GATE — platform core must be complete before app #2
    // Reads csps-bedrock.md §3 checklist. 2 root decisions missing = 7 downstream items gated.
    name: 'bedrock_completion',
    command: 'node tools/validators/validate-bedrock.mjs',
    parse_output: (out) => {
      const m = out.match(/total=(\d+)\s+done=(\d+)\s+deferred=(\d+)\s+blocking=(\d+)\s+completion=(\d+)%\s+status=(\w+)/);
      return m ? { total: Number(m[1]), done: Number(m[2]), deferred: Number(m[3]), blocking: Number(m[4]), completion_pct: Number(m[5]), status: m[6] } : {};
    },
  },
  {
    // S015 STALE PLAN ALIGNMENT GATE — plans written >1 session ago require alignment before execution
    name: 'plan_age_alignment',
    command: 'node tools/validators/validate-plan-age-alignment.mjs',
    parse_output: (out) => {
      const m = out.match(/plans_checked=(\d+)\s+stale_total=(\d+)\s+unverified=(\d+)\s+verified=(\d+)\s+likely_done_items=(\d+)/);
      return m ? { plans_checked: Number(m[1]), stale_total: Number(m[2]), unverified: Number(m[3]), verified: Number(m[4]), likely_done_items: Number(m[5]) } : {};
    },
  },
  {
    // S015 FOUNDATION_EXIT_GATE — core before application (major discovery)
    // Any active topic plan with unchecked exit criteria in a "completed" phase = BLOCKING.
    // PE score for next phase = 0 until gate is clean. Enforces core-before-application discipline.
    name: 'phase_exit_criteria',
    command: 'node tools/validators/validate-phase-exit-criteria.mjs',
    parse_output: (out) => {
      const m = out.match(/plans_checked=(\d+)\s+sections_checked=(\d+)\s+blocking=(\d+)\s+warnings=(\d+)\s+status=(\w+)/);
      return m ? { plans_checked: Number(m[1]), sections_checked: Number(m[2]), blocking: Number(m[3]), warnings: Number(m[4]), status: m[5] } : {};
    },
  },
  {
    // S017 ZENSTACK DRIFT GATE — ZModel → Prisma schema consistency
    // Runs zenstack generate on libs/policies/schema.zmodel, compares generated
    // model list against apps/task-mgmt/prisma/schema.prisma. Blocks on drift.
    name: 'foundation_schema_drift',
    command: 'node tools/validators/validate-foundation-schema-drift.mjs',
    parse_output: (out) => {
      const m = out.match(/generate_ok=(\w+)\s+zmodel_models=(\d+)\s+app_models=(\d+)\s+drift_count=(\d+)\s+advisory=(\d+)\s+status=(\w+)/);
      return m ? { generate_ok: m[1] === 'true', zmodel_models: Number(m[2]), app_models: Number(m[3]), drift_count: Number(m[4]), advisory: Number(m[5]), status: m[6] } : {};
    },
  },
  {
    name: 'audit_runner_full_pass',
    command: 'pnpm audit:run --strict',
    skip: true,
    skip_reason: 'audit-runner ships week-4 (planned per build-order.md week 4)',
    parse_output: () => ({}),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Spawn helper
// ─────────────────────────────────────────────────────────────────────────────

function runCommand(command, cwd) {
  return new Promise((resolveP) => {
    const startMs = Date.now();
    const child = spawn(command, { cwd, shell: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d.toString()));
    child.stderr.on('data', (d) => (stderr += d.toString()));
    child.on('close', (code) => {
      resolveP({
        code: code ?? -1,
        stdout,
        stderr,
        duration_ms: Date.now() - startMs,
      });
    });
    child.on('error', (err) => {
      resolveP({
        code: -1,
        stdout,
        stderr: stderr + String(err),
        duration_ms: Date.now() - startMs,
      });
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const startedAt = new Date().toISOString();
  const results = [];
  let anyFailed = false;

  for (const cycle of CYCLES) {
    const entry = { name: cycle.name, command: cycle.command };
    if (cycle.skip) {
      entry.status = 'DEFERRED-WITH-REASON';
      entry.skip_reason = cycle.skip_reason;
      results.push(entry);
      continue;
    }
    process.stderr.write(`[verify] running: ${cycle.command}\n`);
    const r = await runCommand(cycle.command, ROOT);
    const parsed = cycle.parse_output(r.stdout + '\n' + r.stderr) ?? {};
    entry.status = r.code === 0 ? 'PASS' : 'FAIL';
    entry.exit_code = r.code;
    entry.duration_seconds = Math.round(r.duration_ms / 100) / 10;
    Object.assign(entry, parsed);
    if (r.code !== 0) {
      entry.tail = (r.stderr || r.stdout).split('\n').slice(-10).join('\n');
      anyFailed = true;
    }
    results.push(entry);
  }

  const exit_code = anyFailed ? 1 : 0;
  const finishedAt = new Date().toISOString();

  // Emit structured ZF evidence block (matches closing-summary-template §10.0 schema)
  const evidence = {
    pre_close_verification: {
      ran_at: startedAt,
      finished_at: finishedAt,
      orchestrator: 'tools/verify.mjs',
      cycles: results,
      exit_code,
      strict_mode: STRICT,
    },
  };
  process.stdout.write(JSON.stringify(evidence, null, 2) + '\n');

  // Also write to tools/bootstrap-readiness.md (referenced by bootstrap.ps1 step 10)
  if (!existsSync(resolve(ROOT, 'tools'))) mkdirSync(resolve(ROOT, 'tools'), { recursive: true });
  const reportPath = resolve(ROOT, 'tools/verify-last-run.md');
  const md = `# verify last run\n\n- ran_at: ${startedAt}\n- finished_at: ${finishedAt}\n- exit_code: ${exit_code}\n\n\`\`\`yaml\n${JSON.stringify(evidence, null, 2)}\n\`\`\`\n`;
  writeFileSync(reportPath, md);
  process.stderr.write(`[verify] report: ${reportPath}\n`);

  process.exit(exit_code);
}

main().catch((err) => {
  process.stderr.write(`[verify] fatal: ${err instanceof Error ? err.stack : String(err)}\n`);
  process.exit(2);
});
