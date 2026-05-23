---
id: csps.templates.opus-brief
name: opus-brief
description: Template for Opus turn briefs — structured format ensuring RZF + CEC completeness per Opus Turn 18 discipline.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_grade: B
template_status: standard
core_spine: GVRN
schema_anchor: opus_consultations
diataxis_type: reference
session: S027
tags:
  - domain:governance
  - type:template
  - audience:ai-agent
  - maturity:stable
scope_level: S1
---

# Opus Turn [N] — [Topic]

**State:** pnpm verify exit_code=[0|1] | [session] active | [context note]

---

## [Primary work section]

[Content — analysis, decisions, adjudications]

---

## RZF VERIFICATION
Cycles run: [N] | Gaps: [N] | Critical gaps: [N]
Cycle 1: [What did I check?]
  Findings: [N] — [describe]
Cycle 2: [What did re-checking find?]
  Findings: 0
Status: ZF ACHIEVED

**RZF VERIFICATION — NEGATIVE (required if Findings > 0):**
```
Finding: [specific gap or inconsistency]
Root cause: [why did this gap exist]
Tracked: [SROF-NNN | backlog-item-id | DEFER: reason]
```

---

## CEC — POSITIVE (extracting compound value)
Significant event: [what happened that has compound value]
Essence: [one sentence — what insight/improvement occurred]
Walk:
  principles.yaml: Applied [YES/NO] — [if YES: cite file or commit sha]
  behavioral-contracts.md: Applied [YES/NO] — [if YES: cite section or commit sha]
  audit-runner.md: Applied [YES/NO] — [if YES: cite slug or commit sha]
  inner-ai-defaults: Applied [YES/NO] — [if YES: cite entry or commit sha]
  closing-summary-template: Applied [YES/NO] — [if YES: cite section]
  memory/: Applied [YES/NO] — [if YES: cite file]
  AGENTS.md: Applied [YES/NO] — [if YES: cite line or commit sha]
  L2 domain files: Applied [YES/NO] — [if YES: cite file]
Walk-trail: [N] cycles | [N] new applications | [N] artifacts updated

---

*Opus Turn [N] — [brief topic summary]*
*OPUS-1 | S[NNN] | [date]*
