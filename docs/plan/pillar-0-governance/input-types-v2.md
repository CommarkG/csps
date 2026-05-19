---
id: csps.governance.input-types-v2
name: input-types-v2
description: "Complete input taxonomy v2 — extends threshold-gate-v2.md's 13 types with 7 planning-channel and state-change types introduced by the Planning Hub (PMI/CAQ/activation). Total: 20 input types."
version: 2.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
diataxis_type: reference
session: S043
impl_status: swift-implemented
links:
  - { rel: extends, href: ./threshold-gate-v2.md }
  - { rel: companion, href: ../../tools/config/unified-plan.yaml }
consolidation_cross_refs:
  - B_PRACE
  - PMI
  - CAQ
---

# Input Types v2 — Complete Taxonomy (20 types)

> Extends threshold-gate-v2.md's 13 types with 7 planning-channel types.
> Types 1-13: existing content/chat inputs (see threshold-gate-v2.md §1).
> Types 14-20: NEW — state-change inputs from the Planning Hub.

---

## §1 — Original 13 Types (summary)

See `threshold-gate-v2.md §1` for full definitions.

| 1-6 | Chat/agent/internal inputs | route_to: SWIFT_EXECUTE or COUNCIL_REVIEW |
| 7-13 | External content inputs | route_to: VAULT_DEFER (always) |

---

## §2 — New Planning-Channel Types (7)

These types signal TRANSITIONS in the planning system, not just content arrival.
They route to PMI_UPDATE, ACTIVATION_ROUTE, or CAQ_TRIGGER — not VAULT_DEFER.

| # | Input type | source_class | classified_type | Default route_to | Example |
|---|---|---|---|---|---|
| 14 | Plan item update | planning-channel | plan-mutation | unified-plan.yaml + PMI recalc | "Status changed: planning → ratified" |
| 15 | PMI signal | planning-channel | maturity-signal | planning-hub + CAQ trigger | "Item X crossed PMI threshold (4/5 HIGH)" |
| 16 | CAQ answer | planning-channel | alignment-response | caq-log + plan item caq_answers | "Original intent is: deploy to Vercel" |
| 17 | Activation period result | planning-channel | evaluation-result | activation routing (success/partial/rollback/escalate) | "Q1: partial, Q2: none, Q3: yes with change" |
| 18 | Governance debt discovery | agent-output | governance-gap | [S3] planning item + PRACE analysis | findings-categorizer.mjs S3 output |
| 19 | Cross-boundary alignment check | planning-channel | alignment-check | CAQ log + await answer | "PMI gate: is intent still current?" |
| 20 | Developer journey event | product-channel | developer-milestone | journey stage tracking in unified-plan | "Stage 4 complete: domain design ratified" |

---

## §3 — The Key Distinction

Types 1-13: **content arrives** → classify → route → process
Types 14-20: **state changes** → record → trigger → update

Types 14-20 don't go through VAULT_DEFER — they update the unified-plan.yaml directly
and may trigger CAQs as side effects.

---

## §4 — Routing Rules for Planning-Channel Types

```
plan-mutation    → write to unified-plan.yaml → PMI recalculate → alert if threshold crossed
maturity-signal  → fire CAQ-19 (alignment-check) → await Governor answer → update status
alignment-response → write to caq-log + plan item → check if sufficient for ratification
evaluation-result → route: success→done, partial→stay-activation, rollback→reversal-plan, escalate→[S3]
governance-gap   → create [S3] plan item + PRACE analysis template
alignment-check  → log as CAQ + inject to next session context
developer-milestone → update journey stage in unified-plan + check if next stage deps clear
```

---

## §5 — Activation Period Exit Options (configurable per item)

Field: `activation_exit:` in unified-plan.yaml

| Option | Format | When to use |
|---|---|---|
| Governor explicit | `governor-explicit` | Default. Governance items, strategic decisions. |
| N sessions | `n-sessions: 3` | Items with clear before/after. Validators, hooks. |
| N uses | `n-uses: 100` | Product features with measurable usage. |
| Evaluation passed | `evaluation-passed` | When all 3 activation questions have clear answers. |

---

*Input Types v2 | S043 | Extends threshold-gate-v2.md*
