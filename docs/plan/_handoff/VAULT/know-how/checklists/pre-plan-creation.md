---
id: csps.know-how.checklists.pre-plan-creation
name: pre-plan-creation-checklist
description: Mandatory DO/DON'T checklist for every new plan before authoring. Extracted from CSPS session incidents. Every item maps to an EP-NNN error pattern that was observed in production. Per B_KNOW_HOW_DISCIPLINE Step 6 of plan-creation-protocol.md.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: know_how_checklists
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
---

# Pre-Plan-Creation Checklist

> Every new plan MUST have a `## §KH Know-How Consultation` section that walks through this list and generates SPECIFIC mitigations for this plan. Generic acknowledgment is forbidden — each item needs a concrete "For THIS plan, we prevent this by: ..."

## §KH Mandatory checks

### 1. Orphan prevention (→ EP-002)
**DON'T:** Create plan with `lifecycle_state: active` without wiring L1 artifact paths into a validator.
**DO:** List every L1 artifact. Verify `validate-topic-plan-progress.mjs` will catch it if not built within 1 session.
**For this plan, orphan prevention = ___**

### 2. Delivery scope completeness (→ EP-001, EP-003)
**DON'T:** List only the "leaf" deliverables (the files you'll create). 
**DO:** Also list the IMPLICIT deliverables: audit slug registrations, HANDOFF §B4 entries, pnpm verify integration, slice regenerations.
**For this plan, implicit deliverables include = ___**

### 3. Validator authoring completeness (→ EP-003)
**DON'T:** Plan to "add a validator" without planning the registration step.
**DO:** For every validator in the plan, explicitly list: (a) tools/validators/validate-X.mjs, (b) verify.mjs cycle entry, (c) audit-runner.md row, (d) pipeline-meta.md slice row.
**For this plan, validators needing full 3-step: ___**

### 4. Plan-closure artifact update scope (→ EP-001)
**DON'T:** Close plan without a list of every artifact that references it.
**DO:** Enumerate now: which HANDOFF §B4 rows will be updated, which closing-summary §honest_gaps entries will change, which OVERVIEW.md sections.
**For this plan, artifacts to update at closure = ___**

### 5. Code quality gate (→ EP-006)
**DON'T:** Author .mjs files without smoke-test step.
**DO:** For every .mjs in the plan, explicitly list the smoke test command in the exit criteria. `node tools/validators/X.mjs 2>&1` with expected output.
**For this plan, smoke tests needed = ___**

### 6. Legacy warning check
**DON'T:** Start plan while known persistent warnings exist from prior sessions.
**DO:** Run `pnpm verify --skip-install` before starting. Any warning that existed last session → fix before starting this plan.
**Current persistent warnings = ___** (must be 0 or LEGACY_YELLOW documented)

### 7. Post-close addendum discipline (→ EP-004)
**DON'T:** Assume formal session close = governance done. 
**DO:** Every prompt after §17 attestation triggers GP entry + §24++ section in closing-summary.
**Acknowledge: any §24++ work in this plan will follow post-close tracking protocol**

### 8. Governor prompt coverage (→ EP-007)
**DON'T:** Start plan without knowing how to count GPs at session close.
**DO:** At session close, count user turns, verify GP count matches. Document the expectation now.
**Expected GP count at close for this plan = ___** (e.g., "at least N: 1 session-open + 1 per major directive")

## Completion evidence
Before authoring the plan body, confirm:
- [ ] All 8 checks answered with SPECIFIC text (not generic "yes")
- [ ] §KH section will be included in the plan frontmatter as `know_how_consulted: true`
- [ ] validate-topic-plan-progress.mjs updated with this plan's L1 artifact paths if needed
