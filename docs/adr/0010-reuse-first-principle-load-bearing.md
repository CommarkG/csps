---
id: csps.adr.0010-reuse-first-principle-load-bearing
title: ADR-0010 — Reuse-first as load-bearing operating principle (P-OP-001)
status: accepted
date: 2026-05-02
deciders: group:finky
consulted: solo-dev (Finky)
informed: future-CSPS-developers, AI-assistants
tags:
  - domain:governance
  - type:explanation
  - audience:developer
  - audience:ai-agent
  - maturity:stable
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/pillar-0-governance/reuse-first-principle.md }
  - { rel: registry, href: ../../packages/principles/principles.yaml }
context_question: "Before relying on this decision: has the constraint that drove it changed? If platform needs have shifted, this ADR may need reassessment."
---

# ADR-0010 — Reuse-first as cardinal principle

## Context and problem statement

A solo developer maintaining 30–75 SaaS apps cannot afford parallel implementations of the same concern. AI assistants (Claude / Cursor / Codex) default to *creating new* artifacts when asked to "add X" — not searching for an existing X to enhance. Without a load-bearing principle that's mechanically enforced, the codebase accumulates duplicates by inertia.

The user surfaced this directly:

> "ALWAYS check what exists must be engraved all over and prefer enhancing ratified existing things over local fixes with fast creation of new things. Make sure it appears multiple times in the plan."

## Considered options

| Option | Pro | Con |
|---|---|---|
| Documentation-only "be careful about duplicates" | Easy | Reliably ignored; AI defaults override it |
| Reuse-first principle with 1–2 enforcers | Some teeth | Still bypassable; one layer = brittle |
| **Reuse-first as cardinal principle with 10 enforcers (defense-in-depth)** | Survives any single layer's failure | Most upfront tooling cost |

## Decision outcome

**Chosen:** Reuse-first is P-OP-001, severity `critical`, with **10 mechanical enforcers** across layers:

1. AGENTS.md (cardinal principle #1)
2. `/reuse-check` skill
3. AI prompt addendum
4. PreToolUse hook (Write/Edit triggers catalog grep)
5. Frontmatter contract (`enhances:` or `created-new-because:` required)
6. PR bot (Danger.js — "Existing thing considered" PR field)
7. CI check (jscpd duplicate detection)
8. Audit metric (reuse-rate displayed, not gated per Goodhart)
9. MCP resource (queryable by any agent)
10. MCP tool (callable by any agent)

**Counterweight clause:** *Enhance the ratified thing — UNLESS the ratified thing is the wrong abstraction (Sandi Metz). Inline-and-redecide is always available.*

**Reasoning:** This is the only principle the user repeated multiple times in a single session. The 10-enforcer count is unusual but justified — without all of them, AI defaults erode the principle within sessions.

## Consequences

- Every artifact creation in CSPS goes through reuse-check first.
- The `enhances:` frontmatter field is a hard contract; CI fails if neither `enhances:` nor `created-new-because:` is present.
- The reuse-rate metric is displayed in the audit dashboard but NOT gated (Goodhart's Law — gating creates incentive to pad `enhances:` references).
- Generators (`nx g platform:slice`, `nx g platform:page`, etc.) all run catalog-first search before scaffolding.

## Enforcement

- `principles.yaml#P-OP-001` (severity: critical; 10 enforcers, 7 non-AI)
- `audit-runner.md#duplicate-detection` (jscpd)
- `audit-runner.md#frontmatter-completeness` (enhances/created-new-because)
- `pillar-0/reuse-first-principle.md` (canonical doc + engraving locations)

## Open questions

- See OQ-RF-001 (extraction-readiness vs reuse conflict) — answer: distinguish `packages/*` (extractable) from `libs/*/internal/**` (inline-at-extraction).
- See OQ-RF-002 (Goodhart on reuse rate) — mitigation: don't gate; sample-audit quarterly; track trend not absolute.
- See OQ-RF-003 (solo-dev Conway risk) — slice boundaries should reflect bounded contexts the user actually maintains in their head.
- See OQ-RF-004 (counterweight visibility) — quote it as often as the main principle.

## Sources / references

- [pillar-0/reuse-first-principle.md](../plan/pillar-0-governance/reuse-first-principle.md)
- Sandi Metz — [The Wrong Abstraction](https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction)
- Andy Hunt + Dave Thomas — *The Pragmatic Programmer* (DRY)
- Kent C. Dodds — [AHA Programming](https://kentcdodds.com/blog/aha-programming)
