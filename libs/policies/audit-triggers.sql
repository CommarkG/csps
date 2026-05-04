-- =============================================================================
-- CSPS Audit Triggers — DDL skeleton
-- Per pillar-2/audit-triggers.md + ADR-0007 (postgres-trigger-based-audit)
-- =============================================================================
--
-- Pattern: every audited table gets a BEFORE INSERT/UPDATE/DELETE trigger that
-- writes to audit.events. Partitioned by month for retention pruning per
-- audit-retention-pruning audit (per-tier: free 30d, paid 365d, enterprise 7y).
--
-- Skeleton tier: schema + base function + sample trigger registration.
-- Week-2 codegen will emit per-table CREATE TRIGGER statements from ZModel
-- entities marked `@@audit`.
--
-- Run via tools/bootstrap.ps1 step 4 (apply audit-trigger DDL).

-- ----------------------------------------------------------------------------
-- 1. audit schema (separated from public)
-- ----------------------------------------------------------------------------

CREATE SCHEMA IF NOT EXISTS audit;

-- ----------------------------------------------------------------------------
-- 2. audit.events partitioned by month for per-tier retention
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS audit.events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL,
  table_name  TEXT NOT NULL,
  row_id      TEXT NOT NULL,
  operation   TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  actor_id    UUID,
  actor_kind  TEXT NOT NULL CHECK (actor_kind IN ('user', 'admin', 'system', 'agent')),
  before_row  JSONB,
  after_row   JSONB,
  diff        JSONB,
  ip_address  INET,
  user_agent  TEXT,
  request_id  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
) PARTITION BY RANGE (created_at);

-- ----------------------------------------------------------------------------
-- 3. partition rolling — first 12 months created up front; cron rolls forward
-- ----------------------------------------------------------------------------

DO $$
DECLARE
  i INTEGER;
  partition_name TEXT;
  partition_start DATE;
  partition_end DATE;
BEGIN
  FOR i IN 0..11 LOOP
    partition_start := date_trunc('month', CURRENT_DATE) + (i * INTERVAL '1 month')::INTERVAL;
    partition_end := partition_start + INTERVAL '1 month';
    partition_name := 'events_' || to_char(partition_start, 'YYYY_MM');
    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS audit.%I PARTITION OF audit.events FOR VALUES FROM (%L) TO (%L)',
      partition_name, partition_start, partition_end
    );
  END LOOP;
END $$;

-- ----------------------------------------------------------------------------
-- 4. base trigger function
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION audit.fn_write_event() RETURNS trigger AS $$
DECLARE
  v_tenant_id UUID;
  v_actor_id UUID;
  v_actor_kind TEXT;
  v_diff JSONB;
BEGIN
  -- Tenant + actor pulled from session vars (set by application layer per request)
  v_tenant_id := nullif(current_setting('app.current_tenant_id', true), '')::UUID;
  v_actor_id := nullif(current_setting('app.current_actor_id', true), '')::UUID;
  v_actor_kind := COALESCE(nullif(current_setting('app.current_actor_kind', true), ''), 'system');

  IF v_tenant_id IS NULL THEN
    -- Refuse to write audit events without tenant context (RLS coverage signal)
    RAISE EXCEPTION 'audit.fn_write_event: app.current_tenant_id not set in session';
  END IF;

  -- Compute diff for UPDATE; full row for INSERT/DELETE
  IF TG_OP = 'UPDATE' THEN
    v_diff := jsonb_strip_nulls(to_jsonb(NEW) - to_jsonb(OLD));
  END IF;

  INSERT INTO audit.events (
    tenant_id, table_name, row_id, operation, actor_id, actor_kind,
    before_row, after_row, diff,
    ip_address, user_agent, request_id
  ) VALUES (
    v_tenant_id,
    TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME,
    COALESCE(NEW.id::TEXT, OLD.id::TEXT),
    TG_OP,
    v_actor_id,
    v_actor_kind,
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    v_diff,
    nullif(current_setting('app.request_ip', true), '')::INET,
    nullif(current_setting('app.request_user_agent', true), ''),
    nullif(current_setting('app.request_id', true), '')
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 5. helper to attach trigger to any table
-- ----------------------------------------------------------------------------
-- Usage from application migration files:
--   SELECT audit.attach_trigger('public', 'users');
-- ZModel @@audit annotation generates these calls per-entity at codegen time.

CREATE OR REPLACE FUNCTION audit.attach_trigger(p_schema TEXT, p_table TEXT) RETURNS VOID AS $$
DECLARE
  v_trigger_name TEXT;
BEGIN
  v_trigger_name := 'tr_audit_' || p_table;
  EXECUTE format(
    'DROP TRIGGER IF EXISTS %I ON %I.%I; ' ||
    'CREATE TRIGGER %I AFTER INSERT OR UPDATE OR DELETE ON %I.%I ' ||
    'FOR EACH ROW EXECUTE FUNCTION audit.fn_write_event()',
    v_trigger_name, p_schema, p_table,
    v_trigger_name, p_schema, p_table
  );
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 6. RLS: audit.events read-only for staff role; tenant rows by tenant_id
-- ----------------------------------------------------------------------------

ALTER TABLE audit.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_read ON audit.events FOR SELECT
  USING (tenant_id = nullif(current_setting('app.current_tenant_id', true), '')::UUID);

CREATE POLICY no_direct_write ON audit.events FOR ALL
  USING (false) WITH CHECK (false);  -- only the trigger function writes

-- =============================================================================
-- End of skeleton. Per pillar-2/audit-triggers.md week-2 enhancements:
-- - Per-tier retention via partition pruning (audit-retention-pruning weekly)
-- - audit-log-integrity check (>5min gap = P0 — runbooks.md)
-- - Per-table @@audit ZModel codegen → CREATE TRIGGER batch on migration
-- =============================================================================
