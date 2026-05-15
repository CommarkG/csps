---
extraction_id: EXT-20260505-001-B
parent_input_id: EXT-20260505-001
section_label: "§4 IMPL_IN_PROGRESS boost (completion debt prioritization)"
source_type: AI_OTHER
confidence: 0.98
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T03:55:00Z
pipeline_state: routed
routed_to: governance/priority-engine + B_GRADUAL_BUILD_BY_FOUNDATIONS amendment OR new B_COMPLETION_DEBT_PRIORITIZATION + P-OP-002 FWWS extension
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

# Extract B — IMPL_IN_PROGRESS_boost (completion debt prioritization)

## Essence

CSP applies a **+1.5 to +3.0 additive boost** to items already under active implementation, mechanically enforcing "completion is top priority over new work" per Governor S288 CONSTITUTIONAL. CSPS has [P-OP-002 FWWS](../../../../../packages/principles/principles.yaml) (Finish What We Started) as the philosophical analog but **lacks mechanical boost in PE formula** — making FWWS judgment-driven not arithmetic. **HIGH-VALUE EXTRACT.**

## Verbatim source quotes

> "PE adds a boost to items with `status: BUILT_PARTIAL` or `status: IMPL_IN_PROGRESS`:
> - +1.5 — Item has active implementation but no immediate Governor pressure
> - +2.0 — Item has active implementation + 5+ sessions overdue
> - +3.0 — Item is CONSTITUTIONAL completion debt (e.g., RATIFIED CC with implementation phases unstarted)"
>
> "Source: Governor S288 CONSTITUTIONAL: 'completion is top priority. NEW idea, improvements, and 'while we're here' additions are NOT essential — they are CC candidates.'"

> "The exception: ESSENTIAL gaps. If current work is structurally BLOCKED without a new item, the new item gets temporary IMPL_IN_PROGRESS boost as enabler."

## CSPS current state

- [P-OP-002 FWWS](../../../../../packages/principles/principles.yaml) — philosophical principle: "resist drift while in-flight incomplete"
- [B_GRADUAL_BUILD_BY_FOUNDATIONS](../../../../../docs/plan/pillar-0-governance/behavioral-contracts.md) (P-META-016) — per-layer ZF gate; foundation-stability-before-layer-N
- `priority_score` field in topic-plan templates is judgment-set at authoring; **no recompute mechanism for in-progress items**
- No `status: BUILT_PARTIAL / IMPL_IN_PROGRESS / NOT_BUILT / BUILT` enum in CSPS schema (CSP `completion_debt_validator` produces this)

## Recommended downstream action

**HIGH-LEVERAGE engraving candidate** (PCR-required for engraving decision):

1. **Extend B_GRADUAL_BUILD_BY_FOUNDATIONS** with subsection: "L<N+1> work blocked until L<N> ZF passes per foundation-stability + L<N> work gets +1.5 to +3.0 boost over new-topic-plan candidates per IMPL_IN_PROGRESS_boost discipline"
2. **OR engrave NEW B_COMPLETION_DEBT_PRIORITIZATION contract** (5/5 atomic per FSE) — keeps B_GRADUAL_BUILD focused on multi-session topics; adds dedicated completion-debt enforcement
3. **Schema:** add `implementation_status` enum to topic-plan + element-review + B_* contract frontmatter: `{NOT_STARTED, BUILT_PARTIAL, IMPL_IN_PROGRESS, BUILT_FULL}`
4. **Validator:** `completion-debt-tracker` audit slug — flags items with active impl that are dropped for new work
5. **Hook:** week-4 `pre-tool-use-completion-debt-check.sh` — blocks new-topic-plan opening when completion debt boost > +2.0 elsewhere
6. **PE composition:** add `+ implementation_status_boost` term to topic-plan §6 priority_engine inputs

## Open questions

- Is "completion debt" already implicit in CSPS via FWWS + B_GRADUAL_BUILD per-layer ZF? Or is mechanical boost needed?
- Should "ESSENTIAL gaps exception" be ratified per CSP precedent or rejected as over-engineering at week-N?
- Does the +1.5/+2.0/+3.0 magnitude transplant or need CSPS-specific calibration?

## Engraving readiness

⚠️ READY FOR PCR. New contract OR principle extension is non-trivial decision per B_PCR_FOR_DECISIONS. Worth opening as standalone S009 element-review.

**Specific value to current work:** **directly relevant to unified-intake topic-plan execution** — if I open another topic-plan before unified-intake L1 closes, this boost would flag the drift. Currently I'm enforcing this discipline through judgment ("hold L2 for CSP file; don't drift"); CSP's mechanical layer would make it unbreakable.
