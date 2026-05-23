---
id: csps.pillar-0-governance.pe-situation-registry
name: pe-situation-registry
description: >
  Canonical registry of PE Situation Types — named meta-states of the CSPS platform
  that modify how the Priority Engine scores and sequences work. A Situation is active
  when explicitly declared by the Governor and automatically changes PE scoring rules
  for items within it. Situations are the difference between "what to do in general"
  (PE bands) and "what to do right now given where we are" (Situation context).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
core_spines: [GVRN, ARCH, VALD]
schema_anchor: pillar_0_governance_leaves
domain_path: platform
tags:
  - domain:governance
  - domain:planning
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
session: S022
impl_status: swift-implemented
links:
  - { rel: parent, href: ./README.md }
  - { rel: pe-schema, href: ../../../tools/templates/priority-engine.schema.yaml }
  - { rel: pe-connectivity-validator, href: ../../../tools/validators/validate-pe-connectivity.mjs }
  - { rel: enterprise-plan, href: ../_handoff/VAULT/topic-plans/enterprise-core-completion-plan.md }
diataxis_type: reference
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# PE Situation Registry

> **What is a Situation?** A named meta-state of the platform that shifts HOW the Priority
> Engine scores and sequences work — without changing the PE formula itself. The PE always
> computes correctly; Situations tell it which items belong in what context.
>
> **Situations are NOT exceptions to PE.** They ARE PE, operating at a higher level of
> abstraction. A Situation declares context; PE still sequences within that context.

---

## §1 — What Situations Govern

| PE Layer | Without Situation | With Active Situation |
|---|---|---|
| Band assignment | Computed from B×D×I×Bn×PAS | Situation may auto-promote/cap bands |
| Item eligibility | All items in queue | Situation may filter to subset |
| Foundation gate | Always active | Situation defines WHAT counts as "foundation" |
| Deflection (Guardian) | Compares vs. top PE item | Compares vs. Situation's completion gate |
| Session mandate | Highest PE item | Highest PE item WITHIN Situation scope |

---

## §2 — Situation Registry (All Active + Historical)

---

### SITUATION-001: BEDROCK_BUILDING
**Status:** CLOSED (S017 bedrock Layer 2 complete; S022 Layer 4 in progress)
**Declared:** S014 (foundation-first doctrine)
**Closed:** Partially — see STRATEGIC_COMPLETION below

**Definition:**
Platform is in pure foundation mode. No app-layer work is authorized until
the foundation exit gate passes. PE_SCORE of any APP_LAYER item = 0 (multiplicative zero).

**PE auto-rules while active:**
- FOUNDATION_EXIT_GATE multiplicative zero on app items
- All bedrock items auto-Band 1 (BLOCKING)
- App-layer items: Band 4 (VAULTED) regardless of PE_SCORE

**Entry condition:** Platform at session start with `foundation_slices` topic-plan OPEN
**Exit condition:** `validate-phase-exit-criteria.mjs` exit_code=0 on all foundation phases
**Validator:** `validate-phase-exit-criteria.mjs`

---

### SITUATION-002: STRATEGIC_COMPLETION
**Status:** CLOSED (S022 Session 6 complete — 2026-05-11. All 6 sessions done. Bedrock 22/22. ZenStack enforce active. RLS active.)
**Declared:** S022 turn "enterprise level as far as the core is concerned"

**Definition:**
The platform has identified a gap between its current state and a defined target state
(enterprise-grade core). A systematic multi-session completion plan exists with ZF-enforced
audit gates. The platform is in completion mode: all sessions in the plan are Band 1.
No new scope is added to the active plan. B_COMPLETION_OVER_SHINY at 1.5× PE weight.

**The "Situation" in full:**
```
State:    Platform has functional but not enterprise-grade core (21/22 bedrock)
Gap:      8 critical gaps identified (ZenStack bypassed, webhooks incomplete, etc.)
Evidence: enterprise-core-completion-plan.md §1 FINDINGS
Plan:     4 sessions (S3-S6) with ZF-enforced audit gates per session
Trigger:  Governor directive "enterprise level as far as the core is concerned" (S022)
Apex:     Session 6 completion = bedrock 22/22 + validate-bedrock.mjs exit_code=0
```

**PE auto-rules while STRATEGIC_COMPLETION is active:**
- All sessions in enterprise-core-completion-plan.md → Band 1 (BLOCKING)
- B_COMPLETION_OVER_SHINY weight: 1.5× (completion proximity boost amplified)
- New scope requests → DEFLECT_VAULT unless ESSENTIAL (security/legal urgency)
- PE_ALIGNMENT_GUARDIAN fires on any request that delays a completion session
- Situation itself cannot be exited by PE — only Governor can declare exit

**PE scores for sessions in this situation:**
| Session | PE_SCORE | Band | Computation |
|---|---|---|---|
| Session 3 (ZenStack + webhooks + GDPR + subscription) | **8.05** | 1-BLOCKING | B=8, D=10, I=1, Bn=10, PAS=10 → 2.4+3.0+0.15+1.0+1.5 |
| Session 4 (Role permissions + feature gating) | **7.35** | 1-BLOCKING | B=8, D=8, I=1, Bn=9, PAS=10 → 2.4+2.4+0.15+0.9+1.5 |
| Session 5 (Audit completeness) | **5.6** | 2-HIGH | B=5, D=6, I=1, Bn=8, PAS=9 → 1.5+1.8+0.15+0.8+1.35 |
| Session 6 (RLS + bedrock closure) | **7.75** | 1-BLOCKING | B=8, D=10, I=1, Bn=7, PAS=10 → 2.4+3.0+0.15+0.7+1.5 |

**Entry condition:** Governor declares completion directive + plan exists with audit gates
**Exit condition:** All sessions in plan complete + final ZF gate passed
**Exit verification:**
```
validate-bedrock.mjs exit_code=0 (22/22)
node tools/zf-orchestrator.mjs --level 3 → ZF ACHIEVED
enterprise-core-completion-plan.md §9 all evidence blocks PASTED
```
**Validator:** `validate-pe-connectivity.mjs` (checks situation is still active and sessions are Band 1)

---

### SITUATION-003: APP_BUILD_MODE
**Status:** ACTIVE (S022 — activates 2026-05-11. Bedrock 22/22 confirmed. APP_BUILD_MODE governs all future app builds.)

**Definition:**
Foundation and enterprise core are complete. Platform is in recurring app-building
mode. Each app build is a separate topic-plan. PE governs which app to build next
based on market readiness, domain complexity, and platform capability.

**PE auto-rules while active:**
- Foundation items: Band 3 (maintenance, not BLOCKING)
- App-level topic-plans: PE-scored normally
- FOUNDATION_EXIT_GATE: still active (maintenance, not locked)
- Graduation tracker: tracks $1K MRR per app

**Entry condition:** STRATEGIC_COMPLETION exits + bedrock 22/22
**Exit condition:** Never exits — ongoing operational mode

---

### SITUATION-004: OPUS_ARCHITECTURAL_REVIEW
**Status:** PENDING (triggers when sessions_since_opus_review >= 10)

**Definition:**
An Opus-designated session is running architectural review of the platform.
No Sonnet implementation sessions run concurrently. All PE items are paused
pending Opus output. This is not a new concept — it's the existing Opus review
mechanism formalized as a Situation.

**PE auto-rules while active:**
- All implementation items: VAULTED until Opus output arrives
- Opus output items: auto-Band 1 when they arrive in Sonnet chat

**Entry condition:** sessions_since_opus_review >= 10 OR opus_audit_due = true
**Exit condition:** Opus session closes (HANDOFF written + ratification complete)
**Validator:** `validate-opus-audit-due.mjs` (already active)

---

## §3 — How Situations Compose with PE Formula

```
Final_PE_Score(item) =
  Base_PE_Score(item)                    # formula: B×0.30 + D×0.30 + I×0.15 + Bn×0.10 + PAS×0.15
  × FOUNDATION_EXIT_GATE_multiplier      # 0 if app-layer during BEDROCK_BUILDING; 1 otherwise
  + COMPLETION_PROXIMITY_BOOST           # (completion_pct/100) × 1.5 if applicable
  + SPINE_FINDINGS_BOOST                 # +2.0 per spine with ≥3 open findings
  + SITUATION_OVERRIDE_IF_BLOCKING       # situation auto-Band-1 overrides score
```

**Priority:** SITUATION_OVERRIDE > FOUNDATION_EXIT_GATE > Base formula

---

## §4 — Declaring a New Situation

A new Situation requires:
1. **Governor declaration** (verbal OR written in session chat)
2. **Evidence block** — what gap/state the Situation addresses
3. **Entry/exit criteria** — mechanically verifiable
4. **PE auto-rules** — what changes in PE while active
5. **Validator** — which validator confirms the Situation is still relevant
6. **Registration here** with status and session declared

A Situation is NOT:
- A one-off task (use topic-plan for that)
- A permanent PE configuration change (use ADR for that)
- An exception to PE (there are no exceptions — only higher-level context)

---

## §5 — Situation Transition History

| Transition | Session | Trigger |
|---|---|---|
| BEDROCK_BUILDING ACTIVE → partial close | S017 | Layer 2 complete (ZenStack installed) |
| STRATEGIC_COMPLETION ACTIVE | S022 | Governor "enterprise level core" directive |
| APP_BUILD_MODE PENDING | Post-S022 | Depends on STRATEGIC_COMPLETION exit |

---

*PE Situation Registry v1.0 | S022 | 2026-05-10*
*Authority: priority-engine.schema.yaml + B_PE_ALIGNMENT_GUARDIAN + P-META-018*
