// ZenStack enhanced PrismaClient — wraps db with @@allow/@@deny policy enforcement.
// Provides ORM-layer multi-tenant isolation via ZenStack runtime.
//
// Usage: call getEnhancedDb() with the current user's CSPS context.
// Bootstrap queries (user.findUnique by clerkId) MUST use raw db, not this enhanced client.
//
// VLT-S017-ENHANCE: enhance() wired + active. ORM-layer policy enforcement running.
// VLT-S022-ZENSTACK-GENERATE-PATH: Option A workaround active (copy script).
//   Permanent fix deferred — see tools/copy-zenstack-output.mjs + session-state.json.

import { enhance } from '@zenstackhq/runtime'
import { db } from './db'

export type ZenstackUserCtx = {
  id: string              // CSPS User.id (not Clerk user ID)
  tenantId?: string | null    // active tenant from Clerk session claims
  role?: string | null        // Q-20: MembershipRole from Clerk JWT claim
  staffRole?: string | null   // null = regular user; 'staff' | 'admin' | 'super'
}

export function getEnhancedDb(user: ZenstackUserCtx) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return enhance(db as any, { user }) as typeof db
}
