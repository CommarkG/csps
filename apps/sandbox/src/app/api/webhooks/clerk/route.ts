// Clerk webhook handler — wires libs/integrations/clerk/webhook-handler.ts to Next.js
// Per S013 design: org.created → Tenant, membership.created → UserTenant, user.created → User
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { handleClerkWebhook, type CspsDb } from '../../../../../../libs/integrations/clerk/webhook-handler'
import { buildTenantBillingHook } from '../../../../../../libs/integrations/stripe/customer-service'
import { db } from '@/lib/db'
import Stripe from 'stripe'
import type { ClerkWebhookEvent } from '../../../../../../libs/integrations/clerk/types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Minimal db adapter — PrismaClient satisfies the CspsDb interface
const dbAdapter: CspsDb = {
  user: {
    create: (args) => db.user.create(args),
    findUnique: (args) => db.user.findUnique(args),
  },
  tenant: {
    create: (args) => db.tenant.create(args),
    findUnique: (args) => db.tenant.findUnique(args),
  },
  userTenant: {
    create: (args) => db.userTenant.create(args as Parameters<typeof db.userTenant.create>[0]),
  },
}

export async function POST(request: Request) {
  const body = await request.text()
  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing svix headers', { status: 400 })
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)
  let event: ClerkWebhookEvent

  try {
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkWebhookEvent
  } catch {
    return new Response('Webhook verification failed', { status: 400 })
  }

  const onTenantCreated = buildTenantBillingHook(stripe, { tenant: { update: (args) => db.tenant.update(args) } })

  await handleClerkWebhook(event, dbAdapter, onTenantCreated)

  return new Response('OK', { status: 200 })
}
