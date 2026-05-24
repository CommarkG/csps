// CSPS TEMPLATE — replace [App Name] with your app name
// Dashboard page — DashboardShell from @csps/components + PostHog tracking (S036 wired)

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import type { CspsSessionClaims } from '@csps/integrations'
import { db } from '@/lib/db'
import { DashboardShell } from '@csps/components'
import { track } from '@csps/integrations/monitoring/posthog'

const NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
]

export default async function DashboardPage() {
  const { userId, sessionClaims } = await auth()
  if (!userId) redirect('/sign-in')

  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) redirect('/account-setup')

  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) redirect('/sign-in')

  // Track dashboard view (graceful passthrough when POSTHOG_API_KEY not set)
  track(cspsUser.id, 'dashboard_viewed', { tenantId, appName: '[App Name]' })

  return (
    <DashboardShell state="empty" nav={NAV}>
      <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>[App Name]</h1>
        <p style={{ color: '#6b7280' }}>Welcome, {cspsUser.displayName ?? cspsUser.email}.</p>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '1rem' }}>
          Replace this with your app&apos;s main content.
        </p>
      </div>
    </DashboardShell>
  )
}
