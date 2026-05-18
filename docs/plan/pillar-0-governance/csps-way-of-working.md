---
id: csps.governance.csps-way-of-working
name: csps-way-of-working
description: "ONE SOURCE for how CSPS works — HOW WE PLAN, HOW WE IMPLEMENT, HOW WE CHECK. All three aligned to DNA, schema, core spines, AI behavior, and permanence enforcement. Prevention-first."
version: 1.0.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
diataxis_type: reference
session: S041
impl_status: swift-implemented
links:
  - { rel: how-we-plan, href: ./plan-creation-protocol.md }
  - { rel: how-we-plan-template, href: ../../tools/templates/gradual-build-plan.template.md }
  - { rel: how-we-implement, href: ./fse-creation-template.md }
  - { rel: how-we-implement-rules, href: ../../tools/council/communication-protocol-shared.md }
  - { rel: how-we-check, href: ../../tools/verify.mjs }
  - { rel: how-we-check-pipeline, href: ./audit-runner.md }
  - { rel: prevention-framework, href: ./core-scopes.md }
  - { rel: threshold, href: ./threshold-intake-protocol.md }
  - { rel: prace, href: ./behavioral-contracts/B_PRACE.md }
consolidation_cross_refs:
  - B_PRACE
  - B_INHERITANCE_POLICY
  - B_STRUCTURAL_PREVENTION_DISCIPLINE
  - P-META-026
  - P-META-027
---

# CSPS Way of Working — ONE SOURCE

> "I want you to see that these things are totally aligned to the platform and DNA and
> schema and core spines and optimized by themselves and working optimally with all audits
> and verifications and AI behavior and have perfect consolidations and 'one source of...'"
> — Governor directive S040/S041

---

## The Three Ways

Every piece of work in CSPS goes through all three. No step is skipped.

```
HOW WE PLAN → HOW WE IMPLEMENT → HOW WE CHECK
     ↑                                    |
     |                                    ↓
     └── THRESHOLD (assesses findings) ←──┘
```

---

## 1. HOW WE PLAN

**Core Spine:** GVRN (planning decisions are governance acts)
**Primary training default overridden:** DEFAULT-R3 (implement without planning)
**Canonical documents:**
- `plan-creation-protocol.md` — full planning protocol
- `gradual-build-plan.template.md` — the template (now includes §PA Prevention Analysis)

**Mandatory elements in every plan:**
- §PA Prevention Analysis (Scope-1/2/3 risks) ← **ADDED S041**
- §CC Creation Completeness Spec (register before implement)
- §BC Before Coding Checklist
- §IO Implementation Order (register/wire BEFORE implementing)
- §ET Enforcement Trio Assignment (T1+T2+T3 declared)
- Intent Crystallization (P-META-022 — human-authored goal_statement)
- Threshold submission (threshold_submitted field)

**Prevention focus:** Before any plan proceeds to implementation, Scope-3 risks must be named. The plan must declare which training default it overrides and what T1/T2/T3 will be installed.

**Permanence enforcement:**
- T1: `pre-tool-use-plan-coverage-gate.sh` — blocks libs/apps writes without plan
- T2: `validate-implementation-gate.mjs` — blocks implementation without ratified plan
- T2: `validate-plan-has-prevention.mjs` — BLOCKING if no Prevention Analysis ← **S041**
- T3: session-open.sh PRACE block — "plan before implement"

---

## 2. HOW WE IMPLEMENT

**Core Spine:** ARCH (implementation decisions are data domain decisions)
**Primary training default overridden:** DEFAULT-ME-1 (rule text = done)
**Canonical documents:**
- `fse-creation-template.md` — FSE checklist + threshold gate ← **UPDATED S041**
- `communication-protocol-shared.md` — 11 rules including Rule 11 (next build required)

**Mandatory elements in every implementation:**
- Parent plan referenced (no implementation without plan — B_NO_WILD_IMPLEMENTATION)
- Scope-2 ripple check before commit (connected elements updated)
- DNA block (@csps-dna) as first content of new files ← **S041 Sprint 2**
- FSE checklist: T5 AGENTS.md + T4 contract + T3 memory + T2 validator + T1 hook
- Threshold gate: Scope-3 findings routed before closing

**Prevention focus:** Every implementation must have a Component B (libs/ extraction). Every new rule goes through the FSE template with threshold gate. No "rule text = done."

**Permanence enforcement:**
- T1: `pre-tool-use-claude-dir-guard.sh` — blocks .claude/settings mid-session
- T1: `pre-tool-use-dna-block-check.sh` — BLOCKING if no @csps-dna ← **S041 Sprint 2**
- T2: `validate-wiring-completeness.mjs` — checks symbols are wired
- T2: `validate-inheritance-chain.mjs` — checks children match parent version ← **S041 Sprint 2**
- T3: communication-protocol-shared.md Rule 8 (register before implement)

---

## 3. HOW WE CHECK

**Core Spine:** VALD (checking is a validation domain act)
**Primary training default overridden:** DEFAULT-ME-3 (I believe it's done without evidence)
**Canonical documents:**
- `tools/verify.mjs` — 130 validators
- `audit-runner.md` — the pipeline specification
- `audit-hub.md` — orchestration

**Mandatory elements in every check:**
- `pnpm verify` exit_code=0 required before DONE declaration
- Findings categorized as S1/S2/S3 (Core Scopes) ← **S041 Sprint 1**
- S3 findings routed to threshold-intake-protocol.md for assessment ← **S041 Sprint 2**
- RZF cycles run with tool evidence (not reasoning-only)

**Prevention focus:** Finding things is only partial. Findings must be assessed by the threshold and routed through Core Scopes before a session can close.

**Permanence enforcement:**
- T1: `post-stop-pnpm-verify.sh` — runs verify after every response
- T2: 130 validators in verify.mjs
- T2: `findings-categorizer.mjs` — tags output as S1/S2/S3 ← **S041 Sprint 2**
- T2: `findings-router.mjs` — routes S3 to threshold ← **S041 Sprint 3**
- T3: session-open.sh — "Re-run IS the proof. DONE = THIS-SESSION evidence"

---

## The Pipeline: HOW WE CHECK → THRESHOLD → CORE SCOPES

**This is the missing link (currently paper-only — to be built S041 Sprint 2-3):**

```
verify.mjs runs
     ↓
findings-categorizer.mjs classifies each finding:
  S1 (BLOCKING) → fix immediately, same session
  S2 (ADVISORY) → ripple check, before next commit
  S3 (DEFERRED) → route to threshold

findings-router.mjs sends S3 findings to:
     ↓
threshold-intake-protocol.md assesses:
  NEW pattern → create OPEN-NNN with full PRACE template
  RECURRING → upgrade existing rule (not parallel one)
  KNOWN ISSUE → document why not acting (explicit deferral)
     ↓
Core Scopes close: Scope-1 ✅ + Scope-2 ✅ + Scope-3 ✅ → session can close
```

---

## DNA Alignment

Every artifact in CSPS carries its governance DNA:

| Artifact Type | DNA Block | Core Spine | Inherits From | Completion Status |
|---|---|---|---|---|
| Plans | `@csps-dna` + `core_spine:` | GVRN | gradual-build-plan.template.md | `completeness.status` |
| Code (libs/) | `@csps-id` + `@csps-enforces` | ARCH | libs/template/ | wiring-completeness validator |
| Governance rules | B_* contract + FSE 5/5 | GVRN | behavioral-contracts.md | surface count |
| Validators | `validate-*.mjs` + pnpm verify entry | VALD | audit-runner.md | BLOCKING/ADVISORY/DEFERRED |

---

## Core Spines for Each "How We"

| Domain | Primary Spine | Rationale |
|---|---|---|
| HOW WE PLAN | GVRN | Planning decisions = governance decisions |
| HOW WE IMPLEMENT | ARCH | Implementation = data domain architecture |
| HOW WE CHECK | VALD | Checking = coverage discipline |
| Threshold | GVRN > VALD | Intake = governance gate; findings = validation |

Precedence: GVRN > VALD > ARCH > AI > OPER

---

## One Source → All Elements

**This file** is the canonical reference. When the way CSPS works changes:
1. Update this file first
2. The linked canonical documents follow (via inheritance propagator when built)
3. Until propagator exists: update each linked document manually (Scope-2 ripple)

Do NOT maintain parallel descriptions of HOW WE PLAN/IMPLEMENT/CHECK anywhere else.
If another file says something different — THIS FILE wins.

---

*csps-way-of-working.md | ONE SOURCE | S041 | Governor directive S040*
