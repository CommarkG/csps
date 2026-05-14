// Platform auth utilities — shared across all CSPS apps
// UX-001 (Opus Turn 28): JWT-refresh gap pattern extracted to S1
// Every CSPS app inherits this — fixes the sign-up → 403 loop for all 30 apps.

// Re-export canonical type — single source of truth in clerk/session-context.ts
export type { CspsSessionClaims } from './clerk/session-context'
import type { CspsSessionClaims } from './clerk/session-context'

/**
 * True when the session has a tenantId — meaning Clerk's JWT has been
 * refreshed after org creation. False during the ~5-min window after
 * sign-up while the webhook fires and the org is being provisioned.
 */
export function isSessionReady(claims: CspsSessionClaims | null | undefined): boolean {
  return !!claims?.tenantId
}
