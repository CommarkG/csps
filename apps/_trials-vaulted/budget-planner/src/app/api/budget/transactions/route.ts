// GET /api/budget/transactions — list transactions for current tenant
// POST /api/budget/transactions — record new transaction (immutable once created)
//
// Financial integrity: transactions are immutable (@@deny update + delete in schema).
// This is intentional — financial records must not be altered after creation.
// To "correct" a transaction: create an offsetting transaction (double-entry pattern).
//
// Tiers: free/trialing/active = all can record; cancelled = read-only (402 on POST)

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { CspsSessionClaims } from '@csps/integrations'
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
    { error: 'no_tenant', message: 'No active tenant.' },
    { status: 403 }
  )
}

export async function GET(request: Request) {
  const { userId, sessionClaims } = await auth()
  if (!userId) return unauthorized()
  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return noTenant()

  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) return NextResponse.json({ error: 'user_not_found' }, { status: 404 })

  const edb = getEnhancedDb({ id: cspsUser.id, tenantId, staffRole: cspsUser.staffRole })

  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('categoryId')
  const limitParam = searchParams.get('limit')
  const limit = limitParam ? Math.min(parseInt(limitParam, 10), 100) : 50

  const transactions = await edb.transaction.findMany({
    where: {
      tenantId,
      deletedAt: null,
      ...(categoryId ? { categoryId } : {}),
    },
    include: {
      category: { select: { id: true, name: true, type: true, color: true } },
    },
    orderBy: [{ date: 'desc' }],
    take: limit,
  })

  return NextResponse.json(transactions)
}

export async function POST(request: Request) {
  const { userId, sessionClaims } = await auth()
  if (!userId) return unauthorized()
  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return noTenant()

  const subBlock = await requireWriteSubscription(tenantId)
  if (subBlock) return subBlock

  const body = await request.json().catch(() => null)
  if (!body?.categoryId || typeof body.categoryId !== 'string') {
    return NextResponse.json({ error: 'categoryId is required' }, { status: 400 })
  }
  if (typeof body.amount !== 'number' || body.amount <= 0) {
    return NextResponse.json({ error: 'amount must be a positive number' }, { status: 400 })
  }

  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) return NextResponse.json({ error: 'user_not_found' }, { status: 404 })

  // Verify category belongs to this tenant (prevent cross-tenant category assignment)
  const category = await db.budgetCategory.findFirst({
    where: { id: body.categoryId, tenantId, deletedAt: null },
  })
  if (!category) {
    return NextResponse.json({ error: 'category_not_found' }, { status: 404 })
  }

  const edb = getEnhancedDb({ id: cspsUser.id, tenantId, staffRole: cspsUser.staffRole })

  const transaction = await edb.transaction.create({
    data: {
      tenantId,
      categoryId: body.categoryId,
      amount: body.amount,
      type: category.type, // inherits from category (income/expense)
      note: body.note ?? null,
      date: body.date ? new Date(body.date) : new Date(),
    },
    include: {
      category: { select: { id: true, name: true, type: true } },
    },
  })

  await writeAuditEvent({
    tenantId,
    actorId: cspsUser.id,
    action: 'budget.transaction.created',
    resourceType: 'Transaction',
    resourceId: transaction.id,
    data: {
      amount: transaction.amount,
      type: transaction.type,
      categoryId: transaction.categoryId,
      date: transaction.date,
    },
  })

  return NextResponse.json(transaction, { status: 201 })
}
