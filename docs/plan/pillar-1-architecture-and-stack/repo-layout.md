---
id: csps.pillar-1.repo-layout
name: repo-layout
description: The CSPS monorepo file structure. Three guiding constraints — Foundation slices vs App slices physically separated for graduation extraction; third-party content physically separated from CSPS-owned content for trust enforcement; the layout itself encodes the architecture so violations are visible at the file level.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:architecture
  - type:reference
  - audience:developer
  - maturity:stable
crosscutting:
  - security
  - reliability
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ../pillar-0-governance/reuse-first-principle.md }
  - { rel: tech-stack, href: ./tech-stack.md }
  - { rel: app-schema-contract, href: ../pillar-2-data-and-schema/app-schema-contract.md }
---

# Repo Layout

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The CSPS monorepo file structure. Three guiding constraints determined the layout:

1. **Foundation slices vs App slices must be physically separated** for graduation extraction (extracted apps take their `app_<slug>` schema; Foundation stays)
2. **Third-party content must be physically separated from CSPS-owned content** for trust enforcement (Quarantine/Vendored/Platform-owned tiers, per [sandboxed-skill-governance.md](../pillar-3-platform-services/sandboxed-skill-governance.md))
3. **The layout itself encodes the architecture** so violations are visible at the file level (not just at runtime)

## The full tree

```
csps/
├── apps/
│   ├── admin/                          # ONE admin app, views gated by staffRole
│   │   ├── app/                        # Next.js App Router
│   │   │   ├── (admin)/users/
│   │   │   ├── (admin)/orgs/
│   │   │   ├── (admin)/billing/
│   │   │   ├── (admin)/audit/          # audit log viewer
│   │   │   ├── (admin)/audits/         # recurring-audit dashboard
│   │   │   ├── (admin)/templates/      # template gallery + scorecard
│   │   │   ├── (admin)/catalog/        # artifact catalog browser + bundle composer
│   │   │   ├── (admin)/policies/       # rule registry RTM (per pillar 0 / rule-registry.md)
│   │   │   ├── (admin)/skills/         # skill governance: inbox, inventory, upgrades
│   │   │   ├── (admin)/personas/
│   │   │   ├── (admin)/bundles/
│   │   │   ├── (admin)/slices/         # slice-health overview
│   │   │   ├── (admin)/marketplace/
│   │   │   └── (admin)/crisis/         # crisis events queue
│   │   └── payload.config.ts
│   ├── web/                            # marketing + sign-up
│   ├── workers/                        # background runners
│   ├── skill-eval-worker/              # ISOLATED sandbox runner (CF Worker)
│   └── <scope>/<app-name>/             # each SaaS app (one per app_<slug> schema)
│
├── vendor/
│   └── skills/                         # Quarantine — verbatim, never edited
│       └── <source>/<author>/<skill>/
│           ├── SOURCE.md               # upstream skill, untouched
│           └── upstream-meta.json      # provenance metadata
│
├── libs/
│   ├── shared/                         # universal shared-kernel libraries
│   │   ├── ui-customer-kit/            # 4-component atomic primitives
│   │   ├── data-access-prisma/
│   │   ├── data-access-zenstack/
│   │   ├── util-vocab/
│   │   └── util-naming/
│   ├── skills/
│   │   ├── _vendored/                  # Vendored — promoted but unmodified
│   │   │   └── <name>@<sha>/
│   │   └── <name>/                     # Platform-owned — extracted essence
│   │       ├── SKILL.md
│   │       ├── IMPORT.yaml             # provenance + review status
│   │       └── contract.yaml           # slice contract export
│   ├── agents/<name>/
│   ├── plugins/<name>/
│   ├── personas/<name>/
│   ├── bundles/<name>/                 # bundle.yaml manifests
│   ├── policies/                       # ZModel = source of truth
│   │   ├── schema.zmodel               # root: imports all slices
│   │   ├── base.zmodel                 # the Base mixin
│   │   ├── slices/
│   │   │   ├── public/                 # Foundation slices (shared kernel)
│   │   │   └── app-<slug>/             # App slices (per-app)
│   │   └── glossary.zmodel             # generated from packages/glossary
│   ├── audits/                         # the audit system is a slice
│   ├── crisis/                         # crisis-escalation slice
│   └── registry/
│
├── packages/
│   ├── glossary/                       # vocabulary-as-code (per vocabulary-as-code.md)
│   ├── principles/                     # principles-as-code (per pillar 0 / mechanical-enforcement.md)
│   │   ├── src/
│   │   │   ├── terms.ts                # (alias for glossary; loaded together)
│   │   │   └── codegen.ts
│   │   └── principles.yaml             # SOURCE OF TRUTH for all principles
│   ├── principles-mcp/                 # MCP server exposing principles + catalog
│   ├── catalog/                        # file metadata + tags + bundles
│   ├── skills/                         # invokable AI skills (PCR, WIP, audit-self, batched-plan, reuse-check)
│   ├── templates/                      # @csps/templates — page templates (the 22 catalog)
│   ├── ui/                             # raw shadcn add target — internal only
│   ├── db/                             # Prisma + ZenStack + multi-schema
│   ├── auth/                           # Clerk wrapper + session helpers
│   ├── entitlements/                   # Stripe sync + <Gate> component
│   └── stripe/                         # Stripe SDK + webhook handlers
│
├── tools/
│   ├── generators/                     # Nx generators (per pillar 4 / generators.md)
│   │   ├── slice/
│   │   ├── split/                      # mechanical decomposition
│   │   ├── page/                       # template-only
│   │   ├── app/
│   │   ├── agent/
│   │   ├── skill/
│   │   ├── skill-import/               # third-party ingestion
│   │   ├── skill-promote/
│   │   ├── skill-upgrade/
│   │   ├── persona/
│   │   └── wizard/
│   ├── validators/
│   │   ├── validate-structure.mjs
│   │   ├── validate-vocab.mjs
│   │   ├── validate-naming.mjs
│   │   ├── validate-zmodel-naming.mjs
│   │   ├── validate-feature-keys.mjs
│   │   ├── validate-adr-numbering.mjs
│   │   ├── validate-template-usage.mjs
│   │   ├── validate-app-schema.mjs
│   │   ├── validate-frontmatter.mjs
│   │   ├── validate-file-size.mjs
│   │   ├── validate-complexity.mjs
│   │   ├── validate-bundle-membership.mjs
│   │   ├── validate-skill-integrity.mjs    # SHA + capability digest
│   │   ├── validate-skill-capabilities.mjs # banned tools, drift detection
│   │   └── validate-principle-coverage.mjs # P-META-001 enforcer (audit-the-audits)
│   ├── catalog/
│   │   ├── dimensions.ts
│   │   ├── variants.ts
│   │   ├── scan.mjs
│   │   └── extract-jsdoc-meta.ts
│   ├── skill-importer/                 # Debian-style importer
│   │   ├── fetch.mjs                   # SHA-pinned fetch
│   │   ├── codemod.mjs                 # frontmatter + glossary normalization
│   │   ├── eval-runner.mjs             # talks to apps/skill-eval-worker
│   │   ├── prompt-injection-scan.mjs   # static scanner (Snyk-style)
│   │   └── field-maps/                 # per-source mapping rules
│   ├── audit-runner/
│   ├── planning-audit/                 # audits the docs/plan/ tree
│   │   └── audit.mjs
│   ├── hotspot-analysis/
│   ├── extract-app/                    # graduation pipeline
│   │   └── extract-app.ps1
│   └── migrate-multi-schema/           # custom Prisma multi-schema migrator
│       └── migrate.ts
│
├── docs/
│   ├── plan/                           # the planning playground (per pillar 0 / planning-playground.md)
│   │   ├── README.md
│   │   ├── pillar-0-governance/
│   │   ├── pillar-1-architecture-and-stack/
│   │   ├── pillar-2-data-and-schema/
│   │   ├── pillar-3-platform-services/
│   │   ├── pillar-4-developer-experience/
│   │   ├── pillar-5-ai-systems/
│   │   ├── pillar-6-operations-and-delivery/
│   │   └── _legacy/                    # archived previous master-plan versions
│   ├── adr/NNNN-*.md                   # MADR-format decision records
│   ├── rules/RULE-NNNN.yaml             # rule registry (per pillar 0 / rule-registry.md)
│   ├── glossary.md                     # GENERATED from packages/glossary
│   └── slice-contract.md
│
├── .github/workflows/
│   ├── audit-pr.yml
│   ├── audit-nightly.yml
│   ├── audit-weekly.yml                # includes hotspot digest + skill re-eval
│   └── scorecard.yml                   # OpenSSF
│
├── .githooks/
│   └── pre-push                        # branch name validator
├── .husky/  (or lefthook.yml)
│   └── pre-commit                      # naming + frontmatter + size validators
├── .vale.ini
├── .vale/styles/CSPS/                  # GENERATED from packages/glossary
├── .cataloggignore                     # excluded from frontmatter requirement
├── .claude/
│   ├── hooks/                          # GENERATED from packages/principles
│   └── commands/                       # slash commands (PCR, WIP, etc.)
├── eslint.config.ts
├── nx.json
├── package.json
├── skills.lock.yaml                    # repo-root skill lockfile
├── AGENTS.md                           # GENERATED from packages/principles
├── CLAUDE.md                           # symlink to AGENTS.md
└── MASTER_PLAN.md                      # trunk index for the architecture
```

## Why specific layout decisions

### `vendor/` is at repo root, not under `libs/`

Signals "this is not CSPS code." Same convention as Go's `vendor/`. Anyone (or any tool) seeing `vendor/` knows the trust posture is different. The skill-importer is the only thing that writes here; everything else treats it as read-only provenance.

### `apps/skill-eval-worker` is its own app

Isolation. The sandbox runner has its own deployment, its own bindings (mock-only), its own DB credentials (deny-all). Co-locating with `apps/admin` would risk a single-codebase bug exposing production.

### `tools/` and `packages/` are split

`packages/` is consumed by apps at runtime; `tools/` runs at build/CI time. Mixing them creates dependency cycles (build tools depending on runtime packages).

### `libs/policies/slices/public/` vs `libs/policies/slices/app-<slug>/`

Foundation vs App slices physically separated. The graduation extraction script uses this physical boundary to decide what travels with the extracted app.

### `libs/skills/_vendored/` vs `libs/skills/<name>/`

Vendored vs Platform-owned skills physically separated. The capability model in [sandboxed-skill-governance.md](../pillar-3-platform-services/sandboxed-skill-governance.md) gates differently per tier; the file system is the first signal of which tier you're in.

### `packages/principles/` vs `packages/glossary/`

Two separate single-source-of-truth files with the same codegen pattern but different change cadences and consumers. Vocabulary changes are rare; principles evolve more frequently. Separating them keeps the codegen pipelines independent.

### Per-app `AGENTS.md`

Each `apps/<scope>/<name>/` has its own `AGENTS.md` that extends the root `AGENTS.md`. Cursor and Claude Code both walk parent directories for instruction-file cascade. New principles added to the root propagate everywhere automatically.

## Reuse-first applied to repo layout

Before adding a new top-level directory:

1. **Check the existing tree.** Could the new artifact live in an existing folder?
2. **Common cases:**
   - New skill → `libs/skills/<name>/` (Platform-owned tier)
   - New page template → `packages/templates/src/pages/<name>/`
   - New validator → `tools/validators/validate-<name>.mjs`
   - New audit check → `libs/audits/checks/<slug>.ts`
   - New ADR → `docs/adr/NNNN-<title>.md`
   - New rule → `docs/rules/RULE-NNNN.yaml`
3. **New top-level directory requires ADR** explaining why no existing folder fits.

## Sources

- [Nx workspace conventions](https://nx.dev/docs/concepts/decisions/folder-structure)
- [Go vendor convention](https://go.dev/ref/mod#vendoring)
- [Anthropic Skills folder structure](https://github.com/anthropics/skills) (the SKILL.md + references/ + scripts/ layout)
