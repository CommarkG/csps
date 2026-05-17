// Inngest webhook handler stub — deferred until INNGEST_SIGNING_KEY configured
// wiring_deferred_until: S040 (requires pnpm add --filter apps/budget-planner inngest)
//
// To activate:
//   1. pnpm add --filter @csps/budget-planner inngest
//   2. Replace this file with:
//      import { serve } from 'inngest/next'
//      import { inngest, allFunctions } from '@csps/integrations/jobs'
//      export const { GET, POST, PUT } = serve({ client: inngest, functions: allFunctions })

import { NextResponse } from 'next/server'

function stub() {
  return NextResponse.json({ status: 'inngest_not_configured' }, { status: 503 })
}

export const GET = stub
export const POST = stub
export const PUT = stub
