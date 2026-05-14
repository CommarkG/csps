'use client'
// account-setup/page.tsx — CSPS platform standard loading state
// UX-001 (Opus Turn 28): platform-first JWT refresh gap fix
// Copy this file to your app's src/app/account-setup/page.tsx
//
// Shows while org is being provisioned after sign-up.
// Polls /api/auth/session-ready every 2s. Redirects to / when tenantId is ready.
// Prevents the sign-up → 403 → sign-in infinite loop.

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AccountSetupPage() {
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/auth/session-ready')
        const data = await res.json()
        if (data.ready) {
          clearInterval(interval)
          router.push('/')
        }
      } catch {
        // network error — keep polling
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [router])

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ fontSize: '1.5rem' }}>Setting up your account…</div>
      <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>This takes a few seconds. You will be redirected automatically.</div>
    </main>
  )
}
