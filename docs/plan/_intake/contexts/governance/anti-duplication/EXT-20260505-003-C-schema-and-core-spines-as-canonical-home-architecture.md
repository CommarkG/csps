---
extraction_id: EXT-20260505-003-C
parent_input_id: EXT-20260505-003
section_label: "§6 Composition with SCHEMA + §7 Composition with Core Spines (HUB files / SPINE_TO_PILLAR_MAPPING)"
source_type: AI_OTHER
confidence: 0.92
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T04:40:00Z
pipeline_state: routed
routed_to: docs/plan/pillar-1-architecture-and-stack/ (frontmatter-standard amendment) + new HUB-files-per-spine convention candidate + composition with P-ARCH-028 5 Core Spines
next_review_at: 2026-05-06T04:40:00Z
risk: low
trust_tier: external_ai_export
tags:
  - domain:governance
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
mini_tree_layer: L1+L2 (essence + adaptation; CSP-specific HUB file impl details elided)
deep_dive_schedule: S010-S011 — when CSPS authors first cross-spine reference work (e.g., Phase 8 principles-mcp build OR ADR-0025 CNST/GVRN split)
priority_for_10_phase_completion: MEDIUM (architectural foundation; HUB-file convention may be premature at week-N CSPS scale)
consolidation_cross_refs:
  - feedback_csp_core_spine_absorptions.md (memory entry 34) — CSPS 5 Core Spines doctrine + 3-layer (L0/L1/L2/L3)
  - frontmatter-closed-enums.md — schema-as-canonical-home discipline already partial in CSPS
inherited_from_input:
  - source_type: AI_OTHER
  - risk: low
sla_due:
  routed_for_review: 2026-05-06T04:40:00Z
---

# Extract C — Schema-as-canonical-home + Core Spines / HUB files architecture

## Essence

CSP file #3 §6 + §7 establish **two canonical-home architecture patterns**:

**Pattern 1 (§6) — Schema-as-canonical-home:** schemas declare definitions; artifacts reference. **No artifact re-defines schema content.** Frontmatter `references:` field declares cross-references; validators check existence. CSP examples: `dna_lifecycle.json` (vocab) / `quality_audit_schema.json` (audit kinds) / `handshake_protocol_schema.json` (artifact types) / `entity_state.json` (entity registry).

**Pattern 2 (§7) — HUB-file-per-spine:** each Core Spine has ONE HUB_<SPINE>_<NAME>.md file as the spine's canonical content domain entry. Cross-spine references point to relevant HUBs, not duplicate content. **`SPINE_TO_PILLAR_MAPPING.md`** is canonical home for spine→pillar derivation.

## CSPS current state

**Pattern 1 (Schema-as-canonical-home) — STRONGLY ADOPTED:**
- `frontmatter-closed-enums.md` (S007 turn 5) IS canonical-home for closed enums; validate-frontmatter.mjs is canonical
- `principles.yaml` IS canonical for principles; AGENTS.md generates from it
- `template-registry.md` IS canonical for templates per B_TEMPLATE_FIRST_CREATION
- **CSPS pattern matches CSP pattern; no engraving needed for Pattern 1**

**Pattern 2 (HUB-file-per-spine) — NOT ADOPTED:**
- CSPS has 5 Core Spines (GVRN/ARCH/AI/OPER/VALD per P-ARCH-028) + 3-layer doctrine (L0 manifest / L1 sealed / L2 domain / L3 instances)
- CSPS L1 sealed files at `.claude/core-spines/L1_CORE_<SPINE>.md` (5 files; doctrinal) + L2 domain at `.claude/core-spines/L2_DOMAIN_<NAME>.md` (16 files)
- **CSPS already has HUB-equivalent: L1_CORE_<SPINE>.md files ARE the canonical entry per spine** — pattern matches without renaming
- CSPS does NOT have explicit `SPINE_TO_PILLAR_MAPPING.md` (CSPS uses 5-spine system without separate pillar layer per P-ARCH-028 + EXT-20260505-001-F deferred 4-pillar metric)

## Recommended downstream action

**Per save+schedule directive — defer most engraving:**

1. **Pattern 1 (Schema-as-canonical-home):** ALREADY ADOPTED. No new work needed. Strengthen via consistent application — every new closed enum gets entry in frontmatter-closed-enums.md (already mandated).
2. **Pattern 2 (HUB-file-per-spine) STATUS NOTE:** CSPS L1_CORE files ARE the equivalent. Document this equivalence in feedback_csp_core_spine_absorptions.md amendment (S009).
3. **DEFER `SPINE_TO_PILLAR_MAPPING.md` analog** — CSPS doesn't have separate pillar layer; revisit if/when ADR-0025 CNST/GVRN split ratifies a pillar-style cross-mapping
4. **Cross-spine reference rule (NEW for CSPS):** when authoring cross-spine artifact, reference the L1_CORE_<SPINE>.md file (canonical home) instead of duplicating content. **Engrave as part of B_CORE_SPINE_DISCIPLINE amendment OR new sub-rule in B_CONSOLIDATION_PASS** (Extract A).

## Open questions

- HUB-file convention CSPS-equivalent: explicit doc OR implicit-via-L1_CORE files? Recommend implicit (CSPS already has it).
- SPINE_TO_PILLAR_MAPPING: defer until ADR-0025 OR engrave a placeholder version mapping current 5 CSPS spines to themselves (no transformation)?

## Engraving readiness

⚠️ MOSTLY DEFERRED. Pattern 1 already adopted (no engraving needed). Pattern 2 partially adopted (document equivalence S009). Pattern 3 (cross-spine reference rule) candidate for B_CONSOLIDATION_PASS sub-rule (S009).
