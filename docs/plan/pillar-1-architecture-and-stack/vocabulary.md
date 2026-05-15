---
id: csps.pillar-1.vocabulary
name: vocabulary
description: The locked vocabulary glossary for CSPS. Every term canonical-form, with industry-standard names where they exist. Anything memory-dependent is fragile; this file is the human-readable companion to packages/glossary/src/terms.ts (the machine-readable source of truth).
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
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ../pillar-0-governance/reuse-first-principle.md }
  - { rel: codegen-spec, href: ./vocabulary-as-code.md }
  - { rel: agents-md, href: ../../../AGENTS.md }
domain_path: platform
core_spine: ARCH
schema_anchor: pillar_0_governance_leaves
scope_level: S1
---

# Vocabulary (locked glossary)

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The single canonical name for every term used in CSPS. **Anything called by an alternate name in code, prose, schemas, or UI is a bug** — Vale lints prose, ESLint lints identifiers, and the audit-runner verifies coverage.

The machine-readable source of truth is `packages/glossary/src/terms.ts` (per [vocabulary-as-code.md](./vocabulary-as-code.md)). This file is the human-readable companion that explains *why* each term was chosen.

## Why a locked vocabulary

A platform that hosts 30–75 apps over several years will be modified by you, by AI assistants (Claude Code, Cursor, Mastra agents), and possibly by future contractors. Without locked vocabulary:
- Identical concepts get different names across the codebase
- Search/retrieval breaks (querying for "agent" misses "assistant")
- Onboarding is slow (new contributors derive what each word means)
- AI assistants drift in their interpretations across sessions

These terms are the **convergent vocabulary across Anthropic, OpenAI, MCP, Mastra, Cursor, Windsurf, and the broader 2026 AI ecosystem.** Adopting cross-system terminology means future-you (and any AI assistant) finds the same words in tutorials, error messages, and Stack Overflow answers. Local CSPS-specific terms exist only where genuinely no industry-convergent name exists.

## Locked terms

### AI / Agent vocabulary

| Term | Definition |
|---|---|
| **Tool** | Discrete model-callable function with JSON-schema input. Always exposed via MCP. |
| **Skill** | Named markdown instruction package (`SKILL.md` + optional files). Follows agentskills.io spec. |
| **Agent** | Configured persona = identity + system prompt + toolset + memory + (optional) sub-agents. (Mastra runtime.) |
| **Sub-agent** | Agent invoked by a parent agent for delegated work. |
| **Orchestrator agent** | Meta-agent that coordinates multiple agents toward a goal. (Industry-standard term — LangGraph, CrewAI, Mastra all use "orchestrator." Renamed from earlier CSPS coinage "Conductor.") |
| **Workflow** | Multi-step pipeline (deterministic or agent-driven) with explicit steps + state. |
| **Step** | One node inside a workflow. |
| **Trigger** | Event that *starts* a workflow or agent run. |
| **Hook** | Lifecycle interception point *inside* a run (pre-tool, post-tool, on-stop). |
| **Memory** | Persistent retrievable context scoped to user / agent / workspace. |
| **Knowledge base** | Retrievable corpus (RAG index, vector store) attached to an agent or skill. |
| **Connector** | An MCP server the platform ships or wraps. |
| **Plugin** | Shareable bundle: skills + sub-agents + connectors + hooks + slash commands. |
| **Marketplace** | Browsable catalog of plugins. |
| **Slash command** | `/name` shortcut that invokes a skill, workflow, or agent. |
| **Persona** | Character/voice/values overlay applied to whichever agent executes. |
| **Persona bundle** | Curated collection of personas, tier-gated. |
| **Sandbox runner** | Isolated execution environment for skills/agents that need `can_execute_code`. (Industry-standard. Renamed from earlier CSPS coinage "Eval Worker." Folder `apps/skill-eval-worker/` retains historical name.) |
| **Permission set** | The typed set of capabilities (tools, sub-agents, KB access, network egress) granted to a skill at runtime. (Industry-standard, AWS IAM lineage. Renamed from earlier CSPS coinage "Capability bundle.") |

### Platform-internal vocabulary

| Term | Definition |
|---|---|
| **Slice** | A vertical slice of a single domain entity — schema + admin + customer pages + tests + audit. Two scopes: **Foundation slice** (in `public` schema, shared by every app) or **App slice** (in `app_<slug>` schema, scoped to one app). |
| **Foundation slice** | A slice in the `public` schema. Shared kernel — every app reads/extends it. |
| **App slice** | A slice in an `app_<slug>` schema. Belongs to one app; travels with that app on graduation. |
| **Module folder pattern** | The mini-tree decomposition pattern: a folder with `index.<ext>` (public API) + `context.md` (rationale + map) + sub-files per aspect. Mandatory above thresholds (per [complexity-contract.md](./complexity-contract.md)). Industry-standard pattern — appears in React component folders, Bit components, Nx libraries, Anthropic Skills, Rust crates. (Renamed from earlier CSPS coinage "Manifested slice.") |
| **Shared kernel** | Umbrella term covering Foundation slices + shared kernel libraries (`packages/db`, `packages/auth`, `packages/templates`, `packages/glossary`, `packages/principles`, `packages/catalog`, `packages/entitlements`). DDD-standard term. (Renamed from earlier CSPS coinage "Trunk element.") |
| **App** | A SaaS product hosted inside the platform. |
| **Feature pack** | Entire app's AI surface bundled (skills + agents + connectors + hooks). (Renamed from earlier CSPS coinage "App pack" to avoid overload with Next.js `app/` directory.) |

### UI / Templates vocabulary

| Term | Definition |
|---|---|
| **Page template** | Registered, governed page composition that satisfies a slice's UI contract. Lives in `packages/templates/`. The only sanctioned way to compose pages. |
| **Wizard manifest** | Declarative `WizardManifest` (steps + Zod schemas + branching rules) rendered by the generic `Wizard` page template. |

### Catalog / governance vocabulary

| Term | Definition |
|---|---|
| **Glossary** | `packages/glossary/src/terms.ts` — single source of truth for vocabulary. Downstream artifacts (Vale dict, ESLint rules, Payload options, ZModel `@@meta`) generate from it. |
| **Catalog** | `packages/catalog/` — file metadata + tags + bundles registry. Files are truth, Postgres is index, MCP exposes for AI retrieval. |
| **Frontmatter** | The mandatory metadata block on every artifact (YAML for `.md`/`.mdx`, leading JSDoc with `@csps-*` tags for `.ts`/`.tsx`, `@@meta` for ZModel). Schema in [frontmatter-standard.md](./frontmatter-standard.md). |
| **Variants** | Cascading default frontmatter by glob (Bit pattern). Defined in `tools/catalog/variants.ts`. Lets small files inherit context without per-file tagging tax. |
| **Bundle** | Explicit collection of artifacts (`kind: Bundle`). Static membership list. |
| **View** | Query-based collection (`kind: View`). Materialised lazily from a tag/score query. Same artifact in many views. |
| **Pack** | Versioned, shipped bundle (`kind: Pack`). Snapshotted at publish; immutable per version. |

### Skill governance vocabulary (third-party content)

| Term | Definition |
|---|---|
| **Quarantine skill** | Third-party skill in `vendor/skills/`. Verbatim, never edited, never loaded by production. Only the sandbox runner can load it. |
| **Vendored skill** | Third-party skill promoted to `libs/skills/_vendored/<name>@<sha>/`. Reviewed but unmodified. Production-loadable with "external origin" badge. |
| **Platform-owned skill** | Third-party skill whose essence has been extracted into CSPS-native form at `libs/skills/<name>/`. Rewritten in CSPS vocabulary, frontmatter normalized, tools rebound. The canonical loadable form. |
| **`IMPORT.yaml`** | Per-skill provenance manifest: upstream URL, SHA, license, importer, reviewer, eval run id, status. |
| **`skills.lock.yaml`** | Repo-root lockfile pinning every adopted skill by full SHA + integrity hash + capabilities digest. |

### Operating principle vocabulary (added v1.5)

| Term | Definition |
|---|---|
| **Reuse-first** (P-OP-001) | Operating principle: Check what exists. Enhance the ratified thing. Create new only with a justification. |
| **FWWS** (P-OP-002) | "Finish What We Started." Resist drift to new work while in-flight work is incomplete. WIP-discipline pattern (Kanban lineage). |
| **PCR** (P-OP-003) | "Pros, Cons & Recommendation." When presenting decisions, use this 3-block format. MADR + BLUF lineage. |
| **Batched execution** (P-OP-004) | For N similar operations: agree acceptance criteria upfront, batch execute, single completion summary. Mission Command lineage. |

### Schema vocabulary

| Term | Definition |
|---|---|
| **`@hardDelete`** | ZModel doc-comment annotation that opts a slice out of soft-delete. Requires explicit `@@allow('delete', ...)` policy. Used only for log entries that must be physically purged for GDPR. |

## Tier vocabulary (locked)

`Free → Pro → Business → Enterprise`. Stored as enum + numeric rank: `FREE=0, PRO=10, BUSINESS=20, ENTERPRISE=30`. Gaps left for future intermediate tiers.

*Why these tier names:* convergent across Notion, Slack, Linear, GitHub, Cursor, ChatGPT, Claude — the dominant 4-tier vocabulary in 2026 SaaS. **Avoiding "Plus"** (Notion puts it below Business, Linear above Standard — ambiguous). **Avoiding "Basic"** (puts you in 2010s corporate territory).

## Internal staff roles (7)

`OWNER, ADMIN, DEVELOPER, SUPPORT, FINANCE, AUDITOR, CONTRACTOR`. Mutually exclusive in a single column.

*Why mutually exclusive:* additive boolean flags drift. Promoting someone to "developer" and forgetting to revoke "support" is a documented failure mode at every SaaS that uses additive permissions. One enum, one column, no drift.

## Customer org roles (4)

`OWNER, ADMIN, MEMBER, GUEST`. (Linear/Clerk standard.)

## Renames applied (v1.5 vocabulary audit)

The following CSPS-coined "cool names" were retired in favor of industry-standard equivalents:

| Earlier CSPS coinage | Industry-standard replacement | Why |
|---|---|---|
| Manifested slice | **Module folder pattern** | Convention used by React, Bit, Nx, Anthropic Skills, Rust crates |
| Conductor | **Orchestrator agent** | LangGraph, CrewAI, Mastra all use "orchestrator" |
| Trunk element | **Shared kernel** | DDD-standard term, instantly recognized |
| App pack | **Feature pack** | "App" is overloaded (Next.js `app/` dir, mobile app); "feature pack" unambiguous |
| Eval Worker | **Sandbox runner** | Industry-standard sandbox terminology; "eval" ambiguous |
| Capability bundle | **Permission set** | AWS IAM-standard; "capability bundle" overloads "bundle" |

Folder paths retain historical names where renaming would break references (e.g., `apps/skill-eval-worker/`); prose uses the industry-standard term.

## Locally-invented terms (legitimate; no industry equivalent)

These exist because no industry-convergent name fits CSPS's specific concept:

- **Foundation slice** — distinguishes shared-kernel slices from app-scoped slices in our schema-per-app pattern
- **App slice** — same distinction, the per-app side
- **Slice** itself — close to FSD/VSA "slice" but with the CSPS slice contract

## Engraving

This vocabulary is enforced through:
- **Vale prose linter** — auto-generated from `packages/glossary/src/terms.ts` (forbidden synonyms flagged)
- **ESLint `id-denylist`** — auto-generated from glossary (banned identifiers fail PR)
- **Payload dropdown options** — auto-generated from glossary (admin UI uses canonical terms)
- **ZModel `@@meta` annotations** — auto-generated from glossary
- **CI gate `audit-glossary-fresh`** — fails if glossary changes without downstream regeneration

See [vocabulary-as-code.md](./vocabulary-as-code.md) for the full codegen pipeline.

## CDP Vocabulary (Core Dynamic Plan — S018)

These terms govern the unified governance lifecycle system.

### INPUT
**Definition:** Everything that enters the CSPS platform governance system. An INPUT is classified by the Threshold and staged into the CDP lifecycle.
**Types:** Governor directive / ratification decision / external AI review / external research / code change / raw thought / positive event (CEC) / negative finding (catch-to-engraving)
**Concept_ref:** GVRN L2 (decision rights — the Threshold decides what each INPUT becomes)
**Canonical home:** core-dynamic-plan.md §1 + threshold-gate-v2.md routing protocol
**Processing:** INPUT → Threshold → cdp_status: raw → pipeline-intake → ... (state machine)

### FINDING
**Definition:** An output of the validation/audit/ZF process. A FINDING describes a discovered state of the platform — it may be positive (CEC discovery, improvement opportunity) or negative (BLOCKING, advisory, structural gap).
**Types:**
- BLOCKING: stops work, emergency-mode PE, Tier 1 escalation
- ADVISORY: tracked obligation, doesn't stop work, promotes to BLOCKING at K=2
- POSITIVE: CEC discovery → generates new INPUT for the system
- STRUCTURAL: K=2 pattern → mandatory engraving INPUT
**Concept_ref:** VALD L2 (coverage discipline — findings are evidence of the platform's coverage state)
**Canonical home:** core-dynamic-plan.md §1 + session extraction (positive) + learning-loop.md (negative)
**Feedback loop:** FINDING → new INPUT → Threshold → CDP element (cdp_status: raw) → lifecycle continues
