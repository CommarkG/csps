---
id: csps.governance.external-integrations.index
name: external-integrations-index
description: Mini-tree intro for external-integrations/ directory. Mandatory read gate before any external service work.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: external_integrations
diataxis_type: reference
session: S032
mini_tree_root: true
sub_files:
  - ./HUB.md
  - ./vercel.md
  - ./supabase.md
  - ./clerk.md
  - ./zenstack.md
impl_status: swift-implemented
tags:
  - domain:infra
  - type:reference
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: hub, href: ./HUB.md }
scope_level: S1
---

# External Integrations — Index

Mandatory read gate: AI must read the relevant service file BEFORE touching any external integration.

| Service | File | Last verified | Rules |
|---|---|---|---|
| Vercel | [vercel.md](./vercel.md) | 2026-05-13 | 10 |
| Supabase | [supabase.md](./supabase.md) | 2026-05-13 | 8 |
| Clerk | [clerk.md](./clerk.md) | 2026-05-13 | 8 |
| ZenStack | [zenstack.md](./zenstack.md) | 2026-05-13 | 7 |

See `sub_files:` in frontmatter. Hub protocol: [HUB.md](./HUB.md)
