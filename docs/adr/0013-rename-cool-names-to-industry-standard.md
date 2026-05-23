---
id: csps.adr.0013-rename-cool-names-to-industry-standard
title: ADR-0013 — Rename "cool names" to industry-standard vocabulary
status: accepted
date: 2026-05-02
deciders: group:finky
tags: [domain:architecture, type:explanation, audience:developer, audience:ai-agent, maturity:stable]
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/pillar-1-architecture-and-stack/vocabulary.md }
  - { rel: registry, href: ../../packages/principles/principles.yaml }
context_question: "Before relying on this decision: has the constraint that drove it changed? If platform needs have shifted, this ADR may need reassessment."
---

# ADR-0013 — Rename invented terms to industry-standard vocabulary

## Context and problem statement

S001's v1.3 plan accumulated CSPS-specific coinages ("manifested-slice", "Conductor", "Trunk element", "App pack", "Eval Worker", "Capability bundle", etc.) that other AI systems (Cursor, Codex, Antigravity, Gemini CLI) wouldn't recognize. Vocabulary friction across AI ecosystems compounds — coined terms force every AI agent to re-learn CSPS-specific meanings.

## Considered options

| Option | Pro | Con |
|---|---|---|
| Keep coined terms — preserve "personality" | Distinct identity | Cross-AI friction; documentation tax |
| Rename ALL terms to industry equivalents | Maximum AI-cross-platform recognition | Loses some preserved metaphor |
| **Audit + selective rename** to industry-standard where direct equivalent exists; keep coinage where genuinely novel | Best of both | Requires ongoing audit |

## Decision outcome

**Chosen:** audit + selective rename. 8 v1.5 renames applied:
- `manifested-slice` → `module-folder` (industry: Bit components / Nx libs pattern)
- `Conductor` → `Orchestrator` (industry: workflow orchestrator pattern)
- `Trunk element` → `Shared kernel` (DDD term)
- `App pack` → `Feature pack` (industry: bundled feature flags)
- `Eval Worker` → `Sandbox runner` (Cloudflare Workers convention)
- `Capability bundle` → `Permission set` (industry: RBAC permission set)
- (3 others per pillar-1/vocabulary.md)

Origin codename "Cambium" preserved as architectural metaphor only (planning playground); not as runtime term.

**Reasoning:** convergence with industry vocabulary maximizes AI-cross-platform recognition. The audit pattern catches future drift.

## Consequences

- Glossary codegen pipeline (P-ARCH-019) regenerates Vale dict + ESLint rules from glossary changes.
- New CSPS-specific term proposals require ADR justifying why no industry equivalent fits.
- Vale prose linter + ESLint id-denylist enforce no relapse to old names.

## Enforcement

- `principles.yaml#P-ARCH-016` (universal-terms-first) + `P-ARCH-019` (glossary-owns-vocabulary)
- `audit-runner.md#vale-prose` + `#eslint-naming` + `#glossary-codegen-fresh`
- PR bot `check-glossary-additions.ts` requires justification for new coinages

## Sources

- [pillar-1/vocabulary.md](../plan/pillar-1-architecture-and-stack/vocabulary.md)
- [Anthropic Skills naming conventions](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [agents.md cross-vendor standard](https://agents.md/)
