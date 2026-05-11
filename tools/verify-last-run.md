# verify last run

- ran_at: 2026-05-11T02:22:39.426Z
- finished_at: 2026-05-11T02:23:08.697Z
- exit_code: 0

```yaml
{
  "pre_close_verification": {
    "ran_at": "2026-05-11T02:22:39.426Z",
    "finished_at": "2026-05-11T02:23:08.697Z",
    "orchestrator": "tools/verify.mjs",
    "cycles": [
      {
        "name": "pnpm_install_frozen",
        "command": "pnpm install --frozen-lockfile",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 10.7,
        "packages_resolved": null
      },
      {
        "name": "typecheck_recursive",
        "command": "pnpm -r --filter \"./packages/**\" typecheck",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 1.6,
        "ts_errors": 0
      },
      {
        "name": "principles_validate",
        "command": "pnpm --filter @csps/principles validate:all",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 1,
        "principles_loaded": 55,
        "findings_total": 0
      },
      {
        "name": "frontmatter_validate",
        "command": "node tools/validators/validate-frontmatter.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.2,
        "scanned": 315,
        "errors": 0,
        "warnings": 33,
        "exempt": 222
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
        "duration_seconds": 0.2,
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
        "source_contracts": 52,
        "missing_slices": 0
      },
      {
        "name": "principle_slices_sync",
        "command": "node tools/validators/validate-principle-slices.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "source_ids": 55,
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
        "status": "ADVISORY",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "enforcement_rate": 29
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
        "name": "gradual_bundling",
        "command": "node tools/validators/validate-gradual-bundling.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "active_plans": 0,
        "near_complete": 0,
        "no_depth": 0,
        "no_stage": 0,
        "backlog_pending": 19
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
        "assessed": 23,
        "no_dev_surface": 23,
        "no_user_value": 23,
        "incomplete": 23
      },
      {
        "name": "update_backlog",
        "command": "node tools/validators/validate-update-backlog.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "total": 36,
        "pending": 19,
        "blocked": 12,
        "done": 5
      },
      {
        "name": "hook_lifecycle_state",
        "command": "node tools/validators/validate-hook-lifecycle-state.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "total": 25,
        "active": 12,
        "stub": 11,
        "unknown": 2,
        "stub_rate": 44
      },
      {
        "name": "session_harvest_readiness",
        "command": "node tools/validators/validate-session-harvest-readiness.mjs",
        "status": "HARVEST_DONE",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "session": "S022",
        "validators": 58
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
        "status": "ADVISORY",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files_scanned": 3,
        "with_pcr": 0,
        "advisory_gaps": 1
      },
      {
        "name": "concept_load_declared",
        "command": "node tools/validators/validate-concept-load-declared.mjs",
        "status": "ADVISORY",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "files_scanned": 2,
        "with_concept_load": 1,
        "advisory_gaps": 1
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
        "files_scanned": 9,
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
        "covered": 17,
        "critical_gaps": 0
      },
      {
        "name": "impl_status",
        "command": "node tools/validators/validate-impl-status.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 75,
        "with_status": 23,
        "warnings": 0
      },
      {
        "name": "no_implementation_without_plan",
        "command": "node tools/validators/validate-no-implementation-without-plan.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "checked": 8,
        "exempt": 3,
        "unplanned": 1
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
        "checked": 120,
        "missing_why": 29
      },
      {
        "name": "open_plan_levels",
        "command": "node tools/validators/validate-open-plan-levels.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "plans_checked": 13,
        "plans_with_open": 7,
        "total_open_items": 97
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
        "checked": 11,
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
        "advisory": 13,
        "total_gaps": 13
      },
      {
        "name": "plan_ai_defaults_alignment",
        "command": "node tools/validators/validate-plan-ai-defaults.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "scanned": 18,
        "flagged": 2,
        "ratified": 1,
        "blocking": 0,
        "advisory": 1
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
        "plans_checked": 13,
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
        "validators_checked": 58,
        "orphans": 0,
        "registered": 58
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
        "checked": 26,
        "l1_core": 5,
        "l2_domain": 16,
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
        "plans_checked": 13,
        "missing_harvest": 3,
        "warnings": 3
      },
      {
        "name": "execution_mode_declared",
        "command": "node tools/validators/validate-execution-mode-declared.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "plans_checked": 13,
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
        "plans_checked": 13,
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
        "plans_checked": 13,
        "sections_checked": 7,
        "blocking": 0,
        "warnings": 0
      },
      {
        "name": "foundation_schema_drift",
        "command": "node tools/validators/validate-foundation-schema-drift.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 10.1
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
