---
id: csps.intake.contexts.intake
name: external-input-context-intake
description: The intake plane intake fan-out destination (recursive — content ABOUT the intake architecture itself). 3 leaf sub-folders for the intake's own docs. SLA tier P1 (changes here affect every other context's processing).
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
  - { rel: intake, href: ../../README.md }
domain_path: platform
---

# Context: Intake (the recursive case)

## Leaf sub-folders (lazy-created)

| Leaf | Maps to | Inheritable tags |
|---|---|---|
| `external-inputs-plan/` | [_intake/external-inputs-plan.md](../../external-inputs-plan.md) | `domain:governance`, `audience:developer`, `audience:ai-agent` |
| `manual-protocol/` | [_intake/manual-protocol.md](../../manual-protocol.md) | `domain:governance`, `audience:ai-agent` |
| `source-types/` | [_intake/source-types.md](../../source-types.md) | `domain:governance`, `audience:developer` |

## Routing rules

Content here is **recursive**: content ABOUT the intake plane itself. Examples: a user feedback note saying "the manual protocol step 5 is unclear about X"; an industry best-practice for ingestion gateways that should update the architecture; a near-miss where an upload was almost forgotten (which would itself be a P-META-005 violation).

## SLA tier

**P1 default** (4h triage SLA, 30d fix). Changes to the intake plane affect every other context's processing — same-class as governance.
