---
id: csps.pillar-2.foundation-zmodel
name: foundation-zmodel
description: The base ZModel that every CSPS slice inherits. Defines enums (Tier, StaffRole, OrgRole, etc.), the Base mixin (id, tenantId, audit columns, soft-delete enforced), the RLS performance pattern (STABLE auth function), and ZenStack enhance() session-locals integration.
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
  - performance
  - multi-tenant
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ../pillar-0-governance/reuse-first-principle.md }
  - { rel: app-schema-contract, href: ./app-schema-contract.md }
  - { rel: starter-slices, href: ./starter-slices.md }
  - { rel: audit-triggers, href: ./audit-triggers.md }
  - { rel: principles-yaml, href: ../../../packages/principles/principles.yaml }
domain_path: platform
---

# Foundation ZModel

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The canonical root ZModel that every CSPS slice imports from. Defines:
- `datasource` + `generator` configuration with multi-schema support
- The shared enums (`Tier`, `StaffRole`, `OrgRole`, `Visibility`, `Status`, `RiskClass`, `PersonaDomain`)
- The `Base` abstract model that every slice extends
- The RLS performance pattern (STABLE auth function)
- ZenStack `enhance()` session-locals integration

## Why this exists

Every slice in the platform inherits from a single base. Without a shared base, each slice would re-derive `tenantId`, soft-delete, audit columns, and tenant-scoping policies — drift guaranteed. With a shared base, every slice gets these for free and they're all consistent.

The base mixin is the foundation of: **multi-tenancy** (every row knows its tenant), **soft-delete** (every row can be tombstoned — per P-ARCH-007), **audit** (every change has an actor — per P-ARCH-008), and the slice contract's check #2.

## The base ZModel file

```prisma
// libs/policies/base.zmodel

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["public"]   // App schemas appended at app creation time
}
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}

// === Enums (in public schema, shared by all apps) ===
enum Tier           { FREE PRO BUSINESS ENTERPRISE }
enum StaffRole      { OWNER ADMIN DEVELOPER SUPPORT FINANCE AUDITOR CONTRACTOR }
enum OrgRole        { OWNER ADMIN MEMBER GUEST }
enum Visibility     { PUBLIC TENANT PRIVATE }
enum Status         { DRAFT PUBLISHED ARCHIVED }
enum RiskClass      { LOW MEDIUM HIGH CRISIS_ELIGIBLE }
enum PersonaDomain  { BUSINESS PERSONAL SOCIAL SPIRITUAL CUSTOM }

// === Base mixin — every slice inherits ===
abstract model Base {
  id        String    @id @default(cuid())
  tenantId  String
  createdAt DateTime  @default(now())
  createdBy String
  updatedAt DateTime  @updatedAt
  updatedBy String
  deletedAt DateTime?
  // Authz: tenant-scoped, soft-delete forced
  @@allow('all', auth().tenantId == tenantId && deletedAt == null)
  @@deny('delete', true)        // forces soft-delete via update path (P-ARCH-007)
  @@index([tenantId, deletedAt])
}
```

### Why each design decision

- **`cuid()` not `uuid()`** — shorter, URL-safe, sortable by creation time, no collision risk at our scale
- **`deletedAt DateTime?` (nullable)** — the soft-delete signal. NULL = active; non-NULL = tombstoned
- **`@@deny('delete', true)`** — forces every "delete" through the soft-delete update path. Hard delete requires the explicit `@hardDelete` annotation per P-ARCH-007
- **Composite index `[tenantId, deletedAt]`** — every tenant-scoped query filters by both. Composite > separate indexes
- **Enum `Tier` numeric ordering** — see [vocabulary.md](../pillar-1-architecture-and-stack/vocabulary.md) for the `FREE=0, PRO=10, BUSINESS=20, ENTERPRISE=30` rationale

## Foundation slices use `@@schema("public")`

Foundation slices live in `libs/policies/slices/public/` and use `@@schema("public")`. Example — User as the canonical foundation slice:

```prisma
// libs/policies/slices/public/user.zmodel

model User extends Base {
  clerkId     String  @unique
  email       String
  staffRole   StaffRole?
  memberships OrgMembership[]
  preferences Json?
  @@schema("public")
  @@allow('read', auth() == this || auth().staffRole != null)
  @@allow('update', auth() == this || auth().staffRole in [ADMIN, OWNER])
  // Migration appends partial unique index:
  // CREATE UNIQUE INDEX ON public.users(tenant_id, email) WHERE deleted_at IS NULL;
  // (Bare UNIQUE(email) is a cross-tenant enumeration vector.)
}
```

Other foundation slices (Organization, OrgMembership, Entitlement, AuditLog, AuditCheck/Run/Result/Fact, Skill, Agent, Plugin, Persona, PersonaBundle, PersonaEval, PersonaMemory, CrisisEvent) follow the same pattern — see [starter-slices.md](./starter-slices.md) for the full list.

## Why partial unique indexes (declared in migration, not ZModel)

Prisma multi-schema doesn't generate partial indexes from `@@unique`. We need them because soft-deleted rows would otherwise hold the unique constraint forever (oops, I deleted user X and now nobody can re-register that email). Partial unique = unique only among active rows.

The slice generator (`platform:slice`) emits the migration with the partial index alongside the table create.

## RLS performance pattern (STABLE auth function)

The `auth()` function used inside `@@allow` policies must resolve via a Postgres function marked `STABLE` so the planner caches it per-statement instead of evaluating per-row.

Implementation lives in `packages/db/src/auth-fn.sql`:

```sql
CREATE OR REPLACE FUNCTION app.auth_user()
RETURNS jsonb AS $$
  SELECT jsonb_build_object(
    'id', current_setting('app.actor_id', true),
    'tenantId', current_setting('app.tenant_id', true),
    'staffRole', current_setting('app.staff_role', true)
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

**Why this matters:** unmarked, Postgres re-evaluates `auth.uid()`-style functions per row. On a 100k-row query that's 100k function calls. Marked STABLE, it's one call cached for the statement. The Supabase RLS optimization research confirms this is the single biggest RLS performance win.

## ZenStack `enhance()` integration

ZenStack's `enhance()` doesn't natively set Postgres session-locals. `packages/db/src/enhanced.ts` wraps it (~50 lines) so every enhanced query runs inside `withActorContext`. This is the same wrapper that delegates Payload `access` functions through ZenStack's `canRead` — one canonical authz path.

```ts
// packages/db/src/enhanced.ts (excerpt)
import { enhance } from '@zenstackhq/runtime';
import { withActorContext } from './with-actor-context';

export function enhancedPrisma(ctx: ActorContext) {
  return enhance(prisma, {
    user: { id: ctx.actorId, tenantId: ctx.tenantId, staffRole: ctx.staffRole },
  });
}

export async function dbCall<T>(
  ctx: ActorContext,
  fn: (db: ReturnType<typeof enhancedPrisma>) => Promise<T>,
): Promise<T> {
  return withActorContext(ctx, async () => {
    const db = enhancedPrisma(ctx);
    return fn(db);
  });
}
```

## Cross-references to architecture principles

The Base mixin and patterns above directly enforce:
- **P-ARCH-007** (soft-delete by default) — `@@deny('delete', true)` + the partial index pattern
- **P-ARCH-008** (audit by trigger) — `tenantId` + `createdBy` + `updatedBy` columns are what the audit trigger captures
- **P-ARCH-010** (defense in depth) — `@@allow` + RLS at the Postgres layer
- **P-ARCH-018** (schema-per-app) — multiSchema preview feature; per-app `@@schema(...)` directives
- **P-ARCH-024** (small files OK iff three preconditions) — frontmatter on every ZModel file

## Reuse-first applied to ZModel patterns

Before creating a new ZModel pattern (new mixin, new utility model, new convention):

1. **Search `libs/policies/base.zmodel`** and existing slices for similar patterns
2. **Could the new pattern extend the Base mixin?** Most concerns belong in Base (multi-tenant, audit, soft-delete already there)
3. **If genuinely new** (e.g., a `Versioned` mixin for slices that need explicit semver), add to base.zmodel + ADR explaining why Base doesn't suffice

## Sources

- [Prisma multi-schema preview feature](https://www.prisma.io/docs/orm/prisma-schema/data-model/multi-schema)
- [ZenStack runtime enhance() docs](https://zenstack.dev/docs/the-complete-guide/part1/enhancement)
- [Supabase RLS performance optimization](https://supabase.com/docs/guides/database/postgres/row-level-security#performance)
- [Postgres function volatility (STABLE / IMMUTABLE / VOLATILE)](https://www.postgresql.org/docs/current/xfunc-volatility.html)
- v1.3 master plan §6 (the original draft this leaf migrates from)
