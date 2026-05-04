---
id: csps.plan.master
name: master-plan
description: CSPS trunk index — pillar overview, cross-cutting principles, build order, migration tracker. Substantive content lives in per-pillar leaves under docs/plan/pillar-N-*/.
version: 1.5
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:planning
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
---

# CSPS — Master Plan

*CoreSights Platform Services: an app foundry, multi-tenant by default, extraction-ready by design.*

*Architectural metaphor (origin codename: "Cambium"): the living layer of a tree that generates new growth. The platform is the trunk; each app is a branch grown from one core; matured branches graft off as standalone trees.*

**Status:** v1.5 — mechanical enforcement architecture + 4 operating principles formalized
**Owner:** Finky
**Last updated:** 2026-05-01

---

## Preamble — what this plan is, and why

CSPS is a multi-tenant SaaS platform that hosts 30–75 apps. Each app starts inside CSPS (sharing infrastructure, identity, billing, AI), grows paying customers, and — once it hits product-market fit — graduates as a standalone product while CSPS keeps serving the long-tail of in-platform customers.

**The problem this plan solves.** A solo developer building 30–75 apps faces a forced choice: build them as a monolith (cheap to start, painful at scale), or build them as separate codebases (clean but ~30× the operational tax). Neither works. The third option — a *foundry*, where apps share a kernel but can extract cleanly — has been done at scale (Tiny.com, Constellation Software, the YC portfolio model) but rarely documented as architecture. This plan is that documentation.

**This file is the trunk index.** It contains the cross-cutting principles that apply to every pillar, the pillar overview, and links to leaf documents. Substantive content lives under `docs/plan/pillar-N-<name>/<topic>.md`. The trunk obeys the same complexity contract as any module's `index` file (≤400 lines).

**How to read this plan.** Read this file top-to-bottom for orientation. Then dive into any pillar README for that pillar's overview, then into leaf documents for specifics. Every section explains *what* it locks AND *why* — so you can re-evaluate later without re-deriving the reasoning.

**When this plan changes.** Edit the relevant leaf document with PR-tracked changes. Major versions (vN.0 → vN+1.0) when ≥3 sections change architecturally. Minor versions when individual sections expand. Architectural Decision Records in `docs/adr/NNNN-*.md` capture *why* a decision changed (the leaf documents capture the current state).

---

## The operating principles (always-on)

Cognitive-load-aware human-AI collaboration. All four live in `packages/principles/principles.yaml` (entries P-OP-001 through P-OP-004) as the single source of truth, with full enforcer maps + industry lineage. Detailed in [pillar 0 / operating-principles.md](docs/plan/pillar-0-governance/operating-principles.md).

1. **Reuse-first** (P-OP-001) — Check what exists. Enhance the ratified thing. Create new only with a justification.
2. **FWWS** (P-OP-002) — Finish What We Started. Resist drift to new work while in-flight work is incomplete.
3. **PCR** (P-OP-003) — When presenting decisions, use Pros / Cons / Recommendation format.
4. **Batched execution** (P-OP-004) — For N similar operations: agree acceptance criteria upfront, batch execute, single completion summary. **No mechanical micro-stops.**

**Counterweight clauses** (encoded in `principles.yaml`): each principle has its escape hatch. Reuse-first has the wrong-abstraction clause (Sandi Metz). FWWS has the explicit-park clause. PCR has the trivial-reversible-decision skip. Batched execution has the disciplined-initiative escape (Mission Command).

---

## Mechanical enforcement is the spine

Principles that depend on memory die. Principles that depend on mechanical enforcement at multiple independent layers survive vendor switches, session loss, agent delegation, and human bypass attempts.

**The architecture** (full detail in [pillar 0 / mechanical-enforcement.md](docs/plan/pillar-0-governance/mechanical-enforcement.md)):

```
packages/principles/principles.yaml          ← SINGLE SOURCE OF TRUTH
                  │
                  ▼ (codegen pipeline)
   ┌──────────────┼──────────────┬──────────────┬──────────────┐
   ▼              ▼              ▼              ▼              ▼
AGENTS.md     packages/      .claude/         Nx/ESLint     packages/
(per-dir      skills/        hooks/           rules + OPA   principles-mcp/
 cascade)     (PCR, WIP,     (PreToolUse      policies      (cross-vendor
              audit-self,    blocks)                        wire)
              batched-plan,
              reuse-check)
```

**Defense-in-depth minimums** per principle severity:
- `critical` — ≥4 enforcers, ≥2 non-AI (the AI layer is treated as the LEAST reliable, not the only one)
- `error` — ≥3 enforcers, ≥1 non-AI
- `warn` — ≥2 enforcers
- `info` — ≥1 enforcer

The audit-the-audits meta-check (`P-META-001`) verifies these minimums on every PR. A principle without sufficient enforcers fails the build.

**Multi-level inheritance** (platform → app → agent → session) happens four reinforcing ways:
1. AGENTS.md cascade (per-directory; child extends parent)
2. Shared MCP server (`packages/principles-mcp/` — every agent connects)
3. Mastra `BaseAgent` pulls platform principles from MCP at construction
4. Audit-runner package — same checks at every level

**When apps graduate**, principles travel: `principles.yaml` + audit-runner + MCP server are vendored into the standalone repo. Self-contained, provably descended.

---

## The reuse-first principle (load-bearing, repeated throughout)

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

**Counterweight clause:** *Enhance the ratified thing — unless the ratified thing is the wrong abstraction. Inline-and-redecide is always available.*

This principle is the single most important behavior in CSPS. Full enforcer mapping in [pillar 0 / reuse-first-principle.md](docs/plan/pillar-0-governance/reuse-first-principle.md) and `packages/principles/principles.yaml#P-OP-001` (10 enforcers across instruction-file, skill, AI prompt addendum, hook, frontmatter contract, PR bot, CI check, audit metric, MCP resource, MCP tool).

**Engraved across the plan in:** every pillar README's preamble, the slice contract, every generator spec, the ADR template, the AI agent system prompt (`AGENTS.md`), the PR template, the glossary, the onboarding doc, the audit runner spec, the catalog browser UX. **If you encounter a section that should reference this principle and doesn't, that's a bug — file an ADR.**

---

## Architecture principles (the rules)

The full 27 principles are in [pillar 0 / architecture-principles.md](docs/plan/pillar-0-governance/architecture-principles.md) (migration target; currently stubs in principles.yaml as P-ARCH-001 through P-ARCH-027). Cross-cutting summary:

1. **Mechanical over procedural.** Every rule that matters is enforced by a linter, CI gate, generator, or runtime check. Rules in a README rot.
2. **Files are truth, DB is index.** Source-controlled artifacts are canonical. DBs mirror them.
3. **One source of truth per concern.** ZModel = schema. Glossary = vocabulary. Stripe = entitlements. Catalog = artifacts. Principles.yaml = principles.
4. **Default deny, opt in.** Capabilities, tier features, skill permissions start at zero.
5. **Generators carry the load.** A solo developer cannot scaffold 30 apps × 16 slices × 5 layers by hand.
6. **The platform is the dogfood.** The audit system is itself an audited slice. Self-hosting proves the model.
7. **Extraction-readiness from day one.** Every choice evaluated against "would this make spinning off an app easy or painful?"
8. **AI-readable architecture.** Frontmatter on every file; catalog exposes artifacts as MCP resources.
9. **Reuse-first** (the principle above, repeated for emphasis).
10. **Defense-in-depth enforcement.** No single enforcement layer carries the burden alone.

---

## The pillar architecture

CSPS uses **6 pillars + 1 meta-pillar**, with cross-cutting concerns layered as frontmatter tags. Pillar count is in the industry-validated 4–6 sweet spot (NIST CSF 2.0, AWS WAF, Azure WAF, Google Cloud Framework all converge here). Topical-primary structure (arc42 model) so navigation matches the writer's mental model; cross-cutting tags (WAF model) so completeness audits stay possible.

### [Pillar 0 — Governance](docs/plan/pillar-0-governance/README.md) *(meta)*

Principles, conventions, fitness functions (audit runner, dashboards), ADRs, rule registry, mechanical enforcement architecture, operating principles, the planning playground. Sits above the operational pillars. Aligns with NIST CSF 2.0's "Govern" meta-function.

### [Pillar 1 — Architecture & Stack](docs/plan/pillar-1-architecture-and-stack/README.md)

Tech stack choices, repo layout, naming protocol, vocabulary, frontmatter standard, vocabulary-as-code, C4 Context+Container, the module-folder pattern, the slice contract, the complexity contract. Aligns with arc42 §1+§2 and C4 abstraction levels.

### [Pillar 2 — Data & Schema](docs/plan/pillar-2-data-and-schema/README.md)

ZModel base, foundation slices, app schema contract, multi-tenant isolation, audit triggers, partitioning strategy, RLS performance patterns. Aligns with TOGAF's "Data" domain.

### [Pillar 3 — Platform Services](docs/plan/pillar-3-platform-services/README.md)

Stripe + Clerk wiring, Cloudflare bindings, customer-kit primitives, page templates, template governance, catalog & bundle system, sandboxed skill governance, Mastra setup, persona composition, crisis escalation. The third-party + shared-service layer. Aligns with CNCF "Infrastructure/Data/Identity/Security services."

### [Pillar 4 — Developer Experience](docs/plan/pillar-4-developer-experience/README.md)

Generators (slice / page / app / agent / skill / persona / wizard / split / skill-import / skill-promote / skill-upgrade), the skill ingestion contract, the catalog-first generator UX, the AI prompt addendum, the bootstrap script, the `packages/skills/` invokable skill set. Aligns with Backstage "Software Templates" + Spotify "Golden Paths."

### [Pillar 5 — AI Systems](docs/plan/pillar-5-ai-systems/README.md)

Persona schema + composition function, persona bundles, persona memory (hybrid model), persona evals, agent runtime (one parameterized Mastra agent serves all personas), starter personas + bundles, skill governance from the AI consumer side. No canonical industry pillar name yet; "AI Systems" is the closest convergent term.

### [Pillar 6 — Operations & Delivery](docs/plan/pillar-6-operations-and-delivery/README.md)

Build order (12-week roadmap), graduation pipeline, observability, cost/tier economics, deployment, dashboards, open frontiers. Combines AWS WAF "Operational Excellence" + "Reliability" + "Cost" + "Performance Efficiency" pillars under a single topical pillar.

---

## Cross-cutting concern tags

Every leaf document declares which cross-cutting concerns it addresses, via frontmatter:

```yaml
crosscutting:
  - security        # authn, authz, RLS, supply chain, sandbox
  - reliability     # SLOs, error budgets, partitioning, idempotency
  - cost            # tier economics, partition pruning, query budget
  - performance     # caching, indexing, query optimization
  - observability   # logs, metrics, traces, OTel GenAI conventions
  - multi-tenant    # tenant_id, schema-per-app, RLS policies
  - ai-native       # personas, agents, MCP resources, prompt context
```

A completeness audit verifies every cross-cutting concern is addressed by at least one leaf doc per pillar.

---

## The slice contract (16 checks, percentage-based)

Every slice scores ≥90% to merge, 100% = gold. Full spec in [pillar 1 / slice-contract.md](docs/plan/pillar-1-architecture-and-stack/slice-contract.md). Summary: ZModel definition, base columns inherited, ZenStack `@@allow` policy, audit trigger attached, Zod schema generated, Payload collection registered, customer routes, test file, relationship pickers, slice manifest, ActivityFeed drawer, registered template usage only, app-schema isolation, frontmatter completeness, file size + complexity within limits, bundle membership declared.

---

## Tech stack (locked)

Full stack table in [pillar 1 / tech-stack.md](docs/plan/pillar-1-architecture-and-stack/tech-stack.md). Headline picks:

- Workspace: Nx + pnpm
- Runtime: Next.js 15 App Router
- Database: Supabase Postgres + RLS + schema-per-app
- ORM + authz: Prisma multi-schema + ZenStack
- Admin: Payload CMS 3.0 mounted in Next.js
- UI: shadcn/ui + Tremor (wrapped in `@csps/templates`, never imported directly)
- Auth: Clerk Organizations
- Billing: Stripe Entitlements + reconciliation cron
- AI runtime: Mastra
- Sandbox: Cloudflare Workers
- Generators: Nx generators + Hygen
- Principle enforcement: AGENTS.md + skills + hooks + MCP server (per `principles.yaml`)

---

## Build order (week-by-week summary)

Full roadmap in [pillar 6 / build-order.md](docs/plan/pillar-6-operations-and-delivery/build-order.md). Headline:

| Week | Milestone |
|---|---|
| 1 | Repo bootstrap, Postgres, audit triggers, base ZModel, glossary + catalog scaffold + **`packages/principles/principles.yaml`** + `packages/principles-mcp/` skeleton |
| 2 | Foundation slices, Stripe/Clerk wiring, glossary codegen, frontmatter validator, **`packages/principles/codegen.ts` full implementation** |
| 3 | `platform:slice` generator + customer kit + first slice → 100% + first skills shipped (`/pcr`, `/wip-check`, `/reuse-check`) |
| 4 | Audit runner + 30+ checks + page templates + Storybook + AI discipline hooks + meta-audit (`P-META-001` enforcer) |
| 5 | Slice scorecard CI gate + `platform:split` + graduation extraction stub |
| 6 | Generators for agent/skill/persona/wizard + Mastra **BaseAgent + MCP integration** + skill-eval Worker + skill-importer |
| 7 | Persona slice + bundles + customer chat shell |
| 8 | Crisis escalation slice (load-bearing for v1) |
| 9 | 8 starter personas + 5 starter bundles + domain overlays |
| 10 | Admin dashboards + impersonation + `/admin/policies` (rule registry UI) |
| 11 | `platform:app` generator + first SaaS app inside platform (verifies cascade + vendored audit-runner + vendored MCP) |
| 12 | Polish, harden CI, first 5 ADRs, v1 launch candidate |

---

## Bootstrap script

Full PowerShell bootstrap in [pillar 6 / bootstrap-script.md](docs/plan/pillar-6-operations-and-delivery/bootstrap-script.md). Run once when the GitHub repo + Supabase + Stripe + Clerk are provisioned.

---

## Tomorrow's checklist (provisioning)

Before week 1 can begin:

1. **GitHub repo** `csps` (private)
2. **Supabase project** `csps-prod` — copy `DATABASE_URL`
3. **Stripe sandbox** test-mode keys
4. **Clerk app** with Organizations enabled

---

## Plan migration status

The substantive content from v1.3 is being migrated into per-pillar leaf documents. Migration tracker:

| Source (v1.3 section) | Destination | Status |
|---|---|---|
| §0 Vocabulary | `pillar-1/vocabulary.md` | 🟢 migrated v1.6 |
| §0.5 Vocabulary-as-code | `pillar-1/vocabulary-as-code.md` | 🟢 migrated v1.6 |
| §0.7 Frontmatter standard | `pillar-1/frontmatter-standard.md` | 🟢 migrated v1.6 |
| §1 Architecture principles | `pillar-0/architecture-principles.md` | 🟢 migrated v1.7 (full content + principles.yaml stubs filled) |
| §2 Tech stack | `pillar-1/tech-stack.md` | 🟢 migrated v1.6 |
| §3 Repo layout | `pillar-1/repo-layout.md` | 🟢 migrated v1.6 |
| §4 Naming protocol | `pillar-1/naming-protocol.md` | 🟢 migrated v1.6 |
| §5 Slice contract | `pillar-1/slice-contract.md` | 🟢 migrated v1.6 |
| §5.5 Complexity contract | `pillar-1/complexity-contract.md` | 🟢 migrated v1.6 |
| §5.6 Module-folder pattern | `pillar-1/module-folder-pattern.md` | 🟢 migrated v1.6 (renamed from "manifested slice") |
| **NEW v1.6** | `_legacy/README.md` (migration provenance) | 🟢 created |
| §5.7 Skill ingestion contract | `pillar-4/skill-ingestion-contract.md` | 🟢 migrated S003 v1.0 |
| §6 Foundation ZModel | `pillar-2/foundation-zmodel.md` | 🟢 migrated v1.8 |
| §6.5 App schema contract | `pillar-2/app-schema-contract.md` | 🟢 migrated v1.8 |
| §7 Starter slices | `pillar-2/starter-slices.md` | 🟢 migrated v1.8 |
| §8 Audit triggers | `pillar-2/audit-triggers.md` | 🟢 migrated v1.8 |
| §9 Stripe + Clerk wiring | `pillar-3/stripe-clerk-wiring.md` | 🟢 migrated S002 v1.0 |
| §10 Generators | `pillar-4/generators.md` | 🟢 migrated S003 v1.0 |
| **NEW S003** | `pillar-4/skills-package.md` | 🟢 created S003 v1.0 |
| **NEW S003** | `pillar-4/ai-behavior-instructions.md` | 🟢 created S003 v1.0 |
| §11 Customer kit | `pillar-3/customer-kit.md` | 🟢 migrated S002 v1.0 |
| §11.5 Template governance | `pillar-3/template-governance.md` | 🟢 migrated S002 v1.0 |
| §11.7 Catalog & bundle | `pillar-3/catalog-bundle-system.md` | 🟢 migrated S002 v1.0 |
| §11.8 Sandboxed skill governance | `pillar-3/sandboxed-skill-governance.md` | 🟢 migrated S002 v1.0 |
| §12 Persona composition | `pillar-5/persona-composition.md` | 🟢 migrated S003 v1.0 |
| §13 Crisis escalation | `pillar-5/crisis-escalation.md` | 🟢 migrated S003 v1.0 |
| §14 Audit runner | `pillar-0/audit-runner.md` | 🟢 migrated v1.7 |
| §15 Dashboards | `pillar-6/dashboards.md` | 🟢 migrated S003 v1.0 (6 intake pages incorporated) |
| §16 Mastra setup | `pillar-5/mastra-setup.md` | 🟢 migrated S003 v1.0 |
| §17 Build order | `pillar-6/build-order.md` | 🟢 migrated S003 v1.1 (BLK-S002-003 cohort shuffle) |
| §17.5 Graduation pipeline | `pillar-6/graduation-pipeline.md` | 🟢 migrated S003 v1.0 |
| §18 Bootstrap script | `pillar-6/bootstrap-script.md` | 🟢 migrated S003 v1.0 |
| §19 Open frontiers | `pillar-6/open-frontiers.md` | 🟢 migrated S003 v1.0 |
| **NEW v1.4** | `pillar-0/reuse-first-principle.md` | 🟢 created |
| **NEW v1.4** | `pillar-0/rule-registry.md` | 🟢 created |
| **NEW v1.4** | `pillar-0/adr-process.md` | 🟢 created |
| **NEW v1.4** | `pillar-0/planning-playground.md` | 🟢 created |
| **NEW v1.5** | `AGENTS.md` (root) | 🟢 created |
| **NEW v1.5** | `packages/principles/principles.yaml` | 🟢 created |
| **NEW v1.5** | `packages/principles/codegen.ts` (skeleton) | 🟢 created |
| **NEW v1.5** | `pillar-0/mechanical-enforcement.md` | 🟢 created |
| **NEW v1.5** | `pillar-0/operating-principles.md` | 🟢 created |
| **NEW S002** | `pillar-0/stewardship-protocol.md` | 🟢 created (P-META-004) |
| **NEW S002** | `pillar-0/learning-loop.md` | 🟢 created (P-META-005) |
| **NEW S002** | `pillar-0/ai-behavior-spine.md` | 🟢 created (CSP carry-forward absorbed) |
| **NEW S002** | `pillar-0/behavioral-contracts.md` | 🟢 created (B_* contracts) |
| **NEW S002** | `_intake/` (intake plane) | 🟢 created (8 docs: README + source-types + manual-protocol + tag-status-contract + proactive-completion + walkthrough + dashboard-plan + unknown-path-protocol + input-assessment-questions + extractions-ledger + contexts/ tree) |
| **NEW S002** | `_handoff/VAULT/` (5 vault files) | 🟢 created (insights + research-index + protocols v1.3 + open-questions-ledger + validation-pass-S002 + gaps-and-duplications-S002 + blockers-S002) |
| **NEW S003** | `_handoff/VAULT/principles-snapshot.md` | 🟢 created S003 v1.0 |
| **NEW S003** | `_handoff/VAULT/decisions-snapshot.md` | 🟢 created S003 v1.0 |
| **NEW S003** | `_handoff/VAULT/pending-work.md` | 🟢 created S003 v1.0 |
| **NEW S003** | `_handoff/VAULT/user-intents.md` | 🟢 created S003 v1.0 |
| **NEW S003** | `_handoff/VAULT/blockers-S003.md` | 🟢 created S003 v1.0 (zero blockers) |
| **NEW S003** | `_handoff/VAULT/validation-pass-S003.md` | 🟢 created S003 v1.0 |
| **NEW S003** | `_handoff/VAULT/gaps-and-duplications-S003.md` | 🟢 created S003 v1.0 |
| **NEW S003** | `_handoff/VAULT/chat-jump-prompt-S003-to-S004.md` + autonomous-overnight variant | 🟢 created S003 v1.0 |
| **NEW S003** | `_handoff/HANDOFF-S003-to-S004.md` | 🟢 created S003 v1.0 (Zone A/B/C/D structure — first application) |
| **MODIFIED S003** | `_handoff/VAULT/protocols.md` | bumped 1.7 → 1.8 (+§11b.1 signature + §11b.2 manifest) |
| **MODIFIED S003** | `pillar-1/frontmatter-standard.md` | +descriptors[] open lane section |
| **MODIFIED S003** | `_intake/tag-status-contract.md` | +descriptors + 10 transition validators |
| **MODIFIED S003** | `_intake/source-types.md` | +content_modality dimension (~46 subtypes) |
| **NEW extended-S003** | `pillar-6/observability.md` | 🟡 stub created (lifecycle: experimental, pending-protocol, post-v1) |
| **NEW extended-S003** | `pillar-6/cost-economics.md` | 🟡 stub created (lifecycle: experimental, pending-protocol, post-v1) |
| **NEW extended-S003** | `pillar-6/runbooks.md` | 🟡 stub created (lifecycle: experimental, pending-protocol, post-v1) |
| **NEW extended-S003** | `pillar-6/slo-error-budgets.md` | 🟡 stub created (lifecycle: experimental, pending-protocol, post-v1) |
| **NEW extended-S003** | `packages/skills/pcr/SKILL.md` | 🟢 created (P-OP-003 backed) |
| **NEW extended-S003** | `packages/skills/wip-check/SKILL.md` | 🟢 created (P-OP-002 backed) |
| **NEW extended-S003** | `packages/skills/reuse-check/SKILL.md` | 🟢 created (P-OP-001 backed) |
| **NEW extended-S003** | `packages/skills/batched-plan/SKILL.md` | 🟢 created (P-OP-004 backed) |
| **NEW extended-S003** | `packages/skills/audit-self/SKILL.md` | 🟢 created (P-META-001 backed) |
| **MODIFIED extended-S003** | `pillar-0-governance/audit-runner.md` | +66 audit checks across 14 new categories (~91 total; was 47); closes audit-registry dangling-ref debt |
| **MODIFIED extended-S003** | `pillar-4-developer-experience/skills-package.md` | +future-artifact-references warning section (Gap 2 §C3.6) |
| **MODIFIED extended-S003** | `pillar-5-ai-systems/mastra-setup.md` | +future-artifact-references warning section (Gap 2 §C3.6) |
| **NEW S004** | `_handoff/VAULT/blockers-S004.md` | 🟢 created (zero blockers) |
| **NEW S004** | `_handoff/VAULT/validation-pass-S004.md` | 🟢 created (3 perspectives clean; moderate-but-ratified drift documented) |
| **NEW S004** | `_handoff/VAULT/gaps-and-duplications-S004.md` | 🟢 created (0 dup; 2 deferred gaps — Supabase REST 401 + dev-keys.txt teardown) |
| **NEW S004** | `_handoff/VAULT/chat-jump-prompt-S004-to-S005.md` | 🟢 created (minimal paste-target) |
| **NEW S004** | `_handoff/VAULT/chat-jump-prompt-S004-to-S005-detailed.md` | 🟢 created (~250 word standalone) |
| **NEW S004** | `_handoff/HANDOFF-S004-to-S005.md` | 🟢 created (Zone A/B/C/D; second application of CSP carry-forward) |
| **NEW S004** | `.gitignore` (workspace root) | 🟢 created (Node.js / Next.js / Nx exclusions + .claude/settings.local.json + secrets/*) |
| **MILESTONE S004** | First git push to GitHub remote | 🚀 post-git mode active — github.com/CommarkG/csps (private) |
| **MODIFIED S004** | `_handoff/HANDOFF-S003-to-S004.md` | lifecycle_state: active → resolved + superseded_by csps.handoff.S004-to-S005 |
| **CONFIG S004** | `~/.claude/settings.json` (global) | +"PowerShell" allow rule (auto-approves all PS calls; matches "Bash"+"Read" pattern) |
| **MEMORY S004** | `feedback_clipboard_clobber_pattern.md` | 🟢 created (S004 catch — 3× hit before engraving) |
| **MEMORY S004** | `feedback_leaked_secrets_rotation_discipline.md` | 🟢 created (S004 catch — Clerk + Supabase rotated mid-session) |
| **EXTERNAL S004** | 4 services provisioned + verified live | Clerk + Supabase csps-prod (eu-central-1) + Stripe test-mode + Cloudflare (csps-* naming on shared account) |
| **EXTERNAL S004** | Bitwarden + CSPS Dev Keys secure note | created; replaces password-manager prerequisite |
| **EXTERNAL S004** | 2 dev keys rotated (post-leak-detection) | Clerk secret (csps-bootstrap key replaces deleted default) + Supabase DB password (16-char, 3-slot consistency) |
| **NEW S002** | `docs/adr/0001-0021` | 🟢 21 ADRs written (18 seed + 3 enhancement) |
| **NEW S002** | `libs/policies/slices/public/learning-loop-item.zmodel` | 🟢 created (P-META-005 schema) |
| **NEW S002** | `libs/policies/slices/public/external-input.zmodel` | 🟢 created (intake plane schema) |
| **NEW S002** | `packages/skills/learning-loop-extract/SKILL.md` | 🟢 stub created |
| **NEW S002** | `packages/skills/stewardship-review/SKILL.md` | 🟢 stub created |
| **NEW S002** | `.claude/hooks/post-stop-learning-loop.sh` | 🟢 stub created |
| **NEW S002** | `.claude/hooks/user-prompt-submit-intake.sh` | 🟢 stub created (chat-channel intake gate) |

The legacy v1.3 content remains intact; migration is one pillar at a time. While migration is in progress, refer to v1.3 archived as `docs/plan/_legacy/MASTER_PLAN_v1.3.md` (created on next migration step).

---

## Iteration policy

- Edit leaf documents directly with PR-tracked changes
- Edit `packages/principles/principles.yaml` for principle additions/changes; `pnpm principles:codegen` regenerates downstream
- ADRs in `docs/adr/NNNN-*.md` capture *why* a decision changed (state lives in the leaves + principles.yaml)
- Major restructure (vN.0 → vN+1.0) when ≥3 pillars change architecturally
- Minor versions (vN.X) when individual leaves expand
- Every leaf doc opens with its frontmatter (id, owner, status, version, tags) and a one-line reminder of the reuse-first principle
- **Every change to principles.yaml must include a regeneration commit; CI fails on drift**

---

**End of trunk index. Substantive content lives under `docs/plan/pillar-N-<name>/` and `packages/principles/principles.yaml`.**
