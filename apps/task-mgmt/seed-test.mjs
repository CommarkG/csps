// S022 — test seed for local dev validation
// Creates Tenant + User + UserTenant from known Clerk IDs
// Run: node seed-test.mjs (from apps/task-mgmt directory)
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const CLERK_USER_ID = 'user_3DVqecBPoUfQwAsidmQ2h4wFb2O'
const CLERK_ORG_ID  = 'org_3DVqhP1kHy4noeP3VgoHdos02qf'
const USER_EMAIL    = 'finkyariv@gmail.com'

async function main() {
  console.log('Seeding test data for S022 validation...\n')

  // Check if already exists
  const existing = await db.tenant.findUnique({ where: { clerkOrgId: CLERK_ORG_ID } })
  if (existing) {
    console.log('Tenant already exists:', existing.id)
    const user = await db.user.findUnique({ where: { clerkId: CLERK_USER_ID } })
    console.log('User:', user?.id ?? 'NOT FOUND')
    console.log('\nTENANT_ID =', existing.id)
    return
  }

  const tenant = await db.tenant.create({
    data: {
      slug: 'csps',
      name: 'Csps',
      clerkOrgId: CLERK_ORG_ID,
      subscriptionStatus: 'free',
    }
  })
  console.log('✓ Tenant created:', tenant.id)

  const user = await db.user.create({
    data: {
      clerkId: CLERK_USER_ID,
      email: USER_EMAIL,
      displayName: 'Yariv Fink',
      tenantId: tenant.id,
    }
  })
  console.log('✓ User created:', user.id)

  await db.userTenant.create({
    data: {
      userId: user.id,
      tenantId: tenant.id,
      role: 'owner',
    }
  })
  console.log('✓ UserTenant (owner) created')

  console.log('\n=== COPY THIS VALUE ===')
  console.log('TENANT_ID =', tenant.id)
  console.log('=======================')
  console.log('\nNext: paste this ID into Clerk user public_metadata')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
