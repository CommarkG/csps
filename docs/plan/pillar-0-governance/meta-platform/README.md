---
id: csps.governance.meta-platform.index
name: meta-platform-index
description: "Meta-platform layer: the governance that governs the platform. 6 elements — Knowledge Engine, PI Items, PE Agent, Implementation Gate, App Pipeline, Threshold Gate."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S037
depth_level: 2
mini_tree_root: true
sub_files:
  - ./knowledge-engine.md
  - ./plan-items.md
  - ./pe-agent.md
  - ./implementation-gate.md
  - ./app-pipeline.md
  - ./threshold-gate.md
  - ./persona-matrix.md
impl_status: swift-implemented
links:
  - { rel: parent, href: ../README.md }
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
scope_level: S1
---

# Meta-Platform — The Governance That Governs Itself

The meta-platform layer is the set of mechanisms by which CSPS governs its OWN growth — how new capabilities are proposed, assessed, scheduled, built, and verified before they can affect the platform.

Without it: governance debt accumulates silently, AI acts on unverified plans, quality is aspirational.
With it: every change has a ratified PI item, a PE score, an implementation gate, and verified wiring.

## The 6 Meta-Platform Elements

| Element | What it does | File |
|---|---|---|
| **Knowledge Engine** | How external research enters the platform DNA | [knowledge-engine.md](./knowledge-engine.md) |
| **Plan Items (PI)** | How changes are tracked from idea → done | [plan-items.md](./plan-items.md) |
| **PE Agent** | How priority is computed and bundles are proposed | [pe-agent.md](./pe-agent.md) |
| **Implementation Gate (PIG)** | How commits are verified against ratified PIs | [implementation-gate.md](./implementation-gate.md) |
| **App Pipeline** | How an app concept becomes a deployed product | [app-pipeline.md](./app-pipeline.md) |
| **Threshold Gate** | How new users are onboarded through the platform | [threshold-gate.md](./threshold-gate.md) |

The persona matrix ([persona-matrix.md](./persona-matrix.md)) maps which cognitive skill governs which element.

## Why this layer exists

Every platform that grows without meta-platform governance eventually collapses under its own complexity:
- Changes are made without tracking (no PI items)
- Priority is intuition-based (no PE scoring)
- Quality is aspirational (no implementation gate)
- External research is lost (no knowledge engine)

CSPS avoids this by making the governance of governance explicit, mechanical, and auditable.

*OPUS-2 Turn 82 | S037-D | 2026-05-16*
