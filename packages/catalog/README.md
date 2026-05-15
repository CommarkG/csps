---
id: csps.packages.catalog
name: catalog
description: File metadata + tags + bundles registry. Scans workspace at build time, extracts frontmatter from every artifact (.md/.ts/.zmodel), emits catalog.json indexed by id + tags + dimensions. Queried by generators (catalog-first UX per P-OP-001 reuse-first) and by MCP resources for cross-vendor agents.
version: 0.0.1
owner: group:finky
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
links:
  - { rel: parent, href: ../README.md }
  - { rel: spec, href: ../../docs/plan/pillar-3-platform-services/catalog-bundle-system.md }
  - { rel: dimensions, href: ../../docs/plan/pillar-1-architecture-and-stack/frontmatter-standard.md }
created-new-because: |
  Per P-OP-001 reuse-first: catalog-first generator UX requires a queryable index. catalog.json
  is the build-time output. Skeleton tier seeds an empty entries array; week-3 wires the scanner.
scope_level: S1
---

# @csps/catalog

Build-time index of every CSPS artifact. Queried by generators + MCP resources.

## Skeleton tier

`catalog.json` initialized empty. Week-3 ships:
- `pnpm catalog:scan` — walks workspace, parses frontmatter, emits entries
- `pnpm catalog:search "<terms>"` — MCP-aware search across entries
- `catalog-coverage` audit (already registered in audit-runner.md) — fails CI if leaf-level artifacts lack catalog entry
