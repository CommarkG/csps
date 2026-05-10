// libs/integrations — canonical barrel export
// Consuming apps import from this file, not from deep relative paths.
// Add @csps/integrations path alias in your tsconfig.json paths:
//   "@csps/integrations": ["../../libs/integrations/index.ts"]
// This kills the 6-level relative import smell (CSEP-S014-001 RANK 2).

export { handleClerkWebhook } from './clerk/webhook-handler'
export type { CspsDb } from './clerk/webhook-handler'
export type { ClerkWebhookEvent } from './clerk/types'
export { buildSessionClaims } from './clerk/session-context'
export type { CspsSessionClaims } from './clerk/session-context'

export { createStripeCustomer, buildTenantBillingHook, NullBillingHook } from './stripe/customer-service'
export type { StripeClient } from './stripe/customer-service'

// S022 Session 3 additions
export { eraseUser } from './gdpr'
export type { ErasureReceipt, ErasureDb } from './gdpr'
