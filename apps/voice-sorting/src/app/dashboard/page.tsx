// APP-001 E1 — Vault (deferred to E2 full implementation)
// E1: captures go directly to homepage; Vault is the review view
import { redirect } from 'next/navigation'

export default function DashboardPage() {
  redirect('/')
}
