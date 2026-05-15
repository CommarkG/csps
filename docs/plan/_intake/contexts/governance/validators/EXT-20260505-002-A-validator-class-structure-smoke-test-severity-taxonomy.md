---
extraction_id: EXT-20260505-002-A
parent_input_id: EXT-20260505-002
section_label: "§3 Validator class structure + §5 Severity taxonomy + §6 Smoke test discipline"
source_type: AI_OTHER
confidence: 0.95
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T04:35:00Z
pipeline_state: routed
routed_to: governance/validators (new leaf candidate) + tools/validators/* convention extension + audit-runner.md severity convention
next_review_at: 2026-05-06T04:35:00Z
risk: low
trust_tier: external_ai_export
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
mini_tree_layer: L1+L2 (essence + detail; L3 deep-dive deferred to validator-build-out work)
deep_dive_schedule: S010-S011 token-optimization Phase 9 (measurement-validator authoring) — apply 6 commitments + smoke-test discipline + severity taxonomy as authoring template
priority_for_10_phase_completion: HIGH (informs every CSPS validator authored Phase 9-10)
consolidation_cross_refs:
  - EXT-20260505-002-D §11 D1-D10 (smoke-test failure = D2 FAKE_PROGRESS — same file)
inherited_from_input:
  - source_type: AI_OTHER
  - risk: low
  - trust_tier: external_ai_export
sla_due:
  routed_for_review: 2026-05-06T04:35:00Z
scope_level: S1
---

# Extract A — Validator class structure + Smoke test + Severity taxonomy

## Essence (1-3 sentences)

CSP validators are structured artifacts with **6 commitments** (STATEFUL / COMPOSABLE / EXIT-CODED / PIPELINED / SELF-DESCRIBING / GRADUATION-AWARE), all emit color-coded findings (RED/YELLOW/GREEN/INFO/LEGACY) with mechanical exit-code mapping, and are smoke-tested before adoption (recursive: validator runs against its own commit body to catch self-reference regressions). **CSPS has 5 active validators today but no formalized class-structure convention** — every new validator authored Phase 9-10 should follow this 6-commitment + severity + smoke-test pattern.

## Verbatim source quotes

**Validator class structure (§3):**
> "1. STATEFUL — knows its ADVISORY/FAIL_CLOSED window per spec
> 2. COMPOSABLE — invokes sister validators where overlap exists
> 3. EXIT-CODED — 0 PASS / 1 WARN (YELLOW) / 2 FAIL (RED)
> 4. PIPELINED — writes findings to findings_pipeline.json (unless -ReportOnly)
> 5. SELF-DESCRIBING — header comment block declares: authority chain + what it checks + sister composition + usage examples
> 6. GRADUATION-AWARE — declares ratchet eligibility criteria"

**Severity taxonomy (§5):**
> "RED = exit 2 (push blocked) / YELLOW = exit 1 (warning; recoverable) / GREEN = exit 0 (no finding) / INFO = exit 0 (informational) / LEGACY YELLOW = exit 1 if FailOnFindings else 0 (documented expected state)"
> "Bundle thresholds: same_spine_count 5 / total_accumulated 15 / red_severity_any 1 (immediate trigger) / sessions_idle 10"

**Smoke test (§6):**
> "Anti-pattern caught: Authoring validator + declaring BUILT without running it = D2 (FAKE_PROGRESS) disease. Smoke test = mechanical proof of 'BUILT' claim."

## CSPS current state

- **5 active validators** (per pnpm verify): typecheck_recursive / principles_validate / frontmatter_validate / aap_frontmatter_coverage / principle_count_staleness
- **No formalized 6-commitment class structure** — current validators use ad-hoc structure
- **No color-severity taxonomy** in validator output (just PASS/FAIL/DEFERRED-WITH-REASON via tools/verify.mjs JSON)
- **No bundle thresholds** for findings accumulation
- **No formalized smoke-test discipline** — validators may or may not be tested before commit
- **GRADUATION-AWARE concept absent** — validators are either active or deferred (week-4); no ADVISORY → FAIL_CLOSED ratchet path

## Recommended downstream action (PCR-required for engraving)

**Per "extract critical and save it and schedule it to future deep dive" directive — schedule, don't engrave now:**

1. **Schedule deep-dive at S010-S011 token-optimization Phase 9** — when validate-token-budget.mjs (per CSP file #1 §14.6 + memory entry 40 R5 5-mode validator) is authored, apply the 6-commitment structure + smoke-test discipline + severity taxonomy as the template
2. **NEW LEAF candidate (deferred):** `docs/plan/pillar-0-governance/validator-class-structure.md` — CSPS-canonical 6-commitment + severity convention; reference for all future tools/validators/*.mjs authoring
3. **NEW MEMORY (deferred):** feedback_validator_class_structure_six_commitments.md
4. **EXTEND audit-runner.md severity convention** (week-4 active enforcement) — adopt RED/YELLOW/GREEN/INFO/LEGACY emit convention; map to verify.mjs exit codes

## Open questions

- Should CSPS adopt all 6 commitments verbatim, or subset? GRADUATION-AWARE may be over-engineered for week-N CSPS scale.
- Smoke-test discipline: per-validator OR cross-validator suite (CSP has both via mechanical_gap_audit_validator)?
- Bundle thresholds — adopt CSP's specific numbers or recalibrate for CSPS?

## Engraving readiness

⚠️ DEFERRED to S010-S011 deep-dive per user directive. Not engraving now.
