// GET /api/budget/balance — compute current balance for tenant
// Returns: { income: N, expenses: N, balance: N, byCategory: [...] }
//
// The North Star output: "A user can see where their money goes" — this is the view
// that makes the Budget Planner valuable. Computed from immutable Transaction records.
//
// Optional query params:
//   ?month=YYYY-MM  — filter to specific month (default: current month)
//
// PERF-001 (Opus Turn 23): replaced unbounded findMany+JS aggregation with
// Prisma groupBy. Pushes aggregation to Postgres. No OOM risk. ZenStack
// policies apply via edb. ?all=true removed — no unbounded query path exists.

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
  const monthParam = searchParams.get('month') // YYYY-MM

  const now = new Date()
  const year = monthParam ? parseInt(monthParam.slice(0, 4), 10) : now.getFullYear()
  const month = monthParam ? parseInt(monthParam.slice(5, 7), 10) - 1 : now.getMonth()
  const dateFrom = new Date(year, month, 1)
  const dateTo = new Date(year, month + 1, 1)

  const [categoryBalances, categories] = await Promise.all([
    edb.transaction.groupBy({
      by: ['categoryId'],
      where: {
        tenantId,
        deletedAt: null,
        date: { gte: dateFrom, lt: dateTo },
      },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
    }),
    edb.budgetCategory.findMany({
      where: { tenantId, deletedAt: null },
      select: { id: true, name: true, type: true, color: true, monthlyLimit: true },
    }),
  ])

  const categoryMap = new Map(categories.map(c => [c.id, c]))

  let income = 0
  let expenses = 0
  const byCategory = categoryBalances
    .map(row => {
      const cat = categoryMap.get(row.categoryId)
      if (!cat) return null
      const total = Math.round((row._sum.amount ?? 0) * 100) / 100
      if (cat.type === 'income') income += total
      else expenses += total
      return {
        id: row.categoryId,
        name: cat.name,
        type: cat.type,
        color: cat.color,
        total,
        limit: cat.monthlyLimit,
      }
    })
    .filter(Boolean)

  return NextResponse.json({
    income: Math.round(income * 100) / 100,
    expenses: Math.round(expenses * 100) / 100,
    balance: Math.round((income - expenses) * 100) / 100,
    period: monthParam ?? `${year}-${String(month + 1).padStart(2, '0')}`,
    byCategory,
  })
}
