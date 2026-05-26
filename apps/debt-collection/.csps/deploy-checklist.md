---
id: csps.apps.debt-collection.deploy-checklist
name: deploy-checklist
description: "7-step Vercel UI deploy sequence for apps/debt-collection. Converts 30-min debug session to 5-min paste-and-click."
type: deploy_docs
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: OPER
schema_anchor: deploy_docs
app: debt-collection
proto: PROTO-S062-DEPLOY-STEP3
---

# Debt Collection App — Vercel Deploy Checklist

**Target time: ~5 min** | **Source: Gate 3 verified config (session memory project_gate3_vercel_config)**

---

## Pre-Deploy Requirements

- [ ] GitHub repo connected to Vercel account
- [ ] All env vars from `apps/debt-collection/.env.local` ready to paste
- [ ] `ANTHROPIC_API_KEY` obtained from https://console.anthropic.com
- [ ] Supabase project created, DATABASE_URL + DIRECT_URL copied
- [ ] Clerk app created, publishable + secret keys ready

---

## 7-Step Vercel UI Sequence

### Step 1 — Import Repository
In Vercel dashboard: **Add New → Project → Import Git Repository**
Select: `CommarkG/csps` (or your fork)

### Step 2 — Set Root Directory
**Root Directory:** `apps/debt-collection`
⚠️ Critical: do NOT leave as `.` (root) — the monorepo has multiple apps

### Step 3 — Set Framework
**Framework Preset:** Next.js
(Vercel should auto-detect, but verify it's set)

### Step 4 — Enable Monorepo Source Files
**Include source files outside of Root Directory:** ✅ ENABLED
⚠️ Critical: without this, `libs/` imports fail at build time
Location: Build & Output Settings → expand "Root Directory" section

### Step 5 — Add Environment Variables
Paste ALL variables from `apps/template/.env.example`:

**Required (deploy fails without these):**
```
DATABASE_URL         # Supabase pooler port 6543 with ?pgbouncer=true&connection_limit=1
DIRECT_URL           # Supabase direct port 5432 (migrations)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CLERK_WEBHOOK_SECRET
ANTHROPIC_API_KEY    # Required for AI features
```

**Required Clerk redirects (set to production domain after deploy):**
```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

**Optional (add if features are used):**
```
STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET / STRIPE_TEAM_PRICE_ID
RESEND_API_KEY / RESEND_FROM_EMAIL
INNGEST_SIGNING_KEY / INNGEST_EVENT_KEY
SENTRY_DSN / POSTHOG_API_KEY / POSTHOG_HOST
CLOUDFLARE_R2_* (if file uploads needed)
```

### Step 6 — Deploy
Click **Deploy**. First build takes ~3-4 min.

**Expected build output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
Route (app)  Size  First Load JS
...
```

### Step 7 — Post-Deploy Configuration

After deploy succeeds, get your Vercel URL (e.g., `https://debt-collection-xyz.vercel.app`):

**a. Clerk webhook:**
→ Clerk dashboard → Webhooks → Add endpoint
→ URL: `https://your-vercel-url.vercel.app/api/webhooks/clerk`
→ Events: all (or minimum: user.created, user.updated, organization.*)

**b. Clerk production keys:**
→ Switch from test keys (`pk_test_`) to production keys when ready
→ Update NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY + CLERK_SECRET_KEY in Vercel env

**c. Stripe webhook (if billing active):**
→ Stripe dashboard → Webhooks → Add endpoint
→ URL: `https://your-vercel-url.vercel.app/api/webhooks/stripe`

**d. Custom domain (optional):**
→ Vercel → Project Settings → Domains → Add domain

---

## Common Failure Modes

| Error | Cause | Fix |
|---|---|---|
| `Module not found: @csps/...` | "Include source files outside Root Directory" disabled | Enable in Step 4 |
| `prepared statement s0 already exists` | DATABASE_URL missing `?pgbouncer=true&connection_limit=1` | Add pgbouncer params |
| `Error: ANTHROPIC_API_KEY is not defined` | Missing env var | Add in Vercel env settings |
| Clerk 401 on webhook | Wrong CLERK_WEBHOOK_SECRET | Re-copy from Clerk webhook endpoint |
| Build fails on type errors | Run `pnpm typecheck` locally first | Fix types locally, push |

---

## No-outputDirectory Override

Do NOT set `outputDirectory` in Vercel settings — Next.js manages this automatically.
Setting it manually causes deployment failures.
