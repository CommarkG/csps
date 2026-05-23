---
id: csps.bundles.template-bundle-index
name: TEMPLATE-BUNDLE-INDEX
description: "Single source of truth for all sealed CSPS capability bundles. Every app fork inherits all SEALED bundles. Updated at each bundle sealing event."
version: "1.1"
session: S058
owner: group:finky
core_spine: GVRN
schema_anchor: vault_files
lifecycle: production
lifecycle_state: active
protection_level: sealed
diataxis_type: reference
context_question: "Before forking a new app: are all 6 bundles SEALED? Is the component library available via @csps/ui? Have all env_vars_required been provisioned in Vercel?"
---

# Template Bundle Index — All Sealed Bundles

> Single source of truth. Updated whenever a bundle is sealed.
> Design: docs/SIA/R1-08-TEMPLATE-BUNDLE-SYSTEM.md
> CORE COMPLETE: 2026-05-23 | S058 | All 6 bundles SEALED.

## Sealed Bundles

| Bundle | File | Sealed | Session | requires_db |
|---|---|---|---|---|
| AUTH | tools/bundles/foundation/AUTH.bundle.yaml | ✅ | S056 | false |
| DEPLOY_PIPELINE | tools/bundles/foundation/DEPLOY_PIPELINE.bundle.yaml | ✅ | S056 | false |
| GOVERNANCE_LAYER | tools/bundles/foundation/GOVERNANCE_LAYER.bundle.yaml | ✅ | S056 | false |
| TENANCY | tools/bundles/foundation/TENANCY.bundle.yaml | ✅ | S057 | true (Supabase) |
| AUDIT_BASE | tools/bundles/foundation/AUDIT_BASE.bundle.yaml | ✅ | S057 | true (Supabase) |
| COMPONENT-LIBRARY | tools/bundles/template-bundle/COMPONENT-LIBRARY.bundle.yaml | ✅ | S058 | false |

**Total: 6 / 6 SEALED** — Core Complete gate passed.

---

## Bundle Dependencies

```
AUTH          → TENANCY (adds RLS on top of Clerk users)
TENANCY       → AUDIT_BASE (every tenant action has an audit trail)
GOVERNANCE    → standalone (no DB; hooks + validators + pageDNA)
DEPLOY        → standalone (no DB; Vercel config pattern)
COMPONENT-LIB → standalone (no DB; @csps/ui workspace package)
```

---

## Fork Checklist (per bundle)

When forking a new app via `tools/scripts/fork-app.mjs`:

### AUTH ✅
- [ ] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in Vercel
- [ ] CLERK_SECRET_KEY in Vercel
- [ ] CLERK_WEBHOOK_SECRET in Vercel
- [ ] middleware.ts wired

### DEPLOY_PIPELINE ✅
- [ ] Gate 3 Vercel config: Root Dir=apps/[app], framework=nextjs, include-outside-root=enabled
- [ ] No outputDirectory override

### GOVERNANCE_LAYER ✅
- [ ] const pageDNA on all page files (NOT export const)
- [ ] pnpm verify exit_code=0
- [ ] validate-new-file-dna.mjs blocking=0

### TENANCY ✅ (requires Supabase)
- [ ] DATABASE_URL (port 6543, pgbouncer=true)
- [ ] DIRECT_URL (port 5432)
- [ ] ZenStack RLS policies applied (pnpm schema:generate)

### AUDIT_BASE ✅ (requires Supabase)
- [ ] AuditEvent table present in schema
- [ ] enforce_audit_event_immutability trigger deployed
- [ ] Immutability confirmed (INSERT-only pattern)

### COMPONENT-LIBRARY ✅
- [ ] "@csps/ui": "workspace:*" in package.json
- [ ] @csps/ui path in tsconfig.json
- [ ] @csps/ui in transpilePackages (next.config.js)
- [ ] pnpm --filter @csps/[app] build exits 0

---

## Bundle Taxonomy (R1-08)

```
Foundation Bundles   — Always mandatory. Every app gets all of them.
Tier Bundles         — Conditional by tier (Tier-1/2/3). Not yet sealed.
Domain Bundles       — Conditional by domain (business/personal/social/knowledge). Not yet sealed.
```

Foundation = sealed here. Tier + Domain = future sealing events.

---

*Registered S055 | Template Bundle System R1-08 | CORE-COMPLETE-EXIT-CRITERIA.md*
*All 6 bundles SEALED: S058 CORE COMPLETE | 2026-05-23*
