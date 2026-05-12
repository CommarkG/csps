---
id: csps.apps.budget-planner.gate-3-validation
name: gate-3-validation
description: >
  Budget Planner App #2 Gate 3 — Live validation procedure and results.
  Gate 3 = real Supabase/Clerk/Stripe cold-start test. Proves Layer 1-4
  infrastructure actually works end-to-end with real credentials.
  Governor runs this test; AI documents results.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: platform_plans
diataxis_type: how-to
session: S027
impl_status: gate-3-pending-governor-execution
tags:
  - domain:architecture
  - type:reference
  - audience:developer
  - maturity:draft
links:
  - { rel: app, href: ../../../../apps/budget-planner/ }
  - { rel: env-example, href: ../../../../apps/budget-planner/.env.example }
  - { rel: bottleneck-validator, href: ../../../../tools/validators/validate-bottleneck-patterns.mjs }
---

# Budget Planner Gate 3 — Live Validation Procedure

> **Status: PENDING GOVERNOR EXECUTION**
> Gate 3 requires real Supabase/Clerk/Stripe credentials.
> AI prepares the procedure; Governor runs it and records results here.

---

## Pre-flight Checklist

Before running Gate 3, confirm:

- [ ] `.env.local` created from `.env.example` with real values
- [ ] Supabase project accessible (database URL working)
- [ ] Clerk application configured with JWT template
- [ ] At least 1 test user account created in Clerk
- [ ] `pnpm install` completed without errors

---

## Environment Setup

```bash
# 1. Copy environment template
cp apps/budget-planner/.env.example apps/budget-planner/.env.local

# 2. Fill in these values from dashboards:
#    DATABASE_URL: Supabase → Settings → Database → Connection pooling → Transaction mode
#                 Port 6543 MUST have ?pgbouncer=true&connection_limit=1
#    DIRECT_URL:   Supabase → Settings → Database → Connection string → URI (port 5432)
#    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: Clerk dashboard → API Keys
#    CLERK_SECRET_KEY: Clerk dashboard → API Keys

# 3. Run database migration
cd apps/budget-planner
pnpm prisma db push
```

---

## Gate 3 Test Procedure

### Step 1: Cold start

```bash
cd apps/budget-planner
pnpm dev
# Wait for: "ready started server on 0.0.0.0:3000"
```

### Step 2: Happy path (test as User A)

1. Open `http://localhost:3000`
2. Sign up as a NEW account (not existing)
3. Run the budget wizard (5 steps):
   - Step 1: Income
   - Step 2: Fixed expenses
   - Step 3: Variable expenses
   - Step 4: Savings goals
   - Step 5: Review + activate
4. Create a budget category
5. Create a transaction
6. View the balance dashboard

**Pass criteria:**
- [ ] Wizard completes without errors
- [ ] Category appears in dashboard
- [ ] Transaction is reflected in balance
- [ ] All API calls return 200 (check browser devtools Network tab)

### Step 3: Tenant isolation test (critical)

1. Open an incognito window
2. Sign up as User B (different email)
3. Run wizard and create different data
4. Verify: User A and User B see completely different data

**Pass criteria:**
- [ ] User A's data is NOT visible to User B
- [ ] No cross-tenant data leakage in Network requests

### Step 4: GDPR erasure endpoint

```bash
# In User A's session, call the erasure endpoint:
curl -X DELETE http://localhost:3000/api/settings/account \
  -H "Authorization: Bearer <user-a-clerk-token>"
```

**Pass criteria:**
- [ ] Returns 200
- [ ] User A's data is removed from database
- [ ] User B's data is unaffected

### Step 5: Subscription gate check (optional — requires Stripe setup)

If Stripe configured:
- [ ] Free tier: budget categories limited per free_tier_limit
- [ ] Pro tier: no limits
- [ ] Upgrade flow accessible

---

## N+1 Query Advisory

`validate-bottleneck-patterns.mjs` found **8 live N+1 patterns** in Budget Planner API routes.
Every API handler does: `findUnique(clerkId)` + `getEnhancedDb()` in sequence.

**Current behavior:** 2 DB queries per request (auth lookup + enhanced DB)
**At scale:** 100 req/s × 30 apps = 3,000 extra DB queries/second

**Deferred fix (Layer 5 — after Gate 3 passes):**
The session-claim pattern caches `tenantId` in the Clerk JWT claim, eliminating the auth lookup.
Implementation: `libs/auth/session-claim.ts` → configure in Clerk JWT template.

---

## Gate 3 Results

> **To be filled by Governor after running the test**

**Test date:** ___________________

**Tester:** ___________________

| Check | Result | Notes |
|---|---|---|
| Cold start | ☐ PASS / ☐ FAIL | |
| Wizard completion | ☐ PASS / ☐ FAIL | |
| Tenant isolation | ☐ PASS / ☐ FAIL | |
| GDPR erasure | ☐ PASS / ☐ FAIL | |
| Console errors | ☐ NONE / ☐ ERRORS | |
| API 200s | ☐ ALL / ☐ SOME FAIL | |

**Gate 3 status:** ☐ PASS / ☐ FAIL

**Blockers found (if any):**
- 

**Next steps:**
- If PASS: Layer 5 work (N+1 session-claim fix) can begin
- If FAIL: document errors above, create VLT for each blocker

---

*Gate 3 procedure authored S027 | Awaiting Governor execution*
