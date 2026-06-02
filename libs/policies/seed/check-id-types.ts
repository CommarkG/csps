/**
 * check-id-types.ts — READ-ONLY diagnostic (S076 FINDING-S076-DIM2-03)
 *
 * Prints the live DB's `id` column type for the 5 core tables + one sample id,
 * so the council can decide how to reconcile the UUID-vs-existing-type divergence
 * that blocked `prisma db push` ("Changed the type of id ... no cast exists").
 *
 * WRITES NOTHING. Only SELECTs from information_schema + one sample row.
 * Run: npx tsx libs/policies/seed/check-id-types.ts
 */

import { PrismaClient } from '../generated/generated/client';

const db = new PrismaClient();

async function main() {
  console.log('[check-id-types] Reading live column types (read-only)...\n');

  const cols: Array<{ table_name: string; data_type: string; udt_name: string }> =
    await db.$queryRawUnsafe(`
      SELECT table_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND column_name = 'id'
        AND table_name IN ('User','Tenant','AuditEvent','Task','UserTenant')
      ORDER BY table_name;
    `);

  console.log('id column types in the live database:');
  for (const c of cols) {
    console.log(`  ${c.table_name.padEnd(12)} → data_type=${c.data_type}  (udt_name=${c.udt_name})`);
  }

  // One sample id from Tenant (known to contain data) to see the actual format.
  const sample: Array<{ sample_id: string }> =
    await db.$queryRawUnsafe(`SELECT id::text AS sample_id FROM "Tenant" LIMIT 1;`);
  console.log(`\nSample Tenant.id value: ${sample.length ? sample[0].sample_id : '(no rows)'}`);
  console.log('  → a UUID looks like  xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
  console.log('  → a cuid looks like  c followed by ~24 letters/numbers (no dashes)');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
