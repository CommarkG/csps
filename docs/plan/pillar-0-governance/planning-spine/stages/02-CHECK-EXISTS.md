---
id: csps.governance.planning-spine.stage-check-exists
name: planning-spine-stage-check-exists
description: "Stage 2 — CHECK-EXISTS. RE-ENTRANT gate. Queries the canonical map (Spine Atlas when available; pre-tool-use-check-existing.sh + pre-tool-use-inventory-scan-required.sh now) before any creation. Re-fires on pre-simulate and new-research."
version: "0.1-draft"
owner: group:finky
lifecycle: production
lifecycle_state: active
status: draft
re_entrant: true
re_entrant_triggers:
  - pre-simulate
  - new-research
canonical_artifact: .claude/hooks/pre-tool-use-check-existing.sh
canonical_artifact_2: .claude/hooks/pre-tool-use-inventory-scan-required.sh
atlas_dependency: SPINE-ATLAS-SPEC.md
atlas_blocked_on: A2-cycles-audit
---

# Stage 2 — CHECK-EXISTS (RE-ENTRANT)

**Type:** Gate — fires before any creation and on named re-entrant triggers.

## What It Does

Before any new node (principle, contract, validator, route, doc) is created: checks whether a node for this concept already exists. If it exists → reuse or extend. If it does not exist → creation is authorized, but auto-registration is required.

## Current Mechanism (pre-Atlas)

- `pre-tool-use-check-existing.sh` — T1 hook, fires before Write, advisory
- `pre-tool-use-inventory-scan-required.sh` — T1 hook, fires before new governance node creation

## Designed Mechanism (Spine Atlas — BLOCKED on A2-cycles-audit)

When the Spine Atlas ships: CHECK-EXISTS becomes a single O(1) query against the Atlas:
```
node tools/atlas.mjs query "<concept-name>"
```
Returns: canonical home, aliases, spine, status (active/stub/deprecated). Currently deferred. See `SPINE-ATLAS-SPEC.md`.

## Re-entrant Behavior

CHECK-EXISTS fires again when:
- **Pre-simulate** — before entering the SIMULATE/SANDBOX stage, check if an existing simulation covers this case
- **New research** — new research can surface existing artifacts that weren't previously visible

## Failure Mode Without Re-entry

The S072 journey pages (6 routes created where 2 would have sufficed) are the canonical failure case. CHECK-EXISTS was not re-fired before creating `journey-trunk`, `journeys`, `user-journey` — each of which duplicated partial aspects of `/platform/journey`. A re-entrant CHECK-EXISTS at pre-simulate and goal-refine would have caught this.

## EXISTS≠ACTIVE Corollary

A found artifact must be verified as ACTIVE, not just present. `post-stop-exists-not-equals-active.sh` monitors this. The check queries for existence AND activation status.

---
*DRAFT — part of Planning Spine scaffold. Not built until Governor ratifies loop model.*
