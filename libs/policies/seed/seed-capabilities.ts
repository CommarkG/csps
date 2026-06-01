/**
 * seed-capabilities.ts — Seed DB Capability table from TS const SSoT
 *
 * Q4 decision: TS const = SSoT. DB is seeded FROM this file.
 * Run: npx tsx libs/policies/seed/seed-capabilities.ts
 *
 * GUARDRAIL: must use DIRECT_URL (port 5432) — set in .env.local.
 * Apply AFTER migration.sql has run.
 *
 * governing_intent: Capability rows in DB must exactly match the TS const.
 * validate-capability-registry.mjs --check-db verifies parity after seeding.
 */

import { PrismaClient } from '../generated/generated/client';
import { CAPABILITY } from '../capabilities';

const db = new PrismaClient();

const CAPABILITY_DEFINITIONS: Array<{
  slug: string;
  name: string;
  description: string;
  category: string;
}> = [
  { slug: CAPABILITY.AI_CONSULT,         name: 'AI Consultation',        description: '5 AI consultations/month on free; unlimited on pro+', category: 'ai' },
  { slug: CAPABILITY.AI_MULTI_MODEL,     name: 'Multi-Model Routing',    description: 'Choose Opus/Sonnet/Haiku per task',                   category: 'ai' },
  { slug: CAPABILITY.MULTI_MEMBER,       name: 'Multiple Members',       description: 'More than 1 member in a workspace',                   category: 'collaboration' },
  { slug: CAPABILITY.RBAC,               name: 'Role-Based Access',      description: 'Admin/member role differentiation',                   category: 'collaboration' },
  { slug: CAPABILITY.AUDIT_HISTORY_FULL, name: 'Full Audit History',     description: '30d on free; 365d on paid tiers',                     category: 'audit' },
  { slug: CAPABILITY.AUDIT_EXPORT,       name: 'Audit Export',           description: 'Export audit events to CSV/JSON',                     category: 'audit' },
  { slug: CAPABILITY.ANALYTICS_FULL,     name: 'Advanced Analytics',     description: 'Full analytics dashboard',                            category: 'reporting' },
  { slug: CAPABILITY.REPORTS_CUSTOM,     name: 'Custom Reports',         description: 'Build custom report templates',                       category: 'reporting' },
  { slug: CAPABILITY.WEBHOOKS,           name: 'Webhooks',               description: 'Outbound webhook events',                             category: 'integrations' },
  { slug: CAPABILITY.API_ACCESS,         name: 'API Access',             description: 'Programmatic API access',                             category: 'integrations' },
];

async function main() {
  console.log('[seed-capabilities] Seeding Capability table...');

  let created = 0;
  let existing = 0;

  for (const cap of CAPABILITY_DEFINITIONS) {
    const result = await db.capability.upsert({
      where: { slug: cap.slug },
      create: cap,
      update: { name: cap.name, description: cap.description, category: cap.category },
    });
    if (result.createdAt === result.updatedAt) created++;
    else existing++;
  }

  console.log(`[seed-capabilities] done: ${created} created, ${existing} updated`);
  console.log('[seed-capabilities] Run validate-capability-registry.mjs --check-db to verify parity');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
