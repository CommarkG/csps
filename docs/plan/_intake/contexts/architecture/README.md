---
id: csps.intake.contexts.architecture
name: external-input-context-architecture
description: Pillar 1 (Architecture & Stack) intake fan-out destination. 9 leaf sub-folders mirror the architecture leaf docs. SLA tier P2 default.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
links:
  - { rel: parent, href: ../README.md }
  - { rel: pillar, href: ../../pillar-1-architecture-and-stack/README.md }
---

# Context: Architecture & Stack (Pillar 1)

## Leaf sub-folders (lazy-created on first use)

| Leaf | Maps to | Inheritable tags |
|---|---|---|
| `complexity-contract/` | [pillar-1/complexity-contract.md](../../pillar-1-architecture-and-stack/complexity-contract.md) | `domain:architecture`, `audience:developer` |
| `frontmatter-standard/` | [pillar-1/frontmatter-standard.md](../../pillar-1-architecture-and-stack/frontmatter-standard.md) | `domain:architecture`, `audience:developer`, `audience:ai-agent` |
| `module-folder-pattern/` | [pillar-1/module-folder-pattern.md](../../pillar-1-architecture-and-stack/module-folder-pattern.md) | `domain:architecture`, `audience:developer` |
| `naming-protocol/` | [pillar-1/naming-protocol.md](../../pillar-1-architecture-and-stack/naming-protocol.md) | `domain:architecture`, `audience:developer` |
| `repo-layout/` | [pillar-1/repo-layout.md](../../pillar-1-architecture-and-stack/repo-layout.md) | `domain:architecture`, `audience:developer` |
| `slice-contract/` | [pillar-1/slice-contract.md](../../pillar-1-architecture-and-stack/slice-contract.md) | `domain:architecture`, `audience:developer` |
| `tech-stack/` | [pillar-1/tech-stack.md](../../pillar-1-architecture-and-stack/tech-stack.md) | `domain:architecture`, `crosscutting:cost`, `audience:developer` |
| `vocabulary/` | [pillar-1/vocabulary.md](../../pillar-1-architecture-and-stack/vocabulary.md) | `domain:architecture`, `audience:developer`, `audience:ai-agent` |
| `vocabulary-as-code/` | [pillar-1/vocabulary-as-code.md](../../pillar-1-architecture-and-stack/vocabulary-as-code.md) | `domain:architecture`, `audience:developer` |

## Routing rules

Content lands here when concerning: vocabulary + naming, frontmatter schema, the slice contract (16 checks ≥90% to merge), the complexity contract (LOC/cognitive-complexity ratchets), the module-folder pattern, repo layout, the tech stack itself, or vocabulary-as-code (the glossary codegen pipeline).

## SLA tier

**P2 default** (24h triage SLA, 90d fix). Tech-stack changes that lock major decisions are P1 (require ADR coordination).
