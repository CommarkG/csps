# verify last run

- ran_at: 2026-06-22T08:21:19.071Z
- finished_at: 2026-06-22T08:21:48.591Z
- exit_code: 0

```yaml
{
  "pre_close_verification": {
    "ran_at": "2026-06-22T08:21:19.071Z",
    "finished_at": "2026-06-22T08:21:48.591Z",
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
        "duration_seconds": 1.5,
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
        "principles_loaded": 78,
        "findings_total": 32
      },
      {
        "name": "frontmatter_validate",
        "command": "node tools/validators/validate-frontmatter.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.3,
        "scanned": 804,
        "errors": 0,
        "warnings": 223,
        "exempt": 356
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
        "duration_seconds": 0.1,
        "source_ids": 78,
        "missing_slices": 0
      },
      {
        "name": "mjs_syntax_check",
        "command": "node --check tools/verify.mjs tools/pe-compute.mjs tools/validators/validate-aap-frontmatter.mjs tools/validators/validate-token-budget.mjs tools/validators/validate-corespine-depth-markers.mjs tools/validators/validate-audit-slug-coverage.mjs tools/validators/validate-frontmatter.mjs tools/validators/validate-gate-mode-matrix.mjs tools/validators/validate-token-efficiency.mjs",
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
        "duration_seconds": 0.1
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
        "plans": 46,
        "open_items": 144
      },
      {
        "name": "dead_links",
        "command": "node tools/validators/validate-dead-links.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "files": 201,
        "links": 880,
        "broken": 71
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
        "plans": 3,
        "total": 4,
        "open": 0
      },
      {
        "name": "participant_declared",
        "command": "node tools/validators/validate-participant-declared.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.8,
        "checked": 167,
        "advisories": 156
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
        "contracts": 64,
        "orphans": 1,
        "tensions": 0,
        "overlaps": 0
      },
      {
        "name": "satisfaction_point",
        "command": "node tools/validators/validate-satisfaction-point.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "advisories": 5
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
        "checked": 142,
        "blocking": 0,
        "advisories": 0
      },
      {
        "name": "bottleneck_patterns",
        "command": "node tools/validators/validate-bottleneck-patterns.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "routes": 25,
        "validators": 249,
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
        "duration_seconds": 0.1,
        "checked": 724,
        "clean": 724,
        "blocking": 0,
        "registry": 71
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
        "apps": 3,
        "advisories": 2
      },
      {
        "name": "scope_conflict",
        "command": "node tools/validators/validate-scope-conflict.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 43,
        "advisories": 1
      },
      {
        "name": "mini_tree_integrity",
        "command": "node tools/validators/validate-mini-tree-integrity.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "blocking": 0,
        "advisory": 2
      },
      {
        "name": "platform_capacity",
        "command": "node tools/validators/validate-platform-capacity.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "blocking": 0,
        "advisory": 3
      },
      {
        "name": "file_complexity_validate",
        "command": "node tools/validators/validate-file-complexity.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "scanned": 1524,
        "advisory": 133,
        "code_advisory": 9
      },
      {
        "name": "file_naming",
        "command": "node tools/validators/validate-file-naming.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 31,
        "advisory": 4,
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
        "checked": 309,
        "missing": 185,
        "invalid": 0,
        "exempt": 2
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
        "duration_seconds": 0.1,
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
        "advisory": 2
      },
      {
        "name": "communication_protocol_warrant",
        "command": "node tools/validators/validate-communication-protocol.mjs --extended",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "extended_advisory": 138
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
        "duration_seconds": 0.1,
        "checked": 334,
        "blocking": 0,
        "advisories": 0
      },
      {
        "name": "laptop_patterns",
        "command": "node tools/validators/validate-laptop-patterns.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "checked": 43,
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
        "duration_seconds": 0.1,
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
        "assessed": 78,
        "no_dev_surface": 78,
        "no_user_value": 78,
        "incomplete": 78
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
        "total": 84,
        "active": 71,
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
        "checked": 85,
        "significant": 0,
        "week4_stubs": 1
      },
      {
        "name": "gap_routing",
        "command": "node tools/validators/validate-gap-routing.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
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
        "with_cq": 247,
        "total": 619,
        "pct": 40
      },
      {
        "name": "session_harvest_readiness",
        "command": "node tools/validators/validate-session-harvest-readiness.mjs",
        "status": "HARVEST_READY",
        "exit_code": 1,
        "duration_seconds": 0.1,
        "session": "S087",
        "validators": 250,
        "tail": "  RECOMMENDED ACTIONS:\n  1. SAP Sweep 6 (Synergy Audit) — walk platform for cross-enhancement opportunities\n  2. CEC walk — iterate until 0 new opportunities found\n  3. Create session extraction: docs/plan/_handoff/VAULT/session-S<NNN>-extraction.md\n  4. Register positive patterns in inner-AI-defaults/continuous-drift-log.md\n\n  Per P-META-006 CEC + B_POSITIVE_VALUE_EXTRACTION: significant sessions deserve extraction.\n\n[validate-session-harvest-readiness] session=S087 validators=250 extraction=MISSING status=HARVEST_READY\n"
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
        "files_scanned": 1,
        "with_pcr": 0,
        "advisory_gaps": 0
      },
      {
        "name": "concept_load_declared",
        "command": "node tools/validators/validate-concept-load-declared.mjs",
        "status": "ADVISORY",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files_scanned": 1,
        "with_concept_load": 0,
        "advisory_gaps": 1
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
        "files_scanned": 325,
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
        "checked": 158,
        "with_status": 97,
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
        "unplanned": 11
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
        "checked": 227,
        "missing_why": 53
      },
      {
        "name": "open_plan_levels",
        "command": "node tools/validators/validate-open-plan-levels.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "plans_checked": 22,
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
        "checked": 20,
        "grandfathered": 2,
        "errors": 0
      },
      {
        "name": "pe_connectivity",
        "command": "node tools/validators/validate-pe-connectivity.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "blocking": 0,
        "advisory": 22,
        "total_gaps": 22
      },
      {
        "name": "plan_ai_defaults_alignment",
        "command": "node tools/validators/validate-plan-ai-defaults.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "scanned": 27,
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
        "checked": 22,
        "blocking": 0,
        "advisory": 1
      },
      {
        "name": "plan_zf_requirement_coverage",
        "command": "node tools/validators/validate-plan-zf-requirement.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 22,
        "with_field": 2,
        "missing": 20
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
        "checked": 22,
        "blocking": 0,
        "advisory": 18
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
        "pages_checked": 30,
        "with_principle": 0,
        "advisory": 30
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
        "duration_seconds": 0.2,
        "warnings": 1,
        "advisory": true
      },
      {
        "name": "topic_plan_progress",
        "command": "node tools/validators/validate-topic-plan-progress.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "plans_checked": 22,
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
        "validators_checked": 250,
        "orphans": 0,
        "registered": 250
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
        "plans_checked": 22,
        "stale_total": 22,
        "unverified": 22,
        "verified": 0,
        "likely_done_items": 1
      },
      {
        "name": "phase_exit_criteria",
        "command": "node tools/validators/validate-phase-exit-criteria.mjs",
        "status": "CLEAN",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "plans_checked": 22,
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
        "files_checked": 32,
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
        "pi_checked": 0,
        "advisories": 0
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
        "scanned": 344,
        "with_reminder": 1,
        "without_reminder": 272,
        "stale_refs": 0,
        "advisory": true
      },
      {
        "name": "activation_coverage",
        "command": "node tools/validators/validate-activation-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "contracts_checked": 70,
        "activated": 56,
        "no_activation": 14,
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
        "status": "CACHED",
        "exit_code": 0,
        "cached_at": "2026-06-20T03:18:15.383Z",
        "input_hash_prefix": "d07d80de",
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
        "libs_packages": 13,
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
        "blocking": 0,
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
        "status": "CACHED",
        "exit_code": 0,
        "cached_at": "2026-06-22T04:02:28.529Z",
        "input_hash_prefix": "9cfbe169",
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
        "entries": 20,
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
        "new_permanent_files": 0,
        "advisory": 0,
        "blocking": 0
      },
      {
        "name": "satisfaction_point_coverage",
        "command": "node tools/validators/validate-satisfaction-point-coverage.mjs",
        "status": "CACHED",
        "exit_code": 0,
        "cached_at": "2026-06-22T04:02:28.964Z",
        "input_hash_prefix": "b3a3a6eb",
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
        "sealed_protos": 12,
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
        "name": "token_efficiency",
        "command": "node tools/validators/validate-token-efficiency.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "eager_count": 1,
        "blocking": 0,
        "advisory": 83
      },
      {
        "name": "gate_mode_matrix",
        "command": "node tools/validators/validate-gate-mode-matrix.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 5,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "core_spine_template",
        "command": "node tools/validators/validate-core-spine-template.mjs",
        "status": "DEFERRED-WITH-REASON",
        "skip_reason": "pnpm-verify-cycles at 199/200 (1 slot below hard_limit 200) — deferred to DEEP/EXTENDED tier pending verify tiering (platform-capacity)"
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
        "protos_checked": 12,
        "findings": 87,
        "advisory": 87,
        "blocking": 0
      },
      {
        "name": "no_nominal_stops",
        "command": "node tools/validators/validate-no-nominal-stops-mid-milestone.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "findings": 1,
        "advisory": 1,
        "blocking": 0
      },
      {
        "name": "context_wrapped_numbers",
        "command": "node tools/validators/validate-context-wrapped-numbers.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.3,
        "files_checked": 755,
        "findings": 9503,
        "advisory": 9503
      },
      {
        "name": "nominal_rzf_detector",
        "command": "node tools/validators/validate-nominal-rzf-detector.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "findings": 429,
        "advisory": 429,
        "blocking": 0
      },
      {
        "name": "layer_split",
        "command": "node tools/validators/validate-layer-split.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "agent_deletion_test",
        "command": "node tools/validators/validate-agent-deletion-test.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "passing": 6,
        "failing": 0,
        "decoupled": true
      },
      {
        "name": "executor_contract",
        "command": "node tools/validators/validate-executor-contract.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "blocking": 0,
        "advisory": 3,
        "clauses_checked": 4
      },
      {
        "name": "register_connectivity",
        "command": "node tools/validators/validate-register-connectivity.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "registers_checked": 6,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "connection_pool_contract",
        "command": "node tools/validators/validate-connection-pool-contract.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "apps_checked": 8,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "tenant_quota_policy",
        "command": "node tools/validators/validate-tenant-quota-policy.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "load_test_harness",
        "command": "node tools/validators/validate-load-test-harness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "blocking": 0,
        "advisory": 0,
        "scenarios": 4
      },
      {
        "name": "rls_perf_budget",
        "command": "node tools/validators/validate-rls-perf-budget.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "models_checked": 23,
        "models_with_rls": 12,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "uuid_column_types",
        "command": "node tools/validators/validate-uuid-column-types.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "blocking": 0,
        "advisory": 3,
        "deadline": "2026-06-16"
      },
      {
        "name": "boundary_crossing_protocol",
        "command": "node tools/validators/validate-boundary-crossing-protocol.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "boundaries_checked": 3,
        "crossings_checked": 0,
        "blocking": 0,
        "advisory": 0
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
        "observe": 7,
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
        "entries": 20,
        "open": 9,
        "k_ge2_no_test": 4,
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
        "council_session": "S88",
        "gap": 31,
        "session_spread": 3,
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
        "files_checked": 172,
        "blocking": 0,
        "advisory": 26
      },
      {
        "name": "done_right",
        "command": "node tools/validators/validate-done-right.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files_checked": 70,
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
        "total": 245,
        "deferred": 11,
        "empty_output": 20,
        "zero_numeric": 24,
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
        "total_entries": 999,
        "sessions": 12,
        "advisory": true
      },
      {
        "name": "permanence_coverage",
        "command": "node tools/validators/validate-permanence-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "contracts_checked": 0,
        "full_trio": 39,
        "has_t1": 0,
        "has_t2": 0,
        "advisory": 2
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
        "pages_scanned": 29,
        "full_context": 24,
        "partial": 2,
        "no_context": 3,
        "coverage": 83,
        "advisory": 5,
        "blocking": 0
      },
      {
        "name": "voice_profile_coverage",
        "command": "node tools/validators/validate-voice-profile.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "pages_with_forms": 8,
        "forms_with_profile": 4,
        "forms_missing_profile": 4,
        "advisory": 1,
        "blocking": 0
      },
      {
        "name": "text_input_standards",
        "command": "node tools/validators/validate-text-input-standards.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "pages_checked": 30,
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
        "t3_only_count": 36,
        "advisory": 36
      },
      {
        "name": "ai_honesty",
        "command": "node tools/validators/validate-ai-honesty.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 2.5,
        "files_checked": 29,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "dev_vs_prod",
        "command": "node tools/validators/validate-dev-vs-prod.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files_checked": 115,
        "blocking": 0,
        "advisory": 2
      },
      {
        "name": "definition_before_enforcement",
        "command": "node tools/validators/validate-definition-before-enforcement.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "principles_checked": 83,
        "with_enforcement_tier": 77,
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
        "triggers_found": 6,
        "unchecked_expansions": 6,
        "advisory": 6
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
        "files_scanned": 0,
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
        "proto_citations": 191,
        "valid": 6,
        "missing": 185,
        "advisory": 185,
        "blocking": 0
      },
      {
        "name": "governor_prompts",
        "command": "node tools/validators/validate-governor-prompts.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "gp_files": 11,
        "entries_checked": 1,
        "valid": 1,
        "advisory": 0,
        "blocking": 0
      },
      {
        "name": "template_citation",
        "command": "node tools/validators/validate-template-citation.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "artifacts_checked": 32,
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
        "entries_checked": 20,
        "k2_needing_fix": 6,
        "k3_blocking": 0,
        "advisory": 8,
        "blocking": 0
      },
      {
        "name": "five_surface",
        "command": "node tools/validators/validate-five-surface.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "contracts_checked": 70,
        "full_5surface": 2,
        "partial": 68,
        "blocking": 0,
        "advisory": 1
      },
      {
        "name": "gradual_build",
        "command": "node tools/validators/validate-gradual-build.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "protos_checked": 12,
        "with_steps": 9,
        "without_steps": 2,
        "advisory": 2,
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
        "duration_seconds": 0.1,
        "unpushed_count": 0,
        "advisory": 0,
        "blocking": 0
      },
      {
        "name": "boundary_prompt_format",
        "command": "node tools/validators/validate-boundary-prompt-format.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.6,
        "entries_checked": 70,
        "missing_headers": 6,
        "missing_attestation": 55,
        "advisory": 65,
        "blocking": 0
      },
      {
        "name": "register_reference_integrity",
        "command": "node tools/validators/validate-register-reference-integrity.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files_checked": 776,
        "advisory": 202,
        "blocking": 0
      },
      {
        "name": "session_close_completeness",
        "command": "node tools/validators/validate-session-close-completeness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "session": "S087",
        "handoff_exists": false,
        "sonnet_fresh": true,
        "blocking": 0,
        "advisory": 2
      },
      {
        "name": "inheritance_integrity",
        "command": "node tools/validators/validate-inheritance-integrity.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "blocking": 0,
        "advisory": 1
      },
      {
        "name": "hook_prompt_source",
        "command": "node tools/validators/validate-hook-prompt-source.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "block_test": "PASS"
      },
      {
        "name": "hook_activation_smoke",
        "command": "node tools/validators/validate-hook-activation-smoke.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 4.2,
        "hooks_tested": 9,
        "blocking": 0,
        "advisory": 4
      },
      {
        "name": "route_manifest",
        "command": "node tools/validators/validate-route-manifest.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "pages_found": 30,
        "manifest_entries": 30,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "internal_links",
        "command": "node tools/validators/validate-internal-links.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files_scanned": 72,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "fetch_resilience",
        "command": "node tools/validators/validate-fetch-resilience.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files_with_fetch": 8,
        "blocking": 0,
        "advisory": 7
      },
      {
        "name": "blocking_determinism",
        "command": "node tools/validators/validate-blocking-determinism.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "validators_scanned": 249,
        "blocking": 0,
        "advisory": 12
      },
      {
        "name": "green_receipt",
        "command": "node tools/validators/validate-green-receipt.mjs",
        "status": "FAIL",
        "exit_code": 1,
        "duration_seconds": 0.2,
        "tail": "[validate-green-receipt] FAIL\n  blocking=1 advisory=0\n  BLOCKING: tree_hash mismatch — tracked content changed since last verify\n    receipt tree_hash: 64d663109e65a789\n    current tree_hash: 5e50bf5e0511f5f8\n    Code or config changed after the last successful verify run.\n    FIX: run `node tools/verify.mjs --skip-install` to refresh the receipt.\n"
      },
      {
        "name": "agent_inheritance_parity",
        "command": "node tools/validators/validate-agent-inheritance-parity.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "items_tracked": 6,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "completion_gate",
        "command": "node tools/validators/validate-completion-gate.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "this_session_undisposed": 0,
        "older_undisposed": 21
      },
      {
        "name": "page_completeness",
        "command": "node tools/validators/validate-page-completeness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "pages_scanned": 29,
        "blocking": 0,
        "advisory": 0,
        "block_test": "PASS"
      },
      {
        "name": "classification_accuracy",
        "command": "node tools/validators/validate-classification-accuracy.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.4,
        "entries_tested": 5,
        "correct": 5,
        "accuracy_pct": 100,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "consolidation_safety",
        "command": "node tools/validators/validate-consolidation-safety.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "ledger_operations": 7,
        "elements_checked": 15,
        "defects_checked": 1,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "dual_coverage",
        "command": "node tools/validators/validate-dual-coverage.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "obligations_checked": 8,
        "dual_covered": 8,
        "advisory": 0,
        "blocking": 0
      },
      {
        "name": "journey_gate",
        "command": "node tools/validators/validate-journey-gate.mjs",
        "status": "CACHED",
        "exit_code": 0,
        "cached_at": "2026-06-20T03:32:00.001Z",
        "input_hash_prefix": "e82a9757",
        "checked": 10,
        "tests_pass": 10,
        "tests_fail": 0,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "trunk_matches_seed",
        "command": "node tools/validators/validate-trunk-matches-seed.mjs",
        "status": "CACHED",
        "exit_code": 0,
        "cached_at": "2026-06-20T03:32:00.071Z",
        "input_hash_prefix": "5ed3b1cb",
        "checked": 12,
        "invariants": 5,
        "phases": 5,
        "blocking": 0,
        "advisory": 0
      },
      {
        "name": "journey_event_store",
        "command": "node tools/validators/validate-journey-event-store.mjs",
        "status": "CACHED",
        "exit_code": 0,
        "cached_at": "2026-06-20T03:32:00.138Z",
        "input_hash_prefix": "5e55cc06",
        "no_direct_write_rls_active": true,
        "blocking": 0,
        "advisory": 1
      },
      {
        "name": "hash_cache",
        "command": "node tools/validators/validate-hash-cache.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "blocking": 0,
        "advisory": 0,
        "cache_entries": 7
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
