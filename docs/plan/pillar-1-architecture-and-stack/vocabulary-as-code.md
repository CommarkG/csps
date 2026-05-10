---
id: csps.pillar-1.vocabulary-as-code
name: vocabulary-as-code
description: The codegen pipeline that turns the glossary (single source) into Vale dict + ESLint rules + Payload options + ZModel @@meta + human reference. Vocabulary that lives in code and regenerates everywhere downstream survives drift; vocabulary in a README rots.
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
  - { rel: principles-codegen, href: ../pillar-0-governance/mechanical-enforcement.md }
domain_path: platform
---

# Vocabulary-as-Code (the enforcement spine)

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The codegen pipeline that makes the glossary mechanically enforced everywhere downstream. Vocabulary in a README rots within a quarter. Vocabulary in code, regenerated to every layer that touches words, holds.

This is the same pattern Stripe (API design discipline), Notion (data catalog), and Shopify (Packwerk) all converged on. It's also the same pattern as `packages/principles/principles.yaml` (per [mechanical-enforcement.md](../pillar-0-governance/mechanical-enforcement.md)) — both rest on the "single source → codegen → multi-layer enforcement" idea.

## Why this exists

The failure mode without this: terms drift across docs/code/UI/schema within a quarter. By month 18 you have three names for the same concept and search returns nothing.

## Single source

`packages/glossary/src/terms.ts`

```ts
export const GLOSSARY = {
  skill: {
    canonical: "Skill",
    plural: "Skills",
    forbidden: ["plugin", "extension", "addon", "capability", "ability"],
    definition: "Named markdown instruction package following agentskills.io spec.",
    owner: "finky",
  },
  agent: {
    canonical: "Agent",
    plural: "Agents",
    forbidden: ["assistant", "GPT", "bot", "crew member"],
    definition: "Configured persona = identity + system prompt + toolset + memory.",
    owner: "finky",
  },
  // ... one entry per glossary term (see vocabulary.md for full list)
} as const;

export type GlossaryKey = keyof typeof GLOSSARY;
```

*Why TypeScript and not JSON/YAML:* compile-time exhaustiveness checks. A new term added without registering in the type system fails the build. JSON/YAML wouldn't catch it.

## Codegen pipeline (`pnpm glossary:codegen`)

Glossary → downstream artifacts in one pass. Same shape as the principles codegen (`pnpm principles:codegen`).

| Downstream artifact | Generated from glossary | Why |
|---|---|---|
| `.vale/styles/CSPS/accept.txt` | All canonical forms + plurals | Vale lints prose against this list |
| `.vale/styles/CSPS/reject.txt` | All forbidden synonyms with substitution targets | Vale flags synonyms with the right replacement |
| `eslint-config-csps/forbidden-identifiers.js` | ESLint `id-denylist` of forbidden synonyms | Code identifiers can't use banned terms |
| `apps/admin/payload/glossary-options.ts` | Dropdown options for Payload select fields | Admin UI only offers canonical terms |
| `libs/policies/glossary.zmodel` | ZModel `@@meta` annotations referencing canonical terms | Schema docs use canonical terms |
| `docs/glossary.md` | Human-readable index (auto-rendered) | Onboarding doc, always in sync |

## CI gate

`audit-glossary-fresh` (PR-blocking): regenerate every downstream artifact in CI. If `git diff` is non-empty, fail.

*Why:* the only thing that prevents drift between glossary and downstream is a build-breaking error. Goodwill doesn't.

## Renames

When a term changes, ship a `jscodeshift` or `ts-morph` codemod alongside the glossary PR.

*Why AST-aware:* identifier renames must not false-positive on string literals. The codemod walks the syntax tree and renames only what should be renamed. The v1.5 vocabulary audit (8 renames including "Manifested slice" → "Module folder pattern") produced exactly this kind of codemod.

## Owner per term

Every entry has an `owner` field. Term changes require sign-off from owner.

*Why:* without ownership, terms decay. Stripe's API design discipline works because someone owns the answer.

## Relationship to `principles.yaml`

The glossary and the principles registry are **two separate single-source-of-truth files** with the same codegen pattern:

| File | Source for | Generates |
|---|---|---|
| `packages/glossary/src/terms.ts` | Vocabulary | Vale dict, ESLint id-denylist, Payload options, ZModel @@meta |
| `packages/principles/principles.yaml` | Principles | AGENTS.md sections, hooks, skills, MCP resources, audit checks |

They're separate because the change cadences differ (vocabulary is rare; principles evolve more) and the consuming layers differ. They share the **codegen-from-source pattern** but are independent files.

## Variants pattern (cascading defaults)

A separate concern but same enforcement spine: `tools/catalog/variants.ts` declares cascading default frontmatter by glob (Bit pattern). See [frontmatter-standard.md](./frontmatter-standard.md) for the variants details.

## Anti-patterns this prevents

- **Naked synonyms in code** — caught by ESLint
- **Naked synonyms in prose** — caught by Vale
- **Inconsistent admin UI** — Payload options auto-generated
- **ZModel docs disagree with code** — `@@meta` auto-generated
- **Drift between glossary and downstream** — CI fails on regen mismatch

## Sources

- Stripe — [API versioning + design culture](https://stripe.com/blog/api-versioning)
- Shopify — [Packwerk for bounded contexts](https://shopify.engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity)
- Notion — [Data catalog history](https://www.notion.com/blog/a-brief-history-of-notions-data-catalog)
- [Vale documentation](https://vale.sh/)
- [ts-morph guide](https://kimmo.blog/posts/8-ast-based-refactoring-with-ts-morph/) (AST-driven renames)
