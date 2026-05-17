import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Track your daily habits — CSPS App #2',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f9fafb' }}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
