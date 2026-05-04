---
id: csps.intake.contexts.governance
name: external-input-context-governance
description: Pillar 0 (Governance) intake fan-out destination. Sub-folders mirror the 10 governance leaf docs. Receives extractions about principles, audits, ADRs, stewardship, learning-loop, mechanical-enforcement, planning-playground, reuse-first, rule-registry, operating-principles. Inheritable tags applied per-leaf. SLA tier: governance work is meta-load-bearing → P1 default (4h triage SLA).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
links:
  - { rel: parent, href: ../README.md }
  - { rel: pillar, href: ../../pillar-0-governance/README.md }
---

# Context: Governance (Pillar 0)

## Leaf sub-folders (lazy-created on first use)

| Leaf | Maps to | Inheritable tags |
|---|---|---|
| `architecture-principles/` | [pillar-0/architecture-principles.md](../../pillar-0-governance/architecture-principles.md) | `domain:governance`, `domain:architecture`, `audience:developer` |
| `audit-runner/` | [pillar-0/audit-runner.md](../../pillar-0-governance/audit-runner.md) | `domain:governance`, `domain:audit`, `audience:developer`, `audience:admin` |
| `adr-process/` | [pillar-0/adr-process.md](../../pillar-0-governance/adr-process.md) | `domain:governance`, `audience:developer` |
| `learning-loop/` | [pillar-0/learning-loop.md](../../pillar-0-governance/learning-loop.md) | `domain:governance`, `crosscutting:ai-native`, `audience:developer`, `audience:ai-agent` |
| `mechanical-enforcement/` | [pillar-0/mechanical-enforcement.md](../../pillar-0-governance/mechanical-enforcement.md) | `domain:governance`, `crosscutting:reliability`, `audience:developer` |
| `operating-principles/` | [pillar-0/operating-principles.md](../../pillar-0-governance/operating-principles.md) | `domain:governance`, `audience:developer`, `audience:ai-agent` |
| `planning-playground/` | [pillar-0/planning-playground.md](../../pillar-0-governance/planning-playground.md) | `domain:governance`, `domain:planning`, `audience:developer` |
| `reuse-first-principle/` | [pillar-0/reuse-first-principle.md](../../pillar-0-governance/reuse-first-principle.md) | `domain:governance`, `audience:developer`, `audience:ai-agent` |
| `rule-registry/` | [pillar-0/rule-registry.md](../../pillar-0-governance/rule-registry.md) | `domain:governance`, `audience:developer` |
| `stewardship-protocol/` | [pillar-0/stewardship-protocol.md](../../pillar-0-governance/stewardship-protocol.md) | `domain:governance`, `audience:developer`, `audience:ai-agent` |

## Routing rules

Content lands here when the input concerns: principles (any), the ADR archive, the rule registry, audit-runner checks, fitness functions, the planning playground itself, mechanical-enforcement architecture, the operating principles, the meta-principles (defense-in-depth, principles-travel, inheritance, stewardship, learning-loop, zero-findings-discipline, five-surface-engraving), or any cross-pillar governance-class concern.

## SLA tier

**P1 default** (4h triage SLA, 30d fix). Governance is meta-load-bearing — gaps here ripple across every operational pillar. The stewardship-protocol and learning-loop leaves are P0 (1h triage) when the input identifies a structural gap in the meta-principles themselves.

## Cross-cutting flag

Content that ripples across ≥3 governance leaves OR spans governance + another pillar goes to `../cross-cutting/` with stubs in each leaf.
