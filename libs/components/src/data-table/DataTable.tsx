// libs/components/src/data-table/DataTable.tsx
// S034-C: Generic typed data table with sort, filter, bulk actions, pagination, CSV export.
// Usage: <DataTable<User> columns={[...]} data={users} pagination={{...}} />

import React, { useState, useMemo } from 'react'

type SortDir = 'asc' | 'desc'

type Column<T> = {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

type PaginationConfig = {
  page: number
  pageSize: number
  total: number
  onChange: (page: number) => void
}

type DataTableProps<T extends Record<string, unknown>> = {
  columns: Column<T>[]
  data: T[]
  onSort?: (key: keyof T, dir: SortDir) => void
  onFilter?: (query: string) => void
  onBulkAction?: (selected: T[], action: string) => void
  bulkActions?: { id: string; label: string }[]
  pagination?: PaginationConfig
  rowKey?: keyof T
}

function exportToCSV<T extends Record<string, unknown>>(columns: Column<T>[], data: T[]) {
  const header = columns.map(c => c.label).join(',')
  const rows = data.map(row =>
    columns.map(c => {
      const val = row[c.key]
      const str = val === null || val === undefined ? '' : String(val)
      return str.includes(',') ? `"${str}"` : str
    }).join(',')
  )
  const csv = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'export.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onSort,
  onFilter,
  onBulkAction,
  bulkActions,
  pagination,
  rowKey,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [filterQuery, setFilterQuery] = useState('')
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const handleSort = (key: keyof T) => {
    const newDir = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc'
    setSortKey(key)
    setSortDir(newDir)
    onSort?.(key, newDir)
  }

  const handleFilter = (q: string) => {
    setFilterQuery(q)
    onFilter?.(q)
  }

  const toggleRow = (idx: number) => {
    const next = new Set(selected)
    if (next.has(idx)) next.delete(idx)
    else next.add(idx)
    setSelected(next)
  }

  const toggleAll = () => {
    setSelected(selected.size === data.length ? new Set() : new Set(data.map((_, i) => i)))
  }

  const selectedRows = useMemo(() => data.filter((_, i) => selected.has(i)), [data, selected])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', gap: '0.75rem' }}>
        <input
          type="text"
          placeholder="Search…"
          value={filterQuery}
          onChange={e => handleFilter(e.target.value)}
          style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem', width: 220 }}
        />
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {selected.size > 0 && bulkActions?.map(action => (
            <button
              key={action.id}
              onClick={() => onBulkAction?.(selectedRows, action.id)}
              style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 6, cursor: 'pointer', background: '#fff' }}
            >
              {action.label} ({selected.size})
            </button>
          ))}
          <button
            onClick={() => exportToCSV(columns, data)}
            style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 6, cursor: 'pointer', background: '#fff' }}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {onBulkAction && (
                <th style={{ padding: '0.75rem', width: 40, textAlign: 'center' }}>
                  <input type="checkbox" checked={selected.size === data.length && data.length > 0} onChange={toggleAll} />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                  }}
                >
                  {col.label}
                  {col.sortable && sortKey === col.key && (sortDir === 'asc' ? ' ↑' : ' ↓')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (onBulkAction ? 1 : 0)}
                  style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}
                >
                  No data
                </td>
              </tr>
            )}
            {data.map((row, idx) => (
              <tr
                key={rowKey ? String(row[rowKey]) : idx}
                style={{ borderBottom: '1px solid #f3f4f6', background: selected.has(idx) ? '#f0f9ff' : '#fff' }}
              >
                {onBulkAction && (
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <input type="checkbox" checked={selected.has(idx)} onChange={() => toggleRow(idx)} />
                  </td>
                )}
                {columns.map(col => (
                  <td key={String(col.key)} style={{ padding: '0.75rem 1rem', color: '#374151' }}>
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', color: '#6b7280', fontSize: '0.875rem' }}>
          <span>
            {((pagination.page - 1) * pagination.pageSize) + 1}–{Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => pagination.onChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              style={{ padding: '0.375rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 4, cursor: pagination.page > 1 ? 'pointer' : 'default', background: '#fff' }}
            >
              ←
            </button>
            <button
              onClick={() => pagination.onChange(pagination.page + 1)}
              disabled={pagination.page * pagination.pageSize >= pagination.total}
              style={{ padding: '0.375rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 4, cursor: pagination.page * pagination.pageSize < pagination.total ? 'pointer' : 'default', background: '#fff' }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// wiring_deferred_until: S036-B2 — DataTable wired when App #3 has list views
