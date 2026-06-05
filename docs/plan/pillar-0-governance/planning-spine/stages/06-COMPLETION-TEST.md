---
id: csps.governance.planning-spine.stage-completion-test
name: planning-spine-stage-completion-test
description: "Stage 6 — COMPLETION-TEST. P-META-034 gate. Loop exits only when genuine examination from independent angles repeatedly finds nothing new. Otherwise: loop-back to CLASSIFY."
version: "0.1-draft"
owner: group:finky
lifecycle: production
lifecycle_state: active
status: draft
re_entrant: false
governing_principle: P-META-034
loop_exit_condition: "IZFC: fresh angle sweep finds zero new findings"
loop_back_condition: "any new finding → return to CLASSIFY"
canonical_artifact: packages/principles/principles/P-META-034-reality-tested-completion.yaml
---

# Stage 6 — COMPLETION-TEST (P-META-034 Gate)

**Type:** Gate — governs loop exit. Exit is EARNED, not declared.

## What It Does

Before the planning loop exits, the completion test requires genuine examination from independent angles until a new sweep finds nothing. This is the IZFC (Iterative Zero-Finding Cycles) discipline applied to the planning loop as a whole.

## Canonical Artifact

`packages/principles/principles/P-META-034-reality-tested-completion.yaml`

No content here — cross-reference only.

## Loop Exit vs Loop-Back

| Outcome | Condition | What happens next |
|---------|-----------|------------------|
| **EXIT** | Fresh IZFC sweep finds zero new findings — completion is earned | Plan is ready for ratification |
| **LOOP-BACK** | A new finding surfaces | Return to CLASSIFY (Stage 1) for re-classification with the new information |

## The Loop-Back Is Not Failure

A loop-back is the IZFC discipline working correctly — a new angle revealed something. The planning loop did its job. Stopping before loop-back is the failure mode.

## IZFC Self-Audit Questions (applied to the planning loop)

1. Did each sweep examine a genuinely different angle — or re-check the same area more carefully?
2. Is termination EARNED (a fresh sweep actually hit zero) or ASSUMED (the plan felt done)?
3. Is every finding tied to specific evidence (file:line / tool output / named validator)?
4. Did the governing INTENT survive — does the plan do what we set out to do?
5. What breaks in the NEXT step if I'm wrong — and did I check it?

---
*DRAFT — part of Planning Spine scaffold. Not built until Governor ratifies loop model.*
