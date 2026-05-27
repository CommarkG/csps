---
id: B_HUMBLE_CONSOLIDATION_DISCIPLINE
name: B_HUMBLE_CONSOLIDATION_DISCIPLINE
description: "Behavioral contract encoding P-META-029. AI MUST run platform-inventory-scan.mjs before proposal-class outputs. Proposal body MUST include Preservation Map + Consolidation Map + Ripple Analysis. Overrides training defaults D1/D4/D7/D8."
type: behavioral_contract
protection_level: active
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S067
ratified_session: S067
opus_reviewed_seed: "8fa3cc00"
authored_by: Opus-11
date: 2026-05-28
core_spine: GVRN
schema_anchor: behavioral_contracts
plan_item_id: "DRAFT-S066-MASTER-CONSOLIDATED-RATIFICATION (governor_approval_status: APPROVED S066)"
inherits_from: "P-META-029 + B_REVERSIBILITY_GATED_REVIEW + B_STRUCTURAL_PREVENTION_DISCIPLINE + M-37 Core Seeds + M-42 Unified-Threshold-Router"
override_training_defaults: [D1, D4, D7, D8]
enforcement_tier: "T1+T2+T3 (mechanical — ADVISORY S067, BLOCKING S068)"
fse_5_surface: "principle(P-META-029) + contract(this) + hook(pre-tool-use-inventory-scan-required.sh) + memory(MEMORY.md) + AGENTS.md([B_HUMBLE] hard NO)"
governing_intent: "Every proposal adds before checking — the training default. Humble-consolidation makes inventory-first mechanical, not aspirational."
enforcement_trio:
  t1:
    tier: hook
    path: ".claude/hooks/pre-tool-use-inventory-scan-required.sh"
    status: active
  t2:
    tier: validator
    path: "tools/validators/validate-inventory-scan-coverage.mjs"
    status: advisory
  t3:
    tier: memory
    path: "session-open.sh T1 injection + MEMORY.md index + AGENTS.md [B_HUMBLE] hard NO"
    status: active
links:
  - rel: principle
    href: ../../principles/P-META-029-humble-consolidation-discipline.md
  - rel: moat
    href: ../moat-registry.md
  - rel: proto
    href: ../../protos/PROTO-S067-MASTER-THRESHOLD-ROUTER.md
---

## B_HUMBLE_CONSOLIDATION_DISCIPLINE — inventory-first before any proposal

**Canonical rule:**

> Before authoring any commitment-layer output (proposal / new artifact / principle / validator / hook / schema / app), AI MUST: (1) run `tools/scripts/platform-inventory-scan.mjs` against the topic, (2) include `## Preservation Map` documenting what existed before, (3) include `## Consolidation Map` documenting what is reused vs newly added, (4) include `## Ripple Analysis` with a 3-hop dependency walk. "I checked what exists" stated behaviorally = violation. The scan run = mechanical evidence.

**Training defaults overridden:**

| Default | Behavior | CSPS override |
|---|---|---|
| D1 eager-helpfulness | Answer fast; produce content quickly | P-OP-007: "we have time, depth over velocity" |
| D4 pattern-match | Recognize generic patterns from training | vocabulary-canon + M-17 reuse-first: precedent-check in CSPS first |
| D7 action-bias | Be agentic; take action | P-META-019 STRUCTURAL_PREVENTION + P-OP-001 reuse-first |
| D8 naming-novelty | Coin new terms creatively | vocabulary-canon: no invention without precedent |

**Triggered on:** input classified by M-42 router as `intent ∈ {proposal, new_artifact, refactor, principle, contract, moat, validator, hook, schema, app}`

**Exempt outputs** (no scan required): conversational replies, ZF cycles, status updates, direct fixes to named existing files, session admin (INTENT ABSORBED, checkpoints, handoff authoring).

**Phased rollout:**
- S067: ADVISORY — hook warns, does not block; validator is advisory
- S068: BLOCKING — hook prevents proposal-class Writes without scan evidence

**Why this matters — S066 incidents:**
- M-19 phantom hook: added as moat element, never confirmed firing
- threshold 358/358 entries: session=unknown added without validating session-detection first
- vault pull_on_context: 0 actual invocations despite 41 moats citing it
- consolidation-pass hook: 57 sessions as STUB, never activated

**5/5 FSE surface evidence:**

| Surface | Artifact | Session |
|---|---|---|
| Principle | `docs/plan/principles/P-META-029-humble-consolidation-discipline.md` | S067 STEP 6.1 |
| Contract | This file | S067 STEP 6.1 |
| Hook (T1) | `.claude/hooks/pre-tool-use-inventory-scan-required.sh` | S067 STEP 5 |
| Memory | `MEMORY.md` + `feedback_humble_consolidation.md` | S067 STEP 6.1 |
| AGENTS.md | `[B_HUMBLE] Prevention-class gates (S067)` hard NO | S067 STEP 6.1 |

**Satisfaction point to avoid:** Declaring "I reviewed what exists" in chat text. The B_HUMBLE discipline requires tool output from `platform-inventory-scan.mjs` as THIS-TURN evidence — not a claim about having reviewed. Same RZF principle (P-META-006): re-run IS the proof.
