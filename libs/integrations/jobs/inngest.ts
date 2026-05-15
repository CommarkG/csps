// libs/integrations/jobs/inngest.ts
// S033-B: Platform Inngest client shared across all CSPS apps.
// Import this in API route handlers and job functions.

import { Inngest } from 'inngest'

if (!process.env.INNGEST_SIGNING_KEY && process.env.NODE_ENV === 'production') {
  console.warn('[csps/jobs] INNGEST_SIGNING_KEY not set — Inngest events will not be verified in production')
}

export const inngest = new Inngest({
  id: 'csps',
  signingKey: process.env.INNGEST_SIGNING_KEY,
})
