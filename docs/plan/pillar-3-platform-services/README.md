---
id: csps.plan.pillar.platform-services
name: pillar-3-platform-services
description: Stripe + Clerk wiring, customer-kit primitives, page templates, template governance, catalog & bundle system, sandboxed skill governance. The "third-party + shared-service" layer.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:platform
  - type:doc
  - audience:developer
  - maturity:stable
crosscutting:
  - security
  - reliability
  - cost
  - observability
links:
  - { rel: parent, href: ../README.md }
  - { rel: principle, href: ../pillar-0-governance/reuse-first-principle.md }
---

# Pillar 3 — Platform Services

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this pillar covers

The third-party integrations and shared services every CSPS app uses: Stripe Entitlements + reconciliation cron, Clerk Organizations + projection, Cloudflare Workers (sandbox + bindings), the customer-kit atomic primitives, the 22-template page catalog, template governance (4-layer enforcement), the catalog & bundle system, sandboxed skill governance (Quarantine/Vendored/Platform-owned tiers).

This is the "shared infrastructure layer" — what every app inherits from the platform.

## Industry framework alignment

- **CNCF Platform Engineering capabilities** — Infrastructure / Identity / Security / Data services
- **AWS WAF "Operational Excellence"** for shared service patterns
- **Backstage "Software Catalog"** for the catalog + bundle pattern

## Why this pillar exists

Every CSPS app needs identity (Clerk), billing (Stripe), UI primitives (templates), governance (catalog), and AI extension (skill governance). If each app re-implemented these, drift would be guaranteed. This pillar centralizes them; apps inherit.

The skill governance subsystem in particular is load-bearing: Snyk's Feb 2026 ToxicSkills scan found 13.4% of community skills had critical issues. Without a sandboxed three-tier ingestion pipeline (Quarantine → Vendored → Platform-owned), importing community skills is reckless.

## Leaf documents in this pillar

| Document | Status | Source (v1.3) |
|---|---|---|
| [stripe-clerk-wiring.md](stripe-clerk-wiring.md) | 🟢 v1.0 | §9 (migrated S002 §3.4) |
| [customer-kit.md](customer-kit.md) | 🟢 v1.0 | §11 (migrated S002 §3.4) |
| [template-governance.md](template-governance.md) | 🟢 v1.0 | §11.5 (migrated S002 §3.4) |
| [catalog-bundle-system.md](catalog-bundle-system.md) | 🟢 v1.0 | §11.7 (migrated S002 §3.4) |
| [sandboxed-skill-governance.md](sandboxed-skill-governance.md) | 🟢 v1.0 | §11.8 (migrated S002 §3.4) |

## Cross-cutting concerns this pillar addresses

- **Security** — Stripe webhook signature verification; Clerk JWT validation; sandboxed-skill three-tier model with capability denial; OWASP Agentic Skills Top 10 alignment
- **Reliability** — Stripe reconciliation cron prevents drift; idempotency tables prevent duplicate processing
- **Cost** — tier-feature-key reconciliation prevents revenue leakage; per-tenant cost attribution
- **Observability** — every skill execution captured in audit; eval Worker runs are first-class artifacts

## Reuse-first reminder

This pillar is the highest-risk surface for the reuse-first principle. Before:
- Adding a new Stripe webhook handler — check `stripe-clerk-wiring.md`
- Adding a new page template — check the 22-template catalog
- Adding a new connector / MCP server — check existing connectors registry
- Adding a new skill — search the catalog AND the community skills marketplace

The skill ingestion contract (per [pillar 4 / skill-ingestion-contract.md](../pillar-4-developer-experience/skill-ingestion-contract.md)) is the structural enforcement of reuse-first applied to community content.
