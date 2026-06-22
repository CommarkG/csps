---
id: csps.governance.journey-id-schema-S084
name: JOURNEY-ID-SCHEMA-S084
description: >
  The journey meta-model expressed as a `journeys` CORE-SPINE entry using the EXISTING 8-section schema
  (no invented IDs). Defines the sealed CORE (trunk), the BRANCHES, frontend-reshapeable IDs, and HARDWIRES
  ZF + PE + CIE + Threshold as NON-OPTIONAL at every phase (with T1+T2 enforcement). Answers the S084 audit:
  IDs aligned to canon · trunk/branch clear · core-in-corespine · ZF/PE/CIE/threshold hardwired everywhere.
version: "1.0"
session: S084
owner: group:finky
authored_by: OPUS-21
core_spine: GVRN
diataxis_type: reference
schema_anchor: vault_files
lifecycle: production
lifecycle_state: active
status: draft
impl_status: audit-1-complete
precedent_checked: true
links:
  - { rel: core-spine-registry, href: "../../../tools/config/core-spine-registry.yaml" }
  - { rel: connectivity, href: JOURNEY-CONNECTIVITY-AND-COUNCIL-S084.md }
  - { rel: moat-map, href: JOURNEY-MOAT-MAP-S084.md }
  - { rel: vocabulary, href: vocabulary.md }
---

# Journey ID Schema — aligned to canon + ZF/PE/CIE/Threshold hardwired (S084)

## Naming correction (honest change-track)
PRIOR DRAFT invented `JNY-PHASE/GATE/CORE/VARIANT/AXIS` — WITHDRAWN (violated B_NO_INVENTION_WITHOUT_
PRECEDENT_CHECK). CANON already provides everything: the core-spine 8-section schema + PEG (Phase Exit Gate)
+ §L1 shared-core + lowercase-noun spine ids. The journey is a `journeys` core-spine entry. No new scheme.

## THE JOURNEY = a `journeys` core-spine-registry ENTRY (canon 8-section schema)
`id: journeys` · `spine: GVRN` (lowercase-noun, like accountability/simulation/communication). The 8 required
sections ARE the journey meta-model — each frontend-reshapeable by id, gated by permission + the sealed trunk:

| Section (canon) | Journey meaning | Reshapeable? |
|---|---|---|
| **trunk** | THE SEALED CORE — §L1 shared-core: invariants T1-T5 (no-skip · humble-first · evidence-at-gate · PCR→PE/CIE decide · verify-completely) + the 5 phases P1-P5. | SEALED (boundary-crossing only) |
| **branches** | VARIANTS (fast/standard/governed/exploratory) + the 5 branch-axes (depth/drive-auto/vocabulary/permission/focal). Selector = RISK-CLASS (primary); persona = overlay. | editable per deployment (tier-gated) |
| **alignment_map** | spine=GVRN · pillar=pillar-0-governance · root=.claude/core-spines/L1_CORE_GVRN.md | governor |
| **wiring_map** | MOAT bindings (which M-NN fires per phase) + LOOP emissions (alignment/optimization/antidrift) — real files. | governor/core-dev |
| **cie_pe** | **PE + CIE hardwire (see matrix) — canonical, every spine has this section.** | core-dev |
| **tier_permission** | persona overlay + who-can-reshape-what (the 5-actor tiers). | governor |
| **escalation** | the COUNCIL (inner/expert/external) + ratification ladder per risk-class. | governor |
| **realtime_save** | journey INSTANCE state persistence (Journey/JourneyStage rows, id @db.Uuid). | system |

PHASES `P1..P5` (in trunk) · each phase has a **PEG-{1..5}** (Phase Exit Gate, canon term). Instance layer:
`Journey` (id @db.Uuid, status 4-state) · `JourneyStage` (id, order Gap-Int) — already ID'd.

## HARDWIRE MATRIX — ZF + PE + CIE + Threshold are NON-OPTIONAL (Governor S084: "not optional")
| Mechanism | Where it is HARDWIRED | Non-optional rule | Enforcement (T1 + T2) |
|---|---|---|---|
| **THRESHOLD** | ENTRY (pre-P1) + on every new mid-journey input | No journey starts, and no new input is absorbed, without threshold classify (work-type/risk/blast-radius → variant). | T1 user-prompt-submit-intake + threshold-router (M-16/M-42) · T2 validate-threshold-routing-coverage |
| **ZF / IZFC** | EVERY PEG-{1..5} | No phase advances without `minimum_exit_evidence` + THIS-SESSION verify=0. Gate BLOCKS, not warns. | T1 orchestrator cannot-advance + pre-tool-use-rzf-evidence-gate · T2 validate-zf-cycle-format / validate-journey-gate (new, EXTENDED) |
| **PE** | DECIDE gate (PEG-3) + re-rank at every PEG | No path/option chosen without a PE score (urgency×impact/SPI). | T1 council-dispatcher invokes pe-agent · T2 validate-skill-invocation-rate |
| **CIE** | EVERY PEG (exit emit) | Every phase EMITS a CIE signal on exit (OBSERVE); none is silent. CIE feeds the optimization loop + re-weights PE. | T1 orchestrator emit-on-gate · T2 validate-cie-emission (new, EXTENDED) |

**Result:** every step is bounded by Threshold (in) → … → ZF+CIE (out), with PE at decide. None is optional;
each is a BLOCKING gate field on the PEG schema, enforced by hook (can't-advance) + validator (verify).

## ANSWERS to the S084 audit
1. **IDs for max flexibility + frontend reshape:** YES — every section/phase/PEG/variant/axis/binding is an
   id'd row in the `journeys` entry; dashboard CRUDs them by permission-tier; trunk is sealed-view-only.
2. **Mutual (trunk) vs specific (branch):** YES, canon — `trunk` section (sealed §L1 shared-core) vs
   `branches` section (variants/axes). Selector = risk-class primary, persona overlay.
3. **Core within a corespine:** YES — the `trunk` section of the `journeys` core-spine entry IS the core-in-
   corespine. Registering `journeys` (8 sections, validate-core-spine-template) is the immediate build.
4. **ZF/PE/CIE/Threshold hardwired:** YES — the matrix above makes all four non-optional BLOCKING gates with
   T1+T2 each. (Note: CIE ADJUST/INJECT/MEASURE partially dormant today — wiring it fully is part of the build.)

## Naming/numbering alignment (vocabulary-canon)
- `journeys` (lowercase-noun spine id) · `PEG-N` (canon Phase Exit Gate) · `P1-P5` phases · `M-NN` moat refs ·
  trunk/branches/cie_pe (canon section names) · ZF/IZFC (RZF retired S078; ZF = terminal shorthand, IZFC = governing).
- precedent_checked: true. No invented prefixes. Engraved terms (PCR/PE/CIE/PEG/IZFC) preserved.
