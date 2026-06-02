/**
 * @csps-id csps.libs.platform-quota
 * @csps-name platform-quota
 * @csps-description Shared platform quota constants + enforcement types for all 30 CSPS apps.
 *   SSoT for per-tenant limits. Q6=A: shared lib, not per-app. Q1=FREE: Supabase Free
 *   conservative numbers. Tier-upgrade obligation triggers when Free headroom is approached.
 * @csps-dna
 * core_spine: ARCH
 * @csps-enforces dim-4 Surface 2 (PER-TENANT QUOTA + NOISY-NEIGHBOR ISOLATION)
 *               SANDBOX-multi-tenant-scale-readiness-spec-S076.md §DESIGN SURFACE 2
 *
 * governing_intent: Without shared quota constants, 30 apps drift to different limits.
 *   This lib is the ONLY place where quota numbers live. Apps import, never define.
 */

export type { PlanTier, TenantQuotaPolicy, ConnectionPoolBudget, PlatformQuota } from './types.js'

export {
  // Supabase Free tier infrastructure constants
  FREE_MAX_DB_CONNECTIONS,
  FREE_MAX_POOLER_CONNECTIONS,
  PLATFORM_APP_COUNT_TARGET,
  FREE_DB_CONNECTIONS_PER_APP,
  FREE_HEADROOM_WARNING_THRESHOLD,

  // Quota definitions
  PLATFORM_QUOTAS,
  getQuota,
  isFreeHeadroomApproached,
} from './supabase-free.js'
