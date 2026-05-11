// Clerk session context — implements VLT-S015-001 (tenantId login-sync via JWT)
// Q-20 ratified S022: role added to JWT claims (DB lookup at sign-in time only)
//
// DECISION (VLT-S015-001 — Governor ratified 2026-05-06):
//   Mechanism: Clerk JWT custom claim (Option A)
//   WHY: Zero DB lookup per request; works serverless; stateless; industry standard.
//
// Q-20 (Governor ratified 2026-05-10):
//   Role also included in JWT via UserTenant lookup at sign-in time.
//   Mechanism: same as tenantId — one DB lookup at sign-in, zero per request.
//   Clerk dashboard config: extend "Customize session token" Claims to include role.

export type CspsSessionClaims = {
  tenantId?: string    // active tenant — set from Clerk JWT custom claim
  role?: string        // Q-20: Clerk org membership role (org:owner|org:admin|org:member)
  staffRole?: string   // staff/admin override
}

// Map Clerk org membership role → CSPS MembershipRole
// Clerk JWT contains: org:owner, org:admin, org:member (with org: prefix)
// CSPS schema uses: owner, admin, member (without prefix)
export function mapClerkJwtRole(clerkRole?: string): 'owner' | 'admin' | 'member' {
  if (clerkRole === 'org:owner') return 'owner'
  if (clerkRole === 'org:admin') return 'admin'
  return 'member'
}

// Use in server components:
//   import { auth } from '@clerk/nextjs/server'
//   const { userId, sessionClaims } = await auth()
//   const tenantId = (sessionClaims as CspsSessionClaims).tenantId
//   const role = (sessionClaims as CspsSessionClaims).role

// Session customization API route (create at apps/*/src/app/api/auth/session/route.ts):
export async function buildSessionClaims(
  clerkUserId: string,
  db: {
    user: {
      findUnique: (args: {
        where: { clerkId: string }
        include?: { memberships?: { where?: Record<string, unknown>; select?: Record<string, unknown> } }
      }) => Promise<{
        tenantId: string | null
        memberships?: Array<{ tenantId: string; role: string }>
      } | null>
    }
  }
): Promise<CspsSessionClaims> {
  const user = await db.user.findUnique({
    where: { clerkId: clerkUserId },
    include: {
      memberships: {
        where: { deletedAt: null },
        select: { tenantId: true, role: true },
      },
    },
  })

  // Find the membership matching the user's active tenantId
  const activeMembership = user?.memberships?.find(
    m => m.tenantId === user.tenantId
  )

  return {
    tenantId: user?.tenantId ?? undefined,
    role: activeMembership?.role ?? undefined,  // Q-20: role in JWT
  }
}
