---
id: csps.know-how.success-patterns
name: success-patterns
description: CSPS Success Groove (SG-NNN) registry — symmetric counterpart to error-patterns (EP-NNN). Documents patterns that consistently produce positive outcomes. Every SG entry is a DO item in pre-plan-creation §KH checklists, exactly as EP items are DON'T items. Extracted from §10.11b (positive value extraction) by know-how-extractor.mjs.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: know_how_success_patterns
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
domain_path: platform
scope_level: S1
---

# Success Patterns — CSPS

> **The insight:** Error patterns (EP-NNN) prevent failure. Success patterns (SG-NNN) accelerate success. Both are necessary. The platform currently has 11 EP entries and 0 SG entries — this asymmetry limits compounding.

## SG file schema

```yaml
---
id: SG-NNN
name: short-name
description: one-line description
confidence: HIGH | MEDIUM | LOW  # based on how many sessions confirmed it
first_seen: S<NNN>
confirmation_count: N  # number of sessions where this groove was observed
source_sessions: [S<NNN>, ...]
applies_to: [plan-creation, plan-execution, session-close, validator-authoring, ...]
do_checklist_item: "text of the DO item added to pre-plan-creation.md"
outcome_evidence: |
  what measurable outcome this pattern produced
reuse_instruction: |
  how to apply this pattern in a new context
---
```

## How SG entries are created

1. **Automatic:** know-how-extractor.mjs processes §10.11b "Positive value extraction" from closing-summaries → classifies → creates SG-NNN entry
2. **Manual:** Governor or AI identifies a success groove during session → vaults to `know-how/success-patterns/` via VAULT_DEFER

## How SG entries are used

Every pre-plan-creation §KH section MUST include positive patterns relevant to the plan type:
```
§KH Check 0 (Success Pattern Application):
  Applicable SG patterns for this plan type:
  - SG-001: atomic 3-step registration for validators — apply to every new validator
  - SG-XXX: [pattern name] — apply by [specific action]
```
