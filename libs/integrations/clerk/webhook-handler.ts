// Clerk webhook handler — maps Clerk events → CSPS ZModel entities.
//
// Events handled:
//   user.created          → User row (clerkId, email, displayName)
//   organization.created  → Tenant row (clerkOrgId, slug, name) + UserTenant for creator
//   organizationMembership.created → UserTenant row (userId, tenantId, role)
//
// Signature verification (svix) is the caller's responsibility.
// Wire this handler to POST /api/webhooks/clerk in the consuming app.
//
// Per VLT-S011-004: Clerk org → Tenant is direct 1:1 via clerkOrgId.
// Per VLT-S011-003: User ↔ Tenant is N:N via UserTenant join table.

import type { ClerkWebhookEvent } from './types'

// Minimal DB interface — satisfied by PrismaClient once `prisma generate` runs.
// Replace with: import type { PrismaClient } from '@prisma/client'
export interface CspsDb {
  user: {
    create: (args: { data: { clerkId: string; email: string; displayName?: string | null } }) => Promise<{ id: string }>
    findUnique: (args: { where: { clerkId: string } }) => Promise<{ id: string } | null>
    // update.tenantId sets the active session context (fixes VLT-S015-001)
    update: (args: { where: { id: string }; data: { tenantId: string } }) => Promise<unknown>
  }
  tenant: {
    create: (args: { data: { slug: string; name: string; clerkOrgId: string } }) => Promise<{ id: string; name: string }>
    findUnique: (args: { where: { clerkOrgId: string } }) => Promise<{ id: string } | null>
  }
  userTenant: {
    create: (args: { data: { userId: string; tenantId: string; role: MembershipRole } }) => Promise<unknown>
  }
}

type MembershipRole = 'owner' | 'admin' | 'member'

function mapClerkRole(clerkRole: string): MembershipRole {
  if (clerkRole === 'org:admin') return 'admin'
  if (clerkRole === 'org:owner') return 'owner'
  return 'member'
}

export async function handleClerkWebhook(
  event: ClerkWebhookEvent,
  db: CspsDb,
  onTenantCreated?: (tenantId: string, tenantName: string) => Promise<void>
): Promise<void> {
  switch (event.type) {
    case 'user.created': {
      const { id, email_addresses, first_name, last_name } = event.data
      const email = email_addresses[0]?.email_address
      if (!email) return

      await db.user.create({
        data: {
          clerkId: id,
          email,
          displayName: [first_name, last_name].filter(Boolean).join(' ') || null,
        },
      })
      break
    }

    case 'organization.created': {
      const { id: clerkOrgId, name, slug, created_by } = event.data

      const tenant = await db.tenant.create({
        data: {
          slug: slug ?? clerkOrgId,
          name,
          clerkOrgId,
        },
      })

      // Creator becomes owner — create UserTenant for the founding user
      const creator = await db.user.findUnique({ where: { clerkId: created_by } })
      if (creator) {
        await db.userTenant.create({
          data: { userId: creator.id, tenantId: tenant.id, role: 'owner' },
        })
        // Set active session context so pages work immediately (fixes blocking gap VLT-S015-001)
        await db.user.update({ where: { id: creator.id }, data: { tenantId: tenant.id } })
      }

      // Notify billing service to create Stripe customer (S013 Stripe wiring)
      await onTenantCreated?.(tenant.id, tenant.name)
      break
    }

    case 'organizationMembership.created': {
      const { organization, public_user_data, role } = event.data

      const [user, tenant] = await Promise.all([
        db.user.findUnique({ where: { clerkId: public_user_data.user_id } }),
        db.tenant.findUnique({ where: { clerkOrgId: organization.id } }),
      ])

      if (user && tenant) {
        await db.userTenant.create({
          data: { userId: user.id, tenantId: tenant.id, role: mapClerkRole(role) },
        })
      }
      break
    }
  }
}
