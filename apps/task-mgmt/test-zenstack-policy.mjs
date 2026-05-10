// S3-E1 ZenStack policy enforcement test
// Tests that enhance() denies a task creation when tenantId doesn't match auth context
import { PrismaClient } from '@prisma/client'
import { enhance } from '@zenstackhq/runtime'

const db = new PrismaClient()

const REAL_TENANT = 'a428ee70-3094-44b8-83cd-1e81181c6170'
const REAL_USER   = '2c2323d2-4282-4059-b5c0-60c255b470c5'
const FAKE_TENANT = '00000000-0000-0000-0000-000000000000'

async function main() {
  console.log('S3-E1: Testing ZenStack cross-tenant policy enforcement\n')

  // Test 1: same tenant → should SUCCEED
  console.log('Test 1: Create task with correct tenantId (should succeed)...')
  try {
    const edb = enhance(db, { user: { id: REAL_USER, tenantId: REAL_TENANT } })
    const task = await edb.task.create({
      data: { tenantId: REAL_TENANT, title: 'ZenStack policy test (correct tenant)', status: 'todo', priority: 'none', createdById: REAL_USER }
    })
    console.log('  ✅ PASS — task created:', task.id)
  } catch (e) {
    console.log('  ✗ UNEXPECTED FAIL:', e.message)
  }

  // Test 2: wrong tenant in auth context → should DENY
  console.log('\nTest 2: Create task with WRONG tenantId in auth (should be denied)...')
  try {
    const edb = enhance(db, { user: { id: REAL_USER, tenantId: FAKE_TENANT } })
    const task = await edb.task.create({
      data: { tenantId: REAL_TENANT, title: 'This should be denied', status: 'todo', priority: 'none', createdById: REAL_USER }
    })
    console.log('  ✗ FAIL — task was created when it should have been denied:', task.id)
    console.log('  → ZenStack policy is NOT enforcing. RLS must move to Session 4.')
  } catch (e) {
    if (e.message?.includes('denied') || e.code === 'P2004') {
      console.log('  ✅ PASS — ZenStack denied the cross-tenant write:', e.message)
      console.log('  → S3-E1 EVIDENCE: ZenStack is enforcing tenant isolation. RLS stays Session 6.')
    } else {
      console.log('  ⚠ Unexpected error (not a policy denial):', e.message)
    }
  }

  // Test 3: wrong tenantId in task data → should also DENY
  console.log('\nTest 3: Create task with FAKE tenantId in data (should be denied)...')
  try {
    const edb = enhance(db, { user: { id: REAL_USER, tenantId: REAL_TENANT } })
    const task = await edb.task.create({
      data: { tenantId: FAKE_TENANT, title: 'Wrong tenant in data', status: 'todo', priority: 'none', createdById: REAL_USER }
    })
    console.log('  ✗ FAIL — cross-tenant data write allowed:', task.id)
  } catch (e) {
    if (e.message?.includes('denied') || e.code === 'P2004') {
      console.log('  ✅ PASS — ZenStack denied cross-tenant data write:', e.message)
    } else {
      console.log('  ⚠ Unexpected error:', e.message)
    }
  }
}

main().catch(console.error).finally(() => db.$disconnect())
