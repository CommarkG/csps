---
template_id: sonnet-report
template_version: 2.0
template_status: stable
template_grade: A
description: "Canonical template for Sonnet→Opus reports. Written to sonnet-turn.md FIRST, then relayed. S054: adds reflexive tool application step, PLAN STATUS indicator, ZF block in council file requirement."
applicability_trigger: "Any Sonnet PROTO completion OR mid-session report to Opus. Every time Sonnet writes to tools/council/sonnet-turn.md."
enforced_by: validate-communication-quality.mjs (FROM/TO format check)
session: S054
context_question: "Before sending this report — has (a) the ZF block been written to sonnet-turn.md (not just chat), (b) validate-zf-cycle-format.mjs been run against the council file, and (c) every built artifact been run reflexively against its own output?"
context_quote: "Use the simple form of communication that makes it permanent. I am annoyed and tired of reminding you."
---

<!--
SONNET REPORT TEMPLATE v2.0 (S054) — Fill ALL [PLACEHOLDERS] before committing to sonnet-turn.md.

MANDATORY SEQUENCE:
  1. Write this report to sonnet-turn.md FIRST (including the ZF block below)
  2. Run: node tools/validators/validate-zf-cycle-format.mjs (must find >=1 block, blocking=0)
  3. THEN relay to Governor and Opus

CHANGED FROM v1.0:
  - FROM/TO format replaces YOU ARE/I AM relay blocks
  - Reflexive tool application step is now REQUIRED
  - PLAN STATUS indicator required at end
  - ZF block MUST be in the council file write, not just chat
-->

# FROM SONNET | FOR OPUS TAB
Opus, this is Sonnet. [PROTO-ID] done at commit [SHA].

DONE: [SHA] — [one-line description of what was completed]
FOUND: [any blockers or unexpected findings — one line each, or "none"]
VERIFY: exit_code=0 | validators=[N]
PLAN STATUS: [SESSION] | Item [N] of [TOTAL] complete | Current: [plan item ID]

## What was built

1. [ITEM-ID]: [One-line description] | commit [SHA]
   [2 sentences: what specifically changed + what behavioral guarantee it enforces]

2. [ITEM-ID]: [One-line description] | commit [SHA]
   [Detail]

<!-- One numbered item per logical unit of work. -->

## Reflexive tool application (REQUIRED)

After building each validator/hook, run it against the work that produced it:

- [validator-name.mjs] run against [what-it-scans]: exit=[N] | [key metric]
- [validator-name.mjs] run against [current-session-artifacts]: exit=[N] | [finding or "clean"]

<!-- If nothing to run reflexively: state "No validators built this PROTO." -->

## ZF — write this block to sonnet-turn.md FIRST

ZF Cycle 1: [specific finding — name a file:line or claim]
Cycle 2: re-examined [SPECIFIC-FILE-1.mjs] and [SPECIFIC-FILE-2.md] — 0 new findings.
ZF ACHIEVED.

<!-- VIOLATION: "Cycle N: no new findings" without naming specific files = BLOCKING -->
<!-- This block must appear IN sonnet-turn.md before being sent here -->

## What the Prompt Missed / Where I Pushed Back

<!-- COUNCIL PEER CONTRACT (ai-collaboration-charter §2.5): Surface what the directive missed;
     flag unnamed risks, unstated constraints, baked-in assumptions.
     If you disagreed with Opus or offered a better solution, name it here.
     If nothing: state "None — directive was complete and I agreed with the approach." -->

[Named gaps / risks / alternatives — or "None."]

## High-Value + Most-Uncertain Claims (Opus: verify these)

<!-- COUNCIL PEER CONTRACT: Label claims that drive architectural decisions or carry high
     uncertainty. Opus verify-before-concur = re-derive these with THIS-TURN evidence.
     Format: "HIGH-VALUE CLAIM: [claim] | UNCERTAINTY: [why uncertain]" -->

[Specific claims requiring Opus independent verification — or "No claims require special verification this PROTO."]

## Questions (numbered, blockers only)

(1) [Specific question requiring Opus decision — cite file:line for context]

<!-- If no questions: "No questions — next item per PLAN STATUS is [ID]." -->

## PASTE FOR NEW SONNET TAB (mandatory at session close — B_ZERO_NAVIGATION_FOR_GOVERNOR)

<!-- Read the SONNET STARTUP BLOCK from the HANDOFF and paste it here verbatim. -->
<!-- The hook post-stop-session-close-gate.sh surfaces this automatically. -->
<!-- NEVER close a session without this block inline in the response. -->

```
FROM OPUS-[N] | FOR SONNET TAB — S[NNN] STARTUP

YOU ARE: Sonnet, builder. Session S[NNN].
GOVERNOR: Yariv Fink.
SITUATION: S[NNN-1] closed at [sha]. pnpm verify exit_code=0. [N] validators. Fresh tab.
  S[NNN] mandate: [top 2 MDPE items from HANDOFF Zone B]

FIRST ACTION (all 4 before responding):
  1. Read docs/plan/_handoff/HANDOFF-S[NNN-1]-to-S[NNN].md FULLY
  2. git log --oneline -3
  3. node tools/verify.mjs | grep exit_code
  4. Write to tools/council/sonnet-turn.md:
     "# Sonnet S[NNN] — INTENT ABSORBED | commit: [sha] | exit_code: [N]"
  THEN: AWAIT Opus PROTO before implementing anything.
```
