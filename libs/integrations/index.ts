// libs/integrations — canonical barrel export
// Consuming apps import from this file, not from deep relative paths.
// Add @csps/integrations path alias in your tsconfig.json paths:
//   "@csps/integrations": ["../../libs/integrations/index.ts"]
// This kills the 6-level relative import smell (CSEP-S014-001 RANK 2).

export { isSessionReady } from './auth'
// Jobs module
export { inngest, allFunctions } from './jobs/index'
// Email module
export { sendEmail } from './email/client'
export { welcomeEmail } from './email/templates/welcome'
export { trialExpiryEmail } from './email/templates/trial-expiry'
export { invitationEmail } from './email/templates/invitation'
export { upgradeEmail } from './email/templates/upgrade'
export { digestEmail } from './email/templates/digest'
// Security module — re-exported for convenience
export { securityHeaders } from './security/headers'
export { PaginationSchema, IdSchema, TenantScopeSchema, DateRangeSchema } from './security/validation'
export { auditLog } from './security/audit'
export { checkMembership, checkMembershipPermission, getMembershipRole, requiresTier, withSecurity } from './security/guards'
export { rateLimitUser, rateLimitAuth } from './security/rate-limit'
export { withFallback, withRetry } from './security/resilience'

export { handleClerkWebhook } from './clerk/webhook-handler'
export type { CspsDb } from './clerk/webhook-handler'
export type { ClerkWebhookEvent } from './clerk/types'
export { buildSessionClaims, mapClerkJwtRole } from './clerk/session-context'
export type { CspsSessionClaims } from './clerk/session-context'

export { createStripeCustomer, buildTenantBillingHook, NullBillingHook } from './stripe/customer-service'
export type { StripeClient } from './stripe/customer-service'

// S022 Session 3 additions
export { eraseUser } from './gdpr'
export type { ErasureReceipt, ErasureDb } from './gdpr'

// S022 Session 0 additions — shared patterns (libs/integrations/ L1 conventions)
export { createError, ERRORS } from './errors'
export type { CspsError } from './errors'
export { isProcessed, markProcessed, withIdempotency } from './webhook-idempotency'
