---
id: csps.adr.0028-three-axis-artifact-schema-model
title: ADR-0028 — Three-axis artifact schema model (universal base × spine routing × domain extension)
status: accepted
date: 2026-07-15
deciders: group:finky
session: S089
tags: [domain:governance, domain:architecture, type:explanation, audience:developer, audience:ai-agent, maturity:stable]
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: extends, href: ./0023-hybrid-frontmatter-schema-universal-core-plus-per-file-type.md }
  - { rel: governed-by, href: ../plan/pillar-0-governance/frontmatter-closed-enums.md }
  - { rel: base-scaffold, href: ../../tools/templates/governed-artifact-frontmatter.template.md }
  - { rel: pe-schema, href: ../../tools/templates/priority-engine.schema.yaml }
  - { rel: template-registry, href: ../plan/_handoff/VAULT/template-registry.md }
---

# ADR-0028 — Three-axis artifact schema model

**Date:** 2026-07-15
**Status:** ACCEPTED
**Deciders:** Governor + Sonnet (S089)
**Session:** S089

---

## Context

ADR-0023 decided the field-level hybrid schema (universal-required-core + per-file-type extensions).
It answered *which fields* every artifact carries. It left unnamed the architectural shape *above* field
level — the compositional structure that governs how all CSPS artifacts are organized, classified,
and extended.

S089 architectural review surfaced the question: "is it a T schema of system and domains?" The answer
revealed a 3-axis structure that was implicit in ADR-0023 + the governed-artifact-frontmatter template
but had never been named or formally recorded. Naming it is a load-bearing act: it gives AI agents and
human authors a stable mental model for understanding why fields exist, what drives template selection,
and how schema_anchor / core_spine compose.

---

## Decision

CSPS uses a **three-axis artifact schema model**. Every governed artifact sits at the intersection of
three orthogonal axes:

### Axis 1 — Universal base (the "system" layer)

Every governed artifact — regardless of type, domain, or spine — carries the same base scaffold:

```
id · name · description · version · owner
lifecycle · lifecycle_state
core_spine · schema_anchor
template_used · tags · diataxis_type · session · links
```

This is enforced universally by `validate-frontmatter.mjs` + `nothing-stands-alone-audit`.
It is the horizontal bar of the schema — cross-cutting, mandatory, the indexing minimum that
powers catalog search, governance scoring, and retrieval across all tools.

### Axis 2 — Spine routing (the classification dimension)

`core_spine:` routes each artifact to one of the five governance spines:

```
GVRN | ARCH | AI | VALD | OPER
```

Precedence: GVRN > VALD > ARCH > AI > OPER (per P-ARCH-028).

`core_spines: [...]` (plural) declares cross-cutting membership.

This axis is *orthogonal* to Axis 1 — every artifact has universal base fields AND a spine
classification. The spine determines: which L2 principle set governs the artifact, which council
member (Sonnet/Opus) has authority over it, and how PE scores it against competing work.

### Axis 3 — Domain extension (the "domain" layer)

`schema_anchor:` groups artifacts into named domain collections
(e.g., `pillar_0_governance_leaves`, `tools_templates_meta`, `vault_files`, `topic_plans`).

Template composition then adds domain-specific fields on top of the universal base:
- `gradual-build-plan` → adds `topic_id + depth_chosen + backtrack_register`
- `b-star-contract` → adds `counterweight + anti-patterns + 5-mechanical-surfaces`
- `skill` → adds `agent_class + acknowledged_contracts + trust_tier`
- `domain-card` → adds `platform_surface + integrations + validators`

The base is never replaced — only extended. Templates compose, they do not override.

---

## Why "cross" not "T"

The T schema metaphor (system horizontal bar + domain vertical stems) captures Axes 1 + 3.
It misses Axis 2 (spine routing), which is a second classification dimension cutting through
every artifact independently of which template it uses. An artifact is simultaneously:
- Universal (Axis 1) — it has base fields
- Spine-routed (Axis 2) — it belongs to GVRN or ARCH or AI etc.
- Domain-extended (Axis 3) — it uses a specific template adding domain fields

The correct shape is a **cross + spine-cut**, not a T. The Governor's intuition was directionally
correct; this ADR makes the third axis explicit.

---

## Interface

```yaml
# Axis 1 — universal base (every artifact)
id: csps.<area>.<slug>
lifecycle: experimental | beta | production | deprecated
lifecycle_state: active | pending-review | ...
core_spine: GVRN | ARCH | AI | VALD | OPER      # Axis 2 — spine routing
core_spines: [...]                               # Axis 2 — plural for cross-cutting
schema_anchor: <collection-name>                 # Axis 3 — domain grouping
template_used: <template-id>                     # Axis 3 — extension pointer
tags: [domain:<d>, type:<t>, audience:<a>, maturity:<m>]
# ... remaining universal fields ...
# Axis 3 extension fields follow (template-specific, declared by template_used)
```

---

## Consequences

**Positive:**
- AI agents have a named model: before authoring, ask "which spine? which collection? which template?" — three clear questions, not a field-by-field hunt
- Validators can enforce at the axis level: Axis 1 = `validate-frontmatter.mjs`, Axis 2 = `corespine-layer-compliance`, Axis 3 = `template-citation-on-creation`
- Extension is principled: adding a new domain type = register new schema_anchor + register new template; universal base is never touched
- ADR-0023 hybrid schema is now explained architecturally, not just field-by-field

**Negative / Constraints:**
- The four reference libraries (tag library / status library / vocabulary / template-registry) are all flat — no collapsing hierarchy exposes this 3-axis structure to navigating readers; this is the known gap not addressed by this ADR
- Third-party interop (MADR for ADRs, agentskills.io for SKILL.md) modifies Axis 3 extension behavior; governed by ADR-0023, not this ADR

**Mitigation:**
- The flat-library gap is parked as a potential enhancement (hierarchical reference index that collapses across all four libraries and maps each level to its axis)
- ADR-0023 remains the authority on per-file-type field exceptions; this ADR is the structural layer above it

---

## Alternatives Considered

| Option | Why not chosen |
|---|---|
| T schema (system + domains, 2 axes) | Accurate for Axes 1+3 but misses spine routing as an independent classification dimension — any AI agent using a T model would conflate GVRN artifacts with ARCH artifacts that use the same template |
| Flat schema (one layer, all optional) | No inheritance, no routing — already ruled out by ADR-0023 (universal-required-core is the load-bearing minimum) |
| Per-spine schemas (5 separate schemas) | Would break the universal base guarantee — an ARCH artifact and a GVRN artifact would have no shared indexing minimum, breaking catalog search and frontmatter validators |

---

## References

- [ADR-0023](./0023-hybrid-frontmatter-schema-universal-core-plus-per-file-type.md) — field-level hybrid schema decision (this ADR is the structural layer above it)
- [`governed-artifact-frontmatter.template.md`](../../tools/templates/governed-artifact-frontmatter.template.md) — the base scaffold (Axis 1 implementation)
- [`frontmatter-closed-enums.md`](../plan/pillar-0-governance/frontmatter-closed-enums.md) — closed enums for Axis 1 + 2 fields
- [`template-registry.md`](../plan/_handoff/VAULT/template-registry.md) — Axis 3 extension catalog
- P-ARCH-028 — spine precedence (GVRN > VALD > ARCH > AI > OPER)
