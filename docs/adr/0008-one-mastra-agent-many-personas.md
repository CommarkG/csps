---
id: csps.adr.0008-one-mastra-agent-many-personas
title: ADR-0008 — One parameterized Mastra agent, N personas via composition
status: accepted
date: 2026-05-02
deciders: group:finky
consulted: solo-dev (Finky)
informed: future-CSPS-developers, persona-authors
tags:
  - domain:ai-systems
  - type:explanation
  - audience:developer
  - audience:ai-agent
  - maturity:stable
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/pillar-5-ai-systems/persona-composition.md }
  - { rel: registry, href: ../../packages/principles/principles.yaml }
---

# ADR-0008 — One agent runtime, many personas

## Context and problem statement

CSPS hosts dozens of customer-facing AI personas (different domains, different tones, different domain knowledge). The naive choice is one Mastra `Agent` subclass per persona — but that means N agents to maintain, N test suites, N separate inheritance chains, and N integration points with Mastra's runtime.

The orthogonal choice: one parameterized agent runtime + N persona configurations loaded dynamically.

## Considered options

| Option | Pro | Con |
|---|---|---|
| One Mastra `Agent` subclass per persona | Easy to reason about per persona | N × maintenance tax; inheritance hell |
| One parameterized agent + persona-as-config (Mastra Dynamic Agents pattern) | Single runtime; persona = composition | Requires the compose function to be load-bearing |
| Hybrid: shared base class + thin persona subclasses | Some inheritance reuse | Still N subclasses; the worst of both |

## Decision outcome

**Chosen:** One Mastra agent (`personaChatAgent`) + `loadPersona(id)` parameterization. Per Mastra's Dynamic Agents pattern, `personaChatAgent` accepts a `persona` config; the compose function (`libs/personas/compose.ts`) assembles the system prompt from layered components.

The compose function's order is fixed: `PLATFORM_CONSTITUTION → DOMAIN_OVERLAYS → traits → renderPersonaBlock → persona.systemPrompt → GUARDRAIL_BUNDLES → postHistoryInstructions`.

**Reasoning:** Persona is orthogonal to agent; one is configuration, the other is runtime. Conflating them costs N× maintenance. The Mastra Dynamic Agents pattern is the canonical industry-validated way to express this orthogonality.

## Consequences

- Persona slices declare `agent: personaChatAgent` in frontmatter (validated; never their own agent).
- The `mastra-agent-count` audit asserts exactly one `personaChatAgent` instance exists.
- Adding a "different persona" never adds a new Mastra agent — only a new persona config.
- The compose function is the single source of truth for system-prompt assembly; modifying it affects every persona simultaneously (which is the point — platform-wide changes propagate).

## Enforcement

- `principles.yaml#P-ARCH-012` (severity: error; ≥3 enforcers)
- `principles.yaml#P-ARCH-013` (universal-traits-trunk-domain-overlays; defines the compose order)
- `audit-runner.md#mastra-agent-count`
- PR bot: `tools/danger/check-new-mastra-agent.ts` rejects new agent classes for "different personas"

## Open questions

- For non-conversational AI surfaces (e.g., a coding assistant agent), do they share `personaChatAgent` or get their own? Tentative: separate agents for fundamentally-different runtimes (chat vs code vs research); persona-orthogonality applies WITHIN a runtime.

## Sources / references

- [pillar-5/persona-composition.md](../plan/pillar-5-ai-systems/persona-composition.md) (pending S002 §3.5 migration)
- [Mastra Agent reference](https://mastra.ai/reference/agents/agent)
- [Mastra Dynamic Agents](https://mastra.ai/docs/agents/overview)
