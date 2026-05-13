---
id: csps.external-integrations.hub
name: External-Integrations-Hub
description: >
  SSoT for all external service integrations. Mechanically enforced:
  AI must read the relevant service file BEFORE building any integration,
  automation, or configuration touching that service.
  scope_level: S1 (platform-wide)
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: external_integrations
diataxis_type: reference
session: S028
tags:
  - domain:infra
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
---

# External Integrations Hub

> **MANDATORY GATE**: Before building, configuring, or debugging any external
> service listed below, the AI MUST read the corresponding service file.
> Enforced by `pre-tool-use-external-integration-gate.sh`.

## Services

| Service | File | Last Updated | Content Hash |
|---|---|---|---|
| Vercel | [vercel.md](./vercel.md) | 2026-05-13 | see file |
| Supabase | [supabase.md](./supabase.md) | 2026-05-13 | see file |
| Clerk | [clerk.md](./clerk.md) | 2026-05-13 | see file |
| Stripe | [stripe.md](./stripe.md) | placeholder | — |
| ZenStack | [zenstack.md](./zenstack.md) | 2026-05-13 | see file |

## Enforcement Protocol

1. **Pre-task gate**: Hook fires on any Write/Edit/Bash touching integration paths
2. **Content hash check**: Compare stored hash vs. service file — skip re-read if unchanged
3. **Mandatory read**: If hash changed or first encounter → read full file before proceeding
4. **Post-session update**: After any integration work, update the service file with new findings

## Trigger Patterns (hook watches for these)

```
vercel.json | .vercelignore | vercel/* → read vercel.md
supabase/* | DATABASE_URL | DIRECT_URL → read supabase.md
clerk* | CLERK_* | webhook/clerk → read clerk.md
stripe* | STRIPE_* → read stripe.md
schema.zmodel | zenstack | enhance → read zenstack.md
```

## Update Cadence

- **Before** any integration work: read + check hash
- **After** any new finding: update service file + recalculate hash
- **Weekly**: check if external service published changelog (tracked in service file)
