# verify last run

- ran_at: 2026-06-01T20:52:39.690Z
- finished_at: 2026-06-01T20:53:09.524Z
- exit_code: 0

```yaml
{
  "pre_close_verification": {
    "ran_at": "2026-06-01T20:52:39.690Z",
    "finished_at": "2026-06-01T20:53:09.524Z",
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
        "name": "apps_typecheck",
        "command": "pnpm -r --filter \"./apps/**\" typecheck 2>/dev/null || echo \"[apps_typecheck] no apps with typecheck script or all clean\"",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0,
        "ts_errors": 0,
        "skipped": true
      },
      {
        "name": "principles_validate",
        "command": "pnpm --filter @csps/principles validate:all",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 1.1,
        "principles_loaded": 73,
        "findings_total": 27
      },
      {
        "name": "frontmatter_validate",
        "command": "node tools/validators/validate-frontmatter.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.4,
        "scanned": 715,
        "errors": 0,
        "warnings": 183,
        "exempt": 344
      },
      {
        "name": "aap_frontmatter_coverage",
        "command": "node tools/validators/validate-aap-frontmatter.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "skills_scanned": 31,
        "missing_aap": 0,
        "aligned": 31
      },
      {
        "name": "principle_count_staleness",
        "command": "node tools/validators/validate-principle-count-staleness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.4,
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
        "duration_seconds": 0.1,
        "source_ids": 73,
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
        "has_report": false
      },
      {
        "name": "boundary_alignment",
        "command": "node tools/validators/validate-boundary-alignment.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checks": 1,
        "warnings": 1
      },
      {
        "name": "pe_dashboard",
        "command": "node tools/validators/validate-pe-dashboard.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "plans": 45,
        "open_items": 144
      },
      {
        "name": "dead_links",
        "command": "node tools/validators/validate-dead-links.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "files": 172,
        "links": 721,
        "broken": 71
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
        "duration_seconds": 3.7,
        "checked": 139,
        "advisories": 128
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
        "graded": 13,
        "advisories": 2
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
        "advisories": 7
      },
      {
        "name": "agreement_without_evidence",
        "command": "node tools/validators/validate-agreement-without-evidence.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 2,
        "advisories": 0
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
        "advisories": 0
      },
      {
        "name": "diataxis_type",
        "command": "node tools/validators/validate-diataxis-type.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 120,
        "blocking": 0,
        "advisories": 0
      },
      {
        "name": "bottleneck_patterns",
        "command": "node tools/validators/validate-bottleneck-patterns.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "routes": 14,
        "validators": 220,
        "models": 0,
        "advisories": 0
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
        "advisories": 0
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
        "checked": 657,
        "clean": 657,
        "blocking": 0,
        "registry": 68
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
        "apps": 3,
        "advisories": 1
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
        "duration_seconds": 0.1,
        "blocking": 0,
        "advisory": 4
      },
      {
        "name": "file_complexity_validate",
        "command": "node tools/validators/validate-file-complexity.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "scanned": 802,
        "advisory": 114
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
        "apps": 1,
        "passing": 1,
        "blocking": 0,
        "skipped": 2
      },
      {
        "name": "scope_level_declared",
        "command": "node tools/validators/validate-scope-level-declared.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 274,
        "missing": 150,
        "invalid": 0,
        "exempt": 1
      },
      {
        "name": "rule_has_enforcement",
        "command": "node tools/validators/validate-rule-has-enforcement.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "advisories": 3
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
        "name": "nodefile_compliance",
        "command": "node tools/validators/validate-nodefile-compliance.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files_scanned": 36,
        "cached": 36,
        "scanned": 0,
        "advisory": 0,
        "mismatches": 0,
        "blocking": 0
      },
      {
        "name": "wiring_completeness",
        "command": "node tools/validators/validate-wiring-completeness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "wired": 12,
        "deferred": 41,
        "orphan": 0
      },
      {
        "name": "communication_protocol",
        "command": "node tools/validators/validate-communication-protocol.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "advisory": 1
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
        "checked": 300,
        "blocking": 0,
        "advisories": 0
      },
      {
        "name": "laptop_patterns",
        "command": "node tools/validators/validate-laptop-patterns.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "checked": 42,
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
        "skills": 31,
        "advisories": 26
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
        "duration_seconds": 0.2,
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
        "assessed": 69,
        "no_dev_surface": 69,
        "no_user_value": 69,
        "incomplete": 69
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
        "total": 79,
        "active": 66,
        "stub": 3,
        "unknown": 10,
        "stub_rate": 4
      },
      {
        "name": "declared_never_finished",
        "command": "node tools/validators/validate-declared-never-finished.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 83,
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
        "with_cq": 258,
        "total": 550,
        "pct": 47
      },
      {
        "name": "session_harvest_readiness",
        "command": "node tools/validators/validate-session-harvest-readiness.mjs",
        "status": "HARVEST_DONE",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "session": "S075",
        "validators": 221
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
        "duration_seconds": 0.3,
        "files_scanned": 319,
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
        "checked": 136,
        "with_status": 76,
        "warnings": 0
      },
      {
        "name": "no_implementation_without_plan",
        "command": "node tools/validators/validate-no-implementation-without-plan.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 18,
        "exempt": 4,
        "unplanned": 10
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
        "checked": 216,
        "missing_why": 48
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
        "duration_seconds": 0.3,
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
        "pages_checked": 28,
        "with_principle": 0,
        "advisory": 28
      },
      {
        "name": "isolation_layers",
        "command": "node tools/validators/validate-isolation-layers.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "blocking": 0,
        "advisory": 1
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
        "checked": 0,
        "advisory": 0
      },
      {
        "name": "pe_situation_declared",
        "command": "node tools/validators/validate-pe-situation-declared.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "situation": "WAVE_1_PREVENTION_BUILD",
        "registry": "true"
      },
      {
        "name": "gdpr_erasure_path",
        "command": "node tools/validators/validate-gdpr-erasure-path.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 2,
        "advisory": 2
      },
      {
        "name": "subscription_error_handling",
        "command": "node tools/validators/validate-subscription-error-handling.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "routes_checked": 0,
        "with_gate": 0,
        "advisory": 0
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
        "validators_checked": 221,
        "orphans": 0,
        "registered": 221
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
        "duration_seconds": 0.1,
        "plans_checked": 21,
        "missing_harvest": 11,
        "warnings": 11
      },
      {
        "name": "execution_mode_declared",
        "command": "node tools/validators/validate-execution-mode-declared.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "plans_checked": 21,
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
        "duration_seconds": 0.1,
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
        "duration_seconds": 0.1
      },
      {
        "name": "ui_completeness",
        "command": "node tools/validators/validate-ui-completeness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files_checked": 30,
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
        "duration_seconds": 0.1,
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
        "duration_seconds": 0.1,
        "pi_checked": 11,
        "implementing": 1,
        "advisories": 1
      },
      {
        "name": "pi_questions_answered",
        "command": "node tools/validators/validate-pi-questions-answered.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "pi_checked": 11,
        "implementing": 1,
        "advisories": 0
      },
      {
        "name": "implementation_gate",
        "command": "node tools/validators/validate-implementation-gate.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "advisories": 0
      },
      {
        "name": "agent_calls_compliance",
        "command": "node tools/validators/validate-agent-calls.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "agent_calls_checked": 0,
        "compliant": 0,
        "advisory": 0
      },
      {
        "name": "invariant_coverage",
        "command": "node tools/validators/validate-invariant-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
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
        "duration_seconds": 0.1,
        "items_checked": 5,
        "pmi_ready": 5,
        "premature_implementing": 0,
        "advisory_ratified": 0
      },
      {
        "name": "page_dna_coverage",
        "command": "node tools/validators/validate-page-dna.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
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
        "duration_seconds": 0.1,
        "plan_source_mtime": "2026-05-27T12:11:02.653Z",
        "api_mtime": "2026-05-27T12:11:02.655Z",
        "stale": false,
        "advisory": true
      },
      {
        "name": "core_reminder",
        "command": "node tools/validators/validate-core-reminder.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "scanned": 308,
        "with_reminder": 2,
        "without_reminder": 237,
        "stale_refs": 1,
        "advisory": true
      },
      {
        "name": "activation_coverage",
        "command": "node tools/validators/validate-activation-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "contracts_checked": 69,
        "activated": 56,
        "no_activation": 13,
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
        "duration_seconds": 0.1,
        "found": 27,
        "missing": 0
      },
      {
        "name": "platform_genome",
        "command": "node tools/validators/validate-platform-genome.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "sections_found": 10,
        "sections_with_links": 10,
        "advisory": 0
      },
      {
        "name": "improvement_register",
        "command": "node tools/validators/validate-improvement-register.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "entries": 25,
        "cec_needed": 1,
        "blocking": 0
      },
      {
        "name": "apps_are_trials",
        "command": "node tools/validators/validate-apps-are-trials.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "apps_checked": 3,
        "libs_packages": 12,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "communication_quality",
        "command": "node tools/validators/validate-communication-quality.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 30,
        "blocking": 1,
        "advisory": 3,
        "samples_loaded": true
      },
      {
        "name": "vercel_projects",
        "command": "node tools/validators/validate-vercel-projects.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "targets": 2,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "external_integration_health",
        "command": "node tools/validators/validate-external-integration-health.mjs",
        "status": "DEFERRED-WITH-REASON",
        "skip_reason": "run_tier:DEEP — run with --deep or node tools/zf-orchestrator.mjs --level 3"
      },
      {
        "name": "bypass_settings",
        "command": "node tools/validators/validate-bypass-settings.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "hardwire_completeness",
        "command": "node tools/validators/validate-hardwire-completeness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "rows": 9,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "governing_intent_coverage",
        "command": "node tools/validators/validate-governing-intent-coverage.mjs",
        "status": "DEFERRED-WITH-REASON",
        "skip_reason": "run_tier:DEEP — run with --deep or node tools/zf-orchestrator.mjs --level 3"
      },
      {
        "name": "capability_registry",
        "command": "node tools/validators/validate-capability-registry.mjs",
        "status": "DEFERRED-WITH-REASON",
        "skip_reason": "run_tier:DEEP — run with --deep or node tools/zf-orchestrator.mjs --level 3"
      },
      {
        "name": "default_shape",
        "command": "node tools/validators/validate-default-shape.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "entries": 19,
        "blocking": 0,
        "advisory": 9
      },
      {
        "name": "advisory_has_promotion_path",
        "command": "node tools/validators/validate-advisory-has-promotion-path.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "blocking": 0,
        "advisory": 11
      },
      {
        "name": "hardwire_dna_coverage",
        "command": "node tools/validators/validate-hardwire-dna-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "new_permanent_files": 3,
        "advisory": 3,
        "blocking": 0
      },
      {
        "name": "satisfaction_point_coverage",
        "command": "node tools/validators/validate-satisfaction-point-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "entries": 13,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "completion_before_new",
        "command": "node tools/validators/validate-completion-before-new.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "open_protos": 1,
        "sealed_protos": 11,
        "open_milestones": 26,
        "advisory": 1
      },
      {
        "name": "no_floating_artifacts",
        "command": "node tools/validators/validate-no-floating-artifacts.mjs",
        "status": "DEFERRED-WITH-REASON",
        "skip_reason": "run_tier:DEEP — run with --deep or node tools/zf-orchestrator.mjs --level 3"
      },
      {
        "name": "core_spine_template",
        "command": "node tools/validators/validate-core-spine-template.mjs",
        "status": "DEFERRED-WITH-REASON",
        "skip_reason": "pnpm-verify-cycles at hard_limit 200 — deferred until verify tiering implemented (platform-capacity)"
      },
      {
        "name": "communication_schema_coverage",
        "command": "node tools/validators/validate-communication-schema-coverage.mjs",
        "status": "DEFERRED-WITH-REASON",
        "skip_reason": "run_tier:DEEP — run with --deep or node tools/zf-orchestrator.mjs --level 3"
      },
      {
        "name": "proto_completeness",
        "command": "node tools/validators/validate-proto-completeness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "protos_checked": 11,
        "findings": 79,
        "advisory": 79,
        "blocking": 0
      },
      {
        "name": "no_nominal_stops",
        "command": "node tools/validators/validate-no-nominal-stops-mid-milestone.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "findings": 0,
        "advisory": 0,
        "blocking": 0
      },
      {
        "name": "context_wrapped_numbers",
        "command": "node tools/validators/validate-context-wrapped-numbers.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.3,
        "files_checked": 671,
        "findings": 8753,
        "advisory": 8753
      },
      {
        "name": "nominal_rzf_detector",
        "command": "node tools/validators/validate-nominal-rzf-detector.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "findings": 290,
        "advisory": 290,
        "blocking": 0
      },
      {
        "name": "layer_split",
        "command": "node tools/validators/validate-layer-split.mjs",
        "status": "DEFERRED-WITH-REASON",
        "skip_reason": "run_tier:DEEP — run with --deep or node tools/zf-orchestrator.mjs --level 3"
      },
      {
        "name": "agent_deletion_test",
        "command": "node tools/validators/validate-agent-deletion-test.mjs",
        "status": "DEFERRED-WITH-REASON",
        "skip_reason": "run_tier:DEEP — run with --deep or node tools/zf-orchestrator.mjs --level 3"
      },
      {
        "name": "executor_contract",
        "command": "node tools/validators/validate-executor-contract.mjs",
        "status": "DEFERRED-WITH-REASON",
        "skip_reason": "run_tier:DEEP — run with --deep or node tools/zf-orchestrator.mjs --level 3"
      },
      {
        "name": "vocabulary_coverage",
        "command": "node tools/validators/validate-vocabulary-coverage.mjs",
        "status": "DEFERRED-WITH-REASON",
        "skip_reason": "run_tier:DEEP — run with --deep or node tools/zf-orchestrator.mjs --level 3"
      },
      {
        "name": "core_seeds_currency",
        "command": "node tools/validators/validate-core-seeds-currency.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 7,
        "missing_nodes": 0
      },
      {
        "name": "cie_pe_audit",
        "command": "node tools/scripts/cie-pe-trigger-audit.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "observe": 6,
        "cie_milestones": 0,
        "pe_entries": 25,
        "advisories": 1
      },
      {
        "name": "threshold_exhaustive",
        "command": "node tools/validators/validate-threshold-exhaustive.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "test_cases": 11,
        "passed": 11,
        "failed": 0,
        "blocking": 0
      },
      {
        "name": "gap_recurrence",
        "command": "node tools/validators/validate-gap-recurrence.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "entries": 11,
        "open": 4,
        "k_ge2_no_test": 3,
        "k_ge3_no_fix": 0
      },
      {
        "name": "flow_activity_monitor",
        "command": "node tools/validators/validate-flow-activity-monitor.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "total_flows": 7,
        "active": 7,
        "not_yet_built": 0,
        "blocking": 0
      },
      {
        "name": "zf_cycle_format",
        "command": "node tools/validators/validate-zf-cycle-format.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "zf_blocks_checked": 7,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "pie_readiness_gate",
        "command": "node tools/validators/validate-pie-readiness-gate.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "items_checked": 0,
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
        "council_session": "S78",
        "gap": 21,
        "session_spread": 4,
        "advisory": 1,
        "blocking": 0
      },
      {
        "name": "ai_conception_enforcement",
        "command": "node tools/validators/validate-ai-conception-enforcement.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files_checked": 14,
        "missing_tier": 11,
        "missing_t1": 0,
        "missing_t2": 0,
        "enforcement_rate": 21,
        "advisory": 11,
        "blocking": 0
      },
      {
        "name": "contextual_locality",
        "command": "node tools/validators/validate-contextual-locality.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "files_checked": 150,
        "blocking": 0,
        "advisory": 25
      },
      {
        "name": "done_right",
        "command": "node tools/validators/validate-done-right.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files_checked": 69,
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
        "total": 215,
        "deferred": 14,
        "empty_output": 20,
        "zero_numeric": 21,
        "advisory": 3,
        "blocking": 0
      },
      {
        "name": "positive_reflexivity",
        "command": "node tools/validators/validate-positive-reflexivity.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "entries": 25,
        "covered": 3,
        "advisory_drafts": 9,
        "blocking": 0
      },
      {
        "name": "threshold_intake",
        "command": "node tools/validators/validate-threshold-intake.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "total_entries": 447,
        "sessions": 4,
        "advisory": true
      },
      {
        "name": "permanence_coverage",
        "command": "node tools/validators/validate-permanence-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "contracts_checked": 0,
        "full_trio": 41,
        "has_t1": 0,
        "has_t2": 0,
        "advisory": 1
      },
      {
        "name": "north_star_gate",
        "command": "node tools/validators/validate-north-star-gate.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "gate1_active": "true",
        "gate2_sessions_without": 5,
        "advisory": 1,
        "blocking": 0
      },
      {
        "name": "ux_audit",
        "command": "node tools/validators/validate-ux-audit.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "pages_scanned": 27,
        "full_context": 23,
        "partial": 1,
        "no_context": 3,
        "coverage": 85,
        "advisory": 4,
        "blocking": 0
      },
      {
        "name": "voice_profile_coverage",
        "command": "node tools/validators/validate-voice-profile.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "pages_with_forms": 6,
        "forms_with_profile": 4,
        "forms_missing_profile": 2,
        "advisory": 1,
        "blocking": 0
      },
      {
        "name": "text_input_standards",
        "command": "node tools/validators/validate-text-input-standards.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "pages_checked": 28,
        "violations": 0,
        "exemptions": 4,
        "advisory": 0,
        "blocking": 0
      },
      {
        "name": "prace_tiers",
        "command": "node tools/validators/validate-prace-tiers.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "t3_only_count": 37,
        "advisory": 37
      },
      {
        "name": "ai_honesty",
        "command": "node tools/validators/validate-ai-honesty.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 2,
        "files_checked": 29,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "dev_vs_prod",
        "command": "node tools/validators/validate-dev-vs-prod.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.3,
        "files_checked": 206,
        "blocking": 0,
        "advisory": 3
      },
      {
        "name": "definition_before_enforcement",
        "command": "node tools/validators/validate-definition-before-enforcement.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "principles_checked": 78,
        "with_enforcement_tier": 72,
        "missing_definition": 62,
        "advisory": 62
      },
      {
        "name": "autonomy_conditions",
        "command": "node tools/validators/validate-autonomy-conditions.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files_checked": 29,
        "triggers_found": 0,
        "missing_condition_count": 0,
        "advisory": 0
      },
      {
        "name": "checkpoint_categories",
        "command": "node tools/validators/validate-checkpoint-categories.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files_checked": 29,
        "triggers_found": 1,
        "unchecked_expansions": 1,
        "advisory": 1
      },
      {
        "name": "app_deploy_readiness",
        "command": "node tools/validators/validate-app-deploy-readiness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "apps_checked": 1,
        "missing_env_example": 0,
        "missing_checklist": 0,
        "committed_env_local": 0,
        "advisory": 0,
        "blocking": 0
      },
      {
        "name": "proto_core_seed",
        "command": "node tools/validators/validate-proto-core-seed.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1
      },
      {
        "name": "finding_scheduling",
        "command": "node tools/validators/validate-finding-scheduling.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1
      },
      {
        "name": "session_source_usage",
        "command": "node tools/validators/validate-session-source-usage.mjs",
        "status": "DEFERRED-WITH-REASON",
        "skip_reason": "run_tier:DEEP — run with --deep or node tools/zf-orchestrator.mjs --level 3"
      },
      {
        "name": "threshold_routing_coverage",
        "command": "node tools/validators/validate-threshold-routing-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1
      },
      {
        "name": "skill_invocation_rate",
        "command": "node tools/validators/validate-skill-invocation-rate.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1
      },
      {
        "name": "inventory_scan_coverage",
        "command": "node tools/validators/validate-inventory-scan-coverage.mjs",
        "status": "DEFERRED-WITH-REASON",
        "skip_reason": "run_tier:DEEP — run with --deep or node tools/zf-orchestrator.mjs --level 3"
      },
      {
        "name": "prevention_class_required",
        "command": "node tools/validators/validate-prevention-class-required.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1
      },
      {
        "name": "consolidation_pass",
        "command": "node tools/validators/validate-consolidation-pass.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "files_scanned": 3,
        "potential_duplicates": 0,
        "advisory": 0,
        "blocking": 0
      },
      {
        "name": "proto_receipt",
        "command": "node tools/validators/validate-proto-receipt.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "blocks_checked": 0,
        "proto_citations": 106,
        "valid": 6,
        "missing": 100,
        "advisory": 100,
        "blocking": 0
      },
      {
        "name": "governor_prompts",
        "command": "node tools/validators/validate-governor-prompts.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "gp_files": 8,
        "entries_checked": 12,
        "valid": 12,
        "advisory": 0,
        "blocking": 0
      },
      {
        "name": "template_citation",
        "command": "node tools/validators/validate-template-citation.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "artifacts_checked": 31,
        "with_citation": 10,
        "missing_citation": 16,
        "advisory": 5,
        "blocking": 0
      },
      {
        "name": "structural_fix",
        "command": "node tools/validators/validate-structural-fix.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "entries_checked": 11,
        "k2_needing_fix": 3,
        "k3_blocking": 0,
        "advisory": 5,
        "blocking": 0
      },
      {
        "name": "five_surface",
        "command": "node tools/validators/validate-five-surface.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "contracts_checked": 69,
        "full_5surface": 2,
        "partial": 67,
        "blocking": 0,
        "advisory": 1
      },
      {
        "name": "gradual_build",
        "command": "node tools/validators/validate-gradual-build.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "protos_checked": 11,
        "with_steps": 9,
        "without_steps": 1,
        "advisory": 1,
        "blocking": 0
      },
      {
        "name": "cip_prior_plan_conflict",
        "command": "node tools/validators/validate-prior-plan-conflict.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "staged_checked": 2,
        "conflicts_found": 2,
        "advisory": 2,
        "blocking": 0
      },
      {
        "name": "push_status",
        "command": "node tools/validators/validate-push-status.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "unpushed_count": 0,
        "advisory": 0,
        "blocking": 0
      },
      {
        "name": "boundary_prompt_format",
        "command": "node tools/validators/validate-boundary-prompt-format.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.7,
        "entries_checked": 66,
        "missing_headers": 25,
        "missing_attestation": 26,
        "advisory": 55,
        "blocking": 0
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
