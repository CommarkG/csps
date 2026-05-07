---
id: csps.pillar-0-governance.csps-bedrock
name: csps-bedrock
description: >
  Canonical register of the CSPS Platform Bedrock — the minimum viable foundation that must be
  in place before ANY SaaS app is built, validated, or shipped. Bedrock = what every app inherits
  automatically. Bedrock complete = the platform can deliver its DNA promise to all 30 apps.
  Declared by Governor S016. Mechanically enforced by validate-bedrock.mjs.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, OPER, VALD]
schema_anchor: platform_governance
tags:
  - domain:governance
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
session: S016
impl_status: swift-implemented
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/csps-core-manifest.md
  - docs/plan/pillar-0-governance/csps-platform-dna.md
  - docs/plan/_handoff/VAULT/topic-plans/foundation-slices.md
  - docs/plan/_handoff/VAULT/topic-plans/plan-methodology-v2.md
  - tools/validators/validate-bedrock.mjs
links:
  - { rel: parent, href: ./README.md }
  - { rel: core-manifest, href: ./csps-core-manifest.md }
  - { rel: platform-dna, href: ./csps-platform-dna.md }
  - { rel: validator, href: ../../../tools/validators/validate-bedrock.mjs }
  - { rel: open-frontiers, href: ../../pillar-6-operations-and-delivery/open-frontiers.md }
---

# CSPS Platform Bedrock

> **Context is the palace. Alignment is the King. Timing is the Queen.**
>
> The bedrock is the floor of the palace — the foundation that holds everything up.
> No app is built until the bedrock is solid. No app is shipped until the bedrock is validated.
> Every decision made on top of an incomplete bedrock compounds the gap across all 30 apps.

## §1 What Bedrock Means

**Bedrock** = the set of platform capabilities that every CSPS SaaS app inherits automatically, without the app developer needing to implement them.

When bedrock is complete, an app developer can:
1. Fork the app template
2. Define their domain schema (entities specific to their app)
3. Write their business logic (CRUD, workflows, triggers)
4. Ship — with multi-tenant security, auth, billing, audit, and governance already working

**Bedrock is NOT complete when:**
- Any app developer would need to re-implement a platform-level concern for their app
- Multi-tenant security relies on application code alone (no DB-level enforcement)
- The build methodology for new apps is still in-progress
- A foundational decision has been deferred without a tracked unblock trigger

**Bedrock vs. Features:**
- Bedrock: tenant isolation, auth wiring, billing trigger, schema drift detection, build methodology
- Features: task management, booking, CRM, etc. — these are app-level, not bedrock

---

## §2 The 5 Bedrock Layers

### Layer 1 — Governance Core (GVRN spine)
*The rules that govern every decision in every app build.*

| Item | Status | Evidence |
|---|---|---|
| 5 Core Spines (L0 manifest + L1 sealed + L2 domain) | ✅ COMPLETE | `.claude/core-spines/` |
| 55 principles (P-META-* + P-ARCH-* + P-OP-*) | ✅ COMPLETE | `packages/principles/principles.yaml` |
| 46 behavioral contracts (B_*) | ✅ COMPLETE | `behavioral-contracts.md` |
| 37 active validators | ✅ COMPLETE | `tools/verify.mjs` |
| 19 hooks (19 present, 10 production, 9 stub→week-4) | ✅ COMPLETE | `.claude/hooks/` |
| ZF Mandate Protocol (pnpm zf / zf:phase / zf:deep) | ✅ COMPLETE | `zf-mandate-protocol.md` |
| FOUNDATION_EXIT_GATE (validate-phase-exit-criteria.mjs) | ✅ COMPLETE | `tools/validators/` |
| B_COMPLETION_OVER_SHINY (1.5× PE weight, shiny-object prevention) | ✅ COMPLETE | `behavioral-contracts.md` §B_COMPLETION_OVER_SHINY |
| B_PLATFORM_FIRST_OPTIMIZATION (global over local) | ✅ COMPLETE | `behavioral-contracts.md` §B_PLATFORM_FIRST_OPTIMIZATION |
| Plan Methodology v2 (B_HUMBLE_EXECUTOR + B_AUTONOMOUS_BATCH) | **⏳ S016 L2** | `topic-plans/plan-methodology-v2.md` |

**Layer 1 status: 9/10 complete. Blocking item: Plan Methodology v2 L2 (S016 mandate).**

---

### Layer 2 — Schema Security Core (ARCH spine)
*The data model + tenant isolation that every app inherits.*

| Item | Status | Evidence |
|---|---|---|
| Foundation ZModel: User, Tenant, UserTenant, AuditEvent | ✅ COMPLETE | `libs/policies/slices/public/` |
| App ZModel: Project, Task, TaskComment + enums | ✅ COMPLETE | `libs/policies/slices/public/` |
| Prisma schema (task-mgmt mirror of ZModel) | ✅ COMPLETE | `apps/task-mgmt/prisma/schema.prisma` |
| Application-level tenant isolation (WHERE tenantId = JWT tenantId) | ✅ COMPLETE | All API routes in `apps/task-mgmt/` |
| ZenStack installation in project | **⏳ VLT-S016-ZENSTACK** | Unblocked: `apps/task-mgmt/` now exists |
| DB-level RLS policies (Postgres Row Level Security per tenant) | **⏳ VLT-S016-ZENSTACK** | Blocked by ZenStack installation |
| `validate-foundation-schema-drift.mjs` in pnpm verify | **⏳ VLT-S016-ZENSTACK** | Blocked by ZenStack (ZModel→Prisma generation needed) |
| `foundation-slices-schema-drift` audit slug active | **⏳ VLT-S016-ZENSTACK** | Deferred with ZenStack |

**Layer 2 status: 4/8 complete. Blocking item: ZenStack + RLS (VLT-S016-ZENSTACK). App-level isolation is functional for dev; not production-grade without DB-level RLS.**

---

### Layer 3 — Auth + Billing Core (ARCH + OPER)
*The identity and payment infrastructure every app inherits.*

| Item | Status | Evidence |
|---|---|---|
| Clerk webhook handler: user.created → User row | ✅ COMPLETE | `libs/integrations/clerk/webhook-handler.ts` |
| Clerk webhook: org.created → Tenant + UserTenant + User.tenantId | ✅ COMPLETE | Same |
| Clerk JWT custom claim: tenantId in session (buildSessionClaims) | ✅ COMPLETE | `libs/integrations/clerk/session-context.ts` |
| Stripe customer creation on org creation | ✅ COMPLETE | `libs/integrations/stripe/customer-service.ts` |
| Billing trigger: 2nd UserTenant → Stripe subscription | ✅ COMPLETE | `apps/task-mgmt/.../webhooks/clerk/route.ts` |
| Billing inbound: subscription.created → subscriptionStatus | ✅ COMPLETE | `apps/task-mgmt/.../webhooks/stripe/route.ts` |
| AuditEvent instrumentation pattern (writeAuditEvent helper) | ✅ COMPLETE | `apps/task-mgmt/src/lib/audit.ts` |
| Supabase Supavisor pooler pattern (DATABASE_URL + DIRECT_URL) | ✅ COMPLETE | `.env.example` (VLT-S015-003) |

**Layer 3 status: 8/8 COMPLETE. ✅**

---

### Layer 4 — App Template Core (ARCH)
*The scaffold every new CSPS app begins from.*

| Item | Status | Evidence |
|---|---|---|
| Sandbox scaffold (Phase 4 — auth wiring + Stripe scaffold validated) | ✅ COMPLETE | `apps/sandbox/` commit b05685c |
| Next.js 14 + Tailwind + Clerk + Stripe + Prisma scaffold | ✅ COMPLETE | `apps/task-mgmt/` |
| @csps/integrations tsconfig path alias pattern | ✅ COMPLETE | `apps/task-mgmt/tsconfig.json` (VLT-S015-005) |
| Task + Project CRUD with AuditEvent (proven pattern) | ✅ COMPLETE | `apps/task-mgmt/src/app/api/` |
| Task list + create UI (Tailwind, functional) | ✅ COMPLETE | `apps/task-mgmt/src/app/tasks/` |
| Live DB validation (pnpm db:push on Supabase) | **⏳ PENDING** | Requires user .env.local credentials |
| ZenStack-integrated app template | **⏳ VLT-S016-ZENSTACK** | Blocked by Layer 2 L3 |

**Layer 4 status: 5/7 complete. Blocking items: live DB validation (user action) + ZenStack integration (VLT-S016-ZENSTACK).**

---

### Layer 5 — Build Methodology Core (AI + GVRN)
*The discipline that ensures every app is built correctly.*

| Item | Status | Evidence |
|---|---|---|
| gradual-build-plan template with §HARVEST + execution_mode | ✅ COMPLETE | `tools/templates/gradual-build-plan.template.md` |
| plan-creation-protocol Step 0 (foundation + completion + platform-first gates) | ✅ COMPLETE | `pillar-0-governance/plan-creation-protocol.md` |
| ZF orchestrator (Level 1/2/3 gates) | ✅ COMPLETE | `tools/zf-orchestrator.mjs` |
| Pre-flight scan format (Q-GATE + Q-COMPLETION + Q-GLOBAL) | ✅ COMPLETE | `behavioral-contracts.md` §B_AUTONOMOUS_BATCH_WITH_PREFLIGHT (pending) + plan-creation-protocol |
| B_HUMBLE_EXECUTOR (closed-circle milestone protocol) | **⏳ S016 L2** | `topic-plans/plan-methodology-v2.md` |
| B_AUTONOMOUS_BATCH_WITH_PREFLIGHT (pre-flight discipline) | **⏳ S016 L2** | Same |
| Chat State Snapshot template (intra-session continuity) | **⏳ S016 L2** | Same |

**Layer 5 status: 4/7 complete. Blocking items: plan-methodology-v2 L2 (S016 mandate).**

---

## §3 Bedrock Completion — Two Root Decisions Missing

All 62 open platform items collapse to **2 root decisions**. Everything else is downstream.

### ROOT BLOCKER 1 — ZenStack Installation (VLT-S016-ZENSTACK)

**What it unblocks:** DB-level RLS, schema drift validator, ZenStack-integrated app template, foundation-slices §11 closure.

**Current state:** Application-level tenant isolation IS in place (Prisma WHERE tenantId). Production-grade requires DB-level defense-in-depth.

**Tracking:** VLT-S016-ZENSTACK — registered in session-state.json. Unblocked: apps/task-mgmt/ now exists (the missing dependency). Ready to schedule.

**Downstream items unlocked by this decision (4 items):**
- DB-level RLS policies (Postgres Row Level Security per tenant)
- validate-foundation-schema-drift.mjs in pnpm verify
- foundation-slices-schema-drift audit slug active
- ZenStack-integrated app template
- foundation-slices §11 closure attestation

---

### ROOT BLOCKER 2 — Plan Methodology v2 L2 (S016 mandate)

**What it unblocks:** B_HUMBLE_EXECUTOR (milestone protocol at every phase gate), B_AUTONOMOUS_BATCH_WITH_PREFLIGHT (pre-flight discipline for every implementation batch), Chat State Snapshot (intra-session continuity), assumption blocks in plans.

**Current state:** Plans have §HARVEST and execution_mode. The build discipline for how EVERY app is built is 4/7 (missing the runtime methodology — Humble Executor + autonomous batch + chat snapshots).

**Tracking:** plan-methodology-v2.md §2 — S016 primary mandate.

**Downstream items unlocked (3 items):**
- B_HUMBLE_EXECUTOR contract (5/5 FSE)
- B_AUTONOMOUS_BATCH_WITH_PREFLIGHT contract (5/5 FSE)
- Chat State Snapshot template

---

### PENDING USER ACTION (not a blocker, user-triggered)

- `pnpm db:push` in apps/task-mgmt/ with real `.env.local` credentials → validates schema on live Supabase

---

### Bedrock Completion Checklist (for validate-bedrock.mjs)

```
Layer 1 — Governance Core:
  [x] Core Spines + principles + contracts + validators + hooks
  [x] ZF Mandate Protocol + FOUNDATION_EXIT_GATE
  [x] B_COMPLETION_OVER_SHINY + B_PLATFORM_FIRST_OPTIMIZATION
  [ ] Plan Methodology v2 L2 (B_HUMBLE_EXECUTOR + B_AUTONOMOUS_BATCH) → S016

Layer 2 — Schema Security Core:
  [x] Foundation + App ZModel slices
  [x] Prisma schema + application-level tenant isolation
  [ ] ZenStack installation + DB-level RLS → VLT-S016-ZENSTACK (S017)
  [ ] validate-foundation-schema-drift.mjs → VLT-S016-ZENSTACK (S017)

Layer 3 — Auth + Billing Core:
  [x] Clerk auth wiring (all webhook events)
  [x] JWT tenantId claim (buildSessionClaims)
  [x] Stripe customer + billing trigger (both directions)
  [x] AuditEvent pattern

Layer 4 — App Template Core:
  [x] Next.js 14 + Tailwind + Clerk + Stripe + Prisma scaffold
  [x] @csps/integrations pattern
  [x] CRUD with AuditEvent (proven)
  [ ] Live DB validation (user action: pnpm db:push with .env.local)
  [ ] ZenStack-integrated template → VLT-S016-ZENSTACK

Layer 5 — Build Methodology Core:
  [x] gradual-build-plan template + plan-creation-protocol
  [x] ZF orchestrator gates
  [ ] B_HUMBLE_EXECUTOR + B_AUTONOMOUS_BATCH → S016
  [ ] Chat State Snapshot → S016
```

**Root decisions missing: 2 (ZenStack + Plan Methodology v2 L2)**
**Items gated by those decisions: 7**
**Items complete: 14/21 (67%)**
**Items complete or explicitly tracked: 21/21 (100%)**

---

## §4 What "Bedrock Complete" Unlocks

When bedrock is complete (all 30 items ✅):
- App #2 can be built with full confidence that platform concerns are inherited
- ZenStack/RLS means a SQL injection or authorization bug in app code cannot leak cross-tenant data
- B_HUMBLE_EXECUTOR means every app build pauses at milestones to validate assumptions
- Every new app developer gets a working scaffold with security, billing, and audit baked in

**The order matters:** bedrock before apps. Apps built on 73% bedrock carry 27% debt forward into every feature they ship.

---

## §5 Mechanical Enforcement

**Validator:** `validate-bedrock.mjs` (registered S016) — reads this file's checklist, counts unchecked items, emits BLOCKING when mandatory items remain open before phase advance.

**AGENTS.md hard NO:** Never declare the platform's bedrock complete without `validate-bedrock.mjs` exit code 0.

**session-open.sh:** Bedrock completion % surfaced at Threshold (next session).

**Open frontier:** ZenStack installation is tracked as `F-ZENSTACK` in open-frontiers.md. Discovery trigger: VLT-S016-ZENSTACK ratification.
