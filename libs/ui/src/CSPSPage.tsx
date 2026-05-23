/**
 * @csps-id csps.libs.ui.CSPSPage
 * Page wrapper with pageDNA context slot.
 * Renders a standard CSPS page shell: title bar + optional context question + children.
 * Companion to pageDNA — surfaces the contextQuestion visibly for developer awareness.
 */

import type { ReactNode } from 'react'

interface CSPSPageProps {
  /** Page title displayed in the header bar */
  title: string
  /** Context question from pageDNA — "Before using this, what must be verified?" */
  contextQuestion?: string
  /** Optional subtitle under the title */
  subtitle?: string
  children: ReactNode
}

export function CSPSPage({ title, contextQuestion, subtitle, children }: CSPSPageProps) {
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
      }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#111' }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>{subtitle}</p>
        )}
      </div>

      {contextQuestion && (
        <div style={{
          background: '#eff6ff',
          borderBottom: '1px solid #bfdbfe',
          padding: '10px 24px',
          fontSize: 12,
          color: '#1e40af',
        }}>
          <strong>Context question:</strong> {contextQuestion}
        </div>
      )}

      <div style={{ padding: '24px' }}>
        {children}
      </div>
    </div>
  )
}
