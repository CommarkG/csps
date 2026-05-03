---
id: csps.adr.0014-adopt-madr-for-adr-format
title: ADR-0014 — Adopt MADR (Markdown Architectural Decision Records) format
status: accepted
date: 2026-05-02
deciders: group:finky
tags: [domain:governance, type:explanation, audience:developer, maturity:stable]
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/pillar-0-governance/adr-process.md }
  - { rel: registry, href: ../../packages/principles/principles.yaml }
---

# ADR-0014 — MADR template for all ADRs

## Context and problem statement

Architecture decisions need a durable, machine-greppable, human-readable format. Without a standard template, ADRs vary in shape and become hard to audit for completeness.

## Considered options

| Option | Pro | Con |
|---|---|---|
| Free-form markdown | Maximum flexibility | No completeness audit possible |
| Nygard's original ADR format (2011) | Simplest | Missing fields modern teams use (alternatives, consequences) |
| **MADR (Markdown ADR)** v3.0 | Industry-converged on; rich enough; tool support (adr-tools, log4brains) | Slightly more verbose than Nygard |
| Custom CSPS format | Tailored to CSPS | Reinvents wheel; vocabulary friction |

## Decision outcome

**Chosen:** MADR v3.0 with required sections: Context + Considered Options + Pros/Cons + Decision Outcome + Consequences + Enforcement (CSPS-specific) + Sources.

**Reasoning:** industry convergence at adr.github.io. Tool support (Log4brains generator). Cross-platform recognition. The Enforcement section is CSPS-specific extension binding ADRs to rule-registry per P-META-001.

## Consequences

- Every ADR follows this template (all 21 in this session use it).
- ADR validator `validate-adr-numbering.mjs` enforces sequential numbering + format.
- Mastra agent tool `proposeAdr({ title, decision, options, justification })` automates chat → ADR workflow.
- Log4brains static-site generator (month 2) publishes ADR tree as browsable knowledge base.

## Enforcement

- `pillar-0/adr-process.md` template + audit
- PR bot enforces required sections on every ADR PR
- Naming protocol: `docs/adr/NNNN-<slug>.md`

## Sources

- [MADR template](https://adr.github.io/madr/)
- [adr.github.io](https://adr.github.io/)
- [Michael Nygard — Documenting Architecture Decisions (2011)](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [Log4brains](https://github.com/thomvaill/log4brains)
