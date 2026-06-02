// @csps-dna
// core_spine: ARCH
// @csps-enforces dim-4 Surface 2 + Surface 1 (connection pool math)
//               SANDBOX-multi-tenant-scale-readiness-spec-S076.md
// governing_intent: Supabase Free tier limits are CONSERVATIVE by design.
//   At 30 apps, even 2 concurrent invocations per app = 60 connections = Free limit.
//   These numbers deliberately leave headroom. When scaling past Free, use the
//   boundary-crossing protocol (boundaries-register.yaml boundary-003).

import type { PlatformQuota } from './types.js'

// ─── Supabase Free tier infrastructure limits ─────────────────────
// Source: https://supabase.com/pricing (as of 2026-06)
// Q1=FREE ratified by Opus S077: use conservative numbers.

/** Maximum direct Postgres connections on Supabase Free plan */
export const FREE_MAX_DB_CONNECTIONS = 60

/** Maximum connections through PgBouncer pooler on Supabase Free plan */
export const FREE_MAX_POOLER_CONNECTIONS = 200

/** Number of apps expected at platform scale (30-app target) */
export const PLATFORM_APP_COUNT_TARGET = 30

/**
 * Connection headroom per app at Free tier.
 * Conservative: reserve 10 for migrations/admin, 50 for apps.
 * 50 connections / 30 apps = 1.67 → floor to 1 per app.
 * This is why connection_limit=1 in DATABASE_URL is the PLATFORM STANDARD.
 */
export const FREE_DB_CONNECTIONS_PER_APP = 1

/**
 * Headroom threshold: when total registered apps × connections_per_app
 * exceeds this fraction of FREE_MAX_DB_CONNECTIONS, register tier-upgrade obligation.
 * Set at 80% to give warning before hitting hard limit.
 */
export const FREE_HEADROOM_WARNING_THRESHOLD = 0.8

// ─── Per-tier quota definitions ───────────────────────────────────

export const PLATFORM_QUOTAS: Record<string, PlatformQuota> = {
  free: {
    tier: 'free',
    description: 'Supabase Free plan — conservative limits for 30-app multi-tenant scale',
    quota: {
      plan_tier: 'free',
      max_requests_per_minute: 60,      // 1 request/second average
      max_concurrent_sessions: 3,        // solo use / small teams
      burst_multiplier: 2,               // allow 2× for up to burst_window_seconds
      burst_window_seconds: 10,          // 10-second burst window
      backpressure_strategy: 'reject',   // HTTP 429 immediately (simplest at Free)
    },
    pool: {
      max_db_connections_per_app: FREE_DB_CONNECTIONS_PER_APP,
      max_pooler_connections: Math.floor(FREE_MAX_POOLER_CONNECTIONS / PLATFORM_APP_COUNT_TARGET), // 6/app
    },
  },

  pro: {
    tier: 'pro',
    description: 'Supabase Pro plan — higher limits for active single-user/small-team use',
    quota: {
      plan_tier: 'pro',
      max_requests_per_minute: 600,     // 10 requests/second
      max_concurrent_sessions: 10,
      burst_multiplier: 3,
      burst_window_seconds: 30,
      backpressure_strategy: 'throttle',
    },
    pool: {
      max_db_connections_per_app: 3,    // Pro: 200 max_connections / 30 apps = 6, use 3 conservatively
      max_pooler_connections: 20,
    },
  },

  team: {
    tier: 'team',
    description: 'Team plan — collaborative multi-member workspace',
    quota: {
      plan_tier: 'team',
      max_requests_per_minute: 1800,    // 30 requests/second
      max_concurrent_sessions: 50,
      burst_multiplier: 5,
      burst_window_seconds: 60,
      backpressure_strategy: 'queue',
    },
    pool: {
      max_db_connections_per_app: 5,
      max_pooler_connections: 50,
    },
  },

  enterprise: {
    tier: 'enterprise',
    description: 'Enterprise — unlimited (subject to custom agreement)',
    quota: {
      plan_tier: 'enterprise',
      max_requests_per_minute: Infinity,
      max_concurrent_sessions: Infinity,
      burst_multiplier: Infinity,
      burst_window_seconds: 0,          // no window needed — unlimited
      backpressure_strategy: 'throttle',
    },
    pool: {
      max_db_connections_per_app: 10,   // still bounded by DB; enterprise negotiates
      max_pooler_connections: 100,
    },
  },
}

/**
 * Get quota for a plan tier. Falls back to 'free' if unknown tier.
 */
export function getQuota(tier: string): PlatformQuota {
  return PLATFORM_QUOTAS[tier] ?? PLATFORM_QUOTAS.free
}

/**
 * Check if the current app count × connections_per_app approaches the Free tier limit.
 * Returns true when tier-upgrade obligation should be registered.
 */
export function isFreeHeadroomApproached(appCount: number, connectionsPerApp = FREE_DB_CONNECTIONS_PER_APP): boolean {
  const totalConnections = appCount * connectionsPerApp
  return totalConnections >= FREE_MAX_DB_CONNECTIONS * FREE_HEADROOM_WARNING_THRESHOLD
}
