---
id: csps.core-spines.l2-domain-arch-structural-integrity
name: L2_DOMAIN_ARCH_STRUCTURAL_INTEGRITY
description: ARCH spine domain governing structural invariants. Slice boundaries closed; tenant_id ubiquitous; RLS enforced; audit-trigger DDL on every table; schema-as-source-of-truth; multi-tenant load tested. Operational layer beneath L1_CORE_ARCH sealed doctrine.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
amendment_protocol: normal review (PCR + amendment)
template_used: l2-domain-doctrine
template_status: novel-pending-pattern-evaluation
core_spine: ARCH
schema_anchor: core_spines_l2_domain
parent_l1_doctrine: ./L1_CORE_ARCH.md
domain: STRUCTURAL_INTEGRITY
tags:
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S006
---

# L2_DOMAIN_ARCH_STRUCTURAL_INTEGRITY

Operational decomposition of ARCH spine — the domain governing **structural invariants that must hold regardless of feature**.

## What this domain governs

Every feature in CSPS is a slice with bounded contract — boundaries crossable only through declared interfaces, audit events emitted on every state change, validation that the boundary holds under multi-tenant load. The integrity of these invariants is non-negotiable; features that compromise them are rejected at slice-scorecard.

The domain establishes that data integrity is structural: tenant_id is on every row, RLS policies enforce isolation at the database, audit-trigger DDL emits an event on every INSERT/UPDATE/DELETE, multi-schema preview-feature enforces app boundaries. The schema declares what exists; absence from schema is absence from existence.

The integrity contract is provable: every slice carries scorecard ≥90% + Storybook + Chromatic snapshot + multi-tenant load test result. Slice-scorecard is the gate, not the courtesy.

## Operational governance surfaces

- **Slice contract** (P-ARCH-006 90% scorecard; bounded interface; audit-event emission)
- **ZModel as schema source of truth** (P-ARCH-018 schema-per-app; tenant_id ubiquity)
- **Postgres RLS** (per ADR-0007 postgres-trigger-based-audit; tenant isolation at database)
- **Audit-trigger DDL** (every auditable table; libs/policies/audit-triggers.sql)
- **Multi-schema preview-feature** (per ADR-0017; app schema boundary at database)

## Per-domain validators

- `slice-contract-90-percent` (P-ARCH-006 enforcement)
- `tenant-id-ubiquity` (every row has tenant_id; per-table audit)
- `rls-coverage` (every tenant table has rowsecurity=true)
- `audit-trigger-coverage` (every auditable table has trigger DDL)
- `audit-log-integrity` (no >5min gap per tenant in audit.events)

## Composition

Composes with L2_DOMAIN_ARCH_COMPOSITION (slice IS composition unit) + L2_DOMAIN_ARCH_TRACEABILITY (every audit event is provenance) + the VALD Spine's COVERAGE_DISCIPLINE domain (validators verify integrity holds) + the OPER Spine's REALITY_GROUNDING domain (multi-tenant load test grounds the contract in observed behavior).

**Domain signature:** S006-AI-l2-domain-arch-structural-integrity-2026-05-04T20:00:00Z
