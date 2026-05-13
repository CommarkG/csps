---
id: csps.pillar-1.tech-stack
name: tech-stack
description: The locked CSPS technology stack with rationale per pick. Each choice has been validated against the project's specific requirements (solo dev, 30–75 apps, multi-tenant, AI-native, extraction-ready). Where alternatives were seriously considered and rejected, this document names them.
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
  - cost
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ../pillar-0-governance/reuse-first-principle.md }
  - { rel: repo-layout, href: ./repo-layout.md }
domain_path: platform
core_spine: ARCH
schema_anchor: pillar_0_governance_leaves
---

# Tech Stack (locked)

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The technology stack for CSPS, with rationale per pick. Locking the stack early prevents architectural drift. Where alternatives were seriously considered and rejected, this section names them.

## The full stack

| Layer | Pick | Why this over alternatives |
|---|---|---|
| Workspace | **Nx + pnpm workspaces** | Nx's `@nx/enforce-module-boundaries` is the only tool with proven scale at 50+ projects + tag-based dependency rules. Turborepo can't host nested apps (4-level hierarchy errors). Bazel is overkill for a solo dev. Bit's component-driven model fights the slice-per-app design. |
| Runtime | **Next.js 15 App Router** | The dominant production framework with the best AI tooling integration (Cursor, v0, shadcn). Server Components let admin and customer surfaces share code. Alternatives: Remix (smaller ecosystem); SvelteKit (less AI tooling); separate Express API (loses RSC benefits). |
| Database | **Postgres (Supabase) + RLS + schema-per-app** | Postgres is the only DB with mature multi-schema, RLS, partitioning, and JSONB at the level we need. Supabase gives Auth/Storage/realtime as bonuses + Supavisor pooler. Alternatives: PlanetScale (no RLS, MySQL); Neon (also great — pick by founder familiarity); single-tenant DB-per-app (operational nightmare at 30+). |
| ORM + authz | **Prisma (multi-schema) + ZenStack** | Prisma is the dominant TS ORM with multi-schema support. ZenStack puts authz rules `@@allow` IN the schema itself — perfect for tier gating. Alternatives: Drizzle (no native authz); raw SQL + Cerbos (3 systems instead of 1); OpenFGA (overkill, no Notion-style sharing graphs needed). |
| Admin / CRUD | **Payload CMS 3.0 mounted in `apps/admin/`** | The only admin framework that lives INSIDE Next.js (single deployment) AND auto-generates full CRUD per collection. Alternatives: Directus (separate Vue app); Refine (more code per resource); Strapi (production content-type changes disabled); custom (3-6 months wasted). |
| Page templates | **`@csps/templates`** (the ONLY UI consumed by apps) | Custom internal package wrapping shadcn/Tremor primitives. Apps import only from this; raw shadcn imports forbidden by ESLint. Why: enforces template governance at the import layer. |
| Underlying primitives | shadcn/ui + shadcn Blocks + Tremor — wrapped, never imported directly | shadcn = 2026 default for React. Tremor (Vercel-acquired Jan 2025, MIT) for charts. Wrapped in `@csps/templates` so apps can't bypass governance. |
| Forms | react-hook-form + Zod (auto-generated from ZModel) | RHF is the dominant React form library. Zod schemas come free from ZenStack — single source of truth for validation. |
| Wizards | `react-use-wizard` runtime + wizard-as-data manifest | Headless hooks-based; well-maintained. The manifest pattern means devs declare wizards as data, never hand-roll bespoke flows. |
| Auth | **Clerk (with Organizations)** | Best DX in the auth space; Organizations gives multi-tenant primitives free; SAML/SCIM at Enterprise tier. Alternatives: Auth0 (more expensive, less DX); WorkOS (enterprise-only); Better Auth (newer, less mature). |
| Billing + entitlements | **Stripe Entitlements + reconciliation cron** | Stripe is the only payments processor with first-class Entitlements API. Reconciliation cron is non-negotiable — webhooks have 30-day retention + out-of-order delivery; without reconciliation you WILL drift (cashier-stripe issue #1201). |
| AI runtime | **Mastra** (agents + workflows + tools + memory) | TS-native, MCP-integrated, agent + workflow + tools + memory all in one. Alternatives: LangChain JS (Python ecosystem first-class, JS second-class); rolling your own (months of work for less); OpenAI Agents SDK (vendor-locked). |
| Sandbox | **Cloudflare Workers** (for `can_execute_code: true` skills + sandbox runner) | V8 isolate boundary + capability-bound bindings + `globalOutbound: null` for network denial. Used by AWS Lambda's underlying microVM model. Already wired via Cloudflare MCP. |
| Generators | Nx generators + Hygen templates | Nx generators compose with workspace tools; Hygen handles file templating + line-level injection. Plop is too lightweight for monorepos; Yeoman is heavy. |
| Audits — code | ESLint + Vale + Squawk + Atlas + OpenSSF Scorecard + SonarJS (cognitive complexity) | Each catches what the others miss. ESLint = identifiers; Vale = prose; Squawk = SQL migrations; Atlas = schema drift; OpenSSF = supply-chain; SonarJS = cognitive complexity (better than cyclomatic for human-facing gates). |
| Audits — runtime | Playwright (in-repo + Checkly) + AI smoke agent (weekly) | Same Playwright tests run in CI AND production probes. AI smoke agent ($1/run weekly) catches end-to-end UX rot a deterministic test won't. |
| Storybook | Storybook + Chromatic visual regression | Every template has a story; visual diff blocks merge. Storybook becomes the canonical template gallery — if it's not in Storybook, it doesn't exist. |
| Catalog | `packages/catalog` — frontmatter parser + Postgres index + MCP resource server | Custom; nothing off-the-shelf does what we need (file-based + multi-dimensional + AI-retrievable). |
| Principles | `packages/principles` — single source of truth + codegen pipeline | The mechanical-enforcement spine (per [pillar 0 / mechanical-enforcement.md](../pillar-0-governance/mechanical-enforcement.md)). Generates AGENTS.md, hooks, skills, MCP resources, audit checks. |
| Cross-vendor wire | `packages/principles-mcp` — MCP server | The Model Context Protocol (MCP) is the only standard every relevant AI vendor consumes (Linux Foundation standardized Dec 2025). Hosting our principles + catalog as MCP resources means Claude Code, Cursor, Mastra agents, hosted-app agents all see the same registry. |
| Hotspot analysis | `git log --numstat` × ESLint complexity → weekly digest | Adam Tornhill's research: ~1-2% of files account for ~70% of dev work. Hotspots are the only refactor priorities worth tracking. |
| Pre-commit hooks | Lefthook (or Husky for pure-JS) | Lefthook is Go-based, parallel, polyglot-friendly — the 2026 pick over Husky for monorepos. |
| PR-level checks | Danger.js | JS/TS-native PR rules. Catches "PR too big," "missing PCR for arch-touching change," "no `enhances:` field." |
| Numbered decisions | `docs/adr/NNNN-*.md` (MADR template) | The plan captures current state; ADRs capture why decisions changed. Standard architecture practice. |

## Why these picks survive 30–75 apps

The stack is designed to handle scale via:

- **Nx workspaces + pnpm** — proven at 100+ projects (Spotify, Vercel internal usage)
- **Postgres schema-per-app** — extraction-ready by design (per [pillar 2 / app-schema-contract.md](../pillar-2-data-and-schema/app-schema-contract.md))
- **Mastra Dynamic Agents** — one parameterized agent serves N personas (no agent-instance explosion)
- **Page templates** — 22 templates serve 30+ apps (no per-app template invention)
- **Catalog + MCP** — same registry queried by all apps, all agents, all sessions

## Picks that look reasonable but were rejected

- **Turborepo** — can't host nested app directories (4-level hierarchy errors); doesn't have `enforce-module-boundaries` equivalent
- **Bazel** — overkill for solo dev; configuration cost dominates
- **Drizzle ORM** — no native authz layer; would need Cerbos/OpenFGA bolted on (3 systems instead of 1)
- **Auth0** — more expensive; weaker DX than Clerk
- **LangChain JS** — Python is first-class, JS is second-class; Mastra is purpose-built for TS
- **Backstage** — overkill for solo dev; needs a dedicated team to operate
- **OpenFGA / Cerbos as primary authz** — overkill until Notion-style sharing graphs are needed
- **Custom CRUD admin** — 3–6 months wasted vs Payload (auto-generated per collection)

## When to revisit

- **Drizzle + Cerbos** — if ZenStack doesn't keep pace with Prisma upgrades, revisit
- **OpenFGA** — if/when sharing graphs (Notion-style) become a real product requirement
- **Backstage** — if/when team grows past solo and a real developer portal is needed
- **GraphRAG** — if/when catalog corpus exceeds ~10k files (per [planning-playground.md](../pillar-0-governance/planning-playground.md) staircase)

## Reuse-first applied to the stack

Before adding a new tool to the stack:

1. **Check what's already in the stack table.** Could it be done with an existing tool?
2. **Search for an existing CSPS package** that wraps similar functionality.
3. **If genuinely new**, write an ADR explaining why no existing tool covers the need.

The stack should grow by **deprecation + replacement**, not by accumulation.

## Sources

- [Nx documentation](https://nx.dev/docs/intro)
- [Next.js 15 App Router](https://nextjs.org/docs/app)
- [Supabase Postgres](https://supabase.com/docs/guides/database)
- [ZenStack documentation](https://zenstack.dev/)
- [Payload CMS 3.0](https://payloadcms.com/docs)
- [Mastra documentation](https://mastra.ai/docs)
- [Cloudflare Workers security model](https://developers.cloudflare.com/workers/reference/security-model/)
- [Stripe Entitlements](https://docs.stripe.com/billing/entitlements)
- [Clerk Organizations](https://clerk.com/docs/organizations/overview)
