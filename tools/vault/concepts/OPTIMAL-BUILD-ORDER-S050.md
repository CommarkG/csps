---
id: vault.concepts.OPTIMAL-BUILD-ORDER-S050
name: OPTIMAL-BUILD-ORDER-S050
description: "The optimal 6-phase build sequence from S050 ARCH-SESSION — each phase generates the learning the next phase needs"
type: vault_concept
protection_level: active
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "0.1"
session: S050
core_spines: [GVRN, ARCH]
core_spine: GVRN
schema_anchor: vault_files
impl_status: swift-implemented
links:
  - vault.concepts.COMBINATORIAL-ENGINE-ARCHITECTURE-V1
  - SIA.SONNET-S051-FORK-BRIEF
context_question: "Before starting any new build phase, what must the previous phase have generated — and is that output actually present?"
context_quote: "The learning of Phase N is not overhead. It is the specification for Phase N+1."
inherits_from: "Platform Genome §7 Phase Build Order"
---

# Optimal Build Order — S050 ARCH-SESSION Output

## The 6-Phase Sequence

```
PHASE 0 — CLEAR BLOCKERS (S051-A)
  1. behavioral-contracts shard       [clears 60K limit; unblocks new B_* contracts]
  2. APP-001 fork from apps/template/ [clean foundation before anything else]
  3. S050 HANDOFF                     [ensures session context persists]
  WHY FIRST: Nothing else builds cleanly on a cracked foundation.

PHASE 1 — GENERATE LEARNING (S051-B)
  4. Section 5 V1 (3 questions + Sponge homepage + notification stub)
  5. Deploy → activate → observe
  WHY SECOND: Alex's real behavior is unknown. Day 7 retention > Day 1 notification.
  GENERATES: What vocabulary does Alex actually use? What's the real friction point?
  FEEDS: Every STT, BEHAVIOR-HUB, and Human Psychology Hub design decision.

PHASE 2 — INFRASTRUCTURE (S052)
  6. BEHAVIOR-HUB schema (AI layer + Human layer, universal core)
  7. PRIVATE-BUSINESS-SILOS architecture
  8. validate-activation-coverage BLOCKING
  WHY THIRD: Can't build domain intelligence without the schema.
  GENERATES: Consistent schemas for all downstream work.

PHASE 3 — DOMAIN INTELLIGENCE (S053)
  9. STT Correction V1 (per-user vocabulary, informed by Phase 1 error data)
  10. Ingestion schema CSPS version (with STT layer)
  11. Human Psychology Hub skeleton
  WHY FOURTH: Now we have real user data AND the schema to design against.

PHASE 4 — ENGINE INFRASTRUCTURE (S054)
  12. Combinatorial Engine Layer 1 (preprocessing — uses Phase 3 schema)
  13. A/B Testing Hub (APP-001 has real users by now)
  14. T1/T2 for top 3 AI Conception Vault entries
  WHY FIFTH: Engine is built on validated schema and real user data.

PHASE 5 — MOAT FEATURES (S055+)
  15. CE Layer 2 (dimensional routing)
  16. CE Layer 3 (forward reasoning — the full moat)
  17. Cross-app CAIE intelligence (BATCH-J)
  WHY LAST: Requires data from every preceding phase to work correctly.
```

## The Dependency Rule

A phase cannot start until the previous phase has GENERATED its output — not just started it.
Phase 1's output is: real user behavior data, not just a deployed app.
Phase 2's output is: ratified schemas, not just designed ones.

## Why This Order Is Optimal

Phase N's learning is the specification for Phase N+1.
Building Phase N+1 before Phase N completes = theoretical specifications = rework.
The 30-day Phase 1 observation is NOT idle. It is active research.

---

*Optimal Build Order | Vault concept | S050 | Distilled from 3-pass ARCH review*
