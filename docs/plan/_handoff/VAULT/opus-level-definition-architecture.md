---
id: csps.handoff.vault.opus-level-definition-architecture
name: opus-level-definition-architecture
description: >
  Deep analysis of how CSPS defines between levels (constitutional → platform → app → tenant → user).
  Five-persona Opus review. Current fragmentation documented. Unified Scope Model (USM) proposed.
  External platform research included. S028 Zero-Laptop incident used as the diagnostic case.
  Prepared by Sonnet S028 under Governor directive.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, VALD, OPER]
schema_anchor: opus_consultations
diataxis_type: explanation
session: S028
tags:
  - domain:governance
  - domain:architecture
  - type:reference
  - audience:ai-agent
  - maturity:draft
links:
  - { rel: related, href: ./opus-srof-schema-and-spines-review.md }
  - { rel: incident, href: ../../../docs/plan/apps/budget-planner/gate-3-validation.md }
  - { rel: platform-layers, href: ../../../tools/config/platform-layer-boundaries.yaml }
  - { rel: core-manifest, href: ../../pillar-0-governance/csps-core-manifest.md }
---

# Level Definition Architecture — Opus Deep Review
## Diagnostic: S028 Zero-Laptop Incident | Governor Directive | Five-Persona Analysis

> **For Opus:** The S028 Gate 3 incident revealed a structural gap: CSPS has no unified model
> for "what level does this belong to?" The AI defaulted to a local development pattern
> (pnpm dev + .env.local) — a Level 2 (app-specific) operation — when the principle at play
> was Level 0 (constitutional: zero-laptop). No interception existed.
>
> **The Governor's question:** How does CSPS define between levels? How is it monitored?
> How does it live in planning/implementing/validating/auditing? What vocabulary does it have?
> Can existing systems (depth levels, Core Spine layers, platform layers) be consolidated?

---

## The Diagnostic Incident — Root Cause at Level

**S028 Gate 3:** AI guided Governor to create `.env.local` + run `pnpm dev` on `localhost`.

**Level analysis of the failure:**

```
The principle violated: B_ZERO_LAPTOP_DEPENDENCY
  Scope: CONSTITUTIONAL (applies to every app, session, developer, forever)
  Level: S0 — cannot be overridden by app-level context
  
The pattern the AI applied: "Next.js developer needs to test locally"
  Scope: APP-SPECIFIC developer workflow assumption
  Level: S2 — applies to a specific dev context, not to CSPS
  
The failure: S2 assumption overrode S0 principle
  Why: No vocabulary said "this is an S0 principle being violated by an S2 assumption"
  Why: No validator fired at the moment the wrong-level pattern was applied
  Why: No planning gate checked scope level alignment
```

**If a Unified Scope Model existed:** The moment the AI was about to write `.env.local` into a procedure doc, the validator would say: "This is an S2 (app-specific) pattern. B_ZERO_LAPTOP_DEPENDENCY is S0 (constitutional). S0 overrides S2. BLOCKED."

---

## The Fragmentation Problem — Five Level Systems, Zero Unification

CSPS currently has **five parallel, incompatible level systems**:

### System 1 — Core Spine Layers (for GOVERNANCE artifacts)
```
L0: csps-core-manifest.md (root doctrine)
L1: L1_CORE_{SPINE}.md × 5 (sealed, constitutional)
L2: L2_DOMAIN_{SPINE}_{DOMAIN}.md × 17 (domain decomposition)
L3: L3_INSTANCES_{SPINE}.md × 5 (instance registries)
L4/L5: Defined in manifest, no files exist
```

### System 2 — Platform Layer Boundaries (for CODE placement)
```
L0: Platform Core (libs/, tools/, docs/, packages/)
L1: Developer Surface (apps/*/src/)
L2: User Surface (user-facing routes, API endpoints)
```

### System 3 — Bedrock Layers (for FOUNDATION maturity)
```
Layer 1: Governance Core
Layer 2: Schema Security Core
Layer 3: Auth + Billing Core
Layer 4: App Template Core
Layer 5: Build Methodology Core
```

### System 4 — Depth Semantics (for PLAN complexity)
```
depth_chosen ∈ {3,4,5} — how many layers the plan spans
file_depth_markers — L1/L2/L3 line ranges within a file
depth_levels_invoked — which DNA element depths are used
depth_tier_authored — l1_essence / l2_detail / l3_deep_dive
depth_tier — governance artifact tier
```

### System 5 — Spine Outward Layers (for SPECIALIZATION)
```
Defined in csps-core-manifest.md, different per spine:
GVRN outward: L1 (per-pillar AI rules) → L2 (per-skill AAP) → L3 (per-feature) → L4 (per-app) → L5 (per-customer-tier)
```

**The collision:** "L2" means three different things:
- Core Spine: a domain decomposition document
- Platform Layers: developer surface code
- Depth Semantics: authoring detail tier
- Spine Outward: per-skill AAP frontmatter

**No participant can answer "what level is this?" unambiguously.**

---

## External Platform Research — How Others Solve This

### Salesforce (multi-tenant SaaS platform, analogous to CSPS)

| Level | Name | What lives here | Amendment mechanism |
|---|---|---|---|
| 0 | Platform Core | Infrastructure, kernel | Salesforce release cycle |
| 1 | Org | Customer instance | Org admin (system settings) |
| 2 | App | Installed app/package | Package install, AppExchange |
| 3 | Object | Custom object/data type | Schema builder, API |
| 4 | Record | Individual data record | CRUD API |
| 5 | Field | Individual value | API update |

**Key pattern:** Each level has a DISTINCT NAME, a specific TOOL for modification, and a clear PERMISSION MODEL. You cannot confuse an Org with an Object.

### Kubernetes (similar multi-tenant infra)

| Level | Name | Amendment | Boundary |
|---|---|---|---|
| 0 | Cluster | kubectl cluster-admin | Hard infrastructure |
| 1 | Namespace | kubectl (namespace-scoped) | Soft multi-tenancy |
| 2 | Pod | kubectl (pod controller) | Process isolation |
| 3 | Container | Docker/OCI | Runtime isolation |
| 4 | Process | OS process table | Memory isolation |
| 5 | Request | Network packet | Ephemeral |

**Key pattern:** The level defines the TRUST BOUNDARY and the ROLLBACK MECHANISM. Cluster changes require cluster admin + are expensive to reverse. Pod changes are cheap and reversible.

### Linux Kernel (oldest, most mature level model)

```
Ring 0: Kernel (unrestricted access, constitutional)
Ring 1: OS Services (restricted kernel access)
Ring 2: Device Drivers (controlled access)
Ring 3: User space (no direct hardware access)
```

**Key pattern:** Levels are ENFORCED BY HARDWARE, not convention. A Ring 3 process physically cannot execute Ring 0 instructions. This is the gold standard — the level boundary is structural, not behavioral.

### What All Successful Platforms Have in Common

1. **One vocabulary** — participants share the same words for the same concepts
2. **Hardware/structural enforcement** — not convention-based
3. **Clear amendment mechanism per level** — you know exactly how to change something at each level
4. **Clear monitoring per level** — different dashboards, validators, alerts per level
5. **Inheritance is explicit** — lower levels inherit from higher levels through defined mechanisms, not assumptions

**CSPS Gap:** We have fragmented vocabularies, behavioral-only enforcement for most levels, and no clear amendment mechanism for the intermediate levels.

---

## Five-Persona Analysis

### Persona 1 — The Consolidation Auditor

**Finding: Four of the five systems can be consolidated. One must remain separate.**

**The Depth Semantics (System 4) must remain separate.** Depth = plan complexity dimension. It's orthogonal to scope level. A constitutional-scope plan (S0) can be depth-3 or depth-5. Don't conflate them.

**Systems 1, 2, 3, 5 are all describing the same thing** — the scope/universality of an artifact — but in four incompatible vocabularies. Consolidation target: **one `scope_level` field replacing all four**.

**Proposed mapping:**

| Current | → | Unified (S0-S5) |
|---|---|---|
| Core Spine L0/L1 (sealed) | → | S0: Constitutional |
| Core Spine L2 (domain) | → | S1: Platform-wide |
| Core Spine L3 (instances) | → | S2: App-scope |
| Platform Layer L0 (core code) | → | S1: Platform-wide |
| Platform Layer L1 (app code) | → | S2: App-scope |
| Platform Layer L2 (user routes) | → | S3: Tenant-scope |
| Bedrock Layers 1-3 (constitutional) | → | S0: Constitutional |
| Bedrock Layers 4-5 (platform) | → | S1: Platform-wide |
| Spine Outward L1-L2 | → | S1-S2 |
| Spine Outward L3-L4 | → | S2-S3 |
| Spine Outward L5 | → | S4: User-scope |

---

### Persona 2 — The Architectural Reviewer

**Finding: The real problem is not vocabulary, it's enforcement architecture.**

The Zero-Laptop incident happened because:
1. No query: "what scope is B_ZERO_LAPTOP_DEPENDENCY?" → S0
2. No query: "what scope is 'run pnpm dev on localhost'?" → S2 developer workflow
3. No rule: "S2 assumptions cannot override S0 principles"
4. No mechanical check: "this procedure doc invokes an S2 pattern but the principle is S0"

**The enforcement architecture needed:**

```
For every decision, the AI must be able to declare:
  principle_scope: S0          ← what level the governing principle is at
  action_scope: S2             ← what level the action operates at
  
Violation condition: action_scope > principle_scope
  (lower-level action cannot override higher-level principle)
  
Enforcement: validate-scope-conflict.mjs
  Scans procedure docs for scope conflicts
  BLOCKING: action_scope > principle_scope for constitutional principles
```

---

### Persona 3 — The Vocabulary Designer

**The Unified Scope Vocabulary (6 levels):**

| Scope | Name | Definition | Examples | Amendment | Validator |
|---|---|---|---|---|---|
| S0 | Constitutional | Cannot change without re-grounding the whole platform | B_ZERO_LAPTOP_DEPENDENCY, tenant isolation, audit trail | ADR + Opus + Governor | validate-spine-hierarchy.mjs |
| S1 | Platform-wide | Applies to all apps, not all contexts | libs/policies/, shared auth pattern, API design convention | PCR + Governor | validate-layer-boundary.mjs |
| S2 | App-scope | Applies to one SaaS app | apps/budget-planner/, budget categories, transaction schema | Within-app PCR | (to build) |
| S3 | Tenant-scope | Applies to one customer within an app | Tenant config, billing tier, custom domain | Admin API | (to build) |
| S4 | User-scope | Applies to one user within a tenant | Notification prefs, display settings, GDPR scope | User-facing API | (to build) |
| S5 | Session-scope | Applies to one request/interaction | JWT claims, rate limiting, context | Real-time | (to build) |

**In frontmatter:** `scope_level: S0 | S1 | S2 | S3 | S4 | S5`

**In AI self-check (Virtual Opus Audit Q6 complement):**
> "Before suggesting any implementation step: what scope level is this? What scope level is the governing principle? If implementation scope > principle scope: STOP. I am about to put a constitutional principle in a local corner."

---

### Persona 4 — The Scale Projector

**At 30 apps, the fragmentation becomes catastrophic.**

Currently: 5 level systems × 1 app = manageable
At 30 apps: 5 level systems × 30 apps = 150 different "levels" that AI must track

Specific 30-app failure modes:
1. Developer adds authentication logic to `apps/crm/src/lib/auth.ts` that belongs in `libs/integrations/clerk/` → scope S2 artifact containing S1 logic
2. AI writes a procedure doc for "how to deploy CRM" that uses `pnpm dev` → S2 procedure violates S0 principle
3. A tenant configuration schema is placed in the shared database model → S3 data in S1 code
4. A user preference flag is stored in the JWT (session) instead of the database → S4 data treated as S5

**None of these would be caught without a unified scope validation system.**

---

### Persona 5 — The Devil's Advocate

**Pushback: Don't add another system. Replace.**

The Governor's instinct is correct. The problem is five systems, not zero. Adding `scope_level: S0-S5` as a SIXTH system is wrong. The fix requires:

1. **Replace** `file_depth_markers` L1/L2/L3 with `scope_level` for governance artifacts
2. **Replace** Platform Layer L0/L1/L2 with `scope_level` for code placement rules
3. **Consolidate** Bedrock Layers into `scope_level` descriptions in csps-bedrock.md
4. **Keep** Depth Levels 1-5 for plans (orthogonal, not replaceable)

**The consolidation IS the ADR.** Adding scope_level without retiring the old systems makes the fragmentation worse. This needs:
- ADR-0027: Unified Scope Model — retires Systems 1, 2, 3, 5 in favor of scope_level: S0-S5
- Migration: backfill `scope_level` on all governed artifacts
- Validator: `validate-scope-level.mjs` — checks every artifact has `scope_level` and that it's consistent with file placement

---

## How Scope Level Lives in Each Platform Activity

### In PLANNING (gradual-build-plan)
**Current:** §0 Triad Check — declares L2 spine domain (which spine governs)
**Missing:** declares scope_level of decisions being made
**Enhancement to §0:** Add mandatory `decision_scope: S0|S1|S2` field
Rule: S0-scoped plans require Opus ratification. S1 require Governor. S2 are autonomous.

### In IMPLEMENTING (code + docs)
**Current:** validate-layer-boundary.mjs checks code placement
**Missing:** no check that the scope declared in frontmatter matches the file location
**Enhancement:** validate-scope-level.mjs — does S1-declared artifact live in libs/? Does S2-declared artifact live in apps/{app}/?

### In VALIDATING (pnpm verify)
**Current:** validate-spine-hierarchy.mjs (structural), validate-laptop-patterns.mjs (pattern)
**Missing:** validate-scope-conflict.mjs — detects S2 implementations of S0 principles
**Enhancement:** Wire into verify.mjs. BLOCKING for scope conflicts.

### In AUDITING (audit-runner.md)
**Current:** Pipeline audits check individual attributes
**Missing:** No pipeline that checks scope level consistency
**Enhancement:** New audit pipeline "Scope Level Compliance" — QH question: "All artifacts declare scope_level?"

### In AI BEHAVIOR (inner-defaults)
**Current:** reasoning-local-dev-default (added S028)
**Missing:** General "scope level awareness" pre-action self-check
**Enhancement:** New inner-defaults entry `reasoning-scope-level-awareness` — before any action, declare: principle scope / action scope / conflict check.

---

## The Vocabulary — Complete Glossary

| Term | Scope | Meaning | Code location | Governance artifact |
|---|---|---|---|---|
| Constitutional | S0 | Cannot change without platform re-grounding | libs/core/ (to create), libs/policies/ | L1 sealed spine files |
| Platform-wide | S1 | Applies to all 30 apps | libs/integrations/, libs/policies/ | L2 domain files |
| App-scoped | S2 | Applies to one SaaS product | apps/{app}/src/ | L3 instance files, app plans |
| Tenant-scoped | S3 | Applies to one customer organization | apps/{app}/src/app/api/* (with tenantId gate) | Tenant config schema |
| User-scoped | S4 | Applies to one person within a tenant | apps/{app}/src/app/(user)/* | User preference schema |
| Session-scoped | S5 | Applies to one request/interaction | Middleware, JWT | Rate limit, JWT claim |

**Forbidden patterns per scope:**

| Action | Permitted scope | Violation when... |
|---|---|---|
| Storing secrets in local files | S2+ (temporary) | Always — use Vercel env vars (cloud = S1) |
| Running local dev server | S2 (dev workflow) | When testing S0/S1 functionality |
| Hardcoding tenant ID | S3 | When placed in S1 (shared) code |
| Storing user prefs in JWT | S5 | User prefs are S4 (should persist) |
| Placing constitutional logic in app code | S2 | B_ZERO_LAPTOP is S0, must live in S0 enforcement |

---

## Consolidation Proposal — The USM (Unified Scope Model)

### What to BUILD (Session B/C):

**1. `validate-scope-level.mjs`** (PE=78)
- Every governed artifact with frontmatter must declare `scope_level: S0|S1|S2|S3|S4|S5`
- File placement must match scope: S0/S1 → libs/, packages/, .claude/; S2 → apps/{app}/
- BLOCKING for misplacement; ADVISORY for missing declaration

**2. `validate-scope-conflict.mjs`** (PE=75)
- Scans procedure docs and plans for scope conflicts
- When a document references an S0 principle AND proposes an S2 action: FLAG
- The Zero-Laptop incident would have been caught here

**3. ADR-0027: Unified Scope Model** (PE=72, needs Opus ratification)
- Retires: Platform Layer Boundaries L0/L1/L2 (replaced by scope_level field)
- Retires: Core Spine L4/L5 outward layers description (replaced by scope_level S3-S5)
- Consolidates: Bedrock Layers 1-5 → scope_level S0-S1 descriptions
- Keeps: Depth Levels 1-5 (orthogonal, NOT scope, not replaced)

**4. `scope_level:` frontmatter field** (PE=65)
- Add to frontmatter-closed-enums.md as closed enum: S0 | S1 | S2 | S3 | S4 | S5
- Add to governed-artifact-frontmatter.template.md
- Backfill via script (similar to core_spine backfill S027/S028)

### What to RATIFY (Opus):

Three constitutional questions:

**Q1:** Is the Unified Scope Model (S0-S5) a correct replacement for the four fragmented systems, OR does consolidation lose information the platform needs?

**Q2:** Should `scope_level` be a single-value field (primary scope) or a range (minimum/maximum)? Example: does a libs/integrations/ file that can be used at any scope declare S1 or S0-S5?

**Q3:** The ADR-0027 retires Platform Layer L0/L1/L2 from platform-layer-boundaries.yaml. Does validate-layer-boundary.mjs still need to exist, or is validate-scope-level.mjs a full replacement?

---

## One Sentence for Opus

**SROF-009 (new):** CSPS has five fragmented level systems (Core Spine L0-L5, Platform Layers L0-L2, Bedrock Layers 1-5, Depth Semantics, Spine Outward L1-L5) that all describe scope/universality but in incompatible vocabularies — the S028 Zero-Laptop incident (AI applied S2 dev pattern to S0 principle, no interception existed) is the diagnostic proof — we propose the Unified Scope Model (USM) replacing four of the five systems with `scope_level: S0-S5` and a new validator `validate-scope-conflict.mjs` that catches when lower-scope implementations override higher-scope principles — but consolidation of four systems requires ADR-0027 which is constitutional, and three questions need Opus ratification before Sonnet implements.

---

*Prepared by Sonnet S028 | Five-persona analysis | Pending Opus SROF-009 review*
*Diagnostic: S028 Gate 3 Zero-Laptop incident*
*Platform state at preparation: 100 validators | 88% health | pnpm verify exit_code=0*
