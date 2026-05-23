---
id: csps.governance.explore-ratify-execute
name: EXPLORE-RATIFY-EXECUTE
description: "The three-phase pipeline that prevents wild implementations. Exploration creates plan items. Ratification gates execution. Execution works only against ratified items."
version: "1.0"
type: architecture
protection_level: sacred
diataxis_type: reference
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spines: [GVRN, ARCH]
core_spine: GVRN
schema_anchor: vault_files
session: S057
ratified_session: S057
ratified_by: Governor
links:
  - csps.data.gap-recurrence-register
  - vault.concepts.DEFAULT-STORAGE-IS-EPHEMERAL
  - vault.concepts.GRID-CONSCIOUSNESS
context_question: "Before any implementation starts, can you cite the specific unified-plan.yaml item ID this work is executing against?"
context_quote: "The wild implementations are missing a lot of the things we're building because they are triggered by AI Deep Instructions and they're executed by AI Deep Instructions. This is the main failure of CSPS to be built with its own infrastructure."
---

# Explore → Ratify → Execute

## The Pipeline

CSPS governs how apps are built. CSPS must also govern how CSPS itself is built.
The same pipeline that prevents wild implementations in apps applies to CSPS governance artifacts.

### Phase 1: EXPLORE (Opus planning tab)
- Opus analyzes, designs, surfaces insights
- Produces ONE artifact: a plan item entry for unified-plan.yaml
- May also write vault entries (pure documentation, no side effects)
- MUST NOT: write hooks, validators, configuration, or code without a ratified plan item

### Phase 2: RATIFY (Governor decision)
- Governor reviews the plan item
- Approves: item moves to status: ratified
- Requires: context_question + ai_behavior_analysis + BEFORE/AFTER simulation

### Phase 3: EXECUTE (Sonnet execution tab)
- Sonnet receives a PROTO that cites the plan item ID
- Implements only what the plan item specifies
- Reports completion with ZF evidence (evidence-based, citing specific files)

## The Wild Implementation Failure Mode

When AI has a good idea and implements it without a plan item, it:
1. Bypasses the ai_behavior_analysis that would name the AI defaults in play
2. Bypasses the BEFORE/AFTER simulation that would test whether the idea actually works
3. Creates an artifact with no traceability to a ratified decision
4. Produces something that cannot be audited for effectiveness

S053 example: GRID-CONSCIOUSNESS.md, DEFAULT-STORAGE-IS-EPHEMERAL.md, session-open-context.mjs edits, settings.local.json edit — all created directly by Opus without plan items. All architecturally sound. All ungoverned. Retroactively registered in unified-plan.yaml as the structural fix.

## The Exception

Vault entries (pure documentation, no side effects) may be written by Opus during exploration.
They become part of the plan item output.
They still require: context_question + context_quote + links.

## Enforcement

- validate-no-implementation-without-plan.mjs: ADVISORY when code directories have no backing plan
- gap-recurrence-register.yaml: tracks wild implementation recurrence (gap_WILD_IMPLEMENTATION)
- This document: the canonical reference for what the pipeline is and why it exists
