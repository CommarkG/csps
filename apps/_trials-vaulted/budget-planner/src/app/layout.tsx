import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'

// All pages in this app are auth-gated — never statically pre-render
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Budget Planner',
  description: 'CSPS Budget Planner — track income, expenses, and savings goals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#fff' }}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
