---
id: csps.know-how.error-patterns.ep-005
name: legacy-debt
description: Small violations (ID casing, stale labels) accumulate across multiple sessions unfixed because no session specifically addresses them
severity: MEDIUM
first_seen: S011
recurrence_count: 1
source_sessions: [S011]
applies_to: [plan-creation, session-close]
prevention_checklist_item: "Any violation with severity WARN that fires on 2+ consecutive sessions MUST be fixed or formally accepted as LEGACY_YELLOW with documented reason."
root_cause: |
  HANDOFF-S001→S005 had uppercase IDs (csps.handoff.S001-to-S002) since creation
  in S001. The frontmatter validator consistently reported 5 warnings but no session
  specifically fixed them — they were always "low priority." After 10+ sessions
  the debt had been accepted as background noise.
symptoms: |
  - Validator reports same N warnings for 3+ consecutive sessions
  - pnpm verify always exits 0 but with persistent warning counts
  - The same files appear in validator output session after session
fix: |
  Fix the violation OR explicitly document it as LEGACY_YELLOW in audit-runner.md
  with reason. Never let a persistent warning become invisible background noise.
mechanical_prevention: |
  validate-session-artifact-sync.mjs could be extended to track warning recurrence.
  K=2 promotion rule: same warning in 2 sessions → fix OR LEGACY_YELLOW decision.
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

# EP-005 — Legacy Debt Accumulation

**Pattern:** Small violations persist across many sessions because each session treats them as "low priority" and moves on.

**Why it happens:** Validators exit 0 even with warnings. Warnings feel like noise. Priorities push real work ahead. The warnings accumulate.

**Prevention checklist item:**
> At session-close, check if any validator warning existed in PREVIOUS session too. If yes → fix it NOW or formally accept as LEGACY_YELLOW with explicit reason. Never let warnings persist silently beyond 2 sessions.
