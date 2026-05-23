---
id: csps.adr.0007-postgres-trigger-based-audit
title: ADR-0007 — Postgres-trigger-based audit (not app-level middleware)
status: accepted
date: 2026-05-02
deciders: group:finky
consulted: solo-dev (Finky)
informed: future-CSPS-developers, security-reviewers
tags:
  - domain:data
  - type:explanation
  - audience:developer
  - audience:admin
  - maturity:stable
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/pillar-2-data-and-schema/audit-triggers.md }
  - { rel: registry, href: ../../packages/principles/principles.yaml }
context_question: "Before relying on this decision: has the constraint that drove it changed? If platform needs have shifted, this ADR may need reassessment."
---

# ADR-0007 — Postgres triggers as audit primitive

## Context and problem statement

Audit logging — who-did-what-when on every entity write — is non-negotiable for multi-tenant SaaS (compliance, debugging, security). The implementation choice is between application-layer middleware (Express/Next.js wrapper that intercepts writes) and database-layer triggers.

App-layer middleware is bypassable: any code path that hits the DB without going through the wrapper escapes the audit. Direct `psql`, raw Prisma client outside the wrapper, future microservices, ETL jobs, panic-fixes — all bypass app middleware. The audit log gets holes; "no >5-min gap per tenant" assertions become impossible to maintain.

## Considered options

| Option | Pro | Con |
|---|---|---|
| App middleware (Prisma extension or Next.js wrapper) | Easy to write; rich context | Bypassable by raw SQL, ETL, secondary services, panic fixes |
| **Postgres triggers** firing on every entity table | Cannot bypass; uniform across all clients | Trigger maintenance overhead; cross-table joins for context |
| Logical replication → audit consumer | Decouples audit | More moving parts; eventual consistency window |

## Decision outcome

**Chosen:** Postgres triggers fire on every write (INSERT/UPDATE/DELETE) on every entity table. The trigger calls `audit.record()` which writes to `public.audit.events` (append-only via RLS).

App-level audit context (user_id, request_id, intent) is passed via Postgres session-local variables (`SET LOCAL audit.user_id = ...`) which the trigger reads.

**Reasoning:** Triggers are the only enforcement layer that catches everything. App middleware is a layer-of-convenience; triggers are the layer-of-correctness.

## Consequences

- Every entity table has a trigger calling `audit.record()`.
- The slice contract check #4 (`audit-trigger-coverage`) verifies trigger presence at PR time.
- The `audit-log-integrity` audit (nightly, critical) verifies no >5-min gap per tenant in `audit.events`.
- The `pg-trigger-introspection` audit verifies triggers are present at the DB layer (PR-time, via `pg_trigger`).
- App code never writes to `audit.events` directly; the only writer is the trigger.

## Enforcement

- `principles.yaml#P-ARCH-008` (severity: critical; ≥4 enforcers)
- `audit-runner.md#audit-trigger-coverage`, `#audit-log-integrity`, `#pg-trigger-introspection`
- `libs/policies/slices/public/audit.zmodel` — RLS policy on `audit.events` (append-only; no UPDATE/DELETE)

## Open questions

- Trigger overhead at high write volume — measure during load tests (week 8). If >5% overhead, evaluate logical replication alternative (would supersede this ADR).

## Sources / references

- [pillar-2/audit-triggers.md](../plan/pillar-2-data-and-schema/audit-triggers.md)
- [Postgres triggers](https://www.postgresql.org/docs/current/triggers.html)
- [Postgres session-local variables](https://www.postgresql.org/docs/current/sql-set.html)
