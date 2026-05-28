// Projects page — validates Project + Task relationship against real DB
// Schema source: libs/policies/slices/public/project.zmodel
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export default async function ProjectsPage() {
  const { userId } = await auth()
  if (!userId) return null

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user?.tenantId) {
    return <div>No active tenant. Sign in via Clerk org to continue.</div>
  }

  const projects = await db.project.findMany({
    where: { tenantId: user.tenantId, deletedAt: null },
    include: { _count: { select: { tasks: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1>Projects ({projects.length})</h1>
      <ul>
        {projects.map(project => (
          <li key={project.id} style={{ marginBottom: '0.5rem' }}>
            <strong>{project.name}</strong>
            {' '}
            <span style={{ color: '#6b7280' }}>[{project.status}] {project._count.tasks} tasks</span>
          </li>
        ))}
        {projects.length === 0 && <li style={{ color: '#9ca3af' }}>No projects yet.</li>}
      </ul>
    </div>
  )
}
