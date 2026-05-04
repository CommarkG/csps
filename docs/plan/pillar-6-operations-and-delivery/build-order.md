---
id: csps.pillar-6.build-order
name: build-order
description: The 12-week build order to v1 launch. Locks the dependency graph (foundation before slices, slices before generators, generators before apps). Connector cohort priority shuffled per BLK-S002-003 (AI-app exports wk5 / PDF+text wk6 / Google wk7 / multimedia wk8). Migrated from v1.3 §17 + UPDATED per BLK-S002-003.
version: 1.1
owner: group:finky
lifecycle: production
lifecycle_state: active
next_review_at: 2026-08-01
tags:
  - domain:ops
  - type:how-to
  - audience:developer
  - audience:admin
  - maturity:stable
crosscutting:
  - reliability
  - cost
  - observability
diataxis_type: how-to
links:
  - { rel: parent, href: ./README.md }
  - { rel: graduation-pipeline, href: ./graduation-pipeline.md }
  - { rel: bootstrap-script, href: ./bootstrap-script.md }
  - { rel: dashboards, href: ./dashboards.md }
  - { rel: open-frontiers, href: ./open-frontiers.md }
created-new-because: |
  No prior build-order leaf exists. v1.3 §17 had the week-by-week roadmap inline; this leaf
  consolidates it as a per-pillar reference AND incorporates the BLK-S002-003 connector cohort
  shuffle (resolution at S002 turn 9 → option B). Distinct from MASTER_PLAN's brief week table
  (which is the trunk index summary).
---

# Build Order — 12 Weeks to v1

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The week-by-week dependency graph from empty repo to v1 launch candidate. The shipping order is engineering-constrained (foundation before slices, slices before generators, generators before apps). The connector cohort priority (AI-app exports → PDF/text → Google → multimedia) is product-constrained (per BLK-S002-003 — the order minimizes user effort to get value into the system).

## Why this exists

Without a locked build order, week-1 work depends on week-3 artifacts; week-3 work depends on a generator that hasn't shipped; the platform never converges. The order is **non-negotiable up to its dependency boundary** — within a week, batched-execution per P-OP-004 applies; across weeks, the dependency edges hold.

## Pre-week-1 provisioning checklist (user action)

Before week 1 begins:

1. **GitHub repo** `csps` (private)
2. **Supabase project** `csps-prod` — copy `DATABASE_URL`
3. **Stripe sandbox** test-mode keys
4. **Clerk app** with Organizations enabled

Per pillar-6 README + MASTER_PLAN tomorrow's-checklist. Without these, the bootstrap script (per `bootstrap-script.md`) fails on first run.

## Per-week cycle requirements (P-META-008 + B_PRE_CLOSE_VERIFICATION — S005 turn 19)

> **EVERY week's deliverables list ends with mandatory cycles to run before declaring the week complete.** This is plan-mechanical: the week is not "done" until these cycles all PASS or are explicitly DEFERRED-WITH-REASON. Per P-META-008 cycle-mandatory-in-plan.

The cycle list per-week is the same orchestrator (`tools/verify.mjs` via `pnpm verify`) plus week-specific additions as new validators ship:

| Week | Always-on cycles | Week-specific cycles added |
|---|---|---|
| 1 | `pnpm install --frozen-lockfile` + `pnpm -r typecheck` + `principles validate` + `frontmatter validate` | (none — these ARE week-1's introductions) |
| 2 | + above | + `glossary codegen-fresh` + `principles codegen-fresh` (full impl) + `stripe-clerk-wiring smoke test` |
| 3 | + above | + `slice-scorecard` + `dual-registration-drift` + `generator-test-coverage` |
| 4 | + above | + `pnpm audit:run --strict` (full audit-runner ships; this becomes always-on from week-4 onward) + `audit-of-audits` + `pre-close-cycle-coverage` (the §10.0 enforcer audit itself) |
| 5+ | + above | + week-specific per cohort/slice/persona |

**No week is "complete" with any cycle in FAIL or silent-skip state.** Either fix, defer-with-explicit-reason carried to next-session blockers, or block the week's close. Plans that depend on AI cooperation to trigger cycles produce nominal-not-actual claims (CSPS S002→S005 evidence).

## The 12 weeks

### Week 1 — Foundation

- Repo bootstrap via `bootstrap-script.ps1`
- Postgres on Supabase live; base ZModel committed; audit triggers attached
- `packages/principles/principles.yaml` initial commit (P-OP-001..004 + P-META-001..007 seed rows)
- `packages/principles-mcp/` skeleton
- `packages/catalog/catalog.json` initialized
- Glossary scaffold (`packages/glossary/`)
- Frontmatter validator (`tools/validators/validate-frontmatter.mjs`) PR-blocking

### Week 2 — Stripe + Clerk + codegen

- Foundation slices (User, Tenant, AuditEvent) in production
- Stripe Entitlements wired; reconciliation cron live
- Clerk Organizations wired
- Glossary codegen (`pnpm glossary:codegen`)
- `packages/principles/codegen.ts` full implementation; emits AGENTS.md + skills + hooks
- Schema-per-app boundary infrastructure ready

### Week 3 — `platform:slice` generator + first slice

- `platform:slice` generator working with catalog-first UX
- `tools/generators/slice/files/` Hygen templates complete (16-check coverage)
- Customer kit primitives (`packages/customer-kit/`) live
- First slice (e.g., `Booking`) scaffolded → 100% scorecard
- First skills shipped: `/pcr`, `/wip-check`, `/reuse-check` (codegenerated from `principles.yaml`)

### Week 4 — Audit runner + AI discipline hooks

- Audit runner v1: 30+ checks live (slice-completeness / dual-registration-drift / orphan-file / agents-md-cascade / persona-crisis-slice-attachment / etc.)
- Page templates in `packages/templates/` registered
- Storybook live for templates + customer-kit
- AI discipline hooks: `.claude/hooks/post-stop-learning-loop.sh` + `user-prompt-submit-intake.sh` + `pre-tool-use-capability.sh` all firing
- Meta-audit (`P-META-001` enforcer) running

### Week 5 — Slice scorecard CI gate + AI-app exports cohort

- Slice scorecard CI gate enabled (PRs fail if scorecard < 90% on changed slices)
- `platform:split` generator working
- Graduation extraction stub (per `graduation-pipeline.md`)
- **AI-app exports connector cohort (per BLK-S002-003 priority #1):** ChatGPT / Claude / Gemini / Notion AI / Perplexity export-format ingestion paths shipped first because user-facing apps already produce these formats; lowest user-effort to get value in

### Week 6 — Generators wave 2 + skill-importer + PDF/text cohort

- `platform:agent`, `platform:skill`, `platform:persona`, `platform:wizard` generators
- Mastra `BaseAgent` + MCP integration (per `pillar-5/mastra-setup.md`)
- `apps/skill-eval-worker/` deployed (Cloudflare)
- `platform:skill-import`, `platform:skill-promote`, `platform:skill-upgrade`
- **PDF + text connector cohort (per BLK-S002-003 priority #2):** PDF.js + text-file ingestion per `_intake/source-types.md`; long-tail content unlocked

### Week 7 — Persona slice + customer chat shell + Google cohort

- Persona slice live (per `pillar-5/persona-composition.md`)
- Persona bundles (`libs/personas/bundles/`)
- Customer chat shell live (`apps/customer-shell/api/chat`)
- **Google cohort (per BLK-S002-003 priority #3):** Google Drive / Docs / Sheets ingestion via OAuth + Drive API; widely-used substrate for solo-developer workflow

### Week 8 — Crisis escalation slice (load-bearing for v1) + multimedia cohort

- Crisis escalation slice live (per `pillar-5/crisis-escalation.md`) — pre-LLM detector + post-LLM validator + CrisisEvent slice + escalation paths + admin queue
- All existing personas backfilled with the slice
- Crisis-detector test corpus + recall eval
- **Multimedia connector cohort (per BLK-S002-003 priority #4):** image / audio / video transcription ingestion; the heaviest cohort, deferred so foundational pieces ship first

### Week 9 — Starter personas + bundles + domain overlays

- 8 starter personas (`libs/personas/<slug>/`)
- 5 starter bundles (`libs/personas/bundles/<bundle>/`)
- Domain overlays (`libs/personas/libraries.ts`)
- Per-persona drift evals + style evals + domain-accuracy evals + crisis-detector recall eval all green
- Risk-class guardrail bundles wired

### Week 10 — Admin dashboards + impersonation

- `apps/admin` mounted (Payload CMS in Next.js)
- Per `pillar-6/dashboards.md`: live dashboards (slice-scorecard / audit-fitness / persona-eval / crisis-event-queue / cost-attribution / `/admin/intake/*` 6 pages)
- Impersonation gate (`staffRole`)
- `/admin/policies` (rule registry UI)

### Week 11 — `platform:app` generator + first in-platform SaaS app

- `platform:app` generator complete (schema-per-app + Clerk org + tier defaults + extraction-readiness scaffold)
- First in-platform app shipped (proves cascade + vendored audit-runner + vendored MCP work)
- Verifies the foundry model end-to-end

### Week 12 — Polish + harden + v1 launch candidate

- CI hardening (audit-of-audits running clean)
- First 5 ADRs (post-launch architectural decisions)
- Documentation pass (every leaf has its `enhances:` or `created-new-because:` declared; orphan-file audit clean)
- Bootstrap script re-tested from empty Supabase
- v1 launch candidate

## Critical-path dependency graph

```
Week 1 (foundation)
  └→ Week 2 (Stripe + Clerk + codegen)
       └→ Week 3 (slice generator + first slice)
            └→ Week 4 (audit runner + hooks)
                 └→ Week 5 (slice CI gate)
                      ├→ Week 6 (generators wave 2)
                      ├→ Week 5+ (AI-app cohort)
                      └→ Week 11 (platform:app)
            └→ Week 6 (Mastra)
                 └→ Week 7 (persona slice)
                      └→ Week 8 (crisis slice — LOAD-BEARING for v1)
                           └→ Week 9 (starter personas)
                                └→ Week 10 (dashboards)
                                     └→ Week 11 (in-platform app)
                                          └→ Week 12 (v1 launch)
```

The crisis slice (week 8) is the load-bearing v1-launch dependency. Personas without it cannot ship to paying customers (per ADR-0006).

## Counterweight clauses (when the order can shift)

- Connector cohorts may swap if user demand surfaces priority change (PCR documented; ADR if material)
- Generators may slip 1 week if the underlying ZModel changes require re-scaffolding
- Crisis slice MAY NOT slip — week 8 is the v1-blocking gate
- Bootstrap script MAY ship later (week 1 produces a working instance; the script is for re-bootstrap in graduation-pipeline scenarios)

## Anti-patterns

1. **Skipping a week** — refused; dependency edges hold; if a week's work doesn't fit, drop scope, don't drop the week
2. **"We'll add audit later"** — refused; audit triggers in week 1 are foundation; everything after assumes them
3. **Persona shipping without crisis slice** — refused; week 8 is the gate
4. **Connector cohort priority changed without ADR** — refused; cohort priority is locked per BLK-S002-003

## Enforcement

- `principles.yaml#P-OP-002` (FWWS — finishing a week before starting next)
- `principles.yaml#P-OP-004` (Batched execution — within a week, batch like-operations)
- `audit-runner.md#dependency-graph-violation` (PR-blocking; e.g., persona slice referencing not-yet-shipped Mastra)
- `pillar-5/crisis-escalation.md` (week 8 deliverable contract)
- `_handoff/VAULT/blockers-S002.md#BLK-S002-003` (the cohort-priority resolution this leaf encodes)

## Sources

- v1.3 §17 (the original 12-week order this leaf migrates)
- BLK-S002-003 resolution (option B — cohort shuffle)
- [pillar-6/graduation-pipeline.md](./graduation-pipeline.md) (how apps spin off post-v1)
- [pillar-6/bootstrap-script.md](./bootstrap-script.md) (how the empty repo becomes a running platform)
- [pillar-6/dashboards.md](./dashboards.md) (week-10 deliverable contract)
