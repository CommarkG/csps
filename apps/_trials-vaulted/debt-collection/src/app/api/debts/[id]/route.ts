// Debt Collection — GET /api/debts/[id]
// Returns a single debt by ID from the YAML store.

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getDebt } from '@/lib/debts'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const debt = getDebt(params.id)
  if (!debt) return NextResponse.json({ error: 'Debt not found' }, { status: 404 })

  return NextResponse.json({ debt })
}
