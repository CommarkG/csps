---
extraction_id: EXT-20260505-004-D
parent_input_id: EXT-20260505-004
section_label: "§8 Composition with SCHEMA + §9 Composition with Core Spines + §10 Composition with rest of CSP + §11 9 concrete improvements"
source_type: AI_OTHER
confidence: 0.95
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T05:05:00Z
pipeline_state: routed
routed_to: docs/plan/pillar-2-data-and-schema/ (frontmatter-standard.md amendment) + .claude/core-spines/L1_CORE_*.md (file_depth_markers backfill on 5 sealed files) + composition with EXT-001-001-D 7 reassessment triggers
next_review_at: 2026-05-06T05:05:00Z
risk: low
trust_tier: external_ai_export
tags:
  - domain:governance
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
mini_tree_layer: L1+L2 (essence + 9 improvements ranked + 4-phase plan)
deep_dive_schedule: S009-S011 — 9 improvements map directly to CSPS Phase 6/7/8/9/10 work; sequenced per CSP §11 phased plan + CSPS PE alignment
priority_for_10_phase_completion: 🔥 EXCEPTIONAL — 9 improvements ARE the actionable Phase 6-10 work informed by all 4 CSP files
consolidation_cross_refs:
  - EXT-20260505-002-A (validator class structure) — CSP Improvement #4 + #8 (validators) compose
  - EXT-20260505-002-B (9-element DNA gate) — CSP Improvement #9 (depth_marker_creation_template_validator) composes
  - EXT-20260505-003-C (Schema-as-canonical-home + HUB-per-spine) — CSP Improvements #2 + #6 + #8 directly extend
  - EXT-20260505-001-C (7 PE invocation points) — CSP Improvement #5 (PE.read_budget) extends
inherited_from_input:
  - source_type: AI_OTHER
  - risk: low
sla_due:
  routed_for_review: 2026-05-06T05:05:00Z
scope_level: S1
---

# Extract D — SCHEMA + Core Spines composition + 9 ranked improvements

## Essence (THE PHASE 6-10 ROADMAP, CSP-INFORMED)

CSP file #4 §8/§9/§10 establish that depth markers + bundling orchestrator + SCHEMA + Core Spines are **mutually-supporting** — each piece needs the others to deliver value. §11 lists **9 concrete improvements** ranked by leverage × effort, organized into 4 phases. **For CSPS, these 9 improvements map directly to remaining Phase 6-10 token-optimization work — CSP-validated execution sequence.**

## Composition map (§10 verbatim preserved)

```
                    PLATFORM_DNA_INDEX (canonical L1/L2/L3 doctrine)
                          ↓
SCHEMA (dna_lifecycle.json) <-> caf_governance_artifacts (Supabase metadata)
       ↓                                ↓
Frontmatter fields (per artifact)     Bundling orchestrator (PE)
       ↓                                ↓
       ↓                             read_budget output
       ↓                                ↓
Validators (skill_dna_audit + token_budget Mode 6 + depth_marker_creation_gate)
       ↓                                ↓
Per-spine HUB files (canonical homes)  Per-session token economy (energy optimization)
       ↓
5-element-pattern (cross-references = hook layer)
```

**No piece works in isolation.** Removing any one weakens the others. Architecture must be deployed as consolidated set.

## 9 improvements ranked by leverage × effort (§11)

| # | Improvement | Effort | Leverage | CSPS phase mapping |
|---|---|---|---|---|
| **#1** | Author governed_artifact_frontmatter_template.md | 30 min | every NEW artifact gets depth markers | Phase 6 prerequisite (S009) |
| **#2** | Disambiguate 4 semantics in PLATFORM_DNA_INDEX | 1 hr | ends conflation of `depth_levels_invoked` field | Phase 6 prerequisite (S009; CSPS analog: depth-discipline.md leaf per Extract A) |
| **#3** | Backfill file_depth_markers on top 10 offenders | 10 hr (10 humble batches) | biggest token-saving lever per file | Phase 7 (file splits) — CSPS top offenders: behavioral-contracts.md (~1200) / token-optimization.md / topic-plans / etc. |
| **#4** | Pre-push hook for depth marker creation gate | 2-3 hr | blocks new artifacts >300 lines without markers | Phase 5 hook migration EXTENSION (S008 turn 5 stubs already authored; add this 13th hook) |
| **#5** | PE.read_budget extension | 4-6 hr | 60-75% reduction on reference-read cost (ESTIMATED) | Phase 8 principles-mcp build OR Phase 9 measurement validator (S010-S011) |
| **#6** | HUB-per-spine file authoring (5 files) | 10-15 hr (5 batches) | cross-spine bundling enabled | CSPS NOTE: L1_CORE_<SPINE>.md files at .claude/core-spines/ ALREADY EXIST as equivalent — just add file_depth_markers (1 hr, not 10-15) |
| **#7** | caf_governance_artifacts Supabase columns | 4-6 hr | queryable depth metadata | DEFERRED (CSPS week-6+ Mastra runtime; pre-runtime markdown sufficient) |
| **#8** | corespine_layer_compliance extension | 2-3 hr | mechanical enforcement of spine-canonical-home | Phase 9 measurement validator work |
| **#9** | depth_marker_creation_template_validator | 2-3 hr | completes 5-element-pattern for depth-marker discipline | Phase 9 measurement validator work |

## CSPS-adapted 4-phase improvement plan (CSPS-recalibrated from CSP §11)

Per user PE alignment ("completion of 10 phases is priority right after absorbing CSP valuable"):

| CSPS Phase | CSP-derived improvements | Sessions |
|---|---|---|
| **S009 — Foundation (Phase 5+ extension)** | Improvements #1 + #2 + #4 + LITE backfill of CSPS top offenders | S009 |
| **Phase 6 (subagent + Haiku tiering)** | Use Improvement #1 template for spawn templates; apply Improvement #2 disambiguation to ensure no field-semantic confusion | S009-S010 |
| **Phase 7 (file splits)** | Improvement #3 (backfill top offenders) becomes natural file-split discipline | S010-S011 |
| **Phase 8 (principles-mcp build)** | Improvement #5 (PE.read_budget) integrates with MCP query optimization | S010-S011 |
| **Phase 9 (measurement validator)** | Improvements #5 + #8 + #9 deliver Mode 6 file_depth_markers + depth-marker creation validator + spine compliance extension | S011 |
| **Phase 10 (continuous validation)** | Weekly tag-status-deep-audit (registered S008 turn 8) extends to depth-marker drift detection | S011-S012 |

## Composition with prior CSP files (mutual-support recognition)

- **CSP #1 (QC report) Validators** — Improvement #4 + #8 + #9 are validator authoring work; per EXT-002-A use 6-commitment validator class structure
- **CSP #2 (PE report) Bundling Orchestrator** — Improvement #5 IS the read_budget extension to PE
- **CSP #3 (Anti-Duplication report) Canonical Homes** — Improvement #2 IS schema-as-canonical-home applied; Improvement #6 IS HUB-per-spine
- **CSP #4 (THIS report) Depth Discipline** — synthesizes #1 + #2 + #3 into depth-marker domain

**This file CLOSES the CSP DNA export series** — the 4 reports together describe complete operational governance.

## Recommended downstream action

**Per "move on to completion of 10 phases" directive:**

1. **PIVOT NOW** to Phase 6 work informed by all 4 CSP files extracts
2. **S009 next session OR same-batch:** Improvements #1 + #2 + #4 + LITE-backfill (Phase 6 prerequisites; ~3 hours total)
3. **S010-S011:** Phase 7-9 work executing CSP-derived 9-improvement plan + EXT-002-D D1-D10 catalog engraving
4. **Honest baseline measurement** at Phase 9 close — verify CSP's 60-75% claim CSPS-empirically before propagating

## Engraving readiness

🔥 **EXCEPTIONAL — DIRECT PHASE 6-10 ROADMAP.** No engraving needed; the 9 improvements ARE the next-phase work. Recommendation: open S009 IMMEDIATELY with depth-discipline.md leaf (Extract A) + frontmatter template (Extract B Improvement #1) + creation gate hook (Extract B Improvement #4) as Phase 5+ extension batch — this enables Phase 6 work to use depth-aware spawn templates.
