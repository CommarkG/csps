---
id: csps.pillar-1.complexity-contract
name: complexity-contract
description: The hard limits on file size, function size, cognitive/cyclomatic complexity in CSPS. The ratchet pattern (block diff regressions, grandfather existing code) + three-tier enforcement (pre-commit warn → PR block → nightly hotspot). Files and functions grow until they're unmaintainable; without explicit limits, the moment never comes when "we should split this" is enforceable.
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
  - performance
  - observability
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ../pillar-0-governance/reuse-first-principle.md }
  - { rel: slice-contract, href: ./slice-contract.md }
  - { rel: module-folder-pattern, href: ./module-folder-pattern.md }
domain_path: platform
---

# The Complexity Contract

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

Hard limits on file size, function size, cognitive complexity, and cyclomatic complexity in CSPS. Plus the **ratchet pattern** that enforces these on new code without requiring upfront cleanup of existing code.

## Why this exists

Files and functions grow until they're unmaintainable. Without explicit limits, the moment never comes when "we should split this" is enforceable. With limits + a ratchet pattern, complexity stays bounded as the codebase grows.

## Why these specific numbers

From research: Anthropic Skills caps at <500 lines (AI context optimum); Linux kernel uses 24-48 lines per function; CodeClimate defaults to 25 method / 250 file (too aggressive — most teams raise); Google C++ suggests ~40 lines per function as a soft limit. The numbers below are the modern consensus calibrated for a TS+React+Next.js stack with AI tooling.

## Hard limits (CI block on changed code)

| Metric | Warn | Block | Tool | Why this number |
|---|---|---|---|---|
| File LOC | 400 | **500** | ESLint `max-lines` | Anthropic Skills cap; AI tool effectiveness optimum (200-400 ideal); modern consensus block at 500 |
| Function/component LOC | 60 | 80 | ESLint `max-lines-per-function` | Google ~40 (soft); Linux ~24-48; 80 is the reasonable hard ceiling before comprehension breaks |
| Cognitive complexity | 12 | **15** | `sonarjs/cognitive-complexity` | SonarQube default; superior to cyclomatic for human-facing gates (penalizes nesting+breaks) |
| Cyclomatic complexity | 15 | 20 | ESLint `complexity` | Modern enforced range; McCabe's original 10 is too tight for real-world code |
| Max params | 3 | 4 (then options object) | ESLint `max-params` | CodeClimate default; >4 params signals you should pass an options object |
| Max depth | 3 | 4 | ESLint `max-depth` | Deep nesting kills readability |
| Max nested callbacks | 2 | 3 | ESLint `max-nested-callbacks` | Async callback hell threshold |
| Slice total LOC | 2,000 | 2,500 → **mandatory split** | `validate-file-size.mjs` | Slices above this size must decompose to module-folder mini-tree |

## Soft limits (warn only)

- `index.<ext>` for a slice: warn at 120 LOC. *Why:* it's a manifest + re-exports; if larger, the slice has business logic in the wrong place.
- `context.md`: warn at 400 lines. *Why:* mirror Anthropic Skills' <500-line cap; if you can't summarise in 400 lines, the slice is too big.
- Single function: warn at 40 LOC. *Why:* Google's number; soft because some functions legitimately have lots of small steps.

## The ratchet pattern (the production trick)

**Don't try to fix existing files.** Three-tier enforcement:

| Tier | Mechanism | Scope | Mode | Why |
|---|---|---|---|---|
| Pre-commit (lefthook) | `lint-staged` runs ESLint on staged files only with `--max-warnings 0` | Changed lines | **Warn locally; commit allowed** | Fast feedback; doesn't block local work |
| CI / PR gate | `eslint --max-warnings 0` against changed files only | Changed files | **Block** (fail merge) | Hard ceiling on new code; old code grandfathered |
| Nightly hotspot | `git log --numstat` × ESLint complexity → top 20 hotspots posted to dashboard | Whole repo | **Visualize** (drives roadmap) | Shows architectural debt; doesn't block work |

*Why the ratchet:* trying to fix every existing file before enforcing rules means rules ship in 18 months instead of week 3. Stripe / Shopify / Linear all use a variant.

## Hotspot analysis (the architectural refactor signal)

`tools/hotspot-analysis/analyse.mjs` (weekly cron) computes `score = changes_in_last_90d × cognitive_complexity` per file. Top decile → hotspot list → posted to `/admin/audits/hotspots`.

*Why hotspots, not raw complexity:* Adam Tornhill's research (Your Code as a Crime Scene) showed ~1-2% of files account for ~70% of dev work. Optimising static-but-ugly files wastes effort; optimising hotspots delivers ROI.

## Generated files exemption

`.cataloggignore` lists files exempt from size/complexity/frontmatter rules:
- `**/.next/**`, `**/dist/**`, `**/node_modules/**`
- Prisma client output: `**/generated/**`
- ZenStack output: `**/.zenstack/**`
- ZModel files >800 LOC are exempt from file-size rule (RBAC encoding) but must split into multiple `.zmodel` files via Prisma's multi-file support if they cross 1500 LOC.

## When a slice exceeds limits

Per [module-folder-pattern.md](./module-folder-pattern.md), a slice that exceeds:
- Single file >500 LOC
- Slice total >2,500 LOC
- Cognitive complexity >15 anywhere
- `context.md` can no longer summarise in <400 lines

…must decompose into the module-folder mini-tree. The `nx g platform:split <slice>` generator does this mechanically.

## Reuse-first applied to complexity

When a function approaches the complexity threshold:

1. **Search existing utilities** for shared logic that could be extracted
2. **Enhance an existing utility** rather than creating a new local function
3. **Module-folder split** if the slice is genuinely doing too much
4. **Inline-and-redecide** (per the reuse-first counterweight clause) if existing abstractions are wrong

## What complexity does NOT mean

- High parameter count is allowed via options objects (the limit is on params, not on object fields)
- Deep `if/else` chains can be replaced with lookup tables (lower cognitive complexity, same logic)
- "Defensive programming" (lots of null checks) often signals missing types, not necessary complexity

## Sources

- Anthropic Skills — [<500 line cap](https://github.com/anthropics/skills)
- Linux kernel coding style — [function length](https://docs.kernel.org/process/coding-style.html)
- Google C++ Style Guide — [function-length recommendations](https://google.github.io/styleguide/cppguide.html#Function_Length)
- CodeClimate default analysis — [thresholds](https://docs.codeclimate.com/docs/default-analysis-configuration)
- Sonar — [Cognitive Complexity vs Cyclomatic Complexity](https://www.sonarsource.com/resources/cognitive-complexity/)
- Adam Tornhill — *Your Code as a Crime Scene* (hotspot analysis)
- [code-forensics](https://github.com/smontanari/code-forensics) (open-source hotspot tooling)
