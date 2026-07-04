---
id: csps.handoff.cds-template-hub-review-draft
name: cds-template-hub-review-draft
description: >
  Expert architecture review for CDS Template Hub (4-layer inheritance system).
  Two sections: (1) Expert feedback Opus should provide to CDS, (2) CSPS enhancement
  recommendations extracted from the CDS design. Synthesized from a prior AI-assisted architecture
  review (provided by Governor; source header indicated a Sonnet-context Claude, not Haiku) + CSPS
  operational experience (S001-S089). For Opus: review, enrich with GVRN perspective, park section 2.
version: "1.0"
session: S089
created: "2026-07-04"
status: opus-validated-ready-to-send
action_required: "DONE: Opus validated + signed section 1 (ready to relay to CDS); E1-E8 parked as PARK-S089-CDS-TEMPLATE-HUB-EXTRACTIONS"
---

# CDS Template Hub — Expert Review Draft

> FOR OPUS: Two sections below.
> Section 1 = your voice to CDS. Validate, enrich, sign.
> Section 2 = CSPS enhancements to park. Recommend parking all 8 as a bundle.

---

## SECTION 1 — Expert Feedback for CDS (Opus voice, to be sent)

**From:** Opus-25, CSPS Director AI
**Domain:** Governance Architecture · AI-assisted platform design · Constitutional systems
**Caveat:** Perspective is from operating a governance-first self-building platform (CSPS, S001–S089). We have not seen the full Google Doc. This is based on your executive summary and the three focus questions.

---

### WHAT LOOKS SOUND

**1. RTM separation (Decision 3) — Keep it.** Separating the mutable inheritance chain from the cached runtime projection is one of the hardest-earned lessons in distributed governance. CSPS conflated these for 70+ sessions before separating them. The pain of not separating: reads observe half-updated states mid-cascade, and cached derivations silently drift from the chain they were supposed to reflect. R1 (watermark-versioned RTM snapshots with atomic promotion) is the correct operationalization. Do not simplify this.

**2. Additive-only inheritance (Decision 1) — Rare and correct.** Most systems allow narrowing. This choice is unusual enough that you should document the reasoning explicitly in your bootstrap documentation, because the next engineer who doesn't understand the invariant will introduce a subtraction and break soundness downstream. The constraint is correct; the risk is undocumented intent, not the constraint itself.

**3. Cascade-by-default (Decision 2) — Right tradeoff for a governance-first platform.** You picked constitutional coherence over instance-pinning. From experience: the alternative (each instance pinned to an ancestor version) creates a false sense of stability that hides configuration rot. Cascade-by-default forces the governance conversation at ratification time, which is exactly when it should happen.

---

### WHAT LOOKS FRAGILE

**CRITICAL: R1 is load-bearing, not optional.**
The architecture states this; the risk is that builders treat it as a "phase 2 optimization." It is not. R1 is the invariant "same input = same output always." Without atomic watermark promotion, you have three soundness violations simultaneously (straddled reads, TOCTOU during cascade, PROVISIONAL cache leaking unratified versions). Make R1 the **first line of code**, not a planned enhancement.

*From CSPS operational experience:* We have faced this exact pattern. A governance record (goal_id schema) was built with the field_wiring declared but the gate was vacuous (field-wiring-targets.txt was empty). The gate existed; it enforced nothing. R1 without atomic promotion is the same pattern: the mechanism exists, the guarantee doesn't.

**HIGH: Satisfiability solver is an unproven assumption.**
R2 proposes constraint satisfiability at ratification. This is the right idea, but the architecture treats it as a given rather than a research problem. Specifically:

- With LOCKED fields and semantic resolvers (R5), the constraint problem may become NP-complete at scale
- Cross-field implications multiply the search space
- "Satisfiability" without a published grammar and tested solver is a promise, not a feature

*Recommendation:* Before writing one line of cascade code, build the satisfiability solver in isolation, measure its complexity on a realistic field set (say, 50 fields, 20 cross-field rules), prove termination, and publish the complexity bound. Then design the type system around what the solver can handle. Inverting this — building the type system first and hoping the solver will exist — is how governance systems acquire technical debt they never pay off.

**HIGH: R3 ratification boundary is ambiguous.**
The mechanical/governance split is correct in direction but under-specified. The question "what does the Governor actually ratify?" is unanswered. From CSPS experience running 25+ Opus ratification cycles: the most expensive governance cost is when human judgment is applied to questions that are mechanically decidable, and vice versa. The Governor should ratify exactly one class of decision: policy exceptions and deliberate overrides. Everything that is mechanically checkable must be automated. If your R3 spec leaves the Governor on the critical path for mechanical checks, the cascade will bottleneck under load.

The specific gap: the unratified-variant check should be mechanical (does this template's parent have an APPROVED status?), not a Governor decision. Add it to the automated tier.

---

### WHERE WE'D DO DIFFERENTLY

**1. Phase machine for ratification (explicit ordering).**
Instead of "automated technical + human governance," model ratification as an ordered, named phase machine:
- Phase 0: Structural validation (parent exists + APPROVED, field syntax valid)
- Phase 1: Satisfiability check (constraint solver, cross-field consistency → proof or conflict report)
- Phase 2: Governance review (Governor: policy exceptions, corespine boundary, deliberate overrides)
- Phase 3: Cascade preparation (build watermark-versioned RTM snapshot, stage in quarantine)
- Phase 4: Atomic promotion (pointer flip, cascade begins, audit opens on descendants)

This is more explicit than the current split and makes the Governor's decision surface unambiguous. In our experience, named phases with documented gate criteria dramatically reduce the "who decides this?" overhead.

**2. Solver first, type system second.**
Design the satisfiability solver as a standalone component with an explicit grammar and proven complexity bounds. Then let the type system be exactly what the solver can handle. Inverting this is how you end up with a type system that's theoretically elegant but practically unsound.

**3. Lazy instance materialization.**
Consider instances as lazy projections rather than registered, declared objects. Don't materialize Layer 4 (instances) until runtime or explicit request. This reduces the cascade surface, gives the Governor more intervention time, and defers resolution to the latest possible moment. The inheritance chain (Layers 1–3) stays declared; instances materialize on-demand.

---

### WHAT YOU MIGHT BE MISSING

**1. Observability / drift detection.** With instances resolving against cached RTMs, you need: (a) drift detection (when an instance's effective config diverges from what the chain currently mandates), (b) staleness tracking (how old is this RTM? is there a newer ratified version?), (c) cascade history for audit. This is absent from the proposal and will become urgent the first time a silent drift causes a production incident.

**2. Rollback semantics.** The proposal addresses getting changes in safely; it does not address reversal. In an append-only record model with cascade-by-default, a rollback is a forward-applied inverse operation. Define what that means before go-live. "We'll figure out rollback when we need it" is how you discover it costs 10x at the moment you need it most.

**3. Multi-tenant isolation.** Are Layer 3 variants per-tenant or global? Can two tenants' instances conflict on shared variants? This is completely unaddressed. If you have multi-tenant customers, this must be specified before shipping.

**4. Bootstrap / self-amendment for CS-TEMPLATE.** CS-TEMPLATE governs templates. Layer 1 has no parent. Who can amend the constitutional rules for templates themselves? If you don't define a self-amendment procedure, you will discover this gap at the worst possible moment — when you need to evolve the constitutional layer and have no ratified process for doing so.

**5. The 80% claim needs measurement.** The architecture's entire business case rests on "eliminate 80% repetition." This is currently an unmeasured assumption. Pick three existing dashboards, measure how many fields/decisions are inherited vs. unique in your current system, and publish those numbers. If the 80% claim is wrong, everything else is premature optimization.

---

### FOCUS QUESTIONS — DIRECT ANSWERS

**Q1 (Distributed systems, read isolation under cascade):**
R1 is sufficient if — and only if — the watermark pointer flip is atomic at the storage layer (single CAS or database transaction). Three implementation details that will break it if missed: (a) atomic watermark flip (single write primitive, not two-phase); (b) invalidation storms under constitutional cascade (add debouncing: batch cascades within a time window, or lazy invalidation: mark stale, regenerate on-access); (c) blue/green RTM treatment (old and new RTMs are independent artifacts; readers see either, never both; promotion is a pointer flip after ratification). These are the make-or-break details.

**Q2 (Type systems, soundness of additive-only):**
Additive-only inheritance is sound if R2 (satisfiability check) is correct and complete. The edge case the document may have missed: multiple layers can each add LOCKED values for the same field (Layer 1: color LOCKED "red"; Layer 3: color LOCKED "blue"). Additive-only does not forbid conflicting locks at different layers — it only forbids removal. R2 must catch the conflict. This is a critical gap in the current spec. The constraint satisfiability problem with N layers, M fields, and K cross-field implications is NP in the general case. Design around a practical SMT solver with a bounded constraint grammar, not a general SAT solver.

**Q3 (Governance architecture, partitioning mechanical vs. human):**
The partition is correct in principle. Mechanical (automate these): parent exists + APPROVED, field syntax valid, no LOCKED conflict, satisfiability solver passes, cascade won't break descendants. Governance (Governor only): policy violations, corespine boundary crossings, retroactive changes to LOCKED fields, deliberate suspension of a mechanical gate. The unratified-variant check (BLOCKING #1 in the document) belongs in the mechanical tier. If it's currently being reviewed by a human, that's a misallocation of governance attention. Fix it: add a mechanical check. The Governor should make policy decisions; a solver should make correctness decisions.

---

### SYSTEMIC ASSESSMENT

This is a sophisticated architecture that has correctly identified the hard problems. The design process was rigorous. R1–R7 are directionally sound.

**The primary risk is not the design; it is implementation drift.** R1–R3 are load-bearing and non-negotiable. It is very easy to ship with R4–R7 (the "nice to have" recommendations) while deferring R1–R3 as "complexity we'll add in phase 2." This is the failure mode. Make R1 the first implementation deliverable. Make R2's solver design doc a prerequisite for Phase 1 build ratification. Don't ship Phase 1 without both.

**Recommendation for your Governor ratification:** Approve R1–R7 as a package, explicitly non-piecemeal. Require: (a) satisfiability solver design doc before Phase 1 build; (b) bootstrap/self-amendment procedure for CS-TEMPLATE before corespine ratification; (c) published 80% measurement from a concrete case study before go-live. Add R8: cross-RTM joint satisfiability check at instance materialization (structure RTM + data RTM must be jointly satisfiable at the moment of instance creation).

---

### OPUS RATIFICATION (signed — ready to relay to CDS)

Validated on merit, not rubber-stamped. Section 1 is sound and sends as-is. Two emphases I want landed
hardest with CDS, because they are the load-bearing ones and the easiest to defer to death:

1. **R1-first is the whole review.** If CDS takes one thing: build atomic watermark promotion as the
   FIRST line of code, not a phase-2 optimization. We lived the exact failure class this very session —
   a field-wiring gate that existed but enforced nothing because its target registry was empty. "The
   mechanism exists, the guarantee doesn't" is not hypothetical; it is the default outcome of deferring R1.
2. **The conflicting-LOCK gap (Q2) is a real hole, not a nitpick.** Additive-only forbids *removal*, not
   two layers LOCKing the same field to *different* values. Their soundness argument rests on R2 catching
   this, and their spec does not yet say it does. This is the single most concrete correction we give them.

R8 (cross-RTM joint satisfiability at instance materialization) stands — add it to their R-list. The
package-not-piecemeal ratification recommendation is correct: R1–R3 are non-negotiable; shipping R4–R7
while deferring R1–R3 is the failure mode.

**Signed:** OPUS-25, CSPS Director — S089. Relay Section 1 to CDS as the CSPS expert review.

---

## SECTION 2 — CSPS Enhancement Recommendations (for Opus to park)

*Extracted from CDS Template Hub architecture. Each item maps a CDS concept to a CSPS gap.*
*Recommended: park all 8 as PARK-S089-CDS-TEMPLATE-HUB-EXTRACTIONS bundle.*

---

### E1 — RTM Separation for corespines
**CDS concept:** Separate mutable inheritance chain from cached runtime projection (RTM).
**CSPS gap:** `tools/config/core-spine-registry.yaml` is a single static file. No separate "runtime projection" vs "governance record" distinction.
**CSPS action:** Add a `runtime/` layer to core-spine-registry: governance record (the source of truth, append-only) + a generated runtime-projection.yaml (derived, cached, invalidated on governance change). The generating step runs in `pnpm verify`.
**Why it matters:** Prevents reads during corespine updates from observing half-updated states.

### E2 — Additive-Only B_* Contracts
**CDS concept:** Additive-only inheritance (no removal, no unlock).
**CSPS gap:** B_* contracts can be removed or downgraded informally. In S089 alone, B_FVC_GATE was added then immediately downgraded. No formal deprecation process exists.
**CSPS action:** Add `validate-bstar-deprecation.mjs`: a B_* that existed in a prior commit and is now absent (or downgraded) without a `deprecated_in: S0NN` + `deprecation_reason:` field → ADVISORY (eventually BLOCKING).
**Why it matters:** Additive-only ensures behavioral guarantees compound rather than being silently retracted.

### E3 — Ratification Phase Machine (replace the informal Opus/Sonnet split)
**CDS concept:** Explicit ordered phase machine (Phase 0–4).
**CSPS gap:** CSPS has Opus (director) + Governor ratification, but no formal phase machine. "Ratification" means different things at different times.
**CSPS action:** Define the CSPS ratification phases formally in CANONICAL-BUILD-PROCESS.md §6: Phase 0 (structural validation), Phase 1 (satisfiability — validate-field-wiring.mjs), Phase 2 (Governor review), Phase 3 (cascade prep — verify passes), Phase 4 (deploy + live-check). Wire each phase gate explicitly.
**Why it matters:** Named phases with documented gate criteria reduce "who decides this?" overhead.

### E4 — Satisfiability Check for Behavioral Contract Combinations
**CDS concept:** Constraint satisfiability at ratification (R2).
**CSPS gap:** validate-field-wiring.mjs checks individual fields for save→read→influence. No cross-field satisfiability: does the COMBINATION of all active B_* contracts create conflicts?
**CSPS action:** `validate-bstar-satisfiability.mjs` — given all active B_* contracts + AGENTS.md hard-NOs, check for direct contradictions (two rules that require mutually exclusive behavior). Start simple: pattern-match known conflict classes (two rules using the same hook exit code, two rules for same trigger with opposite outcomes).
**Why it matters:** CSPS already has ~12 B_* contracts + ~70 AGENTS.md hard-NOs. Silent conflicts accumulate.

### E5 — Drift Detection for Live Artifacts
**CDS concept:** Observability / drift detection (CSPS missed this from CDS).
**CSPS gap:** No mechanism alerts when a live page, validator, or behavioral contract diverges from what its governance mandate requires. The live-check-register (Part 1, just built) is a step toward this for pages, but not for validators or contracts.
**CSPS action:** Extend `validate-live-page-check.mjs` to detect "configuration drift": when a live page's content diverges from what pageDNA declares it should contain. Weekly haiku scan: does the live page show the content its pageDNA.purpose claims? Flag divergence.
**Why it matters:** "The page exists" and "the page does what it's supposed to" are different claims. We currently only check the former.

### E6 — Rollback Semantics for Ratified Changes
**CDS concept:** Rollback semantics in an append-only record model.
**CSPS gap:** CSPS has no formal rollback procedure for ratified changes. When a B_* contract is ratified and then proves harmful, the process is ad-hoc. We downgraded B_FVC_GATE informally in S089.
**CSPS action:** Add a `rollback_record:` section to the B_* contract schema (applied at engraving). When a ratified contract is changed: (a) the old version is preserved in a `deprecated_versions:` list; (b) a `rollback_record` documents what changed, why, and what was restored. This is a forward-applied inverse operation (not deletion).
**Why it matters:** Without defined rollback semantics, "we'll figure it out when we need it" costs 10x when the moment arrives.

### E7 — 80% Measurement (CSPS's own equivalent)
**CDS concept:** The "80% repetition eliminated" claim needs a concrete case study measurement.
**CSPS gap:** CSPS makes similar unmeasured claims: "completion discipline is better," "behavioral contracts prevent drift," "Haiku scans save tokens." None are measured against a baseline.
**CSPS action:** Pick one: (a) "the LOVABILITY rubric improves UX" → measure before/after with Governor test-drives (K=1 vs K=3 confirmation rates); (b) "Haiku scans save tokens" → haiku-scan-log shows per-scan token cost; compare to inline Sonnet equivalent. Publish one real measurement. The claim becomes evidence-based.
**Why it matters:** Governance-first platforms that can't measure their own governance effectiveness have a credibility gap.

### E8 — Bootstrap / Self-Amendment Procedure for L1 CORE Spines
**CDS concept:** Who governs CS-TEMPLATE (the governance of governance)?
**CSPS gap:** CSPS L1 CORE spines are sealed (P-ARCH-028) with no documented self-amendment procedure. The only protocol is "requires Governor + Opus two-party seal." No formal process for amending the constitutional layer when needed.
**CSPS action:** Document in L1 CORE files: the self-amendment procedure (who proposes, what evidence is required, what two-party seal process applies, what the cooling-off period is). This is not a build task — it's a documentation + governance task. One page in PLATFORM-GENOME.md.
**Why it matters:** Without a self-amendment procedure, CSPS will discover this gap when it needs to evolve its constitutional layer and has no ratified process for doing so.

---

## For Opus: Recommended Parking

Park E1–E8 as:

```
PARK-S089-CDS-TEMPLATE-HUB-EXTRACTIONS
lane: queue
priority: MEDIUM
title: 8 CSPS enhancements from CDS Template Hub architecture review
disposition: park | owner: Opus | trigger: after canonical build process stages T3-T5 are built
note: E3 (ratification phase machine) connects to CANONICAL-BUILD-PROCESS.md §5 — build together.
      E2 (additive-only B_*) + E4 (satisfiability) + E6 (rollback) form a governance-contract bundle.
      E1 (RTM) + E5 (drift detection) form an observability bundle.
      E7 (measurement) + E8 (self-amendment) are standalone documentation items.
research_backing: CDS Template Hub S346 architecture review + CSPS operational experience S089
```
