---
id: csps.governance.architecture-principles
name: architecture-principles
description: The 27 architecture principles that constrain every CSPS decision. Each has a canonical statement, the failure mode it prevents, and a per-layer mechanical enforcer mapping. The single source of truth is packages/principles/principles.yaml (entries P-ARCH-001 through P-ARCH-027).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - security
  - observability
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ./reuse-first-principle.md }
  - { rel: registry, href: ../../../packages/principles/principles.yaml }
  - { rel: enforcement-architecture, href: ./mechanical-enforcement.md }
  - { rel: operating-principles, href: ./operating-principles.md }
domain_path: platform
core_spine: ARCH
schema_anchor: pillar_0_governance_leaves
---

# Architecture Principles (the 27 rules)

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The 27 architecture principles that constrain every CSPS decision. Each has a canonical statement, the failure mode it prevents, and a per-layer mechanical enforcer mapping.

The **single source of truth** is `packages/principles/principles.yaml` (entries P-ARCH-001 through P-ARCH-027). This document is the human-readable companion that explains *why* each principle exists and *what fails* without it.

## How to use this document

Read the principle statement. Read the "why" (the failure mode it prevents). Read the enforcers (so you know what tooling makes it stick). Cross-reference linked principles. If you encounter a decision the plan didn't anticipate, this is the document that tells you which way to lean.

## Principle organization

The 27 principles fall into 6 thematic groups:

- **A. Foundation invariants** (P-ARCH-001 to P-ARCH-005) — the rules that govern how artifacts relate to each other
- **B. Truth & sources** (P-ARCH-006 to P-ARCH-010) — single-source-of-truth + audit trail
- **C. Composition & generation** (P-ARCH-011 to P-ARCH-015) — how things get built from each other
- **D. AI architecture** (P-ARCH-016 to P-ARCH-020) — persona, agent, crisis, template-first
- **E. Multi-tenancy & extraction** (P-ARCH-021 to P-ARCH-023) — schema-per-app, graduation-readiness
- **F. Third-party trust & enforcement spine** (P-ARCH-024 to P-ARCH-027) — sandboxed governance, defense-in-depth

---

## Group A — Foundation invariants

### P-ARCH-001 — Nothing stands alone

**Statement:** Every artifact lives in exactly one slice. The slice owns DB + admin + customer + tests + audit.

**Why:** artifacts that float (live in no slice) become orphans nobody owns. Nobody updates them, nobody knows their tier, they accumulate technical debt. The slice contract IS the ownership contract.

**Severity:** critical — `principles.yaml#P-ARCH-001`

**Enforcers** (4):
1. `validate-frontmatter.mjs` — every file declares `slice:` tag (CI fails otherwise)
2. Slice contract check #1 (ZModel definition) — every slice has a canonical home
3. `orphan-file-detection.ts` (weekly audit) — files matching no bundle AND no `links.index` flagged
4. Intake queue (`/admin/triage`) — every input has a `slice:` field; "no slot" alerts trigger protocol creation

**Cross-references:** P-ARCH-006 (slice contract), P-OP-001 (reuse-first)

### P-ARCH-002 — Mechanical over procedural

**Statement:** Every rule that matters is enforced by a linter, CI gate, generator, or runtime check. Rules in a README rot.

**Why:** documentation rots; CI gates don't. Every postmortem of architectural drift cites the same root cause — the rules existed in a doc, no machine enforced them, they were ignored under deadline pressure.

**Severity:** critical

**Enforcers** (3):
1. `principle-coverage.ts` (P-META-001 enforcer) — every principle in `principles.yaml` must have ≥ N enforcers per severity; CI fails otherwise
2. `enforcer-orphans.ts` — every `// @enforces:` annotation references a real principle
3. `codegen-fresh.ts` — `principles.yaml` codegen output matches what's committed (no drift)

**Cross-references:** P-META-001, all other principles (this is the meta-rule that makes them work)

### P-ARCH-003 — Files are truth, DB is index

**Statement:** Source-controlled artifacts (ZModel, skills, frontmatter, principles.yaml) are canonical. Postgres + Payload mirror them for query speed and admin UX. The DB never disagrees with the files; if it does, the files win.

**Why:** files are source-controlled, diffable, portable across machines. Pure-DB systems (OpenAI Assistants API) lose this — content disappears if the DB does. Pure-file systems lose query speed at 75+ apps. Hybrid wins.

**Severity:** critical

**Enforcers** (4):
1. `schema-prisma-db-drift.ts` (nightly) — Prisma migrate status against each environment
2. `schema-payload-vs-zmodel.ts` (nightly) — Payload collections match ZModel
3. Catalog scan job — Postgres index rebuilds from frontmatter on every commit
4. Codegen-fresh CI gate — every generated artifact regenerates identically

**Cross-references:** P-ARCH-004, P-ARCH-019

### P-ARCH-004 — One source of truth per concern

**Statement:** ZModel is THE schema. Zod is generated, not hand-written. Stripe Entitlements is THE entitlement source. Glossary is THE vocabulary. Catalog is THE artifact registry. Principles.yaml is THE principles.

**Why:** two sources of truth means drift between them is invisible until production breaks. Generated downstream artifacts must be regeneratable from the source; never hand-edit downstream.

**Severity:** critical

**Enforcers** (4):
1. `glossary-codegen-fresh.ts` (PR) — Vale dict / ESLint rules / Payload options must regenerate identically
2. `principles-codegen-fresh.ts` (PR) — AGENTS.md / skills / hooks must regenerate identically from principles.yaml
3. `tier-feature-key-reconcile.ts` (nightly) — every feature_key in code is in Stripe; every Stripe Feature is in code
4. ESLint rule `no-hand-edited-generated-files` — files marked `// @generated` cannot be modified

**Cross-references:** P-ARCH-003, P-ARCH-019, P-ARCH-020

### P-ARCH-005 — Three-layer composition only

**Statement:** Tools (leaves) → Skills (may use tools + sub-agents) → Agents (use skills, tools, other agents through a named supervisor). Skill→skill calls forbidden at registry level.

**Why:** both LangGraph and CrewAI documented the deadlock failure mode of peer-to-peer agents. Directed acyclic composition kills 80% of "spaghetti agent" bugs. Forbidding skill→skill at the registry level prevents the worst class.

**Severity:** error

**Enforcers** (3):
1. ESLint rule `csps/no-skill-to-skill-import` — Skills cannot import other Skills
2. `validate-skill-capabilities.mjs` — `allowed_subagents` declared per skill; skill→skill not allowed
3. Mastra dispatcher middleware — runtime check at agent invocation

**Cross-references:** P-ARCH-027 (capability declaration)

---

## Group B — Truth & sources

### P-ARCH-006 — Every slice scores ≥90% to merge, 100% = gold

**Statement:** Slice contract is 16 checks; total 113 points; ≥102 (≈ 90%) to merge; 100% earns gold badge.

**Why:** without an objective threshold, "is this slice done?" is subjective. Hard threshold prevents quality regression; gold tier rewards completeness.

**Severity:** critical

**Enforcers** (3):
1. `nx run-many -t slice-score --check` (CI) — fails build below 90%
2. Pre-commit hook — `slice-score` runs on changed slices; warns locally
3. Payload "Slice Health" collection (read-only, computed) — admin dashboard surface

**Cross-references:** P-ARCH-001 (slices own their content), P-ARCH-022 (module-folder above thresholds)

### P-ARCH-007 — Soft-delete by default

**Statement:** Every entity inherits soft-delete via the Base mixin's `deletedAt`. Hard delete requires explicit `@hardDelete` annotation + an explicit `@@allow('delete', ...)` policy.

**Why:** "oops I deleted that customer" is recoverable with soft-delete; not with hard. Audit history retains value. GDPR right-to-be-forgotten is handled by tombstoning specific PII columns, not deleting rows.

**Severity:** error

**Enforcers** (3):
1. Base mixin's `@@deny('delete', true)` — ZenStack-level enforcement
2. `validate-zmodel-naming.mjs` — flags any `@@allow('delete', ...)` without `@hardDelete` annotation on the model
3. Migration linter — partial unique indexes added for soft-delete uniqueness (`WHERE deleted_at IS NULL`)

**Cross-references:** P-ARCH-008 (audit by trigger captures soft-deletes too)

### P-ARCH-008 — Audit by trigger, not by app code

**Statement:** Postgres triggers fire on every write to every entity table. App-level audit middleware is bypassable; triggers are not.

**Why:** the day a developer (or a Mastra agent) bypasses Prisma with raw SQL, app-level audit is silent. Postgres triggers fire regardless of who issued the write — the only audit you can trust.

**Severity:** critical

**Enforcers** (4):
1. Slice contract check #4 — every table has a trigger calling `audit.record()`
2. `audit-log-integrity.ts` (nightly) — no >5-min gap per tenant in `audit.events`
3. `pg_trigger` introspection — verifies triggers are present at the DB layer
4. RLS policy on `audit.events` — append-only, no UPDATE/DELETE

**Cross-references:** P-ARCH-010 (defense in depth)

### P-ARCH-009 — One generation layer = leverage. Three = collapse

**Statement:** Generators that compose, not generators that generate generators. Stop at 2 levels of meta.

**Why:** "Code Generation Should be the Nuclear Option" (Simple Thread). One layer of generation gives you 30 apps from one template — the right ROI. Two layers (generators that generate generators) are sometimes justified. Three layers means nobody can read the output, and the project usually collapses.

**Severity:** warn (judgment call; not auto-enforceable, but visible)

**Enforcers** (2):
1. ADR template requires meta-level justification — any "generator that generates a generator" requires explicit ADR
2. Architecture review at code-review time (manual; flagged by reviewer)

**Cross-references:** P-ARCH-005 (composition limits)

### P-ARCH-010 — Defense in depth

**Statement:** ZenStack `@@allow` is the gate; Postgres RLS is the backstop. Every critical authz check exists at multiple independent layers.

**Why:** the day a developer bypasses ZenStack with raw SQL, RLS catches it. The day RLS has a bug, ZenStack catches it. One layer is one bug away from a tenant-data-leak headline.

**Severity:** critical

**Enforcers** (4):
1. `rls-coverage.ts` (nightly) — every tenant-scoped table has `rowsecurity=true` at the Postgres layer
2. `permission-policy-drift.ts` (nightly) — declared `@@allow` policies match effective grants in `pg_policies`
3. `audit-log-integrity.ts` — verifies trigger-level audit catches what app might bypass
4. `principle-coverage.ts` (P-META-001 enforcer) — every critical-severity principle has ≥2 non-AI enforcers

**Cross-references:** P-META-001, P-ARCH-027

---

## Group C — Composition & generation

### P-ARCH-011 — Filter by entitlement before the model sees the catalog

**Statement:** Token cost + security. The model never wastes context on capabilities the user can't use.

**Why:** 75 skills × ~100 tokens of description each = 7,500 tokens just to *decide* what to call. Filter to the user's tier first; the model never wastes context.

**Severity:** error

**Enforcers** (3):
1. Catalog API — `loadCatalogForUser(userId)` filters by entitlements before returning
2. `audit-of-audit` (nightly) — verifies catalog-loading endpoints all use the entitlement-filtered loader
3. ESLint rule `csps/no-unfiltered-catalog-load` — flags direct catalog reads bypassing the helper

**Cross-references:** P-ARCH-025 (third-party trust)

### P-ARCH-012 — Persona is orthogonal to agent

**Statement:** One parameterized agent runtime, N personas via composition. Mastra Dynamic Agents pattern.

**Why:** operationally clean. You don't run 75 Mastra agent instances; you run one parameterized agent and pass `personaId` via runtime context. Persona changes don't touch agent code.

**Severity:** error

**Enforcers** (3):
1. Mastra agent count check — `personaChatAgent` is one instance; `loadPersona(id)` is the parameterization
2. Architecture review — adding a new Mastra agent for a "different persona" is rejected
3. Slice contract — Persona slices declare `agent: personaChatAgent` (not their own agent)

**Cross-references:** P-ARCH-013 (composition)

### P-ARCH-013 — Universal traits at the trunk; domain nuance overlays

**Statement:** Layered system-prompt assembly — PLATFORM_CONSTITUTION → DOMAIN_OVERLAYS → traits → renderPersonaBlock → persona.systemPrompt → GUARDRAIL_BUNDLES → postHistoryInstructions.

**Why:** OpenAI Model Spec hierarchy + Cohere preamble pattern. Universal "honest, safe, AI-disclosed" lives at the trunk; domain-specific tone overlays on top; persona-specific voice overlays on that. Each layer is a database row; the rendered prompt is computed at request time.

**Severity:** error

**Enforcers** (2):
1. Persona compose function (`libs/personas/compose.ts`) — single source of truth for assembly order
2. Persona contract — every persona declares `domain` (validated against PersonaDomain enum)

**Cross-references:** P-ARCH-012, P-ARCH-014

### P-ARCH-014 — Crisis escalation is a first-class slice every persona inherits

**Statement:** Crisis detection + escalation paths + output validator + CrisisEvent rows. Inherited by every persona; not a per-persona feature.

**Why:** you cannot ship a Personal/Social/Spiritual persona without crisis-aware safety. Per-persona crisis handling means inconsistent safety. One slice every persona inherits = consistent safety floor.

**Severity:** critical

**Enforcers** (4):
1. Persona compose function always appends `GUARDRAIL_BUNDLES[persona.riskClass]` (which includes crisis bundles)
2. Pre-LLM input filter (`libs/crisis/detector.ts`) — runs before any persona LLM call
3. Output validator on `CRISIS_ELIGIBLE` risk class — runs after every persona response
4. Slice contract — Crisis slice meets all 16 checks itself

**Cross-references:** P-ARCH-013, P-ARCH-015

### P-ARCH-015 — The audit system is itself a slice

**Statement:** Self-auditable. The audit system meets the same slice contract as everything else.

**Why:** the audit system rots faster than what it audits if nobody audits it. Self-application is a forcing function against rot.

**Severity:** error

**Enforcers** (2):
1. `nx run audit-runner:slice-score` — the audit slice itself scores ≥90%
2. `audit-of-audit.ts` (nightly) — meta-check that every audit ran in its expected interval

**Cross-references:** P-ARCH-006, P-ARCH-002

---

## Group D — AI architecture

### P-ARCH-016 — Universal terms first

**Statement:** Adopt cross-system industry-standard terms. Invent locally only when no industry-convergent term exists.

**Why:** future-you and AI assistants will Google for help. Industry-standard terms find answers; invented terms find nothing. (See [vocabulary.md](../pillar-1-architecture-and-stack/vocabulary.md) for the v1.5 vocabulary audit that retired 8 CSPS coinages.)

**Severity:** warn

**Enforcers** (3):
1. Vale prose linter — auto-generated from glossary; flags forbidden synonyms
2. ESLint `id-denylist` — auto-generated from glossary; flags forbidden identifiers
3. Glossary review at PR — new term proposals require justification of why no industry term fits

**Cross-references:** P-ARCH-019

### P-ARCH-017 — Template-first, reuse-first

**Statement:** Every page composes from a registered template in `packages/templates/`. Bespoke pages require a template-request PR before merge. **No wild builders.**

**Why:** at 30–75 apps, hand-rolling pages produces 30 different dashboards. Template governance produces consistent UX with zero per-app design effort. Stripe migrated 1.4M users this way; Linear runs on it.

**Severity:** critical

**Enforcers** (4):
1. Slice contract check #12 — `validate-template-usage.mjs` (every page imports from `@csps/templates`)
2. ESLint `no-restricted-imports` — blocks raw `@radix-ui/*`, `@tremor/react`, `@csps/ui/*` outside `@csps/templates`
3. `platform:page` generator — refuses unknown templates
4. Storybook + Chromatic — visual regression on every PR

**Cross-references:** P-OP-001 (reuse-first applied to UI)

### P-ARCH-018 — Schema-per-app

**Statement:** Shared kernel in `public`; each app's domain entities in `app_<slug>`. Use fully-qualified table names; never `search_path` with transaction pooling.

**Why:** schema-per-app makes graduation extraction a 2-3 day operation instead of 2-3 months. `search_path` with PgBouncer transaction pooling is a CVE-class data-leak vector.

**Severity:** critical

**Enforcers** (3):
1. Slice contract check #13 — `validate-app-schema.mjs` (App slice → `@@schema("app_<slug>")`)
2. ESLint rule `no-search-path-set` — forbids `SET search_path` in app code
3. Multi-schema migration tool (`tools/migrate-multi-schema/`) — templates schema names per app

**Cross-references:** P-ARCH-022 (extraction-readiness)

### P-ARCH-019 — Glossary owns the vocabulary

**Statement:** All terms generate downstream. No naked synonyms in code, prose, schemas, or UI.

**Why:** every system that's tried to maintain vocabulary by goodwill has failed. The codegen pipeline is what holds.

**Severity:** error

**Enforcers** (4):
1. `glossary-codegen-fresh.ts` (PR) — regenerated artifacts must match committed
2. Vale (prose) + ESLint (code) — both auto-generated from glossary
3. ZModel `@@meta` annotations — auto-generated
4. Payload dropdown options — auto-generated

**Cross-references:** P-ARCH-004, P-ARCH-016

### P-ARCH-020 — Live drift detection

**Statement:** Alignment is a continuous signal, not a one-time check. Nightly diff: introspected DB ↔ ZModel, Payload ↔ ZModel, Vale dict ↔ glossary, page files ↔ template catalog.

**Why:** PR gates catch drift introduced by PRs. They miss drift introduced by drift (a glossary term renamed but downstream artifact regen forgotten). Live diff catches the second class.

**Severity:** error

**Enforcers** (5):
1. `schema-prisma-db-drift.ts` (nightly)
2. `schema-payload-vs-zmodel.ts` (nightly)
3. `glossary-codegen-fresh.ts` (PR)
4. `principles-codegen-fresh.ts` (PR)
5. `/admin/audits/drift` dashboard — visualizes all drift signals

**Cross-references:** P-ARCH-002, P-ARCH-003, P-ARCH-004

---

## Group E — Multi-tenancy & extraction

### P-ARCH-021 — The ratchet pattern

**Statement:** Don't try to fix existing files. Block any change that makes a complexity/size metric worse on the diff. New code obeys; old code only gets cleaned when it's touched.

**Why:** trying to fix every existing file before enforcing rules means rules ship in 18 months instead of week 3. Stripe / Shopify / Linear all use a variant.

**Severity:** error

**Enforcers** (4):
1. `eslint --max-warnings 0` against changed files only (CI)
2. `lint-staged` (pre-commit) — same checks on staged files
3. `file-size-ratchet.ts` (PR) — file size cannot regress
4. `cognitive-complexity.ts` (PR) — function complexity cannot regress

**Cross-references:** P-ARCH-022 (file-size limits)

### P-ARCH-022 — Module-folder mandatory above thresholds

**Statement:** When any single file >500 LOC OR slice total >2,500 LOC OR cognitive complexity >15 OR `context.md` can no longer summarise in <400 lines → split into the module-folder mini-tree (per [module-folder-pattern.md](../pillar-1-architecture-and-stack/module-folder-pattern.md)).

**Why:** without an objective trigger, "too big" is subjective and slices grow until they're unmaintainable. Objective triggers force split before pain.

**Severity:** error

**Enforcers** (3):
1. `file-size-ratchet.ts` — blocks PR if file exceeds 500 LOC
2. `module-folder-trigger.ts` (nightly) — flags slices crossing thresholds; suggests `nx g platform:split`
3. `nx g platform:split <slice>` — mechanical decomposition tool

**Cross-references:** P-ARCH-021 (ratchet pattern)

### P-ARCH-023 — Variants cascade defaults; explicit overrides win

**Statement:** Common context flows from glob-matched variants; per-file frontmatter declares only what's specific. The anti-tagging-tax that makes small files viable.

**Why:** without variants, "small files OK if well-tagged" requires every file to declare every tag, which kills the principle.

**Severity:** warn

**Enforcers** (2):
1. `validate-frontmatter.mjs` — applies variants resolution before validation; reports effective frontmatter
2. `tools/catalog/variants.ts` — single source of truth for cascading defaults

**Cross-references:** P-ARCH-024

---

## Group F — Third-party trust & enforcement spine

### P-ARCH-024 — Small files are OK iff three preconditions hold

**Statement:** (a) Machine-parseable frontmatter (validated at commit), (b) connectivity layer (`links` + variant-inherited tags + `context.md` reference), (c) retrieval layer (catalog index + MCP resource exposure). Without all three, small files become chaos.

**Why:** atomic-note systems (Zettelkasten, Obsidian, Anthropic Skills) all succeed under exactly these three preconditions and fail without any one.

**Severity:** warn

**Enforcers** (3):
1. `validate-frontmatter.mjs` — precondition (a)
2. `orphan-file-detection.ts` (weekly) — flags files without links AND without bundle membership (precondition b violated)
3. Catalog scan — verifies every file is indexed (precondition c)

**Cross-references:** P-ARCH-023 (variants)

### P-ARCH-025 — Third-party trust is default-deny

**Statement:** Imported skills/plugins/agents start with the minimum permission set (Read/Grep/Glob, mock KB only). Promotion to higher tiers requires explicit review.

**Why:** Snyk's Feb 2026 ToxicSkills scan: 13.4% of community skills have critical issues; 91% of malicious skills combine prompt injection with traditional malware. Default-allow at this hit rate is reckless.

**Severity:** critical

**Enforcers** (4):
1. Sandbox runner (`apps/skill-eval-worker`) — quarantine-tier skills run only here
2. `validate-skill-capabilities.mjs` (PR) — banned tools per tier
3. PreToolUse hook — runtime permission check
4. Mastra dispatcher middleware — independent runtime check (defense in depth)

**Cross-references:** P-ARCH-026, P-ARCH-027

### P-ARCH-026 — Verbatim vendor preserved + rewritten platform-owned

**Statement:** Third-party content lives in two places: untouched in `vendor/` (provenance + audit trail), normalized in `libs/` (production loadable). Updates upstream do NOT auto-flow.

**Why:** Debian packaging model. The verbatim copy is your link to upstream; the rewrite is what you ship. Auto-flow is how the tj-actions / Shai-Hulud supply-chain attacks reached 23,000+ repos.

**Severity:** error

**Enforcers** (3):
1. ESLint rule — `vendor/` is read-only outside `tools/skill-importer/`
2. `validate-skill-integrity.mjs` (PR) — SHA-pin verification; tag-pin forbidden
3. `skills.lock.yaml` — every adopted skill has full SHA + integrity hash + capabilities digest

**Cross-references:** P-ARCH-025, P-ARCH-027

### P-ARCH-027 — Capability declaration + dispatcher enforcement

**Statement:** Manifest declares intent; runtime enforces. Both PreToolUse hook AND Mastra dispatcher check capabilities (defense-in-depth).

**Why:** manifest declaration alone is necessary-but-insufficient (the Anthropic open issue confirms this). Hooks are advisory; the dispatcher must independently enforce so the model can't bypass via hook-disable.

**Severity:** critical

**Enforcers** (4):
1. PreToolUse hook reads per-skill permission set; exits non-zero on mismatch
2. Mastra dispatcher middleware — independent check at agent invocation
3. `validate-skill-capabilities.mjs` (PR) — banned tools detected at static-analysis time
4. `skill-capability-drift.ts` (weekly) — declared capabilities haven't expanded since last review

**Cross-references:** P-ARCH-005, P-ARCH-010, P-ARCH-025

---

## Cross-cutting summary (the 10 most-cited)

For quick reference in conversations and PR descriptions:

1. **Mechanical over procedural** (P-ARCH-002)
2. **Files are truth, DB is index** (P-ARCH-003)
3. **One source of truth per concern** (P-ARCH-004)
4. **Default deny, opt in** (encoded in P-ARCH-025, P-ARCH-027)
5. **Generators carry the load** (encoded in P-ARCH-009 + the generator architecture)
6. **The platform is the dogfood** (encoded in P-ARCH-015)
7. **Extraction-readiness from day one** (encoded in P-ARCH-018)
8. **AI-readable architecture** (encoded in P-ARCH-016, P-ARCH-024)
9. **Reuse-first** (P-OP-001 — operating principle)
10. **Defense-in-depth enforcement** (P-ARCH-010, P-META-001)

## Reuse-first applied to principles themselves

Before proposing a new architecture principle:

1. **Search this document** for a near-match
2. **Search `principles.yaml`** for related entries
3. **If a near-match exists**, enhance it (add an enforcer; refine the statement via ADR)
4. **If genuinely new**, write an ADR explaining why no existing principle covers the case + add to `principles.yaml` with full enforcer map

## Sources

- Each principle's enforcer entries cite specific tools (Vale, ESLint, ZenStack, Mastra, Cloudflare Workers, Postgres triggers, etc.)
- Industry references: AWS Well-Architected, NIST CSF 2.0, Backstage Tech Insights, Spotify Golden Paths, Netflix Paved Roads, Stripe API design, Snyk ToxicSkills research
- Academic references: Building Evolutionary Architectures (Ford/Parsons/Kua), Cognitive Load Theory (Sweller), Working Backwards (Amazon)
