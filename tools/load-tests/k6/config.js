// @csps-dna
// core_spine: ARCH
// @csps-enforces dim-4 Surface 4 (N×M LOAD-TEST HARNESS)
//               SANDBOX-multi-tenant-scale-readiness-spec-S076.md §DESIGN SURFACE 4
//               libs/platform-quota/ (Q1=FREE, Q6=A — shared constants source)
//
// governing_intent: Shared k6 test configuration for all 4 scenarios.
//   Constants must match libs/platform-quota/src/supabase-free.ts values exactly.
//   k6 does not run Node.js — cannot import from libs/platform-quota directly.
//   These values are manually synced; validate-load-test-harness.mjs enforces sync.
//
// HOW TO RUN: see tools/load-tests/README.md

// ── Infrastructure limits (Supabase Free tier — Q1=FREE) ──────────
// MUST match: libs/platform-quota/src/supabase-free.ts
export const FREE_MAX_DB_CONNECTIONS = 60;
export const FREE_DB_CONNECTIONS_PER_APP = 1;
export const PLATFORM_APP_COUNT_TARGET = 30;

// ── Per-tenant quota (free tier) ──────────────────────────────────
// MUST match: libs/platform-quota/src/supabase-free.ts PLATFORM_QUOTAS.free
export const FREE_MAX_REQUESTS_PER_MINUTE = 60;   // 1 req/sec average
export const FREE_MAX_CONCURRENT_SESSIONS = 3;
export const FREE_BURST_MULTIPLIER = 2;
export const FREE_BURST_WINDOW_SECONDS = 10;

// ── Test scale inputs ─────────────────────────────────────────────
// N_APPS: number of concurrent app instances under test
// Representative run (Free-tier, this session): N=1, M=5
// Initial validation gate (pre-app-2): N=5, M=10
// Foundation gate (30-app): N=30, M=100  ← DEFERRED TO boundary-003 tier-upgrade
// Stress ceiling: N=300, M=1000           ← requires Supabase Team + Redis

export const TEST_SCALES = {
  // Free-tier representative run — can run now without tier upgrade
  representative: {
    N_apps: 1,
    M_tenants: 5,
    description: 'Free-tier representative: 1 app, 5 tenants',
    requires_tier: 'free',
  },

  // Initial validation before app #2
  initial: {
    N_apps: 5,
    M_tenants: 10,
    description: 'Initial validation: 5 apps, 10 tenants',
    requires_tier: 'pro',
  },

  // Foundation gate (DEFERRED — Free can\'t host 30 simultaneously)
  foundation: {
    N_apps: 30,
    M_tenants: 100,
    description: 'Foundation gate: 30 apps, 100 tenants — DEFERRED (boundary-003)',
    requires_tier: 'pro',
    deferred_reason: 'boundary-003: Free tier 60-connection limit; schedule Pro upgrade first',
    deferred_register: 'tools/data/boundaries-register.yaml#boundary-003',
  },

  // Stress ceiling
  stress: {
    N_apps: 300,
    M_tenants: 1000,
    description: 'Stress ceiling: 300 apps, 1000 tenants — DEFERRED (Supabase Team + Redis)',
    requires_tier: 'team',
    deferred_reason: 'Supabase Pro maxes at N=200 apps; Team plan required. Redis for quota.',
  },
};

// ── PASS bar thresholds ───────────────────────────────────────────
// From SANDBOX spec §PASS Bar:
export const PASS_THRESHOLDS = {
  // No connection pool errors (42P05 / P0002)
  pool_error_rate: 0,
  // RLS latency p99 < 20ms at N=30, M=100 (foundation gate)
  rls_latency_p99_ms: 20,
  // p99 response time at N=1 (representative run)
  http_p99_ms: 2000,
  // Failure rate < 1% (excludes intentional 429s)
  http_failure_rate: 0.01,
  // Pool utilization < 80% at foundation gate
  pool_utilization_max: 0.8,
};
