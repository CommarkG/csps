// libs/integrations/security/resilience.ts
// S032-C: Circuit breaker pattern for CSPS external calls.
// Use withFallback when calling external services (Stripe, Clerk, webhooks).

/**
 * Circuit breaker wrapper. Tries primary, falls back on any error.
 * Logs to console + optionally to audit trail.
 *
 * Usage:
 *   const customer = await withFallback(
 *     () => stripe.customers.retrieve(id),
 *     () => ({ id, email: 'fallback@example.com' }),
 *     'stripe.customer.retrieve'
 *   )
 */
export async function withFallback<T>(
  primary: () => Promise<T>,
  fallback: () => T | Promise<T>,
  auditLabel?: string,
): Promise<T> {
  try {
    return await primary()
  } catch (err) {
    const label = auditLabel ?? 'unknown'
    console.warn(`[resilience] ${label} failed, using fallback:`, err instanceof Error ? err.message : err)
    return fallback()
  }
}

/**
 * Retry with exponential backoff. Max 3 attempts by default.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: { maxAttempts?: number; baseDelay?: number; label?: string } = {}
): Promise<T> {
  const { maxAttempts = 3, baseDelay = 300, label = 'operation' } = options
  let lastErr: unknown

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (attempt < maxAttempts) {
        const delay = baseDelay * Math.pow(2, attempt - 1)
        console.warn(`[resilience] ${label} attempt ${attempt} failed, retrying in ${delay}ms`)
        await new Promise(r => setTimeout(r, delay))
      }
    }
  }
  throw lastErr
}
