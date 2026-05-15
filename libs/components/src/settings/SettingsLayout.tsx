// libs/components/src/settings/SettingsLayout.tsx
// S034-B: Settings page layout — vertical tab sidebar + content pane.
// Used for app settings pages (profile, billing, team, integrations, etc.)

import React from 'react'

type SettingsTab = {
  id: string
  label: string
  href: string
}

type SettingsLayoutProps = {
  tabs: SettingsTab[]
  children: React.ReactNode
  currentTab: string
}

export function SettingsLayout({ tabs, children, currentTab }: SettingsLayoutProps) {
  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: 1000, margin: '0 auto' }}>
      {/* Tab sidebar */}
      <nav style={{ width: 200, flexShrink: 0 }}>
        {tabs.map(tab => (
          <a
            key={tab.id}
            href={tab.href}
            style={{
              display: 'block',
              padding: '0.5rem 0.75rem',
              borderRadius: 6,
              color: tab.id === currentTab ? '#111827' : '#6b7280',
              background: tab.id === currentTab ? '#f3f4f6' : 'transparent',
              fontWeight: tab.id === currentTab ? 600 : 400,
              textDecoration: 'none',
              fontSize: '0.875rem',
              marginBottom: '0.125rem',
            }}
          >
            {tab.label}
          </a>
        ))}
      </nav>

      {/* Content pane */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {children}
      </div>
    </div>
  )
}
