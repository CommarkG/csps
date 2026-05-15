// Inngest webhook handler for Budget Planner.
import { serve } from 'inngest/next'
import { inngest, allFunctions } from '@csps/integrations/jobs'

export const { GET, POST, PUT } = serve({ client: inngest, functions: allFunctions })
