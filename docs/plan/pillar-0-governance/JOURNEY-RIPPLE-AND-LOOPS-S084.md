---
id: csps.governance.journey-ripple-and-loops-S084
name: JOURNEY-RIPPLE-AND-LOOPS-S084
description: >
  Two consolidated solutions surfaced by the pre-ratification ZF sweep: (1) RIPPLE PROPAGATION — one pass
  that, on a significant change, computes the blast radius and surfaces ALL downstream updates (vocab,
  validators, slices, dashboard, moat-coverage, dependency-graph) and gates until addressed; (2) LOOP
  ACTIVATION — the honest fix for "loops exist but never report": scheduler/session-trigger + report
  surfacing. Includes the real ZF findings + the follow-up external-council prompt.
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
precedent_checked: true
links:
  - { rel: connectivity, href: JOURNEY-CONNECTIVITY-AND-COUNCIL-S084.md }
  - { rel: id-schema, href: JOURNEY-ID-SCHEMA-S084.md }
  - { rel: dependency-graph, href: "../../../tools/data/dependency-graph.yaml" }
---

# Journey Ripple + Loop-Activation (S084 pre-ratification ZF)

## REAL ZF findings (MEASURED this turn — fresh angles)
- **F1 cadence loops not scheduled:** `cron-weekly-tag-status-deep-audit.sh` + weekly-*.mjs EXIST but no
  `.claude/crons` / no scheduler on Windows → never fire. AP-001 (exists≠active).
- **F2 no report surfacing:** per-session loops (cie-pe, consolidation-pass, context-orchestrator) DO run
  (last-run files dated today) but write to `*-last-run.json` nobody reads → "why no reports": nothing surfaces.
  CIE ADJUST/INJECT/MEASURE dormant.
- **F3 floating node:** JOURNEY-ID-SCHEMA-S084 had 0 inbound refs → wired this turn (connectivity doc).

## SOLUTION 1 — RIPPLE PROPAGATION (consolidate what exists; don't rebuild)
**What exists (scattered):** dependency-graph.yaml + generate-dependency-graph.mjs (the graph) · validate-
dead-links (broken refs) · slice-sync (principle/contract slices regenerate) · CSEP/synergy-master (insight
propagation) · the change→effect matrix (JOURNEY-CONNECTIVITY §3).
**Gap:** nothing runs them AS ONE pass on a significant change — the human must remember each ripple.
**Consolidated solution — the RIPPLE PASS** (one mechanism, fires on significant change, by class):
1. **Compute blast radius** — walk dependency-graph downstream from the changed node.
2. **Apply the update-matrix** (per change-type — add/edit/delete; JOURNEY-CONNECTIVITY §3): which of
   {vocab usages · validators · slices · dashboard · moat-coverage · dead-links · registers · capacity} update.
3. **Surface a RIPPLE REPORT** — the explicit list of what must update + where (zero-navigation).
4. **GATE** — a significant change is not "done" (M-45 wiring-completeness) until its ripples are addressed
   or explicitly deferred-with-rationale (no silent skip; PARK lane).
Wires into the journey ACTIVATE/VERIFY phase + the anti-drift loop. Vocab specifically: changing a canon
term (e.g. a vocabulary.md definition) ripples to every doc using it → dead-links + a vocab-usage scan.

## SOLUTION 2 — LOOP ACTIVATION (make the core loops real + reporting)
The 3 core-loop families exist as moats but are not all firing/surfacing. Fix per loop:
- **Schedule the cadence loops** — register them as cloud routines (schedule skill / CronCreate) OR, as a
  Windows-safe fallback, trigger any "due" cadence audit at SESSION-OPEN if N days elapsed (last-run check).
- **Surface a report** — at session-close (or on cadence fire), emit ONE "loops report" the Governor sees:
  CIE signals (OBSERVE→AGGREGATE) · consolidation-pass findings · gap-recurrence K≥2 · ripple backlog ·
  moat-coverage drift. A loop with no surfaced report = a loop that, to the Governor, does not exist.
- **Wire CIE ADJUST/INJECT/MEASURE** — currently dormant; part of the orchestrator `cie_pe` section build.

## WHAT TO INSERT INTO RECURRING LOOPS (the journey feeds them; they must report)
- Per-journey EMIT (already in the hardwire matrix): every PEG emits a CIE signal + gap/SG harvest.
- Session loop: ripple-report + loops-report surfacing (NEW — closes F2).
- Cadence loop: scheduler or session-open-due-trigger (NEW — closes F1).

## FOLLOW-UP EXTERNAL-COUNCIL PROMPT (relay before ratify + execute)
```
You earlier critiqued our 14-step journey; we revised it. Critique the REVISED design before we build it.
No flattery — name what will break.

REVISED MODEL:
- The journey is now a core-spine ENTRY (8 sections: trunk/branches/alignment/wiring/tier_permission/
  cie_pe/escalation/realtime_save). Trunk = sealed invariants (no-skip, humble-first, evidence-at-gate,
  decide-via-priority+improvement-engine, verify-completely) + 5 phases. Branches = variants
  (fast/standard/governed/exploratory) selected by RISK-CLASS; persona = visibility overlay.
- 5 phases, each with a Phase Exit Gate (PEG). HARDWIRED non-optional at every step: Threshold (entry +
  every new input), ZF/evidence (every PEG blocks without evidence), Priority-Engine (at decide),
  Continuous-Improvement-Engine (emit at every PEG). The journey orchestrates existing platform "moats"
  per phase and feeds 3 core loops (alignment / optimization / anti-drift).
- A RIPPLE PASS fires on significant change: walk a dependency graph → compute downstream updates
  (vocab/validators/slices/UI/registers) → surface a report → gate "done" until ripples addressed.

QUESTIONS:
R1. Is making Threshold+ZF+PriorityEngine+ImprovementEngine HARD GATES at every phase correct, or will it
    create gate-fatigue / shadow workarounds? Where do mature systems make gates blocking vs advisory?
R2. The RIPPLE PASS (dependency-graph blast-radius + update-matrix + gate) — is this the right model for
    "change X → update all dependents"? What do mature systems (build graphs, schema migration tools,
    monorepo tooling) do that we should copy, and what fails at scale?
R3. Loop activation: per-session loops run but nothing reports; cadence loops aren't scheduled. What is the
    minimum viable "the platform reports its own health to its owner" design that won't become dashboard noise?
R4. Risk-class as the PRIMARY journey selector with persona as overlay — agree? Any failure modes?
R5. One thing most likely to make this collapse under real multi-user load once built. Be specific.
```
