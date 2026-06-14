---
id: csps.governance.ai-default.D5-single-pass
name: D5-single-pass
default_id: D5
default_name: single-pass
description: "Training default: write one good response and resist re-iteration. In CSPS: cycle 2 '0 new' without genuine re-examination. Overridden by Q1 multi-lens ZF + deep iteration mandate."
ratified_session: S067
inherits_from: "P-META-029 + B_HUMBLE_CONSOLIDATION_DISCIPLINE"
core_spine: AI
schema_anchor: inner-ai-defaults
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
links:
  - rel: principle
    href: ../../../principles/P-META-029-humble-consolidation-discipline.md
  - rel: contract
    href: ../../pillar-0-governance/behavioral-contracts/B_HUMBLE_CONSOLIDATION_DISCIPLINE.md
---

# D5 — Single-Pass (resist-re-iteration override)

## Training Default

"One thoughtful response is the goal. Iteration signals uncertainty. Write a complete answer the first time. If asked to check again, acknowledge the prior answer was correct. Re-examination = wasted computation."

## CSPS Resistance Pattern

This default makes ZF Cycle 2 nominal. The AI produces Cycle 1 with genuine findings. Then D5 fires: "I already looked — the answer is the same. Cycle 2: 0 new findings." But Cycle 2 examined the SAME area as Cycle 1 with no distinct axis. The AI resists genuine re-examination because single-pass is the training-optimal behavior.

S067 STEP 2 CHECKPOINT: Cycle 3 "(QA): All 3 INPUT classes pass." This was D5 firing — Cycle 3 examined the same INPUT A/B/C from Cycle 1 without a distinct lens (Cycle 1=Architecture, Cycle 2=AI-Pairing). Cycle 3 should have examined a different axis (QA = specific behavioral test edge case). Opus caught it.

## CSPS Context Override

**Q1 multi-lens ZF (S067)**: "3-lens default, 6-CAI at SEAL, deep iteration." Each cycle examines a DIFFERENT axis from prior cycles. Cycle count is MEASUREMENT not TARGET — termination is findings-driven, not predetermined.

**D5 override rule**: ZF cycle N must name what SPECIFIC area/lens/file was examined — distinct from what cycles 1 through N-1 examined. "Same area, 0 new findings" = D5 firing.

**feedback_cycle_count_is_measurement**: "for both RZF and CEC, cycle count is data of how iteration-rich the work was; termination is findings-driven not predetermined."

## Enforcement Trio

- **T1:** stop-hook — when AI claims ZF with fewer than 3 lenses on substantive work, deep-ZF demand fires
- **T2:** `tools/validators/validate-zf-cycle-format.mjs` — BLOCKING; validates that each cycle cites a distinct named area/file not mentioned in prior cycles
- **T3:** session-open injection — "D5 override: ZF cycle 2 MUST examine a DIFFERENT axis from cycle 1. Name the specific file or domain examined."

## Satisfaction Point to Avoid

❌ "ZF Cycle 2: re-examined — 0 new findings. ZF ACHIEVED." — same area re-labeled, D5 satisfied
✅ "ZF Cycle 2 (Data-integrity lens): Re-examined `tools/data/improvement-register.yaml` entries with prevention_class field (15 patched). Distinct from Cycle 1 (Architecture lens: validator + migration script structure). 0 new findings."

## S084 Extension — PROVENANCE LABELS (P-META-032 amendment)

D5 drives provenance skipping at the completion step: after declaring a result, AI doesn't re-derive the supporting numbers (single-pass). A value from prior session gets re-stated as current without re-measurement. The fix: `[ASSUMED]` label on any carried value forces the receiver to decide if they need `[MEASURED]` evidence. D5 fires when "I checked earlier" substitutes for "I ran the tool this turn." Cross-ref: P-META-032 provenance_labels_clause (S084 amendment) + IZFC (each cycle must be a fresh angle, not a D5 re-statement).

## Inaugural Instance (S067 STEP 2 — validate-zf-cycle-format.mjs origin story)

STEP 2 CHECKPOINT ZF Cycle 3: "(QA): All 3 INPUT classes pass. INPUT C (exempt) works via consolidation_exempt: true in frontmatter." No file names. This was D5 + D3 combined: Cycle 3 didn't examine a new axis (D5 = single-pass) and cited nothing concrete (D3 = surface-completeness). Opus's conditional ACK made fixing this the unlock condition for STEP 3. validate-zf-cycle-format.mjs was born from this incident — it is the mechanical override of D5.
