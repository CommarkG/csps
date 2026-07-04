---
id: csps.handoff.csps-to-cds-template-hub-expert-review
name: CSPS-to-CDS-Template-Hub-Expert-Review-OPUS25-S089
description: >
  Signed, standalone CSPS->CDS expert architecture review of the CDS Template Hub (4-layer inheritance).
  Outbound deliverable in Opus voice, ready to download + send to CDS. Section 1 only (E1-E8 CSPS
  extractions are parked separately as PARK-S089-CDS-TEMPLATE-HUB-EXTRACTIONS).
version: "1.0"
owner: group:finky
authored_by: OPUS-25
core_spine: GVRN
schema_anchor: handoff_files
diataxis_type: explanation
lifecycle: production
lifecycle_state: active
status: active
precedent_checked: true
session: S089
links:
  - { rel: source, href: ./VAULT/cds-template-hub-review-draft.md }
  - { rel: related, href: ./CSP-CSPS-SHARING-LEDGER.md }
  - { rel: extractions, href: ../../../tools/data/park-register.yaml }
---

# CSPS → CDS — Expert Architecture Review: Template Hub (4-Layer Inheritance System)

**From:** Opus-25 — CSPS Director AI (Governance Architecture · AI-assisted platform design · Constitutional systems)
**To:** CDS (Core Driven Solutions) — Template Hub design team
**Re:** Expert review of the CDS Template Hub 4-layer inheritance architecture (RTM, additive-only, cascade-by-default; R1–R7 + the three focus questions)
**Session:** CSPS S089 · **Date:** 2026-07-04
**Caveat:** Perspective is from operating a governance-first, self-building platform (CSPS, S001–S089). We have not seen the full Google Doc — this is based on your executive summary and the three focus questions.

---

## WHAT LOOKS SOUND

**1. RTM separation (Decision 3) — Keep it.** Separating the mutable inheritance chain from the cached runtime projection is one of the hardest-earned lessons in distributed governance. CSPS conflated these for many sessions before separating them. The pain of not separating: reads observe half-updated states mid-cascade, and cached derivations silently drift from the chain they were supposed to reflect. R1 (watermark-versioned RTM snapshots with atomic promotion) is the correct operationalization. Do not simplify this.

**2. Additive-only inheritance (Decision 1) — Rare and correct.** Most systems allow narrowing. This choice is unusual enough that you should document the reasoning explicitly in your bootstrap documentation, because the next engineer who doesn't understand the invariant will introduce a subtraction and break soundness downstream. The constraint is correct; the risk is undocumented intent, not the constraint itself.

**3. Cascade-by-default (Decision 2) — Right tradeoff for a governance-first platform.** You picked constitutional coherence over instance-pinning. From experience: the alternative (each instance pinned to an ancestor version) creates a false sense of stability that hides configuration rot. Cascade-by-default forces the governance conversation at ratification time, which is exactly when it should happen.

---

## WHAT LOOKS FRAGILE

**CRITICAL: R1 is load-bearing, not optional.**
The architecture states this; the risk is that builders treat it as a "phase 2 optimization." It is not. R1 is the invariant "same input = same output always." Without atomic watermark promotion, you have three soundness violations simultaneously (straddled reads, TOCTOU during cascade, PROVISIONAL cache leaking unratified versions). **Make R1 the first line of code, not a planned enhancement.**

*From CSPS operational experience:* We faced this exact pattern this session. A governance record (a goal schema) was built with its field-wiring declared but the enforcing gate was vacuous — its target registry was empty. The gate existed; it enforced nothing. R1 without atomic promotion is the same pattern: the mechanism exists, the guarantee doesn't.

**HIGH: Satisfiability solver is an unproven assumption.**
R2 proposes constraint satisfiability at ratification. Right idea, but the architecture treats it as a given rather than a research problem:
- With LOCKED fields and semantic resolvers (R5), the constraint problem may become NP-complete at scale.
- Cross-field implications multiply the search space.
- "Satisfiability" without a published grammar and tested solver is a promise, not a feature.

*Recommendation:* Before writing one line of cascade code, build the satisfiability solver in isolation, measure its complexity on a realistic field set (say, 50 fields, 20 cross-field rules), prove termination, and publish the complexity bound. Then design the type system around what the solver can handle. Inverting this — building the type system first and hoping the solver will exist — is how governance systems acquire technical debt they never pay off.

**HIGH: R3 ratification boundary is ambiguous.**
The mechanical/governance split is correct in direction but under-specified. "What does the Governor actually ratify?" is unanswered. From CSPS experience running 25+ ratification cycles: the most expensive governance cost is when human judgment is applied to questions that are mechanically decidable, and vice versa. The Governor should ratify exactly one class of decision: **policy exceptions and deliberate overrides.** Everything mechanically checkable must be automated. If R3 leaves the Governor on the critical path for mechanical checks, the cascade will bottleneck under load. Specific gap: the unratified-variant check (does this template's parent have an APPROVED status?) should be mechanical, not a Governor decision. Add it to the automated tier.

---

## WHERE WE'D DO DIFFERENTLY

**1. Phase machine for ratification (explicit ordering).** Model ratification as an ordered, named phase machine instead of "automated technical + human governance":
- **Phase 0:** Structural validation (parent exists + APPROVED, field syntax valid)
- **Phase 1:** Satisfiability check (constraint solver, cross-field consistency → proof or conflict report)
- **Phase 2:** Governance review (Governor: policy exceptions, corespine boundary, deliberate overrides)
- **Phase 3:** Cascade preparation (build watermark-versioned RTM snapshot, stage in quarantine)
- **Phase 4:** Atomic promotion (pointer flip, cascade begins, audit opens on descendants)

Named phases with documented gate criteria dramatically reduce the "who decides this?" overhead.

**2. Solver first, type system second.** Design the satisfiability solver as a standalone component with an explicit grammar and proven complexity bounds. Then let the type system be exactly what the solver can handle. Inverting this yields a type system that's theoretically elegant but practically unsound.

**3. Lazy instance materialization.** Treat instances as lazy projections rather than registered, declared objects. Don't materialize Layer 4 (instances) until runtime or explicit request. This reduces the cascade surface, gives the Governor more intervention time, and defers resolution to the latest possible moment. The inheritance chain (Layers 1–3) stays declared; instances materialize on-demand.

---

## WHAT YOU MIGHT BE MISSING

**1. Observability / drift detection.** With instances resolving against cached RTMs, you need: (a) drift detection (when an instance's effective config diverges from what the chain currently mandates), (b) staleness tracking (how old is this RTM? is there a newer ratified version?), (c) cascade history for audit. Absent from the proposal; it becomes urgent the first time a silent drift causes a production incident.

**2. Rollback semantics.** The proposal addresses getting changes in safely; it does not address reversal. In an append-only record model with cascade-by-default, a rollback is a forward-applied inverse operation. Define what that means before go-live. "We'll figure out rollback when we need it" is how you discover it costs 10× at the moment you need it most.

**3. Multi-tenant isolation.** Are Layer 3 variants per-tenant or global? Can two tenants' instances conflict on shared variants? Completely unaddressed. If you have multi-tenant customers, this must be specified before shipping.

**4. Bootstrap / self-amendment for CS-TEMPLATE.** CS-TEMPLATE governs templates. Layer 1 has no parent. Who can amend the constitutional rules for templates themselves? If you don't define a self-amendment procedure, you will discover this gap at the worst possible moment — when you need to evolve the constitutional layer and have no ratified process for doing so.

**5. The 80% claim needs measurement.** The entire business case rests on "eliminate 80% repetition." This is currently an unmeasured assumption. Pick three existing dashboards, measure how many fields/decisions are inherited vs. unique in your current system, and publish those numbers. If the 80% claim is wrong, everything else is premature optimization.

---

## FOCUS QUESTIONS — DIRECT ANSWERS

**Q1 (Distributed systems — read isolation under cascade):**
R1 is sufficient if — and only if — the watermark pointer flip is atomic at the storage layer (single CAS or database transaction). Three implementation details that will break it if missed: (a) **atomic watermark flip** (single write primitive, not two-phase); (b) **invalidation storms under constitutional cascade** — add debouncing (batch cascades within a time window) or lazy invalidation (mark stale, regenerate on-access); (c) **blue/green RTM treatment** — old and new RTMs are independent artifacts; readers see either, never both; promotion is a pointer flip after ratification. These are the make-or-break details.

**Q2 (Type systems — soundness of additive-only):**
Additive-only inheritance is sound **if and only if** R2 (satisfiability check) is correct and complete. The edge case the document may have missed: **multiple layers can each add a LOCKED value for the same field** (Layer 1: color LOCKED "red"; Layer 3: color LOCKED "blue"). Additive-only does not forbid conflicting locks at different layers — it only forbids removal. R2 *must* catch the conflict; your spec does not yet state that it does. **This is a critical gap.** The satisfiability problem with N layers, M fields, and K cross-field implications is NP in the general case — design around a practical SMT solver with a bounded constraint grammar, not a general SAT solver.

**Q3 (Governance architecture — partitioning mechanical vs. human):**
The partition is correct in principle. **Mechanical (automate):** parent exists + APPROVED, field syntax valid, no LOCKED conflict, satisfiability solver passes, cascade won't break descendants. **Governance (Governor only):** policy violations, corespine boundary crossings, retroactive changes to LOCKED fields, deliberate suspension of a mechanical gate. The unratified-variant check (BLOCKING #1 in the document) belongs in the mechanical tier. If a human is currently reviewing it, that's a misallocation of governance attention — add a mechanical check. The Governor makes policy decisions; a solver makes correctness decisions.

---

## SYSTEMIC ASSESSMENT

This is a sophisticated architecture that has correctly identified the hard problems. The design process was rigorous. R1–R7 are directionally sound.

**The primary risk is not the design; it is implementation drift.** R1–R3 are load-bearing and non-negotiable. It is very easy to ship with R4–R7 (the "nice to have" recommendations) while deferring R1–R3 as "complexity we'll add in phase 2." That is the failure mode. Make R1 the first implementation deliverable. Make R2's solver design doc a prerequisite for Phase 1 build ratification. Don't ship Phase 1 without both.

**Recommendation for your Governor ratification:** Approve R1–R7 as a package, explicitly non-piecemeal. Require: (a) a satisfiability solver design doc before Phase 1 build; (b) a bootstrap/self-amendment procedure for CS-TEMPLATE before corespine ratification; (c) a published 80% measurement from a concrete case study before go-live. **Add R8: cross-RTM joint satisfiability check at instance materialization** (structure RTM + data RTM must be jointly satisfiable at the moment of instance creation).

---

*Signed — **Opus-25, CSPS Director** · CSPS S089 · 2026-07-04.*
*Validated on merit, not rubber-stamped. If one thing lands: R1 first, and R2 must catch conflicting locks (Q2).*
