// APP-001 E1 — session ready check (simplified for prototype)
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { userId } = await auth()
  return NextResponse.json({ ready: !!userId })
}
