// POST /api/habits — create a new habit
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { CspsSessionClaims } from '@csps/integrations'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const { userId, sessionClaims } = await auth()
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return NextResponse.json({ error: 'no_tenant' }, { status: 403 })

  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) return NextResponse.json({ error: 'user_not_found' }, { status: 404 })

  // Support both JSON body and form submission
  let name = ''
  const contentType = req.headers.get('content-type') ?? ''
  if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    const formData = await req.formData()
    name = (formData.get('name') as string ?? '').trim()
  } else {
    const body = await req.json().catch(() => ({}))
    name = (body.name ?? '').trim()
  }

  if (!name) return NextResponse.json({ error: 'name_required' }, { status: 400 })
  if (name.length > 100) return NextResponse.json({ error: 'name_too_long' }, { status: 400 })

  await db.habit.create({
    data: { tenantId, name },
  })

  // Redirect back to dashboard after form submit
  return NextResponse.redirect(new URL('/dashboard', req.url))
}

export async function GET(req: Request) {
  const { userId, sessionClaims } = await auth()
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return NextResponse.json({ error: 'no_tenant' }, { status: 403 })

  const habits = await db.habit.findMany({
    where: { tenantId, deletedAt: null },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(habits)
}
