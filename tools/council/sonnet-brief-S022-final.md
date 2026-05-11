# Sonnet Implementation Brief — S022 Final
## Written by: OPUS-1 (Opus-designated Sonnet 4.6[1M] in advisor mode)
## For: Sonnet Builder tab
## Authority: Governor ratification 2026-05-10 + multi-persona review 2026-05-11

---

> **How to use this file:** Read it top to bottom. Follow the sections in order.
> Do not skip sections. Every step has a verification requirement.
> When a step says PASTE — paste the output in your session notes before continuing.

---

## §0 — CURRENT PLATFORM STATE (Verified Facts)

Do NOT trust memory. Verify this at session open:

```bash
# Run these and confirm outputs match:
pnpm verify          # Must exit_code=0
git log --oneline -3 # Confirm last commit is S022 Session 6 bedrock closure
```

**What is true right now (from session-state.json):**
- Bedrock: 22/22 complete ✓
- STRATEGIC_COMPLETION: CLOSED ✓
- APP_BUILD_MODE: ACTIVE ✓
- ZenStack: installed + enforce active ✓
- Postgres RLS: active ✓
- All 16 Q-* decisions: ratified by Governor ✓
- OPUS-001 (R1-R5 classification): DONE — output in `tools/council/opus-turn.md` Turn 2

**What is NOT done:**
- UPDATE-010: rigidity_level column in spine matrix (Sonnet task)
- UPDATE-011: AGENTS.md R1-only refactor (blocked by UPDATE-010)
- CIA document: needs 5 amendments (§IMMEDIATE-5 below)
- Config files: not yet created (§FLEX below)
- Sessions 3-6 implementation (§SESSION-3 through §SESSION-6 below)

---

## §1 — OPUS MODE (What It Is + How You Use It)

**OPUS MODE** is the formal protocol for when the Opus tab gives you architectural output.
Three modes exist:

| Mode | Opus produces | You do |
|---|---|---|
| OPUS REVIEW | Findings + gap list | Read, fix the gaps Opus found |
| OPUS DECISION | PCR table with recommendations | Read the Rec column after Governor ratifies |
| OPUS BRIEF | This file (full session spec) | Follow it top to bottom |

**Rule:** Before starting any session, check `tools/council/opus-turn.md`.
If it has an entry newer than `tools/session-state.json` → read it first.

**OPUS MODE BRIEF format** (8 parts, always in this order):
1. Ratified Decision Register (the source of truth for all values)
2. Flexibility Architecture (config files — all values live here, nowhere else)
3–N. Session Specs (pre-flight + steps + evidence gates)
N+1. Immediate Mechanical Actions (before code)
N+2. Flexibility Map (feedback → file → line number)

**This file IS an OPUS MODE BRIEF.** Follow it in order.

---

## §IMMEDIATE — Do These Before Any Code (No Exceptions)

### IMMEDIATE-1: Create tsconfig path alias for config

In `apps/task-mgmt/tsconfig.json`, add to `compilerOptions.paths`:
```json
{
  "compilerOptions": {
    "paths": {
      "@csps/integrations": ["../../libs/integrations/index.ts"],
      "@csps/config": ["../../libs/config/index.ts"]
    }
  }
}
```

Why: every session spec imports from `@csps/config`. Without this alias, every import breaks.

### IMMEDIATE-2: Update enterprise-core-completion-plan.md

File: `docs/plan/_handoff/VAULT/topic-plans/enterprise-core-completion-plan.md`

**Change 1:** Add to §8 Decision Register (new item at end):
```
- Q-20: Role in ZenStack auth() per request: RATIFIED = A (Clerk JWT custom claim)
    Extend buildSessionClaims in libs/integrations/clerk/session-context.ts
    DB lookup at sign-in time only — not per request.
```

**Change 2:** Remove STEP 4d (feature key gating) entirely. Replace with:
```
STEP 4d — Platform subscription primitives only
  libs/config/subscription.config.ts provides: getMaxSeats() + isTierActive()
  Apps define their own feature gates using these primitives.
  No platform-level feature key enum — apps own their feature semantics.
```

**Change 3:** In Session 3 STEP 3c, add as fourth webhook event:
```
  organizationMembership.updated → sync UserTenant.role from Clerk event
  SEVERITY: HIGH — without this, a member whose role changes in Clerk retains
  their old role in the database. ZenStack role policies enforce the DB role,
  not the Clerk role. A demoted admin keeps elevated access until next JWT refresh.
```

**Change 4:** After Session 3 STEP 3g verify block, add:
```
CONDITIONAL RLS BRANCH:
  IF S3-E1 evidence pasted (ZenStack working) → RLS stays Session 6 (defense-in-depth)
  IF S3-E1 evidence CANNOT be pasted (ZenStack still bypassed) → Session 4 starts
    with STEP 4-RLS (Supabase dashboard RLS setup) BEFORE any role permission work.
    This is not optional — zero DB-level isolation with zero ORM-level isolation
    is not acceptable for a platform that will have real users.
```

**Change 5:** Replace Session 4 STEP 4c trial expiry logic with:
```
TRIAL EXPIRY — request-time check (NOT a cron job):
  Reason: CSPS has no cron infrastructure. Vercel crons require configuration
  and cost money. Request-time check is simpler and equally effective at MVP scale.

  In requireActiveSubscription() middleware:
    if (status === 'trialing' && tenant.trialEndsAt && tenant.trialEndsAt < new Date()) {
      await db.tenant.update({
        where: { id: tenant.id },
        data: { subscriptionStatus: 'cancelled' }
      });
      throw new SubscriptionInactiveError();
    }

  This fires naturally on first request after trial expires.
  No cron needed. No infrastructure needed.
```

### IMMEDIATE-3: Update session-state.json mandate

Change `session_mandate.primary` to:
```json
"primary": "APP_BUILD_MODE ACTIVE. Sessions 3-6 enterprise core authorized. All 16 decisions ratified. Start: read tools/council/sonnet-brief-S022-final.md — it is the complete implementation brief. Begin at §FLEX (config files), then §SESSION-3."
```

### IMMEDIATE-4: Verify pnpm verify still passes after changes

```bash
pnpm verify
```
PASTE output. If exit_code=0, continue. If not, fix before proceeding.

### IMMEDIATE-5: Address CIA Document (csps-continuous-intelligence-architecture.md)

File: `docs/plan/_handoff/VAULT/topic-plans/csps-continuous-intelligence-architecture.md`

**Fix 1 — Move §5 to §1:**
The §PRE-IMPLEMENTATION PROTOCOL is the most important operational content.
Move it to be §1 (before PIL/PWP/EIA descriptions). Rename the current §1 → §2, etc.

**Fix 2 — Compress §PRE-IMPLEMENTATION PROTOCOL to 3 mandatory + triggered:**
```
MANDATORY (every session):
  1. READ docs/plan/pillar-0-governance/pe-situation-registry.md → confirm active situation
  2. RUN pnpm verify → exit_code=0 baseline
  3. DECLARE ai_defaults_influence in frontmatter before writing any plan section

TRIGGERED (when applicable):
  4. READ inner-ai-defaults README → only when starting AI behavior work
  5. READ know-how/INDEX.md → only before implementation steps
  6. RUN validate-session-harvest-readiness.mjs → only at session CLOSE, not open
  7-11. [rest of existing items, but triggered not mandatory]
```

**Fix 3 — Add this note to §3 (EIA) header:**
```
NOTE: §3.2 (Enterprise Research) contains product feature gaps for future apps,
NOT platform intelligence architecture. These are inputs for app-build-standard.md
(to be created in Session D). Do not implement §3.2 items until app-build-standard.md
exists and App #2 is in progress.
```

**Fix 4 — Rewrite §7 Implementation Sequence App #2 gate:**
Replace "App #2 kickoff: ONLY after Sessions 0-D complete" with:
```
App #2 PLANNING: starts after Session A complete (tools and governance hardened)
App #2 FIRST COMMIT: requires Session D complete (app template ready to fork)
Sessions B-C run in parallel with App #2 planning phase.
```

**Fix 5 — Rewrite Session 0 scope:**
Session 0 = orphan cleanup only (6 items from §6).
Week-4 retirement (49 items) moves to Session A as STEP A-0 (first action in Session A).

---

## §FLEX — Flexibility Architecture (Create These Files First)

**Governor's binding directive:** Every ratified value goes in config. Zero hardcoded business rules. When user feedback arrives, changing a value = one line in one file.

### File 1: `libs/config/subscription.config.ts` (CREATE)

```typescript
// CSPS Subscription Configuration
// All subscription business rules live here. Change a value here = changes everywhere.
// Governor-ratified 2026-05-10. See tools/council/opus-turn.md Turn 4 Part A.

export const SUBSCRIPTION_CONFIG = {
  trial: {
    durationDays: 14,           // Q-08 ratified. Expect to adjust based on cohort data.
    triggerOnMemberCount: 2,    // Q-09 ratified (VLT-S014-005). Do not change without VLT.
  },
  seats: {
    free: 1,                    // VLT-S014-005 ratified. Billing trigger on 2nd member.
    trialing: 5,                // Q-13 ratified. Adjust after first 50 trialing tenants.
    active: Infinity,           // Q-13 ratified. May become per-seat pricing later.
    cancelled: 0,               // Q-02 ratified. No access after cancellation.
  },
  cancelled: {
    httpStatus: 402,
    errorCode: 'subscription_inactive',
    allowReadRoutes: true,      // Q-03: reads allowed, writes blocked.
  },
} as const;

export type SubscriptionStatus = 'free' | 'trialing' | 'active' | 'cancelled';

export function getMaxSeats(status: SubscriptionStatus): number {
  return SUBSCRIPTION_CONFIG.seats[status] ?? 0;
}

export function isTierActive(status: SubscriptionStatus): boolean {
  return status === 'free' || status === 'trialing' || status === 'active';
}
```

### File 2: `libs/config/roles.config.ts` (CREATE)

```typescript
// CSPS Role Permission Configuration
// Change a permission boundary here = changes everywhere.
// Governor-ratified 2026-05-10. See tools/council/opus-turn.md Turn 4 Part A.

import type { MembershipRole } from '@prisma/client';

// Q-04 through Q-07 + Q-18 ratified by Governor 2026-05-10.
export const ROLE_PERMISSIONS = {
  projectCreate:  ['owner', 'admin', 'member'] as MembershipRole[],  // Q-04: any member
  projectArchive: ['owner', 'admin'] as MembershipRole[],            // Q-05: admin+
  memberInvite:   ['owner', 'admin'] as MembershipRole[],            // Q-06: admin+
  taskReassign:   ['owner', 'admin', 'member'] as MembershipRole[],  // Q-07: any member
  auditRead:      ['owner', 'admin'] as MembershipRole[],            // Q-18: admin+
} as const;

export type PermissionKey = keyof typeof ROLE_PERMISSIONS;

export function hasPermission(role: MembershipRole, permission: PermissionKey): boolean {
  return (ROLE_PERMISSIONS[permission] as readonly string[]).includes(role);
}
```

### File 3: `libs/config/index.ts` (CREATE or ADD TO)

```typescript
export * from './subscription.config';
export * from './roles.config';
```

### Verify config compiles

```bash
cd apps/task-mgmt && npx tsc --noEmit
```
PASTE output. Zero errors required before proceeding.

---

## §SESSION-3 — Enterprise Core Critical Gaps

### Pre-flight (Read Before Starting)

```
PRE-FLIGHT — Session 3: Enterprise Core Critical Gaps
══════════════════════════════════════════════════════
Scope:    ~10 files | Closes all CRITICAL + security + GDPR gaps | ~2-3 hours
Context:  ~400K tokens estimated — safe to continue

Q-GATE:   pnpm verify exit_code=0 → CONFIRMED (run it)
Q-SCOPE:  This is completion-mode. Add nothing outside this spec.
Q-GLOBAL: All fixes are in libs/integrations/ (platform-level) ✓
Q-INIT:   Governor-directed ✓

QUESTIONS: 0 — all 16 decisions ratified.
DEFAULTS:
  D1: ZenStack fix = Option C (generate from apps/task-mgmt/)
  D2: Cancelled = 402 immediately
  D3: GDPR self-service (eraseUser function only, no UI yet)

RUNNING NOW.
══════════════════════════════════════════════════════
```

### STEP 3a: Fix ZenStack

From `apps/task-mgmt/`:
```bash
npx zenstack generate --schema ../../libs/policies/schema.zmodel
```

If this generates successfully (no errors), update `libs/integrations/zenstack.ts`:
```typescript
// Remove the bypass comment block entirely. Restore enhance():
import { enhance } from '@zenstackhq/runtime';
import { db } from './db';

export type ZenstackUserCtx = {
  id: string
  tenantId?: string | null
  role?: string | null       // Q-20: role from Clerk JWT claim
  staffRole?: string | null
}

export function getEnhancedDb(user: ZenstackUserCtx) {
  return enhance(db, { user });
}
```

**If STEP 3a fails** (generate still errors — path resolution deeper than expected):
- Keep the bypass comment
- Apply Option A as fallback: add `postinstall` in `apps/task-mgmt/package.json`:
  ```json
  "scripts": { "postinstall": "node ../../tools/copy-zenstack-output.mjs" }
  ```
- Open VLT: `VLT-S022-ZENSTACK-GENERATE-PATH` in session-state.json blocking_decisions
- Continue to STEP 3b — other steps do NOT block on this

### STEP 3b: Subscription enforcement middleware

Create `apps/task-mgmt/src/lib/subscription.ts`:
```typescript
import { SUBSCRIPTION_CONFIG, SubscriptionStatus } from '@csps/config';

export class SubscriptionInactiveError extends Error {
  readonly statusCode = SUBSCRIPTION_CONFIG.cancelled.httpStatus;
  readonly code = SUBSCRIPTION_CONFIG.cancelled.errorCode;
  constructor() { super('Subscription inactive'); }
}

export function requireActiveSubscription(
  tenant: { subscriptionStatus: string; trialEndsAt?: Date | null }
): void {
  const status = tenant.subscriptionStatus as SubscriptionStatus;

  // Request-time trial expiry check (no cron needed)
  if (status === 'trialing' && tenant.trialEndsAt && tenant.trialEndsAt < new Date()) {
    // Don't update DB here — update on next write via calling code
    throw new SubscriptionInactiveError();
  }

  if (status === 'cancelled') {
    throw new SubscriptionInactiveError();
  }
}
```

In each write API route (POST /api/tasks, POST /api/projects, etc.), add at the top of the handler:
```typescript
import { requireActiveSubscription } from '@/lib/subscription';
// ...
requireActiveSubscription(session.tenant);
```

Return 402 when SubscriptionInactiveError is caught:
```typescript
} catch (e) {
  if (e instanceof SubscriptionInactiveError) {
    return NextResponse.json({ error: e.code }, { status: e.statusCode });
  }
  throw e;
}
```

### STEP 3c: Missing Clerk webhook events

In `libs/integrations/clerk/webhook-handler.ts`, add four event handlers:

**Handler 1: `user.deleted`**
```typescript
case 'user.deleted': {
  const { id: clerkId } = evt.data;
  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) break;
  const hash = createHash('sha256').update(user.id).digest('hex').slice(0, 8);
  await db.user.update({
    where: { id: user.id },
    data: { deletedAt: new Date(), email: `[deleted-${hash}]`, displayName: null },
  });
  break;
}
```

**Handler 2: `organization.deleted`**
```typescript
case 'organization.deleted': {
  const { id: clerkOrgId } = evt.data;
  const tenant = await db.tenant.findUnique({ where: { clerkOrgId } });
  if (!tenant) break;
  const now = new Date();
  await db.tenant.update({ where: { id: tenant.id }, data: { deletedAt: now } });
  await db.userTenant.updateMany({ where: { tenantId: tenant.id }, data: { deletedAt: now } });
  break;
}
```

**Handler 3: `organizationMembership.deleted`**
```typescript
case 'organizationMembership.deleted': {
  const { organization: { id: clerkOrgId }, public_user_data: { user_id: clerkUserId } } = evt.data;
  const [tenant, user] = await Promise.all([
    db.tenant.findUnique({ where: { clerkOrgId } }),
    db.user.findUnique({ where: { clerkId: clerkUserId } }),
  ]);
  if (!tenant || !user) break;
  await db.userTenant.deleteMany({ where: { tenantId: tenant.id, userId: user.id } });
  break;
}
```

**Handler 4: `organizationMembership.updated` — HIGH SECURITY PRIORITY**
```typescript
// Without this: role changes in Clerk don't sync to DB.
// ZenStack role policies enforce the DB role. A demoted admin keeps
// elevated access until their JWT refreshes (up to 1hr).
case 'organizationMembership.updated': {
  const {
    organization: { id: clerkOrgId },
    public_user_data: { user_id: clerkUserId },
    role: clerkRole,
  } = evt.data;
  const [tenant, user] = await Promise.all([
    db.tenant.findUnique({ where: { clerkOrgId } }),
    db.user.findUnique({ where: { clerkId: clerkUserId } }),
  ]);
  if (!tenant || !user) break;
  // Map Clerk role to CSPS MembershipRole
  const role = clerkRole === 'org:admin' ? 'admin'
             : clerkRole === 'org:member' ? 'member'
             : 'owner';
  await db.userTenant.updateMany({
    where: { tenantId: tenant.id, userId: user.id },
    data: { role },
  });
  break;
}
```

**Webhook idempotency — add to all handlers:**
Each handler should be idempotent (running twice = same result as running once). The patterns above are already idempotent for updates (`updateMany` on same condition = same result). For creates: use `upsert` not `create` where applicable.

### STEP 3d: Missing Stripe webhook events

In `apps/task-mgmt/src/app/api/webhooks/stripe/route.ts`, add:

```typescript
case 'customer.subscription.updated': {
  const subscription = event.data.object as Stripe.Subscription;
  const stripeStatus = subscription.status;
  // Map Stripe status to CSPS SubscriptionStatus
  const status = stripeStatus === 'active' ? 'active'
               : stripeStatus === 'trialing' ? 'trialing'
               : stripeStatus === 'canceled' ? 'cancelled'
               : null;
  if (!status) break;
  await db.tenant.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: { subscriptionStatus: status },
  });
  break;
}

case 'customer.subscription.deleted': {
  const subscription = event.data.object as Stripe.Subscription;
  await db.tenant.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: { subscriptionStatus: 'cancelled' },
  });
  break;
}

case 'invoice.payment_failed': {
  // Stripe's dunning handles retries. Do NOT cancel here.
  // subscription.deleted will fire if all retries exhaust.
  // Log only — no status change.
  console.log(`Payment failed for invoice ${(event.data.object as Stripe.Invoice).id}`);
  break;
}
```

### STEP 3e: GDPR erasure service

Create `libs/integrations/gdpr.ts`:
```typescript
import { createHash } from 'crypto';
import type { PrismaClient } from '@prisma/client';
import { writeAuditEvent } from '../../../apps/task-mgmt/src/lib/audit';

export interface ErasureReceipt {
  erasure_id: string;
  timestamp: Date;
  fields_cleared: string[];
  rows_affected: number;
}

// Q-17 ratified: self-service (user triggers from settings)
// Auth context: the requesting user (may be the same as userId or a staff member)
// Q-16 ratified: email, displayName, TaskComment.body — AuditEvent NOT erased
export async function eraseUser(
  userId: string,
  requestingUser: { id: string; tenantId: string },
  db: PrismaClient
): Promise<ErasureReceipt> {
  const hash = createHash('sha256').update(userId).digest('hex').slice(0, 8);

  await db.user.update({
    where: { id: userId },
    data: { email: `[deleted-${hash}]`, displayName: null },
  });

  const { count } = await db.taskComment.updateMany({
    where: { authorId: userId, deletedAt: null },
    data: { body: '[deleted]' },
  });

  // AuditEvent is immutable (AppendOnlyBase) — this write is the erasure record
  await writeAuditEvent(db as any, {
    action: 'user.gdpr_erasure_completed',
    actorId: requestingUser.id,
    resourceType: 'User',
    resourceId: userId,
    tenantId: requestingUser.tenantId,
    data: { fields_cleared: ['email', 'displayName', 'taskComment.body'], hash },
  });

  return {
    erasure_id: `erasure_${hash}_${Date.now()}`,
    timestamp: new Date(),
    fields_cleared: ['email', 'displayName', 'taskComment.body'],
    rows_affected: 1 + count,
  };
}
```

Export from `libs/integrations/index.ts`: `export { eraseUser } from './gdpr';`

### STEP 3f: Postgres trigger for AuditEvent immutability

Run this in Supabase SQL editor (Dashboard → SQL Editor):
```sql
CREATE OR REPLACE FUNCTION prevent_audit_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'AuditEvent is append-only. Mutation forbidden.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_audit_immutability
  BEFORE UPDATE OR DELETE ON "AuditEvent"
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_mutation();
```

Update `libs/policies/audit-triggers.sql` — mark this trigger as DEPLOYED with date.
Mark VLT-S015-004 resolved in `tools/session-state.json`.

### STEP 3g: Extend Clerk JWT with role (Q-20)

In `libs/integrations/clerk/session-context.ts`, extend `buildSessionClaims`:
```typescript
// Add role field — DB lookup at sign-in only, not per request
const primaryTenant = user?.userTenants.find(ut => ut.tenantId === tenantId);
return {
  ...sessionClaims,
  tenantId: primaryTenant?.tenantId ?? null,
  role: primaryTenant?.role ?? null,  // Q-20: enables ZenStack role-based policies
};
```

### STEP 3h: Session 3 Verification

```bash
pnpm verify
```
PASTE full output. Must be exit_code=0.

**Mandatory evidence — paste all in session notes:**
```
[S3-E1] ZenStack: POST /api/tasks with wrong tenantId → denied by ZenStack policy
         (403 or ZenStack error, NOT just empty array)
         IF S3-E1 fails: note "ZenStack bypass persists" — RLS must move to Session 4

[S3-E2] Subscription: write with cancelled tenant → 402 { error: 'subscription_inactive' }

[S3-E3] Webhook user.deleted: User.email = '[deleted-xxx]' in Supabase

[S3-E4] Webhook membership.deleted: UserTenant row gone in Supabase

[S3-E5] Webhook membership.updated: UserTenant.role synced after Clerk role change

[S3-E6] GDPR eraseUser(): email replaced + AuditEvent written — paste test output

[S3-E7] AuditEvent trigger: attempted UPDATE → EXCEPTION from Supabase SQL

[S3-E8] JWT role claim: session.user contains { tenantId, role } — paste auth debug output
```

**CONDITIONAL RLS DECISION:**
- S3-E1 pasted and shows denial → ZenStack working → RLS stays Session 6
- S3-E1 not paste-able → RLS must be Session 4 STEP 4-RLS (first action, before role permissions)

---

## §SESSION-4 — Permission Enforcement + Trial Logic

**Prerequisite:** Session 3 complete + all S3-E* evidence pasted.

### STEP 4-RLS (only if S3-E1 failed in Session 3)

In Supabase dashboard → Authentication → Policies:

Enable RLS on tables: Task, Project, TaskComment, UserTenant, AuditEvent

Create policy on each table:
```sql
-- Authenticated users can only see their tenant's data
CREATE POLICY "tenant_isolation" ON "Task"
  FOR ALL TO authenticated
  USING ("tenantId" = (SELECT "tenantId" FROM "UserTenant"
    WHERE "userId" = auth.uid() LIMIT 1));
```

Note: This Supabase auth.uid() approach requires Clerk JWT to be configured with Supabase.
Simpler alternative for MVP: use service role key in app + enforce via application code only.
If Supabase/Clerk integration is complex: defer RLS + open VLT-S022-RLS-INTEGRATION.

### STEP 4a: Role-based ZenStack policies

In `libs/policies/schema.zmodel`, update Project model:
```
@@allow("read", auth().tenantId == tenantId)
@@allow("create", auth().tenantId == tenantId)           // Q-04: any member
@@allow("update", auth().tenantId == tenantId
  && (auth().role == 'owner' || auth().role == 'admin')) // Q-05: admin+ for updates
@@deny("delete", true)                                   // soft-delete only
```

For other permission gates (invite, archive, audit): use `hasPermission()` from `@csps/config`
in API route handlers — no need to add every permission to ZenStack:
```typescript
import { hasPermission } from '@csps/config';
// In route handler:
if (!hasPermission(session.role, 'memberInvite')) {
  return NextResponse.json({ error: 'insufficient_permissions' }, { status: 403 });
}
```

### STEP 4b: Seat limit enforcement

In `libs/integrations/clerk/webhook-handler.ts`, in `organizationMembership.created` handler,
add BEFORE creating UserTenant:
```typescript
import { getMaxSeats } from '@csps/config';

const currentCount = await db.userTenant.count({
  where: { tenantId: tenant.id, deletedAt: null }
});
const maxSeats = getMaxSeats(tenant.subscriptionStatus as any);
if (currentCount >= maxSeats) {
  // Log and return — cannot create UserTenant
  console.warn(`Seat limit reached for tenant ${tenant.id}`);
  return; // or throw — Clerk webhook must return 200 either way
}
```

### STEP 4c: Trial logic (request-time, no cron)

In `libs/integrations/clerk/webhook-handler.ts`, in `organizationMembership.created` handler,
AFTER creating UserTenant (if seat check passes):
```typescript
import { SUBSCRIPTION_CONFIG } from '@csps/config';

const memberCount = await db.userTenant.count({
  where: { tenantId: tenant.id, deletedAt: null }
});

if (memberCount === SUBSCRIPTION_CONFIG.trial.triggerOnMemberCount
    && tenant.subscriptionStatus === 'free') {
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + SUBSCRIPTION_CONFIG.trial.durationDays);
  await db.tenant.update({
    where: { id: tenant.id },
    data: { subscriptionStatus: 'trialing', trialEndsAt },
  });
}
```

Note: if `Tenant` model doesn't have `trialEndsAt DateTime?`, add it to `schema.zmodel` and run
`zenstack generate` + `pnpm exec prisma db push`.

### STEP 4d: Platform subscription primitives only

`getMaxSeats()` and `isTierActive()` are already in `libs/config/subscription.config.ts`.
No feature key enum. No `isFeatureEnabled()`. Apps own their feature semantics.

### STEP 4e: Verify

```bash
pnpm verify
```
PASTE output. Must be exit_code=0.

**Evidence:**
```
[S4-E1] Role gate: member → archive project → 403 { error: 'insufficient_permissions' }
[S4-E2] Seat limit: invite 3rd user to free org → seat limit hit (logged/rejected)
[S4-E3] Trial: 2nd member joins free org → subscriptionStatus='trialing', trialEndsAt set
[S4-E4] JWT: auth session includes { tenantId, role } — paste from browser devtools
```

---

## §SESSION-5 — Audit Completeness

**Prerequisite:** Session 3 complete. Session 4 not required (audit is independent).

Execute as specified in `docs/plan/_handoff/VAULT/topic-plans/enterprise-core-completion-plan.md`
§2 Session 5 (no amendments needed to that section).

**Evidence:**
```
[S5-E1] All mutations produce AuditEvent: task.updated, project.created, member.invited
        PASTE: Supabase AuditEvent rows for each type
[S5-E2] Audit API: GET /api/audit → array for admin, 403 for member
        PASTE: both responses
```

---

## §SESSION-6 — RLS + Bedrock Closure

**Prerequisite:** Sessions 3+4+5 complete.

### STEP 6a: Postgres RLS (if not already done in Session 4)

Run Supabase policies from §SESSION-4 STEP 4-RLS spec above.

### STEP 6b: ZenStack-integrated app template

Create `apps/template/` — a starting scaffold for App #2 and beyond.
Requirements for the template:
- `pnpm dev` works out of the box
- `getEnhancedDb()` is not bypassed (ZenStack enforce active from the start)
- Imports from `libs/integrations/` and `libs/config/` are wired via tsconfig paths
- `apps/template/.env.example` has DATABASE_URL + DIRECT_URL + CLERK_SECRET_KEY listed
- Clerk webhook route is scaffolded (not blank — has the handler pattern)
- `middleware.ts` has tenant isolation pattern wired

### STEP 6c: Update csps-bedrock.md

Mark bedrock item: `[ ] ZenStack-integrated app template` → `[x] ZenStack-integrated app template (S022 Session 6)`

Run `node tools/validators/validate-bedrock.mjs`.
PASTE output — must show 22/22 ✓.

### STEP 6d: Final verify

```bash
pnpm verify
```
PASTE output. Must be exit_code=0.

**Evidence:**
```
[S6-E1] Postgres RLS: direct Supabase SQL query without session var → 0 rows
[S6-E2] App template: pnpm dev starts, ZenStack active (no bypass comment)
[S6-E3] Bedrock: validate-bedrock.mjs → 22/22 ✓ 0 blocking
```

**Final declaration (use this exact format):**
```
ENTERPRISE CORE COMPLETE — S022 Session 6
pnpm verify: exit_code=0 [paste]
bedrock: 22/22 ✓
ZF deep: [paste node tools/zf-orchestrator.mjs --level 3 output]
All evidence blocks S3-E1 through S6-E3 pasted in session notes.
ai_defaults_influence: none (all Q-* items ratified before execution)
Ready for: App #2 build
```

---

## §GOVERNANCE — UPDATE-010 + UPDATE-011

### UPDATE-010: Add rigidity_level to spine matrix

File: `docs/plan/pillar-0-governance/ai-behavior-spine.md`

Add `rigidity_level` column to the discipline matrix. Use the classification from
`tools/council/opus-turn.md` Turn 2 (the full 52-row table).

Also add `rigidity_level` to `docs/plan/pillar-0-governance/frontmatter-closed-enums.md`:
```
rigidity_level: R1 | R2 | R3 | R4 | R5
  R1 = Absolute (stays in AGENTS.md)
  R2 = Platform-essential (domain cards §6)
  R3 = Context-conditional (context-loading templates)
  R4 = Training-default-override (inner-AI-defaults)
  R5 = Training-default-keep (inner-AI-defaults, keep disposition)
```

### UPDATE-011: AGENTS.md R1-only refactor

Only after UPDATE-010 is complete (spine matrix has all 52 rows).

R1 contracts to keep in AGENTS.md (14 unique):
B_AI_PROFESSIONAL_VOICE, B_VALIDATE_BEFORE_ASSUME, B_NO_FORCE_FIT, B_RZF,
B_FIVE_SURFACE_ENGRAVING, B_ALWAYS_GIT_LINKS, B_AGENT_ALIGNMENT_PROTOCOL,
B_PE_ALIGNMENT_GUARDIAN, B_CORE_SPINE_DISCIPLINE, B_ZERO_LAPTOP_DEPENDENCY,
B_NO_AI_IMPERSONATION, B_CONSENSUS_BEFORE_PROCEEDING, B_CONCEPT_LOAD,
B_COMPLETION_OVER_SHINY, B_HUMBLE_EXECUTOR

R2-R4 contracts: move their AGENTS.md hard-NO text to a cross-reference:
`❌ [Contract name] — see behavioral-contracts.md §B_[CONTRACT_NAME] (R2/R3/R4)`

Target: AGENTS.md < 100 lines after refactor.

---

## §OPUS-MODE-TEMPLATE — Create This File

Create `tools/council/opus-brief.template.md`:

```markdown
# OPUS MODE BRIEF — [arc name] — [session]
## Written by: OPUS-[N] ([model] in Opus-designated advisor mode)
## For: Sonnet Builder tab
## Authority: [Governor ratification date]

---

## PART A — Ratified Decision Register

| Q# | Decision | Ratified Value | Notes |
|---|---|---|---|
| Q-01 | | | |

Governor's binding qualifiers:
[Any runtime constraints that apply to every step]

---

## PART B — Flexibility Architecture

Every ratified value from Part A is encoded in config here.
Rule: changing a value = one line in one file.

[Config file contents]

---

## PART C — Session [N] Spec

Pre-flight:
[paste pre-flight block]

Steps:
[numbered steps with inline code]

Evidence gates (mandatory — paste all):
[S[N]-E1] [what to paste]

---

## PART N+1 — Immediate Mechanical Actions

[What Sonnet does before writing any code]

---

## PART N+2 — Flexibility Map

When [feedback type] arrives → edit [file] line [approx location].

[table: feedback | file | change]

---

*OPUS MODE BRIEF complete.*
*Sonnet: read top to bottom. Follow order. Don't skip evidence gates.*
```

---

## §FLEXIBILITY-MAP — When User Feedback Arrives

| Feedback | File to edit | What to change |
|---|---|---|
| "Trial should be 30 days" | `libs/config/subscription.config.ts` | `trial.durationDays: 14 → 30` |
| "Free tier should have 3 seats" | `libs/config/subscription.config.ts` | `seats.free: 1 → 3` |
| "Trialing seats too low" | `libs/config/subscription.config.ts` | `seats.trialing: 5 → N` |
| "Members should create projects" | Already true (Q-04: any member) | No change needed |
| "Only admins create projects" | `libs/config/roles.config.ts` | Remove 'member' from `projectCreate` |
| "Need a new webhook event" | `libs/integrations/clerk/webhook-handler.ts` | Add new `case` block |
| "New Stripe event type" | `apps/task-mgmt/src/app/api/webhooks/stripe/route.ts` | Add new `case` block |
| "New audit action" | `apps/task-mgmt/src/lib/audit.ts` | Add action string to calls |
| "New subscription tier" | `schema.zmodel` enum + `libs/config/subscription.config.ts` | Add to both |
| "New role type" | `schema.zmodel` MembershipRole enum + `libs/config/roles.config.ts` | Add to both |

---

## §VERIFICATION-CHECKLIST

Before declaring any session COMPLETE, confirm:

```
□ pnpm verify: exit_code=0 — PASTED
□ All session evidence blocks — PASTED
□ No new hardcoded values (all in libs/config/)
□ No features outside session scope added
□ git commit made with descriptive message
□ git push to origin (B_ZERO_LAPTOP_DEPENDENCY)
```

---

*OPUS MODE BRIEF — S022 Final*
*All 16 Q-* decisions ratified by Governor 2026-05-10*
*Flexibility doctrine: every value in config, zero hardcoded*
*Governor's qualifier: build flexibly — users will give feedback*
*OPUS #1 — Sonnet 4.6[1M] in Opus-designated advisor mode — 2026-05-11*
