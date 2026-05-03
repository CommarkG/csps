---
id: csps.intake.contexts.data-schema
name: external-input-context-data-schema
description: Pillar 2 (Data & Schema) intake fan-out destination. 4 leaf sub-folders. SLA tier P1 default (data layer changes are high-impact).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:data
  - type:reference
  - audience:developer
  - maturity:stable
diataxis_type: reference
links:
  - { rel: parent, href: ../README.md }
  - { rel: pillar, href: ../../pillar-2-data-and-schema/README.md }
---

# Context: Data & Schema (Pillar 2)

## Leaf sub-folders (lazy-created on first use)

| Leaf | Maps to | Inheritable tags |
|---|---|---|
| `app-schema-contract/` | [pillar-2/app-schema-contract.md](../../pillar-2-data-and-schema/app-schema-contract.md) | `domain:data`, `crosscutting:multi-tenant`, `audience:developer` |
| `audit-triggers/` | [pillar-2/audit-triggers.md](../../pillar-2-data-and-schema/audit-triggers.md) | `domain:data`, `domain:audit`, `audience:developer`, `audience:admin` |
| `foundation-zmodel/` | [pillar-2/foundation-zmodel.md](../../pillar-2-data-and-schema/foundation-zmodel.md) | `domain:data`, `audience:developer` |
| `starter-slices/` | [pillar-2/starter-slices.md](../../pillar-2-data-and-schema/starter-slices.md) | `domain:data`, `domain:persona`, `domain:audit`, `audience:developer` |

## Routing rules

ZModel patterns, schema-per-app + RLS + multi-tenant isolation, Postgres triggers as audit primitive, the foundation slice catalog (User, Tenant, AuditCheck, AuditRun, Persona, LearningLoopItem, ExternalInput, etc.), partitioning + retention, migration safety patterns.

## SLA tier

**P1 default** (4h triage SLA, 30d fix). Data-layer changes carry compliance + security implications; tighter SLA than non-data pillars.
