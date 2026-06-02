---
id: csps.policies.migrations
name: migrations
description: "Authored SQL migrations for the CSPS platform schema. Non-generated — lives outside libs/policies/generated/ (gitignored)."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
tags:
  - domain:architecture
  - type:reference
  - audience:developer
  - maturity:stable
---

# CSPS Platform Migrations

Authored (non-generated) SQL migrations for the CSPS platform schema.

## Why this directory exists

`libs/policies/generated/` is gitignored (ZenStack/Prisma generated output).
Migration SQL files are authored artifacts (not generated), so they live here.

## Apply a migration

```bash
# From a machine with Supabase credentials
# MUST use DIRECT_URL (port 5432) — not pgbouncer — for migrations
npx prisma migrate deploy --schema libs/policies/generated/schema.prisma
```

Prisma reads from the `migrations/` path configured in the generated schema (or point it to this directory).

## Migrations

| Directory | Session | Description |
|-----------|---------|-------------|
| `20260601_part3_product_schema/` | S075 | Plan + Capability + PlanCapability + Tenant.planId FK |
| `20260602_uuid_native_types/` | S077 | TEXT→UUID type migration for all id + FK columns. Deadline: 2026-06-16. Register: gap_DIM2_CORE_ID_UUID_UPGRADE |

## Block-test after applying `20260602_uuid_native_types`

Run these queries against the live DB:

```sql
-- 1. Zero rows lost
SELECT COUNT(*) FROM "public"."User";  -- must equal pre-migration count

-- 2. id columns are now uuid type
SELECT column_name, data_type, table_name
FROM information_schema.columns
WHERE table_schema = 'public' AND column_name = 'id' AND data_type != 'uuid'
  AND table_name NOT IN ('_prisma_migrations');
-- Must return 0 rows

-- 3. FK constraints restored (expect 20)
SELECT COUNT(*) FROM pg_constraint
WHERE contype = 'f' AND conrelid::regclass::text LIKE 'public.%'
  AND conname LIKE '%_fkey'
  AND conname NOT IN ('Tenant_planId_fkey', 'PlanCapability_planId_fkey', 'PlanCapability_capabilityId_fkey');
-- Must return 20
```
