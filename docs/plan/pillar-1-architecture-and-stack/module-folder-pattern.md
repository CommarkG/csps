---
id: csps.pillar-1.module-folder-pattern
name: module-folder-pattern
description: The mini-tree decomposition pattern (formerly "manifested slice") — folder + index.ext + context.md + sub-files per aspect. Mandatory above complexity thresholds. Convergent across React component folders, Bit components, Nx libraries, Anthropic Skills, Rust crates. The shape every decomposed slice obeys.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - observability
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ../pillar-0-governance/reuse-first-principle.md }
  - { rel: complexity-contract, href: ./complexity-contract.md }
  - { rel: slice-contract, href: ./slice-contract.md }
  - { rel: vocabulary, href: ./vocabulary.md }
domain_path: platform
core_spine: ARCH
schema_anchor: pillar_0_governance_leaves
scope_level: S1
---

# The Module Folder Pattern

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

*Renamed v1.5 from "manifested slice" to "module folder pattern" per the vocabulary audit. The pattern itself is unchanged — the new name matches the convergent industry term used by React, Bit, Nx, Anthropic Skills, and Rust crates.*

## What this document locks

When a slice exceeds complexity thresholds, it MUST decompose. Without a predefined decomposition pattern, devs (and AI assistants) invent ad-hoc structures and the codebase becomes a maze. The module-folder pattern is **one shape, applied consistently** — every decomposed slice looks the same way.

## Why this specific shape

Convergent across five well-known patterns, all solving the same problem:

| Pattern | Shape |
|---|---|
| **React component folders** | `Button/Button.tsx + Button.test.tsx + Button.stories.tsx + index.ts` |
| **Bit components** | `Component/component.json + main.tsx + sub-files + index.ts` |
| **Nx libraries** | `lib-name/project.json + src/index.ts + src/lib/*.ts + README.md` |
| **Anthropic Skills** | `skill-name/SKILL.md + scripts/ + references/ + assets/` |
| **Rust crates** | `crate-name/Cargo.toml + src/lib.rs + src/sub-modules.rs` |

All five solved the same problem with the same shape: **machine manifest + human context + entrypoint + aspect files.**

## Trigger conditions (any one)

A slice MUST decompose into the module-folder mini-tree when any of these fire:

- Single file >500 LOC
- Slice total >2,500 LOC
- Cognitive complexity >15 anywhere in the slice
- `context.md` can no longer summarise the slice in <400 lines
- Number of distinct concerns in the slice >3 (heuristic; flagged by reviewer)

## The shape

```
<slice-name>/
├── index.ts                  # public API only — re-exports + slice-contract export (≤120 LOC)
├── context.md                # frontmatter + structural map + rationale (≤400 lines)
├── <slice-name>.tsx          # main component / entrypoint impl (≤300 LOC)
├── model.ts                  # types, Zod schemas, ZenStack contracts
├── api.ts                    # Prisma queries, server actions
├── ui/                       # sub-components (each their own mini-tree if >150 LOC)
│   ├── index.ts
│   └── <component>/
│       ├── index.ts          # mini-tree recursion
│       ├── context.md
│       └── ...
├── lib/                      # pure helpers
└── __tests__/
```

## What `index.<ext>` must contain

- **Frontmatter** (the slice's manifest — id, tags, description, links)
- **Public API re-exports** (named exports only; no `export *`)
- **Slice-contract export**: `export const slice: SliceManifest = {...}` (consumed by audit runner)
- **Nothing else.** No business logic.

*Why `index.ts` has a hard size cap (120 LOC):* it's the public API surface. Business logic in `index.ts` means the slice's public API is bloated, which means consumers depend on internals.

*Why named exports only (no `export *`):* `export *` kills tree-shaking and obscures what's actually public. Named exports force you to think about what consumers should see.

## What `context.md` must contain

- **Frontmatter** (mirrors `index.ts` plus prose-specific fields)
- **What this slice does** (1-2 paragraphs)
- **Why it exists** (the design rationale that doesn't belong in code comments)
- **Structural map** — a list of every sub-file with one-line description
- **Cross-slice dependencies** — what this slice reads from / writes to
- **Decomposition history** — when it was split, what triggered it
- **Open questions / known issues**

*Why this exists:* Claude Code, Cursor, and Mastra agents read `context.md` to decide whether to load the slice into working memory. Without it, AI assistants must read every file to understand the slice — wasting context on noise. With it, one read of `context.md` decides whether to dive deeper.

## The variants tax-shield

A new sub-file under a module-folder slice inherits the parent's variant defaults (per [frontmatter-standard.md](./frontmatter-standard.md) variants pattern). So a 30-line helper at `<slice>/lib/format-date.ts` doesn't need explicit frontmatter — variants give it `domain:<parent>`, `slice:<slice-name>`, `audience:<inherited>`, etc. **Only `id`, `name`, and `description` are required per file.**

*Why this matters:* without variants, every small file needs full frontmatter, which kills the "small files OK" principle. With variants, small files declare only their unique identity; common context cascades.

## Generator support

`platform:slice` initially scaffolds the flat shape (no module-folder yet). When the audit detects a trigger, `nx g platform:split <slice>` mechanically converts a flat slice into a module-folder mini-tree:

- Creates `index.ts` with re-exports of the current public surface
- Creates `context.md` with auto-extracted structural map
- Moves logic to sub-files (`<slice-name>.tsx`, `model.ts`, `api.ts`, etc.)
- Updates imports across the codebase
- Updates the slice's `slice.json` to declare the new structure

One-command split, no manual surgery.

## Anti-patterns (do not do)

- **Decomposition without `context.md`** → mini-tree of 12 files with no readme. New devs / agents drown.
- **Barrel files at every folder** → bundler perf killer + circular import risk. Barrels only at slice public-API boundaries.
- **Re-exporting via `export *`** → kills tree-shaking and obscures the public API. Always named exports.
- **Splitting by file type** (`models/`, `views/`, `controllers/`) at the slice level → maze. Split by concern instead.

## Recursion (mini-trees within mini-trees)

If a sub-component grows past 150 LOC, it gets its own module-folder shape:

```
<slice-name>/
└── ui/
    └── <big-sub-component>/
        ├── index.ts
        ├── context.md
        ├── <big-sub-component>.tsx
        ├── ui/
        └── lib/
```

The recursion has no fixed depth limit, but per the principle of three-layer composition (P-ARCH-005), most slices stay 1-2 levels deep.

## Reuse-first applied to module decomposition

Before splitting a slice into a module-folder:

1. **Check if the bloat is shared logic** — could it be extracted to a `packages/*` library and consumed by multiple slices?
2. **Check if the bloat is wrong-abstraction** — per the reuse-first counterweight, sometimes the right move is `inline-and-redecide` rather than splitting more
3. **If neither**, split via `nx g platform:split <slice>` — the mechanical decomposition

## Why the rename from "manifested slice" to "module folder"

The earlier CSPS coinage "manifested slice" was opaque to other AI systems and humans outside the project. "Module folder pattern" is the convergent industry term — instantly recognized by anyone who's worked with React, Bit, Nx, Anthropic Skills, or Rust. The pattern itself is identical; only the name changed.

This rename is one of 8 vocabulary audits in v1.5 (per [vocabulary.md](./vocabulary.md) "Renames applied" section).

## Sources

- React component-folder convention — [Josh Comeau's writeup](https://www.joshwcomeau.com/react/file-structure/)
- [Bit components](https://bit.dev/reference/components/component-overview) (machine-manifest pattern)
- [Nx library structure](https://nx.dev/docs/concepts/decisions/folder-structure)
- [Anthropic Skills](https://github.com/anthropics/skills) (SKILL.md + sub-files)
- [Rust crate structure](https://doc.rust-lang.org/cargo/guide/project-layout.html)
- Vertical Slice Architecture (Jimmy Bogard) — slice-as-feature pattern
- Feature-Sliced Design — [segments + slices + layers](https://feature-sliced.design/)
