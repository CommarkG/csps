---
id: ai-conception.B_FALSE_ASSUMPTION_CHECK
name: B-FALSE-ASSUMPTION-CHECK
description: "AI conception pattern: before any cross-boundary communication, explicitly audit what the sender knows that the receiver doesn't — close the assumption gap"
type: conception_pattern
protection_level: sacred
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "1.0"
session: S051
core_spines: [AI, GVRN]
core_spine: AI
schema_anchor: vault_files
impl_status: swift-implemented
links:
  - ai-conception.B_IDENTITY_BEFORE_CONTEXT
  - ai-conception.B_VERIFY_UNCLEAR_INPUT
  - ai-conception.B_TAB_TRANSITION_PROTOCOL
context_question: "Before sending any directive to Sonnet or starting a new Opus tab, what do I know that the receiver might falsely assume is already known?"
context_quote: "The gap is not in what you say. It is in what you don't say because you assumed they knew."
---

# B_FALSE_ASSUMPTION_CHECK

## The Problem

Every cross-boundary communication carries invisible assumptions. The sender knows context that wasn't explicitly stated. The receiver assumes they have complete context. Both believe the communication was complete. Neither is right.

This is the "false assumption syndrome" — the systematic gap between what was communicated and what was understood.

## The Check

Before ANY cross-boundary communication (PROTO to Sonnet, HANDOFF to new Opus, jump prompt, wizard instruction):

**Run the 4-category false assumption audit:**

**Category 1 — Architectural decisions:**
"What architectural decisions did I make this session that the receiver doesn't know about?"
→ Decisions made in chat but not yet in git
→ Design pivots that contradict earlier decisions
→ New vocabulary terms introduced this session

**Category 2 — Plan changes:**
"What plan changes happened this session that the receiver might assume are still the old state?"
→ Status changes in unified-plan.yaml
→ PE score changes
→ Paused vs. active items

**Category 3 — The WHY:**
"Why is this instruction written the way it is? What context would make it confusing without explanation?"
→ Why is APP-001 fork paused? (because infrastructure-first pivot)
→ Why is documentation-in-schema now pe=97? (because MDPE formula)
→ Why are the apps marked as input-specimens? (because they're pre-infrastructure baselines)

**Category 4 — Vocabulary shifts:**
"Did I introduce or redefine any terms this session that the receiver might interpret differently?"
→ MDPE vs. classic PE
→ "input-specimen" vs. "done app"
→ "blast_radius" as a PE dimension

## BEFORE/AFTER Example

**BEFORE — Directive without false assumption check:**
```
Build validate-context-question-coverage.mjs to check for missing context_question fields.
```
Receiver assumes: what is context_question? How many files should have it? What's the expected coverage?

**AFTER — Directive with false assumption check:**
```
Build validate-context-question-coverage.mjs.

BACKGROUND (false assumption check):
- context_question is a mandatory frontmatter field in all governance .md files.
  See: docs/SIA/R1-01-NODE-SCHEMA.md for the required fields.
- Currently 15% implemented (most files lack this field). Target: 100%.
- This validator makes the 15% visible and sets the path to 100%.
- Expected finding: ~60+ files will be flagged initially. That is correct — advisory only.
```

The BACKGROUND section is the false assumption check output, embedded directly in the directive.

## Where This Applies

| Communication type | Key false assumption to check |
|---|---|
| PROTO to Sonnet | "Does Sonnet know WHY this step exists, not just WHAT to do?" |
| HANDOFF to new Opus | "What architectural reasoning from this session isn't in any git file?" |
| Opus-7 jump prompt | "What decisions were made that Opus-7 can't infer from the HANDOFF?" |
| Plan ratification | "What context does the implementer need that isn't in the plan text?" |
| Wizard instructions | "What does the user need to know about WHY this question is being asked?" |

## This Is a Communication Principle, Not Just a Technical One

The Governor stated this correctly: communication must not be taken for granted. Every instruction, every protocol, every wizard step is a communication boundary. The false assumption check applies to ALL of them.

Applied to wizards: every question in the creation wizard should include a brief "why is this being asked" context note. Not as a long explanation, but as the `context_question` field — a question that makes the purpose self-evident.

## Session Evidence

S051 Governor: "Go over what you prepared to send and ask the question deeply: What are the false assumptions that were not verified that I'm using? [...] This is relevant to all instructions. This is relevant to protocols, wizard, way of communication."

---

*AI Conception Vault entry 11 | S051 | Protection: sacred*
