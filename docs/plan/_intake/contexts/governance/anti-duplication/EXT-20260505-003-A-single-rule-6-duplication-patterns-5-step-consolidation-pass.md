---
extraction_id: EXT-20260505-003-A
parent_input_id: EXT-20260505-003
section_label: "§2 Single rule + §3 6 duplication patterns + §4 5-step Consolidation Pass protocol"
source_type: AI_OTHER
confidence: 0.98
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T04:40:00Z
pipeline_state: routed
routed_to: new B_CONSOLIDATION_PASS contract candidate + protocols.md §10 closing-protocol amendment + tools/validators/validate-consolidation.mjs (CD candidate; CSPS analog of CSP CD-096)
next_review_at: 2026-05-06T04:40:00Z
risk: low
trust_tier: external_ai_export
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
mini_tree_layer: L1+L2+L3 (essence + 6-pattern table + 5-step protocol all preserved verbatim — the core discipline)
deep_dive_schedule: |
  - 5-step protocol → APPLY IMMEDIATELY this batch (already cross-referencing EXT-001/EXT-002 instead of duplicating)
  - 6 duplication patterns → S009 — author validate-consolidation.mjs Phase 9 work
  - Single rule → ADOPT NOW as discipline; engrave as B_CONSOLIDATION_PASS contract S009 PCR
priority_for_10_phase_completion: 🔥 EXCEPTIONAL — applies to every Phase 5-10 artifact authored; would prevent comprehensive-guide drift across 10-phase completion
consolidation_cross_refs:
  - EXT-20260505-002-F (rigid-vs-flex composition principle) — composes with §14 of CSP file #3 (when NOT to consolidate)
  - feedback_no_invention_without_precedent.md (memory entry 4) — adjacent discipline (don't invent new where canonical exists)
inherited_from_input:
  - source_type: AI_OTHER
  - risk: low
sla_due:
  routed_for_review: 2026-05-06T04:40:00Z
self_demonstrating: |
  This extract APPLIES Consolidation Pass discipline to itself: cross-references EXT-001-A (PE formula),
  EXT-002-D (D1-D10 catalog), EXT-002-F (rigid-vs-flex) instead of restating their content. CSP file #3's
  meta-recursion (the discipline applying to its own authoring) is CSPS-replicated here.
---

# Extract A — Single rule + 6 duplication patterns + 5-step Consolidation Pass protocol

## Essence (THE CORE DISCIPLINE — HIGH-VALUE EXTRACT)

**The single rule:** each fact lives in ONE canonical home; cross-reference everywhere else. Lists / definitions / rules / examples / procedures all subject to this rule.

**The 5-step Consolidation Pass protocol** (portable as-is to CSPS):
1. **Detect** — grep + structural review for duplicate facts/lists/definitions
2. **Identify canonical home** — pick the natural single source of truth section
3. **Replace duplicates with cross-references** (`see §X` / `see [FILE.md](path) §Y`)
4. **Verify content preserved** — re-read; no information loss; cross-references resolve
5. **Smoke test** — confirm L1/L2/L3 read protocols still work; no broken pointers

**The 6 duplication patterns with severity ranking** (most-drift to least):
1. Pattern A — List duplication (HIGH freq; drift on update; visible only after)
2. Pattern C — Definition duplication (MEDIUM; drift on refactor; subtle accumulates)
3. Pattern B — Rule duplication (MEDIUM; drift on policy change; high-cost late)
4. Pattern D — Example duplication (LOW freq but high-cost per drift)
5. Pattern F — Cross-section reference (LOW; silent drift; only validator-caught)
6. Pattern E — Citation duplication (LOWEST; least drift-prone)

**Heuristic threshold:** ≥3 occurrences of multi-line fact = consolidation candidate. <3 = leave alone (cross-reference cost > duplication cost).

## CSPS current state

- **No formalized consolidation discipline** — CSPS extract notes can drift independently if same concept appears in multiple
- **CSPS already has:** `feedback_no_invention_without_precedent.md` (don't create new) which is adjacent discipline (precedent-check before-create) but NOT consolidation (relocate-existing-duplicates)
- **CSPS topic-plans + element-reviews + comprehensive guides** are at risk of Pattern A/C drift over future months as platform grows
- **CSPS extract notes are at risk** — EXT-001 mentioned 5-element-pattern; EXT-002 §2 mentioned same; without explicit cross-referencing both could drift independently

## Recommended downstream action

**Per save+schedule directive — IMMEDIATE adoption + scheduled engraving:**

1. **IMMEDIATE adoption (this batch already applies):**
   - All EXT-002 + EXT-003 extracts cross-reference EXT-001 instead of duplicating — DONE
   - All EXT-003 extracts cross-reference EXT-002 — DONE
   - No restatement of 5-element-pattern / hooks-replacing-injection / humble-batch / Alignment Round (all already in CSPS)
2. **NEW B_CONSOLIDATION_PASS contract (S009 PCR engraving):** mandates 5-step protocol firing at:
   - Same-batch after every comprehensive guide >500 lines authored
   - At every P-GOV-24-equivalent reassessment (per EXT-001-D extract)
   - At every weekly tag-status-deep-audit (being registered THIS BATCH per directive)
3. **NEW VALIDATOR (CSPS CD-equivalent; week-4 active):** `tools/validators/validate-consolidation.mjs` — grep-based duplicate detection ≥3 occurrences; flags consolidation candidates
4. **EXTEND topic-plan unified-intake.md** — apply consolidation pass to it now (§2 envelope schema description duplicates context already in §1 — minor; clean up THIS batch as demonstration)

## Open questions

- B_CONSOLIDATION_PASS — standalone OR amendment to B_NO_INVENTION_WITHOUT_PRECEDENT (adjacent discipline)?
- Validator implementation — Node.js (CSPS toolchain) OR PowerShell (CSP precedent)?
- Heuristic threshold — adopt CSP's ≥3 OR calibrate?

## Engraving readiness

✅ **DISCIPLINE ALREADY ADOPTED THIS BATCH** (cross-referencing EXT-001/002 instead of duplicating). Formal contract engraving → S009 PCR. Validator → S010-S011 Phase 9.
