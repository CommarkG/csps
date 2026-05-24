// CSPS TEMPLATE — replace [App Name] with your app name
// Inngest webhook handler — receives events and runs background jobs.
// Mount at /api/inngest (Inngest SDK auto-discovers this route).

import { serve } from 'inngest/next'
import { inngest, allFunctions } from '@csps/integrations/jobs'

export const { GET, POST, PUT } = serve({ client: inngest, functions: allFunctions })
