---
extraction_id: EXT-20260502-001-A
parent_input_id: EXT-20260502-001
section_label: intent-to-impact-validation-proposal
source_type: HUMAN_CHAT
confidence: 0.95
confidence_band: auto-accept
lifecycle_state: promoted               # work proposed was acted upon in same turn (protocols.md v1.2)
pipeline_state: validated               # protocols.md v1.2 ships the proposal; recurrence-check schedules
state_transitioned_at: 2026-05-02T15:05:00Z
next_review_at: 2026-08-01
recurrence_check_at: 2026-08-01
routed_to: |
  - docs/plan/_handoff/VAULT/protocols.md (§16 added v1.2)
  - docs/adr/draft-NNNN-intent-to-impact-validation.md (proposed; ADR pending S003)
risk: low
trust_tier: tenant_authored
priority_tier: P1
fan_out:
  cross_cutting: true
  ripples_to_leaves:
    - governance/stewardship-protocol
    - governance/learning-loop
    - governance/adr-process
tags:
  - domain:governance
  - type:explanation
  - audience:developer
  - audience:ai-agent
  - maturity:stable
inherited_from_input:
  tags: [audience:ai-agent]
  trust_tier: tenant_authored
  source_type: HUMAN_CHAT
sla_due:
  triaged_to_routed: 2026-05-04T15:05:00Z   # met (acted same-turn)
  fixing_complete: 2026-05-02T15:05:00Z      # met (already shipped)
---

# Intent-to-impact validation in handoff (S002 turn-6 user proposal)

**Insight:** Every future HANDOFF-S<NNN>-to-S<NNN+1>.md should include a §16 section
that compares the prior session's stated-intent (verbatim from its §0 paste-target block)
against the actual-impact (delivery diff). If drift exceeds threshold (≥3 substantial
out-of-scope items OR ≥1 critical), trigger ADR.

**Verbatim source:** "what do you say if handoff will include a validation of 'intent
to impact'?"

**AI PCR recommendation (in same turn):** STRONG YES with structure — prior session
declares stated-intent, then declares actual-impact, then drift assessment. If drift
exceeds threshold, auto-trigger ADR.

**Action taken (same turn):** `_handoff/VAULT/protocols.md` updated v1.1 → v1.2 with
§16 "Intent-to-Impact validation" added to closing-protocol checklist + §11c
"Intent-to-impact validation — what the new session checks" added to fresh-chat protocol.

**Status:** `pipeline_state: validated`. Recurrence-check at 2026-08-01: verify §16 was
actually used in S003+ handoffs and is producing useful drift signals.

**Cross-cutting rationale:** ripples to 3 governance leaves:
- `governance/stewardship-protocol/` — drift assessment is itself a stewardship activity (lifecycle_state of work-items)
- `governance/learning-loop/` — drift detection feeds the meta-loop trend audit
- `governance/adr-process/` — drift > threshold auto-triggers ADR (forcing function)

Stubs written to each leaf folder pointing to this canonical note.
