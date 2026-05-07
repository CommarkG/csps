// Session claims endpoint — returns tenantId for Clerk JWT custom claim
// VLT-S015-001: Clerk JWT custom claim for User.tenantId
//
// Wire in Clerk dashboard: Sessions → Customize session token → add:
//   { "metadata": { "tenantId": "{{user.public_metadata.tenantId}}" } }
// OR use this endpoint as a session customization endpoint.

import { auth } from '@clerk/nextjs/server'
import { buildSessionClaims } from '@csps/integrations'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const claims = await buildSessionClaims(userId, db)
  return NextResponse.json(claims)
}
