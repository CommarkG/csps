// @csps-dna
// core_spine: ARCH
// @csps-enforces dim-4 Surface 4 Scenario B (CONNECTION POOL STRESS)
//               SANDBOX-multi-tenant-scale-readiness-spec-S076.md §Harness Scenario B
//
// SCENARIO B: CONNECTION POOL STRESS
// Purpose: Verify all connections succeed under sustained concurrent load.
//   N apps × connection_limit connections simultaneously open for 5 seconds
//
// PASS BAR:
//   - All connections succeed (zero refused/timeout)
//   - Latency < 200ms at N=30, M=100 (foundation gate — DEFERRED)
//   - Latency < 500ms at N=5, M=10 (initial validation)
//   - Latency < 1000ms at N=1 (representative run)
//
// RUN (representative):
//   k6 run --env TARGET_URL=https://your-app.vercel.app tools/load-tests/k6/scenario-b-connection-pool-stress.js
//
// DEFERRED: N=30 (foundation gate) — see boundary-003. Free tier 60-connection limit.

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const TARGET_URL = __ENV.TARGET_URL || 'http://localhost:3000';
const N_APPS = parseInt(__ENV.N_APPS || '1');
const FREE_DB_CONNECTIONS_PER_APP = 1;
const STRESS_DURATION_SECONDS = 5;

// Scale-appropriate thresholds
const LATENCY_THRESHOLD = N_APPS <= 1 ? 1000 : N_APPS <= 5 ? 500 : 200;

export const options = {
  scenarios: {
    pool_stress: {
      executor: 'constant-vus',
      vus: N_APPS * FREE_DB_CONNECTIONS_PER_APP * 5,  // simulate multiple requests per connection
      duration: `${STRESS_DURATION_SECONDS + 10}s`,
    },
  },
  thresholds: {
    'http_req_failed': ['rate<0.001'],  // Near-zero failures (connection pool should hold)
    'http_req_duration': [`p(95)<${LATENCY_THRESHOLD}`],
    'connection_errors': ['count==0'],
  },
};

const connectionErrors = new Rate('connection_errors');

export default function() {
  // Simulate concurrent DB-touching requests
  const res = http.get(`${TARGET_URL}/api/health`, {
    headers: { 'X-Load-Test': 'scenario-b' },
    timeout: `${LATENCY_THRESHOLD}ms`,
  });

  const isConnectionError = res.status === 0 ||  // network error
    (res.body && res.body.includes('ECONNREFUSED'));
  connectionErrors.add(isConnectionError ? 1 : 0);

  check(res, {
    'connection succeeded': (r) => r.status !== 0,
    'no connection refused': () => !isConnectionError,
    [`latency < ${LATENCY_THRESHOLD}ms`]: (r) => r.timings.duration < LATENCY_THRESHOLD,
  });

  sleep(0.1);  // Minimal sleep — stress test, not rate limited
}

export function handleSummary(data) {
  const connErrors = data.metrics?.connection_errors?.values?.count ?? 0;
  const failRate = data.metrics?.http_req_failed?.values?.rate ?? 0;
  const p95 = data.metrics?.http_req_duration?.values?.['p(95)'] ?? 0;
  const pass = connErrors === 0 && failRate < 0.001 && p95 < LATENCY_THRESHOLD;

  return {
    stdout: `
════════════════════════════════════════════
  SCENARIO B — CONNECTION POOL STRESS RESULT
  Scale: N=${N_APPS} apps | threshold: ${LATENCY_THRESHOLD}ms
════════════════════════════════════════════
  Connection errors: ${connErrors} (expect 0) ${connErrors === 0 ? '✅' : '❌'}
  HTTP failure rate: ${(failRate * 100).toFixed(2)}% (expect <0.1%) ${failRate < 0.001 ? '✅' : '❌'}
  p95 latency: ${p95.toFixed(0)}ms (expect <${LATENCY_THRESHOLD}ms) ${p95 < LATENCY_THRESHOLD ? '✅' : '❌'}

  OVERALL: ${pass ? '✅ PASS' : '❌ FAIL'}
════════════════════════════════════════════
`,
  };
}
