---
id: csps.pillar4.developer-journey.index
name: developer-journey-index
description: "The complete developer journey for building SaaS on CSPS — from intent to production. 8 stages, PE-scored, with planning grid integration. Mini-tree root."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S039
mini_tree_root: true
sub_files:
  - ./01-developer-threshold.md
  - ./02-planning-grid.md
  - ./03-scaffolding-and-tooling.md
  - ./04-domain-design.md
  - ./05-feature-development.md
  - ./06-validation-protocol.md
  - ./07-deployment.md
  - ./08-iteration-and-growth.md
  - ./pe-scoring.md
links:
  - { rel: parent, href: ../README.md }
  - { rel: completion-gap, href: ../../_handoff/VAULT/COMPLETION-GAP-ANALYSIS-S039.md }
  - { rel: platform-model, href: ../../pillar-0-governance/meta-platform/app-pipeline.md }
tags:
  - domain:dx
  - type:reference
  - audience:developer
  - maturity:draft
scope_level: S1
---

# Developer Journey — CSPS Platform

> A developer who understands this journey can build any SaaS product without reinventing platform infrastructure.
> A developer who skips it will hit the same walls every time: wrong data model, incomplete UI, broken pipelines.

---

## What this mini-tree covers

The journey a developer takes from "I want to build X" to "X is live and growing" — using CSPS as the platform foundation.

This journey applies to:
- Solo founders building their first SaaS
- Teams adding new apps to the CSPS ecosystem
- Developers inheriting an existing CSPS app
- AI agents (Sonnet) building under OPUS-2 direction

---

## The developer journey at a glance

| Stage | What happens | PE score | Status |
|---|---|---|---|
| **1. Threshold** | Intent crystallization — state the goal clearly enough to route correctly | 107 | Specifying |
| **2. Planning Grid** | Activate relevant nodes, cross-validate before any code | 40 | Proposed |
| **3. Scaffolding** | Use CSPS tools to create the app skeleton | 80 | Validated (pnpm create:app exists) |
| **4. Domain Design** | Define data model, business logic, auth policies | 40 | Proposed |
| **5. Feature Development** | Build under planning protocol — ratified plans only | 64 | Specifying |
| **6. Validation** | Run full validator suite before deployment | 80 | Validated (127 validators live) |
| **7. Deployment** | Vercel + CSPS standard — pre-validated | 80 | Validated (Gate 3 exists) |
| **8. Iteration** | Grow the app after launch — user feedback → new intent → planning grid | 20 | Proposed |

**Priority reading order:** Start with Stage 1 (Threshold) and Stage 3 (Scaffolding). Everything else depends on those.

---

## The self-similar design principle

The developer journey IS an instance of the platform's own Threshold → Pipeline model.

When a user arrives at a CSPS app:
- Threshold captures their intent
- Platform routes them to the right pipeline
- Pipeline executes guided by their goal

When a developer builds a CSPS app:
- Threshold captures their intent (what they're building, for whom, why)
- Platform routes them to the right planning grid subgraph
- Planning grid guides them to build correctly

**The platform builds itself the same way users use it.** This is not a metaphor. It is the architecture.

---

## What CSPS provides (pre-built, pre-validated)

Before the developer writes a single line of app-specific code, they inherit:

```
Auth + Multi-tenancy          Clerk + ZenStack RLS — every model is tenant-isolated
Threshold Gate                OnboardingWizard — captures intent, sets archetype
Rate limiting                 Upstash-backed — protects every API route
Security headers              CSP, HSTS, X-Frame-Options — every app
Error capture                 Sentry integration — graceful passthrough
Analytics                     PostHog integration — graceful passthrough
Email delivery                Resend + 5 templates — graceful passthrough
Job queue                     Inngest + 4 functions — graceful passthrough
Realtime                      Upstash SSE — graceful passthrough
Storage                       Cloudflare R2 — graceful passthrough
Deployment                    Vercel pipeline — one command
127 validators                Platform health checks on every commit
```

The developer's job is the domain layer: data model + business logic + UI flows. Everything else is pre-built.

---

## The planning protocol (applies to all stages)

Per Governor ratification S039: **nothing is coded without a ratified plan.**

Ratified = Governor has explicitly reviewed and set `ratified_at`. Not "looks good," not "proceed." Explicit ratification.

Pending plan = no code. Period.

See [01-developer-threshold.md](./01-developer-threshold.md) for how ratification works in practice.
