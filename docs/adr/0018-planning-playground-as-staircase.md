---
id: csps.adr.0018-planning-playground-as-staircase
title: ADR-0018 — Planning playground as the staircase (proposed → ratified → migrated → enforced)
status: accepted
date: 2026-05-02
deciders: group:finky
tags: [domain:planning, type:explanation, audience:developer, audience:ai-agent, maturity:stable]
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/pillar-0-governance/planning-playground.md }
  - { rel: registry, href: ../../packages/principles/principles.yaml }
---

# ADR-0018 — Planning playground as the staircase

## Context and problem statement

CSPS plans evolve via AI-assisted iteration. Without an explicit staircase from "loose proposal" to "ratified canonical artifact", proposals either become orphan-drafts forever OR get prematurely cemented as canonical without sufficient review.

## Considered options

| Option | Pro | Con |
|---|---|---|
| Proposals always go straight to canonical | Fast | No staging; mistakes are costly |
| All proposals stay drafts indefinitely | Safe | Nothing ever ratifies; planning becomes the project |
| **Staircase: proposed → ratified → migrated → enforced** with bikeshedding-cap (max 5 revisions, flag stale 14 days) | Explicit progression + anti-fossilization | Staircase complexity |

## Decision outcome

**Chosen:** staircase with 4 stages:
1. **proposed** — loose draft; max 5 revisions; stale at 14 days
2. **ratified** — accepted; gets ADR; lifecycle_state: active
3. **migrated** — substantive content moved into canonical leaf docs
4. **enforced** — rule-registry entry + audit checks + mechanical surfaces

Bikeshedding-cap audits prevent eternal drafts. Each stage transition triggers stewardship review (per P-META-004).

**Reasoning:** the planning playground IS the architecture for "how the architecture evolves." Without it, planning is ad-hoc + drift accumulates. The staircase makes every proposal traceable from idea to enforced rule.

## Consequences

- Every proposal carries `lifecycle_state` per P-META-004 stewardship.
- The planning-playground itself is an audited slice (per P-ARCH-015 self-hosting).
- `pnpm stewardship:review` skill surfaces stale proposed docs.
- ADR auto-trigger fires when a proposed doc is ratified or when K=2 recurrence within 90 days (per P-META-005).

## Enforcement

- `pillar-0/planning-playground.md`
- `principles.yaml#P-META-004` (stewardship) + `#P-META-005` (learning loop)
- Audit `stale-pending-review` + `stale-pending-protocol`

## Sources

- [pillar-0/planning-playground.md](../plan/pillar-0-governance/planning-playground.md)
- Spec-driven development patterns (industry convergence 2024-2025)
- "Bikeshedding cap" pattern (cited in S001 insights)
