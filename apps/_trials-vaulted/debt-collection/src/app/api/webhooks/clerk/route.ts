// CSPS TEMPLATE — replace [App Name] with your app name
// Clerk webhook — org/user lifecycle → CSPS entities
// Platform inheritance: handleClerkWebhook from @csps/integrations
// App-specific: add onTenantCreated callback if app needs setup on org creation

import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { handleClerkWebhook, type CspsDb } from '@csps/integrations'
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
    update: (args) => db.userTenant.update(args as Parameters<typeof db.userTenant.update>[0]),
    delete: (args) => db.userTenant.delete(args as Parameters<typeof db.userTenant.delete>[0]),
    updateMany: (args) => db.userTenant.updateMany(args),
    count: (args) => db.userTenant.count(args),
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

  await handleClerkWebhook(evt as Parameters<typeof handleClerkWebhook>[0], dbAdapter)

  return new Response('OK', { status: 200 })
}
