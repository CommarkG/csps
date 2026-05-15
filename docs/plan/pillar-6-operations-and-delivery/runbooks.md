---
id: csps.pillar-6.runbooks
name: runbooks
description: Incident-response runbooks + common operational tasks. Stub at extended-S003. Listed in pillar-6 README "future leaves" section. Full per-runbook authored post-v1 as real incidents surface (each incident produces a runbook per Google SRE practice). Pre-v1 we lock the runbook template + the index of expected runbooks.
version: 0.1
owner: group:finky
lifecycle: experimental
lifecycle_state: pending-protocol
next_review_at: 2026-12-01
tags:
  - domain:ops
  - type:how-to
  - audience:developer
  - audience:admin
  - maturity:draft
crosscutting:
  - reliability
  - observability
diataxis_type: how-to
links:
  - { rel: parent, href: ./README.md }
  - { rel: build-order, href: ./build-order.md }
  - { rel: dashboards, href: ./dashboards.md }
  - { rel: crisis, href: ../pillar-5-ai-systems/crisis-escalation.md }
created-new-because: |
  Listed in pillar-6 README future-leaves. Stubbed in extended-S003 per "nothing stands alone"
  cardinal directive. Distinct from crisis-escalation.md (the slice) and dashboards.md (the
  surface) — this leaf is the OPERATIONAL RESPONSE PLAYBOOK.
domain_path: platform
core_spine: OPER
schema_anchor: pillar_0_governance_leaves
scope_level: S1
---

# Runbooks (stub)

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## Status

⚠️ **STUB.** Per-runbook content authored post-v1 as real incidents surface (Google SRE practice: every incident produces a runbook). Pre-v1 we lock the template + index.

## Runbook template (every runbook follows this shape)

```markdown
# Runbook: <Title>

**Owner:** <staff handle>
**Severity:** P0 / P1 / P2 / P3
**SLA to acknowledge:** <minutes>
**SLA to resolve:** <hours>

## When this fires
<observable signal — alert / dashboard fact / user report — that says "run this runbook">

## Diagnostic steps
1. <step + expected output>
2. ...

## Mitigations (in order of preference)
1. <action + expected effect>
2. ...

## Rollback plan
<if mitigation makes things worse>

## Post-incident
- File ADR if root cause is structural (per [adr-process.md](../pillar-0-governance/adr-process.md))
- Add new runbook entry if novel pattern (per Learning Loop K=2 → ADR rule)
- Update this index
```

## Expected runbook index (pre-v1 placeholders; authored as incidents occur)

| Runbook | Trigger | Severity | Owner |
|---|---|---|---|
| `crisis-event-queue-stalled` | `/admin/crisis-events` queue depth >10 OR oldest >30min | P0 | crisis-review staff |
| `audit-log-gap` | `audit-log-integrity` audit fires (>5min gap per tenant) | P0 | platform staff |
| `rls-coverage-violation` | `rls-coverage` audit fires (any tenant table missing RLS) | P0 | platform staff |
| `stripe-reconciliation-failure` | `tier-feature-key-reconcile` fails | P1 | billing staff |
| `persona-drift-spike` | `persona-drift-detection` fires beyond threshold | P1 | AI staff |
| `dashboard-down` | `health-endpoints` fires for /admin | P1 | platform staff |
| `bootstrap-script-failure` | bootstrap.ps1 fails on graduate-mode | P2 | platform staff |
| `graduation-extraction-stuck` | graduation-pipeline Day 2 customer migration fails | P2 | platform staff |

## Discovery triggers (when stubs graduate to full runbooks)

- First incident matching a stub triggers full authoring (within 7 days post-incident per Google SRE)
- Pattern of similar incidents across 2+ tenants → consolidate into one runbook + file ADR

## Interim posture

- Pre-v1: only template + index above
- v1 launch: top-3 P0 runbooks fully authored (crisis-event + audit-log + RLS)
- Post-v1: per-incident authoring on rolling basis

## Anti-patterns (locked early)

1. Runbook without a measurable trigger — refused (every runbook says "when this fires")
2. Diagnostic steps without expected outputs — refused (otherwise responder can't tell pass/fail)
3. Mitigation without rollback plan — refused (mitigation that worsens the incident with no rollback = catastrophic)
4. Runbook without owner — refused (handoff impossible)

## Sources

- Google SRE Workbook (incident response chapter)
- v1.3 §19 (runbooks noted as post-v1)
- [pillar-6/dashboards.md](./dashboards.md) — the alert surfaces these runbooks respond to
- [pillar-5/crisis-escalation.md](../pillar-5-ai-systems/crisis-escalation.md) — the highest-severity runbook target
