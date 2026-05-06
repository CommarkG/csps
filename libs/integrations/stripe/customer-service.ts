// Stripe customer service — creates/manages Stripe customers for CSPS Tenants.
//
// Pattern: when a Tenant is created (via Clerk org.created webhook),
// a Stripe customer is created and Tenant.stripeCustomerId is set.
//
// The onTenantCreated callback in clerk/webhook-handler.ts calls createStripeCustomer.
// This keeps billing wiring decoupled from auth wiring.
//
// Wire: consuming app initialises `new Stripe(process.env.STRIPE_SECRET_KEY)`
// and passes the instance here. No Stripe singleton in this package.

// Minimal Stripe interface — satisfied by `stripe` package once installed.
// Replace with: import Stripe from 'stripe'
export interface StripeClient {
  customers: {
    create: (params: {
      name: string
      metadata: Record<string, string>
    }) => Promise<{ id: string }>
  }
}

// Minimal DB interface for Tenant updates.
export interface CspsDb {
  tenant: {
    update: (args: {
      where: { id: string }
      data: { stripeCustomerId: string }
    }) => Promise<unknown>
  }
}

export async function createStripeCustomer(
  tenantId: string,
  tenantName: string,
  stripe: StripeClient,
  db: CspsDb
): Promise<string> {
  const customer = await stripe.customers.create({
    name: tenantName,
    metadata: {
      csps_tenant_id: tenantId,     // links Stripe customer back to CSPS Tenant
    },
  })

  await db.tenant.update({
    where: { id: tenantId },
    data: { stripeCustomerId: customer.id },
  })

  return customer.id
}

// Convenience: build the onTenantCreated callback for handleClerkWebhook.
// Usage:
//   const onTenantCreated = buildTenantBillingHook(stripe, db)
//   handleClerkWebhook(event, db, onTenantCreated)
export function buildTenantBillingHook(
  stripe: StripeClient,
  db: CspsDb
): (tenantId: string, tenantName: string) => Promise<void> {
  return async (tenantId, tenantName) => {
    await createStripeCustomer(tenantId, tenantName, stripe, db)
  }
}
