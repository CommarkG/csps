// CSPS TEMPLATE — replace [App Name] with your app name
// Root page: redirects to /sign-in (unauthenticated) or renders the app shell (authenticated)
// Replace this with your app's main dashboard or feature landing

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import type { CspsSessionClaims } from '@csps/integrations'
import { db } from '@/lib/db'
import { CSPSPage } from '@csps/ui'

export default async function RootPage() {
  const { userId, sessionClaims } = await auth()

  if (!userId) redirect('/sign-in')

  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) redirect('/account-setup')

  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) redirect('/sign-in')

  // TODO: Replace with your app's actual content
  return (
    <CSPSPage
      title="[App Name]"
      subtitle="Replace this with your app's main content."
      contextQuestion="Is the user authenticated and their tenant resolved? (Check: clerkId maps to User; sessionClaims.tenantId is set)"
    >
      <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
        Welcome, {cspsUser.displayName ?? cspsUser.email}.
      </p>
      <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '1.5rem' }}>
        Replace this page with your app&apos;s main content.
        All CSPS foundation UI components are available via <code>@csps/ui</code>.
      </p>
    </CSPSPage>
  )
}
