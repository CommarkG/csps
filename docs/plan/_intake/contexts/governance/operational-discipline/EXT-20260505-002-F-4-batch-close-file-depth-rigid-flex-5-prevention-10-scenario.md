---
extraction_id: EXT-20260505-002-F
parent_input_id: EXT-20260505-002
section_label: "§18 4-batch close protocol + §20 File-depth markers + §21 Rigid-vs-flex composition + §24 5-prevention catalog + 10-scenario test"
source_type: AI_OTHER
confidence: 0.95
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T04:35:00Z
pipeline_state: routed
routed_to: protocols.md §10 closing-protocol extension + frontmatter spec extension (file_depth_markers) + behavioral-contracts.md (rigid-flex principle) + token-optimization.md §14.5 (10-scenario test recurring)
next_review_at: 2026-05-06T04:35:00Z
risk: low
trust_tier: external_ai_export
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
mini_tree_layer: L1+L2 (5 sub-extracts in one note; L3 deep-dive per-pattern deferred)
deep_dive_schedule: |
  - 4-batch close protocol → S009 next session-close (apply experimentally to S008 close)
  - file_depth_markers → IMMEDIATE adoption in this batch (used for THIS extract's mini_tree_layer field)
  - rigid-vs-flex → S009 — engrave as principle amendment to closed-enums + B_STRUCTURAL_PREVENTION
  - 5-prevention catalog → S010-S011 — when token-optimization Phase 9 measurement validator is built
  - 10-scenario test → ALREADY in CSPS (token-optimization.md §14.5; deferred to user-tested verification per Phase 4d carry-forward)
priority_for_10_phase_completion: |
  - file_depth_markers HIGH (Phase 7 file splits will use this directly)
  - 4-batch close MEDIUM (operational discipline; not blocking phases)
  - rigid-vs-flex MEDIUM (extends existing closed-enums discipline)
  - 5-prevention catalog HIGH (composes with Phase 5-10 hooks)
  - 10-scenario test ALREADY-IN-CSPS
consolidation_cross_refs:
  - token-optimization.md §14.5 — already specs 10-scenario test (CSPS-equivalent already exists)
  - frontmatter-closed-enums.md (S007 turn 5) — rigid-vs-flex extends this directly
  - feedback_structural_prevention_discipline.md (memory entry 33) — rigid-vs-flex composes with K=2 promotion
  - protocols.md §10 closing-protocol — 4-batch close extends this
inherited_from_input:
  - source_type: AI_OTHER
  - risk: low
sla_due:
  routed_for_review: 2026-05-06T04:35:00Z
---

# Extract F — 4-batch close + File-depth markers + Rigid-vs-flex + 5-prevention catalog + 10-scenario test

## Essence (5 disciplines clustered; mini-tree split applied)

This extract bundles 5 operational disciplines from CSP file #2 §18/§20/§21/§24/§20-amendment. They're closely related (all close-protocol + complexity-management) and benefit from one consolidated extract over 5 separate.

### Discipline 1 — 4-batch close protocol (Capture / Prepare / Verify / Close)

**Pattern:** every session close runs 4 progressive batches: Batch 1 Capture (validators + verbatim outputs) → Batch 2 Prepare (artifacts authored + scaffolds) → Batch 3 Verify (re-run validators + smoke-test auto-generated artifacts + fix regressions) → Batch 4 Close (final BATCH_CLOSE commit + push). **CSPS has session-close protocols.md §10 with 14 items but not split into 4 progressive batches** — currently §10 fires items linearly without explicit verify-before-close gate.

### Discipline 2 — File-depth markers (L1/L2/L3 + 10-scenario test)

**Pattern:** every governed artifact >300 lines declares `file_depth_markers` in frontmatter (l1_lines / l2_lines / l3_lines / read_protocol). Validator (CSP `token_budget_validator` Mode 6) flags artifacts >300 lines without markers. **This extract APPLIES the discipline to itself** (mini_tree_layer field in frontmatter). **CSPS has NO file_depth_markers convention** — every long artifact (e.g., AGENTS.md.original was 6000 words) lacks layered read protocol.

### Discipline 3 — Rigid-vs-flex composition principle

**Pattern:** governance has TWO layers — **RIGID enums** (mechanically validated; no judgment — e.g., spine values / pillar values / status enum / severity / blast) vs **FLEX compositions** (context-driven judgment — e.g., model_tier / read_budget / depth-level escalation / hook timing / continue-vs-close). **Confusing the two is root cause of two drift classes**: (a) RIGID treated as FLEX → invented enum tokens (CSPS K=2 closed-enum drift S007 turn 5 IS this exact pattern); (b) FLEX treated as RIGID → over-applied fixed rules ignoring context.

### Discipline 4 — 5-prevention catalog

**5 compounding mechanical gates** that prevent unoptimal things:
1. Pre-adoption prevention (triple-validator gate)
2. Cache-break prevention (PreToolUse hook on /model warns mid-task switch)
3. Auto-compaction content-loss prevention (PreCompact hook with focus-instructions)
4. Hook-failure-silent-loss prevention (SessionStart self-test — CSPS HAS THIS via verify-hooks-functional.sh)
5. Drift-over-time prevention (recurring 10-scenario test at every reassessment)

### Discipline 5 — 10-scenario over-compression test

**Recurring test** at every P-GOV-24 reassessment checkpoint: run 10 representative session-start scenarios; verify each triggers correct skill load. PASS criterion: ≥9/10. Already exists in CSPS as `token-optimization.md §14.5` (Phase 4d carry-forward awaiting user-tested verification).

## CSPS current state per discipline

| Discipline | CSPS state | Gap |
|---|---|---|
| 1. 4-batch close | protocols.md §10 has 14 items linearly | No verify-before-close gate; no progressive batches |
| 2. file_depth_markers | NONE | All long artifacts lack layered read protocol; THIS extract self-applies |
| 3. Rigid-vs-flex | frontmatter-closed-enums.md (S007 turn 5) covers RIGID | FLEX side not formalized; rigid-vs-flex principle not explicit |
| 4. 5-prevention | Cache-break + Hook-failure (verify-hooks-functional) PARTIAL CSPS | 3 of 5 missing (pre-adoption / auto-compaction / drift-over-time) |
| 5. 10-scenario | EXISTS at token-optimization.md §14.5 | Phase 4d still pending user-tested verification carry-forward |

## Recommended downstream action

**Per save+schedule directive — schedule deep-dive per discipline:**

1. **4-batch close (S009 trial):** apply experimentally to S008 close — capture batch / prepare batch / verify batch / close batch — measure friction
2. **file_depth_markers (IMMEDIATE adoption):** every CSPS artifact >300 lines authored from S008+ must declare file_depth_markers — apply to topic-plans / element-reviews / closing-summaries / behavioral-contracts.md (long file)
3. **Rigid-vs-flex (S009 engraving):** amend B_STRUCTURAL_PREVENTION_DISCIPLINE OR new B_RIGID_VS_FLEX_COMPOSITION; update frontmatter-closed-enums.md preamble with rigid-vs-flex framing
4. **5-prevention catalog (S010-S011):** add 3 missing preventions to CSPS hooks (pre-adoption gate already partial via AAP hook stub; auto-compaction content-loss = new PreCompact hook; drift-over-time = weekly tag-status-deep-audit being registered THIS batch)
5. **10-scenario test (S008+):** un-defer Phase 4d 10-scenario test; user-tested verification overdue

## Open questions

- 4-batch close: progressive complexity worth the friction OR keep CSPS linear protocols.md §10?
- file_depth_markers: 300-line threshold per CSP OR different for CSPS?
- Rigid-vs-flex: standalone principle OR amend existing closed-enums leaf?
- 5-prevention CSP-specific Mechanical Gap Audit recursion (Tier 1 #5) — CSPS analog?

## Engraving readiness

✅ **MIXED — 5 disciplines, 5 different readiness:**
- file_depth_markers: ADOPT IMMEDIATELY (this extract demonstrates)
- 10-scenario test: UN-DEFER S008 (already specced)
- 4-batch close: TRIAL S009
- Rigid-vs-flex: ENGRAVE S009 PCR
- 5-prevention: SCHEDULE S010-S011 with Phase 5-10 hook completion
