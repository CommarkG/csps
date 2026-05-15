// libs/integrations/security/guards.ts
// API-layer role guards for CSPS.
//
// ZenStack's auth() context returns User fields (id, tenantId, staffRole) but NOT
// UserTenant.role — the role is per-tenant and stored in the join table.
// These guards query UserTenant directly to enforce role-based access control
// at the API layer, complementing ZenStack's tenant-isolation policies.
//
// Usage:
//   const allowed = await checkMembershipPermission(db, userId, tenantId, ['owner', 'admin'])
//   if (!allowed) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

import type { PrismaClient } from '@prisma/client'

export type MembershipRole = 'owner' | 'admin' | 'member' | 'viewer'

/**
 * Returns true if the user has one of the required roles in the given tenant.
 * Always returns true for staff (staffRole != null) regardless of membership.
 */
export async function checkMembershipPermission(
  db: PrismaClient,
  userId: string,
  tenantId: string,
  requiredRoles: MembershipRole[],
  staffRole?: string | null,
): Promise<boolean> {
  // Staff bypass — platform admins can always act
  if (staffRole) return true

  const membership = await db.userTenant.findUnique({
    where: { userId_tenantId: { userId, tenantId } },
    select: { role: true },
  })

  if (!membership) return false
  return (requiredRoles as string[]).includes(membership.role)
}

/**
 * Returns the user's role in the given tenant, or null if not a member.
 */
export async function getMembershipRole(
  db: PrismaClient,
  userId: string,
  tenantId: string,
): Promise<MembershipRole | null> {
  const membership = await db.userTenant.findUnique({
    where: { userId_tenantId: { userId, tenantId } },
    select: { role: true },
  })
  return (membership?.role as MembershipRole) ?? null
}

/**
 * Convenience wrapper — checks if user is owner or admin in the given tenant.
 * Used at API layer for WebhookEndpoint and other owner/admin-only operations.
 *
 * Usage:
 *   if (!await checkMembership(db, userId, tenantId, staffRole)) {
 *     return NextResponse.json({ error: 'forbidden' }, { status: 403 })
 *   }
 */
export async function checkMembership(
  db: PrismaClient,
  userId: string,
  tenantId: string,
  staffRole?: string | null,
  requiredRoles: MembershipRole[] = ['owner', 'admin'],
): Promise<boolean> {
  return checkMembershipPermission(db, userId, tenantId, requiredRoles, staffRole)
}

/**
 * Throws a 402 Payment Required error if the tenant's plan doesn't meet the required tier.
 * Use at the top of API routes that require paid features.
 *
 * Usage:
 *   await requiresTier(tenant.plan, 'pro')
 */
export function requiresTier(currentPlan: string, requiredPlan: 'pro' | 'enterprise'): void {
  const TIER_ORDER = { free: 0, pro: 1, enterprise: 2 }
  const current = TIER_ORDER[currentPlan as keyof typeof TIER_ORDER] ?? 0
  const required = TIER_ORDER[requiredPlan]
  if (current < required) {
    const err = new Error(`This feature requires ${requiredPlan} plan or higher`)
    ;(err as NodeJS.ErrnoException).code = '402'
    throw err
  }
}

/**
 * Higher-order component placeholder for future middleware chaining.
 * Wraps a Next.js API route handler — reserved for cross-cutting security concerns.
 * Currently passes through; future: add rate limiting, audit logging, security headers.
 */
export function withSecurity<T>(
  handler: (...args: unknown[]) => Promise<T>
): (...args: unknown[]) => Promise<T> {
  return async (...args: unknown[]) => {
    // Future: inject rate limiting, audit, security headers
    return handler(...args)
  }
}
