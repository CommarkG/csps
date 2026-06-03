---
id: csps.platform-intelligence.pe-engine-report
name: CSPS-Summary-on-Priority-Engine-2026-06-03T1146Z
description: "Professional deep-dive report on the CSPS Priority Engine (PE) — role, wiring, importance, and what breaks without it. Authored 2026-06-03."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
authored_at: "2026-06-03T11:46:20Z"
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:admin
  - maturity:stable
links:
  - { rel: pe-connectivity-validator, href: ../../tools/validators/validate-pe-connectivity.mjs }
  - { rel: pe-dashboard-validator, href: ../../tools/validators/validate-pe-dashboard.mjs }
  - { rel: pe-situation-registry, href: ../plan/pillar-0-governance/pe-situation-registry.md }
  - { rel: pe-schema, href: ../../tools/templates/priority-engine.schema.yaml }
---

# CSPS Priority Engine (PE) — Professional Report
**Authored: 2026-06-03T11:46Z | Session S078**

---

## 1. What the Priority Engine Is

The Priority Engine (PE) is the **sequencing and deflection system** that determines WHICH platform work gets done WHEN, and actively rejects work that contradicts the current priority ordering. It is not a to-do list. It is not a suggestion. It is a governance mechanism with binding force on every AI session.

PE answers three questions at all times:
1. **What is the single most important thing to build right now?** (ORDERING)
2. **What band of urgency does each item sit in?** (PRIORITY)
3. **Is the AI about to drift toward lower-priority work?** (DEFLECTION)

The PE formula for individual items:
```
PE_SCORE = B×0.30 + D×0.30 + I×0.15 + Bn×0.10 + PAS×0.15 × 10

B   = Business impact (0-10): does shipping this grow the platform meaningfully?
D   = Developer need (0-10): does a developer need this to move forward?
I   = Implementation feasibility (0-10): can it be built now without blockers?
Bn  = Blocker removal (0-10): does it unblock other work?
PAS = Platform-alignment score (0-10): is it foundation-first, not app-first?
```

**Four priority bands:**
| Band | Label | Meaning |
|------|-------|---------|
| 1 | BLOCKING | Must complete before any new work starts |
| 2 | HIGH | Next in queue after Band 1 clears |
| 3 | MEDIUM | Scheduled, not urgent |
| 4 | VAULTED | Deferred; registered but not started |

**Special modifier — Foundation Exit Gate:** During the foundation phase, any app-layer item receives a multiplicative zero on PE_SCORE regardless of its individual scores. Apps cannot jump the queue while foundation dims are incomplete. This was the gating mechanism that kept S073-S077 focused on dims 1-4 before any journeys work.

---

## 2. Why the Priority Engine Matters

### 2.1 The Problem It Solves

In any AI-assisted development environment, the AI has powerful training defaults toward **eager helpfulness** (D1), **shiny object attraction** (building what's interesting, not what's needed), and **sycophancy** (building what the human asks for even when it contradicts the stated plan). Without PE, every session is at risk of drifting to whatever is mentioned most recently, whatever sounds most exciting, or whatever the AI's training most strongly associates with "being helpful."

CSPS sessions are long and involve complex multi-session plans. Without a mechanical sequencing system, the platform would exhibit:
- Sessions spending time on mid-priority governance when foundation dims are incomplete
- New features started before existing work is sealed
- AI accepting any Governor directive without checking whether it contradicts the current mandate

### 2.2 Real Platform Evidence of Why PE Matters

**S076 experience**: The mid-plan injection drift problem — during S076, new concepts (CQS Alignment Layer, boundary-crossing protocol) were injected mid-session without explicitly queuing or pivoting. The result was side quests that expanded the session scope. PE addresses this through the completion-before-new gate.

**S077 experience**: The completion directive from Opus-17 was explicit: "drive to a DEFINED foundation finish line." This is PE's Foundation Exit Gate in action — HOLD all new governance ideas (process-spine, threshold-frontend, build-from-1-and-100) despite their merit, because the Foundation band is not complete.

### 2.3 What Makes PE Unique

- **It binds before the session starts.** The PE priority ordering is established in topic-plan frontmatter and read at session open.
- **It deflects during the session.** B_PE_ALIGNMENT_GUARDIAN fires when a Governor directive contradicts the top PE item.
- **It sequences work across sessions.** Sessions don't plan work ad-hoc; they execute from the PE queue.
- **Situations modify scoring rules, not scores.** Named meta-states (like WAVE_1_PREVENTION_BUILD, FOUNDATION_PHASE) change HOW PE computes, not what PE scores for individual items.

---

## 3. What Happens in Systems Without PE

### 3.1 Symptom Pattern (observable in pre-PE sessions S001-S022)

| Problem | Manifestation | Root Cause |
|---------|--------------|-----------|
| Shiny object drift | Session builds an exciting new validator instead of fixing the blocking foundation item | No mechanical check against the top PE item |
| Session mandate ignored | Handoff says "build X" but session drifts to "build Y because Governor mentioned it" | No deflection mechanism |
| Foundation/app race | App features built before schema is sealed | No Foundation Exit Gate |
| Priority disputes | Arguments about what to work on; human memory required | No computed priority queue |
| Hidden dependencies | Team builds items that depend on unfinished foundation | No blocker-removal scoring (Bn) |
| Infinite governance | More validators added without PE forcing a stop | No PE_SCORE = 0 gate for governance-during-foundation |

### 3.2 The Cascade

Without PE, every session decision requires the Governor to manually enforce sequence. This fails under:
- Context compression (session context window fills; earlier mandates are lost)
- Multi-session spans (what was the priority 3 sessions ago?)
- AI training default D1 (eager helpfulness eagerly builds whatever was most recently requested)
- Sycophancy (AI tells Governor yes when PE should say no)

**The outcome without PE**: a 30-app platform that ships apps with a leaky schema, no RLS, and no quota enforcement — because each session "helped" in isolation without a binding sequencing mechanism.

---

## 4. Full PE Wiring (How It Actually Connects to Real Outputs)

### 4.1 Schema Layer (What Gets Scored)

| Surface | PE Connection | Field |
|---------|-------------|-------|
| `docs/plan/_handoff/VAULT/topic-plans/*.md` | Primary scored unit | `priority_score`, `priority_band`, `pe_score_per_session` |
| `tools/data/improvement-register.yaml` | PE input source | `pe_connection: input` |
| `tools/data/gap-recurrence-register.yaml` | PE input source | `pe_urgency_input: true/false` |
| `tools/data/hardwire-register.yaml` | PE connectivity required | `pe_connection` declared |
| All 6 accountability registers | PE connectivity enforced | `pe_connection: scored|input|output|not_applicable` |
| `docs/plan/pillar-0-governance/csps-bedrock.md` | Unchecked items gate | Band-1 plan required for any `[ ]` |

### 4.2 Validator Layer (What Enforces PE)

| Validator | What It Checks | Severity |
|-----------|---------------|---------|
| `validate-pe-connectivity.mjs` | Active topic-plans have `priority_score` + `priority_band`; depth-3+ plans have per-session PE_SCORE; bedrock unchecked items in Band-1 plan | BLOCKING for missing score/band; ADVISORY for depth/history |
| `validate-pe-dashboard.mjs` | Sorts all plans by PE score; outputs top-10 queue; surfaces open item counts and Band distribution | ADVISORY (information, never blocks) |
| `validate-pe-situation-declared.mjs` | Active situation sessions have PE_SCORE in plan | ADVISORY |
| `validate-register-connectivity.mjs` | All 6 accountability registers declare `cie_connection` + `pe_connection` | BLOCKING if missing |

### 4.3 Hook Layer (What Fires in Real Time)

| Hook | Trigger | Effect |
|------|---------|--------|
| `session-open.sh` | Session start | Surfaces top-5 PE items; sets session mandate; Foundation Exit Gate check |
| `user-prompt-submit-pe-alignment-check.sh` | Every user prompt | Detects if prompt contradicts top PE item; emits deflection reminder |
| `post-stop-session-close-gate.sh` | Session end | Requires verify=0 before close; checks mandate completeness |

### 4.4 Behavioral Contract Layer (What Blocks at the AI Level)

| Contract | Enforcement |
|----------|------------|
| `B_PE_ALIGNMENT_GUARDIAN` | CONSTITUTIONAL. AI MUST respond with 3-block deflection when human input misaligns with PE top-priority. Direct behavioral blocker. |
| `B_COMPLETION_OVER_SHINY` | AI rejects new work while active plan is incomplete. PE-backed. |
| `B_FOUNDATION_EXIT_GATE` | No app-layer work while foundation dims are incomplete. PE's Foundation Exit Gate in behavioral form. |

### 4.5 Session-Open Injection

At every session start, `session-open.sh` reads the PE queue and surfaces:
```
PE PRIORITY QUEUE (computed, descending):
  Band 1: [current blocking items]
  Band 2: [high items]  
  Band 3: [medium items]
  Band 4: [vaulted / deferred]
```

This is not a recommendation — it is the session mandate. The AI's first action is to confirm alignment with the top-PE item.

---

## 5. PE in Practice: S077 Evidence

**What PE governed this session:**
- Foundation Exit Gate: kept all journeys work in Band 4 (VAULTED) until dims 1-4 mechanism-complete
- Band 1 active items: UUID migration (deadline 2026-06-16), dim-4 Surface 2 quota, dim-4 Surface 4 harness
- HOLD list (PE Band 4): CQS Phase-1, process-spine, threshold-frontend, build-from-1-and-100 — all registered, none built

**What would have happened without PE**: UUID migration (hard deadline) would have competed with IZFC moat work, VAULT archival, and new journeys design — with no mechanical sequencing to prevent all four from being started simultaneously.

---

## 6. Known Gaps and Active Obligations

| Gap | Status |
|-----|--------|
| 25 improvement entries have no `pe_score` (PE scoring not firing at plan-forks) | Advisory — fix at next PE focus session |
| ADJUST/INJECT/MEASURE stages of CIE-PE adapter | Deferred S072 Q2 hold |
| PE alignment guardian pre-tool-use hook | Registered, week-4 deferred |
