---
id: csps.integrations.security.index
name: security-module-index
description: Mini-tree intro for libs/integrations/security/. Platform security module — headers, validation, audit, guards, rate-limiting, resilience.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: external_integrations
diataxis_type: reference
session: S032
impl_status: swift-implemented
mini_tree_root: true
sub_files:
  - ./headers.ts
  - ./validation.ts
  - ./audit.ts
  - ./guards.ts
  - ./rate-limit.ts
  - ./resilience.ts
links:
  - { rel: parent, href: ../index.ts }
tags:
  - domain:infra
  - type:reference
  - audience:ai-agent
  - maturity:stable
---

# Security Module — libs/integrations/security/

Platform security primitives. Import in any CSPS app.

| File | Purpose |
|---|---|
| [headers.ts](./headers.ts) | `securityHeaders()` — Next.js security headers (CSP, HSTS, etc.) |
| [validation.ts](./validation.ts) | Zod schemas: PaginationSchema, IdSchema, TenantScopeSchema, DateRangeSchema |
| [audit.ts](./audit.ts) | `auditLog(db, event)` — write to AuditEvent model |
| [guards.ts](./guards.ts) | `checkMembership()`, `requiresTier()`, `withSecurity()` HOC |
| [rate-limit.ts](./rate-limit.ts) | `rateLimitUser()` (100/min), `rateLimitAuth()` (20/15min) via Upstash |
| [resilience.ts](./resilience.ts) | `withFallback()` circuit breaker, `withRetry()` exponential backoff |

**Env vars required for rate limiting:** `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
