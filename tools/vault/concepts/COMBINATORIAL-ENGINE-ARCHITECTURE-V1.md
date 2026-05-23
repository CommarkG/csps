---
id: vault.concepts.COMBINATORIAL-ENGINE-ARCHITECTURE-V1
name: COMBINATORIAL-ENGINE-ARCHITECTURE-V1
description: "Three-layer architecture for the Combinatorial Engine — preprocessing, dimensional routing, combinatorial reasoning — with multi-tenant scalability design"
type: vault_concept
protection_level: active
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "0.1"
session: S050
core_spines: [ARCH, AI, OPER]
core_spine: ARCH
schema_anchor: vault_files
impl_status: swift-implemented
links:
  - vault.concepts.COMBINATORIAL-ENGINE-RAW
  - vault.concepts.SPEECH-TO-TEXT-CORRECTION-SYSTEM
  - SIA.R1-04-THRESHOLD
  - SIA.R2-01-PLATFORM-INTELLIGENCE-ENGINE
context_question: "How does the Combinatorial Engine process inputs through three layers while scaling to many concurrent multi-tenant requests?"
context_quote: "Simple sorting first. Refinement second. Deep reasoning third. Never block the user waiting for layer 3."
inherits_from: "Platform Genome §5 Platform Architecture"
---

# Combinatorial Engine — Three-Layer Architecture V1

> Draft architecture. Playing with connectivity. Will rearrange based on real-world outputs.

---

## The Core Design Principle

**Never block user interaction waiting for the engine.**

Most deep reasoning systems make users wait. The Combinatorial Engine is asynchronous at layers 2 and 3. Only Layer 1 is synchronous (real-time, lightweight). The user gets immediate acknowledgment; the insight surfaces when it's ready.

This is what allows multi-tenant scalability: the expensive computation happens in the background queue, not in the request-response cycle.

---

## Layer 1 — Preprocessing (Synchronous, < 100ms)

**Purpose:** Clean and classify the input before it touches anything.

```
INPUT ARRIVES
    ↓
[STT Correction] — apply per-user vocabulary map + system-wide distortion registry
    ↓
[Fragmentation] — split complex input into Parts (DOC-001.P04: Chunks)
    ↓
[Basic Classification] — type (voice/text/file/derived) + urgency (1-4) + source
    ↓
[Context Tagging] — which active conversation thread does this belong to?
    ↓
OUTPUT → classified, corrected, fragmented Parts
         → immediate acknowledgment to user ("received")
         → enqueue for Layer 2
```

**Technology implication:** This layer runs in the request thread. Lightweight. No database calls except the STT vocabulary lookup (cached per-user).

---

## Layer 2 — Dimensional Routing (Async, seconds)

**Purpose:** Map each Part to the dimensional model. Identify gaps. Route to appropriate pipelines.

```
CLASSIFIED PARTS FROM LAYER 1
    ↓
[Dimension Identification] — which user dimensions does each Part affect?
    ↓
[Completeness Scoring] — update each dimension's completeness score
    ↓
[Gap Registration] — which dimensions are still missing data after this input?
    ↓
[Dependency Matrix Lookup] — does this input change any Dependency Strength grades?
    ↓
[Organic Question Generator] — does this input create a natural opportunity to fill a gap?
    ↓
OUTPUT → updated dimensional state per user
         → gap queue (dimensions still missing data)
         → question opportunities (organic fill moments identified)
         → enqueue for Layer 3 if dimensional threshold met
```

**Technology implication:** This runs as a background job. Supabase edge functions or a simple job queue. Results stored per-user in the database (ZenStack governed, per-tenant).

---

## Layer 3 — Combinatorial Reasoning (Async, minutes-to-hours)

**Purpose:** Find the cross-dimensional insights the user cannot see. Surface only when confidence + timing are right.

```
UPDATED DIMENSIONAL STATE FROM LAYER 2
    ↓
[Dependency Matrix Application] — grade all active vector interactions (Isolated→Synergetic)
    ↓
[Trajectory Simulation] — forward-simulate 30/90/180-day trajectories from current vector state
    ↓
[Collision Detection] — where do Synergetic vectors create future risks or opportunities?
    ↓
[Insight Scoring] — confidence × relevance × timing (Queen) → surface score
    ↓
IF surface score > threshold:
    [Sensitivity Ladder Selection] — Tone/Depth/Urgency levels for this user + this insight
    ↓
    [Surfacing Queue] → notification or next-appropriate-moment injection
ELSE:
    → keep in pending insights, re-score on next dimensional update
```

**Technology implication:** This is the computationally expensive layer. Runs on demand when dimensional state changes enough to warrant re-analysis. Not per-input — per-state-change.

---

## Multi-Tenant Scalability

**The three-layer model handles multi-tenancy naturally:**

| Layer | Isolation | Scale approach |
|---|---|---|
| Layer 1 | Per-request (stateless after STT lookup) | Horizontal scaling trivially |
| Layer 2 | Per-user/per-tenant (ZenStack RLS) | Queue with priority (urgency-sorted) |
| Layer 3 | Per-user (profile-specific) | Background batch with rate limiting per tenant |

**Priority queue for Layer 2:**
- Urgency 3-4 inputs → high priority queue (processed < 5 seconds)
- Urgency 1-2 inputs → standard queue (processed < 60 seconds)
- Batch operations → low priority queue (processed when capacity available)

**How major platforms handle this:**
- Notion, Linear: event sourcing — inputs are events, processing is async subscription
- Stripe: write path is fast/simple; reporting/intelligence is batch-processed separately
- CSPS approach: same pattern. Layer 1 = fast write path. Layers 2-3 = async subscriptions on state changes.

**Supabase-specific:** Use Supabase Realtime for layer 2 triggers (on dimensional state change → fire layer 2 job). Use edge functions for layer 1. Use background workers or cron for layer 3.

---

## Schema Placement — STT Vocabulary

The Governor asked: where does the personal vocabulary go?

**Answer: both places, with different access patterns.**

```
user_profile (per-user, per-tenant, ZenStack RLS)
  └── stt_vocabulary (JSONB or related table)
       ├── corrections: { "thornton": "certain", "contacts": "context" }
       ├── calibration_date: timestamp
       └── confidence_map: { "thornton": 0.98, ... }

platform_vocabulary (shared across tenants, read-only per-user)
  └── distortion_registry
       ├── pattern: "thornton" → "certain" (appears in N users)
       ├── frequency: 47
       ├── confidence: 0.89
       └── context_signature: "first-person statement + philosophical topic"
```

**Layer 1 lookup sequence:**
1. Check per-user corrections first (highest confidence — user explicitly corrected this)
2. If no personal correction, check platform distortion registry
3. If registry says "likely mismatch" → flag with ±4 sentence context window
4. User corrects → updates personal corrections → feeds back to platform registry (aggregated)

**Connectivity:** per-user corrections are owned by the user (private). Platform registry is aggregated/anonymized. The two are connected through the update pipeline, not through direct exposure of user data.

---

## Open Architecture Questions (for as we go)

1. Should the ±4 sentence context window be configurable per user? (Some users want more context, some less)
2. At what confidence threshold does the system flag vs. silently accept?
3. How do we handle technical vocabulary that IS correct but looks like an error? (domain-specific terms)
4. Should Layer 3 insights be stored as artifacts (queryable later) or delivered-and-forgotten?
5. What happens to Layer 3 insights that were generated but not yet surfaced when the user's dimensional state changes significantly? (outdated insight problem)

---

*Combinatorial Engine Architecture V1 | Vault concept | S050 | Draft — will rearrange based on outputs*
