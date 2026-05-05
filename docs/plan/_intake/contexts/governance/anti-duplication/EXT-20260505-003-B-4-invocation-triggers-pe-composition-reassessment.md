---
extraction_id: EXT-20260505-003-B
parent_input_id: EXT-20260505-003
section_label: "§5 4 invocation triggers + §9 Composition with PE invocation point #8"
source_type: AI_OTHER
confidence: 0.95
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T04:40:00Z
pipeline_state: routed
routed_to: B_CONSOLIDATION_PASS invocation triggers + composition with EXT-001-D reassessment triggers + audit-hub Pipeline 7 amendment
next_review_at: 2026-05-06T04:40:00Z
risk: low
trust_tier: external_ai_export
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
mini_tree_layer: L1+L2 (essence + integration spec)
deep_dive_schedule: S009 with B_CONSOLIDATION_PASS contract authoring
priority_for_10_phase_completion: HIGH (informs WHEN consolidation fires across Phase 5-10 work)
consolidation_cross_refs:
  - EXT-20260505-001-D (7 reassessment triggers) — Trigger 2 here = "P-GOV-24 reassessment checkpoint" = same set
  - EXT-20260505-001-C (7 PE invocation points) — point #8 (Consolidation Pass) IS this extract's content
inherited_from_input:
  - source_type: AI_OTHER
  - risk: low
sla_due:
  routed_for_review: 2026-05-06T04:40:00Z
---

# Extract B — 4 invocation triggers + Composition with PE invocation point #8

## Essence

CSP file #3 §5 enumerates **4 invocation triggers** for Consolidation Pass: (1) comprehensive document just authored (>500 lines) fires same-batch / (2) P-GOV-24 reassessment checkpoint / (3) grep-based ≥3 occurrences detection / (4) file_depth_marker_validator overlap flag. These compose with **CSP file #1 §5 Point 8** which formalizes Consolidation Pass AS PE invocation point #8.

## Verbatim source quotes

**4 triggers (§5):**
> "1. Comprehensive document just authored (>500 lines OR multi-section structure) — Fires SAME-BATCH after document committed
> 2. P-GOV-24 reassessment checkpoint — Fires as part of reassessment per feedback_pe_alignment_guardian
> 3. Grep-based duplication detection ≥3 occurrences of same fact — Mechanical trigger via consolidation_pass_validator
> 4. file_depth_marker_validator overlap flag — Validator surfaces section overlap; consolidation pass investigates"

**PE invocation point #8 (composes with EXT-001-C; per CSP file #3 §9):**
> "Consolidation Pass is PE invocation point #8. PE recommends consolidation pass as same-batch follow-up. At P-GOV-24 reassessment, PE includes 'Consolidation Pass needed?' check."

## CSPS current state

- **CSPS has NO Consolidation Pass invocation triggers** — discipline absent
- **CSPS has 5 reassessment triggers** (per EXT-001-D extract; CSPS-adapted from CSP's 7) — would be the parent for Trigger 2 of consolidation
- **CSPS PE has 5 invocation points** (per EXT-001-C extract; CSPS-adapted from CSP's 7) — adding consolidation as 6th invocation point CSPS-adapted

## Recommended downstream action

**Per save+schedule directive — schedule for S009-S010 engraving:**

1. **Adopt 4 triggers verbatim** (high portability):
   - Trigger 1: Same-batch fire after CSPS comprehensive guides >500 lines (e.g., topic-plans, element-reviews, large extracts)
   - Trigger 2: At every CSPS reassessment (per EXT-001-D 5 CSPS-adapted triggers)
   - Trigger 3: Grep ≥3 occurrences via validate-consolidation.mjs (Phase 9 build)
   - Trigger 4: When file_depth_markers (CSPS adopting per EXT-002-F) overlap flag fires
2. **Add as PE invocation point #6 in CSPS** (CSPS PE has 5; adding Consolidation Pass = 6) — per EXT-001-C extract
3. **Amend audit-hub.md Pipeline 7** to register `consolidation-pass-coverage` audit slug (week-4 active enforcement)
4. **NEW HOOK STUB:** `.claude/hooks/post-write-large-doc-consolidation-trigger.sh` — fires after Write/Edit on artifacts >500 lines; surfaces Consolidation Pass recommendation to AI

## Open questions

- 500-line threshold per CSP OR different for CSPS?
- Trigger 4 (file_depth_marker overlap) requires validate-frontmatter.mjs extension — defer to Phase 9 OR earlier?
- PE invocation point ordering — insert as 6th OR re-number existing 5?

## Engraving readiness

⚠️ DEFERRED to S009 with B_CONSOLIDATION_PASS contract engraving (Extract A). Trigger architecture requires Extract A's protocol first.
