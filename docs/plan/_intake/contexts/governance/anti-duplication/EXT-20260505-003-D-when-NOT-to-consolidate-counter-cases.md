---
extraction_id: EXT-20260505-003-D
parent_input_id: EXT-20260505-003
section_label: "§14 When NOT to consolidate (6 counter-cases — anti-overcorrection guidance)"
source_type: AI_OTHER
confidence: 0.95
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T04:40:00Z
pipeline_state: routed
routed_to: B_CONSOLIDATION_PASS counterweight subsection (per Extract A) + composition with rigid-vs-flex (EXT-002-F)
next_review_at: 2026-05-06T04:40:00Z
risk: low
trust_tier: external_ai_export
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
mini_tree_layer: L1 (concise; 6 counter-cases preserved)
deep_dive_schedule: S009 with B_CONSOLIDATION_PASS engraving (Extract A) — counterweight is part of contract spec
priority_for_10_phase_completion: HIGH — without counter-cases, consolidation discipline becomes over-correction (CSPS exhibits "fix-everything" tendency that needs counterweight)
consolidation_cross_refs:
  - EXT-20260505-003-A — companion (the discipline this counterweights)
  - EXT-20260505-002-F — rigid-vs-flex composition principle (counter-cases are FLEX side; consolidation is RIGID side)
inherited_from_input:
  - source_type: AI_OTHER
  - risk: low
sla_due:
  routed_for_review: 2026-05-06T04:40:00Z
---

# Extract D — When NOT to consolidate (6 counter-cases)

## Essence

Consolidation is not always right. **CSP file #3 §14 enumerates 6 counter-cases** — applying rigid-vs-flex composition principle (per EXT-002-F): list/definitions/rules = RIGID consolidation candidates; examples/citations/local restatements = FLEX (judgment-driven). **Without these counter-cases, Consolidation Pass becomes over-correction** — collapsing helpful local context into broken cross-references.

## Verbatim source — 6 counter-cases (preserved L1)

> "1. Don't consolidate if it makes the canonical home too large for L1 scan. (file_depth_markers L1 budget ~5K tokens / ~50 lines)
> 2. Don't consolidate if it removes context essential to local understanding. Sometimes a brief inline restatement (1-2 lines) IS the right form because the cross-reference would interrupt the flow. Threshold: <3 occurrences = leave alone.
> 3. Don't consolidate at the cost of cross-context discoverability. If readers searching from different entry points all need to find the fact, consolidation should ensure the canonical home is discoverable from each entry point.
> 4. Don't consolidate citations. 'Per Governor S288 ...' citations are stable references, not content drift.
> 5. Don't consolidate examples that serve different purposes. S336 H0 directive walked in PE report (priority lens) + QC report (validation lens) is intentional — same example, different lens. Each instance carries the lens-specific framing.
> 6. Don't consolidate prematurely. Consolidation Pass fires AFTER document complete + tested. Mid-authoring consolidation is often premature — the structure may still shift."

## CSPS-specific application

**Counter-case 5 directly applies to CSPS extract notes:** a concept that appears in EXT-001-A (PE formula lens) AND EXT-002-D (D1-D10 lens) AND EXT-003-A (consolidation lens) is intentionally repeated under different framings. NOT a duplication candidate. Each instance is contextually framed.

**Counter-case 1 applies to AGENTS.md:** AGENTS.md is at 113 lines (under L1 budget). Aggressive consolidation pulling MORE detail into AGENTS.md from skills would push it over. Current architecture (skim AGENTS.md + auto-load skills) IS Consolidation Pass v0 — CSPS already applies this.

**Counter-case 6 applies to topic-plan unified-intake.md:** authored S008 turn 5; structure may shift as L2 + L3 work proceeds. **Premature consolidation pass on it would be wrong.** Defer to S010 close-of-topic-plan.

## Recommended downstream action

1. **Engrave as B_CONSOLIDATION_PASS counterweight subsection** (S009 — same engraving as Extract A)
2. **NEW MEMORY (S009):** `feedback_when_not_to_consolidate.md` — 6 counter-cases as AI guidance to prevent over-correction
3. **Apply counter-case 6 IMMEDIATELY** — do NOT consolidate topic-plan unified-intake.md this batch (structure still shifting through L2 + L3)
4. **Apply counter-case 5 IMMEDIATELY** — do NOT collapse EXT-001-A + EXT-002-D + EXT-003-A intentionally-different-lens framings even if they touch same concepts

## Open questions

- 6 counter-cases — adopt verbatim or CSPS-adapt?
- Counter-case 1 (L1 budget) requires file_depth_markers adoption (EXT-002-F) — engrave both same-batch?

## Engraving readiness

✅ READY for S009 PCR engraving as B_CONSOLIDATION_PASS counterweight subsection. Companion to Extract A.
