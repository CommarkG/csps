---
id: csps.handoff.vault.know-how
name: know-how
description: CSPS Internal Know-How Registry — structured collection of error patterns, anti-patterns, and success patterns extracted from real session incidents. Every new plan MUST consult this registry before creation (Step 6 of plan-creation-protocol.md) and before closure. The registry IS the mechanism that converts implicit requirements into explicit checklists. Per B_KNOW_HOW_DISCIPLINE.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: know_how_registry
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S011
file_depth_markers:
  l1_lines: "1-60"
  l2_lines: "61-end"
  read_protocol: "L1 = schema + directory map. L2 = full entry format."
domain_path: platform
scope_level: S1
---

# CSPS Know-How Registry

> **Why this exists:** Plans were being declared "done" while gaps remained because IMPLICIT engineering requirements were never checked. This registry makes them EXPLICIT and machine-checkable.
>
> **The discipline (B_KNOW_HOW_DISCIPLINE):** Every plan creation and closure runs the applicable checklist. Every session close extracts new patterns. The registry grows with every incident and prevents recurrence.

## Directory structure

```
know-how/
  README.md                    — this index + schema
  error-patterns/              — things that went wrong; root cause + prevention
    EP-001-stale-artifact.md
    EP-002-silent-orphan.md
    EP-003-missing-registration.md
    EP-004-post-close-tracking.md
    EP-005-legacy-debt.md
    EP-006-code-quality-blind-spot.md
    EP-007-governor-prompt-gap.md
  insights/
    plan-creation-insights.md  — what makes plans succeed
    execution-insights.md      — what makes execution succeed
  checklists/
    pre-plan-creation.md       — mandatory DO/DON'T for every new plan
    pre-plan-close.md          — mandatory gate before declaring plan complete
    pre-session-close.md       — mandatory gate before session close
```

## Error-pattern file schema

```yaml
---
id: EP-NNN          # sequential
name: short-name
description: one-line description
severity: CRITICAL | HIGH | MEDIUM | LOW
first_seen: S<NNN>  # session where first observed
recurrence_count: 1 # incremented each time pattern fires again
source_sessions: [S011]
applies_to: [plan-creation, plan-execution, plan-closure, session-close, validator-authoring, ...]
prevention_checklist_item: "text of the DO/DON'T that was added to checklists/"
root_cause: |
  why this happened
symptoms: |
  how to detect it in-flight
fix: |
  how to repair when detected
mechanical_prevention: |
  what validator/hook prevents recurrence
---
```

## Learning loop

```
Session close §10.0j + §10.13b
  → know-how-extractor.mjs
  → classify → EP-NNN file (new or increment recurrence_count)
  → update relevant checklist (pre-plan-creation / pre-plan-close / pre-session-close)
  → K=2 → engrave into B_KNOW_HOW_DISCIPLINE or relevant B_* contract
```

## Maintenance

- **know-how-extractor.mjs** processes closing-summaries and populates this registry
- **validate-plan-know-how.mjs** checks every new plan has §KH section
- **K=2 rule**: if same error pattern fires twice → mandatory B_* contract or P-META amendment
