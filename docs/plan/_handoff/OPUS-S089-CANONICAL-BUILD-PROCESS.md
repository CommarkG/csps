---
id: csps.handoff.opus-s089-canonical-build-process
name: OPUS-S089-CANONICAL-BUILD-PROCESS
description: >
  The canonical CSPS build process (Governor-ratified S089) — goal-first, ratified-at-every-gate.
  One spine used twice: how WE build AND what the product journey walks the user through. Includes
  the CREATE=PREVENT mirror (build forward = audit backward) and the hardwire+inherit map. The
  compass that was missing — every build follows this or it is improvising.
version: "1.0"
owner: group:finky
authored_by: OPUS-25
core_spine: GVRN
schema_anchor: handoff_files
diataxis_type: how-to
lifecycle: production
lifecycle_state: active
status: active
precedent_checked: true
session: S089
---

# CSPS Canonical Build Process (the spine)

**Root rule:** no build begins without a ratified GOAL. The goal is the compass; without it every
later stage optimizes a guess. Every stage RATIFIES before the next opens (no silent advance).

## 1. THE STAGES (Governor process + Opus additions [+])

| # | Stage | Gate (ratify before next) | Produces | In system today |
|---|---|---|---|---|
| 1 | GOAL DEFINITION — explore + refine | Governor sign (felt-need test, single sentence, observable resolution signal) | Ratified goal record | PARTIAL (SAGD + CDS CS-GOAL model) |
| 2 | PRESENT WHAT EXISTS | Governor/Opus confirm reuse-first | Existing-inventory map | PARTIAL (dedup/consolidation) |
| 3 | DRAFT THE JOURNEY — parts + order | Ratify each component | Pipeline definition (parts, order) | MISSING |
| 3.5 [+] | JOURNEY-SHAPE SANITY WALK (human) | Felt "does the order make sense?" | Go / reshape | MISSING (cheap, prevents wiring a wrong shape) |
| 4 | BACK-OFFICE SUPPORT — per part | Ratify support reqs | Per-part support map | MISSING |
| 5 | CONNECTIVITY + CORESPINE — per part: "which corespine?" → map + tags + status (placeholder ok) | Ratify mapping | Connectivity map + corespine assignment | core-spine-registry EXISTS; per-part step MISSING |
| 5b [+] | PER-PART REUSE CHECK — "does this exist? which function serves it?" | Enhance-not-fork at part level | Reuse/build decision per part | MISSING |
| 6 | UX CANVAS — full UX checklist | Ratify UX-consistent | UX-passed journey | PARTIAL (ux-ui-dna laws scattered) |
| 7 | UI CANVAS — full UI checklist | Ratify UI | UI-passed journey | PARTIAL (6 UI principles) |
| 8 | TEST-DRIVE (human felt-check) | Governor "I'd use this" | Felt-validated | EXISTS (test-drive loop) |
| 9 [+] | GOAL CLOSURE — resolution signal MET? | Governor closure sign | Closed goal (or not-done) | MISSING (from CDS CS-GOAL drift+closure) |

PREREQUISITE for 6-7: a RENDER-AND-VIEW capability (screenshots/preview) — we cannot canvas UX/UI
we cannot SEE. Hard dependency; currently MISSING (the root of "building blind").

## 2. ONE SPINE, USED TWICE
This is how WE build AND what the PRODUCT journey walks the user through (goal-first, same stages).
Get it right once → both the internal build discipline and the customer journey are fixed by the
same spine. (Matches the CDS model: nothing activates without a traceable ratified goal.)

## 3. CREATE = PREVENT (the mirror — enhancement)
Borrowed + enhanced from the CDS Audit Mirror (Principle 7): creation and audit are the SAME spine
run in opposite directions. Build FORWARD (stages 1→9) = CREATE. Inspect BACKWARD = PREVENT.
Each stage carries BOTH a creation-gate and its mirror audit-question:

| Stage | CREATE gate | PREVENT mirror (audit-question) |
|---|---|---|
| 1 Goal | felt-need-tested, signed | Is there a signed goal that PRECEDES the first build action? |
| 2 Exists | reuse-first done | Was existing checked before new was created? |
| 3 Journey | components ratified | Can every part trace to the goal? Untraceable part = does not belong. |
| 4 Back-office | support mapped | Does each part have its support declared, not assumed? |
| 5 Corespine | mapped + tagged | Does every part name its corespine + status? Orphans = gap. |
| 6/7 UX/UI | checklists passed | Was it SEEN (rendered) and checked, not assumed? |
| 8 Test-drive | human yes | Did a human use it, or did the system declare itself done? |
| 9 Closure | resolution met | Is there a closure record, or is it "done" with the goal unmet? |

=> PREVENTION is not a bolt-on; it is the build process audited in reverse. A gap at any stage IS a
TASK (Governor rule: undefined pipeline = task; missing checklist = task).

## 4. HARDWIRE + INHERIT MAP (what must be enforced + carried)
- HARDWIRE (T1 hook + T2 validator per stage gate): goal-exists-before-build (T2 block) · reuse-check
  (T2) · journey-defined+ratified (T2) · corespine-assigned (T2, extend core-spine-template) · UX/UI
  checklist-run (T2) · render-seen (T2, needs T9 capability) · goal-closure (T2). Each: DONE = gate
  blocks + metric visible (the meta-standard).
- INHERIT (every plan/build/page carries the goal + stage status): goal_id is a mandatory backpack
  slot in every pipeline part (CDS BRANCH-3.3); the process doc is loaded at session-open + referenced
  by AGENTS + the planning protocol so no build starts off-spine.
- "MAKE SURE IT DOES" = T10: build the process AS the hardwired+inherited pipeline (not a checklist
  doc). Until T10, this doc is the declared spine; the gates are the tasks below.

## 5. TASKS (PE-ordered — build in this order)
- T1 [P0] GOAL-DEFINITION + ratification from the CDS goal model (felt-need 5-Q, single sentence,
  resolution signal, sign). The compass — everything hangs on it.
- T10 [P0] THE PIPELINE ITSELF — make this process the hardwired+inherited build pipeline (umbrella).
- T9 [P1] RENDER-AND-VIEW capability (screenshots/preview) — unblocks UX/UI canvas; ends building blind.
- T3 [P1] Pipeline/journey definition format (parts + order + per-component ratify).
- T7 [P1] Canonical UX checklist (one run-able artifact; consolidate scattered ux-ui-dna laws).
- T8 [P1] Canonical UI checklist (one run-able artifact).
- T2 [P2] "present what exists" required step. T5b reuse-per-part.
- T4 [P2] Back-office requirements template per part.
- T5 [P2] Connectivity map + per-part corespine-mapping step (extend core-spine-creator).
- T6 [done] per-part corespine assignment mechanism exists; wire into the step.

## 6. DECISION LEDGER
- CHOSEN: declare ONE canonical goal-first process (build=product, create=prevent-mirror) + an
  ordered task list; build T1 (goal) + T10 (pipeline) first; T9 (see-it) before any UX/UI canvas.
- REJECTED: keep improvising screens with no goal/pipeline (the documented disaster).
- REJECTED: 10 separate parks (sprawl) — the task list lives here; one umbrella park points to it.
- REJECTED: bolt prevention on separately — it is the same spine reversed (the mirror).
