---
id: csps.governance.planning-spine
name: PLANNING-SPINE
description: "The CSPS Planning Spine — a re-entrant loop, not a pipeline. CLASSIFY and CHECK-EXISTS are re-entrant gates that fire at input, goal-refine, pre-simulate, and new-research. COMPLETION-TEST (P-META-034) gates loop exit."
version: "0.1"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
status: ratified
ratified_by: Governor
ratified_session: S082
ratified_at: "2026-06-11"
ratification_unit: "Planning Spine cluster — PLANNING-SPINE.md + stages/01-06 + SPINE-ATLAS-SPEC.md + RESEARCH-INPUT.md + ITERATION-REUSE-DYNAMICS.md + INHERITANCE-MODEL.md + 06-COMPLETION-TEST.md + threshold-gate-v2.md + TRUNK-BRANCH-RELOAD.md. All status:draft → ratified 2026-06-11."
authored_by: Sonnet S080
authored_at: "2026-06-05"
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: planning-discipline, href: ../CSPS-PLANNING-DISCIPLINE.md }
  - { rel: p-meta-034, href: ../../../../packages/principles/principles/P-META-034-reality-tested-completion.yaml }
  - { rel: p-meta-035, href: ../../../../packages/principles/principles/P-META-035-iteration-and-reuse.yaml }
  - { rel: intent-crystallization, href: ../behavioral-contracts/B_INTENT_CRYSTALLIZATION.md }
  - { rel: sandbox-policy, href: ../behavioral-contracts/B_SANDBOX_BEFORE_IMPLEMENTATION.md }
  - { rel: simulation-spine-ref, href: ../../../../tools/config/core-spine-registry.yaml }
  - { rel: dual-focal, href: ../../csps-dual-focal-plan.yaml }
  - { rel: stages, href: stages/ }
  - { rel: spine-atlas-spec, href: SPINE-ATLAS-SPEC.md }
  - { rel: research-input, href: RESEARCH-INPUT.md }
  - { rel: iteration-reuse-dynamics, href: ITERATION-REUSE-DYNAMICS.md }
  - { rel: inheritance-model, href: INHERITANCE-MODEL.md }
  - { rel: trunk-branch-reload, href: TRUNK-BRANCH-RELOAD.md }
---

# CSPS Planning Spine

> **Status: RATIFIED** — Governor ratified 2026-06-11 (S082). Phase B active.

---

## The Core Insight: Loop, Not Pipeline

A pipeline processes inputs and exits. A planning spine is a **re-entrant loop**: certain gates can and MUST re-fire when conditions change. The difference is architectural: a pipeline's exit is automatic when you reach the end; the spine's exit is **earned** — gated by COMPLETION-TEST (P-META-034).

```
                    ┌─────────────────────────────────────────────┐
                    │              PLANNING LOOP                   │
                    │                                              │
  INPUT/REFINE ──► ►│ CLASSIFY ◄──────────────── RE-ENTRANT       │
                    │     │                                        │
                    │     ▼                                        │
                    │ CHECK-EXISTS ◄──────────────── RE-ENTRANT    │
                    │     │                                        │
                    │     ▼                                        │
                    │ INTENT-CRYSTALLIZE                           │
                    │     │                                        │
                    │     ▼                                        │
                    │ DUAL-FOCAL (why+how)                         │
                    │     │                                        │
                    │     ▼                                        │
                    │ SIMULATE / SANDBOX                           │
                    │     │                                        │
                    │     ▼                                        │
                    │ COMPLETION-TEST ──► if ZF → EXIT             │
                    │     │                                        │
                    │     └──► if not ZF → loop back ─────────────┘
                    └─────────────────────────────────────────────┘
```

---

## The Seven Stages

| # | Stage | Type | Re-entrant? | Canonical artifact |
|---|-------|------|-------------|-------------------|
| 1 | CLASSIFY | Gate | ✅ RE-ENTRANT | `tools/scripts/threshold-classify.mjs` + `threshold-router.mjs` |
| 2 | CHECK-EXISTS | Gate | ✅ RE-ENTRANT | `pre-tool-use-check-existing.sh` + Spine Atlas (see `SPINE-ATLAS-SPEC.md`) |
| 3 | INTENT-CRYSTALLIZE | Transform | — | `behavioral-contracts/B_INTENT_CRYSTALLIZATION.md` |
| 4 | DUAL-FOCAL | Frame | — | `docs/plan/csps-dual-focal-plan.yaml` |
| 5 | SIMULATE/SANDBOX | Test | — | `B_SANDBOX_BEFORE_IMPLEMENTATION.md` + `core-spine-registry.yaml#simulation` |
| 6 | COMPLETION-TEST | Gate | — | P-META-034 (Reality-Tested Completion) |
| 7 | LOOP-EXIT or LOOP-BACK | Branch | — | IZFC + P-META-035 (Iteration & Reuse) |

Stages 1-6 are detailed in `stages/`. See individual stage files.

---

## Re-entrant Gates: When CLASSIFY and CHECK-EXISTS Re-fire

A re-entrant gate is not a stage you visit once — it is a test that fires again whenever conditions change. CLASSIFY and CHECK-EXISTS re-fire on:

| Trigger | Which gate | Why |
|---------|-----------|-----|
| **Goal refine** — the governing intent shifts during iteration | CLASSIFY | Spine may have changed; audience_tier may have changed; the re-classified spine may reveal a different CHECK-EXISTS path |
| **New research** — an external input arrives mid-loop | CLASSIFY + CHECK-EXISTS | Research can reclassify the problem and reveal existing artifacts that weren't visible before |
| **Pre-simulate** — before entering SIMULATE/SANDBOX | CHECK-EXISTS | Verify no existing simulation covers this case before creating a new one |
| **POST-COMPLETION-TEST failure** — loop-back triggered | CLASSIFY | Re-classifying after a failed completion test can reveal the angle that was missing |

**Implementation:** The re-entrant behavior is enforced by the `pre-tool-use-check-existing.sh` T1 hook (fires before every Write) and the `pre-tool-use-inventory-scan-required.sh` hook (fires before creating new governance nodes). When these fire, they ARE the re-entrant gate in operation.

---

## Governing Principles

- **P-META-034** (Reality-Tested Completion) — governs COMPLETION-TEST: exit the loop only when genuine examination from independent angles repeatedly finds nothing new
- **P-META-035** (Iteration & Reuse) — governs the loop and re-entrant gates: iterate before stopping; reuse before creating
- **P-META-036** (No-Orphans Law) — governs CLASSIFY: every artifact created by the Spine must declare its spine parent + canonical home at creation time. No orphan nodes may exit the loop.
- **JOURNEY-CONSOLIDATION-DRAFT-S072.md** (Platform Attitude — RATIFIED S081) — the trunk model that defines SUBSTRATE + DEFAULT + VARIETY: the Spine's output is always one DEFAULT + named VARIETY options; never hardcodes one answer.
- **CSPS-PLANNING-DISCIPLINE.md** — governs the Opus+Sonnet role split inside this loop; full planning constitution

---

## Foundation (ratified prerequisites)

The Planning Spine rests on two ratified artifacts:

| Foundation | What it provides | Status |
|-----------|-----------------|--------|
| **JOURNEY-CONSOLIDATION-DRAFT-S072.md** (Platform Attitude) | The output model: SUBSTRATE (always-on) + DEFAULT (one shippable path) + VARIETY (named selectable variants). Every spine output follows this pattern. | ✅ RATIFIED S081 |
| **P-META-036** (No-Orphans Law) | Every node created through the spine must declare its spine parent. No artifact without a home. | ✅ ENGRAVED S081 |

---

## Related Artifacts (cross-reference only, no content copies)

| Artifact | Role in spine |
|---------|--------------|
| `SPINE-ATLAS-SPEC.md` | Substrate: what CHECK-EXISTS queries; includes the 6-rank sensitive-places gate; tooling BLOCKED on A2-cycles-audit |
| `RESEARCH-INPUT.md` | How research enters the loop; what triggers it; schema |
| `ITERATION-REUSE-DYNAMICS.md` | Deep dive on how P-META-035 is expressed in the loop |
| `INHERITANCE-MODEL.md` | Carry-forward; how planning decisions propagate across sessions and audits |
| `TRUNK-BRANCH-RELOAD.md` | Trunk-branch-reload model (S082): domain branches INHERIT trunk; branch-activation reload cures Domain-2/3 drift; named inter-stage data contract (`crystallized_intent`); GVRN artifact not 6th spine. |

## Trunk-Branch Model (see TRUNK-BRANCH-RELOAD.md for full spec)

This loop is the **TRUNK** — SUBSTRATE+DEFAULT in Platform-Attitude vocabulary. Domain branches (schema-design, journey, persona, feature) INHERIT all 7 stages and ADD domain-specific steps. A branch may NOT override or skip trunk stages.

**Key constraint:** Stage 3 EMITS `crystallized_intent` (named field). Stage 6 Part B CONSUMES it. This inter-stage data contract makes Part B mechanical, not conceptual. See `TRUNK-BRANCH-RELOAD.md §4` (FINDING-S082-01 resolution).

**GVRN artifact, not a 6th L1 Spine.** The Planning Spine governs process (HOW to plan), not a knowledge domain. Spine classification: `core_spine: GVRN`. Precedent: Simulation = method under VALD.

---

*RATIFIED v0.1 — Sonnet S080 | Ratified S082 · 2026-06-11*
