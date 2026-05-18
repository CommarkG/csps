---
name: EP-ERR-011
description: 'Error pattern registry: validator-audit-runner-ripple — editing a validator file (tools/validators/*.mjs) without updating its audit-runner.md entry causes validate-audit-health.mjs to fail at pnpm verify time.'
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
id: EP-ERR-011
pattern_name: validator-audit-runner-ripple
first_observed: S042
recurrence_count: 1
trigger: Any edit to tools/validators/*.mjs that changes behavior, version, or description WITHOUT a corresponding update to the validator's entry in docs/plan/pillar-0-governance/audit-runner.md.
sample_incident: "S042 OPEN-050 T2: validate-directive-has-rzf.mjs promoted from ADVISORY to BLOCKING (v2.0.0→v2.1.0). audit-runner.md description still said ADVISORY. validate-audit-health.mjs flagged freshness violation. verify exit_code=1. Caught and fixed before commit, but not in initial ZF cycles."
mechanical_prevention: "Pre-commit hook (tools/scripts/git-hooks/pre-commit Check 2) now warns when tools/validators/*.mjs is staged without audit-runner.md. After fixing: stage audit-runner.md + run pnpm audit-runner:split before committing."
principle_reference: P-META-019
related_error: EP-ERR-001
status: mechanically_prevented
session: S042
scope_level: S2
links:
  - { rel: related, href: EP-ERR-001-done-equals-committed.md }
  - { rel: contract, href: ../../../../docs/plan/pillar-0-governance/behavioral-contracts.md }
---

# EP-ERR-011 — Validator Audit-Runner Ripple

**Training default:** "I edited the validator, tests pass, commit done."

**CSPS override:** Every validator edit has a ripple: its `audit-runner.md` entry must describe its CURRENT behavior. Freshness is enforced by `validate-audit-health.mjs` — stale entries fail verify.

**What happened:**
`validate-directive-has-rzf.mjs` was upgraded from ADVISORY to BLOCKING (v2.0.0→v2.1.0 in S042 OPEN-050 T2). The audit-runner.md entry still described the validator as ADVISORY-only. `validate-audit-health.mjs` Check B detects validators newer than audit-runner.md. `pnpm verify` exited 1. The issue was discovered by running verify (per Rule 6) before committing — but was NOT anticipated in the initial ZF cycles.

**The satisfaction point problem:**
The satisfaction point was: "the validator logic is correct, the exit code is right, done."
The gap: governance artifacts have descriptions that must stay synchronized with implementation. "Correct code" ≠ "correct documentation in the registry that governs it."

**Prevention (use this pattern after any validator edit):**
1. Edit `tools/validators/[name].mjs` — update `@csps-version` header
2. Find `[name]`'s entry in `docs/plan/pillar-0-governance/audit-runner.md`
3. Update the description to match new behavior
4. Run `pnpm audit-runner:split` to sync slices
5. Stage all three: `*.mjs` + `audit-runner.md` + `audit-runner/` slices
6. Pre-commit hook Check 2 confirms `audit-runner.md` is staged

**Structural prevention:**
Pre-commit hook `tools/scripts/git-hooks/pre-commit` Check 2 fires when `tools/validators/*.mjs` is staged WITHOUT `audit-runner.md`. ADVISORY warning. Implemented S042.

**Broader pattern (B_CATCH_TO_ENGRAVING):**
Every discovered gap during implementation must be registered before the session closes.
Satisfaction point = "I fixed it inline" is insufficient. EP-ERR + OPEN item + pre-commit check = the minimum. See OPEN-053 for B_CATCH_TO_ENGRAVING T1+T2 build.
