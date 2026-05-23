---
id: csps.sia.PRIVATE-BUSINESS-SILOS
name: PRIVATE-BUSINESS-SILOS
description: "Architecture for isolating AppVocabulary and BehaviorProfile data per app. Phase 1: YAML path isolation. Phase 2: ZModel RLS policies. Ensures app-specific corrections never leak across app boundaries."
version: "1.0"
type: architecture
protection_level: protected
diataxis_type: reference
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spines: [ARCH, GVRN]
core_spine: ARCH
schema_anchor: vault_files
session: S054
links:
  - csps.sia.PROFILING-HUB-SCHEMA
  - csps.libs.vocabulary-service.service
  - csps.governance.EXPLORE-RATIFY-EXECUTE
context_question: "If a user corrects a term in app A, is there any code path by which that correction could appear in app B without the user explicitly making the same correction there?"
context_quote: "App-specific corrections are domain knowledge. A correction in a cooking app has no business appearing in a legal app."
---

# Private Business Silos

## The Problem

CSPS hosts 30+ apps on shared infrastructure. Every app shares:
- `@csps/vocabulary-service` (libs/ package)
- `BehaviorProfile` data structure
- The same `userId` as the isolation key

Without explicit silo enforcement, a correction made in app A (e.g., "grocery list" → "shopping cart items" in a grocery app) could be read by app B (e.g., a legal document app) and applied incorrectly.

The BEHAVIOR-HUB two-layer architecture (PROFILING-HUB-SCHEMA.md Decision 2) establishes the isolation concept. This document specifies how the isolation is enforced at each phase.

---

## Two-Layer Isolation Model

```
UserVocabulary (global layer)
  path: libs/vocabulary-service/profiles/{userId}/vocabulary.yaml
  scope: "global"
  isolation key: userId
  readable by: ALL apps for this user
  writable by: Any app (corrections compound across all apps)

AppVocabulary (silo layer)
  path: libs/vocabulary-service/profiles/{userId}/{appSlug}.yaml
  scope: "app"
  isolation key: userId + appSlug
  readable by: ONLY the app matching appSlug
  writable by: ONLY the app matching appSlug
```

**The rule:** App vocabulary corrections are private to the app that made them. They do not propagate to other apps. The global vocabulary layer handles cross-app intelligence.

---

## Phase 1 — YAML Path Isolation (CURRENT, built S053-A)

**How it works:** The isolation is the file system path. AppVocabulary files are stored at `{userId}/{appSlug}.yaml`. The `appSlug` is the isolation key. No app can accidentally read another app's vocabulary because the file path requires the `appSlug`.

**Enforcement in `libs/vocabulary-service/src/service.ts`:**
```typescript
// lookup() only reads AppVocabulary for the calling app's appSlug
// No API exists to read ALL app vocabularies for a user
export function lookup(userId: string, misrecognized: string, appSlug?: string): VocabLookupResult
```

**What prevents cross-app leakage in Phase 1:**
1. `appSlug` is a required parameter for app-scoped reads
2. No API to enumerate all app slugs for a user (no `getAllAppVocabularies(userId)` method)
3. `lookup()` without `appSlug` → global layer only (intentional cross-app sharing)
4. YAML file paths are `{userId}/{appSlug}.yaml` — requires knowing the exact slug

**What Phase 1 does NOT protect against:**
- A buggy app passing the wrong `appSlug` (no runtime validation of appSlug ownership)
- A malicious app guessing another app's slug (slug is not a secret in Phase 1)

These are acceptable Phase 1 limitations. Phase 2 addresses them with DB-level RLS.

---

## Phase 2 — ZModel RLS Policies (FUTURE, blocked on DB infrastructure)

**Gate:** BEHAVIOR-HUB-ZMODEL-PROMOTION plan item must complete first.

**What changes:** AppVocabulary and BehaviorProfile become Prisma models with ZenStack RLS.

**RLS policy design (to be implemented at promotion time):**

```prisma
// AppVocabulary — user can only read/write their own app's data
model AppVocabulary {
  id       String @id
  userId   String
  appSlug  String // isolation key — combined with userId for uniqueness
  entries  Json

  @@allow('read', auth().id == userId)
  @@allow('create,update', auth().id == userId && appSlug == ctx.currentApp)
  @@allow('delete', false) // corrections are never deleted, only superseded
  @@unique([userId, appSlug])
}

// BehaviorProfile — same isolation pattern
model BehaviorProfile {
  id      String @id
  userId  String
  appSlug String

  @@allow('read', auth().id == userId && appSlug == ctx.currentApp)
  @@allow('create', auth().id == userId && appSlug == ctx.currentApp)
  @@allow('update', auth().id == userId && appSlug == ctx.currentApp)
  @@unique([userId, appSlug])
}
```

**The `ctx.currentApp` context variable:** Set by the Next.js middleware from the app's domain/subdomain. Never trusts client-provided values.

---

## The Invariant

Regardless of phase, this invariant must hold:

> **A correction made in app A is never automatically visible in app B.**

In Phase 1: enforced by file path + API design (no cross-slug read method)
In Phase 2: enforced by ZModel RLS (DB-level, cryptographically isolated)

The global vocabulary layer (UserVocabulary) is INTENTIONALLY shared. It is where cross-app intelligence lives. A word the user always pronounces the same way across all contexts belongs in the global layer. Domain-specific corrections (legal terms, cooking vocabulary, fitness jargon) belong in app silos.

---

## Verification Gate

**Before any new app reads vocabulary data, confirm:**
- Does the `lookup()` call pass the correct `appSlug` for this app?
- Is there any code path that reads `vocabulary.yaml` directly (bypassing the service)?
- Does the app have a way to write to another app's `{appSlug}.yaml`?

If any answer is YES → the silo is broken.

context_question (behavioral test): "If a user corrects 'grocery list' in the cooking app — does that correction appear in the legal app?" Answer must be NO for both Phase 1 and Phase 2.
