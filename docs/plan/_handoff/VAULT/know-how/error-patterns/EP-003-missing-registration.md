---
id: csps.know-how.error-patterns.ep-003
name: missing-registration
description: Validators built and wired into pnpm verify without registering corresponding audit slugs in audit-runner.md
severity: HIGH
first_seen: S011
recurrence_count: 1
source_sessions: [S011]
applies_to: [validator-authoring]
prevention_checklist_item: "Every new validator file must have its audit slug registered in audit-runner.md IN THE SAME COMMIT. No validator ships without its slug."
root_cause: |
  Phase 9 validators (validate-token-budget, validate-corespine-depth-markers, etc.)
  were built and wired into verify.mjs but audit-runner.md was not updated with
  matching slugs. Only discovered in the §24++ deep-audit pass when
  validate-audit-slug-coverage.mjs was built specifically to catch this pattern.
symptoms: |
  - validate-audit-slug-coverage.mjs reports ORPHAN validators
  - audit-runner.md has no entry for a file in tools/validators/
fix: |
  Add audit-runner.md row for each orphan. Include: slug, cadence, severity,
  description, registration note. Then regenerate audit-runner pipeline slices.
mechanical_prevention: |
  validate-audit-slug-coverage.mjs (ACTIVE in pnpm verify) — every tools/validators/
  validate-*.mjs must have a matching slug in audit-runner.md. Self-referential.
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

# EP-003 — Missing Registration Pattern

**Pattern:** New validators are shipped without their audit slugs being registered in audit-runner.md.

**Why it happens:** Building a validator and wiring it into verify.mjs feels like "done." The audit-runner registration is a separate step that's easy to skip when focused on making the validator work.

**Prevention checklist item:**
> Validator authoring = 3 mandatory steps: (1) write .mjs, (2) wire into verify.mjs, (3) add row to audit-runner.md + pipeline-meta.md. Steps 1+2 without Step 3 = INCOMPLETE.

**Mechanical prevention:** `validate-audit-slug-coverage.mjs` catches this automatically.
