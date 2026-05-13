---
id: csps.external-integrations.supabase
name: supabase-integration-knowledge
description: >
  Supabase integration knowledge — database, connection pooling, migrations,
  and credential patterns for CSPS. Mandatory read before any Supabase work.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: external_integrations
diataxis_type: reference
session: S028
last_verified: 2026-05-13
next_review: 2026-08-13
content_hash: S028-gate3-supabase
breaking_changes: https://supabase.com/changelog
credential_location: Vercel env vars — DATABASE_URL, DIRECT_URL
tags:
  - domain:infra
  - type:reference
  - audience:ai-agent
  - maturity:stable
---

# Supabase Integration Knowledge — CSPS

> **MANDATORY READ** before any Supabase configuration, migration,
> schema change, or credential work.

## Verified Working Configuration (S028)

### Connection Strings

| Variable | Port | Suffix Required | Purpose |
|---|---|---|---|
| `DATABASE_URL` | **6543** | `?pgbouncer=true&connection_limit=1` | Prisma runtime queries (pooled) |
| `DIRECT_URL` | **5432** | none | Prisma migrations (direct) |

**Full DATABASE_URL format:**
```
postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**Full DIRECT_URL format:**
```
postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

## Critical Rules

### R1: pgbouncer=true is MANDATORY on DATABASE_URL
Without `?pgbouncer=true&connection_limit=1` on port 6543, Prisma throws:
`42P05: prepared statement already exists`
PgBouncer (transaction mode) doesn't support prepared statements. Prisma must
be told to disable them. Both params required — one without the other fails.

### R2: DIRECT_URL uses port 5432 — no pgbouncer params
Migrations bypass PgBouncer. DIRECT_URL always port 5432 without any suffix.
Mixing this up causes migration failures that succeed locally but fail in CI.

### R3: Both URLs must be set in Vercel
Prisma reads both from env vars at runtime and at migration time. Missing either
causes build or runtime failures. Set in Vercel → Environment Variables for
all environments (Production, Preview, Development).

### R4: Never put credentials in .env.local or code
B_ZERO_LAPTOP_DEPENDENCY: credentials live only in Vercel env vars.
No .env.local files. No .env committed to repo. No hardcoded values.
Rotation: go to Supabase → Settings → Database → Reset password, then
update Vercel env vars only.

### R5: Schema lives in libs/policies/schema.zmodel (S1 platform scope)
The ZenStack schema at `libs/policies/schema.zmodel` is the SSoT for all
CSPS apps. Do NOT create per-app Prisma schemas. All 30 apps share one schema.

### R6: Prisma generator output must use default location
`output = "./generated/client"` in the generator block breaks `@prisma/client`
type resolution across all apps. NEVER add a custom `output` to the generator.
If you see it — remove it. (Root cause discovered S028 Gate 3.)

### R7: Run migrations via DIRECT_URL, not DATABASE_URL
```bash
prisma migrate deploy --schema=libs/policies/generated/schema.prisma
```
Always use the generated schema (from ZenStack), never the .zmodel directly.

### R8: multiSchema preview feature is required
The CSPS schema uses PostgreSQL's `public` schema via `schemas = ["public"]`.
The `previewFeatures = ["multiSchema"]` in the generator is required.

## Supabase Dashboard Navigation (S028 verified)

```
Supabase Dashboard (supabase.com/dashboard)
└── [project] 
    └── Settings
        └── Database
            ├── Connection string → URI tab → copy DATABASE_URL (port 6543)
            └── Direct connection → copy DIRECT_URL (port 5432)
```

## Deployment Checklist (copy for each new app)

- [ ] DATABASE_URL set in Vercel with port 6543 + `?pgbouncer=true&connection_limit=1`
- [ ] DIRECT_URL set in Vercel with port 5432 (no suffix)
- [ ] Both URLs set for ALL environments (Production + Preview + Development)
- [ ] No .env.local files created
- [ ] No credentials in code or committed to repo
- [ ] schema.zmodel has no custom `output` in generator block
- [ ] Migrations run via DIRECT_URL: `prisma migrate deploy`

## Screenshot Archive

Screenshots saved at: `docs/plan/pillar-0-governance/external-integrations/screenshots/supabase/`
Next review: 2026-08-13

## Changelog

| Date | Session | Finding |
|---|---|---|
| 2026-05-13 | S028 | Gate 3 verified. R1-R8 documented from production deployment. |
