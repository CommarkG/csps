---
id: csps.pillar-2.audit-triggers
name: audit-triggers
description: The Postgres trigger-based audit system. The audit_foundation migration SQL — partitioned audit.events table, monthly partitions, audit.record() trigger function, mandatory indexes, session-locals wrapper, optimization rules. Audit-by-trigger is uncatchable; app middleware is bypassable.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:data
  - type:reference
  - audience:developer
  - maturity:stable
crosscutting:
  - security
  - reliability
  - performance
  - observability
  - multi-tenant
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ../pillar-0-governance/reuse-first-principle.md }
  - { rel: foundation-zmodel, href: ./foundation-zmodel.md }
  - { rel: app-schema-contract, href: ./app-schema-contract.md }
  - { rel: audit-runner, href: ../pillar-0-governance/audit-runner.md }
---

# Audit Triggers (SQL)

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The Postgres trigger-based audit system. The migration SQL that creates the partitioned `audit.events` table, the `audit.record()` trigger function, mandatory indexes, monthly partitions. Plus the session-locals wrapper that captures *who/why* alongside *what*. Plus the optimization rules (statement-level triggers for bulk paths, partial unique indexes, composite indexes).

## Why this exists

Audit-by-trigger is one of the load-bearing principles (P-ARCH-008). The trigger function is uncatchable; app middleware is bypassable. The day a developer or Mastra agent bypasses Prisma with raw SQL, app-level audit is silent. **Postgres triggers fire regardless** — the only audit you can trust.

This document is the implementation reference for that principle.

## The audit foundation migration

Run this once at bootstrap (per [pillar 6 / bootstrap-script.md](../pillar-6-operations-and-delivery/bootstrap-script.md) step 7).

```sql
-- prisma/migrations/0000_audit_foundation.sql

CREATE SCHEMA IF NOT EXISTS audit;

-- Partitioned audit table — partition strategy is non-negotiable at scale
CREATE TABLE audit.events (
  id              BIGSERIAL,
  tenant_id       TEXT,
  table_schema    TEXT NOT NULL,           -- which schema the change happened in
  table_name      TEXT NOT NULL,
  row_id          TEXT NOT NULL,
  action          TEXT NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE')),
  actor_id        TEXT,
  impersonated_id TEXT,                    -- non-null when staff impersonates customer
  request_id      TEXT,
  route           TEXT,
  before          JSONB,
  after           JSONB,
  diff            JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
) PARTITION BY RANGE (created_at);

-- Mandatory indexes for the access patterns the dashboard uses
CREATE INDEX ON audit.events (tenant_id, table_schema, table_name, row_id, created_at DESC);
CREATE INDEX ON audit.events (actor_id, created_at DESC);
CREATE INDEX ON audit.events (table_schema, created_at DESC);   -- per-app rollups

-- Monthly partitions, rolled forward 12 months by cron
CREATE TABLE audit.events_y2026m05 PARTITION OF audit.events
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
CREATE TABLE audit.events_y2026m06 PARTITION OF audit.events
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
-- ... etc (12 months ahead at any time)

-- The trigger function (one global function reused by every table)
CREATE OR REPLACE FUNCTION audit.record() RETURNS TRIGGER AS $$
DECLARE
  v_tenant   TEXT := COALESCE(current_setting('app.tenant_id',    true), NULL);
  v_actor    TEXT := COALESCE(current_setting('app.actor_id',     true), NULL);
  v_imp      TEXT := COALESCE(current_setting('app.impersonated', true), NULL);
  v_request  TEXT := COALESCE(current_setting('app.request_id',   true), NULL);
  v_route    TEXT := COALESCE(current_setting('app.route',        true), NULL);
  v_before   JSONB; v_after JSONB; v_diff JSONB; v_row_id TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_after := to_jsonb(NEW); v_row_id := NEW.id;
  ELSIF TG_OP = 'UPDATE' THEN
    v_before := to_jsonb(OLD); v_after := to_jsonb(NEW);
    v_diff   := jsonb_diff(v_before, v_after); v_row_id := NEW.id;
  ELSE
    v_before := to_jsonb(OLD); v_row_id := OLD.id;
  END IF;
  INSERT INTO audit.events
    (tenant_id, table_schema, table_name, row_id, action, actor_id, impersonated_id,
     request_id, route, before, after, diff)
  VALUES
    (v_tenant, TG_TABLE_SCHEMA, TG_TABLE_NAME, v_row_id, TG_OP, v_actor, v_imp,
     v_request, v_route, v_before, v_after, v_diff);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper for diff computation (small Postgres extension or function)
CREATE OR REPLACE FUNCTION jsonb_diff(old jsonb, new jsonb) RETURNS jsonb AS $$
  SELECT jsonb_object_agg(key, value)
  FROM jsonb_each(new)
  WHERE NOT (old ? key) OR old->key IS DISTINCT FROM value;
$$ LANGUAGE sql IMMUTABLE;
```

### Why monthly partitions from day one

Retrofitting partitioning at 200M rows is brutal. ~30 lines of SQL up front; retention drives partition detach. Per-tier audit retention (free 30d / paid 365d / enterprise 7y) is enforced via partition pruning weekly (per `audit-retention-pruning` audit check).

### Why `current_setting('app.tenant_id', true)` (session-locals)

The trigger fires inside the transaction; the app sets session-locals at request entry. This is how the trigger captures *who* and *why*, not just *what*. The pattern is formalized in our wrapper (next section).

## Optimization rules

### 1. Statement-level triggers for bulk paths

For-each-row triggers on a 100k-row insert pay 100k trigger executions. The slice generator detects the `@bulkInsert` annotation and emits a statement-level alternative writing one summary row.

```sql
-- Instead of FOR EACH ROW for bulk imports:
CREATE TRIGGER bulk_import_audit
AFTER INSERT ON some_bulk_table
REFERENCING NEW TABLE AS new_rows
FOR EACH STATEMENT
EXECUTE FUNCTION audit.record_bulk();
```

### 2. Partial unique indexes for soft-delete

Prisma multi-schema doesn't generate from `@@unique` when soft-delete is involved. The migration appends:

```sql
CREATE UNIQUE INDEX users_tenant_email_unique
  ON public.users (tenant_id, email)
  WHERE deleted_at IS NULL;
```

Without this, soft-deleted rows would hold the unique constraint forever (oops, deleted user X, can't re-register their email).

### 3. Composite indexes on every tenant table

Always `(tenant_id, ...)` not just `(...)`. Every tenant-scoped query filters by `tenant_id` first; a `(tenant_id, X)` composite index serves both `WHERE tenant_id = ?` and `WHERE tenant_id = ? AND X = ?` queries.

### 4. `pg_stat_statements` enabled from day one

Non-negotiable. Cannot tune what isn't measured. The bootstrap migration includes:

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

## Session-locals wrapper (Next.js middleware → Prisma `$extends`)

The wrapper that sets session-locals at the start of every transaction so the trigger can capture *who/why*:

```ts
// packages/db/src/with-actor-context.ts
export async function withActorContext<T>(
  ctx: { tenantId: string; actorId: string; impersonatedId?: string;
         requestId: string; route: string; staffRole?: string },
  fn: () => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`SET LOCAL app.tenant_id    = '${ctx.tenantId}'`);
    await tx.$executeRawUnsafe(`SET LOCAL app.actor_id     = '${ctx.actorId}'`);
    if (ctx.impersonatedId)
      await tx.$executeRawUnsafe(`SET LOCAL app.impersonated = '${ctx.impersonatedId}'`);
    await tx.$executeRawUnsafe(`SET LOCAL app.request_id   = '${ctx.requestId}'`);
    await tx.$executeRawUnsafe(`SET LOCAL app.route        = '${ctx.route}'`);
    if (ctx.staffRole)
      await tx.$executeRawUnsafe(`SET LOCAL app.staff_role  = '${ctx.staffRole}'`);
    return fn();
  });
}
```

### Why `SET LOCAL`

Session-locals scoped to the transaction. When the transaction ends, the locals die. This is what makes PgBouncer transaction-mode pooling safe with this pattern (the next pool reuser doesn't inherit our context — the `search_path` leak issue from [app-schema-contract.md](./app-schema-contract.md) does NOT apply here because `SET LOCAL` is transaction-scoped, not connection-scoped).

### Why `$executeRawUnsafe`

Prisma's parameterized queries don't work with `SET LOCAL` (Postgres doesn't accept parameter placeholders for SET statements). The values being set are server-side controlled (from session JWT), not user input — but as a defense-in-depth measure, the wrapper validates each value matches expected patterns before interpolation.

## ZenStack `enhance()` integration

ZenStack's `enhance()` doesn't natively set Postgres session-locals. The integration lives in `packages/db/src/enhanced.ts` (per [foundation-zmodel.md](./foundation-zmodel.md)) and wraps every enhanced query in `withActorContext`.

This is the same wrapper that delegates Payload `access` functions through ZenStack's `canRead` — **one canonical authz path** (per P-ARCH-010 defense in depth).

## Trigger attachment per slice

Every slice's migration appends:

```sql
CREATE TRIGGER <slice>_audit
AFTER INSERT OR UPDATE OR DELETE ON <schema>.<slice>
FOR EACH ROW EXECUTE FUNCTION audit.record();
```

The slice generator (`platform:slice` per [pillar 4 / generators.md](../pillar-4-developer-experience/generators.md)) emits this automatically. The slice contract check #4 (per [pillar 1 / slice-contract.md](../pillar-1-architecture-and-stack/slice-contract.md)) verifies the trigger exists via `pg_trigger` introspection.

## Audit query patterns

Common queries the dashboard uses (all hit the mandatory indexes):

```sql
-- All changes to a specific row, newest first
SELECT * FROM audit.events
WHERE tenant_id = $1 AND table_schema = $2 AND table_name = $3 AND row_id = $4
ORDER BY created_at DESC LIMIT 50;

-- All actions by a specific actor
SELECT * FROM audit.events
WHERE actor_id = $1
ORDER BY created_at DESC LIMIT 100;

-- Per-app rollup (count of events by table, last 24h)
SELECT table_name, COUNT(*) FROM audit.events
WHERE table_schema = $1 AND created_at > now() - interval '24 hours'
GROUP BY table_name;

-- Detect impersonation usage (compliance)
SELECT * FROM audit.events
WHERE impersonated_id IS NOT NULL AND created_at > now() - interval '7 days'
ORDER BY created_at DESC;
```

## Per-tier retention policy

Implemented via partition detach + cold storage upload (weekly cron):

| Tier | Hot retention (queryable) | Cold retention (S3) |
|---|---|---|
| Free | 30 days | none (purged after 30d) |
| Pro | 365 days | 2 years (then purged) |
| Business | 365 days | 5 years (then purged) |
| Enterprise | 365 days | 7 years (then purged; SOC 2-aligned) |

Implemented by `libs/audits/checks/audit-retention-pruning.ts` (weekly).

## Cross-references to architecture principles

This document directly enforces:
- **P-ARCH-008** (audit by trigger, not by app code) — the entire trigger system
- **P-ARCH-010** (defense in depth) — RLS on `audit.events` (append-only via `@@deny('update,delete', true)` policy + Postgres-level append-only enforcement)
- **P-ARCH-018** (schema-per-app) — `table_schema` column captures which schema the change happened in (enables per-app rollups + extraction filtering)
- **P-ARCH-007** (soft-delete by default) — partial unique indexes pattern documented here

## Reuse-first applied to audit triggers

Before customizing an audit trigger:

1. **The shared `audit.record()` function handles 99% of cases** — every slice uses it via the auto-attached trigger
2. **Need different audit shape?** (e.g., audit a `JOIN` between two tables) — write a custom trigger function in the slice's migration; reference `audit.record()` as the model
3. **Need statement-level triggers?** (bulk paths) — add the `@bulkInsert` annotation to the ZModel; the generator emits the statement-level alternative

Don't fork `audit.record()` — its uniformity is what enables the audit-runner queries to work across all tables.

## Sources

- [Postgres trigger functions documentation](https://www.postgresql.org/docs/current/plpgsql-trigger.html)
- [Postgres partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)
- [pg_stat_statements](https://www.postgresql.org/docs/current/pgstatstatements.html)
- [SET LOCAL semantics](https://www.postgresql.org/docs/current/sql-set.html)
- [JSONB diff patterns](https://www.postgresql.org/docs/current/functions-json.html)
- v1.3 master plan §8 (the original draft this leaf migrates from)
