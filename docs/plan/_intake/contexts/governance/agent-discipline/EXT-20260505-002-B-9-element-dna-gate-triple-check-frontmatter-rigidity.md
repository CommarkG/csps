---
extraction_id: EXT-20260505-002-B
parent_input_id: EXT-20260505-002
section_label: "§8 Frontmatter rigidity + §12 9-element DNA gate + §13 Triple-check protocol + §22 Auxiliary DNA / Full DNA Coverage Audit"
source_type: AI_OTHER
confidence: 0.97
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T04:35:00Z
pipeline_state: routed
routed_to: B_AGENT_ALIGNMENT_PROTOCOL extension + AAP frontmatter spec + skill/template/hook authoring discipline
next_review_at: 2026-05-06T04:35:00Z
risk: low
trust_tier: external_ai_export
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
mini_tree_layer: L1+L2 (essence + recommended adaptation; L3 deep-dive at AAP retrofit)
deep_dive_schedule: S009-S010 — when authoring next skills/hooks/agents, OR when retrofitting existing 16 SKILL.md (currently AAP-aligned per validate-aap-frontmatter.mjs but NOT yet 9-element-DNA-gated)
priority_for_10_phase_completion: HIGH (Phase 6 subagent + Haiku tiering authoring will need DNA gate)
consolidation_cross_refs:
  - feedback_agent_alignment_protocol.md (memory entry 27) — CSPS B_AGENT_ALIGNMENT_PROTOCOL is the parent discipline
  - feedback_skill_location_wildcard_prevention.md (memory entry 42) — multi-location SKILL.md coverage S007 §24+
  - feedback_no_invention_without_precedent.md (memory entry 4) — CSP DNA gate IS the precedent for CSPS extension
inherited_from_input:
  - source_type: AI_OTHER
  - risk: low
sla_due:
  routed_for_review: 2026-05-06T04:35:00Z
---

# Extract B — 9-element DNA gate + Triple-check + Frontmatter rigidity + Full DNA Coverage Audit

## Essence (1-3 sentences)

CSP enforces a **9-element DNA gate** on every skill / subagent template / hook script / external-input artifact (vocab / naming / SCHEMA / core_spines / spheres-RETIRED / pillars / principles / depth_levels / PE / + LAYER bonus 10th), validated at **3 lifecycle points** (Pre-adoption / Mid-implementation / Post-implementation per P-GOV-24 reassessment), enforced via **rigid frontmatter** (YAML fields validators read mechanically). **CSPS already has B_AGENT_ALIGNMENT_PROTOCOL** (P-META-010) covering 7 fields per SKILL.md frontmatter — needs **extension to 9-element DNA gate + triple-check** for stronger pre-adoption + drift detection.

## Verbatim source quotes

**9-element DNA gate (§12):**
> "Every skill / subagent template / hook script / external-input artifact MUST pass a 9-element gate before adoption. The 9 elements: vocab / naming / SCHEMA / core_spines / spheres-RETIRED / pillars / principles / depth_levels / PE / +LAYER (10th)."

**Triple-check (§13):**
> "CHECK 1: Pre-adoption — BEFORE artifact registered. CHECK 2: Mid-implementation — first 5 invocations after registration. CHECK 3: Post-implementation — at each P-GOV-24 reassessment checkpoint."
> "Skipping Check 1 → freestyle violation per feedback_no_ai_freestyle_csp_context_main_spine"

**Full DNA Coverage Audit (§22):**
> "For every major artifact (especially comprehensive guides, plans, CCs), explicitly map the artifact against ALL DNA elements (primary + auxiliary). Missing references = silent gap."

## CSPS current state

- **B_AGENT_ALIGNMENT_PROTOCOL (P-META-010)** ratified S005 turn 25; mandates 7 frontmatter fields per SKILL.md (csps_aligned + aap_version + agent_class + acknowledged_contracts + respects_quality_gates + output_contract + trust_tier)
- **S007 §24+ multi-location coverage amendment** — validator scans 16 SKILL.md (packages/skills/ + .claude/skills/) all PASS
- **No 9-element gate** — CSPS AAP frontmatter is 7 fields not 9
- **No triple-check protocol** — Pre-adoption check IS via validate-aap-frontmatter.mjs; Mid + Post checks NOT formalized
- **Frontmatter rigidity STRONG** in CSPS — closed-enum drift K=2 fix S007 turn 5 + frontmatter-closed-enums.md canonical reference
- **Full DNA Coverage Audit absent** — comprehensive guides like AGENTS.md / topic-plans don't have explicit DNA-coverage audit blocks

## Recommended downstream action

**Per "schedule for future deep dive" directive — propose engraving plan:**

1. **EXTEND B_AGENT_ALIGNMENT_PROTOCOL** with 2 additional DNA elements (CSPS-adapted from CSP's 9):
   - Add `principle_compliance` (acknowledges P-META-* compliance per [P-META-002 principles-travel-with-artifacts](../../../../packages/principles/principles.yaml))
   - Add `consolidation_cross_refs` (per CSP file #3 single-rule discipline; lists prior artifacts that overlap)
   - Defer `spheres-RETIRED` element (CSP-specific concept; CSPS doesn't have spheres)
2. **NEW Triple-check sub-protocol** added to B_AAP — Check 1 already covered; add:
   - Check 2 (Mid-implementation): when AAP-aligned skill is invoked first 5 times, log to `_handoff/VAULT/skill-invocation-log/S<NNN>.jsonl`
   - Check 3 (Post-implementation): at every P-GOV-24-equivalent reassessment (per EXT-20260505-001-D), re-fire validate-aap-frontmatter on full skill set
3. **Full DNA Coverage Audit** as new §22-equivalent block in CSPS comprehensive-guide template — mandatory section per gradual-build-plan.template.md
4. **Schedule:** S009-S010 deep-dive at next skill/hook authoring batch (Phase 6 subagent tiering work needs this)

## Open questions

- 9 elements minus CSPS-N/A = 7-8 elements; final count needs PCR
- Triple-check Mid-implementation requires invocation logging — settings.json hook OR Claude Code feature; defer until L3 router (unified-intake L3)
- Full DNA Coverage Audit — make it a checklist OR a new validator?

## Engraving readiness

⚠️ DEFERRED to S009-S010 deep-dive (Phase 6 subagent tiering work). Foundation: this extract + EXT-20260505-001-C (7 invocation points) + EXT-20260505-001-E (route_to envelope field).
