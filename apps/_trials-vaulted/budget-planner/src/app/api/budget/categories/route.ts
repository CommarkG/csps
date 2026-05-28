// GET /api/budget/categories — list all budget categories for current tenant
// POST /api/budget/categories — create new category + AuditEvent
//
// Platform inheritance (Gate 3 proof — no foundation code changed):
//   auth()        → Clerk JWT                    ✓ inherited
//   tenantId      → from sessionClaims           ✓ inherited
//   getEnhancedDb → ZenStack RLS isolation       ✓ inherited
//   requireWriteSubscription → tier enforcement  ✓ inherited
//   writeAuditEvent → immutable audit trail      ✓ inherited
//
// Tiers: free/trialing/active = all can create; cancelled = read-only (402 on POST)
// Permissions: all tenant members can create categories (no admin gate at MVP)

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { CspsSessionClaims } from '@csps/integrations'
import { auditLog, triggerWebhook } from '@csps/integrations'
import { db } from '@/lib/db'
import { writeAuditEvent } from '@/lib/audit'
import { getEnhancedDb } from '@/lib/zenstack'
import { requireWriteSubscription } from '@/lib/subscription'

export const dynamic = 'force-dynamic'

function unauthorized() {
  return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
}
function noTenant() {
  return NextResponse.json(
    { error: 'no_tenant', message: 'No active tenant. Join or create an organization first.' },
    { status: 403 }
  )
}

export async function GET() {
  const { userId, sessionClaims } = await auth()
  if (!userId) return unauthorized()
  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return noTenant()

  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) return NextResponse.json({ error: 'user_not_found' }, { status: 404 })

  const edb = getEnhancedDb({ id: cspsUser.id, tenantId, staffRole: cspsUser.staffRole })

  // ZenStack RLS: only returns categories for this tenant (@@allow read auth().tenantId == tenantId)
  const categories = await edb.budgetCategory.findMany({
    where: { tenantId, deletedAt: null },
    include: {
      _count: { select: { transactions: { where: { deletedAt: null } } } },
    },
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
  })

  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  const { userId, sessionClaims } = await auth()
  if (!userId) return unauthorized()
  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return noTenant()

  // Tier enforcement: cancelled tenants cannot create categories
  const subBlock = await requireWriteSubscription(tenantId)
  if (subBlock) return subBlock

  const body = await request.json().catch(() => null)
  if (!body?.name || typeof body.name !== 'string') {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }
  if (!['income', 'expense'].includes(body.type)) {
    return NextResponse.json({ error: 'type must be income or expense' }, { status: 400 })
  }

  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) return NextResponse.json({ error: 'user_not_found' }, { status: 404 })

  const edb = getEnhancedDb({ id: cspsUser.id, tenantId, staffRole: cspsUser.staffRole })

  const category = await edb.budgetCategory.create({
    data: {
      tenantId,
      name: body.name.trim(),
      type: body.type,
      monthlyLimit: body.monthlyLimit ? Number(body.monthlyLimit) : null,
      color: body.color ?? null,
      icon: body.icon ?? null,
    },
  })

  // Platform audit log via @csps/integrations (S036 wired)
  await auditLog(db, {
    tenantId,
    actorId: cspsUser.id,
    action: 'budget.category.created',
    resourceType: 'BudgetCategory',
    resourceId: category.id,
    data: { name: category.name, type: category.type },
  })

  // Immutable audit trail — action namespaced to budget domain
  await writeAuditEvent({
    tenantId,
    actorId: cspsUser.id,
    action: 'budget.category.created',
    resourceType: 'BudgetCategory',
    resourceId: category.id,
    data: { name: category.name, type: category.type, monthlyLimit: category.monthlyLimit },
  })

  // Trigger outbound webhooks for registered endpoints (S036 wired)
  await triggerWebhook(tenantId, 'budget.category.created', { id: category.id, name: category.name, type: category.type })

  return NextResponse.json(category, { status: 201 })
}
