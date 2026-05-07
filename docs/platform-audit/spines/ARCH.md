---
id: csps.platform-audit.spine.arch
name: spine-ARCH
description: >
  Domain card for the ARCH (Architecture) Core Spine. ARCH governs the data model,
  multi-tenancy isolation, ZenStack RLS policies, foundation slices, the schema-per-app
  pattern, and the graduation path. Third highest precedence spine.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: platform_audit
enforcement_stage: active
tags:
  - domain:architecture
  - domain:data
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
session: S018
links:
  - { rel: parent, href: ../README.md }
  - { rel: implementation, href: ../../../plan/pillar-2-data-and-schema/ }
  - { rel: schema, href: ../../../../libs/policies/schema.zmodel }
  - { rel: bedrock, href: ../../../plan/pillar-0-governance/csps-bedrock.md }
consolidation_cross_refs:
  - libs/policies/schema.zmodel
  - apps/task-mgmt/prisma/schema.prisma
  - docs/plan/pillar-0-governance/csps-bedrock.md
  - docs/plan/_handoff/VAULT/topic-plans/foundation-slices.md
---

# ARCH — Architecture Spine

## §1 Identity

**What I am:** The structural layer of CSPS. I define what data looks like, how it's isolated between tenants, how it's secured at the ORM layer, and how apps inherit the data foundation rather than building it.

**Core spine position:** ARCH (3rd highest precedence, after GVRN and VALD).

**Who I am part of:** Platform-level. Every app in CSPS is an expression of ARCH's foundation.

**My sub-parts:**
- Foundation Slices (User, Tenant, UserTenant, AuditEvent — the permanent shared base)
- App Slices (Project, Task, TaskComment — extract with the app at graduation)
- ZenStack Schema Layer (ZModel → Prisma generation + @@allow RLS policies)
- Schema Drift Validator (ZModel ↔ Prisma consistency gate)
- Multi-Tenancy Enforcement (ORM-level + application-level defense-in-depth)
- Graduation Pipeline (schema extraction path at $1K MRR)

---

## §2 The Problem I Solve

**Without ARCH:** Every SaaS app re-implements multi-tenancy from scratch. Each has its own User/Tenant model with slightly different field names, slightly different isolation patterns, slightly different webhook handlers. When one app gets it wrong, that app's tenants are exposed. Other apps learn nothing from it.

**What breaks specifically:**
- Cross-tenant data leaks from missing WHERE clauses (one every 10-20 endpoints in typical codebases)
- Schema migrations break existing tenant rows (NOT NULL without default on 50M-row table)
- Prisma schema and ZModel drift — policies say one thing, DB enforces another
- App-specific User models can't merge with the platform User (no shared identity layer)

---

## §3 My Principles

**Foundation principles:**
- `P-ARCH-002` — Schema-Per-App: every app gets its own DB schema namespace
- `P-ARCH-007` — Soft-Delete-By-Default: `@@deny('delete', true)` + `deletedAt` on Base
- `P-ARCH-008` — Audit-Via-Triggers: AuditEvent is append-only via Postgres triggers; never written by application code
- `P-ARCH-018` — Schema-per-app isolation: every entity has `tenantId`

**Key behavioral contracts:**
- `B_PLATFORM_FIRST_OPTIMIZATION` — ZenStack installed once at platform level; never per-app
- `B_LAYER_SEPARATION` — core layer (libs/, tools/) vs app layer (apps/*) are distinct scopes

---

## §4 How I Work

**Depth 1 — Executive view:**
Every CSPS app shares the same User/Tenant/AuditEvent foundation, defined once in `libs/policies/schema.zmodel`. ZenStack enforces `@@allow` rules at the ORM layer. No app writes a WHERE clause for tenant isolation — the policy enforces it. Schema drift between ZModel and Prisma is caught by Cycle 41 before it reaches production.

**Depth 2 — Operational view:**
`libs/policies/schema.zmodel` is the single ZModel source. Running `pnpm schema:generate` (or `zenstack generate`) produces `libs/policies/generated/schema.prisma` — the reference Prisma schema. `apps/task-mgmt/prisma/schema.prisma` is the app-maintained schema, validated against the generated reference by `validate-foundation-schema-drift.mjs`. The `enhance(prismaClient)` wrapper in `apps/task-mgmt/src/lib/zenstack.ts` enforces `@@allow` rules at runtime — every query is automatically tenant-scoped.

**Depth 3 — Implementation view:**
- ZModel flat assembly: all 7 models + 7 enums in `libs/policies/schema.zmodel`
- Foundation slices: User, Tenant, UserTenant, AuditEvent (`@@schema("public")`)
- App slices: Project, Task, TaskComment (graduate with app at $1K MRR trigger)
- `getEnhancedDb({ id, tenantId, staffRole })` creates ORM-level policy-enforcing client
- Two-step usage: raw db for bootstrap (user.findUnique by clerkId) → enhanced db for all business queries
- Migration safety: DIRECT_URL (Session Pooler) for migrations, DATABASE_URL (Transaction Pooler) for runtime

---

## §5 Dependencies & Blast Radiuses

**What I depend on:**
- GVRN (ADR ratification for schema decisions — User/Tenant 1:N was VLT-S011-003)
- OPER (Supabase for the actual database — DATABASE_URL + DIRECT_URL configuration)
- VALD (schema drift validator, ZF gate on schema changes)

**Blast Radiuses:**
- **BR1 (element-level):** Adding a field to Task model — affects Task queries only
- **BR2 (app-level):** Adding a field to foundation slice (User, Tenant) — affects all apps + all Clerk webhook handlers
- **BR3 (platform-wide):** Changing the Base mixin or `@@deny('delete', true)` policy — affects every model in every app; requires GVRN ADR

---

## §6 Personas

**Default persona — Schema Architect:**
Defines data models with multi-tenant awareness. Knows ZModel syntax. Understands the graduation boundary (which models stay shared vs. extract with app).

**Sub-personas:**
- **Migration Author:** Writes safe Prisma migrations (additive-only, no NOT NULL without default)
- **Policy Designer:** Writes `@@allow` / `@@deny` rules that express tenant isolation without SQL
- **Drift Monitor:** Runs `pnpm schema:check` to verify ZModel ↔ Prisma consistency

**AI behavior in ARCH domain:**
- *Spine-level:* Every entity must have tenantId; soft-delete is mandatory; AuditEvent is append-only
- *Platform-level:* Schema changes have blast radii; never change foundation slices without GVRN ADR
- *ARCH-unique:* Drift between ZModel and Prisma is a security issue, not just a consistency issue — an @@allow rule that doesn't match the actual schema creates exploitable gaps

---

## §7 Human Journeys

**App developer journey:**
1. Fork app template (ZenStack-integrated, S018 mandate)
2. Define domain schema: add app-specific ZModel slice in `libs/policies/slices/app/`
3. Run `pnpm schema:generate` → Prisma schema generated
4. Import `getEnhancedDb` from `@/lib/zenstack` in API routes
5. Write business logic — tenant isolation is handled automatically

**External advisor journey:**
1. Read `libs/policies/schema.zmodel` to understand the ZModel structure
2. Query: `get_domain_card("ARCH")` for full context
3. Review `@@allow` rules to understand the policy layer
4. Advise on specific schema or policy questions with full ARCH context

---

## §8 Vocabulary

**Terms I own:**
- `Foundation Slice` — User, Tenant, UserTenant, AuditEvent: stay shared across all apps permanently
- `App Slice` — domain-specific model (Task, Project) that extracts with the app at graduation
- `ZModel` — ZenStack's schema language (superset of Prisma schema with @@allow policy syntax)
- `@@allow / @@deny` — ZenStack policy declarations enforced by enhance() at ORM layer
- `enhance(prismaClient)` — the ORM wrapper that applies @@allow rules at runtime
- `Schema Drift` — divergence between ZModel definition and app Prisma schema

**Terms I use:**
- `tenantId` — from GVRN (tenant isolation is a governance requirement)
- `AuditEvent` — shared with GVRN (audit trail is a governance artifact)

---

## §9 MCP Surface

```
get_domain_card("ARCH")                    → full ARCH context
get_schema_model("User|Tenant|Task")       → ZModel definition for specific model
get_rls_policies("User")                   → @@allow rules for that model
check_schema_drift()                       → current ZModel ↔ Prisma consistency
find_by_spine("ARCH")                      → all ARCH-governed elements
```

---

## §10 Current State & Evolution

**Implemented today (enforcement_stage: active):**
- `libs/policies/schema.zmodel` — flat assembled, 7 models, zenstack generate exits 0
- `getEnhancedDb()` — ORM-level enforcement active in 4 business routes
- `validate-foundation-schema-drift.mjs` — Cycle 41, CLEAN
- Foundation slices: §11 CLOSED (S017)
- Bedrock Layer 2: 9/9 COMPLETE (S017-S018)

**Planned (enforcement_stage: planned / week-4):**
- ZenStack-integrated app template (S018 mandate — remaining bedrock item)
- field-level drift checking (cruel-critic finding: currently model-name only)
- hash-based drift validator caching (performance optimization for 10s generate)
- Postgres-level RLS via `CREATE POLICY` DDL (Level 3 security — beyond ZenStack ORM layer)

---

## §11 Connection Map

| Connected to | How |
|---|---|
| GVRN | Schema decisions require GVRN ADRs; architectural constraints are ratified, not invented |
| VALD | Drift validator (Cycle 41) enforces ARCH integrity; ZF gate on schema changes |
| AI | ZenStack `enhance()` is an AI-consumable pattern; schema cards are MCP-queryable |
| OPER | Supabase is the runtime target; migration discipline is OPER-governed |
| Platform Services: Vocabulary | Model names, field names follow naming-policy (GVRN-enforced) |
| Platform Services: QC/Audits | `foundation-slices-schema-drift` audit slug in Pipeline 6 (schema-integrity) |
