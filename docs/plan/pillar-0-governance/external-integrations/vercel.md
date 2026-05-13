---
id: csps.external-integrations.vercel
name: vercel-integration-knowledge
description: >
  Vercel integration knowledge — deployment patterns, gotchas, and
  solutions for CSPS pnpm monorepo Next.js apps. Mandatory read before
  any Vercel configuration work.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: external_integrations
diataxis_type: reference
session: S028
last_verified: 2026-05-13
content_hash: S028-gate3-complete
tags:
  - domain:infra
  - type:reference
  - audience:ai-agent
  - maturity:stable
---

# Vercel Integration Knowledge — CSPS

> **MANDATORY READ** before any Vercel configuration, deployment setup,
> or debugging. Enforced by pre-tool-use-external-integration-gate.sh.

## Architecture: How CSPS deploys to Vercel

Each CSPS app gets its own Vercel **project** linked to the same GitHub repo.
There is no single "platform deployment" — Vercel is per-app by design.

```
GitHub repo: CommarkG/csps
  └── apps/budget-planner/   ← Vercel project: csps-budget-planner
  └── apps/task-manager/     ← Vercel project: csps-task-manager (future)
  └── apps/[next-app]/       ← Vercel project: csps-[next-app] (future)
```

## Verified Working Configuration (S028 Gate 3)

### Vercel Dashboard Settings (Build and Deployment)

| Setting | Value | Why |
|---|---|---|
| Framework Preset | **Next.js** | Required for serverless routing |
| Root Directory | **apps/[app-name]** | Vercel Next.js runtime needs app at root |
| Build Command | `pnpm --filter [app-name] build` | pnpm workspace filter from any dir |
| Output Directory | `.next` | Relative to Root Directory |
| Install Command | `pnpm install` | Runs from REPO ROOT automatically |
| Include files outside root | **Enabled** | Gives build access to libs/, packages/ |

### vercel.json (inside apps/[app-name]/)

```json
{
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_CLERK_SIGN_IN_URL": "/sign-in",
    "NEXT_PUBLIC_CLERK_SIGN_UP_URL": "/sign-up",
    "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL": "/dashboard",
    "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL": "/dashboard"
  },
  "regions": ["iad1"]
}
```

### Root-level vercel.json (repo root)

```json
{
  "framework": "nextjs"
}
```

## Critical Rules — Learned in S028

### R1: Root Directory = app folder, NOT repo root
Vercel's Next.js runtime expects `.next/` at the Root Directory level.
Setting Root Directory to `.` (repo root) with a custom outputDirectory
does NOT work — Vercel's routing layer 404s even when build succeeds.

### R2: framework:null kills routing
`"framework": null` tells Vercel "serve as static files." Next.js apps
MUST use `"framework": "nextjs"` to get serverless function routing.

### R3: No comments in vercel.json
Vercel schema validation rejects ANY unknown property (`_comment`, `_scope`,
`_scope_comment`). These cause silent build failures with "should NOT have
additional property" errors. No comments. Ever.

### R4: Install command runs from repo root for pnpm workspaces
Even with Root Directory = `apps/budget-planner`, Vercel runs `pnpm install`
from the repo root when "Include files outside root" is Enabled. This installs
all workspace dependencies including libs/, packages/.

### R5: outputDirectory is relative to Root Directory
If Root Directory = `apps/budget-planner`, outputDirectory = `.next` (not
`apps/budget-planner/.next`). The path is always relative to Root Directory.

### R6: ignoreCommand only checks its specified path
`"ignoreCommand": "git diff --quiet HEAD^ HEAD -- apps/budget-planner/"` will
SKIP deployment when only libs/ or root config files change. This blocks
platform-level fixes from deploying. Remove ignoreCommand or widen scope.

### R7: Prisma generator output must be default (no custom output)
`output = "./generated/client"` in schema.zmodel sends generated types to
a custom location. `@prisma/client` in all apps then gets the UNTYPED stub,
causing cascade implicit-any TypeScript errors. NEVER add custom output.

### R8: @csps/integrations needs a package.json
Shared libs used by apps (like `libs/integrations/`) must have a `package.json`
with `"name": "@csps/integrations"` to be valid pnpm workspace packages.
Without it, `Module not found: Can't resolve '@csps/integrations'` at build.

### R9: transpilePackages + symlinks:false for workspace TypeScript libs
In apps/[app]/next.config.js:
```js
transpilePackages: ['@csps/integrations'],
webpack: (config) => {
  config.resolve.symlinks = false  // resolves relative imports from original path
  return config
}
```

### R10: Sign-in/sign-up pages must be created explicitly
Clerk middleware redirects to `/sign-in` but Clerk does NOT auto-create
that page. Requires:
- `src/app/sign-in/[[...sign-in]]/page.tsx` with `<SignIn />`
- `src/app/sign-up/[[...sign-up]]/page.tsx` with `<SignUp />`

## Required Environment Variables (per app in Vercel dashboard)

| Variable | Where to get |
|---|---|
| `DATABASE_URL` | Supabase → Settings → Database → Connection string (port 6543) + `?pgbouncer=true&connection_limit=1` |
| `DIRECT_URL` | Supabase → Settings → Database → Connection string (port 5432) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk → API Keys |
| `CLERK_SECRET_KEY` | Clerk → API Keys |

## Vercel URL Anatomy

Each project gets 3 URL types:
1. `{project}.vercel.app` — **Production URL** (use this)
2. `{project}-git-main-{team}.vercel.app` — Branch alias (same app)
3. `{project}-{hash}-{team}.vercel.app` — Per-deployment URL (same app)

Only use the first one as the canonical URL.

## Deployment Checklist (copy for each new app)

- [ ] Create Vercel project linked to CommarkG/csps
- [ ] Set Root Directory to `apps/[app-name]` in Build and Deployment settings
- [ ] Set Framework Preset to Next.js
- [ ] Set Build Command: `pnpm --filter [app-name] build`
- [ ] Set Output Directory: `.next`
- [ ] Enable "Include files outside root directory"
- [ ] Add all required env vars (DATABASE_URL, DIRECT_URL, CLERK keys)
- [ ] Verify `apps/[app-name]/vercel.json` has NO `_comment` or unknown fields
- [ ] Verify `apps/[app-name]/src/app/sign-in/[[...sign-in]]/page.tsx` exists
- [ ] Verify `apps/[app-name]/src/app/sign-up/[[...sign-up]]/page.tsx` exists

## Screenshot Archive

Screenshots saved at: `docs/plan/pillar-0-governance/external-integrations/screenshots/vercel/`
Next review: 2026-08-13 (3 months)

## Changelog

| Date | Session | Finding |
|---|---|---|
| 2026-05-13 | S028 | Gate 3 complete. All R1-R10 rules discovered. |
