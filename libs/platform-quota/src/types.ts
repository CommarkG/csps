// @csps-dna
// core_spine: ARCH
// @csps-enforces dim-4 Surface 2 (PER-TENANT QUOTA + NOISY-NEIGHBOR ISOLATION)
//               SANDBOX-multi-tenant-scale-readiness-spec-S076.md §DESIGN SURFACE 2
// governing_intent: One canonical quota type shared by all 30 apps.
//   No per-app quota definitions. If quotas drift per-app, multi-tenancy degrades.

/**
 * Tier identifiers matching PART 3 schema Plan.slug values.
 * Must stay in sync with libs/policies/seed/seed-plans.ts slugs.
 */
export type PlanTier = 'free' | 'pro' | 'team' | 'enterprise'

/**
 * Per-tenant quota policy — imported from this lib by every app.
 * Apps do NOT define their own quotas.
 */
export interface TenantQuotaPolicy {
  plan_tier: PlanTier
  /** Max API requests per minute per tenant */
  max_requests_per_minute: number
  /** Max concurrent active sessions per tenant */
  max_concurrent_sessions: number
  /** Burst multiplier: tenant may temporarily exceed limit by this factor */
  burst_multiplier: number
  /** Duration window for burst allowance (seconds) */
  burst_window_seconds: number
  /**
   * Backpressure strategy when quota is exceeded.
   * - reject: HTTP 429 immediately
   * - throttle: slow down responses proportionally
   * - queue: defer up to burst_window_seconds then reject
   */
  backpressure_strategy: 'reject' | 'throttle' | 'queue'
}

/**
 * Connection pool budget per plan tier.
 * Governs how many DB connections one tenant's app instances may hold.
 * Total must stay under FREE_TIER.max_db_connections (60 on Supabase Free).
 */
export interface ConnectionPoolBudget {
  /** Max Postgres connections this tenant's requests may hold simultaneously */
  max_db_connections_per_app: number
  /** Supabase PgBouncer pooler connections limit for this tier */
  max_pooler_connections: number
}

/**
 * Full platform quota definition for a given tier.
 */
export interface PlatformQuota {
  tier: PlanTier
  quota: TenantQuotaPolicy
  pool: ConnectionPoolBudget
  /** Narrative description for humans */
  description: string
}
