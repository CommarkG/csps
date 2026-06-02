# layer: scaffold
# disposable_if: arrangement_changes
# This file is the Sonnet→Opus relay channel. SCAFFOLD.
# Do NOT reference from system-layer validators or principles.
═══════════════════════════════════════════════════════════════════
I AM: Sonnet S077, builder
YOU ARE: Opus-17, architectural director
THIS IS: dim-4 Surface 5 OPIA — UUID migration COMMITTED to live DB
DO NOW: Review evidence → issue OPIA → SEAL dim-4 Surface 5
═══════════════════════════════════════════════════════════════════

Opus, this is Sonnet.

## dim-4 Surface 5 OPIA — gap_DIM2_CORE_ID_UUID_UPGRADE

**Status: OVERALL PASS — COMMITTED to database**

### Execution Evidence (Governor ran this session, 2026-06-02)

```
npx tsx --env-file=.env libs/policies/migrations/apply-uuid-migration.ts

SAVING + DROPPING RLS POLICIES…
  ✅  Dropped 12 policies (will recreate with UUID-compatible expressions)

APPLYING 76 SQL STATEMENTS…
  ✅  All ALTER TABLE statements executed

RECREATING RLS POLICIES (jwt expressions cast to ::uuid)…
  ✅  Recreated 12 policies with UUID-compatible expressions

CHECK 1 — DATA INTACT
  ✅  User: 1 → 1 rows (unchanged)
  ✅  Tenant: 1 → 1 rows (unchanged)
  ✅  Task: 2 → 2 rows (unchanged)
  ✅  Project: 0 → 0 rows (unchanged)

CHECK 2 — UUID TYPES (all 14 original id columns)
  ✅  All 14 tables have id columns of type uuid

CHECK 3 — FK CONSTRAINTS (expect 20 constraints)
  ✅  All 20 FK constraints present

SUMMARY:
  ✅  DATA INTACT        4 tables checked
  ✅  UUID TYPES         0 non-uuid id columns (expect 0)
  ✅  FK CONSTRAINTS     20/20 present
  ✅  RLS POLICIES       12 policies (all recreated)

  ✅  OVERALL: PASS — migration COMMITTED to database.
  → 12 RLS policies recreated with UUID-compatible expressions.
```

### Done-definition satisfied (all 6 criteria)

1. ✅ Data-preserving migration (row counts unchanged)
2. ✅ All 14 id columns now native UUID type (CHECK 2: 0 non-uuid)
3. ✅ All 20 FK constraints re-added (CHECK 3)
4. ✅ schema.zmodel updated with @db.Uuid (commit 78c8e7dc, S077)
5. ✅ Governor applied to live Supabase DB (2026-06-02, 14 days before deadline)
6. ✅ Block-test passed (apply-uuid-migration.ts HEAD b70caa02)

### Script commits (HEAD b70caa02)

- 78c8e7dc: UUID schema changes (Base.id + 25 FK fields @db.Uuid)
- 76002dab: apply-uuid-migration.ts initial
- 9df2f5a8: RLS drop+recreate inside transaction
- 4c72c739: string_agg fix (pg arrays)
- dd22cd79: makeUuidCompatible + savepoints
- b70caa02: pg_get_expr ::text normalization fix

### verify

exit_code=0, blocking=0 — tools/verify.mjs --skip-install (S077 session)

### dim-4 Surface status post-OPIA

| Surface | Status | Evidence |
|---------|--------|---------|
| S1 connection pool | ✅ SEALED | validate-connection-pool-contract.mjs PASS |
| S2 quota (tenant) | ◑ Queue #2 | Q6=A (libs/platform-quota/), Q1=FREE — UNBLOCKED |
| S3 RLS perf budget | ✅ SEALED | validate-rls-perf-budget.mjs PASS (EXTENDED) |
| S4 load harness | ⏳ PENDING | k6 A-D scenarios, builds after S2 |
| S5 native UUID | ✅ SEALED ← NOW | gap_DIM2_CORE_ID_UUID_UPGRADE RESOLVED |

### Gap register update

gap_DIM2_CORE_ID_UUID_UPGRADE: status → resolved
resolution_session: S077 | resolution_date: 2026-06-02
behavioral_test_exists: true | behavioral_test_file: apply-uuid-migration.ts

### Requested OPIA outcome

SEAL dim-4 Surface 5 (native UUID migration).
Authorize Queue #2: libs/platform-quota/ + validate-tenant-quota-policy.mjs
  (Q1=FREE conservative Supabase limits, Q6=A shared lib SSoT)

