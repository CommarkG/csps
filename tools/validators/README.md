---
id: csps.tools.validators
name: validators
description: Build-time validators that run pre-PR. Each one is dependency-free Node ESM (skeleton tier; week-4 audit-runner ships full versions). Currently houses validate-frontmatter.mjs (PR-blocking; per pillar-1/frontmatter-standard.md). Future additions per audit-runner.md registry — see Catalog category audits.
version: 0.1.0
owner: group:finky
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
tags:
  - domain:dx
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
links:
  - { rel: parent, href: ../README.md }
  - { rel: frontmatter-standard, href: ../../docs/plan/pillar-1-architecture-and-stack/frontmatter-standard.md }
  - { rel: audit-runner, href: ../../docs/plan/pillar-0-governance/audit-runner.md }
created-new-because: |
  No prior tools/validators directory existed. Per build-order.md week 1 + AGENTS.md hard NO #11
  (saved-without-lifecycle_state = orphan-in-waiting), a PR-blocking frontmatter validator is week-1
  scope. This is the placeholder root.
---

# Validators

Build-time validators run via `pnpm lint:*` scripts. Each is dependency-free Node ESM (skeleton tier).

## Available

| Script | Purpose | PR-blocking | Cadence |
|---|---|---|---|
| [`validate-frontmatter.mjs`](./validate-frontmatter.mjs) | Frontmatter schema validator per [frontmatter-standard.md](../../docs/plan/pillar-1-architecture-and-stack/frontmatter-standard.md) | yes (errors fail CI) | PR + on-demand |

## Usage

```bash
pnpm lint:frontmatter            # default: errors fail; warnings reported
pnpm lint:frontmatter --strict   # warnings also fail
pnpm lint:frontmatter --verbose  # show exempt-file list
```

## Scope

Scans `.md` files in: `docs/`, `packages/`, `libs/`, `apps/`, `tools/`.

Skips: `node_modules/`, `.git/`, `.claude/`, `dist/`, `build/`, `.next/`, `tmp/`, `coverage/`.

Exempt (snapshot/historical — frozen point-in-time records): `_handoff/VAULT/chat-jump-prompt-*` / `qc-audit-results-*` / `validation-pass-*` / `gaps-and-duplications-*` / `blockers-*` / `_legacy/*`.

## Skeleton-tier vs production

Current implementation is **dependency-free shallow-YAML parser** sufficient for typical CSPS frontmatter shapes. Edge cases (deeply nested objects, multi-line scalars beyond 1-level, quoted strings with escape sequences) are best-effort.

**Week-2 codegen pipeline** (per [build-order.md](../../docs/plan/pillar-6-operations-and-delivery/build-order.md) week 2) replaces this with [`zod`](https://zod.dev) + [`gray-matter`](https://github.com/jonschlinkert/gray-matter) + the full Astro Content Collections pattern. The skeleton's API surface (`pnpm lint:frontmatter` + `--strict` + `--verbose` flags) stays compatible.

## Soft-mode for week-1

The validator currently soft-checks the reuse-first contract (`enhances:` OR `created-new-because:`) — commented out. This is intentional: the existing ~150 markdown files don't all carry these fields yet, and a PR-blocking guard would prevent any work from merging.

The hard-check ratchets in week-4 alongside the audit-runner ship, after a one-time bulk backfill pass on existing artifacts.
