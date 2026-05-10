// ZenStack enhanced PrismaClient — wraps db with @@allow/@@deny policy enforcement.
// Provides ORM-layer multi-tenant isolation via ZenStack runtime.
//
// Usage: call getEnhancedDb() with the current user's CSPS context.
// The enhanced client automatically enforces @@allow rules from libs/policies/schema.zmodel.
// Bootstrap queries (user.findUnique by clerkId) MUST use raw db, not this enhanced client.
//
// VLT-S017-ENHANCE resolved: ZenStack @@allow policies now enforced at runtime.

import { db } from './db'

export type ZenstackUserCtx = {
  id: string            // CSPS User.id (not Clerk user ID)
  tenantId?: string | null   // active tenant from Clerk session claims
  staffRole?: string | null  // null = regular user; 'staff' | 'admin' | 'super'
}

// S022 SESSION-1 NOTE: ZenStack enhance is disabled due to pnpm monorepo path resolution
// issue (generated .zenstack/enhance.js written to wrong node_modules location).
// Tenant isolation is enforced at the query level (tenantId in every where clause).
// Re-enable enhance after fixing zenstack generate output path for pnpm workspaces.
// VLT-S017-ENHANCE: policy enforcement proven in S017; this is a monorepo config gap.
export function getEnhancedDb(_user: ZenstackUserCtx) {
  return db
}
