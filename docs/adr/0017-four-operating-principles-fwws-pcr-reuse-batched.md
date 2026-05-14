---
id: csps.adr.0017-four-operating-principles-fwws-pcr-reuse-batched
title: ADR-0017 — Four operating principles (FWWS / PCR / Reuse-first / Batched-execution)
status: accepted
date: 2026-05-02
deciders: group:finky
tags: [domain:governance, type:explanation, audience:developer, audience:ai-agent, maturity:stable]
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/pillar-0-governance/operating-principles.md }
  - { rel: registry, href: ../../packages/principles/principles.yaml }
---

# ADR-0017 — Four operating principles

## Context and problem statement

CSPS is built collaboratively by a solo developer + multiple AI assistants across hundreds of sessions. The cognitive-load asymmetry (humans can't hold many details; AI can but defaults to over-asking) requires explicit operating principles that govern human-AI collaboration patterns.

## Considered options

| Option | Pro | Con |
|---|---|---|
| Single "be helpful" principle | Simple | Vague; un-enforceable; AI defaults override |
| 10+ granular operating rules | Comprehensive | Cognitive overload; principle-fatigue |
| **4 cognitive-load-aware operating principles** (Reuse-first, FWWS, PCR, Batched-execution) | Maps to Sweller's CLT load types; manageable count; enforceable | Requires discipline to apply |

## Decision outcome

**Chosen:** 5 operating principles, each with full enforcer map (10 / 8 / 4 / 4 enforcers respectively):

1. **P-OP-001 Reuse-first** — Check what exists. Enhance the ratified thing. Create new only with justification.
2. **P-OP-002 FWWS** — Finish What We Started. Resist drift to new work while in-flight work incomplete.
3. **P-OP-003 PCR** — Present decisions as Pros / Cons / Recommendation.
4. **P-OP-004 Batched execution** — N similar operations: agree acceptance criteria upfront, batch execute, single completion summary. No mechanical micro-stops.

**Mapping to Sweller's Cognitive Load Theory:**
- FWWS protects germane load
- PCR chunks intrinsic load
- Batched-execution eliminates extraneous load
- Reuse-first cuts across all three

**Reasoning:** 4 is manageable + enforceable. Each principle has industry lineage (DRY / Kanban / MADR / Mission Command). Cognitive Load Theory provides the unifying framework.

## Consequences

- Every AI session applies all 4 principles always.
- AGENTS.md states each as cardinal principle (1-4).
- Skills `/reuse-check`, `/wip-check`, `/pcr`, `/batched-plan` operationalize each.
- `principles.yaml#P-OP-001` through `#P-OP-004` carry full enforcer maps.

## Enforcement

- 26 total enforcers across the 4 principles
- 10 / 8 / 4 / 4 distribution
- AGENTS.md + skills + hooks + frontmatter contracts + PR bots + CI checks + audit metrics + MCP resources

## Sources

- [pillar-0/operating-principles.md](../plan/pillar-0-governance/operating-principles.md)
- John Sweller — Cognitive Load Theory (1988)
- David J. Anderson — Kanban Method (FWWS lineage)
- Andy Hunt + Dave Thomas — Pragmatic Programmer (Reuse-first / DRY)
- MADR + BLUF (PCR lineage)
- Mission Command / Auftragstaktik (Batched-execution lineage)
