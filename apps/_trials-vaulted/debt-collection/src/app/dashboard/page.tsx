// Debt Collection — Dashboard
// PROTO-K-A Phase 1 | Session S060

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { CspsSessionClaims } from '@csps/integrations'
import { db } from '@/lib/db'
import { DashboardShell } from '@csps/components'
import { track } from '@csps/integrations/monitoring/posthog'
import { readDebts } from '@/lib/debts'
import type { Debt } from '@/lib/debts'

// pageDNA — CSPS governance. const, NOT export const.
const pageDNA = {
  purpose: 'See who owes you money and take action with one click.',
  voiceProfile: 'colleague',
  options: ['Add new debt', 'Send reminder', 'Mark as paid'],
  nextStep: '/create',
  relatedPages: ['/create', '/message'],
}

const NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { label: 'Add Debt', href: '/create', icon: '➕' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
]

const STATUS_LABELS: Record<Debt['status'], string> = {
  pending: 'Pending',
  message_sent: 'Message sent',
  paid: 'Paid',
}

const STATUS_COLORS: Record<Debt['status'], string> = {
  pending: '#f59e0b',
  message_sent: '#3b82f6',
  paid: '#10b981',
}

const CURRENCY_SYMBOLS: Record<string, string> = { ILS: '₪', USD: '$', EUR: '€' }

function formatAmount(amount: number, currency: string): string {
  return `${CURRENCY_SYMBOLS[currency] ?? currency}${amount.toLocaleString('en-US')}`
}

export default async function DashboardPage() {
  const { userId, sessionClaims } = await auth()
  if (!userId) redirect('/sign-in')

  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) redirect('/account-setup')

  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) redirect('/sign-in')

  track(cspsUser.id, 'dashboard_viewed', { tenantId, appName: 'Debt Collection' })

  const allDebts = readDebts()
  const activeDebts = allDebts.filter(d => d.status !== 'paid')
  const totalByCurrency = activeDebts.reduce<Record<string, number>>((acc, d) => {
    acc[d.currency] = (acc[d.currency] ?? 0) + d.amount
    return acc
  }, {})

  return (
    <DashboardShell state={allDebts.length === 0 ? 'empty' : 'loaded'} nav={NAV}>
      <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '800px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Debt Collection</h1>
            <p style={{ color: '#6b7280', margin: '0.25rem 0 0', fontSize: '0.875rem' }}>
              {pageDNA.purpose}
            </p>
          </div>
          <Link href="/create" style={{
            background: '#1d4ed8', color: '#fff', padding: '0.5rem 1.25rem',
            borderRadius: '6px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
          }}>
            + Add debt
          </Link>
        </div>

        {/* Summary bar */}
        {activeDebts.length > 0 && (
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '0.75rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#9a3412', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Outstanding</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1c1917', marginTop: '0.25rem' }}>
                {activeDebts.length} {activeDebts.length === 1 ? 'debt' : 'debts'}
              </div>
            </div>
            {Object.entries(totalByCurrency).map(([currency, total]) => (
              <div key={currency} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.75rem 1.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{currency} Total</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1c1917', marginTop: '0.25rem' }}>{formatAmount(total, currency)}</div>
              </div>
            ))}
          </div>
        )}

        {/* Debt list / empty state */}
        {allDebts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed #e5e7eb', borderRadius: '12px', color: '#6b7280' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
            <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151', margin: '0 0 0.5rem' }}>No debts tracked</p>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.875rem' }}>Add one to get started →</p>
            <Link href="/create" style={{
              background: '#1d4ed8', color: '#fff', padding: '0.625rem 1.5rem',
              borderRadius: '6px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
            }}>
              Add your first debt
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {allDebts.map(debt => (
              <div key={debt.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                background: debt.status === 'paid' ? '#f9fafb' : '#fff',
                border: '1px solid #e5e7eb', borderRadius: '10px',
                opacity: debt.status === 'paid' ? 0.6 : 1,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '1rem', color: '#111827' }}>{debt.debtor_name}</span>
                    <span style={{
                      fontSize: '0.6875rem', fontWeight: 600, padding: '0.125rem 0.5rem',
                      borderRadius: '100px', background: STATUS_COLORS[debt.status] + '20',
                      color: STATUS_COLORS[debt.status], textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>
                      {STATUS_LABELS[debt.status]}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {debt.description} · Due {debt.due_date}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.125rem', color: '#1c1917' }}>
                    {formatAmount(debt.amount, debt.currency)}
                  </span>
                  {debt.status !== 'paid' && (
                    <Link href={`/message?id=${debt.id}`} style={{
                      background: '#f3f4f6', color: '#374151', padding: '0.375rem 0.875rem',
                      borderRadius: '6px', textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 500, whiteSpace: 'nowrap',
                    }}>
                      Send message →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* RelatedPages: /create, /message */}
      </div>
    </DashboardShell>
  )
}
