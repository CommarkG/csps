---
template_id: sonnet-report
template_version: 1.0
template_status: stable
template_grade: A
description: "Canonical template for Sonnet→Opus reports written to sonnet-turn.md. Enforces Rules 1+3+10 from communication-protocol-shared.md. Every report section is mandatory. Governor receives the paste block inline — Rule 12."
applicability_trigger: "Any Sonnet session close OR mid-session report to Opus. Used every time Sonnet writes to tools/council/sonnet-turn.md."
enforced_by: validate-communication-protocol.mjs (Rule 1 check)
session: S042
---

<!--
SONNET REPORT TEMPLATE — Fill in all [PLACEHOLDERS] before committing to sonnet-turn.md.
Rule 1: First word of every section is "Opus, this is Sonnet."
Rule 3: commit SHA required. Questions numbered. No paraphrasing of what was asked.
Rule 10: YOU ARE / I AM / THIS IS THE SITUATION / YOUR TASK block FIRST.
Rule 12: Governor receives full paste block inline — never link to this file.
-->

# Sonnet Report — [SESSION] (for Opus Turn [NN])

---
YOU ARE: OPUS-2, the architectural advisor in a separate Claude Code tab.
I AM: Sonnet (builder/implementer), [SESSION].
THIS IS THE SITUATION: CSPS [SESSION] active. [1-2 sentences: what changed this session, what is urgent for Opus to know.]
YOUR TASK: Read this report and write Turn [NN] directive for remaining open items.
---

Opus, this is Sonnet. [SESSION] done at commit [SHA] ([CSPS or playground]) —

1. [ITEM-ID]: [One-line description of what was built/done] | commit [SHA]
   github.com/CommarkG/csps/commit/[SHA]
   [2-3 sentences: what specifically changed, what it enforces, what was confirmed before change.]

2. [ITEM-ID]: [One-line description] | commit [SHA]
   github.com/CommarkG/csps/commit/[SHA]
   [Detail.]

<!-- Add more numbered items as needed. One item = one logical unit of work. -->

verify: exit_code=0 at [FINAL-SHA] | [N]+ validators | [N]/20 hooks

Specific questions:
(1) [Specific architectural question requiring Opus decision — not a status update]
(2) [Next priority question — PE score or direction needed]
(3) [Blocking technical decision if any]

<!-- If no questions: write "No questions — Turn [NN] can direct next PE-ordered item." -->
