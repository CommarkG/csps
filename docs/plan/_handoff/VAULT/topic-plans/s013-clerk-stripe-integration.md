---
id: csps.handoff.vault.topic-plan.s013-clerk-stripe-integration
name: s013-clerk-stripe-integration
description: Topic-plan for S013 — Clerk webhook integration and Stripe billing wiring. Service layer in libs/integrations/ maps Clerk org/user events to CSPS ZModel entities (User, Tenant, UserTenant) and creates Stripe customers on Tenant creation. Resolves L2 of foundation-slices topic-plan (Clerk + Stripe wiring layer).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: gradual-build-plan
template_status: stable
core_spine: ARCH
core_spines: [ARCH, GVRN]
schema_anchor: topic_plans
tags:
  - domain:architecture
  - type:how-to
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: how-to
session: S013
execution_mode: balanced
alignment_verified_session: S015
topic_id: s013-clerk-stripe-integration
priority_score: 90
priority_band: 1
depth_chosen: 3
depth_rationale: |
  Depth-3: service layer only — no novel architecture, well-established pattern
  (webhook handler + Stripe customer creation). L1 = TypeScript handlers.
  L2 = app-layer wiring (Next.js route + svix verification). L3 = production
  hardening (retry logic, idempotency keys, event dedup).
covered_paths: [libs/integrations/]
know_how_consulted: true
multi_session_arc: [S013]
links:
  - { rel: parent, href: ./README.md }
  - { rel: depends-on, href: ./foundation-slices.md }
  - { rel: implementation, href: ../../../../../libs/integrations/ }
---

# Topic-Plan — S013 Clerk + Stripe Integration (depth-3)


## §HARVEST — What this plan is designed to extract

```yaml
harvest_triggers:
  - on: phase_gate
    collect: [auth_wiring_patterns, billing_integration_patterns]
    destination: vault
  - on: plan_close
    collect: [integration_library_design_lessons, webhook_handler_reuse_pattern]
    destination:
      - extraction_note: docs/plan/_handoff/VAULT/session-S016-extraction.md
      - pattern_home: libs/integrations/

harvest_questions:
  - "Does the libs/integrations pattern allow all 30 apps to wire auth+billing without reimplementation?"
  - "Are there webhook patterns that should be generalized further?"
```

---

## §1 — Level 1: Service layer (COMPLETE — S013)

| Artifact | Status |
|---|---|
| `libs/integrations/clerk/types.ts` | DONE — Clerk webhook payload types |
| `libs/integrations/clerk/webhook-handler.ts` | DONE — handles user.created / org.created / membership.created |
| `libs/integrations/stripe/customer-service.ts` | DONE — createStripeCustomer + buildTenantBillingHook |

**L1 exit criteria:**
- [x] Service layer files authored in libs/integrations/
- [x] TypeScript interfaces defined (no external deps required at authoring stage)
- [x] pnpm verify exit_code 0

## §2 — Level 2: App-layer wiring (S013 → S014 boundary)

When a Next.js app exists in apps/:
- Create `apps/<app>/api/webhooks/clerk/route.ts` — POST handler with svix verification
- Install `@clerk/nextjs`, `svix`, `stripe` in the app package
- Wire `handleClerkWebhook(event, prisma, buildTenantBillingHook(stripe, prisma))`

## §3 — Level 3: Production hardening

- Idempotency: deduplicate webhook events (Clerk event ID stored in AuditEvent)
- Retry handling: svix webhook retry windows
- Monitoring: AuditEvent rows confirm every Clerk event processed
