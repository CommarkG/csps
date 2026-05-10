---
id: csps.intake.contexts.ai-systems
name: external-input-context-ai-systems
description: Pillar 5 (AI Systems) intake fan-out destination. 3 leaf sub-folders planned. SLA tier P1 default for crisis-eligible content; P2 otherwise.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:ai
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
links:
  - { rel: parent, href: ../README.md }
  - { rel: pillar, href: ../../pillar-5-ai-systems/README.md }
domain_path: platform
---

# Context: AI Systems (Pillar 5)

## Leaf sub-folders (lazy-created; leaves planned for S003 §3.5)

| Leaf | Maps to (planned) | Inheritable tags |
|---|---|---|
| `crisis-escalation/` | pillar-5/crisis-escalation.md (🟡 to migrate) | `domain:crisis`, `domain:ai`, `crosscutting:reliability`, `audience:end-user`, `audience:developer` |
| `mastra-setup/` | pillar-5/mastra-setup.md (🟡 to migrate) | `domain:ai`, `audience:developer` |
| `persona-composition/` | pillar-5/persona-composition.md (🟡 to migrate) | `domain:persona`, `domain:ai`, `audience:developer`, `audience:end-user` |

## Routing rules

Persona schema + composition function (PLATFORM_CONSTITUTION → DOMAIN_OVERLAYS → traits → renderPersonaBlock → persona.systemPrompt → GUARDRAIL_BUNDLES → postHistoryInstructions assembly order), persona memory (User.preferences + per-persona PersonaMemory hybrid), persona evals, Mastra runtime (one parameterized agent for N personas), crisis detection + escalation paths + output validator + CrisisEvent flow, starter personas + bundles.

## SLA tier

**P1 default for crisis-related content** (1h triage SLA — load-bearing for v1 per ADR-0006).
**P2 otherwise** (24h triage SLA).
