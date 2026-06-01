/**
 * capabilities.ts — Capability slug constants (PART 3 SSoT)
 *
 * Q4 decision: TS const = SSoT for all capability slugs.
 * DB Capability table is seeded FROM these constants (not the other way around).
 * validate-capability-registry.mjs drift-validator checks DB ↔ TS parity.
 *
 * governing_intent: Type-safety at call sites prevents silent typos.
 * A slug that isn't in this const fails TypeScript compilation,
 * catching missing capabilities before they reach production.
 *
 * @csps-enforces PART3-PRODUCT-SCHEMA P-ARCH-007
 * @csps-version 1.0.0
 * @csps-session S075
 */

export const CAPABILITY = {
  // ── AI features ──────────────────────────────────────────────────────────
  /** AI consultation endpoint (limit: 5/month on free; unlimited on pro+) */
  AI_CONSULT: 'ai_consult',

  /** Multi-model routing (Opus/Sonnet/Haiku selection) */
  AI_MULTI_MODEL: 'ai_multi_model',

  // ── Collaboration ─────────────────────────────────────────────────────────
  /** Allow more than 1 member in a tenant workspace */
  MULTI_MEMBER: 'multi_member',

  /** Role-based access control (admin/member differentiation) */
  RBAC: 'rbac',

  // ── Audit & compliance ────────────────────────────────────────────────────
  /** Access to full audit event history (30d on free; 365d on paid) */
  AUDIT_HISTORY_FULL: 'audit_history_full',

  /** Export audit events to CSV/JSON */
  AUDIT_EXPORT: 'audit_export',

  // ── Reporting ─────────────────────────────────────────────────────────────
  /** Advanced analytics dashboard */
  ANALYTICS_FULL: 'analytics_full',

  /** Custom report builder */
  REPORTS_CUSTOM: 'reports_custom',

  // ── Integrations ──────────────────────────────────────────────────────────
  /** Webhook outbound events */
  WEBHOOKS: 'webhooks',

  /** API access (programmatic) */
  API_ACCESS: 'api_access',
} as const;

/** All known capability slugs (for type-safe hasCapability checks) */
export type CapabilitySlug = (typeof CAPABILITY)[keyof typeof CAPABILITY];

/** Capabilities available on the free tier (no plan required) */
export const FREE_CAPABILITIES: readonly CapabilitySlug[] = [
  CAPABILITY.AI_CONSULT, // limit: 5/month (enforced by PlanCapability.limitValue)
] as const;

/**
 * Type-safe capability check helper.
 * Actual entitlement enforcement happens at the data layer (ZenStack + RLS).
 * This is for UI/middleware pre-checks only.
 */
export function isCapabilitySlug(slug: string): slug is CapabilitySlug {
  return Object.values(CAPABILITY).includes(slug as CapabilitySlug);
}
