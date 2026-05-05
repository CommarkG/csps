---
extraction_id: EXT-20260505-001-A
parent_input_id: EXT-20260505-001
section_label: "§2-§3 PE formula + 5 input dimensions"
source_type: AI_OTHER
confidence: 0.95
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T03:55:00Z
pipeline_state: routed
routed_to: governance/priority-engine + tools/templates/priority-engine.schema.yaml + B_GRADUAL_BUILD_BY_FOUNDATIONS
next_review_at: 2026-05-05T04:30:00Z
risk: low
trust_tier: external_ai_export
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
inherited_from_input:
  - source_type: AI_OTHER
  - risk: low
  - trust_tier: external_ai_export
sla_due:
  routed_for_review: 2026-05-05T04:30:00Z
  pcr_decision: 2026-05-06T03:55:00Z
---

# Extract A — PE formula validation + dimension-name divergence

## Essence (1-3 sentences)

CSP's PE formula `PE = (Blast×0.30) + (Dependency×0.30) + (Idle×0.15) + (Bundle×0.10) + (PAS×0.15) + IMPL_IN_PROGRESS_boost` validates CSPS structure (5 weighted dimensions + boost) but **diverges on dimension semantics**: CSPS uses Breadth/Depth/Impact/Blockers_now/PAS where CSP uses Blast/Dependency/Idle/Bundle/PAS. Same letter abbreviations, different meanings — this is a vocabulary-drift finding requiring reconciliation OR explicit divergence ratification.

## Verbatim source quote

> "PE_SCORE = (Blast × 0.30) + (Dependency × 0.30) + (Idle × 0.15) + (Bundle × 0.10) + (PAS × 0.15) + IMPL_IN_PROGRESS_boost"
>
> "Weight rationale: Blast + Dependency = 60% of score. The two most objectively measurable dimensions. PAS = 15%. Platform Alignment Score; signals 'how well does this fit CSP DNA.' Idle = 15%. Penalty for items not moving; prevents indefinite parking. Bundle = 10%. Smaller weight; opportunistic boost when work overlaps."
>
> "History: weights were tuned in S270+ era. Original Blast was 0.35; reduced to 0.30 to make room for PAS."

## CSPS current state

[`tools/templates/gradual-build-plan.template.md`](../../../../../tools/templates/gradual-build-plan.template.md) §6 + topic-plan instances (e.g., [`unified-intake.md` §6](../../../../_handoff/VAULT/topic-plans/unified-intake.md)) use:

```
PE = (B × 0.30) + (D × 0.30) + (I × 0.15) + (Bn × 0.10) + (PAS × 0.15)
where B=Breadth / D=Depth / I=Impact / Bn=Blockers_now / PAS=Psychological_Anchor_Satisfaction
```

**Same weights. Different dimensions.** Possible explanations:
1. CSPS dimensions are a deliberate adaptation (not all CSP concepts apply to CSPS at this stage)
2. CSPS dimensions are accidental drift from CSP precedent (B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK violation)

CSP's dimensions are objectively measurable mechanical-friendly. CSPS's dimensions are more cognitive/judgment-driven.

## Recommended downstream action

**PCR-required decision** for Governor (S009 candidate):

- **Option A:** Adopt CSP's 5 dimensions verbatim (Blast/Dependency/Idle/Bundle/PAS); rename CSPS template fields. **Pro:** mechanical computability + cross-platform alignment. **Con:** breaks 1 existing topic-plan instance (`unified-intake.md` §6); requires re-scoring.
- **Option B:** Keep CSPS dimensions (Breadth/Depth/Impact/Blockers/PAS); document divergence-with-rationale. **Pro:** zero churn. **Con:** PE remains judgment-driven not mechanical.
- **Option C (HYBRID):** Keep CSPS conceptual dimensions but add CSP's mechanical-detection patterns where they apply (e.g., CSP's "trace depends_on / extends references; sum dependent items' Blast scores" methodology can compute CSPS Depth). **Pro:** enhancement-over-replacement; mechanical layer added without naming change. **Con:** dimension-name divergence persists (cross-platform translation table needed).

**Recommendation:** Option C — extends [P-OP-001 reuse-first](../../../../../packages/principles/principles.yaml) + honors CSPS-existing dimensions while extracting CSP's mechanical-computability discipline.

## Open questions

- Was CSPS PE dimension naming intentional (CSP-divergence) or accidental (drift)? [recommendation: ask user before reconciling]
- Does CSPS need mechanical PE computability now (week-N) or can it stay template-embedded judgment-driven through MVP?
- Should `tools/pe-compute.mjs` be authored as a CSPS analog of `pe_compute.ps1`?

## Engraving readiness

❌ NOT READY for engraving without user PCR. Vocabulary-rename touches every topic-plan instance + template + memory entry. Multi-session arc.
