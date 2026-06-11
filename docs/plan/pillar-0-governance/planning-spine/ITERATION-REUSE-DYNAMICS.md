---
id: csps.governance.planning-spine.iteration-reuse-dynamics
name: ITERATION-REUSE-DYNAMICS
description: "How P-META-035 (Iteration & Reuse) is expressed across the Planning Spine loop. Maps the two principle faces (don't stop; don't start from zero) to specific loop behaviors and re-entrant gate logic."
version: "0.1"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: VALD
schema_anchor: pillar_0_governance_leaves
status: ratified
authored_by: Sonnet S080
authored_at: "2026-06-05"
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - maturity:stable
links:
  - { rel: p-meta-035, href: ../../../../packages/principles/principles/P-META-035-iteration-and-reuse.yaml }
  - { rel: p-meta-034, href: ../../../../packages/principles/principles/P-META-034-reality-tested-completion.yaml }
  - { rel: izfc-memory, href: "C:/Users/finky/.claude/projects/c--Users-finky-Desktop-Claude-Code-Csps/memory/feedback_izfc_excellence_completion.md" }
  - { rel: planning-spine, href: PLANNING-SPINE.md }
---

# Iteration & Reuse Dynamics — Planning Spine

P-META-035 has two faces. This document shows how each face is expressed in the Planning Spine loop.

---

## Face 1: DON'T STOP (Iteration)

*The discipline of not stopping before genuinely examining from new angles.*

### Where it appears in the loop

| Loop element | Iteration expression |
|-------------|---------------------|
| **COMPLETION-TEST (Stage 6)** | Primary enforcement — loop exits only when IZFC sweep finds zero new findings |
| **Loop-back** | A finding at COMPLETION-TEST → return to CLASSIFY, not to the same stage |
| **Re-entrant CLASSIFY** | Each loop-back starts from classification, not from where the last iteration stopped |

### The failure mode: stopping too early

P-META-035's "don't stop" face catches two AI training defaults:
- **D5 (single-pass)** — stops after the first plausible result; doesn't seek independent confirmation
- **D3 (surface-completeness)** — produces output that looks done without being done

The COMPLETION-TEST is the structural blocker for both: it requires a fresh-angle sweep to find zero new findings before exit is permitted.

### IZFC in the loop

The loop's COMPLETION-TEST IS IZFC applied to the planning process. The same discipline that governs individual response completeness (feedback_izfc_excellence_completion.md) governs loop exit:
- Each re-entry from loop-back = one IZFC cycle from a new angle
- Loop exit = IZFC's "a fresh sweep finds nothing"
- P-META-035 is the parent that explains WHY IZFC is the correct completion standard

---

## Face 2: DON'T START FROM ZERO (Reuse)

*The discipline of exhausting existing paths before creating new ones.*

### Where it appears in the loop

| Loop element | Reuse expression |
|-------------|-----------------|
| **CHECK-EXISTS (Stage 2)** | Primary enforcement — no creation without Atlas query (or current advisory check) |
| **Re-entrant CHECK-EXISTS** | Fires again pre-simulate and on new-research; new information may reveal existing nodes |
| **RESEARCH-INPUT.md** | `validate-research-reuse.mjs` checks existing research before commissioning new |
| **CLASSIFY re-entry** | Re-classification after loop-back may resolve to a different (existing) path |

### The failure mode: starting from zero

P-META-035's "don't start" face catches:
- **D4 (pattern-match)** — reaches for familiar creation pattern instead of checking existing
- **D8 (naming-novelty)** — creates `journey-trunk` when `journey` already existed with the same purpose

The CHECK-EXISTS gate + Spine Atlas (when built) are the structural blockers for both.

### EXISTS≠ACTIVE corollary

Reuse requires not just that the node EXISTS but that it is ACTIVE. A found-but-stub artifact is not a valid reuse target. The check must include status verification (active / stub / deprecated). See `post-stop-exists-not-equals-active.sh`.

---

## How the Two Faces Interact

The symmetry is deliberate:
- **Don't stop** prevents premature exits from the loop (shallow results, unexamined angles)
- **Don't start** prevents premature entries into creation (scatter, duplication)

Together they define the platform's growth disposition: **deepen what exists rather than widen into scatter.**

The planning loop's re-entrant gates operationalize this: CLASSIFY and CHECK-EXISTS re-fire not because the process is uncertain, but because new information (from research, from goal-refine, from a failed completion-test) genuinely requires re-examining both questions: "what is this?" (CLASSIFY) and "does something for this exist?" (CHECK-EXISTS).

---

## P-META-035 vs P-META-034: Scope Distinction

| | P-META-034 | P-META-035 |
|-|-----------|-----------|
| Governs | **Claims** — "is this assertion correct?" | **Process** — "is this planning approach valid?" |
| Primary gate | COMPLETION-TEST | CHECK-EXISTS + loop-back |
| AI defaults blocked | D5 (single-pass on claims) | D4+D8 (pattern-match + naming-novelty on creation), D5 (single-pass on process) |
| Failure mode | A claim that felt true without being tested | A process that created new artifacts instead of reusing or deepened existing |

They are siblings, not parent/child. P-META-034 governs what comes OUT of the planning loop (claims). P-META-035 governs HOW the loop operates (process).

---
*RATIFIED v0.1 | Sonnet S080 | Ratified S082 · 2026-06-11*
