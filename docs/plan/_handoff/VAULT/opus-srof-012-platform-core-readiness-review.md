---
id: csps.handoff.vault.opus-srof-012
name: opus-srof-012-platform-core-readiness-review
description: >
  SROF-012: Multi-perspective platform review submitted to Opus for ratification.
  Covers developer journey, external user paths, permissions/tiers, bottlenecks,
  documentation architecture, consolidation, and internal doc template enforcement.
  Purpose: enhance the platform core before declaring readiness for apps 3-30.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S029
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
scope_level: S1
---

# SROF-012: Platform Core Readiness — Multi-Perspective Review

> **Prepared by:** Sonnet S029 | **For:** Opus ratification
> **Context:** Gate 3 (Budget Planner) is live at csps-budget-planner.vercel.app.
> Platform has 104 validators, pnpm verify exit_code 0, GRL 0 open.
> This document captures multi-perspective findings on what needs enhancement
> before the platform is truly ready to scale from 1 app to 30 apps.

---

## §1 — Developer Journey Analysis

**Source:** Specialist review of `apps/template/`, `apps/budget-planner/`, `libs/integrations/`, `pillar-1-architecture/`

### Finding DJ-1: apps/template/ is documentation only — no runnable scaffold

`apps/template/` contains 2 files: `README.md` + `.env.example`. There is no `src/`, no `package.json`, no `next.config.js`, no `vercel.json`. A developer adding App #3 must:
1. Copy `apps/budget-planner/` wholesale
2. Manually strip all budget-specific domain logic (routes, models, UI)
3. Reverse-engineer the structure from App #2 code

This is undocumented as the actual procedure. Time to first Vercel deployment: **1-2 days** (experienced developer), **3-5 days** (new to Clerk/Supabase/ZenStack).

**Gap severity:** HIGH — every new app incurs this debt. At 30 apps, this compounds.

### Finding DJ-2: Three critical friction points for new developers

1. **Template is docs-only**: No runnable Next.js scaffold exists. Copy budget-planner + strip domain = error-prone manual process.

2. **ZenStack path bug is undocumented in the template**: The `.zenstack/enhance.js` → `@zenstackhq/runtime/.zenstack/` copy step is in MEMORY.md and the postinstall script, but NOT in `apps/template/README.md`. A developer following the template gets a silent runtime failure with no error pointing to the cause.

3. **No ADRs in pillar-1-architecture/**: `docs/plan/pillar-1-architecture/` has zero `.md` files. No architectural decision records explain: why the shared schema monolith, why flat ZModel assembly (VLT-S017-FLATSCHEMA comment in schema.zmodel is the only rationale), why `auto_org` vs `manual` flow. New developers encounter unexplained constraints.

### Opus Questions — Developer Journey

**Q-DJ-1:** Should `apps/template/` contain a minimal but complete runnable Next.js scaffold (package.json, src/app/layout.tsx, src/middleware.ts, sign-in/sign-up pages, next.config.js, vercel.json) that a developer can fork without touching budget-planner? What is the minimum viable scaffold that avoids duplicating domain logic?

**Q-DJ-2:** Should pillar-1-architecture/ contain ADRs for the top 5 architectural decisions (shared schema, flat ZModel, auto_org, ZenStack enhance path, transpilePackages pattern)? Is there a template already in tools/templates/ for ADRs?

---

## §2 — External User Journey

**Source:** Review of middleware.ts, sign-in/sign-up pages, Clerk webhook handler, budget-setup flow

### Finding EU-1: Sign-up to dashboard path has a timing gap

Flow: User signs up → Clerk fires `user.created` webhook → webhook creates User row → Clerk fires `organization.created` (auto_org) → webhook creates Tenant + UserTenant → user's JWT gains tenantId claim (after next sign-in).

**The gap:** Between sign-up and the next JWT refresh (up to 5 minutes due to Clerk JWT TTL), the user's session has no `tenantId`. Hitting `/dashboard` during this window returns 403 `no_tenant` redirect to `/sign-in` — a confusing experience that looks like a broken login, not a "setting up your account" state.

### Finding EU-2: No "pending setup" state or loading UI

There is no intermediate page or loading state for "your account is being set up." The user sees: sign-up → redirect to `/dashboard` → 403 → redirect to `/sign-in` (infinite loop until JWT refreshes or user manually refreshes after ~5 min). No error page exists at `/account-setup` or similar.

### Finding EU-3: Threshold Wizard gate is server-enforced but has no UX guide

`page.tsx:24-26`: if `budgetGoal` doesn't exist → redirect to `/budget-setup`. The `/budget-setup` page exists but there is no wizard progress indicator, no "step 1 of 3" UX, and no skip mechanism. First-time users land in a blank form with no context about why they're there.

### Opus Questions — External User Journey

**Q-EU-1:** What is the correct pattern for handling the JWT-refresh gap between sign-up and first tenantId availability? Options: (A) polling endpoint that checks tenantId and shows "setting up" UI, (B) Clerk's `__session_variables` callback to immediately set tenantId, (C) synchronous organization creation in the `user.created` webhook before returning. Which approach fits CSPS's auto_org pattern?

**Q-EU-2:** Should there be a platform-level "account setup in progress" page (S1 scope) that all apps can reuse? Or is this S2 per-app UX?

---

## §3 — Tiers and Permissions Review

**Source:** schema.zmodel, zenstack.ts, categories/route.ts, webhook-handler.ts

### Finding P-1: staffRole self-promotion gap — CRITICAL

`schema.zmodel:141`: `@@allow("update", auth().id == id)` — a user can update their own User record. `staffRole` is a field on `User`. If the API layer (`settings/account/route.ts`) does not explicitly strip `staffRole` from user-provided update payloads, a user can self-promote to staff bypass.

Staff bypass grants read access to ALL tenants: `@@allow("read", auth().staffRole != null)` at schema.zmodel:168, 188, 208. This is a potential privilege escalation vector. **Needs immediate verification.**

### Finding P-2: User model has cross-tenant read by design — needs explicit documentation

`schema.zmodel:140`: `@@allow("read", auth().tenantId != null)` on User — any authenticated user in any tenant can read User records from other tenants. This is intentional (task assignee display) but is cross-tenant data exposure without a role gate. It needs an explicit `@@deny` for sensitive fields or a field-level policy.

### Finding P-3: Roles are stored and synced but not enforced at MVP

Three roles exist (`owner/admin/member`) and are synced via Clerk webhooks. No API route enforces role differences in budget-planner. `role` is decorative in App #2. This is a conscious MVP decision but must be addressed before App #3 if it is a B2B app.

### Finding P-4: COUNT hot path on membership events

`webhook-handler.ts:121`: `userTenant.count({where: {tenantId, deletedAt: null}})` fires on EVERY `organizationMembership.created` event to check trial trigger. At 1M membership events, this is a hot COUNT query per event with no caching or batch processing.

### Finding P-5: Shared Supabase project is the real scale ceiling

All 30 apps share one Supabase instance. At 100K tenants × average 10K rows per model, the pooler connection contention becomes the ceiling before any application-level bottleneck.

### Opus Questions — Permissions

**Q-P-1:** Should the `staffRole` field have a `@@deny` for self-update? What is the correct ZModel policy to prevent `@@allow("update", auth().id == id)` from covering sensitive fields like `staffRole`? Can ZenStack do field-level deny?

**Q-P-2:** Should cross-tenant User reads be scoped to only the `displayName` and `id` fields (projection policy) rather than the full User record? What is the ZModel syntax for field-level @@allow?

**Q-P-3:** Is there a pattern for rate-limiting or batching the trial trigger COUNT query? Should it move to a queue (Inngest, Trigger.dev, Supabase Edge Functions) with eventual consistency?

---

## §4 — Bottlenecks and Overload

**Source:** balance/route.ts, transactions/route.ts, verify.mjs, schema.zmodel indexes

### Finding B-1: balance/route.ts has an unbounded full-table-scan path — CRITICAL

`balance/route.ts:48` with `?all=true`: unbounded `findMany` with no `take`, no cursor. Fetches ALL transactions for a tenant into Node.js memory, then aggregates in JS. At 100K transactions this is:
- Full table scan
- Full network transfer of result set
- In-process aggregation loop

Vercel function timeout is 30 seconds. A tenant with large transaction history will hit OOM or timeout. The fix is a `groupBy` aggregate query or raw SQL `SUM … GROUP BY categoryId`.

### Finding B-2: Missing partial index for `deletedAt IS NULL`

Balance queries filter `{tenantId, deletedAt: null}`. The composite index `@@index([tenantId, type, date])` does not include `deletedAt`. Postgres fetches soft-deleted rows then discards them post-scan. A partial index `WHERE deletedAt IS NULL` would fix this but ZModel doesn't expose partial index syntax today.

### Finding B-3: 104 validators running sequentially — CI bottleneck at scale

`tools/verify.mjs` runs 104+ validators as sequential child-process spawns. No parallelism. At 150+ validators (likely by S032), a full verify pass will exceed 90s and become a CI bottleneck. Additionally, 5 frontmatter validators each parse all .md files independently — redundant file I/O on every verify run.

### Finding B-4: No rate limiting, circuit breakers, or retry patterns

All API routes call `auth()` (external Clerk network call) + 2+ DB queries with no retry or fallback. A Clerk latency spike cascades to 500s across all budget endpoints. No middleware-level rate limiting exists.

### Finding B-5: No production monitoring artifacts

No alerting config, metrics collection, or SLA definition files found. `platform-health-questions.md` and `system-health-plan.md` are governance documents, not wired instrumentation.

### Opus Questions — Bottlenecks

**Q-B-1:** What is the correct pattern for the balance aggregate? Options: (A) Prisma `groupBy` with `_sum`, (B) raw SQL via `$queryRaw`, (C) materialized view in Supabase updated on transaction write. Which aligns with CSPS's ZenStack-first architecture?

**Q-B-2:** Should there be a platform-level rate limiting middleware (S1 scope) that all apps inherit? What is the recommended pattern for Next.js App Router (middleware.ts at the platform level)?

**Q-B-3:** Should `pnpm verify` support a `--fast` flag that runs only blocking validators, skipping advisory ones? How should the 5 frontmatter validators be consolidated into a shared parse pipeline?

---

## §5 — Documentation Architecture

**Source:** docs/plan/ structure, tools/validators/, .claude/core-spines/, CLAUDE.md files

### Finding D-1: No code→doc enforcement mechanism

No hook, validator, or CI step enforces that a code change triggers a doc update. Schema changes do not auto-update `schema-index.md`. New enum values do not auto-update `frontmatter-closed-enums.md`. API route changes do not update architecture docs. Behavioral contracts and architecture docs can silently diverge from code.

### Finding D-2: Five fastest-staling docs with no enforcement

1. `schema-index.md` — references schema structure; no validator pins it to `schema.zmodel` reality
2. `frontmatter-closed-enums.md` — manually curated; new enums added to schema won't auto-update it
3. `model-routing-dashboard.md` — model routing rules; no tie to actual model usage
4. `daily-update-plan.md` — date-stamped entries accumulating with no archival rule
5. ADRs (none exist) — architectural decisions made verbally or in comments, never recorded

### Finding D-3: Consolidation opportunities in validators

Five validators each independently parse all `.md` files for frontmatter:
- `validate-frontmatter.mjs`
- `validate-nothing-stands-alone.mjs`
- `validate-schema-anchors.mjs`
- `validate-corespine-depth-markers.mjs`
- `validate-frontmatter-count-consistency.mjs`

This is the highest-value consolidation target: a shared frontmatter-parse utility feeding all checks eliminates ~4× redundant file I/O.

Additional duplicates:
- `tools/council/opus-brief.template.md` duplicates `tools/templates/opus-brief.template.md`
- `validate-template-compliance.mjs` + `validate-template-grade.mjs` should merge
- Three Opus-RZF validators (`validate-rzf-evidence.mjs`, `validate-opus-turn-rzf.mjs`, `validate-opus-rzf-gap-tracking.mjs`) overlap

### Opus Questions — Documentation

**Q-D-1:** Should there be a nightly Vercel cron job (or GitHub Actions schedule) that runs `validate-slice-freshness.mjs` and `validate-generated-artifact-freshness.mjs`, then posts a report? What is the right cadence for doc-freshness checks?

**Q-D-2:** Should CSPS maintain a living ADR log at `docs/plan/pillar-1-architecture/ADR/ADR-NNNN.md`? What decisions made to date (shared schema monolith, flat ZModel, ZenStack enhance path fix, transpilePackages pattern, auto_org) should be immediately recorded as ADRs?

**Q-D-3:** What is the right consolidation approach for the 5 frontmatter validators? A shared `libs/validator-utils/frontmatter-parser.mjs` utility, or a meta-validator that orchestrates sub-checks?

---

## §6 — Internal Documentation Template Enforcement

**Source:** tools/templates/, _handoff/VAULT/, validate-template-compliance.mjs, B_TEMPLATE_FIRST_CREATION

### Finding T-1: Multiple artifact types have no template (created "wild")

| Artifact Type | Path | Template? | Volume |
|---|---|---|---|
| Error patterns | `_handoff/VAULT/know-how/error-patterns/EP-*.md` | None | 16 files |
| Success patterns | `_handoff/VAULT/know-how/success-patterns/SG-*.md` | None | unknown |
| Governor insights | `_handoff/VAULT/governor-insights/` | None | per-session |
| Blockers | `_handoff/VAULT/blockers-S00N.md` | None | 4 files |
| Closing summaries | `_handoff/VAULT/closing-summary-S0NN.md` | None | per-session |
| Open questions ledger | various | None | 1+ files |

### Finding T-2: B_TEMPLATE_FIRST_CREATION (P-META-015) already covers this

`B_TEMPLATE_FIRST_CREATION` was engraved S006 at 5/5 surfaces. The gap is not the principle — it's that the artifact classes listed above are NOT registered in `_handoff/VAULT/template-registry.md`. The registry is incomplete.

The fix: extend the registry to cover the 6 unregistered artifact classes, each pointing to `governed-artifact-frontmatter.template.md` as base, with a `closing-summary.template.md` added for the highest-frequency VAULT type.

### Finding T-3: governed-artifact-frontmatter.template.md is the universal base

This template is template-grade A (Opus Turn 15 S026). It already defines the 13-field minimum viable scaffold. All other templates extend it. It should be explicitly named as the base in all template registrations.

### Opus Questions — Templates

**Q-T-1:** Should a `closing-summary.template.md` be added to `tools/templates/`? What fields beyond the 13-field base are required for a closing summary (session metrics, ZF evidence block, GRL resolution count, carry-forward)?

**Q-T-2:** Should `validate-template-compliance.mjs` scan `_handoff/VAULT/know-how/**` and `_handoff/VAULT/closing-summary-*.md`? Currently these paths appear excluded. What is the correct glob expansion?

**Q-T-3:** Is there a pattern from other governance platforms for "living documentation" — docs that auto-update from code changes rather than manual maintenance? What is the CSPS-native approach?

---

## §7 — Proposed Enhancement Plan (Governor-approved direction)

Governor directive S029: "review these and prepare all for Opus so we will enhance the core and have a detailed saved plan with reasoning for doing this."

### Priority Band A — CRITICAL (do before App #3)

| ID | Enhancement | Reason |
|---|---|---|
| ENH-001 | Fix `balance/route.ts` unbounded query | OOM/timeout risk in production |
| ENH-002 | Verify + fix `staffRole` self-promotion gap | Security privilege escalation vector |
| ENH-003 | Add minimal runnable scaffold to `apps/template/` | Every new app currently reverse-engineers budget-planner |
| ENH-004 | Create `/account-setup` pending state page | sign-up → 403 loop is broken UX |

### Priority Band B — HIGH (complete within S029-S031)

| ID | Enhancement | Reason |
|---|---|---|
| ENH-005 | Field-level policy for cross-tenant User reads | Privacy: any tenant reads all user profiles |
| ENH-006 | Consolidate 5 frontmatter validators into shared parse | 5× redundant I/O on every verify run |
| ENH-007 | Add closing-summary.template.md + register 6 wild artifact types | B_TEMPLATE_FIRST_CREATION gap |
| ENH-008 | Add 5 ADRs for top architectural decisions | New developer onboarding requires rationale |
| ENH-009 | Platform-level rate limiting middleware | No protection against Clerk latency cascade |

### Priority Band C — MEDIUM (schedule S032+)

| ID | Enhancement | Reason |
|---|---|---|
| ENH-010 | COUNT hot path → queue for trial trigger | Scales to 1M membership events |
| ENH-011 | Nightly doc-freshness cron | 5 fastest-staling docs have no enforcement |
| ENH-012 | Merge validate-template-compliance + validate-template-grade | Validator consolidation |
| ENH-013 | pnpm verify --fast mode | 104+ validators = growing CI bottleneck |
| ENH-014 | Partial DB index for deletedAt IS NULL | Transaction query optimization |

---

## §8 — Questions for Opus (Consolidated)

**Permissions:**
- Q-P-1: ZModel field-level deny for staffRole self-promotion?
- Q-P-2: Field-level @@allow for cross-tenant User reads (projection policy)?
- Q-P-3: Trial trigger COUNT → queue pattern?

**Developer Journey:**
- Q-DJ-1: Minimum viable runnable scaffold for apps/template/?
- Q-DJ-2: ADR format and initial ADRs to create?

**External User:**
- Q-EU-1: Pattern for JWT-refresh gap between sign-up and tenantId availability?
- Q-EU-2: Platform-level "account setup" page — S1 or S2?

**Bottlenecks:**
- Q-B-1: Balance aggregate pattern — Prisma groupBy vs raw SQL vs materialized view?
- Q-B-2: Platform-level rate limiting middleware pattern for Next.js App Router?
- Q-B-3: Frontmatter validator consolidation — shared utility vs meta-validator?

**Documentation:**
- Q-D-1: Nightly doc-freshness job — Vercel cron vs GitHub Actions?
- Q-D-2: ADR registry structure and initial ADRs?
- Q-D-3: Living documentation auto-update from code — CSPS-native pattern?

**Templates:**
- Q-T-1: closing-summary.template.md required fields?
- Q-T-2: validate-template-compliance.mjs glob expansion?
- Q-T-3: Living documentation pattern for governance docs?

---

## §9 — What "Platform Core Ready" Means After These Enhancements

The platform is ready to scale from 1 to 30 apps when:

1. ✅ Gate 3 LIVE (Budget Planner deployed) — done S028
2. ✅ 104 validators, pnpm verify exit_code 0 — done S028
3. ✅ External Integrations Hub (Vercel/Supabase/Clerk/ZenStack) — done S028
4. ⬜ ENH-001: balance query fixed (no OOM risk)
5. ⬜ ENH-002: staffRole gap verified/fixed (no privilege escalation)
6. ⬜ ENH-003: apps/template/ has runnable scaffold (App #3 can start from there)
7. ⬜ ENH-004: account-setup state page (UX loop fixed)
8. ⬜ ENH-007: template registry complete (all VAULT artifacts governed)

Items 4-8 are the delta between "first app works" and "platform ready for the foundry."

---

*Prepared: 2026-05-14 | Session: S029 | Awaiting Opus review and ratification*
*Cross-references: SROF-009 (USM), SROF-010 (context architecture), SROF-011 (external skills isolation)*
