---
id: csps.governance.planning-spine.stage-simulate-sandbox
name: planning-spine-stage-simulate-sandbox
description: "Stage 5 — SIMULATE/SANDBOX. Tests the plan against synthetic conditions before any real-world mutation. Canonical: B_SANDBOX_BEFORE_IMPLEMENTATION.md + core-spine-registry.yaml#simulation."
version: "0.1"
owner: group:finky
lifecycle: production
lifecycle_state: active
status: ratified
re_entrant: false
canonical_artifact: docs/plan/pillar-0-governance/behavioral-contracts/B_SANDBOX_BEFORE_IMPLEMENTATION.md
canonical_artifact_2: tools/config/core-spine-registry.yaml
canonical_artifact_2_section: "#simulation"
pre_stage_trigger: CHECK-EXISTS re-fires before entering this stage
---

# Stage 5 — SIMULATE/SANDBOX

**Type:** Test — no real-world mutations; validates the plan against representative conditions before committing.

## What It Does

Before any irreversible real-world change: simulate the plan outcome. Can be a formal sandbox (isolated environment), a scenario simulation (agent-deletion-test style), or a structured thought experiment. The requirement: the test must be genuinely independent of the plan's own assumptions (P-META-034 construct-validity).

## Canonical Artifacts

- `docs/plan/pillar-0-governance/behavioral-contracts/B_SANDBOX_BEFORE_IMPLEMENTATION.md` — the contract
- `tools/config/core-spine-registry.yaml#simulation` — simulation spine canonical home (B1-B4 simulation types)

No content here — cross-reference only.

## Re-entrant Check Before This Stage

CHECK-EXISTS (Stage 2) re-fires pre-simulate: check whether an existing simulation covers this case before creating a new simulation. A new simulation for an already-covered case is Stage 2's failure, not Stage 5's.

## Connection to SEED-001 (P-META-034 construct-validity)

The simulation must use a VALID CONSTRUCT — independent real conditions, not a self-confirming test. A simulation that is designed to pass proves nothing. See P-META-034 SEED-001 caution.

---
*RATIFIED — part of Planning Spine cluster. Ratified S082 · 2026-06-11.*
