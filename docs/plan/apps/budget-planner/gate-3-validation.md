---
id: csps.apps.budget-planner.gate-3-validation
name: gate-3-validation
description: >
  Budget Planner Gate 3 — Live validation via Vercel deployment from platform root.
  scope_level: S1 (Platform-wide deployment, root = repo root, NOT app subdirectory).
  Credentials live in Vercel env vars (never .env.local). Zero laptop dependency.
version: 2.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: platform_plans
diataxis_type: how-to
session: S028
scope_level: S1
tags:
  - domain:architecture
  - type:reference
  - audience:developer
  - maturity:stable
links:
  - { rel: vercel-json, href: ../../../../vercel.json }
  - { rel: env-platform, href: ../../../../.env.platform.example }
  - { rel: sync-script, href: ../../../../tools/scripts/sync-vercel-env.mjs }
---

# Budget Planner Gate 3 — Vercel Deployment

> **ARCHITECTURE NOTE:** The Vercel project Root Directory MUST be `.` (the csps repo root).
> NOT `apps/budget-planner` — that creates an S2 entry point for an S1 deployment.
> The PLATFORM controls the build. The app is a build target within the platform.

---

## Step 1 — Vercel Dashboard Configuration

You are already on the Vercel "New Project" screen with `csps` repo selected.

**Change these fields:**

| Field | Wrong value | Correct value |
|---|---|---|
| Root Directory | `apps/budget-planner` | `.` (just a dot = repo root) |
| Build Command | (auto) | `pnpm --filter budget-planner build` |
| Output Directory | (auto) | `apps/budget-planner/.next` |
| Install Command | (auto) | `pnpm install` |

To change Root Directory: click **"Edit"** next to the field → clear it → type `.` → confirm.

To change Build/Output: click **"Build and Output Settings"** (collapsible section) → enable Override → fill values.

---

## Step 2 — Add Environment Variables

Click **"Environment Variables"** section → expand it → add these 4:

**Where to find them** (open these URLs in another tab):

**Supabase** (https://supabase.com/dashboard → your project → Settings → Database):
- `DATABASE_URL` → Connection pooling section → Transaction mode string (contains `:6543`)
- `DIRECT_URL` → Direct connection section (contains `:5432`)

**Clerk** (https://dashboard.clerk.com → your app → API Keys):
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` → copy Publishable key (`pk_test_...`)
- `CLERK_SECRET_KEY` → reveal + copy Secret key (`sk_test_...`)

Add each: type the key name → paste the value → click "Add".

---

## Step 3 — Deploy

Click **Deploy** button.

Wait 2-3 minutes. Vercel prints a URL like `https://csps-budget-planner.vercel.app`.

---

## Step 4 — Gate 3 Tests (run against the Vercel URL)

### Test 1: Sign-up flow
1. Open the Vercel URL
2. Click Sign Up → create a new account
3. Run the budget wizard (5 steps)
4. Create a category + transaction
5. Verify balance shows correctly

### Test 2: Tenant isolation
1. Open an incognito window
2. Sign up as a second user
3. Verify second user sees ZERO data from first user

### Test 3: GDPR erasure
```bash
curl -X DELETE https://csps-budget-planner.vercel.app/api/settings/account \
  -H "Authorization: Bearer <clerk-token>"
# Should return 200
```

---

## Gate 3 Results

**Date:** ___________________

| Check | Result |
|---|---|
| Cold start (sign-up loads) | ☐ PASS / ☐ FAIL |
| Wizard completion | ☐ PASS / ☐ FAIL |
| Tenant isolation | ☐ PASS / ☐ FAIL |
| GDPR erasure | ☐ PASS / ☐ FAIL |

**Gate 3 status:** ☐ PASS / ☐ FAIL

*Version 2.0 — corrected Root Directory to `.` (S1 scope). S028.*
