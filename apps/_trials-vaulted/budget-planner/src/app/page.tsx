// Root route — redirects authenticated users to /dashboard.
// Dashboard content lives at apps/budget-planner/src/app/dashboard/page.tsx

import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/dashboard')
}
