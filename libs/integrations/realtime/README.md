---
id: csps.integrations.realtime.index
name: realtime-module-index
description: Mini-tree intro for libs/integrations/realtime/. Polling-based SSE using Upstash Redis lists.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: external_integrations
diataxis_type: reference
session: S035
impl_status: swift-implemented
scope_level: S1
mini_tree_root: true
sub_files:
  - ./types.ts
  - ./publisher.ts
links:
  - { rel: parent, href: ../index.ts }
tags:
  - domain:infra
  - type:reference
  - audience:ai-agent
  - maturity:stable
---

# Realtime Module — libs/integrations/realtime/

Polling-based Server-Sent Events using Upstash Redis lists. Vercel serverless compatible.

**Pattern:** `rpush` to publish → SSE route polls with `lrange` + `lrem` every 3s

| File | Purpose |
|---|---|
| [types.ts](./types.ts) | `NotificationEvent` type |
| [publisher.ts](./publisher.ts) | `publishNotification(event)` → Redis rpush |

**Env vars:** `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`

**SSE route:** `/api/events` in each app polls the user's queue and streams events.
