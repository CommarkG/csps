/**
 * @csps-id csps.libs.ui.GapCard
 * Display a gap / improvement register entry.
 * K count = how many sessions this gap has recurred (k_count).
 * Status chip: open=amber, resolved=green, deferred=gray.
 */


type GapStatus = 'open' | 'resolved' | 'deferred'

interface GapCardProps {
  /** Gap identifier, e.g. "GAP-012" */
  id: string
  /** Recurrence count — how many sessions this gap appeared */
  k_count: number
  /** Current resolution status */
  status: GapStatus
  /** Short description of the gap */
  observation: string
  /** Optional: what structural fix was committed */
  structural_fix?: string
}

const STATUS_COLORS: Record<GapStatus, { bg: string; color: string; label: string }> = {
  open:     { bg: '#fef3c7', color: '#92400e', label: 'OPEN' },
  resolved: { bg: '#dcfce7', color: '#166534', label: 'RESOLVED' },
  deferred: { bg: '#f3f4f6', color: '#6b7280', label: 'DEFERRED' },
}

export function GapCard({ id, k_count, status, observation, structural_fix }: GapCardProps) {
  const s = STATUS_COLORS[status]
  const kColor = k_count >= 3 ? '#dc2626' : k_count >= 2 ? '#ca8a04' : '#6b7280'

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      padding: '12px 16px',
      marginBottom: 10,
      background: '#fff',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#374151', fontFamily: 'monospace' }}>{id}</span>
        <span style={{
          background: '#f3f4f6',
          color: kColor,
          border: `1px solid ${kColor}`,
          borderRadius: 3,
          padding: '1px 6px',
          fontSize: 10,
          fontWeight: 700,
        }}>k={k_count}</span>
        <span style={{
          background: s.bg,
          color: s.color,
          borderRadius: 3,
          padding: '1px 6px',
          fontSize: 10,
          fontWeight: 700,
          marginLeft: 'auto',
        }}>{s.label}</span>
      </div>
      <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>{observation}</p>
      {structural_fix && (
        <p style={{ fontSize: 11, color: '#6b7280', margin: '6px 0 0' }}>
          ✓ Fix: {structural_fix}
        </p>
      )}
    </div>
  )
}
