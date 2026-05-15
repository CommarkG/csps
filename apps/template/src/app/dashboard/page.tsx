// CSPS TEMPLATE — replace [App Name] with your app name
// Example dashboard page using @csps/components DashboardShell.
//
// Usage:
//   import { DashboardShell } from '@csps/components'
//   import { FeatureGateOverlay } from '@csps/components'
//   import { DataTable } from '@csps/components'
//
// DashboardShell wraps your authenticated dashboard content.
// Add your app-specific nav items and content below.

// import { DashboardShell } from '@csps/components'
// import { auth } from '@clerk/nextjs/server'
// import { redirect } from 'next/navigation'
// import type { CspsSessionClaims } from '@csps/integrations'
//
// const NAV = [
//   { label: 'Home', href: '/dashboard', icon: '🏠' },
//   { label: 'Settings', href: '/settings', icon: '⚙️' },
// ]
//
// export default async function DashboardPage() {
//   const { userId, sessionClaims } = await auth()
//   if (!userId) redirect('/sign-in')
//   const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
//   if (!tenantId) redirect('/account-setup')
//
//   return (
//     <DashboardShell nav={NAV} state="loaded">
//       <h1>Dashboard</h1>
//       {/* Your app content here */}
//     </DashboardShell>
//   )
// }

export default function DashboardPage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>[App Name] — Dashboard</h1>
      <p style={{ color: '#6b7280' }}>Replace this with DashboardShell from @csps/components.</p>
    </main>
  )
}
