// CSPS TEMPLATE — replace [App Name] with your app name
// ZenStack enhanced client — tenant isolation via @@allow/@@deny policies in schema.zmodel
// All queries through edb are automatically scoped to the authenticated tenant.

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
