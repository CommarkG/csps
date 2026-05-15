---
extraction_id: EXT-20260505-001-D
parent_input_id: EXT-20260505-001
section_label: "§9 Reassessment triggers (P-GOV-24 — CONSTITUTIONAL CANDIDATE)"
source_type: AI_OTHER
confidence: 0.95
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T03:55:00Z
pipeline_state: routed
routed_to: governance/reassessment (new leaf candidate) + B_GRADUAL_BUILD_BY_FOUNDATIONS amendment + P-META-019 B_STRUCTURAL_PREVENTION composition
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

# Extract D — 7 reassessment triggers (P-GOV-24)

## Essence

CSP enumerates **7 explicit triggers** that mandatorily fire reassessment (re-PCR locked decisions; re-rank backlog): CC ratification / phase GRADUATED / SB blast≥MEDIUM landed / constitutional flag flip / multi-session plan checkpoint / consecutive blocker / Governor explicit invocation. **CSPS has implicit reassessment in B_GRADUAL_BUILD per-layer ZF gates but NO enumerated-trigger list and NO reassessment-log.**

## Verbatim source quote

> "The principle: every 'absolute' or 'locked' decision is correct WITHIN A BAND of context. At significant-progress milestones, reassessment is REQUIRED — re-fire PE, reopen locked decisions, surface revisions."
>
> "Action protocol when triggered: re-fire PE on full backlog · reopen locked decisions (no decision is permanently locked at band boundary) · surface revisions to Governor with PCR · update REASSESSMENT_LOG.md."
>
> "Sister contracts: B_TENSION_TRIAGE (forward) + B_REG_BACKLOG (retroactive) + B_REASSESS / P-GOV-24 (continuous) + B_SITUATION_TEMPLATE (anticipatory) — tridirectional + anticipatory package."

## CSPS current state

- **B_GRADUAL_BUILD_BY_FOUNDATIONS** (P-META-016) — per-layer ZF gate is the only structured reassessment trigger
- **§10.0j enhancement-proposals** at session-close (B_STRUCTURAL_PREVENTION_DISCIPLINE Q-2) — partial reassessment (catches K=2 patterns but doesn't re-rank backlog)
- **HPFA whole-session walk** (B_HANDOFF_PRE_FLIGHT_AUDIT) — at session-close only, not mid-session
- **NO REASSESSMENT_LOG.md analog** in CSPS

## Recommended downstream action

**MEDIUM-LEVERAGE engraving candidate** (PCR-required):

1. **CSPS-adapted 5 triggers** (subset of CSP's 7; matches CSPS DNA without CC concept):
   - (1) Topic-plan layer transition (L<N>→L<N+1>) — extends B_GRADUAL_BUILD ZF gate
   - (2) Multi-session topic-plan checkpoint
   - (3) Constitutional principle/contract amendment (P-* / B_* engraving 5/5 atomic)
   - (4) Consecutive blocker (BLK-S<NNN>-* repeated 3x)
   - (5) User explicit reassessment directive
2. **NEW LEAF:** `docs/plan/pillar-0-governance/reassessment-triggers.md` (CSPS-canonical)
3. **NEW LEDGER:** `docs/plan/_handoff/VAULT/reassessment-log.md` (cross-session reassessment audit trail)
4. **EXTEND** B_GRADUAL_BUILD with reassessment-trigger subsection
5. **NEW HOOK STUB:** `.claude/hooks/post-stop-reassessment-trigger-detector.sh` — week-4 active enforcement

## Open questions

- Are CSP's 7 triggers fully transplantable, or do CSPS-specific ones need substitution (e.g., CSP's "CC ratification" → CSPS's "topic-plan layer transition")? [Recommendation: 5 CSPS triggers above]
- Should reassessment-log be markdown (pre-runtime) or DB-backed (post-runtime per build-order.md week-4+)?
- Does CSPS need the "B_TENSION_TRIAGE / B_REG_BACKLOG / B_SITUATION_TEMPLATE" sister-contract package? [Recommendation: defer; CSPS has B_HANDOFF_PRE_FLIGHT_AUDIT covering similar ground]

## Engraving readiness

⚠️ READY FOR PCR. Compounds with B_GRADUAL_BUILD; ratifying as standalone vs amendment is the PCR question.
