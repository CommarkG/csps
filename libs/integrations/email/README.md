---
id: csps.integrations.email.index
name: email-module-index
description: Mini-tree intro for libs/integrations/email/. Platform email module using Resend. 5 transactional templates.
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
  - ./client.ts
  - ./templates/welcome.ts
  - ./templates/trial-expiry.ts
  - ./templates/invitation.ts
  - ./templates/upgrade.ts
  - ./templates/digest.ts
links:
  - { rel: parent, href: ../index.ts }
tags:
  - domain:infra
  - type:reference
  - audience:ai-agent
  - maturity:stable
---

# Email Module — libs/integrations/email/

Platform email primitives using Resend. Graceful passthrough when `RESEND_API_KEY` not set.

**Env vars:** `RESEND_API_KEY` (required) + `RESEND_FROM_EMAIL` (default: noreply@csps.app)

| File | Purpose |
|---|---|
| [client.ts](./client.ts) | `sendEmail()` — Resend client with graceful passthrough |
| [templates/welcome.ts](./templates/welcome.ts) | New user onboarding |
| [templates/trial-expiry.ts](./templates/trial-expiry.ts) | Trial ending reminder |
| [templates/invitation.ts](./templates/invitation.ts) | Team member invite |
| [templates/upgrade.ts](./templates/upgrade.ts) | Plan upgrade confirmation |
| [templates/digest.ts](./templates/digest.ts) | Weekly activity summary |

**Future:** react-email for richer templates (deferred — plain HTML works for MVP).
