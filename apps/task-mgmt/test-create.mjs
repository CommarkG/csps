// Quick diagnostic: test task creation directly via Prisma (bypasses HTTP + ZenStack)
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient({ log: ['error'] })

const TENANT_ID = 'a428ee70-3094-44b8-83cd-1e81181c6170'
const USER_CSPS_ID = '2c2323d2-4282-4059-b5c0-60c255b470c5'

async function main() {
  console.log('Testing direct Prisma task creation...\n')

  // 1. Verify user exists
  const user = await db.user.findUnique({ where: { id: USER_CSPS_ID } })
  console.log('User found:', user ? `${user.email} (tenantId: ${user.tenantId})` : 'NOT FOUND')
  if (!user) { console.error('Abort — no user'); return }

  // 2. Verify tenant exists
  const tenant = await db.tenant.findUnique({ where: { id: TENANT_ID } })
  console.log('Tenant found:', tenant ? tenant.name : 'NOT FOUND')
  if (!tenant) { console.error('Abort — no tenant'); return }

  // 3. Try creating a task
  try {
    const task = await db.task.create({
      data: {
        tenantId: TENANT_ID,
        title: 'S022 diagnostic task',
        status: 'todo',
        priority: 'none',
        createdById: USER_CSPS_ID,
      }
    })
    console.log('\n✓ Task created:', task.id)

    // 4. Try writing AuditEvent
    const audit = await db.auditEvent.create({
      data: {
        tenantId: TENANT_ID,
        actorId: USER_CSPS_ID,
        action: 'task.created',
        resourceType: 'Task',
        resourceId: task.id,
        data: { title: task.title },
      }
    })
    console.log('✓ AuditEvent written:', audit.id)
    console.log('\n=== BOTH WORK — issue is in ZenStack or HTTP layer ===')

  } catch (e) {
    console.error('\n✗ Error:', e.message)
    console.error('Code:', e.code)
    console.error('Meta:', e.meta)
  }
}

main().catch(console.error).finally(() => db.$disconnect())
