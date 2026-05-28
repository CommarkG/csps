'use client'
// account-setup — polls until tenantId is in JWT, then redirects to dashboard
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
          router.push('/dashboard')
        }
      } catch { /* keep polling */ }
    }, 2000)
    return () => clearInterval(interval)
  }, [router])

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ fontSize: '1.5rem' }}>Setting up your account…</div>
      <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>You will be redirected automatically.</div>
    </main>
  )
}
