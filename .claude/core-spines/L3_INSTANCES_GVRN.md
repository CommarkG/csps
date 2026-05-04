---
id: csps.core-spines.l3-instances-gvrn
name: L3_INSTANCES_GVRN
description: Instance registry for the GVRN Core Spine. Auto-populated by tools/scripts/instance-registry-populator.mjs scanning corpus for `core_spine: GVRN` declarations (script implementation deferred week-4). Per-session manual updates allowed in the interim — list every artifact whose primary core_spine is GVRN.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
amendment_protocol: per-session edit (no formal amendment)
template_used: l3-instances-doctrine
template_status: novel-pending-pattern-evaluation
core_spine: GVRN
schema_anchor: core_spines_l3_instances
parent_l1_doctrine: ./L1_CORE_GVRN.md
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
session: S006
---

# L3_INSTANCES_GVRN

Instance registry for the GVRN Core Spine. Auto-populated by populator script (deferred week-4); manual updates allowed in interim.

## Instances by L2 domain

### DECISION_RIGHTS_CLARITY

- [behavioral-contracts.md § B_AUTONOMY_4_CONDITIONS](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [behavioral-contracts.md § B_CHECKPOINT_8_CATEGORIES](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [behavioral-contracts.md § B_PE_ALIGNMENT_GUARDIAN](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [behavioral-contracts.md § B_TWO_SIDED_HANDSHAKE](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [pillar-0-governance/agent-alignment-protocol.md](../../docs/plan/pillar-0-governance/agent-alignment-protocol.md)

### ACCOUNTABILITY_TRACEABILITY

- [behavioral-contracts.md § B_GOVERNOR_PROMPTS](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [behavioral-contracts.md § B_HANDOFF_PRE_FLIGHT_AUDIT](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [behavioral-contracts.md § B_TWO_SIDED_HANDSHAKE](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [behavioral-contracts.md § B_INTENT_TO_IMPACT](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [_handoff/VAULT/governor-prompts/](../../docs/plan/_handoff/VAULT/governor-prompts/)

### AMENDMENT_DISCIPLINE

- [behavioral-contracts.md § B_PCR_FOR_DECISIONS](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [behavioral-contracts.md § B_GRADUAL_BUILD_BY_FOUNDATIONS](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [docs/adr/](../../docs/adr/) (24 ADRs)
- [_handoff/VAULT/element-reviews/](../../docs/plan/_handoff/VAULT/element-reviews/)

## Cross-spine references

This file lists artifacts whose PRIMARY core_spine is GVRN. Many GVRN-domain artifacts also have secondary spines (e.g., B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS is primary AI but secondary GVRN); cross-spine artifacts appear in their primary's L3_INSTANCES.

## Populator script

`tools/scripts/instance-registry-populator.mjs` (deferred week-4 implementation) will:
1. Scan corpus for `core_spine: GVRN` declarations
2. Group instances by L2 domain (read parent_l1_doctrine cross-references)
3. Update this file with current state
4. Run as part of `pnpm verify` per-session cycle

**Registry signature:** S006-AI-l3-instances-gvrn-2026-05-04T20:30:00Z
