---
extraction_id: EXT-20260505-001-F
parent_input_id: EXT-20260505-001
section_label: "§13 80/10/10 session rule + §10 4-pillar balance metric"
source_type: AI_OTHER
confidence: 0.92
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T03:55:00Z
pipeline_state: routed
routed_to: governance/token-optimization (B_TOKEN_BUDGET extension) + cross-cutting (P-ARCH-028 5 Core Spines pillar-mapping consideration)
next_review_at: 2026-05-05T04:30:00Z
risk: low
trust_tier: external_ai_export
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
inherited_from_input:
  - source_type: AI_OTHER
  - risk: low
  - trust_tier: external_ai_export
sla_due:
  routed_for_review: 2026-05-05T04:30:00Z
  pcr_decision: 2026-05-06T03:55:00Z
scope_level: S1
---

# Extract F — 80/10/10 session phase rule + 4-pillar balance metric

## Essence (TWO related but separable patterns)

**Pattern 1 — 80/10/10 session phase budget:** Build 80% / Cleanup 10% / Close 10%. Per-batch pace 5-10%. PE drives phase math; auto-detection shifts AI from build → cleanup at context budget threshold. **5% absolute floor.** Direct fit for **B_TOKEN_BUDGET extension** — adds phase-aware compaction recommendations to R3 (currently fires only at IMPL_BATCH boundary).

**Pattern 2 — 4-pillar balance metric** (CONTEXT/GOVERNANCE/TIMING/INTEGRITY):** Each spine maps to a pillar; PE_CONTEXT_BRIEF surfaces distribution (e.g., "GOVERNANCE 77% over-indexed"). **Less direct fit for CSPS** — CSPS uses 5 Core Spines (GVRN/ARCH/AI/OPER/VALD) as primary categorization; 4-pillar layer would be cross-cutting addition.

## Verbatim source quotes

**80/10/10:**
> "Per Governor S317 PERMANENT (P-GOV-9 amendment):
> - Build 80% — Primary build + multi-session-plan execution
> - Cleanup 10% — Phase 3 cleanup gaps + RED-clearing
> - Close 10% — Phase 4 BATCH_CLOSE + handoff
>
> Per-batch pace: 5-10% (8-16 batches per session normal).
>
> PE drives the phase math. When context budget enters cleanup territory (10-20% remaining), PE recommends shifting from Band 1 build work to Band 2 cleanup items + RED finding clearance.
>
> 5% absolute floor: never proceed into substantive work below 5% remaining. Force B_CLOSE protocol."

**4-pillar balance:**
> "4 canonical pillars — CONTEXT / GOVERNANCE / TIMING / INTEGRITY.
> Pillar derivation from primary spine (via SPINE_TO_PILLAR_MAPPING.md):
> - ARCH → CONTEXT
> - CNST → GOVERNANCE
> - GVRN → GOVERNANCE
> - OPER → TIMING
> - VALD → INTEGRITY
> ...
> If 77% of work is GOVERNANCE-pillar, the platform is over-indexing on governance vs other concerns."

## CSPS current state

**80/10/10 analog in CSPS:**
- B_TOKEN_BUDGET R3 (S007 turn 4) — `/compact` at IMPL_BATCH boundary; no phase-percentage discipline
- B_TOKEN_BUDGET R4 — `/clear` between unrelated tasks; no per-session phase math
- AGENTS.md L137 — "Cardinal: tokens are INVESTMENT in reasoning quality, NOT budget to minimize"
- **NO 80/10/10 phase split, NO 5% absolute floor mechanism**

**4-pillar balance analog in CSPS:**
- P-ARCH-028 5 Core Spines (GVRN/ARCH/AI/OPER/VALD) with precedence GVRN > VALD > ARCH > AI > OPER
- Spines are categorization not balance-metric
- **NO pillar-balance dashboard or audit**

## Recommended downstream action

**For 80/10/10 (HIGH-VALUE EXTRACT):**

1. **EXTEND B_TOKEN_BUDGET with R6 (Phase-Aware Budget):** Build 80% / Cleanup 10% / Close 10% with 5% absolute floor. Couples R6 to R3 (compact triggers shift toward cleanup at context-budget threshold)
2. **NEW HOOK STUB:** `.claude/hooks/post-tool-use-context-budget-check.sh` — week-4 detects context-budget %, surfaces "phase: build/cleanup/close" recommendation to AI
3. **EXTEND** `tools/measure-token-cost.mjs` with phase tracking (per-batch tokens consumed; phase prediction)

**For 4-pillar balance (LOWER-PRIORITY EXTRACT):**

4. **DEFER** CSPS pillar-balance system. Reasoning: CSPS already has 5 Core Spines doctrine (P-ARCH-028) as primary categorization; adding 4 cross-cutting pillars layer = dual-categorization complexity. Could be revisited if CNST/GVRN split decision (ADR-0025 candidate) ratifies a pillar-style cross-spine mapping
5. **MEMORY ENTRY** of CSP-precedent if user wants the option preserved

## Open questions

- 80% Build / 10% Cleanup / 10% Close — does CSPS need exactly these percentages or different (e.g., higher Cleanup% given week-4 audit-runner not yet shipping)?
- Should 5% absolute floor be HARD enforcement (hook blocks tool calls below 5%) or SOFT recommendation?
- 4-pillar balance: explicit reject (defer indefinitely) or accept-with-CSPS-adaptation (e.g., pillar names matching CSPS 5 spines)?

## Engraving readiness

- **80/10/10:** ✅ READY FOR L1+ engraving (low blast; extends existing B_TOKEN_BUDGET; CSPS infrastructure ready)
- **4-pillar balance:** ❌ NOT READY (CSPS-divergence too costly; 5-spine system is current canonical)
