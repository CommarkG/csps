---
id: csps.core-spines.l3-instances-ai
name: L3_INSTANCES_AI
description: Instance registry for the AI Core Spine. Auto-populated by tools/scripts/instance-registry-populator.mjs scanning corpus for `core_spine: AI` declarations (script implementation deferred week-4).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
amendment_protocol: per-session edit (no formal amendment)
template_used: l3-instances-doctrine
template_status: novel-pending-pattern-evaluation
core_spine: AI
schema_anchor: core_spines_l3_instances
parent_l1_doctrine: ./L1_CORE_AI.md
tags:
  - domain:ai
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
session: S006
---

# L3_INSTANCES_AI

Instance registry for the AI Core Spine.

## Instances by L2 domain

### ALIGNMENT_PROTOCOL

- [pillar-0-governance/agent-alignment-protocol.md](../../docs/plan/pillar-0-governance/agent-alignment-protocol.md) — AAP 9-check spec + per-class table
- [behavioral-contracts.md § B_AGENT_ALIGNMENT_PROTOCOL](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- packages/skills/*/SKILL.md (7 active skills with AAP frontmatter — pcr / wip-check / reuse-check / audit-self / batched-plan + 2 stubs)
- [docs/adr/0008-mastra-baseagent-singular-runtime.md](../../docs/adr/0008-mastra-baseagent-singular-runtime.md)

### COGNITIVE_CONTEXT

- [pillar-0-governance/cognitive-context-architecture.md](../../docs/plan/pillar-0-governance/cognitive-context-architecture.md) — 5-layer + 4 QGs spec
- [behavioral-contracts.md § B_COGNITIVE_CONTEXT_DISCIPLINE](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [packages/principles/principles.yaml#P-META-009](../../packages/principles/principles.yaml)

### INNER_DEFAULTS_OVERRIDE

- [_handoff/VAULT/inner-ai-defaults/](../../docs/plan/_handoff/VAULT/inner-ai-defaults/) — README + 5 category files + continuous-drift-log
- [behavioral-contracts.md § B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS](../../docs/plan/pillar-0-governance/behavioral-contracts.md)
- [behavioral-contracts.md § B_PE_ALIGNMENT_GUARDIAN](../../docs/plan/pillar-0-governance/behavioral-contracts.md) — anti-sycophancy gate
- [tools/templates/priority-engine.schema.yaml §7](../../tools/templates/priority-engine.schema.yaml) — PE_ALIGNMENT_GUARDIAN spec
- [behavioral-contracts.md § B_AI_PROFESSIONAL_VOICE](../../docs/plan/pillar-0-governance/behavioral-contracts.md) — top-expert-colleague voice

## Populator script

See L3_INSTANCES_GVRN.md §"Populator script".

**Registry signature:** S006-AI-l3-instances-ai-2026-05-04T20:30:00Z
