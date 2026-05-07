// GET /api/tasks  — list tasks for current tenant (tenant-scoped, auth required)
// POST /api/tasks — create task + write AuditEvent

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { CspsSessionClaims } from '@csps/integrations'
import { db } from '@/lib/db'
import { writeAuditEvent } from '@/lib/audit'
import { getEnhancedDb } from '@/lib/zenstack'

export const dynamic = 'force-dynamic'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
function forbidden() {
  return NextResponse.json({ error: 'No active tenant. Join or create an organization first.' }, { status: 403 })
}

export async function GET() {
  const { userId, sessionClaims } = await auth()
  if (!userId) return unauthorized()
  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return forbidden()

  // Bootstrap: look up CSPS user to get id + staffRole for ZenStack context
  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const edb = getEnhancedDb({ id: cspsUser.id, tenantId, staffRole: cspsUser.staffRole })

  const tasks = await edb.task.findMany({
    where: { deletedAt: null },  // ZenStack adds tenantId filter via @@allow("read", auth().tenantId == tenantId)
    include: {
      project: { select: { id: true, name: true } },
      assignee: { select: { id: true, displayName: true, email: true } },
      createdBy: { select: { id: true, displayName: true, email: true } },
      _count: { select: { comments: { where: { deletedAt: null } } } },
    },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
  })

  return NextResponse.json(tasks)
}

export async function POST(request: Request) {
  const { userId, sessionClaims } = await auth()
  if (!userId) return unauthorized()
  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return forbidden()

  const body = await request.json().catch(() => null)
  if (!body?.title || typeof body.title !== 'string') {
    return NextResponse.json({ error: 'title is required' }, { status: 400 })
  }

  // Bootstrap: look up CSPS user (needed for createdById + ZenStack context)
  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const edb = getEnhancedDb({ id: cspsUser.id, tenantId, staffRole: cspsUser.staffRole })

  const task = await edb.task.create({
    data: {
      tenantId,
      title: body.title.trim(),
      description: body.description ?? null,
      status: 'todo',
      priority: body.priority ?? 'none',
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      projectId: body.projectId ?? null,
      createdById: cspsUser.id,
      assigneeId: body.assigneeId ?? null,
    },
    include: {
      project: { select: { id: true, name: true } },
      assignee: { select: { id: true, displayName: true, email: true } },
    },
  })

  await writeAuditEvent({
    tenantId,
    actorId: cspsUser.id,
    action: 'task.created',
    resourceType: 'Task',
    resourceId: task.id,
    data: { title: task.title, status: task.status, priority: task.priority },
  })

  return NextResponse.json(task, { status: 201 })
}
