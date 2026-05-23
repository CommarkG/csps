# verify last run

- ran_at: 2026-05-23T19:38:16.243Z
- finished_at: 2026-05-23T19:38:55.011Z
- exit_code: 0

```yaml
{
  "pre_close_verification": {
    "ran_at": "2026-05-23T19:38:16.243Z",
    "finished_at": "2026-05-23T19:38:55.011Z",
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
        "duration_seconds": 1.8,
        "ts_errors": 0
      },
      {
        "name": "principles_validate",
        "command": "pnpm --filter @csps/principles validate:all",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 1.1,
        "principles_loaded": 68,
        "findings_total": 22
      },
      {
        "name": "frontmatter_validate",
        "command": "node tools/validators/validate-frontmatter.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.3,
        "scanned": 568,
        "errors": 0,
        "warnings": 106,
        "exempt": 320
      },
      {
        "name": "aap_frontmatter_coverage",
        "command": "node tools/validators/validate-aap-frontmatter.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "skills_scanned": 27,
        "missing_aap": 0,
        "aligned": 27
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
        "source_contracts": 0,
        "missing_slices": 0
      },
      {
        "name": "principle_slices_sync",
        "command": "node tools/validators/validate-principle-slices.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "source_ids": 68,
        "missing_slices": 0
      },
      {
        "name": "mjs_syntax_check",
        "command": "node --check tools/verify.mjs tools/pe-compute.mjs tools/validators/validate-aap-frontmatter.mjs tools/validators/validate-token-budget.mjs tools/validators/validate-corespine-depth-markers.mjs tools/validators/validate-audit-slug-coverage.mjs tools/validators/validate-frontmatter.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
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
        "duration_seconds": 0.2
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
        "duration_seconds": 0.2,
        "enforcement_rate": 81
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
        "checks": 1,
        "warnings": 0
      },
      {
        "name": "pe_dashboard",
        "command": "node tools/validators/validate-pe-dashboard.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "plans": 42,
        "open_items": 144
      },
      {
        "name": "dead_links",
        "command": "node tools/validators/validate-dead-links.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "files": 145,
        "links": 598,
        "broken": 63
      },
      {
        "name": "opus_review_flagging",
        "command": "node tools/validators/validate-opus-review-flagging.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "last_turn": 23,
        "flags": 10,
        "commits": 0
      },
      {
        "name": "open_questions",
        "command": "node tools/validators/validate-open-questions.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "plans": 3,
        "total": 4,
        "open": 0
      },
      {
        "name": "participant_declared",
        "command": "node tools/validators/validate-participant-declared.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 3.2,
        "checked": 89,
        "advisories": 79
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
        "advisories": 1
      },
      {
        "name": "contract_harmonization",
        "command": "node tools/validators/validate-contract-harmonization.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "contracts": 63,
        "orphans": 0,
        "tensions": 0,
        "overlaps": 0
      },
      {
        "name": "satisfaction_point",
        "command": "node tools/validators/validate-satisfaction-point.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "advisories": 1
      },
      {
        "name": "agreement_without_evidence",
        "command": "node tools/validators/validate-agreement-without-evidence.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 2,
        "advisories": 3
      },
      {
        "name": "crystallization_bypass",
        "command": "node tools/validators/validate-crystallization-bypass.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "plans": 17,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "comprehensive_response",
        "command": "node tools/validators/validate-comprehensive-response.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "advisories": 1
      },
      {
        "name": "diataxis_type",
        "command": "node tools/validators/validate-diataxis-type.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 93,
        "blocking": 0,
        "advisories": 0
      },
      {
        "name": "bottleneck_patterns",
        "command": "node tools/validators/validate-bottleneck-patterns.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "routes": 37,
        "validators": 156,
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
        "advisories": 2
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
        "sections": 19,
        "applied_yes": 0,
        "cited": 0,
        "advisories": 0
      },
      {
        "name": "schema_anchors",
        "command": "node tools/validators/validate-schema-anchors.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "checked": 521,
        "clean": 521,
        "blocking": 0,
        "registry": 62
      },
      {
        "name": "generated_artifact_freshness",
        "command": "node tools/validators/validate-generated-artifact-freshness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 5,
        "advisories": 5
      },
      {
        "name": "spine_hierarchy",
        "command": "node tools/validators/validate-spine-hierarchy.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 29,
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
        "advisories": 1
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
        "apps": 7,
        "advisories": 5
      },
      {
        "name": "scope_conflict",
        "command": "node tools/validators/validate-scope-conflict.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 42,
        "advisories": 1
      },
      {
        "name": "mini_tree_integrity",
        "command": "node tools/validators/validate-mini-tree-integrity.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "platform_capacity",
        "command": "node tools/validators/validate-platform-capacity.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "blocking": 0,
        "advisory": 4
      },
      {
        "name": "file_complexity_validate",
        "command": "node tools/validators/validate-file-complexity.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "scanned": 659,
        "advisory": 95
      },
      {
        "name": "file_naming",
        "command": "node tools/validators/validate-file-naming.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 30,
        "advisory": 3,
        "exempt": 27
      },
      {
        "name": "opus_chat_jump_freshness",
        "command": "node tools/validators/validate-opus-chat-jump-freshness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "turns": 78,
        "session": "unknown",
        "has_chat_jump": false
      },
      {
        "name": "security_headers_compliance",
        "command": "node tools/validators/validate-security-headers.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "apps": 4,
        "passing": 4,
        "blocking": 0,
        "skipped": 3
      },
      {
        "name": "scope_level_declared",
        "command": "node tools/validators/validate-scope-level-declared.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 243,
        "missing": 120,
        "invalid": 0,
        "exempt": 1
      },
      {
        "name": "rule_has_enforcement",
        "command": "node tools/validators/validate-rule-has-enforcement.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "advisories": 2
      },
      {
        "name": "governor_instructions",
        "command": "node tools/validators/validate-governor-instructions.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "violations": 0
      },
      {
        "name": "error_registry_coverage",
        "command": "node tools/validators/validate-error-registry-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "overrides": 1,
        "covered": 0,
        "uncovered": 1
      },
      {
        "name": "wiring_completeness",
        "command": "node tools/validators/validate-wiring-completeness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "wired": 18,
        "deferred": 35,
        "orphan": 0
      },
      {
        "name": "communication_protocol",
        "command": "node tools/validators/validate-communication-protocol.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "advisory": 12
      },
      {
        "name": "active_protocol_compliance",
        "command": "node tools/validators/validate-active-protocol.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "advisory": 1,
        "blocking": 0
      },
      {
        "name": "core_contamination",
        "command": "node tools/validators/validate-core-contamination.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "checked": 200,
        "blocking": 0,
        "advisories": 0
      },
      {
        "name": "laptop_patterns",
        "command": "node tools/validators/validate-laptop-patterns.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.5,
        "checked": 42,
        "blocking": 0,
        "advisories": 7
      },
      {
        "name": "request_ledger",
        "command": "node tools/validators/validate-request-ledger.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
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
        "skills": 27,
        "advisories": 22
      },
      {
        "name": "question_coverage",
        "command": "node tools/validators/validate-question-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2
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
        "duration_seconds": 0.3,
        "issues": 0,
        "advisory": 0,
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
        "assessed": 55,
        "no_dev_surface": 55,
        "no_user_value": 55,
        "incomplete": 55
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
        "total": 43,
        "active": 35,
        "stub": 4,
        "unknown": 4,
        "stub_rate": 9
      },
      {
        "name": "declared_never_finished",
        "command": "node tools/validators/validate-declared-never-finished.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 74,
        "significant": 0,
        "week4_stubs": 1
      },
      {
        "name": "gap_routing",
        "command": "node tools/validators/validate-gap-routing.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "findings": 1,
        "significant": 0,
        "advisory": 1,
        "vaulted": 0
      },
      {
        "name": "context_question_coverage",
        "command": "node tools/validators/validate-context-question-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "with_cq": 211,
        "total": 459,
        "pct": 46
      },
      {
        "name": "session_harvest_readiness",
        "command": "node tools/validators/validate-session-harvest-readiness.mjs",
        "status": "HARVEST_DONE",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "session": "S057",
        "validators": 157
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
        "status": "ADVISORY",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checks": 3,
        "passing": 2,
        "advisory_gaps": 1
      },
      {
        "name": "layer_boundary",
        "command": "node tools/validators/validate-layer-boundary.mjs",
        "status": "CLEAN",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "files_scanned": 67,
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
        "duration_seconds": 0.2,
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
        "checked": 109,
        "with_status": 54,
        "warnings": 0
      },
      {
        "name": "no_implementation_without_plan",
        "command": "node tools/validators/validate-no-implementation-without-plan.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 19,
        "exempt": 4,
        "unplanned": 8
      },
      {
        "name": "vlt_blocking",
        "command": "node tools/validators/validate-vlt-blocking.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2
      },
      {
        "name": "instruction_context",
        "command": "node tools/validators/validate-instruction-context.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 172,
        "missing_why": 42
      },
      {
        "name": "open_plan_levels",
        "command": "node tools/validators/validate-open-plan-levels.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "plans_checked": 21,
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
        "checked": 19,
        "grandfathered": 2,
        "errors": 0
      },
      {
        "name": "pe_connectivity",
        "command": "node tools/validators/validate-pe-connectivity.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.5,
        "blocking": 0,
        "advisory": 21,
        "total_gaps": 21
      },
      {
        "name": "plan_ai_defaults_alignment",
        "command": "node tools/validators/validate-plan-ai-defaults.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "scanned": 26,
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
        "checked": 21,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "plan_zf_requirement_coverage",
        "command": "node tools/validators/validate-plan-zf-requirement.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 21,
        "with_field": 2,
        "missing": 19
      },
      {
        "name": "core_seeds_coverage",
        "command": "node tools/validators/validate-core-seeds.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "seeds_found": 13,
        "overdue": 9
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
        "checked": 21,
        "blocking": 0,
        "advisory": 17
      },
      {
        "name": "routing_declared",
        "command": "node tools/validators/validate-routing-declared.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "plans_checked": 21,
        "blocking": 0,
        "advisory": 4
      },
      {
        "name": "ux_principles_declared",
        "command": "node tools/validators/validate-ux-principles-declared.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "pages_checked": 49,
        "with_principle": 3,
        "advisory": 46
      },
      {
        "name": "isolation_layers",
        "command": "node tools/validators/validate-isolation-layers.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
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
        "checked": 5,
        "advisory": 2
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
        "checked": 6,
        "advisory": 4
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
        "duration_seconds": 0.1,
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
        "duration_seconds": 0.1,
        "plans_checked": 21,
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
        "validators_checked": 157,
        "orphans": 0,
        "registered": 157
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
        "duration_seconds": 0.3,
        "checked": 29,
        "l1_core": 5,
        "l2_domain": 19,
        "l3_instances": 5,
        "errors": 0,
        "warnings": 0
      },
      {
        "name": "plan_harvest_coverage",
        "command": "node tools/validators/validate-plan-harvest-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "plans_checked": 21,
        "missing_harvest": 11,
        "warnings": 11
      },
      {
        "name": "execution_mode_declared",
        "command": "node tools/validators/validate-execution-mode-declared.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "plans_checked": 21,
        "missing_mode": 0,
        "warnings": 0
      },
      {
        "name": "bedrock_completion",
        "command": "node tools/validators/validate-bedrock.mjs",
        "status": "COMPLETE",
        "exit_code": 0,
        "duration_seconds": 0.2,
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
        "duration_seconds": 0.2,
        "plans_checked": 21,
        "stale_total": 21,
        "unverified": 21,
        "verified": 0,
        "likely_done_items": 1
      },
      {
        "name": "phase_exit_criteria",
        "command": "node tools/validators/validate-phase-exit-criteria.mjs",
        "status": "CLEAN",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "plans_checked": 21,
        "sections_checked": 7,
        "blocking": 0,
        "warnings": 0
      },
      {
        "name": "foundation_schema_drift",
        "command": "node tools/validators/validate-foundation-schema-drift.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 10.4
      },
      {
        "name": "ui_completeness",
        "command": "node tools/validators/validate-ui-completeness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "files_checked": 20,
        "advisories": 1
      },
      {
        "name": "sync_state_fresh",
        "command": "node tools/validators/validate-sync-state-fresh.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1
      },
      {
        "name": "new_file_dna",
        "command": "node tools/validators/validate-new-file-dna.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "files_checked": 0,
        "dna_ok": 0,
        "advisory": 0,
        "blocking": 0
      },
      {
        "name": "creation_completeness",
        "command": "node tools/validators/validate-creation-completeness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "pi_checked": 11,
        "advisories": 4
      },
      {
        "name": "directive_has_rzf",
        "command": "node tools/validators/validate-directive-has-rzf.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "turns_checked": 78,
        "directives": 23,
        "missing_rzf": 6
      },
      {
        "name": "quality_alignment",
        "command": "node tools/validators/validate-quality-alignment.mjs",
        "status": "ADVISORY",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "opus_rzf_rate": 80,
        "sonnet_intent_rate": 100,
        "directive_rzf_quality_rate": 0
      },
      {
        "name": "handoff_completeness",
        "command": "node tools/validators/validate-handoff-completeness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1
      },
      {
        "name": "enforcement_trio_assigned",
        "command": "node tools/validators/validate-enforcement-trio-assigned.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "pi_checked": 11,
        "active": 1,
        "missing_trio": 0
      },
      {
        "name": "persona_chain_complete",
        "command": "node tools/validators/validate-persona-chain-complete.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "pi_checked": 11,
        "implementing": 1,
        "advisories": 1
      },
      {
        "name": "pi_questions_answered",
        "command": "node tools/validators/validate-pi-questions-answered.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "pi_checked": 11,
        "implementing": 1,
        "advisories": 0
      },
      {
        "name": "implementation_gate",
        "command": "node tools/validators/validate-implementation-gate.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.4,
        "advisories": 0
      },
      {
        "name": "agent_calls_compliance",
        "command": "node tools/validators/validate-agent-calls.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "agent_calls_checked": 1,
        "compliant": 1,
        "advisory": 0
      },
      {
        "name": "invariant_coverage",
        "command": "node tools/validators/validate-invariant-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "invariants_checked": 5,
        "complete": 5,
        "partial": 0,
        "minimal": 0,
        "advisory": true
      },
      {
        "name": "plan_readiness",
        "command": "node tools/validators/validate-plan-readiness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "items_checked": 6,
        "pmi_ready": 6,
        "premature_implementing": 0,
        "advisory_ratified": 0
      },
      {
        "name": "page_dna_coverage",
        "command": "node tools/validators/validate-page-dna.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "pages_checked": 36,
        "dna_present": 6,
        "dna_missing": 30,
        "advisory": true
      },
      {
        "name": "unified_plan_sync",
        "command": "node tools/validators/validate-unified-plan-sync.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "plan_source_mtime": "2026-05-23T18:13:03.498Z",
        "api_mtime": "2026-05-23T18:15:34.119Z",
        "stale": false,
        "advisory": true
      },
      {
        "name": "core_reminder",
        "command": "node tools/validators/validate-core-reminder.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "scanned": 276,
        "with_reminder": 2,
        "without_reminder": 142,
        "stale_refs": 1,
        "advisory": true
      },
      {
        "name": "activation_coverage",
        "command": "node tools/validators/validate-activation-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "contracts_checked": 66,
        "activated": 43,
        "no_activation": 23,
        "advisory": true
      },
      {
        "name": "page_schema_consistency",
        "command": "node tools/validators/validate-page-schema-consistency.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "dirs_checked": 27,
        "in_pages": 22,
        "missing_from_pages": 5,
        "advisory": true
      },
      {
        "name": "playground_links",
        "command": "node tools/validators/validate-playground-links.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "found": 27,
        "missing": 0
      },
      {
        "name": "platform_genome",
        "command": "node tools/validators/validate-platform-genome.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "sections_found": 10,
        "sections_with_links": 10,
        "advisory": 0
      },
      {
        "name": "improvement_register",
        "command": "node tools/validators/validate-improvement-register.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "entries": 7,
        "cec_needed": 1,
        "blocking": 0
      },
      {
        "name": "apps_are_trials",
        "command": "node tools/validators/validate-apps-are-trials.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.3,
        "apps_checked": 7,
        "libs_packages": 9,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "communication_quality",
        "command": "node tools/validators/validate-communication-quality.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "checked": 23,
        "blocking": 0,
        "advisory": 3,
        "samples_loaded": true
      },
      {
        "name": "gap_recurrence",
        "command": "node tools/validators/validate-gap-recurrence.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "entries": 8,
        "open": 2,
        "k_ge2_no_test": 1,
        "k_ge3_no_fix": 0
      },
      {
        "name": "zf_cycle_format",
        "command": "node tools/validators/validate-zf-cycle-format.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "zf_blocks_checked": 40,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "pie_readiness_gate",
        "command": "node tools/validators/validate-pie-readiness-gate.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "items_checked": 6,
        "blocked": 0,
        "advisory": 0,
        "layer1": "4/4",
        "layer2": "3/3"
      },
      {
        "name": "settings_shadow",
        "command": "node tools/validators/validate-settings-shadow.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "settings_local_clean": true,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "session_authority",
        "command": "node tools/validators/validate-session-authority.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "state_session": "S57",
        "council_session": "S58",
        "gap": 1,
        "session_spread": 19,
        "advisory": 1,
        "blocking": 0
      },
      {
        "name": "ai_conception_enforcement",
        "command": "node tools/validators/validate-ai-conception-enforcement.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files_checked": 13,
        "missing_tier": 13,
        "missing_t1": 0,
        "missing_t2": 0,
        "enforcement_rate": 0,
        "advisory": 13,
        "blocking": 0
      },
      {
        "name": "contextual_locality",
        "command": "node tools/validators/validate-contextual-locality.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "files_checked": 122,
        "blocking": 0,
        "advisory": 22
      },
      {
        "name": "done_right",
        "command": "node tools/validators/validate-done-right.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files_checked": 66,
        "missing_enforcement_tier": 0,
        "t3_only": 4,
        "blocking": 0
      },
      {
        "name": "validate_validators",
        "command": "node tools/validators/validate-validators.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "total": 158,
        "deferred": 2,
        "empty_output": 15,
        "zero_numeric": 13,
        "advisory": 3,
        "blocking": 0
      },
      {
        "name": "positive_reflexivity",
        "command": "node tools/validators/validate-positive-reflexivity.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "entries": 7,
        "covered": 1,
        "advisory_drafts": 0,
        "blocking": 0
      },
      {
        "name": "threshold_intake",
        "command": "node tools/validators/validate-threshold-intake.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "total_entries": 102,
        "sessions": 1,
        "advisory": true
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
