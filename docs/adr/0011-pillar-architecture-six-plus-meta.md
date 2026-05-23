---
id: csps.adr.0011-pillar-architecture-six-plus-meta
title: ADR-0011 — Pillar architecture (6 operational + 1 meta-governance pillar)
status: accepted
date: 2026-05-02
deciders: group:finky
consulted: solo-dev (Finky)
informed: future-CSPS-developers
tags:
  - domain:planning
  - type:explanation
  - audience:developer
  - audience:ai-agent
  - maturity:stable
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/README.md }
  - { rel: registry, href: ../../packages/principles/principles.yaml }
context_question: "Before relying on this decision: has the constraint that drove it changed? If platform needs have shifted, this ADR may need reassessment."
---

# ADR-0011 — Pillar architecture: 6 + 1 meta

## Context and problem statement

CSPS is a complex platform — multi-tenant SaaS foundry, AI runtime, platform services, developer experience, operations. Without an explicit pillar structure, leaf documents accumulate in a flat folder hierarchy, navigation degrades, AI retrieval drifts, and completeness audits become impossible.

The choice is HOW MANY pillars + HOW STRUCTURED.

## Considered options

| Option | Pro | Con |
|---|---|---|
| Flat structure (no pillars) | Simplest | Doesn't scale past ~30 docs; no navigation |
| 4 pillars (NIST CSF 2.0 alignment) | Industry-validated | Too compressed — "Architecture" pillar would conflate stack + data + DX |
| **6 operational + 1 meta-governance pillar** (CSPS) | Industry sweet spot 4–6 + Govern as meta | Naming convergence with NIST/AWS/Azure/Google requires care |
| 8+ pillars | Granular | Too granular; cross-pillar coupling becomes a maintenance burden |

## Decision outcome

**Chosen:** 6 operational pillars + 1 meta-pillar (Governance):

- **Pillar 0 — Governance** (meta) — principles, ADRs, rule registry, audit runner, planning playground. Aligns with NIST CSF 2.0 "Govern" (added Feb 2024 as a meta-function).
- **Pillar 1 — Architecture & Stack** — vocabulary, frontmatter, stack, repo layout, slice contract, complexity contract.
- **Pillar 2 — Data & Schema** — ZModel, schema-per-app, audit triggers, partitioning, RLS.
- **Pillar 3 — Platform Services** — Stripe + Clerk, templates, catalog, sandboxed skill governance.
- **Pillar 4 — Developer Experience** — generators, skill ingestion, AI prompt addendum.
- **Pillar 5 — AI Systems** — personas, Mastra runtime, crisis escalation.
- **Pillar 6 — Operations & Delivery** — build order, graduation, observability, dashboards.

Cross-cutting concerns (security, reliability, cost, performance, observability, multi-tenant, ai-native) are layered as frontmatter tags — not their own pillars.

**Reasoning:** Industry convergence on 4–6 pillars (NIST CSF 2.0, AWS WAF, Azure WAF, Google Cloud Framework). 8 was too many; 4 was too few. 6 + 1 meta lands at the sweet spot. Topical-primary structure (arc42 model) so navigation matches the writer's mental model; cross-cutting tags (WAF model) so completeness audits stay possible.

## Consequences

- Every leaf doc lives under `docs/plan/pillar-N-<name>/`.
- Pillar READMEs are mandatory; they list every leaf with status.
- Cross-cutting concerns are tagged in frontmatter, not folded into pillars.
- A completeness audit verifies every cross-cutting concern is addressed by at least one leaf doc per pillar.

## Enforcement

- File-system structure: `docs/plan/pillar-N-<name>/`
- `tools/validators/validate-frontmatter.mjs` — verifies leaf docs declare correct pillar via path matching variants
- Audit: completeness check verifies each pillar has its expected leaves

## Open questions

- When does a new pillar get added? Heuristic: when an entire pillar's worth of content (≥4 leaves, ≥1,000 lines) emerges and doesn't fit existing pillars. Requires ADR.

## Sources / references

- [pillar-0/README.md](../plan/pillar-0-governance/README.md)
- [NIST CSF 2.0](https://www.nist.gov/cyberframework)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [arc42 architecture documentation template](https://arc42.org/)
