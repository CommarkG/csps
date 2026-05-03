---
id: csps.adr.0016-mechanical-enforcement-architecture
title: ADR-0016 — Mechanical enforcement architecture (principles.yaml as single source of truth → multi-layer codegen)
status: accepted
date: 2026-05-02
deciders: group:finky
tags: [domain:governance, type:explanation, audience:developer, audience:ai-agent, maturity:stable]
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/pillar-0-governance/mechanical-enforcement.md }
  - { rel: registry, href: ../../packages/principles/principles.yaml }
---

# ADR-0016 — Mechanical enforcement architecture

## Context and problem statement

Principles that depend on session memory die at session end. Principles enforced at only one layer fail when that layer fails. CSPS needs principles to survive: vendor switches (Claude → Cursor → Codex), session loss, agent delegation, and human bypass attempts.

## Considered options

| Option | Pro | Con |
|---|---|---|
| Single-layer enforcement (e.g., AGENTS.md only) | Simplest | Brittle; fails when AI ignores |
| **Multi-layer defense in depth** (AGENTS.md + skills + hooks + lint + CI + MCP, all generated from `principles.yaml`) | Survives any single layer's failure | Most upfront tooling investment |
| Manual per-principle enforcement design | Tailored | Drift between principle and enforcement |

## Decision outcome

**Chosen:** multi-layer defense in depth with `principles.yaml` as single source of truth. Codegen pipeline emits AGENTS.md + Vale dict + ESLint rules + hook stubs + skill stubs + MCP resources + audit checks. CI fails on drift.

**Severity → minimum-enforcers** schema:
- `critical`: ≥4 enforcers, ≥2 non-AI
- `error`: ≥3 enforcers, ≥1 non-AI
- `warn`: ≥2 enforcers
- `info`: ≥1 enforcer

The AI layer (instruction-file, skill, ai-prompt-addendum) is treated as the LEAST reliable.

**Reasoning:** the only architecture that survives the user's stated test ("does it survive me being absent?"). CSP autonomy-audit (treasure #1) validates the 5-element pattern (schema + validator + hook + memory + contract).

## Consequences

- `principles.yaml` is THE source; every other artifact is derived.
- Codegen-fresh CI check fails build on any drift.
- New principles added via principles.yaml → regenerate → commit both → CI checks pass.
- 47 audit checks across 11 categories enforce the principles + meta-principles.

## Enforcement

- `pillar-0/mechanical-enforcement.md` + `pillar-0/ai-behavior-spine.md`
- `principles.yaml#P-META-001` (the meta-audit that audits the audits)
- `audit-runner.md#principle-coverage` + `#enforcer-orphans` + `#principles-codegen-fresh`

## Sources

- [pillar-0/mechanical-enforcement.md](../plan/pillar-0-governance/mechanical-enforcement.md)
- [Backstage Tech Insights](https://github.com/backstage/community-plugins/blob/main/workspaces/tech-insights/plugins/tech-insights/README.md)
- CSP carry-forward: `AI_BEHAVIOR_AUTONOMY_AUDIT` 5-element engraving pattern (treasure #1, EXT-20260502-002)
