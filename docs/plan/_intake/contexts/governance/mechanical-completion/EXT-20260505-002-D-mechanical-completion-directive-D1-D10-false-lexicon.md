---
extraction_id: EXT-20260505-002-D
parent_input_id: EXT-20260505-002
section_label: "§9 'false' lexicon + §10 5 known false-positive classes + §11 MECHANICAL_COMPLETION_DIRECTIVE + D1-D10 counter-default catalog"
source_type: AI_OTHER
confidence: 0.98
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T04:35:00Z
pipeline_state: routed
routed_to: behavioral-contracts.md (B_VALIDATE_BEFORE_ASSUME extension + B_RZF amendment) + memory entries (D1-D10 catalog) + new mechanical-completion-directive template
next_review_at: 2026-05-06T04:35:00Z
risk: low
trust_tier: external_ai_export
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:draft
mini_tree_layer: L1+L2+L3 (essence + detail + full D1-D10 catalog preserved verbatim)
deep_dive_schedule: S009 turn 1 — D1-D10 catalog reviewed against CSPS existing AGENTS.md hard NOs + memory entries; OR same-session-engraving-candidate per user PCR
priority_for_10_phase_completion: 🔥 EXCEPTIONAL — D1-D10 directly map to AI failure modes I exhibit; mechanical-completion-directive PATTERN solves the "phases declared done without all 5 surfaces shipped" failure mode
consolidation_cross_refs:
  - feedback_validate_before_assume.md (memory entry 3) — CSPS analog of CSP "false ZF-0" + "false ratification"
  - feedback_re_run_is_proof.md (memory entry 7) — CSPS RZF mechanism
  - feedback_five_surface_engraving.md (memory entry 14) — CSPS 5-surface pattern; D6 catalog entry directly applies
  - feedback_protocol_compression_is_skipping.md (memory entry 11) — CSPS analog of D2 FAKE_PROGRESS
  - feedback_catch_to_engraving.md (memory entry 13) — CSPS analog of D7 + D8
inherited_from_input:
  - source_type: AI_OTHER
  - risk: low
sla_due:
  routed_for_review: 2026-05-06T04:35:00Z
---

# Extract D — MECHANICAL_COMPLETION_DIRECTIVE pattern + D1-D10 counter-default catalog + "false" lexicon + 5 FP classes

## Essence (HIGHEST-VALUE EXTRACT IN EXT-002)

CSP catalogs **10 universal AI failure modes (D1-D10)** with paired counter-defaults — these are the systematic ways AI agents subvert mechanical-completion discipline. Plus the **MECHANICAL_COMPLETION_DIRECTIVE pattern** — when Governor catches a class-level gap repeatedly, a written directive enforces mechanical closure with all gaps enumerated + per-gap completion specs + counter-default catalog + mandatory protocol. Plus the **"false" lexicon** (false-positive / context-FP / false-ZF-0 / false-ratification / FAKE_PROGRESS). Plus **5 known false-positive classes** with mitigation templates. **CSPS partially has these via scattered memory entries** but no consolidated D1-D10 catalog + no MECHANICAL_COMPLETION_DIRECTIVE pattern + no 5 FP classes named.

## Verbatim source quotes — D1-D10 catalog (preserved L3 deep-dive)

| # | AI default failure | Counter-default |
|---|---|---|
| **D1** | Time-pressure → declare schema, defer validator | Mechanical-completion is FIRST batch; do FEWER things FULLY |
| **D2** | Doctrine-completion-feels-like-completion | BATCH_CLOSE checklist requires 5-element-pattern citation |
| **D3** | Sequential not parallel | Author all 5 elements same humble batch |
| **D4** | Governor-said-mechanical-so-call-it-mechanical | All 4 conditions required: validator runs + emits findings + wired hook + not blocked |
| **D5** | Continuity-bias (replicate prior patterns without question) | At every CD authoring: ask "is this required to enforce anything?" |
| **D6** | 5-element-pattern as checklist not gate | Refuse `BUILT` unless all 5 verified end-to-end |
| **D7** | Honest-acknowledgment-substitutes-for-mechanical-fix | Honest acknowledgment + completion deadline required |
| **D8** | Future-session-defer-default | Register completion debt with target session + auto-fire mechanical reminder |
| **D9** | Cite-honesty-in-prose-substitutes-for-data-correction | Every cite-honesty observation produces CD-NNN entry |
| **D10** | Patched-because-Governor-asked-not-fully-fixed | Distinguish respond-to-question from close-the-class-gap |

## Verbatim source quotes — 5 known FP classes

> "Class 1 Documentation context: Validator flags retired token IN A DOC that documents what's retired → Line-level scan ±2 lines for documentation indicators
> Class 2 Path-prefix vs entity-ID: Lowercase entity ID in file path is convention not violation → Path-prefix exclusion regex
> Class 3 Multi-line vs single-line regex: Pattern matches across lines unintentionally → Multi-line flag (?m) discipline
> Class 4 Brace escape: Curly braces in regex requiring escape for literal match → ripgrep-pattern documentation in tool prompts
> Class 5 Validator-on-validator self-reference: Validator's own commit body / frontmatter triggers its own checks → Same documentation-context exclusion as Class 1"

## CSPS current state

**Already in CSPS (cross-reference; don't duplicate):**
- D2 FAKE_PROGRESS analog → `feedback_protocol_compression_is_skipping.md` (memory entry 11)
- D6 5-element-as-checklist analog → `feedback_five_surface_engraving.md` (memory entry 14)
- D7 honest-ack-substitutes analog → `feedback_catch_to_engraving.md` (memory entry 13)
- D8 future-session-defer analog → `feedback_catch_to_engraving.md` "default-to-engrave when uncertain"
- "False ZF-0" analog → `feedback_re_run_is_proof.md` (memory entry 7) "every DONE/COMPLETE/RATIFIED claim cites a THIS-SESSION validator output"

**NEW for CSPS (worth engraving):**
- D1 + D3 + D4 + D5 + D9 + D10 not in CSPS catalog
- MECHANICAL_COMPLETION_DIRECTIVE pattern (template + recursive self-audit) — high-value pattern
- 5 known FP classes — all 5 are real CSPS-applicable (especially Class 1 documentation-context which my own extraction notes risk triggering)

## Recommended downstream action

**Per "extract critical and save it and schedule it to future deep dive" — schedule comprehensive engraving:**

1. **NEW MEMORY (defer to S009 turn 1):** `feedback_d1_d10_counter_default_catalog.md` — full 10-failure-mode catalog as AI-self-monitoring guide
2. **NEW LEAF candidate (defer):** `docs/plan/pillar-0-governance/false-positive-classes.md` — 5 known FP classes with mitigation templates; mandatory consultation before authoring any new validator
3. **NEW TEMPLATE candidate (defer):** `tools/templates/mechanical-completion-directive.template.md` — for when Governor catches class-level gap
4. **EXTEND existing memory entries** with D-N cross-references (memory entries 11/13/14 + 7 should mention D2/D6/D7/D8 mappings)
5. **EXTEND B_VALIDATE_BEFORE_ASSUME** with "false" lexicon awareness (false-ZF-0 / false-ratification specifically named)

## Open questions

- D1-D10 vs CSPS existing memory: 6 entries already cover D2/D6/D7/D8/false-ZF-0; engrave the 4 missing (D1/D3/D4/D5/D9/D10) OR adopt full 10 as canonical?
- MECHANICAL_COMPLETION_DIRECTIVE pattern: proactive (when Governor flags) OR reactive (CSPS-internal use only)?
- 5 FP classes: dedicated leaf OR subsection of validator-class-structure leaf (Extract A)?

## Engraving readiness

🔥 **HIGH-LEVERAGE — RECOMMEND PCR FOR S009.** D1-D10 catalog is universal AI failure-mode mapping; mechanical-completion-directive solves the Phase 5-10 completion-debt risk directly. Worth opening as standalone S009 element-review.
