---
id: csps.templates.milestone-run
name: milestone-run-template
description: >
  Template for milestone-run execution records. Produced at each milestone boundary
  per the milestone-run execution tier (PROTO-S069 ratified). CIE section mandates
  impact estimation at milestone close. PE section mandates priority verification.
  Status: draft (fill and commit as MILESTONE-{session}-M{N}-{slug}.md in session vault).
type: template
protection_level: active
status: draft
impl_status: swift-implemented
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spines: [GVRN, AI, VALD]
core_spine: GVRN
schema_anchor: vault_files
version: "1.0"
session: S071
template_used: meta-template
template_status: standard
governing_principle: P-META-028
context_question: >
  Before emitting a Milestone Report: has CIE run (verify_top_exit cited)?
  Has PE confirmed this milestone was priority-ordered correctly?
---

# Milestone Report — S{NNN} M{N} — {milestone-slug}

**Opus, this is Sonnet.** M{N} done at commit {sha}.

## Done-When Verification

| Item | File/Evidence | Status |
|---|---|---|
| Item 1 | `path/to/file:line` | ✅ |
| Item 2 | `path/to/file:line` | ✅ |
| verify_top_exit | `node tools/verify.mjs --skip-install` → exit_code=0 | ✅ |

## CIE — Continuous Impact Estimation (M5 S071 mandate)

> CIE fires at each milestone close. Cite verify_top_exit + PREVENTION class + impact.
> Per RZF-LATEST §6.I3: cite `verify_top_exit: <int>` not free-text "exit_code=0".

- **verify_top_exit:** {int from $?}
- **Blocking validators changed:** {count or "none"}
- **Advisory validators changed:** {count or "none"}
- **Net-positive check (CIP gate):** {helps > harms? cite evidence}
- **Impact on downstream milestones:** {brief — does this change what M{N+1} needs to do?}

## PE — Priority Engine (M5 S071 mandate)

> PE fires at plan-fork. Confirm this milestone was correctly prioritized vs alternatives.

- **Current PE top-priority:** {milestone slug that PE scores highest}
- **Why this milestone before alternatives:** {one sentence citing PE dimensions}
- **Any re-ordering needed after this milestone?** {yes → cite, no → "no change"}

## PREVENTION Classes

<!-- Each class must be NAMED (not generic). Numbers are sample/tunable per P-META-028. -->

- `CLASS-NAME` — {specific evidence of the failure mode this prevents}

## §15 THREE-SCOPE Feedback

- **Sonnet (immediate):** {next action after this milestone}
- **Platform (structural):** {what this milestone enables system-wide}
- **Governor (strategic):** {what ratification or decision this milestone informs}

## ZF Evidence

ZF Cycle 1: re-examined {file1.ext} + {file2.ext} — {finding or 0 new}.
ZF Cycle 2: re-examined {file1.ext} + {file2.ext} (Cycle-1 areas, named) — 0 new.
Status: ZF ACHIEVED.
verify_top_exit: {$? of `node tools/verify.mjs --skip-install`}
