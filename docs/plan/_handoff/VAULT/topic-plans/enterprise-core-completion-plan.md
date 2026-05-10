---
id: csps.handoff.vault.topic-plan.enterprise-core-completion
name: enterprise-core-completion-plan
description: >
  Multi-session plan to close the gap between current bedrock (21/22 items) and
  true enterprise-level core — the foundation that every one of the 30 apps inherits
  automatically. Covers ZenStack fix, subscription enforcement, role permissions,
  GDPR, webhook completeness, audit coverage, and Postgres RLS. Governor directive S022.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: gradual-build-plan
template_status: stable
core_spine: ARCH
core_spines: [ARCH, GVRN, VALD, OPER]
schema_anchor: topic_plans
domain_path: platform
tags:
  - domain:architecture
  - domain:governance
  - type:how-to
  - audience:developer
  - audience:ai-agent
  - maturity:stable
session: S022
execution_mode: deep_quality
know_how_consulted: true
enforcement_stage: active
topic_id: enterprise-core-completion
priority_score: 98
priority_band: 1
depth_chosen: 4
depth_rationale: |
  Depth-4: touches ARCH (schema/policies), GVRN (enforcement), OPER (webhooks/billing),
  VALD (audit coverage). Foundation-before-apps mandate. Not depth-5 — no constitutional
  changes, additive to existing structures.
impl_status: swift-implemented
links:
  - { rel: parent, href: ./README.md }
  - { rel: bedrock, href: ../../../../pillar-0-governance/csps-bedrock.md }
  - { rel: schema, href: ../../../../../libs/policies/schema.zmodel }
  - { rel: session-state, href: ../../../../../tools/session-state.json }
---

# Enterprise Core Completion Plan

> **Purpose:** Close every gap between the current CSPS core and a true enterprise-grade
> foundation. Each gap listed here affects ALL 30 apps — fixing it once fixes it everywhere.
> Not fixing it means each app must re-implement or live with the risk.

---

## §1 — FINDINGS: Current State vs. Enterprise Standard

### What We Have ✅

| Capability | Evidence |
|---|---|
| Multi-tenant schema (User/Tenant/UserTenant/AuditEvent) | `libs/policies/schema.zmodel` |
| Auth: Clerk webhooks for user.created, org.created, membership.created | `libs/integrations/clerk/webhook-handler.ts` |
| Billing: Stripe customer creation + $1K MRR graduation trigger | `libs/integrations/stripe/customer-service.ts` |
| Subscription status enum (free/trialing/active/cancelled) | `schema.zmodel` TenantSubscriptionStatus |
| Role enum (owner/admin/member in UserTenant) | `schema.zmodel` MembershipRole |
| Soft-delete on all entities (deletedAt, no hard deletes) | Base mixin + @@deny('delete', true) |
| AppendOnlyBase for AuditEvent (immutable by schema) | `schema.zmodel` AppendOnlyBase |
| Audit event pattern (writeAuditEvent helper) | `apps/task-mgmt/src/lib/audit.ts` |
| Application-level tenant isolation (explicit tenantId in queries) | All API routes |
| Live DB connected (Supabase, CRUD proven S022 Session 1) | commit 1d9274f |

### What's Missing ❌ — Gaps by Severity

#### CRITICAL — Broken or legally required

| Gap | Impact | Every app affected? |
|---|---|---|
| **ZenStack ORM enforcement BYPASSED** | pnpm monorepo path bug — enhance() falls back to raw db. Zero ORM-level policy enforcement despite being "installed." | YES — every app inherits the bypass |
| **Subscription status never enforced** | A cancelled tenant can create/update data indefinitely. No middleware checks `subscriptionStatus` before writes. | YES — business logic gap in every app |
| **Missing webhook: user.deleted** | Clerk user deletion leaves orphaned User rows + UserTenant rows in DB. Data inconsistency, potential leakage. | YES — every app has User records |
| **Missing webhook: org.deleted** | Clerk org deletion leaves orphaned Tenant + all its data. No cleanup path. | YES — every app has Tenant records |
| **Missing webhook: membership.deleted** | Removing a member from a Clerk org doesn't remove UserTenant row. Member retains access. | YES — authorization hole |
| **Missing Stripe event: subscription.cancelled** | subscriptionStatus never changes to 'cancelled'. Cancelled users keep full access. | YES — billing integrity |
| **Missing Stripe event: payment.failed** | No handling for failed payment → dunning → cancellation pipeline. | YES — revenue protection |
| **GDPR erasure: no eraseUser() function** | EU market legally requires ability to erase PII. Cannot ship to EU without it. | YES — legal requirement |

#### HIGH — Needed before building more apps

| Gap | Impact | Session target |
|---|---|---|
| **Role permissions not enforced** | owner/admin/member roles exist in schema but ZenStack policies only check tenantId — a 'member' can do everything an 'owner' can. | Session 4 |
| **Audit coverage incomplete** | Only task.created is audited. Project operations, soft-deletes, user invitations, auth events NOT covered. Every app that ships needs consistent audit trail. | Session 5 |
| **Trial period logic missing** | TenantSubscriptionStatus.trialing exists but no trial start/end/conversion logic. Free → paid conversion path broken. | Session 4 |

#### MEDIUM — Defense-in-depth (before second app)

| Gap | Impact | Session target |
|---|---|---|
| **No Postgres RLS** | ZenStack is ORM-layer only. A buggy API route can leak cross-tenant data at the DB level. Enterprise standard = DB-level defense-in-depth. | Session 6 |
| **Seat limits not enforced** | No maximum member count per subscription tier. Free tenants can invite unlimited members. | Session 4 |

#### LOW — Polish (can be deferred past first 3 apps)

| Gap | Impact | Session target |
|---|---|---|
| Staff admin routes | staffRole field exists but no admin panel or staff-only operations | Post-session 6 |
| subscriptionStatus in JWT | Currently requires DB lookup per request to check status | Post-session 6 |
| ZenStack-integrated app template | Final bedrock item 22/22 | Session 6 |

---

## §2 — SESSION PLAN

### Session 3 — Infrastructure Completion (CRITICAL gaps)
**Scope:** Close all CRITICAL gaps. Required before any second app is built.
**Estimated duration:** 1 Sonnet session (~2 hours)

```
STEP 3a — Fix ZenStack pnpm monorepo path (30 min)
  Problem: generate writes to node_modules/.zenstack/ but runtime expects @zenstackhq/runtime/.zenstack/
  Fix Option A: Add post-install script to copy generated files to correct location
  Fix Option B: Configure zenstack.config.ts to output to the correct path
  Fix Option C: Run zenstack generate from apps/task-mgmt/ directly against shared schema
  Verify: enhance() no longer throws; ZenStack policies enforced in API routes
  Evidence: task.create with wrong tenantId → denied by policy (not just filtered)

STEP 3b — Subscription status enforcement (20 min)
  Add to libs/integrations/subscription.ts:
    function checkSubscriptionAllowsWrite(tenant: { subscriptionStatus: string }): boolean
      cancelled → return false (read-only mode)
      free | trialing | active → return true
  Add middleware hook in API routes: check subscriptionStatus before any write
  Wire in task-mgmt: POST /api/tasks, POST /api/projects check subscription first
  Error response: 402 Payment Required with { error: 'subscription_inactive' }

STEP 3c — Missing Clerk webhook events (30 min)
  Add to libs/integrations/clerk/webhook-handler.ts:
    user.deleted → soft-delete User (set deletedAt, anonymize email + displayName)
    organization.deleted → cascade soft-delete Tenant + all UserTenants
    organizationMembership.deleted → delete UserTenant row
  Wire these events in apps/task-mgmt/src/app/api/webhooks/clerk/route.ts
  Test: verify membership removal revokes access immediately

STEP 3d — Missing Stripe webhook events (20 min)
  Add to apps/task-mgmt/src/app/api/webhooks/stripe/route.ts:
    customer.subscription.updated → sync subscriptionStatus
    customer.subscription.deleted → subscriptionStatus = 'cancelled'
    invoice.payment_failed → subscriptionStatus = 'trialing' (dunning period)
  Wire subscription status changes to Clerk user metadata update (optional)

STEP 3e — GDPR erasure service (20 min)
  File: libs/integrations/gdpr.ts
  Function: async eraseUser(userId: string, db: PrismaClient): Promise<ErasureReceipt>
    1. Find User by userId
    2. Replace email → "[deleted-{hash}]", displayName → null
    3. TaskComment.body by this author → "[deleted]"
    4. Write AuditEvent: action="user.gdpr_erasure_completed"
    5. Return { erasure_id, timestamp, fields_cleared, rows_affected }
  Export from libs/integrations/index.ts
  Update csps-bedrock.md: mark GDPR erasure complete

STEP 3f — Verify
  pnpm verify: exit_code=0
  PASTE full output
```

---

### Session 4 — Permission Enforcement + Subscription Logic
**Scope:** Role-based operations + feature tier gating + trial logic.
**Prerequisite:** Session 3 complete (ZenStack working + subscription check in place)

```
STEP 4a — Role-based ZenStack policies
  Current: @@allow("create", auth().tenantId == tenantId) — role ignored
  New pattern:
    @@allow("create", auth().tenantId == tenantId && (auth().role == 'owner' || auth().role == 'admin'))
    @@allow("read",   auth().tenantId == tenantId)
  Add `role` field to ZenstackUserCtx and auth() context
  Apply to: Project (create/update: admin+), Task (create: all members), TaskComment (create: all)
  Specific gates:
    Project.archive → admin+
    Task.delete (soft) → creator OR admin+
    UserTenant.create (invite) → admin+

STEP 4b — Seat limit enforcement per tier
  Add to libs/integrations/subscription.ts:
    function getMaxSeats(status: TenantSubscriptionStatus): number
      free → 1 (solo only)
      trialing → 5
      active → unlimited
      cancelled → 0 (read-only)
  Wire in org.membership.created webhook: check seat limit before creating UserTenant
  Return 402 { error: 'seat_limit_reached', max_seats: N } when exceeded

STEP 4c — Trial period logic
  Trial starts: when 2nd UserTenant created AND subscriptionStatus == 'free'
    → set subscriptionStatus = 'trialing', trialEndsAt = now + 14 days
  Trial ends: cron job (daily) checks trialEndsAt < now AND no Stripe subscription
    → set subscriptionStatus = 'cancelled'
  Wire: Stripe subscription activation sets subscriptionStatus = 'active'

STEP 4d — Feature tier gating (lib)
  Add to libs/integrations/features.ts:
    type FeatureKey = 'team_members' | 'advanced_reporting' | 'api_access' | 'audit_log' | 'custom_branding'
    function isFeatureEnabled(feature: FeatureKey, status: TenantSubscriptionStatus): boolean
  Gate by tier:
    free: team_members=false, audit_log=false, api_access=false
    trialing: all=true (full access during trial)
    active: all=true
    cancelled: all=false
  Wire in API routes: check feature gate before advanced endpoints

STEP 4e — Verify
  pnpm verify: exit_code=0
```

---

### Session 5 — Audit Completeness
**Scope:** Every mutation across all entities writes a consistent AuditEvent.
**Prerequisite:** Session 3 complete (ZenStack working, writeAuditEvent pattern established)

```
STEP 5a — Extend AuditEvent data shape
  Add structured data envelope to writeAuditEvent:
    { actor: { id, role }, resource: { type, id, tenantId }, change: { before?, after } }
  Backward compatible — existing { title, status } data still works

STEP 5b — Audit all Task mutations
  Currently: task.created ✅
  Add: task.updated (when status/priority/title/assignee changes)
  Add: task.soft_deleted (when deletedAt set)
  Add: task.comment.created

STEP 5c — Audit all Project mutations
  project.created, project.archived, project.deleted (soft)

STEP 5d — Audit all membership events
  member.invited (UserTenant created)
  member.removed (UserTenant deleted)
  tenant.subscription_changed (status transition)
  user.gdpr_erasure_completed (from Session 3)

STEP 5e — Audit retrieval API
  GET /api/audit?tenantId={}&resourceType={}&limit=50
  Admin+ only (role gate from Session 4)
  Returns: [ { id, action, actorId, resourceType, resourceId, data, createdAt } ]

STEP 5f — Verify
  pnpm verify: exit_code=0
  Confirm AuditEvent count > N after exercising all mutation types
```

---

### Session 6 — Postgres RLS + Bedrock Closure
**Scope:** DB-level defense-in-depth + close bedrock 22/22.
**Prerequisite:** Sessions 3-5 complete.

```
STEP 6a — Postgres RLS policies via Supabase
  Enable RLS on all tables in Supabase dashboard:
    Task, Project, TaskComment, UserTenant, AuditEvent
  Policy: USING (tenant_id = current_setting('app.tenant_id')::uuid)
  Set current_setting in middleware: SET LOCAL app.tenant_id = '{tenantId}'
  Note: applies to all DB connections, not just via application code

STEP 6b — ZenStack-integrated app template
  Resolve the pnpm monorepo generate path issue permanently (not workaround)
  Create app-template/ in CSPS root:
    Scaffold with ZenStack enhance() working from session start
    Includes: Clerk + Stripe + ZenStack + Prisma + Next.js 14 + Tailwind
    Reads from libs/policies/schema.zmodel (shared schema)
  This is the "fork this to build your next app" starting point
  Close bedrock item: [ ] ZenStack-integrated app template → ✅

STEP 6c — Update csps-bedrock.md: mark 22/22 complete
  Validate with validate-bedrock.mjs

STEP 6d — Verify
  pnpm verify: exit_code=0
  All 22 bedrock items ✅
```

---

## §3 — What "Enterprise Core Complete" Unlocks

When Sessions 3-6 are complete, every app built on CSPS gets:

| Capability | How delivered |
|---|---|
| Multi-tenant isolation | ZenStack ORM + Postgres RLS (defense-in-depth) |
| Role-based access control | ZenStack policies (owner/admin/member gate ops) |
| Subscription enforcement | Middleware checks status before writes |
| Billing (Stripe) | Customer creation + subscription lifecycle fully handled |
| GDPR-ready | eraseUser() in libs/integrations |
| Audit trail | All CRUD mutations write AuditEvent automatically |
| User lifecycle | Clerk webhook covers user.created, deleted, invited, removed |
| Trial + free tier | Seat limits, trial period, feature gates |
| Immutable audit log | AppendOnlyBase + Postgres trigger (no updates to AuditEvent) |

An app developer **forks the template → defines domain schema → ships** — all of the above is inherited without re-implementation.

---

## §4 — Session Ordering Rationale

```
Session 3 (Critical fixes) → MUST come first
  ZenStack fix: without it, all "policy enforcement" is theater
  Subscription check: without it, cancelled tenants use the product for free
  Webhook gaps: without them, deleting a user in Clerk leaves a ghost in DB

Session 4 (Permission enforcement) → Requires Session 3 (ZenStack working)
  Can't add role gates to ZenStack if ZenStack isn't enforcing

Session 5 (Audit completeness) → Requires Session 3 (patterns working)
  Audit pattern established; extend it systematically

Session 6 (RLS + template closure) → Requires 3+4+5
  RLS adds DB-level layer on top of application layer (already working)
  App template requires ZenStack working (requires Session 3)
```

---

## §5 — What Is NOT In This Plan

**Deferred intentionally:**
- Staff admin panel (staffRole exists but internal tool — post-Session 6)
- subscriptionStatus in Clerk JWT (optimization — DB lookup per request is fine at MVP scale)
- Pricing page / checkout flow (per-app UI, not platform core)
- Multi-region / DR (infrastructure concern beyond initial bedrock)
- API rate limiting (important but Layer 2 concern — not blocking app builds)

---

## §6 — Bedrock State After Each Session

| After | Bedrock | Critical gaps |
|---|---|---|
| Current (S022 S1+S2 done) | 21/22 | ZenStack bypassed, cancelled tenants active, webhook gaps, no GDPR |
| After Session 3 | 21/22 | ZenStack working, subscription enforced, webhooks complete, GDPR done |
| After Session 4 | 21/22 | Role gates, seat limits, trial logic, feature gating |
| After Session 5 | 21/22 | Full audit coverage, retrieval API |
| After Session 6 | **22/22 ✅** | Postgres RLS, ZenStack template, bedrock closed |

---

## §7 — SESSION 3 START CHECKLIST

Ready to begin Session 3 when:
- [ ] pnpm verify exit_code=0 (current baseline: ✅)
- [ ] Governor confirms ZenStack fix approach (Option A/B/C from STEP 3a)
- [ ] Session 3 scope confirmed (STEPS 3a-3f or subset)

---

*Enterprise Core Completion Plan v1.0 | S022 | 2026-05-10*
*Governor directive: "enterprise level as far as the core is concerned"*
