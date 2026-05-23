---
id: csps.pillar-0-governance.session-question-register
name: session-question-register
description: >
  The Session Question Register (SQR) — the mechanical acknowledgment protocol for
  important AI outputs. Every definition, decision, and ratification-pending item
  produced during a session is tracked until explicitly acknowledged by the Governor.
  Items in the register re-surface at the next available opportunity. Session cannot
  close with unacknowledged Checkpoint items. Addresses the "intent died on its way
  to impact" failure mode: B_RESULT_NOT_OUTPUT applied at the session level.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
enforcement_stage: planned
cdp_status: ratified
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
session: S018
depth_levels:
  l1: "A session-level queue tracking unacknowledged AI outputs until Governor confirms them"
  l1_tokens: 80
  l2: "The Session Question Register holds checkpoint items that require explicit ACK. Items re-surface. Session close gate blocks if unacknowledged checkpoints exist."
  l2_tokens: 600
  l3: "See this document. Validator: validate-session-question-register.mjs (week-4)."
  l3_location: "./session-question-register.md"
impl_status: swift-implemented
links:
  - { rel: parent, href: ./README.md }
  - { rel: contracts, href: ./behavioral-contracts.md }
  - { rel: mechanical-enforcement, href: ./mechanical-enforcement-policy.md }
  - { rel: closing-template, href: ../../plan/_handoff/VAULT/closing-summary-template.md }
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/mechanical-enforcement-policy.md
  - docs/plan/_handoff/VAULT/closing-summary-template.md
  - AGENTS.md
domain_path: platform
diataxis_type: reference
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# Session Question Register (SQR)

> **Root cause addressed:** S018 — Governor asked for INPUTS/FINDINGS definitions. AI provided them. Governor moved on. Definitions exist in vocabulary.md but whether they match the Governor's intent is UNKNOWN. This is B_RESULT_NOT_OUTPUT at the session level: intent died on its way to impact.

---

## The Two Item Types

**REFERENCE items** (can be skipped, consulted later):
- Background context, explanations, historical notes
- Informational updates about what was built
- Options for future consideration

**CHECKPOINT items** (require explicit ACK before moving on):
- Definitions being proposed for ratification
- Decisions with lasting architectural impact
- Questions the Governor asked that received an answer
- Any item where "Governor moved on without acknowledging" would create a governance gap

**The rule:** Every CHECKPOINT item must be acknowledged before the session closes. If not acknowledged: the item goes into the SQR and re-surfaces at the next opportunity.

---

## The SQR Format

When the AI produces a CHECKPOINT item, it appends to the session SQR:

```yaml
# session-question-register — S018
# Items are OPEN until Governor explicitly confirms or defers

items:
  - id: SQR-S018-001
    type: definition-pending-ratification
    content: "INPUTS = everything entering the platform governance system through the Threshold (Governor prompts, external reviews, raw thoughts, code changes, ratification decisions). Does this match your intent?"
    offered_at: "[turn number or topic]"
    options: "A) Confirmed | B) Adjust: [correction] | C) Defer to S019"
    status: OPEN  # → ACKNOWLEDGED | DEFERRED

  - id: SQR-S018-002
    type: decision-pending-ratification
    content: "FINDINGS = outputs of the validation/audit/ZF process (BLOCKING/ADVISORY/POSITIVE/STRUCTURAL). Does this match your intent?"
    offered_at: "[turn number or topic]"
    options: "A) Confirmed | B) Adjust: [correction] | C) Defer to S019"
    status: OPEN
```

---

## The Checkpoint Surface Format (in every response with a CHECKPOINT)

Every AI response containing a CHECKPOINT must end with:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚑ CHECKPOINT — [SQR-S018-NNN]
[The specific item requiring acknowledgment]
→ Reply: A) Confirmed  |  B) Adjust: [correction]  |  C) Defer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

This visual pattern makes CHECKPOINT items structurally impossible to skip — they are visually distinct from Reference items.

---

## The Re-surfacing Protocol

When the Governor sends any message, the AI checks the SQR:
- If OPEN items exist: surface the OLDEST one as a Checkpoint at the START of the response (before the main content)
- "Before I address your question: I have an open checkpoint from [topic]: [item]. A) Confirm | B) Adjust | C) Defer"

This ensures checkpoints don't die silently.

---

## Session Close Gate

Before writing the closing summary §10.0, check SQR:
- OPEN items remaining → either get ack or explicit defer with reason
- ALL items ACKNOWLEDGED or DEFERRED → session can close

This is implemented in closing-summary-template.md §10.0n (positive ZF evidence) and should have its own §10.0o section.

---

## Mid-Session Harvesting Protocol (NEW — Governor directive S018)

Every IMPL_BATCH boundary (ZF Level 2 trigger) includes:

```
Mid-session harvest check:
1. Count significant positive discoveries since last harvest
2. If ≥3 new discoveries without CEC: run CEC now (positive ZF cycle)
3. Check SQR for OPEN checkpoint items older than 5 turns → re-surface top 1
4. Check negative findings: any gaps discovered without engraving? → catch-to-engraving
```

This converts the currently session-close-only harvest into a continuous mid-session process.

---

## Mechanical Enforcement

**Current (enforcement_stage: planned):**
- This document defines the protocol
- The AI manually checks and surfaces checkpoints
- The SQR format is documented

**Week-4 (enforcement_stage: week-4):**
- `validate-session-question-register.mjs` — scans session log for CHECKPOINT markers, counts OPEN vs ACKNOWLEDGED items, warns when close is attempted with OPEN items
- `core-seeds-coverage` audit already registered — validate-core-seeds.mjs covers planted seeds

**self_assessment_question:**
"At the end of my last response, did I have any CHECKPOINT items that needed acknowledgment? If yes: did I format them with the ⚑ CHECKPOINT surface? If the Governor moved on without responding: have I added them to the SQR and am I about to re-surface them?"
