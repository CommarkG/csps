// Habit Tracker dashboard — list habits + 7-day check grid + add/delete habits
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import type { CspsSessionClaims } from '@csps/integrations'
import { db } from '@/lib/db'

type Habit = { id: string; name: string; deletedAt: Date | null }

export const dynamic = 'force-dynamic'

function todayUTC() {
  const d = new Date()
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

function last7Days() {
  const days: Date[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(todayUTC())
    d.setUTCDate(d.getUTCDate() - i)
    days.push(d)
  }
  return days
}

export default async function DashboardPage() {
  const { userId, sessionClaims } = await auth()
  if (!userId) redirect('/sign-in')

  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) redirect('/sign-in')

  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) redirect('/sign-in')

  const days = last7Days()
  const weekStart = days[0]

  const [habits, logs] = await Promise.all([
    db.habit.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    }),
    db.habitLog.findMany({
      where: { tenantId, date: { gte: weekStart } },
    }),
  ])

  const logSet = new Set(logs.map((l: { habitId: string; date: Date }) => `${l.habitId}:${l.date.toISOString().slice(0, 10)}`))
  const today = todayUTC().toISOString().slice(0, 10)
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Habit Tracker</h1>
      <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '2rem' }}>
        {cspsUser.displayName ?? cspsUser.email}
      </p>

      {/* Add habit form */}
      <form action="/api/habits" method="POST" style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <input
          name="name"
          required
          placeholder="New habit (e.g. Exercise, Read, Meditate)"
          style={{
            flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #d1d5db',
            borderRadius: 6, fontSize: '0.875rem', outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem', background: '#111827', color: '#fff',
            border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.875rem',
          }}
        >
          Add
        </button>
      </form>

      {habits.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
          <p style={{ fontSize: '1rem' }}>No habits yet.</p>
          <p style={{ fontSize: '0.875rem' }}>Add your first habit above to start tracking.</p>
        </div>
      ) : (
        <div>
          {/* Day header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr repeat(7, 2rem)', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
            <div />
            {days.map(d => {
              const isToday = d.toISOString().slice(0, 10) === today
              return (
                <div key={d.toISOString()} style={{
                  textAlign: 'center', fontSize: '0.625rem',
                  color: isToday ? '#111827' : '#9ca3af',
                  fontWeight: isToday ? 700 : 400,
                }}>
                  {dayLabels[d.getUTCDay()]}
                </div>
              )
            })}
          </div>

          {/* Habit rows */}
          {(habits as Habit[]).map(habit => {
            const streak = days.filter(d => logSet.has(`${habit.id}:${d.toISOString().slice(0, 10)}`)).length
            return (
              <div
                key={habit.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr repeat(7, 2rem)',
                  gap: '0.5rem',
                  alignItems: 'center',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{habit.name}</span>
                  {streak === 7 && <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>🔥</span>}
                </div>
                {days.map(d => {
                  const dateStr = d.toISOString().slice(0, 10)
                  const checked = logSet.has(`${habit.id}:${dateStr}`)
                  const isToday = dateStr === today
                  return (
                    <form key={dateStr} action={checked ? `/api/habits/${habit.id}/log?date=${dateStr}&_method=DELETE` : `/api/habits/${habit.id}/log`} method="POST">
                      <input type="hidden" name="date" value={dateStr} />
                      <button
                        type="submit"
                        style={{
                          width: '2rem', height: '2rem',
                          borderRadius: '50%',
                          border: isToday ? '2px solid #111827' : '1px solid #e5e7eb',
                          background: checked ? '#111827' : '#fff',
                          color: checked ? '#fff' : '#d1d5db',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                        title={checked ? 'Uncheck' : 'Check off'}
                      >
                        {checked ? '✓' : ''}
                      </button>
                    </form>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
