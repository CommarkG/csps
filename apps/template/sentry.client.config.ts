// CSPS TEMPLATE — replace [App Name] with your app name
// Sentry client-side initialization — loaded automatically by @sentry/nextjs
// Add SENTRY_DSN to Vercel env vars to activate error capture.
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
})
