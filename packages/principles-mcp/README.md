---
id: csps.packages.principles-mcp
name: principles-mcp
description: MCP server exposing principles.yaml as queryable resources + tools for cross-vendor agent inheritance. Reads principles.yaml at boot. Resources: principles://<id> for each entry + aliased shortcuts (reuse-first / pcr / fwws / batched-execution / defense-in-depth / stewardship / learning-loop / zero-findings / five-surface-engraving). Tools: check_reuse + list_principles_by_category. Per P-META-002 (principles travel with artifacts) + P-META-003 (inheritance via shared runtime). Vendored into graduated apps so they descend provably from CSPS.
version: 0.0.1
owner: group:finky
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
tags:
  - domain:governance
  - type:agent
  - audience:ai-agent
  - audience:developer
  - maturity:draft
crosscutting:
  - reliability
  - observability
  - ai-native
links:
  - { rel: parent, href: ../README.md }
  - { rel: principles, href: ../principles/principles.yaml }
  - { rel: spec, href: ../../docs/plan/pillar-0-governance/mechanical-enforcement.md }
created-new-because: |
  No prior MCP server exists in the workspace. Per P-META-002 + P-META-003 + build-order.md week 1
  ("packages/principles-mcp/ skeleton"), this is the canonical inheritance bridge — vendored into
  every graduated app per graduation-pipeline.md. Distinct from packages/principles (which is the
  single-source-of-truth for principle definitions); this server EXPOSES that source.
---

# @csps/principles-mcp

> MCP server: read-only access to CSPS's principle registry for any cross-vendor agent (Claude Code, Cursor, Codex, Gemini CLI, etc.).

## What this is

The Linux Foundation MCP-standard wire protocol gives every supporting AI agent the same access to CSPS principles, regardless of which vendor's runtime they're inside. This server is the canonical bridge.

## Skeleton tier

Currently dependency-declared but not built. Run `pnpm install && pnpm build` from the workspace root to compile. Production hardening lands in week-2 (codegen integration) + week-4 (audit-runner integration).

## Resources

| URI | What |
|---|---|
| `principles://P-OP-001` ... `principles://P-META-007` | Direct lookup by ID; returns full principle JSON |
| `principles://reuse-first` | Alias → `P-OP-001` |
| `principles://fwws` | Alias → `P-OP-002` |
| `principles://pcr` | Alias → `P-OP-003` |
| `principles://batched-execution` | Alias → `P-OP-004` |
| `principles://defense-in-depth` | Alias → `P-META-001` |
| `principles://stewardship` | Alias → `P-META-004` |
| `principles://learning-loop` | Alias → `P-META-005` |
| `principles://zero-findings` | Alias → `P-META-006` |
| `principles://five-surface-engraving` | Alias → `P-META-007` |

## Tools

| Name | What |
|---|---|
| `check_reuse` | Given a description of proposed work, returns top-5 matching principles (keyword scorer; replaced by semantic search week-2+) |
| `list_principles_by_category` | List principles by category: `operating` / `architecture` / `meta` |

## Configuration

Each MCP-aware agent points to this server in its config:

**Claude Code** (`~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "csps-principles": {
      "command": "node",
      "args": ["./packages/principles-mcp/dist/index.js"]
    }
  }
}
```

**Cursor** (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "csps-principles": {
      "command": "node",
      "args": ["./packages/principles-mcp/dist/index.js"]
    }
  }
}
```

## Graduation vendoring

Per [graduation-pipeline.md](../../docs/plan/pillar-6-operations-and-delivery/graduation-pipeline.md), every graduated app vendors a copy of this package + the `principles.yaml` snapshot at graduation time + an `audit-runner` snapshot. This ensures the graduate descends provably from CSPS (P-META-002).

## Build

```bash
pnpm install         # workspace root
pnpm --filter @csps/principles-mcp build
pnpm --filter @csps/principles-mcp start
```
