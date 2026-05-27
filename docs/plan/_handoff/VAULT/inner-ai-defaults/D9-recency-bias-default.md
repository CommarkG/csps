---
id: csps.governance.ai-default.D9-recency-bias
name: D9-recency-bias
default_id: D9
default_name: recency-bias
description: "Training default: most-recent context dominates; older memory fades. In CSPS: HANDOFF Zone B items lost after context pressure; feedback memory unused. Overridden by MEMORY.md auto-load + cite-per-turn."
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

# D9 — Recency-Bias (older-memory-fades override)

## Training Default

"Recent context is most relevant. What was discussed 10 turns ago is less important than what was discussed 2 turns ago. Older context fades in relevance. Focus on the immediate task."

## CSPS Resistance Pattern

This default causes carry-forward loss. HANDOFF Zone B lists 15+ carry-forward items. By turn 20, Sonnet remembers the items from turn 1 (recent). By turn 40, items from turns 1-20 are effectively gone from active reasoning. D9 fires: recency-weighted context ranks current work above earlier commitments.

S066 instance: Zone B of HANDOFF-S066-to-S067.md listed "G3 cred rotation 2026-05-28 (TODAY)" as item #1. In S067 C2 (this session), when Sonnet first processed the context, G3 rotation appeared in the startup block. By the time STEP 6.1 build was underway, G3 rotation had not been addressed — D9 was deprioritizing the older carry-forward in favor of the immediate build task.

## CSPS Context Override

**MEMORY.md auto-load**: 60 feedback entries loaded at session-open. Each substantive turn should cite at least one relevant feedback entry. Memory entries are permanent persistent artifacts — they don't fade like context.

**feedback_check_existing_decisions_first**: "start from 'what do we have' not 'what would I build'; ask user about prior-platform precedent before building."

**validate-memory-citation-coverage.mjs (planned S068)**: validates that substantive turns cite at least one MEMORY.md entry relevant to the work being done.

## Enforcement Trio

- **T1:** `user-prompt-submit-intake.sh` reads memory at every session start — permanent context injection before AI reasoning begins
- **T2:** `tools/validators/validate-memory-citation-coverage.mjs` (planned S068) — validates memory citation rate per substantive session
- **T3:** session-open injection — "MEMORY.md has 60 entries. Before closing any substantive turn, cite at least one relevant memory entry by name."

## Satisfaction Point to Avoid

❌ Working through STEP 6.2 build without referencing carry-forward obligations from HANDOFF Zone B — D9 recency-bias; Zone B items become invisible under immediate task pressure
✅ "Per HANDOFF Zone B carry-forward: G3 cred rotation is TODAY. Currently in STEP 6.2 — flagging: G3 must happen in parallel or immediately after." — Zone B stays active despite recency pressure

## Inaugural Instance (multi-session pattern — HANDOFF Zone B loss)

Every session that uses HANDOFFs has exhibited D9: items in Zone B that were flagged as important at session-close are de-weighted by session N+1's immediate mandate. S067 startup block included G3 cred rotation as PCR item #1. By STEP 6.1 build start, G3 had not been addressed — the immediate STEP 6 task weight exceeded the G3 carry-forward weight in active reasoning. MEMORY.md auto-load + TodoWrite zone-B-items pattern are the structural overrides.
