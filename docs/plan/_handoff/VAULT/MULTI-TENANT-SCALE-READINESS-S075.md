---
id: csps.handoff.vault.multi-tenant-scale-readiness
name: MULTI-TENANT-SCALE-READINESS
description: "Governor S075: reinforce platform attitude — think inside-out AND outside-in about 30 apps on the core at once under multi-tenancy. A crooked/inconsistent core doesn't fail linearly; it MULTIPLIES across apps. This names scale-readiness as a 4th foundation dimension that is NOT yet proven, and the path to prove it before apps multiply."
version: 1.0
owner: group:finky
lifecycle: draft
lifecycle_state: candidate
core_spine: ARCH
core_spines: [ARCH, GVRN]
schema_anchor: vault_files
session: S075
dpr_rating: 3
status: research-pending
links:
  - { rel: skill, href: bottleneck-expert }
  - { rel: connection-pitfall, href: "memory:feedback_supabase_pgbouncer_url" }
  - { rel: schema, href: "skill:schema-expert" }
tags: [domain:architecture, type:reference, audience:ai-agent, maturity:draft]
---

# Multi-Tenant Scale-Readiness — the 4th foundation dimension

## INSIDE-OUT (core looking out): inconsistency MULTIPLIES, it does not add
If the core has a gap/contradiction/duplication (the freestyling-AI failure), every app inherits it ×30:
- a missing `tenant_id` or an RLS hole on ONE entity = a data-leak replicated across 30 apps.
- two definitions of "Plan" (the D15-D17 disease, at the schema layer) = 30 apps that disagree on entitlement.
- a "done" that wasn't verified = 30 apps built on a function that doesn't actually work.
This is WHY core-first is non-negotiable: defects don't stay local, they fan out. The governance layer we just
sealed (B1-B5) is exactly the machinery that keeps the core consistent so the fan-out is of CORRECTNESS, not rot.

## OUTSIDE-IN (30 apps × multi-tenant load looking at the core): shared-resource contention
What breaks when 30 apps, each with many tenants, hit the core AT ONCE (bottleneck-expert 30→300 lens):
1. ONE database / connection pool → exhaustion. The pgbouncer memory is the canary: DATABASE_URL needs
   pgbouncer=true&connection_limit=1 or Prisma 42P05 under concurrency. 30 apps × tenants = pool contention —
   NOT YET stress-tested. (Direct vs pooled URL discipline must hold per-app.)
2. ONE Supabase / Clerk / shared integrations → rate limits + noisy-neighbor. B3-lean gives health-CHECK, not
   capacity/throttling/quota-per-tenant.
3. RLS evaluated on EVERY query × 30 apps × tenants → policy latency compounds. RLS correctness is designed
   (schema-expert); RLS PERFORMANCE at scale is unproven.
4. Noisy-neighbor: one tenant's heavy app degrading all others — multi-tenancy's classic failure; no per-tenant
   resource quota/isolation exists yet.

## THE GAP (honest): the foundation has 4 dimensions; only 1 is sealed
1. Governance / AI-collaboration consistency — SEALED (B1-B5). ✓
2. Product schema (PART 3) — authored; migration pending (Governor). ◐
3. Agent-independence (AGENT-DECOUPLING, DPR-4) — vaulted, unbuilt. ◯
4. Multi-tenant SCALE-READINESS — THIS doc; not designed, not stress-tested. ◯
"Foundation complete" = all 4, not just the governance layer. Declaring foundation-done on dimension 1 alone
would be the exact crooked-floor risk the Governor named.

## THE PATH (research/design, then prove — connect existing, mint nothing parallel)
- Connection-pooling contract per app (pgbouncer/direct-URL discipline as a wired rule, not per-app memory).
- Per-tenant resource quota + noisy-neighbor isolation (design; the multi-tenant fairness layer).
- RLS performance budget (measure policy cost; index tenant_id; the schema-expert's domain).
- A load model: simulate N apps × M tenants against the core BEFORE building app #2..30 (bottleneck-expert
  30→300 / 10→100 questions, run as a real stress test, not a thought experiment).
- Tie the 20 orphan hooks (B5 audit) into the cleanup — dead machinery is the dev-time analogue of the same
  drag; less-but-blocking applies to the core's own weight.
DPR-3: process as a deliberate foundation workstream BEFORE apps multiply. Governor may elevate.
