// CSPS TEMPLATE — replace [App Name] with your app name
import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'

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
