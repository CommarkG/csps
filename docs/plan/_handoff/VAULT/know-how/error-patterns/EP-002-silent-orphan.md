---
id: csps.know-how.error-patterns.ep-002
name: silent-orphan
description: Topic-plans with lifecycle_state:active sit for 3-5 sessions with no deliverables built and no enforcement to surface this
severity: CRITICAL
first_seen: S011
recurrence_count: 1
source_sessions: [S011]
applies_to: [plan-creation, plan-execution]
prevention_checklist_item: "Every new plan must add its L1 artifacts to a weekly pnpm verify check. Plans that ship no artifacts get flagged as ORPHAN after 1 session."
root_cause: |
  zero-laptop-dependency-setup (S006) and unified-intake (S008) were OPENED with
  lifecycle_state:active but subsequent sessions pivoted to higher-priority work
  (governance-foundation, token-optimization phases). No mechanical gate existed that
  said "this active plan has no deliverables built — surface it." The plan's
  multi_session_arc declared sessions that never executed its work.
symptoms: |
  - Topic-plan lifecycle_state:active but no L1 artifacts on disk
  - multi_session_arc sessions are in the past but no §11 closure exists
  - validate-topic-plan-progress.mjs fires CHECK A ORPHAN
fix: |
  Build the L1 deliverables immediately OR close the plan with an explicit "abandoned"
  closure note. Never leave active plans with no progress for >1 session.
mechanical_prevention: |
  validate-topic-plan-progress.mjs (ACTIVE in pnpm verify) — any active plan whose
  arc ended in a past session without §11 closure = FAIL on pnpm verify.
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

# EP-002 — Silent Orphan Syndrome

**Pattern:** Plans declared open, sessions pass, nothing gets built, no one notices.

**Why it happens:** The platform had no mechanical gate watching active plans. PE redirects sessions to higher-priority work. The orphaned plan quietly accumulates debt.

**Prevention checklist item:**
> When opening a new plan, immediately wire its L1 artifact paths into validate-topic-plan-progress.mjs KNOWN_ARTIFACTS. If L1 isn't done by next session, pnpm verify fails.

**Mechanical prevention:** `validate-topic-plan-progress.mjs` — fires on every `pnpm verify`.
