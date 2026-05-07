---
id: csps.platform-audit.service.vocabulary
name: service-vocabulary
description: >
  Domain card for the Vocabulary platform service. Cross-cutting element that serves
  all 5 spines. Vocabulary governs the platform's language — every term used in
  governance artifacts must be defined in the canon before use. Language is governance.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: platform_audit
enforcement_stage: active
template_used: domain-card
template_version: "1.0"
tags:
  - domain:governance
  - domain:platform
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
session: S018
links:
  - { rel: parent, href: ../README.md }
  - { rel: implementation, href: ../../../../plan/pillar-1-architecture-and-stack/vocabulary.md }
  - { rel: naming-policy, href: ../../../../plan/pillar-0-governance/frontmatter-closed-enums.md }
  - { rel: closed-enums, href: ../../../../plan/pillar-0-governance/frontmatter-closed-enums.md }
consolidation_cross_refs:
  - docs/plan/pillar-1-architecture-and-stack/vocabulary.md
  - docs/plan/pillar-0-governance/frontmatter-closed-enums.md
  - tools/validators/validate-frontmatter.mjs
---

# Vocabulary — Platform Service

## §1 Identity

**What I am:** The language discipline of CSPS. Every term used in governance artifacts has a canonical definition, a canonical home, and a concept_ref. No term is invented mid-session without checking the canon first.

**Service type:** Cross-cutting — serves all 5 spines. The GVRN spine mandates the vocabulary discipline; but every spine uses it.

**My sub-parts:**
- Naming Policy (4 rules governing artifact names)
- Frontmatter Closed Enums (canonical value sets for schema fields)
- Governance Meta-Vocabulary (Threshold, GRACE, mini-trees, CDAB, etc.)
- Domain Vocabulary (per-spine term ownership)
- MCP Vocabulary Surface (queryable definitions on demand)

---

## §2 The Problem I Solve

**Without Vocabulary:** AI invents new names for existing concepts. Two developers use different terms for the same thing. Governance documents use "done" in 3 different senses. Terms like "session" mean different things in different contexts (governance S<NNN> vs HTTP session). Conflicts arise not from different intentions but from different vocabulary.

**The compounding failure:** In a 30-app platform with AI collaboration across 50+ sessions, undefined vocabulary creates a Tower of Babel. By session 10, each AI instance has invented its own meta-language.

---

## §3 My Principles

**Foundation principles:**
- `P-ARCH-029` — Naming Policy: 4 rules (always-current / per-session / per-topic / layer-prefixed)
- `B_NAMING_POLICY` — naming rules mechanically enforced via behavioral contract
- `B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK` — search canon before inventing any new term

---

## §4 How I Work

**Depth 1:** The naming policy has 4 rules. Frontmatter closed enums enforce vocabulary at the schema level. Before any new term enters the platform, B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK fires: search existing CSPS, search user's prior platforms, search industry research — in that order.

**Depth 2:** `validate-frontmatter.mjs` enforces closed enums at PR time. Any `lifecycle`, `lifecycle_state`, `domain`, `type`, `tier`, `audience`, `maturity`, or `enforcement_stage` value not in the canon = validator fails. The `vocabulary-term-schema-valid` audit (week-4) extends this to vocabulary.md entries themselves.

**Depth 3:** `frontmatter-closed-enums.md` is the cognitive-layer pre-write reference. `validate-frontmatter.mjs` is the runtime enforcement. `MEMORY.md` is the session-level vocabulary cache. New terms proposed in session → memory → vocabulary.md → validator update (atomic).

---

## §5 Blast Radiuses

- **BR1:** Adding one term to vocabulary.md — affects artifacts that reference that term
- **BR2:** Changing a closed-enum value — affects every artifact using that enum
- **BR3:** Changing the naming policy or closed-enum schema structure — affects every governed artifact across all 30 apps

---

## §6 Vocabulary

**Terms I own:**
- `IMPL_BATCH` — a coherent implementation unit ending in a commit-worthy event
- `task arc` — a coherent sequence of related work sharing the same context and goal
- `mini-tree` — intro+index file + N sub-files (the split pattern for complex domains)
- `cache warmth` — the 5-minute window after last interaction where the prompt cache is still active
- `enforcement_stage` — stub | planned | week-4 | active (the governance lifecycle for enforcement surfaces)
- `domain card` — a self-describing schema artifact answering all 20 context questions for a platform element

**Pending registration (platform-core-alignment L1 mandate):**
- `Threshold` — governance entry point for every session and every input
- `positive harvesting` — CEC cycle for positive discoveries
- `negative harvesting` — catch-to-engraving cycle for failures

---

## §7 MCP Surface

```
get_vocabulary_entry("term")        → definition + concept_ref + canonical_home
get_closed_enum("field-name")       → valid values for that frontmatter field
check_term_exists("term")           → does this term exist in canon?
find_vocabulary_by_spine("ARCH")    → terms owned by that spine
```

---

## §8 Current State & Evolution

**Active:** naming-policy (4 rules) + frontmatter closed enums (8 dimensions) + enforce_stage closed enum (S018)

**Planned (platform-core-alignment L1):**
- `vocabulary-canon-completeness` validator (P11 pipeline, week-4)
- `vocabulary-term-schema-valid` validator (PR-blocking, week-4)
- Registration of 6 governance meta-terms (Threshold, GRACE, CDAB, mini-trees, positive/negative harvesting)
- `domain card` as a canonical schema_anchor value

---

## §9 Connection Map

| Connected to | How |
|---|---|
| All spines | Every spine uses vocabulary; naming policy applies everywhere |
| GVRN | GVRN enforces the vocabulary discipline via B_NAMING_POLICY |
| AI | AI behavior governed by B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK |
| VALD | Frontmatter closed enums enforced by validate-frontmatter.mjs |
| QC/Audits | vocabulary-canon-completeness audit in P11 pipeline |
