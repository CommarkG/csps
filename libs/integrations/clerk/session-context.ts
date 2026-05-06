// Clerk session context — implements VLT-S015-001 (tenantId login-sync via JWT)
//
// DECISION (VLT-S015-001 — Governor ratified 2026-05-06):
//   Mechanism: Clerk JWT custom claim (Option A)
//   WHY: Zero DB lookup per request; works serverless; stateless; industry standard.
//
// HOW TO WIRE:
//   1. Create Clerk session customization endpoint:
//      POST /api/auth/session → reads User.tenantId from DB → returns as JWT claim
//
//   2. In Clerk dashboard → Sessions → "Customize session token" → add:
//      { "metadata": { "tenantId": "{{user.public_metadata.tenantId}}" } }
//      OR use the JWT template (Clerk v6+)
//
//   3. In middleware.ts, read auth().sessionClaims.tenantId (already set by Clerk)
//
//   4. In app pages: use `const { sessionClaims } = auth()` — no DB lookup needed.
//
// SYNC MECHANISM:
//   - org.created webhook → sets User.tenantId in DB (already wired in webhook-handler.ts)
//   - After org creation, Clerk session is refreshed → new JWT contains tenantId
//   - For tenant switching: call /api/auth/switch-tenant → updates User.tenantId → force session refresh

export type CspsSessionClaims = {
  tenantId?: string    // active tenant — set from Clerk JWT custom claim
  staffRole?: string   // staff/admin override
}

// Use in server components:
//   import { auth } from '@clerk/nextjs/server'
//   const { userId, sessionClaims } = await auth()
//   const tenantId = (sessionClaims as CspsSessionClaims).tenantId

// Use in middleware:
//   const { userId, sessionClaims } = auth()
//   const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId

// Session customization API route (create at apps/*/src/app/api/auth/session/route.ts):
export async function buildSessionClaims(clerkUserId: string, db: { user: { findUnique: (args: { where: { clerkId: string } }) => Promise<{ tenantId: string | null } | null> } }): Promise<CspsSessionClaims> {
  const user = await db.user.findUnique({ where: { clerkId: clerkUserId } })
  return {
    tenantId: user?.tenantId ?? undefined,
  }
}
