---
id: csps.core-spines.l3-instances-oper
name: L3_INSTANCES_OPER
description: Instance registry for the OPER Core Spine. Auto-populated by tools/scripts/instance-registry-populator.mjs scanning corpus for `core_spine: OPER` declarations (script implementation deferred week-4).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
amendment_protocol: per-session edit (no formal amendment)
template_used: l3-instances-doctrine
template_status: novel-pending-pattern-evaluation
core_spine: OPER
schema_anchor: core_spines_l3_instances
parent_l1_doctrine: ./L1_CORE_OPER.md
tags:
  - domain:ops
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
session: S006
---

# L3_INSTANCES_OPER

Instance registry for the OPER Core Spine.

## Instances by L2 domain

### PACE_DISCIPLINE

- [behavioral-contracts.md § B_GRADUAL_BUILD_BY_FOUNDATIONS](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [tools/templates/gradual-build-plan.template.md](../../tools/templates/gradual-build-plan.template.md)
- [tools/templates/priority-engine.schema.yaml](../../tools/templates/priority-engine.schema.yaml)
- [_handoff/VAULT/topic-plans/](../../docs/plan/_handoff/VAULT/topic-plans/) — s006-governance-foundation + zero-laptop-dependency-setup

### WORKFLOW_INTEGRITY

- [behavioral-contracts.md § B_GOVERNOR_PROMPTS](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [behavioral-contracts.md § B_HANDOFF_PRE_FLIGHT_AUDIT](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [behavioral-contracts.md § B_ZERO_LAPTOP_DEPENDENCY](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [behavioral-contracts.md § B_PROTOCOL_LITERAL_EXECUTION](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [_handoff/VAULT/closing-summary-template.md](../../docs/plan/_handoff/VAULT/closing-summary-template.md)
- [_handoff/VAULT/protocols.md](../../docs/plan/_handoff/VAULT/protocols.md)
- [_handoff/VAULT/governor-prompts/](../../docs/plan/_handoff/VAULT/governor-prompts/)
- [tools/bootstrap.ps1](../../tools/bootstrap.ps1)
- [pillar-6-operations-and-delivery/build-order.md](../../docs/plan/pillar-6-operations-and-delivery/build-order.md)
- [docs/adr/0024-deployment-platform-vercel-cloudflare-hybrid.md](../../docs/adr/0024-deployment-platform-vercel-cloudflare-hybrid.md)

### REALITY_GROUNDING

- [behavioral-contracts.md § B_VALIDATE_BEFORE_ASSUME](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [behavioral-contracts.md § B_RZF](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [tools/verify.mjs](../../tools/verify.mjs) — orchestrator
- [tools/validators/](../../tools/validators/) — 4 validator scripts active
- [_handoff/VAULT/pe-history.jsonl](../../docs/plan/_handoff/VAULT/pe-history.jsonl) — PE fire history audit trail

## Populator script

See L3_INSTANCES_GVRN.md §"Populator script".

**Registry signature:** S006-AI-l3-instances-oper-2026-05-04T20:30:00Z
