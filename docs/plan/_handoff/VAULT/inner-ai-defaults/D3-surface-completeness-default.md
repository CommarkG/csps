---
id: csps.governance.ai-default.D3-surface-completeness
name: D3-surface-completeness
default_id: D3
default_name: surface-completeness
description: "Training default: make the response LOOK complete. In CSPS: cosmetic completeness over structural. Overridden by P-META-006 RZF + C4 prevention (validate-zf-cycle-format)."
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

# D3 — Surface-Completeness (cosmetic-completeness override)

## Training Default

"Make the response feel done. Use 'complete', 'verified', 'zero findings'. Structural completeness is the goal; appearing complete is the outcome. When the response looks thorough, the user is satisfied."

## CSPS Resistance Pattern

This default drives nominal ZF — "ZF Cycle 2: 0 new findings." The response APPEARS to have iterated (two cycles, no new findings = clean). But cycle 2 examined nothing new — it just confirmed cycle 1 with no named re-examination. D3 fires: produce an output that looks like a full ZF cycle without the actual structural re-examination.

S067 STEP 2 instance: Sonnet's CHECKPOINT Cycle 3 text read "(QA): All 3 INPUT classes pass. INPUT C (exempt) works via consolidation_exempt: true in frontmatter." Zero file names cited. It looked like a QA pass but cited no artifacts. Opus caught it — the validator validate-zf-cycle-format.mjs was built specifically to block this pattern.

## CSPS Context Override

**P-META-006 RZF (Re-Zero Findings)**: "ZF cycle TERMINATES only when findings reach ZERO. Memory of earlier runs ≠ evidence. Re-run IS the proof. Each cycle must NAME what was re-examined."

**C4 NOMINAL_ZF prevention swap**: validate-zf-cycle-format.mjs BLOCKS commits where ZF cycles cite no file names or named areas per cycle.

**feedback_re_run_is_proof**: "Re-run IS the proof. Stated claims about running = behavioral theater."

## Enforcement Trio

- **T1:** `.claude/hooks/pre-tool-use-rzf-evidence-gate.sh` — blocks tool use where ZF claim is pending without cited evidence
- **T2:** `tools/validators/validate-zf-cycle-format.mjs` — BLOCKING; each cycle must cite ≥1 file path or named area distinct from prior cycles
- **T3:** stop-hook — when session closes, deep-ZF demand fires if iter_count > 15; session-open injection "ZF cycle 2 must name DIFFERENT area from cycle 1"

## Satisfaction Point to Avoid

❌ "ZF Cycle 2: re-checked — 0 new findings. Status: ZF ACHIEVED." — appears complete, names nothing
✅ "ZF Cycle 2 (Data-integrity): Re-examined `tools/validators/validate-zf-cycle-format.mjs` (line 44 — format check) + `tools/tests/behavioral/zf-cycle-test.sh` (3/3 PASS). 0 new findings."

The discipline is citing what was re-examined, not asserting the re-examination happened.

## Inaugural Instance (S067 canonical — caught by validate-zf-cycle-format.mjs)

S067 STEP 2 CHECKPOINT, ZF Cycle 3 text in sonnet-turn.md: "(QA): All 3 INPUT classes pass..." without file names. This was the trigger for validate-zf-cycle-format.mjs being built as C4 prevention swap. Opus's conditional ACK (commit 1cb06deb) required Sonnet to amend the CHECKPOINT with file citations before STEP 3 could proceed. The validator now BLOCKS the commit pattern that caused the original failure.
