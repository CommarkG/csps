// GET /api/projects/[id] — get project with tasks
// PUT /api/projects/[id] — update project (name, description, status)

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { CspsSessionClaims } from '@csps/integrations'
import { db } from '@/lib/db'
import { writeAuditEvent } from '@/lib/audit'

export const dynamic = 'force-dynamic'

type Params = { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
  const { userId, sessionClaims } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return NextResponse.json({ error: 'No active tenant' }, { status: 403 })

  const project = await db.project.findFirst({
    where: { id: params.id, tenantId, deletedAt: null },
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

  const existing = await db.project.findFirst({ where: { id: params.id, tenantId, deletedAt: null } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await request.json().catch(() => ({}))
  const updates: Record<string, unknown> = {}
  if ('name' in body) updates.name = body.name
  if ('description' in body) updates.description = body.description
  if ('status' in body) updates.status = body.status

  const project = await db.project.update({ where: { id: params.id }, data: updates })

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  await writeAuditEvent({
    tenantId,
    actorId: user?.id ?? null,
    action: 'project.updated',
    resourceType: 'Project',
    resourceId: project.id,
    data: updates,
  })

  return NextResponse.json(project)
}
