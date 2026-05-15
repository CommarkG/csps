---
extraction_id: EXT-20260505-004-B
parent_input_id: EXT-20260505-004
section_label: "§6 Mechanical-creation discipline (5-step process; placeholders allowed)"
source_type: AI_OTHER
confidence: 0.97
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T05:05:00Z
pipeline_state: routed
routed_to: tools/templates/governed-artifact-frontmatter.template.md (NEW; CSPS analog of CSP CD-097) + .claude/hooks/pre-tool-use-depth-marker-creation-gate.sh (NEW stub) + B_TEMPLATE_FIRST_CREATION composition + token_budget_validator Mode 6 CSPS analog
next_review_at: 2026-05-06T05:05:00Z
risk: low
trust_tier: external_ai_export
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
mini_tree_layer: L1+L2 (essence + 5-step process)
deep_dive_schedule: S009 IMMEDIATELY (depth-marker creation gate must exist BEFORE Phase 6 authors new artifacts)
priority_for_10_phase_completion: 🔥 HIGH — without mechanical creation gate, Phase 6 subagent templates + Phase 7 file splits will accumulate without depth markers (Gap #2 from CSP file #4 §3)
consolidation_cross_refs:
  - feedback_universal_template_first.md (memory entry 29) — CSPS B_TEMPLATE_FIRST_CREATION already mandates template-discovery before authoring; this extends with depth-marker-required template
  - EXT-20260505-002-F (file_depth_markers immediate adoption) — this extract makes the adoption MECHANICAL not voluntary
inherited_from_input:
  - source_type: AI_OTHER
  - risk: low
sla_due:
  routed_for_review: 2026-05-06T05:05:00Z
scope_level: S1
---

# Extract B — Mechanical-creation discipline with placeholders

## Essence (THE STRUCTURAL PREVENTION MECHANISM FOR DEPTH-MARKER ADOPTION)

CSP file #4 §6 details a **5-step mechanical-creation process** ensuring every artifact gets depth markers at authoring time — **with placeholders allowed**. Placeholder pattern (`l1_lines: TBD-S{N}`) is acceptable; absence is not. **This solves the chicken-and-egg problem of "structure isn't stable yet so can't declare real markers" — declare placeholders now; mechanical validator forces backfill within N sessions.**

## Verbatim source — 5-step process (§6)

> "**Step 1 — Frontmatter template at creation time:** Every new artifact starts from a template that pre-includes `depth_levels_invoked: [TBD-author-fill]` + `depth_tier_authored: [TBD-author-fill]` + `file_depth_markers: { l1_lines: 'TBD-author-fill', ... }` (REQUIRED if >300 lines).
>
> **Step 2 — Pre-push hook check:** for every new file authored in commit, if file > 300 lines AND missing file_depth_markers → finding YELLOW (ADVISORY initially).
>
> **Step 3 — Author fills placeholders before content stabilizes:** at first refactor / first reassessment, placeholders MUST be filled with real values.
>
> **Step 4 — Validator catches stale placeholders:** validator flags artifacts with file_depth_markers fields containing `TBD-` patterns AND age >5 sessions. Forces backfill.
>
> **Step 5 — Bundling orchestrator consumes real values:** once placeholders are real values, PE.read_budget starts using them for energy optimization."

**Why placeholders OK:**
> "Content structure isn't stable until first refactor. Pre-stabilization, real depth markers would be wrong. Placeholders signal 'depth discipline acknowledged; values pending stabilization.'"

## CSPS current state

- **B_TEMPLATE_FIRST_CREATION** (P-META-015) ratified S006; mandates templated discovery gate before authoring → composes directly with this discipline
- **CSPS has 7 templates** at `tools/templates/` — none currently include depth-marker frontmatter
- **No pre-push hook** for depth marker creation gate — adjacent stubs exist (frontmatter-enum-check; skill-aap-required)
- **No "TBD-S{N}" placeholder pattern** in CSPS yet — would be a new lifecycle convention

## Recommended downstream action

**Per save+schedule directive — Schedule S009 IMMEDIATE engraving (foundation for Phase 6+):**

1. **NEW TEMPLATE (S009 — atomic with Extract A):** `tools/templates/governed-artifact-frontmatter.template.md` — pre-includes depth-marker fields with TBD-S008 placeholders + read_protocol field; cross-references depth-discipline.md canonical leaf
2. **NEW HOOK STUB (S009 — same batch):** `.claude/hooks/pre-tool-use-depth-marker-creation-gate.sh` — fires on Write of governed artifacts; warns if >300 lines + missing file_depth_markers; STUB tier (week-4 active)
3. **EXTEND validate-frontmatter.mjs** (Phase 9 work) — adds Mode 6 file_depth_markers compliance + placeholder-staleness detection (TBD-S<NNN> pattern + age >5 sessions)
4. **EXTEND B_TEMPLATE_FIRST_CREATION** with subsection: "every governed artifact created from template MUST include depth-marker fields per depth-discipline.md; placeholders allowed for unstable content; validator forces backfill within 5 sessions"
5. **EXTEND existing templates** (gradual-build-plan / governor-prompt-entry / chat-jump-prompt / memory-entry / etc.) with depth-marker fields — backfill at next template touch (counter-case 6: don't bulk-backfill mid-evolution)

## Open questions

- 300-line threshold from CSP — adopt verbatim or CSPS-calibrate?
- 5-session staleness window — adopt verbatim or longer (CSPS slower cadence than CSP)?
- TBD-S{N} placeholder format — adopt verbatim or `_pending: true` boolean?
- Pre-push hook OR pre-tool-use? Pre-tool-use catches AI-authored; pre-push catches commit-time. Maybe both layers?

## Engraving readiness

🔥 **HIGH — S009 PCR ENGRAVING (atomic with Extract A — depth-discipline.md leaf authoring).** This extract is the structural-prevention mechanism that makes Extract A actually adopted. Without mechanical creation gate, depth discipline stays at ~3% adoption forever (per CSP file #4 §3 Gap #2 evidence).
