---
enforcement_trio:
  t1:
    tier: hook
    path: ".claude/hooks/pre-tool-use-plan-coverage-gate.sh"
    status: stub
  t2:
    tier: validator
    path: "tools/validators/validate-pie-readiness-gate.mjs"
    status: active
  t3:
    tier: memory
    path: "`CORE-COMPLETE-EXIT-CRITERIA.md` loaded at session open via session-open-context.mjs"
    status: active
  exempt_reason: null
---
---
id: csps.pillar-0-governance.behavioral-contracts.B_PIE
name: B_PIE
description: "Two PIE behavioral contracts: B_PIE_READINESS_GATE (no item implements before its layer prerequisites are met) and B_PIE_ANTI_SATISFACTION (K≥2 gaps require structural fix, not instance fix). Ratified S056."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: behavioral_contracts
session: S056
inherits_from: "Platform Genome §5 Platform Intelligence + CORE-COMPLETE-EXIT-CRITERIA.md"
enforcement_tier:
  T1: pre-tool-use-plan-coverage-gate.sh (extend for readiness gate) + pre-tool-use-rzf-evidence-gate.sh (extend for anti-satisfaction)
  T2: validate-pie-readiness-gate.mjs (to build S057) + validate-gap-recurrence.mjs (existing)
  T3: session-open injection via CORE-COMPLETE-EXIT-CRITERIA.md + gap-recurrence-register.yaml
context_question: "Before moving any item to implementing: do all prerequisite layers have exit_criteria_met=true? Before addressing a K≥2 gap: is the fix structural (S3), not instance (S1)?"
---

# B_PIE — Platform Intelligence Engine Behavioral Contracts

> Two contracts ratified by Opus-8 S056 with R2-01 PIE design.
> Both prevent platform-layer failures: building out of order, and cycling on the same gap.

---

## B_PIE_READINESS_GATE

**Contract:** No plan item may advance to `status: implementing` unless its architectural layer prerequisites are verified against CORE-COMPLETE-EXIT-CRITERIA.md.

**Layer prerequisite chain:**
- R1 items (Schema Layer): no prerequisites
- R2 items (Intelligence Layer): requires R1 Layer 1 — 4/4 exit criteria met
- R3 items (Developer's Journey): requires R1 + R2 both complete
- R4 items (Frontend Inheritance): requires R1 + R2 + R3 complete
- App items: requires all 4 layers + Developer's Journey ratified

**Governing intent:** The platform builds in layers, not in parallel. An R2 item built before R1 is complete has a foundation it cannot verify. When R1 changes (which it will), R2 breaks silently. Layer gates prevent invisible technical debt from accumulating.

**Violation examples:**
- Setting `status: implementing` on APP-001-PLAN when R1 Layer 1 is still 3/4 complete
- Starting INFRA-FLOW-VALIDATION (R3) before PIE Phase 1 (R2) is built and verified
- Implementing any Enterprise feature before the Developer's Journey is ratified

**Satisfaction point:** `item.status = implementing` AND all prerequisite layers have exit criteria fully passing in CORE-COMPLETE-EXIT-CRITERIA.md. Validation: `validate-pie-readiness-gate.mjs` (planned S057).

**enforcement_tier:**
- T1: `pre-tool-use-plan-coverage-gate.sh` — extend to check layer prerequisites before implementing tag is set
- T2: `validate-pie-readiness-gate.mjs` (to build S057) — BLOCKS if implementing item has unmet prerequisites
- T3: `CORE-COMPLETE-EXIT-CRITERIA.md` loaded at session open via session-open-context.mjs

---

## B_PIE_ANTI_SATISFACTION

**Contract:** When a gap has K≥2 in gap-recurrence-register.yaml, any S1 (instance-level) fix is PROHIBITED. Required path: S3 structural analysis → structural fix proposal → Opus ratification → T1+T2+T3 enforcement.

**Governing intent:** K≥2 means the instance fix already failed once. Applying it again is not a fix — it is a scheduled recurrence. The only way to stop the pattern is to address the structural cause. An S1 fix on K≥2 buys one session before the gap fires again.

**Scope hierarchy:**
- S1 (instance): fix the specific occurrence. Valid for K=1 only.
- S2 (process): fix the process that produced the instance. Valid for K=1 with ripple check.
- S3 (structural): fix the structure that allows the process to fail. Required for K≥2.

**Violation examples:**
- Patching a K=3 gap with a one-line code change and marking it resolved
- Adding a note to a K=2 gap entry without creating a validator or hook
- Applying an S1 fix to gap_ZF_NOMINAL_CYCLES (K=6) without structural enforcement

**Satisfaction point:** `gap.K>=2 AND structural_fix_committed = true AND behavioral_test_exists = true`. Validator: `validate-gap-recurrence.mjs` (already exists — BLOCKS K≥3 with no structural fix).

**enforcement_tier:**
- T1: `pre-tool-use-rzf-evidence-gate.sh` — extend to detect S1-only responses to K≥2 gaps
- T2: `validate-gap-recurrence.mjs` (ACTIVE) — BLOCKS K≥3 AND structural_fix_triggered=false
- T3: `gap-recurrence-register.yaml` loaded at session open + P-META-019 rule injected

---

*Ratified: S056 | Opus-8 R2-01 PIE design | Governor: Yariv Fink*
