// ZenStack enhanced PrismaClient — multi-tenant isolation via @@allow/@@deny policies
// BudgetCategory + Transaction are tenant-scoped: reads/writes filtered by auth().tenantId
// Platform inheritance: no custom logic needed — ZenStack policies enforce isolation

import { enhance } from '@zenstackhq/runtime'
import { db } from './db'

export type ZenstackUserCtx = {
  id: string
  tenantId?: string | null
  role?: string | null
  staffRole?: string | null
}

export function getEnhancedDb(user: ZenstackUserCtx) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return enhance(db as any, { user }) as typeof db
}
