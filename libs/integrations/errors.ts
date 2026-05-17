// CSPS standard error response shapes — L1 convention (not Core Primitive)
// wiring_deferred_until: S039 (used in API routes via direct import — not top-level app import)
// Shared pattern: apps may extend via their own error types.
// Opus S022: remove renewal_url from L1. Error shape = { error, message, details? }

export interface CspsError {
  error: string                           // machine-readable code (e.g., 'subscription_inactive')
  message: string                         // developer-facing description
  details?: Record<string, unknown>       // app-specific extensions (e.g., { required: 'admin+' })
}

export function createError(
  error: string,
  message: string,
  details?: Record<string, unknown>
): CspsError {
  return { error, message, ...(details ? { details } : {}) }
}

// Common error codes (platform-level)
export const ERRORS = {
  UNAUTHORIZED:          (msg = 'Unauthorized') => createError('unauthorized', msg),
  FORBIDDEN:             (msg = 'Forbidden') => createError('forbidden', msg),
  NOT_FOUND:             (msg = 'Not found') => createError('not_found', msg),
  SUBSCRIPTION_INACTIVE: () => createError('subscription_inactive', 'Subscription inactive. Renew to continue writing.'),
  PERMISSION_DENIED:     (required: string) => createError('permission_denied', `Requires ${required} role.`, { required }),
  USER_NOT_FOUND:        () => createError('user_not_found', 'User not found in CSPS database.'),
  SEAT_LIMIT:            (max: number) => createError('seat_limit_reached', `Seat limit of ${max} reached.`, { max_seats: max }),
} as const
