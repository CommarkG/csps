---
id: csps.intake.contexts.platform-services
name: external-input-context-platform-services
description: Pillar 3 (Platform Services) intake fan-out destination. 5 leaf sub-folders planned (leaves themselves not yet migrated; folders lazy-created when content lands). SLA tier P2 default.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:shared
  - type:reference
  - audience:developer
  - maturity:stable
diataxis_type: reference
links:
  - { rel: parent, href: ../README.md }
  - { rel: pillar, href: ../../pillar-3-platform-services/README.md }
domain_path: platform
---

# Context: Platform Services (Pillar 3)

## Leaf sub-folders (lazy-created on first use; leaves planned for S003 §3.4 migration)

| Leaf | Maps to (planned) | Inheritable tags |
|---|---|---|
| `catalog-bundle-system/` | pillar-3/catalog-bundle-system.md (🟡 to migrate) | `domain:architecture`, `crosscutting:ai-native`, `audience:developer`, `audience:ai-agent` |
| `customer-kit/` | pillar-3/customer-kit.md (🟡 to migrate) | `domain:ui`, `audience:developer`, `audience:end-user` |
| `sandboxed-skill-governance/` | pillar-3/sandboxed-skill-governance.md (🟡 to migrate) | `domain:ai`, `crosscutting:security`, `audience:developer`, `audience:admin` |
| `stripe-clerk-wiring/` | pillar-3/stripe-clerk-wiring.md (🟡 to migrate) | `domain:billing`, `domain:auth`, `audience:developer` |
| `template-governance/` | pillar-3/template-governance.md (🟡 to migrate) | `domain:ui`, `audience:developer`, `audience:ai-agent` |

## Routing rules

Stripe Entitlements + reconciliation cron + feature gates, Clerk Organizations + RBAC, page templates (the 22-template catalog), customer-kit primitives (`<EntityList>`, `<EntityDetail>`, `<EntityForm>`, `<EntityPicker>`), the catalog + bundle system, sandboxed skill governance (Quarantine / Vendored / Platform-owned), Cloudflare Workers bindings.

## SLA tier

**P2 default**. Sandboxed-skill-governance content is P1 (security implications).
