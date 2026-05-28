import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
        <span style={{ fontWeight: 'bold' }}>CSPS Sandbox</span>
        <a href="/tasks" style={{ marginLeft: '1rem' }}>Tasks</a>
        <a href="/projects" style={{ marginLeft: '1rem' }}>Projects</a>
      </nav>
      <main style={{ padding: '1rem' }}>{children}</main>
    </div>
  )
}
