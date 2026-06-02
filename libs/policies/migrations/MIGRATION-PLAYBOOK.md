---
id: csps.policies.migration-playbook
name: MIGRATION-PLAYBOOK
description: "PostgreSQL migration patterns discovered during CSPS development. Check this before writing any migration script."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
tags:
  - domain:architecture
  - type:reference
  - audience:developer
  - maturity:stable
schema_anchor: csps.libs.policies.migrations
links:
  - libs/policies/migrations/apply-uuid-migration.ts
  - libs/policies/migrations/README.md
  - tools/data/gap-recurrence-register.yaml
---

# CSPS DB Migration Playbook

Patterns discovered during live migration debugging. Check before writing any new migration script.

---

## Pattern 1: db-push DBs can't use `prisma migrate deploy` (P3005)

**Symptom**: `P3005: The database schema is not empty` when running migrate deploy.

**Why**: Supabase dev DBs are typically bootstrapped via `prisma db push` (schema-sync without migration history). There's no `_prisma_migrations` baseline. `migrate deploy` refuses to run.

Also: `prisma db push` cannot handle `text → uuid` type changes — it can't generate the `USING ::uuid` cast for existing data.

**Correct approach**:
```typescript
// Use raw SQL via pg on DIRECT_URL (port 5432)
import { Client } from 'pg'
const client = new Client({ connectionString: process.env.DIRECT_URL })
await client.connect()
await client.query('BEGIN')
await client.query('ALTER TABLE ... ALTER COLUMN ... TYPE uuid USING ...::uuid')
await client.query('COMMIT')
await client.end()
```

**Check first**: Was the DB bootstrapped with `db push` or `migrate dev`? Check for `_prisma_migrations` table. If missing → raw SQL path.

---

## Pattern 2: PostgreSQL RLS Policies block ALTER COLUMN TYPE

**Symptom**: `ERROR: cannot alter type of a column used in a policy definition`

**Why**: PostgreSQL checks policy expressions for type compatibility at DDL time. If a table has RLS policies referencing the column being altered, ALTER refuses.

**Fix sequence** (all inside one transaction):
```sql
-- Step A: Load and DROP policies
SELECT ... FROM pg_policy WHERE ... -- save definitions
DROP POLICY IF EXISTS "policyname" ON "public"."TableName"

-- Step B: Run ALTER statements
ALTER TABLE "public"."TableName" ALTER COLUMN "id" TYPE uuid USING "id"::uuid

-- Step C: Recreate policies with type-corrected expressions
CREATE POLICY "policyname" ON "public"."TableName" ...
```

**Check first**: Before any ALTER COLUMN TYPE, run:
```sql
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'YourTable'
```
If any rows → include drop+recreate.

---

## Pattern 3: Policy expression transformation for type changes

**Context**: When recreating policies after an ALTER COLUMN TYPE (TEXT → UUID), JWT text-extraction expressions need updating.

**Wrong**: Add `::text` to UUID column refs (breaks IN subqueries when inner SELECT returns UUID).

**Correct**: Add `::uuid` to JWT text-extraction expressions:
- `(auth.jwt() ->> 'key')` → `(auth.jwt() ->> 'key')::uuid`
- `auth.uid()::text` → `auth.uid()` (auth.uid() already returns UUID)

**Why**: JWT extractions (`->>`) return TEXT. Columns are now UUID. UUID = TEXT fails. Cast the JWT side to UUID so both are UUID.

---

## Pattern 4: pg_get_expr normalizes string literals to `'key'::type`

**Symptom**: Regex pattern `(auth.jwt() ->> 'key')` doesn't match what pg_get_expr returns.

**Why**: `pg_get_expr()` adds explicit type annotations to all literals:
- `'tenantId'` → `'tenantId'::text`
- `true` → `true` (booleans typically not changed)

So the actual expression is `(auth.jwt() ->> 'tenantId'::text)`.

**Fix**: In regex patterns, allow optional `(?:::[a-zA-Z]+)?` after literal placeholders:
```typescript
// Wrong:
/\(auth\.jwt\(\)\s*->>\s*'key'\)(?!::)/g

// Correct:
/\(auth\.jwt\(\)\s*->>\s*'key'(?:::[a-zA-Z]+)?\)(?!::)/g
```

**Tip**: Always console.log the actual pg_get_expr output before writing transformation regex.

---

## Pattern 5: PostgreSQL `pg` library returns arrays as strings

**Symptom**: `TypeError: .join is not a function` on an array column result.

**Why**: The `pg` Node.js library v8 returns PostgreSQL array types (TEXT[], OID[]) as raw string literals: `{val1,val2,val3}`. Not JavaScript arrays.

**Fix**: Use `string_agg()` instead of `array_agg()` in SQL when you need JS-usable results:
```sql
-- Wrong (returns '{role1,role2}' as a JS string):
SELECT array_agg(r.rolname) FROM pg_roles r WHERE ...

-- Correct (returns 'role1, role2' as a JS string):
SELECT string_agg(r.rolname, ', ') FROM pg_roles r WHERE ...
```

---

## Pattern 6: Savepoints prevent transaction cascade abort

**Symptom**: After one failed query, all subsequent queries fail with `current transaction is aborted, commands ignored until end of transaction block`.

**Why**: In PostgreSQL, any error inside a transaction puts the entire connection in ABORTED state. JavaScript try/catch doesn't recover the PostgreSQL connection state.

**Fix**: Use savepoints for sequential operations where individual failures are acceptable:
```typescript
const sp = `sp_item_${index}`.replace(/[^a-zA-Z0-9_]/g, '_')
await client.query(`SAVEPOINT ${sp}`)
try {
  await client.query(sql)
  await client.query(`RELEASE SAVEPOINT ${sp}`)
} catch (e) {
  await client.query(`ROLLBACK TO SAVEPOINT ${sp}`)
  // Transaction stays alive — only this savepoint is rolled back
}
```

---

## Migration script template (apply-and-verify pattern)

See `apply-uuid-migration.ts` for the full working example. Key structure:

```typescript
BEGIN
  capture baseline row counts
  DROP policies
  ALTER TABLE statements
  RECREATE policies (with savepoints per policy)
  block-tests (inside the transaction)
  if all pass → COMMIT
  else → ROLLBACK (DB unchanged)
```

This pattern: **apply-and-verify-atomically**. Never apply without verifying. Never verify externally after an un-rolled-back partial apply.
