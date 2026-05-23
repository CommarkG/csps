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
    // NEW S022 Governor directive — ZF mechanical enforcement on Opus advisory output.
    // Every substantive Opus turn must have "## RZF VERIFICATION" section with ZF ACHIEVED evidence.
    // Enforcement: advisory (week-4 → blocking). Applies B_RZF to Opus's own activity.
    name: 'opus_turn_rzf',
    command: 'node tools/validators/validate-opus-turn-rzf.mjs',
    parse_output: (out) => {
      const m = out.match(/turns_checked=(\d+).*warnings=(\d+)/);
      return m ? { turns_checked: Number(m[1]), warnings: Number(m[2]) } : {};
    },
  },
  {
    // NEW S024 — Sonnet session protocol: sonnet-turn.md must have INTENT ABSORBED + Sonnet Report.
    // Enforces the CSPS zero-freestyle communication protocol between Opus and Sonnet.
    // ADVISORY now → BLOCKING week-4.
    name: 'sonnet_report',
    command: 'node tools/validators/validate-sonnet-report.mjs',
    parse_output: (out) => ({ has_report: !out.includes('No') }),
  },
  {
    // NEW S024 Governor directive — B_BOUNDARY_ALIGNMENT_PROTOCOL Phase 1 (Type E+B).
    // Checks sonnet-turn.md Sonnet Report for ALIGNMENT CHECK block + closing-summary §10.0r filled.
    // ADVISORY now → Type B BLOCKING week-4.
    name: 'boundary_alignment',
    command: 'node tools/validators/validate-boundary-alignment.mjs',
    parse_output: (out) => { const m = out.match(/checks=(\d+)\s+warnings=(\d+)/); return m ? { checks: Number(m[1]), warnings: Number(m[2]) } : {}; },
  },
  {
    // NEW S025 — PE Dashboard: auto-compute priority queue from all active plans.
    // Reads priority_score + depth_chosen → adjusted PE → sorted top-10.
    // Phase 2 (S026): + gate status (Bn) + ZF gate per level.
    // Governor directive: "PE must be connected to everything — complete holistic view."
    name: 'pe_dashboard',
    command: 'node tools/validators/validate-pe-dashboard.mjs',
    parse_output: (out) => { const m = out.match(/plans=(\d+)\s+open_items=(\d+)/); return m ? { plans: Number(m[1]), open_items: Number(m[2]) } : {}; },
  },
  {
    // NEW S025 — Contract harmonization: detects B_* contract contradictions + near-duplicates + orphans.
    // Phase 2 (S027): LLM-assisted contradiction scoring → BLOCKING.
    // Governor directive: "core health + harmonization — no contradictions in contracts."
    // NEW S025 — Dead link detector: every href in governed artifact links: arrays resolves to real file.
    // Phase 1: ADVISORY — 67 pre-existing broken links found; VLT raised; fix per PE priority.
    // Phase 2 (S026): BLOCKING — new broken links after S026 = exit 1.
    name: 'dead_links',
    command: 'node tools/validators/validate-dead-links.mjs',
    parse_output: (out) => { const m = out.match(/files=(\d+)\s+links_checked=(\d+)\s+broken=(\d+)/); return m ? { files: Number(m[1]), links: Number(m[2]), broken: Number(m[3]) } : {}; },
  },
  {
    // NEW S025 — Meta-completeness: is the completeness system itself complete?
    // Checks all 6 B_* completeness contracts + SSoT + ZF gates active.
    // Phase 2 (S027): BLOCKING for missing contracts.
    // NEW S025 — PACP: Participant-Aware Communication Protocol enforcement (advisory Phase 1).
    // Every new element declares target_participant (14 types, 5 categories).
    // DNA Element 17 — the communication moat.
    // Governor directive: "HIDDEN GAP — treat AI, external AI, developers, user types as participants."
    // Phase 2 (S026): BLOCKING for new elements without declaration.
    // NEW S025 — Cross-session open question tracker. Surfaces unanswered questions,
    // raw-thoughts-queue items without PE+trigger, and HANDOFF alignment gaps.
    // Governor: "I feel there is a gap — go over open things left behind and enforce them."
    // NEW S025 — Opus review flagging: mechanical detection of when Opus consultation needed.
    // Checks HANDOFFs with depth-5 work, PE>90 new items, sonnet-turn.md "What Opus should know".
    // Governor: "I want to see the mechanism deciding what to bring to Opus in action."
    // Surfaces items + provides git links since last Opus turn.
    name: 'opus_review_flagging',
    command: 'node tools/validators/validate-opus-review-flagging.mjs',
    parse_output: (out) => { const m = out.match(/last_turn=(\d+)\s+flags=(\d+)\s+commits_since=(\d+)/); return m ? { last_turn: Number(m[1]), flags: Number(m[2]), commits: Number(m[3]) } : {}; },
  },
  {
    name: 'open_questions',
    command: 'node tools/validators/validate-open-questions.mjs',
    parse_output: (out) => { const m = out.match(/plans_checked=(\d+)\s+questions_total=(\d+)\s+questions_open=(\d+)/); return m ? { plans: Number(m[1]), total: Number(m[2]), open: Number(m[3]) } : {}; },
  },
  {
    name: 'participant_declared',
    command: 'node tools/validators/validate-participant-declared.mjs',
    parse_output: (out) => { const m = out.match(/checked=(\d+)\s+advisories=(\d+)/); return m ? { checked: Number(m[1]), advisories: Number(m[2]) } : {}; },
  },
  {
    name: 'completeness_coverage',
    command: 'node tools/validators/validate-completeness-coverage.mjs',
    parse_output: (out) => { const m = out.match(/contracts=(\d+)\s+blocking=(\d+)\s+advisory=(\d+)/); return m ? { contracts: Number(m[1]), blocking: Number(m[2]), advisory: Number(m[3]) } : {}; },
  },
  {
    // NEW S025 — Template Grade A/B/C/D enforcement (advisory Phase 1).
    // Grade A templates must have research_ref. Existing templates need grade assignment (Turn 10).
    // Opus Turn 9 ratified the grade system: A=council, B=standard, C=provisional, D=experimental.
    name: 'template_grade',
    command: 'node tools/validators/validate-template-grade.mjs',
    parse_output: (out) => { const m = out.match(/graded=(\d+)\s+advisories=(\d+)/); return m ? { graded: Number(m[1]), advisories: Number(m[2]) } : {}; },
  },
  {
    name: 'contract_harmonization',
    command: 'node tools/validators/validate-contract-harmonization.mjs',
    parse_output: (out) => { const m = out.match(/contracts=(\d+)\s+orphans=(\d+)\s+tensions=(\d+)\s+overlaps=(\d+)/); return m ? { contracts: Number(m[1]), orphans: Number(m[2]), tensions: Number(m[3]), overlaps: Number(m[4]) } : {}; },
  },
  {
    // NEW S025 — Question coverage: enforces Question Protocol (Phase 1 advisory).
    // Checks: topic-plans have Z-type (done_criteria) + C-type (goal_statement) questions.
    // WizardTemplate templates have G-type clarifying_questions.
    // Phase 2 (S026): question_register field mandatory + WizardTemplate question_type per step.
    // Governor directive: "Questions are the strongest context preservation tool — mandatory everywhere."
    // NEW S026 — Crystallization bypass detector: catches SP-005 "just figure it out" pattern.
    // AI acts without Q1c/Q2c/Q3c crystallization. Per P-META-022 + "Drive Don't Fight" CHUNK 5.
    // NEW S026 — Agreement-without-evidence detector: catches SP-002 agreement bias.
    // AI agrees without evidence (T2 triggers: "good point", "exactly", "I agree" without because).
    // Part of CHUNK 5 enforcement roadmap. Advisory Phase 1; scan session artifacts.
    // NEW S026 — Satisfaction point detector: catches SP-001 "I've run X" narration.
    // Reports action instead of showing evidence. Highest-drift T1 default.
    // Teaching moment: "Paste the tool output. The output IS the evidence."
    name: 'satisfaction_point',
    command: 'node tools/validators/validate-satisfaction-point.mjs',
    parse_output: (out) => { const m = out.match(/advisories=(\d+)/); return m ? { advisories: Number(m[1]) } : {}; },
  },
  {
    name: 'agreement_without_evidence',
    command: 'node tools/validators/validate-agreement-without-evidence.mjs',
    parse_output: (out) => { const m = out.match(/checked=(\d+)\s+advisories=(\d+)/); return m ? { checked: Number(m[1]), advisories: Number(m[2]) } : {}; },
  },
  {
    name: 'crystallization_bypass',
    command: 'node tools/validators/validate-crystallization-bypass.mjs',
    parse_output: (out) => { const m = out.match(/plans=(\d+)\s+blocking=(\d+)\s+advisory=(\d+)/); return m ? { plans: Number(m[1]), blocking: Number(m[2]), advisory: Number(m[3]) } : {}; },
  },
  {
    // NEW S027 — Comprehensive response detector: catches SP-003 "cover all items at equal depth."
    // AI handles multiple tasks simultaneously without PE-scoring and vaulting lower-PE items.
    // Scans: INTENT ABSORBED sections for T3 triggers without PE nearby; Done sections with 5+ items
    // and no PE ordering; raw-thoughts-queue population (positive enforcement).
    // Teaching moment: "ONE focal point. PE-score the rest. Vault to raw-thoughts-queue."
    name: 'comprehensive_response',
    command: 'node tools/validators/validate-comprehensive-response.mjs',
    parse_output: (out) => { const m = out.match(/advisories=(\d+)/); return m ? { advisories: Number(m[1]) } : {}; },
  },
  {
    // NEW S027 — Diataxis type mandatory: enforces diataxis_type field in pillar-0-governance .md files.
    // BLOCKING if any file is missing diataxis_type entirely. Valid: tutorial | how-to | reference | explanation.
    // Enables documentation spine: navigation clarity, AI CONCEPT_LOAD spine, coverage audits.
    // PE=67 S027 mandate.
    name: 'diataxis_type',
    command: 'node tools/validators/validate-diataxis-type.mjs',
    parse_output: (out) => { const m = out.match(/checked=(\d+)\s+blocking=(\d+)\s+advisories=(\d+)/); return m ? { checked: Number(m[1]), blocking: Number(m[2]), advisories: Number(m[3]) } : {}; },
  },
  {
    // NEW S027 — Bottleneck patterns: detects structural bottlenecks before they become crises.
    // Class A: N+1 query patterns (auth lookup + DB call in same API route) — at 30 apps × 100 req/s → O(N²)
    // Class B: O(N) validator file-walkers — pnpm verify degrades from 30s to 300s at 30 apps
    // Class C: Missing @@index([tenantId]) — full table scans per tenant query
    // All advisory. PE=65. Spec: bottleneck-and-gradual-structures-S019.md §1.
    name: 'bottleneck_patterns',
    command: 'node tools/validators/validate-bottleneck-patterns.mjs',
    parse_output: (out) => { const m = out.match(/routes_checked=(\d+)\s+validators_checked=(\d+)\s+models_checked=(\d+)\s+advisories=(\d+)/); return m ? { routes: Number(m[1]), validators: Number(m[2]), models: Number(m[3]), advisories: Number(m[4]) } : {}; },
  },
  {
    // NEW S027 — DNA application evidence per element: verifies §6b table in csps-platform-dna.md.
    // Checks presence + 17 rows + non-trivial evidence per element (validator/hook/command reference).
    // Gap targeted: DNA gate that only checks acknowledgment, not application.
    // Advisory Phase 1; BLOCKING Phase 2 after K=2. PE=67 S027.
    name: 'dna_evidence',
    command: 'node tools/validators/validate-dna-evidence.mjs',
    parse_output: (out) => { const m = out.match(/elements_checked=(\d+)\s+advisories=(\d+)/); return m ? { elements_checked: Number(m[1]), advisories: Number(m[2]) } : {}; },
  },
  {
    // NEW S027+ — Opus RZF gap tracking: validates RZF NEGATIVE findings in opus-turn.md
    // are tracked to specific artifacts (SROF/backlog/session-state). Advisory Phase 1.
    // Spec: sonnet-comprehensive-alignment-s027.md P1-2. ZF as production chain discipline.
    // S028 — Multi-topic decomposition: detects prompts with multiple PE items handled without
    // routing table. P-META-024 mechanical enforcement. Advisory. UPDATE-029.
    name: 'multi_topic_decomposition',
    command: 'node tools/validators/validate-multi-topic-decomposition.mjs',
    parse_output: (out) => { const m = out.match(/checked=(\d+)\s+advisories=(\d+)/); return m ? { checked: Number(m[1]), advisories: Number(m[2]) } : {}; },
  },
  {
    name: 'opus_rzf_gap_tracking',
    command: 'node tools/validators/validate-opus-rzf-gap-tracking.mjs',
    parse_output: (out) => { const m = out.match(/sections=(\d+)\s+tracked=(\d+)\s+advisories=(\d+)/); return m ? { sections: Number(m[1]), tracked: Number(m[2]), advisories: Number(m[3]) } : {}; },
  },
  {
    // NEW S027+ — Opus CEC artifacts: validates CEC Applied YES claims cite traceable artifacts.
    // Prevents "Applied YES" without proof (CEC equivalent of SP-001 satisfaction-point).
    // Spec: sonnet-comprehensive-alignment-s027.md P1-2. Advisory Phase 1.
    name: 'opus_cec_artifacts',
    command: 'node tools/validators/validate-opus-cec-artifacts.mjs',
    parse_output: (out) => { const m = out.match(/sections=(\d+)\s+applied_yes=(\d+)\s+cited=(\d+)\s+advisories=(\d+)/); return m ? { sections: Number(m[1]), applied_yes: Number(m[2]), cited: Number(m[3]), advisories: Number(m[4]) } : {}; },
  },
  {
    // Session B — Schema anchors: validates schema_anchor values against schema-registry.md.
    // NEW anchors not in registry = BLOCKING. Pre-existing 248 all registered. RP-003 enforcement.
    name: 'schema_anchors',
    command: 'node tools/validators/validate-schema-anchors.mjs',
    parse_output: (out) => { const m = out.match(/checked=(\d+)\s+clean=(\d+)\s+blocking=(\d+)\s+registry_size=(\d+)/); return m ? { checked: Number(m[1]), clean: Number(m[2]), blocking: Number(m[3]), registry: Number(m[4]) } : {}; },
  },
  {
    // Session B — Generated artifact freshness: checks L3 instance files are recently regenerated.
    // Advisory: flags if generator is >24h newer than generated file, or file is >7 days old. RP-004.
    name: 'generated_artifact_freshness',
    command: 'node tools/validators/validate-generated-artifact-freshness.mjs',
    parse_output: (out) => { const m = out.match(/checked=(\d+)\s+advisories=(\d+)/); return m ? { checked: Number(m[1]), advisories: Number(m[2]) } : {}; },
  },
  {
    // S028 — Spine hierarchy: validates L1/L2/L3 structural rules per spine-graduation-principle.md
    // BLOCKING: missing sealed fields in L1, missing parent_l1_doctrine in L2/L3, non-canonical spines
    // ADVISORY: do_not_expand violations in sealed L1 files. PE=67.
    name: 'spine_hierarchy',
    command: 'node tools/validators/validate-spine-hierarchy.mjs',
    parse_output: (out) => { const m = out.match(/checked=(\d+)\s+blocking=(\d+)\s+advisories=(\d+)/); return m ? { checked: Number(m[1]), blocking: Number(m[2]), advisories: Number(m[3]) } : {}; },
  },
  {
    // S028 — Frontmatter count consistency: body counts match description counts. RP-002.
    // Advisory: csps-platform-dna §1 rows, principles total_count, contracts total_count.
    name: 'frontmatter_count_consistency',
    command: 'node tools/validators/validate-frontmatter-count-consistency.mjs',
    parse_output: (out) => { const m = out.match(/checked=(\d+)\s+advisories=(\d+)/); return m ? { checked: Number(m[1]), advisories: Number(m[2]) } : {}; },
  },
  {
    // S028 — Deferred target session: surfaces governance debt (week-4/deferred items without targets).
    // Advisory: counts week-4 rows in audit-runner, contracts, verify.mjs that have no S<NNN> target.
    // RP-001: "week-4 is a commitment, not a metaphor." PE=75.
    name: 'deferred_target_session',
    command: 'node tools/validators/validate-deferred-target-session.mjs',
    parse_output: (out) => { const m = out.match(/checked=(\d+)\s+advisories=(\d+)/); return m ? { checked: Number(m[1]), advisories: Number(m[2]) } : {}; },
  },
  {
    // B_ZERO_LAPTOP_DEPENDENCY enforcement: .env.local = laptop dependency.
    // Governor directive S028: "zero dependency on local computers — mechanically enforce it now."
    // Checks: .env.local with real values (advisory: move to Vercel env vars), missing vercel.json.
    name: 'no_laptop_secrets',
    command: 'node tools/validators/validate-no-laptop-secrets.mjs',
    parse_output: (out) => { const m = out.match(/apps_checked=(\d+)\s+advisories=(\d+)/); return m ? { apps: Number(m[1]), advisories: Number(m[2]) } : {}; },
  },
  {
    // S028 FSE — Laptop patterns: scans governance docs for laptop-dependency language.
    // Governor directive: "mechanically enforce it — global context lead mandatory element."
    // BLOCKING for new .md files containing: "pnpm dev", "localhost:PORT", ".env.local" in procedures.
    // ADVISORY for pre-existing docs. B_ZERO_LAPTOP_DEPENDENCY | P-OPER-001.
    // SROF-011 D.3 — Core contamination: no external API calls in validators/hooks/principles.
    // BLOCKING: fetch()/http.get/axios in governance validators; curl to external in hooks.
    // ADVISORY: principles citing external sources as canonical. scope_level: S0.
    // S028 — Scope conflict: detects S2 proposals for S1 requirements in procedure docs.
    // K=2 already reached: 3+ violations in S028 (credentials, vercel link, root directory).
    // Advisory Phase 1 → BLOCKING Phase 2. Closes the PROPOSAL-level enforcement gap.
    name: 'scope_conflict',
    command: 'node tools/validators/validate-scope-conflict.mjs',
    parse_output: (out) => { const m = out.match(/checked=(\d+)\s+advisories=(\d+)/); return m ? { checked: Number(m[1]), advisories: Number(m[2]) } : {}; },
  },
  {
    // E1 LIVE S030 — mini-tree bidirectional integrity check (Turn 34)
    name: 'mini_tree_integrity',
    command: 'node tools/validators/validate-mini-tree-integrity.mjs',
    parse_output: (out) => { const m = out.match(/blocking=(\d+) advisory=(\d+)/); return m ? { blocking: Number(m[1]), advisory: Number(m[2]) } : {}; },
  },
  {
    // E0 LIVE S030 — platform capacity monitoring (Turn 34)
    name: 'platform_capacity',
    command: 'node tools/validators/validate-platform-capacity.mjs',
    parse_output: (out) => { const m = out.match(/blocking=(\d+) advisory=(\d+)/); return m ? { blocking: Number(m[1]), advisory: Number(m[2]) } : {}; },
  },
  {
    // E2 LIVE S030 — file complexity dual-gate (lines>300 AND H2>=3 without mini_tree_root)
    name: 'file_complexity_validate',
    command: 'node tools/validators/validate-file-complexity.mjs',
    parse_output: (out) => { const m = out.match(/scanned=(\d+) advisory=(\d+)/); return m ? { scanned: Number(m[1]), advisory: Number(m[2]) } : {}; },
  },
  {
    // E3 LIVE S031 — naming convention 5-rule check (R1-R5, ADVISORY, exempt via naming-exempt.yaml)
    name: 'file_naming',
    command: 'node tools/validators/validate-file-naming.mjs',
    parse_output: (out) => { const m = out.match(/checked=(\d+) advisory=(\d+) exempt=(\d+)/); return m ? { checked: Number(m[1]), advisory: Number(m[2]), exempt: Number(m[3]) } : {}; },
  },
  {
    // E4 LIVE S031 — Opus chat-jump freshness (≥20 turns + no current-session chat-jump = ADVISORY)
    name: 'opus_chat_jump_freshness',
    command: 'node tools/validators/validate-opus-chat-jump-freshness.mjs',
    parse_output: (out) => { const m = out.match(/turns=(\d+) session=(\S+) has_chat_jump=(\w+)/); return m ? { turns: Number(m[1]), session: m[2], has_chat_jump: m[3] === 'true' } : {}; },
  },
  {
    // S032-D LIVE — BLOCKING: apps/*/next.config.js must import + use securityHeaders()
    name: 'security_headers_compliance',
    command: 'node tools/validators/validate-security-headers.mjs',
    parse_output: (out) => { const m = out.match(/apps=(\d+) passing=(\d+) blocking=(\d+) skipped=(\d+)/); return m ? { apps: Number(m[1]), passing: Number(m[2]), blocking: Number(m[3]), skipped: Number(m[4]) } : {}; },
  },
  {
    // ADR-0027 Phase 1 LIVE S032 — scope_level on governed artifacts (206 missing, advisory until backfill)
    name: 'scope_level_declared',
    command: 'node tools/validators/validate-scope-level-declared.mjs',
    parse_output: (out) => { const m = out.match(/checked=(\d+) missing=(\d+) invalid=(\d+) exempt=(\d+)/); return m ? { checked: Number(m[1]), missing: Number(m[2]), invalid: Number(m[3]), exempt: Number(m[4]) } : {}; },
  },
  {
    // S040 ADVISORY — B_ZERO_NAVIGATION_FOR_GOVERNOR: scans AI files for navigation directives directed at Governor
    // S041 ADVISORY — DEFAULT-ME-1 enforcement: rules/PI items without T1+T2+T3. Embeds AI deep instruction in output.
    name: 'rule_has_enforcement',
    command: 'node tools/validators/validate-rule-has-enforcement.mjs',
    parse_output: (out) => { const m = out.match(/advisories=(\d+)/); return m ? { advisories: Number(m[1]) } : { advisories: 0 }; },
  },
  {
    name: 'governor_instructions',
    command: 'node tools/validators/validate-governor-instructions.mjs',
    parse_output: (out) => { const m = out.match(/(\d+) navigation directive/); return m ? { violations: Number(m[1]) } : { violations: 0 }; },
  },
  {
    // S036 LIVE — error registry coverage (inner-ai-defaults overrides have EP-ERR files)
    name: 'error_registry_coverage',
    command: 'node tools/validators/validate-error-registry-coverage.mjs',
    parse_output: (out) => { const m = out.match(/overrides=(\d+) covered=(\d+) uncovered=(\d+)/); return m ? { overrides: Number(m[1]), covered: Number(m[2]), uncovered: Number(m[3]) } : {}; },
  },
  {
    // S036 LIVE — wiring completeness (WIRED/DEFERRED/ORPHAN per exported symbol)
    name: 'wiring_completeness',
    command: 'node tools/validators/validate-wiring-completeness.mjs',
    parse_output: (out) => { const m = out.match(/wired=(\d+) deferred=(\d+) orphan=(\d+)/); return m ? { wired: Number(m[1]), deferred: Number(m[2]), orphan: Number(m[3]) } : {}; },
  },
  {
    // S036 LIVE — communication protocol Rule 1 compliance (identity handshake)
    name: 'communication_protocol',
    command: 'node tools/validators/validate-communication-protocol.mjs',
    parse_output: (out) => { const m = out.match(/advisory=(\d+)/); return m ? { advisory: Number(m[1]) } : {}; },
  },
  {
    // S036-PROTO LIVE — active protocol compliance (no parallel directives, tracks active_directive)
    name: 'active_protocol_compliance',
    command: 'node tools/validators/validate-active-protocol.mjs',
    parse_output: (out) => { const m = out.match(/advisory=(\d+) blocking=(\d+)/); return m ? { advisory: Number(m[1]), blocking: Number(m[2]) } : {}; },
  },
  // P-ARCH-030: validate-app-scope-isolation.mjs (week-4)
  {
    name: 'core_contamination',
    command: 'node tools/validators/validate-core-contamination.mjs',
    parse_output: (out) => { const m = out.match(/checked=(\d+)\s+blocking=(\d+)\s+advisories=(\d+)/); return m ? { checked: Number(m[1]), blocking: Number(m[2]), advisories: Number(m[3]) } : {}; },
  },
  {
    name: 'laptop_patterns',
    command: 'node tools/validators/validate-laptop-patterns.mjs',
    parse_output: (out) => { const m = out.match(/checked=(\d+)\s+blocking=(\d+)\s+advisories=(\d+)/); return m ? { checked: Number(m[1]), blocking: Number(m[2]), advisories: Number(m[3]) } : {}; },
  },
  {
    // Governor Request Ledger: tracks all substantive requests with PE scores.
    // Advisory: surfaces OPEN requests sorted by PE. BLOCKING at session close (future).
    // SSoT: tools/config/governor-request-ledger.yaml | Governor directive S028.
    name: 'request_ledger',
    command: 'node tools/validators/validate-request-ledger.mjs',
    parse_output: (out) => { const m = out.match(/open=(\d+)\s+advisories=(\d+)\s+blocking=(\d+)/); return m ? { open: Number(m[1]), advisories: Number(m[2]), blocking: Number(m[3]) } : {}; },
  },
  {
    // Skill DNA alignment: validates all SKILL.md files are current with platform DNA.
    // Checks: scope_level, template_grade, backed_by_principle exists, backed_by_contract exists.
    // Advisory: skill references stale principle/contract. Governor directive S028.
    name: 'skill_dna_alignment',
    command: 'node tools/validators/validate-skill-dna-alignment.mjs',
    parse_output: (out) => { const m = out.match(/skills_checked=(\d+)\s+advisories=(\d+)/); return m ? { skills: Number(m[1]), advisories: Number(m[2]) } : {}; },
  },
  {
    name: 'question_coverage',
    command: 'node tools/validators/validate-question-coverage.mjs',
    parse_output: (out) => { const m = out.match(/plans=(\d+)\s+wizard_templates=(\d+)\s+issues:\s*Z=(\d+)\s+C=(\d+)\s+G=(\d+)/); return m ? { plans: Number(m[1]), templates: Number(m[2]), z_missing: Number(m[3]), c_missing: Number(m[4]), g_missing: Number(m[5]) } : {}; },
  },
  {
    // NEW S021 Governor directive — gradual-bundling: comprehensive check of all 7 bundling elements
    // Checks: depth discipline, humble batching, core spiral, GEP enforce_stage, PE alignment
    name: 'gradual_bundling',
    command: 'node tools/validators/validate-gradual-bundling.mjs',
    parse_output: (out) => {
      const m = out.match(/active_plans=(\d+)\s+near_complete=(\d+)\s+no_depth=(\d+)\s+no_stage=(\d+)\s+backlog_pending=(\d+)/);
      return m ? { active_plans: Number(m[1]), near_complete: Number(m[2]), no_depth: Number(m[3]), no_stage: Number(m[4]), backlog_pending: Number(m[5]) } : {};
    },
  },
  {
    // NEW S021 B_NAMING_POLICY enforcement — naming-convention: filename + EXT- prefix + duplicate detection
    // Implements the week-4 deferred naming-policy-compliance validator (S006 turn 24 origin)
    name: 'naming_convention',
    command: 'node tools/validators/validate-naming-convention.mjs --scan-new',
    parse_output: (out) => {
      const m = out.match(/issues=(\d+)\s+advisory=(\d+)\s+duplicates=(\d+)/);
      return m ? { issues: Number(m[1]), advisory: Number(m[2]), duplicates: Number(m[3]) } : {};
    },
  },
  {
    // NEW S021 Governor directive — research-reuse: research registry check before new research is commissioned
    // Stage: advisory (exits 0 always) — surfaces stale/approaching-stale entries, registry total
    name: 'research_reuse',
    command: 'node tools/validators/validate-research-reuse.mjs',
    parse_output: (out) => {
      const m = out.match(/total=(\d+)\s+active=(\d+)\s+stale=(\d+)\s+superseded=(\d+)\s+high_confidence=(\d+)\s+approaching_stale=(\d+)/);
      return m ? { total: Number(m[1]), active: Number(m[2]), stale: Number(m[3]), high_confidence: Number(m[5]), approaching_stale: Number(m[6]) } : {};
    },
  },
  {
    // NEW S021 Governor directive — completion-circle: surfaces elements missing developer/user coverage
    // Stage: measurement (exits 0 always) — defines COMPLETE as full closed circle
    name: 'completion_circle',
    command: 'node tools/validators/validate-completion-circle.mjs',
    parse_output: (out) => {
      const m = out.match(/assessed=(\d+)\s+no_dev_surface=(\d+)\s+no_user_value=(\d+)\s+incomplete=(\d+)/);
      return m ? { assessed: Number(m[1]), no_dev_surface: Number(m[2]), no_user_value: Number(m[3]), incomplete: Number(m[4]) } : {};
    },
  },
  {
    // NEW S021 Governor directive — update-backlog: surfaces pending platform improvements
    // Stage: measurement (exits 0 always) — makes the backlog visible each pnpm verify
    name: 'update_backlog',
    command: 'node tools/validators/validate-update-backlog.mjs',
    parse_output: (out) => {
      const m = out.match(/total=(\d+)\s+pending=(\d+)\s+blocked=(\d+)\s+done=(\d+)/);
      return m ? { total: Number(m[1]), pending: Number(m[2]), blocked: Number(m[3]), done: Number(m[4]) } : {};
    },
  },
  {
    // NEW S021 CEC — hook-lifecycle-state: surfaces STUB vs active hooks (N3 structural fix)
    // Enables accurate Track A estimation — prevents counting STUB hooks as live enforcement
    name: 'hook_lifecycle_state',
    command: 'node tools/validators/validate-hook-lifecycle-state.mjs',
    parse_output: (out) => {
      const m = out.match(/total=(\d+)\s+active=(\d+)\s+stub=(\d+)\s+unknown=(\d+)\s+stub_rate=(\d+)%/);
      return m ? { total: Number(m[1]), active: Number(m[2]), stub: Number(m[3]), unknown: Number(m[4]), stub_rate: Number(m[5]) } : {};
    },
  },
  {
    // NEW S021 CEC — session-harvest-readiness: fires ADVISORY when session work volume is significant
    // S051: declared-never-finished scanner — finds 'Build ACTIVE' slugs with no file + week-4 stubs (ADVISORY)
    name: 'declared_never_finished',
    command: 'node tools/validators/validate-declared-never-finished.mjs',
    parse_output: (out) => {
      const m = out.match(/checked=(\d+)\s+significant=(\d+)\s+advisory_week4=(\d+)/);
      return m ? { checked: Number(m[1]), significant: Number(m[2]), week4_stubs: Number(m[3]) } : {};
    },
  },
  {
    // S051: gap-routing — classifies and vaults findings from declared-never-finished (ADVISORY)
    name: 'gap_routing',
    command: 'node tools/validators/validate-gap-routing.mjs',
    parse_output: (out) => {
      const m = out.match(/findings=(\d+)\s+significant=(\d+)\s+advisory=(\d+)\s+vaulted=(\d+)/);
      return m ? { findings: Number(m[1]), significant: Number(m[2]), advisory: Number(m[3]), vaulted: Number(m[4]) } : {};
    },
  },
  {
    // S052: documentation-in-schema T2 advisory — context_question coverage across governed files
    name: 'context_question_coverage',
    command: 'node tools/validators/validate-context-question-coverage.mjs',
    parse_output: (out) => {
      const m = out.match(/coverage:\s*(\d+)\/(\d+)\s+governed files\s+\((\d+)%\)/);
      return m ? { with_cq: Number(m[1]), total: Number(m[2]), pct: Number(m[3]) } : {};
    },
  },
  {
    // Implements Governor directive: "mechanical enforcement every several turns when mature enough"
    name: 'session_harvest_readiness',
    command: 'node tools/validators/validate-session-harvest-readiness.mjs',
    parse_output: (out) => {
      const m = out.match(/session=(\S+)\s+validators=(\d+).*status=(\w+)/);
      return m ? { session: m[1], validators: Number(m[2]), status: m[3] } : {};
    },
  },
  {
    // NEW S021 enforcement-rate-uplift Track B — prose-no-confirmation-seeking (ADVISORY)
    // Covers: inner-AI-defaults prose-confirmation-seeking
    name: 'prose_no_confirmation_seeking',
    command: 'node tools/validators/validate-prose-no-confirmation-seeking.mjs',
    parse_output: (out) => {
      const m = out.match(/files_scanned=(\d+)\s+findings=(\d+)\s+status=(\w+)/);
      return m ? { files_scanned: Number(m[1]), findings: Number(m[2]), status: m[3] } : {};
    },
  },
  {
    // NEW S021 enforcement-rate-uplift Track B — decision-frame-citation (ADVISORY)
    // Covers: inner-AI-defaults prose-naked-question + reasoning-implicit-decision-no-PCR
    name: 'decision_frame_citation',
    command: 'node tools/validators/validate-decision-frame-citation.mjs',
    parse_output: (out) => {
      const m = out.match(/files_scanned=(\d+)\s+with_pcr=(\d+)\s+advisory_gaps=(\d+)\s+status=(\w+)/);
      return m ? { files_scanned: Number(m[1]), with_pcr: Number(m[2]), advisory_gaps: Number(m[3]), status: m[4] } : {};
    },
  },
  {
    // NEW S021 enforcement-rate-uplift Track B — concept-load-declared (ADVISORY)
    // Covers: inner-AI-defaults reasoning-context-depth-degradation
    name: 'concept_load_declared',
    command: 'node tools/validators/validate-concept-load-declared.mjs',
    parse_output: (out) => {
      const m = out.match(/files_scanned=(\d+)\s+with_concept_load=(\d+)\s+advisory_gaps=(\d+)\s+status=(\w+)/);
      return m ? { files_scanned: Number(m[1]), with_concept_load: Number(m[2]), advisory_gaps: Number(m[3]), status: m[4] } : {};
    },
  },
  {
    // NEW S021 enforcement-rate-uplift Track B — subagent-spawn-preamble (ADVISORY)
    // Covers: inner-AI-defaults tooling-subagent-no-preamble
    name: 'subagent_spawn_preamble',
    command: 'node tools/validators/validate-subagent-spawn-preamble.mjs',
    parse_output: (out) => {
      const m = out.match(/checks=(\d+)\s+passing=(\d+)\s+advisory_gaps=(\d+)\s+status=(\w+)/);
      return m ? { checks: Number(m[1]), passing: Number(m[2]), advisory_gaps: Number(m[3]), status: m[4] } : {};
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
    // S022 — PE connectivity: active topic-plans must have priority_score + priority_band
    name: 'pe_connectivity',
    command: 'node tools/validators/validate-pe-connectivity.mjs',
    parse_output: (out) => {
      const m = out.match(/blocking=(\d+)\s+advisory=(\d+)\s+total_gaps=(\d+)/);
      return m ? { blocking: Number(m[1]), advisory: Number(m[2]), total_gaps: Number(m[3]) } : {};
    },
  },
  {
    // S022 — AI-defaults alignment: plans with ai_defaults_influence=dominant without ratification block
    name: 'plan_ai_defaults_alignment',
    command: 'node tools/validators/validate-plan-ai-defaults.mjs',
    parse_output: (out) => {
      const m = out.match(/scanned=(\d+)\s+flagged=(\d+)\s+ratified=(\d+)\s+blocking=(\d+)\s+advisory=(\d+)/);
      return m ? { scanned: Number(m[1]), flagged: Number(m[2]), ratified: Number(m[3]), blocking: Number(m[4]), advisory: Number(m[5]) } : {};
    },
  },
  {
    // Session A: consolidation check — BLOCKING for S023+ plans without §0, ADVISORY for earlier
    name: 'consolidation_check_coverage',
    command: 'node tools/validators/validate-consolidation-check.mjs',
    parse_output: (out) => {
      const m = out.match(/checked=(\d+)\s+blocking=(\d+)\s+advisory=(\d+)/);
      return m ? { checked: Number(m[1]), blocking: Number(m[2]), advisory: Number(m[3]) } : {};
    },
  },
  {
    // Session A: ZF requirement — ADVISORY, lists plans missing zf_required_level
    name: 'plan_zf_requirement_coverage',
    command: 'node tools/validators/validate-plan-zf-requirement.mjs',
    parse_output: (out) => {
      const m = out.match(/checked=(\d+)\s+with_field=(\d+)\s+missing=(\d+)/);
      return m ? { checked: Number(m[1]), with_field: Number(m[2]), missing: Number(m[3]) } : {};
    },
  },
  {
    // Core Seeds — S043: wired to verify (was only standalone before)
    // Scans @core-seed annotations. Reports overdue seeds + seeds missing grows-to artifact.
    name: 'core_seeds_coverage',
    command: 'node tools/validators/validate-core-seeds.mjs',
    parse_output: (out) => {
      const m = out.match(/seeds_found=(\d+).*overdue=(\d+)/);
      return m ? { seeds_found: Number(m[1]), overdue: Number(m[2]) } : {};
    },
    advisories: 0,
  },
  // Session C+S023 monitoring validators
  // S023 Sandbox Ratification Policy validators
  { name: 'simulation_before_implementation', command: 'node tools/validators/validate-simulation-before-implementation.mjs', parse_output: (out) => { const m = out.match(/checked=(d+)s+blocking=(d+)s+advisory=(d+)/); return m ? { checked: Number(m[1]), blocking: Number(m[2]), advisory: Number(m[3]) } : {}; } },
  { name: 'sandbox_lifecycle', command: 'node tools/validators/validate-sandbox-lifecycle.mjs', parse_output: (out) => { const m = out.match(/checked=(d+)s+advisory=(d+)/); return m ? { checked: Number(m[1]), advisory: Number(m[2]) } : {}; } },
  { name: 'intent_crystallized',        command: 'node tools/validators/validate-intent-crystallized.mjs',        parse_output: (out) => { const m = out.match(/checked=(\d+)\s+blocking=(\d+)\s+advisory=(\d+)/); return m ? { checked: Number(m[1]), blocking: Number(m[2]), advisory: Number(m[3]) } : {}; } },
  { name: 'routing_declared',           command: 'node tools/validators/validate-routing-declared.mjs',           parse_output: (out) => { const m = out.match(/plans_checked=(\d+)\s+blocking=(\d+)\s+advisory=(\d+)/); return m ? { plans_checked: Number(m[1]), blocking: Number(m[2]), advisory: Number(m[3]) } : {}; } },
  { name: 'ux_principles_declared',     command: 'node tools/validators/validate-ux-principles-declared.mjs',     parse_output: (out) => { const m = out.match(/pages_checked=(\d+)\s+with_principle=(\d+)\s+advisory=(\d+)/); return m ? { pages_checked: Number(m[1]), with_principle: Number(m[2]), advisory: Number(m[3]) } : {}; } },
  { name: 'isolation_layers',            command: 'node tools/validators/validate-isolation-layers.mjs',            parse_output: (out) => { const m = out.match(/blocking=(\d+)\s+advisory=(\d+)/); return m ? { blocking: Number(m[1]), advisory: Number(m[2]) } : {}; } },
  { name: 'webhook_idempotency',         command: 'node tools/validators/validate-webhook-idempotency.mjs',         parse_output: (out) => { const m = out.match(/cases=(\d+)\s+advisory=(\d+)/); return m ? { cases: Number(m[1]), advisory: Number(m[2]) } : {}; } },
  { name: 'solo_user_flow',              command: 'node tools/validators/validate-solo-user-flow.mjs',              parse_output: (out) => { const m = out.match(/checked=(\d+)\s+advisory=(\d+)/); return m ? { checked: Number(m[1]), advisory: Number(m[2]) } : {}; } },
  { name: 'pe_situation_declared',       command: 'node tools/validators/validate-pe-situation-declared.mjs',       parse_output: (out) => { const m = out.match(/situation=(\S+)\s+registry=(\S+)/); return m ? { situation: m[1], registry: m[2] } : {}; } },
  { name: 'gdpr_erasure_path',           command: 'node tools/validators/validate-gdpr-erasure-path.mjs',           parse_output: (out) => { const m = out.match(/checked=(\d+)\s+advisory=(\d+)/); return m ? { checked: Number(m[1]), advisory: Number(m[2]) } : {}; } },
  { name: 'subscription_error_handling', command: 'node tools/validators/validate-subscription-error-handling.mjs', parse_output: (out) => { const m = out.match(/routes_checked=(\d+)\s+with_gate=(\d+)\s+advisory=(\d+)/); return m ? { routes_checked: Number(m[1]), with_gate: Number(m[2]), advisory: Number(m[3]) } : {}; } },
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
    // S039 LIVE — UI Completeness Gate: new app page files must have working interactive elements.
    // Catches: empty onClick, dead links, forms without onSubmit, TODO in JSX, missing API routes.
    // ADVISORY. promote to BLOCKING when pattern repeats (K=2 per EP-ERR discipline).
    name: 'ui_completeness',
    command: 'node tools/validators/validate-ui-completeness.mjs',
    parse_output: (out) => { const m = out.match(/files_checked=(\d+).*advisories=(\d+)/); return m ? { files_checked: Number(m[1]), advisories: Number(m[2]) } : {}; },
  },
  {
    // DNA SYNC FRESHNESS — T2 of 3-direction auto-sync enforcement.
    // Checks universal-sync-state.json is within 24h + drift detected since last sync.
    // ADVISORY if stale or drift > 0. Run pnpm sync:dna to propagate.
    name: 'sync_state_fresh',
    command: 'node tools/validators/validate-sync-state-fresh.mjs',
    parse_output: (out) => { const m = out.match(/hours_since_sync=(\d+)\s+principle_drift=(\d+)\s+moat_drift=(\d+)\s+contract_drift=(\d+)\s+status=(\w+)/); return m ? { hours_since_sync: Number(m[1]), principle_drift: Number(m[2]), moat_drift: Number(m[3]), contract_drift: Number(m[4]), status: m[5] } : {}; },
  },
  {
    // S037 LIVE — New File DNA Gate: TypeScript/JS files added in last commit must carry CSPS DNA.
    // BLOCKING for libs/ files > 50 lines without @csps-id, @csps-enforces, graceful passthrough, or PI coverage.
    // Closes the DNA inheritance gap: creation completeness checks PI YAML; this checks actual code.
    name: 'new_file_dna',
    command: 'node tools/validators/validate-new-file-dna.mjs',
    parse_output: (out) => { const m = out.match(/files_checked=(\d+)\s+dna_ok=(\d+)\s+advisory=(\d+)\s+blocking=(\d+)/); return m ? { files_checked: Number(m[1]), dna_ok: Number(m[2]), advisory: Number(m[3]), blocking: Number(m[4]) } : {}; },
  },
  {
    // S037-H LIVE — Creation Completeness (Turn 85 §2 + OPEN-021): PI files from last 30 days
    // checked for wiring_checklist ≥3, enforcement_trio, done_criterion, ep_err_pre_check. ADVISORY.
    name: 'creation_completeness',
    command: 'node tools/validators/validate-creation-completeness.mjs',
    parse_output: (out) => { const m = out.match(/pi_checked=(\d+)\s+advisories=(\d+)/); return m ? { pi_checked: Number(m[1]), advisories: Number(m[2]) } : {}; },
  },
  {
    // S037-H LIVE — Directive RZF Gate (Rule 9): SONNET DIRECTIVE sections in opus-turn.md
    // must have ## RZF VERIFICATION in same Turn block. ADVISORY. communication-protocol-shared.md Rule 9.
    name: 'directive_has_rzf',
    command: 'node tools/validators/validate-directive-has-rzf.mjs',
    parse_output: (out) => { const m = out.match(/turns_checked=(\d+)\s+directives=(\d+)\s+missing_rzf=(\d+)/); return m ? { turns_checked: Number(m[1]), directives: Number(m[2]), missing_rzf: Number(m[3]) } : {}; },
  },
  {
    // S037-H LIVE — Quality Alignment (OPEN-022): OPUS-2 RZF rate + Sonnet INTENT ABSORBED rate.
    // Both must be ≥80% over last 5 turns. ADVISORY. Shared quality discipline.
    name: 'quality_alignment',
    command: 'node tools/validators/validate-quality-alignment.mjs',
    parse_output: (out) => { const m = out.match(/opus_rzf_rate=(\d+)%\s+sonnet_intent_rate=(\d+)%\s+directive_rzf_quality_rate=(\d+)%\s+status=(\w+)/); return m ? { opus_rzf_rate: Number(m[1]), sonnet_intent_rate: Number(m[2]), directive_rzf_quality_rate: Number(m[3]), status: m[4] } : {}; },
  },
  {
    // S037-G LIVE — Handoff Completeness (OPEN-020/PI-019): HANDOFF-*.md files from last 90 days
    // must have ## ALIGNMENT QUESTIONS section with ≥3 questions. ADVISORY. P-META-014 MUV.
    name: 'handoff_completeness',
    command: 'node tools/validators/validate-handoff-completeness.mjs',
    parse_output: (out) => { const m = out.match(/handoffs_checked=(\d+)\s+missing_section=(\d+)\s+insufficient_questions=(\d+)/); return m ? { handoffs_checked: Number(m[1]), missing_section: Number(m[2]), insufficient_questions: Number(m[3]) } : {}; },
  },
  {
    // S037-F LIVE — Enforcement Trio Gate (Turn 84): PI files with status: ratified|implementing
    // must have enforcement_trio: field. ADVISORY (transition period). Turn 84 constitutional.
    name: 'enforcement_trio_assigned',  // slug: enforcement-trio-assigned (matches filename)
    command: 'node tools/validators/validate-enforcement-trio-assigned.mjs',
    parse_output: (out) => { const m = out.match(/pi_checked=(\d+)\s+active=(\d+)\s+missing_trio=(\d+)/); return m ? { pi_checked: Number(m[1]), active: Number(m[2]), missing_trio: Number(m[3]) } : {}; },
  },
  {
    // S037-C LIVE — Persona Chain Gate (OPEN-008): PI files with status: implementing must have
    // all 6 persona reviews complete (consolidation/balance/domain/ux/critic/synergy). ADVISORY.
    name: 'persona_chain_complete',
    command: 'node tools/validators/validate-persona-chain-complete.mjs',
    parse_output: (out) => { const m = out.match(/pi_checked=(\d+)\s+implementing=(\d+)\s+advisories=(\d+)/); return m ? { pi_checked: Number(m[1]), implementing: Number(m[2]), advisories: Number(m[3]) } : {}; },
  },
  {
    // S037-B LIVE — PI Questions Gate (OPEN-007): PI files with status: implementing must have
    // zero unanswered questions. ADVISORY. P-OPER-002 + P-ARCH-031.
    name: 'pi_questions_answered',
    command: 'node tools/validators/validate-pi-questions-answered.mjs',
    parse_output: (out) => { const m = out.match(/pi_checked=(\d+)\s+implementing=(\d+)\s+advisories=(\d+)/); return m ? { pi_checked: Number(m[1]), implementing: Number(m[2]), advisories: Number(m[3]) } : {}; },
  },
  {
    // S037 LIVE — PI-003 Implementation Gate: advisory check that lib/app commits reference PI-NNN.
    // Reads git log -1 --name-only. Advisory only (transition period per Opus Turn 62).
    // Exempt: fix:/chore:/docs: prefixes. Future: BLOCKING after PI backfill complete.
    name: 'implementation_gate',
    command: 'node tools/validators/validate-implementation-gate.mjs',
    parse_output: (out) => { const m = out.match(/advisories=(\d+)/); return m ? { advisories: Number(m[1]) } : {}; },
  },
  {
    // S044 Step 2 (PROTO-035): validate-agent-calls.mjs — T2 for INV-004
    name: 'agent_calls_compliance',
    command: 'node tools/validators/validate-agent-calls.mjs',
    parse_output: (out) => {
      const m = out.match(/agent_calls_checked=(\d+)\s+compliant=(\d+)\s+advisory=(\d+)/);
      return m ? { agent_calls_checked: Number(m[1]), compliant: Number(m[2]), advisory: Number(m[3]) } : {};
    },
  },
  {
    // S044 Step 3: invariant coverage — checks T1+T2 exist per invariant in invariant-registry.yaml
    name: 'invariant_coverage',
    command: 'node tools/validators/validate-invariant-coverage.mjs',
    parse_output: (out) => {
      const m = out.match(/invariants_checked=(\d+)\s+complete=(\d+)\s+partial=(\d+)\s+minimal=(\d+)/);
      return m ? { invariants_checked: Number(m[1]), complete: Number(m[2]), partial: Number(m[3]), minimal: Number(m[4]), advisory: true } : {};
    },
  },
  {
    // PI-037: plan readiness gate — PMI scoring per plan item (BLOCKING for implementing < 4/5)
    name: 'plan_readiness',
    command: 'node tools/validators/validate-plan-readiness.mjs',
    parse_output: (out) => {
      const m = out.match(/items_checked=(\d+)\s+pmi_ready=(\d+)\s+premature_implementing=(\d+)\s+advisory_ratified=(\d+)/);
      return m ? { items_checked: Number(m[1]), pmi_ready: Number(m[2]), premature_implementing: Number(m[3]), advisory_ratified: Number(m[4]) } : {};
    },
  },
  {
    // S043-E: DNA block enforcement — advisory check on playground pages
    name: 'page_dna_coverage',
    command: 'node tools/validators/validate-page-dna.mjs',
    parse_output: (out) => {
      const m = out.match(/pages_checked=(\d+)\s+dna_present=(\d+)\s+dna_missing=(\d+)/);
      return m ? { pages_checked: Number(m[1]), dna_present: Number(m[2]), dna_missing: Number(m[3]), advisory: true } : {};
    },
  },
  {
    // S043-F: Unified plan sync check — advisory when plan-api.json is stale
    name: 'unified_plan_sync',
    command: 'node tools/validators/validate-unified-plan-sync.mjs',
    parse_output: (out) => {
      const m = out.match(/plan_source_mtime=(\S+)\s+api_mtime=(\S+)\s+stale=(\w+)/);
      return m ? { plan_source_mtime: m[1], api_mtime: m[2], stale: m[3] === 'true', advisory: true } : {};
    },
  },
  {
    // S047 CORE-REMINDER-DNA: checks csps_core_reminder field coverage + stale refs
    name: 'core_reminder',
    command: 'node tools/validators/validate-core-reminder.mjs',
    parse_output: (out) => {
      const m = out.match(/scanned=(\d+)\s+with_reminder=(\d+)\s+without_reminder=(\d+)\s+stale_refs=(\d+)/);
      return m ? { scanned: parseInt(m[1]), with_reminder: parseInt(m[2]), without_reminder: parseInt(m[3]), stale_refs: parseInt(m[4]), advisory: true } : { advisory: true };
    },
  },
  {
    // S047 VALIDATE-ACTIVATION-COVERAGE: AP-001 — checks B_* contracts have activation mechanisms
    name: 'activation_coverage',
    command: 'node tools/validators/validate-activation-coverage.mjs',
    parse_output: (out) => {
      const m = out.match(/contracts_checked=(\d+)\s+activated=(\d+)\s+no_activation=(\d+)/);
      return m ? { contracts_checked: parseInt(m[1]), activated: parseInt(m[2]), no_activation: parseInt(m[3]), advisory: true } : { advisory: true };
    },
  },
  {
    // S047 VALIDATE-PAGE-SCHEMA-CONSISTENCY: checks PAGES registration vs directory structure
    name: 'page_schema_consistency',
    command: 'node tools/validators/validate-page-schema-consistency.mjs',
    parse_output: (out) => {
      const m = out.match(/dirs_checked=(\d+)\s+in_html=(\d+)\s+in_pages=(\d+)\s+missing_from_pages=(\d+)/);
      return m ? { dirs_checked: parseInt(m[1]), in_pages: parseInt(m[3]), missing_from_pages: parseInt(m[4]), advisory: true } : { advisory: true };
    },
  },
  {
    // S047 VALIDATE-PLAYGROUND-LINKS: BLOCKING if any platform page is not linked in index
    name: 'playground_links',
    command: 'node tools/validators/validate-playground-links.mjs',
    parse_output: (out) => {
      const m = out.match(/found=(\d+)\s+missing=(\d+)/);
      return m ? { found: parseInt(m[1]), missing: parseInt(m[2]) } : {};
    },
  },
  {
    // S054: Platform Genome guardian — 10 sections check + links per section
    name: 'platform_genome',
    command: 'node tools/validators/validate-platform-genome.mjs',
    parse_output: (out) => {
      const m = out.match(/sections_found=(\d+)\/10\s+sections_with_links=(\d+)\s+advisory=(\d+)/);
      return m ? { sections_found: Number(m[1]), sections_with_links: Number(m[2]), advisory: Number(m[3]) } : {};
    },
  },
  {
    // S054: Improvement register T2 — positive pipeline CEC enforcement
    name: 'improvement_register',
    command: 'node tools/validators/validate-improvement-register.mjs',
    parse_output: (out) => {
      const m = out.match(/entries=(\d+)\s+cec_needed=(\d+)\s+blocking=(\d+)/);
      return m ? { entries: Number(m[1]), cec_needed: Number(m[2]), blocking: Number(m[3]) } : {};
    },
  },
  {
    // S054: B_APPS_ARE_TRIALS T2 (constitutional backfitting, gap_T2_ORPHAN_CONTRACTS)
    // BLOCKING: apps/* contains nested package.json naming a @csps/* libs package (reimplementation)
    // ADVISORY: platform-procedure files inside apps/, relative imports bypassing @csps/ API
    name: 'apps_are_trials',
    command: 'node tools/validators/validate-apps-are-trials.mjs',
    parse_output: (out) => {
      const m = out.match(/apps_checked=(\d+)\s+libs_packages=(\d+)\s+blocking=(\d+)\s+advisory=(\d+)/);
      return m ? { apps_checked: Number(m[1]), libs_packages: Number(m[2]), blocking: Number(m[3]), advisory: Number(m[4]) } : {};
    },
  },
  {
    // S053: Communication quality gate — FROM/TO format + Governor impersonation check
    // BLOCKING (exit 0 advisory for now): "I AM: Yariv Fink" in non-startup templates
    // ADVISORY: communication relay templates missing FROM/TO format
    // Reads: tools/vault/wisdom/communication-samples.md (pattern library)
    name: 'communication_quality',
    command: 'node tools/validators/validate-communication-quality.mjs',
    parse_output: (out) => {
      const m = out.match(/checked=(\d+)\s+blocking=(\d+)\s+advisory=(\d+)\s+samples_loaded=(\w+)/);
      return m ? { checked: Number(m[1]), blocking: Number(m[2]), advisory: Number(m[3]), samples_loaded: m[4] === 'true' } : {};
    },
  },
  {
    // S053: Gap Recurrence Register enforcement — K count gating per P-META-019
    // BLOCKING: K>=3 AND status:open AND structural_fix_triggered:false
    // ADVISORY: K>=2 AND status:open AND behavioral_test_exists:false
    name: 'gap_recurrence',
    command: 'node tools/validators/validate-gap-recurrence.mjs',
    parse_output: (out) => {
      const m = out.match(/entries=(\d+)\s+open=(\d+)\s+k_ge2_no_test=(\d+)\s+k_ge3_no_fix=(\d+)/);
      return m ? { entries: Number(m[1]), open: Number(m[2]), k_ge2_no_test: Number(m[3]), k_ge3_no_fix: Number(m[4]) } : {};
    },
  },
  {
    // S053: ZF cycle format T2 — nominal ZF detection (gap_ZF_NOMINAL_CYCLES K=6)
    // BLOCKING: Cycle 2+ claims ZF ACHIEVED but cites no file names.
    // ADVISORY: Cycle 2+ uses vague words (areas/topics/things) without file names.
    // Scans tools/council/sonnet-turn.md + tools/council/opus-turn.md by default.
    name: 'zf_cycle_format',
    command: 'node tools/validators/validate-zf-cycle-format.mjs',
    parse_output: (out) => {
      const m = out.match(/zf_blocks_checked=(\d+)\s+blocking=(\d+)\s+advisory=(\d+)/);
      return m ? { zf_blocks_checked: Number(m[1]), blocking: Number(m[2]), advisory: Number(m[3]) } : {};
    },
  },
  {
    // S056: PIE-READINESS-GATE — B_PIE_READINESS_GATE T2. Checks implementing items
    // against CORE-COMPLETE-EXIT-CRITERIA.md layer prerequisites.
    // ADVISORY: R2 item with Layer 1 incomplete. BLOCKING: R3+ with layer incomplete.
    name: 'pie_readiness_gate',
    command: 'node tools/validators/validate-pie-readiness-gate.mjs',
    parse_output: (out) => {
      const m = out.match(/items_checked=(\d+)\s+blocked=(\d+)\s+advisory=(\d+)\s+layer1=(\S+)\s+layer2=(\S+)/);
      return m ? { items_checked: Number(m[1]), blocked: Number(m[2]), advisory: Number(m[3]), layer1: m[4], layer2: m[5] } : {};
    },
  },
  {
    // S057: SETTINGS-SHADOW validator — detects .claude/settings.local.json shadowing
    // project settings.json permissions (causes permission popups on every new tab).
    // BLOCKING if settings.local.json has "permissions" key.
    name: 'settings_shadow',
    command: 'node tools/validators/validate-settings-shadow.mjs',
    parse_output: (out) => {
      const m = out.match(/settings_local_clean=(\S+)\s+blocking=(\d+)\s+advisory=(\d+)/);
      return m ? { settings_local_clean: m[1] === 'true', blocking: Number(m[2]), advisory: Number(m[3]) } : {};
    },
  },
  {
    // S055: SESSION-AUTHORITY advisory validator. Compares current_session in session-state.json
    // against the latest session marker in sonnet-turn.md. Advisory if gap > 2 sessions.
    // Flags potential "three drivers" problem (multiple sessions without authority signal).
    name: 'session_authority',
    command: 'node tools/validators/validate-session-authority.mjs',
    parse_output: (out) => {
      const m = out.match(/state_session=(\S+)\s+council_session=(\S+)\s+gap=(-?\d+)\s+session_spread=(\d+)\s+advisory=(\d+)\s+blocking=(\d+)/);
      return m ? { state_session: m[1], council_session: m[2], gap: Number(m[3]), session_spread: Number(m[4]), advisory: Number(m[5]), blocking: Number(m[6]) } : {};
    },
  },
  {
    // S055: AI-CONCEPTION-ENFORCEMENT advisory baseline — gap_T1_AI_CONCEPTION_VAULT (K=5).
    // Advisory-only: measures enforcement_tier coverage rate across ai-conception/ vault files.
    // Baseline S055: 0% (13/13 missing). Target: 100% after backfill pass.
    name: 'ai_conception_enforcement',
    command: 'node tools/validators/validate-ai-conception-enforcement.mjs',
    parse_output: (out) => {
      const m = out.match(/files_checked=(\d+)\s+missing_tier=(\d+)\s+missing_t1=(\d+)\s+missing_t2=(\d+)\s+enforcement_rate=(\d+)%\s+advisory=(\d+)\s+blocking=(\d+)/);
      return m ? { files_checked: Number(m[1]), missing_tier: Number(m[2]), missing_t1: Number(m[3]), missing_t2: Number(m[4]), enforcement_rate: Number(m[5]), advisory: Number(m[6]), blocking: Number(m[7]) } : {};
    },
  },
  {
    // S055: CONTEXTUAL-LOCALITY T2 — B_CONTEXTUAL_LOCALITY (gap_T2_ORPHAN_CONTRACTS).
    // BLOCKING: navigation phrases in council/*.md. ADVISORY: same in governance docs.
    name: 'contextual_locality',
    command: 'node tools/validators/validate-contextual-locality.mjs',
    parse_output: (out) => {
      const m = out.match(/files_checked=(\d+)\s+blocking=(\d+)\s+advisory=(\d+)/);
      return m ? { files_checked: Number(m[1]), blocking: Number(m[2]), advisory: Number(m[3]) } : {};
    },
  },
  {
    // S055: DONE-RIGHT T2 — B_DONE_RIGHT_FROM_THE_START (gap_T2_ORPHAN_CONTRACTS).
    // BLOCKING: B_*.md missing enforcement_tier. ADVISORY: T1+T2 both pending (T3-only drift risk).
    name: 'done_right',
    command: 'node tools/validators/validate-done-right.mjs',
    parse_output: (out) => {
      const m = out.match(/files_checked=(\d+)\s+missing_enforcement_tier=(\d+)\s+t3_only=(\d+)\s+blocking=(\d+)/);
      return m ? { files_checked: Number(m[1]), missing_enforcement_tier: Number(m[2]), t3_only: Number(m[3]), blocking: Number(m[4]) } : {};
    },
  },
  {
    // S055: VALIDATE-VALIDATORS meta-validator layer (Methodology 5). Reads verify-last-run.md.
    // Advisory: DEFERRED validators + validators with empty parse_output + all-zero numeric output.
    // "Existence ≠ active" (AP-001) applied to validators themselves.
    name: 'validate_validators',
    command: 'node tools/validators/validate-validators.mjs',
    parse_output: (out) => {
      const m = out.match(/total=(\d+)\s+deferred=(\d+)\s+empty_output=(\d+)\s+zero_numeric=(\d+)\s+advisory=(\d+)\s+blocking=(\d+)/);
      return m ? { total: Number(m[1]), deferred: Number(m[2]), empty_output: Number(m[3]), zero_numeric: Number(m[4]), advisory: Number(m[5]), blocking: Number(m[6]) } : {};
    },
  },
  {
    // S055: POSITIVE-REFLEXIVITY T2 — K>=2 improvement entries must have draft or plan item.
    // Reads improvement-register.yaml + pending-plan-items.yaml + unified-plan.yaml.
    // BLOCKING if K>=2 entry has no draft and no plan item. ADVISORY if draft not yet promoted.
    name: 'positive_reflexivity',
    command: 'node tools/validators/validate-positive-reflexivity.mjs',
    parse_output: (out) => {
      const m = out.match(/entries=(\d+)\s+covered=(\d+)\s+advisory_drafts=(\d+)\s+blocking=(\d+)/);
      return m ? { entries: Number(m[1]), covered: Number(m[2]), advisory_drafts: Number(m[3]), blocking: Number(m[4]) } : {};
    },
  },
  {
    // S053: THRESHOLD R1.4.1 T2 — advisory report on intake log classification
    // Reads tools/data/threshold-intake-log.yaml. Reports total entries + type distribution.
    // Advisory always. Grows as governor prompts accumulate per-session.
    name: 'threshold_intake',
    command: 'node tools/validators/validate-threshold-intake.mjs',
    parse_output: (out) => {
      const m = out.match(/total_entries=(\d+)\s+sessions=(\d+)/);
      return m ? { total_entries: Number(m[1]), sessions: Number(m[2]), advisory: true } : { advisory: true };
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
