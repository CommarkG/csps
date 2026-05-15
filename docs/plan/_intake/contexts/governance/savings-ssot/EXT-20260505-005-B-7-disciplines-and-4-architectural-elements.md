---
extraction_id: EXT-20260505-005-B
parent_input_id: EXT-20260505-005
section_label: "§3 7 active CSP disciplines + §4 4 cross-cutting architectural elements"
source_type: AI_OTHER
confidence: 0.95
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T05:35:00Z
pipeline_state: routed
routed_to: cross-cutting (validates CSPS architecture inventory) + AGENTS.md architecture section
next_review_at: 2026-05-06T05:35:00Z
risk: low
trust_tier: external_ai_export
tags: [domain:governance, domain:architecture, type:reference, audience:developer, audience:ai-agent, maturity:draft]
mini_tree_layer: L2 (detailed inventory + CSPS state mapping)
deep_dive_schedule: REFERENCE-ONLY (ongoing; 7 disciplines already separately extracted EXT-001/002/003/004); use as architectural inventory checklist
priority_for_10_phase_completion: MEDIUM — informative architectural overview; not blocking any phase
consolidation_cross_refs:
  - All EXT-001 through EXT-004 (this extract is the SYNTHESIS map showing how prior extracts compose)
inherited_from_input: [source_type:AI_OTHER, risk:low]
scope_level: S1
---

# Extract B — 7 active disciplines + 4 cross-cutting architectural elements

## Essence (CSPS ARCHITECTURE VALIDATION CHECKLIST)

CSP names **7 active disciplines** that each save cost AND establish SSoT (one mechanical layer; two payoffs):

| # | Discipline | CSPS state |
|---|---|---|
| 1 | **Token economy** (model tiering + PE.read_budget + 80/10/10) | B_TOKEN_BUDGET ✅ engraved S007; CCA Layer routing ✅; PE.read_budget ⏳ Phase 9 |
| 2 | **Anti-duplication / consolidation** (each fact ONE home) | B_CONSOLIDATION_PASS ⏳ S009 PCR (per EXT-003-A) |
| 3 | **Depth levels + bundling orchestrator** | depth-discipline.md ⏳ S009 (per EXT-004-A); creation gate ⏳ S009 (per EXT-004-B) |
| 4 | **5-element-pattern** (mechanical enforcement chain) | B_FIVE_SURFACE_ENGRAVING ✅ engraved (memory entry 14) |
| 5 | **Canonical homes per spine** (HUB-per-spine) | CSPS L1_CORE_<SPINE>.md files ✅ exist as equivalent (per EXT-003-C + EXT-004-D); add file_depth_markers Phase 7 |
| 6 | **Schema files as canonical homes** | frontmatter-closed-enums.md ✅ + principles.yaml ✅ + template-registry.md ✅ (CSPS strongly adopts) |
| 7 | **Memory file consolidation** | MEMORY.md index ✅; thematic indexes ⏳ when MEMORY.md exceeds load budget |

**Plus 4 cross-cutting architectural elements (§4):**
1. **SCHEMA** — CSPS: frontmatter-closed-enums + principles.yaml + tag-status-contract.md
2. **Core Spines** — CSPS: 5 spines (GVRN/ARCH/AI/OPER/VALD) + L1_CORE files
3. **Bundling Orchestrator** — CSPS: PE template-embedded; mechanical compute layer ⏳ Phase 9 (per EXT-001-C)
4. **Validators** — CSPS: 5 active (typecheck / principles_validate / frontmatter_validate / aap_frontmatter_coverage / principle_count_staleness); 10+ slugs registered week-4

## Recommended downstream action

**Use this extract as the CSPS ARCHITECTURE INVENTORY CHECKLIST.** At each Phase 5-10 close:
1. Check which of 7 disciplines moved from ⏳ to ✅
2. Check which of 4 architectural elements got reinforcement
3. Surface gaps as next-phase work

No new engraving needed — this extract VALIDATES that all 7 disciplines exist (or have engraving paths) in CSPS. Foundation-stability discipline confirmed.

## Engraving readiness
⚠️ REFERENCE-ONLY (no new engraving). Use as periodic checklist.
