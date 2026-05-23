---
id: csps.pillar-1.naming-protocol
name: naming-protocol
description: The CSPS naming rules and their named enforcers. Every rule has a specific tool that enforces it and a specific cadence (pre-commit / PR / nightly). Naming inconsistency is the #1 indicator of architectural decay; without enforcement, naming rules don't survive a quarter.
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
  - reliability
  - observability
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ../pillar-0-governance/reuse-first-principle.md }
  - { rel: vocabulary, href: ./vocabulary.md }
  - { rel: frontmatter-standard, href: ./frontmatter-standard.md }
domain_path: platform
core_spine: ARCH
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Is the architecture decision described here still the ratified approach, or has a newer ADR superseded it?"
---

# Naming Protocol (with concrete enforcement)

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The CSPS naming rules. Every rule below has a named enforcer and a named cadence — without enforcement, naming rules don't survive a quarter.

## Why this exists

Naming inconsistency is the #1 indicator of architectural decay. A platform where the same concept appears as `userId`, `user_id`, `userID`, `usr_id` across files is unsearchable, unmaintainable, and AI-unfriendly. The cure is mechanical enforcement at every layer that touches names.

## The full naming table

| Surface | Rule | Enforcer | Cadence |
|---|---|---|---|
| Folders, files, slugs | kebab-case (`summarize-pdf`, `crisis-escalation`) | `validate-naming.mjs` (regex + glossary lookup) | pre-commit + PR + nightly |
| TypeScript types/interfaces/classes | PascalCase | `@typescript-eslint/naming-convention` | pre-commit + PR |
| Variables, functions | camelCase | `@typescript-eslint/naming-convention` | pre-commit + PR |
| Constants | UPPER_SNAKE_CASE | `@typescript-eslint/naming-convention` | pre-commit + PR |
| DB tables | snake_case | `validate-zmodel-naming.mjs` | PR + nightly |
| DB columns | snake_case | `validate-zmodel-naming.mjs` | PR + nightly |
| Enum values | UPPER_SNAKE_CASE | `validate-zmodel-naming.mjs` | PR + nightly |
| Feature keys | `<scope>.<entity>.<slug>` (kebab) — e.g. `skill.summarize-pdf`, `app.bookings.skill.confirm-booking` | `validate-feature-keys.mjs` (also asserts Stripe Feature existence) | PR + nightly |
| Slice slugs | kebab, singular (`booking`, not `bookings`) | `validate-naming.mjs` | PR |
| Catalog IDs | `csps.<scope>.<entity>.<name>` dotted | `validate-frontmatter.mjs` (uniqueness check) | PR + nightly |
| Principle IDs | `P-OP-NNN` / `P-ARCH-NNN` / `P-META-NNN` | `validate-principle-coverage.mjs` | PR + nightly |
| Rule IDs | `RULE-NNNN` (sequential, no gaps) | rule-registry validator | PR |
| ADR IDs | `ADR-NNNN` matched by filename `NNNN-kebab-title.md` | `validate-adr-numbering.mjs` | PR |
| Nx project names | `<scope>-<type>-<name>` | Nx-native | PR |
| Branch names | `<type>/<slice-slug>-<short>` | `.githooks/pre-push` | pre-push |
| Foreign synonyms in identifiers | banned per glossary | ESLint `csps/no-forbidden-synonym` | pre-commit + PR |
| Foreign synonyms in prose | banned per glossary | Vale | pre-commit + PR |
| Naming collisions across DB ↔ SKILL.md ↔ Stripe ↔ Payload ↔ Catalog | unique slugs | `validate-naming.mjs` (scans all five sources) — **PR-blocking** | PR + nightly |

## Why naming-collision detection is PR-blocking, not runtime

By the time a runtime check fires, the PR has already merged. The Claude Code `/review` shadowing case (Issue #33080) shows what happens — a custom command silently shadowed by a built-in update broke all custom commands. **Preventive at PR time means the collision never happens.**

## Why every rule has a named enforcer + cadence

Documentation rots. Pre-commit hooks fail in IDE. CI gates fail at PR. Nightly cron catches things that slipped through.

**Defense in depth:** the same naming check often runs in multiple places (e.g., `validate-frontmatter.mjs` runs at pre-commit on changed files AND at nightly on the whole tree). If one cadence misses, another catches.

## Cadence definitions

- **pre-commit** — runs on staged files only via lefthook/husky; warns locally but allows commit (fast feedback)
- **pre-push** — runs on the branch about to be pushed; blocks push on violation
- **PR** — runs in CI on the PR diff; blocks merge on violation
- **nightly** — runs on the full tree at 2am UTC; surfaces drift introduced by drift (e.g., a glossary term renamed but downstream regen forgotten)

## Reuse-first applied to naming

Before adding a new identifier, slug, or feature key:

1. **Search the glossary** (`pnpm catalog:search "<terms>"`) for an existing term that fits
2. **Search the catalog** for an existing artifact with that slug
3. **If a near-match exists**, use the existing name (and `enhances:` field on the artifact)
4. **If genuinely new**, use the canonical form per this protocol; the new name itself becomes a glossary candidate (proposed-tags hatch)

## What this protocol does NOT cover

- **CSS class names** — covered by the design-system convention (BEM-flavored, but enforced by lint)
- **Test file names** — covered by Vitest convention (`*.test.ts`, `*.spec.ts`)
- **Migration file names** — covered by Prisma convention (`<timestamp>_<description>.sql`)
- **Generated file names** — covered by their generator's convention; not subject to this protocol

These are deferred to their respective tooling conventions because they're already enforced by the tools themselves.

## Sources

- [@typescript-eslint/naming-convention rule](https://typescript-eslint.io/rules/naming-convention/)
- [Vale prose linter](https://vale.sh/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Lefthook documentation](https://github.com/evilmartians/lefthook)
- [MADR template (ADR naming)](https://adr.github.io/madr/)
