#!/usr/bin/env tsx
// @csps-dna
// core_spine: ARCH
// @csps-enforces gap_DIM2_CORE_ID_UUID_UPGRADE (deadline 2026-06-16)
//               dim-4 Surface 5 — NATIVE-UUID MIGRATION
// Run: npx tsx --env-file=.env libs/policies/migrations/apply-uuid-migration.ts
//
// WHAT THIS DOES (one command — no hand-run SQL):
//   1. Reads DIRECT_URL from .env (port 5432 — direct, not pgbouncer)
//   2. Captures pre-migration row counts (baseline)
//   3. Applies migration SQL in a single atomic transaction
//   4. Runs 3 block-tests INSIDE the transaction (before commit):
//      CHECK 1  Row counts unchanged (pre == post — data-preserving)
//      CHECK 2  Zero non-uuid id columns in 14 original tables
//      CHECK 3  20 expected FK constraints present
//   5. COMMITS if all 3 checks pass
//      ROLLS BACK if any check fails — DB left unchanged, no partial damage
//   6. Prints PASS/FAIL per check + overall
//
// PREREQUISITE: .env must contain DIRECT_URL=postgresql://...@.../postgres
//   (Supabase: Settings → Database → Connection string → URI, port 5432)
//
// governing_intent: Prove UUID migration is data-preserving and complete.
//   Atomic: checks run inside the transaction that applied the migration.
//   ROLLBACK on any failure = zero partial-damage risk.

import { Client } from 'pg'
import { readFileSync, existsSync } from 'fs'
import { join, resolve } from 'path'

const ROOT = resolve(process.cwd())
const MIGRATION_FILE = join(
  ROOT,
  'libs/policies/migrations/20260602_uuid_native_types/migration.sql',
)

// 14 tables whose id columns are converted TEXT → UUID
const ORIGINAL_TABLES = [
  'User', 'Tenant', 'UserTenant', 'AuditEvent',
  'Project', 'Task', 'TaskComment', 'Notification',
  'Habit', 'HabitLog', 'WebhookEndpoint', 'BudgetCategory',
  'Transaction', 'BudgetGoal',
]

// Key tables sampled for row-count verification
const COUNT_TABLES = ['User', 'Tenant', 'Task', 'Project']

// The exact 20 FK constraints re-added by this migration
// (excludes PART 3 FKs: Tenant_planId_fkey, PlanCapability_*)
const EXPECTED_FKS = [
  'UserTenant_userId_fkey',   'UserTenant_tenantId_fkey',
  'AuditEvent_tenantId_fkey', 'Project_tenantId_fkey',
  'Task_tenantId_fkey',       'Task_projectId_fkey',
  'Task_createdById_fkey',    'Task_assigneeId_fkey',
  'TaskComment_taskId_fkey',  'TaskComment_authorId_fkey',
  'Notification_tenantId_fkey','Notification_userId_fkey',
  'Habit_tenantId_fkey',      'HabitLog_habitId_fkey',
  'HabitLog_tenantId_fkey',   'WebhookEndpoint_tenantId_fkey',
  'BudgetCategory_tenantId_fkey','Transaction_tenantId_fkey',
  'Transaction_categoryId_fkey','BudgetGoal_tenantId_fkey',
]

// ─── Output helpers ───────────────────────────────────────────────
const SEP = '═'.repeat(60)
const ok   = (msg: string) => console.log(`  ✅  ${msg}`)
const fail = (msg: string) => console.log(`  ❌  ${msg}`)
const info = (msg: string) => console.log(`  ℹ   ${msg}`)

// ─── Parse migration SQL (strips BEGIN / COMMIT — we manage tx) ───
function parseStatements(file: string): string[] {
  const raw = readFileSync(file, 'utf8')
  // Remove single-line comments (-- ...)
  const noComments = raw.replace(/--[^\n]*/g, '')
  return noComments
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !/^(begin|commit)$/i.test(s))
}

// ─── Main ─────────────────────────────────────────────────────────
async function main(): Promise<void> {
  // Guard: DIRECT_URL must be set
  const directUrl = process.env.DIRECT_URL
  if (!directUrl) {
    console.error('\n❌  DIRECT_URL not found.')
    console.error('    Add to your .env:  DIRECT_URL=postgresql://postgres.xxx:password@aws-0-...supabase.com:5432/postgres')
    console.error('    (Supabase → Settings → Database → Connection string → URI, port 5432)\n')
    process.exit(1)
  }

  // Guard: migration file must exist
  if (!existsSync(MIGRATION_FILE)) {
    console.error(`\n❌  Migration file not found:\n    ${MIGRATION_FILE}\n`)
    process.exit(1)
  }

  const statements = parseStatements(MIGRATION_FILE)

  console.log(`\n${SEP}`)
  console.log('  APPLY + VERIFY — 20260602_uuid_native_types')
  console.log('  gap_DIM2_CORE_ID_UUID_UPGRADE  |  deadline 2026-06-16')
  console.log(SEP)
  info(`Statements in migration: ${statements.length}`)
  info('Connecting via DIRECT_URL (port 5432)…')
  console.log()

  const client = new Client({ connectionString: directUrl })
  await client.connect()

  const checks: Array<{ name: string; pass: boolean; detail: string }> = []
  let txOpen = false

  try {
    await client.query('BEGIN')
    txOpen = true

    // ── PRE-MIGRATION: capture baseline row counts ──────────────
    console.log('BASELINE (pre-migration row counts)')
    const pre: Record<string, number> = {}
    for (const tbl of COUNT_TABLES) {
      const r = await client.query(
        `SELECT COUNT(*) AS count FROM "public"."${tbl}"`,
      )
      pre[tbl] = parseInt(r.rows[0].count, 10)
    }
    console.log('  ' + COUNT_TABLES.map(t => `${t}: ${pre[t]}`).join('  |  '))
    console.log()

    // ── APPLY MIGRATION ─────────────────────────────────────────
    console.log(`APPLYING ${statements.length} SQL STATEMENTS…`)
    for (const stmt of statements) {
      await client.query(stmt)
    }
    ok('All statements executed')
    console.log()

    // ── CHECK 1: DATA INTACT ─────────────────────────────────────
    console.log('CHECK 1 — DATA INTACT')
    let dataOk = true
    for (const tbl of COUNT_TABLES) {
      const r = await client.query(
        `SELECT COUNT(*) AS count FROM "public"."${tbl}"`,
      )
      const post = parseInt(r.rows[0].count, 10)
      if (pre[tbl] === post) {
        ok(`${tbl}: ${pre[tbl]} → ${post} rows (unchanged)`)
      } else {
        fail(`${tbl}: ${pre[tbl]} → ${post} rows (DATA MISMATCH)`)
        dataOk = false
      }
    }
    checks.push({
      name: 'DATA INTACT',
      pass: dataOk,
      detail: `${COUNT_TABLES.length}/${COUNT_TABLES.length} tables row-count unchanged`,
    })
    console.log()

    // ── CHECK 2: UUID TYPES ──────────────────────────────────────
    console.log('CHECK 2 — UUID TYPES (all 14 original id columns)')
    const tblList = ORIGINAL_TABLES.map(t => `'${t}'`).join(', ')
    const typeRes = await client.query(`
      SELECT table_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND column_name = 'id'
        AND table_name IN (${tblList})
        AND data_type != 'uuid'
      ORDER BY table_name
    `)
    const nonUuidRows: Array<{table_name: string; data_type: string}> = typeRes.rows
    if (nonUuidRows.length === 0) {
      ok(`All ${ORIGINAL_TABLES.length} tables now have id columns of type uuid`)
    } else {
      for (const row of nonUuidRows) {
        fail(`${row.table_name}.id is still ${row.data_type}`)
      }
    }
    checks.push({
      name: 'UUID TYPES',
      pass: nonUuidRows.length === 0,
      detail: `${nonUuidRows.length} non-uuid id columns (expect 0)`,
    })
    console.log()

    // ── CHECK 3: FK CONSTRAINTS ──────────────────────────────────
    console.log('CHECK 3 — FK CONSTRAINTS (expect 20 constraints)')
    const fkList = EXPECTED_FKS.map(n => `'${n}'`).join(', ')
    const fkRes = await client.query(`
      SELECT conname FROM pg_constraint
      WHERE contype = 'f'
        AND conname IN (${fkList})
      ORDER BY conname
    `)
    const found = new Set<string>(fkRes.rows.map((r: {conname: string}) => r.conname))
    const missing = EXPECTED_FKS.filter(n => !found.has(n))
    const fkPass = missing.length === 0 && found.size === EXPECTED_FKS.length
    if (fkPass) {
      ok(`All ${EXPECTED_FKS.length} FK constraints present`)
    } else {
      fail(`Found ${found.size}/${EXPECTED_FKS.length} FK constraints`)
      missing.forEach(fk => fail(`  Missing: ${fk}`))
    }
    checks.push({
      name: 'FK CONSTRAINTS',
      pass: fkPass,
      detail: `${found.size}/${EXPECTED_FKS.length} present`,
    })
    console.log()

    // ── DECISION ─────────────────────────────────────────────────
    const allPass = checks.every(c => c.pass)

    console.log(SEP)
    console.log('  SUMMARY')
    console.log(SEP)
    for (const c of checks) {
      console.log(`  ${c.pass ? '✅' : '❌'}  ${c.name.padEnd(18)} ${c.detail}`)
    }
    console.log()

    if (allPass) {
      await client.query('COMMIT')
      txOpen = false
      console.log('  ✅  OVERALL: PASS — migration COMMITTED to database.')
      console.log('  → Paste this output to Opus for OPIA + dim-4 Surface 5 SEAL.')
    } else {
      await client.query('ROLLBACK')
      txOpen = false
      console.log('  ❌  OVERALL: FAIL — migration ROLLED BACK. Database unchanged.')
      console.log('  → Fix failing checks above, then re-run.')
    }
    console.log(SEP)
    console.log()

    process.exit(allPass ? 0 : 1)

  } catch (err: unknown) {
    if (txOpen) {
      await client.query('ROLLBACK').catch(() => {})
    }
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`\n❌  SCRIPT ERROR: ${msg}`)
    console.error('    Database rolled back. No changes applied.')
    process.exit(1)

  } finally {
    await client.end()
  }
}

main()
