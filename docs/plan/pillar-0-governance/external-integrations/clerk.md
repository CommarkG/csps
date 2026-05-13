---
id: csps.external-integrations.clerk
name: clerk-integration-knowledge
description: >
  Clerk integration knowledge — auth, webhooks, JWT templates, tenant context,
  and local dev setup for CSPS. Mandatory read before any Clerk work.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: external_integrations
diataxis_type: reference
session: S028
last_verified: 2026-05-13
next_review: 2026-08-13
content_hash: S028-gate3-clerk
breaking_changes: https://clerk.com/changelog
credential_location: Vercel env vars — NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY
tags:
  - domain:infra
  - type:reference
  - audience:ai-agent
  - maturity:stable
---

# Clerk Integration Knowledge — CSPS

> **MANDATORY READ** before any Clerk configuration, webhook setup,
> JWT template changes, or auth debugging.

## Verified Working Configuration (S028)

### Required Environment Variables

| Variable | Where | Scope |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Vercel env vars | Public (client-side) |
| `CLERK_SECRET_KEY` | Vercel env vars | Secret (server-side only) |
| `CLERK_WEBHOOK_SECRET` | Vercel env vars | For webhook signature verification |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `apps/[app]/vercel.json` env block | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `apps/[app]/vercel.json` env block | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `apps/[app]/vercel.json` env block | `/dashboard` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `apps/[app]/vercel.json` env block | `/dashboard` |

### Required App Files

Every CSPS Next.js app using Clerk MUST have:
```
src/
├── middleware.ts              ← Clerk auth middleware
├── app/
│   ├── layout.tsx             ← ClerkProvider wrapper
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   │       └── page.tsx       ← <SignIn /> component
│   └── sign-up/
│       └── [[...sign-up]]/
│           └── page.tsx       ← <SignUp /> component
```

### layout.tsx pattern

```tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

### middleware.ts pattern (CSPS standard)

```ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect()
})

export const config = { matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|...)).*)', '/(api|trpc)(.*)'] }
```

## Critical Rules

### R1: Sign-in/sign-up pages MUST be created manually
Clerk's middleware redirects to `/sign-in` automatically but does NOT create
that page. A missing sign-in page renders as a blank white page with no error.
Always create `[[...sign-in]]/page.tsx` and `[[...sign-up]]/page.tsx`.

### R2: Webhooks do NOT fire to localhost
Clerk webhooks require a public HTTPS endpoint. In local dev, they never fire
to `localhost:3000`. Use ngrok/localtunnel for local webhook testing, or seed
the database manually and skip webhook-dependent flows in development.

### R3: Manual local dev setup (no webhooks)
For local dev: seed the DB directly + set `user.public_metadata.tenantId` in
Clerk Dashboard + configure JWT template to include tenantId in claims.
Sign out and sign in again after metadata changes. JWT caches for ~5 min.

### R4: tenantId in JWT claims via Clerk JWT Templates
CSPS uses multi-tenant isolation via `tenantId`. The JWT template in Clerk
must include:
```json
{ "tenantId": "{{user.public_metadata.tenantId}}" }
```
Configure: Clerk Dashboard → JWT Templates → create/edit template.

### R5: CspsSessionClaims type for server-side auth
```typescript
import type { CspsSessionClaims } from '@csps/integrations'
const { sessionClaims } = await auth()
const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
```
Always check `tenantId` exists before any DB query. Return 403 if missing.

### R6: Webhook signature verification with svix
```typescript
import { Webhook } from 'svix'
const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)
evt = wh.verify(body, { 'svix-id': ..., 'svix-timestamp': ..., 'svix-signature': ... })
```
Always verify. Never process unverified webhooks.

### R7: Development mode banner is expected
Clerk shows "Development mode" banner in local/preview deployments. This is
correct behavior. It disappears only in production Clerk instances.

### R8: ClerkProvider must wrap the entire app in layout.tsx
`ClerkProvider` must be in the ROOT layout (`src/app/layout.tsx`), not in
individual pages. Placing it anywhere else causes "useAuth called outside
ClerkProvider" errors.

## Clerk Dashboard Navigation (S028 verified)

```
Clerk Dashboard (dashboard.clerk.com)
└── [application]
    ├── API Keys → publishable key + secret key
    ├── Webhooks → add endpoint (HTTPS URL + events to listen)
    ├── JWT Templates → add tenantId claim
    └── Users → manage users / edit public_metadata
```

## CSPS Webhook Events to Subscribe

| Event | Handler | Purpose |
|---|---|---|
| `user.created` | `handleClerkWebhook` | Create User row |
| `user.deleted` | `handleClerkWebhook` | Soft-delete + anonymize PII |
| `organization.created` | `handleClerkWebhook` | Create Tenant row |
| `organization.deleted` | `handleClerkWebhook` | Cascade soft-delete |
| `organizationMembership.created` | `handleClerkWebhook` | Create UserTenant |
| `organizationMembership.updated` | `handleClerkWebhook` | Sync role |
| `organizationMembership.deleted` | `handleClerkWebhook` | Delete UserTenant |

## Deployment Checklist (copy for each new app)

- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` set in Vercel env vars
- [ ] `CLERK_SECRET_KEY` set in Vercel env vars
- [ ] `CLERK_WEBHOOK_SECRET` set in Vercel env vars
- [ ] Clerk URL env vars in `apps/[app]/vercel.json` env block
- [ ] `src/app/layout.tsx` has `<ClerkProvider>` wrapping everything
- [ ] `src/app/sign-in/[[...sign-in]]/page.tsx` exists with `<SignIn />`
- [ ] `src/app/sign-up/[[...sign-up]]/page.tsx` exists with `<SignUp />`
- [ ] `src/middleware.ts` exists with public route matcher
- [ ] Clerk Dashboard: webhook endpoint registered pointing to `/api/webhooks/clerk`
- [ ] Clerk Dashboard: JWT template includes `tenantId` claim
- [ ] Tested: sign-in renders (not blank page)

## Screenshot Archive

Screenshots saved at: `docs/plan/pillar-0-governance/external-integrations/screenshots/clerk/`
Next review: 2026-08-13

## Changelog

| Date | Session | Finding |
|---|---|---|
| 2026-05-13 | S028 | Gate 3 verified. R1-R8 documented. Sign-in blank page root cause (R1) discovered. |
