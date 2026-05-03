---
id: csps.adr.0021-validation-pass-per-principle-category-coverage
title: ADR-0021 — Validation passes run per-principle-category coverage (Operating / Architecture / Meta)
status: accepted
date: 2026-05-02
deciders: group:finky
tags: [domain:governance, type:explanation, audience:developer, audience:ai-agent, maturity:stable]
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/_handoff/VAULT/validation-pass-S002.md }
---

# ADR-0021 — Per-principle-category validation coverage

## Context and problem statement

S002 §3.2 quality-perspective validation revealed: free-form "does this respect every principle" is incomplete. The 27 architecture principles are not individually checked; coverage is implicit. Future validation passes should explicitly cover each principle category.

## Considered options

| Option | Pro | Con |
|---|---|---|
| Free-form quality assessment | Flexible | Implicit coverage; gaps invisible |
| **Per-category coverage table** (Operating / Architecture / Meta) | Explicit gaps surfaced | Slightly more work |
| Per-principle-individual coverage (35+ principles) | Maximum rigor | Excessive per session |

## Decision outcome

**Chosen:** validation passes include a per-category table:
- **Operating principles** (P-OP-001 through 004) — checked via 4-row table
- **Architecture principles** (P-ARCH-001 through 027) — checked via category-of-principle table (8 architecture sub-categories from architecture-principles.md)
- **Meta principles** (P-META-001 through 005) — checked via 5-row table

Each row: principle name + status (yes / partial / no) + evidence-link or limit-statement.

**Reasoning:** S002 §3.2 quality-perspective surfaced this — the table format makes coverage gaps explicit. Per-category (not per-principle individual) is the right granularity — exhaustive per-principle would be 35+ rows per validation pass; per-category is 17 rows max.

## Consequences

- `_handoff/VAULT/validation-pass-S<NNN>.md` template includes the per-category table.
- Audit `validation-pass-per-category-coverage` (planned week 4) verifies presence.
- Architecture principle audit can defer to per-sub-category granularity (8 sub-categories) rather than per-principle (27 individuals).

## Enforcement

- `protocols.md` §13 closing-checklist
- `_handoff/VAULT/validation-pass-S<NNN>.md` template

## Sources

- `_handoff/VAULT/validation-pass-S002.md` (S002 §3.2 origin)
- `pillar-0/architecture-principles.md` 8 sub-categories grouping
