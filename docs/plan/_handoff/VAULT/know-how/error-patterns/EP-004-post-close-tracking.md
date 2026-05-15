---
id: csps.know-how.error-patterns.ep-004
name: post-close-tracking
description: Work done after formal session close (§24++ addenda) not properly tracked in governor-prompts, user-intents, or closing-summary addendum sections
severity: CRITICAL
first_seen: S011
recurrence_count: 1
source_sessions: [S011]
applies_to: [session-close, post-close-addendum]
prevention_checklist_item: "Every §24++ post-close prompt MUST: (1) get a GP-S<NNN>-<NN> entry, (2) produce a §24++ addendum section in closing-summary, (3) update any reference artifacts."
root_cause: |
  GP-S011-02 ("cpmplete phase 9") was not logged initially. The formal session
  close artifacts (HANDOFF, closing-summary) showed Phase 9 PARTIAL when it was
  COMPLETE. Post-close addenda require the SAME governance rigor as in-session work
  but the AI defaulted to informal execution without logging.
symptoms: |
  - Governor-prompts file has fewer entries than user prompts in the session
  - closing-summary §17 honest_gaps lists items that are now done
  - No §24++ addendum section in closing-summary
fix: |
  Add GP entry immediately when processing post-close prompt. Add §24++ addendum
  section to closing-summary. Preserve §17 attestation as historical record.
mechanical_prevention: |
  validate-session-artifact-sync.mjs CHECK 3 — checks closing-summary has
  §24++ Post-Close Addendum section when §24++ work is mentioned anywhere.
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
domain_path: platform
scope_level: S1
---

# EP-004 — Post-Close Tracking Gap

**Pattern:** Work after formal session close happens informally — no GP entry, no §24++ section, artifacts stay stale.

**Why it happens:** The AI treats "session closed" as "governance done." Post-close prompts feel informal. But they create real deliverables that need the same tracking.

**Prevention checklist item:**
> The moment a user sends a prompt after §17 attestation: create GP entry FIRST. Mark it as §24++ post-close. Add addendum section to closing-summary. THEN do the work.

**Mechanical prevention:** `validate-session-artifact-sync.mjs` CHECK 3 detects this.
