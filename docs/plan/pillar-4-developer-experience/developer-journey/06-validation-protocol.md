---
id: csps.pillar4.developer-journey.validation
name: developer-validation-protocol
description: "Stage 6 — The full validation protocol. 127 validators, what each checks, which are blocking vs advisory, and what to do when one fails."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: VALD
diataxis_type: reference
session: S039
pe_score: 80
links:
  - { rel: parent, href: ./README.md }
  - { rel: verify, href: ../../../../tools/verify.mjs }
  - { rel: audit-runner, href: ../../../../docs/plan/pillar-0-governance/audit-runner.md }
tags:
  - domain:dx
  - domain:governance
  - type:reference
  - audience:developer
  - maturity:stable
scope_level: S1
---

# Stage 6 — Validation Protocol

**PE score: 80** — Well-established. Run it before every commit, not after.

---

## The single command

```bash
node tools/verify.mjs
```

Runs 127 validators. Exits 0 if all pass. Exits 1 if any BLOCKING validator fails.

**Run this before every commit. Not after.** If you're running it after the commit, you're debugging instead of preventing.

---

## Validator categories

### BLOCKING (exit 1 if fails — commit is rejected)

These represent structural failures that cannot be committed. Fix them before anything else.

**Security:**
- `security-headers-compliance` — every app must import and use securityHeaders()
- `layer-boundary` — libs/ must not import from apps/ (no upstream dependencies)
- `schema-anchors` — new schema_anchor values must be in the registry

**Governance:**
- `consolidation-check-coverage` — S023+ plans must have §0 consolidation check
- `plan-know-how` — S011+ plans must have §KH know-how consultation
- `core-contamination` — validators/hooks must not make external API calls

**Wiring:**
- `wiring-completeness` — orphaned exports (no wiring, no deferral) are advisory but tracked

### ADVISORY (exit 0 but flagged — should address before shipping)

These won't block your commit but represent quality gaps that accumulate.

**Implementation quality:**
- `ui-completeness` — new pages: empty onClick, dead links, forms without onSubmit
- `new-file-dna` — new libs/ files: must have @csps-enforces annotation
- `enforcement-trio-assigned` — PI items: must have enforcement_trio field

**Planning quality:**
- `pi-questions-answered` — implementing PIs: all questions must be answered
- `persona-chain-complete` — implementing PIs: 6-persona chain must be complete
- `handoff-completeness` — HANDOFFs: must have ALIGNMENT QUESTIONS section

**System health:**
- `sync-state-fresh` — universal-governance sync state < 24 hours
- `directive-has-rzf` — SONNET DIRECTIVE sections: must have RZF VERIFICATION
- `quality-alignment` — OPUS-2 RZF rate + Sonnet INTENT ABSORBED rate ≥ 80%

---

## What to do when a validator fails

**BLOCKING failure:**
1. Read the error message — it includes the fix
2. Fix the specific issue it reports
3. Run the failing validator alone: `node tools/validators/validate-[name].mjs`
4. Once it passes alone, run the full suite
5. Do not commit until `exit_code=0`

**ADVISORY failure:**
1. Read it — these accumulate into technical debt
2. If it's related to your current work: fix it now
3. If it's pre-existing: check if it's in `known-deferred-advisories.yaml`
4. If neither: add it to the relevant PI item's wiring_checklist

---

## The validator trust hierarchy

**T2 validators (commit-blocking):** Mechanical, reliable. When they pass, the structural requirement is met.

**T1 hooks (response-time advisory):** Fire after AI responses. Catch behavioral patterns. Less reliable under context pressure.

**T3 session injections:** Fire at session start. Least reliable — dilute under context pressure by turn 10.

For anything important: use T2 (a validator that blocks the commit). T3 alone means the rule will drift.

---

## Running validators individually

```bash
# Fastest checks (run first if verify is slow)
node tools/validators/validate-frontmatter.mjs
node tools/validators/validate-wiring-completeness.mjs
node tools/validators/validate-new-file-dna.mjs
node tools/validators/validate-ui-completeness.mjs

# Structural checks (run when adding new governance artifacts)
node tools/validators/validate-audit-slug-coverage.mjs
node tools/validators/validate-audit-runner-slices.mjs
node tools/validators/validate-behavioral-contract-slices.mjs
node tools/validators/validate-principle-slices.mjs

# Planning quality (run before declaring done on a feature)
node tools/validators/validate-creation-completeness.mjs
node tools/validators/validate-pi-questions-answered.mjs
node tools/validators/validate-handoff-completeness.mjs
```

---

## When verify passes but the feature isn't done

The validators check structural requirements. They don't check user function.

`pnpm verify exit_code=0` means: the code is well-constructed within the platform's architecture.

It does NOT mean: the user can accomplish their goal.

After verify passes, execute the `user_journey_test` from the PI item manually. Walk through every step. Observe every outcome. Compare to the specification. Only when the observation matches the specification is the feature DONE.
