// libs/integrations/monitoring/sentry.ts
// S033-C: Server-side Sentry error capture helpers.
//
// IMPORTANT: apps must call Sentry.init() in their instrumentation.ts before
// captureException works. This module only wraps the capture functions.
// Without init(), calls are graceful no-ops.
//
// Setup per app:
//   1. pnpm add --filter [app] @sentry/nextjs
//   2. Create [app]/instrumentation.ts with Sentry.init({ dsn: process.env.SENTRY_DSN })
//   3. Add SENTRY_DSN to Vercel env vars
//
// For client-side: install @sentry/nextjs in each app — server-side helpers only here.

type SentryLevel = 'info' | 'warning' | 'error'

function getSentry() {
  const dsn = process.env.SENTRY_DSN
  if (!dsn) return null
  try {
    return require('@sentry/node')
  } catch {
    return null
  }
}

export function captureException(error: unknown, context?: Record<string, unknown>): void {
  const Sentry = getSentry()
  if (!Sentry) {
    console.error('[csps/monitoring] Sentry not configured — error not captured:', error)
    return
  }
  Sentry.withScope((scope: { setExtras: (ctx: Record<string, unknown>) => void }) => {
    if (context) scope.setExtras(context)
    Sentry.captureException(error)
  })
}

export function captureMessage(message: string, level: SentryLevel = 'info'): void {
  const Sentry = getSentry()
  if (!Sentry) {
    console.log(`[csps/monitoring] Sentry not configured — message not captured: [${level}] ${message}`)
    return
  }
  Sentry.captureMessage(message, level)
}
