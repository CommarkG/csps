---
id: csps.plan.legacy
name: legacy-archive
description: Archive of previous master-plan versions. Once git is set up (week 1), full version history lives in git log; this folder is for pre-git archives and migration provenance notes.
version: 1.0
owner: group:finky
lifecycle: deprecated
lifecycle_state: active
tags:
  - domain:planning
  - type:reference
  - audience:developer
  - maturity:frozen
links:
  - { rel: parent, href: ../README.md }
  - { rel: current-trunk, href: ../../../MASTER_PLAN.md }
domain_path: platform
---

# Legacy Plan Archive

This folder holds historical master-plan versions and migration provenance notes. Once git is set up (week 1), full version history will live in `git log`; this folder will primarily serve as a pre-git archive and as a record of what migrated to where.

## Migration provenance

The substantive content from earlier master-plan versions has been migrated into per-pillar leaf documents under `docs/plan/pillar-N-<name>/`. The mapping:

### v1.3 → v1.4 (pillar restructure to industry-standard naming)

| v1.3 section | Migrated to |
|---|---|
| §0 Vocabulary | [pillar-1/vocabulary.md](../pillar-1-architecture-and-stack/vocabulary.md) |
| §0.5 Vocabulary-as-code | [pillar-1/vocabulary-as-code.md](../pillar-1-architecture-and-stack/vocabulary-as-code.md) |
| §0.7 Frontmatter standard | [pillar-1/frontmatter-standard.md](../pillar-1-architecture-and-stack/frontmatter-standard.md) |
| §1 Architecture principles | [pillar-0/architecture-principles.md](../pillar-0-governance/architecture-principles.md) (still 🟡 to migrate; stubs in `packages/principles/principles.yaml`) |
| §2 Tech stack | [pillar-1/tech-stack.md](../pillar-1-architecture-and-stack/tech-stack.md) |
| §3 Repo layout | [pillar-1/repo-layout.md](../pillar-1-architecture-and-stack/repo-layout.md) |
| §4 Naming protocol | [pillar-1/naming-protocol.md](../pillar-1-architecture-and-stack/naming-protocol.md) |
| §5 Slice contract | [pillar-1/slice-contract.md](../pillar-1-architecture-and-stack/slice-contract.md) |
| §5.5 Complexity contract | [pillar-1/complexity-contract.md](../pillar-1-architecture-and-stack/complexity-contract.md) |
| §5.6 Manifested slice | [pillar-1/module-folder-pattern.md](../pillar-1-architecture-and-stack/module-folder-pattern.md) (renamed) |
| §5.7 Skill ingestion contract | [pillar-4/skill-ingestion-contract.md](../pillar-4-developer-experience/skill-ingestion-contract.md) (still 🟡 to migrate) |
| §6 Foundation ZModel | [pillar-2/foundation-zmodel.md](../pillar-2-data-and-schema/foundation-zmodel.md) (still 🟡 to migrate) |
| §6.5 App schema contract | [pillar-2/app-schema-contract.md](../pillar-2-data-and-schema/app-schema-contract.md) (still 🟡 to migrate) |
| §7 Starter slices | [pillar-2/starter-slices.md](../pillar-2-data-and-schema/starter-slices.md) (still 🟡 to migrate) |
| §8 Audit triggers | [pillar-2/audit-triggers.md](../pillar-2-data-and-schema/audit-triggers.md) (still 🟡 to migrate) |
| §9 Stripe + Clerk wiring | [pillar-3/stripe-clerk-wiring.md](../pillar-3-platform-services/stripe-clerk-wiring.md) (still 🟡 to migrate) |
| §10 Generators | [pillar-4/generators.md](../pillar-4-developer-experience/generators.md) (still 🟡 to migrate) |
| §11 Customer kit | [pillar-3/customer-kit.md](../pillar-3-platform-services/customer-kit.md) (still 🟡 to migrate) |
| §11.5 Template governance | [pillar-3/template-governance.md](../pillar-3-platform-services/template-governance.md) (still 🟡 to migrate) |
| §11.7 Catalog & bundle | [pillar-3/catalog-bundle-system.md](../pillar-3-platform-services/catalog-bundle-system.md) (still 🟡 to migrate) |
| §11.8 Sandboxed skill governance | [pillar-3/sandboxed-skill-governance.md](../pillar-3-platform-services/sandboxed-skill-governance.md) (still 🟡 to migrate) |
| §12 Persona composition | [pillar-5/persona-composition.md](../pillar-5-ai-systems/persona-composition.md) (still 🟡 to migrate) |
| §13 Crisis escalation | [pillar-5/crisis-escalation.md](../pillar-5-ai-systems/crisis-escalation.md) (still 🟡 to migrate) |
| §14 Audit runner | [pillar-0/audit-runner.md](../pillar-0-governance/audit-runner.md) (still 🟡 to migrate) |
| §15 Dashboards | [pillar-6/dashboards.md](../pillar-6-operations-and-delivery/dashboards.md) (still 🟡 to migrate) |
| §16 Mastra setup | [pillar-5/mastra-setup.md](../pillar-5-ai-systems/mastra-setup.md) (still 🟡 to migrate) |
| §17 Build order | [pillar-6/build-order.md](../pillar-6-operations-and-delivery/build-order.md) (still 🟡 to migrate) |
| §17.5 Graduation pipeline | [pillar-6/graduation-pipeline.md](../pillar-6-operations-and-delivery/graduation-pipeline.md) (still 🟡 to migrate) |
| §18 Bootstrap script | [pillar-6/bootstrap-script.md](../pillar-6-operations-and-delivery/bootstrap-script.md) (still 🟡 to migrate) |
| §19 Open frontiers | [pillar-6/open-frontiers.md](../pillar-6-operations-and-delivery/open-frontiers.md) (still 🟡 to migrate) |

### v1.4 → v1.5 additions

New content added in v1.5 (mechanical-enforcement architecture + operating principles):

- [AGENTS.md](../../../AGENTS.md) (root)
- [packages/principles/principles.yaml](../../../packages/principles/principles.yaml)
- [packages/principles/codegen.ts](../../../packages/principles/codegen.ts)
- [pillar-0/mechanical-enforcement.md](../pillar-0-governance/mechanical-enforcement.md)
- [pillar-0/operating-principles.md](../pillar-0-governance/operating-principles.md)

## Vocabulary renames applied during migration

The following CSPS-coined "cool names" were retired in favor of industry-standard equivalents (per [vocabulary.md](../pillar-1-architecture-and-stack/vocabulary.md)):

| Earlier CSPS coinage | Industry-standard replacement |
|---|---|
| Manifested slice | Module folder pattern |
| Conductor | Orchestrator agent |
| Trunk element | Shared kernel |
| App pack | Feature pack |
| Eval Worker | Sandbox runner (folder paths retain `skill-eval-worker`) |
| Capability bundle | Permission set |

## Why no full v1.3 archive file

The substantive prose from v1.3 has been migrated into the per-pillar leaf documents (with vocabulary renames applied and reuse-first reminders added). Reproducing the full 1,800-line v1.3 in this folder would be:

- **Redundant** — the content lives in the leaves now
- **Risk-prone** — recreating from memory could introduce errors
- **Soon obsolete** — once the GitHub repo is created, `git log MASTER_PLAN.md` will show the full version history, and `git show <commit>:MASTER_PLAN.md` retrieves any prior version exactly

## Future archive policy

Once git is set up:

1. **Major version transitions (vN.0 → vN+1.0)** — drop a brief commit-hash note here pointing to the last-commit-of-vN.0 in git history
2. **Significant content reorganizations** — drop a migration provenance note here (like this one) showing what moved where
3. **Deprecated leaf docs** — when a leaf is deprecated and its content migrated elsewhere, add a deprecation entry here pointing to the replacement

## Sources

- [Diátaxis framework](https://diataxis.fr/) — the doc-taxonomy this archive uses (`type: reference`, `lifecycle: deprecated`)
- Standard documentation-as-code practice — version history lives in git, not in markdown
