---
id: csps.platform-intelligence.pe-overview
name: pe-overview
description: >
  Comprehensive reference for the Priority Engine (PE) — definition, platform positioning,
  role, dependencies, principles, and operational detail. Authoritative synthesis for
  Governor, external reviewers, and onboarding sessions.
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: platform_intelligence
session: S089
tags:
  - domain:governance
  - domain:platform
  - type:reference
  - audience:admin
  - audience:developer
  - maturity:stable
links:
  - { rel: domain-card, href: ../platform-audit/platform-services/priority-engine.md }
  - { rel: schema, href: ../../tools/templates/priority-engine.schema.yaml }
  - { rel: situation-registry, href: ../plan/pillar-0-governance/pe-situation-registry.md }
  - { rel: pe-agent-spec, href: ../plan/pillar-0-governance/meta-platform/pe-agent.md }
  - { rel: pe-dashboard, href: ../platform-audit/platform-services/pe-dashboard.md }
  - { rel: deep-report, href: ./CSPS-report-on-Priority-Engine-for-CSP-2026-06-03.md }
---

# Priority Engine (PE) — Full Reference Overview

> **One-line definition:** The PE is the work-sequencing engine of CSPS — a continuous,
> multi-dimensional scoring system that determines *what gets done next, where it executes,
> and with which AI capability*, across every spine of the platform.

---

## 1. Definition

The **Priority Engine** is not a ranked list and not a one-time session plan. It is a
**live scoring mechanism** that recalculates on every significant platform signal. It
produces a priority score (PE score) for every pending work item, assigns that item to
a priority band, and selects the AI model tier best suited to execute it.

Three questions define PE's scope:

| Question | PE's answer |
|---|---|
| *What should we do next?* | The item at the top of the PE queue (highest score, no unresolved blockers) |
| *What band of urgency does it carry?* | BAND-1 (BLOCKING) → BAND-4 (VAULTED), computed by formula |
| *Is the AI drifting to lower-priority work?* | B_PE_ALIGNMENT_GUARDIAN deflects any drift |

**PE is binding on sequence, not on decision.** The Governor decides WHETHER items enter
the queue. PE decides WHEN and in what order they execute.

---

## 2. Platform Positioning

```
CSPS Platform Spine Hierarchy
─────────────────────────────
GVRN (Governance)          ← PE lives here as a GVRN-owned service
  └── ARCH (Architecture)
  └── AI  (AI Behavior)
  └── VALD (Validation)
  └── OPER (Operations)
```

**Spine ownership:** GVRN (decisions are sequenced; PE is how they get ordered).

**Scope:** Cross-cutting — every spine's work is PE-scored. PE does not belong to one
domain; it orchestrates across all five.

**Position in the platform stack:**

```
Governor Intent
      │
      ▼
Priority Engine  ◄── recalculates on every monitor signal
      │
      ▼
Context Orchestrator  ◄── selects PE composition + loads correct context bundle
      │
      ▼
AI Tier Selection  ◄── Haiku / Sonnet / Opus, chosen by Model PE
      │
      ▼
Execution (Sonnet builds / Opus reviews / Haiku scans)
      │
      ▼
Validation Gate (VALD spines, ZF discipline)
      │
      ▼
Outcome feeds back into PE monitor signals
```

---

## 3. Role

| Role dimension | What PE does |
|---|---|
| **Sequencing** | Ranks all pending items; highest-PE item is the mandate for the next execution unit |
| **Composition selection** | Chooses which weight matrix applies (governance / build / growth / emergency) based on platform state |
| **Model-tier routing** | Dimension 3 (Model PE) sends each task to the right AI tier |
| **Anti-drift enforcement** | B_PE_ALIGNMENT_GUARDIAN blocks any AI response that pivots from the PE-top item without explicit Governor override |
| **Completion protection** | B_COMPLETION_OVER_SHINY gives active work (>50% complete) a 1.5× PE multiplier so it is never abandoned mid-stream |
| **Emergency override** | In emergency-mode, BLOCKING items receive PE = ∞; all non-blocking items collapse to PE = 0 |
| **Situation awareness** | PE respects declared Situations (meta-states set by the Governor) that override band assignments for entire classes of items |

---

## 4. The PE Formula

### 4.1 Basic Form (5 dimensions)

```
PE_SCORE = (B × 0.30) + (D × 0.30) + (I × 0.15) + (Bn × 0.10) + (PAS × 0.15)

B   = Breadth    — how many platform areas benefit
D   = Depth      — how foundational (L1 spine vs. feature vs. cosmetic)
I   = Impact     — concrete value delivered (user/developer/revenue)
Bn  = Blockers_now — how many blocked items this unblocks
PAS = Path Alignment Score — alignment with the current platform situation
```

All dimensions scored 1-10. Weights are context-adjusted by PE type
(PLATFORM / CUSTOMER / USER).

### 4.2 Full 3-Dimension Form

```
PE_final = (Work PE × composition_weight)
         × (Execution PE)
         × (Model PE)
         × escalation_multiplier

Work PE = breadth × depth × impact ÷ dep_satisfied ÷ multi_session_cost
        × 1.5  if active work >50% complete (B_COMPLETION_OVER_SHINY)
        × 0    if BLOCKING VLT is open (emergency-mode override)

Execution PE = task_complexity × cross_domain_refs × real_time_decision_required

Model PE = task_class_tier_rating × blast_radius_tier_modifier
```

**Dimension 1 — Work PE:** What to do next. Classic multi-factor priority.

**Dimension 2 — Execution PE (CSPS original):** Where to execute. Low-cost isolatable
tasks → cache/MCP (Tier 0-1). Cross-domain synthesis → main context only (Tier 4).
This prevents expensive model context from being consumed by mechanical work.

**Dimension 3 — Model PE:** Which AI capability tier handles this task.
`MECHANICAL_SCAN` → Haiku. `STANDARD_BUILD` → Sonnet. `DEEP_REASONING` → Opus.
Model tier never downgrades during active work (QG1 immutable rule).

### 4.3 Scoring Adjustments

| Modifier | When it fires | Effect |
|---|---|---|
| FOUNDATION_EXIT_GATE | App-layer item during BEDROCK_BUILDING situation | × 0 (multiplicative zero — hard block) |
| COMPLETION_PROXIMITY_BOOST | Item >0% complete | + (completion_pct / 100) × 1.5 |
| SPINE_FINDINGS_BOOST | Spine with ≥3 open findings | + 2.0 per qualifying spine |
| MOAT_SCORE bonus | Item strengthens a platform moat | + 0-5 points |
| Idle-time escalation | No progress for ≥10 sessions | Auto-promote to Band 1 |
| SITUATION_OVERRIDE | Active Situation declares all-Band-1 for a class | Overrides computed score |

---

## 5. Priority Bands

| Band | Score range | Meaning |
|---|---|---|
| **BAND-1 (BLOCKING)** | PE ≥ 7.5 OR Situation override | Must complete before any new work is started |
| **BAND-2 (HIGH)** | PE 7.0 – 7.49 | Important and unblocked; next in queue after Band-1 clears |
| **BAND-3 (MEDIUM)** | PE 4.0 – 6.99 | Scheduled for the next cycle |
| **BAND-4 (VAULTED)** | PE < 4.0 | Valuable but not yet time; preserved, not discarded |

---

## 6. The 4 PE Compositions

A **composition** is a weight matrix that tells PE which spines to amplify for the
current platform context. The Context Orchestrator selects it automatically based on
monitor signals and escalation ladder state.

### governance-mode
**Trigger:** GVRN directive, ZF gate, constitutional decision, ratification  
```
GVRN × 2.0 | VALD × 1.5 | ARCH × 1.0 | AI × 0.8 | OPER × 0.5
```
Governance work sits at the absolute top of the queue. Validation keeps it honest.

### build-mode
**Trigger:** Implementation batch, schema work, coding sprint  
```
ARCH × 2.0 | VALD × 1.5 | GVRN × 1.0 | OPER × 0.8 | AI × 0.5
```
Architecture drives. Validation enforces quality. Governance holds reference position.

### growth-mode
**Trigger:** App #2+, marketing, revenue, graduation  
```
OPER × 2.0 | ARCH × 1.5 | GVRN × 1.0 | VALD × 0.8 | AI × 0.5
```
Operations and delivery take precedence when the platform enters market-facing mode.

### emergency-mode
**Trigger:** BLOCKING validator fired, new PENDING VLT  
```
BLOCKING items: PE = ∞ (override everything)
All non-blocking items: PE = 0
B_COMPLETION_OVER_SHINY: suspended
```
Everything stops. The blocker is the only job.

---

## 7. Continuous PE Loop

PE does not compute once per session. It is a live loop:

```
MONITOR SIGNAL fires
  │  (VLT status change, phase gate closes, context threshold crossed,
  │   Governor provides new priority input)
  ▼
ESCALATION LADDER evaluates
  ▼
PE COMPOSITION selected
  ▼
PE RECOMPUTES (all 3 dimensions with new composition weights)
  ▼
TIER SELECTION updated
  ▼
EXECUTION (actual work)
  ▼
OUTCOMES feed back into monitors
  ▼
[next signal → loop repeats]
```

**Trigger events (non-exhaustive):**
- A VLT transitions PENDING → RESOLVED (or new PENDING opens)
- A phase gate closes (new phase opens)
- Context utilization crosses a ladder threshold
- Governor provides priority input
- An IMPL_BATCH boundary is reached

---

## 8. PE Situation Types

**Situations** are Governor-declared meta-states that shift *how* PE scores and sequences
work without changing the formula itself. They operate above the formula — declaring
which items are in scope, which bands are auto-assigned, and what the current completion
gate is.

> Situations are NOT exceptions to PE. They ARE PE, operating at a higher level of
> abstraction.

| Situation | Status | Core rule |
|---|---|---|
| **BEDROCK_BUILDING** | CLOSED (S022) | App-layer items = PE 0. All bedrock = Band 1. Foundation must complete first. |
| **STRATEGIC_COMPLETION** | CLOSED (S022) | All sessions in the completion plan = Band 1. New scope deflected. B_COMPLETION_OVER_SHINY at 1.5×. |
| **APP_BUILD_MODE** | **ACTIVE** | Foundation is maintenance (Band 3). App topic-plans PE-scored normally. Graduation tracker runs per app ($1K MRR). |
| **OPUS_ARCHITECTURAL_REVIEW** | PENDING | All implementation vaulted until Opus output arrives. Opus output items auto-Band 1. |

**To declare a new Situation, the Governor must provide:**
1. Declaration (verbal or written)
2. Evidence block (the gap or state being addressed)
3. Entry / exit criteria (mechanically verifiable)
4. PE auto-rules (what scoring changes)
5. Validator that confirms continued relevance

---

## 9. Dependencies

### 9.1 What PE depends on

| Dependency | Purpose |
|---|---|
| `tools/templates/priority-engine.schema.yaml` | Canonical formula, compositions, situation logic, model-tier matrix |
| `tools/pe-compute.mjs` | Reference computation implementation |
| `tools/data/pe-score-last-run.json` | Last computed scores (persisted per session) |
| `tools/validators/validate-pe-connectivity.mjs` | BLOCKING — enforces PE fields present on active plans |
| `tools/validators/validate-pe-dashboard.mjs` | ADVISORY — outputs sorted priority queue |
| `tools/model-tier-registry.yaml` | Maps task_class → AI tier (Haiku/Sonnet/Opus) |
| `docs/plan/pillar-0-governance/pe-situation-registry.md` | Active situation overrides |
| Governor directives | The only human input that can override PE band assignments |

### 9.2 What depends on PE

| Dependent | How it uses PE |
|---|---|
| Context Orchestrator | PE composition selection drives context bundle loaded at session start |
| Session mandate | The ratified PE-top item IS the session mandate |
| VALD spine | Emergency-mode fires when BLOCKING VLT opens; PE collapses all other items |
| GVRN ratification | PE proposes bundles; Governor ratifies; PE enforces execution order |
| AI tier selection (Model PE) | Every task dispatched to Haiku/Sonnet/Opus via Model PE dimension |
| B_PE_ALIGNMENT_GUARDIAN | Fires whenever AI output would pivot from the PE-top item |
| PE Dashboard | Reads PE scores; surfaces current state for Governor and developer |
| All topic-plans | Required fields: `priority_score`, `priority_band`, `pe_score_per_session` |

---

## 10. Main Principles

### P1 — PE is binding on sequence, not on inclusion
The Governor decides what enters the platform. PE decides when and in what order it
executes. These are separate authorities; neither can override the other's domain.

### P2 — PE is continuous, not periodic
PE does not reset at session start. It is a live score that recalculates on every
monitor signal. A session mandate is a snapshot of PE at a specific moment; it is not
"the plan for this session forever."

### P3 — Completion beats shiny
Work that is >50% complete receives a 1.5× PE multiplier. The structural reason: a
platform with 12 half-done capabilities is weaker than one with 6 shipped capabilities.
Abandoning 80%-complete work is the primary AI drift failure mode.

### P4 — Emergencies are total
In emergency-mode, BLOCKING items go to PE = ∞ and all non-blocking items go to PE = 0.
There is no "partial emergency." The platform fully stops until the blocker clears.

### P5 — Situations are context, not exceptions
A Situation declared by the Governor does not modify the formula — it declares the
context within which the formula operates. "No exceptions to PE" is a core invariant.
Situations are how the Governor shapes PE legitimately.

### P6 — Model tier never downgrades mid-work
Once a task begins on a given AI tier (e.g. Opus architectural review), the tier does
not reduce for that work unit. Downgrading mid-work risks quality collapse.

### P7 — B_PE_ALIGNMENT_GUARDIAN is constitutional
Any AI response that pivots from the PE-top item without explicit Governor override
must be deflected with a 3-block response: (1) name the drift, (2) surface the PE
ranking, (3) ask for Governor direction. Sycophantic agreement with requests to skip
PE-top items is a constitutional violation.

### P8 — PE does not self-direct AI
The PE Agent proposes bundles. Opus reviews. Governor ratifies. Only then does Sonnet
implement. The chain is: PE proposes → Governor approves → Opus directs → Sonnet builds.
PE never issues its own execution orders.

---

## 11. Behavioral Contracts

| Contract | What it enforces |
|---|---|
| **B_PE_ALIGNMENT_GUARDIAN** | 3-block deflection when AI output misaligns with PE top-priority |
| **B_COMPLETION_OVER_SHINY** | 1.5× PE multiplier for active work >50% complete |
| **B_DECISION_LEDGER** | Every consequential PE bundle records chosen + rejected options with reasoning |
| **B_REVERSIBILITY_GATED_REVIEW** | High-blast-radius PE items require Governor gate before execution |

---

## 12. Actors and Governance Chain

| Actor | Role in PE |
|---|---|
| **Governor** | Declares Situations; ratifies bundles; the only entity that can override PE band |
| **Opus (Director)** | Runs PE Agent; reviews bundle proposal; writes Turn directive to Sonnet |
| **PE Agent** | Reads topic-plans; computes PE scores; proposes bundles |
| **Sonnet (Builder)** | Implements the ratified bundle in PE-mandated order |
| **Haiku Scout** | Mechanical breadth scans that feed PE data (presence checks, pattern matching) |
| **Context Orchestrator** | Reads current PE composition; loads the right context bundle per session |

**Hard rule:** PE Agent cannot self-direct Sonnet. The chain is always:
`PE Agent proposes → Opus reviews → Governor ratifies → Sonnet executes`.

---

## 13. What PE Solves (and What Breaks Without It)

### Without PE
- Work is driven by what *feels* urgent or what the AI is excited about
- Shiny new items displace 80%-complete work → 12 half-done features, no shipped capabilities
- Foundation items lose to features → platform has no bedrock
- Governance loses to coding → platform drifts from its own rules
- Each session makes progress in one direction while accumulating debt in three others

### With PE
- Every work item has a computed score; the highest score is the mandate
- Completion is structurally protected (1.5× multiplier)
- Emergencies surface automatically (BLOCKING VLT = emergency-mode, no manual triage)
- Model cost is optimized (Haiku for scans, Sonnet for builds, Opus for architecture)
- Governor focus stays on decisions, not sequencing — PE handles the queue

---

## 14. Current State vs. Planned Evolution

### Active (now)
- Core PE formula (5-dimension basic + 3-dimension full)
- 4 PE compositions (schema artifacts)
- B_COMPLETION_OVER_SHINY enforced
- B_PE_ALIGNMENT_GUARDIAN enforced
- `validate-pe-connectivity.mjs` (BLOCKING — active plans must have PE fields)
- `validate-pe-dashboard.mjs` (ADVISORY — sorted priority queue output)
- PE Situation Registry with 4 situations (APP_BUILD_MODE currently ACTIVE)

### Planned (not yet live)
- Continuous PE loop (recalculates on monitor signals, not just session boundaries)
- PE Orchestrator selecting compositions based on escalation ladder states automatically
- `get_pe_ranking()` as a queryable MCP tool (real-time)
- Full §8/§9 MCP surface (composition, multiplier, completion-status queries)

---

## 15. Quick Reference Card

```
PE Score = (B×0.30) + (D×0.30) + (I×0.15) + (Bn×0.10) + (PAS×0.15)
         × composition_weight × Execution_PE × Model_PE × escalation_multiplier

Bands:  ≥7.5 → BLOCKING | 7.0-7.49 → HIGH | 4.0-6.99 → MEDIUM | <4.0 → VAULTED

Modes:  governance (GVRN×2)  | build (ARCH×2) | growth (OPER×2) | emergency (BLOCKING=∞)

Active situation: APP_BUILD_MODE (S022 onwards)
  → Foundation = Band 3 (maintenance)
  → App topic-plans = scored normally
  → Graduation target = $1K MRR per app

Key contracts: B_PE_ALIGNMENT_GUARDIAN | B_COMPLETION_OVER_SHINY | B_DECISION_LEDGER

Source files:
  docs/platform-audit/platform-services/priority-engine.md  (domain card)
  docs/plan/pillar-0-governance/pe-situation-registry.md    (situations)
  tools/templates/priority-engine.schema.yaml               (canonical schema)
  tools/pe-compute.mjs                                      (implementation)
```

---

*PE Overview v1.0 | Session S089 | 2026-07-14*  
*Authority: priority-engine.schema.yaml + B_PE_ALIGNMENT_GUARDIAN + pe-situation-registry.md*
