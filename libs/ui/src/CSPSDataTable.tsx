/**
 * @csps-id csps.libs.ui.CSPSDataTable
 * Data display with optional sort.
 * Basic table — no heavy dependencies.
 * Columns define keys into row objects.
 * sortable=true enables click-to-sort on column headers.
 * NOTE: sorting uses client state — mark with 'use client' at the usage site
 * if the parent is a server component tree.
 */

'use client'

import { useState, type ReactNode } from 'react'

export interface TableColumn {
  /** Key in the row object */
  key: string
  /** Display header label */
  label: string
  /** Width hint, e.g. "120px" or "30%" */
  width?: string
  /** Align cell content — default "left" */
  align?: 'left' | 'center' | 'right'
}

type Row = Record<string, ReactNode>

interface CSPSDataTableProps {
  columns: TableColumn[]
  rows: Row[]
  /** Enable click-to-sort on all columns */
  sortable?: boolean
  /** Empty state message */
  emptyMessage?: string
}

export function CSPSDataTable({
  columns,
  rows,
  sortable = false,
  emptyMessage = 'No data.',
}: CSPSDataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  function handleSort(key: string) {
    if (!sortable) return
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = sortable && sortKey
    ? [...rows].sort((a, b) => {
        const av = String(a[sortKey] ?? '')
        const bv = String(b[sortKey] ?? '')
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      })
    : rows

  return (
    <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: 8 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                style={{
                  padding: '10px 14px',
                  textAlign: col.align ?? 'left',
                  fontWeight: 600,
                  color: '#374151',
                  width: col.width,
                  cursor: sortable ? 'pointer' : 'default',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {col.label}
                {sortable && sortKey === col.key && (
                  <span style={{ marginLeft: 4, fontSize: 10 }}>
                    {sortDir === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ padding: '20px 14px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : sorted.map((row, ri) => (
            <tr
              key={ri}
              style={{
                borderBottom: ri < sorted.length - 1 ? '1px solid #e5e7eb' : 'none',
                background: ri % 2 === 0 ? '#fff' : '#fafafa',
              }}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  style={{
                    padding: '10px 14px',
                    textAlign: col.align ?? 'left',
                    color: '#374151',
                  }}
                >
                  {row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
