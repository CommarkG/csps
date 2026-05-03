---
id: csps.adr.0001-pick-csps-stack
title: ADR-0001 — Pick the CSPS stack (Nx + Next.js + Supabase Postgres + Prisma + ZenStack + Payload + Mastra + Cloudflare Workers + shadcn + Tremor + Clerk + Stripe)
status: accepted
date: 2026-05-02
deciders: group:finky
consulted: solo-dev (Finky)
informed: future-CSPS-developers, AI-assistants
tags:
  - domain:architecture
  - type:explanation
  - audience:developer
  - audience:ai-agent
  - maturity:stable
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/pillar-1-architecture-and-stack/tech-stack.md }
  - { rel: registry, href: ../../packages/principles/principles.yaml }
---

# ADR-0001 — Pick the CSPS stack

## Context and problem statement

CSPS is a multi-tenant SaaS app foundry that hosts 30–75 apps. A solo developer needs a stack that:
1. Scales to dozens of apps without 30× operational tax
2. Allows clean per-app graduation (extraction-readiness)
3. Enforces architectural rules mechanically (audits, generators, type checks)
4. Has strong AI-assistant integration (frontmatter, MCP, skills)
5. Is buildable solo

## Considered options

| Option | Pro | Con |
|---|---|---|
| Monorepo with Nx + per-app Postgres schema | Single repo, easy refactor; clean extraction via schema-per-app | Nx learning curve |
| Polyrepo (one repo per app) | Maximum isolation | ~30× operational tax (CI/CD, deploys, deps) — kills solo viability |
| Monolith (one app, virtual tenants) | Simplest start | Can never extract cleanly; tenant-coupling debt |

## Decision outcome

**Chosen:** Monorepo with Nx + pnpm; Next.js 15 App Router; Supabase Postgres + RLS + schema-per-app; Prisma multi-schema + ZenStack; Payload CMS 3.0 mounted in Next.js; shadcn/ui + Tremor (wrapped in `@csps/templates`); Clerk Organizations; Stripe Entitlements; Mastra (AI runtime); Cloudflare Workers (sandbox runner); Hygen + Nx generators for scaffolding.

**Reasoning:** This is the only combination where (a) a solo dev can scale to 30+ apps, (b) extraction is a 2–3 day operation not 2–3 month surgery, (c) AI assistants natively understand the stack via published conventions (Anthropic Skills, MCP, agents.md). The schema-per-app pattern is the load-bearing extraction enabler.

## Consequences

- All apps share the kernel (`public` schema, `@csps/templates`, Mastra `BaseAgent`, audit-runner package).
- Each app's domain entities live in `app_<slug>` Postgres schema, isolated via fully-qualified table names (no `search_path`).
- Extraction means: vendor `principles.yaml` + audit-runner + MCP, copy `app_<slug>` schema to new repo, swap kernel imports for vendored copies.
- Stack changes require ADRs (e.g., swapping Clerk for another auth provider supersedes this ADR with a new one).

## Enforcement

This decision is enforced by:
- `principles.yaml#P-ARCH-018` (schema-per-app, severity: critical, ≥3 enforcers)
- `principles.yaml#P-ARCH-017` (template-first reuse-first)
- `validate-frontmatter.mjs` (artifacts declare correct schema/template usage)
- `nx tag-rule` (module boundaries enforced)

## Open questions

- See `docs/plan/_handoff/VAULT/open-questions-ledger.md` for tracked items related to extraction-readiness vs reuse-first conflict (OQ-RF-001).

## Sources / references

- [pillar-1/tech-stack.md](../plan/pillar-1-architecture-and-stack/tech-stack.md) — full stack table
- [Nx documentation](https://nx.dev/)
- [ZenStack](https://zenstack.dev/)
- [Mastra](https://mastra.ai/)
- [Anthropic Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
