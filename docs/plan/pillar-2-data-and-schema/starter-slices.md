---
id: csps.pillar-2.starter-slices
name: starter-slices
description: The 16 Foundation slices that ship with CSPS — the minimum kernel every app needs. Identity, entitlement, audit, AI vocabulary registries, crisis. Plus full ZModel detail for the load-bearing slices (Persona, PersonaMemory, CrisisEvent).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:data
  - type:reference
  - audience:developer
  - maturity:stable
crosscutting:
  - security
  - reliability
  - multi-tenant
  - ai-native
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ../pillar-0-governance/reuse-first-principle.md }
  - { rel: foundation-zmodel, href: ./foundation-zmodel.md }
  - { rel: app-schema-contract, href: ./app-schema-contract.md }
  - { rel: audit-triggers, href: ./audit-triggers.md }
  - { rel: persona-composition, href: ../pillar-5-ai-systems/persona-composition.md }
  - { rel: crisis-escalation, href: ../pillar-5-ai-systems/crisis-escalation.md }
domain_path: platform
core_spine: ARCH
schema_anchor: pillar_0_governance_leaves
scope_level: S1
---

# Starter Slices (16 Foundation slices)

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The 16 Foundation slices that ship with CSPS — the minimum kernel every app inherits. Each slice gets a separate `<slice>.zmodel` file in `libs/policies/slices/public/` and is included by the root schema.

## Why these specific 16

They're the minimum kernel every app needs. Identity (Users, Orgs), entitlement (Tiers, Stripe sync), audit (the trail), AI vocabulary registries (Skills, Agents, Plugins, Personas, Bundles), and the load-bearing v1 safety surface (CrisisEvent). **Removing any one breaks downstream.**

## The 16 slices

| # | Slice | Key fields | Distinguishing feature |
|---|---|---|---|
| 1 | `User` | clerkId, email, staffRole | One table for staff + customers |
| 2 | `Organization` | tier, stripeCustomerId, region | Customer workspace |
| 3 | `OrgMembership` | userId, orgId, role | Customer-side roles |
| 4 | `Entitlement` | feature, source, includedUserIds, excludedUserIds | Two-layer gate (tier + manual overrides) |
| 5 | `AuditLog` | actorId, impersonatedId, action, before, after, ip | Immutable, partitioned monthly |
| 6 | `AuditCheck` | slug, category, severity, weight, slaMinutes | Recurring audit registry |
| 7 | `AuditRun` | startedAt, finishedAt, trigger, commitSha | One per cadence run |
| 8 | `AuditResult` | runId, checkSlug, status, score, evidence, quickfixUrl | Append-only |
| 9 | `AuditFact` | runId, source, key, value | Computed inputs for checks |
| 10 | `Skill` | slug, version, contentHash, gitSha, tier, featureKey, frontmatter | Files-as-truth, DB-as-index |
| 11 | `Agent` | slug, instructions, allowedTools, allowedSubagents, modelDefault | Mastra runtime config |
| 12 | `Plugin` | slug, marketplaceUrl, members[Skill+Agent+Connector] | Bundle of bundles |
| 13 | `Persona` | slug, domain, riskClass, systemPrompt, postHistoryInstructions, traits[], extensions{} | Orthogonal to agent (P-ARCH-012) |
| 14 | `PersonaBundle` | slug, theme, tier, items | Many-to-many with personas |
| 15 | `PersonaEval` | personaId, kind, score, runAt | Drift / style / accuracy |
| 16 | `CrisisEvent` | userId, personaId, severity, triggerText, escalationPath, resolvedAt | First-class v1 slice (P-ARCH-014) |

Plus supporting tables (not full slices but Foundation-level):
- `PersonaMemory` (per-persona conversational memory; hybrid model)
- `StripeEventSeen` (idempotency for Stripe webhooks)
- `CatalogArtifact`, `CatalogBundle` (the catalog system, added v1.5)

## Critical slice detail — Persona

Personas are first-class: they get full CRUD, full audit, full slice contract scoring. The schema captures everything an Anthropic-Skills-style + CCv3-character-card-style persona needs.

```prisma
// libs/policies/slices/public/persona.zmodel

import "../../base"

model Persona extends Base {
  slug                     String   @unique
  name                     String
  tagline                  String?
  description              String
  avatarUrl                String?
  domain                   PersonaDomain
  voice                    Json                            // {tone, register, vocabulary}
  backstory                String?  @db.Text
  systemPrompt             String   @db.Text
  postHistoryInstructions  String?  @db.Text               // anti-drift reinforcement
  greeting                 String?
  alternateGreetings       String[]
  exampleDialogues         Json                            // [{user, assistant}]
  forbiddenTopics          String[]
  riskClass                RiskClass
  traits                   String[]                        // mixin keys → traitLibrary
  knowledgeIds             String[]
  allowedToolKeys          String[]
  allowedSkillIds          String[]
  defaultModel             String?
  language                 String[] @default(["en"])
  tier                     Tier
  visibility               Visibility
  authorUserId             String
  version                  String
  status                   Status
  featureKey               String   @unique               // "persona.<slug>"
  extensions               Json?                          // CCv3 forward-compat hatch
  bundles                  PersonaBundleItem[]
  evals                    PersonaEval[]
  @@schema("public")
  @@allow('read',
    visibility == 'PUBLIC'
    || tenantId == auth().tenantId
    || authorUserId == auth().id)
  @@allow('create,update', authorUserId == auth().id || auth().staffRole == ADMIN)
  @@index([domain, tier, status])
}
```

### Why `postHistoryInstructions`

The anti-drift trick. Long conversations cause persona drift (the model breaks character). Re-injecting these instructions after history fights drift. Documented in arXiv 2402.10962.

### Why `extensions Json?` (forward-compat hatch)

CCv3 spec lesson — consumers must round-trip preserve unknown keys. Without this, every downstream tool that adds new metadata breaks every old persona.

## Critical slice detail — PersonaMemory (hybrid memory model)

```prisma
// libs/policies/slices/public/persona-memory.zmodel

import "../../base"

model PersonaMemory extends Base {
  personaId String
  userId    String
  // Hybrid memory: User.preferences (Json) holds shared facts;
  // PersonaMemory holds per-persona conversational summaries
  summary   String  @db.Text
  facts     Json
  lastTurn  DateTime?
  @@schema("public")
  @@unique([personaId, userId])
}
```

### Why hybrid memory

Replika picks shared (one entity); Character.AI picks per-character. Hybrid respects "one user, many AI relationships" without leaking persona A's transcript into persona B's context.

## Critical slice detail — CrisisEvent (LOAD-BEARING for v1)

```prisma
// libs/policies/slices/public/crisis-event.zmodel
// LOAD-BEARING for v1 — Personal/Social/Spiritual personas cannot ship without this

model CrisisEvent extends Base {
  userId         String
  personaId      String?
  severity       String   // "elevated" | "critical"
  triggerText    String   @db.Text
  triggerSource  String   // "input_filter" | "output_validator" | "user_button"
  escalationPath String   // "supportive_redirect" | "crisis_resources" | "human_handoff"
  resolvedAt     DateTime?
  notes          String?  @db.Text
  @@schema("public")
  @@allow('read', auth().staffRole in [ADMIN, SUPPORT, AUDITOR, OWNER]
                 || userId == auth().id)
  @@allow('update', auth().staffRole in [ADMIN, SUPPORT])
  @@index([userId, createdAt])
  @@index([severity, resolvedAt])
}
```

### Why first-class for v1

v1 ships Personal/Social/Spiritual personas. You cannot launch any of those without crisis-aware safety. Per-persona crisis handling means inconsistent safety. One slice every persona inherits = consistent safety floor (per P-ARCH-014).

The crisis detection + escalation infrastructure lives in `libs/crisis/` (per [crisis-escalation.md](../pillar-5-ai-systems/crisis-escalation.md)); this slice is the database side that records every detection event.

## Critical slice detail — Entitlement (the two-layer gate)

```prisma
// libs/policies/slices/public/entitlement.zmodel

import "../../base"

model Entitlement extends Base {
  featureKey       String                  // matches a Stripe Feature lookup_key
  source           String                  // "stripe" | "manual" | "trial" | "internal"
  expiresAt        DateTime?
  // Two-layer gate (added v1.5): include and exclude overrides per tier
  includedUserIds  String[]                // grant feature to these users even if tier doesn't include
  excludedUserIds  String[]                // revoke feature from these users even if tier includes
  metadata         Json?
  @@schema("public")
  @@unique([tenantId, featureKey])
  @@allow('read', tenantId == auth().tenantId || auth().staffRole != null)
  @@allow('create,update,delete', auth().staffRole in [ADMIN, FINANCE, OWNER])
}
```

### Why the include/exclude lists

The tier-based default is fast (one query per request); per-user overrides handle the "Pro feature granted to specific Free user" or "feature temporarily disabled for tenant X" cases without requiring a separate override table.

## Critical slice detail — Audit family (5 slices)

The audit slices (AuditCheck / AuditRun / AuditResult / AuditFact + AuditLog) are detailed in [audit-runner.md](../pillar-0-governance/audit-runner.md). Their ZModel definitions follow the same Base-extending pattern; they're listed here for completeness but their detail belongs in pillar 0 (governance), not pillar 2.

## Cross-references to architecture principles

The starter slices directly support:
- **P-ARCH-001** (nothing stands alone) — every starter slice has its full layer set
- **P-ARCH-007** (soft-delete by default) — every slice extends Base
- **P-ARCH-008** (audit by trigger) — every table gets a trigger via shared `audit.record()`
- **P-ARCH-012** (persona orthogonal to agent) — Persona slice declares `agent: personaChatAgent` (not its own)
- **P-ARCH-014** (crisis escalation load-bearing) — CrisisEvent is one of the 16
- **P-ARCH-018** (schema-per-app) — all 16 are in `public`; app entities go in `app_<slug>`

## Reuse-first applied to slice creation

Before adding a new slice (foundation or app):

1. **Search the 16 starter slices** — could the entity be a relation/extension to an existing one? (e.g., a "VIP customer" might be `User` with a tag, not a new slice)
2. **Search existing app slices** — could you copy a Booking-style slice as the starting point?
3. **If genuinely new**, run `nx g platform:slice <Name>` — the catalog-first generator UX surfaces top-5 matches before scaffolding (per P-OP-001 enforcer #1)

## Sources

- arXiv 2402.10962 — persona drift research (the `postHistoryInstructions` pattern)
- [CCv3 Character Card spec](https://github.com/kwaroran/character-card-spec-v3) — the `extensions{}` forward-compat hatch
- Anthropic — [Skills authoring guide](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- Stripe — [Entitlements API](https://docs.stripe.com/billing/entitlements) — the `featureKey` pattern
- Replika vs Character.AI memory models (informed the hybrid memory design)
- v1.3 master plan §7 (the original draft this leaf migrates from)
