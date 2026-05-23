/**
 * @csps-id csps.libs.ui.MetricBadge
 * Compact MDPE / coverage metric display.
 * Format: "[value][unit] [label]"
 * Used in dashboards and summary cards.
 */


type MetricUnit = '%' | 'count' | 'score' | 'ms' | 'x'

interface MetricBadgeProps {
  /** Numeric or string value to display */
  value: number | string
  /** Short label describing the metric */
  label: string
  /** Unit suffix appended to value */
  unit?: MetricUnit
  /** Optional color override — defaults to #374151 */
  color?: string
}

export function MetricBadge({ value, label, unit, color = '#374151' }: MetricBadgeProps) {
  const suffix = unit === '%' ? '%' : unit === 'x' ? '×' : unit === 'ms' ? 'ms' : ''
  const prefix = unit === 'score' ? '⭑ ' : ''

  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      padding: '8px 14px',
      minWidth: 80,
    }}>
      <span style={{
        fontSize: 20,
        fontWeight: 700,
        color,
        lineHeight: 1.2,
        fontFamily: 'system-ui, sans-serif',
      }}>
        {prefix}{value}{suffix}
      </span>
      <span style={{ fontSize: 10, color: '#9ca3af', marginTop: 3, textAlign: 'center' }}>
        {label}
      </span>
    </div>
  )
}
