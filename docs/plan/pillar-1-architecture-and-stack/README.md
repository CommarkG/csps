---
id: csps.plan.pillar.architecture-and-stack
name: pillar-1-architecture-and-stack
description: Tech stack choices, repo layout, naming protocol, vocabulary, frontmatter standard, slice contract, complexity contract, module-folder pattern. The "what we build with" pillar.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:architecture
  - type:doc
  - audience:developer
  - maturity:stable
crosscutting:
  - reliability
  - performance
  - observability
links:
  - { rel: parent, href: ../README.md }
  - { rel: principle, href: ../pillar-0-governance/reuse-first-principle.md }
domain_path: platform
core_spine: ARCH
schema_anchor: pillar_0_governance_leaves
scope_level: S1
---

# Pillar 1 — Architecture & Stack

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this pillar covers

Tech stack choices, repo layout, naming protocol, the locked vocabulary, the frontmatter standard, vocabulary-as-code pipeline, the slice contract, the complexity contract, the module-folder pattern (formerly "manifested slice").

This is the "what we build with and how we organize it" pillar. C4 Context + Container abstraction levels live here; component and code-level details live in their respective topical pillars.

## Industry framework alignment

- **arc42 §1+§2+§3+§4** — Introduction & Goals, Constraints, Context & Scope, Solution Strategy
- **C4 Model** Context + Container levels
- **AWS WAF "Operational Excellence"** (the parts about consistent tech choices and tooling)

## Why this pillar exists

Without locked tech-stack and repo-layout choices, every new app re-decides them — inconsistency drives drift. Without locked vocabulary and naming, identical concepts get different names across the codebase and search breaks. Without the slice / complexity / module-folder contracts, files and modules grow until they're unmaintainable.

This pillar locks the choices that should be uniform across the entire platform. Every other pillar inherits from these.

## Leaf documents in this pillar

| Document | Status | Source (v1.3) |
|---|---|---|
| [vocabulary.md](vocabulary.md) | 🟢 v1.6 | §0 (with v1.5 vocabulary renames applied) |
| [vocabulary-as-code.md](vocabulary-as-code.md) | 🟢 v1.6 | §0.5 |
| [frontmatter-standard.md](frontmatter-standard.md) | 🟢 v1.6 | §0.7 |
| [tech-stack.md](tech-stack.md) | 🟢 v1.6 | §2 |
| [repo-layout.md](repo-layout.md) | 🟢 v1.6 | §3 |
| [naming-protocol.md](naming-protocol.md) | 🟢 v1.6 | §4 |
| [slice-contract.md](slice-contract.md) | 🟢 v1.6 | §5 |
| [complexity-contract.md](complexity-contract.md) | 🟢 v1.6 | §5.5 |
| [module-folder-pattern.md](module-folder-pattern.md) | 🟢 v1.6 (renamed from "manifested slice") | §5.6 |

## Cross-cutting concerns this pillar addresses

- **Reliability** — locked stack + repo layout reduce variance; variance is where bugs hide
- **Performance** — naming + complexity contracts prevent the slowest cause of perf debt (incomprehensible code)
- **Observability** — frontmatter standard + vocabulary-as-code make every artifact AI-discoverable

## Reuse-first reminder

Before adding a new entry to vocabulary, naming protocol, or any contract: search the existing tree (`grep -ri`) for near-matches. Enhance the ratified thing. The vocabulary-as-code pipeline auto-detects synonyms-not-in-glossary and flags them at PR time.

## Migration plan

The v1.3 content for each leaf document still lives in archived `MASTER_PLAN_v1.3.md` (post-migration). Each leaf is migrated independently, with frontmatter added, the reuse-first principle reminder placed in the preamble, and any naming changes (e.g., "manifested slice" → "module-folder pattern") applied during migration.
