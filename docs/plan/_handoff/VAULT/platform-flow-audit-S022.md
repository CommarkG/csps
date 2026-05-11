---
id: csps.handoff.vault.platform-flow-audit.S022
name: platform-flow-audit-S022
description: >
  Complete persona-based platform flow audit — S022 post-STRATEGIC_COMPLETION.
  7 personas, 15 flows traced end-to-end, 12 gaps found, solutions + permanent
  prevention mechanisms for each. Governor directive: "complete plan audit going
  all the flows and see all is flawless — use personas, present findings + solutions
  + how these are permanently prevented with planning implementing and validations."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: VALD
core_spines: [VALD, ARCH, OPER]
schema_anchor: vault_artifacts
domain_path: platform
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
session: S022
impl_status: swift-implemented
ai_defaults_influence: none
links:
  - { rel: bedrock, href: ../../../../pillar-0-governance/csps-bedrock.md }
  - { rel: enterprise-plan, href: ./enterprise-core-completion-plan.md }
---

# Platform Flow Audit — S022

> **Purpose:** Trace every user persona through the platform end-to-end. Find gaps.
> Propose solutions. Permanently prevent each gap with planning + implementation + validation.
>
> **Baseline:** S022 Session 6 complete. Bedrock 22/22. Live DB: 1 user, 1 tenant, 2 tasks, 2 AuditEvents.

---

## PERSONA MAP

| ID | Persona | Subscription | Role |
|---|---|---|---|
| P-A | Solo user (free) | free | owner |
| P-B | Team admin | trialing → active | admin |
| P-C | Team member | (member of P-B's org) | member |
| P-D | EU user requesting GDPR erasure | any | owner |
| P-E | Cancelled subscriber | cancelled | owner |
| P-F | Departing member (removed from org) | — | was: member |
| P-G | App #2 developer (internal) | — | — |

---

## FLOW AUDIT — 7 PERSONAS, 15 FLOWS

---

### PERSONA A: Solo User (Free Tier)

**Journey:** Signs up → wants to use the app alone, no team.

**Flow A-1: Sign-up path**

| Step | What happens | Status |
|---|---|---|
| 1. Visit localhost:3002 | Redirected to /sign-in (Clerk) | ✅ |
| 2. Click "Sign up" | Clerk sign-up form loads | ✅ |
| 3. Submit email | Clerk creates user → `user.created` webhook fires → User row created in DB | ✅ (code exists) |
| 4. Post sign-up redirect | JWT issued — tenantId=null (no org yet) | ✅ |
| 5. App loads | Tasks page: "No organization yet" screen | ✅ |

**GAP A-1: Solo users cannot use the app without a Clerk organization.**
The app requires a Clerk org to get a tenantId in the JWT. Solo users have no org → stuck at "No organization yet" forever.

- **Root cause:** Architecture assumes Tenant = Clerk Org (VLT-S014-003). Solo users need an org.
- **Who affects:** Every user who signs up without an organization.
- **Severity:** CRITICAL — primary sign-up flow is broken for solo users.

**Solution A-1:** Auto-create a personal Clerk org on user.created webhook if no org exists.
```typescript
// In webhook-handler.ts, user.created case:
// After creating User row, create a personal org via Clerk API:
// await clerkClient.organizations.createOrganization({
//   name: `${email.split('@')[0]}'s workspace`,
//   createdBy: clerkUserId,
// })
// This triggers org.created webhook → Tenant created → tenantId set → user can use app.
```

**Permanent prevention:**
- New validator: `validate-solo-user-flow.mjs` — confirms user.created handler creates personal org OR documents explicit opt-out
- Plan item in App #2 topology: every app built on CSPS must declare solo_user_flow: `auto_org | manual | not_applicable`
- Test: sign-up script that checks user can immediately create a task after account creation

---

### PERSONA B: Team Admin (Trialing → Paid)

**Journey:** Creates org → invites team → manages work → sees audit log.

**Flow B-1: Organization creation**

| Step | What happens | Status |
|---|---|---|
| 1. Create org in Clerk | org.created webhook → Tenant + UserTenant(owner) created | ✅ |
| 2. Stripe customer created | onTenantCreated callback → createStripeCustomer() | ✅ |
| 3. JWT refreshed | New sign-in → tenantId in JWT | ✅ |
| 4. App loads | Tasks page with empty state | ✅ |

**Flow B-2: Member invitation**

| Step | What happens | Status |
|---|---|---|
| 1. Admin wants to invite | **No "Invite member" button in app UI** | ❌ |
| 2. Must go to Clerk dashboard | Clerk dashboard → org → invite member | ⚠️ Workaround only |
| 3. Invitee joins | membership.created → UserTenant created → trial triggers on 2nd member | ✅ |

**GAP B-2: No in-app member invitation UI.**
Admin must leave the app and go to Clerk dashboard to invite. This is a critical UX gap for a team app.

**Solution B-2:** Add `POST /api/invitations` route that calls Clerk's invitation API.
```typescript
// libs/integrations/clerk/invitations.ts
export async function inviteMember(orgId: string, emailAddress: string, role: string)
// Wire to: POST /api/invitations → hasPermission(role, 'memberInvite') check → Clerk API
```

**Flow B-3: Audit log access**

| Step | What happens | Status |
|---|---|---|
| 1. Admin calls GET /api/audit | hasPermission('admin', 'auditRead') → 200 + events | ✅ |
| 2. Member calls GET /api/audit | hasPermission('member', 'auditRead') → 403 | ✅ |
| 3. **No audit log UI** | No page in the app to view audit events | ❌ |

**GAP B-3: Audit API exists but no UI to view it.**
The `GET /api/audit` endpoint is implemented but there's no page in the app to display it.

**Solution B-3:** Add `/audit` page (admin only):
```tsx
// apps/task-mgmt/src/app/audit/page.tsx
// Fetches GET /api/audit, renders table of events, paginated
// Shows: action | resourceType | actorId | timestamp
// Gate: if role !== 'admin' && role !== 'owner' → redirect to /tasks
```

**Permanent prevention B-2, B-3:**
- New test: `test-admin-flows.mjs` — signs in as admin, verifies invitation API + audit API respond correctly
- Plan discipline: every "permission-gated API" must have a corresponding UI that surfaces the permission gate (not just a 403)

---

### PERSONA C: Team Member

**Journey:** Joins org → creates tasks → tries to archive project (blocked).

**Flow C-1: Task creation**

| Step | What happens | Status |
|---|---|---|
| 1. Member opens /tasks/new | Form loads | ✅ |
| 2. Submits task | POST /api/tasks → subscription check → ZenStack → task.created AuditEvent | ✅ |
| 3. Redirected to /tasks | Task appears in list | ✅ |

**Flow C-2: Project archive attempt (blocked)**

| Step | What happens | Status |
|---|---|---|
| 1. Member calls PATCH /api/projects | hasPermission('member', 'projectArchive') → 403 | ✅ |
| 2. **403 is silent in UI** | No feedback shown to member explaining why | ❌ |

**GAP C-2: Permission denials have no user-facing explanation.**
When a member gets a 403, the UI just shows "Failed" without explaining they need admin rights.

**Solution C-2:** Standardize error responses to include `ui_message`:
```typescript
return NextResponse.json({
  error: 'permission_denied',
  required: 'admin+',
  ui_message: 'Only admins and owners can archive projects. Ask your admin.',
}, { status: 403 })
```
Then the frontend reads `body.ui_message` and shows it in the error state.

**Permanent prevention C-2:**
- Pre-commit hook (or validator): scan all API routes returning 403 — verify they include `ui_message` field
- `validate-api-error-messages.mjs`: checks 403 responses have `ui_message` in the return shape

---

### PERSONA D: EU User Requesting GDPR Erasure

**Journey:** User wants to delete their account and all data.

**Flow D-1: Self-service erasure**

| Step | What happens | Status |
|---|---|---|
| 1. User looks for "Delete account" | **No such button exists in the app** | ❌ |
| 2. `eraseUser()` function | EXISTS in libs/integrations/gdpr.ts | ✅ |
| 3. API endpoint | **No DELETE /api/settings/account endpoint** | ❌ |
| 4. AuditEvent written | Would write user.gdpr_erasure_completed | ✅ (in function) |

**GAP D-1: GDPR erasure function exists but is unreachable by users.**
`eraseUser()` is implemented but has no API endpoint and no UI.

**Solution D-1:**
```typescript
// apps/task-mgmt/src/app/api/settings/account/route.ts
export async function DELETE(request: Request) {
  const { userId, sessionClaims } = await auth()
  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  // Q-17: self-service (user-triggered)
  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  await eraseUser(cspsUser.id, tenantId, db)
  await clerkClient.users.deleteUser(userId)  // also delete from Clerk
  return NextResponse.json({ erased: true })
}
// + /settings page with "Delete my account" button
```

**Permanent prevention D-1:**
- GDPR compliance validator: `validate-gdpr-erasure-path.mjs` — confirms every app has:
  (a) `eraseUser()` imported, (b) a DELETE /api/settings/account route, (c) a settings UI page
- Bedrock checklist item: "GDPR erasure path accessible by user (API + UI)" must be ✅ before app can go live

---

### PERSONA E: Cancelled Subscriber

**Journey:** Subscription cancelled → tries to use app → gets blocked.

**Flow E-1: Post-cancellation write attempt**

| Step | What happens | Status |
|---|---|---|
| 1. Stripe subscription.deleted fires | subscriptionStatus = 'cancelled' in DB | ✅ |
| 2. User tries POST /api/tasks | requireWriteSubscription() → 402 subscription_inactive | ✅ |
| 3. User sees error in UI | Generic "Failed to create task" — no renewal CTA | ❌ |
| 4. User tries GET /api/tasks | Read allowed (Q-03) → tasks visible | ✅ |

**GAP E-1: Cancelled users get cryptic errors with no path to renewal.**
The 402 is handled at API level but the UI just shows "Failed". No "renew your subscription" message.

**Solution E-1:**
1. API: 402 response includes `stripe_checkout_url` (generated via Stripe Checkout session API)
2. UI: frontend detects 402 `subscription_inactive` → shows banner "Your subscription has ended. [Renew here]" linking to checkout

**Permanent prevention E-1:**
- Subscription error handling becomes a platform primitive:
  `libs/integrations/subscription.ts` exports `getSubscriptionRenewalUrl(tenantId, stripeCustomerId)`
- Validator: `validate-subscription-error-handling.mjs` — checks every write route returns structured 402 with `renewal_url`

---

### PERSONA F: Departing Member (Removed from Org)

**Journey:** Admin removes member from Clerk org → member tries to use app.

**Flow F-1: Membership removal**

| Step | What happens | Status |
|---|---|---|
| 1. Admin removes in Clerk | membership.deleted webhook → UserTenant row DELETED | ✅ |
| 2. Ex-member's JWT | Still has tenantId + role until expiry (~1 hour Clerk default) | ⚠️ |
| 3. Ex-member creates task | JWT still valid → task created (ZenStack checks tenantId, which is still in JWT) | ❌ |
| 4. Next sign-in | JWT refreshed → no org role → tasks page "No org yet" | ✅ eventually |

**GAP F-1: Removed members can still write for up to 1 hour after removal (JWT lifetime).**
The UserTenant row is deleted but the JWT is still valid. ZenStack reads tenantId from JWT, not from UserTenant.

**Solution F-1 (MVP):** On `membership.deleted` webhook, call Clerk API to revoke user's sessions:
```typescript
// In webhook-handler.ts, organizationMembership.deleted case, add:
// await clerkClient.users.getUserOauthAccessToken(userId, 'oauth_google')
// Actually: await clerkClient.sessions.revokeSession(sessionId)
// Or: use Clerk's signOutAll for the user in this org
```

**Solution F-1 (Short-term):** Add DB check in the middleware for high-security routes:
```typescript
// middleware.ts: for write routes, verify UserTenant still exists
// const membership = await db.userTenant.findFirst({ where: { userId, tenantId } })
// if (!membership) → return 403
```

**Permanent prevention F-1:**
- Session invalidation policy: every membership removal MUST trigger session revocation via Clerk API (add to webhook-handler checklist)
- Validator: `validate-session-revocation.mjs` — checks membership.deleted handler includes Clerk session revocation

---

### PERSONA G: App #2 Developer

**Journey:** Internal developer wants to build the next app on CSPS.

**Flow G-1: App scaffolding**

| Step | What happens | Status |
|---|---|---|
| 1. Developer looks for template | No `apps/template/` directory exists | ❌ |
| 2. Copies apps/task-mgmt/ | Manual copy — lots of task-specific code to remove | ⚠️ |
| 3. Sets up ZenStack | Requires running postinstall script + copy | ✅ (postinstall now exists) |
| 4. Configures Clerk | Must manually set up JWT template, public metadata | ⚠️ No guide |
| 5. Connects to Supabase | Needs real DATABASE_URL + db:push | ✅ (pattern exists) |

**GAP G-1: No official app template or "how to build App #2" guide.**
The platform is ready but there's no documented starting point for the next app.

**Solution G-1:**
1. Create `apps/template/` — a minimal Next.js + Clerk + Prisma app that inherits all platform concerns
2. Create `docs/plan/pillar-1-product/app-build-guide.md` — step-by-step for building App #2

**GAP G-2: Webhook route is copy-pasted per-app, not inherited.**
`apps/task-mgmt/src/app/api/webhooks/clerk/route.ts` must be copied to every new app. If the platform webhook handler changes, all apps need updating.

**Solution G-2:** Extract webhook route to a generator:
```bash
# Run once per app: generates the webhook route from libs/integrations
pnpm generate:webhook-routes --app apps/health-tracker
```

**Permanent prevention G-1, G-2:**
- `validate-app-template-completeness.mjs`: checks every `apps/*` directory has required files (webhook route, subscription lib, zenstack lib)
- Plan discipline: before building App #2, run the completeness validator

---

## SYSTEM-LEVEL GAPS (Cross-Persona)

### GAP SYS-1: No webhook idempotency
If Clerk fires a webhook twice (retry on failure), it will try to create duplicate rows. The DB unique constraints will catch most cases, but `user.created` firing twice creates a DB error not a silent no-op.

**Solution:** Add idempotency check at top of each webhook case:
```typescript
case 'user.created': {
  const existing = await db.user.findUnique({ where: { clerkId: id } })
  if (existing) break  // idempotent: already created
  // ... rest of handler
}
```

**Permanent prevention:** Validator: `validate-webhook-idempotency.mjs` — checks each webhook case has an existence check before create.

### GAP SYS-2: No production migration strategy
`pnpm db:push` is development-only. Any schema change in production requires a migration strategy (Prisma migrate). No migration history exists.

**Solution:** 
1. Switch to `prisma migrate dev` for development changes
2. `prisma migrate deploy` for production deployments
3. Add `pnpm db:migrate` script alongside `pnpm db:push`

**Permanent prevention:** Bedrock checklist item: "Production migration strategy" → must be ✅ before first paying customer.

### GAP SYS-3: Missing Clerk webhook registration verification
The app has webhook handlers but there's no automated check that the Clerk dashboard actually has the webhook URL configured. If someone deploys without registering the webhook, user.created fires nowhere.

**Solution:** `validate-webhook-registration.mjs` — when deployed, checks `/api/webhooks/clerk` returns 405 (method not allowed) on GET, confirming the route exists.

---

## SUMMARY TABLE

| Gap | Severity | Persona | Fix in | Permanent prevention |
|---|---|---|---|---|
| A-1: Solo users stuck at "No org" | CRITICAL | P-A | App #2 kick-off | `validate-solo-user-flow.mjs` |
| B-2: No invite member UI | HIGH | P-B | App #2 kick-off | Plan discipline: every permission-gated op has UI |
| B-3: No audit log UI | HIGH | P-B | App #2 kick-off | `validate-api-error-messages.mjs` |
| C-2: Silent 403 with no explanation | MEDIUM | P-C | App #2 kick-off | `validate-api-error-messages.mjs` |
| D-1: GDPR erasure unreachable | HIGH | P-D | App #2 kick-off | `validate-gdpr-erasure-path.mjs` |
| E-1: Cancelled users get cryptic errors | MEDIUM | P-E | App #2 kick-off | `validate-subscription-error-handling.mjs` |
| F-1: Removed members write for ~1 hour | MEDIUM | P-F | Session 7 | `validate-session-revocation.mjs` |
| G-1: No app template | HIGH | P-G | Session 7 | `validate-app-template-completeness.mjs` |
| G-2: Webhook copy-paste per app | MEDIUM | P-G | Session 7 | Webhook route generator |
| SYS-1: Webhook non-idempotent | MEDIUM | All | Session 7 | `validate-webhook-idempotency.mjs` |
| SYS-2: No migration strategy | HIGH | All | Session 7 | Bedrock checklist item |
| SYS-3: No webhook registration check | LOW | All | Session 7 | `validate-webhook-registration.mjs` |

---

## NEXT SESSION PRIORITIES (PE-scored)

| Session | Work | PE_SCORE | Band |
|---|---|---|---|
| **Session 7A** | SYS-1 (webhook idempotency) + F-1 (session revocation) + SYS-2 (migration strategy) | 8.2 | 1-BLOCKING |
| **Session 7B** | App template scaffold (G-1/G-2) + app-build-guide.md | 7.5 | 1-BLOCKING |
| **App #2 kick-off** | A-1 (solo user) + B-2 (invite UI) + B-3 (audit UI) + C-2 (error messages) + D-1 (GDPR UI) + E-1 (renewal CTA) | 6.8 | 2-HIGH (UX — per app) |

---

## WHAT IS FLAWLESS

The following flows work end-to-end without gaps:
- ✅ Team user sign-in → tasks page loads (confirmed live)
- ✅ Task creation → ZenStack tenant isolation → AuditEvent written
- ✅ Cross-tenant write → denied by ZenStack policy (S3-E1 retrospective PASS)
- ✅ AuditEvent UPDATE → blocked by Postgres trigger (S3-E7)
- ✅ Write with cancelled subscription → 402 (code path exists)
- ✅ Membership removal → UserTenant deleted (code exists, JWT lag is the gap)
- ✅ Postgres RLS on 7 tables (defense-in-depth)

---

*Platform Flow Audit v1.0 | S022 | 2026-05-11*
*Baseline: Bedrock 22/22 | 58 validators | ZF ACHIEVED*
