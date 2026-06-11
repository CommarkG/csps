---
id: csps.governance.planning-spine.inheritance-model
name: INHERITANCE-MODEL
description: "How planning decisions propagate across sessions (carry-forward), into implementation, and into auditing. Extends the inheritance model to the two weak domains identified in Opus audit: implementing and auditing inheritance."
version: "0.1"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
status: ratified
authored_by: Sonnet S080
authored_at: "2026-06-05"
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - maturity:stable
links:
  - { rel: handoff-s079-to-s080, href: ../../_handoff/HANDOFF-S079-to-S080.md }
  - { rel: planning-spine, href: PLANNING-SPINE.md }
  - { rel: p-meta-035, href: ../../../../packages/principles/principles/P-META-035-iteration-and-reuse.yaml }
  - { rel: csps-inheritance-report, href: "../../../../docs/platform-intelligence/CSPS-report-on-Inheritance-for-CSP-2026-06-03.md" }
---

# Inheritance Model — Planning Spine

A planning decision is only as good as its carry-forward. This document maps how planning decisions propagate across the three domains: **session-to-session** (carry-forward), **planning-to-implementing** (the weak domain), and **implementing-to-auditing** (the weakest domain).

---

## Domain 1: Session-to-Session (Carry-Forward) — STRONGEST

The HANDOFF structure carries planning decisions across sessions:
- Zone A: state (what was decided)
- Zone B: pivot (what to decide next)
- Zone C: parked chain (pre-approved sequence)
- Zone D: scheduled / carry-forward with deadlines

**Strength:** Mechanical. HANDOFF-S079-to-S080 exists; startup block is pasted; §17 receipt confirms absorption.
**Weakness:** Injection-compression. In sessions >40 turns, Zone C/D constraints can be lost from context. See gap_SESSION_INJECTION_COMPRESSION (K=2, open).

**P-META-035 expression:** The parked chain in Zone C IS the reuse discipline: "don't start new work before the sequence completes." Each new session's CLASSIFY stage should check Zone C before introducing new work.

---

## Domain 2: Planning-to-Implementing — WEAK

This is where planning decisions most frequently lose inheritance.

**The failure pattern:**
1. Opus designs the plan with specific constraints (spine, scope, sequence)
2. Sonnet builds, but builds from the last few turns of context — not the full planning intent
3. The implementation is technically correct but misses a governance constraint from planning

**Known examples:**
- S072: journey-trunk page built as standalone (violating M1 consolidation decision from the same session)
- S078: Sonnet built P-META-032 without the parent cross-ref (caught in OPIA — the constraint was in the Opus PROTO, compressed by turn 20)

**Structural cure — Branch-Activation Reload (S082):**

The trunk-branch-reload model (`TRUNK-BRANCH-RELOAD.md §5`) defines the Domain-2 cure: when a domain branch activates for implementation, it emits a **trunk-reload bundle** containing:
- `crystallized_intent` — the Stage-3 named output field (what the plan was supposed to achieve)
- `scope_lock` — the Opus PROTO's DO NOW section verbatim
- `no_orphans_home` — the declared spine + schema_anchor

This re-surfaces the planning constraint at the build boundary, preventing the compression-loss failure. The PROTO scope-lock (existing convention in many PROTOs) becomes mandatory and formally structured as the reload trigger.

**Status:** STRUCTURAL FIX DESIGNED (S082). Enforcement = PHASEB (gated on cycle-counter reconciliation). See `TRUNK-BRANCH-RELOAD.md §5`.

---

## Domain 3: Implementing-to-Auditing — WEAKEST

The weakest inheritance domain. Once implementation completes, the audit often evaluates against:
- The implementation's own claims (self-referential audit)
- The HANDOFF zone A state (what was committed)
- NOT the original planning intent (which may be 3-5 sessions back in the handoff archive)

**The failure pattern:**
1. Opus plans in S072: "the Platform Attitude model replaces trunk/branches"
2. Sonnet implements in S072: builds the redirect consolidation
3. Audit in S079: confirms "6 routes, consolidation done" — but doesn't check whether the Platform Attitude model itself was ratified (the core planning decision is untraced 7 sessions later)

**Structural cure — Branch-Activation Reload at Audit Boundary (S082):**

The trunk-branch-reload model (`TRUNK-BRANCH-RELOAD.md §5`) defines the Domain-3 cure: when an audit begins (OPIA, closing-summary §10.0), it loads the **branch-activation-reload bundle** from the implementing session. The bundle contains:
- `crystallized_intent` — the Stage-3 named field (the original planning intent)
- `completion_criteria` — the Stage-6 definition from the planning loop

The audit now evaluates against the planning origin, not just the commit. The OPIA verdict back-references `crystallized_intent` rather than only the implementation state.

This also closes the gap identified in INHERITANCE-MODEL improvement item 3: "At COMPLETION-TEST (Stage 6): require explicit 'does this satisfy the original crystallized intent?' question" — that question now reads from the named `crystallized_intent` field, not from AI memory.

**Status:** STRUCTURAL FIX DESIGNED (S082). Enforcement = PHASEB. See `TRUNK-BRANCH-RELOAD.md §5`.

---

## The Inheritance Stack (current honest state)

```
Planning (Opus plan)
     │
     │ ← STRONGEST: HANDOFF Zone C parked chain
     ▼
Session-to-session (carry-forward)
     │
     │ ← WEAK: PROTO scope-lock sometimes present; CLASSIFY re-fire not enforced
     ▼
Implementing (Sonnet build)
     │
     │ ← WEAKEST: audit evaluates commit, not original planning intent
     ▼
Auditing (OPIA / closing-summary)
```

**Improvement path (registered, not built):**
1. Make PROTO scope-lock mandatory (add to validate-proto-completeness.mjs check list)
2. Add audit back-reference field to closing-summary template: `planning_decision_origin: HANDOFF-SXX Zone C item N`
3. At COMPLETION-TEST (Stage 6): require explicit "does this satisfy the original crystallized intent?" question

---
*RATIFIED v0.1 | Sonnet S080 | Ratified S082 · 2026-06-11*
*Gap noted: implementing+auditing inheritance weakness registered for structural fix in improvement-register (not yet added — will register at commit time per P-META-033)*
