# verify last run

- ran_at: 2026-05-14T11:11:27.616Z
- finished_at: 2026-05-14T12:26:11.963Z
- exit_code: 0

```yaml
{
  "pre_close_verification": {
    "ran_at": "2026-05-14T11:11:27.616Z",
    "finished_at": "2026-05-14T12:26:11.963Z",
    "orchestrator": "tools/verify.mjs",
    "cycles": [
      {
        "name": "pnpm_install_frozen",
        "command": "pnpm install --frozen-lockfile",
        "status": "DEFERRED-WITH-REASON",
        "skip_reason": "flag --skip-install"
      },
      {
        "name": "typecheck_recursive",
        "command": "pnpm -r --filter \"./packages/**\" typecheck",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.7,
        "ts_errors": 0
      },
      {
        "name": "principles_validate",
        "command": "pnpm --filter @csps/principles validate:all",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 1,
        "principles_loaded": 60,
        "findings_total": 1
      },
      {
        "name": "frontmatter_validate",
        "command": "node tools/validators/validate-frontmatter.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "scanned": 361,
        "errors": 0,
        "warnings": 11,
        "exempt": 275
      },
      {
        "name": "aap_frontmatter_coverage",
        "command": "node tools/validators/validate-aap-frontmatter.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "skills_scanned": 26,
        "missing_aap": 0,
        "aligned": 26
      },
      {
        "name": "principle_count_staleness",
        "command": "node tools/validators/validate-principle-count-staleness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.3,
        "stale_count_files": 0
      },
      {
        "name": "ai_behavior_spine_slices_sync",
        "command": "node tools/validators/validate-ai-behavior-spine-slices.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "source_sections": 10,
        "missing_slices": 0
      },
      {
        "name": "audit_runner_slices_sync",
        "command": "node tools/validators/validate-audit-runner-slices.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "source_pipelines": 28,
        "missing_slices": 0
      },
      {
        "name": "behavioral_contract_slices_sync",
        "command": "node tools/validators/validate-behavioral-contract-slices.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "source_contracts": 58,
        "missing_slices": 0
      },
      {
        "name": "principle_slices_sync",
        "command": "node tools/validators/validate-principle-slices.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "source_ids": 60,
        "missing_slices": 0
      },
      {
        "name": "mjs_syntax_check",
        "command": "node --check tools/verify.mjs tools/pe-compute.mjs tools/validators/validate-aap-frontmatter.mjs tools/validators/validate-token-budget.mjs tools/validators/validate-corespine-depth-markers.mjs tools/validators/validate-audit-slug-coverage.mjs tools/validators/validate-frontmatter.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "syntax_ok": true
      },
      {
        "name": "audit_health",
        "command": "node tools/validators/validate-audit-health.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2
      },
      {
        "name": "model_tier_currency",
        "command": "node tools/validators/validate-model-tier-currency.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1
      },
      {
        "name": "ai_defaults_freshness",
        "command": "node tools/validators/validate-inner-ai-defaults-freshness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1
      },
      {
        "name": "ai_defaults_enforcement_rate",
        "command": "node tools/validators/validate-inner-ai-defaults-enforcement-rate.mjs",
        "status": "ACCEPTABLE",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "enforcement_rate": 80
      },
      {
        "name": "opus_audit_due",
        "command": "node tools/validators/validate-opus-audit-due.mjs",
        "status": "OK",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "sessions_since": 2
      },
      {
        "name": "opus_turn_rzf",
        "command": "node tools/validators/validate-opus-turn-rzf.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1
      },
      {
        "name": "sonnet_report",
        "command": "node tools/validators/validate-sonnet-report.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "has_report": true
      },
      {
        "name": "boundary_alignment",
        "command": "node tools/validators/validate-boundary-alignment.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checks": 2,
        "warnings": 1
      },
      {
        "name": "pe_dashboard",
        "command": "node tools/validators/validate-pe-dashboard.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "plans": 20,
        "open_items": 144
      },
      {
        "name": "dead_links",
        "command": "node tools/validators/validate-dead-links.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "files": 112,
        "links": 513,
        "broken": 42
      },
      {
        "name": "opus_review_flagging",
        "command": "node tools/validators/validate-opus-review-flagging.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "last_turn": 23,
        "flags": 11,
        "commits": 0
      },
      {
        "name": "open_questions",
        "command": "node tools/validators/validate-open-questions.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "plans": 2,
        "total": 2,
        "open": 0
      },
      {
        "name": "participant_declared",
        "command": "node tools/validators/validate-participant-declared.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 1.3,
        "checked": 32,
        "advisories": 24
      },
      {
        "name": "completeness_coverage",
        "command": "node tools/validators/validate-completeness-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "contracts": 6,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "template_grade",
        "command": "node tools/validators/validate-template-grade.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "graded": 12,
        "advisories": 0
      },
      {
        "name": "contract_harmonization",
        "command": "node tools/validators/validate-contract-harmonization.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "contracts": 58,
        "orphans": 5,
        "tensions": 0,
        "overlaps": 1
      },
      {
        "name": "satisfaction_point",
        "command": "node tools/validators/validate-satisfaction-point.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "advisories": 0
      },
      {
        "name": "agreement_without_evidence",
        "command": "node tools/validators/validate-agreement-without-evidence.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 2,
        "advisories": 1
      },
      {
        "name": "crystallization_bypass",
        "command": "node tools/validators/validate-crystallization-bypass.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "plans": 16,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "comprehensive_response",
        "command": "node tools/validators/validate-comprehensive-response.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "advisories": 0
      },
      {
        "name": "diataxis_type",
        "command": "node tools/validators/validate-diataxis-type.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 74,
        "blocking": 0,
        "advisories": 0
      },
      {
        "name": "bottleneck_patterns",
        "command": "node tools/validators/validate-bottleneck-patterns.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "routes": 20,
        "validators": 104,
        "models": 0,
        "advisories": 8
      },
      {
        "name": "dna_evidence",
        "command": "node tools/validators/validate-dna-evidence.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "elements_checked": 17,
        "advisories": 0
      },
      {
        "name": "multi_topic_decomposition",
        "command": "node tools/validators/validate-multi-topic-decomposition.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 3,
        "advisories": 4
      },
      {
        "name": "opus_rzf_gap_tracking",
        "command": "node tools/validators/validate-opus-rzf-gap-tracking.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "sections": 11,
        "tracked": 0,
        "advisories": 11
      },
      {
        "name": "opus_cec_artifacts",
        "command": "node tools/validators/validate-opus-cec-artifacts.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "sections": 13,
        "applied_yes": 0,
        "cited": 0,
        "advisories": 0
      },
      {
        "name": "schema_anchors",
        "command": "node tools/validators/validate-schema-anchors.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 329,
        "clean": 329,
        "blocking": 0,
        "registry": 48
      },
      {
        "name": "generated_artifact_freshness",
        "command": "node tools/validators/validate-generated-artifact-freshness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 5,
        "advisories": 0
      },
      {
        "name": "spine_hierarchy",
        "command": "node tools/validators/validate-spine-hierarchy.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 28,
        "blocking": 0,
        "advisories": 0
      },
      {
        "name": "frontmatter_count_consistency",
        "command": "node tools/validators/validate-frontmatter-count-consistency.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 4,
        "advisories": 0
      },
      {
        "name": "deferred_target_session",
        "command": "node tools/validators/validate-deferred-target-session.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 3,
        "advisories": 2
      },
      {
        "name": "no_laptop_secrets",
        "command": "node tools/validators/validate-no-laptop-secrets.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "apps": 4,
        "advisories": 3
      },
      {
        "name": "scope_conflict",
        "command": "node tools/validators/validate-scope-conflict.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 39,
        "advisories": 1
      },
      {
        "name": "core_contamination",
        "command": "node tools/validators/validate-core-contamination.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 131,
        "blocking": 0,
        "advisories": 0
      },
      {
        "name": "laptop_patterns",
        "command": "node tools/validators/validate-laptop-patterns.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "checked": 39,
        "blocking": 0,
        "advisories": 7
      },
      {
        "name": "request_ledger",
        "command": "node tools/validators/validate-request-ledger.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "open": 0,
        "advisories": 0,
        "blocking": 0
      },
      {
        "name": "skill_dna_alignment",
        "command": "node tools/validators/validate-skill-dna-alignment.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "skills": 26,
        "advisories": 2
      },
      {
        "name": "question_coverage",
        "command": "node tools/validators/validate-question-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1
      },
      {
        "name": "gradual_bundling",
        "command": "node tools/validators/validate-gradual-bundling.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "active_plans": 0,
        "near_complete": 0,
        "no_depth": 0,
        "no_stage": 0,
        "backlog_pending": 25
      },
      {
        "name": "naming_convention",
        "command": "node tools/validators/validate-naming-convention.mjs --scan-new",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "issues": 1,
        "advisory": 1,
        "duplicates": 0
      },
      {
        "name": "research_reuse",
        "command": "node tools/validators/validate-research-reuse.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "total": 7,
        "active": 7,
        "stale": 0,
        "high_confidence": 6,
        "approaching_stale": 0
      },
      {
        "name": "completion_circle",
        "command": "node tools/validators/validate-completion-circle.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "assessed": 38,
        "no_dev_surface": 38,
        "no_user_value": 38,
        "incomplete": 38
      },
      {
        "name": "update_backlog",
        "command": "node tools/validators/validate-update-backlog.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "total": 41,
        "pending": 25,
        "blocked": 11,
        "done": 5
      },
      {
        "name": "hook_lifecycle_state",
        "command": "node tools/validators/validate-hook-lifecycle-state.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "total": 26,
        "active": 14,
        "stub": 10,
        "unknown": 2,
        "stub_rate": 38
      },
      {
        "name": "session_harvest_readiness",
        "command": "node tools/validators/validate-session-harvest-readiness.mjs",
        "status": "HARVEST_DONE",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "session": "S022",
        "validators": 105
      },
      {
        "name": "prose_no_confirmation_seeking",
        "command": "node tools/validators/validate-prose-no-confirmation-seeking.mjs",
        "status": "CLEAN",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files_scanned": 2,
        "findings": 0
      },
      {
        "name": "decision_frame_citation",
        "command": "node tools/validators/validate-decision-frame-citation.mjs",
        "status": "CLEAN",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files_scanned": 3,
        "with_pcr": 0,
        "advisory_gaps": 0
      },
      {
        "name": "concept_load_declared",
        "command": "node tools/validators/validate-concept-load-declared.mjs",
        "status": "ADVISORY",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files_scanned": 2,
        "with_concept_load": 0,
        "advisory_gaps": 2
      },
      {
        "name": "subagent_spawn_preamble",
        "command": "node tools/validators/validate-subagent-spawn-preamble.mjs",
        "status": "CLEAN",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checks": 3,
        "passing": 3,
        "advisory_gaps": 0
      },
      {
        "name": "layer_boundary",
        "command": "node tools/validators/validate-layer-boundary.mjs",
        "status": "CLEAN",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files_scanned": 13,
        "violations": 0
      },
      {
        "name": "drift_registry_coverage",
        "command": "node tools/validators/validate-drift-registry.mjs",
        "status": "ACCEPTABLE",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "total": 7,
        "active": 5,
        "coverage_pct": 71,
        "critical_unprotected": 0
      },
      {
        "name": "catch_completeness",
        "command": "node tools/validators/validate-catch-completeness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1
      },
      {
        "name": "council_coverage",
        "command": "node tools/validators/validate-council-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1
      },
      {
        "name": "universal_alignment",
        "command": "node tools/validators/validate-universal-alignment.mjs --scan-new",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files": 0
      },
      {
        "name": "import_quarantine",
        "command": "node tools/validators/validate-import-quarantine.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1
      },
      {
        "name": "nothing_stands_alone",
        "command": "node tools/validators/validate-nothing-stands-alone.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1
      },
      {
        "name": "moat_coverage",
        "command": "node tools/validators/validate-moat-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "total": 18,
        "covered": 18,
        "critical_gaps": 0
      },
      {
        "name": "impl_status",
        "command": "node tools/validators/validate-impl-status.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 90,
        "with_status": 38,
        "warnings": 0
      },
      {
        "name": "no_implementation_without_plan",
        "command": "node tools/validators/validate-no-implementation-without-plan.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 10,
        "exempt": 3,
        "unplanned": 2
      },
      {
        "name": "vlt_blocking",
        "command": "node tools/validators/validate-vlt-blocking.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1
      },
      {
        "name": "instruction_context",
        "command": "node tools/validators/validate-instruction-context.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 133,
        "missing_why": 34
      },
      {
        "name": "open_plan_levels",
        "command": "node tools/validators/validate-open-plan-levels.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "plans_checked": 20,
        "plans_with_open": 10,
        "total_open_items": 144
      },
      {
        "name": "rzf_evidence",
        "command": "node tools/validators/validate-rzf-evidence.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checks": 2,
        "warnings": 0
      },
      {
        "name": "slice_freshness",
        "command": "node tools/validators/validate-slice-freshness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "pairs_checked": 4,
        "stale": 0
      },
      {
        "name": "plan_know_how",
        "command": "node tools/validators/validate-plan-know-how.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 18,
        "grandfathered": 2,
        "errors": 0
      },
      {
        "name": "pe_connectivity",
        "command": "node tools/validators/validate-pe-connectivity.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.3,
        "blocking": 0,
        "advisory": 20,
        "total_gaps": 20
      },
      {
        "name": "plan_ai_defaults_alignment",
        "command": "node tools/validators/validate-plan-ai-defaults.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "scanned": 25,
        "flagged": 3,
        "ratified": 1,
        "blocking": 0,
        "advisory": 2
      },
      {
        "name": "consolidation_check_coverage",
        "command": "node tools/validators/validate-consolidation-check.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 20,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "plan_zf_requirement_coverage",
        "command": "node tools/validators/validate-plan-zf-requirement.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 20,
        "with_field": 1,
        "missing": 19
      },
      {
        "name": "simulation_before_implementation",
        "command": "node tools/validators/validate-simulation-before-implementation.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1
      },
      {
        "name": "sandbox_lifecycle",
        "command": "node tools/validators/validate-sandbox-lifecycle.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1
      },
      {
        "name": "intent_crystallized",
        "command": "node tools/validators/validate-intent-crystallized.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 20,
        "blocking": 0,
        "advisory": 17
      },
      {
        "name": "routing_declared",
        "command": "node tools/validators/validate-routing-declared.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "plans_checked": 20,
        "blocking": 0,
        "advisory": 4
      },
      {
        "name": "ux_principles_declared",
        "command": "node tools/validators/validate-ux-principles-declared.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "pages_checked": 15,
        "with_principle": 3,
        "advisory": 12
      },
      {
        "name": "isolation_layers",
        "command": "node tools/validators/validate-isolation-layers.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "webhook_idempotency",
        "command": "node tools/validators/validate-webhook-idempotency.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "cases": 7,
        "advisory": 1
      },
      {
        "name": "solo_user_flow",
        "command": "node tools/validators/validate-solo-user-flow.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 3,
        "advisory": 1
      },
      {
        "name": "pe_situation_declared",
        "command": "node tools/validators/validate-pe-situation-declared.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "situation": "APP_BUILD_MODE",
        "registry": "true"
      },
      {
        "name": "gdpr_erasure_path",
        "command": "node tools/validators/validate-gdpr-erasure-path.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 3,
        "advisory": 1
      },
      {
        "name": "subscription_error_handling",
        "command": "node tools/validators/validate-subscription-error-handling.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "routes_checked": 4,
        "with_gate": 4,
        "advisory": 4
      },
      {
        "name": "intake_source_class_coverage",
        "command": "node tools/validators/validate-source-class-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "source_classes": 4,
        "errors": 0
      },
      {
        "name": "intake_event_validate",
        "command": "node tools/validators/validate-intake-event.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files": 0,
        "rows": 0
      },
      {
        "name": "git_pushed_state",
        "command": "node tools/validators/validate-git-pushed-state.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.3,
        "warnings": 1,
        "advisory": true
      },
      {
        "name": "topic_plan_progress",
        "command": "node tools/validators/validate-topic-plan-progress.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "plans_checked": 20,
        "warnings": 0
      },
      {
        "name": "session_artifact_sync",
        "command": "node tools/validators/validate-session-artifact-sync.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checks": 3,
        "warnings": 0
      },
      {
        "name": "audit_slug_coverage",
        "command": "node tools/validators/validate-audit-slug-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "validators_checked": 105,
        "orphans": 0,
        "registered": 105
      },
      {
        "name": "token_budget_validate",
        "command": "node tools/validators/validate-token-budget.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "modes": 5,
        "red": 0,
        "yellow": 0,
        "info": 2,
        "advisory_window": true
      },
      {
        "name": "corespine_depth_markers",
        "command": "node tools/validators/validate-corespine-depth-markers.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 28,
        "l1_core": 5,
        "l2_domain": 18,
        "l3_instances": 5,
        "errors": 0,
        "warnings": 0
      },
      {
        "name": "plan_harvest_coverage",
        "command": "node tools/validators/validate-plan-harvest-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "plans_checked": 20,
        "missing_harvest": 10,
        "warnings": 10
      },
      {
        "name": "execution_mode_declared",
        "command": "node tools/validators/validate-execution-mode-declared.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "plans_checked": 20,
        "missing_mode": 0,
        "warnings": 0
      },
      {
        "name": "bedrock_completion",
        "command": "node tools/validators/validate-bedrock.mjs",
        "status": "COMPLETE",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "total": 22,
        "done": 22,
        "deferred": 0,
        "blocking": 0,
        "completion_pct": 100
      },
      {
        "name": "plan_age_alignment",
        "command": "node tools/validators/validate-plan-age-alignment.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "plans_checked": 20,
        "stale_total": 10,
        "unverified": 10,
        "verified": 0,
        "likely_done_items": 1
      },
      {
        "name": "phase_exit_criteria",
        "command": "node tools/validators/validate-phase-exit-criteria.mjs",
        "status": "CLEAN",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "plans_checked": 20,
        "sections_checked": 7,
        "blocking": 0,
        "warnings": 0
      },
      {
        "name": "foundation_schema_drift",
        "command": "node tools/validators/validate-foundation-schema-drift.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 4471.2
      },
      {
        "name": "audit_runner_full_pass",
        "command": "pnpm audit:run --strict",
        "status": "DEFERRED-WITH-REASON",
        "skip_reason": "audit-runner ships week-4 (planned per build-order.md week 4)"
      }
    ],
    "exit_code": 0,
    "strict_mode": false
  }
}
```
