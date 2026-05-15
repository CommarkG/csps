---
id: csps.plan.pillar.data-and-schema
name: pillar-2-data-and-schema
description: ZModel base, foundation slices, app schema contract, multi-tenant isolation, audit triggers, partitioning, RLS performance. The "data layer" pillar.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:data
  - type:doc
  - audience:developer
  - maturity:stable
crosscutting:
  - security
  - reliability
  - performance
  - multi-tenant
links:
  - { rel: parent, href: ../README.md }
  - { rel: principle, href: ../pillar-0-governance/reuse-first-principle.md }
domain_path: platform
core_spine: ARCH
schema_anchor: pillar_0_governance_leaves
scope_level: S1
---

# Pillar 2 — Data & Schema

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this pillar covers

ZModel base mixin, the 16 foundation slices, app schema contract (schema-per-app pattern), multi-tenant isolation rules, audit trigger SQL, partitioning strategy, RLS performance patterns, multi-schema migration tooling.

This is the data layer of CSPS. Everything that lives in Postgres, every authorization rule that gates Postgres queries, every audit event that records Postgres writes.

## Industry framework alignment

- **TOGAF "Data" architecture domain** — the closest classical fit
- **AWS WAF "Security" + "Reliability"** for multi-tenant + RLS aspects
- **The "shared kernel" pattern (Domain-Driven Design)** for foundation slices

## Why this pillar exists

A multi-tenant SaaS platform's hardest problems are data problems: tenant isolation, schema migrations across N tenants, audit completeness, RLS performance, soft-delete vs hard-delete, foreign keys across schemas. Getting any of these wrong is a security incident or a 3am incident or both.

Locking the patterns once — base mixin, schema-per-app, audit-by-trigger, RLS with STABLE auth functions — means every new slice inherits correctness rather than re-deciding it.

## Leaf documents in this pillar

| Document | Status | Source (v1.3) |
|---|---|---|
| [foundation-zmodel.md](foundation-zmodel.md) | 🟢 v1.8 | §6 |
| [app-schema-contract.md](app-schema-contract.md) | 🟢 v1.8 | §6.5 |
| [starter-slices.md](starter-slices.md) | 🟢 v1.8 | §7 |
| [audit-triggers.md](audit-triggers.md) | 🟢 v1.8 | §8 |

## Cross-cutting concerns this pillar addresses

- **Security** — RLS + ZenStack `@@allow` policies; tenant isolation; audit-by-trigger
- **Reliability** — partitioning prevents audit table from drowning the DB; soft-delete prevents irreversible mistakes
- **Performance** — STABLE auth functions for RLS; composite indexes; partial unique indexes for soft-delete uniqueness
- **Multi-tenant** — schema-per-app + tenant_id columns + cross-schema reads only Foundation→App, never App→App

## Reuse-first reminder

Before adding a new ZModel pattern, search existing slices for near-matches. The base mixin should cover 90% of needs; if a slice needs a different pattern, ADR + extend the base mixin (don't fork it).

## Critical rules

- **Use fully-qualified table names always.** Never set Postgres `search_path` from app code (CVE-class data-leak vector with PgBouncer transaction pooling).
- **Multi-schema migrations are NOT solved upstream.** The `tools/migrate-multi-schema/migrate.ts` custom workaround templates schema names per app.
- **`pg_stat_statements` enabled from day one.** Cannot tune what isn't measured.
- **Wrap `auth.uid()` in `(SELECT ...)`** for STABLE marking — single biggest RLS performance win.
- **Partial unique indexes for soft-delete uniqueness** — declared in migration, not ZModel (Prisma multi-schema doesn't generate from `@@unique`).
