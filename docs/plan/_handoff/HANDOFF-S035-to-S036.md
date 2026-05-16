---
id: csps.handoff.s035-to-s036
name: HANDOFF-S035-to-S036
description: S035 → S036. Full async infra complete. S036 = App #3 domain topic-plan + Builder Context Pack.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S035
impl_status: swift-implemented
scope_level: S1
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: parent, href: ../README.md }
---

# HANDOFF — S035 → S036

**S035 CLOSED** | 2026-05-16

---

## Zone A — Platform State at S035 Close

- **Validators:** 113 (exit_code: 0)
- **Platform integration layer complete:**
  - `libs/integrations/auth/` — isSessionReady()
  - `libs/integrations/security/` — headers, validation, audit, guards, rate-limit, resilience
  - `libs/integrations/email/` — Resend + 5 templates
  - `libs/integrations/jobs/` — Inngest + 4 functions (welcome/expiry/digest/webhook)
  - `libs/integrations/monitoring/` — Sentry + PostHog
  - `libs/integrations/storage/` — Cloudflare R2
  - `libs/integrations/realtime/` — polling SSE via Upstash Redis
  - `libs/components/` — 5 UI shells (DashboardShell/SettingsLayout/FeatureGateOverlay/OnboardingWizard/DataTable)

### Governor actions still pending before App #3 deploy
1. Resend, Inngest, Sentry, PostHog accounts → API keys in Vercel
2. Upstash Redis → UPSTASH_REDIS_REST_URL + TOKEN in Vercel
3. Cloudflare R2 → account + bucket + API keys in Vercel
4. **Codespaces db:push** → push S032 schema changes (Notification, WebhookEndpoint, viewer, plan/features/limits)

---

## Zone B — S036 Mandate

### S036-A: App #3 Domain Intent Crystallization (P-META-022 gate)
Governor states: What problem does App #3 solve? Who is the user? What's the core action?
OPUS-2 produces PE-scored topic-plan with: domain model, schema additions, API routes, UI shells.

### S036-B: Builder Context Pack (from Opus Turn 52)
A portable "platform context" document that any developer can read to understand the CSPS platform in 15 minutes. Enables external collaboration without tribal knowledge.

### S036-C: Sandbox environment (from Governor brief)
`apps/sandbox/` — trial mode app with synthetic data, no real credentials, Governor-ratified before external users touch production.

---

## Zone D — S036 First Action

1. `node tools/validators/validate-partial-processes.mjs` — baseline
2. Governor crystallizes App #3 domain → one sentence: "App #3 helps [user] [do X] so they can [achieve Y]"
3. OPUS-2 produces topic-plan

---

*S035 CLOSED | Full async infra layer done | App #3 = Governor decision → S036*
