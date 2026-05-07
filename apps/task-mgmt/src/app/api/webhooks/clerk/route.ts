// Clerk webhook — org/user lifecycle → CSPS entities
// Uses @csps/integrations alias (VLT-S015-005) — kills relative path smell
// Billing trigger (VLT-S014-005): 2nd UserTenant → Stripe subscription

import { headers } from 'next/headers'
import { Webhook } from 'svix'
import {
  handleClerkWebhook,
  buildTenantBillingHook,
  type CspsDb,
} from '@csps/integrations'
import type { ClerkWebhookEvent } from '@csps/integrations'
import { db } from '@/lib/db'
import Stripe from 'stripe'

// Lazy singleton — avoid module-scope initialization (Next.js static analysis)
let _stripe: Stripe | null = null
function getStripe() {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  return _stripe
}

// Extended CspsDb adapter that includes billing trigger support
const dbAdapter: CspsDb = {
  user: {
    create: (args) => db.user.create(args),
    findUnique: (args) => db.user.findUnique(args),
    update: (args) => db.user.update(args),
  },
  tenant: {
    create: (args) => db.tenant.create(args),
    findUnique: (args) => db.tenant.findUnique(args),
  },
  userTenant: {
    create: async (args) => {
      const result = await db.userTenant.create(args as Parameters<typeof db.userTenant.create>[0])

      // BILLING TRIGGER (VLT-S014-005): 2nd active member → create Stripe subscription
      // Count after creation to see if we just crossed the team threshold
      const memberCount = await db.userTenant.count({
        where: {
          tenantId: args.data.tenantId as string,
          deletedAt: null,
        },
      })

      if (memberCount === 2) {
        // Transition: solo → team. Upgrade to paid subscription.
        const tenant = await db.tenant.findUnique({
          where: { id: args.data.tenantId as string },
        })

        if (tenant?.stripeCustomerId && process.env.STRIPE_TEAM_PRICE_ID) {
          try {
            const subscription = await getStripe().subscriptions.create({
              customer: tenant.stripeCustomerId,
              items: [{ price: process.env.STRIPE_TEAM_PRICE_ID }],
              metadata: { csps_tenant_id: tenant.id },
            })

            await db.tenant.update({
              where: { id: tenant.id },
              data: {
                stripeSubscriptionId: subscription.id,
                subscriptionStatus: 'trialing',
              },
            })
          } catch (err) {
            // Log billing errors but don't fail the webhook — member is created regardless
            console.error('[billing-trigger] subscription creation failed:', err)
          }
        }
      }

      return result
    },
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

  const onTenantCreated = buildTenantBillingHook(getStripe(), {
    tenant: { update: (args) => db.tenant.update(args) },
  })

  await handleClerkWebhook(event, dbAdapter, onTenantCreated)

  return new Response('OK', { status: 200 })
}
