// GET /api/tasks/[id]    — get single task (tenant-scoped)
// PUT /api/tasks/[id]    — update task fields + write AuditEvent per change
// DELETE /api/tasks/[id] — soft delete + write AuditEvent

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { CspsSessionClaims } from '@csps/integrations'
import { db } from '@/lib/db'
import { writeAuditEvent } from '@/lib/audit'
import { getEnhancedDb } from '@/lib/zenstack'

export const dynamic = 'force-dynamic'

type Params = { params: { id: string } }

async function resolveContext() {
  const { userId, sessionClaims } = await auth()
  if (!userId) return null
  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return null
  // Bootstrap: raw db lookup before ZenStack context exists
  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) return null
  const edb = getEnhancedDb({ id: cspsUser.id, tenantId, staffRole: cspsUser.staffRole })
  return { tenantId, user: cspsUser, edb }
}

export async function GET(_req: Request, { params }: Params) {
  const ctx = await resolveContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const task = await ctx.edb.task.findFirst({
    where: { id: params.id, deletedAt: null },  // ZenStack adds tenantId filter
    include: {
      project: { select: { id: true, name: true } },
      assignee: { select: { id: true, displayName: true, email: true } },
      createdBy: { select: { id: true, displayName: true, email: true } },
      comments: {
        where: { deletedAt: null },
        include: { author: { select: { id: true, displayName: true, email: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(task)
}

export async function PUT(request: Request, { params }: Params) {
  const ctx = await resolveContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await ctx.edb.task.findFirst({
    where: { id: params.id, deletedAt: null },  // ZenStack adds tenantId filter
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await request.json().catch(() => ({}))
  const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate', 'assigneeId', 'projectId']
  const updates: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (field in body) updates[field] = body[field] === '' ? null : body[field]
  }
  if (updates.dueDate && typeof updates.dueDate === 'string') {
    updates.dueDate = new Date(updates.dueDate)
  }

  const task = await ctx.edb.task.update({
    where: { id: params.id },
    data: updates,
    include: {
      project: { select: { id: true, name: true } },
      assignee: { select: { id: true, displayName: true, email: true } },
    },
  })

  const auditAction =
    updates.status === 'done' ? 'task.completed'
    : updates.status && updates.status !== existing.status ? 'task.status_changed'
    : 'assigneeId' in updates && updates.assigneeId !== existing.assigneeId ? 'task.assigned'
    : 'task.updated'

  await writeAuditEvent({
    tenantId: ctx.tenantId,
    actorId: ctx.user.id,
    action: auditAction,
    resourceType: 'Task',
    resourceId: task.id,
    data: { ...updates, previousStatus: existing.status },
  })

  return NextResponse.json(task)
}

export async function DELETE(_req: Request, { params }: Params) {
  const ctx = await resolveContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await ctx.edb.task.findFirst({
    where: { id: params.id, deletedAt: null },  // ZenStack adds tenantId filter
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Soft delete — P-ARCH-007: never hard-delete governed entities
  await ctx.edb.task.update({
    where: { id: params.id },
    data: { deletedAt: new Date() },
  })

  await writeAuditEvent({
    tenantId: ctx.tenantId,
    actorId: ctx.user.id,
    action: 'task.deleted',
    resourceType: 'Task',
    resourceId: params.id,
    data: { title: existing.title },
  })

  return new Response(null, { status: 204 })
}
