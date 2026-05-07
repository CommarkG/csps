// Stripe webhook — subscription lifecycle → Tenant.subscriptionStatus
// Both directions (outbound: billing trigger in Clerk webhook; inbound: here)
// Handles: customer.subscription.created → active, customer.subscription.deleted → cancelled

import { headers } from 'next/headers'
import { db } from '@/lib/db'
import Stripe from 'stripe'

let _stripe: Stripe | null = null
function getStripe() {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  return _stripe
}

export async function POST(request: Request) {
  const body = await request.text()
  const headerPayload = await headers()
  const sig = headerPayload.get('stripe-signature')

  if (!sig) return new Response('Missing stripe-signature', { status: 400 })

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const tenantId = subscription.metadata?.csps_tenant_id
      if (!tenantId) break

      const status = subscription.status === 'active' ? 'active'
        : subscription.status === 'trialing' ? 'trialing'
        : subscription.status === 'canceled' ? 'cancelled'
        : null

      if (status) {
        await db.tenant.update({
          where: { id: tenantId },
          data: {
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: status,
          },
        })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const tenantId = subscription.metadata?.csps_tenant_id
      if (!tenantId) break

      await db.tenant.update({
        where: { id: tenantId },
        data: { subscriptionStatus: 'cancelled' },
      })
      break
    }
  }

  return new Response('OK', { status: 200 })
}
