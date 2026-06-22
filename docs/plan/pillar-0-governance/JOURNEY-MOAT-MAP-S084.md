---
id: csps.governance.journey-moat-map-S084
name: JOURNEY-MOAT-MAP-S084
description: >
  Maps the Governor's 7 journey-root functions + the corrected 5-phase journey lifecycle to the existing
  45 moat elements, and names the 3 CORE-LOOP families that keep alignment + optimization at the highest
  level. Finding: the moats already implement the journey-root functions — the journey is the ROOT that
  invokes the right moats per phase and feeds the core loops. Existing-before-new validated.
version: "1.0"
session: S084
owner: group:finky
authored_by: OPUS-21
core_spine: GVRN
diataxis_type: reference
schema_anchor: vault_files
lifecycle: production
lifecycle_state: active
status: draft
impl_status: audit-1-complete
links:
  - { rel: moat-registry, href: moat-registry.md }
  - { rel: consolidation, href: ../_handoff/VAULT/research/S084-journey-external-consolidation.md }
  - { rel: persona-audit, href: JOURNEY-PERSONA-AUDIT-S084.md }
---

# Journey ↔ Moat Map (S084)

> The developer + user journeys are the ROOT of the platform: how things are created, audited, optimized;
> how DNA is present everywhere; UX/UI; and how completion+ZF support all. Finding: the **moats already
> implement these** — the journey ORCHESTRATES them per work-item. Build on the moats, don't rebuild.

## A. The Governor's 7 journey-root functions → existing moats
| Journey-root function | Moats that already implement it |
|---|---|
| **1. How NEW things are created** | M-06 construction-gate (plan-before-build) · M-17 reuse-first · M-32 Explore→Ratify→Execute · M-37 core-seeds · M-28 plan-maturity · M-44 refinement-before-ratification |
| **2. How EXISTING things are audited** | M-14 system-health organism (4 cadences) · M-30 gap-recurrence K-count · M-34 app-health scanner · M-21 platform-capacity · M-03 EP learning |
| **3. How things are OPTIMIZED** | M-13 CSEP cross-synergy · M-09 SG positive-harvest · M-35 challenge-round flywheel · EED (universal extraction) · A/B-testing moat (M-29 cand.) |
| **4. How DNA is present EVERYWHERE (not floating)** | M-18 connectivity/nothing-stands-alone · M-26 DNA-inheritance-gate · M-45 wiring-completeness (done=wired) · M-29 Platform-Genome grid · M-04 depth-aware loading |
| **5. Best UX** | M-36 frontend-methodology · M-28 CAQs · progressive-disclosure + Journey-Receipt (external consensus) · persona-overlay (comm-schema 6-tier) |
| **6. Best UI** | M-36 page-DNA + libs/ui inheritance · validate-page-dna · the journey-admin surface |
| **7. Completion + ZF support all** | M-07 ZF-moat · M-01 session-as-governed · M-12 impl-status state-machine · M-31 behavioral-test-suite · M-33 reflexive-tool-application · M-45 wiring-completeness |

## B. The corrected 5-phase journey → the moats each phase invokes
- **Phase 1 INTENT** (classify + goal + constraints + acceptance) → M-16 Threshold · M-42 router · M-28 plan-maturity · M-44 refinement.
- **Phase 2 AUDIT** (survey-existing + gap) → M-17 reuse-first · M-18 connectivity · M-30 gap-recurrence · M-34 app-health · M-03 EP.
- **Phase 3 DECIDE** (PCR + PE/CIE) → M-11 council · M-13 CSEP · PCR · PE/CIE.
- **Phase 4 VALIDATE** (simulate + test + iterate) → M-07 ZF · M-31 behavioral-tests · M-33 reflexive · simulation spine.
- **Phase 5 ACTIVATE+VERIFY+LEARN** → M-12 impl-status · M-45 wiring-completeness · M-07 ZF · M-09 SG-harvest · M-35 flywheel · EED.

## C. THE CORE LOOPS (the Governor's "keep alignment + optimization at the highest level")
Three loop families already exist as moats. The journey EMITS into them (its gaps/successes/insights/
completion-evidence) and CONSUMES from them (prevention, maturity gates, prior synergies). Wiring the
journey to these loops is what keeps alignment+optimization highest — automatically, per work-item.

1. **ALIGNMENT (cadence) loop** — M-14 system-health organism (session/weekly/monthly/quarterly) +
   M-27 PRACE recurring injection + M-43 cross-tab diff-review. Keeps the platform aligned over time.
2. **OPTIMIZATION (learning) loop** — M-03 EP (failure→prevention) + M-09 SG (success harvest) +
   M-13 CSEP (cross-synergy propagation) + M-35 challenge-round flywheel + EED (universal extraction) +
   M-34 app-health (re-evaluate vs evolving standards). Makes the platform get smarter every cycle.
3. **ANTI-DRIFT (completion) loop** — M-30 gap-recurrence K-count + M-07 ZF/IZFC + M-45 wiring-completeness
   + M-12 impl-status + M-31 behavioral-tests. Ensures nothing slides from done → drifted.

## D. Verdict
- The journey-as-root needs **no new machinery** for its 7 functions — they are 45 moats, scattered.
- The journey is the **orchestration layer** that invokes the right moats at each phase + wires every
  instance into the 3 core loops. This is the single highest-leverage consolidation in the platform.
- Gap: the moats are not yet INVOKED BY a per-work-item lifecycle — they fire by cadence/commit, not by
  "this journey instance is at Phase 2, fire the audit moats." The journey-orchestrator closes that gap.
- Recommendation: ratify "the journey orchestrates the moats + feeds the 3 core loops" as the build frame
  for the journey-orchestrator (PARK-S084-012), on the corrected 5-phase model.
