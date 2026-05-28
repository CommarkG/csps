// GET /api/auth/session-ready — CSPS platform standard session-readiness probe
// UX-001 (Opus Turn 28): platform-first JWT refresh gap fix
// Copy this file to your app's src/app/api/auth/session-ready/route.ts
//
// Returns { ready: true } when the session has a tenantId (org provisioned + JWT refreshed).
// Returns { ready: false } during the ~5-min window after sign-up.
// Polled by account-setup/page.tsx every 2 seconds.

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { isSessionReady, type CspsSessionClaims } from '@csps/integrations'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { sessionClaims } = await auth()
  return NextResponse.json({ ready: isSessionReady(sessionClaims as CspsSessionClaims) })
}
