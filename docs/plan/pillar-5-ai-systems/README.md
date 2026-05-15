---
id: csps.plan.pillar.ai-systems
name: pillar-5-ai-systems
description: Persona schema + composition, persona bundles + memory, agent runtime (Mastra), starter personas + bundles, crisis escalation, MCP integration.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:ai
  - type:doc
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - security
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

# Pillar 5 — AI Systems

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this pillar covers

The full AI surface of CSPS: persona schema, persona composition function (layered system-prompt assembly), persona bundles, persona memory (hybrid model — User.preferences + PersonaMemory), persona evals (drift / style / domain accuracy), the Mastra agent runtime (one parameterized agent serves all personas via Dynamic Agents pattern), the 8 starter personas + 5 starter bundles, the crisis escalation slice (load-bearing for v1).

The skill ingestion + sandboxed governance lives in [pillar 3](../pillar-3-platform-services/sandboxed-skill-governance.md) (Platform Services) since it's the platform's responsibility; this pillar covers the AI side of consumption.

## Industry framework alignment

There is **no canonical industry "AI Systems" pillar yet** — the field is too new. Closest convergent terms:
- "Agent Platform" (CrewAI, Mastra, LangGraph use this)
- "AI Infrastructure" (CIO/New Stack 2025–2026 emerging convention)
- OpenTelemetry GenAI semantic conventions stabilizing observability surface
- Linux Foundation's Agentic AI Foundation (Dec 2025) is the emerging standards body

This pillar's name may be renamed in 2027 if/when industry consensus hardens. For now, "AI Systems" is the safest bet.

## Why this pillar exists

Personas are first-class entities in CSPS — they get full CRUD, full audit, full slice contract scoring. The schema captures what an Anthropic-Skills-style + CCv3-character-card-style persona needs (slug, domain, voice, system prompt, postHistoryInstructions, traits, knowledge, allowedTools, tier, visibility, evals, extensions).

The composition function is the single source of truth for how personas talk: layered assembly (PLATFORM_CONSTITUTION → DOMAIN_OVERLAYS → traits → renderPersonaBlock → systemPrompt → GUARDRAIL_BUNDLES → postHistoryInstructions). Without this, persona behavior would be inconsistent across surfaces.

One Mastra agent (`personaChatAgent`) serves all personas via `runtimeContext.get("personaId")` — operationally clean. We do not run 75 Mastra agent instances.

## Leaf documents in this pillar

| Document | Status | Source (v1.3) |
|---|---|---|
| [persona-composition.md](persona-composition.md) | 🟢 migrated S003 v1.0 | §12 |
| [crisis-escalation.md](crisis-escalation.md) | 🟢 migrated S003 v1.0 | §13 |
| [mastra-setup.md](mastra-setup.md) | 🟢 migrated S003 v1.0 | §16 |

## Cross-cutting concerns this pillar addresses

- **Security** — risk-class-based guardrail bundles per persona; crisis-escalation slice every persona inherits; OWASP Agentic Skills Top 10 alignment
- **Reliability** — persona drift evals run nightly on production personas; postHistoryInstructions reinjection fights drift
- **Observability** — every persona turn writes to audit; tool-call ledger captured per session; OTel GenAI semantic conventions
- **AI-native** — personas + agents + Mastra are the AI consumption surface; MCP resources expose catalog for retrieval

## Reuse-first reminder

Before authoring a new persona:
- Search the existing 8 starter personas + community persona library
- Could the new persona be a variant of an existing one (different traits, different domain overlay)?
- New persona requires `created-new-because:` justification AND eval baseline established before promotion to PUBLISHED

Before adding a new domain overlay or trait library entry:
- Search `libs/personas/libraries.ts` for near-matches
- Domain overlays should be enhanced, not duplicated
- Traits compose; a new trait should NOT replicate what an existing trait + persona-specific systemPrompt achieves

## Critical decisions locked

- **Persona is orthogonal to agent** (not a subtype). One parameterized Mastra agent + N personas via composition.
- **Hybrid memory model.** User.preferences (Json) holds shared facts; PersonaMemory holds per-persona conversational summaries. Not Replika (shared) or Character.AI (per-character) — both halves.
- **Crisis escalation is a first-class slice every persona inherits.** Not a per-persona feature. Pre-LLM input filter + escalation paths + output validator + CrisisEvent rows.
- **Domain-specific guardrail bundles per `RiskClass`.** Spiritual = highest risk per research ("Spiralism" cult phenomenon documented in Rolling Stone).
