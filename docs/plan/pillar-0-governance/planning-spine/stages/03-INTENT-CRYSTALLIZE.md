---
id: csps.governance.planning-spine.stage-intent-crystallize
name: planning-spine-stage-intent-crystallize
description: "Stage 3 — INTENT-CRYSTALLIZE. Transforms the classified input into a stable, unambiguous governing intent before any design work. Canonical: B_INTENT_CRYSTALLIZATION.md."
version: "0.1"
owner: group:finky
lifecycle: production
lifecycle_state: active
status: ratified
re_entrant: false
canonical_artifact: docs/plan/pillar-0-governance/behavioral-contracts/B_INTENT_CRYSTALLIZATION.md
emits:
  field: crystallized_intent
  type: "string — the governing intent statement"
  format: >
    Single statement passing 3 tests: (1) builder evaluates any artifact against it without ambiguity;
    (2) uses human's exact intent words, not AI paraphrase (I1 from threshold-intake-protocol §7);
    (3) narrow enough to detect when output diverges from intent.
  consumed_by: "stages/06-COMPLETION-TEST.md Part B (INTENT-CONFORMANCE)"
  finding_resolved: FINDING-S082-01
  trunk_data_contract: true
---

# Stage 3 — INTENT-CRYSTALLIZE

**Type:** Transform — fires once per loop entry (re-fires if CHECK-EXISTS loop-back changes the nature of the intent).

## What It Does

Converts the classified input into a stable governing intent. The intent is the L3 expression of the L1 principle — concrete enough to evaluate outputs against, but not so narrow that it becomes a rigid format.

## Canonical Artifact

`docs/plan/pillar-0-governance/behavioral-contracts/B_INTENT_CRYSTALLIZATION.md`

No content here — cross-reference only. See the canonical contract.

## Why This Stage Exists in the Loop

Without crystallized intent, the SIMULATE/SANDBOX and COMPLETION-TEST stages have no reference to evaluate against. The loop cannot exit unless it knows what "done" looks like — and that definition lives in the crystallized intent, not in the artifact produced.

## Connection to P-META-034

P-META-034's COMPLETION-TEST requires that the output "contact reality." The "reality" it contacts is the crystallized intent. An intent that was never crystallized means the completion test has no anchor — it evaluates against AI pattern-recognition confidence instead.

**↔ Stage 6 (COMPLETION-TEST)** uses the crystallized intent produced here as its **Half B VALIDATION** anchor — `06-COMPLETION-TEST.md` `validation_anchor` field. The loop cannot exit until impact matches this intent. See `06-COMPLETION-TEST.md:Half B — VALIDATION`.

---
*RATIFIED — part of Planning Spine cluster. Ratified S082 · 2026-06-11.*
