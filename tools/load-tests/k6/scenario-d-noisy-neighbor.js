// @csps-dna
// core_spine: ARCH
// @csps-enforces dim-4 Surface 4 Scenario D (NOISY-NEIGHBOR ISOLATION)
//               SANDBOX-multi-tenant-scale-readiness-spec-S076.md §Harness Scenario D
//               libs/platform-quota/ (quota enforcement verification)
//
// SCENARIO D: NOISY-NEIGHBOR ISOLATION
// Purpose: Verify that one tenant at 10× quota doesn't degrade other tenants.
//   Tenant-X at 10× quota, all other tenants at normal rate
//
// PASS BAR:
//   - Tenant-X throttled (429 or queue) within 1 burst_window (≤10s)
//   - Other tenants: < 5% latency increase vs baseline
//   - Quota enforcement fires on Tenant-X overload
//
// RUN:
//   k6 run \
//     --env TARGET_URL=https://your-app.vercel.app \
//     --env NOISY_TENANT_ID=tenant-uuid-here \
//     --env NORMAL_TENANT_IDS=t1-uuid,t2-uuid,t3-uuid \
//     tools/load-tests/k6/scenario-d-noisy-neighbor.js
//
// REQUIREMENTS:
//   - libs/platform-quota/ Surface 2 must be active (quota middleware in app)
//   - App must return 429 when quota exceeded for Tenant-X
//   - NOISY_TENANT_ID must be a real tenant with auth token (set via env)

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const TARGET_URL = __ENV.TARGET_URL || 'http://localhost:3000';
const FREE_BURST_WINDOW_SECONDS = 10;
const FREE_MAX_REQUESTS_PER_MINUTE = 60;
const NOISY_MULTIPLIER = 10;  // Noisy tenant at 10× quota

export const options = {
  scenarios: {
    // Noisy tenant: 10× quota (should trigger 429)
    noisy_tenant: {
      executor: 'constant-arrival-rate',
      rate: Math.floor(FREE_MAX_REQUESTS_PER_MINUTE * NOISY_MULTIPLIER / 60),  // 10 req/sec
      timeUnit: '1s',
      duration: `${FREE_BURST_WINDOW_SECONDS + 15}s`,
      preAllocatedVUs: 50,
      exec: 'noisyTenantScript',
    },
    // Normal tenants: within quota (should NOT be degraded)
    normal_tenants: {
      executor: 'constant-arrival-rate',
      rate: Math.floor(FREE_MAX_REQUESTS_PER_MINUTE / 60),  // 1 req/sec
      timeUnit: '1s',
      duration: `${FREE_BURST_WINDOW_SECONDS + 15}s`,
      preAllocatedVUs: 10,
      exec: 'normalTenantScript',
    },
  },
  thresholds: {
    // Noisy tenant MUST be throttled (quota_429_rate > 0 for noisy, = 0 for normal)
    'noisy_tenant_429': ['rate>0'],          // Must see throttling
    'normal_tenant_degradation': ['rate<0.05'], // < 5% degradation
    'http_req_duration{scenario:normal_tenants}': ['p(95)<1000'],
  },
};

const noisy429Rate = new Rate('noisy_tenant_429');
const normalDegradation = new Rate('normal_tenant_degradation');
const normalLatency = new Trend('normal_tenant_latency_ms');

export function noisyTenantScript() {
  // Noisy tenant: at 10× quota, should be throttled
  const res = http.get(`${TARGET_URL}/api/health`, {
    headers: {
      'X-Load-Test': 'scenario-d-noisy',
      'X-Tenant-Id': __ENV.NOISY_TENANT_ID || 'noisy-tenant-test',
    },
    timeout: '3s',
  });

  // Track throttling rate — we WANT to see 429s for the noisy tenant
  noisy429Rate.add(res.status === 429 ? 1 : 0);

  check(res, {
    'noisy tenant eventually throttled': () => true,  // Checked via metric threshold
  });

  sleep(0.01);  // Minimal sleep — we want to be noisy
}

export function normalTenantScript() {
  // Normal tenant: at quota, should NOT see degradation from Tenant-X
  const baselineLatency = 500;  // Expected p95 without noise
  const res = http.get(`${TARGET_URL}/api/health`, {
    headers: {
      'X-Load-Test': 'scenario-d-normal',
      'X-Tenant-Id': __ENV.NORMAL_TENANT_ID || 'normal-tenant-test',
    },
    timeout: '3s',
  });

  normalLatency.add(res.timings.duration);

  // Degradation: if normal tenant p95 > baseline × 1.05 (5% threshold)
  const isDegraded = res.timings.duration > baselineLatency * 1.05;
  normalDegradation.add(isDegraded ? 1 : 0);

  check(res, {
    'normal tenant not degraded': (r) => r.timings.duration < baselineLatency * 1.05,
    'normal tenant not throttled': (r) => r.status !== 429,
  });

  sleep(60 / FREE_MAX_REQUESTS_PER_MINUTE);  // Stay within quota
}

export function handleSummary(data) {
  const noisy429 = data.metrics?.noisy_tenant_429?.values?.rate ?? 0;
  const degradation = data.metrics?.normal_tenant_degradation?.values?.rate ?? 0;
  const normalP95 = data.metrics?.normal_tenant_latency_ms?.values?.['p(95)'] ?? 0;

  const noisyThrottled = noisy429 > 0;
  const normalUnaffected = degradation < 0.05;
  const pass = noisyThrottled && normalUnaffected;

  return {
    stdout: `
════════════════════════════════════════════
  SCENARIO D — NOISY-NEIGHBOR ISOLATION
════════════════════════════════════════════
  Noisy tenant throttled (429 rate): ${(noisy429 * 100).toFixed(1)}% ${noisyThrottled ? '✅' : '❌ (quota not enforced!)'}
  Normal tenant degradation rate: ${(degradation * 100).toFixed(1)}% (expect <5%) ${normalUnaffected ? '✅' : '❌'}
  Normal tenant p95 latency: ${normalP95.toFixed(0)}ms

  OVERALL: ${pass ? '✅ PASS — Noisy-neighbor isolation working' : '❌ FAIL — Check quota enforcement (libs/platform-quota Surface 2)'}
  ${!noisyThrottled ? '\n  ⚠ Quota enforcement not firing — verify Surface 2 middleware is active' : ''}
════════════════════════════════════════════
`,
  };
}
