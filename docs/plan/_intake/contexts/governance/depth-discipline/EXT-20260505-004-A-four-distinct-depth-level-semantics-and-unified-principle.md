---
extraction_id: EXT-20260505-004-A
parent_input_id: EXT-20260505-004
section_label: "§2 Audit findings: 4 distinct depth-level semantics + §3 5 gaps + §4 3 duplications + §5 Unified principle"
source_type: AI_OTHER
confidence: 0.97
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T05:05:00Z
pipeline_state: routed
routed_to: docs/plan/pillar-1-architecture-and-stack/depth-discipline.md (new leaf candidate) + frontmatter-standard.md amendment + composition with PLATFORM_DNA_INDEX-equivalent
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
mini_tree_layer: L1+L2 (essence + 4 semantics + unified principle; L3 deep-dive at canonical-leaf authoring)
deep_dive_schedule: S009 — author CSPS depth-discipline canonical leaf BEFORE Phase 6 begins (Phase 6 subagent templates need depth-marker convention)
priority_for_10_phase_completion: 🔥 HIGH — disambiguation needed BEFORE Phase 6 spawn templates use the wrong field semantics
consolidation_cross_refs:
  - EXT-20260505-002-F (file_depth_markers + 10-scenario test) — this extract DEEPENS the file_depth_markers concept with 4-semantic disambiguation
  - EXT-20260505-003-A (Anti-duplication §4 patterns) — this extract APPLIES Anti-Duplication discipline to identify depth-semantic duplications
inherited_from_input:
  - source_type: AI_OTHER
  - risk: low
sla_due:
  routed_for_review: 2026-05-06T05:05:00Z
scope_level: S1
---

# Extract A — 4 distinct depth-level semantics + Unified principle

## Essence (CRITICAL FOUNDATION FOR PHASE 6+ EFFICIENCY)

CSP file #4 §2 reveals **4 distinct depth-level semantics** all using L1/L2/L3 nomenclature on different domains:
1. **`file_depth_markers`** (intra-document line ranges; per file)
2. **`depth_levels_invoked` DNA** (which DNA element depths the artifact uses)
3. **Audit depth** (L1 SCSE / L2 Domain Deep Dive / L3 Expert Panel; situation escalation)
4. **`depth_tier_authored`** (which tier the AUTHOR wrote at; per CC-083)

**Unified principle:** depth levels operate at TWO coordinated layers — per-artifact declaration (static; at authoring) + per-session aggregation (dynamic; via bundling orchestrator). **Both layers required for energy optimization to materialize.**

## Verbatim source quotes

**4 semantics summary table (§2):**
> "1. file_depth_markers — intra-document line ranges
> 2. depth_levels_invoked — DNA element depths
> 3. Audit depth — situation escalation L1 SCSE / L2 / L3
> 4. depth_tier_authored — per CC-083 (Bundle 1 ratified)"

**Unified principle (§5):**
> "Per-artifact declaration — each artifact declares its own depth structure. Static; declared at authoring time.
> Per-session aggregation — at session start + per-task, the bundling orchestrator aggregates depth declarations across all referenced/loaded artifacts. Dynamic; computed per task per session.
> Why coordinated: without per-artifact declaration, the orchestrator has no input data. Without per-session aggregation, per-artifact declarations sit unused."

**3 duplications observed (§4) — applying Anti-Duplication discipline self-recursively:**
> "Duplication #1: depth_levels_invoked field overloaded — same name carries different semantics in different artifacts
> Duplication #2: depth-discipline rules restated across docs — 'files >300 lines should declare depth markers' in 4+ places
> Duplication #3: L1/L2/L3 semantic conflation in prose — mentions without naming which semantic"

## CSPS current state

**CSPS depth-discipline state:**
- `depth_chosen: 3 | 4 | 5` field exists in topic-plan template (gradual-build-plan template) — this is **CSPS Semantic #5 NOT in CSP's 4** (topic-plan-depth ∈ {3,4,5})
- No `file_depth_markers` field anywhere in CSPS frontmatter
- No `depth_levels_invoked` field
- No `depth_tier_authored` field
- No L1 SCSE / L2 Domain / L3 Expert Panel audit-depth concept (per EXT-002-E extract; deferred S010-S011)
- AGENTS.md is 113 lines — under any reasonable depth threshold; doesn't need markers
- token-optimization.md is large — would benefit from markers
- behavioral-contracts.md is ~1200+ lines — would STRONGLY benefit from markers

**CSPS has 5 candidate semantics now (CSP's 4 + CSPS's topic-plan-depth):**
- `file_depth_markers` — NEW for CSPS per EXT-002-F + this extract
- `depth_levels_invoked` — NEW for CSPS
- Audit depth (L1 SCSE / L2 / L3) — NEW for CSPS (deferred S010-S011 per EXT-002-E)
- `depth_tier_authored` — NEW for CSPS
- `depth_chosen ∈ {3,4,5}` — EXISTING CSPS topic-plan field (different semantic again — gradual-build-plan layer count)

**5 depth-related semantics in CSPS** (4 from CSP + 1 native) — disambiguation needed BEFORE engraving.

## Recommended downstream action

**Per save+schedule directive — schedule deep-dive S009 PCR (BEFORE Phase 6):**

1. **NEW LEAF (S009 — Phase 6 prerequisite):** `docs/plan/pillar-1-architecture-and-stack/depth-discipline.md` — CSPS canonical home for ALL 5 depth semantics with disambiguation table
2. **EXTEND frontmatter-standard.md** with 4 NEW depth fields (file_depth_markers / depth_levels_invoked / depth_tier_authored + clarification that depth_chosen is topic-plan-specific)
3. **EXTEND frontmatter-closed-enums.md** with depth-related closed enums (file_depth_markers required when >300 lines / depth_levels_invoked values ⊆ {L1, L2, L3} / etc.)
4. **EXTEND validate-frontmatter.mjs** to check new fields (Phase 9 measurement validator work)
5. **APPLY counter-case 6 (CSP file #3)** — don't backfill all CSPS artifacts at once; apply mechanical-creation gate going-forward (Extract B)

## Open questions

- CSPS native `depth_chosen` (topic-plan layers 3/4/5) coexists with CSP `depth_levels_invoked` (DNA L1/L2/L3) — naming drift risk; rename one to disambiguate?
- Audit-depth semantic deferred per EXT-002-E (S010-S011 first CONSTITUTIONAL change) — engrave NOW or defer?
- 5 semantics OR consolidate to 3 (file_depth_markers + depth_invocation + topic-plan-depth)?

## Engraving readiness

🔥 **HIGH — RECOMMEND S009 PCR ENGRAVING BEFORE Phase 6.** Foundation work; subsequent Phase 6 spawn templates need depth-marker convention. Without disambiguation, Phase 6+ would invent its own field semantics = drift.
