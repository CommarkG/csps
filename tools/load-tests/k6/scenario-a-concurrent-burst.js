// @csps-dna
// core_spine: ARCH
// @csps-enforces dim-4 Surface 4 Scenario A (CONCURRENT BURST)
//               SANDBOX-multi-tenant-scale-readiness-spec-S076.md §Harness Scenario A
//
// SCENARIO A: CONCURRENT BURST
// Purpose: Verify no connection pool exhaustion (42P05/P0002) under burst load.
//   N apps × burst_multiplier × max_requests_per_minute
//
// PASS BAR:
//   - Zero 42P05 (prepared statement conflict) errors
//   - Zero P0002 (connection refused) errors
//   - HTTP failure rate < 1% (429 quota responses ARE expected, not failures)
//   - p99 response time < 2000ms
//
// S084 B.2: TARGET updated to /api/db-health (uncached real DB hit — gap_DIM4 validity).
// /api/db-health opens a new Supabase connection every call + surfaces pool errors in body.
// Do NOT target the root / or cached GET /api/journey-admin — trivially-true pool_errors=0.
//
// RUN (representative — Free tier, 1 app):
//   k6 run --env TARGET_URL=https://your-app.vercel.app tools/load-tests/k6/scenario-a-concurrent-burst.js
//
// RUN (initial validation — N=5 apps, needs Pro):
//   k6 run --env TARGET_URL=https://your-app.vercel.app --env N_APPS=5 tools/load-tests/k6/scenario-a-concurrent-burst.js
//
// DEFERRED: N=30 (foundation gate) — see boundary-003 in tools/data/boundaries-register.yaml
//   Supabase Free (60 connections) cannot support 30 concurrent apps under burst.
//   Schedule Supabase Pro before running N=30 gate.

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Target base URL (required via env — do NOT include /api/db-health suffix here)
const TARGET_URL = __ENV.TARGET_URL || 'http://localhost:3000';
// S084 B.2: /api/db-health is the uncached real-DB target for pool-exhaustion detection
const DB_HEALTH_PATH = '/api/db-health';
// Scale inputs — default to representative (Free-tier) run
const N_APPS = parseInt(__ENV.N_APPS || '1');
const BURST_MULTIPLIER = 2;
const BURST_WINDOW_SECONDS = 10;
const FREE_MAX_REQUESTS_PER_MINUTE = 60;

export const options = {
  scenarios: {
    concurrent_burst: {
      executor: 'ramping-vus',
      stages: [
        { duration: '10s', target: N_APPS * 2 },                                      // ramp up
        { duration: `${BURST_WINDOW_SECONDS}s`, target: N_APPS * BURST_MULTIPLIER * 3 }, // burst
        { duration: '10s', target: N_APPS },                                            // sustained
        { duration: '10s', target: 0 },                                                // ramp down
      ],
    },
  },
  thresholds: {
    // No pool exhaustion errors — ANY 42P05/P0002 = FAIL
    'pool_errors': ['rate==0'],
    // HTTP failure rate < 1% (429 quota responses counted separately, not as failures)
    'http_req_failed': ['rate<0.01'],
    // p99 latency < 2s (generous for representative run)
    'http_req_duration': ['p(99)<2000'],
  },
};

const poolErrors = new Rate('pool_errors');
const quotaRejections = new Rate('quota_rejections');
const requestDuration = new Trend('request_duration');

export default function() {
  // S084 B.2: target /api/db-health — uncached real Supabase connection every call
  const res = http.get(`${TARGET_URL}${DB_HEALTH_PATH}`, {
    headers: { 'X-Load-Test': 'scenario-a', 'X-N-Apps': String(N_APPS) },
    timeout: '5s',
  });

  requestDuration.add(res.timings.duration);

  // Check for connection pool errors (42P05 = prepared statement conflict, P0002 = connection refused)
  const isPoolError = res.body && (
    res.body.includes('42P05') ||
    res.body.includes('P0002') ||
    res.body.includes('prepared statement') ||
    res.body.includes('pool exhaustion')
  );
  poolErrors.add(isPoolError ? 1 : 0);

  // Track quota rejections (429 = quota working correctly, not a failure)
  quotaRejections.add(res.status === 429 ? 1 : 0);

  check(res, {
    'no pool exhaustion (42P05/P0002)': () => !isPoolError,
    // 200=ok, 503=db-error-surfaced (correct behavior), 429=quota (not a failure)
    'response received (200 or 503 or 429)': (r) => r.status === 200 || r.status === 503 || r.status === 429,
    'latency under 2s': (r) => r.timings.duration < 2000,
  });

  // Rate limit: stay within Free-tier quota (1 req/sec)
  sleep(60 / FREE_MAX_REQUESTS_PER_MINUTE);
}

export function handleSummary(data) {
  const poolErrCount = data.metrics?.pool_errors?.values?.count ?? 0;
  const failRate = data.metrics?.http_req_failed?.values?.rate ?? 0;
  const p99 = data.metrics?.http_req_duration?.values?.['p(99)'] ?? 0;

  const pass = poolErrCount === 0 && failRate < 0.01 && p99 < 2000;

  return {
    stdout: `
════════════════════════════════════════════
  SCENARIO A — CONCURRENT BURST RESULT
  Scale: N=${N_APPS} apps | Free-tier representative
════════════════════════════════════════════
  Pool errors (42P05/P0002): ${poolErrCount} (expect 0) ${poolErrCount === 0 ? '✅' : '❌'}
  HTTP failure rate: ${(failRate * 100).toFixed(2)}% (expect <1%) ${failRate < 0.01 ? '✅' : '❌'}
  p99 latency: ${p99.toFixed(0)}ms (expect <2000ms) ${p99 < 2000 ? '✅' : '❌'}

  OVERALL: ${pass ? '✅ PASS' : '❌ FAIL'}
  ${pass ? '→ Paste this output to Opus for dim-4 Surface 4 OPIA.' : '→ Diagnose failures above before OPIA.'}
════════════════════════════════════════════
`,
  };
}
