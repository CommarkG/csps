---
id: csps.research.S084-journey-external-consolidation
name: S084-journey-external-consolidation
description: "Three-way consolidation (Claude + Gemini + GPT) of the external critique of the 14-step Journey-as-Process. The CONSENSUS (high-confidence where all 3 agree), what CSPS already has, the corrected journey model, and the revised doctrine. This supersedes the raw-14-linear-steps framing as the orchestrator spec."
version: "1.0"
session: S084
owner: group:finky
authored_by: OPUS-21
core_spine: GVRN
diataxis_type: explanation
schema_anchor: vault_files
lifecycle: production
lifecycle_state: active
status: draft
impl_status: audit-1-complete
links:
  - { rel: claude, href: S084-journey-external-comments-claude.md }
  - { rel: gemini-gpt, href: S084-journey-external-comments-gemini-gpt.md }
  - { rel: persona-audit, href: ../../../pillar-0-governance/JOURNEY-PERSONA-AUDIT-S084.md }
  - { rel: trunk-branch, href: ../../../pillar-0-governance/P-ARCH-TRUNK-BRANCH-PATTERN.md }
---

# Three-Way Consolidation — External Critique of the Journey-as-Process

> All 3 independent models (Claude, Gemini, GPT) converged. Where all three agree = HIGH CONFIDENCE.

## CONSENSUS (all 3 agree — adopt)
1. **14 fixed linear steps = the anti-pattern.** Trunk = ~5 PHASES/states with mandatory EXIT GATES; the
   14 steps become SUBROUTINES / persona expressions. (Claude 5-6 phases · Gemini 5 Epochs · GPT 9 states.)
2. **CLASSIFY before the journey** (work-type + risk + novelty + reversibility + blast-radius + evidence-
   requirement) → selects the journey VARIANT (fast / standard / governed / exploratory-case) and depth.
   This — NOT persona — is the primary branch selector. (GPT + Gemini call this THE single change.)
3. **Persona = a VIEW/permission/automation/vocabulary OVERLAY** over one work record — NOT the core
   branching. (Corrects our S084 persona audit, which treated persona as the branch selector.)
4. **minimum_exit_evidence at every gate** + an **evidence ledger** — operationalize "verified" (artifact/
   decision/signal required to proceed). (Claude's #1 · GPT evidence-ledger · Gemini immutable telemetry.)
5. **Drive-vs-auto via PROGRESSIVE DISCLOSURE + a "Journey Receipt"** — never invisible execution. Receipt:
   goal-interpreted / existing-checked / assumptions / recommended-path / why-not-others / changes / risks /
   tests / approver / rollback. Short(naive)→expandable(expert)→auditable(admin). Pitfalls: hidden-state,
   false-confirmation, trust-collapse-on-first-failure, automation-bias.
6. **Compression doctrine + NO silent skip:** every step = completed | compressed | delegated | N/A |
   explicitly-skipped-with-rationale; rules govern compressibility by risk/reversibility/compliance; a
   method-review / process-mining loop evolves the method from real event logs, not architect opinion.
7. **MISSING phases (add):** Constraint Capture + Non-goals · Acceptance Criteria EARLY (def-of-done) ·
   Owner/Approver RACI · Rollback/fallback/compensation + Exception states.
8. **"≥3 simulations" = rigid-number anti-pattern** → replace with risk-based exit criterion ("continue
   until no new failure modes across two consecutive runs" / depth = f(risk,novelty,reversibility,blast)).
9. **"Activate the whole plan" = dangerous big-bang** → staged rollout / canary / feature-flags / monitoring.
10. **Bounded discovery:** "survey all that exists" is INFINITE → scope + sources-checked + confidence +
    known-gaps + stop-reason. "Verify completely" unachievable → verify vs acceptance criteria + confidence
    + monitoring window.
11. **Value-system blind spots (all 3):** systems-before-content → empty/unvalidated (validate demand cheaply
    OUTSIDE the system first, time-boxed); existing-before-new → legacy-debt anchoring (add a FITNESS/QUALITY
    THRESHOLD — reuse only if fit + cheaper-than-replacement + future-aligned); stability-over-speed → never-
    ship/market-window (ACCEPTABLE FAILURE ENVELOPE — speed for learning + low blast radius, stability for
    foundations; evidence decides).

## PRECEDENTS (converged) — borrow: Stage-Gate (phase-exit gates), A3, Amazon Working-Backwards, Temporal.io
(durable/resumable execution), Progressive Disclosure, agentic planner-executor (bounded). GPT adds the
**BPMN + CMMN + DMN** split — CMMN (case management for ambiguous knowledge-work) is the most relevant and
a real gap, since our journey governs ambiguous work, not deterministic flow. AVOID: BPMN/BPEL as the
governance artifact (ossifies); OKR cascade; unbounded agent loops; big-bang.

## WHAT CSPS ALREADY HAS (existing-before-new — the good news)
The correction is mostly RE-WIRING existing pieces, not building from scratch:
- CLASSIFIER → threshold-gate-v2 (intake classification) + **ratification-cadence C1-C4 (ESSENCE-S084-001)
  IS a risk-class model already** + boundary-crossing (blast-radius).
- exit-evidence/warrant → IZFC/verify + P-META-032 WARRANT (provenance).
- no-silent-skip → PARK + P-META-033 No-Lost-Threads.
- phases/trunk+branch → P-ARCH-TRUNK-BRANCH-PATTERN.
- persona overlay → comm-schema 6-tier + AI-PERSONA-WORKING-WITH-GOVERNOR.
- learning loop → EED + gap/improvement registers + process-state.
GAPS to build: Constraint Capture, Acceptance-Criteria-early, RACI ownership, Rollback/exception states,
Journey Receipt, bounded-discovery scope, process-mining loop, staged-activation.

## REVISED DOCTRINE (adopt — supersedes the raw-14-linear framing)
> The platform maintains ONE governed lifecycle from intent to verified outcome. Each work item is FIRST
> classified (type / risk / novelty / reversibility / blast-radius / permission / evidence requirement).
> The orchestrator then selects the appropriate journey VARIANT, applies persona-specific visibility +
> control, records every decision in an evidence ledger, allows compression/skip ONLY by explicit rule
> (never silent), and verifies completion against ACCEPTANCE CRITERIA with stated confidence + monitoring —
> not vague "done." The 14 steps survive as subroutines; ~5 phases with exit gates are the governed trunk.

## EED HARVEST
- ESSENCE-S084-009: the "≥3 simulations" rigid number — flagged by ALL THREE external models AND it violates
  the Governor's own profile rule ("rigid numbers are reference samples not instructions"). The platform's
  own design contained the exact anti-pattern its own governance forbids. Replace with risk-based exit criteria.
- ESSENCE-S084-010: persona is the WRONG primary branch selector — RISK-CLASS is. Persona is a visibility
  overlay. (Corrects JOURNEY-PERSONA-AUDIT-S084 — keep the audit, re-rank the selector.)
