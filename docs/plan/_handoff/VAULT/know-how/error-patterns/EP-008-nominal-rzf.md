---
id: csps.know-how.error-patterns.ep-008
name: nominal-rzf
description: Claiming ZF/PASS without THIS-SESSION pnpm verify tool output — narrative assertion instead of evidence
severity: CRITICAL
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
applies_to: [session-close, plan-closure]
prevention_checklist_item: "Every DONE/CLOSED/RATIFIED claim cites a pnpm verify run FROM THIS SESSION with structured JSON output. Memory of prior session's verify = NOT valid evidence."
mechanical_prevention: validate-rzf-evidence.mjs (ACTIVE in pnpm verify)
domain_path: platform
scope_level: S1
---

# EP-008 — Nominal RZF

**Pattern:** Closing-summary §10.0 says "exit_code 0" but the verify was run in a prior session, not the current one.

**Why it happens:** Under context pressure at session close, the AI recalls "pnpm verify passed earlier" and writes the §10.0 block from memory. P-META-006 says "re-run IS the proof" — but the re-run was 3 turns ago, not cited in this response.

**Prevention checklist item:**
> §10.0 MUST contain the actual pnpm verify output from THIS response or the response immediately preceding the §17 attestation. Citing a session-start verify for a session-end close = EP-008.

**Mechanical prevention:** `validate-rzf-evidence.mjs` — checks verify-last-run.md for THIS-SESSION evidence before closing-summary is accepted.