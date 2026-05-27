---
id: csps.governance.ai-default.D8-naming-novelty
name: D8-naming-novelty
default_id: D8
default_name: naming-novelty
description: "Training default: coin new terms creatively; memorable names signal insight. In CSPS: invent CIE instead of extending Threshold-Router. Overridden by vocabulary-canon + no-invention-without-precedent."
ratified_session: S067
inherits_from: "P-META-029 + B_HUMBLE_CONSOLIDATION_DISCIPLINE"
core_spine: AI
schema_anchor: inner-ai-defaults
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
links:
  - rel: principle
    href: ../../../principles/P-META-029-humble-consolidation-discipline.md
  - rel: contract
    href: ../../pillar-0-governance/behavioral-contracts/B_HUMBLE_CONSOLIDATION_DISCIPLINE.md
---

# D8 — Naming-Novelty (creative-coinage override)

## Training Default

"Memorable names signal insight and novelty. A new concept deserves a new name. Acronyms and branded names make the AI's contribution feel unique and authoritative. CIE is more memorable than 'threshold extension.'"

## CSPS Resistance Pattern

This default drives vocabulary fragmentation. Every session where a new pattern is identified, D8 fires: coin a new term. The result across 67 sessions: overlapping terminology, unmergeable concepts, and the proliferation that P-META-029 was designed to stop. When Sonnet invents "CIE" instead of extending "Threshold-Router", future Sonnet instances don't recognize the connection between them.

S067 instance: PROTO-S067 draft 1 called the routing mechanism "Consolidated Input Engine (CIE)" — a novel name. Opus redirected to "Threshold-Router" per M-16 (Threshold) precedent. Item 3 in the ratification explicitly chose "Threshold-Router" over "CIE" as the canonical name. D8 fired at draft-1; the override was explicit vocabulary-canon application.

## CSPS Context Override

**vocabulary-canon**: "no invention without precedent check in CSPS glossary first." The check sequence: (1) CSPS glossary, (2) existing moat names, (3) industry-standard terms.

**feedback_no_invention_without_precedent**: "S002 turn 7 — invented EXT-ID format, schema-gap registry, dashboard route list without check."

**D8 override rule**: when a new concept is identified, the correct naming action is: check what CSPS already calls this → extend that name → only invent if genuinely novel with no precedent.

## Enforcement Trio

- **T1:** `.claude/hooks/pre-tool-use-frontmatter-enum-check.sh` — fires on Write to yaml/md with new enum-like values not in vocabulary-canon
- **T2:** `tools/validators/validate-no-invention-without-precedent.mjs` (planned) — flags new noun introductions in proposals without vocabulary-canon invocation
- **T3:** vocabulary-canon mandatory trigger — session-open injection: "D8 override: extend existing CSPS terminology; do not coin new terms"

## Satisfaction Point to Avoid

❌ "I'll call this the 'Consolidated Input Engine (CIE)' — that captures the concept well." — D8 firing: novel name, no precedent check
✅ `vocabulary-canon` invoked → "CSPS precedent: M-16 'Threshold' moat + threshold-intake-log. Extending to 'Threshold-Router'. Not inventing CIE." — extends existing vocabulary

## Inaugural Instance (S067 — Item 3 explicit override)

PROTO-S067 STEP 3 initial working name: "Consolidated Input Engine (CIE)" / "Unified Input Classification Engine (UICE)". Opus ratification Item 3: "explicitly chose 'Threshold-Router' over 'CIE'" per M-16 Threshold precedent. The D8 override moment: Governor + Opus agreed that extending existing CSPS vocabulary ("Threshold") was architecturally superior to coining "CIE" — even though CIE was more descriptive in isolation. The platform's internal coherence outweighs per-concept descriptiveness.
