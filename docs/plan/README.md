---
id: csps.plan.tree
name: plan-tree
description: Index for the CSPS planning playground — a tree of MD documents organized into pillars, indexed in a database, audited for completeness, AI-readable, git-versioned.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:planning
  - type:doc
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - observability
links:
  - { rel: trunk, href: ../../MASTER_PLAN.md }
  - { rel: principle, href: ./pillar-0-governance/reuse-first-principle.md }
---

# CSPS Plan Tree

This is the planning playground for CSPS (CoreSights Platform Services). The substantive architectural content lives here, organized into 6 pillars + 1 meta-pillar, with cross-cutting concerns layered as frontmatter tags. The trunk index (`MASTER_PLAN.md`) at repo root is the entry point.

## Reuse-first principle reminder

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

This applies to plan documents themselves. Before creating a new leaf doc, search the existing tree (`grep -r`, AI search via the catalog) and verify no existing doc covers the topic. If extending an existing doc is feasible, prefer that over creating a new file.

## Pillar tree

```
docs/plan/
├── README.md                            # this file
├── pillar-0-governance/                 # meta-pillar
│   ├── README.md
│   ├── architecture-principles.md
│   ├── reuse-first-principle.md         # the canonical principle, engraved
│   ├── rule-registry.md                 # the chat → rule → enforcer pipeline
│   ├── adr-process.md                   # MADR template + ADR seeds
│   ├── planning-playground.md           # this very system, documented
│   └── audit-runner.md                  # fitness functions, scorecard infrastructure
├── pillar-1-architecture-and-stack/
│   ├── README.md
│   ├── vocabulary.md
│   ├── vocabulary-as-code.md
│   ├── frontmatter-standard.md
│   ├── tech-stack.md
│   ├── repo-layout.md
│   ├── naming-protocol.md
│   ├── slice-contract.md
│   ├── complexity-contract.md
│   └── module-folder-pattern.md
├── pillar-2-data-and-schema/
│   ├── README.md
│   ├── foundation-zmodel.md
│   ├── app-schema-contract.md
│   ├── starter-slices.md
│   └── audit-triggers.md
├── pillar-3-platform-services/
│   ├── README.md
│   ├── stripe-clerk-wiring.md
│   ├── customer-kit.md
│   ├── template-governance.md
│   ├── catalog-bundle-system.md
│   └── sandboxed-skill-governance.md
├── pillar-4-developer-experience/
│   ├── README.md
│   ├── generators.md
│   └── skill-ingestion-contract.md
├── pillar-5-ai-systems/
│   ├── README.md
│   ├── persona-composition.md
│   ├── crisis-escalation.md
│   └── mastra-setup.md
├── pillar-6-operations-and-delivery/
│   ├── README.md
│   ├── build-order.md
│   ├── graduation-pipeline.md
│   ├── bootstrap-script.md
│   ├── dashboards.md
│   └── open-frontiers.md
└── _legacy/
    └── MASTER_PLAN_v1.3.md              # archived during migration
```

## Frontmatter contract for every leaf doc

Every leaf doc in this tree carries the universal CSPS frontmatter (per `pillar-1-architecture-and-stack/frontmatter-standard.md`) plus a `crosscutting:` array declaring which cross-cutting concerns it addresses.

## Audit

The planning audit script (`tools/planning-audit/audit.mjs`, ~200 LOC, run in CI) parses every leaf's frontmatter and verifies:
- Required fields present
- Closed-enum dimension values
- No dangling `links.rel` references
- No `status: draft` doc older than 14 days
- Every cross-cutting concern is addressed by ≥1 leaf doc per pillar
- Every pillar README links to all its leaf docs
- The reuse-first principle is mentioned in every pillar README

Output: `docs/plan/INDEX.md` (auto-generated full tree with statuses) + `docs/plan/CONTEXT.md` (auto-generated AI ingestion entry point).
