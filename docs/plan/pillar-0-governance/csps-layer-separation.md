---
id: csps.pillar-0-governance.csps-layer-separation
name: csps-layer-separation
description: >
  Canonical definition of the CSPS layer separation: Core Layer vs App Layer.
  The core is platform infrastructure that every app inherits automatically.
  The app layer is individual SaaS products built on top of the core.
  This separation governs build priority, session mandate scope, and what counts
  as "platform work" vs "product work." Governor directive S016.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
core_spines: [GVRN, ARCH]
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
  - docs/plan/pillar-0-governance/csps-bedrock.md
  - docs/plan/pillar-0-governance/csps-core-manifest.md
  - docs/plan/pillar-1-product/graduation-path.md
links:
  - { rel: parent, href: ./README.md }
  - { rel: bedrock, href: ./csps-bedrock.md }
  - { rel: core-manifest, href: ./csps-core-manifest.md }
domain_path: platform
diataxis_type: explanation
core_spine: ARCH
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# CSPS Layer Separation

> **Core first. Always.**
> The core layer must be complete before any app can claim to be built on the CSPS platform.
> An app built on an incomplete core is a local product, not a platform product.

---

## §1 The Two Layers

### Core Layer — Platform Infrastructure

**Definition:** Everything in the CSPS platform that every SaaS app built on CSPS inherits automatically, without the app developer needing to implement it.

**Location:** `libs/`, `tools/`, `docs/plan/pillar-0-governance/`, `packages/`

**Contents:**
- `libs/integrations/clerk/` — auth wiring: webhook handler, JWT session context
- `libs/integrations/stripe/` — billing: customer creation, subscription trigger
- `libs/policies/slices/` — ZModel schemas: User, Tenant, UserTenant, AuditEvent + app slices
- `tools/validators/` — 38 validators that enforce platform discipline
- `tools/templates/` — plan templates, PE schema, chat state snapshot
- `docs/plan/pillar-0-governance/` — principles, contracts, protocols, methodology
- `packages/principles/` — 55 principles as YAML

**Core is complete when:** `validate-bedrock.mjs` exits 0 with all mandatory items done (not deferred).

---

### App Layer — Individual SaaS Products

**Definition:** Individual SaaS products built ON TOP of the core. Each app has domain-specific schema, routes, and UI. Apps inherit auth, billing, audit, and tenant isolation from the core.

**Location:** `apps/*`

**Contents (per app):**
- Domain schema (project.zmodel, task.zmodel — their specific entities)
- API routes (CRUD for their domain)
- UI (Next.js pages, Tailwind components)
- .env.local (their credentials — Supabase, Clerk, Stripe)
- Webhook routes (wired to libs/integrations)

**App work is Governor-triggered by default — but Governor override always applies:** Running `pnpm db:push`, setting up credentials, testing with real users, shipping features — these are product decisions made by the Governor when ready. The AI executes them fully when directed. The separation governs who *initiates* the work, not whether the AI can help.

**The concept (not the rule):** App-layer work appearing proactively in AI mandates = AI prioritizing local optimization (one app) over global optimization (platform bedrock for all 30 apps). The Governor, not the AI, decides when app investment is the right priority.

---

## §2 The Hard Boundary

| Activity | Layer | Who triggers |
|---|---|---|
| Installing ZenStack | Core | AI session mandate (VLT-S016-ZENSTACK) |
| Writing RLS policies | Core | AI session mandate (after ZenStack) |
| Schema drift validator | Core | AI session mandate |
| Plan Methodology v2 L3/L4 | Core | AI session mandate |
| Week-4 validators | Core | AI session mandate |
| `pnpm db:push` on any app | App | **Governor action** (requires real credentials) |
| Running `pnpm dev` for an app | App | **Governor action** (testing) |
| Adding features to task-mgmt | App | **Governor action** (product decision) |
| Building app #2 | App | **Governor action** (after bedrock complete) |
| Shipping to production | App | **Governor action** (after live validation) |

**The boundary rule:** If an activity requires Governor credentials (database passwords, API keys, deployment access) → it is an App layer activity. The AI executes Core layer work. The Governor triggers App layer work.

---

## §3 Build Priority Rule

**Core first. Always. No exceptions.**

The PE score for any App layer activity is automatically capped below the PE score of any incomplete Core layer item. This is not a guideline — it is the CSPS build architecture.

**Why:** An app built on an incomplete core inherits the core's gaps. Those gaps multiply: one missing core item × 30 apps = 30 apps with the same foundational problem. Completing the core ONCE protects all 30 apps simultaneously. Building an app first protects ONE app — and only temporarily.

**Mechanical enforcement:**
- `AGENTS.md` hard NO: BEDROCK FIRST (app #2 blocked until validate-bedrock.mjs CLEAN)
- `validate-bedrock.mjs`: reports bedrock completion %, blocks when mandatory items incomplete
- Session mandate scope: AI session mandates are Core-layer work only unless Governor explicitly assigns App-layer work

---

## §4 What task-mgmt app IS and ISN'T

**`apps/task-mgmt/` IS:**
- App #1 — the first proof-of-concept app built on the core
- A validation vehicle for the schema and auth patterns
- A scaffold that demonstrates the correct architecture for all future apps
- COMPLETE as a scaffold (TypeScript 0 errors, CRUD routes wired, AuditEvent instrumented)

**`apps/task-mgmt/` is NOT:**
- A core platform deliverable
- Something the AI should drive to "completion" (live deployment requires Governor credentials)
- Part of an AI session mandate (live DB push, dev server testing, feature additions)

**The task-mgmt app is DONE as a core validation artifact.** Its ongoing development (live deployment, production shipping, feature additions) is Governor-driven product work.

---

## §5 Graduation (long-term)

At $1K MRR (VLT-S014-004), task-mgmt graduates from CSPS: it gets its own repo, its own schema.prisma, and connects to the CSPS platform via `@csps/foundation` package rather than direct libs/ imports. See [graduation-path.md](../pillar-1-product/graduation-path.md) for the extraction design.

Until graduation: `apps/task-mgmt/` lives in the CSPS monorepo but is treated as App layer, not Core layer.
