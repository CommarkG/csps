// POST /api/habits/[id]/log — check off a habit for a given date
// DELETE /api/habits/[id]/log?date=YYYY-MM-DD — uncheck
// Also handles POST with ?_method=DELETE for HTML form compatibility
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { CspsSessionClaims } from '@csps/integrations'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

function parseDate(dateStr: string): Date | null {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null
  const [, y, m, d] = match
  return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)))
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { userId, sessionClaims } = await auth()
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return NextResponse.json({ error: 'no_tenant' }, { status: 403 })

  const url = new URL(req.url)
  const methodOverride = url.searchParams.get('_method')

  // Support form-encoded date
  let dateStr = url.searchParams.get('date') ?? ''
  const contentType = req.headers.get('content-type') ?? ''
  if (!dateStr && (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart'))) {
    const fd = await req.formData()
    dateStr = (fd.get('date') as string ?? '').trim()
  }

  const date = parseDate(dateStr)
  if (!date) return NextResponse.json({ error: 'invalid_date' }, { status: 400 })

  const habit = await db.habit.findFirst({ where: { id: params.id, tenantId, deletedAt: null } })
  if (!habit) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  if (methodOverride === 'DELETE') {
    await db.habitLog.deleteMany({ where: { habitId: params.id, tenantId, date } })
  } else {
    // Upsert — idempotent check-off
    await db.habitLog.upsert({
      where: { habitId_date: { habitId: params.id, date } },
      create: { habitId: params.id, tenantId, date },
      update: {},
    })
  }

  return NextResponse.redirect(new URL('/dashboard', req.url))
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { userId, sessionClaims } = await auth()
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return NextResponse.json({ error: 'no_tenant' }, { status: 403 })

  const url = new URL(req.url)
  const dateStr = url.searchParams.get('date') ?? ''
  const date = parseDate(dateStr)
  if (!date) return NextResponse.json({ error: 'invalid_date' }, { status: 400 })

  await db.habitLog.deleteMany({ where: { habitId: params.id, tenantId, date } })
  return NextResponse.json({ deleted: true })
}
