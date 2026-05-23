---
id: vault.concepts.MDPE-FORMULA
name: MDPE-FORMULA
description: "Multi-Dimensional Priority Engine formula — adds blast_radius, readiness, future_enablement, simplicity_bonus to classic PE scoring"
type: vault_concept
protection_level: protected
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "0.1"
session: S051
core_spines: [ARCH, GVRN, AI]
core_spine: ARCH
schema_anchor: vault_files
impl_status: swift-implemented
links:
  - vault.concepts.OPTIMAL-BUILD-ORDER-S050
  - SIA.R2-01-PLATFORM-INTELLIGENCE-ENGINE
context_question: "Before scoring any plan item, what dimensions beyond urgency × impact does the Queen need to assess timing correctly?"
context_quote: "The Palace is alignment. The Queen is timing. A rigid PE serves neither."
inherits_from: "Platform Genome §3 Priority Engine"
---

# MDPE — Multi-Dimensional Priority Engine Formula

## Why the Classic PE Fails

`pe_score = urgency × impact / SPI_estimate`

This formula scores items in isolation. It cannot see:
- How much breaks if this item is done wrong (blast radius)
- Whether everything needed to build this correctly exists (readiness)
- How many future items this item makes better or enables (future_enablement)
- Whether this is a quick cognitive-load removal opportunity (simplicity bonus)

**The documentation-in-schema failure:** Classic PE scored it ~60 (moderate urgency, moderate impact, medium SPI). But this item, if missing, causes every subsequent governance artifact to accumulate retrofitting debt. The Queen missed the timing because the formula didn't ask the right questions.

---

## The MDPE Formula

```
MDPE_score = classic_pe
           × (1 + blast_radius × 0.5)
           × (1 + future_enablement × 0.5)
           × (1 + readiness × 0.3)
           × (1 + simplicity_bonus × 0.2)
```

### Dimension Definitions

**blast_radius** (0.0 – 1.0):
- 0.0: this item being wrong breaks nothing downstream
- 0.5: this item being wrong requires 5-10 things to be retrofitted
- 1.0: this item being wrong requires fundamental rework of many downstream items
- Question: *"If this is built incorrectly, how much breaks downstream?"*

**future_enablement** (0.0 – 1.0):
- 0.0: completing this enables nothing else
- 0.5: completing this enables 3-5 other significant items
- 1.0: completing this is a prerequisite for a large class of future items
- Question: *"Completing this item enables what? How many future items depend on this existing?"*

**readiness** (0.0 – 1.0):
- 0.0: missing prerequisite design or infrastructure — can't be built yet
- 0.5: design exists, some dependencies need to be resolved
- 1.0: everything needed exists, can be built immediately
- Question: *"What does this need to function optimally? Is that available?"*

**simplicity_bonus** (0 or 1):
- 0: medium or high complexity, significant design work needed
- 1: small, well-defined, fast to implement — cognitive load reduction opportunity
- Question: *"Is this fast, simple, and low-risk? If yes, clear it now."*

---

## Worked Example: documentation-in-schema

| Dimension | Score | Reasoning |
|---|---|---|
| classic_pe | 60 | Moderate urgency, high impact, medium SPI |
| blast_radius | 0.9 | Every artifact without schema linkage = debt; 60+ existing artifacts |
| future_enablement | 0.9 | Unlocks: AI alignment persistence, searchable governance, automated context |
| readiness | 0.8 | Design in docs/SIA/R1-01-NODE-SCHEMA.md, pattern in vault files, 2-3 steps |
| simplicity_bonus | 0 | Medium complexity — not a quick win |

MDPE_score = 60 × 1.45 × 1.45 × 1.24 × 1.0 = **156**

Classic PE ranking: moderate priority.
MDPE ranking: **top of the queue**.

---

## Palace/King/Queen Application

**Palace (context):** Items with high future_enablement are the context foundation — they determine whether future work happens inside a solid context or not. High future_enablement = the item IS part of the Palace architecture.

**King (alignment):** Items with high blast_radius threaten alignment. If built wrong, they require vocabulary/structural corrections across many artifacts. King flags these for top priority.

**Queen (timing):** The Queen's timing question: "What is the right moment for each item?" High readiness + high future_enablement = the Queen's answer is "NOW." Low readiness + low future_enablement = "vault it for the right moment."

---

## Items That Score Differently Under MDPE

| Item | Classic PE | MDPE | Reason for change |
|---|---|---|---|
| documentation-in-schema | ~60 | ~156 | High blast_radius + future_enablement |
| THRESHOLD-CODE | 96 | ~140 | High readiness + very high future_enablement |
| INFRA-FLOW-VALIDATION | 98 | ~115 | High impact but lower readiness (depends on Threshold) |
| STT-CORRECTION-SYSTEM | 88 | ~95 | High future_enablement, medium readiness |
| BEHAVIOR-HUB | 90 | ~110 | High future_enablement (CE depends on it) |

---

## Implementation Notes

This formula should replace the current `pe_score` field OR exist as a computed score alongside it.

Plan: update `validate-pe-dashboard.mjs` to:
1. Read the classic pe_score from unified-plan.yaml
2. Read MDPE dimensions from item notes (or a new field when schema is updated)
3. Compute MDPE_score
4. Display both: classic rank and MDPE rank

The delta between classic and MDPE ranking IS the signal: items with large deltas are the ones the classic PE was missing.

---

*MDPE Formula | Vault concept | S051 | Awaiting implementation in validate-pe-dashboard.mjs*
