---
id: csps.adr.0002-adopt-schema-per-app
title: ADR-0002 — Adopt schema-per-app for multi-tenancy + extraction-readiness
status: accepted
date: 2026-05-02
deciders: group:finky
consulted: solo-dev (Finky)
informed: future-CSPS-developers
tags:
  - domain:data
  - type:explanation
  - audience:developer
  - audience:ai-agent
  - maturity:stable
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/pillar-2-data-and-schema/app-schema-contract.md }
  - { rel: registry, href: ../../packages/principles/principles.yaml }
  - { rel: enforces, href: ../plan/pillar-0-governance/architecture-principles.md }
context_question: "Before relying on this decision: has the constraint that drove it changed? If platform needs have shifted, this ADR may need reassessment."
---

# ADR-0002 — Schema-per-app multi-tenancy

## Context and problem statement

CSPS hosts 30–75 apps. Each app has its own domain entities (Bookings, Orders, Personas, etc.). When an app graduates to standalone, its entities must extract cleanly without breaking other apps. Pure RLS-based isolation in a shared schema makes extraction painful — every entity table contains rows from every app, requiring per-row export filters and post-extraction tenant_id rewriting.

## Considered options

| Option | Pro | Con |
|---|---|---|
| Single shared schema + RLS by tenant_id | Simplest start; mature pattern | Extraction is 2–3 month surgery (per-row exports, FK rewrites); cross-app queries blur ownership |
| One Postgres database per app | Hardest isolation | 30× operational tax; cross-app queries impossible without ETL |
| One schema per app (`public` kernel + `app_<slug>`) | Extraction = `pg_dump --schema=app_<slug>`; 2–3 days; clean ownership | Multi-schema Prisma is younger pattern; ZenStack has caveats |

## Decision outcome

**Chosen:** schema-per-app. The shared kernel lives in `public` (User, Tenant, Audit, AuditCheck, AuditRun, AuditResult, AuditFact, Persona base, LearningLoopItem, etc.). Each app's domain entities live in `app_<slug>`. Cross-schema FKs use fully-qualified names; never `search_path`.

**Reasoning:** Extraction-readiness from day one (P-ARCH-018) is non-negotiable for the foundry pattern. The `pg_dump --schema=app_<slug>` extraction primitive is the single load-bearing operation that makes graduation feasible solo.

## Consequences

- Every entity declares `@@schema("app_<slug>")` or `@@schema("public")` in ZModel.
- The `app-schema-isolation` audit (PR, error severity) verifies app slices declare app-schema; foundation slices use `public`.
- The `no-search-path-set` ESLint rule forbids `SET search_path` in app code (CVE-class data leak with PgBouncer transaction pooling).
- The `tools/migrate-multi-schema/migrate.ts` tool templates schema names per app at bootstrap.

## Enforcement

- `principles.yaml#P-ARCH-018` (severity: critical; ≥3 enforcers)
- `audit-runner.md` checks: `app-schema-isolation`, `no-search-path-set` (via ESLint), `multi-schema-migration`

## Open questions

- See OQ-RF-001 (where does "always reuse" conflict with extraction-readiness?). Answer pattern: `packages/*` are public/extractable; `libs/*/internal/**` must inline at extraction. Locked in this ADR.

## Sources / references

- [pillar-2/app-schema-contract.md](../plan/pillar-2-data-and-schema/app-schema-contract.md)
- [pillar-2/foundation-zmodel.md](../plan/pillar-2-data-and-schema/foundation-zmodel.md)
- [Prisma multi-schema docs](https://www.prisma.io/docs/orm/prisma-schema/data-model/multi-schema)
- [ZenStack](https://zenstack.dev/)
- [PgBouncer transaction pooling + search_path CVE](https://www.pgbouncer.org/usage.html)
