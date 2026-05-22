// APP-001 Voice Sorting — E1 prototype layout
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
