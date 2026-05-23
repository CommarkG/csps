---
id: csps.adr.0009-hybrid-persona-memory
title: ADR-0009 — Hybrid persona memory (User.preferences + per-persona PersonaMemory)
status: accepted
date: 2026-05-02
deciders: group:finky
consulted: solo-dev (Finky)
informed: persona-authors, end-users
tags:
  - domain:ai
  - type:explanation
  - audience:developer
  - audience:end-user
  - audience:ai-agent
  - maturity:stable
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/pillar-5-ai-systems/persona-composition.md }
  - { rel: registry, href: ../../packages/principles/principles.yaml }
context_question: "Before relying on this decision: has the constraint that drove it changed? If platform needs have shifted, this ADR may need reassessment."
---

# ADR-0009 — Hybrid persona memory

## Context and problem statement

Personas need memory across sessions: user preferences, conversation history, learned facts, persona-specific knowledge. Storing memory entirely in `User` couples persona-specific data to the user record (every persona pollutes a shared blob). Storing memory entirely per-persona means user-level preferences (e.g., "use kilometers, not miles") leak across personas inconsistently.

## Considered options

| Option | Pro | Con |
|---|---|---|
| All memory in `User.preferences` | Single source for the user | Persona-specific facts pollute the shared record; no isolation |
| All memory in `PersonaMemory` per-persona | Clean isolation | User-level prefs duplicated per persona; inconsistent |
| **Hybrid: User.preferences for user-scoped + PersonaMemory for persona-scoped** | Right-sized per type of memory | Two stores to coordinate |

## Decision outcome

**Chosen:** Hybrid model:
- **`User.preferences`** (Json, on `public.User`): user-level preferences shared across all personas the user interacts with. Examples: language, units, timezone, accessibility flags, communication preferences.
- **`PersonaMemory`** (per-persona slice): persona-specific facts, conversation context, learned knowledge. Each persona has its own `PersonaMemory` slice with `tenant_id × user_id × persona_id` composite key.

The persona compose function reads BOTH stores at composition time and merges into the system prompt context block.

**Reasoning:** User-scoped preferences are user-scoped; persona-scoped facts are persona-scoped. Forcing either model to carry both is a category error.

## Consequences

- Privacy boundary: persona memory is per-persona; one persona doesn't see another's `PersonaMemory`. Default-deny via ZenStack `@@allow` policies.
- The `learn` tool (a persona-callable Mastra tool) writes to `PersonaMemory` only; user prefs are written via explicit user-facing UI.
- Cross-persona consistency is by design only via `User.preferences` — if a user updates their language preference, every persona uses the new value next session.
- The persona slice contract requires a `PersonaMemory` migration when introducing a new persona.

## Enforcement

- `principles.yaml#P-ARCH-013` (universal-traits-trunk-domain-overlays — the compose function reads both stores)
- ZenStack `@@allow` on `PersonaMemory`: `auth().id == this.user_id && this.persona_id == requestedPersonaId` (no cross-persona reads)
- Slice contract: persona slice declares `requires: ['PersonaMemory']`

## Open questions

- Memory retention policy per-tier (free: 30d; paid: 365d; enterprise: 7y) — should it apply to PersonaMemory uniformly or per-persona? Tentative: uniform per-tier; revisit if compliance domain (HIPAA personas) needs special handling.
- Should User.preferences itself be tier-gated for some keys (e.g., advanced personalization on Pro+)? Tentative: no — preferences are basic; tier-gate features that USE the preference, not the preference itself.

## Sources / references

- [pillar-5/persona-composition.md](../plan/pillar-5-ai-systems/persona-composition.md) (pending S002 §3.5 migration)
- [Mastra memory primitives](https://mastra.ai/docs/agents/memory)
