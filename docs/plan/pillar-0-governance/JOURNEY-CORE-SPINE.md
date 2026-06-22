---
id: csps.governance.journey-core-spine
name: JOURNEY-CORE-SPINE
description: >
  Sealed L0 definition of the Journey — the platform's core operating method.
  Canonical front-door reference for all journey artifacts.
  validate-journey-conformance.mjs uses this as the structural anchor.
  Deep implementation detail lives in the linked docs; this is the invariant surface.
version: "1.0"
session: S088
owner: group:finky
authored_by: "Sonnet S088 (PROTO-S088-JOURNEY-CORE-SPINE, Opus #25 directive)"
core_spine: GVRN
diataxis_type: reference
schema_anchor: vault_files
lifecycle: production
lifecycle_state: active
status: sealed
impl_status: sealed-zf
sealed_session: S088
sealed_by: "PROTO-S088-JOURNEY-CORE-SPINE (Opus #25 Governor-ratified directive)"
precedent_checked: true
links:
  - { rel: orchestrator-plan, href: JOURNEY-ORCHESTRATOR-PLAN.md }
  - { rel: id-schema, href: JOURNEY-ID-SCHEMA-S084.md }
  - { rel: closed-enums, href: journey-closed-enums.yaml }
  - { rel: seeds, href: JOURNEY-SEEDS-S084.md }
  - { rel: core-spine-registry, href: "../../../tools/config/core-spine-registry.yaml" }
  - { rel: conformance-validator, href: "../../../tools/validators/validate-journey-conformance.mjs" }
---

# Journey Core Spine — Sealed L0 Definition

> **Sealed under PROTO-S088-JOURNEY-CORE-SPINE.** Changing any section of this doc requires
> the boundary-crossing protocol (P-ARCH-TRUNK-BRANCH-PATTERN). The machine-readable trunk lives
> in `tools/config/core-spine-registry.yaml` → `id: journeys` (SEED-1, OPUS-22). This doc is the
> human-readable L0 front-door. Implementation depth lives in the linked docs.

---

## L0 DEFINITION

**journey = governed goal → verified-completion**

A journey is a tracked path from a classified intent to verified completion, run through 5 ordered
phases, each closed by a Phase Exit Gate (PEG), with risk-classed gate modes, full event logging,
and version-bound instances.

**Core identity (every journey instance carries):**
1. **identity** — unique journey ID, tenant scope, definition version, and running actor
2. **goal** — a crystallized intent that Threshold has classified and risk-rated
3. **ordered phases** — P1 Intent → P2 Audit → P3 Decide → P4 Validate → P5 Activate-Verify-Learn
4. **completion-verify gate** — PEG-5 with acceptance criteria + confidence level + rollback plan

---

## MANDATORY PARTS (every journey instance)

| Part | What it is | Enforced by |
|------|------------|-------------|
| **1. intake / goal-crystallization** | Threshold classifies the intent → risk_class ratified (R8) | T1 threshold-router (M-16/M-42) |
| **2. 4-axis classify** | work-type × risk-class × blast-radius → variant selector (SEED-6) | validate-journey-gate.mjs |
| **3. PE-significance** | PE score (urgency×impact/SPI) recorded at PEG-3; path chosen by score, not authority | T1 council-dispatcher + validate-skill-invocation-rate |
| **4. phase sequence** | P1→P2→P3→P4→P5; no silent skip (C1); each PEG has minimum_exit_evidence | validate-journey-gate.mjs BLOCKING |
| **5. completion criteria + verification gate** | PEG-5: declared acceptance criteria + confidence level + rollback plan; "verify-completely" BANNED | T2 journey-gate block-test |

---

## MANDATORY CONNECTIONS

```
Threshold (intent-in) → PE (decide-weight) → CIE⟲ (emit-each-PEG + learn) → Tiers/Permissions (authority-gate each step) → completion-verify (PEG-5)
```

| Mechanism | Role | Gate mode |
|-----------|------|-----------|
| **Threshold** | ENTRY gate (pre-P1) + every new mid-journey input | BLOCKING at entry for all risk classes |
| **PE** | Decides path at PEG-3 via urgency×impact score | BLOCKING at PEG-3 for standard/elevated/critical; advisory for fast |
| **CIE** | Emits signal on every PEG exit; feeds back to re-weight PE | Never silent; BLOCKING only on critical/structural finding |
| **Tiers/Permissions** | Actor authority gates what actions are available per step | PersonaTier × risk_class → gate_mode per SEED-2 matrix |
| **completion-verify** | PEG-5 acceptance gate | BLOCKING; requires criteria + confidence + rollback |

---

## FORK POINTS

Every journey implementation MUST explicitly declare how it handles each fork point:

| Fork | Canonical values | Reference |
|------|-----------------|-----------|
| **identity/auth** | governor · core_dev · external_dev · account_owner_admin · team_leader · end_user | PersonaTier (journey-closed-enums.yaml) |
| **actions-per-step** | manual · semi-auto · fully-auto | drive_auto BranchAxis |
| **surface** | CLI/IDE · web/app · API | vocabulary + focal BranchAxis |
| **tier semantics** | fast · standard · governed · exploratory | VariantType; risk_class drives selector |
| **output-format** | structured · narrative · compact · context-adaptive | B_CONSUMPTION_ADAPTATION (PARK-052) |

---

## BRANCHES

| Branch | Consumer | Sub-branches |
|--------|---------|--------------|
| **developer-journey** | Platform/app developers (Governor, core_dev, external_dev) | persona_target × tier × domain |
| **external-user-journey** | End-users of platform apps (account_owner, team_member, end_user) | persona_target × tier × domain |

**Sub-branch dimensions:**
- `persona_target` — from PersonaTier enum (journey-closed-enums.yaml)
- `tier` — from VariantType: fast / standard / governed / exploratory
- `domain` — GVRN / ARCH / AI / OPER / VALD

---

## TRUNK INVARIANTS (sealed — boundary-crossing to change)

Source: `tools/config/core-spine-registry.yaml` → `journeys` → `trunk.invariants` (verbatim SEED-1, OPUS-22).

| ID | Name | Statement | Failure mode |
|----|------|-----------|--------------|
| **C1** | no-silent-skip | A phase, gate, or evidence requirement may be compressed, overridden, or marked N/A — but NEVER unrecorded. Every skip writes event (actor+reason+scope) to log (SEED-8). | Silent skip → audit log lies; "done" not reproducible from events. |
| **C2** | humble-first | Every phase begins by consulting what already exists (precedent/prior/canon) before generating new. Existing-Before-New is a phase pre-step, not advice. | Parallel-creation disease — new node when an existing one should have evolved. |
| **C3** | evidence-at-gate | No PEG advances without THIS-SESSION evidence bound to the gate (SEED-5). Memory of prior run is NOT evidence. Re-run (or hash-verify for cheap scopes) IS the proof. | Nominal DONE — next instance rediscovers and re-fails the same thing. |
| **C4** | decide-with-pe-and-cie | Every PEG-3 selects among options with a PE score; every PEG emits a CIE signal on exit. Neither may be silent. | Path chosen by recency/authority, not priority; phases close with no learning signal. |
| **C5** | verify-against-acceptance-criteria | Completion = verified against DECLARED criteria + a confidence level + a monitoring/rollback plan. "verify-completely" BANNED. tenant_def LOCKED OUT MVP. | Unbounded "fully verified" claim; OR ad-hoc tenant variants with no inheritance rule. |

---

## PHASE SEQUENCE (sealed — P1-P5)

Source: `tools/config/core-spine-registry.yaml` → `journeys` → `trunk.phases` (SEED-1).

| Phase | Name | Intent |
|-------|------|--------|
| **P1** | intent | Crystallize + classify the goal; selector runs (SEED-6); risk_class ratified (R8). |
| **P2** | audit | Consult what exists (C2); gather evidence; map the dependency surface. |
| **P3** | decide | Choose the path with a PE score (C4); register non-selected options (no-lost-threads). |
| **P4** | validate | Run the build/change; ZF evidence at gate (C3); ripple pass (SEED-4). |
| **P5** | activate-verify-learn | Activate; verify against acceptance criteria (C5); emit CIE; propagate essence (PARK-024). |

---

## CANONICAL LOCATIONS

| Artifact | Path | Purpose |
|----------|------|---------|
| **Sealed trunk (data)** | `tools/config/core-spine-registry.yaml` → `id: journeys` | Machine-readable trunk + 8 sections (SEED-1, OPUS-22) |
| **L0 definition (this doc)** | `docs/plan/pillar-0-governance/JOURNEY-CORE-SPINE.md` | Human-readable sealed reference; conformance anchor |
| **Closed enums** | `docs/plan/pillar-0-governance/journey-closed-enums.yaml` | All 9 enum types (SEED-6, OPUS-22) |
| **Gate matrix** | `tools/data/seed2-gate-mode-matrix.json` | PEG × mechanism × risk_class → gate_mode (SEED-2) |
| **Hardwire matrix doc** | `docs/plan/pillar-0-governance/JOURNEY-ID-SCHEMA-S084.md` | Hardwire matrix + T1/T2 enforcement per mechanism |
| **Build plan (9 seeds, 6 phases)** | `docs/plan/pillar-0-governance/JOURNEY-ORCHESTRATOR-PLAN.md` | B1-B6 build phases; PARK-043 B5/B6 post-db-push |
| **Conformance validator** | `tools/validators/validate-journey-conformance.mjs` | BLOCKING: structural completeness of spine |
| **PEG enforcement validator** | `tools/validators/validate-journey-gate.mjs` | BLOCKING: gate_mode matrix block-tests |

---

## SCOPE BOUNDARY (what this doc is NOT)

- **NOT** the operational container (that is PARK-043 B5/B6 — post 2026-06-27 db-push)
- **NOT** the full build plan (see JOURNEY-ORCHESTRATOR-PLAN.md for 9 seeds and 6 build phases)
- **NOT** the meta-model schema (see `libs/policies/schema.zmodel` for DB models)
- **NOT** the UI reshaper (see B2 dashboard build in the orchestrator plan)

This doc seals the **DEFINITION LAYER** only: the L0 meaning, mandatory parts, connections, fork points, branches, and the machine-readable references.

---

## ZF

- **C1** (placement): every section accounts for a dimension of the L0 definition — none floating. Scope boundary is explicit. 7 canonical locations named with paths.
- **C2** (fresh angle — consolidation): no infrastructure forked. The existing `journeys` entry in core-spine-registry.yaml (C1-C5, P1-P5, 4 variants, 8 sections, status: sealed as of S088) and journey-closed-enums.yaml are the data substrate; this doc is the L0 front-door reference that consolidates without duplicating.
- **C3** (fresh angle — completeness honesty): PARK-043 (5 hardwires B5/B6 — the operational container) is explicitly scoped out. The validator (validate-journey-conformance.mjs) validates structural presence, not operational activation (AP-001: EXISTS ≠ ACTIVE applies).

---

*Authored: Sonnet S088 | PROTO-S088-JOURNEY-CORE-SPINE | 2026-06-22 | Sealed under Opus #25 Governor-ratified directive*
