// GET /api/projects  — list projects for current tenant
// POST /api/projects — create project

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { CspsSessionClaims } from '@csps/integrations'
import { db } from '@/lib/db'
import { writeAuditEvent } from '@/lib/audit'
import { getEnhancedDb } from '@/lib/zenstack'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { userId, sessionClaims } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return NextResponse.json({ error: 'No active tenant' }, { status: 403 })

  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const edb = getEnhancedDb({ id: cspsUser.id, tenantId, staffRole: cspsUser.staffRole })

  const projects = await edb.project.findMany({
    where: { deletedAt: null },  // ZenStack adds tenantId filter
    include: { _count: { select: { tasks: { where: { deletedAt: null } } } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(projects)
}

export async function POST(request: Request) {
  const { userId, sessionClaims } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return NextResponse.json({ error: 'No active tenant' }, { status: 403 })

  const body = await request.json().catch(() => null)
  if (!body?.name || typeof body.name !== 'string') {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const edb = getEnhancedDb({ id: cspsUser.id, tenantId, staffRole: cspsUser.staffRole })

  const project = await edb.project.create({
    data: {
      tenantId,
      name: body.name.trim(),
      description: body.description ?? null,
      status: 'active',
    },
  })

  await writeAuditEvent({
    tenantId,
    actorId: cspsUser.id,
    action: 'project.created',
    resourceType: 'Project',
    resourceId: project.id,
    data: { name: project.name },
  })

  return NextResponse.json(project, { status: 201 })
}
