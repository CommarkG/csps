---
id: csps.adr.0004-template-only-page-creation
title: ADR-0004 — Template-only page creation (the 22-template catalog + 4-layer enforcement)
status: accepted
date: 2026-05-02
deciders: group:finky
consulted: solo-dev (Finky)
informed: future-CSPS-developers, AI-assistants
tags:
  - domain:dx
  - type:explanation
  - audience:developer
  - audience:ai-agent
  - maturity:stable
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/pillar-3-platform-services/template-governance.md }
  - { rel: registry, href: ../../packages/principles/principles.yaml }
---

# ADR-0004 — Template-only page creation

## Context and problem statement

A solo dev cannot maintain 30 apps × N bespoke pages × Y design tweaks. Without page-template governance, every app drifts visually + structurally; refactoring layouts requires touching every app individually. AI assistants (Claude / Cursor / Codex) will gladly hand-write `page.tsx` files that bypass design discipline if not structurally blocked.

## Considered options

| Option | Pro | Con |
|---|---|---|
| Free-form pages, manual review | Maximum flexibility | Drift inevitable; review fatigue; AI generates non-conforming code |
| **Template-only** (22 registered templates in `@csps/templates`) | Mechanical enforcement; AI is funneled to template generator | Adds template-design overhead upfront |
| One mega-template with conditional rendering | Single component | Becomes Frankenstein; "wrong-abstraction lock-in" |

## Decision outcome

**Chosen:** Template-only. Every page composes from a registered template in `packages/templates/`. The `nx g platform:page --template=<id> --slice=<name>` generator refuses unknown templates. Bespoke pages require a template-request PR before merge — no off-template pages.

**Reasoning:** This is the load-bearing mechanism that makes a solo dev viable across 30 apps. The 22 templates cover every customer-facing page pattern; the catalog is curated; new templates require justification.

## Consequences

- 4-layer enforcement:
  1. `no-restricted-imports` ESLint rule blocks `@radix-ui/*`, `@tremor/react`, `@csps/ui/*` outside `@csps/templates`
  2. Slice contract check #12 — `validate-template-usage.mjs` verifies every page imports from `@csps/templates`
  3. Storybook + Chromatic — visual regression on every PR
  4. `platform:page` generator — refuses unknown templates
- AI discipline: `CATALOG.md` is loaded as a Claude Skill; PreToolUse hook intercepts Write attempts to `**/page.tsx` outside the generator path.

## Enforcement

- `principles.yaml#P-ARCH-017` (severity: critical; ≥4 enforcers)
- `audit-runner.md#page-template-coverage`
- `audit-runner.md#storybook-coverage`
- `eslint.config.ts` (no-restricted-imports)
- Generator: `tools/generators/page/index.ts`

## Open questions

- When does an app legitimately need a new template? Heuristic: when the page pattern repeats across ≥2 apps and existing templates can't compose. ADR required for any new template.

## Sources / references

- [pillar-3/template-governance.md](../plan/pillar-3-platform-services/template-governance.md)
- [Backstage Software Templates](https://backstage.io/docs/features/software-templates/)
- [Spotify Golden Paths](https://backstage.io/discover/golden-paths/)
