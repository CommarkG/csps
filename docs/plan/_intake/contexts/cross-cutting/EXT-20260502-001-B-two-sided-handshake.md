---
extraction_id: EXT-20260502-001-B
parent_input_id: EXT-20260502-001
section_label: two-sided-handshake-proposal
source_type: HUMAN_CHAT
confidence: 0.95
confidence_band: auto-accept
lifecycle_state: promoted
pipeline_state: validated
state_transitioned_at: 2026-05-02T15:06:00Z
next_review_at: 2026-08-01
recurrence_check_at: 2026-08-01
routed_to: |
  - docs/plan/_handoff/VAULT/protocols.md (§17 added v1.2; §11b added)
  - docs/adr/draft-NNNN-two-sided-handshake.md (proposed; ADR pending S003)
risk: low
trust_tier: tenant_authored
priority_tier: P1
fan_out:
  cross_cutting: true
  ripples_to_leaves:
    - governance/stewardship-protocol
    - governance/learning-loop
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
  triaged_to_routed: 2026-05-04T15:06:00Z
  fixing_complete: 2026-05-02T15:06:00Z
---

# Two-sided handshake at chat-jump (S002 turn-6 user proposal)

**Insight:** Every chat-jump (S<NNN> → S<NNN+1>) should require a two-sided attestation:
prior session pre-attests (§17 of handoff) what the next session needs in context;
new session's first reply MUST acknowledge each line ✅ or raise as ❓ (which becomes a
BLK-S<NNN+1>-* blocker). Work cannot proceed until every line is resolved.

**Verbatim source:** "might find useful to have two sided check list to be confirmed on
the new site... presented to previous chat with clarifications and new chat continues
only when: previous chat approves new chat has complete context and new chat confirm
it has no more questions..."

**AI PCR recommendation (in same turn):** STRONG YES — prior session pre-attests in §17
(no live ping-pong needed; the artifact is the contract), new chat's first reply does
the verification.

**Action taken (same turn):** `_handoff/VAULT/protocols.md` v1.2 adds §17 closing-checklist
item ("two-sided handshake attestation") + §11b "Two-sided handshake — the attestation
contract" detailing the structure. Plus AGENTS.md hard NO added: *"Never start a fresh
chat without producing the two-sided handshake attestation as the FIRST REPLY."*

**Status:** `pipeline_state: validated`. Recurrence-check at 2026-08-01: verify §17 has
been used in S003+ chat opens and is catching context-loss before work proceeds.

**Cross-cutting rationale:** ripples to 2 governance leaves:
- `governance/stewardship-protocol/` — the attestation is a stewardship checkpoint at chat-jump
- `governance/learning-loop/` — unanswered ❓ items become first-class LearningLoopItems (BLK-S<NNN+1>-* blockers)

Stubs written to each leaf folder pointing to this canonical note.
