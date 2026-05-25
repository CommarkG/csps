/**
 * @csps-id csps.libs.ab-testing.ABTest
 * @csps-name ABTest
 * @csps-description React component that renders the active variant for a registered A/B test.
 * Up to 4 variants (A/B/C/D). Admin-settable via ABTestRegistry.setActiveVariant().
 * Phase 1: display only. Phase 2: adds impression + click tracking.
 * Moat candidate M-29. Governor S060 Q2 directive.
 * @csps-version 0.1.0
 * @csps-owner group:finky
 * @csps-lifecycle experimental
 * @csps-lifecycle-state active
 * @csps-tags type:component domain:ai audience:developer moat:ab-testing
 */

import type { ReactNode } from 'react'
import { getActiveVariant } from './registry'
import type { VariantId } from './registry'

interface ABTestSlots {
  /** Variant A content (required — always the baseline) */
  A: ReactNode
  /** Variant B content */
  B?: ReactNode
  /** Variant C content */
  C?: ReactNode
  /** Variant D content */
  D?: ReactNode
}

interface ABTestProps {
  /**
   * The registered test ID. Must match a test in the ABTestRegistry.
   * If the test is not found or is paused/concluded, falls back to variant A.
   */
  testId: string
  /**
   * Variant slot content. Pass each variant as a named prop.
   * Only the active variant is rendered. Others are not mounted.
   *
   * @example
   * <ABTest
   *   testId="cta-label-debt-collection"
   *   A={<button>Send a friendly reminder</button>}
   *   B={<button>Request payment</button>}
   *   C={<button>Follow up on your invoice</button>}
   * />
   */
  slots: ABTestSlots
  /**
   * Optional override for testing — force a specific variant regardless of registry.
   * Use only in development / Storybook. NEVER in production paths.
   */
  _devForceVariant?: VariantId
}

/**
 * ABTest — renders the active variant for a registered A/B test.
 *
 * The active variant is determined by the ABTestRegistry (admin-settable).
 * Only the active variant's slot is rendered — other variants are NOT mounted in the DOM.
 * This ensures zero performance cost for inactive variants.
 *
 * Fallback behavior:
 * - Test not found in registry → renders variant A
 * - Test paused or concluded → renders the winning variant (or A if no winner)
 * - Active variant slot not provided → renders variant A
 *
 * Phase 1: display only.
 * Phase 2 will add: trackImpression(testId, variantId) on mount,
 *                   trackEvent(testId, variantId, 'click') on interaction.
 */
export function ABTest({ testId, slots, _devForceVariant }: ABTestProps): ReactNode {
  // Determine which variant to render
  let activeVariantId: VariantId = 'A' // safe fallback

  if (_devForceVariant) {
    // Dev override: bypass registry
    activeVariantId = _devForceVariant
  } else {
    const activeVariant = getActiveVariant(testId)
    if (activeVariant) {
      activeVariantId = activeVariant.id
    }
    // If getActiveVariant returns undefined (not found / paused / concluded),
    // we fall back to 'A' — safe baseline behavior
  }

  // Resolve the content for the active variant
  const content = slots[activeVariantId]

  // If the active variant slot wasn't provided (e.g., admin set C but only A/B provided),
  // fall back to A. This prevents blank renders.
  if (content === undefined || content === null) {
    return <>{slots.A}</>
  }

  return <>{content}</>
}

/**
 * ABTestDebugBar — development-only overlay showing which variant is active.
 * Renders a small banner above the wrapped children when NODE_ENV !== 'production'.
 *
 * Usage:
 * <ABTestDebugBar testId="cta-label-debt-collection">
 *   <ABTest testId="cta-label-debt-collection" slots={{ A: ..., B: ... }} />
 * </ABTestDebugBar>
 */
interface ABTestDebugBarProps {
  testId: string
  children: ReactNode
}

export function ABTestDebugBar({ testId, children }: ABTestDebugBarProps): ReactNode {
  if (process.env.NODE_ENV === 'production') {
    return <>{children}</>
  }

  const activeVariant = getActiveVariant(testId)
  const variantLabel = activeVariant
    ? `Variant ${activeVariant.id}: ${activeVariant.label}`
    : 'Variant A (fallback — test not active)'

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          background: '#fef3c7',
          borderBottom: '1px solid #f59e0b',
          padding: '2px 8px',
          fontSize: 11,
          fontFamily: 'monospace',
          color: '#92400e',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        🧪 A/B Test: {testId} — {variantLabel}
      </div>
      <div style={{ paddingTop: 20 }}>{children}</div>
    </div>
  )
}
