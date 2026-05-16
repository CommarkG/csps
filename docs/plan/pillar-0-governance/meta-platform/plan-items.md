---
id: csps.governance.meta-platform.plan-items
name: plan-items
description: "PI-NNN schema reference — how changes are tracked from idea to done. Status machine, wiring checklist, persona chain. Examples: PI-001 through PI-004."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S037
depth_level: 2
impl_status: swift-implemented
links:
  - { rel: parent, href: ./README.md }
  - { rel: examples, href: ../../../_handoff/VAULT/plan-items/ }
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
scope_level: S1
---

# Plan Items (PI-NNN)

Every implementation change in CSPS that touches `libs/` or `apps/` requires a ratified PI item. PIs are the unit of implementation governance — they link decisions to commits.

## Status Machine

```
idea → assessed → scheduled → ratified → implementing → done
         ↑                        ↑
    PE score set           Governor sets ratified_at
```

No file in `libs/` or `apps/` may be created without a PI in `ratified` or later status.

## Schema (canonical fields)

```yaml
id: PI-NNN
status: ratified | implementing | done
ratified_at: "YYYY-MM-DD"
ratified_by: yariv
pe_score: 0-100
spi_estimate: 0.0-1.0
urgency: critical | high | normal | low
impact: platform-wide | multi-app | single-app
wiring_checklist: []      # DONE = all checked
questions: []             # status: answered before implementing
persona_chain_log: []     # 6 personas: consolidation/balance/domain/ux/critic/synergy
```

## Tooling

- `pnpm create:pi --title "..." --spine ARCH --pe 75` — creates new PI file
- `tools/validators/validate-implementation-gate.mjs` — advisory: commits touching libs/apps need PI-NNN in message
- `tools/validators/validate-pi-questions-answered.mjs` — blocks implementing with unanswered questions
- `tools/validators/validate-persona-chain-complete.mjs` — checks 6-persona chain for implementing PIs

## Examples

| PI | Title | Status | Commit |
|---|---|---|---|
| [PI-001](../../../_handoff/VAULT/plan-items/PI-001-threshold-onboarding-wizard-wiring.yaml) | OnboardingWizard wiring | ratified | — |
| [PI-002](../../../_handoff/VAULT/plan-items/PI-002-meta-pi-schema-infrastructure.yaml) | PI schema + create-pi.mjs | done | 40f931f |
| [PI-003](../../../_handoff/VAULT/plan-items/PI-003-meta-pig-validator.yaml) | Implementation Gate validator | done | 40f931f |
| [PI-004](../../../_handoff/VAULT/plan-items/PI-004-pe-agent-skill.yaml) | PE Agent skill | ratified | — |

*Source: OPUS-2 Turn 59 PI schema | Turn 62 PI status machine | S037-D*
