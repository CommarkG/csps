// Debt Collection — POST /api/debts
// Creates a new debt entry in .csps/debts.yaml

export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createDebt } from '@/lib/debts'
import type { Currency } from '@/lib/debts'

const VALID_CURRENCIES = ['ILS', 'USD', 'EUR'] as const

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { debtor_name, amount, currency, description, due_date } = body as Record<string, unknown>

  if (!debtor_name || typeof debtor_name !== 'string' || debtor_name.trim().length === 0) {
    return NextResponse.json({ error: 'debtor_name is required' }, { status: 400 })
  }
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return NextResponse.json({ error: 'amount must be a positive number' }, { status: 400 })
  }
  if (!currency || !VALID_CURRENCIES.includes(currency as Currency)) {
    return NextResponse.json({ error: 'currency must be ILS, USD, or EUR' }, { status: 400 })
  }
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return NextResponse.json({ error: 'description is required' }, { status: 400 })
  }
  if (!due_date || typeof due_date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(due_date)) {
    return NextResponse.json({ error: 'due_date must be YYYY-MM-DD' }, { status: 400 })
  }

  const debt = createDebt({
    debtor_name: debtor_name.trim(),
    amount: amount as number,
    currency: currency as Currency,
    description: description.trim(),
    due_date: due_date as string,
  })

  return NextResponse.json({ id: debt.id, debt }, { status: 201 })
}

export async function PATCH(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { id, ...updates } = body as { id: string; [key: string]: unknown }
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const { updateDebt } = await import('@/lib/debts')
  const updated = updateDebt(id, updates as Parameters<typeof updateDebt>[1])
  if (!updated) return NextResponse.json({ error: 'Debt not found' }, { status: 404 })

  return NextResponse.json({ debt: updated })
}
