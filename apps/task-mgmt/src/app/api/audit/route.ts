// GET /api/audit — retrieve AuditEvent log for current tenant
// Q-18 ratified: admin+ only (owner/admin can read; member cannot)
// Q-19 ratified: retention = forever at MVP

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { CspsSessionClaims } from '@csps/integrations'
import { mapClerkJwtRole } from '@csps/integrations'
import { db } from '@/lib/db'
import { hasPermission } from '@csps/config/roles.config'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { userId, sessionClaims } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const claims = sessionClaims as CspsSessionClaims
  const tenantId = claims?.tenantId
  if (!tenantId) return NextResponse.json({ error: 'No active tenant' }, { status: 403 })

  // Q-18: audit log read is admin+ only
  const role = mapClerkJwtRole(claims?.role)
  if (!hasPermission(role, 'auditRead')) {
    return NextResponse.json({ error: 'permission_denied', required: 'admin+' }, { status: 403 })
  }

  const url = new URL(request.url)
  const resourceType = url.searchParams.get('resourceType') ?? undefined
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50'), 200)
  const offset = parseInt(url.searchParams.get('offset') ?? '0')

  const events = await db.auditEvent.findMany({
    where: {
      tenantId,
      ...(resourceType ? { resourceType } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
    select: {
      id: true,
      action: true,
      actorId: true,
      resourceType: true,
      resourceId: true,
      data: true,
      createdAt: true,
    },
  })

  const total = await db.auditEvent.count({ where: { tenantId } })

  return NextResponse.json({ events, total, limit, offset })
}
