---
id: csps.pillar-3.stripe-clerk-wiring
name: stripe-clerk-wiring
description: Stripe Entitlements + Clerk Organizations wiring — webhook handlers, idempotency, reconciliation cron, hasFeature() server gate, Gate UI hint, two-layer entitlement (include/exclude lists). Locked: Stripe Entitlements as primary entitlement source (per ADR-0001) with cron as backstop. Customer-facing tier gates surface via UI hints not hard blocks. Multi-tenant via Clerk Organization → Stripe Customer mapping. Migrated from v1.3 §9 in S002 §3.4.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:billing
  - domain:auth
  - type:reference
  - audience:developer
  - maturity:stable
crosscutting:
  - reliability
  - security
  - cost
  - multi-tenant
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ../pillar-0-governance/reuse-first-principle.md }
  - { rel: registry, href: ../../../packages/principles/principles.yaml }
  - { rel: adr-stack, href: ../../adr/0001-pick-csps-stack.md }
  - { rel: adr-tiers, href: ../../adr/0003-locked-tier-vocabulary.md }
domain_path: platform
core_spine: ARCH
schema_anchor: pillar_0_governance_leaves
scope_level: S1
---

# Stripe + Clerk Wiring

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The complete entitlement + auth wiring for CSPS — how Clerk Organizations map to Stripe Customers, how Stripe Entitlements drive feature gates, how reconciliation handles drift, how the `hasFeature()` server gate enforces tier-based access, how UI surfaces tier limits without hard blocks where appropriate.

## Why this exists

A multi-tenant SaaS foundry needs entitlement = identity × tier × feature. Without explicit Stripe + Clerk wiring, every app reinvents tier checks. The CSP carry-forward (EXT-20260502-001-A — pricing infrastructure lesson) reinforces: cron-as-primary fails; Stripe Entitlements as primary + cron as backstop is the right pattern.

## The data flow

```
Clerk Organization (tenant)
        │
        ▼ (1:1 mapping at creation)
Stripe Customer
        │
        ▼ (1:N — customer has subscriptions)
Stripe Subscription
        │
        ▼ (declares Stripe Product)
Stripe Product → Stripe Features (entitlements)
        │
        ▼ (server-side cache; refreshed via webhooks + cron)
public.tenant_entitlement (Postgres mirror)
        │
        ▼ (queried by every gate)
hasFeature(tenant_id, feature_key) → boolean
```

## Tier vocabulary (locked per ADR-0003)

`free` (rank 0) → `pro` (rank 10) → `business` (rank 20) → `enterprise` (rank 30). Numeric ranks allow future intermediate tiers without breaking comparisons.

## The 4 wiring components

### 1. Webhook handler (`apps/api/stripe-webhooks/route.ts`)

Receives Stripe events:
- `customer.subscription.created` / `updated` / `deleted` → updates `tenant_entitlement` rows
- `entitlements.active_entitlement_summary.updated` → primary signal for feature changes
- `invoice.paid` → cleared-balance signal; activates entitlements
- `invoice.payment_failed` → grace-period signal; flags for downgrade in N days

**Idempotency:** every event has `stripe_event_id`; the handler stores `processed_stripe_events` rows; replay-safe.

**Signature verification:** Stripe-Signature header validated against `STRIPE_WEBHOOK_SECRET`; reject otherwise.

### 2. Reconciliation cron (nightly)

Pulls `entitlements.active_entitlement_summary` for every Customer; diffs against `tenant_entitlement`; writes corrections + fires alerts on drift.

**Why backstop, not primary:** webhooks can be lost (network / Stripe outage / our outage). The cron catches drift; primary signal stays webhook-driven.

**Output to audit:** `tier-feature-key-reconcile` audit (per `audit-runner.md` Cost category) verifies bidirectional Stripe ↔ feature_keys consistency. Mismatches over 5min flag.

### 3. `hasFeature(user, feature_key)` server gate

`libs/billing/has-feature.ts`:

```typescript
export async function hasFeature(
  user: AuthenticatedUser,
  feature_key: string
): Promise<boolean> {
  const tenant = await getTenant(user.organization_id);
  const entitlements = await loadEntitlementsForTenant(tenant.id); // cached; invalidated on webhook
  return entitlements.includes(feature_key);
}
```

**Two-layer entitlement model:**
- **Include list** — features explicitly granted by Stripe Product (default deny otherwise)
- **Exclude list** — features explicitly denied (overrides include; useful for security incidents / abuse mitigation)

The exclude list is the escape hatch for "this customer was granted a feature but is abusing it". Stored in `public.tenant_feature_exclusion` with reason + audit log.

### 4. Gate UI hints (customer-facing)

UI components from `customer-kit.md` use:
```tsx
<FeatureGate feature="advanced-analytics" fallback={<UpgradeHint />}>
  <AdvancedAnalyticsDashboard />
</FeatureGate>
```

`<UpgradeHint />` shows "This requires Pro tier" with link to upgrade flow — NOT hard block. The user sees what they're missing; conversion path explicit.

For some features (security-critical, billing-sensitive), hard block is correct — `<FeatureGate strictBlock>` variant exists.

## Edge cases

### Subscription mid-period upgrade

User upgrades from Pro → Business mid-period. Stripe pro-rates; new entitlements apply immediately via webhook. No grace period; the upgrade is paid for.

### Subscription mid-period downgrade

User downgrades from Business → Pro mid-period. Stripe schedules the change for end-of-period (typical Stripe behavior). Until end-of-period, Business entitlements remain active.

### Failed payment grace period

Stripe sends `invoice.payment_failed`. CSPS marks tenant `payment_grace`; entitlements stay active for 7 days; UI shows banner. After 7 days: downgrade to free tier. After 30 days: optional account hold.

### Free tier with no Stripe Customer

New users start at free tier WITHOUT a Stripe Customer record (no card-on-file required). Stripe Customer + Subscription created on first paid upgrade.

### Multi-tenant: one user, multiple orgs

User belongs to multiple Clerk Organizations. Each Organization has its OWN Stripe Customer + Subscription + entitlements. `hasFeature()` is scoped to the active organization.

## Foundation slice — `tenant_entitlement`

Lives in `libs/policies/slices/public/tenant-entitlement.zmodel` (created with this leaf).

Key fields:
- `tenant_id` — FK to Clerk Organization
- `feature_key` — closed enum from glossary (auto-generated from Stripe Features list)
- `granted_at` / `revoked_at` — append-only audit
- `source` — webhook | cron-reconcile | manual-override
- `stripe_event_id` — for idempotency

RLS: tenant can only read its own entitlements; staff can read all.

## Anti-patterns

1. **Hard-coded tier checks** in app code (`if (user.tier === "pro")`) — bypasses Stripe; drifts on tier-rename. Replaced by `hasFeature(user, key)`.
2. **Synchronous Stripe API calls** on every request — adds latency + cost. Cached entitlements + webhook invalidation.
3. **Database-only entitlements** without Stripe sync — re-creates the CSP v0.7 problem (drift between local table and Stripe). Stripe is source-of-truth.
4. **Hard-block UI for non-payment-sensitive features** — kills conversion. UpgradeHint pattern for most; strictBlock only where needed.
5. **Deleting `processed_stripe_events` rows** to "save space" — breaks idempotency. Never delete.

## CSP v0.7 lesson absorbed

Per EXT-20260502-001-A: CSP used cron-as-primary; drift between Stripe metadata and internal entitlement table happened weekly; ~3 days/month of customer-support tickets. CSPS reverses: webhooks as primary, cron as backstop. Lesson engraved into ADR-0001 (stack pick) + this leaf.

## Enforcement

- `principles.yaml#P-ARCH-018` (schema-per-app — entitlement table in `public`)
- `audit-runner.md#tier-feature-key-reconcile` (Cost category, nightly)
- `audit-runner.md#cost-drift` (weekly)
- ESLint rule `no-hardcoded-tier-check` (planned week 4)
- `validate-skill-capabilities.mjs` checks feature_keys reference closed glossary

## Sources

- [Stripe Entitlements docs](https://docs.stripe.com/billing/entitlements)
- [Clerk Organizations](https://clerk.com/docs/organizations/overview)
- [pillar-1/tech-stack.md](../pillar-1-architecture-and-stack/tech-stack.md)
- [adr/0001-pick-csps-stack.md](../../adr/0001-pick-csps-stack.md)
- [adr/0003-locked-tier-vocabulary.md](../../adr/0003-locked-tier-vocabulary.md)
- CSP v0.7 retro (treasure #3 EXT-20260502-001-A) — pricing infrastructure lesson
