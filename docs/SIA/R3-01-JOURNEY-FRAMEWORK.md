---
id: SIA.R3-01-JOURNEY-FRAMEWORK
type: architecture
protection_level: protected
status: draft
core_spines: [ARCH, OPER]
context_question: "What is the complete option space for developer and user journeys in CSPS, and how does orchestration select the right bundle per persona?"
context_quote: "L3 journeys are not designed by hand. They are generated from the L2 option space by the orchestrator."
version: "0.1"
session: S050
name: "SIA-R3-journey-framework"
description: "L1/L2/L3 journey architecture — complete option space, orchestrated bundles"
owner: "group:finky"
lifecycle: "experimental"
lifecycle_state: "active"
---

# R3 — Journey Framework

> **Standalone document.** See [00-INDEX.md](00-INDEX.md) for full context.
> Journeys operate at 3 levels. L3 specific journeys are NOT designed — they are generated.

---

## 1. Why L1→L2→L3 Matters

[TO FILL: The problem with designing specific journeys: you design for one persona, then another persona arrives and the journey is wrong for them. You redesign. Then a third. Endless L3 design.

The SIA solution: design the full L2 option space once. The orchestrator generates L3 journeys from it. When a new persona arrives, the orchestrator selects a new bundle from the existing L2 options. No new design required.]

---

## 2. L1 — Journey Principles (Sealed)

[TO FILL: The universal principles that apply to every journey regardless of type.
Examples:
- Every journey has an entry_condition, stages, and exit_condition
- Every stage has an option space and an orchestration hook
- Every option is tagged with: activatable, persona_weights, friction_score, value_delivered
- The first value moment is always within the first 3 stages]

---

## 3. L2 — The Developer Journey Option Space

[TO FILL: The complete option space for developer journeys on CSPS.

Stages:
1. ORIENT
2. PLAN (7-section wizard)
3. BUILD (fork + delta)
4. VALIDATE (pnpm verify)
5. DEPLOY (Vercel)
6. EVALUATE (activation period)

For each stage: the full list of options with activation conditions and persona weights.
Example options for PLAN stage: [full 7-section | lightweight 4-section | minimal 2-section | skip (only for internal experiments)]

Threshold appears in this journey at: intake of every plan item before it enters the wizard.]

---

## 4. L2 — The User Journey Option Space

[TO FILL: The complete option space for user journeys.

This is NOT Alex's journey. This is the full option space from which Alex's journey (and every other user's journey) is generated.

Stages:
1. DISCOVERY
2. ONBOARDING
3. FIRST VALUE MOMENT
4. HABIT FORMATION
5. TRANSFORMATION

For each stage: all possible options, tagged with persona_fit, friction_cost, value_delivered.

Example options for ONBOARDING stage:
- context-capture (3 open questions about current situation)
- preference-setup (UX + notification preferences)
- role-calibration (type selection that weights AI categorization)
- problem-statement (free-form "what's your biggest friction?")
- skip (for power users, direct to product)

Each option: activatable: true/false | persona_weights: {cognitive-offload-professional: 0.8, contractor: 0.3, ...}]

---

## 5. L3 — Orchestrated Bundles

[TO FILL: The orchestrator is a component of R2 (Platform Intelligence Engine). Given a persona profile, it selects one option from each stage's option space to create an L3 bundle.

Alex's bundle (cognitive-offload-professional):
- ONBOARDING: role-calibration + problem-statement (weight 0.8 each)
- FIRST VALUE MOMENT: auto-categorized capture displayed without manual sorting (weight: 0.9)
- [etc.]

This is an L3 instance — not a design, a generation.
The design work is in L2 (defining the option space). L3 is the output.]

---

## 6. Threshold in the Journey

[TO FILL: Every user action in the journey passes through Threshold classification before triggering system response. Every developer plan item passes through Threshold before entering the wizard. Threshold is the entry point to all journeys.]

---

## 7. The Playground as Journey Visualization

[TO FILL: The CSPS Playground (csps-playground.vercel.app) is the rendered understanding layer for journeys. The /platform/developer-journey route shows the L2 developer option space (all options, their activation states, their persona weights). The /platform/user-journey route shows the L2 user option space.

These pages are NOT static. They reflect the current state of the journey architecture. When an option is activated or deactivated, the playground updates.]

---

*CSPS — SIA | Journey Framework v0.1 | S050 | Protection: protected (proposed)*
