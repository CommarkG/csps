---
id: csps.integrations.monitoring.index
name: monitoring-module-index
description: Mini-tree intro for libs/integrations/monitoring/. Server-side monitoring using Sentry + PostHog.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: external_integrations
diataxis_type: reference
session: S033
impl_status: swift-implemented
mini_tree_root: true
sub_files:
  - ./sentry.ts
  - ./posthog.ts
links:
  - { rel: parent, href: ../index.ts }
tags:
  - domain:infra
  - type:reference
  - audience:ai-agent
  - maturity:stable
---

# Monitoring Module — libs/integrations/monitoring/

Server-side monitoring primitives. Graceful passthrough when env vars not set.

**For client-side:** install `@sentry/nextjs` and `posthog-js` in each app — server-side helpers only here.

| File | Purpose |
|---|---|
| [sentry.ts](./sentry.ts) | `captureException()` + `captureMessage()` |
| [posthog.ts](./posthog.ts) | `track()` + `identify()` + `groupIdentify()` |

**Env vars:**
- `SENTRY_DSN` — Sentry project DSN
- `POSTHOG_API_KEY` — PostHog project API key
- `POSTHOG_HOST` — PostHog host (default: https://app.posthog.com)

**Sentry setup per app:**
1. `pnpm add --filter [app] @sentry/nextjs`
2. Create `[app]/instrumentation.ts` calling `Sentry.init({ dsn: process.env.SENTRY_DSN })`
3. Add `SENTRY_DSN` to Vercel env vars
