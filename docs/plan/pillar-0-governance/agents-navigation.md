---
id: csps.governance.agents-navigation
name: agents-navigation
description: Path reference table extracted from AGENTS.md for constitutional file size relief. Where things live in CSPS.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S031
impl_status: swift-implemented
links:
  - { rel: source, href: ../../../AGENTS.md }
  - { rel: parent, href: ./README.md }
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
---

# CSPS Path Reference — Where Things Live

Extracted from AGENTS.md to reduce constitutional file size.
Reference: P-ARCH-030 (apps are ephemeral trials, libs/* are permanent).

| Path | Purpose |
|---|---|
| [`MASTER_PLAN.md`](../../../MASTER_PLAN.md) | Trunk index |
| [`docs/plan/pillar-0-governance/`](.) | Principles, ADRs, audit, planning |
| [`docs/plan/pillar-1-architecture-and-stack/`](../pillar-1-architecture-and-stack/) | Vocabulary, frontmatter, slice contract |
| [`docs/plan/pillar-2-data-and-schema/`](../pillar-2-data-and-schema/) | ZModel, schema-per-app, audit triggers |
| [`docs/plan/pillar-3-platform-services/`](../pillar-3-platform-services/) | Stripe/Clerk, templates, skill governance |
| [`docs/plan/pillar-4-developer-experience/`](../pillar-4-developer-experience/) | Generators, skills, ingestion |
| [`docs/plan/pillar-5-ai-systems/`](../pillar-5-ai-systems/) | Personas, Mastra, crisis escalation |
| [`docs/plan/pillar-6-operations-and-delivery/`](../pillar-6-operations-and-delivery/) | Build order, graduation, dashboards |
| [`packages/principles/principles.yaml`](../../../packages/principles/principles.yaml) | **Single source of truth for principles** |
| [`packages/skills/`](../../../packages/skills/) | Existing platform skills (7) |
| [`.claude/skills/`](../../../.claude/skills/) | Claude Code skill auto-load (9 skills) |
| [`tools/`](../../../tools/) | Generators, audit-runner, validators |
| [`docs/plan/pillar-0-governance/plan-creation-protocol.md`](plan-creation-protocol.md) | Canonical "how plans get made" 5-step protocol |
| [`docs/plan/pillar-0-governance/context-loss-pains.md`](context-loss-pains.md) | SSoT 22-pain catalog |
| [`docs/plan/pillar-0-governance/csps-platform-dna.md`](csps-platform-dna.md) | 13 CSPS DNA elements + process integration map |
| [`docs/plan/_intake/contexts/INDEX.md`](../_intake/contexts/INDEX.md) | Extraction notes index |
| [`docs/plan/pillar-0-governance/depth-discipline.md`](depth-discipline.md) | 5 CSPS depth semantics |
| [`tools/templates/governed-artifact-frontmatter.template.md`](../../../tools/templates/governed-artifact-frontmatter.template.md) | Base frontmatter scaffold for governed artifacts |
| [`docs/plan/pillar-0-governance/model-routing-dashboard.md`](model-routing-dashboard.md) | Dynamic model-routing decisions + patterns |
