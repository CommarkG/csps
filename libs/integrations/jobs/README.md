---
id: csps.integrations.jobs.index
name: jobs-module-index
description: Mini-tree intro for libs/integrations/jobs/. Platform background jobs using Inngest.
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
  - ./inngest.ts
  - ./index.ts
  - ./functions/send-welcome-email.ts
  - ./functions/check-trial-expiry.ts
  - ./functions/send-digest.ts
links:
  - { rel: parent, href: ../index.ts }
tags:
  - domain:infra
  - type:reference
  - audience:ai-agent
  - maturity:stable
---

# Jobs Module — libs/integrations/jobs/

Platform background jobs using Inngest. Mount `/api/inngest` in each app.

**Critical:** Scheduled jobs (cron) use raw `PrismaClient`, NOT `enhance()`.
There is no user auth context in scheduled jobs — manually filter by tenantId.

**Env vars:** `INNGEST_SIGNING_KEY` (production) + `INNGEST_EVENT_KEY` (optional)

| File | Purpose |
|---|---|
| [inngest.ts](./inngest.ts) | Shared Inngest client |
| [functions/send-welcome-email.ts](./functions/send-welcome-email.ts) | Triggered by `user/created` event |
| [functions/check-trial-expiry.ts](./functions/check-trial-expiry.ts) | Daily 9am — trial expiry reminders |
| [functions/send-digest.ts](./functions/send-digest.ts) | Monday 8am — weekly digest |
| [index.ts](./index.ts) | `allFunctions` array for route handler |
