---
id: csps.platform-audit.problems
name: platform-audit-problems
description: >
  Detailed description of the problems SaaS builders and AI-platform developers encounter
  on existing platforms. Covers both the technical SaaS construction problems (multi-tenancy,
  auth, billing, schema) and the AI governance problems (context rot, alignment drift,
  hallucination of state). This is the "why CSPS exists" artifact.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: platform_audit
enforcement_stage: active
tags:
  - domain:governance
  - domain:platform
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
session: S018
links:
  - { rel: parent, href: ./README.md }
  - { rel: solution, href: ./02-csps-principles.md }
  - { rel: overview, href: ./03-platform-overview.md }
---

# The Problems CSPS Solves

> Every CSPS design decision exists because of a specific failure mode. This document catalogs those failure modes from the field and from direct experience building AI-governed platforms.

---

## Part A: SaaS Builder Problems

### Problem 1 — Multi-Tenancy Is Rebuilt from Scratch Every Time

**What fails:** Every SaaS application needs to isolate data between customers (tenants). This requires: tenant identification in every API route, database-level isolation policies, JWT claims carrying tenant context, and consistent application of isolation checks across hundreds of endpoints.

**What actually happens:** Teams implement tenant isolation in Week 1, then gradually violate it as the codebase grows. A new endpoint is written without the `WHERE tenantId = ?` check. A background job runs without tenant context. A report query inadvertently returns cross-tenant data. Security audits find the leak months later.

**The compounding cost:** In a 30-app platform, re-implementing multi-tenancy 30 times means 30 opportunities to get it wrong. A single missed check in any app exposes all tenants of that app.

**What CSPS does:** Foundation slices (User, Tenant, UserTenant, AuditEvent) are defined once in `libs/policies/schema.zmodel`. ZenStack `@@allow` rules enforce tenant isolation at the ORM layer — every query is automatically scoped. No app developer writes a WHERE clause; the platform enforces it.

---

### Problem 2 — Auth + Billing Integration Is Brittle

**What fails:** Auth (who is this user?) and billing (are they paying?) are deeply intertwined but implemented separately. Common failure modes:
- User can access paid features after subscription cancels (billing event missed)
- User is charged but account isn't activated (webhook order dependency)
- Auth session carries stale tenant context (user switches org, old tenantId persists)
- Stripe + Clerk events arrive out of order; reconciliation fails silently

**What CSPS does:** `libs/integrations/clerk/` and `libs/integrations/stripe/` implement the event handlers once. Clerk → User/Tenant creation, Stripe → subscription lifecycle, both wired to AuditEvent for traceability. Every app inherits this through the integrations pattern.

---

### Problem 3 — Schema Changes Propagate as Breaking Changes

**What fails:** In a multi-tenant system, a schema migration that adds a NOT NULL column without a default value fails in production because existing tenant rows can't satisfy the constraint. Teams either:
- Use dangerous `SET DEFAULT` + backfill migrations that don't account for tenant isolation
- Avoid schema changes for months, accumulating technical debt
- Break production for existing tenants when deploying to new ones

**What CSPS does:** Prisma schema with `DIRECT_URL` for migrations, `DATABASE_URL` for pooled connections (Supabase Supavisor pattern). `validate-foundation-schema-drift.mjs` (Cycle 41) detects ZModel ↔ Prisma schema drift. Migration safety validator catches dangerous patterns before they reach production.

---

### Problem 4 — Technical Debt Is Invisible Until It's Structural

**What fails:** Features are built quickly. Governance is added "later." By the time governance is added, the codebase has hundreds of endpoints without consistent error handling, no audit trail, inconsistent naming, and no way to trace which change caused which behavior.

**Cost of retrofitting:** A system built without governance requires 3× the work to add it after the fact because every existing feature must be revisited. For a 30-app platform, that's an impossible backlog.

**What CSPS does:** `validate-bedrock.mjs` enforces that the foundation is complete before any app is built. 41 active validators catch governance violations at PR time, not at audit time. The `enforcement_stage` field tracks what's enforced vs. what's planned — no silent drift.

---

### Problem 5 — AI Code Tools Generate Platform-Unaware Code

**What fails:** Cursor, Lovable, GitHub Copilot, and similar tools generate code that:
- Doesn't know about the platform's tenant isolation pattern
- Invents naming conventions instead of following the established vocabulary
- Creates new abstractions that duplicate existing ones
- Passes validators that test syntax but not platform semantics

**The compound failure:** AI-generated code that passes type checking can still violate the platform's multi-tenant contract. The AI doesn't know `tenantId` must come from JWT claims, not a request body parameter. It doesn't know soft-delete is mandatory. It doesn't know AuditEvent must be written.

**What CSPS does:** AGENTS.md (3,096 words of governance constraints loaded at every session), 50 behavioral contracts, 19 hooks — together these make platform-aware code the path of least resistance for any AI working in the system.

---

## Part B: AI Governance Problems

### Problem 6 — Context Rot: Each Session Starts Ignorant

**What fails:** Every new AI session starts from zero. The AI has no memory of architectural decisions made last week, principles ratified last month, or failures discovered in the previous session. The same mistake gets made session after session because:
- There's no mechanical way to carry context across sessions
- Handoffs are written but never verified as complete
- New AI instances "fill in the gaps" with training defaults, which differ from platform conventions

**Cost:** 20-30% of every session is spent re-establishing context that was already established before. For a platform with 18 sessions of institutional knowledge, this is enormous waste.

**What CSPS does:** HANDOFF protocol (Zone A/B/C structured), session extraction, session-state.json (machine-readable state), memory files (persisted across sessions), and the GRACE context orchestrator (loads the minimum required context for the current task class automatically).

---

### Problem 7 — Alignment Drift: AI Behavior Diverges Silently

**What fails:** AI training bakes in defaults that conflict with platform conventions:
- Generic naming (not platform vocabulary)
- Reflexive try/catch wrappers (not platform error handling pattern)
- Narrative comments (not the "no-comment unless WHY is non-obvious" rule)
- Sycophantic response patterns (not the push-back-when-warranted rule)

These defaults don't trigger validators. They degrade code quality silently over months.

**What CSPS does:** `docs/plan/_handoff/VAULT/inner-ai-defaults/` — 10 category files registering each training default with its CSPS disposition (keep/override/adjust). `validate-inner-ai-defaults-freshness.mjs` catches when the registry drifts from the current model version. B_CONCEPT_LOAD ensures CONCEPT_LOAD fires before every response.

---

### Problem 8 — State Hallucination: AI Claims Done Without Evidence

**What fails:** AI assistants declare work complete based on:
- Memory of earlier tool calls (not re-running them)
- Pattern matching on what "usually" passes
- Optimistic inference ("this type of change should pass")

In a governance-heavy platform, this is catastrophic: the AI signs off on a ZF gate without running the validators. The commit is pushed. Production breaks.

**What CSPS does:** ZF Mandate Protocol — every DONE/COMPLETE/RATIFIED claim requires THIS-SESSION validator evidence. The RZF (Re-Zero Findings) principle: memory of earlier runs is not evidence; re-run IS the proof. Hooks catch nominal ZF (timestamp-touch without actual run) and block it.

---

### Problem 9 — Token Cost Is Unmanaged Until Catastrophic

**What fails:** AI sessions accumulate context indiscriminately:
- Every file read stays in context forever
- Tool output is pasted inline (10,000 tokens for a grep result)
- Sessions run to auto-compact at 95% (destructive content loss)
- Same governance principles are re-loaded every session (85K tokens)

**What CSPS does:** B_TOKEN_BUDGET (8-rule ratified contract) + GRACE architecture (5-tier graduated context loading) + context-orchestrator (task-class detection → minimal required bundle injection) + principles-mcp (targeted retrieval vs bulk loading).

---

### Problem 10 — No Auditability: Decisions Have No Trail

**What fails:** AI-assisted development produces decisions without records:
- "We decided to use Supabase" — when? why? what alternatives were rejected?
- "The RLS approach was changed" — by whom? under what constraint?
- "The schema was simplified" — which session? what was the blast radius?

When something breaks, there's no trace. When an architectural question recurs, the context is gone.

**What CSPS does:** Governor Prompts (every prompt logged with verbatim + tags + distribution targets), ADR registry (architectural decisions with rationale), session extractions (positive ZF harvest), HPFA (pre-handoff audit), AuditEvent schema (DB-level append-only trail). Every decision has a paper trail.

---

## Summary: The Gap

Existing platforms solve construction problems (how to build one SaaS app). CSPS solves the **platform problem** (how to build 30+ apps systematically while accumulating capability rather than debt) and the **AI governance problem** (how to use AI as a governed collaborator rather than an unpredictable code generator).

The two problems are deeply connected: AI code generation without platform governance produces the same multi-tenancy, schema, and audit failures that human teams produce — just faster.
