---
id: SIA.INFRA-FLOW-VALIDATION
name: SIA-INFRA-FLOW-VALIDATION
description: "End-to-end flow validation spec — the 9 steps every CSPS app must pass"
type: architecture
protection_level: protected
status: active
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "0.1"
session: S056
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

**Current status:** PARTIAL (S056)
**Built:** libs/threshold/ classify(10 types) + route(7 pipelines) + intake.ts processGovernorInput() → writes to .csps/threshold/intake-log.yaml
**Still missing:** Auto-wire to user-prompt-submit-intake.sh (session-open integration). Currently called manually via node.

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

**Current status:** ACTIVE (S056)
**Built:** tools/scripts/fork-app.mjs — copies apps/template/, updates package.json name, creates app.config.yaml, runs pnpm install + build.
**Usage:** node tools/scripts/fork-app.mjs --slug=\<app-slug\> [--skip-build]

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

**Current status:** PARTIAL (S056)
**Built:** tools/scripts/capture-session-evidence.mjs — reads verify-last-run.md + gap register + layer progress + sonnet-turn summary. Writes .csps/evidence/session-\<S0NN\>-evidence.yaml.
**Still missing:** Automatic trigger at session close (post-stop-session-close-gate.sh integration).

---

## INFRA-FLOW-VALIDATION Test Status

| Step | Status | Runnable? | Notes |
|---|---|---|---|
| 1 — Threshold | ACTIVE (S056) | Yes | user-prompt-submit-intake.sh wired to write ThresholdIntakeRecord to .csps/threshold/intake-log.yaml (PROTO-F). |
| 2 — PE Scoring | PARTIAL (enhanced, S056) | Partially | libs/intelligence/ PE sub-engine built (eb9350f). |
| 3 — Planning Wizard | ACTIVE (S057) | Yes | apps/csps-playground/src/app/platform/wizard/page.tsx — 7-section wizard UI, saves to tools/data/wizard-drafts/. |
| 4 — PMI Gate | ACTIVE | Yes | validate-plan-readiness.mjs LIVE. |
| 5 — Fork | ACTIVE (S056) | Yes | tools/scripts/fork-app.mjs built (PROTO-E). |
| 6 — Verify | ACTIVE | Yes | pnpm verify + 156 validators. |
| 7 — Deploy | ACTIVE | Yes | Vercel csps-playground.vercel.app live. |
| 8 — Activate | ACTIVE | Yes | pageDNA + DNA validators. |
| 9 — Evidence Capture | ACTIVE (S056) | Yes | capture-session-evidence.mjs auto-triggered at session close via post-stop-session-close-gate.sh (PROTO-F). |

**Composite test runnable:** Yes for 8/9 ACTIVE steps. Step 2 (MDPE dimensions for all plan items) still partial.
**Blocked on:** Step 3 Wizard UI (Layer 3 — S057 target), Step 2 PE MDPE dimensions in all items
**Updated:** S056 PROTO-E

---

## Why This Document Matters

This spec makes INFRA-FLOW-VALIDATION a concrete test, not a concept.
Each "NOT BUILT" row is a plan item. Each "PARTIAL" row is an enhancement target.
When every row shows "ACTIVE" and the test runs end-to-end without manual intervention,
CSPS is ready for its first PROCESS-CORRECT build.

---

*INFRA-FLOW-VALIDATION | SIA | S052 | Protection: protected*
