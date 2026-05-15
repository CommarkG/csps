// libs/components/src/dashboard/DashboardShell.tsx
// S034-B: Platform dashboard shell — sidebar nav + main content area + 4 states.
// Used by all CSPS apps as the outer wrapper for authenticated dashboard pages.

import React from 'react'

type NavItem = {
  label: string
  href: string
  icon?: string
}

type DashboardState = 'empty' | 'loading' | 'loaded' | 'error'

type DashboardShellProps = {
  children: React.ReactNode
  state?: DashboardState
  nav: NavItem[]
  emptyContent?: React.ReactNode
  errorContent?: React.ReactNode
}

function Sidebar({ nav }: { nav: NavItem[] }) {
  return (
    <nav style={{
      width: 220,
      minHeight: '100vh',
      borderRight: '1px solid #e5e7eb',
      padding: '1.5rem 1rem',
      background: '#f9fafb',
      flexShrink: 0,
    }}>
      {nav.map(item => (
        <a
          key={item.href}
          href={item.href}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: 6,
            color: '#374151',
            textDecoration: 'none',
            fontSize: '0.875rem',
            marginBottom: '0.25rem',
          }}
        >
          {item.icon && <span style={{ fontSize: '1rem' }}>{item.icon}</span>}
          {item.label}
        </a>
      ))}
    </nav>
  )
}

function LoadingState() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#9ca3af', fontSize: '0.875rem' }}>
      Loading…
    </div>
  )
}

function EmptyState({ content }: { content?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      {content ?? (
        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
          <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Nothing here yet</p>
          <p style={{ fontSize: '0.875rem' }}>Get started by creating your first item.</p>
        </div>
      )}
    </div>
  )
}

function ErrorState({ content }: { content?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      {content ?? (
        <div style={{ textAlign: 'center', color: '#dc2626' }}>
          <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Something went wrong</p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Refresh the page or contact support.</p>
        </div>
      )}
    </div>
  )
}

export function DashboardShell({
  children,
  state = 'loaded',
  nav,
  emptyContent,
  errorContent,
}: DashboardShellProps) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <Sidebar nav={nav} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {state === 'loading' && <LoadingState />}
        {state === 'empty' && <EmptyState content={emptyContent} />}
        {state === 'error' && <ErrorState content={errorContent} />}
        {state === 'loaded' && children}
      </main>
    </div>
  )
}
