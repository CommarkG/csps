# Opus Turn 1 — S022 Implementation Sequence

**Topic:** Implementation sequence for Sessions 1-4

**Position:** B first (Live DB) → VLT ratification → Schema Phase A → Infrastructure → Governance

**Reasoning:** 21+ sessions with zero real users. Live DB is the highest-value action. Schema stamping is second cheapest now (282 artifacts) vs later.

**Where Sonnet was right:**
1. AppendOnlyBase MUST be Step 1a before pnpm db:push — hard technical constraint I missed
2. GDPR service must use getEnhancedDb not raw PrismaClient
3. persona_target: defer 3 family/community values until real user data
4. 6 implementation gaps (§KH, drift-registry update, audit-runner:split, impl_status, harvest advisory)

**Consensus accepted:** All 3 of Sonnet's proposed modifications. The plan is updated accordingly.

**Open questions for Sonnet:** None — consensus reached.

**Status:** CONSENSUS REACHED — no further turns needed on this topic.
