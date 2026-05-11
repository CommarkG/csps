// DELETE /api/settings/account — GDPR self-service erasure (Q-17: user-triggered)
// Q-16: erases email, displayName, TaskComment.body
// Q-17: self-service — user triggers from settings UI

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { CspsSessionClaims } from '@csps/integrations'
import { eraseUser } from '@csps/integrations'
import { db } from '@/lib/db'
import { writeAuditEvent } from '@/lib/audit'

export const dynamic = 'force-dynamic'

export async function DELETE() {
  const { userId, sessionClaims } = await auth()
  if (!userId) return NextResponse.json({ error: 'unauthorized', message: 'Sign in first.' }, { status: 401 })

  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return NextResponse.json({ error: 'no_tenant', message: 'No active organization.' }, { status: 403 })

  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) return NextResponse.json({ error: 'user_not_found', message: 'User not found.' }, { status: 404 })

  // eraseUser is in libs/integrations/gdpr.ts — db injected (no circular dependency)
  const receipt = await eraseUser(cspsUser.id, tenantId, db)

  return NextResponse.json({
    erased: true,
    erasure_id: receipt.erasure_id,
    fields_cleared: receipt.fields_cleared,
    rows_affected: receipt.rows_affected,
    timestamp: receipt.timestamp,
  })
}
