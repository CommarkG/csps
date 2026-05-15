---
id: csps.handoff.s033-to-s034
name: HANDOFF-S033-to-S034
description: S033 → S034. Email+Jobs+Monitoring live. S034 = scope backfill + App #3 domain decision.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S033
impl_status: swift-implemented
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: parent, href: ../README.md }
scope_level: S1
---

# HANDOFF — S033 → S034

**S033 CLOSED** | 2026-05-15

---

## Zone A — Platform State at S033 Close

- **Validators:** 113 (exit_code: 0)
- **Platform integration layer complete:**
  - `libs/integrations/email/` — Resend + 5 templates
  - `libs/integrations/jobs/` — Inngest + 3 functions
  - `libs/integrations/monitoring/` — Sentry + PostHog
  - `libs/integrations/security/` — 6 security primitives (S032)
- **Schema:** 12 models + viewer role + Notification + WebhookEndpoint (db:push deferred)
- **Moat elements:** 25

### Governor actions required before App #3 deploy
1. Resend account → RESEND_API_KEY in Vercel
2. Inngest account → INNGEST_SIGNING_KEY in Vercel
3. Sentry project → SENTRY_DSN in Vercel
4. PostHog project → POSTHOG_API_KEY in Vercel
5. Upstash Redis → UPSTASH_REDIS_REST_URL + TOKEN in Vercel
6. Codespaces db:push → push S032 schema changes to Supabase

---

## Zone B — S034 Mandate

### S034-A: Scope backfill script (SPI=0.2)
Build `tools/scripts/backfill-scope-level.mjs` — auto-classify 206 governed files by path heuristics, add `scope_level: S[0-5]` to frontmatter. Closes the ADR-0027 Phase 2 gate.

### S034-B: App #3 domain decision (Governor)
Platform is ready. Governor selects domain. `pnpm create:app [name]` scaffolds immediately.
Consider: the Governor's UX/UI template brief (in VAULT as `governor-brief-app3-ux-templates.md`) describes onboarding archetypes, sandbox trial mode, and OUTPUTS list — these are libs/ investments before App #3 starts.

### S034-C: App #3 Gate 4
Deploy App #3 to Vercel following `docs/plan/pillar-0-governance/external-integrations/vercel.md` checklist.

---

## Zone D — S034 First Action

1. `node tools/validators/validate-partial-processes.mjs` — confirm baseline
2. Governor: select App #3 domain
3. Build scope backfill script (unblocked — no Governor input needed)

---

*S033 CLOSED | Email + Jobs + Monitoring live | App #3 domain = Governor decision*
