---
id: csps.tools.load-tests
name: load-tests
description: "k6 N×M load-test harness for dim-4 multi-tenant scale-readiness. 4 scenarios (A-D). Representative run at Free-tier scale; full 30-app gate deferred to boundary-003 Pro upgrade."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: topic_plan_instance
links:
  - docs/plan/_handoff/VAULT/sandbox-specs/SANDBOX-multi-tenant-scale-readiness-spec-S076.md
  - libs/platform-quota/src/supabase-free.ts
  - tools/data/boundaries-register.yaml
tags:
  - domain:architecture
  - type:reference
  - audience:developer
  - maturity:stable
---

# CSPS k6 Load-Test Harness

**dim-4 Surface 4 — N×M Load-Test Harness**

## Prerequisites

Install k6: https://k6.io/docs/get-started/installation/
```bash
# macOS
brew install k6
# Windows
choco install k6
# or: winget install k6 --source winget
```

## Governor Sequence (representative run for OPIA)

```bash
# 1. Representative run — Scenario A (Free-tier, 1 app)
k6 run \
  --env TARGET_URL=https://your-app.vercel.app \
  tools/load-tests/k6/scenario-a-concurrent-burst.js

# 2. Paste OVERALL: ✅ PASS output to Opus → dim-4 Surface 4 OPIA → foundation SEAL
```

## Scenarios

| Scenario | Name | Status | Scale |
|---------|------|--------|-------|
| A | Concurrent Burst | ✅ READY | N=1 (rep) → N=5 (initial) → N=30 (DEFERRED) |
| B | Connection Pool Stress | ✅ READY | N=1 (rep) → N=5 → N=30 (DEFERRED) |
| C | RLS Latency | ⚠ DEFERRED | Requires pg_stat_statements (Pro+) |
| D | Noisy-Neighbor Isolation | ✅ READY (needs quota middleware active) | M=5 (rep) |

### Scenario A — Representative Run (OPIA gate)
```bash
k6 run --env TARGET_URL=https://your-app.vercel.app \
  tools/load-tests/k6/scenario-a-concurrent-burst.js
```

### Scenario B — Connection Pool Stress
```bash
k6 run --env TARGET_URL=https://your-app.vercel.app \
  tools/load-tests/k6/scenario-b-connection-pool-stress.js
```

### Scenario C — RLS Latency (DEFERRED)
Requires Supabase Pro + `pg_stat_statements` enabled.
Run after boundary-003 tier upgrade.
```bash
k6 run --env TARGET_URL=https://your-app.vercel.app \
  tools/load-tests/k6/scenario-c-rls-latency.js
```

### Scenario D — Noisy-Neighbor Isolation
Requires quota middleware active (libs/platform-quota Surface 2).
```bash
k6 run \
  --env TARGET_URL=https://your-app.vercel.app \
  --env NOISY_TENANT_ID=<real-tenant-uuid> \
  tools/load-tests/k6/scenario-d-noisy-neighbor.js
```

## Scale Inputs (from config.js)

| Scale | N apps | M tenants | Status | Requires |
|-------|--------|-----------|--------|---------|
| representative | 1 | 5 | ✅ Available now (Free) | — |
| initial | 5 | 10 | 🔶 Available (Pro preferred) | Supabase Pro |
| **foundation gate** | **30** | **100** | **⏳ DEFERRED** | **boundary-003 Pro upgrade** |
| stress ceiling | 300 | 1000 | 🔴 Future | Supabase Team + Redis |

## PASS Bar

| Check | Threshold | Scenario |
|-------|-----------|---------|
| Pool errors (42P05/P0002) | 0 | A, B |
| HTTP failure rate | < 1% | A, B, D |
| p99 latency (representative) | < 2000ms | A |
| p95 latency (pool stress) | < 1000ms at N=1 | B |
| Noisy tenant throttled | 429 within 10s | D |
| Normal tenant degradation | < 5% | D |

## Deferred Items (boundary-003)

The full 30-app foundation gate (N=30, M=100) is deferred because:
- Supabase Free tier: max 60 connections; 30 apps × 1 = 30 = 50% at steady state
- Under burst (2× multiplier): 30 × 2 = 60 = 100% of limit → cannot safely run full gate
- Register: `tools/data/boundaries-register.yaml#boundary-003`

**When to run N=30 gate**: After boundary-003 triggers (≥48 apps × 1 conn = 80% headroom) and Supabase Pro upgrade is scheduled.

## After Passing OPIA

dim-4 SEAL = Foundation complete → apps unlock (app #2..#30 may begin).
