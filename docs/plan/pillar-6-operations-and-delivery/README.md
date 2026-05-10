---
id: csps.plan.pillar.operations-and-delivery
name: pillar-6-operations-and-delivery
description: Build order (12-week roadmap), graduation pipeline (apps spinning off as standalone), bootstrap script, dashboards, observability, cost/tier economics, open frontiers.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:ops
  - type:doc
  - audience:developer
  - audience:admin
  - maturity:stable
crosscutting:
  - reliability
  - cost
  - performance
  - observability
links:
  - { rel: parent, href: ../README.md }
  - { rel: principle, href: ../pillar-0-governance/reuse-first-principle.md }
domain_path: platform
---

# Pillar 6 — Operations & Delivery

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this pillar covers

The 12-week build order to v1 launch, the graduation pipeline (extracting apps as standalone products), the PowerShell bootstrap script (empty repo → running platform), admin dashboards, observability strategy, per-tenant cost economics, the open-frontiers tracker.

This is the **delivery layer** — how CSPS actually ships, runs, and evolves over time.

## Industry framework alignment

Combines three AWS Well-Architected pillars under a single topical pillar (avoids the WAF Sustainability/Cost overlap):

- **AWS WAF "Operational Excellence"** — runbooks, deployment, observability
- **AWS WAF "Reliability"** — SLOs, error budgets, partition strategy
- **AWS WAF "Cost Optimization"** — per-tenant cost attribution, tier thresholds, audit retention pruning
- **AWS WAF "Performance Efficiency"** — implicit; doesn't need its own pillar until ~20 apps

The "Sustainability" pillar (AWS WAF only) is intentionally NOT split out — ~80% of Sustainability recommendations are renamed Cost recommendations.

## Why this pillar exists

The platform has to actually ship and run. The build order locks the dependency graph (foundation before slices, slices before generators, generators before apps). The graduation pipeline ensures the schema-per-app pattern pays off as designed (a 2–3 day extraction, not a 2–3 month surgery). The bootstrap script proves the whole stack from scratch.

Observability + cost economics live here because they cut across the operational lifecycle. Open frontiers tracks acknowledged unknowns so they're never lost.

## Leaf documents in this pillar

| Document | Status | Source (v1.3) |
|---|---|---|
| [build-order.md](build-order.md) | 🟢 migrated S003 v1.1 (BLK-S002-003 cohort shuffle applied) | §17 |
| [graduation-pipeline.md](graduation-pipeline.md) | 🟢 migrated S003 v1.0 | §17.5 |
| [bootstrap-script.md](bootstrap-script.md) | 🟢 migrated S003 v1.0 | §18 |
| [dashboards.md](dashboards.md) | 🟢 migrated S003 v1.0 (incorporates _intake/dashboard-plan.md 6 pages) | §15 |
| [open-frontiers.md](open-frontiers.md) | 🟢 migrated S003 v1.0 | §19 |

## Multi-device + Android workflow (B_ZERO_LAPTOP_DEPENDENCY — P-OPER-001)

The CSPS platform is designed for zero-laptop-dependency: all work is push-to-remote-first, accessible from any device with a browser via GitHub Codespaces.

| Leaf | Status | Covers |
|---|---|---|
| [android-workflow.md](android-workflow.md) | 🟢 active | GitHub mobile / Codespaces from Android Chromium / session workflow |
| [multi-machine-parity.md](multi-machine-parity.md) | 🟢 active | Bootstrap parity spec / devcontainer / pnpm version alignment |

**Codespaces quick start:**
1. Open https://github.com/CommarkG/csps
2. Click **Code** → **Codespaces** → **New codespace**
3. Wait for devcontainer boot (Node 20 + pnpm pre-installed via postCreate.sh)
4. Run `pnpm verify --skip-install` to confirm baseline

**GitHub Free tier decision (S018):** 60 Codespace hours/month — sufficient for current solo-dev stage. Upgrade to GitHub Pro ($4/mo, 180 hours) when regularly exceeding 60 hours/month.

**Android workflow:** Open Codespace URL in Chrome on Android. Keyboard + split screen works for read/review. Committing is functional though slower. GitHub mobile app for repo browsing + PR review without a keyboard.

---

Future leaves (post-v1) — stubs created S003-extended (lifecycle: experimental, lifecycle_state: pending-protocol, next_review_at: 2026-12-01):
- [observability.md](observability.md) — OTel GenAI conventions, structured logging, tracing — STUB ✅
- [cost-economics.md](cost-economics.md) — per-tenant cost attribution, tier thresholds, partition pruning — STUB ✅
- [runbooks.md](runbooks.md) — incident response, common operational tasks — STUB ✅
- [slo-error-budgets.md](slo-error-budgets.md) — once first apps ship to paying customers — STUB ✅

## Cross-cutting concerns this pillar addresses

- **Reliability** — build order ensures dependencies before dependents; graduation pipeline preserves correctness across extraction
- **Cost** — per-tier audit retention; partition pruning; tier-feature-key reconciliation
- **Performance** — observability surfaces hotspots before they become incidents
- **Observability** — every dashboard reads from audit + facts; live drift detection

## Reuse-first reminder

Before adding a new dashboard, runbook, observability metric, or operational tool:
- Search the existing dashboards + tools tree
- Could existing dashboard A gain a new view rather than spawning dashboard B?
- New operational tool requires ADR + `created-new-because:`

The admin app (`apps/admin`) is one app with many views gated by `staffRole`. We do not build separate admin apps per concern — that's the canonical violation of reuse-first.

## The 12-week summary

| Week | Milestone |
|---|---|
| 1 | Repo bootstrap, Postgres, audit triggers, base ZModel, glossary + catalog scaffold |
| 2 | Foundation slices, Stripe/Clerk wiring, glossary codegen, frontmatter validator |
| 3 | `platform:slice` generator + customer kit + first slice → 100% |
| 4 | Audit runner + 30+ checks + page templates + Storybook + AI discipline hooks |
| 5 | Slice scorecard CI gate + `platform:split` + graduation extraction stub |
| 6 | Generators for agent/skill/persona/wizard + Mastra + skill-eval Worker + skill-importer |
| 7 | Persona slice + bundles + customer chat shell |
| 8 | Crisis escalation slice (load-bearing for v1) |
| 9 | 8 starter personas + 5 starter bundles + domain overlays |
| 10 | Admin dashboards + impersonation |
| 11 | `platform:app` generator + first SaaS app inside platform |
| 12 | Polish, harden CI, first 5 ADRs, v1 launch candidate |

Full per-week detail in [build-order.md](build-order.md).

## Tomorrow's checklist (provisioning before week 1)

1. **GitHub repo** `csps` (private)
2. **Supabase project** `csps-prod` — copy `DATABASE_URL`
3. **Stripe sandbox** test-mode keys
4. **Clerk app** with Organizations enabled
