// ZenStack enhanced PrismaClient — wraps db with @@allow/@@deny policy enforcement.
// Provides ORM-layer multi-tenant isolation via ZenStack runtime.
//
// Usage: call getEnhancedDb() with the current user's CSPS context.
// The enhanced client automatically enforces @@allow rules from libs/policies/schema.zmodel.
// Bootstrap queries (user.findUnique by clerkId) MUST use raw db, not this enhanced client.
//
// VLT-S017-ENHANCE resolved: ZenStack @@allow policies now enforced at runtime.

import { enhance } from '@zenstackhq/runtime'
import { db } from './db'

export type ZenstackUserCtx = {
  id: string            // CSPS User.id (not Clerk user ID)
  tenantId?: string | null   // active tenant from Clerk session claims
  staffRole?: string | null  // null = regular user; 'staff' | 'admin' | 'super'
}

// Returns an enhanced PrismaClient with ZenStack @@allow policy enforcement active.
// Use for all business queries. ZenStack adds tenant isolation automatically.
// The `as unknown as Parameters` cast bridges the ZenStack-generated auth.User type
// (refs libs/policies/generated/generated/client) and apps/task-mgmt's @prisma/client.
// Safe because drift_count=0 — both clients are generated from equivalent schemas.
export function getEnhancedDb(user: ZenstackUserCtx) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return enhance(db as any, { user }) as typeof db
}
