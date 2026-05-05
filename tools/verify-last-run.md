# verify last run

- ran_at: 2026-05-05T08:56:27.012Z
- finished_at: 2026-05-05T08:56:29.528Z
- exit_code: 0

```yaml
{
  "pre_close_verification": {
    "ran_at": "2026-05-05T08:56:27.012Z",
    "finished_at": "2026-05-05T08:56:29.528Z",
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
        "scanned": 148,
        "errors": 0,
        "warnings": 5,
        "exempt": 117
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
