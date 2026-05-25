---
id: csps.plan.intake-orchestrator
name: INTAKE-ORCHESTRATOR-DESIGN
description: "Intelligent Intake Orchestrator — gradual depth-level checklist with Governor ratification gates, expert agent decision tree (infer vs. ask), proactive 2-minute engagement, and detailed dashboard. Governor S060 Q4 directive. Awaiting Governor ratification before Phase 1 build."
version: 0.1.0
type: explanation
diataxis_type: explanation
owner: group:finky
lifecycle: experimental
lifecycle_state: active
impl_status: swift-implemented
core_spine: AI
schema_anchor: pillar_0_governance_leaves
ns_quality:
  - i2i
  - synergetic
status: awaiting-governor-ratification
session: S060
tags:
  - domain:ai
  - type:explanation
  - audience:developer
  - audience:admin
  - maturity:draft
links:
  - { rel: threshold-intake-protocol, href: ./pillar-0-governance/threshold-intake-protocol.md }
  - { rel: human-intent-crystallization, href: ./pillar-0-governance/human-intent-crystallization.md }
  - { rel: ab-testing-moat, href: ./pillar-0-governance/AB-TESTING-MOAT.md }
consolidation_cross_refs:
  - .csps/threshold/intake-log.yaml
  - tools/config/unified-plan.yaml
---

# Intelligent Intake Orchestrator — Design Document

> **Governor S060 Q4 Directive:** "create list of points.. checklists with several depth levels.
> i need to go over them and ratify. gradual gentle asking. expert agent orchestrator.
> 'Do you have 2 minutes?' proactive engagement. detailed dashboard."

> **Status:** Awaiting Governor ratification. The Governor reviews the §1 checklist and
> §6 Governor Review Items before ANY Phase 1 build work begins.

---

## §1 — Depth-Level Checklist

> **Governing principle:** Never ask what can be confidently inferred. Questions must sound like
> a thoughtful colleague who already knows the context — not a form.

---

### Level 0 — Intent Capture (ALWAYS)

**What it is:** The opening question. Zero assumptions. Always asked.

**Mandatory:** Yes — no exceptions. Every new intake starts here.

**What is asked:**
> "What do you want to build?"

**Format:** Free text. No options presented. No multiple choice.

**What AI does with it:** Routes to Threshold classification + seeds Level 1 inference.

**What triggers Level 1:** Any response that contains a discernible build intent.

**What does NOT trigger Level 1:** "I don't know yet" → deflect to Discovery mode
(show examples of what's been built, ask which resonates).

---

### Level 1 — Pillar Classification

**What it is:** Category of the thing being built.

**Options:** APP / FEATURE / PROCESS / CONTENT / TOOL

**AI infers from Level 0:** In >90% of cases the classification is unambiguous.

**Mandatory:** The classification always happens. The *question* is only asked when ambiguous.

**When AI asks (ambiguous signal):** Level 0 response contains overlapping signals, e.g.,
"I want to build a system for tracking my clients" — is this an APP or a PROCESS?

**If asked:**
> "Quick check — is this a full app your clients will use, or an internal process you'll manage?"

**What triggers Level 2:** Classification confirmed (by inference or answer).

---

### Level 2 — Domain and Avatar Detection

**What it is:** What domain does this serve, and who is the primary user?

**Domain taxonomy:** (from `docs/plan/pillar-0-governance/domain-taxonomy.md`)
Service business / E-commerce / Content / Community / Operations / Financial / Health / Other

**Avatar detection:** AI reads the Level 0 response + domain for avatar signals:
- "my clients" → B2C service business owner avatar
- "our team" → Internal ops avatar
- "students" → Education avatar

**Mandatory:** Domain classification always happens. Avatar detection always happens.
**Question:** Asked only when avatar is unclear or domain is ambiguous.

**If asked (one question only):**
> "Who's the primary person using this — you internally, your clients/customers, or a mix?"

**What triggers Level 3:** Domain + avatar confirmed.

---

### Level 3 — Core Loop Crystallization

**What it is:** The 1–2 sentence description of what problem this actually solves.
The "job to be done" — not what it does, but what it makes possible.

**AI infers:** From all prior signals combined. Proposes crystallization for confirmation.

**What AI proposes:**
> "So the core job is: [proposed crystallization]. Does that capture it, or is there a piece
> I'm missing?"

**Max 1 question.** If the user says "close but not quite" — AI refines once, then locks.

**Mandatory:** Yes — no plan item moves forward without a crystallized core loop.

**What triggers Level 4:** User confirms the crystallization (explicit "yes" or silence for 24 hours).

---

### Level 4 — Specifics

**What it is:** Who exactly (demographics / psychographics), market position, and whether
users will pay for this.

**AI infers from:** Level 2 avatar + Level 3 core loop + Threshold classification signals.

**What AI confirms (not asks — confirms):**
> "Confirming what I think I know: you're building for [avatar description], competing with
> [inferred alternatives], and this is [free / paid / TBD]. Is that right?"

**Max 1 confirmation question.** User can correct any part inline.

**Mandatory:** Market position + willingness-to-pay must be explicitly confirmed before
Phase 1 scope is set. Avatar must be named, not generic.

**What triggers Level 5:** Specifics confirmed.

---

### Level 5 — Phase 1 Scope

**What it is:** What gets built first. AI proposes the smallest useful slice.

**AI proposes:**
> "For Phase 1, I'd suggest: [3 bullet scope]. This gives you [core value] without over-building.
> Does this match where you want to start, or do you want to add/remove something?"

**Governor reviews and ratifies.** This is the final gate before implementation begins.

**Mandatory:** Phase 1 scope must be Governor-ratified. AI cannot proceed to implement without
explicit confirmation.

---

### Level Summary Table

| Level | Name | Always Asked? | AI Infers? | Max Questions | Trigger to Next |
|---|---|---|---|---|---|
| 0 | Intent Capture | YES | No | 1 (open) | Any build intent detected |
| 1 | Pillar Classification | Only if ambiguous | YES | 1 | Classification confirmed |
| 2 | Domain + Avatar | Only if unclear | YES | 1 | Domain + avatar confirmed |
| 3 | Core Loop | Never — AI proposes | YES (proposes) | 1 confirmation | User confirms crystallization |
| 4 | Specifics | Never — AI confirms | YES (infers) | 1 confirmation | Specifics confirmed |
| 5 | Phase 1 Scope | AI proposes, user adjusts | YES (proposes) | 1 ratification | Governor explicit confirm |

---

## §2 — Expert Agent Orchestrator Architecture

> **Core principle:** This is NOT a chatbot and NOT a form. It is a single intelligent agent that
> reads available context and determines the minimum set of questions needed to reach a ratifiable
> plan. A thoughtful colleague who has already done their homework before asking you anything.

### 2.1 — Agent Identity

```
Name: Intake Orchestrator Agent
Class: Class A (CSPS-built, governed per AAP)
Role: Intake depth-level manager
Trust tier: T2 (operates within ratified intake protocol)
Output contract: Depth-level intake record → plan item seed
```

### 2.2 — What the Agent Reads Before Asking Anything

Before generating a single question, the Intake Orchestrator loads:

1. **Threshold classification** — `.csps/threshold/intake-log.yaml` — what has this user
   already classified?
2. **Avatar detection signals** — prior session context from `cie-state.yaml`
3. **Prior session signals** — most recent handoff Zone B: what was in progress?
4. **Existing plan items** — `tools/config/unified-plan.yaml` — is this a continuation of
   something already seeded?
5. **Domain signals from Level 0 text** — NLP-light pattern matching on the raw intent

This pre-load is what enables inference. The agent is not starting cold.

### 2.3 — Decision Tree: Ask vs. Infer vs. Defer

```
For each depth level:

INFER when:
  - Confidence ≥ 80% from prior signals
  - Classification is unambiguous from Level 0 text
  - Avatar matches an existing registered profile

ASK when:
  - Confidence < 80% AND the gap is blocking deeper levels
  - Multiple plausible classifications exist
  - The question is load-bearing (wrong answer = wrong build direction)
  - RULE: maximum 1 question per level

DEFER when:
  - The detail is nice-to-have but not blocking
  - The user has signaled "not now"
  - The item can be inferred later from behavior (willingness-to-pay deferred to
    pricing test, not upfront question)
```

### 2.4 — Hard Rules

| Rule | Statement |
|---|---|
| R-IO-001 | NEVER ask if AI can confidently infer (≥80% confidence threshold) |
| R-IO-002 | MAX 1 question per depth level per conversation turn |
| R-IO-003 | Questions sound like a colleague who did their homework — never a form field |
| R-IO-004 | NEVER ask for information that exists in prior session signals |
| R-IO-005 | NEVER proceed to Phase 1 scope without Governor ratification |
| R-IO-006 | A crystallization proposal is NOT a question — it is a statement for confirmation |
| R-IO-007 | Level 0 is always open text — never multiple choice |

### 2.5 — Orchestrator State Machine

```
IDLE
  │
  ▼ (session start, incomplete intake detected)
LOAD_CONTEXT ──────────────────────────────────────────────────┐
  │                                                             │
  ▼                                                         (all context
EVALUATE_GAPS                                              loaded, gaps mapped)
  │
  ├── no gaps → COMPLETE (no question needed)
  └── gaps found → PROACTIVE_ENGAGEMENT_CHECK
                     │
                     ├── session start + "Do you have 2 minutes?" → PROACTIVE_ASK
                     └── mid-task → DEFER_UNTIL_SESSION_BOUNDARY
                                      │
                                      ▼
                                    QUEUE_QUESTION
                                      │
                                      ▼ (user answers)
                                    UPDATE_RECORD
                                      │
                                      ▼
                                    RE_EVALUATE_GAPS
                                      │
                                      ├── more gaps → QUEUE_NEXT_QUESTION
                                      └── no gaps → COMPLETE → seed plan item
```

---

## §3 — Proactive Engagement System

### 3.1 — Trigger Conditions

The proactive engagement fires when ALL of the following are true:

1. A session has just started (within the first 2 turns)
2. The user has at least 1 incomplete intake item (a plan seed with depth < 3 confirmed levels)
3. The incomplete item is NOT currently being worked on actively
4. The user has NOT said "not now" for this item in the last 3 sessions

### 3.2 — The "2-Minute" Message

The message is not a popup. It is a natural first-turn observation, formatted as:

> "Do you have 2 minutes? I have [N] questions that would help me [specific concrete benefit].
> Specifically: [one-line of what this unlocks]. Takes 2 minutes max. Or say 'not now' and I'll
> ask again in a few sessions."

**Examples (not generic):**
- "Do you have 2 minutes? I have 2 questions about the debt collection app that would help me
  propose a Phase 2 scope. Once I know the target user segment and whether it's self-serve or
  assisted, I can map out the next build sequence. 2 minutes max."
- "Do you have 2 minutes? One question about the intake orchestrator avatar would let me finalize
  the question phrasing. Takes 30 seconds."

### 3.3 — Prioritization of Questions

Not all gaps are equal. Proactive engagement asks about the **highest-blocking gap first**:

Priority order:
1. Missing core loop crystallization (Level 3) — blocks all downstream planning
2. Missing avatar specifics (Level 2) — blocks voice profile + question phrasing
3. Missing Phase 1 scope confirmation (Level 5) — blocks implementation sessions
4. Missing willingness-to-pay signal (Level 4) — blocks pricing strategy

### 3.4 — Opt-Out Behavior

| User says | System response |
|---|---|
| "not now" | Reschedule: no proactive ask for next 3 sessions (tracked in `cie-state.yaml`) |
| "remind me later" | Same as "not now" |
| "never ask about this" | Mark the item as `proactive_engagement_suppressed: true` |
| No response (ignores it) | Treat as "not now" — do not repeat in same session |

### 3.5 — Anti-Pattern Guard

**NEVER fire proactive engagement:**
- Mid-task (when the user is in the middle of implementation work)
- After the first 2 turns of a session
- If the user has already addressed the gap in the current session
- More than once per session for the same item

---

## §4 — Dashboard Requirements

> **Governing principle:** The dashboard tells the Governor what the intake process is teaching us —
> not just what people said, but how the process itself is performing.

### 4.1 — Active Tests View

**Purpose:** What intake questions are currently pending for each user/app?

**Fields per row:**

| Field | Description |
|---|---|
| App / Item ID | Which plan item or app |
| Current depth level | 0–5 |
| Pending questions | List of unresolved levels |
| Last engagement | When was the last intake interaction? |
| Proactive status | Scheduled / Suppressed / Active |
| Blocking level | What is preventing depth advancement? |

**Filters:** By depth level, by avatar type, by engagement status.

### 4.2 — Completion Funnel

**Purpose:** What percentage of items reach each depth level?

```
Level 0: 100% (every item starts here)
Level 1:  94% (6% stall at pillar classification)
Level 2:  78% (16% stall at domain/avatar)
Level 3:  61% (17% stall at core loop crystallization)
Level 4:  48% (13% stall at specifics confirmation)
Level 5:  31% (17% never get Phase 1 scope ratified)
```

**Target:** ≥70% reach Level 3. ≥50% reach Level 5.

**Visualized as:** Horizontal funnel with drop-off percentages annotated per step.
Color: Green ≥ target. Yellow 10% below target. Red > 20% below target.

### 4.3 — Question Effectiveness

**Purpose:** Which questions most increase plan completeness?

**Metric:** After asking question X, what is the average depth-level gain in the next 3 sessions?

**Fields:**

| Question | Level | Times Asked | Avg Depth Gain | Skip Rate | Confidence Boost |
|---|---|---|---|---|---|
| "What do you want to build?" | 0 | N/A (always) | — | 0% | — |
| "Is this an app or a process?" | 1 | 23 | +1.4 | 8% | +18% |
| "Who's the primary user?" | 2 | 31 | +0.9 | 12% | +11% |

**Key insight this enables:** If "Who's the primary user?" has a 12% skip rate and only +0.9 depth
gain, the phrasing needs improvement. This feeds into A/B testing (§ integration below).

### 4.4 — Response Time Analysis

**Purpose:** How long does it take users to answer each question?

**Why it matters:** Long response time = question is too complex, too threatening, or poorly timed.

**Fields:**

| Question | Level | Avg Response Time | Median | P95 | Flag |
|---|---|---|---|---|---|
| Level 0 intent capture | 0 | 47s | 32s | 3m | — |
| Core loop confirmation | 3 | 2m 14s | 1m 48s | 8m | SLOW |

**Flag:** Response time P95 > 5 minutes = question is a friction point. Flag for redesign.

### 4.5 — Skip Analysis

**Purpose:** Which questions are users skipping most, and why?

**Skip types:**
- **Explicit skip:** User said "not now" or "skip"
- **Implicit skip:** No response in 7 days
- **Proactive suppressed:** User asked not to be prompted

**Per question, show:**
- Skip rate (%)
- Skip type breakdown
- Cohort: do specific avatar types skip more than others?
- Recovery rate: of items that are skipped, what % eventually get answered?

### 4.6 — Cohort Analysis

**Purpose:** Do different avatar types answer intake questions differently?

**Cohorts:** Based on Level 2 avatar detection. E.g., "overwhelmed-business-owner" vs
"systematic-operator" vs "first-time-builder."

**Cross-cohort comparisons:**

| Metric | overwhelmed-business-owner | systematic-operator |
|---|---|---|
| Avg depth reached | 2.8 | 4.1 |
| Skip rate (Level 3) | 22% | 6% |
| Proactive engagement response | 54% | 81% |
| Time to Level 5 (days) | 14 | 5 |

**Key insight:** If "overwhelmed-business-owner" cohort stalls at Level 3, the core loop
crystallization question needs to be simplified for that avatar. Feeds back into voice profiles.

### 4.7 — A/B Integration Panel

**Purpose:** Surface active A/B tests on intake question phrasing.

**Shows:**
- Active tests on intake text (links to AB-TESTING-MOAT infrastructure)
- Which question variants are running
- Current winner candidate (if statistically significant)
- Link to propagate winner to canonical question text

---

## §5 — Phase Plan

### Phase 1 — Question List Ratification (GOVERNOR GATE)

**What it is:** Governor reviews and ratifies the Level 0–4 question list.

**Input:** This document, §1 Depth-Level Checklist.

**Governor ratifies:**
- Each level's trigger conditions
- Each level's maximum question count
- The exact phrasing of each level's default question
- Confidence threshold for inference (currently set at 80% — Governor may adjust)

**Deliverable:** `tools/config/intake-questions.yaml` — canonical question list, Governor-signed.

**Gate:** BLOCKING. Phase 2 does not start without explicit Governor ratification of Phase 1.

---

### Phase 2 — Orchestrator Agent Build

**What it is:** Build the decision-tree agent.

**Scope:**
- `libs/intake-orchestrator/src/IntakeAgent.ts` — state machine + decision tree
- `libs/intake-orchestrator/src/confidence-scorer.ts` — per-level inference confidence
- Integration with `.csps/threshold/intake-log.yaml` (read) + `tools/config/unified-plan.yaml` (write)
- Session signal reader: loads prior session context before first question

**Gate:** 3 end-to-end intake runs with human validation that the agent asked only
what it could not infer.

---

### Phase 3 — Proactive Engagement System

**What it is:** The "Do you have 2 minutes?" trigger.

**Scope:**
- Session start hook: check for incomplete intake items
- Proactive message generator: specific benefit statement (not generic)
- Opt-out tracking in `cie-state.yaml`
- Scheduling system: 3-session snooze

**Gate:** 5 proactive engagement cycles completed. Measure response rate.

---

### Phase 4 — Dashboard Build

**What it is:** Platform page at `/platform/intake-orchestrator`.

**Scope:**
- All 6 dashboard panels (§4.1–4.6)
- A/B integration panel (§4.7 — requires AB-TESTING-MOAT Phase 1 to be live)
- Data sourced from `tools/data/intake-analytics.yaml` (append-only log)

**Gate:** Governor reviews dashboard with at least 2 weeks of real data.

---

### Phase 5 — CIE Integration

**What it is:** Intake learnings propagate back into the platform.

**Scope:**
- Question effectiveness → auto-flag for A/B test when skip rate > 15%
- Cohort analysis → informs voice profile text per avatar type
- Completion funnel → CIE learning signal: which depth levels have structural friction

**Gate:** At least 1 insight from the dashboard has propagated into a canonical platform artifact
(voice profile, question phrasing, or template content).

---

## §6 — Governor Review Items

> **These 7 decisions must be made by the Governor before Phase 1 build begins.**
> No inference is acceptable here — these are judgment calls.

| # | Decision | Context | Options | Current Assumption |
|---|---|---|---|---|
| GR-1 | Confidence threshold for inference | At what % confidence does AI ask vs. infer? | 70% / 80% / 90% | 80% |
| GR-2 | Level 0 framing | Is "What do you want to build?" the right opening? | Current / "What problem are you solving?" / "What are you working on?" | Current |
| GR-3 | Level 3 format | Should core loop crystallization be AI-proposed or user-authored? | AI proposes (current) / AI prompts user to write their own / Hybrid | AI proposes |
| GR-4 | Proactive engagement tone | "Do you have 2 minutes?" — is this the right phrasing? | Current / "Quick question:" / "Before we start:" | Current |
| GR-5 | Opt-out snooze duration | How many sessions before re-asking after "not now"? | 1 / 3 / 5 sessions | 3 sessions |
| GR-6 | Phase 1 scope gate | Should Level 5 (Phase 1 scope) require explicit Governor ratification for every item, or only for items above a complexity threshold? | Every item / Only ≥ Medium complexity | Every item |
| GR-7 | Dashboard visibility | Should the intake dashboard be visible to users of each app, or only to the platform Governor? | Governor-only / App-owner too / Public metrics (anonymized) | Governor-only |

---

## §7 — Cross-References

- [threshold-intake-protocol.md](./pillar-0-governance/threshold-intake-protocol.md) — Parent intake system
- [human-intent-crystallization.md](./pillar-0-governance/human-intent-crystallization.md) — Level 3 core loop methodology
- [AB-TESTING-MOAT.md](./pillar-0-governance/AB-TESTING-MOAT.md) — A/B tests on question phrasing (Phase 5)
- `tools/config/voice-profiles.yaml` — Avatar-aware phrasing
- `.csps/intelligence/cie-state.yaml` — CIE runtime state
- `.csps/threshold/intake-log.yaml` — Threshold classification log
- `tools/config/unified-plan.yaml` — Plan item: INTAKE-ORCHESTRATOR (to be added by Governor)
