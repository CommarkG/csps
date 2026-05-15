// libs/components/src/feature-gate/FeatureGateOverlay.tsx
// S034-B: Feature gate overlay — shows upgrade prompt when plan is insufficient.
// Composes with libs/integrations/security/guards.ts requiresTier() at API layer.

import React from 'react'

const TIER_ORDER: Record<string, number> = { free: 0, pro: 1, enterprise: 2 }

function planMeetsTier(currentPlan: string, requiredPlan: string): boolean {
  return (TIER_ORDER[currentPlan] ?? 0) >= (TIER_ORDER[requiredPlan] ?? 0)
}

type FeatureGateOverlayProps = {
  requiredPlan: string
  currentPlan: string
  upgradeUrl: string
  children: React.ReactNode
}

export function FeatureGateOverlay({
  requiredPlan,
  currentPlan,
  upgradeUrl,
  children,
}: FeatureGateOverlayProps) {
  if (planMeetsTier(currentPlan, requiredPlan)) {
    return <>{children}</>
  }

  return (
    <div style={{ position: 'relative', fontFamily: 'system-ui, sans-serif' }}>
      {/* Blurred background content */}
      <div style={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.4 }}>
        {children}
      </div>

      {/* Upgrade overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.85)',
        borderRadius: 8,
        padding: '2rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔒</div>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem', fontWeight: 600 }}>
          {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)} feature
        </h3>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: 280 }}>
          This feature requires the {requiredPlan} plan. Upgrade to unlock it.
        </p>
        <a
          href={upgradeUrl}
          style={{
            background: '#111827',
            color: '#fff',
            padding: '0.625rem 1.5rem',
            borderRadius: 6,
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          Upgrade to {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}
        </a>
        <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.75rem' }}>
          Currently on {currentPlan} plan
        </p>
      </div>
    </div>
  )
}
