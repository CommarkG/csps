// libs/integrations/security/user-projections.ts
// @csps-enforces P-ARCH-031 (cross-tenant reads scoped to PUBLIC_USER_FIELDS — P-ARCH-031 wiring requirement)
// PI-025: Cross-tenant field scoping — defensive field projection for User model.
//
// AUDIT RESULT (S037 PI-025): All current User queries are self-lookups (clerkId = userId).
// No cross-tenant reads exist. This utility is created for future routes that display
// user data to other users (e.g., team member lists, admin panels).
//
// WHEN TO USE:
//   - API routes that return User records to OTHER users (not the current user)
//   - Admin endpoints that list tenant members
//   - Any public-facing user profile display
//
// DO NOT USE for session initialization (db.user.findUnique for getEnhancedDb) —
// those queries need staffRole for ZenStack RLS policy evaluation.
//
// Cross-tenant reads scoped to PUBLIC_USER_FIELDS via user-projections.ts (PI-025)

export const PUBLIC_USER_FIELDS = {
  id: true,
  displayName: true,
  tenantId: true,
} as const

export type PublicUser = {
  id: string
  displayName: string | null
  tenantId: string
}

/**
 * Strips private fields (email, staffRole, clerkId) from a full User record.
 * Use when returning user data to other users or in cross-tenant reads.
 */
export function toPublicUser(user: {
  id: string
  displayName: string | null
  tenantId: string
  [key: string]: unknown
}): PublicUser {
  return {
    id: user.id,
    displayName: user.displayName,
    tenantId: user.tenantId,
  }
}
