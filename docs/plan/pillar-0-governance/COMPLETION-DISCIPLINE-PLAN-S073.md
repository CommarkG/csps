---
id: csps.governance.completion-discipline-plan-s073
name: COMPLETION-DISCIPLINE-PLAN-S073
description: >
  Plan Integrity / Completion-Before-New — the strong CSPS discipline that the ACTIVE plan
  completes before new things start; new intent arising mid-plan routes through the threshold
  → vault/PI → placed optimally into a FUTURE plan, never injected mid-flight. Consolidates
  P-OP-002 FWWS + Long-Run Builder Doctrine M0.7 + SPI batch-sizing + the Opus-authors-hard-parts /
  Sonnet-runs-autonomous cadence. Governor S073 directive: "prioritize completion over false
  efficiency that stresses context and creates partial implementations."
type: governance
diataxis_type: explanation
protection_level: protected
status: draft
lifecycle_state: pending-review
quality_state: draft
core_spine: GVRN
core_spines: [GVRN, OPER, AI, VALD]
schema_anchor: pillar_0_governance_leaves
version: "1.0"
session: S073
owner: group:finky
authored_by: OPUS-15
governing_principle: P-OP-002
context_question: "Is there an OPEN active plan? If yes, does this new intent route through the threshold to a future plan — or am I about to disrupt the active plan?"
inherits_from: "P-OP-002 FWWS + LONG-RUN-BUILDER-DOCTRINE.md (M0.7) + scope-pressure-index.md (SPI) + feedback_multibatch_longrun_cadence + threshold-router.mjs"
closure_owner: Governor (Yariv) — ratifies; OPUS-15 drives to PROTO
closure_decision: "Governor ratifies → OPUS issues PROTO; OR rejects/MODIFIES"
closure_by: "S074 open (trigger: next session start)"
links:
  - { rel: fwws, href: ../../../packages/principles/principles.yaml }
  - { rel: long-run, href: ./LONG-RUN-BUILDER-DOCTRINE.md }
  - { rel: spi, href: ./scope-pressure-index.md }
  - { rel: threshold, href: ../../../tools/scripts/threshold-router.mjs }
---

# Completion Discipline — Plan Integrity (S073)

> DRAFT — pending Governor ratification. Carries its own closure obligation (cannot float).

## CORE SEED
**The active plan completes before new things start.** When a new issue/idea arises mid-plan, it MUST be routed through the threshold → vault/PI → PE-sized → placed into a FUTURE plan slot. It is NEVER injected into the active plan. This prioritizes COMPLETION over "false efficiency" — the false efficiency that chases new ideas mid-flight, stresses context, and leaves a trail of partial implementations. Lived pattern it prevents: this very session generated ~10 PROTOs/ideas mid-flight; the ones that floated (ANTI-FLOAT held correctly, but others were near-injected) prove the need.

## THE PRINCIPLE (candidate P-OP-008 "Completion-Before-New" — or the mechanical arm of P-OP-002 FWWS)
1. **Active-plan-first:** an open plan (incomplete milestones) is completed (or reaches a clean checkpoint) before a new plan starts.
2. **New-intent-routes:** new issues → `threshold-router.mjs` → input_class → vault/PI → PE-scored → future plan. Opus does NOT hand-inject a new item into the active PROTO/plan.
3. **Disruption is the exception, not the default:** only a Governor DPR-4/5 (stop-immediately/redesign) interrupts an active plan. Everything else waits its turn.

## CONSOLIDATED FACETS (all one discipline — no fork)
- **FWWS (P-OP-002):** finish what we started. This is its mechanical enforcement.
- **Long-Run cadence (M0.7):** run the plan start→SEAL, R-class stops only. (feedback_multibatch_longrun_cadence)
- **SPI batch-sizing:** size the plan into optimally-resourced batches + tag cadence (AUTONOMOUS|STOP).
- **Opus-authors-hard-parts / Sonnet-runs-autonomous:** Opus puts core seeds + all R-class decisions in the PROTO up front; Sonnet runs the technical work without per-batch stops.

## MULTI-DIRECTION ENFORCEMENT (the arsenal — make it permanent)
1. **Threshold (front door):** new issues classified + routed to vault/PI, not the active plan.
2. **T1 pre-creation gate:** a hook flags when a NEW (non-continuation) item is being added to the active plan/PROTO while an open plan exists → "route through threshold first."
3. **T2 validator** `validate-completion-before-new.mjs`: open plans complete (or checkpointed) before new ones; injected-without-threshold items flagged. Tier STANDARD.
4. **T3 session-open injection:** "active plan first; new issues → threshold" surfaced every tab.
5. **AGENTS.md hard-NO** + **memory** (feedback_completion_before_new) — inherited every tab.
6. **Handoff carry:** the active plan + its completion state carries in every handoff (Zone A/B).

## THE OPUS↔SONNET CADENCE (permanent + self-auditing)
- Opus issues **multi-batch long-run PROTOs** with core seeds + all R-class decisions authored up front.
- Sonnet runs the technical work **autonomously**, R-class stops only, reports at SEAL.
- **Sonnet AUDITS this every turn:** each milestone report ends with a one-line `CADENCE-AUDIT:` — "did Opus author the hard parts up front (Y/N) · was I able to run without nominal stops (Y/N) · friction: <one line>" — so Opus improves the next PROTO. Feedback loop, mechanically required in the report template.
- **Inherit to all tabs:** session-open + handoff SONNET STARTUP BLOCK both carry the cadence + the CADENCE-AUDIT requirement.

## ENFORCEMENT BATCHES (for the PROTO — long-run, AUTONOMOUS unless tagged)
- E1 [GVRN/VALD]: principle P-OP-008 (stub, Governor id) + `validate-completion-before-new.mjs` (T2 STANDARD) + AGENTS hard-NO. Register in audit-runner first.
- E2 [OPER]: T1 pre-creation gate (flag new-item-into-active-plan-without-threshold) under Write|Edit matcher + DECLARED_HOOKS.
- E3 [AI/GVRN]: session-open injection + handoff SONNET STARTUP BLOCK carry + the `CADENCE-AUDIT:` line in the Sonnet milestone-report template.

*Status: DRAFT — pending Governor ratification. closure_by: S074 open. — OPUS-15, S073, 2026-05-31*
