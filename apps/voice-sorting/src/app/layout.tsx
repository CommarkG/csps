// APP-001 Voice Sorting — E1 prototype layout
// imp_WET_TRIAL_SG004_FORCE_DYNAMIC: force-dynamic prevents prerender failure when Clerk is installed
export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Voice Sorting — Think out loud',
  description: 'The bridge between raw thinking and organized action',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
