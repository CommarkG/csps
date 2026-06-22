---
id: csps.handoff.PROTO-S088-SEQUENCE-DIRECTIVE
name: PROTO-S088-SEQUENCE-DIRECTIVE
description: "Opus #25 → Sonnet S088 directive. Three-PROTO sequence: Journey-Core-Spine + Ratification-Propagation + Comm-Harvesting+Council. Full warrant + DoD per item. Saved at S087 close (90K remaining — B_CONTEXT_CHECKPOINT_GATE: harvest before compact)."
version: "1.0"
session: S087
owner: group:finky
authored_by: OPUS-25
lifecycle: production
lifecycle_state: active
core_spine: GVRN
diataxis_type: reference
schema_anchor: vault_files
impl_status: pending-build
precedent_checked: true
links:
  - { rel: master-plan, href: OPUS-S087-MASTER-PLAN-5-SYSTEMS.md }
  - { rel: handoff, href: HANDOFF-S087-to-S088.md }
  - { rel: journey-plan, href: ../pillar-0-governance/JOURNEY-ORCHESTRATOR-PLAN.md }
---

# PROTO-S088-SEQUENCE — Full Opus Directive

> Saved at S087 close (B_CONTEXT_CHECKPOINT_GATE — 90K left, not enough for 3-PROTO build).
> FIRST ACTION at S088 open: run verify → read this file → start PROTO-S088-JOURNEY-CORE-SPINE.

## WARRANT

Governor ratified ALL: Journey Core Spine formalization, Phase-2.0 += pipelines+core-spines,
"ratified ⇒ platform standard + audit", Comm-Harvesting+Council moat.

**Existing-before-new:** HARVEST before building:
- `docs/plan/pillar-0-governance/JOURNEY-ORCHESTRATOR-PLAN.md`
- `JOURNEY-ID-SCHEMA` (search existing)
- `journey-trunk` (search existing)
- Check CSP precedent before building any new journey artifact.

Apply B_CONTEXT_CHECKPOINT_GATE between items; harvest-before-compact.

---

## ① PROTO-S088-JOURNEY-CORE-SPINE  (the sealed structure FIRST)

**Mandate:** Define + seal the Journey as a ratified core-spine ENTRY (operating method; NOT a 6th
L1 spine — core-spine-expert places it). Encode as data/schema + sealed doc.

**L0 DEFINITION:**
journey = governed goal→verified-completion (identity, goal, ordered phases, completion-verify gate).

**L0 INITIAL PARTS (mandatory every journey):**
1. intake/goal-crystallization (Threshold)
2. 4-axis classify
3. PE-significance
4. phase sequence
5. completion criteria + verification gate

**L0 MANDATORY CONNECTIONS:**
`Threshold → PE → CIE⟲ → Tiers/Permissions(authority-gate each step) → completion-verify`

**FORK POINTS (explicit):**
- identity/auth
- actions-per-step
- surface (CLI/IDE vs web/app)
- tier semantics
- output-format (B_CONSUMPTION_ADAPTATION)

**BRANCHES:**
- developer-journey
- external-user-journey

**SUB-BRANCHES:** persona_target × tier × domain

**Deliverables:**
- Journey core-spine doc (sealed)
- Schema committed (journey.schema or equivalent)
- `validate-journey-conformance.mjs` (BLOCKING): every journey artifact conforms to the spine

**DoD:**
spine doc sealed + schema committed + conformance validator PASS + ZF C1/C2/C3

---

## ② PROTO-S088-RATIFICATION-PROPAGATION  (Pipeline A — makes ratifications stick)

**Mandate:** Build the pipeline: ratify → 5-surface engrave → fold into creation path
(templates/generators/DNA tags) → register audit coverage (validator + audit-runner cadence)
→ conformance-enforced on all future creations.

**Deliverables:**
- `ratified-standards.yaml` registry — each ratified item → its creation-standard surface + its audit entry
- `validate-ratification-propagation.mjs` (BLOCKING): every ratified item has BOTH a creation-standard
  hook AND an audit entry (no ratify-without-propagation)
- Backfill THIS-SESSION ratifications into registry:
  - journey-core-spine
  - deterministic-gate
  - two-party-seal
  - insist-on-completion
  - context-checkpoint-gate
  - page-complete
  - uniform-DNA

**DoD:**
pipeline live + registry committed + validator PASS + this-session ratifications backfilled + ZF

---

## ③ REGISTER (not build yet) — Communication Harvesting + Council Engine (Pipeline B — capstone moat)

**Mandate:** Register in park-register + master plan as the integrating engine.
Sequence AFTER: journey-spine + daily-loop + Haiku enabler.

**Description:**
tab comms (WHO/WARRANT/ACTION) → harvest/analyze (CEC+CIE) → park → extract cross-domain
enhancement → ratify → Pipeline A → standard+audit → conform.

**Council tiers (routed by Threshold scope×criticality):**
- T0 solo
- T1 core (Opus+Sonnet)
- T2 expert-persona
- T3 full
- T4 full+external

NOTE: `selectPersonas` already seeds tiering.

**Deliverable:** New PARK entry + master plan update only (NOT built this session).

---

## MASTER PLAN UPDATES (also required)

1. Phase-2.0 += pipelines + core-spines
2. Add "ratified ⇒ standard+audit" as a standing rule (§0 or §7 dynamic-improvement protocol)

---

## BUILD DISCIPLINE

- PUSH gate on GREEN each item: `node tools/verify.mjs --skip-install 2>&1 | grep '"exit_code"'` → must be 0
- Gate command: `&&` not `;` (never push on non-zero)
- REPORT "Opus, this is Sonnet." + pastes per item completion
- Apply B_CONTEXT_CHECKPOINT_GATE between items

---

## PRECEDENT CHECK REQUIRED BEFORE BUILDING ①

Read these BEFORE authoring the Journey Core Spine (consolidation-before-creation):
1. `docs/plan/pillar-0-governance/JOURNEY-ORCHESTRATOR-PLAN.md`
2. Search for "journey-trunk" in repo
3. Search for "JOURNEY-ID-SCHEMA" in repo
4. Search for existing journey schema files
5. Read `tools/data/park-register.yaml` PARK-043 content (journey orchestrator hardwires)

If an existing journey definition overlaps → consolidate, do NOT fork.

---

*Saved by Sonnet S087 at session close | B_CONTEXT_CHECKPOINT_GATE: 90K remaining → harvest+compact | 2026-06-22*
