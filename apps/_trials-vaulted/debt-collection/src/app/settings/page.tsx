// CSPS TEMPLATE — replace [App Name] with your app name
// Settings page using SettingsLayout from @csps/components (S036 wired)

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import type { CspsSessionClaims } from '@csps/integrations'
import { SettingsLayout } from '@csps/components'

const TABS = [
  { id: 'profile', label: 'Profile', href: '/settings' },
  { id: 'billing', label: 'Billing', href: '/settings/billing' },
  { id: 'team', label: 'Team', href: '/settings/team' },
]

export default async function SettingsPage() {
  const { userId, sessionClaims } = await auth()
  if (!userId) redirect('/sign-in')

  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) redirect('/account-setup')

  return (
    <SettingsLayout tabs={TABS} currentTab="profile">
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Profile</h2>
      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
        Manage your profile settings here.
      </p>
    </SettingsLayout>
  )
}
