---
id: csps.know-how.error-patterns.ep-007
name: governor-prompt-gap
description: User prompts (especially post-close) not logged as GP entries, breaking the audit trail
severity: HIGH
first_seen: S011
recurrence_count: 1
source_sessions: [S011]
applies_to: [session-close, post-close-addendum]
prevention_checklist_item: "Every substantive user prompt gets a GP-S<NNN>-<NN> entry in governor-prompts/S<NNN>.md BEFORE executing the work. No exceptions for post-close prompts."
root_cause: |
  GP-S011-02 ("cpmplete phase 9") was not initially logged. The gp-auto-log hook
  is STUB tier — it fires but doesn't write. The AI is expected to manually log
  GPs but under high session load (many post-close addenda), this step gets skipped.
  The §10.0e count (1 substantive entry) was already wrong at session close.
symptoms: |
  - Fewer GP entries than user turns in the session
  - §10.0e governor-prompts count is lower than actual prompt count
  - closing-summary §10.0e says "1 substantive entry" but session had multiple prompts
fix: |
  Add missing GP entries immediately. For post-close: add §24++-tagged entry.
  Update distribution_targets to reflect what was delivered.
mechanical_prevention: |
  gp-auto-log hook STUB → when promoted to ACTIVE at week-4, it will fire for
  every UserPromptSubmit and log automatically. Until then: behavioral discipline.
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
---

# EP-007 — Governor Prompt Gap

**Pattern:** Not all user prompts are logged as GP entries, especially under high session load or post-close.

**Why it happens:** The GP logging hook is STUB. Manual logging is required. Under time pressure or post-close informality, the step gets skipped.

**Prevention checklist item:**
> At any session close: count user turns, count GP entries. If count(GP) < count(substantive prompts), the session is incomplete. Add missing entries before committing closing artifacts.
