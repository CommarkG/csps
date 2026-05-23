/**
 * @csps-id csps.libs.ui.HealthBar
 * Progress bar with CSPS color semantics.
 * pass (≥80) = green, warn (≥40) = amber, block (<40) = red.
 * Mirrors the colorForPct logic in apps/csps-playground completion page.
 */


type HealthBarVariant = 'pass' | 'warn' | 'block'

interface HealthBarProps {
  /** 0–100 percentage value */
  value: number
  /** Label shown left of the bar */
  label: string
  /**
   * Explicit variant override.
   * If omitted, variant is derived from value: ≥80=pass, ≥40=warn, <40=block
   */
  variant?: HealthBarVariant
  /** Optional source/detail shown below bar in muted text */
  source?: string
}

const VARIANT_COLORS: Record<HealthBarVariant, string> = {
  pass:  '#16a34a',
  warn:  '#ca8a04',
  block: '#dc2626',
}

function deriveVariant(value: number): HealthBarVariant {
  if (value >= 80) return 'pass'
  if (value >= 40) return 'warn'
  return 'block'
}

export function HealthBar({ value, label, variant, source }: HealthBarProps) {
  const resolved = variant ?? deriveVariant(value)
  const color = VARIANT_COLORS[resolved]
  const clampedValue = Math.max(0, Math.min(100, value))

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, flex: 1, color: '#111' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{clampedValue}%</span>
      </div>
      <div style={{
        background: '#e5e7eb',
        borderRadius: 4,
        height: 8,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${clampedValue}%`,
          height: '100%',
          background: color,
          borderRadius: 4,
          transition: 'width 0.3s ease',
        }} />
      </div>
      {source && (
        <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 3 }}>{source}</div>
      )}
    </div>
  )
}
