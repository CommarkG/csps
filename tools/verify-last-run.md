# verify last run

- ran_at: 2026-05-05T17:22:45.210Z
- finished_at: 2026-05-05T17:22:48.192Z
- exit_code: 0

```yaml
{
  "pre_close_verification": {
    "ran_at": "2026-05-05T17:22:45.210Z",
    "finished_at": "2026-05-05T17:22:48.192Z",
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
        "duration_seconds": 1.4,
        "ts_errors": 0
      },
      {
        "name": "principles_validate",
        "command": "pnpm --filter @csps/principles validate:all",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.8,
        "principles_loaded": 53,
        "findings_total": 0
      },
      {
        "name": "frontmatter_validate",
        "command": "node tools/validators/validate-frontmatter.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "scanned": 156,
        "errors": 0,
        "warnings": 5,
        "exempt": 199
      },
      {
        "name": "aap_frontmatter_coverage",
        "command": "node tools/validators/validate-aap-frontmatter.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "skills_scanned": 16,
        "missing_aap": 0,
        "aligned": 16
      },
      {
        "name": "principle_count_staleness",
        "command": "node tools/validators/validate-principle-count-staleness.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
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
        "source_contracts": 39,
        "missing_slices": 0
      },
      {
        "name": "principle_slices_sync",
        "command": "node tools/validators/validate-principle-slices.mjs",
        "status": "PASS",
        "exit_code": 0,
        "duration_seconds": 0.1,
        "source_ids": 53,
        "missing_slices": 0
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
