---
id: csps.handoff.vault.opus-lessons.S019.part1
name: opus-lessons-S019-part1
description: >
  Lessons L1–L8: schema architecture, security, billing placement, scale, and
  regulatory gaps. Each lesson identifies the root principle gap, why builders
  miss it, and the permanent improvement for CSPS AI builders.
version: 1.0
lifecycle: production
lifecycle_state: draft
dynamic: true
owner: group:finky
core_spine: ARCH
session: S019
created_by: Claude Sonnet 4.6[1M] — Opus-designated architectural review
tags:
  - domain:architecture
  - domain:security
  - type:reference
  - audience:ai-agent
  - maturity:draft
links:
  - { rel: parent, href: ./README.md }
  - { rel: part2, href: ./part2-spines-ai-and-vision.md }
  - { rel: schema, href: ../../../../libs/policies/schema.zmodel }
  - { rel: drift-validator, href: ../../../../../tools/validators/validate-foundation-schema-drift.mjs }
---

# Part 1: Schema, Security, Billing, Scale, Regulatory
## Lessons L1–L8 for CSPS Builders

---

> **Opening Frame — Lessons for Builders Who Come After**
>
> The schema is the platform's skeleton. Every app inherits it. Every policy enforces it.
> Every security guarantee is only as strong as the schema's integrity.
> Schema gaps don't announce themselves. They wait.
> These lessons are what the waiting gaps taught us.

---

## Overview: The Schema Architecture Story

Eight lessons, one coherent story.

CSPS's schema approach is architecturally superior to every conventional SaaS platform: ZenStack at the ORM layer, `@@allow` policies enforced at compile time, foundation slices shared across 30 apps, drift detection keeping ZModel and Prisma synchronized. This is the right architecture. The gaps are not in the concept — they are in the coverage depth of the implementation.

**The story arc of L1–L8:**

- L1 and L2 are about **measurement depth** — the drift validator measures model names but not field names; the comment system claims a mechanism that doesn't exist.
- L3 and L4 are about **boundary clarity** — where does foundation-level state live vs. app-level state? When two things share a name with different meanings, what breaks?
- L5 is about **abstraction completeness** — the Base mixin is almost right but missing one variant.
- L6 is about **where logic lives** — billing trigger logic in an app when it belongs in a library.
- L7 is about **regulatory foresight** — the architecture you build today determines which markets you can enter tomorrow.
- L8 is about **scale foresight** — a query pattern that's invisible at 1,000 users that breaks at 100,000.

**Synergy across L1–L8:** Fixing L1 (field drift detection) immediately surfaces the L3 gap (stripeSubscriptionId belongs in ZModel or in a BillingProfile model). Fixing L3 informs L6 (billing logic placement). Fixing L6 unlocks L7 (GDPR compliance). These are not independent fixes — they are a chain. Fix one → the next becomes visible → fix that → architectural clarity compounds.

---

## Lesson L1: The Field-Level Drift Blind Spot

**Status:** CRITICAL — Live gap confirmed in current codebase.
`Tenant.stripeSubscriptionId` exists in `apps/task-mgmt/prisma/schema.prisma:59` but NOT in `libs/policies/schema.zmodel`. The drift validator reports `CLEAN`.

---

### The Finding

`validate-foundation-schema-drift.mjs` checks whether every **model** in the ZModel exists in the app Prisma schema. It does not check whether every **field** of every model matches. A field can be added to the app schema, removed from the ZModel, or never added to the ZModel in the first place — and the validator exits 0.

The `@db.Uuid` type annotation also diverges: ZModel declares `id String @id @default(uuid()) @db.Uuid`; the app schema omits `@db.Uuid`. This means UUID fields are stored as text instead of PostgreSQL's native 16-byte UUID type. The validator reports CLEAN on this divergence too.

---

### Root Principle Gap

**The principle that would have prevented this:**

> *Schema integrity validation must enumerate ALL levels of consistency it covers, explicitly marking any deferred levels as known gaps.*

The ARCH spine principle `P-ARCH-018` says "every entity has tenantId" — a field-level requirement. The drift validator enforces model-level consistency. There is a principle about field-level schema integrity (implied by P-ARCH-018 and the broader "drift = security issue" mandate), but no explicit principle that says **"schema validation has N levels; all N levels must be covered or explicitly deferred with a VLT."**

The platform has the meta-principle `P-META-019` (Structural Prevention) and the depth discipline for artifacts, but neither was applied to the validator's own coverage scope. The validator was treated as a complete solution when it was a Level-1-of-2 solution.

---

### Why the Builder Missed It

**Cognitive reason:** Model-level drift is the most visually obvious form of drift — a missing model means an entire set of queries fail. Field-level drift is subtle — queries still succeed, but they return wrong data or enforce wrong policies. The builder solved the obvious problem and the satisfaction point fired.

**Structural reason:** The validator was built to catch the *incident* that prompted its creation (ZModel and app Prisma schema diverging after a model rename). It was not built to catch the *class* of incidents that model-rename belongs to. This is the "reasoning-definitional-gap-creation" anti-pattern: the definition of "drift" was anchored to the current mechanism (model names), not to the scope (all dimensions of schema consistency).

**The specific failure mode:** `spawnSync('zenstack generate')` runs, parses generated model names, cross-checks app model names, exits 0. The developer saw 0 blocking findings and assumed all schema drift was covered. The validator's name is "validate-foundation-schema-drift" — the name implies completeness. The implementation delivers partial coverage.

---

### Permanent Improvement for CSPS Builders

**Immediate fix (implement now):**
Extend `validate-foundation-schema-drift.mjs` to parse fields within each model and compare. For each model present in both schemas, extract field names and types, report BLOCKING when fields exist in generated schema but are absent from app schema.

**Structural fix (add to CSPS validator authoring standard):**
Every validator that checks consistency between two artifacts MUST include in its header comment:
```
Coverage Levels:
  ✓ Level 1: [what is checked]
  ✗ Level 2: [what is NOT yet checked] → VLT-S0NN-XXXX
  ✗ Level 3: [next level if applicable] → planned S0NN
```
A validator comment block that doesn't enumerate its coverage levels is incomplete documentation. Add this to the validator template.

**Principle to ratify:**
`P-VALD-XXX — Validator Coverage Enumeration`: Every validation artifact must explicitly declare what it covers AND what it knowingly does not cover. Gaps that are not declared are invisible; gaps that are declared become trackable VLTs.

---

### Builder Instructions

If you are a Sonnet instance implementing or extending a validator:
1. Before writing the validator, enumerate ALL dimensions of consistency the validator *could* check.
2. Implement at least Level 1. Mark all uncovered levels as `KNOWN_GAP:` in the header with VLT references.
3. Never name a validator with a name that implies broader coverage than the implementation delivers. "validate-foundation-schema-drift" implies all drift is caught. If only model names are checked, name it "validate-foundation-schema-model-names" or add the coverage declaration.

---

### Synergy Map

| Connected To | How |
|---|---|
| L3 (Schema Placement) | Field-level drift detection immediately surfaces stripeSubscriptionId as a detected gap — one fix triggers another |
| L10 (Spine Self-Validation) | The same "enumerated coverage levels" principle applies to spines themselves: what does each spine's validator actually cover? |
| L11 (Override Enforcement Rate) | Inner-AI-defaults overrides have the same partial-coverage pattern: registered but not mechanically enforced |
| P-META-019 (Structural Prevention) | This IS a K=2 pattern (schema drift appeared twice before being fully solved); the structural fix should have fired at K=2 |
| validate-foundation-schema-drift.mjs | Direct implementation target |

---

### Governor Ratification Needed

- [ ] Approve field-level drift detection implementation
- [ ] Approve addition of "Coverage Levels" requirement to validator authoring standard  
- [ ] Assign VLT for Level 3 (live-DB vs. code drift) coverage

---

## Lesson L2: The Comment-Truth Mismatch — When Documentation Becomes a Governance Lie

**Status:** IMPORTANT — Live mismatch in current codebase.

---

### The Finding

`libs/policies/schema.zmodel:183`:
```
// Append-only: write via Postgres triggers only (P-ARCH-008)
model AuditEvent extends Base {
```

`apps/task-mgmt/src/lib/audit.ts:15`:
```typescript
return db.auditEvent.create({ data: { ... } })
```

The comment says Postgres triggers. The implementation uses application code. The application code is architecturally correct — the enhanced client can't write AuditEvent (ZenStack policy denies it), so the raw `db` client is used deliberately. But the comment describes a different, more secure mechanism that would prevent any app-code bypass.

---

### Root Principle Gap

**The principle that would have prevented this:**

> *Any comment that asserts an implementation mechanism is a governance claim. Governance claims must be verified, not trusted.*

The platform has `B_VALIDATE_BEFORE_ASSUME` for AI behavior. It does not have the equivalent for code comments. Comments in governance-significant positions (P-ARCH-* references, security-critical code) are trusted as accurate. When they are wrong, they create false confidence — a developer reads "Postgres triggers" and assumes the mechanism cannot be bypassed by application code, which is not true for the current implementation.

The specific gap: `P-ARCH-008` says "audit via triggers, not app code." The implementation chose app code correctly (triggers would require schema-level DDL + a separate migration process). But the principle was not updated to reflect the implementation decision. The principle and the implementation diverged, and the comment chose to reflect the principle, not the implementation.

---

### Why the Builder Missed It

**Cognitive reason:** The comment was written with aspirational intent — "this should eventually be via Postgres triggers." The implementation delivered a working solution. The satisfaction point fired on the working solution, not on the alignment between comment and implementation.

**Structural reason:** There is no validator for "comment truth" — no mechanism checks whether a comment citing `P-ARCH-*` accurately describes the implementation below it. Validators check schema, contracts, principles, audit slugs. They do not check whether inline code comments are truthful about mechanism.

**The compounding risk:** A future developer reading the comment will trust it. They will reason: "AuditEvent writes are in Postgres triggers, so I don't need to write an audit call in my new API route — the trigger handles it." They will ship a route with no audit trail. The incorrect comment created a governance trap.

---

### Permanent Improvement for CSPS Builders

**Immediate fix:** Update the AuditEvent comment to accurately state: "Append-only: written only via `writeAuditEvent()` in `apps/*/src/lib/audit.ts`. Raw `db` client required — ZenStack's @@deny policy prevents enhanced client writes. Postgres-trigger migration tracked in VLT-S0NN-XXXX."

**Structural fix:** Create a `validate-comment-truth.mjs` validator pattern for governance-critical comments: scan all `.ts` files for `// P-ARCH-*` or `// P-META-*` inline citations, extract the claimed mechanism, surface as ADVISORY for human review. Not fully automatable, but forces periodic review of comment accuracy.

**Principle to ratify:**
> *Comments that cite a governance principle (P-ARCH-*, P-META-*) are governance claims. Governance claims in code are subject to the same verification requirement as governance claims in documentation: they must accurately reflect the current implementation, not the intended future state.*

---

### Builder Instructions

When writing a comment that references a principle or claims an implementation mechanism:
1. Ask: "Is this what the code DOES NOW, or what I intend it to do eventually?"
2. If the latter: replace with "// TODO-P-ARCH-008: migrate to Postgres triggers → VLT-S0NN-XXXX"
3. Never use a principle citation to describe aspirational behavior. Principle citations are promises about the present.

---

### Synergy Map

| Connected To | How |
|---|---|
| L5 (AppendOnlyBase) | AuditEvent's architectural confusion (soft-delete it can't use, triggers it doesn't have) stems from the same aspirational-vs-actual gap |
| L13 (Satisfaction Point) | Comment-truth mismatch IS the satisfaction point pattern applied to documentation |
| P-ARCH-008 | The principle that should be updated or whose implementation should be completed |
| B_VALIDATE_BEFORE_ASSUME | The contract that should extend to code comments in governance-significant positions |

---

### Governor Ratification Needed

- [ ] Decision: migrate AuditEvent to Postgres triggers (complete the principle), OR update P-ARCH-008 to accurately describe the app-code pattern
- [ ] Approve comment-truth validator concept
- [ ] Assign VLT if Postgres trigger migration is the chosen path

---

## Lesson L3: Schema Placement — Where Does Billing State Belong?

**Status:** IMPORTANT — Architectural decision needed; current state is an inconsistent split.

---

### The Finding

The ZModel Tenant has: `stripeCustomerId String?`, `subscriptionStatus TenantSubscriptionStatus`
The app Prisma Tenant has additionally: `stripeSubscriptionId String?`

The billing-related state is split: some fields are in the platform ZModel (shared across all apps), some are only in the app schema (invisible to the platform). There is no documented rationale for why `stripeCustomerId` is in the ZModel but `stripeSubscriptionId` is not.

When app #2 is built: does its Tenant also need `stripeSubscriptionId`? If yes — it should be in the ZModel. If no — then `stripeCustomerId` probably shouldn't be either. The inconsistency reveals that the foundation/app boundary for billing state has not been explicitly decided.

---

### Root Principle Gap

**The principle that would have prevented this:**

> *Every field that touches a cross-cutting concern (billing, auth, audit) must have an explicit placement decision: foundation-level (shared) or app-level (per-app), with the reasoning documented in the schema comment.*

The ARCH spine has `P-ARCH-002` (Schema-Per-App) and `P-ARCH-018` (every entity has tenantId). Neither principle governs WHERE billing state lives in the schema hierarchy.

---

### Why the Builder Missed It

**The billing state was added incrementally.** `stripeCustomerId` was added when Stripe customer creation was implemented. `stripeSubscriptionId` was added later when the subscription lifecycle was wired. Each addition seemed locally correct. No one evaluated the full set of billing fields together against the foundation/app boundary principle.

**Incremental additions bypass holistic architectural review.** The platform has validators for drift, for schema compliance, for behavioral contracts — but no validator that asks: "Is this field's placement consistent with all other fields of the same cross-cutting concern?"

---

### Permanent Improvement

**Immediate fix:** Decide the billing architecture boundary now (Lesson L6 below proposes the specific model). Once decided, either add `stripeSubscriptionId` to ZModel or move both billing fields to a `BillingProfile` model.

**Structural fix:** Add a `@@placement_rationale` comment requirement for fields that touch billing, auth, or audit:
```
stripeCustomerId  String? // @placement: foundation — all apps use Stripe for billing
stripeSubscriptionId String? // @placement: foundation — subscription lifecycle shared
```
The placement-rationale comment makes implicit decisions explicit and checkable.

**Principle to ratify:** `P-ARCH-XXX — Cross-Cutting Field Placement`: Fields touching billing, auth, or compliance must have explicit placement decisions (foundation vs. app) documented in the schema. A field without a placement rationale is a boundary debt item.

---

### Builder Instructions

When adding a new field that relates to billing, auth, or compliance:
1. Ask: "Will every app in CSPS need this field?"
2. If yes → add to ZModel foundation.
3. If no → add to app-local schema with `// @app-only: [reason]`
4. If uncertain → create a VLT before adding the field.

---

### Synergy Map

| Connected To | How |
|---|---|
| L1 (Field Drift) | Field drift detection will immediately surface this as a gap once L1 is fixed |
| L6 (Billing Architecture) | The placement decision for billing fields is L6's core question |
| L7 (GDPR) | Compliance-related fields (consent timestamps, deletion records) have the same placement ambiguity |
| ARCH Spine | This is a pure ARCH boundary decision requiring Governor ADR |

---

### Governor Ratification Needed

- [ ] Architectural decision: BillingProfile as separate model OR billing fields remain on Tenant
- [ ] If BillingProfile: ADR required (GVRN mandate for schema changes)
- [ ] If Tenant: add stripeSubscriptionId to ZModel and field-level drift fix will confirm

---

## Lesson L4: The Naming Collision — `User.tenantId` vs. Entity Ownership tenantId

**Status:** IMPORTANT — Actively misleads future developers and could cause silent data errors.

---

### The Finding

`User.tenantId String?` in the schema is described as "active session context." Every other model uses `tenantId` to mean entity ownership — this row belongs to this tenant.

In API routes, the `tenantId` that matters for ZenStack enforcement comes from Clerk session claims and is passed to `getEnhancedDb({ tenantId })`. This is a THIRD use of the name `tenantId`. Three semantic concepts share one identifier:

1. `Task.tenantId` — "this task belongs to tenant X" (entity ownership)
2. `User.tenantId` — "this user's active session context" (session pointer)
3. `auth().tenantId` — "the tenantId of the current ZenStack authentication context" (runtime auth)

A developer who writes `user.tenantId` expecting entity ownership will get session context. This will not produce a type error. It will produce a silent business logic failure.

---

### Root Principle Gap

**The principle that would have prevented this:**

> *When a field name is used across multiple models, it must carry identical semantic meaning in every model. Semantic overloading of a field name is a naming policy violation even if the types match.*

The ARCH spine and naming policy (`B_NAMING_POLICY`, `P-ARCH-029`) govern naming at the artifact level. Neither explicitly states: "a field name may not carry different meanings in different models."

---

### Why the Builder Missed It

**The session context design predates the multi-tenant complexity.** `User.tenantId` was added early as a convenient cache of the user's "current" tenant. The policy layer later established that `auth().tenantId` in ZenStack refers to the runtime auth context, not the User model field. The two evolved independently.

**The ZenStack auth context is not a Prisma field.** When writing `auth().tenantId` in ZModel policies, you're not reading `User.tenantId` — you're reading the context passed to `enhance(db, { user: { tenantId } })`. The two are decoupled but look identical in code, making the confusion invisible to TypeScript.

---

### Permanent Improvement

**Immediate fix:** Rename `User.tenantId` to `User.activeSessionTenantId` (or `User.sessionTenantId`). One migration, permanent clarity.

**Structural fix:** Add a naming convention validator that checks for fields named `tenantId` on the User model specifically, and reports ADVISORY with the canonical definition.

**Principle to ratify:** `P-ARCH-XXX — Field Semantic Uniqueness`: A field named `tenantId` means "this entity belongs to this tenant." No other field may be named `tenantId` in the foundation schema. Fields with different semantics must have distinct names.

---

### Builder Instructions

When adding a field to the User model that stores contextual or session information:
1. Never name it `tenantId` — the name is reserved for entity ownership.
2. Use `activeSessionTenantId`, `lastKnownTenantId`, or `sessionContext_tenantId`.
3. Add a schema comment: `// @semantic: session-context — NOT entity-ownership tenantId`

---

### Synergy Map

| Connected To | How |
|---|---|
| L1 (Field Drift) | The field drift validator, once upgraded, will need to handle the semantic distinction — not just field presence |
| L3 (Schema Placement) | Session context fields have the same placement ambiguity as billing fields |
| B_NAMING_POLICY | Extends the naming policy to field semantics within models |
| P-ARCH-029 | The naming principle — extend it to cover intra-schema semantic uniqueness |

---

### Governor Ratification Needed

- [ ] Approve rename of `User.tenantId` → `User.activeSessionTenantId`
- [ ] Migration safety review (check all routes that reference `user.tenantId`)

---

## Lesson L5: The Missing Abstraction — `AppendOnlyBase`

**Status:** ADVISORY — Structural incoherence; misleads future developers.

---

### The Finding

`abstract model Base` includes `deletedAt DateTime?` (soft-delete field) and `updatedAt DateTime @updatedAt`. All models extend Base, including `AuditEvent`. But `AuditEvent` has `@@deny("create,update,delete", true)` — it can never be updated or soft-deleted. The `deletedAt` field on AuditEvent will always be null. The `updatedAt` will always equal `createdAt`.

This is structural incoherence: a model that cannot participate in soft-delete inherits a soft-delete field. Every `AuditEvent` row carries 16 bytes of fields that serve no purpose and communicate a false capability.

---

### Root Principle Gap

**The principle that would have prevented this:**

> *An abstract base model must only include fields that ALL concrete implementations can and will use. When a subset of models needs different base behavior, create a variant.*

The platform has one Base mixin for everything. The principle "soft-delete by default" (P-ARCH-007) was implemented universally. But soft-delete is not appropriate for append-only records — it should be `@@deny`-blocked AND the field should not exist, because the combination creates confusion.

---

### Why the Builder Missed It

**"Soft-delete by default" was applied as a rule, not a policy.** P-ARCH-007 says soft-delete by default — this is correct. But "by default" does not mean "always and everywhere." AuditEvent is a genuine exception: it is designed to be immutable at the policy level, so the soft-delete mechanism is not just unnecessary but actively confusing.

**The rule was easier to apply universally than to evaluate case-by-case.** The builder saw "all models extend Base" as a clean invariant. Clean invariants have cognitive value. Breaking the invariant for one model feels messy. The messiness of "AuditEvent has unusable fields" was accepted over the messiness of "two Base variants."

---

### Permanent Improvement

**Immediate fix:** Create `abstract model AppendOnlyBase` with only `id` and `createdAt`. Have `AuditEvent` extend `AppendOnlyBase` instead of `Base`.

**Structural fix:** Document in the schema: "Models requiring immutability extend AppendOnlyBase. Models requiring soft-delete extend Base. The choice between Base and AppendOnlyBase is an architectural decision requiring documentation in the model comment."

**Principle to ratify:** `P-ARCH-XXX — Base Variant Selection`: Every model must explicitly choose between `Base` (mutable, soft-deleteable) and `AppendOnlyBase` (immutable). The choice must be justified in a comment. New models that default to `Base` without a comment are flagged as ADVISORY.

---

### Builder Instructions

When creating a new model:
1. Identify whether the model is mutable or immutable.
2. Immutable models (audit logs, event streams, ledger entries) → extend `AppendOnlyBase`.
3. Mutable models → extend `Base`.
4. Add: `// @base: Base|AppendOnlyBase — [one-line reason]` to every model declaration.

---

### Synergy Map

| Connected To | How |
|---|---|
| L2 (Comment Truth) | The comment "Append-only: write via Postgres triggers" is incoherent with inheriting a `deletedAt` field |
| L6 (Billing Architecture) | A `BillingProfile` model would likely extend `Base` (mutable); a `BillingEvent` would extend `AppendOnlyBase` |
| L7 (GDPR) | Immutable audit records (AppendOnlyBase) MUST NOT be subject to erasure — the model type communicates this intent |
| P-ARCH-007 | The principle being extended from "always Base" to "Base OR AppendOnlyBase" |

---

### Governor Ratification Needed

- [ ] Approve `AppendOnlyBase` abstract model creation
- [ ] Decision: which other models should use AppendOnlyBase (future ledger, billing events, etc.)

---

## Lesson L6: The Billing Trigger Lives in the Wrong Place

**Status:** IMPORTANT — Will compound at every new app; billing logic must be extracted to `libs/` now.

---

### The Finding

In `apps/task-mgmt/src/app/api/webhooks/clerk/route.ts:34-76`, the billing trigger logic (when `memberCount === 2`, create Stripe subscription) is embedded inside the Clerk webhook handler's `dbAdapter.userTenant.create` override. This is app-level code. When app #2 is built, this logic must be reimplemented there too, or app #2 will not have billing triggers.

`buildTenantBillingHook` exists in `@csps/integrations` — the platform already has the right library. But the memberCount logic did not make it into the shared hook. Only the Stripe customer creation hook is in `libs/`. The subscription trigger is in `apps/`.

---

### Root Principle Gap

**The principle that would have prevented this:**

> *Any logic that executes a cross-cutting platform behavior (billing, audit, tenant lifecycle) must live in `libs/`. App code calls library functions; it does not implement cross-cutting logic.*

`B_LAYER_SEPARATION` says "core layer (libs/, tools/) vs. app layer (apps/*) are distinct scopes." But the behavioral contract does not specify: "cross-cutting logic that will be needed by all apps must be in libs/ before the first app implements it." The contract is structural; it does not prevent partial implementations from being accepted.

---

### Why the Builder Missed It

**The billing trigger was built incrementally.** The Stripe customer creation was added to the integrations lib first (correct). The subscription trigger was added later, directly in the webhook handler (incorrect placement). The incremental addition bypassed the question "where should this live at scale?"

**The test for whether logic belongs in libs/ is temporal, not static:** "Will app #2 need this?" At the time the trigger was written, app #2 didn't exist. The question was never asked.

---

### Permanent Improvement

**Immediate fix:** Move the `memberCount === 2` logic into `buildTenantBillingHook` inside `@csps/integrations`. The app-level webhook handler then calls the shared hook without inline logic.

**Structural fix:** Add to `B_LAYER_SEPARATION` contract: "Before implementing any logic in an app webhook handler or API route that relates to billing, tenant lifecycle, or audit, ask: 'Will app #2 need this exact logic?' If yes: implement in `libs/integrations`, not in app code."

**Validator to add:** A validator that scans `apps/*/src/app/api/webhooks/` for patterns that match billing or tenant lifecycle logic (Stripe client calls, memberCount queries) and reports ADVISORY if found outside `libs/`.

---

### Builder Instructions

When building a Clerk or Stripe webhook handler for any CSPS app:
1. Your handler's job is: (a) verify the webhook signature, (b) call the shared integrations lib function.
2. No business logic inside the handler. No memberCount checks. No Stripe calls.
3. If the integrations lib doesn't have the function you need: **add it to the lib first**, then call it.
4. The handler is a routing layer. The lib is the implementation layer.

---

### Synergy Map

| Connected To | How |
|---|---|
| L3 (Schema Placement) | Where billing logic lives determines which fields need to be in the shared ZModel |
| L7 (GDPR) | The same "libs/ for cross-cutting logic" principle applies to the GDPR erasure service |
| L8 (N+1 Query) | Moving billing logic to libs/ also enables the lib to use the Clerk session claim pattern (no N+1) |
| B_LAYER_SEPARATION | The contract this lesson extends |
| `@csps/integrations` | The library that should contain this logic |

---

### Governor Ratification Needed

- [ ] Approve billing trigger extraction to `libs/integrations`
- [ ] Approve the L6 extension to `B_LAYER_SEPARATION` contract

---

## Lesson L7: The GDPR Hard-Delete Gap — A Legal Blocker for EU Market Entry

**Status:** CRITICAL — Legal blocker. Not an advisory concern.

---

### The Finding

`abstract model Base` has `@@deny('delete', true)`. This policy is platform-wide — every model inherits it. There is no hard-delete path anywhere in the codebase.

GDPR Article 17 (Right to Erasure) requires the ability to delete personal data upon user request. The platform cannot currently comply with any erasure request. Every EU user who requests deletion would trigger a legal obligation the platform cannot fulfill.

This is not a future concern. It is a present architectural constraint that determines which markets CSPS apps can enter.

---

### Root Principle Gap

**The principle that would have prevented this:**

> *Soft-delete is a durability pattern, not a compliance strategy. A platform that targets B2B SaaS must design the erasure path before shipping to the first customer, not after.*

`P-ARCH-007` mandates soft-delete. Correct. But the principle was implemented without the complementary principle: "soft-delete is the default; erasure is the exception; the exception must have a mechanical path."

The platform has "deny delete = true" as a hard invariant. This is the right invariant for normal operations. But hard invariants without exception paths create compliance brittleness. The exception path (GDPR erasure) is as architecturally mandatory as the invariant itself.

---

### Why the Builder Missed It

**GDPR compliance feels like a "later" problem.** Building app #1 for a team task management tool with no EU customers doesn't trigger GDPR urgency. The builder correctly prioritized getting the platform working. But the architecture created at this stage determines the cost of GDPR compliance later — and the cost compounds with every app built on a non-erasable foundation.

**The "soft-delete by default" principle is presented without its complement.** P-ARCH-007 is authoritative. A builder reading it sees "deny delete: true" as the final word. The complement — "hard-delete for erasure is a separate, privileged path" — is not in the principle document.

---

### Permanent Improvement

**Architectural specification for implementation:**

Create `libs/gdpr.ts` — a privileged erasure service that:
1. Takes `userId` as input
2. Replaces PII fields (email → `[deleted-user-{hash}]`, displayName → null) — pseudonymization preserves referential integrity
3. Nullifies foreign key references where they identify the user (TaskComment.authorId → keep the row, anonymize the display)
4. Retains the row structure (tasks remain, project history is intact, only PII is removed)
5. Writes an AuditEvent: `user.gdpr_erasure_completed` for the compliance record
6. Returns a receipt: `{ erasure_id, timestamp, fields_cleared, rows_affected }`

The service bypasses ZenStack via a privileged service-account client (similar to the audit writer pattern). It is NOT the raw `db` client — it is a dedicated erasure client with explicit scope.

**Principle to ratify:** `P-ARCH-XXX — Erasure Path Mandatory`: Every CSPS app must have a documented erasure path before its first EU-compliant deployment. The erasure path must be in `libs/gdpr.ts` (shared) not in app code (duplicated). The erasure path MUST retain AuditEvent rows (audit retention ≠ personal data retention).

**Add to the bedrock checklist:** `[ ] GDPR erasure path implemented in libs/gdpr.ts`

---

### Builder Instructions

When implementing any model that stores personal data (email, name, phone, address, any field linked to a natural person):
1. Add `@pii: true` as a schema comment on those fields.
2. Verify `libs/gdpr.ts` covers pseudonymization of those fields.
3. Never implement erasure logic in an app API route. Erasure is a platform service, not an app concern.

---

### Synergy Map

| Connected To | How |
|---|---|
| L5 (AppendOnlyBase) | AuditEvent rows must be retained even after user erasure — AppendOnlyBase communicates this; erasure must not touch AppendOnlyBase models |
| L6 (Billing Architecture) | BillingProfile data is also PII; the erasure service must cover billing fields |
| P-ARCH-007 | The principle being complemented — soft-delete + erasure path together = complete pattern |
| L15 (Platform Self-Improvement) | A platform that identifies PII fields automatically and audits erasure coverage is an example of the self-improvement pipeline |

---

### Governor Ratification Needed

- [ ] Approve `libs/gdpr.ts` architecture
- [ ] Decision: pseudonymization vs. row deletion (recommendation: pseudonymization for referential integrity)
- [ ] Add GDPR erasure path to bedrock checklist
- [ ] Assign VLT for tracking EU deployment readiness

---

## Lesson L8: The N+1 Bootstrap Query — Performance Architecture Decision

**Status:** IMPORTANT — Invisible at current scale, becomes the top latency bottleneck at 10,000 users.

---

### The Finding

Every API route follows this pattern:
```typescript
const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
// then:
const edb = getEnhancedDb({ id: cspsUser.id, tenantId, staffRole: cspsUser.staffRole })
const tasks = await edb.task.findMany(...)
```

Two database queries per API call. The first is a raw PrismaClient query (bypasses ZenStack). The second is the business query. At 10,000 API calls per minute, that's 10,000 unnecessary DB queries per minute purely for the bootstrap lookup.

Clerk session claims already carry `tenantId`. They could also carry `cspsUserId` — eliminating the bootstrap query entirely.

---

### Root Principle Gap

**The principle that would have prevented this:**

> *Every authentication boundary crossed in a hot path (per-request code) must justify its cost at the scale the platform targets. A query that is "free at 100 users" may be the top bottleneck at 100,000.*

The platform has scale-awareness principles (bottleneck-expert skill, `B_HUMBLE_EXECUTOR`). But the bootstrap query was not evaluated against a scale model — it was evaluated against "does it work?" at current scale. The performance cost was deferred as a "we'll optimize later" decision.

---

### Why the Builder Missed It

**The bootstrap query is a natural pattern.** You have a Clerk userId. You need a CSPS userId. The lookup is natural. At development scale, it's instantaneous. The cost is invisible until it's not.

**The fix requires a Clerk session claim change**, which is configuration rather than code. A developer focused on making the API work will implement the query pattern first and consider the optimization later. The optimization requires understanding Clerk's session claim customization — a non-obvious step.

---

### Permanent Improvement

**Implementation:**
Add `cspsUserId` to Clerk's custom session claims:
1. In Clerk Dashboard: Organizations → JWT Templates → add `cspsUserId` from the user's CSPS record
2. The Clerk webhook that creates the CSPS User also writes `cspsUserId` back to Clerk user metadata
3. Session claims then carry: `{ tenantId, cspsUserId, staffRole }` — no DB lookup needed

**Benefits cascade:**
- Eliminates raw `db` bootstrap usage in hot paths — no more ZenStack bypass risk in per-request code
- Session claims are cryptographically signed by Clerk — no additional auth required
- Removes the pattern that could be copied incorrectly (new developers seeing `db.user.findUnique` might copy it for other lookups)

**Principle to ratify:** `P-ARCH-XXX — Session Claim Completeness`: Every field needed for the ZenStack auth context must be available in session claims without a DB lookup. If a DB lookup is required per request, that data belongs in the session claims.

---

### Builder Instructions

When building a new API route:
1. Check: "Can I serve this request using only session claims?"
2. If a DB lookup is needed to establish auth context (user ID, role, tenant): it belongs in the session claims, not in the route.
3. The ONLY legitimate use of raw `db` in an API route is for genuinely bootstrapping state that cannot be in session claims (e.g., creating a new entity for the first time).

---

### Synergy Map

| Connected To | How |
|---|---|
| L2 (Comment Truth) | The bootstrap lookup exists because `User.tenantId` (session context) is not reliably set; fixing L4 doesn't remove the bootstrap but eliminates its most error-prone uses |
| L4 (User.tenantId) | If session claims carry cspsUserId, the `User.tenantId` (active session context) field may become unnecessary entirely |
| Security (Direction 1C from the review) | Eliminating the raw `db` bootstrap pattern removes the copy-paste risk of enumeration through raw client |
| B_LAYER_SEPARATION | Hot-path authentication belongs in the session layer (Clerk), not the database layer |

---

### Governor Ratification Needed

- [ ] Approve Clerk session claim customization plan
- [ ] Confirm Clerk webhook can write cspsUserId back to Clerk user metadata
- [ ] Assess whether `User.tenantId` field can be removed once session claims carry all needed context

---

## Part 1 Closing: The Schema Architecture Synergy

These eight lessons, taken together, describe one thing: **the platform's schema was built correct-by-design at the concept level, but partial-at-implementation at the coverage level.** The ZenStack approach is right. The foundation slices are right. The policy-at-ORM-layer is right.

What was partial: coverage depth (model-level drift, not field-level), boundary documentation (where does billing state live?), base model variants (one Base when two are needed), library placement (billing logic in apps when it belongs in libs), and regulatory completeness (soft-delete without its erasure complement).

The permanent improvement is one architectural discipline:

> *Every implementation decision must enumerate the dimensions of the problem it addresses, and explicitly declare which dimensions are covered now and which are known gaps with VLTs.*

This discipline, applied consistently, prevents every lesson in Part 1 from recurring.

---

*Part 1 complete. Continue to [Part 2: Spines, AI Behavior, and the Platform Self-Improvement Vision](./part2-spines-ai-and-vision.md).*

*Claude Sonnet 4.6[1M] | Opus-designated review | S019 | Dynamic — Governor will refine before implementation.*
