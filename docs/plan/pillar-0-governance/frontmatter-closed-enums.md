---
id: csps.pillar-0-governance.frontmatter-closed-enums
name: frontmatter-closed-enums
description: Canonical reference for all closed-enum frontmatter fields used across CSPS artifacts. Single point-of-truth for AI-pre-write consultation per B_STRUCTURAL_PREVENTION_DISCIPLINE K=2 promotion (S007 turn 5 — closed-enum drift fired K=2 across S006 lifecycle_state:draft + S007 maturity:active). Mirrors closed-enum constants in tools/validators/validate-frontmatter.mjs which remains canonical for runtime enforcement; this doc is the cognitive-layer pre-write reference.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: pillar-leaf
template_status: stable
core_spine: GVRN
core_spines: [GVRN, ARCH, VALD]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S007
links:
  - { rel: parent, href: ./README.md }
  - { rel: validator-source, href: ../../../tools/validators/validate-frontmatter.mjs }
  - { rel: principle, href: ../../../packages/principles/principles.yaml }
  - { rel: contract, href: ./behavioral-contracts.md }
  - { rel: triggered-by-K2-promotion, href: ./behavioral-contracts.md }
---

# Frontmatter Closed Enums — Canonical Reference

> **Pre-write reference for AI authoring CSPS frontmatter.** Source of truth: [`tools/validators/validate-frontmatter.mjs`](../../../tools/validators/validate-frontmatter.mjs) `CLOSED_DIMENSIONS` + `LIFECYCLE_VALUES` + `LIFECYCLE_STATE_VALUES` constants. This doc mirrors those constants for cognitive-layer consultation BEFORE Write/Edit; the validator remains canonical for PR-blocking enforcement.

> **Engraved S007 turn 5** as Surface 1 of the K=2 closed-enum drift structural fix per B_STRUCTURAL_PREVENTION_DISCIPLINE Q-2 promotion. K=1 fired S006 §10.0j #1 (`lifecycle_state: draft` drift); K=2 fired S007 turn 2 (`maturity: active` drift). The structural fix is **pre-write visibility** — AI consults this doc OR the validator constants BEFORE authoring frontmatter.

## Top-level required fields

| Field | Required? | Type | Notes |
|---|---|---|---|
| `id` | yes | dotted-lowercase string | per ADR-0023 schema; pattern `csps.<area>.<slug>` |
| `name` | yes | kebab-case string | matches filename per B_NAMING_POLICY |
| `description` | yes | string | one-paragraph description |
| `version` | yes | semver-ish | track revisions |
| `owner` | yes | `group:<name>` | typically `group:finky` |
| `lifecycle` | yes | closed enum | see below |
| `lifecycle_state` | yes | closed enum | see below |

## Top-level closed enums

### `lifecycle:` — production-readiness tier

```yaml
lifecycle: experimental | beta | production | deprecated
```

| Value | Meaning |
|---|---|
| `experimental` | Skeleton / unproven / week-1-3 |
| `beta` | Functional but not GA-ready |
| `production` | GA-ready; stable interface |
| `deprecated` | Replaced; do not extend |

### `lifecycle_state:` — current state in lifecycle workflow

```yaml
lifecycle_state: active | pending-review | pending-protocol | promoted | resolved | deprecated | validated | closed
```

| Value | Meaning | Terminal? |
|---|---|---|
| `active` | In use; current state | no |
| `pending-review` | Awaiting review | no |
| `pending-protocol` | Awaiting protocol step | no |
| `promoted` | Lifted to next tier | no |
| `resolved` | Issue resolved; no further action | no |
| `deprecated` | Superseded; do not extend | no |
| `validated` | Frozen point-in-time record | **YES** |
| `closed` | Closed permanently | **YES** |

**Note:** `draft` is NOT in this enum (S006 §10.0j K=1 catch). Authors confused with maturity tag — `draft` lives there.

## Tag closed dimensions

Tags follow the pattern `<dimension>:<value>`. Each dimension has a closed enum:

### `domain:` — content domain

```yaml
- domain: billing | persona | bookings | auth | admin | ai | infra | shared | crisis | audit | governance | architecture | data | dx | ops | planning | ui | platform
```

### `type:` — artifact type

```yaml
- type: feature | ui | data-access | util | schema | doc | skill | agent | bundle | template | reference | tutorial | how-to | explanation
```

### `tier:` — customer/access tier

```yaml
- tier: free | pro | business | enterprise | internal
```

### `audience:` — target audience

```yaml
- audience: end-user | admin | developer | ai-agent
```

### `maturity:` — artifact maturity (Diataxis-adjacent)

```yaml
- maturity: draft | review | stable | frozen | deprecated
```

**Note:** `active` is NOT in this enum (S007 turn 2 K=2 catch). Authors confused with `lifecycle_state:active` — `active` lives at top-level lifecycle_state, NOT in maturity tag.

## `enforcement_stage:` — enforcement lifecycle for governance artifacts *(S018 — new)*

**Optional field.** Applies to: validators, hooks, behavioral contracts, topic plans describing enforcement work. Tracks the progression of an enforcement surface from declaration to active production.

```yaml
enforcement_stage: stub | planned | week-4 | active
```

| Value | Meaning | Cost | Consumer |
|---|---|---|---|
| `stub` | Shell exists, exits 0 always, zero enforcement cost | None | verify-hooks-functional.sh |
| `planned` | Designed + documented, not yet built | None | (cognitive only) |
| `week-4` | Registered in audit-runner, ships in week-4 build batch | Low | build-order.md |
| `active` | Enforcing in production — exits 1 on violation | Full | pnpm verify + ZF |
| `human-judgment` | Explicitly non-mechanical (Tier 3) — AI self-assessment only; no validator possible | None (by design) | Never blocks — human review only |

**Key discipline (ratified S018):** Schema field ships WITH its consuming validator, not before.
**`human-judgment` discipline:** Every rule labeled `human-judgment` must have a SELF-ASSESSMENT QUESTION the AI asks before proceeding. It cannot be counted in ZF cycles. It is not "planned" — it is permanently non-mechanical by honest declaration. Better than pretending it's "planned" when no validator can ever be built. `enforcement_stage: active` requires an active consumer. `enforcement_stage: stub|planned|week-4` is valid without a consumer — it declares the intent.

**Consuming validator:** `validate-enforcement-stage-progression.mjs` (week-4) — checks that artifacts marked `enforcement_stage: active` have a corresponding passing validator in `pnpm verify`.

---

## Common drift patterns (K=2 catalog)

| Wrong | Right | Why drift |
|---|---|---|
| `lifecycle_state: draft` | `lifecycle_state: active` + `tags: [maturity:draft]` | Confused state with maturity (S006 §10.0j #1) |
| `maturity:active` (in tags) | `maturity:draft` (or stable / review / frozen / deprecated) | `active` is lifecycle_state value, not maturity (S007 turn 2) |
| `audience:end_user` | `audience:end-user` | underscore vs hyphen |
| `type:test` | `type:feature` (with test sub-folder convention) | `test` not in type enum |
| `domain:tooling` | `domain:dx` (developer-experience) | `tooling` not in domain enum |
| `tier:standard` | `tier:pro` (or business) | `standard` not in tier enum |

## Where these enums live (atomic single-source-of-truth)

| Surface | Path | Authority |
|---|---|---|
| **Validator (canonical)** | [`tools/validators/validate-frontmatter.mjs`](../../../tools/validators/validate-frontmatter.mjs) | Runtime PR-blocking enforcement; values may evolve, validator is source-of-truth |
| **Cognitive reference** | this file | AI pre-write consultation; mirrors validator |
| **Templates** | [tools/templates/*.template.md](../../../tools/templates) | Cite enum value in inline comments |
| **AGENTS.md** | [`AGENTS.md`](../../../AGENTS.md) | Cross-references this doc + B_STRUCTURAL_PREVENTION |
| **Memory** | `feedback_frontmatter_closed_enum_drift.md` | AI per-session memory layer |

## impl_status — implementation quality state machine (NEW S011 §24++++++)

Per S011 user directive: every implementation artifact declares its quality state.

| Value | Meaning | Next state |
|---|---|---|
| `swift-implemented` | Built rapidly; not yet audited | `audit-1-complete` |
| `audit-1-complete` | First audit PASS; no new EP patterns | `sealed-zf` or `architecture-pending` |
| `sealed-zf` | ZF cycle complete; RZF evidence present | `recurring-audit-pending` |
| `recurring-audit-pending` | Registered for weekly/monthly re-validation | `sealed-zf` (after clean re-audit) |
| `architecture-pending` | Needs deep arch review before sealing | `audit-1-complete` |
| `deprecated` | Superseded; terminal | — |


## How to add / amend an enum value

1. **Edit `validate-frontmatter.mjs`** `CLOSED_DIMENSIONS` / `LIFECYCLE_*` constants
2. **Edit this doc** to mirror the change
3. **Run `pnpm verify`** to confirm 0 errors with new enum
4. **Cross-link in commit message** to the rationale
5. **Atomic commit** — never split validator change from doc-mirror change

## Mechanical surfaces (K=2 closed-enum drift structural fix; engraved S007 turn 5)

| Surface | Artifact | Status |
|---|---|---|
| Schema | this file | active |
| Validator (atomic registration) | `frontmatter-closed-enum-drift-prevention` registered in [audit-runner.md](./audit-runner.md) Meta + Pipeline 1 governance; impl week-4 (existing `frontmatter_validate` already detects post-write; new audit angle is pre-write coverage) | registered atomic; impl deferred |
| Hook | [`.claude/hooks/pre-tool-use-frontmatter-enum-check.sh`](../../../.claude/hooks/pre-tool-use-frontmatter-enum-check.sh) | stub authored S007; week-4 active enforcement |
| Memory | `feedback_frontmatter_closed_enum_drift.md` + MEMORY.md index entry | active |
| Contract | [behavioral-contracts.md § B_STRUCTURAL_PREVENTION_DISCIPLINE — K=2 closed-enum drift subsection](./behavioral-contracts.md) + AGENTS.md hard NO sub-bullet update + ai-behavior-spine.md row update | active |

## K-promotion trail (provenance)

- **K=1 — S006 §10.0j enhancement-proposal #1** (commit [`1b779f6`](https://github.com/CommarkG/csps/commit/1b779f6) governance-foundation closure): `lifecycle_state: draft` authored on a topic-plan; validator caught at PR-time. Structural fix proposed: "Embed closed-enum reference inline in template-registry entries". K=1 deferred to "if recurs S007+ promote to engraving".
- **K=2 — S007 turn 2** (commit [`357478b`](https://github.com/CommarkG/csps/commit/357478b)): `maturity:active` authored on token-optimization topic-plan; validator caught at post-author verify. Same anti-pattern (AI guessing closed-enum value); different field. **K=2 → PROMOTE TO ENGRAVING per B_STRUCTURAL_PREVENTION_DISCIPLINE.**
- **K=2 engraving — S007 turn 5** (this commit): structural fix executed. 5/5 atomic per FSE. Going forward: AI consults this doc OR validator constants BEFORE authoring frontmatter; validator catches as backstop; hook (week-4) blocks pre-write.

---

**Frontmatter-closed-enums signature:** `S007-AI-frontmatter-closed-enums-2026-05-04T19:15:00Z`
