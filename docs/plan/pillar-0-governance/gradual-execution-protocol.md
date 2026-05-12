---
id: csps.pillar-0-governance.gradual-execution-protocol
name: gradual-execution-protocol
description: >
  The Gradual Execution Protocol (GEP) — Governor directive S019. Every ratified plan
  must pass through 3 execution stages before full-scope deployment. Stage 1 proves
  the intent becomes a measurable result in 1-3 cases. Stage 2 validates consistency
  at 10% scope. Stage 3 deploys to full scope only after both pass.
  Core insight: "Ratification ≠ Proven." Intellectual analysis cannot discover what
  real-world application reveals. Iterations and graduations are virtues — they are
  the fast track, the most stable and sustainable path to scale.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
enforcement_stage: planned
cdp_status: ratified
core_spine: GVRN
core_spines: [GVRN, AI, VALD, ARCH, OPER]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
session: S019
depth_levels:
  l1: "3-stage execution: Stage 1 (1-3 cases, prove intent → result) → Stage 2 (10% scope, validate consistency) → Stage 3 (full scope)"
  l1_tokens: 90
  l2: "Every ratified plan is not proven until Stage 1 provides THIS-SESSION observable evidence. Intellectual ratification is necessary but not sufficient."
  l2_tokens: 600
  l3: "See this document. Behavioral contract: B_HUMBLE_EXECUTION_PIPELINE in behavioral-contracts.md."
  l3_location: "./gradual-execution-protocol.md"
impl_status: swift-implemented
links:
  - { rel: parent, href: ./README.md }
  - { rel: contracts, href: ./behavioral-contracts.md }
  - { rel: instruction-template, href: ./instruction-template.md }
  - { rel: question-protocol, href: ./question-protocol.md }
  - { rel: mechanical-enforcement, href: ./mechanical-enforcement-policy.md }
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/behavioral-contracts.md
  - docs/plan/pillar-0-governance/instruction-template.md
  - docs/plan/pillar-0-governance/mechanical-enforcement-policy.md
  - AGENTS.md
domain_path: platform
diataxis_type: how-to
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
---

# Gradual Execution Protocol (GEP)

> **Governor insight S019:** "We shouldn't arrogantly assume that without boots on the ground and trying something, we can cover everything intellectually. This is a human and AI duplicated satisfaction point."
>
> **The core truth:** Iterations and graduations are VIRTUES — not setbacks. They are the fast track. The most stable, scalable, and sustainable way of doing things. The cost of one failed full-scope rollback exceeds the cost of 10 Stage 1-2 iterations. The iteration IS the shortcut.

---

## The Satisfaction Point to Override

**Name:** "Ratification-as-Proof" (the arrogant assumption)

**The pattern:**
1. Governor and AI intellectually analyze a plan
2. Governor ratifies the plan
3. AI satisfaction point fires: "ratified = proven = ready to deploy at full scope"
4. Full scope deployment happens without a single real-world proof
5. Reality surfaces what intellectual analysis missed
6. Rollback cost = 10× iteration cost

**Why it fires:** Ratification FEELS like completion — it involved analysis, review, and formal approval. The Governor has agreed. What more is needed? The answer: ONE PROOF that the intent becomes a measurable result in the real world before applying it everywhere.

**The AI behavioral override:** "Ratification is necessary but not sufficient. The first proof step is always required before Stage 3 deployment. No exceptions for plans that seem obvious."

---

## The Three Stages

### Stage 1 — Proof of Concept (1-3 cases)

**Scope:** The smallest meaningful application of the plan. For a validator: 1-3 files. For a behavioral contract: 1 session. For a schema change: 1 artifact. For a template: 1 instance.

**The key question:** "Does the intent become a measurable result in this case?"

**Pass criteria (INST-VALD-001 compliant):**
- THIS-SESSION observable evidence that the expected result was produced
- The result matches the MEASURABLE_END_RESULT from instruction-template.md
- No unexpected side effects in the 1-3 tested cases

**If Stage 1 fails:** Return to design. Do NOT proceed to Stage 2. The failure provides information that intellectual analysis couldn't — use it.

**Dynamic scope:** For very small plans (a 1-line change to a single file), Stage 1 and Stage 2 can be combined. For large platform-wide changes, Stage 1 scope should be increased to 5-10 cases.

---

### Stage 2 — Scaled Validation (10% of full scope)

**Scope:** 10% of the full application scope, or 10-20 cases, whichever is more meaningful.

**The key question:** "Does the result remain consistent at scale? Are there edge cases that Stage 1 didn't surface?"

**Pass criteria:**
- Same measurable result across all Stage 2 cases
- Edge cases identified and either handled or explicitly accepted
- No performance degradation at 10× Stage 1 scope

**If Stage 2 fails:**
- Identify the pattern in failures (is it one type of edge case? One type of artifact?)
- Fix the design for that pattern
- Return to Stage 1 with the fixed design
- Do NOT apply a different fix for each individual failure — find the structural cause

**Dynamic scope for validation:** If Stage 1 was already 10+ cases, Stage 2 can move directly to 50% scope.

---

### Stage 3 — Full Scope (after Stage 1 + Stage 2 both pass)

**Only after:** Stage 1 AND Stage 2 both produced the expected measurable result.

**The key question:** "Does the result hold at full scope? What unexpected cases remain?"

**During Stage 3:**
- Monitor for unexpected cases (reality always produces surprises)
- Document any deviations immediately
- If unexpected failures appear: pause Stage 3, return to Stage 2 with the new scope

**The virtue of this sequence:** When Stage 3 has problems, the team has:
- A proven Stage 1 result to return to
- A validated 10% scope to test fixes against
- Evidence of what was supposed to work and why it worked at lower scope

This makes debugging 10× faster because the expected behavior is already established.

---

## The Humble Vault Analogy

The Governor's insight about vaults applies directly to execution:

**Humble Vault approach:** When a piece of knowledge or context is too complex to process immediately, we vault it and return when we can process it optimally. We don't arrogantly assume we can handle it right now.

**Humble Execution approach:** When a plan is ready to execute, we Stage-1 it before full scope. We don't arrogantly assume we can predict all outcomes intellectually. We let reality inform us through gradual proof.

**Both patterns share the same virtue:** Epistemic humility — acknowledging the limits of current knowledge and creating a systematic way to discover what we don't know.

---

## Application to CSPS Governance Elements

| Plan type | Stage 1 scope | Stage 2 scope | Stage 3 |
|---|---|---|---|
| New validator | 1-3 files in isolation | 10% of codebase | All files in pnpm verify |
| Behavioral contract | 1 session observation | K=2 pattern confirmed | Engrave 5/5 FSE |
| Schema change (new field) | 1-3 artifacts | 10% of governed artifacts | All artifacts |
| New template | 1 instance | 3-5 instances from different contexts | All new artifacts of that type |
| New audit slug | Stub (advisory, exits 0) | Week-4 (warn, monitored) | Active (blocking) |
| ZF orchestrator change | 1 session Level 1 test | 3-5 session Level 2 tests | Default for all sessions |

**Note:** The existing `enforcement_stage: stub → planned → week-4 → active` progression IS the GEP applied to validators. This document formalizes that pattern and extends it to ALL plan types.

---

## Mechanical Enforcement

**Current (enforcement_stage: planned):**
- B_HUMBLE_EXECUTION_PIPELINE behavioral contract (see behavioral-contracts.md)
- This document defines the protocol
- AI self-assessment question applied before Stage 3 deployment

**Week-4 (enforcement_stage: week-4):**
- `validate-execution-stages.mjs` — checks that any plan marked "full scope" has documented Stage 1 and Stage 2 evidence
- `execution-stage-evidence` audit slug registered in audit-runner.md

**Behavioral enforcement (self-assessment question):**
> "Am I about to apply this plan at full scope? If yes — has this plan been through Stage 1 (1-3 proof cases with THIS-SESSION observable evidence)? If no: I must run Stage 1 first. Ratification is not proof. The proof is the result."

---

## Why Gradations Are the Fast Track

**The false intuition:** "Gradual = slow. Full scope at once = fast."

**The reality:**

```
FULL-SCOPE APPROACH:
  Design → Ratify → Full deploy → Failure discovered → Full rollback → Fix → Full redeploy
  Time: T1 + T2 + T3(failure) + T4(rollback) + T5(fix) + T6(redeploy) = 6T

GRADUAL APPROACH:
  Design → Ratify → Stage 1 (1-3 cases) → Stage 2 (10%) → Stage 3
  If Stage 1 fails: Stage 1 again = 1-3 cases cost
  Total time: T1 + T2 + T3(stage1) + T4(fix) + T5(stage1-again) + T6(stage2) + T7(stage3)
  Where T3, T4, T5, T6 are each << T3(failure) + T4(rollback)

RESULT: Gradual execution = 3-5x faster at the level of success delivery
```

The gradual approach compresses the failure cost from "full rollback" to "stage 1 iteration" — which is by definition the smallest possible failure scope.
