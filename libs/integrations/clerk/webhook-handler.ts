// Clerk webhook handler — maps Clerk events → CSPS ZModel entities.
//
// Events handled:
//   user.created                    → User row (clerkId, email, displayName)
//   user.deleted                    → soft-delete User + anonymize PII [S022 Gap]
//   organization.created            → Tenant row (clerkOrgId, slug, name) + UserTenant for creator
//   organization.deleted            → cascade soft-delete Tenant + all UserTenants [S022 Gap]
//   organizationMembership.created  → UserTenant row (userId, tenantId, role) + trial trigger
//   organizationMembership.updated  → sync UserTenant.role [S022 Gap C — Opus Turn 4]
//   organizationMembership.deleted  → delete UserTenant row (hard delete) [S022 Gap]
//
// Q-09: trial triggers on 2nd member — reads from SUBSCRIPTION_CONFIG
// Q-08: trial duration from config
// Signature verification (svix) is the caller's responsibility.

import type { ClerkWebhookEvent } from './types'
import { SUBSCRIPTION_CONFIG } from '../../config/subscription.config'
import { createHash } from 'crypto'

// Minimal DB interface — satisfied by PrismaClient once `prisma generate` runs.
export interface CspsDb {
  user: {
    create: (args: { data: { clerkId: string; email: string; displayName?: string | null } }) => Promise<{ id: string }>
    findUnique: (args: { where: { clerkId: string } }) => Promise<{ id: string } | null>
    update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<unknown>
  }
  tenant: {
    create: (args: { data: { slug: string; name: string; clerkOrgId: string } }) => Promise<{ id: string; name: string }>
    findUnique: (args: { where: { clerkOrgId: string } }) => Promise<{ id: string; subscriptionStatus: string } | null>
    update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<unknown>
  }
  userTenant: {
    create: (args: { data: { userId: string; tenantId: string; role: MembershipRole } }) => Promise<unknown>
    update: (args: { where: { userId_tenantId: { userId: string; tenantId: string } }; data: { role: MembershipRole } }) => Promise<unknown>
    delete: (args: { where: { userId_tenantId: { userId: string; tenantId: string } } }) => Promise<unknown>
    updateMany: (args: { where: { tenantId: string }; data: { deletedAt: Date } }) => Promise<unknown>
    count: (args: { where: { tenantId: string; deletedAt: null | undefined } }) => Promise<number>
  }
}

type MembershipRole = 'owner' | 'admin' | 'member'

function mapClerkRole(clerkRole: string): MembershipRole {
  if (clerkRole === 'org:admin') return 'admin'
  if (clerkRole === 'org:owner') return 'owner'
  return 'member'
}

function shortHash(str: string): string {
  return createHash('sha256').update(str).digest('hex').slice(0, 8)
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
        data: { clerkId: id, email, displayName: [first_name, last_name].filter(Boolean).join(' ') || null },
      })
      break
    }

    // S022: soft-delete + PII anonymization (Q-16: email + displayName)
    case 'user.deleted': {
      const { id } = event.data
      const hash = shortHash(id)
      const user = await db.user.findUnique({ where: { clerkId: id } })
      if (!user) break
      await db.user.update({
        where: { id: user.id },
        data: {
          email: `[deleted-${hash}]`,
          displayName: null,
          deletedAt: new Date(),
        },
      })
      break
    }

    case 'organization.created': {
      const { id: clerkOrgId, name, slug, created_by } = event.data
      const tenant = await db.tenant.create({ data: { slug: slug ?? clerkOrgId, name, clerkOrgId } })
      const creator = await db.user.findUnique({ where: { clerkId: created_by } })
      if (creator) {
        await db.userTenant.create({ data: { userId: creator.id, tenantId: tenant.id, role: 'owner' } })
        await db.user.update({ where: { id: creator.id }, data: { tenantId: tenant.id } })
      }
      await onTenantCreated?.(tenant.id, tenant.name)
      break
    }

    // S022: cascade soft-delete Tenant + all UserTenants
    case 'organization.deleted': {
      const { id: clerkOrgId } = event.data
      const tenant = await db.tenant.findUnique({ where: { clerkOrgId } })
      if (!tenant) break
      const now = new Date()
      await db.userTenant.updateMany({ where: { tenantId: tenant.id }, data: { deletedAt: now } })
      await db.tenant.update({ where: { id: tenant.id }, data: { deletedAt: now } })
      break
    }

    case 'organizationMembership.created': {
      const { organization, public_user_data, role } = event.data
      const [user, tenant] = await Promise.all([
        db.user.findUnique({ where: { clerkId: public_user_data.user_id } }),
        db.tenant.findUnique({ where: { clerkOrgId: organization.id } }),
      ])
      if (!user || !tenant) break

      await db.userTenant.create({ data: { userId: user.id, tenantId: tenant.id, role: mapClerkRole(role) } })

      // Q-09: trial triggers on 2nd member joining a free org — reads from config
      const memberCount = await db.userTenant.count({ where: { tenantId: tenant.id, deletedAt: null } })
      if (
        memberCount === SUBSCRIPTION_CONFIG.trial.triggerOnMemberCount &&
        tenant.subscriptionStatus === 'free'
      ) {
        const trialEndsAt = new Date()
        trialEndsAt.setDate(trialEndsAt.getDate() + SUBSCRIPTION_CONFIG.trial.durationDays)
        await db.tenant.update({
          where: { id: tenant.id },
          data: { subscriptionStatus: 'trialing', trialEndsAt },
        })
      }
      break
    }

    // S022 Gap C — Opus Turn 4: sync role when Clerk role changes
    case 'organizationMembership.updated': {
      const { organization, public_user_data, role } = event.data
      const [user, tenant] = await Promise.all([
        db.user.findUnique({ where: { clerkId: public_user_data.user_id } }),
        db.tenant.findUnique({ where: { clerkOrgId: organization.id } }),
      ])
      if (!user || !tenant) break
      await db.userTenant.update({
        where: { userId_tenantId: { userId: user.id, tenantId: tenant.id } },
        data: { role: mapClerkRole(role) },
      })
      break
    }

    // S022: hard delete UserTenant (join table row — not a soft-delete pattern)
    case 'organizationMembership.deleted': {
      const { organization, public_user_data } = event.data
      const [user, tenant] = await Promise.all([
        db.user.findUnique({ where: { clerkId: public_user_data.user_id } }),
        db.tenant.findUnique({ where: { clerkOrgId: organization.id } }),
      ])
      if (!user || !tenant) break
      await db.userTenant.delete({
        where: { userId_tenantId: { userId: user.id, tenantId: tenant.id } },
      })
      break
    }
  }
}
