---
id: csps.bundles.pending
name: PENDING_BUNDLES
description: "Foundation Bundles blocked on Supabase provision + ZModel promotion. These are part of CORE-COMPLETE-EXIT-CRITERIA.md Layer 1. Cannot be sealed until DB infrastructure is live."
version: "1.0"
session: S056
owner: group:finky
core_spine: GVRN
schema_anchor: vault_files
lifecycle: production
lifecycle_state: active
diataxis_type: reference
impl_status: swift-implemented
context_question: "Have the blocking conditions for these bundles been resolved? TENANCY requires Supabase provisioned + ZModel working. AUDIT_BASE requires DB event tables."
links:
  - { rel: core-exit-criteria, href: ../docs/plan/pillar-0-governance/CORE-COMPLETE-EXIT-CRITERIA.md }
  - { rel: template-bundle-system, href: ../docs/SIA/R1-08-TEMPLATE-BUNDLE-SYSTEM.md }
---

# Pending Foundation Bundles

> These 2 Foundation Bundles are BLOCKED on DB infrastructure.
> Governor is provisioning Supabase. These bundles will be sealed as part of Layer 1 completion.

---

## TENANCY Bundle (BLOCKED — requires Supabase + ZModel)

**Status:** PENDING — blocked on Supabase provision
**Blocking condition:** `DATABASE_URL` + ZenStack `@allow` policies operational
**What it provides:** ZenStack RLS row-level isolation — every entity scoped to tenantId
**PRIVATE-BUSINESS-SILOS guarantee:** personal data encrypted in separate silo, excluded from business training sets
**When to seal:** After Supabase provisioned + ZModel promotion complete + `validate-foundation-schema-drift.mjs` passes

Target file: `tools/bundles/foundation/TENANCY.bundle.yaml`

---

## AUDIT_BASE Bundle (BLOCKED — requires DB event tables)

**Status:** PENDING — blocked on Supabase provision
**Blocking condition:** AuditEvent Postgres trigger live (see `libs/policies/audit-triggers.sql`)
**What it provides:** Append-only audit trail — who did what, when (DB level, not app level)
**Immutability guarantee:** `enforce_audit_event_immutability` Postgres trigger prevents UPDATE/DELETE
**When to seal:** After TENANCY bundle sealed + AuditEvent trigger confirmed active (S3-E7 pattern)

Target file: `tools/bundles/foundation/AUDIT_BASE.bundle.yaml`

---

## Sealing Sequence

```
1. Governor provisions Supabase (DATABASE_URL)
2. ZModel ZenStack wired (validate-foundation-schema-drift.mjs passes)
3. AuditEvent trigger deployed (S3-E7 pattern confirmed)
4. TENANCY.bundle.yaml sealed
5. AUDIT_BASE.bundle.yaml sealed
6. Layer 1 Template Bundle Foundation exit criterion COMPLETE
```

*Registered S056 | Template Bundle System R1-08 | CORE-COMPLETE-EXIT-CRITERIA.md Layer 1*
