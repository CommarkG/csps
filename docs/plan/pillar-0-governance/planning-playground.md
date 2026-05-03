---
id: csps.governance.planning-playground
name: planning-playground
description: The CSPS planning system itself, documented. A tree of MD documents organized into pillars, indexed in a database, audited for completeness, AI-readable, git-versioned. The validated staircase from git-only to local-SQLite to Supabase.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - domain:planning
  - type:doc
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - observability
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ./reuse-first-principle.md }
  - { rel: tree-index, href: ../README.md }
  - { rel: trunk, href: ../../../MASTER_PLAN.md }
---

# The Planning Playground

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The architecture for CSPS's spec-driven planning system. A tree of markdown documents organized into pillars (this very tree), with frontmatter validation, database indexing, completeness auditing, git versioning, and AI-readable structure. Includes the staircase pattern for scaling infrastructure as the planning corpus grows.

## Why this exists

The user's hypothesis: *"a structured architecture allowing the optimal distribution of any input, and the option to audit a tree of MD documents arranged in a schema and database structure, can identify, define, refine, optimize, and align a lot of things even before one line of code is written."*

The hypothesis is **validated**. Spec-driven development is dominant practice at every elite engineering org (Amazon PR/FAQ, Google design docs, Stripe RFCs, Rust RFCs, Python PEPs). It is **especially high-leverage when LLMs are co-authors of code** — durable specs are the human-grade equivalent of agent context compression (ACON-style research). The cost-of-defects literature (Boehm, Capers Jones) is **folklore-grade on magnitudes** but the *direction* (more upfront design → less rework) is well-supported by practitioner data.

What's novel here: the **combination** of file tree + frontmatter schema + DB index + completeness audit + git + LLM-first ingestion. Each ingredient exists separately; nobody has shipped exactly this combination as a single product. Building it for CSPS puts the user ~12 months ahead of where the market is consolidating (Spec Kit, Claude Code SDD, cc-sdd, obra/superpowers all reinventing this pattern in 2025–2026).

## The honest caveats

- **Bikeshedding risk.** The biggest failure mode is *infinitely refining specs and never shipping code*. Cap planning rounds explicitly: no doc gets more than N revisions before either acceptance or rejection. Suggest N=5; flag stale drafts at 14 days.
- **Empirical magnitudes are folklore.** Anyone selling "100x cost reduction" via spec-first is selling Leprechauns. The direction is real; the size is not measured.
- **The trap is admin UIs.** Most planning-playground projects collapse under building admin UIs and dual databases before the audit script exists. **Build the audit first.** Everything else follows.

## The staircase architecture

Three phases. Do not over-provision. Promote when the trigger fires.

### Phase 1 (now → ~50 docs): git only

- MD tree in `docs/plan/` with frontmatter
- A ~200-line Node script (`tools/planning-audit/audit.mjs`) parses frontmatter, validates schema, checks dangling refs, flags stale drafts, generates `INDEX.md` and `CONTEXT.md`
- No database, no admin UI, no Supabase
- VS Code + git diff IS the editing UI
- Run audit in CI on every PR + nightly cron

### Phase 2 (~50–500 docs): add local SQLite index

- CI builds `docs/plan/index.sqlite` from frontmatter on every commit
- Queryable from CLI or local Node scripts; embedded; zero-ops; lives in the repo
- Enables "show me all docs tagged X with status Y modified in last Z days"
- Still no admin UI; queries via CLI tool `pnpm plan:query "<sql>"`
- Promotion trigger: corpus crosses ~50 docs OR queries become regular workflow

### Phase 3 (>500 docs OR concurrent multi-user editing OR live admin UI): promote to existing CSPS Supabase

- Use a `planning` schema in the existing CSPS Supabase project (NOT a separate Supabase project — duplicating auth/billing/ops adds friction without benefit)
- Build `/admin/plan` Payload-driven view: tree browser, filters, completeness scorecard
- Promotion trigger: solo dev workflow needs a real-time UI (typically year 2+)

## Backups

- **Git + GitHub remote IS the backup** for the docs. Non-negotiable.
- The DB index (Phase 2 SQLite or Phase 3 Postgres) is a **derived artifact** — rebuildable from the docs at any time. Doesn't need its own backup story until Phase 3, at which point the existing CSPS Supabase backup policy applies.

## What "audit a tree of MD documents" means concretely

The `tools/planning-audit/audit.mjs` script (Phase 1) does:

1. **Walk** `docs/plan/**/*.md` and `MASTER_PLAN.md`
2. **Parse** frontmatter via `gray-matter`
3. **Validate** against Zod schema (per [pillar 1 / frontmatter-standard.md](../pillar-1-architecture-and-stack/frontmatter-standard.md)):
   - Required fields present
   - Closed-enum dimension values respected
   - Description ≤ 1024 chars
   - IDs globally unique
4. **Resolve** `links[]` refs — fail on dangling
5. **Check** every cross-cutting concern is addressed by ≥1 leaf doc per pillar
6. **Check** every pillar README links to all its leaf docs
7. **Check** the reuse-first principle is mentioned in every pillar README (grep)
8. **Check** `packages/principles/principles.yaml` is parseable + every principle's enforcer file paths resolve (added v1.5)
9. **Check** every principle in `principles.yaml` has the minimum enforcers per its severity (per `P-META-001`); fail CI if any principle is under-enforced (added v1.5)
10. **Check** every `// @enforces:` annotation in source references a real principle (orphan-enforcer audit, added v1.5)
11. **Check** codegen freshness: re-run `pnpm principles:codegen`; fail if `git diff` produces output (drift between source and generated AGENTS.md / skills / hooks / MCP resources, added v1.5)
12. **Flag** any `status: draft` doc older than 14 days
13. **Flag** any leaf doc unchanged > 90 days (re-review prompt)
14. **Generate** `docs/plan/INDEX.md` (auto-generated full tree with statuses)
15. **Generate** `docs/plan/CONTEXT.md` (auto-generated AI ingestion entry point — concatenates pillar READMEs + key principles + the operating-principles canonical wordings for one-shot Claude/Cursor loading)

Exit code: 0 if clean, non-zero if any error. Warnings logged but don't fail.

## AI ingestion as a first-class concern

Planning playground value compounds when AI assistants can ingest the whole tree as context. CSPS makes this first-class:

- `docs/plan/CONTEXT.md` — auto-generated single-file dump of pillar READMEs + canonical principles + active ADR list. Claude Code skills load this at session start.
- `packages/catalog/src/mcp-server.ts` exposes every plan doc as an MCP resource keyed by `id` so Mastra agents can pull individual docs on demand without context bloat.
- Workspace `CLAUDE.md` instructs assistants: *"Before answering architectural questions or proposing changes, query the catalog for relevant plan docs and cite them."*

This is the **"compress conversation → durable spec doc → next AI session loads spec"** loop made concrete. It's the human-grade equivalent of agent context compression (ACON-style research).

## Reuse-first applied to plan docs

Plan documents themselves obey the reuse-first principle. Before creating a new leaf doc:
- Search the existing tree (`grep -ri`)
- Search the catalog (when Phase 2+ is live)
- If a near-match exists, **enhance** that doc instead of creating a new one
- If creating new is justified, the doc's frontmatter must include `created-new-because:` explaining why

The audit verifies this: every leaf doc has either `enhances:` (preferred) or `created-new-because:` (with text).

## Diátaxis taxonomy (the per-doc kind tag)

Borrowed from [Diátaxis](https://diataxis.fr/) — the 4-quadrant doc taxonomy used by Canonical, Python, Cloudflare. Every plan doc declares its kind via frontmatter:

```yaml
diataxis_type: tutorial | how-to | reference | explanation
```

| Kind | Purpose | Audience need |
|---|---|---|
| Tutorial | Learning by doing | "I'm new and want to learn" |
| How-to | Solving a specific problem | "I want to accomplish X" |
| Reference | Information lookup | "What does X do?" |
| Explanation | Understanding context | "Why is X this way?" |

Most CSPS plan docs are `reference` (the canonical state) or `explanation` (the architectural why). ADRs are `explanation`. Build-order is `how-to`. Bootstrap is `tutorial`.

The audit flags pillars missing one or more Diátaxis kinds — ensures every audience need is met somewhere.

## Bikeshedding caps (the planning-becomes-the-project antidote)

Hard rules to prevent infinite refinement:

1. **Revision cap.** No doc gets more than 5 revisions in `proposed` status before either acceptance or rejection. Past 5, the audit forces resolution.
2. **Stale-draft cap.** `status: draft` docs older than 14 days trigger a daily reminder; older than 30 days, the audit warns.
3. **Open-questions decay.** A doc's "Open questions" section unchanged for 90 days triggers a quarterly review prompt.
4. **Spec-to-code ratio.** As a soft signal: track ratio of plan-doc PRs to implementation PRs over rolling 30 days. If >5:1 sustained, you're bikeshedding.

These caps live in the audit runner (per [audit-runner.md](./audit-runner.md)) and are surfaced in the planning-health dashboard (Phase 3+).

## What I rejected (and why)

The research surfaced several alternatives. Rejected:

- **Adopt Backstage TechDocs as the planning system** — too heavy; service-catalog-flavored; needs Backstage standup.
- **Adopt Notion / Confluence** — loses git versioning, weakens audit, adds vendor lock.
- **Adopt Dendron** — project momentum stalled in 2023.
- **Build a custom web admin UI from day one** — the trap that kills planning-playground projects. Defer to Phase 3.
- **Run GraphRAG over the corpus** — overkill at <200 docs; revisit at Phase 2 if cross-doc relationships get rich.
- **Create a separate Supabase project for planning** — duplicates ops; the existing CSPS Supabase under a `planning` schema is correct.

## Implementation plan

| Step | When | What |
|---|---|---|
| 1. Build the audit script | Now (week 1) | `tools/planning-audit/audit.mjs` (~200 LOC) |
| 2. Wire into CI | Week 1 | `.github/workflows/audit-plan.yml` |
| 3. Enforce frontmatter on all plan docs | Week 1 | Migration of v1.3 content with frontmatter added |
| 4. Add INDEX.md + CONTEXT.md generation | Week 2 | Auto-generated artifacts |
| 5. Add SQLite index (Phase 2) | When corpus crosses ~50 docs | `docs/plan/index.sqlite` |
| 6. Add `pnpm plan:query` CLI | Phase 2 | Local SQL query interface |
| 7. Promote to Supabase planning schema | When solo workflow needs real-time UI | Year 2+ |
| 8. Build `/admin/plan` Payload view | Phase 3 | Browser-based tree navigation |

## Sources

- Spec-driven development:
  - [Working Backwards PR/FAQ (Amazon)](https://workingbackwards.com/concepts/working-backwards-pr-faq-process/)
  - [Industrial Empathy: Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/)
  - [Pragmatic Engineer: RFCs and Design Docs](https://blog.pragmaticengineer.com/rfcs-and-design-docs/)
  - [Rust RFC Book](https://rust-lang.github.io/rfcs/)
- Planning systems:
  - [Backstage TechDocs](https://backstage.io/docs/features/techdocs/)
  - [Diátaxis framework](https://diataxis.fr/)
  - [Dendron wiki](https://wiki.dendron.so/)
  - [arc42 overview](https://arc42.org/overview)
  - [C4 Model](https://c4model.com/)
- AI-assisted spec workflows:
  - [GitHub Spec Kit](https://speckit.org/)
  - [Augment Code: Claude Code SDD](https://www.augmentcode.com/guides/claude-code-spec-driven-development)
  - [Addy Osmani: How to write a good spec for AI agents](https://addyosmani.com/blog/good-spec/)
  - [obra/superpowers](https://github.com/obra/superpowers)
  - [gotalab/cc-sdd](https://github.com/gotalab/cc-sdd)
  - [ACON: Optimizing Context Compression for Long-horizon LLM Agents](https://arxiv.org/pdf/2510.00615)
- Empirical (the honest data):
  - [Boehm: Software Defect Reduction Top 10 List](https://www.cs.cmu.edu/afs/cs/academic/class/17654-f01/www/refs/BB.pdf)
  - [NASA: Error Cost Escalation replication](https://ntrs.nasa.gov/api/citations/20100036670/downloads/20100036670.pdf)
  - Laurent Bossavit — *The Leprechauns of Software Engineering* (the critical view on Boehm's curve)
