/**
 * @csps-id csps.libs.ui.JourneyStep
 * One step in a developer / user journey visualization.
 * Status colors match HealthBar variant pattern:
 *   ACTIVE = green, PARTIAL = amber, NOT_BUILT = gray (muted)
 * Used in /platform/developer-journey and /platform/user-journey pages.
 */


type JourneyStatus = 'ACTIVE' | 'PARTIAL' | 'NOT_BUILT'

interface JourneyOption {
  label: string
  friction: number
  value: number
  status: JourneyStatus
  note?: string
}

interface JourneyStepProps {
  /** Step number (1, 2, 3…) */
  step: number
  /** Stage name, e.g. "Stage 1 — ORIENT" */
  name: string
  /** Overall status of this stage (derived from options or explicit) */
  status?: JourneyStatus
  /** Stage description */
  description: string
  /** Exit criterion text */
  exit: string
  /** Options available at this stage */
  options: JourneyOption[]
}

const STATUS_STYLE: Record<JourneyStatus, { label: string; color: string; bg: string }> = {
  ACTIVE:    { label: 'ACTIVE',     color: '#166534', bg: '#dcfce7' },
  PARTIAL:   { label: 'PARTIAL',    color: '#92400e', bg: '#fef3c7' },
  NOT_BUILT: { label: 'NOT BUILT',  color: '#6b7280', bg: '#f3f4f6' },
}

function Dots({ n, color }: { n: number; color: string }) {
  return (
    <span style={{ fontFamily: 'monospace', fontSize: 11, color }}>
      {'●'.repeat(n)}{'○'.repeat(5 - n)}
    </span>
  )
}

function StatusChip({ status }: { status: JourneyStatus }) {
  const s = STATUS_STYLE[status]
  return (
    <span style={{
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.color}`,
      borderRadius: 4,
      padding: '2px 8px',
      fontSize: 11,
      fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>{s.label}</span>
  )
}

export function JourneyStep({ step: _step, name, description, exit, options }: JourneyStepProps) {
  const activeCount = options.filter(o => o.status === 'ACTIVE').length

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      marginBottom: 16,
      overflow: 'hidden',
      background: '#fff',
    }}>
      {/* Stage header */}
      <div style={{
        background: '#f9fafb',
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#111' }}>{name}</h3>
          <span style={{ fontSize: 12, color: '#6b7280' }}>{activeCount}/{options.length} active</span>
        </div>
        <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>{description}</p>
      </div>

      {/* Options table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#fafafa' }}>
            {['Option', 'Friction', 'Value', 'Status'].map(h => (
              <th key={h} style={{
                padding: '8px 12px',
                textAlign: h === 'Option' ? 'left' : 'center',
                fontWeight: 600,
                color: '#6b7280',
                borderBottom: '1px solid #e5e7eb',
                paddingLeft: h === 'Option' ? 16 : 12,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {options.map((opt, oi) => (
            <tr key={oi} style={{
              borderBottom: oi < options.length - 1 ? '1px solid #e5e7eb' : 'none',
            }}>
              <td style={{ padding: '10px 16px' }}>
                <div style={{ fontWeight: 500, color: '#111' }}>{opt.label}</div>
                {opt.note && (
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{opt.note}</div>
                )}
              </td>
              <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                <Dots n={opt.friction} color="#ca8a04" />
              </td>
              <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                <Dots n={opt.value} color="#16a34a" />
              </td>
              <td style={{ padding: '10px 12px' }}>
                <StatusChip status={opt.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Exit criterion footer */}
      <div style={{
        padding: '8px 16px',
        background: '#fafafa',
        borderTop: '1px solid #e5e7eb',
        fontSize: 12,
        color: '#6b7280',
      }}>
        <strong>Exit:</strong> {exit}
      </div>
    </div>
  )
}
