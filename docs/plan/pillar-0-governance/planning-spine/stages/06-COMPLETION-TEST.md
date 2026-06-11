---
id: csps.governance.planning-spine.stage-completion-test
name: planning-spine-stage-completion-test
description: "Stage 6 — COMPLETION-TEST. Three-part gate: A VERIFICATION (P-META-034 IZFC, design-time) + B INTENT-CONFORMANCE (output traces to Stage-3 intent, design-time documentary) + C IMPACT-VALIDATION (deferred, reality-anchored — emitted as obligation by B, closed at real-world boundary)."
version: "0.3"
owner: group:finky
lifecycle: production
lifecycle_state: active
status: ratified
re_entrant: false
governing_principle: P-META-034
validation_anchor: "B_INTENT_TO_IMPACT (behavioral-contracts/B_INTENT_TO_IMPACT.md:26) + P-META-023 (I→VI Discipline) + Stage-3 crystallized intent (03-INTENT-CRYSTALLIZE.md:30-34)"
consumes:
  - stage: 3
    field: crystallized_intent
    used_in: "Part B INTENT-CONFORMANCE: output traced against this named field"
    mechanical: true
    finding_resolved: FINDING-S082-01
    note: >
      Stage 6 Part B reads the crystallized_intent field from Stage 3's output artifact.
      This makes Part B mechanical (field-readable) not conceptual (context-dependent).
      See TRUNK-BRANCH-RELOAD.md §4 for the full data contract specification.
impact_obligation_anchor: tools/data/impact-obligation-register.yaml
loop_exit_condition: "Part A CLEAR + Part B CLEAR → plan ratifiable; open impact-obligations carry forward to Part C (closed at real-world boundary, not plan-exit)"
loop_back_condition: "any new finding → return to CLASSIFY; OR conformance-fail (output diverged from crystallized intent) → return to CLASSIFY; OR Part C diverged (post-execution) → return to CLASSIFY"
canonical_artifact: packages/principles/principles/P-META-034-reality-tested-completion.yaml
---

# Stage 6 — COMPLETION-TEST (Three-Part Gate)

**Type:** Gate — governs loop exit. Exit is EARNED, not declared. Parts A and B must both clear at plan-exit; Part C is a deferred obligation closed at the real-world boundary.

## What It Does

Before the planning loop exits, the completion test applies three parts in sequence:

- **Part A — VERIFICATION:** Did we build the thing right? IZFC sweeps from independent angles until zero new findings emerge. Design-time.
- **Part B — INTENT-CONFORMANCE:** Does the output trace to the Stage-3 crystallized intent? Requirements traceability — verifiable on paper before execution. Design-time documentary.
- **Part C — IMPACT-VALIDATION:** Did the executed output achieve the intended outcome in the world? Deferred. Part B emits an impact-obligation when observable impact is not yet possible; Part C closes at the real-world boundary (test-drive / live proof).

## Why Three Parts, Not Two

Calling Part B "Validation" oversold it (FINDING-S082-02, Opus self-correction). V&V industry definition: *validation* requires execution against reality — it cannot be performed on a plan before the plan runs. What Part B checks is requirements traceability (output traces to crystallized intent, checkable on paper). True IMPACT-VALIDATION is Part C — deferred, reality-anchored. Naming the three parts correctly prevents Goodhart/nominal-impact risk: you cannot game a real deployment result.

## Loop Exit Rule

**Part A CLEAR + Part B CLEAR → plan is ratifiable.** Open impact-obligations from Part B carry forward. Part C is NOT a gate at plan-exit — it closes at the first real-world execution event.

## Canonical Artifact

`packages/principles/principles/P-META-034-reality-tested-completion.yaml`

No content here — cross-reference only.

---

## Part A — VERIFICATION (P-META-034 IZFC)

**Governing question:** Did we build the thing right?

Requires genuine examination from independent angles until a fresh sweep finds nothing. This is the IZFC (Iterative Zero-Finding Cycles) discipline applied to the planning loop as a whole.

### IZFC Self-Audit Questions

1. Did each sweep examine a genuinely different angle — or re-check the same area more carefully?
2. Is termination EARNED (a fresh sweep actually hit zero) or ASSUMED (the plan felt done)?
3. Is every finding tied to specific evidence (file:line / tool output / named validator)?
4. What breaks in the NEXT step if I'm wrong — and did I check it?

### Part A Gate

| Outcome | Condition | What happens next |
|---------|-----------|------------------|
| **PART A CLEAR** | Fresh IZFC sweep finds zero new findings — completion is earned | Proceed to Part B |
| **LOOP-BACK** | A new finding surfaces | Return to CLASSIFY (Stage 1) with the finding as new context |

### The Loop-Back Is Not Failure

A loop-back is the IZFC discipline working correctly — a new angle revealed something. Stopping before loop-back is the failure mode.

---

## Part B — INTENT-CONFORMANCE (Design-Time Documentary)

**Governing question:** Does the output trace to the Stage-3 crystallized intent?

**What this is (and is NOT):** This is requirements traceability — verifiable on paper, before execution. It is NOT validation in the V&V sense (which requires execution against reality — that is Part C). The rename from "Validation" corrects the label.

**Anchor:** `B_INTENT_TO_IMPACT.md:26` (intent = outcome the work was supposed to achieve; impact = observed evidence, OR `pending:<reason>`) applied at planning-loop-exit scale, instantiating P-META-023. The "reality" the completion test contacts is the crystallized intent from Stage 3 (`03-INTENT-CRYSTALLIZE.md:30-34`).

### Conformance Check

| Field | Source | Pass condition |
|-------|--------|----------------|
| `intent` | Stage-3 governing intent statement | Output traces to this intent — design-time checkable |
| `impact_signal` | Measurable real-world signal expected at execution | Named and specific; not a vague promise |
| `revisit_condition` | When/where impact becomes observable | Specific: ship / test-drive / live load / runtime |

**Pass:** Output traces to crystallized intent. Each non-observable impact emits a row to `tools/data/impact-obligation-register.yaml` (intent + impact_signal + revisit_condition + status: pending).
**Fail (conformance-fail):** Output diverged from crystallized intent without declared rationale → loop-back to CLASSIFY.

### Part B Gate

| Outcome | Condition | What happens next |
|---------|-----------|------------------|
| **PART B CLEAR** | Output traces to intent; non-observable impacts emitted as obligations | Proceed to loop exit; open obligations carry forward |
| **LOOP-BACK (conformance-fail)** | Output diverged from crystallized intent | Return to CLASSIFY (Stage 1) |

---

## Part C — IMPACT-VALIDATION (Deferred, Reality-Anchored)

**Governing question:** Did the executed output achieve the intended outcome in the world?

**Why deferred?** Impact is unobservable at plan-exit. Forcing it creates Goodhart/nominal-impact risk: a metric that can be declared met without real-world evidence. Part B EMITS the obligation; Part C CLOSES it — when and only when reality can be observed.

**Mechanism:** For each impact-obligation row in `tools/data/impact-obligation-register.yaml`, Part C closes the row when:
1. The revisit_condition is met (test-drive / live load run / runtime deploy)
2. The impact_signal is observed and matches expectation
3. Status changes: `pending` → `met` (or `diverged` if expectation was wrong)

**Cross-references (do NOT duplicate — cross-ref only):**
- `gap_DIM4_LIVE_LOAD_PROOF` in `tools/data/gap-recurrence-register.yaml` — same shape: intent = connection pool tested at scale; impact_signal = k6 scenario-a GREEN; revisit_condition = app#1 test-drive. Tracked there; impact-obligation-register.yaml carries a cross-ref row.
- Phase B test-drive obligation (session state: "thin slice test-drive") — revisit_condition = first deployed app#1 journey.

### Part C Gate (at real-world boundary)

| Outcome | Condition | What happens next |
|---------|-----------|------------------|
| **OBLIGATION MET** | impact_signal observed GREEN at revisit_condition | Row closes: `status: met` |
| **OBLIGATION DIVERGED** | Output did not achieve intended outcome | Row closes: `status: diverged` → return to CLASSIFY with divergence as new context |

---

## Combined Exit Gate

| Part A | Part B | Part C | Outcome |
|--------|--------|--------|---------|
| CLEAR | CLEAR | (deferred) | **EXIT** — plan ratifiable; open obligations carry forward |
| fails | — | — | **LOOP-BACK** to CLASSIFY |
| CLEAR | fails | — | **LOOP-BACK** to CLASSIFY (conformance-fail) |
| CLEAR | CLEAR | diverged (post-execution) | **LOOP-BACK** to CLASSIFY (impact-diverged) |

---
*RATIFIED v0.3 — part of Planning Spine cluster. Ratified S082 · 2026-06-11.*
