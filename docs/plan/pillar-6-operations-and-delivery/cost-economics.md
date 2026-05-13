---
id: csps.pillar-6.cost-economics
name: cost-economics
description: Per-tenant cost attribution + tier thresholds + partition pruning + free-vs-paid economics. Stub at extended-S003. Listed in pillar-6 README "future leaves" section. Full spec post-v1 once tenant scale generates real cost data; pre-v1 we lock the dimensions but not the thresholds.
version: 0.1
owner: group:finky
lifecycle: experimental
lifecycle_state: pending-protocol
next_review_at: 2026-12-01
tags:
  - domain:ops
  - type:reference
  - audience:developer
  - audience:admin
  - maturity:draft
crosscutting:
  - cost
  - reliability
  - observability
diataxis_type: explanation
links:
  - { rel: parent, href: ./README.md }
  - { rel: build-order, href: ./build-order.md }
  - { rel: dashboards, href: ./dashboards.md }
  - { rel: stripe-clerk, href: ../pillar-3-platform-services/stripe-clerk-wiring.md }
created-new-because: |
  Listed in pillar-6 README future-leaves but not created in S003 §3.3 batch. Stubbed in
  extended-S003 per "nothing stands alone" cardinal directive. Distinct from
  stripe-clerk-wiring.md (the entitlements layer) and dashboards.md (the cost-attribution
  surface) — this leaf is the ECONOMIC MODEL.
domain_path: platform
core_spine: OPER
schema_anchor: pillar_0_governance_leaves
---

# Cost Economics (stub)

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## Status

⚠️ **STUB.** Full specification deferred until tenant scale generates real cost data (frontier F4 in [open-frontiers.md](./open-frontiers.md)). Pre-v1: we lock the dimensions; we don't lock the thresholds.

## Cost dimensions (locked early)

- **Compute** — Vercel function invocations + Cloudflare Worker CPU-ms + Supabase compute time
- **Storage** — per-tenant Postgres rows × tier-multiplier + R2 / KV stores
- **LLM tokens** — per-tenant Anthropic / OpenAI usage (Mastra dispatch attribution)
- **Audit row count** — per-tenant audit.events generation rate + retention partition cost
- **Network egress** — per-tenant outbound traffic
- **Skill invocations** — per-skill execution count (sandbox CPU-ms tracked separately)

## Tier-threshold model (placeholder; post-v1 calibration)

Per [stripe-clerk-wiring.md](../pillar-3-platform-services/stripe-clerk-wiring.md) tier vocabulary (free / pro / business / enterprise):

| Tier | Compute budget | Storage budget | LLM tokens / month | Action on threshold |
|---|---|---|---|---|
| free | $X | $X | $X | Soft-cap; tier-upgrade prompt |
| pro | $X | $X | $X | Soft-cap; metered overage |
| business | $X | $X | $X | Metered overage |
| enterprise | custom | custom | custom | Per-contract |

(All `$X` placeholders calibrated post-v1 from real cohort data.)

## Discovery triggers (when this stub graduates)

- ≥10 paying tenants OR ≥1000 free-tier active users (frontier F4)
- First tenant approaching free-tier cost threshold without upgrading (calibration data point)
- First "free-tier user generating Pro-tier load" alert fires (`audit-runner#cost-drift`)

## Interim posture

- Pre-v1: per-tenant cost attribution measured but NOT enforced (data collection only)
- v1 launch: free tier soft-caps with tier-upgrade prompts; no hard limits
- Post-v1 calibration: convert soft-caps to thresholds with explicit ADR

## Anti-patterns (locked early)

1. Per-tier feature flags WITHOUT cost-attribution — refused (`tier-feature-key-reconcile` audit catches)
2. Audit retention without per-tier pruning — refused (`audit-retention-pruning` audit catches; free 30d / paid 365d / enterprise 7y default)
3. Free-tier hard-caps before calibration data exists — refused (causes user churn before economic model proven)
4. Cost attribution calculation in admin app code — refused; computed from `audit.events` + materialized facts views

## Sources

- v1.3 §19 (cost economics noted as post-v1)
- [pillar-3/stripe-clerk-wiring.md](../pillar-3-platform-services/stripe-clerk-wiring.md) — entitlements + reconciliation cron
- [pillar-6/dashboards.md](./dashboards.md) — `/admin/cost-attribution` surface
- [pillar-6/open-frontiers.md](./open-frontiers.md) — F4 multi-tenant cost-attribution accuracy frontier
