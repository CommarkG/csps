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

## ⚠ IMPORTANT: Apply path for `20260602_uuid_native_types`

**Do NOT use `prisma migrate deploy`** — DB was bootstrapped via `prisma db push` (no baseline → P3005 error).
**Do NOT use `prisma db push`** — cannot cast `text→uuid` column type.

**Correct: one command, atomic, self-verifying:**

```bash
npx tsx --env-file=.env libs/policies/migrations/apply-uuid-migration.ts
```

The script:
1. Reads `DIRECT_URL` from `.env` (Supabase → Settings → Database → URI, port 5432)
2. Captures pre-migration row counts
3. Applies the migration SQL in one transaction
4. Runs 3 block-tests INSIDE the transaction
5. **COMMITs if all pass** / **ROLLBACKs if any fail** (no partial damage)
6. Prints PASS/FAIL per check + overall result

**Paste the output to Opus for OPIA + dim-4 Surface 5 SEAL.**

## Migrations

| Directory | Session | Description |
|-----------|---------|-------------|
| `20260601_part3_product_schema/` | S075 | Plan + Capability + PlanCapability + Tenant.planId FK |
| `20260602_uuid_native_types/` | S077 | TEXT→UUID migration — all id + FK columns. Deadline 2026-06-16. Apply via apply-uuid-migration.ts |

## Governor sequence for `20260602_uuid_native_types`

```bash
# 1. Apply + verify (one command, all-in-one)
npx tsx --env-file=.env libs/policies/migrations/apply-uuid-migration.ts

# 2. Paste the printed output to Opus → OPIA + dim-4 Surface 5 SEAL
```

That's it. The script handles everything.

## If the script fails

- `DIRECT_URL not found` → add `DIRECT_URL=postgresql://postgres.xxx:password@...supabase.com:5432/postgres` to `.env`
- `relation "public"."User" does not exist` → migration may not be applicable to this DB state
- `CHECK 2 FAIL: still TEXT id columns` → SQL may not have executed; check error above
- `CHECK 3 FAIL: FK constraints missing` → STEP 4 may have failed; check for constraint name conflicts
