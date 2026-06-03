---
id: csps.handoff.vault.session-s056-extraction
name: session-S056-extraction
description: "Session S056 harvest — Layer 1 + Layer 2 implementation. libs/threshold Phase 1, libs/behavior-hub Phase 1, libs/intelligence Phase 1. 3 Foundation Bundles sealed. CEC v2 specificity fix. B_PIE contracts. Partial extraction (session ongoing)."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
session: S056
links:
  - { rel: session-state, href: ../../../../tools/session-state.json }
  - { rel: gap-register, href: ../../../../tools/data/gap-recurrence-register.yaml }
  - { rel: improvement-register, href: ../../../../tools/data/improvement-register.yaml }
---

# Session S056 Extraction (partial — session ongoing)

## Key Builds

**libs/threshold/ Phase 1 (eb9350f baseline):**
- classify(): 10 input types, inferred spine/scope/urgency
- route(): YAML pipeline dispatch (7 pipelines), router.ts YAML parser bug fixed (last rule per pipeline was dropped)
- Tests: 22/22 pass

**libs/behavior-hub/ Phase 1:**
- BehaviorProfile: userId×appSlug YAML store with create/get/update
- Auto-create on first visit (Decision 3 from PROFILING-HUB-SCHEMA.md)
- Tests: 23/23 pass

**libs/intelligence/ Phase 1:**
- Learning Loop: scanGapRegister + scanImprovementRegister + writeSessionSummary + appendToPendingItems
- PE: getTopItems + checkReadinessGate + D1 readiness scan
- CIE: getCIEStatus aggregates 5 sub-engines (PE + Learning Loop + 3 stubs)
- Tests: 21/21 pass

**Foundation Bundles (3/5 sealed):**
- AUTH.bundle.yaml (Clerk auth, no DB)
- DEPLOY_PIPELINE.bundle.yaml (Vercel, zero-laptop, verify gate)
- GOVERNANCE_LAYER.bundle.yaml (pageDNA, validators, hooks)
- TENANCY + AUDIT_BASE blocked on Supabase provision

## Key Fixes

**CEC v2 specificity (root fix for imp_CEC_SPECIFICITY):**
- cec-improvement-check.mjs v2: reads cec-path-map.yaml explicit path→improvement mapping
- Eliminates keyword extraction that caused 9+ false positives per session
- imp_CEC_SPECIFICITY → structural_fix_proposed

**AGENTS.md 199 lines:**
- PIE hard NOs (B_PIE_READINESS_GATE + B_PIE_ANTI_SATISFACTION) added at lines 57-58
- 2 blank lines compressed to stay at 199 (advisory threshold, not BLOCKING)

## Key Insights

1. **Router YAML parser bug:** when parsing pipelines.yaml, the last routing_rule in each pipeline was being dropped. Fix: flush currentRule BEFORE starting a new rule, not only at pipeline start. Pattern: parser state must flush before transitions, not after.

2. **Git Bash path translation for Node tests:** `/c/Users/...` → Node sees as `C:\c\Users\...` (wrong). Fix: use relative paths from REPO_ROOT with `cd "${REPO_ROOT}" && node "${relative_path}"`. Applied to all 4 behavioral tests.

3. **CEC keyword breadth:** "template", "behavioral", "vault" as keywords match too many irrelevant paths. Root fix: explicit path→improvement mapping table. Keyword extraction was architecturally wrong from the start — descriptions are human language, not file paths.

4. **`profileExists` must be re-exported from service.ts** when tests import from service.ts. If a public API function lives in a different module, re-export it at the service boundary.

## Pending

- Layer 1: TENANCY + AUDIT_BASE bundles pending Supabase provision
- Layer 2: validate-pie-readiness-gate.mjs still to build (PROTO-D Step 1)
- Layer 3: Not started (awaits Layer 2 complete gate)
