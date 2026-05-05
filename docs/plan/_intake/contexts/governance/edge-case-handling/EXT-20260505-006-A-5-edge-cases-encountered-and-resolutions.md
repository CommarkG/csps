---
extraction_id: EXT-20260505-006-A
parent_input_id: EXT-20260505-006
section_label: "§2 5 specific edge cases encountered + resolutions (operational catalog)"
source_type: AI_OTHER
confidence: 0.95
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T05:35:00Z
pipeline_state: routed
routed_to: governance/edge-case-handling (new leaf) + composition with B_PROFESSIONAL_VOICE + B_PRE_CLOSE_VERIFICATION
next_review_at: 2026-05-06T05:35:00Z
risk: low
trust_tier: external_ai_export
tags: [domain:governance, domain:ops, type:reference, audience:ai-agent, audience:developer, maturity:draft]
mini_tree_layer: L1+L2 (5 cases each L1 essence + L2 resolution detail)
deep_dive_schedule: REFERENCE-ONLY (operational catalog; consult when edge case appears)
priority_for_10_phase_completion: MEDIUM (operational; informs how Phase 5-10 work navigates friction)
consolidation_cross_refs:
  - feedback_diff_before_protected_path_writes.md (THIS BATCH; Pattern A engraved CSPS-immediate)
  - feedback_no_settings_edits_unless_asked.md (memory entry 38; analog of Pattern G)
inherited_from_input: [source_type:AI_OTHER, risk:low]
---

# Extract A — 5 specific edge cases + resolutions (operational catalog)

## Essence (CSP-HISTORICAL CASES; CSPS-FORWARD REFERENCE)

CSP encountered + resolved 5 specific edge cases during S336-S337-prep work. CSPS catalog for forward-going pattern recognition:

| # | CSP Edge Case | CSPS-Applicable Resolution |
|---|---|---|
| 1 | Pre-push gate block (BATCH_CLOSE token absence) | CSPS analog: pnpm verify gate; same principle (mid-session pushes need explicit override OR run full verify) |
| 2 | Bash hook intercepting compound `git commit && git push` | CSPS-applicable: separate steps; verify commit landed before push |
| 3 | `/tmp` path inaccessible to git on Windows | CSPS-applicable: use local relative-path temp files (`.tmp` suffix); already CSPS practice via HEREDOC pattern |
| 4 | PowerShell em-dash parser error | CSPS-applicable: ASCII-only in PS scripts; em-dash (`—`) → `--` if present |
| 5 | CD-087 surface_path regression caught at S336 close | CSPS analog: B_PRE_CLOSE_VERIFICATION already mandates pnpm verify exit_code 0; close-cycle catches IS gift discipline |

## Recommended downstream action

**Reference-only operational catalog.** No new engraving needed. When AI encounters edge case during work:
1. Check this catalog first
2. Apply documented resolution
3. If new pattern → engrave as new memory entry per `feedback_catch_to_engraving.md` (memory entry 13)

## Engraving readiness
⚠️ REFERENCE-ONLY. No new engraving. Pattern A from §3 (sister extract B) already engraved this batch.
