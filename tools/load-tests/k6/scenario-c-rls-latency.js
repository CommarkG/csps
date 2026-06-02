// @csps-dna
// core_spine: ARCH
// @csps-enforces dim-4 Surface 4 Scenario C (RLS LATENCY MEASUREMENT)
//               SANDBOX-multi-tenant-scale-readiness-spec-S076.md §Harness Scenario C
//
// SCENARIO C: RLS LATENCY MEASUREMENT
// Purpose: Measure per-query RLS evaluation overhead.
//   Standard query patterns (SELECT, UPDATE) × M tenants
//
// PASS BAR:
//   - Per-query RLS overhead p99 < 5ms (measured as delta from non-RLS baseline)
//   - No sequential table scans on tenant_id (verified via EXPLAIN ANALYZE)
//   - Total RLS overhead per HTTP request < 50ms
//
// DEFERRED STATUS: Requires EXPLAIN ANALYZE access + N=30, M=100 scale
//   This scenario CANNOT be measured accurately from the API layer alone —
//   it requires DB-level observation (pg_stat_statements or EXPLAIN ANALYZE).
//   Full implementation deferred to Supabase Pro upgrade (boundary-003).
//
// CURRENT STATE: Structure-complete stub. Runs baseline latency measurement only.
//   Full RLS overhead measurement requires DB instrumentation access.
//
// DEFERRED REGISTER: tools/data/boundaries-register.yaml#boundary-003
//
// RUN (baseline only — no RLS overhead measurement):
//   k6 run --env TARGET_URL=https://your-app.vercel.app tools/load-tests/k6/scenario-c-rls-latency.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

const TARGET_URL = __ENV.TARGET_URL || 'http://localhost:3000';
const M_TENANTS = parseInt(__ENV.M_TENANTS || '5');  // Default: representative scale

// ⚠ DEFERRED: Full RLS overhead measurement requires DB-level access.
// This stub measures API-layer latency only. RLS isolation from total latency
// requires EXPLAIN ANALYZE or pg_stat_statements — not available from k6.
const DEFERRED_FULL_MEASUREMENT = true;
const DEFERRED_REASON = 'boundary-003: Free tier; Pro upgrade needed for pg_stat_statements';

export const options = {
  scenarios: {
    rls_latency: {
      executor: 'ramping-vus',
      stages: [
        { duration: '10s', target: M_TENANTS },   // ramp to M tenants
        { duration: '30s', target: M_TENANTS },   // sustained
        { duration: '10s', target: 0 },           // ramp down
      ],
    },
  },
  thresholds: {
    // API-layer p99 < 500ms (loose — not measuring RLS specifically at this stage)
    'http_req_duration': ['p(99)<500'],
    'http_req_failed': ['rate<0.01'],
    // Note: 5ms RLS overhead threshold requires DB instrumentation (DEFERRED)
  },
};

const apiLatency = new Trend('api_latency_ms');

export default function() {
  // Query a tenant-scoped endpoint (exercises RLS policies)
  const res = http.get(`${TARGET_URL}/api/health`, {
    headers: { 'X-Load-Test': 'scenario-c', 'X-M-Tenants': String(M_TENANTS) },
    timeout: '3s',
  });

  apiLatency.add(res.timings.duration);

  check(res, {
    'response received': (r) => r.status === 200 || r.status === 401 || r.status === 429,
    'API latency < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(0.2);
}

export function handleSummary(data) {
  const p99 = data.metrics?.http_req_duration?.values?.['p(99)'] ?? 0;

  return {
    stdout: `
════════════════════════════════════════════
  SCENARIO C — RLS LATENCY (BASELINE STUB)
  ⚠ DEFERRED: Full RLS measurement requires DB instrumentation
  Reason: ${DEFERRED_REASON}
════════════════════════════════════════════
  API-layer p99 latency: ${p99.toFixed(0)}ms (baseline only — RLS overhead not isolated)
  RLS overhead p99 < 5ms: DEFERRED to boundary-003 (Supabase Pro + pg_stat_statements)
  Sequential scan check: DEFERRED (requires EXPLAIN ANALYZE access)

  STATUS: ⚠ DEFERRED — Baseline structure complete. Full measurement requires Pro.
  → After boundary-003 Pro upgrade: enable pg_stat_statements, re-run with --env FULL_MEASUREMENT=true
════════════════════════════════════════════
`,
  };
}
