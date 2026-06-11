---
id: csps.governance.planning-spine.stage-dual-focal
name: planning-spine-stage-dual-focal
description: "Stage 4 — DUAL-FOCAL. Holds the why (governance/architectural) and how (implementation) simultaneously before committing to a direction. Canonical: csps-dual-focal-plan.yaml."
version: "0.1"
owner: group:finky
lifecycle: production
lifecycle_state: active
status: ratified
re_entrant: false
canonical_artifact: docs/plan/csps-dual-focal-plan.yaml
---

# Stage 4 — DUAL-FOCAL

**Type:** Frame — holds two lenses simultaneously: the WHY (governing principle, spine, architectural intent) and the HOW (implementation path, constraints, sequencing).

## What It Does

Before committing to any implementation direction, DUAL-FOCAL ensures both lenses are active. The canonical failure mode: a builder focuses purely on HOW (implementation details) and loses the WHY (why this specific approach, not another) — producing technically correct work that doesn't serve the governing intent.

## Canonical Artifact

`docs/plan/csps-dual-focal-plan.yaml`

No content here — cross-reference only.

## In the Loop

DUAL-FOCAL is the bridge between INTENT-CRYSTALLIZE (which produces the WHY) and SIMULATE/SANDBOX (which tests the HOW). A plan that proceeds without this stage produces correct implementations of wrong goals.

## Connection to CSPS-PLANNING-DISCIPLINE

`CSPS-PLANNING-DISCIPLINE.md` §context+reasoning mandates: "When presented correctly with context and reasoning, AI collaborates flawlessly. Without it, AI pushes its own directive of doing things now." DUAL-FOCAL is the structural implementation of this: force both lenses before proceeding.

---
*RATIFIED — part of Planning Spine cluster. Ratified S082 · 2026-06-11.*
