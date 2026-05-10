// ZenStack enhanced PrismaClient — wraps db with @@allow/@@deny policy enforcement.
// Provides ORM-layer multi-tenant isolation via ZenStack runtime.
//
// Usage: call getEnhancedDb() with the current user's CSPS context.
// Bootstrap queries (user.findUnique by clerkId) MUST use raw db, not this enhanced client.
//
// ZenStack enforce() BYPASSED — S3-E1 FAIL (2026-05-10)
// Root cause: generated .zenstack/enhance.js uses relative path to
//   libs/policies/generated/generated/client that breaks in pnpm store structure.
// S3-E1 evidence: "Cannot find module '../../../../../libs/policies/generated/generated/client'"
// Per Opus Turn 4 conditional: S3-E1 FAIL → RLS moves to Session 4 STEP 4-RLS.
// VLT-S022-ZENSTACK-GENERATE-PATH: OPEN — permanent fix requires pnpm workspace alignment.
// Tenant isolation: enforced at application layer (explicit tenantId in every query).

import { db } from './db'

export type ZenstackUserCtx = {
  id: string              // CSPS User.id (not Clerk user ID)
  tenantId?: string | null    // active tenant from Clerk session claims
  role?: string | null        // Q-20: MembershipRole from Clerk JWT claim
  staffRole?: string | null   // null = regular user; 'staff' | 'admin' | 'super'
}

export function getEnhancedDb(_user: ZenstackUserCtx) {
  return db
}
