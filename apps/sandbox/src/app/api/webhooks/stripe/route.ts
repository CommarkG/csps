// Stripe webhook handler — handles billing events
// Currently: subscription.created, invoice.paid (for graduation trigger tracking)
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const body = await request.text()
  const headerPayload = await headers()
  const signature = headerPayload.get('stripe-signature')

  if (!signature) return new Response('Missing signature', { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return new Response('Webhook verification failed', { status: 400 })
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const customerId = sub.customer as string
      const status = sub.status === 'active' ? 'active' : 'trialing'

      await db.tenant.updateMany({
        where: { stripeCustomerId: customerId },
        data: { /* stripeSubscriptionStatus: status */ }, // add field in production
      })

      // AuditEvent for graduation tracking (VLT-S014-004: $1K MRR trigger)
      const tenant = await db.tenant.findFirst({ where: { stripeCustomerId: customerId } })
      if (tenant) {
        await db.auditEvent.create({
          data: {
            tenantId: tenant.id,
            action: `subscription.${status}`,
            resourceType: 'Tenant',
            resourceId: tenant.id,
            data: { stripeSubscriptionId: sub.id, status },
          },
        })
      }
      break
    }
  }

  return new Response('OK', { status: 200 })
}
