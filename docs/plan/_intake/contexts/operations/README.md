---
id: csps.intake.contexts.operations
name: external-input-context-operations
description: Pillar 6 (Operations & Delivery) intake fan-out destination. 5 leaf sub-folders planned. SLA tier P3 default for open-frontiers; P2 for build-order; P1 for graduation-pipeline.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:ops
  - type:reference
  - audience:developer
  - audience:admin
  - maturity:stable
diataxis_type: reference
links:
  - { rel: parent, href: ../README.md }
  - { rel: pillar, href: ../../pillar-6-operations-and-delivery/README.md }
---

# Context: Operations & Delivery (Pillar 6)

## Leaf sub-folders (lazy-created; leaves planned for S003 §3.5)

| Leaf | Maps to (planned) | Inheritable tags |
|---|---|---|
| `bootstrap-script/` | pillar-6/bootstrap-script.md (🟡 to migrate) | `domain:ops`, `audience:developer` |
| `build-order/` | pillar-6/build-order.md (🟡 to migrate) | `domain:planning`, `domain:ops`, `audience:developer` |
| `dashboards/` | pillar-6/dashboards.md (🟡 to migrate) | `domain:ops`, `crosscutting:observability`, `audience:admin` |
| `graduation-pipeline/` | pillar-6/graduation-pipeline.md (🟡 to migrate) | `domain:ops`, `audience:developer`, `audience:admin` |
| `open-frontiers/` | pillar-6/open-frontiers.md (🟡 to migrate) | `domain:planning`, `audience:developer` |

## Routing rules

12-week build order, graduation pipeline (CSPS app → standalone product extraction), bootstrap script, observability/dashboards, cost/tier economics, deployment, open frontiers (items under active negotiation, not yet locked).

## SLA tier

**P1 for graduation-pipeline content** (extraction-readiness is load-bearing).
**P2 for build-order, dashboards, bootstrap-script.**
**P3 for open-frontiers** (exploratory; longer fix windows acceptable).
