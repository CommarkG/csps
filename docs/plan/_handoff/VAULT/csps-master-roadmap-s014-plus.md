---
id: csps.handoff.vault.csps-master-roadmap-s014-plus
name: csps-master-roadmap-s014-plus
description: Master cross-track roadmap for CSPS from S014 onward. Governed by P-META-020 (Concept-First Governance) — each phase declares its conceptual anchor before listing artifacts. Context is the compass; phases are validated by checking whether their outputs honor the governing concept, not just whether checklist items are ticked. Authored S014 from full-chat audit. Version 1.1 aligns with concept-first methodology.
version: 1.1
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: pillar-leaf
template_status: stable
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, VALD]
schema_anchor: vault_files
tags:
  - domain:governance
  - domain:planning
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
know_how_consulted: true
diataxis_type: reference
session: S014
links:
  - { rel: p-meta-020-plan, href: ./topic-plans/p-meta-020-concept-first-governance.md }
  - { rel: s014-app-plan, href: ./topic-plans/s014-task-management-app.md }
  - { rel: s014-l1-research, href: ./topic-plans/s014-l1-research.md }
  - { rel: s014-l2-goals, href: ./topic-plans/s014-l2-goals-personas.md }
  - { rel: session-state, href: ../../../../tools/session-state.json }
domain_path: platform
scope_level: S1
---

# CSPS Master Roadmap — S014+

> **This document IS the cross-track plan.** Everything open, ordered by priority, with reasoning. Read this at session-open to know where you are and what's next. Update it when phases complete.

---

## §0 — Governing Methodology (P-META-020)

This roadmap operates under **Concept-First Governance**: context is the primary navigation tool; rigid enforcement elements (validators, hooks, contracts) are reference samples that confirm whether behavior honors the underlying concept.

**How to read each phase:**
- **Conceptual anchor** = the L1/L2 spine domain this phase is an expression of
- **Artifacts** = the L3 instances that manifest the concept
- **Validations** = reference samples confirming the concept was honored, not just task completion

**Diagnostic path when a phase fails:**
```
L3 artifact fails → ask: which concept was this supposed to honor?
                  → check: has L2 domain understanding drifted?
                  → check: is L1 conceptual anchor still intact?
                  → fix: the concept understanding, not just the artifact
```

**The Threshold and external inputs:**
All external inputs (research, advisor content, platform comparisons) enter via VAULT_DEFER classification. They inform; they do not modify. Absorbed this session:
- Gemini architectural research (S014): confirmed CSPS Onion/Core-Spine architecture is correct; CSP-vocabulary not imported; ECS pattern filed as VLT for future expansion design.

---

## §1 — The Problem This Roadmap Addresses

### Problem A: Governance accumulation without hierarchy

CSPS built 34 validators, 43 behavioral contracts, 13 hooks — all as flat enforcement running at the same pipeline level. This produces bottlenecks at scale and never-complete growth because specific cases are infinite. The rule set always chases; never leads.

**Solution:** P-META-020 (Concept-First Governance) — context as the primary navigation tool, rigid elements as reference samples. The Threshold loads relevant conceptual frame; validators check whether behavior honors the concept, not just whether it matches the rule.

### Problem B: Plan promise abandonment

When AI completes a plan level and moves to the next topic, promises made for future levels silently orphan. Foundation-slices L3 is the canonical example: L1 built the ZModel (done), L3 promised `validate-foundation-schema-drift.mjs` (never built), the plan sat with unchecked boxes for 3 sessions.

**Root cause:** Context-depth degradation (`reasoning-context-depth-degradation` in drift-log). The understanding that generates a promise degrades to a checkbox. No validator surfaces open plan levels as obligations.

**Solution:** `validate-open-plan-levels.mjs` (Track 3B) + P-META-020 CONCEPT_LOAD ensures decisions are made within active conceptual framing.

### Problem C: S014 app blocked on one pricing decision

L2 goals/personas is drafted. One open item (★ pricing: $9/mo flat per team assumed) blocks L2 close and therefore L3 schema. Task + Project ZModel cannot be authored until Governor confirms pricing (affects Stripe billing logic at L4).

**Solution:** One Governor answer → L2 closes → L3 proceeds.

---

## §2 — Four Active Tracks

```
Track 1: P-META-020 Concept-First Governance    [priority: 98 — foundational methodology]
Track 2: S014 Task Management App               [priority: 95 — first product]
Track 3: Platform Mechanics Fixes               [priority: 80 — structural debt]
Track 4: Long-Running Deferred                  [priority: 60 — requires external tooling]
```

Tracks 1 and 2 are parallel but Track 2 L3+ is MORE VALUABLE once Track 1 L1 is anchored (the methodology frames how schema decisions are made). Tracks 3 and 4 are independent.

---

## §3 — Optimal Phase Ordering

### Phase 0 — ✅ COMPLETE (S014, commit 331dcdf)
**Conceptual anchor:** GVRN spine L1 — platform governs before it builds.
**Concept honored:** Every significant insight is encoded before context degrades. Plans are not checklists — they carry the reasoning that generated them.

**Built:**
- [x] continuous-drift-log.md: 2 new entries (reasoning-plan-promise-abandonment + reasoning-context-depth-degradation)
- [x] p-meta-020-concept-first-governance.md committed
- [x] csps-master-roadmap-s014-plus.md committed (this file, v1.1)
- [x] B_NO_WILD_IMPLEMENTATION: pre-tool-use-plan-coverage-gate.sh (commit 2564e13)
- [x] pnpm verify exit_code 0

---

### Phase 1 — ✅ COMPLETE (S014, commit a829d59)
**Conceptual anchor:** ARCH spine L2 product domain — product decisions must be ratified before schema locks them in concrete.
**Concept honored:** Governor decision at the point of maximum context (L2 goals/personas fully understood) prevents schema rework.

**Built:**
- [x] $9/mo flat per team confirmed by Governor
- [x] s014-l2-goals-personas.md: L2 COMPLETE
- [x] pnpm verify exit_code 0

---

### Phase 2 — CURRENT (next to execute)
**2A Conceptual anchor:** AI spine L1 — intelligence in the platform is a managed resource governed by concept, not rule enumeration.
**2A Concept honored:** The methodology that frames ALL future decisions must be encoded before any implementation uses it. Encoding the navigation tool before navigating.

**What (2A):** Track 1 L1 — P-META-020 canonical anchor. Three artifacts atomic:
- principles.yaml: add P-META-020
- concept-first-governance.md: author methodology doc
- threshold-gate-v2.md: add Step 0 CONCEPT_LOAD

**2B Conceptual anchor:** ARCH spine L2 data domain — foundation slices are the metabolism of every app; schema decisions made here propagate to all 30 future apps.
**2B Concept honored:** Seal the schema with full contextual understanding (L2 goals + L1 methodology active) so extraction at graduation is clean.

**What (2B, after 2A):** S014 L3 — Task + Project ZModel. Schema decisions informed by the now-anchored concept-first methodology.

**Why 2A before 2B:** The schema decisions at L3 (what fields, what RLS, what state machine) should be made with the concept-first framing active. Authoring the methodology doc first ensures L3 schema reasoning is captured with full conceptual depth.

**Validations (2A):**
- [ ] P-META-020 in principles.yaml (valid schema)
- [ ] concept-first-governance.md: §Background + methodology + composition + Threshold Step 0 scope
- [ ] threshold-gate-v2.md: Step 0 added, CCA Layer 1 scope boundary defined
- [ ] `pnpm principles:codegen` succeeds, AGENTS.md updated
- [ ] pnpm verify exit_code 0

**Validations (2B):**
- [ ] `libs/policies/slices/public/task.zmodel` authored (title, status, priority, dueDate, assigneeId, projectId)
- [ ] `libs/policies/slices/public/project.zmodel` authored (name, tenantId, status)
- [ ] TaskStatus state machine defined
- [ ] RLS: tenant-scoped per foundation-design.md pattern
- [ ] s014-task-management-app.md L3 exit criteria checked
- [ ] pnpm verify exit_code 0

---

### Phase 3 — AFTER PHASE 2
**3A Conceptual anchor:** VALD spine — validation is meaningless if it only catches what you already named; open plan levels are obligations, not options.
**3A Concept honored:** Structural prevention of plan-promise-abandonment — the failure mode that produced foundation-slices L3 gap.

**What (3A):** Track 3 mechanics — drift-log entries promote to reasoning-patterns.md; `validate-open-plan-levels.mjs` built; post-implementation re-assessment wired.

**3B Conceptual anchor:** AI spine L2 inner-defaults domain — every enforcement artifact declares what concept it is sampling, so failure triggers conceptual diagnosis not just patching.
**3B Concept honored:** Validators become calibration instruments; contracts become crystallized conceptual commitments.

**What (3B):** Track 1 L2 — wiring: B_* template + audit-runner + inner-ai-defaults README + B_INTENT_TO_IMPACT cross-ref.

**Why 3A before 3B:** The open-plan-levels validator catches the exact failure mode (foundation-slices L3) immediately. Track 1 L2 wiring is valuable but doesn't block anything.

**Validations (3A):**
- [ ] validate-open-plan-levels.mjs in pnpm verify, exit 0
- [ ] reasoning-patterns.md: 2 new entries (plan-promise-abandonment + context-depth-degradation)
- [ ] CLAUDE.md or session protocol: post-implementation PE re-evaluation step

**Validations (3B):**
- [ ] b-star-contract.template.md: `conceptual_sample_of:` field present
- [ ] audit-runner.md: `conceptual_sample_of` column for ≥5 validators
- [ ] inner-ai-defaults README reframed
- [ ] pnpm verify exit_code 0 (after audit-runner split)

---

### Phase 4 — AFTER PHASE 2B
**Conceptual anchor:** VALD spine — schema claims must be validated with real data before being locked in production; the sandbox IS the conceptual validation mechanism.
**Concept honored:** No L4 implementation starts without empirical proof the L3 schema works end-to-end. Core elements complete before external solutions.

**What:** Sandbox (`apps/sandbox/`) — auth wiring + Stripe integration scaffold + schema validation structure.

**Scope correction (PCR 1-B ratified S015):** Phase 4 delivered auth wiring + Stripe customer creation + Supavisor URL pattern. Task CRUD validation moves to Phase 5 (it IS Phase 5's primary deliverable, not a sandbox prerequisite). Sandbox = auth + billing plumbing validated; Phase 5 = full CRUD proven in production app.

**Depends on:** Phase 1 (pricing confirmed), Phase 2B (Task/Project ZModel exists)

**Validations (corrected to match what was built):**
- [x] `apps/sandbox/` Next.js 14 app scaffolded (commit b05685c)
- [x] Clerk webhook handler wired: `org.created` → Tenant row + UserTenant + `User.tenantId` set (VLT-S015-001 partial — full JWT claim in Phase 5)
- [x] Stripe customer creation wired: `org.created` → `createStripeCustomer` hook (decoupled via `buildTenantBillingHook`)
- [x] Supabase Supavisor pooler pattern documented in `.env.example` (VLT-S015-003: DATABASE_URL + DIRECT_URL explicit)
- [x] Sandbox deliberately has no Task CRUD (CRUD is Phase 5 deliverable, not Phase 4)
- [x] pnpm verify exit_code 0 (commit 88ce623)

---

### Phase 5 — AFTER PHASE 4
**What:** S015 L4 — full task management app implementation (`apps/task-mgmt/`).

**Depends on:** Phase 4 CLEAN (foundation gate passes — all Phase 4 exit criteria checked).

**Decisions ratified (S015):** UI = Tailwind CSS. Stripe = both outbound trigger + inbound subscription webhook.

**Validations:**
- [ ] `apps/task-mgmt/` Next.js 14 app with Tailwind scaffolded
- [ ] Clerk middleware + JWT custom claim for `tenantId` (`/api/auth/session` route) wired (VLT-S015-001 full resolution)
- [ ] Task CRUD: create → assign → status-change → complete, each writing `AuditEvent` (validates Phase 4 schema end-to-end)
- [ ] Project CRUD: create + list + update
- [ ] Billing trigger outbound: 2nd `UserTenant` → Stripe subscription at `STRIPE_TEAM_PRICE_ID`
- [ ] Billing trigger inbound: `customer.subscription.created` → `Tenant.subscriptionStatus = active`
- [ ] `@csps/integrations` tsconfig path alias wired (VLT-S015-005)
- [ ] `DATABASE_URL` (pooled Supavisor) + `DIRECT_URL` (direct) explicit in `.env.example` (VLT-S015-003)
- [ ] pnpm verify exit_code 0

---

## §4 — Deferred Track (Track 4)

These items are tracked but not blocking. Each has an explicit dependency that prevents execution now.

| Item | Depends on | Status |
|---|---|---|
| Token optimization Phases 5-10 (hooks, file splitting, principles-mcp) | Phase 3 stability (enforcement model stable before token reduction) | Deferred |
| Foundation-slices L3 (schema drift validator, RLS policies, prisma generate) | ZenStack installation in project + Next.js app exists | Deferred |
| Zero-laptop-dependency L2+L3 | Physical device testing (GitHub Codespaces / Android validation) | Deferred |
| P-META-020 L3 backfill (43 contracts + 34 validators + closing summary template) | Phase 3B complete | Deferred |

---

## §5 — Open Items Requiring Governor Input

| ID | Question | Blocks | Default assumption |
|---|---|---|---|
| ★ S014-PRICING | Team pricing: confirm $9/mo flat per team (up to 5 members), or give alternative | Phase 1 (L2 close) | $9/mo flat |
| ★ S014-L3-SCOPE | Any additions to L3 scope before schema locks? (Task entity beyond what L2 specified) | Phase 2B | None assumed |

---

## §6 — Phase Summary Table

| Phase | Track | Deliverables | Key validation |
|---|---|---|---|
| 0 | All | Drift-log entries + P-META-020 plan + this doc | pnpm verify 0 |
| 1 | 2 | S014 L2 close (pricing confirmed) | L2 exit criteria checked |
| 2A | 1 | P-META-020 canonical anchor (3 artifacts atomic) | principles codegen + verify 0 |
| 2B | 2 | Task + Project ZModel (L3 schema) | pnpm verify 0 |
| 3A | 3 | validate-open-plan-levels.mjs + 2 reasoning patterns promoted | new validator in verify |
| 3B | 1 | P-META-020 Tier 2 wiring | audit-runner split + verify 0 |
| 4 | 2 | Sandbox app (schema validation) | Task CRUD + auth flow working |
| 5 | 2 | S014 L4 implementation | full app functional |
| deferred | 4 | Token opt + foundation-slices L3 + zero-laptop L2+L3 | each has explicit unblock trigger |

---

## §7 — What Was Completed This Session (S014 evidence block)

| Artifact | Status | Commit |
|---|---|---|
| Foundation slices (User/Tenant/UserTenant/AuditEvent ZModel) | COMPLETE | 36847d5 |
| S013 Clerk + Stripe service layer | COMPLETE | db31496 |
| B_OPTIMAL_NEXT_STEP hook | COMPLETE | a22c77e |
| chat-transfer-protocol registered in template-registry | COMPLETE | f7bb580 |
| S014 depth-4 topic plan + L1 research + L2 goals | COMPLETE | 4dd0fa2 |
| VLTs 002-005 ratified, session-state advanced to S014 | COMPLETE | 4dd0fa2 |
| Permission allowlist + chat-move criteria | COMPLETE | a22c77e |
| P-META-020 topic plan + drift-log entries + this roadmap | Phase 0 | this session |
