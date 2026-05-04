---
id: csps.core-spines.l3-instances-arch
name: L3_INSTANCES_ARCH
description: Instance registry for the ARCH Core Spine. Auto-populated by tools/scripts/instance-registry-populator.mjs scanning corpus for `core_spine: ARCH` declarations (script implementation deferred week-4).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
amendment_protocol: per-session edit (no formal amendment)
template_used: l3-instances-doctrine
template_status: novel-pending-pattern-evaluation
core_spine: ARCH
schema_anchor: core_spines_l3_instances
parent_l1_doctrine: ./L1_CORE_ARCH.md
tags:
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
session: S006
---

# L3_INSTANCES_ARCH

Instance registry for the ARCH Core Spine.

## Instances by L2 domain

### COMPOSITION

- [pillar-3-platform-services/template-governance.md](../../docs/plan/pillar-3-platform-services/template-governance.md) — 22-template UI catalog
- [_handoff/VAULT/template-registry.md](../../docs/plan/_handoff/VAULT/template-registry.md) — universal template registry
- [pillar-3-platform-services/customer-kit.md](../../docs/plan/pillar-3-platform-services/customer-kit.md)
- [behavioral-contracts.md § B_TEMPLATE_FIRST_CREATION](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [tools/templates/](../../tools/templates/) (gradual-build-plan + b-star-contract + memory-entry + audit-row + chat-jump-prompt + priority-engine.schema.yaml)

### LAYER_SEPARATION

- [pillar-0-governance/architecture-principles.md#P-ARCH-013](../../docs/plan/pillar-0-governance/architecture-principles.md) — universal-traits-trunk-domain-overlays
- [pillar-0-governance/csps-core-manifest.md](../../docs/plan/pillar-0-governance/csps-core-manifest.md) — Core Spines + outward-layering
- [behavioral-contracts.md § B_CORE_SPINE_DISCIPLINE](../../docs/plan/pillar-0-governance/behavioral-contracts.md)

### STRUCTURAL_INTEGRITY

- [pillar-2-data-and-schema/foundation-zmodel.md](../../docs/plan/pillar-2-data-and-schema/foundation-zmodel.md)
- [libs/policies/audit-triggers.sql](../../libs/policies/audit-triggers.sql)
- [libs/policies/base.zmodel](../../libs/policies/base.zmodel)
- [docs/adr/0007-postgres-trigger-based-audit.md](../../docs/adr/0007-postgres-trigger-based-audit.md)
- [docs/adr/0017-multi-schema-app-boundary.md](../../docs/adr/0017-multi-schema-app-boundary.md)

### TRACEABILITY

- [docs/adr/0023-hybrid-frontmatter-schema-universal-core-plus-per-file-type.md](../../docs/adr/0023-hybrid-frontmatter-schema-universal-core-plus-per-file-type.md)
- [tools/validators/validate-frontmatter.mjs](../../tools/validators/validate-frontmatter.mjs)
- [packages/principles/principles.yaml](../../packages/principles/principles.yaml) — provenance via id + session fields

## Populator script

See L3_INSTANCES_GVRN.md §"Populator script" — same script populates all 5 L3_INSTANCES files.

**Registry signature:** S006-AI-l3-instances-arch-2026-05-04T20:30:00Z
