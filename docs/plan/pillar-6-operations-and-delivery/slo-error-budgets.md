---
id: csps.pillar-6.slo-error-budgets
name: slo-error-budgets
description: SLO definitions + error budgets per app. Stub at extended-S003. Listed in pillar-6 README "future leaves" — explicitly post-v1 per pillar-6 README ("once first apps ship to paying customers"). Pre-v1 we lock the SLO template + budget-policy framework; per-app SLOs authored when paying customers exist.
version: 0.1
owner: group:finky
lifecycle: experimental
lifecycle_state: pending-protocol
next_review_at: 2026-12-01
tags:
  - domain:ops
  - type:reference
  - audience:developer
  - audience:admin
  - maturity:draft
crosscutting:
  - reliability
  - observability
diataxis_type: explanation
links:
  - { rel: parent, href: ./README.md }
  - { rel: build-order, href: ./build-order.md }
  - { rel: observability, href: ./observability.md }
  - { rel: runbooks, href: ./runbooks.md }
  - { rel: dashboards, href: ./dashboards.md }
created-new-because: |
  Listed in pillar-6 README future-leaves. Stubbed in extended-S003 per "nothing stands alone"
  cardinal directive. Distinct from observability.md (the measurement layer) and runbooks.md
  (the response playbooks) — this leaf is the EXPECTATION CONTRACT with users.
domain_path: platform
core_spine: OPER
schema_anchor: pillar_0_governance_leaves
scope_level: S1
---

# SLOs + Error Budgets (stub)

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## Status

⚠️ **STUB.** Per-app SLOs authored post-v1 once paying customers exist + traffic-baseline data available. Pre-v1 we lock the framework only.

## SLO template (every app SLO follows this shape)

```yaml
slo:
  app: <slug>
  name: <SLO name — e.g., chat-availability>
  sli:                                # service-level indicator (the measurement)
    type: availability | latency | quality | freshness
    measurement: <how computed from observability>
  target: 99.9%                       # the SLO target
  window: rolling-30d                 # measurement window
  error_budget:                       # 100% - target
    minutes_per_window: 43.2          # for 99.9% / 30d → 43.2 min/month
    consumed_alert_at: 50%            # alert when 50% consumed
    consumed_freeze_at: 100%          # feature freeze at 100% consumed
  owner: <staff handle>
```

## Default SLO menu (per app at v1)

| SLI | Measurement | Default target | Why this number |
|---|---|---|---|
| Availability | `/api/health` returns 200 within timeout | 99.9% | 4 nines is enterprise-only; 3 nines is industry-default-for-SaaS |
| Latency (p95) | API request p95 latency | 500ms | Below 500ms = "feels instant" per UX research |
| Latency (p99) | API request p99 latency | 2000ms | Catches the slow-tail without over-engineering |
| Crisis-event queue depth | `/admin/crisis-events` queue length | <10 | Above 10 = staff overwhelmed; load-bearing for v1 |
| Persona drift | drift score per PUBLISHED persona | <threshold (TBD) | Frontier F1; calibrated post-v1 |
| Audit log gap | per-tenant max gap in `audit.events` | <5min | Below 5min = no detectable dropped writes |

(Default targets are starting-point; per-app SLOs override based on customer contract.)

## Error-budget policy framework

```
At 0-50% budget consumed:  Normal velocity. Ship features.
At 50-90% consumed:        Slow shipping. Prioritize reliability work.
At 90-100% consumed:       Feature freeze. Only reliability work + critical bugfixes.
At 100% consumed:          Hard freeze. Senior staff approves any non-reliability change.
```

Per Google SRE: error budgets are the **negotiation currency** between feature velocity and reliability.

## Discovery triggers (when this stub graduates)

- First paying-customer SLA negotiation → drives concrete SLO targets
- First production outage → exposes which SLOs were missing
- First app's traffic-baseline available → calibrates default targets per cohort

## Interim posture

- Pre-v1: SLOs measured (per observability.md instrumentation) but NOT enforced
- v1 launch: top-3 SLOs (availability + crisis-queue-depth + audit-log-gap) enforced as soft targets
- Post-v1: per-customer SLA contracts override defaults; per-app SLOs authored

## Anti-patterns (locked early)

1. SLO without owner — refused (no escalation path)
2. SLO target without baseline data — refused (numbers picked from thin air destroy credibility)
3. Error budget consumed without action — refused (the policy IS the response; ignoring it is "SLO theater")
4. SLO measured but not visible on `/admin/dashboards` — refused (invisible measurement = no measurement)
5. Per-customer SLA contracted without matching SLO definition — refused (legal-vs-engineering mismatch)

## Sources

- [Google SRE Workbook](https://sre.google/workbook/) — SLO + error-budget chapters
- v1.3 §19 (SLOs noted as post-v1)
- [pillar-6/observability.md](./observability.md) — the measurement substrate SLOs read from
- [pillar-6/runbooks.md](./runbooks.md) — the response playbooks for SLO violations
- [pillar-6/dashboards.md](./dashboards.md) — the SLO visibility surface
