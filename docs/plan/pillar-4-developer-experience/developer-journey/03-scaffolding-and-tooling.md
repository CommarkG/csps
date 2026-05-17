---
id: csps.pillar4.developer-journey.scaffolding
name: developer-scaffolding
description: "Stage 3 — Scaffolding and tooling. CSPS provides pnpm create:app, the full validator suite, and platform primitives. The developer starts with 70% already built."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
diataxis_type: how-to
session: S039
pe_score: 80
links:
  - { rel: parent, href: ./README.md }
  - { rel: create-app, href: ../../../../scripts/create-app.sh }
tags:
  - domain:dx
  - type:how-to
  - audience:developer
  - maturity:stable
scope_level: S1
---

# Stage 3 — Scaffolding and Tooling

**PE score: 80** — High return on low effort. The scaffold is already built. Use it.

---

## The starting point advantage

A developer joining CSPS starts with:
- 127 validators running on every commit
- Auth, multi-tenancy, security, rate-limiting, error capture — all pre-wired
- 5 UI shells (DashboardShell, SettingsLayout, FeatureGateOverlay, OnboardingWizard, DataTable)
- Deployment pipeline configured and tested
- A working example app (Budget Planner) to reference

The time from "I have a ratified plan" to "I have a running skeleton with auth" is one command.

---

## The scaffold command

```bash
pnpm create:app [name]
```

Produces in `apps/[name]/`:
```
src/
  app/
    (dashboard)/        Next.js route group for protected pages
    account-setup/      OnboardingWizard flow (pre-wired)
    sign-in/            Clerk auth (pre-wired)
    sign-up/            Clerk auth (pre-wired)
    api/
      auth/session-ready/   JWT refresh polling (pre-wired)
  lib/
    db.ts               Raw Prisma client
    zenstack.ts         Enhanced DB with RLS
  middleware.ts         Clerk auth middleware (pre-wired)
layout.tsx              ClerkProvider root (pre-wired)
page.tsx                Root redirect → /dashboard
```

Everything in this scaffold is pre-tested, pre-validated, and compiles without errors. The developer's first commit is a running app.

---

## The platform primitives (already wired)

The developer does not write these. They inherit them:

**Auth:** `auth()` from Clerk in server components. `useUser()` in client components. `middleware.ts` protects all routes. Every new route is protected by default.

**Database access (enhanced):**
```typescript
const edb = getEnhancedDb({ id: cspsUser.id, tenantId, staffRole: cspsUser.staffRole })
// All edb queries are tenant-scoped by ZenStack RLS — cannot cross tenant boundaries
```

**UI shells:**
```typescript
import { DashboardShell } from '@csps/components'
// Wraps pages with navigation, layout, and consistent shell
```

**Threshold Gate:**
```typescript
// account-setup/page.tsx — pre-built
// Phase 1: poll until tenantId ready
// Phase 2: OnboardingWizard if archetype not set
// Phase 3: redirect to /dashboard
```

**Security (automatic):**
```typescript
import { securityHeaders } from '@csps/integrations/security/headers'
// Applied to next.config.js — CSP, HSTS, X-Frame-Options on every response
```

---

## The tooling suite

**For creating artifacts:**
```bash
pnpm create:pi --title "Add transaction form" --spine ARCH --pe 75
# Creates PI-NNN-add-transaction-form.yaml with proper schema

pnpm create:app [name]
# Creates full app scaffold

pnpm sync:dna --dry-run
# Shows which new principles/moats haven't been synced to universal-governance
```

**For validation:**
```bash
node tools/verify.mjs
# Runs all 127 validators — exits 0 if clean

node tools/validators/validate-wiring-completeness.mjs
# Shows WIRED/DEFERRED/ORPHAN for all exports

node tools/validators/validate-ui-completeness.mjs
# Checks new page files for empty onClick, dead links, missing onSubmit

node tools/validators/validate-new-file-dna.mjs
# Checks new libs/ files for @csps-enforces annotation
```

**For understanding the platform:**
```bash
# Read in this order:
tools/council/platform-state-snapshot.md   # Current platform reality
docs/plan/pillar-0-governance/meta-platform/README.md   # Platform governance layer
apps/budget-planner/src/app/page.tsx       # Working example dashboard
```

---

## The developer's first hour

After `pnpm create:app [name]`:

1. Run `pnpm install --frozen-lockfile` in the new app directory
2. Copy `.env.platform.example` to `.env.platform` and fill credentials
3. Run `node tools/verify.mjs` — should pass immediately on the fresh scaffold
4. Open `apps/[name]/src/app/page.tsx` — this is where the dashboard will live
5. Read the planning grid output from Stage 2 — this is what to build next

The developer should see a working sign-in page at `localhost:3000` within 15 minutes of starting.
