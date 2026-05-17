---
id: csps.pillar4.developer-journey.deployment
name: developer-deployment
description: "Stage 7 — Deployment. Vercel pipeline is pre-validated. Gate 3 process. What must be true before going live."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: OPER
diataxis_type: how-to
session: S039
pe_score: 80
links:
  - { rel: parent, href: ./README.md }
  - { rel: vercel-guide, href: ../../../../docs/plan/pillar-5-external-integrations/vercel.md }
tags:
  - domain:dx
  - domain:ops
  - type:how-to
  - audience:developer
  - maturity:stable
scope_level: S1
---

# Stage 7 — Deployment

**PE score: 80** — Pre-validated pipeline. Follow Gate 3 exactly.

---

## Gate 3 — The deployment checklist

The Budget Planner deployed through Gate 3. These rules are verified-in-production:

**Vercel project configuration:**
```
Root Directory: apps/[app-name]      (NOT the monorepo root)
Framework: Next.js
Include outside root: ENABLED        (required for workspace imports)
Output directory: leave blank        (Next.js default)
```

**Required environment variables in Vercel:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
DATABASE_URL                         (port 6543, pgbouncer=true, connection_limit=1)
DIRECT_URL                           (port 5432, no pgbouncer)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

**Optional (graceful passthrough when not set):**
```
SENTRY_DSN
POSTHOG_API_KEY
RESEND_API_KEY
INNGEST_SIGNING_KEY
UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
CLOUDFLARE_R2_*
STRIPE_SECRET_KEY
```

CSPS integrations check for their env var before running. If it's not set, they log a warning and return safely. The app works without them — just without those specific features.

---

## The deployment trigger

```bash
git push origin main
```

Vercel auto-deploys from the main branch. Every push triggers a new deployment. Preview deployments exist for every PR.

**Never deploy by hand.** Always push to Git. Let Vercel handle the rest.

---

## Post-deployment verification

After deployment, verify in this order:

1. **Auth works:** Sign up with a new email. See the Threshold (OnboardingWizard). Complete it. Reach the dashboard.

2. **Tenant isolation works:** Sign up with a second email. Confirm their data is separate from the first user's data.

3. **Security headers are set:** Check browser DevTools → Network → any request → Response Headers. Should see `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`.

4. **Core feature works:** Execute the `user_journey_test` from the primary PI item against the production URL.

5. **Error handling works:** Cause a 404 (visit a route that doesn't exist). Cause a 500 (if there's a test route that throws). Verify the app handles these gracefully.

---

## Governor actions required before full launch

These require the Governor because they involve credentials or account creation:

```
Service accounts (configure → paste keys into Vercel):
  Resend: resend.com → API Keys → Add key → RESEND_API_KEY
  PostHog: posthog.com → Project → API Keys → POSTHOG_API_KEY
  Sentry: sentry.io → Project → DSN → SENTRY_DSN
  Inngest: app.inngest.com → Event Keys → INNGEST_SIGNING_KEY
  Upstash: upstash.com → Redis → REST API → UPSTASH_REDIS_REST_URL + TOKEN
  Cloudflare R2: dash.cloudflare.com → R2 → Create bucket → Keys

Database schema:
  db:push from Codespaces (Governor action):
  prisma db push --schema=libs/policies/generated/schema.prisma
```

The app functions in graceful passthrough mode without these. Features that need them will silently skip. Full feature activation requires all keys.

---

## The deletion test (at any time)

Per P-ARCH-030 (apps are ephemeral trials):

> "If the apps/[name]/ directory was deleted right now, what platform value would be lost?"

If the answer is "the domain logic lives entirely in libs/ — the app just imports it" → good. The pattern is correct.

If the answer is "all the business logic is in the app — deleting it loses everything" → the extraction work has not been done. Business logic must migrate to libs/ as it matures.

This test is not a hypothetical. It is the mechanism that forces correct architecture. Run it mentally after every feature. Extract to libs/ when the test reveals the app has accumulated too much.
