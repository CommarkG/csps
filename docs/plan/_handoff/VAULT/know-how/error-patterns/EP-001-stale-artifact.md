---
id: csps.know-how.error-patterns.ep-001
name: stale-artifact
description: Artifacts (HANDOFF, closing-summary, chat-jump-prompt) declared final state while dependent artifacts were updated post-close, leaving stale references
severity: CRITICAL
first_seen: S011
recurrence_count: 1
source_sessions: [S011]
applies_to: [plan-closure, session-close, post-close-addendum]
prevention_checklist_item: "After ANY post-close work, update EVERY artifact that references the completed state (HANDOFF §0, §B4, closing-summary, chat-jump-prompt, OVERVIEW.md)"
root_cause: |
  Phase 9 was completed as §24++ post-close addendum but 4 governance artifacts
  (HANDOFF §B4, closing-summary honest_gaps, chat-jump-prompt, OVERVIEW.md) still
  said "PARTIAL/DEFERRED". The AI correctly built Phase 9 deliverables but did not
  propagate "COMPLETE" state across all dependent artifacts.
symptoms: |
  - HANDOFF says "Phase N deferred" but token-optimization.md says "Phase N COMPLETE"
  - closing-summary honest_gaps lists items that are now done
  - validate-session-artifact-sync fires warnings
fix: |
  Run validate-session-artifact-sync.mjs; find each stale reference; update in-place.
  Add §24++ addendum section to closing-summary rather than modifying §17 attestation.
mechanical_prevention: |
  validate-session-artifact-sync.mjs (ACTIVE in pnpm verify) — detects HANDOFF phase
  claims vs token-optimization.md completion markers + validator count sync.
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

# EP-001 — Stale Artifact Syndrome

**Pattern:** Work is completed but governance artifacts (HANDOFF/closing-summary/chat-jump) still show the old "deferred/partial" state.

**Why it happens:** The AI declares a unit complete and moves on. The governance artifacts that REFERENCE that unit are not in the current working set, so they don't get updated. Only the "leaf" artifacts get updated.

**Prevention checklist item:**
> After completing any work (especially post-close addenda), search for ALL artifacts that reference the completed unit and update them. The list is always: HANDOFF §B4 + closing-summary §honest_gaps + chat-jump-prompt + OVERVIEW.md.

**Mechanical prevention:** `validate-session-artifact-sync.mjs` catches this on every `pnpm verify` run.
