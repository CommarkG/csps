// Tasks page — validates Task schema against real DB
// Schema source: libs/policies/slices/public/task.zmodel
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export default async function TasksPage() {
  const { userId } = await auth()
  if (!userId) return null

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user?.tenantId) {
    return <div>No active tenant. Sign in via Clerk org to continue.</div>
  }

  const tasks = await db.task.findMany({
    where: { tenantId: user.tenantId, deletedAt: null },
    include: { assignee: true, project: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div>
      <h1>Tasks ({tasks.length})</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.id} style={{ marginBottom: '0.5rem' }}>
            <strong>{task.title}</strong>
            {' '}
            <span style={{ color: '#6b7280' }}>[{task.status}]</span>
            {task.assignee && <span style={{ marginLeft: '0.5rem' }}>→ {task.assignee.displayName ?? task.assignee.email}</span>}
          </li>
        ))}
        {tasks.length === 0 && <li style={{ color: '#9ca3af' }}>No tasks yet.</li>}
      </ul>
    </div>
  )
}
