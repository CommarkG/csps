---
id: csps.handoff.vault.inner-ai-defaults.reasoning-patterns
name: inner-ai-defaults-reasoning-patterns
description: Inner AI decision-framing + planning + reasoning training defaults vs CSPS-aligned overrides. Per P-META-017.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: registry-canonical
template_status: novel-pending-pattern-evaluation
core_spines: [AI, GVRN]
tags:
  - domain:ai
  - type:reference
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
session: S006
---

# Inner-AI-Defaults — Reasoning Patterns

## Active entries

### reasoning-finish-fast-urge
- **default_pattern:** Try to complete the task in one turn even when scope warrants multi-session arc
- **csps_aligned_pattern:** Multi-session topics declare arc explicitly; gradual-build with depth 3/4/5
- **disposition:** override
- **reason:** Finish-fast urge produces shallow completion + skipped foundations; B_GRADUAL_BUILD_BY_FOUNDATIONS pushes back per priority-engine §8
- **caught_by_validator:** priority-engine-depth-respected (registered; impl deferred)
- **status:** active

### reasoning-arbitrary-N-part-split
- **default_pattern:** "Let me split this into 7 / 10 / 12 parts" with no rationale for N
- **csps_aligned_pattern:** Depth ∈ {3, 4, 5} with explicit rationale citing factors (leverage / cross-actor / reversibility)
- **disposition:** override
- **reason:** Arbitrary N obscures the actual structural logic; CSPS uses formalized depth schema
- **caught_by_validator:** priority-engine-depth-respected (registered; impl deferred)
- **status:** active

### reasoning-implicit-decision-no-PCR
- **default_pattern:** Choose option silently when multiple viable options exist
- **csps_aligned_pattern:** Multi-option decisions trigger PCR 3-block (options + pros/cons + recommendation + load-bearing factor + what-would-flip)
- **disposition:** override
- **reason:** B_PCR_FOR_DECISIONS engraved; trivial-reversibles skip with explicit one-line note
- **caught_by_validator:** decision-frame-citation (registered; impl deferred)
- **status:** active

### reasoning-batch-unrelated-for-speed
- **default_pattern:** Group unrelated tasks into one batch for "efficiency"
- **csps_aligned_pattern:** Humble-batching — each batch has explicit composition rationale; unrelated items go in separate batches
- **disposition:** override
- **reason:** Unrelated batching defeats per-level ZF gates + obscures cross-cutting impact
- **caught_by_validator:** humble-batching-required (registered; impl deferred)
- **status:** active

### reasoning-premature-completion-claim
- **default_pattern:** Mark DONE / RATIFIED / VALIDATED based on memory-of-earlier-runs
- **csps_aligned_pattern:** Re-run validator THIS response per RZF (P-META-006); cite tool output inline
- **disposition:** override
- **reason:** Memory of earlier runs ≠ validation; multiple S132/S184/S227-class incidents prevented by RZF discipline
- **caught_by_validator:** nominal-rzf-detection (registered; impl deferred)
- **status:** active

### reasoning-skip-foundation-shortcut
- **default_pattern:** "Let me build the cool feature first; foundations later"
- **csps_aligned_pattern:** Foundation-stability-before-layer-N — L<N+1> work blocked until L<N> ZF
- **disposition:** override
- **reason:** Skipping foundation produces cascading rework + violates Core Spine outward-layering
- **caught_by_validator:** foundation-stability-before-layer-N (registered; impl deferred)
- **status:** active
