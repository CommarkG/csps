// ZenStack enhanced PrismaClient — wraps db with @@allow/@@deny policy enforcement.
// Provides ORM-layer multi-tenant isolation via ZenStack runtime.
//
// VLT-S022-ZENSTACK-GENERATE-PATH: RESOLVED (2026-05-11)
//   Root cause was Prisma version mismatch (root@6.7.0 vs apps@^6.7.0 resolving to 6.19.3).
//   Fix: root package.json updated to prisma@6.19.3 + postinstall copies .zenstack/ files.
//   enhance() is now fully active. ZenStack ORM policies enforced at runtime.
//
// S3-E1 RETROSPECTIVE PASS: after Prisma version fix, cross-tenant write is denied by policy.
// Platform now has defense-in-depth: ZenStack ORM layer + Postgres RLS layer.

import { enhance } from '@zenstackhq/runtime'
import { db } from './db'

export type ZenstackUserCtx = {
  id: string              // CSPS User.id (not Clerk user ID)
  tenantId?: string | null    // active tenant from Clerk session claims
  role?: string | null        // Q-20: MembershipRole from Clerk JWT (org:owner→owner mapped)
  staffRole?: string | null   // null = regular user; 'staff' | 'admin' | 'super'
}

export function getEnhancedDb(user: ZenstackUserCtx) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return enhance(db as any, { user }) as typeof db
}
