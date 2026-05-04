---
id: csps.packages.principles
name: principles
description: Single source of truth for CSPS principles (P-OP-* operating + P-ARCH-* architecture + P-META-* meta). Hosts principles.yaml (the registry) + codegen.ts (the pipeline that emits AGENTS.md / hooks / skills / MCP resources / audit checks). Per P-META-003 codegen-source-of-truth.
version: 0.0.1
owner: group:finky
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
tags:
  - domain:governance
  - type:util
  - audience:developer
  - audience:ai-agent
  - maturity:draft
crosscutting:
  - reliability
  - observability
links:
  - { rel: parent, href: ../README.md }
  - { rel: registry, href: ./principles.yaml }
  - { rel: spec, href: ../../docs/plan/pillar-0-governance/mechanical-enforcement.md }
  - { rel: mcp-server, href: ../principles-mcp/README.md }
created-new-because: |
  Principles registry must live in code (per P-META-003 codegen-source-of-truth) so all
  downstream artifacts (AGENTS.md / hooks / skills / MCP resources / audit checks) regenerate
  deterministically from one file. principles.yaml is the file; codegen.ts is the pipeline.
---

# @csps/principles

Single source of truth for CSPS principles. The registry is `principles.yaml`; the pipeline is `codegen.ts`.

## Run

```bash
pnpm --filter @csps/principles validate    # validate only (fail-fast on under-enforcement)
pnpm --filter @csps/principles codegen     # validate + emit manifest.json (full codegen week-2+)
pnpm --filter @csps/principles codegen --check  # would diff committed (week-2 ratchet)
```

Or from workspace root:

```bash
pnpm principles:codegen
```

## What `validate()` enforces

- Every principle has ≥ N enforcers per severity (per `severity_enforcer_minimums`):
  - `critical`: ≥4 enforcers, ≥2 non-AI
  - `error`: ≥3 enforcers, ≥1 non-AI
  - `warn`: ≥2 enforcers
  - `info`: ≥1 enforcer
- Every enforcer's `layer` is in the closed enum `enforcer_layers`
- Every `cross_references` entry resolves to a real principle ID

Stubs (`status: stub`) are exempt during migration.

## What `codegenManifest()` emits

`dist/manifest.json` — always-on skeleton output:
- `counts`: total + per-category (operating / architecture / meta)
- `ids_by_category`: full ID list per category
- `enforcer_count_by_principle`: enforcer count per principle ID

Used by:
- `principle-count-staleness` audit (per ADR-0022) — compares yaml row count to any stale prose count
- `principle-coverage` audit (P-META-001) — checks enforcer minimums
- The graduation pipeline — vendors the manifest snapshot

## TODO (week-2/4)

Per build-order.md week 2 + week 4, the seven `codegen*()` stubs ship full implementations:
- `codegenAgentsMd()` — emits AGENTS.md sections between `<!-- PRINCIPLES:BEGIN -->` / `<!-- PRINCIPLES:END -->` markers
- `codegenValeStyles()` — emits `.vale/styles/CSPS/principles.txt` for prose linting
- `codegenEslintRules()` — emits ESLint plugin rule stubs
- `codegenHooks()` — emits `.claude/hooks/*.sh` stubs
- `codegenSkills()` — refreshes `packages/skills/<name>/SKILL.md` frontmatter
- `codegenMcpResources()` — emits `packages/principles-mcp/src/resources.generated.ts`
- `codegenAuditChecks()` — emits `libs/audits/checks/registered-checks.generated.ts`

Each codegen step composes with `principles-codegen-fresh` audit (PR-blocking, error severity) — CI fails on any drift between source and generated artifacts.
