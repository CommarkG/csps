---
id: csps.know-how.error-patterns.ep-009
name: slice-drift
description: Monolith file (behavioral-contracts.md / audit-runner.md / principles.yaml) edited but split generator not run — slices become stale
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
recurrence_count: 1
source_sessions: [S011]
applies_to: [implement, plan-closure]
prevention_checklist_item: "Every monolith edit is a 2-step: (1) edit monolith, (2) run pnpm <source>:split immediately. Never commit monolith changes without slice regeneration."
mechanical_prevention: validate-slice-freshness.mjs (ACTIVE in pnpm verify)
domain_path: platform
scope_level: S1
---

# EP-009 — Slice Drift

**Pattern:** behavioral-contracts.md (or other monolith) edited in a session. The AI focuses on the content change. Forgets to run `pnpm contracts:split`. Slices become stale — they show old content even though monolith is updated.

**Why it happens:** Slices are generated artifacts. The AI treats them as output, not part of the edit flow. The edit-monolith step feels complete. The split step is a separate discipline that requires explicit recall.

**Prevention checklist item:**
> For every monolith edit: the commit message MUST include which split command was run. "Edited behavioral-contracts.md" without "ran pnpm contracts:split" = EP-009.

**Mechanical prevention:** `validate-slice-freshness.mjs` — compares monolith mtime vs newest slice mtime; warns if monolith is newer.