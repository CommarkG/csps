---
id: csps.governance.completeness-module
name: completeness-module
description: >
  The CSPS Completeness Module — SSoT for all completeness definitions in the platform.
  Consolidates 6 B_* completeness contracts into one canonical reference. Defines
  completeness at 4 levels (finding, value, session, meta). Includes meta-completeness:
  this module verifies that the completeness system itself is complete.
  Governor directive S025: "consolidated around one place that once improved projects it
  to all relevant places — and define completeness verification regarding itself."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: VALD
core_spines: [VALD, GVRN, AI]
schema_anchor: pillar_0_governance_leaves
impl_status: swift-implemented
domain_path: platform
depth_tier: L2
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:draft
session: S025
intent_crystallized: true
threshold_route: platform.governance
links:
  - { rel: b-rzf, href: ./behavioral-contracts.md#B_RZF }
  - { rel: b-cec, href: ./behavioral-contracts.md#B_CEC }
  - { rel: b-pre-close, href: ./behavioral-contracts.md#B_PRE_CLOSE_VERIFICATION }
  - { rel: b-protocol-literal, href: ./behavioral-contracts.md#B_PROTOCOL_LITERAL_EXECUTION }
  - { rel: b-catch-to-engraving, href: ./behavioral-contracts.md#B_CATCH_TO_ENGRAVING }
  - { rel: b-qc-audit, href: ./behavioral-contracts.md#B_QC_AUDIT }
  - { rel: dna-protocol, href: ./dna-protocol-making-sure-that.md }
  - { rel: platform-health, href: ./platform-health-questions.md }
  - { rel: validator, href: ../../../tools/validators/validate-completeness-coverage.mjs }
question_register:
  - id: Q001
    type: C
    question: "What does complete mean for the CSPS platform at each level?"
    asked_at: "S025 self-audit"
    answer: "Complete = (1) all findings resolved or explicitly deferred + (2) all value extracted from positive events + (3) all session close items done with evidence + (4) the completeness system itself is complete"
    confirmed: true
  - id: Q002
    type: Z
    question: "Is the completeness system itself complete — does meta-completeness pass?"
    asked_at: "S025 self-audit"
    answer: "PARTIAL — 6 contracts exist but scattered; meta-validator (validate-completeness-coverage.mjs) not yet built; CSPS governance files missing question_register"
    confirmed: true
diataxis_type: reference
---

# Completeness Module — The Platform's Definition of Done

> **This is the SSoT for completeness in CSPS.**
> All 6 B_* completeness contracts reference this module.
> Change the definition here → all completeness checks update automatically.

---

## §1 — The 4 Levels of Completeness

### Level 1 — Finding Completeness (ZF discipline)
**Definition:** Every blocking finding is resolved. Every advisory finding is either resolved or explicitly deferred with documented reason. No finding is silently dropped.

**Contract:** `B_RZF` (Real Zero Findings)
**Enforcement:** `pnpm verify` + `node tools/zf-orchestrator.mjs --level 3`
**Evidence form:** "STATUS: ZF ACHIEVED ✅" with cycle count

**Self-audit (QH-P-005):** ✅ — pnpm verify runs at every Stop. ZF ACHIEVED requires evidence.

---

### Level 2 — Value Completeness (CEC discipline)
**Definition:** When any positive event occurs (new principle/contract/insight/generator), extract maximum value across all relevant artifacts. Iterate until cycle returns 0 new opportunities.

**Contract:** `B_CEC` (Complete Extraction Cycle)
**Enforcement:** `post-tool-use-cec-trigger.sh` fires on every Write/Edit to behavioral-contracts.md or principles.yaml
**Evidence form:** CEC walk-trail in closing-summary §10.11

**Self-audit:** ⚠️ PARTIAL — CEC fires for specific file types but not for all new governance artifacts.

---

### Level 3 — Session Completeness (Pre-close discipline)
**Definition:** Before closing a session: ZF Level 3 run, all open items either resolved or explicitly deferred, HPFA passed, closing-summary §10.0 complete, HANDOFF authored.

**Contracts:** `B_PRE_CLOSE_VERIFICATION` + `B_PROTOCOL_LITERAL_EXECUTION` + `B_CATCH_TO_ENGRAVING`
**Enforcement:** `post-stop-pnpm-verify.sh` (runs verify) + `post-stop-session-close-gate.sh`
**Evidence form:** closing-summary §10.0 verification block

**Self-audit:** ⚠️ PARTIAL — session-close gate runs but is advisory. Some §10.0 sections still skippable.

---

### Level 4 — Meta-Completeness (self-verification)
**Definition:** The completeness system itself is complete when: all 6 contracts fire correctly, the meta-validator passes, every new B_* completeness contract automatically registers in this module.

**Contract:** `B_QC_AUDIT` (the audit-of-audits)
**Enforcement:** `validate-completeness-coverage.mjs` (TO BUILD — S026) — checks all 6 contracts are active + this module is referenced from each
**Evidence form:** "Meta-completeness: 6/6 contracts active + validate-completeness-coverage.mjs PASS"

**Self-audit:** ⚠️ PARTIAL — validate-completeness-coverage.mjs BUILT S025 (advisory, 1 finding below). Self-verification gap partially closed.

**Meta-completeness score: 1/5 YES, 3/5 PARTIAL, 1/5 MISSING** (updated S026)
- Level 1 (Finding): ✅ YES — pnpm verify + ZF orchestrator active
- Level 2 (Value): ⚠️ PARTIAL — CEC fires for specific files; gaps in governance artifacts
- Level 3 (Session): ⚠️ PARTIAL — advisory gates; some §10.0 sections skippable
- Level 4 (Meta): ⚠️ PARTIAL — validate-completeness-coverage.mjs built S025 (advisory); Phase 2 = blocking S026
- Level 5 (Instruction integrity): ❌ MISSING — no trigger vocabulary audit of completeness instructions (Turn 12 architecture addresses this)

---

## §2 — The 6 Completeness Contracts (All Must Reference This Module)

| Contract | Level | Validates | Enforcement | Status |
|---|---|---|---|---|
| `B_RZF` | 1 — Finding | ZF achieved per cycle | pnpm verify + ZF orchestrator | ✅ ACTIVE |
| `B_CEC` | 2 — Value | Maximum extraction from positive events | post-tool-use-cec-trigger.sh | ⚠️ PARTIAL (fires for specific files only) |
| `B_PRE_CLOSE_VERIFICATION` | 3 — Session | §10.0 cycle evidence before closing | post-stop-pnpm-verify.sh | ⚠️ PARTIAL (advisory) |
| `B_PROTOCOL_LITERAL_EXECUTION` | 3 — Session | Every protocol step has per-item evidence | TodoWrite discipline | ⚠️ PARTIAL (AI-dependent) |
| `B_CATCH_TO_ENGRAVING` | 3 — Session | Every catch becomes persistent artifact | post-tool-use-cec-trigger.sh | ⚠️ PARTIAL |
| `B_QC_AUDIT` | 4 — Meta | Audit of audits — completeness system itself | validate-completeness-coverage.mjs | ❌ MISSING VALIDATOR |

---

## §3 — The Meta-Completeness Check (Completeness Verifying Itself)

The completeness system is complete when it answers YES to all of:

1. **Finding completeness is enforced:** pnpm verify exit_code=0 AND ZF ACHIEVED at session close
2. **Value completeness fires on positive events:** CEC trigger covers ALL new principles, contracts, and governance artifacts (not just behavioral-contracts.md + principles.yaml)
3. **Session completeness is verified:** closing-summary §10.0 is NOT skippable — every section has enforcement
4. **Meta-validator passes:** `validate-completeness-coverage.mjs` confirms all 6 contracts are active + this module is referenced from each
5. **CSPS governance files eat their own food:** every governance artifact has question_register, depth_tier, and diataxis_type (the fields it requires of others)

**Current meta-completeness score: 1/5 YES, 3/5 PARTIAL, 1/5 MISSING**

---

## §4 — Completeness for External Products

When CSPS builds apps for external users, "completeness" means:

**User-facing:** The Threshold Wizard is complete for a user when the user has:
1. Answered Q1c (problem) + Q2c (goal) + Q3c (done signal) with confirmed answers
2. The system has recorded: `goal_statement`, `done_criteria`, `failure_signal` in their profile
3. The dashboard only shows after wizard completion (gate is enforced)

**Developer-facing:** A feature is complete when the developer has:
1. Run pnpm verify (exit_code=0) — finding completeness
2. Written the test that will catch regression — value completeness
3. Documented the JTBD outcome + ux_principle — session completeness

**Platform-facing (Gate 3):** App #2 is complete when:
1. pnpm verify passes with budget-planner slice validators
2. Foundation code unchanged (gate test passes)
3. Tenant isolation adversarially proven
4. Cold-start test passes

---

## §5 — Completeness and Context

Completeness is the answer to context loss. When context degrades across sessions, the question "is this done?" becomes ambiguous. The ZF cycle + question_register + closing-summary together create a context-independent completeness record: any future session can verify completeness by reading these artifacts, not by relying on memory.

**The completeness-context connection:**
- `question_register` preserves the questions that define completeness criteria
- `closing-summary §10.0` preserves the evidence of completeness
- `ZF Level 3` provides the verification that completeness is current

These three together make completeness **session-independent** — the moat property.

---

## §6 — Consolidated Change Point

When the definition of completeness changes:
1. Update THIS FILE (§1-4)
2. Update the affected B_* contract's cross-reference to this module
3. Run `validate-completeness-coverage.mjs` (when built)
4. Update dna-protocol-making-sure-that.md §12 if completeness status changes

Do NOT update individual contracts directly for definitional changes — update here first.

---

*Authored: S025 | Self-audit confirmed gaps: meta-completeness validator missing + CEC scope too narrow*
*Next: validate-completeness-coverage.mjs (S026) + CEC trigger extension to ALL governance files*
