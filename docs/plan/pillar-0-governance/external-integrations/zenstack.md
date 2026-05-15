---
id: csps.external-integrations.zenstack
name: zenstack-integration-knowledge
description: >
  ZenStack integration knowledge — schema generation, enhance path fix,
  multi-tenant isolation, and monorepo patterns for CSPS.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: external_integrations
diataxis_type: reference
session: S028
last_verified: 2026-05-13
next_review: 2026-08-13
content_hash: S028-gate3-zenstack
breaking_changes: https://zenstack.dev/changelog
credential_location: N/A (no credentials)
tags:
  - domain:infra
  - type:reference
  - audience:ai-agent
  - maturity:stable
scope_level: S1
---

# ZenStack Integration Knowledge — CSPS

> **MANDATORY READ** before any ZenStack schema changes, policy updates,
> or enhance() usage.

## Architecture in CSPS

```
libs/policies/schema.zmodel     ← SSoT (single source of truth)
    ↓ zenstack generate
libs/policies/generated/
    ├── schema.prisma            ← generated Prisma schema (gitignored)
    └── ...
node_modules/.zenstack/          ← enhance files (generated)
    ↓ tools/copy-zenstack-output.mjs
node_modules/@zenstackhq/runtime/.zenstack/  ← where enhance.js looks
```

## Critical Rules

### R1: Prisma generator must NOT have custom output
```zmodel
// WRONG — breaks @prisma/client types for all apps
generator client {
  provider = "prisma-client-js"
  output   = "./generated/client"   ← REMOVE THIS LINE
}

// CORRECT — types go to default location @prisma/client can find
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}
```
Custom output causes all `@prisma/client` imports to get untyped stubs.
Root cause of ALL TypeScript implicit-any errors in budget-planner (S028).

### R2: ZenStack enhance path requires a copy script
ZenStack generates enhance files to `node_modules/.zenstack/` but the
`@zenstackhq/runtime/enhance.js` looks in `@zenstackhq/runtime/.zenstack/`.
Fix: `tools/copy-zenstack-output.mjs` copies the files at postinstall.
This is already wired in root `package.json` postinstall. Do NOT remove it.

### R3: enhance() requires `as any` cast for PrismaClient
```typescript
// libs/integrations/zenstack.ts
export function getEnhancedDb(user: ZenstackUserCtx) {
  return enhance(db as any, { user }) as typeof db
}
```
ZenStack's enhance() type signature doesn't perfectly match PrismaClient.
The `as any` + `as typeof db` pattern is correct and required.

### R4: Run zenstack generate from repo root only
```bash
pnpm exec zenstack generate --schema libs/policies/schema.zmodel
```
Never from a subdirectory. ZenStack's plugin paths are relative to where
it runs. Running from a subdirectory produces wrong output paths.

### R5: multiSchema preview feature required
```zmodel
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}

datasource db {
  schemas = ["public"]
}
```
Remove `multiSchema` only when it graduates from preview (track in changelog).

### R6: @@allow policies enforce multi-tenant isolation at query level
ZenStack policies on models filter ALL queries automatically. Example:
```zmodel
model BudgetCategory {
  @@allow('all', auth().tenantId == tenantId)
}
```
The `getEnhancedDb(user)` call applies these policies. Raw `db` (unenhanced)
bypasses all policies — only use raw `db` for admin operations or migrations.

### R7: Webpack sees .zenstack/enhance as missing module (warning only)
`Module not found: Can't resolve '.zenstack/enhance'` appears as a webpack
WARNING (not error) during Next.js build. This is static analysis only.
At runtime, the copy script has placed the files correctly. Safe to ignore.
Suppress with: `config.ignoreWarnings = [{ module: /enhance\.js/ }]`

## Postinstall Script (verified S028)

Root `package.json`:
```json
"postinstall": "zenstack generate --schema libs/policies/schema.zmodel && node tools/copy-zenstack-output.mjs"
```

This runs on every `pnpm install` in Vercel builds and generates:
1. Prisma schema from ZModel
2. ZenStack enhance files
3. Copies enhance files to runtime location

## Schema Location

```
libs/policies/schema.zmodel      ← EDIT THIS (source of truth)
libs/policies/generated/         ← GITIGNORED (regenerated at build)
```

Never edit generated files. Always edit `schema.zmodel`.

## Deployment Checklist

- [ ] `schema.zmodel` generator has NO custom `output`
- [ ] Root `package.json` postinstall runs `zenstack generate` + copy script
- [ ] `tools/copy-zenstack-output.mjs` exists and is executable
- [ ] `enhance()` calls use `as any` cast
- [ ] Webpack ignoreWarnings suppresses the enhance.js warning
- [ ] ZenStack webpack warning appears as ⚠ not ✗ in build output

## Changelog

| Date | Session | Finding |
|---|---|---|
| 2026-05-13 | S028 | Custom output root cause discovered (R1). All rules documented. |
