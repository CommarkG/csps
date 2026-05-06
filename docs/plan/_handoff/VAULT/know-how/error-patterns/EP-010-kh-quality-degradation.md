---
id: csps.know-how.error-patterns.ep-010
name: kh-quality-degradation
description: §KH Know-How Consultation section present in plan but filled with generic acknowledgments instead of specific mitigations per checklist item
severity: HIGH
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: know_how_error_patterns
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
first_seen: S011
recurrence_count: 0
source_sessions: [S011]
applies_to: [plan-creation]
prevention_checklist_item: "Each §KH item must have >30 characters of SPECIFIC text naming the actual artifact/validator/mechanism. 'Yes, I will register slugs' = generic = EP-010. 'Each new validator registers in audit-runner.md via audit-slug-coverage.mjs' = specific = PASS."
mechanical_prevention: "Upgrade validate-plan-know-how.mjs to check §KH QUALITY not just presence (week-4; stub today)"
---

# EP-010 — §KH Quality Degradation

**Pattern:** §KH section added to satisfy the validator, but each item gets a one-line generic answer ("N/A" or "Yes I will") instead of a plan-specific mitigation.

**Why it happens:** The §KH requirement creates a compliance pressure. Under time pressure, the AI generates the minimum to pass the validator. validate-plan-know-how.mjs only checks PRESENCE today, not QUALITY.

**Prevention checklist item:**
> A §KH section where any item has fewer than 30 characters of plan-specific text = EP-010. The validate-plan-know-how upgrade will enforce this mechanically. Until then: self-check that each §KH item names a specific file, command, or mechanism for THIS plan.