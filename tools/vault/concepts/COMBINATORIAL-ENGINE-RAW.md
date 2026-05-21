---
id: vault.concepts.COMBINATORIAL-ENGINE-RAW
name: COMBINATORIAL-ENGINE-RAW
description: "Raw design note for the Combinatorial Engine — multi-dimensional reasoning with gradual organic data collection and response calibration"
type: vault_raw
protection_level: active
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "0.1"
session: S050
core_spines: [ARCH, AI, OPER]
core_spine: ARCH
schema_anchor: vault_files
impl_status: swift-implemented
links:
  - ai-conception.B_POLARITY_AS_COMPLEMENT
  - SIA.R2-01-PLATFORM-INTELLIGENCE-ENGINE
  - SIA.R3-01-JOURNEY-FRAMEWORK
context_question: "How does the Combinatorial Engine gather multi-dimensional context about a user while maintaining trust, sensitivity, and natural conversation flow?"
context_quote: "He will help me define it. Ask when the moment is organic. Calibrate by how he answers."
---

# Combinatorial Engine — Raw Design Note (S050 ARCH-SESSION)

> **VAULT-FIRST.** This is the raw captured concept.
> Not implemented. Not formally ratified. Governor ratifies before any build.
> Purpose: preserve the understanding before it drifts.

---

## What It Is (In Plain Language)

An engine that:
1. Maintains a multi-dimensional profile of each user/context
2. Knows what dimensions it has, and knows what it doesn't have
3. Actively, patiently completes the missing dimensions through organic conversation
4. Reasons FORWARD from the current vector state to surface insights the user hasn't seen
5. Calibrates how much it probes based on how the user responds

It is NOT a recommendation engine (pattern matching to historical data).
It IS a dimensional reasoning engine (forward simulation from current state).

---

## The Data Model (Preliminary)

```yaml
user_context:
  dimensions:
    - id: PROFESSIONAL_STATUS
      completeness: 0.8          # 80% filled
      last_updated: [timestamp]
      source: user_declared
      
    - id: FAMILY_RESILIENCE
      completeness: 0.2          # 20% filled — major gap
      last_updated: null
      source: null
      gap_fill_strategy: opportunistic  # not interrogation
      next_fill_opportunity: "when discussing work-life topics"
      
    - id: FINANCIAL_RUNWAY
      completeness: 0.6
      last_updated: [timestamp]
      source: inferred_from_conversation
      
  trajectory:
    current_vectors: [...]        # current state of all dimensions
    simulated_12_month: [...]     # where these vectors lead
    collision_risks: [...]        # cross-dimensional tensions detected
    surfacing_threshold: 0.7      # surface insight when confidence > 70%
```

---

## The Gradual Collection Protocol

**Three modes of data collection:**

**Mode 1 — Voluntary declaration:**
User shares information freely. Highest trust. No probing needed.
Engine absorbs, tags, links to relevant dimensions.

**Mode 2 — Organic opportunity:**
User is discussing Topic A. Topic A creates a natural opening for Dimension B.
Engine asks about B in a way that feels natural to the A conversation.
Example: discussing business employees → "How long have you been in this industry yourself?"

**Mode 3 — Humble gap fill:**
Dimension still missing after many interactions. Engine has a formulated question.
Asks once, at a low-friction moment, with no pressure.
If answered fully → can continue exploring that dimension.
If answered minimally (yes/no) → note it, don't push, find another moment.
If avoided → mark as sensitive, never probe again without new organic opportunity.

---

## Response Calibration Dashboard (Concept)

The engine tracks response patterns per user:

| Response type | What it means | Engine behavior |
|---|---|---|
| Long, detailed answer | High engagement, comfortable with topic | Can probe deeper |
| Short but complete | Answer given, not expansive | Accept and move on |
| Yes/No monosyllabic | Discomfort or boundary | Back off this dimension |
| Changed subject | Redirect signal | Stop, note, never bring back today |
| Returned to topic later | User reconsidered | Now a good moment to revisit |

---

## The Forward Reasoning Function (The Moat)

Most systems work on current state. This engine works on trajectories.

Given: current vector configuration
Do: simulate forward 3/6/12 months if current vectors continue
Find: collision points — where two dimensions that were fine individually create a problem together
Surface: the insight that neither dimension alone would have revealed

Example (from Governor): 
- Vector A: business expansion decision (HIGH stress, HIGH risk, HIGH reward potential)
- Vector B: young family (third child, relationship in adjustment period)
- Vector C: energy/resilience profile (entrepreneur, high but finite)
- Forward simulation: A + B + C → collision at 6 months if expansion proceeds at current pace
- Insight: "The business can succeed. But the current family state needs to be a deliberate variable in the expansion timing, not an ignored background factor."
- Surfacing: only when confidence > threshold AND the moment is right (Queen timing)

---

## Trust Architecture

The engine ONLY operates on declared information.
- User declared: uses freely
- User-derived (observed behavior): uses, but marks as inferred, lower confidence
- Platform-inferred without declaration: flags for consent, doesn't use until acknowledged

The surveillance line: the engine must never feel like it's monitoring. It must feel like it's listening.
The difference: the advisor synthesizes what you told them. Surveillance finds what you didn't.

---

## Connection to Existing CSPS Architecture

| Combinatorial Engine component | Existing CSPS element |
|---|---|
| Input capture | Threshold (R1.4) |
| Dimensional model | Node Schema (R1.1.1) — user profile nodes |
| Gap identification | PIE seeds monitor (R2.1.4) |
| Organic question routing | (NEW — not yet designed) |
| Response calibration | Human Psychology Hub (planned) |
| Forward reasoning | (NEW — the core engine, not yet designed) |
| Insight surfacing | Queen dimension of PE (R2.1.1) |
| Trust architecture | (NEW — consent/declaration model) |

The new elements are: organic routing, forward reasoning, trust consent model.
Everything else extends existing CSPS architecture.

---

## What This Requires from Other Platform Elements

1. **Vector Registry** — a formal schema of all possible dimensions for a context
2. **Completeness scoring per dimension** — tracked as a field in user profile nodes
3. **Opportunity detector** — identifies when the current conversation creates a natural opening for a gap-fill question
4. **Response pattern tracker** — maintains per-user response style for calibration
5. **Forward simulation function** — the hardest piece; requires modeling dimension interactions over time

---

## Status: VAULT-FIRST

This is raw thinking, not a plan. Before any build:
1. Governor ratifies the dimensional model
2. Opus designs the formal architecture (which dimensions, how interactions are modeled)
3. External research (what exists in multi-dimensional reasoning systems)
4. PMI scoring when ready to implement

---

*Combinatorial Engine Raw | Vault concept | S050 | Not yet ratified*
