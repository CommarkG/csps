// GET /api/projects  — list projects for current tenant
// POST /api/projects — create project (Q-04: any member)
// PATCH /api/projects/[id] — archive project (Q-05: admin+ only, enforced via hasPermission)

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { CspsSessionClaims } from '@csps/integrations'
import { db } from '@/lib/db'
import { writeAuditEvent } from '@/lib/audit'
import { getEnhancedDb } from '@/lib/zenstack'
import { requireWriteSubscription } from '@/lib/subscription'
import { hasPermission } from '../../../../libs/config/roles.config'
import type { MembershipRole } from '../../../../libs/config/roles.config'

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
    where: { tenantId, deletedAt: null },
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

  // Q-02/Q-03: subscription gate on write routes
  const subBlock = await requireWriteSubscription(tenantId, db)
  if (subBlock) return subBlock

  const body = await request.json().catch(() => null)
  if (!body?.name || typeof body.name !== 'string') {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Q-04: project creation — any member (no role check needed per ratification)
  const edb = getEnhancedDb({ id: cspsUser.id, tenantId, staffRole: cspsUser.staffRole })

  const project = await edb.project.create({
    data: { tenantId, name: body.name.trim(), description: body.description ?? null, status: 'active' },
  })

  await writeAuditEvent({
    tenantId, actorId: cspsUser.id, action: 'project.created',
    resourceType: 'Project', resourceId: project.id, data: { name: project.name },
  })

  return NextResponse.json(project, { status: 201 })
}

export async function PATCH(request: Request) {
  const { userId, sessionClaims } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return NextResponse.json({ error: 'No active tenant' }, { status: 403 })

  const subBlock = await requireWriteSubscription(tenantId, db)
  if (subBlock) return subBlock

  const body = await request.json().catch(() => null)
  if (!body?.id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Q-05: project archive — admin+ only (reads from roles.config.ts)
  const membership = await db.userTenant.findFirst({ where: { userId: cspsUser.id, tenantId, deletedAt: null } })
  const role = (membership?.role ?? 'member') as MembershipRole
  if (!hasPermission(role, 'projectArchive')) {
    return NextResponse.json({ error: 'permission_denied', required: 'admin+' }, { status: 403 })
  }

  const edb = getEnhancedDb({ id: cspsUser.id, tenantId, staffRole: cspsUser.staffRole })
  const project = await edb.project.update({
    where: { id: body.id },
    data: { status: 'archived', deletedAt: body.archive ? new Date() : null },
  })

  await writeAuditEvent({
    tenantId, actorId: cspsUser.id, action: 'project.archived',
    resourceType: 'Project', resourceId: project.id, data: { name: project.name },
  })

  return NextResponse.json(project)
}
