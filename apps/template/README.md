# CSPS App Template

**Fork this to build any new CSPS app.**

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

6. **Fork build gate (AP-005)**: Immediately after forking this template, run:
   `pnpm --filter @csps/[app-name] build`
   If `/_error: /404` or `/_error: /500` fail with a styled-jsx or React context error:
   - Confirm `next.config.js` has `config.resolve.dedupe = ['react', 'react-dom', 'react/jsx-runtime']` (already in this template)
   - Confirm `src/pages/_error.tsx` exists (already in this template)
   Both are pre-included in this template. If missing, copy from `apps/template/`.

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
