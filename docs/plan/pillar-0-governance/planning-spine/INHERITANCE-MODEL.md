---
id: csps.governance.planning-spine.inheritance-model
name: INHERITANCE-MODEL
description: "How planning decisions propagate across sessions (carry-forward), into implementation, and into auditing. Extends the inheritance model to the two weak domains identified in Opus audit: implementing and auditing inheritance."
version: "0.1-draft"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
status: draft
authored_by: Sonnet S080
authored_at: "2026-06-05"
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - maturity:draft
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

**What would close this gap:**
- PROTO directives should carry a "SCOPE LOCK" section (already in some PROTOs) — make it required
- The planning-to-implementing boundary should trigger a CLASSIFY re-fire: "what is the governing constraint from the Opus plan?" before Sonnet begins building
- The satisfaction-point-registry.yaml should have an entry for "planning constraints inherited by implementation" — currently absent

**Honest status:** WEAK. No structural fix committed. This is a known inheritance gap.

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

**What would close this gap:**
- Audit artifacts (closing-summaries, OPIA verdicts) should carry a back-reference to the original planning decision, not just the implementation commit
- The planning-spine COMPLETION-TEST (Stage 6) should be the anchor: "does this implementation satisfy the intent crystallized in Stage 3 of the planning loop?"
- An "audit spine" (separate from the planning spine) that traces decisions back to their planning origin

**Honest status:** WEAKEST. No structural fix committed. gap_SESSION_INJECTION_COMPRESSION is a symptom of this — the planning intent survives in HANDOFF files but is not surfaced during audit unless someone reads the archive.

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
*DRAFT v0.1 | Sonnet S080 | 2026-06-05*
*Gap noted: implementing+auditing inheritance weakness registered for structural fix in improvement-register (not yet added — will register at commit time per P-META-033)*
