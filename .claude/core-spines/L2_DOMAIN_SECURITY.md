---
id: csps.core-spines.l2-domain-security
name: L2_DOMAIN_SECURITY
description: >
  Security spine domain — 9-layer request flow, CSPS security vocabulary,
  5 mandatory surfaces, connectivity security rules. Operational L2 beneath
  L1_CORE_ARCH.md. Governs all security decisions across 30 apps.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
amendment_protocol: normal review (PCR + amendment)
template_used: l2-domain-doctrine
template_status: standard
core_spine: ARCH
schema_anchor: core_spines_l2_domain
parent_l1_doctrine: ./L1_CORE_ARCH.md
domain: SECURITY
scope_level: S1
tags:
  - domain:architecture
  - domain:governance
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
diataxis_type: reference
session: S032
links:
  - { rel: parent-l1, href: ./L1_CORE_ARCH.md }
  - { rel: security-module, href: ../../../libs/integrations/security/README.md }
  - { rel: moat-registry, href: ../../../docs/plan/pillar-0-governance/moat-registry.md }
---

# L2_DOMAIN_SECURITY

Operational decomposition of the ARCH spine — security domain. Governs how all 30
CSPS apps handle authentication, authorization, rate limiting, validation, and audit.

## What this domain governs

Security in CSPS is **platform-first**: every security primitive lives in
`libs/integrations/security/` and is inherited by all apps. No app reinvents auth,
rate limiting, or audit logging independently.

---

## §1 — The 9-Layer Security Request Flow

Every CSPS API request passes through these layers in order:

```
Request
  ↓
1. MIDDLEWARE (middleware.ts)
   Clerk auth check. Non-public routes → auth().protect()
   Public routes: /sign-in, /sign-up, /account-setup, /api/auth/session-ready, /api/webhooks
  ↓
2. SECURITY HEADERS (next.config.js → securityHeaders())
   CSP, HSTS, X-Frame-Options applied at response level for ALL routes
  ↓
3. RATE LIMITING (rate-limit.ts)
   rateLimitUser(userId) on authenticated endpoints (100 req/min)
   rateLimitAuth(ip) on sign-in/sign-up (20 req/15min)
   Passthrough when UPSTASH env vars not set
  ↓
4. ZOD VALIDATION (validation.ts)
   PaginationSchema, IdSchema, TenantScopeSchema, DateRangeSchema
   Parse at boundary — never trust client-side types
  ↓
5. FEATURE GATE (guards.ts → requiresTier())
   Throws 402 if tenant plan doesn't meet requirement
   free < pro < enterprise — sequential tier check
  ↓
6. ZENSTACK TENANT ISOLATION (libs/integrations/zenstack.ts → getEnhancedDb())
   @@allow/@@deny policies applied automatically to ALL queries
   auth() context: {id, tenantId, staffRole} — injected at enhance() call
   @@deny rules evaluated BEFORE @@allow (deny wins)
  ↓
7. BUSINESS LOGIC + ROLE CHECK (route handlers)
   checkMembership(db, userId, tenantId, ['owner','admin']) for write operations
   getMembershipRole() when role-specific responses needed
  ↓
8. AUDIT LOG (audit.ts → auditLog())
   Every state-changing action writes to AuditEvent (immutable, append-only)
   action format: "resource.verb" e.g. "task.created", "member.added"
  ↓
9. RESPONSE
   JSON response + security headers already set at layer 2
```

---

## §2 — CSPS Security Vocabulary

**`auth()`** — ZenStack's user context object, populated from `enhance(prisma, { user })`.
Returns `{ id: string, tenantId: string?, staffRole: string? }`. Does NOT include role.

**`future()`** — In ZenStack `@@deny` policies: the post-update field value.
Example: `@@deny("update", future().role == "owner" && auth().staffRole == null)` prevents
non-staff from escalating to owner role.

**`@@deny` before `@@allow`** — ZenStack evaluation order. If ANY `@@deny` matches, the
operation is blocked regardless of `@@allow`. Design policies with denies as guards first.

**`enhance(prisma, { user })`** — The activation point for tenant isolation. Returns an
enhanced Prisma client that enforces all `@@allow`/`@@deny` policies automatically.
Call at request time, not at module load.

**`checkMembership(db, userId, tenantId, roles)`** — API-layer role guard (guards.ts).
Required because ZenStack `auth()` doesn't have UserTenant.role — the role is per-tenant,
stored in the join table. ZenStack enforces tenant isolation; role enforcement lives here.

**`staffRole`** — Platform-level bypass. Non-null staffRole grants cross-tenant read and
staff-only write operations. Set only by platform administrators; never settable by users
(protected by @@deny("update", future().staffRole != staffRole && auth().staffRole == null)).

---

## §3 — The 5 Mandatory Security Surfaces

Every CSPS app MUST implement all 5. `validate-security-headers.mjs` checks surface 1.
The others are checked via code review + audit log coverage.

| # | Surface | Where | Validator |
|---|---|---|---|
| 1 | **Security headers** | apps/[app]/next.config.js headers() | `security_headers_compliance` BLOCKING |
| 2 | **Rate limiting** | Sensitive API routes | Manual review (planned: validate-rate-limit-coverage) |
| 3 | **Input validation** | All request params/body | Manual review (Zod required per convention) |
| 4 | **Feature gates** | Paid features | Manual review (requiresTier pattern) |
| 5 | **Audit log** | All state-changing operations | Manual review (auditLog pattern) |

---

## §4 — Connectivity Security Rules

**Webhook HMAC verification (Clerk, Stripe):**
Always verify signatures before processing. Pattern established in apps/template/api/webhooks/clerk/route.ts.
Never process unverified webhook events. Use svix for Clerk, Stripe SDK for Stripe.

**Server-Sent Events (SSE):**
Authenticate the initial HTTP request before opening the stream. SSE connections bypass
middleware-level auth checks in some configurations. Validate session in the route handler.

**File uploads:**
Never serve user-uploaded files directly from the app. Use Supabase Storage presigned URLs.
Validate file type and size before upload. Store path only — never file content in database.

**API keys / secrets:**
Never log secrets (WebhookEndpoint.secret, Stripe keys, etc.).
Never expose secrets in API responses (select only non-secret fields).
Rotate via secure channel; update in Vercel env vars only.

---

## §5 — Security Domain Composition

Composes with:
- L1_CORE_ARCH.md (structural architecture — security is an arch concern)
- libs/integrations/security/ (the operational implementation)
- schema.zmodel @@allow/@@deny policies (ZenStack enforcement layer)
- L2_DOMAIN_ARCH_SCHEMA_GOVERNANCE.md (schema changes require security review)

**Domain signature:** S032-Sonnet-l2-domain-security-2026-05-15T14:00Z (Turn 47)
