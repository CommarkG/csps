---
id: csps.handoff.vault.topic-plan.opus-advisory-arc-s023
name: opus-advisory-arc-S023
description: >
  The complete multi-session plan for all work initiated by Opus advisory sessions
  S021-S023. Marks the full enterprise-level platform path across 9 work streams.
  Quality over speed — optimal implementation over 10+ sessions.
  Governor ratified all Q1-Q3 recommendations 2026-05-11.
  Standalone: every session can read this and understand the full picture.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: gradual-build-plan
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, VALD, OPER]
schema_anchor: topic_plans
domain_path: platform
depth_chosen: 5
depth_rationale: |
  Depth-5: constitutional. Covers all 5 Core Spines, all future sessions,
  the full enterprise platform path. Every future session operates within this arc.
priority_score: 98
priority_band: 1
session: S023
execution_mode: deep_quality
know_how_consulted: true
goal_statement: >
  Build the enterprise-grade CSPS platform that helps humans understand what they
  actually need — not just process what they say — across all 30 apps, all interaction
  layers, with zero freestyle AI behavior and zero implementation without ratified intent.
done_criteria:
  - "30 apps built, each inheriting the full platform foundation automatically"
  - "P-META-022 active at every interaction layer — human-to-AI and AI-to-AI"
  - "Opus-Sonnet protocol mechanically enforced with zero stale-state failures"
  - "Core Spines serve as full domain model (apps belong to spines)"
  - "WisdomVault accumulating cross-domain intelligence across all apps"
  - "pnpm verify exit_code=0 with 100+ validators covering all governance surfaces"
intent_crystallized: true
intent_crystallized_at: "S023 Opus advisory session — Governor ratified 2026-05-11"
threshold_route: platform.governance
tags:
  - domain:governance
  - domain:architecture
  - type:how-to
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: protocol, href: ../../../../../tools/council/PROTOCOL.md }
  - { rel: opus-turns, href: ../../../../../tools/council/opus-turn.md }
  - { rel: alignment-plan, href: ../../../../../tools/council/p-meta-022-alignment-plan.md }
  - { rel: bedrock, href: ../../../../pillar-0-governance/csps-bedrock.md }
scope_level: S1
---

# Opus Advisory Arc — S023
## Enterprise Platform Path — Quality Over Speed

> **Governing principle:** "Quality over speed is fundamental in CSPS."
> Every work stream below can be implemented gradually over 10+ sessions.
> What matters is that each session advances toward the enterprise target
> with zero drift from the platform's core purpose.

---

## §0 — CONSOLIDATION CHECK

CHECK WHAT EXISTS before every implementation step in this plan.
- Existing protocols: tools/council/PROTOCOL.md ✓
- Existing validators: tools/validators/ (72 active) ✓
- Existing Opus turns: tools/council/opus-turn.md (Turns 1-7) ✓
- Existing alignment plan: tools/council/p-meta-022-alignment-plan.md ✓
- Existing arc plans: core-dynamic-plan.md (depth-4, active) — this plan extends it

Consolidation finding: EXTENDING not creating — this plan consolidates the Opus advisory arc outputs
into one standalone reference. No parallel structures introduced.

---

## §1 — THE ENTERPRISE TARGET

**What "enterprise-level platform" means for CSPS:**

```
Every app built on CSPS inherits automatically:
  ✓ Multi-tenant security (ZenStack ORM + Postgres RLS)
  ✓ Auth lifecycle (Clerk webhooks — all 7 events)
  ✓ Billing lifecycle (Stripe — full subscription state machine)
  ✓ Audit trail (AuditEvent — immutable, all mutations)
  ✓ GDPR erasure path (eraseUser() — all PII surfaces)
  ✓ Notification delivery (NotificationService — thin wrapper)
  ✓ Calendar/time awareness (CalendarEngine — Gregorian Phase 1)
  ✓ Human intent crystallization (goal_statement + ZF-4 gates)
  ✓ AI behavior governance (52+ behavioral contracts, 100+ validators)
  ✓ Formal council review (Core Council with Opus seal for depth-5)
  ✓ Cross-domain intelligence (WisdomVault — after 3+ apps)

Every interaction with CSPS apps:
  ✓ Closes the L1→L3 gap (P-META-022 at every interaction layer)
  ✓ Crystallizes intent before acting (Threshold Wizard for users)
  ✓ Verifies understanding before executing (INTENT ABSORBED for AI)
  ✓ Checks drift at every milestone (ZF-3 intent drift gate)

The platform's council:
  ✓ Opus provides architectural review with RZF on every turn
  ✓ Sonnet reports back with SONNET REPORT on every session
  ✓ Zero freestyle — every handoff is verified, not assumed
```

---

## §1 — WORK STREAMS (9 total)

---

### STREAM 1: Opus-Sonnet Communication Protocol
**PE Score: 9.5 | Band: 1-BLOCKING**
**Why first:** Every other stream's execution quality depends on this working correctly.

**Current state:** PROTOCOL.md updated with mandatory turn format + INTENT ABSORBED + SONNET REPORT. No validators yet.

**Enterprise target:** Zero stale-state failures. Opus always reads Sonnet's last report before writing. Sonnet always declares understanding before executing. Governor's intervention window works even async.

**Sessions:**
- **S024:** validate-sonnet-report.mjs + validate-intent-absorbed.mjs. council-state.json tracking fields. INTENT ABSORBED written to sonnet-turn.md (ratified Q3).
- **S025:** Automate session-open.sh to surface latest sonnet-turn.md. Complexity score gate (if protocol changes push score > 25, pause and measure).

**Foundation gate:** validate-sonnet-report.mjs must exist before any multi-session arc is trusted.

---

### STREAM 2: P-META-022 Human Intent Crystallization
**PE Score: 9.25 | Band: 1-BLOCKING**
**Why second:** Affects all 30 apps at every interaction layer. Must be in place before App #2.

**Current state:** Canonical doc written, alignment plan (16 items), Tier 1 items 1-8 + 11 pending, Items 9-10 done.

**Enterprise target:** Every plan has goal_statement (human-authored). Every milestone has ZF-3 intent drift check. ZF-1 blocks S023+ plans without crystallized intent. ZF-4 delivery gate checks done_criteria. AI-to-AI (Opus→Sonnet) uses INTENT ABSORBED protocol.

**Sessions:**
- **S024 Tier 1:** Items 1-8 + 11 from p-meta-022-alignment-plan.md (principles.yaml + plan-creation-protocol Step 0a + ZF-3 in closing template §10.0r + B_CONSENSUS cross-ref + B_HUMBLE_EXECUTOR ZF-3 + DNA Element 15 + OD-007 + AI-to-AI canonical section)
- **S025 Tier 2:** Items 12-16 (wizard template, gradual-build-plan template, B_INTENT_CRYSTALLIZATION upgrade, ai-behavior-spine row, B_AUTONOMOUS_BATCH Q-CRYSTALLIZED) + **UPDATE-010** (add rigidity_level column to ai-behavior-spine.md + closed enum to frontmatter-closed-enums.md — OPUS-001 is DONE, classification in opus-turn.md Turn 2)
- **S026:** **UPDATE-011** (AGENTS.md R1-only refactor — R2-R4 contracts move to CDAB layers; AGENTS.md 200 lines → ~60 lines) + ZF-4 delivery gate (validate-done-criteria-met.mjs)

**Foundation gate:** Tier 1 (S024) complete before App #2 begins.

---

### STREAM 3: Formal Opus-Sonnet Council + Core Council Enforcement
**PE Score: 9.0 | Band: 1-BLOCKING**
**Why third:** Governs every architectural decision going forward.

**Current state:** council-architecture.md, 3 templates, validate-opus-turn-rzf.mjs active. No validation of Sonnet side. Core Council sealing not enforced mechanically.

**Enterprise target:** Every depth-5 plan has `council_required: core` in frontmatter. Core Council blocks implementation until Opus seal confirmed. validate-sonnet-report.mjs and validate-intent-absorbed.mjs active. Governor can trigger any council type with one line.

**Sessions:**
- **S024:** validate-sonnet-report.mjs, validate-intent-absorbed.mjs, council-state.json tracking fields
- **S026:** validate-core-council-seal.mjs (checks `ratification_status: SEALED` on depth-5 plans before implementation)
- **S028:** Automate: when opus-turn.md modified, surface reminder to Sonnet at next session open

**Foundation gate:** validate-sonnet-report.mjs (S024) before STREAM 4 starts.

---

### STREAM 4: Core Spines Reshape — Two-Phase Arc
**PE Score: 8.0 | Band: 1-BLOCKING for Option A; 2-HIGH for Option B**

**Phase A (Option A — council routing): S025**
Map the 6 council members to Core Spines explicitly:
- GVRN Spine → Governance Expert (council constitutional review)
- ARCH Spine → Security + Platform Developer (data model review)
- AI Spine → AI Alignment Expert (behavior review)
- VALD Spine → Reliability Engineer (coverage review)
- OPER Spine → Balance Expert + SaaS Architect (operations review)

Mechanical: Bundling Orchestrator reads plan's `core_spine:` and activates the mapped council member. When `core_spine: ARCH` — security + platform developer reviews fire automatically.

**Current state:** Option A ratified by Governor 2026-05-11.

**Enterprise target (Option A):** Council selection is mechanical, not manual. Governor no longer needs to invoke council members by name — the plan's spine declaration routes them.

**Phase B (Option B — full domain model): S029-S031**
The 5 spines become the CSPS domain model. Every app belongs to a spine. Every feature inherits spine-level constraints.

This is a 3-session arc with its own ADR. Requires:
1. ADR for spine-as-domain-model (S029 — Opus designs, Governor ratifies)
2. Artifact reclassification plan (~300 artifacts — batch with script)
3. Validator updates (corespine_layer_compliance + new app-spine-registry.md)

**Foundation gate:** Option A working (S025) before Option B design begins.

---

### STREAM 5: Consolidation + ZF Hardening
**PE Score: 8.5 | Band: 1-BLOCKING**

**Current state:** KNOWN_DEFERRED YAML created, Session 0 (orphan cleanup, DNA Element 14 updates) done. Session A items partially done. libs/ gate advisory.

**Governor ratification 2026-05-11:**
- Q2: libs/ gate BLOCKING for new files, ADVISORY for edits ← implement in S024

**Enterprise target:** No duplicate validators. No orphaned processes. Every plan has §0 CONSOLIDATION CHECK (blocking for S023+). libs/ new files BLOCKED without ratified plan. ZF truly zero — every advisory explicitly DONE or DEFERRED.

**Sessions:**
- **S024:** libs/ gate upgrade (pre-tool-use-plan-coverage-gate.sh new files → BLOCKING)
- **S025:** validate-consolidation-check.mjs (Session A items), validate-dead-links.mjs foundation
- **S026:** validate-dead-links.mjs full implementation (use npm package per Opus File 2 recommendation)

**Foundation gate:** libs/ gate (S024) before Session A validators (S025).

---

### STREAM 6: Threshold Wizard + Sandbox Policy
**PE Score: 7.5 | Band: 2-HIGH**

**Current state:** B_SANDBOX_BEFORE_IMPLEMENTATION enacted (5/5 FSE). Threshold Wizard sandbox v1 written. Awaiting Governor review.

**Enterprise target:** Every user interaction with a CSPS app starts with the Threshold Wizard. Intent is crystallized before any feature is built. The sandbox policy ensures no code exists without a ratified spec.

**Sessions:**
- **S024:** Governor reviews threshold-wizard-v1.md (§SPEC + 4 open questions). This is Governor action, not Sonnet.
- **S025:** If Governor ratifies v1 → simulation (3 scenarios). If revision needed → v2.
- **S026:** Implementation of ratified wizard.

**Foundation gate:** Threshold Wizard ratification before ANY external-user-facing feature in any CSPS app.

---

### STREAM 7: Core Primitives (Calendar + Notifications)
**PE Score: 7.5 | Band: 2-HIGH**

**Current state:** CCG Phase 0 done (registry, ADR template, DNA Element 14/15, plan-creation-protocol CCG gate). Phase 1 blocked on 5 Opus conditions.

**5 conditions for Phase 1 (from Feedback File 1):**
1. CCG formula revised (Stability 30%) — S025
2. Calendar Phase 1 = Gregorian-only interface
3. NotificationService L1: idempotency key + GDPR erasure hook
4. CalendarEngine caching strategy (withConfig pattern) + DST handling specified
5. ADR template exists — DONE (Session 0)

**Enterprise target:** All 30 apps get calendar + notifications without re-implementing. Sealed L1 interfaces. CalendarEngine used wherever dates appear. NotificationService used wherever notifications go.

**Sessions:**
- **S025:** ADR for CalendarEngine L1 (Gregorian-only). ADR for NotificationService L1.
- **S026:** Governor ratifies ADRs.
- **S027:** libs/core/calendar/ implementation (Gregorian-only interface).
- **S028:** libs/core/notifications/ implementation (Resend wrapper).
- **S029:** validate-core-primitive-usage.mjs (enforce no direct library imports).

**Foundation gate:** Requires STREAM 5 ZF hardening stable before adding new libs/.

---

### STREAM 8: App #2 Build
**PE Score: 6.8 | Band: 2-HIGH (gated)**

**Current state:** Template exists (apps/template/), bedrock 22/22, no App #2 domain chosen.

**Governor's domain choice:** Business/Personal/Social/Knowledge — decision needed before this stream starts.

**Enterprise target:** 30 apps, each generating $1K MRR and graduating as standalone products. App #2 is the first proof that the platform delivers its promise.

**Foundation gates BEFORE App #2 first commit:**
- P-META-022 Tier 1 active (S024) — no app without crystallized intent
- libs/ gate blocking for new files (S024) — no code without plan
- Threshold Wizard ratified (S025) — user-facing intent crystallization
- apps/template/ complete (Session 6 — bedrock item 22/22 ✓)

**Sessions:**
- **S025:** Domain decision + topic-plan for App #2 + PE scoring
- **S026:** Fork template, first CRUD, validate foundation inheritance
- **S027-S030:** Feature build within ratified sandbox specs

---

### STREAM 9: WisdomVault
**PE Score: 5.0 | Band: 3-STANDARD (gated on apps generating data)**

**Current state:** AppendOnlyBase done. WisdomEntry model deferred (Session 3 of enterprise plan).

**Enterprise target:** Cross-domain intelligence. A query like "what governance patterns apply to health apps?" surfaces insights from all CSPS apps automatically. No single-domain app can do this.

**Foundation gate:** Requires 3+ apps generating WisdomEntry data before the vault has value.

**Sessions:** S035+ (after App #3 is generating data)

---

## §2 — SESSION MAP (S024-S031 approximate)

| Session | Primary focus | Streams | Foundation enabled |
|---|---|---|---|
| **S024** | Protocol validators + P-META-022 Tier 1 + libs/ gate | 1, 2, 5 | Streams 3, 4 can start |
| **S025** | P-META-022 Tier 2 + Core Spines Option A + Consolidation validators + App #2 domain | 2, 3, 4, 5, 8 | Core Primitives ADRs |
| **S026** | Core Council enforcement + dead-links + Core Primitives ADRs + App #2 fork | 3, 5, 7, 8 | Core Primitives Phase 1 |
| **S027** | Threshold Wizard implementation + CalendarEngine Phase 1 + App #2 CRUD | 6, 7, 8 | CalendarEngine for App #2 |
| **S028** | NotificationService Phase 1 + Core Spines Option B design (ADR) + App #2 features | 4, 7, 8 | Notifications for App #2 |
| **S029** | Core Spines Option B ratification + validate-core-primitive-usage.mjs + App #2 near-complete | 4, 7, 8 | Full domain model |
| **S030** | Core Spines Option B implementation arc + App #2 complete + graduation tracker | 4, 8 | App #3 ready |
| **S031+** | App #3 + App #4... + WisdomVault when 3 apps generating data | 8, 9 | |

---

## §3 — FOUNDATION GATES (what blocks what)

```
S024 GATES (all must clear before S025 implementation starts):
  □ validate-sonnet-report.mjs running (STREAM 1)
  □ P-META-022 Tier 1 active — validate-intent-crystallized.mjs blocking (STREAM 2)
  □ libs/ gate blocking for new files (STREAM 5)
  □ INTENT ABSORBED written to sonnet-turn.md (STREAM 1 — Q3 ratified)

S025 GATES:
  □ S024 gates all passing
  □ Core Primitives ADRs (Calendar + Notifications L1 interface)
  □ App #2 domain decided (Governor action)

S026 GATES:
  □ S025 gates all passing
  □ Core Council validate-core-council-seal.mjs active (STREAM 3)
  □ App #2 topic-plan ratified with Council review

App #2 FIRST COMMIT gate:
  □ validate-intent-crystallized.mjs blocking (P-META-022 ZF-1)
  □ libs/ gate blocking for new files
  □ apps/template/ complete
  □ App #2 topic-plan with goal_statement + done_criteria in frontmatter
```

---

## §4 — QUALITY OVER SPEED PRINCIPLES

These are not aspirational. They are mechanical constraints on this arc.

**P1 — No session skips foundation gates.** If S024 P-META-022 Tier 1 is incomplete, S025 does NOT start App #2 planning. The foundation gate is a blocker, not a suggestion.

**P2 — Every session is self-contained.** This plan is not the only context. Every session close writes a HANDOFF. Every session open reads the HANDOFF. The plan is the arc; the HANDOFF is the state.

**P3 — Complexity score is measured, not ignored.** Currently 18.2 (GREEN). YELLOW is >25. If any session would push to YELLOW: pause, run balance-expert skill, decide whether to promote from overhead to moat before continuing. A platform that governs too heavily governs nothing at all.

**P4 — Enterprise is a direction, not a deadline.** The target above is the destination. The path has 30+ sessions. No session needs to "catch up" — every session simply advances in the right direction.

**P5 — Council review gates the big decisions.** Any decision that affects more than 3 work streams simultaneously → Core Council before implementation. Option B (Core Spines domain model) is that decision. Do not start it without Core Council review.

---

## §5 — OPEN QUESTIONS PENDING GOVERNOR (not blocking S024)

| # | Question | Blocks | Status |
|---|---|---|---|
| Q-CoreSpines-A | Option A (council routing) implementation design | STREAM 4 S025 | Ratified — Opus designs implementation |
| Q-App2-Domain | Which domain for App #2? Business/Personal/Social/Knowledge | STREAM 8 S025 | Governor decides |
| Q-WizardV1 | Governor reviews threshold-wizard-v1.md §SPEC (4 questions) | STREAM 6 S025 | Governor action |
| Q-CoreSpines-B | When to start Option B multi-session arc | STREAM 4 S029 | After Option A working |

---

## §6 — THIS SESSION'S EVIDENCE GATE (S024 is ready when)

```
□ STREAM 1: validate-sonnet-report.mjs created + wired to verify
□ STREAM 1: validate-intent-absorbed.mjs created + wired to verify
□ STREAM 2: P-META-022 Tier 1 items 1-8 + 11 complete
□ STREAM 2: validate-intent-crystallized.mjs BLOCKING for S023+ new plans
□ STREAM 3: council-state.json has sonnet_last_report_session + opus_last_turn_session fields
□ STREAM 5: pre-tool-use-plan-coverage-gate.sh BLOCKING for new libs/ files (diff + Governor confirm)
□ pnpm verify: exit_code=0
□ SONNET REPORT written to sonnet-turn.md
□ HANDOFF-S024-to-S025.md written
□ git push: confirmed
```

---

*Opus Advisory Arc — S023 | Enterprise Platform Path | 2026-05-11*
*Governor ratified: Q1 (Option A now + Option B arc), Q2 (libs gate), Q3 (INTENT ABSORBED to sonnet-turn.md)*
*Governing principle: quality over speed — optimal implementation across 10+ sessions*
*Next session: S024 — read HANDOFF-S023-to-S024.md + this plan + tools/council/chat-jump-S023-p-meta-022.md*
