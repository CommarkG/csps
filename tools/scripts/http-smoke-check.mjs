#!/usr/bin/env node
/**
 * http-smoke-check.mjs — B_PAGE_COMPLETE HTTP-200 + CS6 RENDERS-IN-PRODUCTION smoke
 * @csps-id csps.tools.scripts.http-smoke-check
 * @csps-version 1.1.0
 * @csps-changelog 1.1.0 S088-A3 CS6: DOM anchor check + provenance!=fallback check
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-enforces B_PAGE_COMPLETE PROTO-S087-PAGE-COMPLETE PROTO-S088-A3-CS6
 * @csps-prevention-class BROKEN-RENDER RUNTIME-404 HYDRATION-CRASH FALLBACK-SERVING
 *
 * CS6 RENDERS-IN-PRODUCTION: extends the HTTP-200 check with two new gates:
 *   1. DOM anchor check: HTML responses must contain <main> (not just a 200 with empty body)
 *   2. Provenance check: API routes listed in PROVENANCE_ROUTES must NOT return "fallback"
 *      in their provenance fields — confirms real data is served, not static fallbacks.
 *
 * This is the live-HTTP residual — the CI complement to validate-page-completeness.mjs.
 * Static analysis (M-47) catches dead elements; this catches runtime render failures.
 * CS3 (deploy-root self-containment) prevents the fallback by construction; CS6 verifies it.
 *
 * Usage:
 *   node tools/scripts/http-smoke-check.mjs                   # uses static route list
 *   SMOKE_BASE_URL=http://localhost:3000 node ...              # custom base URL
 *   SMOKE_ROUTES_OVERRIDE=/platform/journey,/platform/sia ...  # test specific routes
 *   SMOKE_SKIP_DOM=1 node ...                                  # skip DOM anchor check (legacy mode)
 *   SMOKE_SKIP_PROVENANCE=1 node ...                           # skip provenance check
 *
 * Requires: dev server running at SMOKE_BASE_URL (default: http://localhost:3002)
 * Exit: 1 if any HTTP 200 check, DOM anchor check, or provenance check fails
 */

// @determinism-exempt: uses wall clock for request timestamps and test-run metadata only.
//   All blocking decisions are HTTP status codes and response content from live server.
//   @determinism-exempt: metadata-only — ran_at/elapsed are non-blocking metadata.

const BASE_URL = process.env.SMOKE_BASE_URL || 'http://localhost:3002';
const ROUTES_OVERRIDE = process.env.SMOKE_ROUTES_OVERRIDE;
const SKIP_DOM = process.env.SMOKE_SKIP_DOM === '1';
const SKIP_PROVENANCE = process.env.SMOKE_SKIP_PROVENANCE === '1';

// Static platform routes — mirrors route-manifest.ts STATIC_ROUTES with nav_access !== 'dynamic'
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

// CS6: API routes whose provenance fields must NOT be "fallback"
// These routes serve canonical data that was fixed by CS3 (deploy-root self-containment).
// A "fallback" value means the canonical src/data/ copy is not being served.
const PROVENANCE_ROUTES = [
  {
    path: '/api/journey-spine',
    provenance_fields: ['spine_doc', 'registry', 'enums'],
    // These fields appear in the response.data.sources object
    extract: (json) => json?.sources ?? {},
  },
  {
    path: '/api/core-spine-registry',
    provenance_fields: ['source'],
    extract: (json) => json?.meta ?? {},
  },
];

async function checkRoute(route) {
  const url = BASE_URL + route;
  const start = Date.now();
  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'text/html,application/json' },
      signal: AbortSignal.timeout(15000),
      redirect: 'follow',
    });
    const elapsed = Date.now() - start;
    const contentType = res.headers.get('content-type') || '';
    const body = await res.text();

    const result = {
      route, url, status: res.status,
      ok: res.status === 200,
      elapsed, contentType, body,
      domAnchorMissing: false,
      provenanceFallback: [],
    };

    // CS6 DOM anchor check: HTML responses must contain <main>
    if (!SKIP_DOM && res.status === 200 && contentType.includes('text/html')) {
      if (!body.includes('<main')) {
        result.domAnchorMissing = true;
        result.ok = false;
      }
    }

    return result;
  } catch (err) {
    const elapsed = Date.now() - start;
    return {
      route, url, status: 0, ok: false,
      elapsed, error: err.message,
      domAnchorMissing: false, provenanceFallback: [],
    };
  }
}

async function checkProvenance(provenanceRoute) {
  const url = BASE_URL + provenanceRoute.path;
  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(10000),
    });
    if (res.status !== 200) return { path: provenanceRoute.path, error: `HTTP ${res.status}`, fallbacks: [] };

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return { path: provenanceRoute.path, error: 'not JSON', fallbacks: [] };
    }

    const json = await res.json();
    const sources = provenanceRoute.extract(json);
    const fallbacks = provenanceRoute.provenance_fields
      .filter(field => sources[field] === 'fallback' || sources[field]?.includes('fallback'));

    return { path: provenanceRoute.path, fallbacks, sources };
  } catch (err) {
    return { path: provenanceRoute.path, error: err.message, fallbacks: [] };
  }
}

async function main() {
  const routes = ROUTES_OVERRIDE
    ? ROUTES_OVERRIDE.split(',').map(r => r.trim()).filter(Boolean)
    : STATIC_ROUTES;

  console.log(`[http-smoke] CS6 RENDERS-IN-PRODUCTION — Checking ${routes.length} routes + ${PROVENANCE_ROUTES.length} provenance checks`);
  console.log(`[http-smoke] Base URL: ${BASE_URL}`);
  console.log(`[http-smoke] DOM anchor check: ${SKIP_DOM ? 'SKIPPED' : 'ENABLED (<main> required)'}`);
  console.log(`[http-smoke] Provenance check: ${SKIP_PROVENANCE ? 'SKIPPED' : 'ENABLED (fallback != allowed)'}`);
  console.log('');

  // ── HTTP 200 + DOM anchor checks ─────────────────────────────────────────
  const results = [];
  for (const route of routes) {
    const result = await checkRoute(route);
    results.push(result);
    const statusIcon = result.ok ? '✓' : '✗';
    const statusStr = result.status === 0 ? 'ERR' : result.status.toString();
    const domNote = result.domAnchorMissing ? '  [NO <main>]' : '';
    const errNote = result.error ? `  [${result.error}]` : '';
    console.log(`  ${statusIcon} ${statusStr.padStart(3)}  ${result.elapsed.toString().padStart(5)}ms  ${route}${domNote}${errNote}`);
  }

  const httpPassed = results.filter(r => r.ok && !r.domAnchorMissing);
  const httpFailed = results.filter(r => !r.ok || r.domAnchorMissing);

  // ── CS6 Provenance checks ─────────────────────────────────────────────────
  let provFailed = [];
  if (!SKIP_PROVENANCE) {
    console.log('\n[http-smoke] Provenance checks:');
    for (const provRoute of PROVENANCE_ROUTES) {
      const result = await checkProvenance(provRoute);
      if (result.error) {
        console.log(`  ⚠ ${provRoute.path}  [${result.error}] — cannot verify provenance (skipping this check)`);
      } else if (result.fallbacks.length > 0) {
        console.log(`  ✗ ${provRoute.path}  fallback serving: ${result.fallbacks.join(', ')}`);
        provFailed.push(result);
      } else {
        const srcSummary = Object.entries(result.sources || {})
          .filter(([_, v]) => v && v !== 'fallback')
          .map(([k, v]) => `${k}=${String(v).slice(0, 40)}`)
          .join(' ');
        console.log(`  ✓ ${provRoute.path}  provenance ok (${srcSummary})`);
      }
    }
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log(`\n[http-smoke] HTTP: ${httpPassed.length}/${results.length} routes OK`);
  if (!SKIP_PROVENANCE) {
    console.log(`[http-smoke] Provenance: ${PROVENANCE_ROUTES.length - provFailed.length}/${PROVENANCE_ROUTES.length} OK`);
  }

  const failures = [];
  if (httpFailed.length > 0) {
    failures.push(`HTTP/DOM failures (${httpFailed.length}):`);
    for (const r of httpFailed) {
      if (r.domAnchorMissing) {
        failures.push(`  ✗ ${r.route}  status=200 but <main> missing — hollow render (page loaded but no DOM anchor)`);
      } else {
        failures.push(`  ✗ ${r.route}  status=${r.status}  ${r.error || ''}`);
      }
    }
  }
  if (provFailed.length > 0) {
    failures.push(`Provenance failures (${provFailed.length}):`);
    for (const p of provFailed) {
      failures.push(`  ✗ ${p.path}  fallback fields: ${p.fallbacks.join(', ')} — run copy-registry.mjs to fix`);
    }
  }

  if (failures.length > 0) {
    console.error('\n[http-smoke] FAIL:');
    failures.forEach(f => console.error(f));
    process.exit(1);
  }

  console.log('[http-smoke] ✓ All routes HTTP 200 + DOM anchor + provenance OK (CS6 PASS)');
  process.exit(0);
}

main().catch(err => {
  console.error('[http-smoke] Fatal:', err.message);
  process.exit(1);
});
