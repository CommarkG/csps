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
intent_crystallized: true
threshold_route: platform.governance
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
ai_defaults_influence: partial
ai_defaults_declared_sections:
  - "§2 feature tier gating values (free/paid features) — AI SaaS convention, Q-11/Q-12 pending Governor ratification"
  - "§2 trial period 14 days — AI industry default, Q-08 pending Governor ratification"
  - "§2 seat limits (free=1, trialing=5) — AI defaults, Q-13 pending Governor ratification"
  - "§2 role permission boundaries (admin+ for project create) — AI convention, Q-04/Q-05/Q-06/Q-07 pending ratification"
  - "§2 invoice.payment_failed → trialing (Stripe dunning) — AI Stripe knowledge, Q-10 pending ratification"
ratification_status: RATIFIED
ratification_date: "2026-05-10"
ratification_by: "Governor + Opus Turn 4"
ratified_decisions: "Q-01 through Q-19 ratified. Q-11/Q-12 removed (wrong layer). Q-20 added and ratified."
flexibility_doctrine: "All ratified values implemented in config, not hardcoded. See libs/config/."
links:
  - { rel: parent, href: ./README.md }
  - { rel: bedrock, href: ../../../../pillar-0-governance/csps-bedrock.md }
  - { rel: schema, href: ../../../../../libs/policies/schema.zmodel }
  - { rel: session-state, href: ../../../../../tools/session-state.json }
scope_level: S1
context_question: "What is the current depth level of this topic plan, and have all prior depth gates been verified clean before proceeding to the next level?"
---
## §0 — CONSOLIDATION CHECK (mandatory — read before any implementation)

CHECK WHAT EXISTS before any implementation step in this plan.
- Search: tools/validators/ for existing validators covering this area
- Search: tools/generators/ for existing generators
- Search: .claude/hooks/ for existing hooks
- Search: docs/plan/pillar-0-governance/audit-runner.md for registered slugs
- Search: docs/plan/_handoff/VAULT/topic-plans/ for overlapping plans
- Search: libs/ for existing integrations and patterns

Consolidation finding: [update with findings when implementing each step]



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
**PE_SCORE: 8.05 | Band: 1-BLOCKING | Situation: STRATEGIC_COMPLETION**
**Computation:** B=8(HIGH), D=10(all downstream blocked), I=1, Bn=10(primary), PAS=10
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
    organizationMembership.updated → sync UserTenant.role from Clerk event [Gap C — Opus Turn 4]
      (Role changes in Clerk MUST propagate to DB — without this ZenStack role gates enforce wrong role)
  Wire these events in apps/task-mgmt/src/app/api/webhooks/clerk/route.ts
  Test: verify membership removal revokes access immediately

STEP 3d — Missing Stripe webhook events (20 min)
  Add to apps/task-mgmt/src/app/api/webhooks/stripe/route.ts:
    customer.subscription.updated → sync subscriptionStatus
    customer.subscription.deleted → subscriptionStatus = 'cancelled'
    invoice.payment_failed → NO ACTION (Stripe dunning handles retries; subscription.deleted fires on final failure)
  [Q-02 ratified: deliberate cancel → 402. Stripe dunning IS the grace period — no grace period logic needed]

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
**PE_SCORE: 7.35 | Band: 1-BLOCKING | Situation: STRATEGIC_COMPLETION**
**Computation:** B=8(HIGH), D=8(Session 5+6 depend on role gates), I=1, Bn=9(strong), PAS=10
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

STEP 4d — Platform subscription primitives [REPLACED per Opus Turn 4 Gap E]
  [REMOVED: platform-level feature key enum — architecturally wrong for a 30-app platform]
  [Each app defines its own feature gates using the platform primitives below]
  Add to libs/config/subscription.config.ts (reads from SUBSCRIPTION_CONFIG):
    function getSubscriptionTier(status: TenantSubscriptionStatus): 'free' | 'paid' | 'inactive'
    function getMaxSeats(status: TenantSubscriptionStatus): number → reads SUBSCRIPTION_CONFIG.seats
  These are raw platform capabilities only. Feature semantics are app-owned.

STEP 4e — Verify
  pnpm verify: exit_code=0
```

---

### Session 5 — Audit Completeness
**PE_SCORE: 5.60 | Band: 2-HIGH | Situation: STRATEGIC_COMPLETION**
**Computation:** B=5(MEDIUM, no security gap), D=6(Session 6 audit API), I=1, Bn=8(strong), PAS=9
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
**PE_SCORE: 7.75 | Band: 1-BLOCKING | Situation: STRATEGIC_COMPLETION**
**Computation:** B=8(HIGH — closes bedrock), D=10(App#2 blocked until 22/22), I=1, Bn=7(moderate), PAS=10
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

---

## ⚠ AI-DEFAULTS DECLARATION

> **This plan contains sections derived from AI SaaS training knowledge, NOT from ratified CSPS decisions.**
> The sections below marked `[AI-DEFAULT]` are proposals only — they require Governor + Opus ratification
> before Sonnet executes them. Do NOT treat these as directives.

| Section | Label | Status |
|---|---|---|
| Feature tier gating values (free/paid) | `[AI-DEFAULT]` | Q-11/Q-12 pending Governor |
| Trial period = 30 days | `[AI-DEFAULT]` | Q-08 pending Governor |
| Seat limits (free=1, trialing=5) | `[AI-DEFAULT]` | Q-13 pending Governor |
| Role permission boundaries | `[AI-DEFAULT]` | Q-04 through Q-07 pending Governor |
| Stripe dunning logic (payment.failed → trialing) | `[AI-DEFAULT]` | Q-10 pending Governor |
| RLS via SET LOCAL session parameter | `[AI-DEFAULT]` | Q-14/Q-15 pending Governor |

**What IS CSPS-ratified (safe to execute without further input):**
- ZenStack fix (S022 proven broken — structural necessity)
- Subscription status enforcement (cancelled enum ratified; enforcement gap is a bug)
- Webhook gaps (user.deleted, org.deleted — structural gaps in existing webhook handler)
- GDPR eraseUser() (legal requirement, methodology TBD — Q-16/Q-17 needed)

---

## §8 — DECISION REGISTER (Batch Ratification Queue)

> **For Governor + Opus review.** All Q-* items below are pending ratification.
> Once ratified, Sonnet executes Sessions 3-6 without stopping.

### ZenStack Fix
- **Q-01:** Fix approach: A (post-install copy script) | B (zenstack.config.ts) | C (generate from apps/)
  - Sonnet recommendation: **A** (immediate fix) + VLT to resolve permanently later

### Subscription Enforcement
- **Q-02:** Cancelled tenant behavior: A (402 immediately) | B (7-day grace) | C (read-only redirect)
  - Sonnet recommendation: **A**
- **Q-03:** Check scope: A (all routes) | B (write routes only) | C (configurable per app)
  - Sonnet recommendation: **B**

### Role Permissions
- **Q-04:** Project creation: A (any member) | B (admin+ only)
  - Sonnet recommendation: **A** (MVP)
- **Q-05:** Project archive: A (creator) | B (admin+) | C (any member)
  - Sonnet recommendation: **B**
- **Q-06:** Member invitation: A (admin+ only) | B (any member)
  - Sonnet recommendation: **A**
- **Q-07:** Task reassignment: A (admin+ OR creator) | B (any member)
  - Sonnet recommendation: **B**

### Trial Period
- **Q-08:** Trial duration: A (14 days) | B (30 days) | C (no trial, free plan)
  - Sonnet recommendation: **B**
- **Q-09:** Trial trigger: A (2nd member joins) | B (org created)
  - Sonnet recommendation: **A**
- **Q-10:** Trial-to-paid: A (Stripe checkout prompt) | B (manual Governor emails)
  - Sonnet recommendation: **A** with 7-day warning

### Feature Tier Gating
- **Q-11:** Free tier includes: Governor defines
  - Sonnet proposal: solo use (1 seat) + unlimited tasks + read audit
- **Q-12:** Paid only: Governor defines
  - Sonnet proposal: team members + audit API + API access
- **Q-13:** Free tier seat limit: A (1 solo) | B (3 small team) | C (unlimited members)
  - Sonnet recommendation: **A**

### Postgres RLS
- **Q-14:** RLS mechanism: A (Supabase dashboard policies) | B (session parameter) | C (both)
  - Sonnet recommendation: **A**
- **Q-15:** RLS timing: A (Session 6 as planned) | B (Session 3 — NOW, since ZenStack bypassed)
  - Sonnet recommendation: **B** — if ZenStack bypass persists, RLS is the only DB-level protection

### GDPR
- **Q-16:** PII scope: Governor confirms which fields (email, displayName, comments?)
  - Sonnet proposal: email → anonymized hash, displayName → null, comment bodies → "[deleted]"
- **Q-17:** Erasure authorization: A (self-service) | B (admin triggers) | C (staff only)
  - Sonnet recommendation: **C** for MVP

### Audit
- **Q-18:** Audit log access: RATIFIED **B** — admin+ only
- **Q-19:** Audit retention: RATIFIED **A** — forever at MVP
- **Q-20 (NEW — Opus Turn 4):** Role in ZenStack auth() per request
  - RATIFIED **A** — Clerk JWT custom claim (extend `buildSessionClaims` with `UserTenant.role`)
  - DB lookup at sign-in time only — zero per-request cost
- **Q-11/Q-12:** REMOVED — platform-level feature key enum is architecturally wrong for a 30-app platform. Apps own feature semantics. Platform provides primitives only (getMaxSeats, isTierActive).

**FULL RATIFICATION STATUS:** All Q-01 through Q-20 ratified by Governor + Opus, 2026-05-10.
**FLEXIBILITY DOCTRINE:** All values in `libs/config/`. No business logic hardcoded.

---

## §9 — COMPLETION AUDIT SERIES (ZF-Enforced)

> Each session has a mandatory audit gate. Sonnet CANNOT declare a session complete
> without passing the gate. Declaring complete without evidence = B_NOMINAL_ZF violation.

### Session 3 Completion Gate

**Pre-close pnpm verify:** exit_code=0 REQUIRED (not advisory)

**Functional evidence — paste all 6 in chat:**
```
[S3-E1] ZenStack working:
  edb.task.create with tenantId != auth().tenantId → DENIED (not silently filtered)
  PASTE: error response from attempted cross-tenant write

[S3-E2] Subscription enforcement:
  POST /api/tasks with cancelled-status tenant → 402 { error: 'subscription_inactive' }
  PASTE: curl response

[S3-E3] Webhook user.deleted:
  Delete user in Clerk → User.deletedAt set in Supabase
  PASTE: Supabase row showing deletedAt timestamp

[S3-E4] Webhook membership.deleted:
  Remove member in Clerk → UserTenant row deleted in Supabase
  PASTE: Supabase query showing row removed

[S3-E5] GDPR erasure:
  eraseUser() test → email replaced + AuditEvent written
  PASTE: test output

[S3-E6] Stripe subscription.cancelled handled:
  subscriptionStatus = 'cancelled' set in Tenant row
  PASTE: Supabase Tenant row after cancellation webhook
```

**CSPS alignment check (AI must self-declare):**
- [ ] P-ARCH-007 (soft-delete only) honored in webhook user.deleted → using deletedAt not hard-delete
- [ ] P-ARCH-008 (webhook-driven creation) — webhook handler in libs/integrations, not app code
- [ ] B_COMPLETION_OVER_SHINY — scope limited to STEP 3a-3f only, no additions
- [ ] ai_defaults_influence: none (all implemented items were ratified, not AI-invented)

**ZF gate:** `node tools/zf-orchestrator.mjs --level 3`
```
Output MUST show: STATUS: ZF ACHIEVED ✅ — 0 blocking findings remain
Cycle count is measurement not target
```

---

### Session 4 Completion Gate

**Functional evidence:**
```
[S4-E1] Role enforcement: member cannot archive a project (gets 403)
  PASTE: API response

[S4-E2] Seat limit: free tenant invitation of 2nd member → 402 seat limit error
  PASTE: API response

[S4-E3] Feature gate: free tenant accessing paid feature → 402 feature_not_available
  PASTE: API response

[S4-E4] Trial started: 2nd member joined free org → subscriptionStatus = 'trialing'
  PASTE: Supabase Tenant row
```

**CSPS alignment check:**
- [ ] ZenStack policies cite tenantId AND role — not just tenantId
- [ ] All ratified Q-04/Q-05/Q-06/Q-07 decisions implemented as specified
- [ ] No Q-* items implemented from AI-DEFAULT without Governor ratification

**ZF gate:** `node tools/zf-orchestrator.mjs --level 3`

---

### Session 5 Completion Gate

**Functional evidence:**
```
[S5-E1] All mutation types audited:
  task.created ✅ (existing)
  task.updated — PASTE: AuditEvent row showing status change
  project.created — PASTE: AuditEvent row
  member.invited — PASTE: AuditEvent row
  member.removed — PASTE: AuditEvent row

[S5-E2] Audit retrieval API (admin+ only):
  GET /api/audit → returns AuditEvent array
  GET /api/audit as non-admin → 403
  PASTE: both responses
```

**CSPS alignment check:**
- [ ] AuditEvent still uses AppendOnlyBase (no updatedAt added accidentally)
- [ ] writeAuditEvent called consistently (no mutations skip audit)

**ZF gate:** `node tools/zf-orchestrator.mjs --level 3`

---

### Session 6 Completion Gate (BEDROCK CLOSURE)

**Functional evidence:**
```
[S6-E1] Postgres RLS active:
  Direct Supabase SQL query without app.tenant_id set → 0 rows returned (not error)
  PASTE: result

[S6-E2] Cross-tenant protection at DB level:
  SQL: SELECT * FROM "Task" -- no session variable set → 0 rows
  PASTE: Supabase SQL result

[S6-E3] ZenStack-integrated template:
  Fork template → pnpm dev → enhance() works from session start (no bypass)
  PASTE: server startup log showing no ZenStack error

[S6-E4] Bedrock validator:
  node tools/validators/validate-bedrock.mjs
  Output: 22/22 items ✅ 0 blocking
  PASTE: output
```

**CSPS alignment check:**
- [ ] validate-bedrock.mjs exit_code=0
- [ ] All 19 Q-* items resolved and matching ratified Governor decisions
- [ ] ai_defaults_influence: none on all Session 6 implementations
- [ ] No AI-invented values in feature gating, role gates, trial periods

**ZF gate (DEEP — mandatory for bedrock closure):**
```
node tools/zf-orchestrator.mjs --level 3
Output MUST show: ZF ACHIEVED ✅ — 0 blocking findings remain
This is the BEDROCK ZF — platform is now enterprise-core-complete
```

**Final declaration format (AI uses this verbatim when Session 6 complete):**
```
ENTERPRISE CORE COMPLETE — S022 SESSION 6
pnpm verify: exit_code=0
bedrock: 22/22 ✅
ZF deep: ACHIEVED — 0 blocking
Evidence: [S6-E1] [S6-E2] [S6-E3] [S6-E4] all PASSED
ai_defaults_influence: none (all Q-* items ratified before execution)
Ready for: App #2 build — all fundamentals inherited automatically
```

---

## §10 — AI-DEFAULTS NOTIFICATION — How This Plan Was Produced

**For Opus review:** The sections flagged `[AI-DEFAULT]` above were generated from Sonnet's
SaaS industry training (standard patterns for role gates, trial periods, feature gating).
They are reasonable industry defaults but are NOT derived from CSPS Governor decisions.

**What Opus should verify:**
1. Are the proposed role permission boundaries (Q-04 through Q-07) appropriate for the CSPS
   multi-app platform goal? (Sonnet defaulted to enterprise SaaS conventions.)
2. Is 1 seat free tier (Q-13) the right graduation trigger, or should it be different given
   the $1K MRR graduation thesis?
3. Is Session 6 RLS timing correct, or should RLS be SESSION 3 priority given ZenStack bypass?
   (Q-15 — this is the most consequential sequencing decision.)
4. Are there gaps in the session plan that Sonnet missed due to its AI-defaults bias?

---

*Enterprise Core Completion Plan v1.1 | S022 | 2026-05-10*
*Status: RATIFIED — Governor + Opus Turn 4 — 2026-05-10*
*Q-01 through Q-20 ratified. Q-11/Q-12 removed. Flexibility doctrine applied.*
*EXECUTE: Part G → Part B (config files) → Part C (Session 3 code).*
