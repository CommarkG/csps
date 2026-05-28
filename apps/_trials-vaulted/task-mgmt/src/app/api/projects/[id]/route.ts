// GET /api/projects/[id] — get project with tasks
// PUT /api/projects/[id] — update project (name, description, status)

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { CspsSessionClaims } from '@csps/integrations'
import { db } from '@/lib/db'
import { writeAuditEvent } from '@/lib/audit'
import { getEnhancedDb } from '@/lib/zenstack'

export const dynamic = 'force-dynamic'

type Params = { params: { id: string } }

async function resolveContext(userId: string, tenantId: string) {
  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) return null
  return { cspsUser, edb: getEnhancedDb({ id: cspsUser.id, tenantId, staffRole: cspsUser.staffRole }) }
}

export async function GET(_req: Request, { params }: Params) {
  const { userId, sessionClaims } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return NextResponse.json({ error: 'No active tenant' }, { status: 403 })

  const ctx = await resolveContext(userId, tenantId)
  if (!ctx) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const project = await ctx.edb.project.findFirst({
    where: { id: params.id, deletedAt: null },  // ZenStack adds tenantId filter
    include: {
      tasks: {
        where: { deletedAt: null },
        include: { assignee: { select: { id: true, displayName: true, email: true } } },
        orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      },
    },
  })

  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(project)
}

export async function PUT(request: Request, { params }: Params) {
  const { userId, sessionClaims } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return NextResponse.json({ error: 'No active tenant' }, { status: 403 })

  const ctx = await resolveContext(userId, tenantId)
  if (!ctx) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const existing = await ctx.edb.project.findFirst({
    where: { id: params.id, deletedAt: null },  // ZenStack adds tenantId filter
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await request.json().catch(() => ({}))
  const updates: Record<string, unknown> = {}
  if ('name' in body) updates.name = body.name
  if ('description' in body) updates.description = body.description
  if ('status' in body) updates.status = body.status

  const project = await ctx.edb.project.update({ where: { id: params.id }, data: updates })

  await writeAuditEvent({
    tenantId,
    actorId: ctx.cspsUser.id,
    action: 'project.updated',
    resourceType: 'Project',
    resourceId: project.id,
    data: updates,
  })

  return NextResponse.json(project)
}
