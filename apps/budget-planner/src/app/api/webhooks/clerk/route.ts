// Clerk webhook — org/user lifecycle → CSPS entities
// solo_user_flow: auto_org — personal finance is solo; auto-create org on user.created
//   Budget Planner is App #2 proving Gate 3: this is the first app with auto_org.
//   GAP-A1 from task-mgmt is FIXED here: solo users get immediate tenant context.
//
// Platform inheritance: handleClerkWebhook from @csps/integrations
// Budget-specific: no team billing trigger (solo app → Stripe subscription on signup)

import { headers } from 'next/headers'
import { Webhook } from 'svix'
import {
  handleClerkWebhook,
  type CspsDb,
} from '@csps/integrations'
import { db } from '@/lib/db'

const dbAdapter: CspsDb = {
  user: {
    create: (args) => db.user.create(args),
    findUnique: (args) => db.user.findUnique(args),
    update: (args) => db.user.update(args),
  },
  tenant: {
    create: (args) => db.tenant.create(args),
    findUnique: (args) => db.tenant.findUnique(args),
    update: (args) => db.tenant.update(args),
  },
  userTenant: {
    create: async (args) => db.userTenant.create(args as Parameters<typeof db.userTenant.create>[0]),
    findFirst: (args) => db.userTenant.findFirst(args),
  },
}

export async function POST(req: Request) {
  const body = await req.text()
  const headerList = await headers()
  const svixId = headerList.get('svix-id')
  const svixTimestamp = headerList.get('svix-timestamp')
  const svixSignature = headerList.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing svix headers', { status: 400 })
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)
  let evt: ReturnType<typeof wh.verify>

  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    })
  } catch {
    return new Response('Webhook signature invalid', { status: 400 })
  }

  // solo_user_flow: auto_org
  // handleClerkWebhook creates User + Tenant on user.created
  // For Budget Planner: every new user gets their own personal tenant immediately
  await handleClerkWebhook(evt as Parameters<typeof handleClerkWebhook>[0], dbAdapter, {
    soloUserFlow: 'auto_org',
  })

  return new Response('OK', { status: 200 })
}
