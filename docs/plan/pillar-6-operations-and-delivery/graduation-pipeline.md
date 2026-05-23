---
id: csps.pillar-6.graduation-pipeline
name: graduation-pipeline
description: CSPS app → standalone product extraction pipeline. The 2-3 day extraction (not 2-3 month surgery) that proves the schema-per-app + extraction-ready-from-day-one architecture pays off. Vendored governance (principles.yaml + audit-runner + MCP + AGENTS.md cascade + crisis-escalation slice) travels with the graduate. Migrated from v1.3 §17.5.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
next_review_at: 2026-08-01
tags:
  - domain:ops
  - type:how-to
  - audience:developer
  - audience:admin
  - maturity:stable
crosscutting:
  - reliability
  - cost
  - observability
diataxis_type: how-to
links:
  - { rel: parent, href: ./README.md }
  - { rel: build-order, href: ./build-order.md }
  - { rel: schema-per-app, href: ../pillar-2-data-and-schema/app-schema-contract.md }
  - { rel: bootstrap-script, href: ./bootstrap-script.md }
  - { rel: adr-schema-per-app, href: ../../adr/0002-adopt-schema-per-app.md }
  - { rel: contracts, href: ../pillar-0-governance/behavioral-contracts.md }
created-new-because: |
  No prior leaf documented the graduation pipeline. v1.3 §17.5 had the spec inline. The pipeline
  is load-bearing for the foundry model — if extraction takes months, the schema-per-app pattern
  fails its design goal. This leaf locks the 2-3 day extraction contract + checklist.
domain_path: platform
core_spine: OPER
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Before starting this operation: has it been validated in the current deployment environment, or only in dev?"
---

# Graduation Pipeline (CSPS App → Standalone Product)

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The end-to-end extraction of a CSPS app to a standalone repo. The 2-3 day target (not 2-3 month surgery). What travels with the graduate (vendored governance + slice provenance + audit history + persona evals + crisis slice + customer accounts). What stays behind (cross-app shared infrastructure, the platform's audit-of-audits, the centralized billing tier).

## Why this exists

The foundry model fails if extraction is painful. Constellation Software, the YC portfolio, and Tiny.com all demonstrate that "extract when ready" only works if extraction is **mechanically cheap**. We pay the schema-per-app + dual-registration + audit-trigger cost on day one specifically so day-N extraction is a 2-3 day operation, not a re-architect.

Per ADR-0002 (schema-per-app) + ADR-0007 (postgres-trigger-based-audit) + ADR-0010 (reuse-first-load-bearing): every architectural choice is evaluated against "would this make extraction easy or painful?"

## The graduation gate (when an app is eligible)

An app is eligible for extraction when ALL of:

1. **Product-market fit signals:** monthly revenue ≥ $X (set per cohort) for ≥6 months, or customer cohort wants a standalone app with their own branding
2. **Slice maturity:** ≥80% of the app's slices score 100% on the slice contract; remaining 20% scored ≥90%
3. **Persona maturity:** all PUBLISHED personas have eval baselines + 30-day drift-eval clean
4. **Audit cleanliness:** 30 days without critical-severity audit finding
5. **Customer migration plan:** clear migration path for existing customer accounts (Clerk org transfer + Stripe customer transfer)

The gate is enforced by `audit-graduation-eligibility` (warn-level; advisory only — graduation is a business decision, not an automated one).

## What travels with the graduate

```
csps-app-graduate/
├── apps/<slug>/                        ← the app's apps/ tree
├── libs/<slug>/                        ← the app's libs/ tree
├── libs/policies/slices/<slug>/        ← the app's ZModel slices
├── packages/principles/                ← FULL vendored copy (codegen included)
├── packages/principles-mcp/            ← FULL vendored copy
├── packages/catalog/                   ← scoped to the graduate's entries
├── packages/skills/                    ← skills the app uses
├── packages/audit-runner/              ← FULL vendored copy
├── libs/crisis/                        ← if the app shipped personas
├── libs/personas/<slug-personas>/      ← persona definitions + eval baselines + memory schema
├── AGENTS.md                            ← vendored from CSPS root + scoped overrides
├── tools/                               ← generator subset relevant to the graduate
└── docs/plan/                          ← scoped to the graduate's pillar leaves + ADRs
```

**Vendoring discipline:** the graduate is **self-contained + provably descended**. No runtime dependency on CSPS infrastructure. Per pillar-3 sandboxed-skill-governance verbatim-vendor-preserved-rewritten-platform-owned, vendored copies preserve provenance metadata (`vendored_from: csps@<sha>`, `vendored_at: <iso>`).

## What stays behind in CSPS

- The audit-of-audits (P-META-001) — the graduate gets the audit-runner package; the meta-audit is a CSPS-only concern
- Platform-tier billing — graduate sets up its own Stripe; existing customers migrated via Stripe-customer-transfer
- Cross-app shared infrastructure (the principles MCP becomes vendored, not shared; the catalog becomes scoped, not shared)
- Long-tail customers who didn't migrate — remain on CSPS with the app's pre-graduation feature set frozen at extraction date

## The extraction sequence (target: 2-3 days)

### Day 1 — Setup + dependency analysis

1. Clone CSPS at the extraction-tag SHA into a new repo `<slug>-app`
2. Run `nx g platform:graduation-extract --app=<slug>` (the extraction generator)
   - Computes the file tree the graduate keeps (app + libs + scoped principles/catalog/audit-runner)
   - Vendors `packages/principles-mcp/` and `packages/audit-runner/` with provenance metadata
   - Re-generates `catalog.json` scoped to the graduate's entries
   - Writes `provenance.yaml` (CSPS-graduate-link)
3. Provision the graduate's own Supabase project; copy schema-per-app DDL
4. Run `bootstrap-script.ps1 --graduate-mode` (stripped-down variant)

### Day 2 — Customer + Stripe + Clerk migration

1. Stripe customer-transfer (use Stripe's customer.update API + product mapping)
2. Clerk org-transfer (Clerk Organizations API + member backfill)
3. Verify customer-facing routes work end-to-end on the graduate (chat / wizard / billing flows)
4. Run audit-runner on the graduate; expect ZF-0 findings (per pillar-0/zero-findings-discipline.md)

### Day 3 — Cutover + DNS + monitoring

1. DNS cutover (graduate's domain → graduate's infrastructure)
2. CSPS-side: graduate's app entry marked `lifecycle: deprecated` + `lifecycle_state: graduated` + `superseded_by: <graduate-repo>` per stewardship-protocol
3. Monitoring + on-call hand-off (graduate's team takes over PagerDuty / OpenTelemetry alerts)
4. Customer-facing communication (announcement; legacy-customer FAQ)
5. Post-graduation review (1 week later): graduate audit-runner clean; no regressions in customer-experience metrics

## Provenance + reverse-trail

Every graduate carries `provenance.yaml`:

```yaml
graduate_provenance:
  graduate_id: <slug>-app
  csps_origin_sha: 9f2c1d...
  csps_origin_tag: csps-v1.7.3
  graduation_date: 2026-08-15
  vendored_packages:
    - { name: "@csps/principles", version: "1.4.2", vendored_from: csps@9f2c1d }
    - { name: "@csps/principles-mcp", version: "1.0.0", vendored_from: csps@9f2c1d }
    - { name: "@csps/audit-runner", version: "2.1.0", vendored_from: csps@9f2c1d }
  customer_migration:
    stripe_customers_transferred: 247
    clerk_orgs_transferred: 89
    customers_remaining_on_csps: 14
  governance_inheritance:
    principles_count: 38
    behavioral_contracts_count: 14
    audit_checks_count: 47
    crisis_slice_attached: true
```

CSPS retains a `graduates/` ledger entry; graduate retains the provenance.yaml. Bidirectional traceability for audit + compliance + post-graduation issues.

## Anti-patterns

1. **Extraction without the slice-maturity gate** — refused; pulling unfit slices into a graduate is launching technical debt as a product
2. **Extraction stripping the crisis slice** — refused; ADR-0006 makes the slice load-bearing; graduates inherit it
3. **Vendoring without provenance metadata** — refused; provenance audit catches
4. **Customer migration without explicit consent** — refused; Stripe + Clerk customer-update requires user notification
5. **Long-tail customers silently dropped** — refused; remain on CSPS at frozen feature set; not deleted
6. **Re-architect during graduation** — refused; if the architecture needs change, do it in CSPS first, then re-tag, then graduate
7. **Skipping the post-graduation 1-week review** — refused; stewardship protocol carries the next_review_at

## Enforcement

- `principles.yaml#P-ARCH-007` (extraction-readiness-from-day-one)
- `principles.yaml#P-ARCH-002` (schema-per-app — corresponds to ADR-0002)
- `principles.yaml#P-META-004` (Stewardship — graduate's lifecycle_state transitions)
- `audit-runner.md#graduation-eligibility` (warn; gates the eligibility decision)
- `audit-runner.md#vendoring-provenance` (PR-blocking; provenance.yaml present + valid)
- `audit-runner.md#crisis-slice-vendored` (PR-blocking on graduate; slice present)
- `tools/generators/graduation-extract/index.ts` (the extraction generator)
- `packages/principles/codegen.ts` (regenerates AGENTS.md + skills + hooks for the graduate)

## Sources

- [docs/adr/0002-adopt-schema-per-app.md](../../adr/0002-adopt-schema-per-app.md)
- [docs/adr/0007-postgres-trigger-based-audit.md](../../adr/0007-postgres-trigger-based-audit.md)
- [docs/adr/0010-reuse-first-principle-load-bearing.md](../../adr/0010-reuse-first-principle-load-bearing.md)
- Constellation Software / Tiny.com — informs the foundry model this pipeline serves
- [pillar-2/app-schema-contract.md](../pillar-2-data-and-schema/app-schema-contract.md) — the schema isolation that makes extraction cheap
- [pillar-3/sandboxed-skill-governance.md](../pillar-3-platform-services/sandboxed-skill-governance.md) — vendoring discipline this pipeline reuses
