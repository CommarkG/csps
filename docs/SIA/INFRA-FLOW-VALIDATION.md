---
id: SIA.INFRA-FLOW-VALIDATION
name: SIA-INFRA-FLOW-VALIDATION
description: "End-to-end flow validation spec — the 9 steps every CSPS app must pass"
type: architecture
protection_level: protected
status: draft
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "0.1"
session: S052
core_spines: [GVRN, ARCH, OPER]
core_spine: GVRN
schema_anchor: vault_files
context_question: "Before claiming any app build follows the CSPS process, which of the 9 end-to-end steps can be demonstrated with a real run?"
context_quote: "The test that cannot be run yet is the specification for what must be built."
impl_status: swift-implemented
links:
  - SIA.R1-04-THRESHOLD
  - csps.plan.unified-plan.INFRA-FLOW-VALIDATION
consolidation_cross_refs:
  - docs/plan/apps/APP-001-voice-sorting/dual-focal-plan.yaml
  - tools/config/unified-plan.yaml
---

# INFRA-FLOW-VALIDATION — End-to-End Flow Spec

> The complete CSPS app build flow. Every step must pass before a build is considered
> CSPS-process-correct. This document defines each step, its current status, and
> the exact criteria for "pass."

---

## The 9-Step Flow

### Step 1 — IDEA → THRESHOLD

**What happens:** Every new app idea is submitted to Threshold intake.
Threshold classifies it (type, spine_tag, scope_tag, urgency), tags it, and routes it
to the correct pipeline (PE_INTAKE for new app ideas).

**Pass criteria:** Input enters as unstructured text, exits as a structured intake record
with all required fields. No manual classification by Governor.

**Current status:** NOT BUILT
**Blocked on:** Threshold code (R1-04-THRESHOLD.md design exists, code does not)
**Existing partial:** user-prompt-submit-intake.sh is a thin T1 approximation (PROTOCOL_ONLY)

---

### Step 2 — PE SCORING

**What happens:** The classified input is scored by the Platform Intelligence Engine.
MDPE formula produces a score. The item is ranked vs. the existing backlog.
Governor sees: "This idea ranks #N in current backlog. Here's why."

**Pass criteria:** MDPE score computed with all 5 dimensions. Rank produced automatically.
Governor does not compute PE manually.

**Current status:** PARTIAL
**What exists:** validate-pe-dashboard.mjs + unified-plan.yaml (classic PE + MDPE S052)
**What's missing:** MDPE dimensions in all plan items (5 items scored, rest pending)
**Blocked on:** mdpe_dimensions fields in remaining plan items + automated scoring

---

### Step 3 — 7-SECTION PLANNING WIZARD

**What happens:** Governor answers 7 questions about the app. The wizard produces a complete
plan item with all sections: problem-statement, user-persona, market-position, core-loop,
AI-behavior, success-metrics, phase-plan.

**Pass criteria:** Plan item exits wizard with all 7 sections populated. PMI indicators
checkable. ai_behavior_analysis section present (B_AI_BEHAVIOR_IN_PLANS).

**Current status:** PROTOCOL_ONLY
**What exists:** docs/SIA/CREATION-WIZARD-PROTOCOL.md (updated S052 with context_question
+ ai_behavior_analysis + core_signal requirements)
**What's missing:** UI wizard (Governor currently follows protocol as a checklist)
**Blocked on:** no UI — Governor must follow protocol manually

---

### Step 4 — PMI GATE

**What happens:** validate-plan-readiness.mjs checks PMI indicators for the plan item.
All 5/5 indicators must be green before fork is authorized.

**Pass criteria:** validate-plan-readiness.mjs exits 0 with pmi_ready=5/5 for this item.

**Current status:** ACTIVE (BUILT)
**Evidence:** pnpm verify shows plan_readiness PASS, pmi_ready=5, premature_implementing=0

---

### Step 5 — FORK

**What happens:** apps/template/ is forked to apps/[app-name]/.
The fork is clean — template files only, no app-specific content.

**Pass criteria:** New app directory exists with all template files. pnpm --filter @csps/[app-name] build PASS.

**Current status:** PARTIAL (manual process)
**What exists:** apps/template/ exists as the fork source
**What's missing:** Automated fork script (`nx g platform:app --slug=<slug>` or equivalent)
**Current workaround:** Governor manually forks with Sonnet assistance per Gate 3 Vercel config

---

### Step 6 — VERIFY

**What happens:** pnpm verify runs against the full platform including the new app.
All 143+ validators pass.

**Pass criteria:** pnpm verify exit_code=0 with new app included.

**Current status:** ACTIVE (BUILT)
**Evidence:** every PROTO commit ends with pnpm verify exit_code=0

---

### Step 7 — DEPLOY

**What happens:** Vercel deployment triggered. URL confirmed live.

**Pass criteria:** Production URL responds 200. No build errors in Vercel logs.

**Current status:** ACTIVE (BUILT)
**Evidence:** gate3-vercel-config.md documents the verified production pattern
(Root Dir=apps/[app], framework=nextjs, include-outside-root=enabled)

---

### Step 8 — ACTIVATE

**What happens:** validate-activation-coverage.mjs confirms all behavioral contracts
for the new app are activated. No unactivated contracts for new app code.

**Pass criteria:** validate-activation-coverage.mjs exit_code=0 with new app included.

**Current status:** ACTIVE (BUILT)
**Evidence:** validate-activation-coverage BLOCKING per fa6f62d

---

### Step 9 — EVIDENCE CAPTURE

**What happens:** Session harvest (Threshold R1.4.4) captures the completed build cycle
as a structured learning event. The build is added to the "CSPS-correct builds" registry
for SIMULATION COMPARISON (before/after when habit-tracker is compared to first
CSPS-correct build).

**Pass criteria:** Session harvest file created. Build added to correct-builds registry.

**Current status:** NOT BUILT
**Blocked on:** Session harvest automation (Threshold R1.4.4 code, also NOT BUILT)

---

## INFRA-FLOW-VALIDATION Test Status

| Step | Status | Runnable? |
|---|---|---|
| 1 — Threshold | NOT BUILT | No |
| 2 — PE Scoring | PARTIAL | Partially |
| 3 — Planning Wizard | PROTOCOL_ONLY | Manually |
| 4 — PMI Gate | ACTIVE | Yes |
| 5 — Fork | PARTIAL (manual) | Manually |
| 6 — Verify | ACTIVE | Yes |
| 7 — Deploy | ACTIVE | Yes |
| 8 — Activate | ACTIVE | Yes |
| 9 — Evidence Capture | NOT BUILT | No |

**Composite test runnable:** No — Steps 1, 3 (automated), 9 are not built.
**Estimated sessions to composite test:** 3-4 (Threshold code + wizard UI + harvest automation)

---

## Why This Document Matters

This spec makes INFRA-FLOW-VALIDATION a concrete test, not a concept.
Each "NOT BUILT" row is a plan item. Each "PARTIAL" row is an enhancement target.
When every row shows "ACTIVE" and the test runs end-to-end without manual intervention,
CSPS is ready for its first PROCESS-CORRECT build.

---

*INFRA-FLOW-VALIDATION | SIA | S052 | Protection: protected*
