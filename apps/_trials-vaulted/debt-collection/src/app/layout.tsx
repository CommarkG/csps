// CSPS TEMPLATE — replace [App Name] with your app name
import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'

// Force dynamic rendering — ClerkProvider requires a publishable key at runtime,
// not available at build time. All CSPS apps are auth-gated; static generation is wrong.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '[App Name]',
  description: 'CSPS [App Name]',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
