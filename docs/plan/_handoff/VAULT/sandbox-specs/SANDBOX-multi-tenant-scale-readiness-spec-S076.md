---
id: csps.handoff.vault.sandbox-multi-tenant-scale-readiness-spec-s076
name: SANDBOX-multi-tenant-scale-readiness-spec-S076
description: >
  SANDBOX design spec for Foundation dim 4: MULTI-TENANT SCALE-READINESS.
  4 surfaces: CONNECTION-POOL CONTRACT / PER-TENANT QUOTA+NOISY-NEIGHBOR /
  RLS PERF BUDGET / N×M LOAD-TEST HARNESS (design only).
  Scale simulation: 30→300 apps × M tenants. What breaks first. What guards it.
  Source: MULTI-TENANT-SCALE-READINESS-S075.md (Governor S075 vault).
  NO code/validators until Opus OPIA ratifies. Spec only.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: sandbox
quality_state: draft
next_review_at: "2026-06-15"
core_spine: ARCH
core_spines: [ARCH, GVRN]
schema_anchor: vault_files
session: S076
authored_by: Sonnet S076
closure_owner: group:finky
closure_decision: "Opus OPIA ratifies spec before any validator/contract code is written"
closure_by: "S076 after OPIA"
layer: system
links:
  - { rel: source-vault, href: MULTI-TENANT-SCALE-READINESS-S075.md }
  - { rel: connection-pitfall, href: "memory:feedback_supabase_pgbouncer_url" }
  - { rel: schema-anchor, href: ../../../../libs/policies/schema.zmodel }
  - { rel: executor-contract, href: ../../../../docs/architecture/EXECUTOR-CONTRACT.md }
consolidation_cross_refs:
  - docs/plan/_handoff/VAULT/MULTI-TENANT-SCALE-READINESS-S075.md
  - libs/policies/schema.zmodel
  - docs/architecture/EXECUTOR-CONTRACT.md
---

# SANDBOX: Multi-Tenant Scale-Readiness Design Spec (Foundation dim 4)

## Context: The Threat
Source: Governor S075 (outside-in lens). 30 apps × M tenants on ONE Supabase instance.
Shared resources: database connection pool, row-level security execution, rate limits, Clerk quota.
**Crooked-floor principle applies**: a missing quota or a costly RLS policy does not fail
linearly — it compounds across every app and every tenant simultaneously. This is WHY dim 4
is a foundation requirement, not an app-layer concern.

---

## DESIGN SURFACE 1 — CONNECTION-POOL CONTRACT

### The Risk
The 42P05 `prepared statement already exists` error fires when Prisma uses the **direct** URL
(port 5432) under concurrent connections without `pgbouncer=true` + `connection_limit=1`.
At 30 apps each hitting the DB under load, connection pool exhaustion becomes the first bottleneck.

### Pool Math

| Supabase tier | Direct connections | pgBouncer pool size |
|--------------|-------------------|---------------------|
| Free | 60 | ~200 (transaction mode) |
| Pro | 200 | ~1000 (transaction mode) |
| Team | 500 | configurable |

With `connection_limit=1` per app Prisma client:
- **30 apps at rest**: 30 connections minimum → fits Free tier (60 limit), near the ceiling.
- **30 apps under concurrent load**: transaction-mode pgBouncer means connections are returned
  after each transaction. `connection_limit=1` = Prisma holds max 1 connection in the pool.
  Under read-heavy workloads (most SaaS): 30 apps × 1 → 30 pool connections sufficient.
- **30 apps at 300 tenants each**: burst traffic can spike Prisma concurrency per app.
  With `connection_limit=1`, Prisma queues (not errors). Queue depth becomes the risk.
- **300 apps**: 300 × 1 = 300 minimum. Exceeds Supabase Free (60) and Pro (200).
  **300 apps = infrastructure-level pooler required** (Supabase's own pooler OR separate PgBouncer).

### Per-App URL Discipline (the rule)
```
DATABASE_URL  = postgresql://...@<host>:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL    = postgresql://...@<host>:5432/postgres
# DATABASE_URL → Prisma client (all queries)
# DIRECT_URL  → Prisma migrate only (schema migrations)
```
No app may use port 5432 in DATABASE_URL. No exception without documented override + approval.

### Exhaustion Canary Design
An `exhaustion canary` test that:
1. Opens N concurrent connections to the DB (N = connection_limit × app_count)
2. Waits 100ms (simulates concurrent request burst)
3. Asserts all connections succeeded without 42P05 or `P0002 connection pool exhausted`
4. Measures latency degradation (>200ms → warn; >500ms → fail)

### Proposed Validator Signature
```javascript
// validate-connection-pool-contract.mjs
// Checks:
// 1. Every app's .env.example + prisma/schema.prisma uses port 6543 in DATABASE_URL
// 2. DIRECT_URL is present (migrations) and uses port 5432
// 3. connection_limit=1 is set
// 4. pgbouncer=true is set
// Blocking: any app DATABASE_URL using port 5432
// Advisory: missing connection_limit or pgbouncer param
// Block-test: mock .env with port 5432 in DATABASE_URL → exit 1
```

### Open Questions
**Q1**: What Supabase tier is CSPS on (Free/Pro/Team)? This determines whether 30 apps fit
the pool budget today or require infrastructure changes.

**Q2**: Is connection_limit=1 correct for all apps, or do read-heavy apps need `connection_limit=2`?
The tradeoff: higher limit = more pool throughput, higher exhaustion risk.

---

## DESIGN SURFACE 2 — PER-TENANT QUOTA + NOISY-NEIGHBOR ISOLATION

### The Risk
B3-lean (external integration health) gives a health CHECK — it detects when Supabase/Clerk
is down. It does NOT enforce per-tenant request budgets. Without quota enforcement, one tenant
(or one rogue app) can exhaust the Supabase rate limit for ALL tenants on ALL apps.

### The Noisy-Neighbor Pattern
```
App-N: Tenant-X makes 1000 requests/minute (legit burst OR abuse)
→ Supabase rate-limit fires for the ENTIRE account
→ ALL other tenants on ALL 29 other apps are degraded simultaneously
```
This is the classic multi-tenancy failure. The fix is not monitoring — it is ENFORCEMENT.

### Quota Policy Shape
```typescript
interface TenantQuotaPolicy {
  tenant_id: string
  plan_tier: 'free' | 'pro' | 'enterprise'  // from PART 3 schema Capability
  max_requests_per_minute: number   // default: free=60, pro=600, enterprise=unlimited
  max_concurrent_sessions: number  // default: free=3, pro=10, enterprise=unlimited
  burst_multiplier: number          // allowed temporary spike factor (default: 2×)
  burst_window_seconds: number      // window for burst (default: 10s)
  backpressure_strategy: 'reject' | 'queue' | 'throttle'  // on exceed
}
```

### Enforcement Point
**NOT** at the Supabase level (we cannot control their rate limiter per-tenant).
**YES** at the API boundary: Next.js middleware or tRPC context layer.

```
Request → Next.js middleware → quota check (in-memory or KV) → allow/reject
                                    ↓
                             [tenant_id + plan_tier] → quota bucket
                             [rate counter → Redis or in-memory]
```

**Storage options** (Open Question Q3):
- **In-memory per-app**: Zero infra overhead. Works per-process; breaks under multi-instance deploy. Acceptable for MVP.
- **Redis/Upstash**: Distributed. Survives restarts. Adds ~5-10ms per request. Recommended for >1 instance.
- **Supabase KV**: Reuses existing infra. Higher latency (~15-20ms). Not recommended for hot-path.

### Validator Design
```javascript
// validate-tenant-quota-policy.mjs (design only)
// Checks:
// 1. Each app has a quota middleware registered (middleware.ts or trpc context)
// 2. Quota policy imports from @csps/platform-quota (shared policy, not per-app copy)
// 3. Plan-tier thresholds match PART 3 PricingTier definitions (PART 3 schema anchor)
// 4. backpressure_strategy declared (reject/queue/throttle)
// Blocking: any app with no quota middleware
// Advisory: quota policy not linked to plan_tier
```

### Key Design Decision: Where Does Quota Live?
**Answer**: `libs/platform-quota/` — a new platform library, not per-app.
Reason: If each of 30 apps defines its own quota policy, you get 30 copies that drift.
The quota thresholds are directly tied to PricingTier (PART 3 schema) — they MUST share a source.
This is the platform-first optimization applied to quota enforcement.

---

## DESIGN SURFACE 3 — RLS PERFORMANCE BUDGET

### The Risk
RLS correctness is designed (P-ARCH-007 + schema-expert). The COST is unproven.
RLS policies evaluated on EVERY query → at 30 apps × many tenants × concurrent users,
RLS latency compounds. A 10ms per-query RLS overhead at low load is a 300ms overhead
when 30 apps hit the DB simultaneously.

### Budget Definition
```
Per-query RLS overhead budget: ≤5ms isolated, ≤20ms under 30-app concurrency
Total RLS overhead per user request: ≤50ms (across all queries for one HTTP request)
RLS policy evaluation cost per index hit: ≤1ms (indexed tenant_id, no join)
RLS policy evaluation cost per table scan: BLOCKED (no RLS policy may scan without index)
```

### Index Discipline (enforced rule)
Every ZModel entity with RLS MUST have:
```prisma
@@index([tenant_id])          // for equality filters (WHERE tenant_id = ?)
@@index([tenant_id, id])     // for primary-key lookups with tenant isolation
```
No entity with `@@allow("all", auth().tenantId == tenant_id)` without matching index.
This is the **structural fix** for RLS performance — index discipline at schema authoring time,
not at query-time diagnosis.

### Policy Shape Discipline
**Allowed RLS policy patterns** (O(index) complexity):
```sql
-- Pattern A: direct tenant_id equality (B-tree index → O(log N))
(tenant_id = auth()->user_metadata->>'tenantId')

-- Pattern B: role check + tenant_id (index on both)
(tenant_id = auth()->user_metadata->>'tenantId' AND role IN ('admin', 'member'))
```

**Blocked RLS policy patterns** (O(N) complexity):
```sql
-- BLOCKED: subquery without index
(id IN (SELECT id FROM users WHERE tenant_id = auth()->user_metadata->>'tenantId'))

-- BLOCKED: join-based policy
(EXISTS (SELECT 1 FROM tenant_members WHERE ...))
```

### Measurement Design
```sql
-- pg_stat_statements: track per-policy execution cost
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
WHERE query ILIKE '%rls%' OR query ILIKE '%tenant_id%'
ORDER BY mean_exec_time DESC
LIMIT 20;

-- EXPLAIN ANALYZE on representative queries:
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM "Plan" WHERE tenant_id = $1;
-- Target: "Index Scan using plan_tenant_id_idx" (not "Seq Scan")
```

### Proposed Validator Signature
```javascript
// validate-rls-perf-budget.mjs (design only)
// Checks:
// 1. Every ZModel entity with @@allow referencing tenant_id has @@index([tenant_id])
// 2. No ZModel entity with tenant_id RLS lacks the index
// 3. (Advisory) RLS policy patterns don't contain subqueries or joins
// Blocking: entity with tenant_id RLS and no tenant_id index
// Block-test: add ZModel entity with RLS but no index → exit 1
```

---

## DESIGN SURFACE 4 — N×M LOAD-TEST HARNESS (design only — NOT run this batch)

### Purpose
Prove Surfaces 1-3 BEFORE apps multiply. The load test is the governor on "apps may scale."
No app #2..#30 ships without this harness running and showing PASS on all three surfaces.

### Harness Architecture
```
k6 load test
├── Scenario A: CONCURRENT BURST
│   N apps × burst_multiplier × max_requests_per_minute
│   Asserts: no 42P05, no pool exhaustion, quota enforcement fires on violation
│
├── Scenario B: CONNECTION POOL STRESS
│   N apps × connection_limit connections simultaneously open for 5 seconds
│   Asserts: all connections succeed, latency < 200ms at N=30, fails gracefully at N=300
│
├── Scenario C: RLS LATENCY MEASUREMENT
│   Standard query patterns (SELECT, UPDATE) × M tenants
│   Asserts: per-query RLS overhead < 5ms, no seq scans on tenant_id
│
└── Scenario D: NOISY-NEIGHBOR ISOLATION
    Tenant-X at 10× quota, all other tenants at normal rate
    Asserts: Tenant-X throttled (429 or queue), other tenants unaffected (<5% latency increase)
```

### Inputs
```
N_apps: 5 (initial validation), 30 (foundation gate), 300 (stress ceiling)
M_tenants: 10 (initial), 100 (foundation gate), 1000 (stress ceiling)
concurrency_factor: 10 requests/second per tenant (realistic SaaS load)
burst_duration: 30 seconds (one burst window)
```

### PASS Bar
```
Connection pool:  zero 42P05 errors + zero P0002 errors at N=30, M=100
RLS latency:      p99 < 20ms overhead at N=30, M=100 concurrent tenants
Quota:            noisy-neighbor throttled in ≤1 burst_window (≤10s), others unaffected
Connection limit: max pool utilization < 80% at N=30, M=100
```

### FAIL Bar (automatic gate on app scale-out)
```
Connection pool:  ANY 42P05 or P0002 at N ≤ 30 → BLOCK apps #2..#30
RLS latency:      p99 > 50ms at N=30, M=100 → BLOCK + mandatory index audit
Quota:            noisy-neighbor degrades other tenants > 20% → BLOCK + quota tighten
```

### Tool Recommendation
**k6** (https://k6.io) — JavaScript-native, CI-compatible, Supabase-compatible REST client.
Open source, no additional infra required. Scripts live in `tools/load-tests/`.
Alternative: **Artillery** (simpler API, less k6 flexibility) — acceptable if k6 overkill.

---

## SCALE SIMULATION — 30→300 LENS

### At 30 apps (foundation gate)

| Resource | Capacity | 30-app load | Status |
|---------|----------|-------------|--------|
| Supabase Free connections | 60 | 30 (1/app) | ✅ fits (barely) |
| Supabase Pro connections | 200 | 30 (1/app) | ✅ comfortable |
| pgBouncer pool (Pro) | ~1000 | 30-300 burst | ✅ transaction mode handles |
| RLS evaluation cost | baseline | 30 × M queries | ⚠️ unproven, needs measurement |
| Quota enforcement | none yet | noisy-neighbor risk | 🔴 no enforcement |
| Clerk rate limit | API-level | 30 apps sharing | ⚠️ health-check only (B3-lean) |

**First bottleneck at 30 apps**: Quota/noisy-neighbor — no enforcement exists.
One rogue tenant saturates Supabase or Clerk limits for everyone.
**Guard**: Surface 2 (per-tenant quota) must ship BEFORE app #2.

**Second bottleneck at 30 apps**: RLS latency — unproven at scale.
**Guard**: Surface 3 (RLS perf budget + index discipline) must be validated BEFORE app #10.

### At 300 apps (stress ceiling)

| Resource | 300-app impact | First failure |
|---------|---------------|---------------|
| Connection pool | 300 × 1 = 300 min connections | Exceeds Supabase Pro (200) |
| pgBouncer (transaction mode) | ~300-3000 burst connections | Pool exhaustion under moderate concurrency |
| RLS evaluation | 300 × M queries × policies | CPU saturation on DB |
| Quota enforcement | 300 apps × M tenants | In-memory quota breaks (needs Redis) |
| Clerk rate limits | 300 apps × API calls | API-level throttle |

**First bottleneck at 300 apps**: Connection pool exhaustion.
300 apps × 1 = 300 minimum connections → exceeds Supabase Pro (200 direct connections).
**Guard**: Infrastructure-level PgBouncer OR Supabase Team plan (500 direct) required at ~200 apps.
This is a KNOWN CEILING. CSPS must not reach 200 apps without infrastructure upgrade.

**Second bottleneck at 300 apps**: In-memory quota breaks.
Single-process quota enforcement doesn't work across 300 app instances. Redis required.
**Guard**: Surface 2 Redis migration must happen before scaling to multi-instance deploy.

### The Invariant (30→300 is NOT linear)
30 apps with no quota + no RLS budget = manageable (manually).
300 apps with no quota + no RLS budget = unmaintainable (exponential complaints + silent data races).
**The foundation MUST be proven at 30 BEFORE building 31-300.** This is why dim 4 is non-negotiable.

---

## OPEN QUESTIONS FOR OPUS OPIA

**Q1**: Supabase tier? (Free/Pro/Team) — determines whether 30-app pool math fits today.
Governor has this context. Informs Surface 1 validator thresholds.

**Q2**: connection_limit override for read-heavy apps? 
Should `connection_limit=2` be allowed for apps with high read throughput?
Design says 1; real-world might need 2. Governor's call.

**Q3**: Quota enforcement storage — in-memory (MVP) OR Redis/Upstash (distributed)?
In-memory: zero cost, breaks at multi-instance. Redis: ~5ms overhead, survives restarts.
Recommendation: in-memory for first 5 apps; migrate to Redis before app #10.

**Q4**: RLS latency budget — 5ms/query or 10ms/query?
5ms is tight but achievable with proper indexes. 10ms gives more headroom.
Governor's measurement from PART 3 local DB run will inform this.

**Q5**: Load test timing — when does harness run?
Proposal: harness runs ONCE before app #2 (proving 5-app scenario), then gated at every
10th app (5, 10, 20, 30). Governor confirms gate schedule.

**Q6**: libs/platform-quota/ — new library authorized?
Surface 2 requires a shared quota enforcement library. Creating `libs/platform-quota/` is
a new libs/ artifact. Governor approves creation or names an existing library to extend.

---

## PROPOSED IMPLEMENTATION ORDER (after Opus OPIA)

**Phase 1 — Connection Pool Contract** (lowest risk, most immediate)
- Write `validate-connection-pool-contract.mjs`
- Scan all apps for DATABASE_URL compliance
- Block-test: port 5432 in DATABASE_URL → exit 1
- Register in verify.mjs

**Phase 2 — RLS Index Discipline** (schema-level, PART 3 links)
- Write `validate-rls-perf-budget.mjs`
- Scan ZModel for entities with RLS but no `@@index([tenant_id])`
- Block-test: entity with RLS and no index → exit 1
- Register in verify.mjs

**Phase 3 — Quota Policy Design** (requires Q3 + Q6 answers)
- Create `libs/platform-quota/` OR extend existing lib
- Write quota middleware skeleton (no logic — structure only)
- Write `validate-tenant-quota-policy.mjs`

**Phase 4 — Load Test Harness** (requires Q5 answer)
- Create `tools/load-tests/` directory
- Write k6 scenarios A-D (design only, not run)
- Document PASS/FAIL bars in `tools/load-tests/README.md`
- Gate: harness MUST pass before app #2 ships

**STOP CONDITION**: All 4 phases complete + `pnpm verify` exit_code=0 +
connection-pool-contract validator clean + rls-perf-budget validator clean → dim 4 SEALED.

---

## AUTHOR / SEAL STATUS
- Author: Sonnet S076
- Status: SANDBOX — awaiting Opus OPIA ratification
- Source: MULTI-TENANT-SCALE-READINESS-S075.md (Governor S075 vault)
- Executor-contract floor applied: every proposed validator is system-layer (model-agnostic)
- No code written. No validators changed. Spec only.
- Next: STOP → consolidated report (dim 3 SEALED + dim 4 spec) → Opus OPIA
