---
id: csps.core-spines.l2-domain-arch-schema-governance
name: L2_DOMAIN_ARCH_SCHEMA_GOVERNANCE
description: >
  ARCH spine domain governing schema as the platform's primary reference mechanism.
  Covers: schema_anchor resolution (every anchor points to something real), ZModel canonical
  location, schema-registry.md as the anchor index, canonical home declarations,
  and the decoration principle (fields that don't resolve don't govern).
  Operational layer beneath L1_CORE_ARCH sealed doctrine.
  Ratified: Opus Turn 16 SROF-008 E5 — first real use cases exist (schema_anchor orphans,
  ZModel location ambiguity, schema-registry gap).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
amendment_protocol: normal review (PCR + amendment)
template_used: l2-domain-doctrine
template_status: novel-pending-pattern-evaluation
core_spine: ARCH
schema_anchor: core_spines_l2_domain
parent_l1_doctrine: ./L1_CORE_ARCH.md
domain: SCHEMA_GOVERNANCE
tags:
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S027
links:
  - { rel: parent-l1, href: ./L1_CORE_ARCH.md }
  - { rel: schema-registry, href: ../../../docs/plan/pillar-0-governance/schema-registry.md }
  - { rel: nothing-stands-alone, href: ../../../tools/validators/validate-nothing-stands-alone.mjs }
  - { rel: opus-ratification, href: ../../../docs/plan/_handoff/VAULT/opus-srof-schema-and-spines-review.md }
---

# L2_DOMAIN_ARCH_SCHEMA_GOVERNANCE

Operational decomposition of ARCH spine — the domain governing **schema as the platform's
primary reference mechanism**.

## What this domain governs

Schema governance is the domain that makes "schema as main point of reference" real rather
than aspirational. Every field that claims to connect an artifact to the platform's schema
model must actually resolve to something. A `schema_anchor:` value that is only a string
label does not connect — it decorates. The domain enforces the distinction.

The domain establishes: (1) every `schema_anchor:` value appears in `schema-registry.md`
with a resolution type and target; (2) the ZModel schema has a canonical location
(`libs/policies/schema.zmodel` as platform foundation, apps extend in `apps/{app}/schema/`);
(3) canonical home declarations are indexed in schema-registry.md rather than scattered
across individual artifacts; (4) index artifacts are machine-generated.

Platform scaling from 1 app to 30 apps requires this domain to be active. At 30 apps,
each with `core_spine: ARCH` declarations and schema entities, the orphan problem and
canonical-home fragmentation would make the platform unnavigable without a governed schema
reference mechanism.

## Operational governance surfaces

- **schema-registry.md** ([`docs/plan/pillar-0-governance/schema-registry.md`](../../docs/plan/pillar-0-governance/schema-registry.md)) — canonical index of all valid schema_anchor values with 3 resolution types (governance-section / zmodel-entity / typescript-type). SSoT for anchor resolution.
- **RP-003 (decoration principle)** — `schema_anchor: X` is only valid if X appears in schema-registry.md. Unknown anchors = ORPHAN.
- **ZModel canonical location** — platform foundation: `libs/policies/base.zmodel`; each app: `apps/{app}/schema/`. (Per Opus Turn 16 E1: ARCH CORE L1 to be amended to reflect this explicitly.)
- **RP-004 (generated indexes)** — L3 instance files, audit-runner-index.yaml, and future schema-derived indexes are generated, not manually maintained.
- **Canonical home index** — schema-registry.md `resolves_to:` fields give every anchor a canonical path. This replaces 63 scattered "canonical home" declarations in individual files.

## Per-domain validators

- `validate-schema-anchors.mjs` (to build Session B) — checks every `schema_anchor:` in corpus against schema-registry.md; NEW anchors BLOCKING; pre-existing orphans advisory
- `nothing-stands-alone-audit` (upgrade) — check anchor resolution against registry, not just field presence
- `validate-generated-artifact-freshness.mjs` (to build Session B) — checks generated:true artifacts were regenerated within session boundary
- `validate-nothing-stands-alone.mjs` (active) — orphan detection advisory for pre-existing; BLOCKING for new

## Composition

Composes with L2_DOMAIN_ARCH_TRACEABILITY (schema_anchor IS a traceability field; the two domains share `nothing-stands-alone-audit`) + GVRN Spine's AMENDMENT_DISCIPLINE domain (canonical home decisions are governance amendments; schema-registry.md requires GVRN-PCR to amend) + VALD Spine's COVERAGE_DISCIPLINE (coverage of schema_anchor resolution = a validation pipeline concern).

**Gap being closed:** Opus Turn 16 confirmed 43 pre-existing orphaned artifacts with unresolved
`schema_anchor:` values. The advisory validator has run for 15+ sessions without forcing resolution.
This domain provides the architectural home, the canonical resolver (schema-registry.md), and
the validator path (validate-schema-anchors.mjs) to close this gap systematically.

**Domain signature:** S027-AI-l2-domain-arch-schema-governance-2026-05-12T20:15:00Z
