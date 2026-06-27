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
last_verified: 2026-06-25
next_review: 2026-09-25
content_hash: S089-rotation-runbook
breaking_changes: https://supabase.com/changelog
credential_location: Vercel env vars — DATABASE_URL, DIRECT_URL
tags:
  - domain:infra
  - type:reference
  - audience:ai-agent
  - maturity:stable
scope_level: S1
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

## Credential Rotation Runbook (S089 / 2026-06-25 — live-verified on csps-playground)

> **READ THE PITFALLS BELOW BEFORE STARTING.** This exact sequence was verified
> end-to-end 2026-06-25 (PARK-S084-009). The 6 pitfalls cost ~6 redeploy cycles —
> they are the *conclusions* this runbook exists to surface.

### Sequence (do in one sitting — the live site is DOWN between reset and redeploy)
1. **Confirm blast radius FIRST.** Find every place the password lives: each Vercel project's env vars (`DATABASE_URL`/`DIRECT_URL`) **and** local `.env.local`. Watch for **duplicate Vercel projects** — only the one serving the live domain matters; a duplicate with no env vars is a dead clone (delete candidate).
2. **Supabase** → Settings → Database → Database password → **Reset** → use **auto-generate** (URL-safe). Copy it **once** (shown once only; **never paste it into a chat/transcript** — that is the original leak vector, PARK-S084-009).
3. **Supabase** → Connect → **ORMs/Prisma** tab → copy `DATABASE_URL` (6543) + `DIRECT_URL` (5432); substitute the new password.
4. **Vercel** (the LIVE project) → Settings → Environment Variables → **Edit** `DATABASE_URL` + `DIRECT_URL` → paste the **bare value only**.
5. **`.env.local`** → update both (quotes OK *here*, never in Vercel).
6. **Redeploy** (Deployments → ⋯ → Redeploy, uncheck build cache). Wait for **Ready**.
7. **Verify** — `GET /api/db-health` → expect `{status:ok, db:connected}`. Do NOT trust "Ready" alone.

### PITFALLS — the conclusions (read FIRST)
| # | Trap | Symptom | Fix |
|---|---|---|---|
| 1 | Vercel value includes the **key prefix** (`DATABASE_URL = …`) | Prisma: *"URL must start with `postgresql://`"* (fails ~20ms) | Vercel value = bare connection string; first char must be `p` |
| 2 | **Quotes** wrap the value in Vercel | same protocol error | NO quotes in the Vercel field (quotes belong only in `.env.local`) |
| 3 | **Placeholder `PASSWORD`** left in the value | *"credentials … not valid"* (auth) after a ~1.5s round-trip | real password goes between `:` and `@` |
| 4 | Password has **special chars**, unencoded | auth fail / URL parse error | use an **auto-generated** (URL-safe) password — nothing to encode |
| 5 | **Forgot to redeploy** after an env change | old (dead) password stays live | env changes require a redeploy to take effect |
| 6 | Edited the **wrong/duplicate** Vercel project | fix has no effect | confirm the project serves the live domain; delete dead duplicates |

### `db-health` 503 — read the BODY, not just the status
| error body contains | meaning | action |
|---|---|---|
| `must start with the protocol postgresql://` | value malformed (pitfalls 1/2) | clean the Vercel value |
| `credentials … are not valid` (after ~1.5–2s) | format OK, password wrong (pitfalls 3/4) | reset + re-paste the real password |
| `does not exist` / `P2021` / `relation` | **connected** — table/schema just missing | push schema via `DIRECT_URL` |
| `Can't reach` / `timeout` | DB paused (usage limit) | restore the project first |

### Latency tells you the failure layer
- **~20ms** fail → URL never validated (format error). **~1.5–2s** fail → reached the server, auth rejected. **Success** → real query latency (e.g. ~1.5s cold).

### Local CLI env — Prisma does NOT load `.env.local` (S089 — verified)
Local `prisma` / `npm run db:push` fails even when Vercel works:
- **`Environment variable not found: DIRECT_URL`** — the Prisma CLI loads `.env`, **not** `.env.local` (Next.js loads `.env.local`; Prisma doesn't). Load the URL lines into the shell first, or use a dotenv wrapper.
- **`Cannot find module 'dotenv'`** — `node -e "require('dotenv')"` only works where `dotenv` is installed; don't assume it for ad-hoc scripts. PowerShell/bash can read `.env.local` directly instead.
- **`P1000 auth failed` locally while the live site is fine** — `.env.local`'s password **drifted** from the rotated one in Vercel. After a rotation, set the **same** final password in `.env.local` as in Vercel, or local CLI/dev breaks silently.
- **Structural fix (TODO):** make the app's `db:push` script auto-load `.env.local` so local migrations don't depend on remembering this.

### ⚠️ R4 tension — `.env.local` (Governor to reconcile)
R4 above says "no `.env.local`; credentials only in Vercel." In practice `.env.local` **is** used for
local dev and local `prisma db push`. The real rule (PL6 / PARK-S084-009): `.env.local` may exist, but
**no hook / auto-context-loader may READ its contents** — reading it was the original leak vector.
*Flag: R4's wording contradicts practice; reconcile in a future review.*

## Screenshot Archive

Screenshots saved at: `docs/plan/pillar-0-governance/external-integrations/screenshots/supabase/`
Next review: 2026-08-13

## Changelog

| Date | Session | Finding |
|---|---|---|
| 2026-05-13 | S028 | Gate 3 verified. R1-R8 documented from production deployment. |
| 2026-06-25 | S089 | Credential Rotation Runbook added (live-verified, PARK-S084-009). 6 pitfalls + db-health 503 interpretation + latency-layer diagnosis. Flagged R4 `.env.local` tension. |
