---
id: csps.apps.budget-planner.readme
name: budget-planner-readme
description: Budget Planner App #2 — personal finance tracking. Proves Gate 3 Foundry Ready. Forked from apps/template/. Domain personal.finance.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: apps
domain_path: personal.budget
tags:
  - domain:platform
  - type:doc
  - audience:developer
  - maturity:draft
session: S025
impl_status: swift-implemented
links:
  - { rel: topic-plan, href: ../../docs/plan/_handoff/VAULT/topic-plans/budget-planner-app2.md }
  - { rel: wizard-template, href: ../../libs/config/routing.config.ts }
  - { rel: forked-from, href: ../template/README.md }
scope_level: S2
---

# Budget Planner — CSPS App #2

**Domain:** Personal finance tracking | **Threshold route:** `personal.finance`
**PE score:** 82 (Band 2-HIGH) | **Goal:** Prove Gate 3 Foundry Ready
**Topic plan:** [budget-planner-app2.md](../../docs/plan/_handoff/VAULT/topic-plans/budget-planner-app2.md)

**Intent (Governor-authored S024):** "A Budget Planner where users track income and expenses,
see their balance, and manage their personal financial data — built entirely on CSPS platform
inheritance without modifying the foundation code."

**Failure signal:** Foundation changed for this app OR cross-tenant data access possible
OR Threshold Wizard bypassable.

---

**Forked from apps/template — do not modify the above inheritance. Add only domain entities.**

## Quick Start (5 minutes)

## Quick Start (5 minutes)

```bash
# 1. Copy to your app directory
cp -r apps/template apps/your-app-name

# 2. Set your credentials
cp apps/your-app-name/.env.example apps/your-app-name/.env.local
# Fill in: DATABASE_URL (with ?pgbouncer=true), DIRECT_URL, CLERK keys

# 3. Push schema to your database
cd apps/your-app-name
pnpm exec prisma db push

# 4. Start the server
pnpm dev
```

## What You Inherit (from CSPS core)

✅ Multi-tenant isolation (ZenStack ORM + Postgres RLS)
✅ Clerk auth (JWT with tenantId + role claims)
✅ Stripe billing (subscription lifecycle, seat limits, trial)
✅ Webhook handling (all Clerk + Stripe events, idempotent)
✅ GDPR erasure (eraseUser() API endpoint)
✅ AuditEvent log (immutable, all mutations tracked)
✅ Standard error format (CspsError { error, message, details? })
✅ Role-based permissions (hasPermission() from @csps/config)
✅ Subscription enforcement (requireWriteSubscription())

## 5 Critical Patterns (MUST know)

1. **Tenant isolation**: Every query MUST filter by tenantId from JWT — never from request body.
   Read from `(sessionClaims as CspsSessionClaims).tenantId`. Never trust client-provided tenantId.

2. **Auth setup**: Clerk requires manual config after deploy:
   - JWT template: `{"tenantId": "{{user.public_metadata.tenantId}}", "role": "{{org.membership.role}}"}`
   - Webhook URL: `/api/webhooks/clerk` in Clerk dashboard
   - DATABASE_URL: must include `?pgbouncer=true&connection_limit=1` for port 6543

3. **Database**: Two URLs required in .env.local:
   - `DATABASE_URL`: Supabase pooler (port 6543) + `?pgbouncer=true&connection_limit=1`
   - `DIRECT_URL`: Supabase direct (port 5432) — for migrations only

4. **Webhooks**: All handlers are idempotent — duplicate delivery is safe.
   Use `withIdempotency(key, tenantId, db, handler)` from `@csps/integrations`.

5. **ZF discipline**: Before declaring any feature done:
   `pnpm verify` (61 validators) + `node tools/zf-orchestrator.mjs --level 3`
   Both must pass. Create session extraction note.

## solo_user_flow policy (declare in webhook route)

Every CSPS app must declare its solo user flow:
- `auto_org`: platform auto-creates personal org on user.created (best for solo apps)
- `manual`: user creates org in Clerk dashboard (for team-only apps)
- `not_applicable`: app doesn't use the tenant model

Add to `src/app/api/webhooks/clerk/route.ts`:
```typescript
// solo_user_flow: auto_org | manual | not_applicable
```

## Schema Extension

Add your domain entities to `libs/policies/schema.zmodel`:
```
model YourEntity extends Base {
  tenantId String
  // ... your fields
  
  tenant Tenant @relation(fields: [tenantId], references: [id])
  
  @@schema("public")
  @@allow("read", auth().tenantId == tenantId)
  @@allow("create", auth().tenantId == tenantId)
  @@allow("update", auth().tenantId == tenantId)
  @@deny("delete", true)  // soft-delete only
}
```

Then run: `zenstack generate --schema libs/policies/schema.zmodel && pnpm db:push`

## Graduation ($1K MRR)

When your app hits $1K MRR:
1. Governor declares graduation
2. Extract: Project/Task/your-domain entities to standalone app
3. Inherit: User/Tenant/UserTenant/AuditEvent from @csps/foundation npm package
4. Deploy standalone with own Supabase + Clerk + Stripe accounts
