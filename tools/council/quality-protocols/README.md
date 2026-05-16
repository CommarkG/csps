---
id: csps.council.quality-protocols.index
name: quality-protocols-index
description: "Mini-tree: quality protocol specs for OPUS-2, Sonnet, and shared rules. Consolidated from communication-protocol-shared.md and session experience."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S038
mini_tree_root: true
sub_files:
  - ./shared-rules.md
  - ./opus-quality-spec.md
  - ./sonnet-quality-spec.md
links:
  - { rel: canonical-source, href: ../communication-protocol-shared.md }
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:ai-agent
  - maturity:stable
scope_level: S1
---

# Quality Protocols — OPUS-2, Sonnet, Shared

This mini-tree consolidates all quality requirements for the 3-party collaboration (OPUS-2 / Sonnet / Governor). Each spec file is actor-specific; shared-rules.md is the canonical source for communication rules.

| File | Audience | Content |
|---|---|---|
| [shared-rules.md](./shared-rules.md) | Both | Rules 1-9 from communication-protocol-shared.md |
| [opus-quality-spec.md](./opus-quality-spec.md) | OPUS-2 | Pre-directive RZF, persona chain, enforcement trio, turn format |
| [sonnet-quality-spec.md](./sonnet-quality-spec.md) | Sonnet | INTENT ABSORBED, wiring completeness, genuine Cycle 2, identity handshake |

*Canonical source for rules: [communication-protocol-shared.md](../communication-protocol-shared.md)*
*Spec for OPUS-2: [opus-quality-spec.md](./opus-quality-spec.md)*
*Spec for Sonnet: [sonnet-quality-spec.md](./sonnet-quality-spec.md)*
