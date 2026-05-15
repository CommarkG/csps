---
id: csps.plan.pillar.developer-experience
name: pillar-4-developer-experience
description: Generators (Nx + Hygen), the skill ingestion contract, catalog-first generator UX, AI prompt addendum, the bootstrap script. The "how we build" pillar.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:dx
  - type:doc
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - observability
  - ai-native
links:
  - { rel: parent, href: ../README.md }
  - { rel: principle, href: ../pillar-0-governance/reuse-first-principle.md }
domain_path: platform
core_spine: AI
schema_anchor: pillar_0_governance_leaves
scope_level: S1
---

# Pillar 4 — Developer Experience

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this pillar covers

The 10 generators (`platform:slice`, `platform:split`, `platform:page`, `platform:app`, `platform:agent`, `platform:skill`, `platform:persona`, `platform:wizard`, `platform:skill-import`, `platform:skill-promote`, `platform:skill-upgrade`), the skill ingestion contract (5-stage workflow for community skill adoption), the catalog-first generator UX (the killer enforcer of reuse-first), the AI prompt addendum, the bootstrap script.

This is the **golden-path** layer (Spotify/Backstage terminology). The easiest path to do something correctly IS the path through these generators.

## Industry framework alignment

- **Backstage "Software Templates"** — the canonical scaffolder pattern
- **Spotify "Golden Paths"** — Netflix calls them "Paved Roads"
- **CNCF "Application Development"** capability area
- **Team Topologies "Platform as a Product"** — DX is the platform's product surface

## Why this pillar exists

A solo developer cannot scaffold 30 apps × 16 slices × 5 layers (DB + admin + customer + tests + audit) by hand. Generators turn the slice contract into mechanical scaffolding; the developer reviews and approves; never authors from scratch.

Equally important: generators are where the **reuse-first principle is mechanically enforced**. `nx g platform:slice Booking` first searches the catalog and prints existing matches. The user must type `--new` to override (and provide a justification stored in `created-new-because:`). This is the killer enforcer — it's the single highest-leverage mechanism in the platform.

## Leaf documents in this pillar

| Document | Status | Source (v1.3) |
|---|---|---|
| [generators.md](generators.md) | 🟢 migrated S003 v1.0 | §10 |
| [skill-ingestion-contract.md](skill-ingestion-contract.md) | 🟢 migrated S003 v1.0 | §5.7 |
| [skills-package.md](skills-package.md) | 🟢 created S003 v1.0 | NEW v1.5 — the `packages/skills/` invokable AI skill set |
| [ai-behavior-instructions.md](ai-behavior-instructions.md) | 🟢 created S003 v1.0 | NEW v1.5 — `AGENTS.md` content spec + AI prompt addendum |

## The skills package (`packages/skills/`)

The invokable AI skills generated from `packages/principles/principles.yaml` (added v1.5). Each skill is an [Anthropic Agent Skill](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) folder (`SKILL.md` + supporting files) invocable via slash command and discoverable via the RAG router. **Skills are how operating principles become AI behaviors.**

| Skill | Purpose | Principle backed |
|---|---|---|
| `/pcr <topic>` | Produces canonical Pros/Cons/Recommendation 3-block output for decisions | P-OP-003 |
| `/wip-check` | Queries the in-flight ledger; reports threshold status | P-OP-002 (FWWS) |
| `/reuse-check <terms>` | Catalog similarity search; returns top-5 matches with scores | P-OP-001 (Reuse-first) |
| `/batched-plan` | Structures upfront-acceptance proposal for N≥3 similar operations | P-OP-004 (Batched execution) |
| `/audit-self` | Runs the meta-audit (audit-the-audits) on demand | P-META-001 |

Skills are **generated** from `principles.yaml` via `pnpm principles:codegen`. The skill's frontmatter description references the parent principle ID. **Cross-vendor:** the Anthropic Skills spec is open ([agentskills.io](https://agentskills.io/)), so skills work in Claude Code, Codex, and other adopters.

## Cross-cutting concerns this pillar addresses

- **Reliability** — generators produce consistent code; consistency reduces variance bugs
- **Observability** — every generator invocation logged to audit; reuse-rate metric computed
- **AI-native** — generators expose their args + matches as structured data; AI assistants invoke generators rather than writing files directly

## Reuse-first reminder

The generators are themselves subject to reuse-first. Before adding a new generator:
- Search `tools/generators/` for near-matches
- Could the new generator be an option flag on an existing generator? If yes, enhance the existing one.
- New generator requires ADR explaining why a flag won't suffice.

## The catalog-first generator UX (the killer enforcer)

```
$ nx g platform:slice Booking
Searching catalog for similar artifacts...

Top matches:
  1. csps.app-bookings.entity.reservation     (similarity: 0.87)
  2. csps.app-events.entity.appointment       (similarity: 0.71)
  3. csps.feature-pack.scheduling.session     (similarity: 0.62)

Enhance one of these? Or proceed with a new slice?
  [1-5] enhance match
  [n] new (requires --new flag + justification)
  [q] quit and search more
```

This UX appears in every `platform:*` generator. The AI prompt addendum (in `CLAUDE.md`) instructs Claude/Cursor: *"When proposing creation of any artifact, query the catalog and cite matches before scaffolding."*

## AI prompt addendum (engraved in workspace `CLAUDE.md`)

> **Before proposing creation of any artifact (slice, skill, agent, page, ZModel pattern, validator, prose), query the catalog (`packages/catalog/catalog.json`, exposed as MCP resources) for existing matches and cite the closest. If you propose new, justify why enhancement of the closest match is wrong. Generators (`nx g platform:*`) are the only sanctioned scaffolding path.**
