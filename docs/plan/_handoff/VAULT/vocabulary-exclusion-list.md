---
id: csps.vault.vocabulary-exclusion-list
name: vocabulary-exclusion-list
description: "Terms that MUST NOT appear in CSPS files. Any of these appearing in CSPS documents signals vocabulary contamination from external systems."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S039
ratified_at: 2026-05-17
ratified_by: yariv
links:
  - { rel: parent, href: ../../pillar-0-governance/external-knowledge-registry.md }
  - { rel: composes-with, href: ../../pillar-0-governance/frontmatter-closed-enums.md }
---

# CSPS Vocabulary Exclusion List

**Purpose:** Any term from this list appearing in CSPS files = vocabulary contamination. Replace immediately with the CSPS canonical term.

**Source:** Derived from external knowledge absorption sessions. Updated when new external systems are processed.

## Batch 1 — From [Temp name!!!] Project (S039)

| FORBIDDEN TERM | WHY FORBIDDEN | USE INSTEAD |
|---|---|---|
| Avatar | Conflicts with CSPS `archetype` (5 specific types in L1-vocabulary.md) | `archetype` |
| VOC Bank / Voice of Customer Bank | CSPS has EXT-KNOW vault for evidence capture | `EXT-KNOW vault` + `type: user-language` |
| Pain Map | Too informal; CSPS tracks this in PI items | `ux_impact.friction_description:` in PI-NNN |
| Wedge Hypothesis | Marketing framing; CSPS uses intent crystallization | `crystallized intent` + PI item |
| GTM Map | CSPS platforms don't "go to market" — they graduate apps | `graduation criteria` |
| Experiment Log | CSPS tracks this via PI item status machine | `PI-NNN status: idea→ratified→done` |
| Decision Register | CSPS uses ADR (Architecture Decision Record) | `ADR-NNNN` |
| Phase-gate | CSPS uses milestone gate | `milestone gate` |
| Control Panel | Implies UI; CSPS has session state | `platform-state-snapshot.md` |
| Sub-file | INTENTCORE uses loosely; CSPS term has specific mini-tree meaning | `sub_files:` in mini-tree frontmatter ONLY |
| Routing Logic | Document routing; CSPS uses spine classification | `core_spine: GVRN/ARCH/AI/OPER/VALD` |
| Live Related Links | Section name; CSPS uses frontmatter | `links:` frontmatter with rel: types |
| Knowledge Vault | Generic; CSPS has specific vault paths | `docs/plan/_handoff/VAULT/` |
| Content Atomizer | Marketing-specific | *(not applicable to CSPS)* |
| Field Radio | Domain-specific (construction) | *(not applicable to CSPS core)* |
| INTENTCORE | Temp product name — not a CSPS concept | `[Temp name!!!]` until real name chosen |
| Intercore / TalktoI | Temp names | `[Temp name!!!]` |
| Foreign Market Brain | Their AI framing | `EKEP` (External Knowledge Exchange Protocol) |
| Wedge | Business strategy shorthand | `domain hypothesis` or `intent crystallization output` |
| Personas | Marketing term | `archetype` (CSPS has 5 specific archetypes) |
| Feature Request | Product management term | `PI item` (plan item) |
| Sprint | Agile term | `Sonnet session` |
| Backlog | Agile term | `OPEN items register` |
| Ticket | Issue tracker term | `PI item` |
| Story | Agile term | `PI item plan_summary` |
| User Story | Agile term | `PI item + done_criterion` |
| Task | Too generic | `PI item` (for planned work) |

## Enforcement

The vocabulary-canon skill checks for these terms. If found in CSPS files:
1. Replace with the canonical CSPS term
2. Add to EP-ERR registry if it's a recurring contamination pattern
3. Verify with vocabulary-canon skill before writing any principle, contract, or plan

*Last updated: 2026-05-17 | Next update: when new external system is absorbed*
