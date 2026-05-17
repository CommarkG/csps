'use client'
// account-setup/page.tsx — JWT refresh gap fix + OnboardingWizard (S036 PI-001)
// Phase 1: shows loading/polling until tenantId is in JWT
// Phase 2: if archetype not yet set, shows OnboardingWizard before redirect
// Per PI-001 wiring checklist — Budget Planner instance

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { OnboardingWizard } from '@csps/components'

type Phase = 'polling' | 'onboarding' | 'done'

export default function AccountSetupPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [phase, setPhase] = useState<Phase>('polling')

  useEffect(() => {
    if (!isLoaded) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/auth/session-ready')
        const data = await res.json()
        if (data.ready) {
          clearInterval(interval)
          // Check if archetype already set (PI-001)
          const archetype = user?.publicMetadata?.archetype as string | undefined
          if (archetype) {
            router.push('/dashboard')
          } else {
            setPhase('onboarding')
          }
        }
      } catch { /* keep polling */ }
    }, 2000)

    return () => clearInterval(interval)
  }, [isLoaded, router, user])

  const handleWizardComplete = async (_archetype: string) => {
    // Archetype stored via Inngest user.created event; redirect to dashboard
    setPhase('done')
    router.push('/dashboard')
  }

  if (phase === 'onboarding') {
    return (
      <OnboardingWizard
        appName="Budget Planner"
        onComplete={handleWizardComplete}
      />
    )
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ fontSize: '1.5rem' }}>Setting up your account…</div>
      <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>This takes a few seconds. You will be redirected automatically.</div>
    </main>
  )
}
