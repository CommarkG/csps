---
id: csps.pillar-2.app-schema-contract
name: app-schema-contract
description: The schema-per-app contract — what lives in public (shared kernel) vs app_<slug> (per-app). Fully-qualified table names mandatory; never set search_path with transaction pooling (CVE-class data leak). Multi-schema Prisma migrations are NOT solved upstream; tools/migrate-multi-schema is the custom workaround. Apps may read public; never read other apps' schemas.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:data
  - type:reference
  - audience:developer
  - maturity:stable
crosscutting:
  - security
  - reliability
  - multi-tenant
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ../pillar-0-governance/reuse-first-principle.md }
  - { rel: foundation-zmodel, href: ./foundation-zmodel.md }
  - { rel: starter-slices, href: ./starter-slices.md }
  - { rel: audit-triggers, href: ./audit-triggers.md }
  - { rel: graduation-pipeline, href: ../pillar-6-operations-and-delivery/graduation-pipeline.md }
domain_path: platform
---

# App Schema Contract

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The schema-per-app pattern: what lives in the `public` schema (shared kernel) vs in each app's `app_<slug>` schema. The operational rules that make this safe (fully-qualified table names mandatory; never `search_path` with transaction pooling). The custom multi-schema migration tooling. The cross-schema read rules.

## Why this exists

The schema-per-app pattern is the bedrock that makes both *multi-tenant economies of scale* AND *clean graduation* possible (per P-ARCH-018). Without explicit rules about what lives in `public` vs `app_<slug>`, the boundary blurs and graduation extraction (per [graduation-pipeline.md](../pillar-6-operations-and-delivery/graduation-pipeline.md)) becomes painful surgery instead of a 2-3 day operation.

## What lives in `public` (the shared kernel)

The 16 Foundation slices (see [starter-slices.md](./starter-slices.md) for the full list):

- **Identity:** `User`, `Organization`, `OrgMembership`
- **Entitlements:** `Entitlement`
- **Audit infrastructure:** `AuditLog`, `AuditCheck`, `AuditRun`, `AuditResult`, `AuditFact` + the `audit.events` partitioned table + the `audit.record()` trigger function
- **Vocabulary registries:** `Skill`, `Agent`, `Plugin`, `Persona`, `PersonaBundle`, `PersonaEval`, `PersonaMemory`
- **Crisis:** `CrisisEvent` (the load-bearing v1 safety surface)
- **Catalog:** `CatalogArtifact`, `CatalogBundle` (added v1.5 with the catalog system)
- **The `Base` abstract model** (per [foundation-zmodel.md](./foundation-zmodel.md))
- **All shared enums** (`Tier`, `StaffRole`, `OrgRole`, `Visibility`, `Status`, `RiskClass`, `PersonaDomain`)
- **Glossary-derived `@@meta` annotations** (auto-generated from `packages/glossary`)

## What lives in `app_<slug>` (per-app)

The app's domain entities. Examples:
- `app_bookings.bookings`, `app_bookings.customers` (a booking app)
- `app_crm.leads`, `app_crm.deals` (a CRM app)
- `app_marketing.campaigns`, `app_marketing.audiences` (a marketing app)

All app entities:
- Inherit `Base` (tenant scoping + audit + soft-delete for free)
- Use `@@schema("app_<slug>")` directive
- Have audit triggers attached at migration time using the shared `audit.record()` function
- Have feature keys namespaced: `app.<slug>.<entity>.<rest>`

## Example App slice

```prisma
// libs/policies/slices/app-bookings/booking.zmodel

import "../../base"

model Booking extends Base {
  customerId   String
  customerName String
  date         DateTime
  status       String       // "pending" | "confirmed" | "cancelled"
  notes        String?      @db.Text
  @@schema("app_bookings")
  @@allow('all', auth().tenantId == tenantId && deletedAt == null)
  @@index([tenantId, date])
  @@index([tenantId, customerId])
  @@index([tenantId, status, date])
}
```

## Critical operational rules

### 1. Use fully-qualified table names ALWAYS

Prisma multi-schema does this by default — every reference is `app_bookings.bookings`, not bare `bookings`. **Never set Postgres `search_path` from app code.**

**Why this is critical:** combined with PgBouncer transaction pooling, `search_path` is a CVE-class data-leak vector — a future query on a reused connection sees the previous tenant's path. Fully-qualified names are leak-proof.

This is enforced via:
- ESLint rule `csps/no-search-path-set` (per P-ARCH-018 enforcer #2)
- Prisma multi-schema preview feature (default behavior)
- Code review at PR time

### 2. Multi-schema Prisma migrations are NOT solved upstream

Prisma generates migrations with the schema name baked in (`CREATE TABLE "app_bookings"."bookings"`). A new app cannot reuse old migrations because the schema name is hardcoded.

**Workaround:** `tools/migrate-multi-schema/migrate.ts` templates schema names per app. Apply with:

```bash
pnpm migrate:app --slug=bookings
```

This:
1. Reads the app's ZModel slices (under `libs/policies/slices/app-<slug>/`)
2. Generates a migration with placeholder `<APP_SCHEMA>` in DDL
3. Runs the migration against `app_<slug>` schema (creating the schema if missing)
4. Attaches audit triggers using the shared `audit.record()` function

*Why we built our own:* upstream Prisma issues #24794 and #27811 confirm the limitation. Workaround is required, not optional.

### 3. Connection pooling

**Supavisor (Supabase pooler):**
- **Transaction mode** for stateless queries — best for high concurrency
- **Session mode** required for prepared statements (Prisma uses prepared statements by default)

CSPS uses **two pool URLs**:
- `DATABASE_URL` — session mode (Prisma default queries)
- `DATABASE_POOL_URL` — transaction mode (raw SQL or specific stateless workloads)

Pool sizing: ~20–30 connections per app instance; one pool serves all schemas.

*Why:* PgBouncer-style pooling is the only way to handle high concurrency cost-effectively, but transaction mode breaks prepared statements. Two pool URLs handle both cases.

### 4. Audit trigger attachment

When `platform:app` (per [pillar 4 / generators.md](../pillar-4-developer-experience/generators.md)) creates a new schema, the migration includes:

```sql
CREATE TRIGGER bookings_audit
AFTER INSERT OR UPDATE OR DELETE ON app_bookings.bookings
FOR EACH ROW EXECUTE FUNCTION audit.record();
```

*Why one shared function:* the trigger function lives in `audit.record()` (one global function reused by every table — see [audit-triggers.md](./audit-triggers.md)). New apps get audit for free; no per-app function definition.

### 5. Cross-schema reads allowed (Foundation → App)

Apps read `public.users`, `public.organizations`, `public.entitlements`. Apps do NOT read other apps' schemas — enforced via:
- Nx module boundaries (`@nx/enforce-module-boundaries` with tag-based depConstraints)
- `@@allow` policies in ZenStack (no cross-app access patterns in App slices)
- `validate-app-schema.mjs` (slice contract check #13)

*Why directional:* apps depend on the kernel; the kernel doesn't depend on apps. App→app dependencies would defeat the graduation pattern (extracting one app would require extracting its dependents too).

## Each app gets, automatically

When `platform:app --slug=<slug>` creates a new app:

1. **Schema**: `app_<slug>` created in Postgres
2. **Tenant scoping**: every model in the app extends `Base` (free `tenantId` + audit columns + soft-delete)
3. **Audit triggers**: attached via the shared `audit.record()` function
4. **Feature key namespace**: `app.<slug>.*` reserved
5. **Foundation read access**: Prisma client can read `public.User`, `public.Organization`, etc.
6. **Generators apply**: `platform:slice` works in app context (detects `@@schema` directive and scopes accordingly)
7. **Per-app `AGENTS.md`**: cascades from root with app-specific overrides
8. **Vendored audit-runner**: ready for graduation extraction

## Graduation extraction

When an app graduates to standalone via `nx g extract-app --slug=<slug>` (per [graduation-pipeline.md](../pillar-6-operations-and-delivery/graduation-pipeline.md)):

- `pg_dump --schema=app_<slug>` — the app's data travels
- `apps/<scope>/<slug>/` source tree — the app's code travels
- `libs/policies/slices/app-<slug>/` ZModel — the app's schema definitions travel
- Foundation slices stay in CSPS — graduated app vendors copies if needed
- Stripe products/customers attributed to the app
- Subset of `audit.events` filtered by `table_schema = 'app_<slug>'`

The schema-per-app pattern makes this a 2-3 day operation. Without it, extraction would require surgical separation of app rows from shared tables — months of work.

## Cross-references to architecture principles

This document directly enforces:
- **P-ARCH-018** (schema-per-app) — the foundational pattern
- **P-ARCH-010** (defense in depth) — RLS at the Postgres layer + ZenStack at the app layer
- **P-ARCH-008** (audit by trigger) — every app inherits triggers via the shared function
- Cross-cutting concern `multi-tenant` — every artifact addresses it via `tenantId`

## Reuse-first applied to app schema patterns

Before creating new conventions for an app's schema:

1. **Check what `Base` provides** — `tenantId`, audit columns, soft-delete, indexes are already there
2. **Check existing app slices** for similar entity patterns — could you copy a Booking-style slice as the starting point?
3. **If a new pattern is genuinely needed** (e.g., a versioned-content pattern for a CMS app), propose it as a Base extension via ADR rather than per-app reinvention

## Sources

- [Prisma multi-schema](https://www.prisma.io/docs/orm/prisma-schema/data-model/multi-schema)
- [Prisma issues #24794 + #27811](https://github.com/prisma/prisma/issues/24794) — multi-schema migration limitations
- [Supabase Supavisor pooler docs](https://supabase.com/docs/guides/database/connecting-to-postgres#shared-pooler)
- [PgBouncer transaction-mode caveats](https://www.pgbouncer.org/usage.html#transaction-mode)
- [CVE-class search_path leaks](https://www.postgresql.org/docs/current/sql-set.html) — Postgres docs warn about session-state leakage with pooling
- v1.3 master plan §6.5 (the original draft this leaf migrates from)
