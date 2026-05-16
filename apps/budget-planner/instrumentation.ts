// apps/budget-planner/instrumentation.ts
// @csps-enforces P-OPER-002 (monitoring configured at creation, not as afterthought)
// Next.js instrumentation hook — initializes Sentry on Node.js runtime if SENTRY_DSN is set.
// Per libs/integrations/monitoring/sentry.ts setup notes (S033-C).
//
// GOVERNOR ACTION REQUIRED before Sentry captures errors:
//   pnpm add --filter apps/budget-planner @sentry/nextjs
//   Add SENTRY_DSN to Vercel env vars
//
// No-op if SENTRY_DSN is unset or @sentry/nextjs is not installed (graceful passthrough).

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const dsn = process.env.SENTRY_DSN
    if (!dsn) return
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Sentry = await import('@sentry/nextjs' as any)
      Sentry.init({
        dsn,
        environment: process.env.NODE_ENV ?? 'production',
        tracesSampleRate: 0.1,
      })
    } catch {
      console.warn('[instrumentation] @sentry/nextjs not installed — Sentry init skipped')
    }
  }
}
