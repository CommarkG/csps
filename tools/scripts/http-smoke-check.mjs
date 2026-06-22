#!/usr/bin/env node
/**
 * http-smoke-check.mjs — B_PAGE_COMPLETE HTTP-200 render smoke
 * @csps-id csps.tools.scripts.http-smoke-check
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-enforces B_PAGE_COMPLETE PROTO-S087-PAGE-COMPLETE
 * @csps-prevention-class BROKEN-RENDER RUNTIME-404 HYDRATION-CRASH
 *
 * Hits all 29 static /platform/* routes and verifies HTTP 200.
 * This is the live-HTTP residual — the CI complement to validate-page-completeness.mjs.
 * Static analysis (M-47) catches dead elements; this catches runtime render failures.
 *
 * Usage:
 *   node tools/scripts/http-smoke-check.mjs                   # uses route-manifest.ts static routes
 *   SMOKE_BASE_URL=http://localhost:3000 node ...              # custom base URL
 *   SMOKE_ROUTES_OVERRIDE=/platform/journey,/platform/sia ...  # test specific routes
 *
 * Requires: dev server running at SMOKE_BASE_URL (default: http://localhost:3002)
 * Exit: 1 if any route returns non-200; 0 if all pass
 */

// @determinism-exempt: uses wall clock for request timestamps and test-run metadata only.
//   All blocking decisions are HTTP status codes from live server responses.
//   @determinism-exempt: metadata-only — ran_at/elapsed are non-blocking metadata.

const BASE_URL = process.env.SMOKE_BASE_URL || 'http://localhost:3002';
const ROUTES_OVERRIDE = process.env.SMOKE_ROUTES_OVERRIDE;

// Static platform routes — mirrors route-manifest.ts STATIC_ROUTES with nav_access !== 'dynamic'
// (route-manifest.ts is TypeScript; we duplicate the static list here for zero-dependency CLI use)
const STATIC_ROUTES = [
  '/',
  '/platform/accountability',
  '/platform/ai-behavior',
  '/platform/architecture/node-templates',
  '/platform/architecture/tier-map',
  '/platform/audits',
  '/platform/classification-training',
  '/platform/communication',
  '/platform/completion',
  '/platform/consult',
  '/platform/core-spine-creator',
  '/platform/design-intelligence',
  '/platform/developer-journey',
  '/platform/journey',
  '/platform/journey-admin',
  '/platform/journey-trunk',
  '/platform/journeys',
  '/platform/profiles',
  '/platform/profiles/ai-systems',
  '/platform/profiles/developers',
  '/platform/profiles/users',
  '/platform/rzf',
  '/platform/self-validation',
  '/platform/sia',
  '/platform/simulation',
  '/platform/user-journey',
  '/platform/voice-profiles',
  '/platform/wizard',
  '/platform/zero-friction',
];

async function checkRoute(route) {
  const url = BASE_URL + route;
  const start = Date.now();
  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'text/html' },
      signal: AbortSignal.timeout(15000), // 15s per route
      redirect: 'follow',
    });
    const elapsed = Date.now() - start;
    return { route, url, status: res.status, ok: res.status === 200, elapsed };
  } catch (err) {
    const elapsed = Date.now() - start;
    return { route, url, status: 0, ok: false, elapsed, error: err.message };
  }
}

async function main() {
  const routes = ROUTES_OVERRIDE
    ? ROUTES_OVERRIDE.split(',').map(r => r.trim()).filter(Boolean)
    : STATIC_ROUTES;

  console.log(`[http-smoke] Checking ${routes.length} routes against ${BASE_URL}`);
  console.log(`[http-smoke] Routes: ${routes.join(' ')}\n`);

  const results = [];
  for (const route of routes) {
    const result = await checkRoute(route);
    results.push(result);
    const icon = result.ok ? '✓' : '✗';
    const status = result.status === 0 ? 'ERR' : result.status;
    console.log(`  ${icon} ${status.toString().padStart(3)}  ${result.elapsed}ms  ${route}${result.error ? `  [${result.error}]` : ''}`);
  }

  const passed = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok);
  const total = results.length;

  console.log(`\n[http-smoke] ${passed}/${total} routes passed`);

  if (failed.length > 0) {
    console.error(`\n[http-smoke] FAIL — ${failed.length} route(s) did not return 200:`);
    for (const r of failed) {
      console.error(`  ✗ ${r.route}  status=${r.status}  ${r.error || ''}`);
    }
    console.error('\nFix: start dev server + check each failing route for runtime errors');
    process.exit(1);
  }

  console.log('[http-smoke] ✓ All routes return HTTP 200');
  process.exit(0);
}

main().catch(err => {
  console.error('[http-smoke] Fatal:', err.message);
  process.exit(1);
});
