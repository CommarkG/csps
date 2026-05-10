---
id: csps.intake.contexts.developer-experience
name: external-input-context-developer-experience
description: Pillar 4 (Developer Experience) intake fan-out destination. 4 leaf sub-folders planned. SLA tier P2 default.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:dx
  - type:reference
  - audience:developer
  - maturity:stable
diataxis_type: reference
links:
  - { rel: parent, href: ../README.md }
  - { rel: pillar, href: ../../pillar-4-developer-experience/README.md }
domain_path: platform
---

# Context: Developer Experience (Pillar 4)

## Leaf sub-folders (lazy-created; leaves planned for S003 §3.5)

| Leaf | Maps to (planned) | Inheritable tags |
|---|---|---|
| `ai-behavior-instructions/` | pillar-4/ai-behavior-instructions.md (🟡 NEW) | `domain:dx`, `domain:ai`, `audience:developer`, `audience:ai-agent` |
| `generators/` | pillar-4/generators.md (🟡 to migrate) | `domain:dx`, `audience:developer` |
| `skill-ingestion-contract/` | pillar-4/skill-ingestion-contract.md (🟡 to migrate) | `domain:dx`, `domain:ai`, `crosscutting:security`, `audience:developer` |
| `skills-package/` | pillar-4/skills-package.md (🟡 NEW) | `domain:dx`, `domain:ai`, `audience:developer`, `audience:ai-agent` |

## Routing rules

The 10 generators (`platform:slice|page|app|agent|skill|persona|wizard|split|skill-import|skill-promote|skill-upgrade`), the skill ingestion 5-stage workflow, the AI prompt addendum, AGENTS.md content spec, the `packages/skills/` invokable skill set, catalog-first generator UX.

## SLA tier

**P2 default**. Skill-ingestion content is P1 (security implications match `sandboxed-skill-governance`).
