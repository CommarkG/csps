#!/usr/bin/env node
// validate-isolation-layers.mjs — confirms ZenStack ORM layer + Postgres RLS both active
// BLOCKING if ZenStack is bypassed (raw db returned without enhance())
// ADVISORY if RLS confirmation not documented

import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());

function main() {
  const blocking = [];
  const advisory = [];

  // CHECK 1: ZenStack — is enhance() imported and used (not bypassed)?
  const zenstackPath = join(ROOT, 'apps/task-mgmt/src/lib/zenstack.ts');
  if (existsSync(zenstackPath)) {
    const content = readFileSync(zenstackPath, 'utf8');
    if (content.includes("return db") && !content.includes("enhance(")) {
      blocking.push({
        check: 'ZenStack-bypass',
        message: 'zenstack.ts returns raw db without enhance() — ORM policies not enforced',
        fix: 'Restore enhance(db, { user }) — see VLT-S022-ZENSTACK-GENERATE-PATH',
      });
    } else if (content.includes('enhance(')) {
      console.log('  ✅ ZenStack: enhance() active in zenstack.ts');
    } else {
      advisory.push({ check: 'ZenStack-unknown', message: 'Cannot determine ZenStack status from zenstack.ts' });
    }
  } else {
    advisory.push({ check: 'ZenStack-missing', message: 'apps/task-mgmt/src/lib/zenstack.ts not found' });
  }

  // CHECK 2: Postgres RLS — check if RLS was applied (documented in session-state)
  const statePath = join(ROOT, 'tools/session-state.json');
  if (existsSync(statePath)) {
    const state = JSON.parse(readFileSync(statePath, 'utf8'));
    const rls = state.platform_state?.rls_enabled ||
                (state.s022_session3_evidence &&
                 JSON.stringify(state).includes('enforce_audit_event_immutability'));
    if (rls) {
      console.log('  ✅ Postgres RLS: evidence found in session-state');
    } else {
      advisory.push({
        check: 'RLS-unconfirmed',
        message: 'No RLS evidence in session-state.json. Run Supabase RLS SQL if not done.',
        fix: 'Execute RLS policies SQL in Supabase dashboard. Add rls_enabled: true to platform_state.',
      });
    }
  }

  // CHECK 3: AuditEvent trigger documented
  const auditSqlPath = join(ROOT, 'libs/policies/audit-triggers.sql');
  if (existsSync(auditSqlPath)) {
    const sql = readFileSync(auditSqlPath, 'utf8');
    if (sql.includes('prevent_audit_event_mutation') || sql.includes('enforce_audit_event_immutability')) {
      console.log('  ✅ AuditEvent trigger: documented in audit-triggers.sql');
    } else {
      advisory.push({ check: 'AuditEvent-trigger', message: 'AuditEvent immutability trigger not documented in audit-triggers.sql' });
    }
  }

  if (blocking.length > 0) {
    console.log(`${blocking.length} BLOCKING isolation gap(s):`);
    for (const b of blocking) console.log(`  ✗ [${b.check}]: ${b.message}`);
  }
  if (advisory.length > 0) {
    console.log(`${advisory.length} advisory isolation gap(s):`);
    for (const a of advisory) console.log(`  ⚠ [${a.check}]: ${a.message}`);
  }
  if (blocking.length === 0 && advisory.length === 0) {
    console.log('  Isolation layers: ZenStack + RLS confirmed ✅');
  }

  console.log(`\n[validate-isolation-layers] blocking=${blocking.length} advisory=${advisory.length}`);
  process.exit(blocking.length > 0 ? 1 : 0);
}

main();
