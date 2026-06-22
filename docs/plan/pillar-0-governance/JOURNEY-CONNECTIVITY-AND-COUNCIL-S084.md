---
id: csps.governance.journey-connectivity-and-council-S084
name: JOURNEY-CONNECTIVITY-AND-COUNCIL-S084
description: >
  Connectivity-expert enhancement of the journey-orchestrator: inserts the CORE COUNCIL as the journey's
  deliberation mechanism (deep-dive PARKED, pending), and traces the concrete change→effect chain — what
  fires and what is updated on add/edit/delete, how ZF gates it, how PE+CIE drive and learn. Makes "how it
  actually works together" explicit.
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
  - { rel: moat-map, href: JOURNEY-MOAT-MAP-S084.md }
  - { rel: id-schema, href: JOURNEY-ID-SCHEMA-S084.md }
  - { rel: ripple-and-loops, href: JOURNEY-RIPPLE-AND-LOOPS-S084.md }
  - { rel: consolidation, href: ../_handoff/VAULT/research/S084-journey-external-consolidation.md }
  - { rel: council-registry, href: council-registry.md }
---

# Journey Connectivity + Core Council (S084)

## 1. CORE COUNCIL inserted into the journey (the deliberation mechanism)
The journey does not decide alone — it CONSULTS a council, scaled by the work's risk-class. The council is
the deliberation layer fired at specific phases:
- **Phase 1 INTENT** → inner-council (Opus director / Governor ratifier) for ambiguous goals + threshold classify.
- **Phase 3 DECIDE** → FULL council: expert-skills (schema/bottleneck/consolidation/balance/cruel-critic by
  match) produce the PCR; PE ranks; CIE supplies prior-outcome signal; Governor ratifies (C1/C2 per cadence).
- **Phase 4 VALIDATE** → adversarial council: cruel-critic + naive-personas + tester-tier break it before ratify.
- **Phase 5 LEARN** → council reviews the harvested essence (EED) for propagation.

Three council TYPES (named now; depth PARKED):
- **Inner council** — Opus(director) ↔ Sonnet(builder) ↔ Governor(ratifier).
- **Expert council** — the ~24 skills (M-11), invoked by content match.
- **External council** — outside models (Claude/GPT/Gemini), for foundational/high-novelty work (as done S084).

> ⏳ **PENDING — PARKED for processing (PARK-S084-014):** deep-dive on council TYPES × ITERATION protocols
> (how many rounds before ratify) × CONSULTING depth (when to escalate to expert vs external) keyed to
> risk-class. Included in the model now; full design deferred. Do NOT build council-iteration logic yet.

## 2. WHAT HAPPENS WHEN A CHANGE IS DONE (the change→effect chain — existing moats, sequenced)
Every add/edit/delete runs a (class-compressed) journey. The chain that fires:
1. **CLASSIFY** (M-16 Threshold / M-42 router) → work-type + risk + blast-radius → journey depth + which
   council + which loops.
2. **CONNECTIVITY** (M-18 nothing-stands-alone) → the change MUST declare links (parent + dependents);
   dependency-graph.yaml updates; an orphan is BLOCKED.
3. **DNA** (M-26) → new TS/JS carries DNA signals (@csps-*) or is blocked.
4. **COUNCIL** (M-11) → expert-skills deliberate by match; PCR produced.
5. **PE + CIE** → PE scores priority; CIE OBSERVES the change as a signal.
6. **ZF / IZFC** (M-07) → minimum_exit_evidence at the phase gate; THIS-SESSION verify=0 before any "done".
7. **WIRING** (M-45) → done = wired + active + measurable (enforcement must exist on disk).
8. **ACTIVATE** (staged, not big-bang) → **EMIT to the 3 core loops**.

## 3. WHAT IS UPDATED — add / edit / delete (the connectivity matrix)
| On… | What is updated (mechanically) |
|---|---|
| **ADD** | dependency-graph (+node +edges) · relevant register (gap/park/improvement/**moat-coverage**) · slices (if principle/contract → split.mjs) · capacity counters (M-21) · session-state · evidence-ledger · verify cycles (maybe +1, born EXTENDED) |
| **EDIT** | dependency-graph (edges re-validated) · **dead-links** (downstream refs re-checked) · slices re-generated · change-tracking (what-changed+why; M-12) · verify · CIE signal |
| **DELETE** | **deletion-test** (M-20: rm must lose ZERO platform value) · dead-links (who referenced it → fix-or-block) · dependents flagged · soft-delete by default (P-ARCH-007) · dependency-graph (−node + orphan-downstream check) · register closure note |

## 4. HOW ZF IS INVOLVED
ZF/IZFC is the **exit-gate evidence at every phase** AND the **completion gate**: no phase advances and
nothing is "done" without THIS-SESSION verify=0 + the gate's `minimum_exit_evidence` (artifact/decision/
signal). ZF is the enforcement arm of the ANTI-DRIFT core loop — it is what makes "verified" real, not a
clicked-next. (External consensus: operationalize "verified" as evidence-at-gate.)

## 5. HOW PE + CIE WORK AND ARE INVOLVED (the brain of the optimization loop)
- **PE (Priority Engine) — looks FORWARD.** At Phase 3 DECIDE it scores options/paths (urgency × impact /
  SPI) and ranks what to do next. PE chooses the path; PE ranks the backlog.
- **CIE (Continuous Improvement Engine) — looks at OUTCOMES.** Every change is a CIE signal:
  OBSERVE (capture the change/outcome) → AGGREGATE (cluster signals) → ADJUST (propose default/DNA changes)
  → INJECT (feed back into rules) → MEASURE (did it improve?). CIE feeds the OPTIMIZATION core loop.
- **The closed loop:** CIE's measured outcomes feed PE's NEXT scoring. PE acts; CIE learns from the act;
  the learning re-weights PE. Together they are the platform's forward-decision + backward-learning pair —
  the mechanism that keeps optimization at the highest level, per work-item and across the platform.
  (NOTE: CIE is partially dormant today — OBSERVE/AGGREGATE built; ADJUST/INJECT/MEASURE deferred. Wiring
  CIE fully into the journey LEARN phase is part of the orchestrator build + the parked cognition concept.)

## 6. THE WHOLE, IN ONE LINE
A change is classified → connected (links/DNA) → deliberated by the council (scaled by class) → decided by
PE → gated by ZF evidence → wired (M-45) → activated → and EMITTED into the 3 core loops (alignment /
optimization / anti-drift), where CIE learns from it and re-weights the next decision. Nothing floats;
everything updates its graph + registers; nothing is "done" until wired + verified.
