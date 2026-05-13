---
id: csps.pillar-1.frontmatter-standard
name: frontmatter-standard
description: The mandatory frontmatter schema every CSPS artifact carries. Required fields, 8 closed dimensions (Zod-validated), per-file-type encoding (YAML / JSDoc / ZenStack @@meta), the variants cascading-defaults pattern, the build-time validator. Enables governance scoring, AI retrieval, multi-dimensional bundling.
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
  - observability
  - reliability
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ../pillar-0-governance/reuse-first-principle.md }
  - { rel: vocabulary, href: ./vocabulary.md }
  - { rel: catalog, href: ../pillar-3-platform-services/catalog-bundle-system.md }
domain_path: platform
core_spine: ARCH
schema_anchor: pillar_0_governance_leaves
---

# Universal Frontmatter Standard

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The mandatory metadata block every CSPS artifact carries. Required fields, closed-enum dimensions, per-file-type encoding, validation, the variants cascading-defaults pattern.

## Why this exists

Every artifact in CSPS — every file, schema, skill, doc, persona — needs machine-validated metadata. This is what enables:

- **Governance scoring** (the slice contract reads frontmatter)
- **Semantic retrieval** (catalog indexes by tags + tag-tuples)
- **Multi-dimensional bundling** (View queries match by tag + maturity + tier)
- **AI agent context-loading** (Claude/Cursor decide what to load via frontmatter)

Without it, the codebase is a black box: AI assistants can't find what they need, the audit can't score completeness, the bundle/view system has nothing to query.

The pattern is borrowed from **Anthropic Skills** (the agentskills.io spec) + **Backstage entities** (`catalog-info.yaml`) + **Astro Content Collections** (build-time Zod validation) + **Bit components** (cascading variants) + **CCv3 character cards** (forward-compat `extensions{}` hatch). Each contributed something proven; together they're complete.

## Required fields (every file)

```yaml
---
id: csps.<scope>.<entity>.<name>            # stable, dotted, globally unique
name: <kebab-name>                           # ≤64 chars, matches parent dir
description: <what + when>                   # ≤1024 chars, keywords front-loaded
version: <semver>
owner: group:<handle>                        # Backstage-style ref
lifecycle: production                        # experimental | beta | production | deprecated  (PRODUCT-STAGE)
lifecycle_state: active                      # active | pending-review | pending-protocol | promoted | resolved | deprecated  (STEWARDSHIP-STATE — P-META-004)
next_review_at: 2026-08-01                   # ISO date — REQUIRED when lifecycle_state != active
tags:                                        # see closed dimensions below
  - app:<slug>
  - domain:<value>
  - type:<value>
  - tier:<value>
  - audience:<value>
  - maturity:<value>
  - slice:<slug>
links:                                       # cross-references
  - { rel: index,   href: ./index.ts }
  - { rel: context, href: ./context.md }
metadata: {}                                 # CCv3 forward-compat hatch — preserve unknown keys
---
```

### `lifecycle` vs `lifecycle_state` (orthogonal axes — read this carefully)

These are **two distinct fields**, both required, with different meanings:

| Field | Convention | Meaning | Example |
|---|---|---|---|
| `lifecycle:` | Backstage Catalog | **Product-stage**: how mature is this artifact's underlying functionality? | `experimental` for a draft; `production` for stable; `deprecated` after EOL |
| `lifecycle_state:` | CSPS Stewardship Protocol (P-META-004) | **Stewardship-state**: what stewardship action is this artifact awaiting? | `active` for normal load-bearing content; `pending-review` for content awaiting human re-look; `pending-protocol` for input without a defined process |

A leaf doc can simultaneously be `lifecycle: production` (mature, well-trodden) AND `lifecycle_state: pending-review` (currently being reconsidered for an architectural refactor). The two axes don't overlap.

**`next_review_at` is REQUIRED when `lifecycle_state != active`.** For `active` items it's optional — the audit `active-stale` enforces a 90-day default review cadence anyway.

**Where these come from:** see [pillar-0-governance/stewardship-protocol.md](../pillar-0-governance/stewardship-protocol.md) for the full state machine, transitions, cadences, and the four enforcing audits.

### Conditional fields (added S002 turn 10 per P-META-006 Zero-Findings Discipline)

When `lifecycle_state ∈ {validated, closed}`, two additional frontmatter fields are required:

```yaml
evidence_block_ref: ./evidence/EVD-<artifact-id>-<date>.md         # RZF evidence block (cycles_run + findings_per_cycle + coverage tokens + signature)
cec_walk_trail_ref: ./walks/CEC-<artifact-id>-<date>.md            # CEC walk-trail (extracted_essence + cycles_walked + walk_scope + applications_made)
```

These point to RZF evidence-block + CEC walk-trail records. Required for any artifact transitioning into terminal state per `pillar-0-governance/zero-findings-discipline.md`. The audit `rzf-coverage` (PR-blocking, error severity, planned week 4) verifies presence; `cec-walk-trail-completeness` (PR-blocking, warn severity) verifies presence for ratified principles/leaves/ADRs/contracts.

*Why `description` capped at 1024 chars:* Anthropic's RAG router uses ONLY this field to decide whether to load a skill into context. Vague or padded descriptions mean the model never finds the skill. The cap forces front-loaded keywords ("Use when…", "Triggers on…").

*Why dotted IDs:* uniqueness across the whole catalog without long names. `csps.app-bookings.persona.crisis-detector` is shorter and more searchable than `csps_app-bookings_persona_crisis-detector_v1`.

*Why `metadata: {}` open hatch:* CCv3 spec lesson — consumers must round-trip preserve unknown keys. If you reject unknown keys, every downstream tool that adds new metadata breaks every old skill. Forward-compatibility is non-optional.

## Closed dimensions (Zod-validated)

Single source of truth: `tools/catalog/dimensions.ts`. Dimensions are closed (you cannot invent `kind:`); values are closed-but-extensible behind a PR.

*Why closed dimensions but extensible values:* pure folksonomies (open tags) decay — the KDD survey on social tagging confirms this universally. Pure controlled vocabularies block legitimate growth. The hybrid (closed dimension namespace, extensible values via PR) kills bikeshedding without freezing the system.

| Dimension | Allowed values |
|---|---|
| `app` | One of the registered app slugs (validated against `apps/*/app.json`) |
| `domain` | `billing`, `persona`, `bookings`, `auth`, `admin`, `ai`, `infra`, `shared`, `crisis`, `audit`, `governance`, `architecture`, `data`, `dx`, `ops`, `planning` |
| `type` | `feature`, `ui`, `data-access`, `util`, `schema`, `doc`, `skill`, `agent`, `bundle`, `template`, `reference`, `tutorial`, `how-to`, `explanation` |
| `tier` | `free`, `pro`, `business`, `enterprise`, `internal` |
| `audience` | `end-user`, `admin`, `developer`, `ai-agent` |
| `maturity` | `draft`, `review`, `stable`, `frozen`, `deprecated` |
| `lifecycle` | `experimental`, `beta`, `production`, `deprecated` |
| `owner` | `group:<handle>` or `user:<handle>` |

**New value process:** add to `dimensions.ts` via PR with rationale. The `metadata.proposed-tags[]` field is the escape hatch for in-flight values awaiting promotion (quarterly review, SharePoint-managed-metadata pattern).

## `descriptors[]` — open folksonomy lane (added S003 §3.5.a)

The closed-dimension/extensible-value model above is the **vocabulary discipline** lane. There is also a complementary **open folksonomy** lane, named `descriptors[]`:

```yaml
descriptors:
  - persona-spiritual
  - exemplar-handoff
  - long-tail-customer-cohort
  - pattern-discovery-validation-pass
```

### Rules for `descriptors[]`

1. **Open** — values are free-form kebab-case strings; no PR required to introduce a new one
2. **Lower-priority than tags** — search/audit/bundle queries use `tags[]` (closed) as the primary index; `descriptors[]` is an *augmenting* dimension only
3. **Quarterly promotion review** — descriptors with ≥5 occurrences across the catalog within 90 days surface as candidates for promotion to a closed-dimension value (per SharePoint managed-metadata pattern)
4. **No semantic conflicts with `tags[]`** — a descriptor cannot duplicate or conflict with a closed-enum value (`descriptors: [persona-spiritual]` is fine; `descriptors: [pillar-7]` is forbidden because `pillar` is a closed concept)
5. **Audit `descriptor-shadow-tag`** (PR-blocking, warn) — flags descriptors that look like they should be promoted to tags

### Why both lanes (the calibrated middle)

Pure closed-vocabulary blocks legitimate growth (every new term needs a PR). Pure folksonomy decays (KDD survey on social tagging). The hybrid: **closed tags for the indexed-load-bearing dimensions, open descriptors for the experimental + emergent**. Industry validation: Backstage uses Backstage tags + `metadata.annotations{}` for the same split.

### `descriptors[]` ↔ `tag-status-contract` integration

Per `_intake/tag-status-contract.md`: descriptors propagate from input → sub-extractions like inheritable tags, but inheritance is **soft** (sub-extractions may add OR remove descriptors freely; no `removed_inherited_descriptor` requirement). The hard contract belongs to closed-enum tags only.

## Cross-cutting concerns (separate field)

Frontmatter also declares cross-cutting concerns the artifact addresses:

```yaml
crosscutting:
  - security
  - reliability
  - cost
  - performance
  - observability
  - multi-tenant
  - ai-native
```

A completeness audit verifies every cross-cutting concern is addressed by at least one leaf doc per pillar.

## Diátaxis type (per-doc kind tag)

Borrowed from [Diátaxis](https://diataxis.fr/) — the 4-quadrant doc taxonomy used by Canonical, Python, Cloudflare. Every plan/doc artifact declares:

```yaml
diataxis_type: tutorial | how-to | reference | explanation
```

| Kind | Purpose | Audience need |
|---|---|---|
| Tutorial | Learning by doing | "I'm new and want to learn" |
| How-to | Solving a specific problem | "I want to accomplish X" |
| Reference | Information lookup | "What does X do?" |
| Explanation | Understanding context | "Why is X this way?" |

Most CSPS plan docs are `reference` or `explanation`. ADRs are `explanation`. Build-order is `how-to`. Bootstrap is `tutorial`.

## Reuse-first frontmatter fields

Every artifact's frontmatter must declare one of:

```yaml
enhances: csps.<scope>.<entity>.<existing>     # preferred — points to ratified artifact
# OR
created-new-because: |
  Searched catalog (query: "<terms>"); closest match is <id> but
  <reason enhancement was insufficient>.
```

`validate-frontmatter.mjs` fails CI if neither field is present. This is one of the 10 enforcers of the reuse-first principle (P-OP-001).

## Format per file type

| File type | Frontmatter mechanism | Why |
|---|---|---|
| `.md`, `.mdx` | YAML between `---` fences | Industry convention (Astro, Hugo, MDX) |
| `.ts`, `.tsx` | Leading JSDoc block with `@csps-*` tags, parsed by `tools/catalog/extract-jsdoc-meta.ts` | TypeScript doesn't natively support `---` frontmatter; JSDoc survives bundlers and is greppable; sidecar files would drift |
| `.zmodel` | `@@meta(...)` calls in the model body | ZenStack-native annotation pattern |
| `SKILL.md` | YAML frontmatter (agentskills.io spec, extended with CSPS dimensions) | Compatible with Anthropic ecosystem |
| `bundle.yaml` | Native YAML (the file IS a manifest) | The file's purpose IS metadata |
| Generated files | Excluded — listed in `.cataloggignore` | Generated output drifts; never source-of-truth |

## JSDoc encoding for `.ts`/`.tsx`

```ts
/**
 * @csps-id csps.principles.codegen
 * @csps-name principles-codegen
 * @csps-description Codegen pipeline: reads principles.yaml and emits AGENTS.md, hooks, skills.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-tags type:util domain:governance audience:developer
 * @csps-enforces P-META-001 P-META-003 P-OP-001
 */
```

The `@csps-enforces` tag is also how source files declare which principles they mechanically enforce — used by the orphan-enforcer audit per [rule-registry.md](../pillar-0-governance/rule-registry.md).

## Validation (Astro-style build-time Zod)

`tools/validators/validate-frontmatter.mjs` parses every artifact, validates against the dimension schema, fails CI if:

- A required field is missing
- A dimension value is not in the closed enum
- A description exceeds 1024 chars
- An ID is not unique
- An `owner` references a non-existent handle
- Neither `enhances:` nor `created-new-because:` is present (reuse-first contract violation)

*Why build-time, not runtime:* Astro's Content Collections proved this — runtime validation is too late, the broken file already shipped. Build-time means broken frontmatter never merges.

## The variants pattern (the anti-tagging-tax)

`tools/catalog/variants.ts` declares cascading defaults by glob:

```ts
export const VARIANTS: VariantRule[] = [
  { match: "libs/personas/**",  defaults: { tags: ["domain:persona", "type:feature", "audience:end-user"] } },
  { match: "libs/skills/**",    defaults: { tags: ["type:skill"], lifecycle: "production" } },
  { match: "apps/*/src/**",     defaults: { audience: "end-user" } },
  { match: "apps/admin/**",     defaults: { audience: "admin" } },
  { match: "**/__tests__/**",   defaults: { tags: ["type:util"], maturity: "stable" } },
  { match: "docs/plan/pillar-0-governance/**", defaults: { domain: "governance", audience: "developer" } },
];
```

A file's effective frontmatter = `variants ⊕ explicit frontmatter` (explicit wins on conflict). Small files declare only what's *specific* — everything common cascades.

**Why variants matter:** without them, the "small files OK if well-tagged" principle becomes a tagging tax that kills the principle. With variants, a 30-line helper inherits the right tags from its location and only declares its specific identity. This is what makes Bit components scale, and it's what makes Anthropic's skill model (with `references/` sub-files) viable.

## Sources

- [Anthropic Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [agentskills.io spec](https://agentskills.io/)
- [Backstage Catalog Descriptor Format](https://backstage.io/docs/features/software-catalog/descriptor-format/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Bit component variants](https://bit.dev/reference/workspace/variants/)
- [Diátaxis framework](https://diataxis.fr/)
- [CCv3 Character Card spec](https://github.com/kwaroran/character-card-spec-v3) (the `extensions{}` hatch pattern)
