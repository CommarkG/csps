---
id: csps.pillar-6.dashboards
name: dashboards
description: Admin dashboards (apps/admin/app/(admin)/*). Slice-scorecard + audit-fitness + persona-eval + crisis-event-queue + cost-attribution + the 6 /admin/intake/* pages from _intake/dashboard-plan.md (Inbox / Pipeline / Contexts / Schema-Gaps / Blockers / Audit). Read-from-audit + read-from-facts; live drift detection; staffRole-gated impersonation. Migrated from v1.3 §15 + incorporates _intake/dashboard-plan.md (EXT-20260502-001-D).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
next_review_at: 2026-08-01
tags:
  - domain:ops
  - type:reference
  - audience:developer
  - audience:admin
  - maturity:stable
crosscutting:
  - observability
  - reliability
  - ai-native
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: build-order, href: ./build-order.md }
  - { rel: intake-dashboard-plan, href: ../_intake/dashboard-plan.md }
  - { rel: extractions-ledger, href: ../_intake/extractions-ledger.md }
  - { rel: persona-evals, href: ../pillar-5-ai-systems/persona-composition.md }
  - { rel: crisis-events, href: ../pillar-5-ai-systems/crisis-escalation.md }
  - { rel: audit-runner, href: ../pillar-0-governance/audit-runner.md }
created-new-because: |
  No prior leaf documented the admin dashboards. v1.3 §15 had a bullet list; _intake/dashboard-
  plan.md added 6 intake pages (treasure #3 D). This leaf consolidates ALL admin dashboards
  into one reference + locks the read-only-vs-edit boundaries + impersonation gates.
domain_path: platform
core_spine: OPER
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Before starting this operation: has it been validated in the current deployment environment, or only in dev?"
---

# Admin Dashboards

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The complete `apps/admin/app/(admin)/*` route map. Per pillar-3/template-governance template-only-page-creation rule: every dashboard uses a registered template. Per AGENTS.md hard NO: the admin app is ONE app with many views gated by `staffRole`; we do not build separate admin apps per concern.

## Route map

```
apps/admin/app/(admin)/
├── slice-scorecard/                    ← live slice-contract scoring
├── audit-fitness/                      ← audit-runner findings + trend
├── persona-evals/                      ← drift / style / domain accuracy
├── crisis-events/                      ← live queue + handoff
├── cost-attribution/                   ← per-tenant cost breakdown
├── policies/                           ← rule registry UI (per pillar-0/rule-registry)
├── impersonation/                      ← staff acts-as-user (gated)
├── stewardship-review/                 ← P-META-004 surface
├── learning-loop/                      ← P-META-005 surface (LearningLoopItem ledger)
└── intake/                             ← P-META-005 + intake plane (6 sub-pages)
    ├── inbox/                          ← drop-zone surface
    ├── pipeline/                       ← Kanban state machine view
    ├── contexts/                       ← per-leaf navigation tree
    ├── schema-gaps/                    ← discovery channel
    ├── blockers/                       ← BLK-* registry
    └── audit/                          ← intake-plane audit trail
```

## Per-page contracts

### `/admin/slice-scorecard`

- Lists every slice with current scorecard %
- Drill-in shows the 16 checks + which failing
- Filter by app / pillar / tier / score range
- Trend line (last 90 days)
- READ-ONLY (scoring is computed; cannot be hand-edited)

### `/admin/audit-fitness`

- Audit-runner findings live (NEG taxonomy + POS taxonomy per `qc-audit-system.md`)
- Per-finding: severity / artifact / suggested-remedy / linked PR (if remediation in flight)
- Trend by severity (last 90 days)
- READ-ONLY (fixes happen via PR; dashboard surfaces the queue)

### `/admin/persona-evals`

- Per-persona drift / style / domain-accuracy scores
- Per-persona crisis-detector recall (must = 100% on test corpus)
- Eval-result history (last 30 days)
- Tier filter; visibility filter
- READ-ONLY (eval baselines updated via persona generator)

### `/admin/crisis-events`

- Live queue of CrisisEvent rows by severity (medium / high / critical)
- Per-event: trigger-source / category / persona / user / timestamp / escalation-path-taken
- Reviewed-by / reviewed-at fields editable BY staff with `crisis-review` credential only (subset of staffRole)
- "Take handoff" button routes the conversation to the staff member
- 7-year retention (regulatory floor); audit-trail every read

### `/admin/cost-attribution`

- Per-tenant: storage / compute / LLM-tokens / audit-row-count
- Per-app: aggregate of tenants
- Per-pillar: cost-per-slice (drill-in to identify hotspots)
- Tier-threshold alerts (e.g., free-tier user approaching pro-tier cost trigger)
- READ-ONLY (cost reduction happens via partition pruning + tier reconciliation cron)

### `/admin/policies`

- Rule registry UI (per pillar-0/rule-registry.md)
- List of every principle + its enforcer count + enforcer paths
- Drill-in shows enforcer status (active / declared / deferred)
- READ-ONLY (additions via `principles.yaml` + codegen; UI just visualizes)

### `/admin/impersonation`

- Search user by email / Clerk ID
- "Impersonate" action (gated by `staffRole: super-admin`); audit-logged with reason
- Active impersonation session indicator (top banner; clearly distinguished from real-user session)
- Auto-end after 30 minutes; manual end button
- Audit retains full impersonation transcript

### `/admin/stewardship-review`

- Surfaces every artifact with `lifecycle_state` ∈ {pending-protocol, pending-review, active-stale}
- Per-artifact: time-since-last-transition + `next_review_at` countdown
- Bulk operations: extend `next_review_at`; promote state; mark resolved
- Audit logs every state transition (P-META-004 enforcer)

### `/admin/learning-loop`

- LearningLoopItem ledger (P-META-005)
- Per-item: pipeline_state + confidence_band + recurrence-count + SLA breach indicator
- K=2-within-90d auto-ADR proposal queue (review + accept/reject)
- Confidence-band distribution chart

### `/admin/intake/*` (6 sub-pages — per `_intake/dashboard-plan.md`)

#### `/admin/intake/inbox`
Drop-zone surface. EXT-IDs + source-type badge + risk badge + gate-state + ingested-at + sub-ID count + fan-out target leaves + pipeline_state + lifecycle_state + time-since-last-transition. Edit affordances: re-classify source-type / override risk / re-scan / force-route / promote / demote (all audit-logged). Filters by source-type / risk / gate-state / age / tenant_id. Bulk operations supported.

#### `/admin/intake/pipeline`
Kanban-style. 6 columns (`observed → triaged → routed → fixing → validated → closed`). Cards per EXT-ID. SLA-breach color-coding (green / yellow / orange / red). Drag-and-drop with mandatory reason field per transition. Lane-summary metrics (count / avg-age / SLA-breach / P0-P3 distribution).

#### `/admin/intake/contexts`
Per-leaf navigation tree mirroring `_intake/contexts/`. 9 pillar branches collapsible to leaves. Per leaf: active EXT-IDs + dwell-time + SLA adherence + last-activity. Edit affordances: per-leaf SLA tier override + inheritable-tags edit + move-EXT-IDs (preserves provenance).

#### `/admin/intake/schema-gaps`
Discovery channel. Lists every active schema-gap from `_schema-gap-registry.md`. Threshold indicators K=1 (gray) / K=2 (yellow + ADR draft auto-created) / K=3 (orange) / K≥4 (red, auto-promotion to pending-protocol).

#### `/admin/intake/blockers`
BLK-S<NNN>-* registry. Per blocker: state + severity + originating-session + awaiting-from + age. Filter by session / severity / state. Editable: state advancement (open → answered → resolved) with audit-logged reason.

#### `/admin/intake/audit`
Intake-plane audit trail. Read-only. Every state transition / re-classification / force-route / bulk operation logged. Filterable by EXT-ID / actor / time range.

## Read-from-audit, read-from-facts (the data architecture)

Per pillar-2 audit triggers + ZModel slices: dashboards never read live application tables. They read:

- `audit.events` (per pillar-2/audit-triggers.md) — for everything historical
- `*_facts` materialized views (per pillar-2 starter-slices) — for current-state aggregates

This isolates dashboards from application-row-mutation; dashboards cannot accidentally trigger writes; audit-of-dashboard-reads becomes possible.

## Impersonation gate (per AGENTS.md hard NO)

- Impersonation requires `staffRole: super-admin` (subset of staffRole)
- Every impersonation session logs:
  - actor (staff Clerk ID)
  - target (impersonated user Clerk ID)
  - reason (free-text; non-empty enforced)
  - start_at + end_at
  - full action transcript
- Top banner ALWAYS visible during active impersonation (high-contrast color; not dismissible)
- Auto-end after 30 minutes (forces explicit re-impersonation; prevents background-tab abuse)

## Anti-patterns

1. **Building a separate admin app per concern** — refused; `/admin/*` is the surface; new view = new sub-route
2. **Direct application-table reads** — refused; read from audit + facts only
3. **Impersonation without reason** — refused; reason is non-empty enforced + audit-logged
4. **Crisis-event review without `crisis-review` credential** — refused
5. **Bypassing template registry for dashboard pages** — refused; per template-governance + ADR-0004
6. **Dashboard editing crisis-event severity** — refused; severity is computed from trigger-source + classifier-score; not editable

## Enforcement

- `principles.yaml#P-ARCH-013` (one-admin-app-many-views; corresponds to ADR-0011 pillar-architecture)
- `principles.yaml#P-ARCH-019` (crisis-escalation-load-bearing — admin queue is the handoff target)
- `principles.yaml#P-META-004` (Stewardship — `/admin/stewardship-review` is its surface)
- `principles.yaml#P-META-005` (Learning Loop — `/admin/learning-loop` is its surface)
- `audit-runner.md#admin-app-singleton` (PR-blocking; no separate admin-* apps)
- `audit-runner.md#impersonation-banner-presence` (PR-blocking; banner component required on impersonated route)
- `audit-runner.md#dashboard-direct-table-read` (PR-blocking; static-analysis catches non-audit-non-facts reads)
- `apps/admin/middleware.ts` (staffRole gate)
- `apps/admin/app/(admin)/intake/_components/` (shared intake-page components)

## Sources

- v1.3 §15 (the original dashboards bullet list)
- [_intake/dashboard-plan.md](../_intake/dashboard-plan.md) (EXT-20260502-001-D treasure #3 D — the 6 intake pages this leaf incorporates)
- [pillar-2/audit-triggers.md](../pillar-2-data-and-schema/audit-triggers.md) (the audit substrate dashboards read from)
- [pillar-3/template-governance.md](../pillar-3-platform-services/template-governance.md) (template-only-page-creation per ADR-0004)
- [pillar-5/crisis-escalation.md](../pillar-5-ai-systems/crisis-escalation.md) (the slice `/admin/crisis-events` surfaces)
- [pillar-0/rule-registry.md](../pillar-0-governance/rule-registry.md) (the data `/admin/policies` visualizes)
