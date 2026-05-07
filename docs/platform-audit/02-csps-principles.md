---
id: csps.platform-audit.principles
name: platform-audit-principles
description: >
  The principle-based solution approach of CSPS. For each problem in 01-problems.md,
  this documents the governing principle, the mechanical enforcement, and the resulting
  platform quality. These are not aspirational statements — each principle has a canonical
  home, a validator, and a behavioral contract.
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
  - { rel: problems, href: ./01-problems.md }
  - { rel: overview, href: ./03-platform-overview.md }
  - { rel: principles-source, href: ../../packages/principles/principles.yaml }
---

# CSPS Solution Principles

> Principles are not rules. A rule tells you what to do. A principle tells you WHY — so that when the rule doesn't cover the situation, you can still make the right decision.
>
> Each principle here has: a P-* canonical ID, a mechanical enforcement artifact, and a measurable quality it produces.

---

## Principle Set 1: Platform-First Construction

### P-OPER-001 — Zero-Laptop-Dependency
**Statement:** All work is push-to-remote-first, accessible from any device with a browser. No workstation lock-in.
**Enforcement:** `validate-git-pushed-state.mjs` (Cycle active) + session-close gate blocks handoff if local commits unpushed
**Quality produced:** Platform continuity — development never stops because of hardware failure, location change, or device preference

### P-ARCH-002 — Schema-Per-App
**Statement:** Every app has its own schema namespace. Foundation slices (User/Tenant/AuditEvent) live in `public`. App slices live in `app_<slug>`.
**Enforcement:** `@@schema("public")` + `@@schema("app_slug")` enforced by ZenStack
**Quality produced:** Tenant isolation by construction — cross-schema queries are mechanically impossible without explicit join

### B_PLATFORM_FIRST_OPTIMIZATION
**Statement:** Before implementing any solution locally, evaluate whether it could generalize to the platform. ZenStack installed once at platform level protects all 30 apps. A per-app ZenStack install is a failure.
**Enforcement:** Behavioral contract in AGENTS.md hard NOs. Session mandate structure.
**Quality produced:** Every platform investment compounds — one decision benefits 30 apps, not 1

---

## Principle Set 2: Foundation Before Application

### P-META-016 — Gradual-Build-By-Foundations
**Statement:** No phase N work begins until phase N-1 is gate-clean. No app #2 until bedrock is complete. No L2 until L1 exits with ZF.
**Enforcement:** `validate-phase-exit-criteria.mjs` (FOUNDATION_EXIT_GATE) + `validate-bedrock.mjs` + topic-plan depth gates
**Quality produced:** Every app inherits a complete foundation — multi-tenancy, auth, billing, audit — without implementing any of it themselves

### B_COMPLETION_OVER_SHINY
**Statement:** Active work >50% complete gets 1.5× PE weight. New items wait. The shiny-object trap (abandoning 80% done to start something new) is structurally prevented.
**Enforcement:** PE formula applies the multiplier mechanically. Behavioral contract.
**Quality produced:** Platform delivers finished capabilities rather than a graveyard of 60%-complete features

---

## Principle Set 3: Governance by Construction

### P-META-006 — Zero-Findings (ZF) Discipline
**Statement:** No DONE/COMPLETE/RATIFIED claim without THIS-SESSION validator evidence. Memory is not evidence. Re-run IS the proof. Nominal ZF (timestamp-touch without actual run) is a structural failure mode.
**Enforcement:** ZF orchestrator (Levels 1/2/3) + pre-close-verification gate (§10.0) + hooks detect nominal ZF patterns
**Quality produced:** Every shipped artifact is verified, not assumed. Platform trust is earned, not claimed.

### P-META-019 — Structural Prevention Discipline
**Statement:** When an enforcement is skipped/late/partial, fix the STRUCTURE that allowed it, not the instance. K=2 recurring pattern = mandatory structural engraving. Never settle for manual recovery.
**Enforcement:** `validate-open-plan-levels.mjs` + closing-summary §10.0j mandatory enhancement proposals
**Quality produced:** Platform self-improves — every failure becomes a structural fix that prevents recurrence

### P-META-020 — Concept-First Governance (Threshold)
**Statement:** Context is the compass. Before processing any input, identify which L2 spine domain governs the work. Validators are reference samples confirming concept alignment — not rules to follow mechanically.
**Enforcement:** B_CONCEPT_LOAD (hard NO in AGENTS.md) + `concept-load-declared` audit slug (week-4) + CONCEPT_LOAD fires on every turn via UserPromptSubmit hook
**Quality produced:** AI behavior is context-aware, not training-default. The platform concept governs every response.

---

## Principle Set 4: AI as Governed Collaborator

### P-META-017 — CSPS-Alignment-Over-Inner-AI-Defaults
**Statement:** AI training bakes in defaults. Each default must be registered with disposition (keep/override/adjust). The inner-AI-defaults registry is the calibration instrument — not a gate, a compass.
**Enforcement:** `validate-inner-ai-defaults-freshness.mjs` + inner-ai-defaults registry (10 category files)
**Quality produced:** AI behavior aligns with platform conventions; training defaults don't silently override platform decisions

### P-META-009 — Cognitive Context Architecture (CCA)
**Statement:** Tokens are investment in reasoning quality, not budget to minimize. 4 immutable Quality Gates: QG1 (hard reasoning never downgrades), QG2 (synthesis stays in main), QG3 (edited files re-read), QG4 (cache invalidates on change). B_TOKEN_BUDGET governs the 8 operating rules.
**Enforcement:** B_TOKEN_BUDGET (8-rule ratified contract) + GRACE architecture + context orchestrator
**Quality produced:** Every token spent produces maximum reasoning value; expensive operations isolate to subagents; synthesis stays in main context

---

## Principle Set 5: Accumulated Knowledge

### P-META-005 — Learning Loop
**Statement:** Every observed failure, gap, or anti-pattern feeds back into the platform. Nothing is observed and forgotten. Catch → engrave → validate → prevent recurrence.
**Enforcement:** B_CATCH_TO_ENGRAVING (hard NO: never let a gap decay at session-end) + B_POSITIVE_VALUE_EXTRACTION (CEC cycle for positive discoveries) + `learning-loop-coverage` audit (week-4)
**Quality produced:** Platform gets smarter after every session. CSP took 330+ sessions to evolve its ZF discipline. CSPS inherited it at session 2.

### P-META-021 — Triad Governance
**Statement:** Every consequential decision requires all three layers: (1) conceptual frame, (2) named principle, (3) mechanical enforcement. Single-layer governance is not governance — it's documentation.
**Enforcement:** `validate-open-plan-levels.mjs` + closing-summary §10.0l triad coverage check
**Quality produced:** No governance gap — declared things are enforced, enforced things are validated, validated things are traced

---

## The Principle Hierarchy

```
L1 — Meta-Principles (P-META-*)     ← govern how the platform governs itself
  │   The philosophy and process of governance
  │
  ├── L2 — Architecture Principles (P-ARCH-*)
  │         How the system is structured
  │
  ├── L2 — Operational Principles (P-OPER-*)
  │         How the system runs and delivers
  │
  └── L2 — Behavioral Contracts (B_*)
            What the AI must/must never do
```

**Precedence:** L1 meta-principles govern everything. When a P-ARCH and P-OPER conflict, the P-META that governs both resolves it. When uncertain, escalate to the most foundational principle.

---

## One Principle Above All

> **"Foundations first. Governance by construction. AI as governed collaborator."**

Everything else is elaboration of this. A SaaS app that shares the foundation doesn't write multi-tenancy code. A platform that enforces governance by construction doesn't retrofit audits. An AI that is a governed collaborator doesn't generate platform-unaware code.

The compounding effect: each principle applied compounds with every other. ZF discipline catches alignment drift. Gradual build prevents foundation debt. Platform-first optimization spreads every improvement across 30 apps. Together they produce a platform where each new capability makes all existing capabilities stronger.
