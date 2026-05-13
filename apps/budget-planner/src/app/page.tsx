// Dashboard entry point — checks wizard completion before showing any data
// Non-skippable gate: redirects to /budget-setup if BudgetGoal doesn't exist
// This is the server-side enforcement of P-META-022: no dashboard without crystallized intent

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import type { CspsSessionClaims } from '@csps/integrations'
import { db } from '@/lib/db'
import { getEnhancedDb } from '@/lib/zenstack'

type Tx = { id: string; type: string; amount: number; note: string | null }
type Cat = { id: string; name: string; type: string; monthlyLimit: number | null }

export default async function DashboardPage() {
  const { userId, sessionClaims } = await auth()

  if (!userId) redirect('/sign-in')

  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) redirect('/sign-in')

  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) redirect('/sign-in')

  const edb = getEnhancedDb({ id: cspsUser.id, tenantId, staffRole: cspsUser.staffRole })

  // Threshold Wizard gate — non-skippable (server-side enforcement)
  const budgetGoal = await edb.budgetGoal.findUnique({ where: { tenantId } }) as { tenantId: string; goalStatement: string } | null
  if (!budgetGoal) redirect('/budget-setup')

  // Fetch current month balance
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const [categories, transactions] = await Promise.all([
    edb.budgetCategory.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    }),
    edb.transaction.findMany({
      where: { tenantId, deletedAt: null, date: { gte: monthStart, lt: monthEnd } },
      orderBy: [{ date: 'desc' }],
      take: 20,
    }),
  ]) as [Cat[], Tx[]]

  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = income - expenses
  const period = `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Budget Planner</h1>
      <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.875rem' }}>
        Your goal: <em>&ldquo;{budgetGoal.goalStatement}&rdquo;</em>
      </p>

      {/* Balance summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Income', value: income, color: '#16a34a' },
          { label: 'Expenses', value: expenses, color: '#dc2626' },
          { label: 'Balance', value: balance, color: balance >= 0 ? '#16a34a' : '#dc2626' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#f9fafb', borderRadius: 8, padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>{label}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color }}>${Math.abs(value).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <p style={{ color: '#999', fontSize: '0.75rem', marginBottom: '2rem', textAlign: 'center' }}>{period}</p>

      {/* Categories */}
      {categories.length > 0 ? (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#374151' }}>Categories</h2>
          {categories.map((cat: Cat) => (
            <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f9fafb', borderRadius: 6, marginBottom: '0.5rem' }}>
              <span>{cat.name}</span>
              <span style={{ color: cat.type === 'income' ? '#16a34a' : '#dc2626', fontSize: '0.875rem' }}>
                {cat.type} {cat.monthlyLimit ? `· $${cat.monthlyLimit}/mo limit` : ''}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '2rem', background: '#f9fafb', borderRadius: 8, textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ color: '#666' }}>No categories yet.</p>
          <p style={{ color: '#999', fontSize: '0.875rem' }}>Use the API to add your first category: <code>POST /api/budget/categories</code></p>
        </div>
      )}

      {/* Recent transactions */}
      {transactions.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#374151' }}>Recent transactions</h2>
          {transactions.slice(0, 10).map((t: Tx) => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.875rem' }}>
              <span style={{ color: '#374151' }}>{t.note ?? 'Transaction'}</span>
              <span style={{ color: t.type === 'income' ? '#16a34a' : '#dc2626', fontWeight: 500 }}>
                {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
