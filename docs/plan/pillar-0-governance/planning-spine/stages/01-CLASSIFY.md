---
id: csps.governance.planning-spine.stage-classify
name: planning-spine-stage-classify
description: "Stage 1 — CLASSIFY. RE-ENTRANT gate. Identifies spine, audience_tier, pipeline route before any planning work begins. Re-fires on goal-refine, new-research, and post-completion-test loop-back."
version: "0.1-draft"
owner: group:finky
lifecycle: production
lifecycle_state: active
status: draft
re_entrant: true
re_entrant_triggers:
  - goal-refine
  - new-research
  - post-completion-test-loop-back
canonical_artifact: tools/scripts/threshold-classify.mjs
canonical_artifact_2: tools/scripts/threshold-router.mjs
---

# Stage 1 — CLASSIFY (RE-ENTRANT)

**Type:** Gate — fires at loop entry and on any named re-entrant trigger.

## What It Does

Classifies the input into: `{spine, audience_tier, pipeline, place, criticality}` before any other planning work. This is not a formality — it determines which artifacts are relevant (GVRN inputs → GVRN planning artifacts; ARCH inputs → schema artifacts) and which audience receives the output.

## Canonical Artifact

`tools/scripts/threshold-classify.mjs` + `threshold-router.mjs`
Cross-ref: `user-prompt-submit-intake.sh` (UserPromptSubmit hook that classifies every user turn)

## Re-entrant Behavior

CLASSIFY fires again when:
- **Goal refines** — governing intent shifts mid-loop (e.g., what started as ARCH becomes GVRN)
- **New research arrives** — external input can reclassify spine
- **Loop-back after COMPLETION-TEST failure** — re-classifying after failure can reveal the missing angle

## Failure Mode Without Re-entry

A once-classified input that is never re-classified drifts. S076 Dimension-4 was initially classified as a performance spike; it was actually a multi-tenant quota architecture question (ARCH). The classification gap caused 3 sessions of misrouted work. Re-classification at goal-refine prevents this.

---
*DRAFT — part of Planning Spine scaffold. Not built until Governor ratifies loop model.*
