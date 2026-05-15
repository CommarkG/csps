---
extraction_id: EXT-20260505-005-C
parent_input_id: EXT-20260505-005
section_label: "§6 Composition with SCHEMA (schema-of-schemas index) + §7 Composition with Core Spines (HUB-per-spine pattern)"
source_type: AI_OTHER
confidence: 0.92
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T05:35:00Z
pipeline_state: routed
routed_to: docs/plan/pillar-1-architecture-and-stack/ + new schema-index.md candidate (CSPS analog of CSP CD-102) + existing L1_CORE files (add file_depth_markers per EXT-004 Phase 7)
next_review_at: 2026-05-06T05:35:00Z
risk: low
trust_tier: external_ai_export
tags: [domain:governance, domain:architecture, type:reference, audience:developer, audience:ai-agent, maturity:draft]
mini_tree_layer: L1+L2 (essence + CSPS-specific application)
deep_dive_schedule: S010-S011 Phase 7 — file split work natural fit for adding file_depth_markers to L1_CORE files + authoring schema-index
priority_for_10_phase_completion: MEDIUM — Phase 7 work natural fit
consolidation_cross_refs:
  - EXT-20260505-003-C HUB-per-spine + schema-as-canonical-home (already extracted)
  - EXT-20260505-004-D Improvement #6 HUB-per-spine + #2 disambiguate semantics (already extracted)
inherited_from_input: [source_type:AI_OTHER, risk:low]
scope_level: S1
---

# Extract C — Schema-of-schemas index + HUB-per-spine reinforcement

## Essence

CSP §6 introduces **schema-of-schemas index** pattern: `_INDEX.md` file in `schema_governance/` directory = SSoT for "which schema canonicalizes which concern". Recursive SSoT — the index itself is canonical for schema-discovery while individual schemas remain canonical for their domains.

CSP §7 reinforces **HUB-per-spine** pattern (already extracted in EXT-003-C + EXT-004-D). Each Core Spine has ONE HUB file = canonical L1 entry. **CSPS L1_CORE_<SPINE>.md files at `.claude/core-spines/` ARE the equivalent** — already exist; just need file_depth_markers added.

## CSPS application

### Schema-of-schemas index

CSPS has multiple schema-bearing files but no _INDEX:
- `frontmatter-closed-enums.md` (closed enum canonical)
- `principles.yaml` (principles canonical)
- `template-registry.md` (templates canonical)
- `tag-status-contract.md` (tag/status canonical)
- `audit-runner.md` (audit slugs canonical)
- `behavioral-contracts.md` (B_* canonical)

**Improvement candidate (S010-S011):** author `docs/plan/pillar-0-governance/schema-index.md` cataloging all CSPS schema-bearing files with their canonicalization scope. CSPS analog of CSP CD-102.

### HUB-per-spine (CSPS already has equivalent)

CSPS L1_CORE files at `.claude/core-spines/`:
- L1_CORE_GVRN.md (governance)
- L1_CORE_ARCH.md (architecture)
- L1_CORE_AI.md (AI systems)
- L1_CORE_OPER.md (operations)
- L1_CORE_VALD.md (validation)

**Phase 7 work (per EXT-004 Improvement #6):** add `file_depth_markers` frontmatter to all 5 L1_CORE files (~1hr work; biggest cross-spine bundling enabler).

## Recommended downstream action

**S010-S011 Phase 7 atomic batch:**
1. Author `schema-index.md` (S010 — ~1hr)
2. Add `file_depth_markers` to 5 L1_CORE files (S010 — ~1hr; per EXT-004 Improvement #6 lite-version)
3. Update `corespine_layer_compliance.ps1` validator to audit per-spine HUB depth-marker compliance (Phase 9 work; per EXT-004 Improvement #8)

## Engraving readiness
⚠️ DEFERRED to Phase 7 file-split work + Phase 9 validator extension. Foundation: this extract + EXT-003-C + EXT-004-D.
