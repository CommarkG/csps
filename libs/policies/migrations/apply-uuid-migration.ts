#!/usr/bin/env tsx
// @csps-dna
// core_spine: ARCH
// @csps-enforces gap_DIM2_CORE_ID_UUID_UPGRADE (deadline 2026-06-16)
//               dim-4 Surface 5 — NATIVE-UUID MIGRATION
// Run: npx tsx --env-file=.env libs/policies/migrations/apply-uuid-migration.ts
//
// WHAT THIS DOES (one command — no hand-run SQL):
//   1. Reads DIRECT_URL from .env (port 5432 — direct, not pgbouncer)
//   2. Captures pre-migration row counts
//   3. Drops RLS policies that reference the columns being altered
//      (PostgreSQL blocks ALTER COLUMN TYPE when policies reference the column)
//   4. Applies migration SQL in a single atomic transaction
//   5. Recreates RLS policies with UUID-compatible column expressions
//   6. Runs 3 block-tests INSIDE the transaction (before commit):
//      CHECK 1  Row counts unchanged (pre == post — data-preserving)
//      CHECK 2  Zero non-uuid id columns in 14 original tables
//      CHECK 3  20 expected FK constraints present
//   7. COMMITS if all checks pass; ROLLS BACK if any fail
//
// governing_intent: Prove UUID migration is data-preserving and complete.
//   Atomic: policies dropped, ALTERs applied, policies recreated, checks pass → COMMIT.
//   ROLLBACK on any failure = DB left unchanged, no partial damage.

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

// Columns changing from TEXT → UUID (used in policy expression transformation)
const UUID_COLUMNS = [
  'id', 'tenantId', 'userId', 'actorId', 'projectId',
  'createdById', 'assigneeId', 'taskId', 'authorId',
  'habitId', 'categoryId', 'planId', 'capabilityId',
]

// ─── Output helpers ───────────────────────────────────────────────
const SEP = '═'.repeat(60)
const ok   = (msg: string) => console.log(`  ✅  ${msg}`)
const fail = (msg: string) => console.log(`  ❌  ${msg}`)
const info = (msg: string) => console.log(`  ℹ   ${msg}`)

// ─── Parse migration SQL (strips BEGIN/COMMIT — we manage tx) ────
function parseStatements(file: string): string[] {
  const raw = readFileSync(file, 'utf8')
  const noComments = raw.replace(/--[^\n]*/g, '')
  return noComments
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !/^(begin|commit)$/i.test(s))
}

// ─── Make policy expression UUID-compatible ────────────────────────
// When UUID columns were TEXT, policies compared them to ::text cast values.
// Now that columns are UUID, we add ::text to column refs so the comparison
// becomes: text_value = uuid_column::text  (both text, always valid).
function makeUuidCompatible(expr: string | null): string | null {
  if (!expr) return null
  let result = expr
  for (const col of UUID_COLUMNS) {
    // Quoted column refs: "colName" → "colName"::text  (only if not already cast)
    result = result.replace(
      new RegExp(`"${col}"(?!::)`, 'g'),
      `"${col}"::text`,
    )
    // Unquoted column refs: \bcolName\b (not preceded/followed by identifier chars)
    result = result.replace(
      new RegExp(`(?<![._"a-zA-Z0-9])\\b${col}\\b(?![a-zA-Z_0-9":])(?!::)`, 'g'),
      `${col}::text`,
    )
  }
  return result
}

// ─── Policy row shape ─────────────────────────────────────────────
interface PolicyRow {
  table_name: string
  policy_name: string
  cmd: string         // r=SELECT a=INSERT w=UPDATE d=DELETE *=ALL
  permissive: boolean
  role_names_csv: string | null  // comma-separated role names, null = public (all roles)
  using_expr: string | null
  with_check_expr: string | null
}

// ─── Load all RLS policies on the affected tables ─────────────────
// NOTE: uses string_agg (not array_agg) — pg returns pg arrays as raw strings
// like '{role1,role2}' which require manual parsing; string_agg returns plain text.
async function loadPolicies(client: Client): Promise<PolicyRow[]> {
  const tableList = ORIGINAL_TABLES.map(t => `'${t}'`).join(', ')
  const res = await client.query<PolicyRow>(`
    SELECT
      c.relname                                              AS table_name,
      p.polname                                              AS policy_name,
      p.polcmd::text                                         AS cmd,
      p.polpermissive                                        AS permissive,
      CASE WHEN p.polroles IS NULL OR p.polroles = '{}'::oid[]
        THEN NULL
        ELSE (
          SELECT string_agg(r.rolname, ', ' ORDER BY r.rolname)
          FROM   pg_roles r
          WHERE  r.oid = ANY(p.polroles)
        )
      END                                                    AS role_names_csv,
      pg_get_expr(p.polqual,      p.polrelid, true)          AS using_expr,
      pg_get_expr(p.polwithcheck, p.polrelid, true)          AS with_check_expr
    FROM   pg_policy    p
    JOIN   pg_class     c ON p.polrelid = c.oid
    JOIN   pg_namespace n ON c.relnamespace = n.oid
    WHERE  n.nspname = 'public'
      AND  c.relname IN (${tableList})
    ORDER  BY c.relname, p.polname
  `)
  return res.rows
}

// ─── Build CREATE POLICY SQL from a saved policy row ─────────────
function buildCreatePolicy(p: PolicyRow): string {
  const cmdMap: Record<string, string> = {
    r: 'SELECT', a: 'INSERT', w: 'UPDATE', d: 'DELETE', '*': 'ALL',
  }
  const cmd  = cmdMap[p.cmd] ?? 'ALL'
  const perm = p.permissive ? 'PERMISSIVE' : 'RESTRICTIVE'
  const to   = p.role_names_csv ?? 'public'

  const usingExpr     = makeUuidCompatible(p.using_expr)
  const withCheckExpr = makeUuidCompatible(p.with_check_expr)

  let sql = `CREATE POLICY ${JSON.stringify(p.policy_name)} ON "public"."${p.table_name}"\n`
  sql    += `  AS ${perm} FOR ${cmd} TO ${to}`
  if (usingExpr)     sql += `\n  USING (${usingExpr})`
  if (withCheckExpr) sql += `\n  WITH CHECK (${withCheckExpr})`
  return sql
}

// ─── Main ─────────────────────────────────────────────────────────
async function main(): Promise<void> {
  const directUrl = process.env.DIRECT_URL
  if (!directUrl) {
    console.error('\n❌  DIRECT_URL not found.')
    console.error('    Add to .env:  DIRECT_URL=postgresql://postgres.xxx:password@...supabase.com:5432/postgres')
    console.error('    (Supabase → Settings → Database → Connection string → URI, port 5432)\n')
    process.exit(1)
  }
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

    // ── BASELINE: capture pre-migration row counts ──────────────
    console.log('BASELINE (pre-migration row counts)')
    const pre: Record<string, number> = {}
    for (const tbl of COUNT_TABLES) {
      const r = await client.query(`SELECT COUNT(*) AS count FROM "public"."${tbl}"`)
      pre[tbl] = parseInt(r.rows[0].count, 10)
    }
    console.log('  ' + COUNT_TABLES.map(t => `${t}: ${pre[t]}`).join('  |  '))
    console.log()

    // ── SAVE + DROP RLS POLICIES ────────────────────────────────
    console.log('SAVING + DROPPING RLS POLICIES (required before ALTER COLUMN TYPE)…')
    const policies = await loadPolicies(client)
    info(`Found ${policies.length} policies on affected tables`)

    for (const p of policies) {
      await client.query(
        `DROP POLICY IF EXISTS ${JSON.stringify(p.policy_name)} ON "public"."${p.table_name}"`,
      )
    }
    if (policies.length > 0) {
      ok(`Dropped ${policies.length} policies (will recreate with UUID-compatible expressions)`)
    } else {
      info('No RLS policies found on affected tables — skipping drop step')
    }
    console.log()

    // ── APPLY MIGRATION ─────────────────────────────────────────
    console.log(`APPLYING ${statements.length} SQL STATEMENTS…`)
    for (const stmt of statements) {
      await client.query(stmt)
    }
    ok('All ALTER TABLE statements executed')
    console.log()

    // ── RECREATE RLS POLICIES (UUID-compatible) ──────────────────
    if (policies.length > 0) {
      console.log('RECREATING RLS POLICIES (with ::text casts on UUID columns)…')
      let recreated = 0
      let policyFailed = false
      for (const p of policies) {
        const sql = buildCreatePolicy(p)
        try {
          await client.query(sql)
          recreated++
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e)
          fail(`Failed to recreate policy "${p.policy_name}" on ${p.table_name}: ${msg}`)
          info(`  SQL attempted:\n${sql.split('\n').map(l => '    ' + l).join('\n')}`)
          policyFailed = true
        }
      }
      if (!policyFailed) {
        ok(`Recreated ${recreated} policies with UUID-compatible expressions`)
      }
      console.log()
    }

    // ── CHECK 1: DATA INTACT ────────────────────────────────────
    console.log('CHECK 1 — DATA INTACT')
    let dataOk = true
    for (const tbl of COUNT_TABLES) {
      const r = await client.query(`SELECT COUNT(*) AS count FROM "public"."${tbl}"`)
      const post = parseInt(r.rows[0].count, 10)
      if (pre[tbl] === post) {
        ok(`${tbl}: ${pre[tbl]} → ${post} rows (unchanged)`)
      } else {
        fail(`${tbl}: ${pre[tbl]} → ${post} rows (DATA MISMATCH)`)
        dataOk = false
      }
    }
    checks.push({ name: 'DATA INTACT', pass: dataOk, detail: `${COUNT_TABLES.length} tables checked` })
    console.log()

    // ── CHECK 2: UUID TYPES ─────────────────────────────────────
    console.log('CHECK 2 — UUID TYPES (all 14 original id columns)')
    const tblList = ORIGINAL_TABLES.map(t => `'${t}'`).join(', ')
    const typeRes = await client.query<{table_name: string; data_type: string}>(`
      SELECT table_name, data_type
      FROM   information_schema.columns
      WHERE  table_schema = 'public'
        AND  column_name  = 'id'
        AND  table_name   IN (${tblList})
        AND  data_type   != 'uuid'
      ORDER  BY table_name
    `)
    const nonUuidRows = typeRes.rows
    if (nonUuidRows.length === 0) {
      ok(`All ${ORIGINAL_TABLES.length} tables have id columns of type uuid`)
    } else {
      for (const row of nonUuidRows) fail(`${row.table_name}.id is still ${row.data_type}`)
    }
    checks.push({
      name: 'UUID TYPES',
      pass: nonUuidRows.length === 0,
      detail: `${nonUuidRows.length} non-uuid id columns (expect 0)`,
    })
    console.log()

    // ── CHECK 3: FK CONSTRAINTS ─────────────────────────────────
    console.log('CHECK 3 — FK CONSTRAINTS (expect 20 constraints)')
    const fkList = EXPECTED_FKS.map(n => `'${n}'`).join(', ')
    const fkRes = await client.query<{conname: string}>(`
      SELECT conname FROM pg_constraint
      WHERE  contype = 'f'
        AND  conname IN (${fkList})
      ORDER  BY conname
    `)
    const found   = new Set(fkRes.rows.map(r => r.conname))
    const missing = EXPECTED_FKS.filter(n => !found.has(n))
    const fkPass  = missing.length === 0 && found.size === EXPECTED_FKS.length
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

    // ── DECISION ────────────────────────────────────────────────
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
      console.log(`  → ${policies.length} RLS policies recreated with UUID-compatible expressions.`)
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
