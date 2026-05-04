---
id: csps.core-spines.l3-instances-vald
name: L3_INSTANCES_VALD
description: Instance registry for the VALD Core Spine. Auto-populated by tools/scripts/instance-registry-populator.mjs scanning corpus for `core_spine: VALD` declarations (script implementation deferred week-4).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
amendment_protocol: per-session edit (no formal amendment)
template_used: l3-instances-doctrine
template_status: novel-pending-pattern-evaluation
core_spine: VALD
schema_anchor: core_spines_l3_instances
parent_l1_doctrine: ./L1_CORE_VALD.md
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
session: S006
---

# L3_INSTANCES_VALD

Instance registry for the VALD Core Spine.

## Instances by L2 domain

### COVERAGE_DISCIPLINE

- [pillar-0-governance/audit-runner.md](../../docs/plan/pillar-0-governance/audit-runner.md) — single registry; ~140+ audits
- [pillar-0-governance/audit-hub.md](../../docs/plan/pillar-0-governance/audit-hub.md) — 10 pipelines orchestration
- [behavioral-contracts.md § B_AUDIT_ORCHESTRATION](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [pillar-0-governance/five-surface-engraving.md](../../docs/plan/pillar-0-governance/five-surface-engraving.md)
- [behavioral-contracts.md § B_FIVE_SURFACE_ENGRAVING](../../docs/plan/pillar-0-governance/behavioral-contracts.md)

### EVIDENCE_SPECIFICITY

- [_handoff/VAULT/closing-summary-template.md](../../docs/plan/_handoff/VAULT/closing-summary-template.md) — §10.0 / §10.0e-j mandatory headers
- [behavioral-contracts.md § B_PRE_CLOSE_VERIFICATION](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [behavioral-contracts.md § B_POSITIVE_VALUE_EXTRACTION](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [behavioral-contracts.md § B_CATCH_TO_ENGRAVING](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [behavioral-contracts.md § B_STRUCTURAL_PREVENTION_DISCIPLINE](../../docs/plan/pillar-0-governance/behavioral-contracts.md)

### RESULT_DRIVEN_VERIFICATION

- [pillar-0-governance/zero-findings-discipline.md](../../docs/plan/pillar-0-governance/zero-findings-discipline.md)
- [pillar-0-governance/qc-audit-system.md](../../docs/plan/pillar-0-governance/qc-audit-system.md)
- [behavioral-contracts.md § B_RZF](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [behavioral-contracts.md § B_CEC](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [behavioral-contracts.md § B_QC_AUDIT](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [tools/verify.mjs](../../tools/verify.mjs) — the mechanical re-run

## Populator script

See L3_INSTANCES_GVRN.md §"Populator script".

**Registry signature:** S006-AI-l3-instances-vald-2026-05-04T20:30:00Z
