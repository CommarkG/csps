---
id: csps.handoff.vault.topic-plan.csps-complete-architecture-s026
name: csps-complete-architecture-s026
description: >
  Implementation plan for the CSPS Complete Architecture (EXT-20260512-002-A):
  DNA processing consolidation, audit pipeline ZF connection, core harmonization,
  developer compliance enhancements, external user feedback infrastructure,
  vault proactive completion mechanism, ZF as universal quality standard.
  Governor directive S025 — "take a deep breath, explore everything working together."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: gradual-build-plan
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, OPER, VALD]
schema_anchor: topic_plans
domain_path: platform
depth_chosen: 5
depth_rationale: |
  Depth-5: constitutional. Covers all 5 Core Spines, all platform layers, all 9 audit
  pipelines, all 5 vault types, all external feedback paths. This is the platform's
  self-governance architecture — it governs everything else.
priority_score: 88
priority_band: 1
session: S025
impl_status: swift-implemented
execution_mode: deep_quality
know_how_consulted: true
intent_crystallized: true
intent_crystallized_at: "S025 Governor directive 2026-05-12"
threshold_intake_level: deep
threshold_participants: [human, ai]
threshold_route: platform.governance
goal_statement: >
  A fully ZF-governed, Threshold-connected platform where every input (human directive,
  developer question, user feedback, AI insight) flows through a single unified processing
  path, every audit pipeline has a ZF gate, the core is harmonized and contradiction-free,
  developers always know where they are in the hierarchy, external user feedback is treated
  as a Threshold input and PE-supervised in a vault, and nothing is ever abandoned —
  only deferred with intent and a trigger.
done_criteria:
  - "validate-contract-harmonization.mjs running (catches B_* contradictions)"
  - "validate-cold-start-path.mjs running (validates developer golden path completeness)"
  - "VAULT/feedback/ directory exists with Pipeline 8 routing"
  - "Every WizardTemplate step acceptance_criterion references a specific validator"
  - "validate-pe-dashboard.mjs surfaces vault items with met trigger conditions"
  - "raw-thoughts-queue.md PENDING items all have PE score + trigger condition"
  - "pnpm verify exit_code=0"
failure_signal: >
  External user feedback enters the platform without going through Pipeline 8 (Threshold).
  OR two B_* contracts contradict each other and the validator doesn't catch it.
  OR a vault item stays PENDING for >30 days without a documented trigger or review.
links:
  - { rel: architecture-synthesis, href: ../../../../docs/plan/_handoff/VAULT/contexts/governance/platform-readiness/EXT-20260512-002-A-csps-complete-architecture-synthesis.md }
  - { rel: master-plan, href: ./csps-master-plan-s025-plus.md }
  - { rel: audit-runner, href: ../../../../docs/plan/pillar-0-governance/audit-runner.md }
  - { rel: threshold-protocol, href: ../../../../docs/plan/pillar-0-governance/threshold-intake-protocol.md }
---

# CSPS Complete Architecture — S026 Implementation Plan

## §0 — CONSOLIDATION CHECK

Searched existing plans for: architecture consolidation / audit pipeline ZF / feedback infrastructure:
- `csps-continuous-intelligence-architecture.md` — intelligence/learning (different scope)
- `csps-platform-governance-cycle.md` — governance cycle (relates but doesn't cover feedback)
- `enforcement-rate-uplift.md` — enforcement rate (subset of this plan)
- No existing plan covers the full unified processing flow or feedback infrastructure

**Result:** Net-new plan. This plan supersedes enforcement-rate-uplift.md for the broad architecture scope
and composes with (not duplicates) all referenced plans.

---

## §0b — Intent Crystallization

**Problem:** The platform has all the right components (Threshold, DNA, 9 pipelines, ZF, PE, vaults)
but they operate as independent mechanisms without a unified processing flow. Input can bypass
the Threshold. Vaults have no trigger conditions. External feedback has no Threshold entry.
B_* contracts may contradict without detection. The core's harmonization is manual.

**Goal:** See goal_statement above.

**Done:** See done_criteria above.

**Failure:** See failure_signal above.

---

## §1 — PE-Scored Item List

| # | Item | PE | Band | Gate | Session |
|---|---|---|---|---|---|
| 1 | validate-contract-harmonization.mjs — detect B_* contradictions | 84 | 1 | Core harmonization blocker | S026 |
| 2 | WizardTemplate steps → validator links | 80 | 1 | ZF-Threshold connection | S026 |
| 3 | validate-pe-dashboard.mjs — vault trigger surfacing | 78 | 2 | Proactive completion | S026 |
| 4 | raw-thoughts-queue.md — add PE + trigger to all PENDING items | 75 | 2 | Vault philosophy | S025 |
| 5 | VAULT/feedback/ directory + Pipeline 8 routing | 73 | 2 | External user feedback | S027 |
| 6 | validate-cold-start-path.mjs — developer golden path validator | 70 | 2 | Gate 3 readiness | S026-S027 |
| 7 | validate-universal-alignment.mjs — threshold_route × core_spine cross-check | 68 | 2 | DNA gate integrity | S026 |
| 8 | M-18 in validate-moat-coverage.mjs (threshold protocol = M-18 coverage) | 65 | 2 | Moat completeness | S025 |
| 9 | validate-vault-completeness.mjs — audit PENDING items without trigger | 62 | 2 | Vault proactive completion | S027 |
| 10 | session-open.sh: raw-thoughts-queue PENDING trigger status | 60 | 2 | Session orientation | S025 |
| 11 | Feedback → VLT link for bugs (auto-raise VLT when feedback type=bug) | 58 | 3 | Feedback severity routing | S027 |
| 12 | P-META-024 or P-META-016 extension: vault-as-proactive-completion principle | 55 | 3 | Vault governance | S027 |
| 13 | validate-pipeline-zf-connection.mjs — every pipeline has defined ZF gate | 52 | 3 | ZF-pipeline integrity | S027 |

---

## §2 — Layer Sequence

### Layer 1 — Core Harmonization + Vault Philosophy (S025-S026)

**Exit criteria:**
- [ ] validate-contract-harmonization.mjs: created, runs advisory, catches contradiction pattern
- [ ] raw-thoughts-queue.md: all PENDING items have `pe_score:` + `trigger:` + `review_by:`
- [ ] validate-moat-coverage.mjs: M-18 marked covered (threshold-intake-protocol.md = Question Protocol)
- [ ] pnpm verify exit_code=0

### Layer 2 — ZF-Threshold Connection + Developer Compliance (S026)

**Exit criteria:**
- [ ] All 9 WizardTemplate → each step's acceptance_criterion references a specific validator slug
- [ ] validate-cold-start-path.mjs: advisory check that all WizardTemplate steps have validator refs
- [ ] validate-universal-alignment.mjs: add threshold_route × core_spine cross-check
- [ ] validate-pe-dashboard.mjs: add vault trigger surfacing (PENDING items with met trigger condition)
- [ ] pnpm verify exit_code=0

### Layer 3 — External Feedback Infrastructure (S027)

**Exit criteria:**
- [ ] VAULT/feedback/ directory created with README + Pipeline 8 routing doc
- [ ] feedback schema: {type: feature|bug|insight, content, app, pe_score, trigger, status}
- [ ] Pipeline 8 (learning loop) explicitly updated to be external feedback entry point
- [ ] Bug feedback → auto-raise VLT mechanism documented
- [ ] validate-vault-completeness.mjs: advisory check for PENDING vault items without trigger
- [ ] pnpm verify exit_code=0

### Layer 4 — Full Unified Processing Flow + ZF Evidence (S027-S028)

**Exit criteria:**
- [ ] Every new input in this session goes through documented Threshold intake
- [ ] Every audit pipeline exit has documented ZF gate in audit-runner.md
- [ ] validate-pipeline-zf-connection.mjs: advisory — checks each pipeline has zf_gate field
- [ ] P-META-024 (or P-META-016 extension): vault-as-proactive-completion principle registered
- [ ] Full ZF Level 3 on platform + ZF ACHIEVED
- [ ] csps-master-plan-s025-plus.md §5 updated with completions

---

## §3 — Quick Wins (Do in S025 before closing)

These are immediate actions that don't require plan coverage (already covered by THIS plan):

1. **raw-thoughts-queue.md**: open it, scan all PENDING items, add pe_score + trigger to each → 1 session task
2. **validate-moat-coverage.mjs**: M-18 is threshold-intake-protocol.md coverage — mark as covered
3. **audit-runner.md**: add `zf_gate:` field to each pipeline description (documentation-only, no code)

---

## §4 — Architecture Validation

The complete architecture is validated when this checklist passes:

| Check | Method | Status |
|---|---|---|
| Every input goes through Threshold | validate-intent-crystallized.mjs + validate-routing-declared.mjs | ⚠️ Partial |
| DNA gate fires on every new artifact | validate-universal-alignment.mjs + validate-frontmatter.mjs | ✅ Active |
| Every pipeline has ZF gate | validate-pipeline-zf-connection.mjs | ❌ Not built |
| No B_* contradictions | validate-contract-harmonization.mjs | ❌ Not built |
| Vault items have PE + trigger | validate-vault-completeness.mjs | ❌ Not built |
| External feedback enters Pipeline 8 | VAULT/feedback/ routing doc | ❌ Not built |
| Developer golden path complete | validate-cold-start-path.mjs | ❌ Not built |
| PE dashboard shows vault triggers | validate-pe-dashboard.mjs Phase 2 | ❌ Phase 2 |
