import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import type { CspsSessionClaims } from '@csps/integrations'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

const STATUS_LABELS: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
  cancelled: 'Cancelled',
}

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-blue-100 text-blue-700',
  none: 'bg-gray-100 text-gray-500',
}

export default async function TasksPage() {
  const { userId, sessionClaims } = await auth()
  if (!userId) redirect('/sign-in')

  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId

  if (!tenantId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">No organization yet</h1>
          <p className="text-gray-600 mb-6">
            Create or join an organization to start managing tasks.
            Your Clerk organization becomes your team workspace.
          </p>
          <p className="text-sm text-gray-400">
            After creating an org, sign out and back in to sync your session.
          </p>
        </div>
      </div>
    )
  }

  const tasks = await db.task.findMany({
    where: { tenantId, deletedAt: null },
    include: {
      project: { select: { id: true, name: true } },
      assignee: { select: { id: true, displayName: true, email: true } },
    },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
  })

  const grouped = tasks.reduce<Record<string, typeof tasks>>((acc, task) => {
    const s = task.status
    if (!acc[s]) acc[s] = []
    acc[s].push(task)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Tasks</h1>
        <div className="flex items-center gap-4">
          <Link
            href="/tasks/new"
            className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            + New task
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto p-6">
        {tasks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No tasks yet.</p>
            <Link
              href="/tasks/new"
              className="text-gray-900 font-medium underline underline-offset-2"
            >
              Create your first task
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {(['todo', 'in_progress', 'done', 'cancelled'] as const).map((status) => {
              const group = grouped[status]
              if (!group?.length) return null
              return (
                <section key={status}>
                  <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                    {STATUS_LABELS[status]} ({group.length})
                  </h2>
                  <div className="space-y-2">
                    {group.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center gap-3 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${status === 'done' || status === 'cancelled' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                            {task.title}
                          </p>
                          {task.project && (
                            <p className="text-xs text-gray-400 mt-0.5">{task.project.name}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {task.priority !== 'none' && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[task.priority]}`}>
                              {task.priority}
                            </span>
                          )}
                          {task.assignee && (
                            <span className="text-xs text-gray-400">
                              {task.assignee.displayName ?? task.assignee.email.split('@')[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
