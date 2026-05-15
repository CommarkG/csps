---
id: csps.handoff.s032-to-s033
name: HANDOFF-S032-to-S033
description: S032 → S033. Security Phase 1 complete. S033 = email module (Resend) + db:push for new models.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S032
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

# HANDOFF — S032 → S033

**S032 CLOSED** | 2026-05-15

---

## Zone A — Platform State at S032 Close

- **Validators:** 113 (exit_code: 0, 0 blocking except security-headers for non-template apps)
- **Security module:** libs/integrations/security/ — 6 files live
- **Schema:** 12 models, viewer role, Tenant.plan/features/limits, Notification, WebhookEndpoint
- **Moat elements:** 25 (M-24: security module, M-25: schema-first isolation)
- **L2_DOMAIN_SECURITY.md:** created in .claude/core-spines/

### Deferred from S032
- `db:push` for Notification + WebhookEndpoint + schema fields → run from Codespaces
- Rate limiting: Upstash Redis env vars not set yet (Governor action required)
- scope-level backfill: 206 files missing scope_level (advisory, Phase 2 S033+)
- naming backfill: R1/R3 violations still in naming-exempt.yaml (E5 only cleared R5)

---

## Zone B — S033 Mandate

### S033-A: Email module — Resend integration (SPI=0.3)
- Install `@react-email/components` + `resend` in libs/integrations
- Create `libs/integrations/email/`: templates.tsx + send.ts + types.ts
- Templates: welcome, password-reset, notification-digest, team-invite
- Wire to Resend API (RESEND_API_KEY env var)
- Add to apps/template

### S033-B: db:push for S032 models (Governor action — Codespaces)
- New models (Notification, WebhookEndpoint) need Supabase migration
- Fields (plan, features, limits, viewer) need migration
- Run from Codespaces with DIRECT_URL

### S033-C: Scope-level backfill (SPI=0.2)
- Build `tools/scripts/backfill-scope-level.mjs`
- Auto-classify 206 files by path heuristics
- Run + verify + commit

---

## Zone D — S033 First Action

1. `node tools/validators/validate-partial-processes.mjs` — baseline check
2. Governor action: Upstash Redis setup (5 min at upstash.com) for rate limiting
3. Codespaces: `prisma db push --schema=libs/policies/generated/schema.prisma`
4. Then S033-A: email module

---

*S032 CLOSED | Security Phase 1 constitutional | 113 validators | App #3 domain decision still pending*
