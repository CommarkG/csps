---
id: csps.governance.ai-default.D4-pattern-match
name: D4-pattern-match
default_id: D4
default_name: pattern-match
description: "Training default: recognize generic patterns from training data and apply them. In CSPS: generic solutions without CSPS-specific precedent check. Overridden by vocabulary-canon + M-17 reuse-first."
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

# D4 — Pattern-Match (generic-from-training override)

## Training Default

"I've seen patterns like this before in training. Apply the known pattern. The generic solution works. Platform-specific vocabulary would require extra checking — the generic vocabulary is faster."

## CSPS Resistance Pattern

This default drives naming-novelty (D8) and structure-novelty: inventing new acronyms, frameworks, and terminology when CSPS already has ratified equivalents. When faced with "how should we route inputs?", D4 fires: "use a routing engine / CIE / dispatcher pattern" — drawing from training data generic solutions rather than checking if M-16 (Threshold), M-42 (Unified Threshold-Router), or B_CONSOLIDATION_PASS already addresses this.

S066 instance: Sonnet used "Consolidated Input Engine (CIE)" as the working name for what became M-42. CIE is a generic training-data pattern ("centralized input engine" is a common software term). The CSPS precedent was "Threshold" (M-16 moat). Opus caught the D4 drift and renamed to "Threshold-Router" per D8 override — extending existing terminology, not inventing.

## CSPS Context Override

**vocabulary-canon skill**: "no invention without precedent check in CSPS glossary first." Triggers on any new noun introduced in a proposal.

**M-17 reuse-first (mechanical)**: "P-OP-001 reuse-first applied recursively through platform-inventory-scan.mjs" — check all 11 registries before introducing new terminology.

**feedback_no_invention_without_precedent**: "search (a) existing CSPS, (b) user's prior platforms (CSP carry-forwards), (c) industry research IN THAT ORDER before introducing any new format/name/structure."

## Enforcement Trio

- **T1:** `.claude/hooks/pre-tool-use-skill-aap-required.sh` — fires when vocabulary-canon skill should be invoked before new terminology introduction
- **T2:** `tools/validators/validate-no-invention-without-precedent.mjs` (planned) — flags new nouns in proposals without prior vocabulary-canon invocation
- **T3:** vocabulary-canon mandatory trigger — M-42 INVOKE:vocabulary-canon route fires on proposal-class inputs with novel terminology signals

## Satisfaction Point to Avoid

❌ "I'll use a 'routing engine' pattern here" — generic training-data pattern, no CSPS precedent check
✅ `vocabulary-canon` skill invoked → "CSPS precedent: M-16 Threshold (moat) + threshold-intake-log.yaml. Extending: 'Threshold-Router' per D8 override." — platform-specific pattern

## Inaugural Instance (S067 canonical — D4+D8 combined failure)

S067 STEP 3 pre-build: initial working name "CIE (Consolidated Input Engine)". PROTO-S067 draft used "Unified Input Classification Engine". Opus redirected to "Threshold-Router" and "Unified Threshold-Router" (M-42) — extending M-16 Threshold terminology. The D4 fire was "apply the generic dispatcher pattern from training"; the D8 fire was "coin a new acronym (CIE)." Both overridden by: M-17 reuse-first → check what CSPS already calls this → extend that name.
