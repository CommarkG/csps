---
id: csps.pillar-6.bootstrap-script
name: bootstrap-script
description: PowerShell bootstrap script — empty repo to running CSPS platform in one command. Provisions Supabase / Stripe / Clerk / Cloudflare bindings + runs codegen + initializes catalog + verifies provisioning checklist + emits readiness report. Re-runnable in graduate-mode for graduation pipeline. Migrated from v1.3 §18.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
next_review_at: 2026-08-01
tags:
  - domain:ops
  - type:tutorial
  - audience:developer
  - audience:admin
  - maturity:stable
crosscutting:
  - reliability
  - observability
diataxis_type: tutorial
links:
  - { rel: parent, href: ./README.md }
  - { rel: build-order, href: ./build-order.md }
  - { rel: graduation-pipeline, href: ./graduation-pipeline.md }
  - { rel: stripe-clerk-wiring, href: ../pillar-3-platform-services/stripe-clerk-wiring.md }
  - { rel: catalog, href: ../pillar-3-platform-services/catalog-bundle-system.md }
created-new-because: |
  No prior leaf documented the bootstrap script. v1.3 §18 had the script outline inline. The
  script is load-bearing for week-1 + graduation-pipeline (vendored variant). This leaf locks
  the contract + readiness checklist + idempotency requirements. Distinct from build-order
  (which uses bootstrap as week-1 step 1) and graduation-pipeline (which uses --graduate-mode).
domain_path: platform
core_spine: OPER
schema_anchor: pillar_0_governance_leaves
---

# Bootstrap Script

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The PowerShell bootstrap script (`tools/bootstrap.ps1`) that turns an empty repo into a running CSPS instance in one command. The provisioning prerequisites, the script's idempotency contract, the readiness verification it runs, the `--graduate-mode` variant for graduation extractions, the failure-mode reporting.

Why PowerShell: the platform's primary developer environment is Windows + PowerShell (per CLAUDE.md environment). The bootstrap stays consistent with that environment. A bash variant ships in week 12+ for Linux/macOS contributors.

## Why this exists

Without a bootstrap script, week-1 setup is manual: copy DDL, run migrations, scaffold packages, init catalog, run codegen — 47 manual steps each prone to drift. The bootstrap script makes the platform reproducible from empty repo to running instance. Also load-bearing for graduation (per `graduation-pipeline.md` Day 1 step 4) — the graduate runs the script in `--graduate-mode` to provision its own Supabase + apply schema + vendor the governance packages.

Per AGENTS.md hard NO: "The platform is the dogfood." Self-bootstrappable from `tools/bootstrap.ps1` is part of that dogfood discipline.

## Pre-bootstrap provisioning (user action)

Before `tools/bootstrap.ps1` runs:

1. **GitHub repo** `csps` (private) — cloned locally
2. **Supabase project** `csps-prod` — `DATABASE_URL` ready
3. **Stripe sandbox** — test-mode keys (`STRIPE_SECRET_KEY` + `STRIPE_PUBLISHABLE_KEY`)
4. **Clerk app** — Organizations enabled (`CLERK_SECRET_KEY` + `CLERK_PUBLISHABLE_KEY`)
5. **Cloudflare account** — for the eval-Worker (week 6 — bootstrap stubs the binding; actual deployment week 6)
6. **Node + pnpm** installed (Node ≥ 20; pnpm ≥ 8)

The script's first action is verifying these prerequisites; halts with explicit error if any missing.

## The script contract

```powershell
# tools/bootstrap.ps1
param(
  [string]$Mode = "platform",         # platform | graduate
  [string]$EnvFile = ".env.local",
  [switch]$DryRun,
  [switch]$Force
)

# 1. Verify prerequisites (Node / pnpm / env vars / connectivity)
# 2. pnpm install
# 3. Apply base ZModel migrations (Supabase psql via DATABASE_URL)
# 4. Apply audit-trigger DDL (per pillar-2/audit-triggers.md)
# 5. Run pnpm principles:codegen → emits AGENTS.md + skills + hooks
# 6. Initialize packages/catalog/catalog.json
# 7. Run pnpm glossary:codegen
# 8. Initialize packages/principles-mcp/ (verify boots)
# 9. Run audit-runner full pass (must be ZF-0)
# 10. Emit readiness report (provisioning_status.md)
```

`-DryRun`: prints planned operations; mutates nothing. `-Force`: skips idempotency guards (use only if you know what you're doing).

## Idempotency contract

The script is **safely re-runnable**. Each step:

- Verifies pre-state (e.g., "is the trigger already attached?")
- Skips if pre-state matches expected post-state
- Logs SKIP vs APPLY per step

Re-running on a fully-bootstrapped platform should report "10/10 SKIP — platform already at expected state."

## Readiness report (`tools/bootstrap-readiness.md`)

After successful run, the script emits a markdown report:

```markdown
# Bootstrap Readiness Report

**Mode:** platform | graduate
**Run at:** 2026-05-15T10:30:00Z
**Run by:** finky
**CSPS sha:** 9f2c1d...

## Prerequisite verification
- ✅ Node 20.10.1
- ✅ pnpm 8.15.4
- ✅ DATABASE_URL responsive
- ✅ STRIPE keys valid (test-mode)
- ✅ CLERK keys valid (Organizations enabled)

## Provisioning steps
| Step | State |
|---|---|
| 1. Prerequisites | ✅ verified |
| 2. pnpm install | ✅ applied |
| 3. Base ZModel migrations | ✅ applied (12 tables) |
| 4. Audit triggers | ✅ applied (7 triggers) |
| 5. Principles codegen | ✅ applied (AGENTS.md + 7 skills + 4 hooks) |
| 6. Catalog init | ✅ applied (0 entries; expected on fresh bootstrap) |
| 7. Glossary codegen | ✅ applied |
| 8. principles-mcp boot | ✅ verified |
| 9. Audit-runner full pass | ✅ ZF-0 |
| 10. Readiness report | ✅ this file |

## Next steps
- Begin week-1 work per pillar-6/build-order.md
- First slice: nx g platform:slice <Name>
```

The readiness report is committed to the repo on first bootstrap (gitignored on subsequent runs).

## `--graduate-mode` differences

Per `graduation-pipeline.md` Day 1 step 4:

- Step 3 applies the graduate's scoped schema (not the full base ZModel)
- Step 5 uses the vendored `principles.yaml` (provenance preserved)
- Step 6 imports the scoped catalog from CSPS extraction (not initialize-empty)
- Step 9 expects ZF-0 (graduate audit-runner ran on CSPS pre-extraction)
- Adds Step 11: provenance.yaml verification (per graduation-pipeline.md)

Otherwise identical contract.

## Failure modes + recovery

| Failure | Recovery |
|---|---|
| Prerequisite missing | Halt; print exact missing item; user installs and re-runs |
| DATABASE_URL unreachable | Halt; verify Supabase project status; re-run |
| Stripe key rejected | Halt; verify test-mode key; re-run |
| Audit-runner finds non-zero | Halt; print findings; user fixes upstream; re-runs |
| pnpm install fails | Halt; preserve partial state; user clears `node_modules` if needed |
| principles:codegen drift | Halt; user reviews codegen output; commits regenerated files |

The script never silently continues past an error.

## Anti-patterns

1. **Hard-coding secrets in the script** — refused; reads only from `.env.local` (gitignored)
2. **Bypassing audit-runner** — refused; ZF-0 gate is unconditional in `platform` mode
3. **Mutating pre-existing tables without idempotency check** — refused; pre-state verification mandatory
4. **`--Force` used in CI** — refused; CI uses dry-run mode for verification
5. **Bootstrap producing files outside the schema-aligned tree** — refused; `audit-orphan-file` catches at step 9
6. **Skipping readiness report emission** — refused; the report IS the bootstrap's audit trail

## Enforcement

- `principles.yaml#P-ARCH-006` (the-platform-is-the-dogfood — bootstrap-self-provability)
- `principles.yaml#P-META-006` (Zero-Findings — step 9 gate)
- `audit-runner.md#bootstrap-idempotency` (verifies re-run produces all SKIPs)
- `audit-runner.md#bootstrap-readiness-report-completeness` (verifies report has all sections)
- `tools/bootstrap.ps1` (the script itself)
- `tools/bootstrap-readiness.md` (committed on first bootstrap)

## Sources

- v1.3 §18 (the original PowerShell bootstrap outline)
- [pillar-3/stripe-clerk-wiring.md](../pillar-3-platform-services/stripe-clerk-wiring.md) — Stripe + Clerk provisioning the bootstrap exercises
- [pillar-2/audit-triggers.md](../pillar-2-data-and-schema/audit-triggers.md) — DDL the bootstrap applies
- [pillar-6/graduation-pipeline.md](./graduation-pipeline.md) — the `--graduate-mode` consumer
