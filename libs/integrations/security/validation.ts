// libs/integrations/security/validation.ts
// wiring_deferred_until: S039 (schemas wired in individual API routes — not top-level app import)
// S032-C: Common Zod validation schemas for CSPS API routes.
// Import in API routes to validate request params/body.

import { z } from 'zod'

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export const IdSchema = z.string().uuid({ message: 'Invalid ID format' })

export const TenantScopeSchema = z.object({
  tenantId: z.string().uuid({ message: 'Invalid tenant ID' }),
})

export const DateRangeSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
}).refine(
  ({ from, to }) => !from || !to || from <= to,
  { message: 'from must be before or equal to to' }
)

export type Pagination = z.infer<typeof PaginationSchema>
export type DateRange = z.infer<typeof DateRangeSchema>
