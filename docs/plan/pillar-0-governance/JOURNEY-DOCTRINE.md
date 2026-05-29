---
id: csps.governance.journey-doctrine
name: JOURNEY-DOCTRINE
description: >
  System-wide journey design doctrine. Answers: what a journey is, the challenge it faces,
  what happens without it, what it prevents, what it enables, why order matters, what optimal
  order means, the best UX + psychological principles, and what to avoid. Governs every journey
  on the platform — onboarding, handoff, session, app-build. Status: draft, Governor ratification
  pending after M4 Vercel wire.
type: governance
diataxis_type: reference
protection_level: protected
status: draft
impl_status: swift-implemented
core_spine: GVRN
core_spines: [GVRN, AI, OPER]
schema_anchor: platform_governance
version: "1.0"
session: S070
owner: group:finky
authored_by: OPUS-13
lifecycle: production
lifecycle_state: active
ns_quality: [core-first, synergetic, core-maximal]
ns_path: "this → GVRN spine → North Star (journey-as-communication-act)"
context_question: >
  Before designing any step: is the order optimal — does it respect dependencies, manage cognitive
  load, build readiness, and give an early win? Before any cross-boundary communication: which
  journey type is this (onboarding / handoff / session / app-build), and which framing/ordering
  principle applies?
context_quote: >
  A journey is the difference between "the steps exist" and "the participant actually arrives,
  aligned and capable." — OPUS-13, S069
inherits_from: >
  communication-schema (situation: step-to-step-journey + tab-session-handoff)
  + communication-protocol-shared.md (RULE 4 Contextual Locality + RULE 7 ZCA)
  + B_CONTEXTUAL_LOCALITY + B_ZCA + B_MUTUAL_UNDERSTANDING_VALIDATION
  + PLAN-S069-COMMS-AND-JOURNEY.md
links:
  - rel: communication-schema
    href: communication-spine/communication-schema.yaml
  - rel: communication-spine-readme
    href: communication-spine/README.md
  - rel: s069-plan
    href: ../_handoff/PLAN-S069-COMMS-AND-JOURNEY.md
  - rel: developer-journey-page
    href: "../../../apps/csps-playground/src/app/platform/developer-journey/page.tsx"
  - rel: contextual-locality
    href: behavioral-contracts/B_CONTEXTUAL_LOCALITY.md
  - rel: zca
    href: behavioral-contracts/B_ZCA.md
build_status:
  m4_doc: "DONE (S070) — engraved verbatim from Opus-13 canonical text"
  m4_vercel: "DONE (S070) — editable section added to developer-journey page"
  ratification: "PENDING — Governor review required"
---

# CSPS Journey Doctrine

> **System-wide, status: draft.** Governs every journey on the platform — onboarding, session, handoff, app-build. Not dev-journey-only. Each section answers one fundamental question about what a journey is and how to design it well.
>
> *"A journey is the difference between 'the steps exist' and 'the participant actually arrives, aligned and capable.'" — OPUS-13, S069*

---

## §1 — WHAT IS A JOURNEY

A journey is an ordered, intentional progression of states a participant moves through to reach an outcome, where each step is designed relative to the participant's evolving readiness. It is not a checklist of tasks — it is an ordering-and-framing decision. A journey is the difference between "the steps exist" and "the participant actually arrives, aligned and capable."

---

## §2 — WHAT CHALLENGE IT FACES

Participants arrive with zero or partial context (ZCA) and uneven readiness. Cognitive load must be managed — too much at once causes abandonment, too little causes confusion. The designer suffers the curse of knowledge (assuming the participant knows what the designer knows). And there is a constant pull toward premature action — doing before understanding.

---

## §3 — WHAT HAPPENS WITHOUT IT

Steps get done in arbitrary order, so dependencies are violated (the roof before the foundation). Every actor reinvents the path, producing inconsistency and rework. Quality becomes accidental rather than designed — some arrive, most fall off. With no shared mental model, misalignment compounds at every boundary. This is the platform's "exists-but-not-active / partial-implementation" disease expressed at the human-process layer.

---

## §4 — WHAT A JOURNEY PREVENTS

Premature execution; order violations; overload-driven abandonment; drift and inconsistency across actors; rework from wrong-order decisions; boundary misalignment (the receiver starting from zero); and local optimization that improves one step while harming the whole.

---

## §5 — WHAT A JOURNEY ENABLES (WHY IT "MAKES IT HAPPEN")

Compounding readiness — each step prepares the participant for the next, so by the end they can do what they could not have done cold. Momentum and trust — early wins build the confidence required for harder later steps. Alignment — a shared path is a shared mental model, which makes handoffs clean. Quality-by-design — the outcome becomes reproducible, not lucky. A journey "makes it happen" because it removes the gaps where people fall off: it is the scaffolding that makes a hard outcome reachable by ordinary effort.

---

## §6 — THE IMPORTANCE OF ORDER

In any process, order encodes dependencies (you cannot do step N before its prerequisite), manages cognitive load (simple before complex), and builds context (each step's output is the next step's input). In a journey specifically, order is the primary design lever — it determines readiness, momentum, and whether trust is built before demand is made. A journey IS, fundamentally, an ordering decision.

---

## §7 — OPTIMAL ORDER (DEFINITION)

In general, optimal order: (a) respects all hard dependencies; (b) minimizes cognitive load at each step (just-enough, just-in-time); (c) maximizes early value and feedback; (d) front-loads the irreversible/foundational and defers the reversible/cosmetic; (e) keeps each step verifiable before the next begins. In a journey, optimal order additionally: (f) builds psychological readiness (competence and trust accrue so each step feels achievable); (g) reveals complexity progressively; (h) places the value/"aha" moment early enough to motivate completion.

---

## §8 — BEST UX + PSYCHOLOGICAL PRINCIPLES

Progressive disclosure; just-in-time context (Contextual Locality, P-UX-001); an early win / fast time-to-value; cognitive-load chunking (~7±2); visible progress and open loops (Zeigarnik); the goal-gradient effect (show proximity to the goal); recognition over recall; forgiveness and reversibility (safe to explore); consistency (Jakob's law); the peak-end rule (deliberately design the peak and the ending); endowed/started progress; safe defaults at decision points; and zero-context-assumption at every boundary.

---

## §9 — THINGS TO AVOID

Dumping everything at once; bare commands without context or reasoning (they trigger gap-filling with defaults); dead-end steps with no next move; hidden dependencies; forcing recall; invisible progress / no feedback; irreversible actions without confirmation; inconsistent patterns that force relearning each step; optimizing a single step in a way that harms the whole; and assuming prior context (the curse of knowledge).

---

## COMMUNICATION CORE — 4 DEMONSTRATIONS

These four demonstrations link the Journey Doctrine to the CSPS Communication Schema. A journey is a communication act — the platform telling the participant "here is the path, in this order, with this framing."

**Demo 1 — Every boundary is a communication act**
Tab→tab, AI→AI, step→step, system→user — a failure at any boundary is inherited by everything downstream. The tab-session-handoff situation governs this: Zone A/B/C/D + M-43 + alignment confirmation. The journey falls apart when boundaries fail.

**Demo 2 — Framing determines behavior**
Context + reasoning yields collaboration; a bare command makes the receiver fill gaps with defaults. HOW you say it determines the QUALITY of what is built. This is why every PROTO directive carries §1 PLANNING-DISCIPLINE context, not just instructions. The human-to-ai-directive situation governs this: threshold-classify + intent-crystallize before acting.

**Demo 3 — A journey IS communication**
The platform telling the participant "here is the path, in this order, with this framing." The step-to-step-journey situation governs each step: just-in-time context, single next action (not a menu), visible progress. The system-to-user situation governs what the app says at each step: ZERO jargon, plain language, encouraging tone.

**Demo 4 — Single-source + zero-navigation prevents drift**
One canonical source, no "see above," keeps everyone aligned. This is the communication-spine organizing hub (schema as SSoT for situations + contracts). The ai-to-human situation + B_CONTEXTUAL_LOCALITY + B_ZCA enforce it mechanically.

---

## Scope: Platform-Wide Applications

| Journey | Governed By | Key Principles |
|---|---|---|
| **Developer onboarding** (INFRA-FLOW 9 steps) | §7 Optimal Order + §8 Progressive Disclosure | Dependencies respected; early win at STEP 0; each step's output = next step's input |
| **Tab/Session handoff** | §4 Prevents boundary misalignment + Demo 1 | Zone A/B/C/D + M-43 + alignment confirmation = the journey doesn't restart at zero |
| **AI session** (Governor→AI→Governor) | Demo 2 Framing + §6 Order | Context+reasoning in every directive; threshold classifies before acting |
| **App build** (Product journey for end-users) | §8 UX Principles + Demo 3 + Demo 4 | End-user tier: ZERO jargon; single next action; visible progress; peak-end designed |

---

*Status: draft — Governor ratification pending. Engraved S070 M4 from OPUS-13 canonical text.*
