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

## Zero-Laptop Setup (B_ZERO_LAPTOP_DEPENDENCY — P-OPER-001)

> **CRITICAL:** CSPS has zero dependency on local computers.
> Gate 3 runs against a **Vercel deployment**, NOT a local `pnpm dev` server.
> Secrets live in **Vercel environment variables**, NOT in `.env.local` files.
> `.env.local` = laptop dependency = violation of platform architecture.

### Step A — Connect to Vercel

```bash
# Install Vercel CLI if needed (one-time)
npm i -g vercel

# From the project root — link budget-planner to Vercel
cd apps/budget-planner
vercel link
# Choose: existing project OR create new project named "csps-budget-planner"
```

### Step B — Add secrets to Vercel (not .env.local)

```bash
# Add each secret to Vercel — runs from apps/budget-planner/
vercel env add DATABASE_URL
# Paste: postgresql://postgres.[ref]:[password]@...6543...?pgbouncer=true&connection_limit=1

vercel env add DIRECT_URL
# Paste: postgresql://postgres.[ref]:[password]@...5432...

vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# Paste: pk_test_...

vercel env add CLERK_SECRET_KEY
# Paste: sk_test_...
```

### Step C — Run database migration via Vercel

```bash
# Pull env vars from Vercel (temporary, for migration only — does NOT create .env.local)
vercel env pull .env.migration --yes
DATABASE_URL=$(grep DATABASE_URL .env.migration | cut -d= -f2-) npx prisma db push
rm .env.migration
```

### Step D — Deploy to Vercel

```bash
vercel --prod
# Output: https://csps-budget-planner.vercel.app (or similar)
# This is the URL Gate 3 tests run against
```

---

## Gate 3 Test Procedure

### Step 1: Confirm deployment is live

After `vercel --prod`, you get a URL like `https://csps-budget-planner.vercel.app`.
Confirm it loads (should show sign-in page).

### Step 2: Happy path (test as User A)

1. Open `https://csps-budget-planner.vercel.app` (or your Vercel URL)
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
# Against the Vercel deployment:
curl -X DELETE https://csps-budget-planner.vercel.app/api/settings/account \
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
