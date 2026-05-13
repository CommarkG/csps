---
id: csps.pillar-3.catalog-bundle-system
name: catalog-bundle-system
description: The catalog + bundle indexing pipeline — bundle.yaml format with 4 kinds (Bundle / View / Template / Pack), indexing pipeline, AI retrieval (metadata filter → hybrid search → cross-encoder rerank), MCP resource exposure. Single source of truth for what exists in CSPS that AI assistants and generators can search. Migrated from v1.3 §11.7.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - performance
  - ai-native
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: registry, href: ../../../packages/principles/principles.yaml }
  - { rel: frontmatter, href: ../pillar-1-architecture-and-stack/frontmatter-standard.md }
domain_path: platform
core_spine: ARCH
schema_anchor: pillar_0_governance_leaves
---

# Catalog & Bundle System

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The catalog indexing pipeline + bundle manifest format that powers reuse-first across CSPS. Every artifact is indexed; every AI assistant queries the catalog before proposing creation; every generator runs catalog-first search before scaffolding.

## Why this exists

P-OP-001 reuse-first depends on AI being able to FIND what exists. Without a queryable catalog, "check what exists" devolves into manual `grep` (high friction; AI defaults to creating new). The catalog is the mechanical foundation of reuse-first.

## The catalog data flow

```
Source artifacts (slices / skills / personas / templates / docs / ADRs)
              │
              │ (frontmatter parser walks all)
              ▼
   tools/catalog/ingest.ts
              │
              ▼
   packages/catalog/catalog.json (the index)
              │
              ├──→ MCP resource (principles-mcp serves it)
              ├──→ Generator search (nx g platform:* queries it)
              ├──→ AI search (Claude Skill / PreToolUse hook)
              └──→ Bundle resolution (bundle.yaml manifests)
```

## Bundle format — 4 kinds

Bundles are ratified groupings. `bundle.yaml` files declare them.

### Kind: `Bundle` (catch-all curated set)

```yaml
kind: Bundle
id: csps.bundles.starter-personas
name: starter-personas
description: 8 starter personas for CSPS v1
items:
  - csps.public.persona.crisis-detector
  - csps.public.persona.welcome-greeter
  - csps.public.persona.feedback-collector
  - ...
```

### Kind: `View` (filtered query)

```yaml
kind: View
id: csps.views.tier-business-or-above
name: tier-business-or-above
description: All artifacts available at Business tier or above
query:
  match:
    tier:
      gte: business
```

Views are computed at query-time; not materialized.

### Kind: `Template` (page template registration)

```yaml
kind: Template
id: csps.templates.entity-list
name: entity-list
description: Paginated entity-list page template
component_path: packages/templates/entity-list/index.tsx
ai_prompt_template: packages/templates/entity-list/ai-prompt.md
```

### Kind: `Pack` (feature pack — group of slices for an app)

```yaml
kind: Pack
id: csps.packs.bookings-starter
name: bookings-starter
description: Starter slices for booking-style apps
slices:
  - csps.app-bookings.entity.reservation
  - csps.app-bookings.entity.customer
  - csps.app-bookings.entity.appointment-type
```

## The indexing pipeline

### 1. Walk source

`tools/catalog/walk.ts` walks:
- `apps/*/app/**` for pages + components
- `libs/policies/slices/**/*.zmodel` for entities
- `packages/skills/*/SKILL.md` for skills
- `libs/personas/**` for personas
- `packages/templates/*/template.yaml` for templates
- `docs/plan/**/*.md` for docs
- `docs/adr/*.md` for ADRs
- `**/bundle.yaml` for bundles

### 2. Parse frontmatter

For each artifact: extract per `pillar-1/frontmatter-standard.md` + variants resolution.

### 3. Generate embeddings (optional, for hybrid search)

`tools/catalog/embed.ts` uses local embedding model (or OpenAI text-embedding-3-small) to embed `description` + `tags`. Stored in `packages/catalog/embeddings.bin`.

### 4. Build inverted index

For fast metadata filtering: `tag:domain:billing`, `type:skill`, `tier:business`, etc.

### 5. Emit `catalog.json`

The single source-of-truth. Schema:

```json
{
  "version": "1.0",
  "generated_at": "...",
  "artifacts": [
    {
      "id": "csps.app-bookings.entity.reservation",
      "name": "reservation",
      "description": "...",
      "tags": ["app:bookings", "domain:bookings", "type:schema", ...],
      "path": "libs/policies/slices/app-bookings/reservation.zmodel",
      "frontmatter": { ... },
      "embedding_idx": 42
    },
    ...
  ],
  "bundles": [...],
  "indices": {
    "by_tag": {...},
    "by_kind": {...},
    "by_pillar": {...}
  }
}
```

## AI retrieval — 3 stages

### Stage 1: Metadata filter

User query: "create a booking entity". AI's first call: filter catalog to `kind: schema` + `domain: bookings` (or related). Returns ~20 candidates.

### Stage 2: Hybrid search

Combines:
- BM25 keyword score (the description text)
- Cosine similarity on embeddings

Returns top-50 ranked.

### Stage 3: Cross-encoder rerank

Cross-encoder (small model) reranks top-50 → top-5 by query-document relevance. Returns top-5 with scores.

The 3-stage pipeline is the production-tested RAG pattern (Cohere Rerank / SBERT cross-encoders).

## MCP resource exposure

`packages/principles-mcp/src/resources.ts` exposes:
- `catalog://search?query=...` — runs the 3-stage pipeline
- `catalog://by-id/{id}` — fetches single artifact
- `catalog://by-bundle/{bundle-id}` — resolves bundle items
- `catalog://reuse-check?artifact-spec=...` — for reuse-first generator

Every Mastra agent + every Claude Code session connects to the same MCP server; same catalog every consumer.

## Catalog freshness

- **PR-time:** changed frontmatter triggers `catalog:rebuild` action; commit includes regenerated `catalog.json`. CI fails on drift.
- **Nightly:** full rebuild from filesystem; flags orphan-files (not in catalog) + stale-references (in catalog but file deleted).
- **On-demand:** admin can `pnpm catalog:rebuild` to force.

## Anti-patterns

1. **Stale catalog** — fix: codegen-fresh check at PR.
2. **Artifacts not in catalog** — fix: orphan-file-detection audit (weekly).
3. **AI bypass of catalog** — fix: PreToolUse hook for Write blocks creation without catalog query trace; AI prompt addendum requires `enhances:` or `created-new-because:` field.
4. **Catalog reads at runtime in customer-facing code** — fix: catalog is BUILD-TIME index for AI/generators only; customer code uses tRPC / DB directly.

## Enforcement

- `principles.yaml#P-OP-001` (reuse-first) — catalog is the searchable substrate
- `principles.yaml#P-ARCH-024` (small-files-ok-iff) — preconditions (b) + (c) require catalog index
- `audit-runner.md#orphan-file-detection`
- `audit-runner.md#catalog-coverage`

## Sources

- [pillar-1/frontmatter-standard.md](../pillar-1-architecture-and-stack/frontmatter-standard.md)
- [pillar-0/reuse-first-principle.md](../pillar-0-governance/reuse-first-principle.md)
- [Cohere Rerank](https://cohere.com/rerank)
- [Anthropic Skills RAG router](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [SBERT cross-encoders](https://www.sbert.net/examples/applications/cross-encoder/README.html)
