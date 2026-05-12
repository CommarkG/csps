// GET /api/budget/balance — compute current balance for tenant
// Returns: { income: N, expenses: N, balance: N, byCategory: [...] }
//
// The North Star output: "A user can see where their money goes" — this is the view
// that makes the Budget Planner valuable. Computed from immutable Transaction records.
//
// Optional query params:
//   ?month=YYYY-MM  — filter to specific month (default: current month)
//   ?all=true       — all-time balance (overrides month)

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { CspsSessionClaims } from '@csps/integrations'
import { db } from '@/lib/db'
import { getEnhancedDb } from '@/lib/zenstack'

export const dynamic = 'force-dynamic'

function unauthorized() {
  return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
}

export async function GET(request: Request) {
  const { userId, sessionClaims } = await auth()
  if (!userId) return unauthorized()
  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return NextResponse.json({ error: 'no_tenant' }, { status: 403 })

  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) return NextResponse.json({ error: 'user_not_found' }, { status: 404 })

  const edb = getEnhancedDb({ id: cspsUser.id, tenantId, staffRole: cspsUser.staffRole })

  const { searchParams } = new URL(request.url)
  const allTime = searchParams.get('all') === 'true'
  const monthParam = searchParams.get('month') // YYYY-MM

  let dateFilter: { gte: Date; lt: Date } | undefined
  if (!allTime) {
    const now = new Date()
    const year = monthParam ? parseInt(monthParam.slice(0, 4), 10) : now.getFullYear()
    const month = monthParam ? parseInt(monthParam.slice(5, 7), 10) - 1 : now.getMonth()
    const start = new Date(year, month, 1)
    const end = new Date(year, month + 1, 1)
    dateFilter = { gte: start, lt: end }
  }

  const transactions = await edb.transaction.findMany({
    where: {
      tenantId,
      deletedAt: null,
      ...(dateFilter ? { date: dateFilter } : {}),
    },
    include: {
      category: { select: { id: true, name: true, type: true, color: true, monthlyLimit: true } },
    },
  })

  // Compute totals
  let income = 0
  let expenses = 0
  const byCategory: Record<string, { name: string; type: string; total: number; limit: number | null; count: number }> = {}

  for (const t of transactions) {
    if (t.type === 'income') {
      income += t.amount
    } else {
      expenses += t.amount
    }

    if (!byCategory[t.categoryId]) {
      byCategory[t.categoryId] = {
        name: t.category.name,
        type: t.category.type,
        total: 0,
        limit: t.category.monthlyLimit,
        count: 0,
      }
    }
    byCategory[t.categoryId].total += t.amount
    byCategory[t.categoryId].count++
  }

  return NextResponse.json({
    income: Math.round(income * 100) / 100,
    expenses: Math.round(expenses * 100) / 100,
    balance: Math.round((income - expenses) * 100) / 100,
    transactionCount: transactions.length,
    period: allTime ? 'all-time' : (monthParam ?? new Date().toISOString().slice(0, 7)),
    byCategory: Object.entries(byCategory)
      .map(([id, data]) => ({ id, ...data, total: Math.round(data.total * 100) / 100 }))
      .sort((a, b) => b.total - a.total),
  })
}
