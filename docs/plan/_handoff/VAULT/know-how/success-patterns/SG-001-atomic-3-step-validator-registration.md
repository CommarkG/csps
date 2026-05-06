---
id: csps.know-how.success-patterns.sg-001
name: atomic-3-step-validator-registration
description: Every new validator shipped with its audit slug + verify.mjs cycle + KNOWN_MAPPINGS entry in the same commit — zero orphans, zero rework
confidence: HIGH
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: know_how_success_patterns
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
first_seen: S011
confirmation_count: 3
source_sessions: [S011]
applies_to: [validator-authoring, implement]
do_checklist_item: "For every new validator: author .mjs + wire verify.mjs cycle + add audit-runner.md row + add KNOWN_MAPPINGS entry — all in the SAME COMMIT. This is the atomic 3-step."
outcome_evidence: |
  S011: validate-audit-slug-coverage.mjs enforcing this rule caught 3 orphan validators
  in the §24++ deep-audit pass. After adopting the atomic 3-step, 0 orphan validators
  were created in subsequent S011 work (validate-rzf-evidence, validate-slice-freshness,
  validate-no-implementation-without-plan all registered correctly on first commit).
reuse_instruction: |
  Before committing any new tools/validators/validate-*.mjs:
  1. tools/validators/validate-X.mjs (the validator)
  2. tools/verify.mjs cycle entry (name + command + parse_output)
  3. audit-runner.md table row (slug + cadence + severity + description)
  4. audit-runner/pipeline-meta.md row (abbreviated)
  5. validate-audit-slug-coverage.mjs KNOWN_MAPPINGS entry (if slug name differs from filename)
  All 5 in one commit. validate-audit-slug-coverage.mjs will catch any missed.
---

# SG-001 — Atomic 3-Step Validator Registration

**Pattern:** When authoring a new validator, register it completely (validator file + verify cycle + audit slug + KNOWN_MAPPINGS) in the same commit.

**Why it works:** Splitting the registration into separate steps creates an intermediate state where the validator exists but isn't tracked. This intermediate state is the exact failure mode EP-003 (missing-registration) catches. By atomizing all 3 steps, there IS no intermediate state.

**The compounding benefit:** Once validate-audit-slug-coverage.mjs is active (it is), any future validator that misses the atomic registration fails pnpm verify immediately on its own commit — before it can become a gap that needs a §24++ fix session.
