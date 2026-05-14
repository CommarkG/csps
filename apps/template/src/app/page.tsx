// CSPS TEMPLATE — replace [App Name] with your app name
// Root page: redirects to /sign-in (unauthenticated) or renders the app shell (authenticated)
// Replace this with your app's main dashboard or feature landing

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import type { CspsSessionClaims } from '@csps/integrations'
import { db } from '@/lib/db'

export default async function RootPage() {
  const { userId, sessionClaims } = await auth()

  if (!userId) redirect('/sign-in')

  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) redirect('/account-setup')

  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) redirect('/sign-in')

  // TODO: Replace with your app's actual content
  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>[App Name]</h1>
      <p style={{ color: '#6b7280' }}>Welcome, {cspsUser.displayName ?? cspsUser.email}.</p>
      <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '2rem' }}>
        Replace this page with your app&apos;s main content.
      </p>
    </main>
  )
}
