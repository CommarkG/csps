---
id: csps.governance.audit-runner
name: audit-runner
description: The recurring audit system — Fact / Check / Scorecard / Run primitives, ~37 registered checks across 8 categories, severity routing, cadence model, drift dashboard, hotspot dashboard. Backstage Tech Insights pattern, native to CSPS. The platform's continuous health signal and the audit-the-audits meta-check.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:admin
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
  - { rel: rule-registry, href: ./rule-registry.md }
  - { rel: enforcement-architecture, href: ./mechanical-enforcement.md }
---

# The Audit Runner System

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The recurring audit system that runs continuously across CSPS — the schema (Fact / Check / Run / Result), the ~37 registered checks across 8 categories, severity routing, cadence model, dashboard architecture, and the meta-audit that audits the audits.

## Why this exists

Without a recurring audit system, the platform's drift signal is invisible until production breaks. With it, drift is a continuous, visualized signal. Mature platforms (Backstage Tech Insights, Cortex, OpsLevel) all converged on the same primitives: **Facts + Checks + Scorecards + Runs**.

CSPS adopts the pattern natively (per [mechanical-enforcement.md](./mechanical-enforcement.md)) — we don't run Backstage; we copy the pattern. The audit runner is itself an audited slice (per P-ARCH-015 — self-hosting proves the model).

## Schema (Foundation slices 6–9)

The audit system is backed by 4 Foundation slices in the `public` schema:

```prisma
model AuditCheck extends Base {
  slug         String   @unique               // e.g., "schema-zmodel-prisma-drift"
  category     String                          // schema | security | sanity | vocab | quality | catalog | skills | cost | integrity | meta
  severity     String                          // info | warn | error | critical
  weight       Float                           // for weighted health score (0..1)
  slaMinutes   Int?                            // soft SLA for resolution
  cadence      String                          // PR | nightly | weekly | real-time | on-demand
  description  String                          // ≤1024 chars
  enforcerLocation String                      // file path of the check implementation
  @@schema("public")
  @@allow('read', auth().staffRole != null)
}

model AuditRun extends Base {
  startedAt   DateTime @default(now())
  finishedAt  DateTime?
  trigger     String                            // "pr" | "cron-nightly" | "cron-weekly" | "manual" | "deploy" | "webhook"
  commitSha   String?
  results     AuditResult[]
  facts       AuditFact[]
  @@schema("public")
}

model AuditResult extends Base {
  runId        String
  checkSlug    String
  status       String                            // "pass" | "warn" | "error" | "critical" | "skipped"
  score        Float?                            // 0..1; null if check is binary
  evidence     Json                              // structured detail per check
  quickfixUrl  String?                           // link to PR / migration / doc that fixes
  confidence   Float                             // 0..1; only ≥0.9 opens tickets
  run          AuditRun @relation(fields: [runId], references: [id])
  check        AuditCheck @relation(fields: [checkSlug], references: [slug])
  @@schema("public")
  @@deny('update,delete', true)                 // append-only
}

model AuditFact extends Base {
  runId        String
  source       String                            // "git" | "postgres" | "filesystem" | "stripe-api" | "checkly"
  key          String
  value        Json
  computedAt   DateTime @default(now())
  run          AuditRun @relation(fields: [runId], references: [id])
  @@schema("public")
}
```

## The check registry (~37 checks across 10 categories)

Each row in this table corresponds to an `AuditCheck` row registered at bootstrap. The audit runner instantiates them and runs per cadence.

### Schema (6)

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `schema-zmodel-prisma-drift` | PR | error | ZenStack regenerates Prisma schema; `git diff prisma/schema.prisma` must be empty |
| `schema-prisma-db-drift` | nightly | error | `prisma migrate status` against each environment; non-zero exit fails |
| `schema-atlas-drift` | nightly | warn | Atlas continuous schema drift detection |
| `schema-payload-vs-zmodel` | nightly | error | Every Payload collection slug has a Prisma model; field names match |
| `migration-safety-squawk` | PR | critical | Squawk linter on every migration file (catches dangerous DDL) |
| `app-schema-isolation` | PR | error | App slices declare `@@schema("app_<slug>")`; foundation slices use `public` |

### Security (4)

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `rls-coverage` | nightly | critical | Every tenant-scoped table has `rowsecurity=true` (the #1 production footgun — defaults to off) |
| `permission-policy-drift` | nightly | error | Declared `@@allow` policies match effective grants in `pg_policies` |
| `sandbox-escape-diff` | weekly | critical | Diff of skills with `can_execute_code: true` since last run; require explicit re-approval |
| `openssf-scorecard` | weekly | warn | OpenSSF Scorecard Action; scores supply-chain health |

### Sanity (3)

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `playwright-smoke` | nightly | error | Full Playwright suite against staging; smoke critical user flows |
| `ai-smoke-agent` | weekly | warn | Mastra agent that "tries to use the product" end-to-end; catches UX rot |
| `health-endpoints` | real-time | critical | `/api/health` + `/api/ready` on every deployed app respond 200 |

### Vocabulary (5)

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `vale-prose` | PR | warn | Vale lints prose against the glossary's accept/reject lists |
| `eslint-naming` | PR | error | `@typescript-eslint/naming-convention` + `id-denylist` from glossary |
| `naming-collisions` | PR | error | Slug uniqueness across DB ↔ SKILL.md ↔ Stripe ↔ Payload ↔ Catalog |
| `glossary-codegen-fresh` | PR | error | Regenerated Vale dict + ESLint rules + Payload options + ZModel @@meta must match committed |
| `db-column-vs-glossary` | PR | error | Every DB column name resolves to a glossary canonical term |

### Quality (5)

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `slice-scorecard` | nightly | warn | Every slice scores ≥90% per the slice contract |
| `test-coverage-by-slice` | PR | warn | Test coverage per slice is above threshold |
| `bundle-size-drift` | PR | info | Next.js page bundle sizes vs baseline |
| `page-template-coverage` | PR | error | Every `page.tsx` imports from `@csps/templates` (slice contract check #12) |
| `storybook-coverage` | PR | warn | Every page template has a Storybook story |

### Catalog (6)

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `frontmatter-completeness` | PR | error | Every artifact passes the Zod frontmatter schema |
| `file-size-ratchet` | PR | error | No diff makes file size worse on changed files |
| `cognitive-complexity` | PR | error | Cognitive complexity ≤15 on changed functions (`sonarjs/cognitive-complexity`) |
| `hotspot-analysis` | weekly | warn | Top decile of `churn × complexity` per file; posted to dashboard |
| `orphan-file-detection` | weekly | info | Files with no bundle membership AND no `links.index` reference |
| `module-folder-trigger` | nightly | warn | Slice exceeded thresholds; suggests `nx g platform:split` (per P-ARCH-022) |

### Skills (6)

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `skill-vendor-integrity` | PR | error | SHA-pin matches `skills.lock.yaml`; integrity hash valid |
| `skill-capability-drift` | PR | error | Declared permission set hasn't expanded since last review |
| `skill-eval-freshness` | weekly | warn | Every blessed skill re-evaluated within 30-day cadence |
| `skill-banned-tools` | PR | critical | No community-tier skill references banned tools (Bash, Write, Edit, WebFetch, etc.) |
| `skill-collision-check` | PR | error | No naming/feature_key collisions between skills |
| `skill-prompt-injection-scan` | PR | critical | Static scanner (Snyk-style pattern library) for hidden Unicode, HTML comments, "ignore previous" patterns |

### Cost (3)

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `tier-feature-key-reconcile` | nightly | error | Every `feature_key` referenced in code exists as a Stripe Feature; vice versa |
| `cost-drift` | weekly | warn | Stripe usage records vs expected per-tier consumption (free-tier tenants generating Pro-tier load) |
| `audit-retention-pruning` | weekly | info | Per-tier audit retention partition pruning (free 30d, paid 365d, enterprise 7y) |

### Integrity (3)

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `audit-log-integrity` | nightly | critical | No >5-min gap per tenant in `audit.events` (signals dropped writes) |
| `fk-orphan-scan` | nightly | warn | Orphan-row scan per FK; cascading-delete leakage |
| `orphan-entity-scan` | weekly | info | Skills/agents/personas with zero usage in 30 days flagged for deprecation |

### Meta (4 — the audit-the-audits checks, P-META-001 enforcers)

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `audit-of-audit` | nightly | critical | Every check ran in its expected interval; no silent dead checks |
| `principle-coverage` | PR | critical | Every principle in `principles.yaml` has ≥ N enforcers per its severity (P-META-001 enforcer) |
| `enforcer-orphans` | PR | error | Every `// @enforces:` annotation in source references a real principle |
| `principles-codegen-fresh` | PR | error | Regenerated AGENTS.md + skills + hooks + MCP resources from `principles.yaml` must match committed |

### Stewardship (4 — P-META-004 Stored Content Lifecycle enforcers)

Per [stewardship-protocol.md](./stewardship-protocol.md). Every saved artifact declares `lifecycle_state` and has a recurring trigger that advances it. These four checks ensure no artifact becomes an orphan-in-waiting.

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `orphan-without-lifecycle-state` | PR | error | Every artifact has `lifecycle_state` declared (or inherited via `tools/catalog/variants.ts`); blocks PR if missing |
| `stale-pending-review` | PR + nightly | warn | Items in `pending-review` past `sla_pending_review_days` (14) flagged; PR blocks merge if a referenced item is breached |
| `stale-pending-protocol` | nightly | error | Items in `pending-protocol` past `sla_pending_protocol_days` (30) flagged for protocol creation (signals a real input-class gap) |
| `legacy-archive-review-due` | weekly | warn | `_legacy/` items past their `next_review_at` flagged for review or retirement (matches Backstage 90-day quarterly cadence) |

### Zero-Findings Discipline (4 — P-META-006 enforcers, added S002 turn 10)

Per [zero-findings-discipline.md](./zero-findings-discipline.md). Every artifact reaching DONE/COMPLETE/RATIFIED emits an RZF evidence block; every ratified principle/leaf/ADR/contract emits a CEC walk-trail. Cycle count is MEASUREMENT not TARGET.

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `rzf-coverage` | PR | error | Every artifact at `lifecycle_state ∈ {validated, closed}` has an RZF evidence block (cycles_run + findings_per_cycle + final_status + coverage tokens + validators_run + signature). Missing = fail. |
| `cec-walk-trail-completeness` | PR | warn | Every newly-ratified principle/leaf/ADR/behavioral-contract has a CEC walk-trail (extracted_essence + cycles_walked + walk_scope + applications_made + not_applicable + needs_human_judgment + signature). Missing = warn. |
| `cycle-count-as-target-detection` | PR | warn | Detect language pattern "run N cycles" or "predetermined cycles" in commit messages / docs / closing summaries. Cycle count must be findings-driven, not pre-determined. |
| `audit-of-audits` | nightly | critical | Per CSP precedent: audit registry itself is healthy. Result files exist for every registered audit. No audits in ABANDONED state. Audit-frequency matches declared cadence. The RZF discipline applied recursively to the RZF infrastructure. |

### Learning Loop (6 — P-META-005 enforcers)

Per [learning-loop.md](./learning-loop.md). Every input stream (chat, errors, audits, feedback, AI insights) is routed through a single observed → triaged → routed → fixing → validated → closed pipeline. These six checks ensure inputs don't escape the loop and the loop itself doesn't degrade.

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `learning-loop-coverage` | per-session | warn | Every session produced ≥1 extracted item OR explicitly marked "no insights" with justification |
| `repeat-issue-detection` | weekly | error | Same gap appearing in ≥2 sessions within a 90-day window auto-creates an ADR for permanent fix (the killer enforcer; K=2/90d is industry default) |
| `unresolved-observation-stale` | nightly | warn | Items in `observed` state >7 days escalate; >24h SLA for P0/P1 |
| `fix-without-validation` | nightly | error | Items in `fixing` state >14 days without `validated` transition flagged (prevents closure-theater) |
| `validation-without-recurrence-check` | weekly | warn | `closed` items get a 30-day recurrence check (90 for non-critical); reopen if recurrence detected |
| `meta-loop-audit` | monthly | warn | Resolution-cycle-time trend over 90-day rolling window; if degrading >20%, file an ADR. Meta-meta-loop signal. |

### AI-Runtime (8 — Pillar 5 Mastra + persona-composition enforcers, added S003 extended)

Per [mastra-setup.md](../pillar-5-ai-systems/mastra-setup.md) + [persona-composition.md](../pillar-5-ai-systems/persona-composition.md). Defense-in-depth enforcement of the runtime substrate that serves all personas via one Mastra agent.

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `middleware-order` | PR | error | crisis-interceptor FIRST, dispatcher-middleware SECOND in BaseAgent middleware array (per ADR-0006 + ADR-0008 ordering invariant) |
| `direct-llm-call` | PR | error | Static-analysis catches any `Anthropic` / `OpenAI` / `mastra.llm()` call bypassing BaseAgent dispatch |
| `composition-skip` | PR | error | Runtime gate + static analysis: every Mastra dispatch must invoke composePersona; CompositionSkipViolation thrown otherwise |
| `extension-registration-static` | PR | error | App-level middleware extensions registered at bootstrap only; no per-request mutations |
| `persona-composition-skip` | PR | error | Every persona dispatch hits the composition function (sibling of `composition-skip`; persona-side check) |
| `persona-eval-baseline` | PR | error | PUBLISHED personas have eval baseline established (drift / style / domain-accuracy) |
| `persona-drift-detection` | nightly | warn | Topic-drift detected over rolling 7-day window per PUBLISHED persona; warn above threshold |
| `persona-overlay-completeness` | PR | warn | Personas with `domain ∈ {clinical, legal, medical, financial, spiritual}` carry the matching non-counsel disclaimer overlay |

### Persona-Crisis (5 — Pillar 5 crisis-escalation enforcers, added S003 extended)

Per [crisis-escalation.md](../pillar-5-ai-systems/crisis-escalation.md). Load-bearing for v1; ADR-0006.

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `persona-crisis-slice-attachment` | PR | error | Every persona has the crisis-escalation slice attached (cannot opt out) |
| `crisis-detector-recall` | eval-time | critical | Detector + validator combined recall = 100% on test corpus (must = not ≥); eval blocks PUBLISHED transition if violated |
| `crisis-event-retention` | weekly | warn | CrisisEvent rows retained ≥7 years (regulatory floor); warn if any pruned earlier |
| `crisis-escalation-removal` | PR | critical | No persona overrides the slice to REMOVE a default escalation path; extensions are additive-only |
| `crisis-pattern-review` | quarterly | warn | Regex pattern list reviewed by clinician + safety team within 90-day cadence; warn if overdue |

### Operations + Delivery (6 — Pillar 6 enforcers, added S003 extended)

Per [build-order.md](../pillar-6-operations-and-delivery/build-order.md) + [graduation-pipeline.md](../pillar-6-operations-and-delivery/graduation-pipeline.md) + [open-frontiers.md](../pillar-6-operations-and-delivery/open-frontiers.md) + [dashboards.md](../pillar-6-operations-and-delivery/dashboards.md).

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `dependency-graph-violation` | PR | error | No cross-week dependency violation (e.g., persona slice referencing not-yet-shipped Mastra) per `pillar-6/build-order.md` critical-path graph |
| `graduation-eligibility` | weekly | warn | Apps eligible per `graduation-pipeline.md` gate (slice maturity + persona maturity + audit cleanliness + customer migration plan); advisory only |
| `vendoring-provenance` | PR | error | `provenance.yaml` present + valid on every graduate; bidirectional traceability with CSPS |
| `crisis-slice-vendored` | PR | error | Every graduate's vendored governance includes the crisis-escalation slice (load-bearing inheritance) |
| `frontier-trigger-defined` | PR | error | Every entry in `pillar-6/open-frontiers.md` declares a discovery-trigger |
| `frontier-interim-posture-defined` | PR | error | Every frontier declares interim posture (how we behave until trigger fires) |
| `frontier-stale-2-cycles` | weekly | warn | Frontier living past 2 missed review-dates escalates to critical-stale |

### Bootstrap + Dashboard (4 — added S003 extended)

Per [bootstrap-script.md](../pillar-6-operations-and-delivery/bootstrap-script.md) + [dashboards.md](../pillar-6-operations-and-delivery/dashboards.md).

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `bootstrap-idempotency` | nightly | warn | Re-run of `tools/bootstrap.ps1` produces all SKIP states (proves idempotency contract) |
| `bootstrap-readiness-report-completeness` | PR | warn | `tools/bootstrap-readiness.md` has all required sections per `bootstrap-script.md` |
| `admin-app-singleton` | PR | error | No separate `apps/admin-*` apps exist; `/admin/*` is the singleton surface gated by staffRole |
| `impersonation-banner-presence` | PR | error | Banner component present on every impersonated route (high-contrast, non-dismissible, auto-end at 30min) |
| `dashboard-direct-table-read` | PR | error | Static analysis catches dashboard reads of application tables (must read from `audit.events` + `*_facts` materialized views only) |

### Generator + Skill (5 — Pillar 4 enforcers, added S003 extended)

Per [generators.md](../pillar-4-developer-experience/generators.md) + [skill-ingestion-contract.md](../pillar-4-developer-experience/skill-ingestion-contract.md) + [skills-package.md](../pillar-4-developer-experience/skills-package.md).

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `dual-registration-drift` | PR | error | Files exist in tree without catalog entry (orphan files) OR catalog rows without files (orphan catalog entries); per B_ATOMIC_DUAL_REGISTRATION |
| `orphan-file` | PR | error | Alias for `dual-registration-drift` from the file-side; cited by `generators.md` |
| `generator-test-coverage` | PR | warn | Every generator has a test fixture |
| `skill-codegen-drift` | PR | error | Generated skill content (in `packages/skills/<id>/SKILL.md`) hash matches the source row in `principles.yaml` (codegen freshness check) |
| `skill-frontmatter-completeness` | PR | error | Every `SKILL.md` declares full capability set (allowed_tools / allowed_subagents / allowed_outbound_hosts / allowed_db_operations / sensitive_data_access) per pillar-3 sandboxed-skill-governance |
| `skill-lock-drift` | PR | error | `packages/skills.lock.yaml` mutated outside generator invocation; CI fails |
| `catalog-coverage` | PR | warn | Every leaf-level artifact has a catalog entry (not just files Glob-walks find but explicitly registered) |

### AI Behavior (3 — added S003 extended)

Per [ai-behavior-instructions.md](../pillar-4-developer-experience/ai-behavior-instructions.md) + the meta-engraving-of-itself principle.

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `agents-md-cascade-completeness` | PR | error | Every `apps/<name>/` directory has an `AGENTS.md` extending the root contract |
| `session-open-reading-order` | per-session | warn | Session log shows the AI loaded the reading-order files in the spec'd sequence (per `pillar-4/ai-behavior-instructions.md`) |
| `audit-of-audits-fse` | nightly | warn | Meta-RZF on the discipline-engraving system itself: every B_* contract has its 5 surfaces accounted for (active / declared / deferred / n/a-with-reason) per FSE block; surfaces_count_active < 2 = error |

### Intake-Plane Extensions (10 — added S003 §3.5.c, sourced from `_intake/tag-status-contract.md`)

Per [tag-status-contract.md](../_intake/tag-status-contract.md) §explicit-transition-validators-section.

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `transition-validator-pipeline-routed-without-routed-to` | PR | error | `pipeline_state: routed` row WITHOUT `routed_to` field rejected |
| `transition-validator-pipeline-validated-without-recurrence-check-at` | PR | error | `pipeline_state: validated` row WITHOUT `recurrence_check_at` rejected |
| `transition-validator-pipeline-closed-without-closed-reason` | PR | error | `pipeline_state: closed` row WITHOUT `closed_reason` rejected |
| `transition-validator-lifecycle-pending-protocol-without-protocol-spec` | PR | warn | `pending-protocol` row without referenced protocol-design doc surfaces for review |
| `transition-validator-lifecycle-promoted-without-target-leaf` | PR | error | `promoted` row WITHOUT `promoted_to_leaf` field rejected |
| `transition-validator-lifecycle-deprecated-without-superseded-by` | PR | warn | `deprecated` row should declare `superseded_by` (warn-only — pure-retirement permitted) |
| `transition-validator-rzf-on-closed` | PR | error | `pipeline_state: closed` WITHOUT `evidence_block_ref` rejected (per P-META-006) |
| `transition-validator-cec-on-promoted` | PR | warn | `promoted` to principle/leaf/ADR/contract WITHOUT `cec_walk_trail_ref` rejected |
| `transition-validator-backward-without-reason` | PR | error | Any backward transition WITHOUT `backward_transition_reason` rejected |
| `transition-validator-illegal-jump` | PR | error | Skip transition not in allowed-transitions table rejected |

### Tag (5 — sourced from `_intake/tag-status-contract.md`)

Per [tag-status-contract.md](../_intake/tag-status-contract.md) §tag-related-audits.

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `tag-closed-enum-violation` | PR | error | Every tag value resolves to the dimension's closed enum |
| `tag-propagation-coverage` | PR | warn | Sub-extraction's inheritable tags match parent input's |
| `tag-context-mismatch` | PR | warn | Extraction routed to `governance/X/` carries `domain:governance` (or has explicit override with reason) |
| `tag-removed-without-reason` | PR | error | Inherited tag dropped requires `removed_inherited_tag` field with reason |
| `tag-canonical-phrasing-drift` | PR | error | The 4 operating principles byte-match across the 4 documented places |

### Status (6 — sourced from `_intake/tag-status-contract.md`)

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `silent-state-bypass` | PR | error | Any state field changed without `state_transitioned_at` updated → drift signal |
| `state-transition-illegal` | PR | error | Transition not in allowed-transitions table fails |
| `state-without-required-field` | PR | error | `closed` without `closed_reason`; `routed` without `routed_to`; `validated` without `recurrence_check_at` |
| `pending-too-long` | PR + nightly | warn → error | Items past their state's SLA escalate severity (warn at 1× SLA, error at 2×, critical at 3×) |
| `recurrence-check-due` | weekly | warn | `validated` items whose `recurrence_check_at` arrived without action |
| `meta-state-machine-drift` | PR | error | State machine declared in `principles.yaml` matches implementation |

### Source-Type + Modality (3 — sourced from `_intake/source-types.md`)

Per [source-types.md](../_intake/source-types.md) §risk-profile + §content_modality.

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `missing-timestamp-or-origin` | PR | error | External input missing any of 4 mandatory stamping fields (received_at_iso / origin / origin_detail / received_via) |
| `content-modality-required-on-extraction` | PR | error | Every extraction note declares `content_modality:` (closed enum from §content_modality); "unknown" permitted only with `triage_reason: modality-classification-failed` |
| `descriptor-shadow-tag` | PR | warn | Descriptor in `descriptors[]` conflicts with or duplicates a closed-enum value in `tags[]` |

### Continuity-Manifest + Handshake (1 — added S003 §3.5.e)

Per [protocols.md](../_handoff/VAULT/protocols.md) §11b.1 + §11b.2.

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `handshake-receipt-presence` | per-session | warn | Every handoff has a paired receipt signature within 7 days OR explicit `unreceived-with-reason` declaration in next-session blockers file |

### Grandfather Backfill (3 — sourced from `qc-audit-system.md` Component 5)

Per [qc-audit-system.md](./qc-audit-system.md) Grandfather Backfill Protocol Layers 1/2/3.

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `grandfather-list-age` | per-session | warn → error | Oldest grandfather artifact age tracked; warn at >30d (Layer 3 floor trigger), error at >180d hard SLA |
| `grandfather-ride-along-coverage` | PR | warn | Edits on pre-turn-10 grandfathered artifacts include ride-along RZF + CEC backfill in same save (Layer 1) |
| `grandfather-ceiling-3-per-session` | per-session | info | More than 3 backfills in one session deferred to next session (Layer 1 ceiling) |

### Closing-Summary (1 — added S002 turn 14)

Per [closing-summary-template.md](../_handoff/VAULT/closing-summary-template.md).

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `closing-summary-checklist-completeness` | per-session | error | Closing summary emits all required §10.1-§10.14 + §10.13b + §10.13c sections; empty section = `NOT_APPLICABLE_WITH_REASON` declared explicitly |

### Catch + Engraving (2 — added S002 turn 15+17)

Per [behavioral-contracts.md](./behavioral-contracts.md) § B_CATCH_TO_ENGRAVING + § B_FIVE_SURFACE_ENGRAVING.

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `catch-engraving-completeness` | per-session | warn | Closing summary §10.13b "Catches engraved this session" has entries OR explicit `NO_CATCHES_THIS_SESSION` declaration |
| `single-surface-engraving-anti-pattern` | PR | error | New B_* contract introduced without ≥2 of 5 surfaces (schema/validator/hook/memory/contract) hit atomically |

**Total: ~91 checks** (was 47 at S002 close; +8 AI-runtime +5 persona-crisis +7 ops +5 bootstrap+dashboard +7 generator+skill +3 ai-behavior +10 intake-transition +5 tag +6 status +3 source-modality +1 handshake +3 grandfather +1 closing-summary +2 catch-engraving = +66 from extended-S003 audit registry consolidation; some overlap counts adjusted). Counts continue to grow as principles add enforcers.

> **Note: registry consolidation provenance.** The +66 audits added to this leaf in extended-S003 were already CITED in pillar leaves but had no canonical definition. The consolidation closes the dangling-reference debt that gaps-and-duplications-S003.md original-Gap-1 was a precursor to. Each new audit was sourced verbatim from the cited leaf's enforcement section (the leaf is the requirements doc; this leaf is the registry).

## Severity routing

Severities map to routing actions, not just labels:

| Severity | Routing |
|---|---|
| `info` | Log only; visible in dashboard but no alert |
| `warn` | Dashboard fact + scorecard impact; weekly digest |
| `error` | Opens Linear ticket (auto-created); blocks PR if PR-cadence |
| `critical` | Pages on Slack/email; blocks PR if PR-cadence; opens incident if real-time |

**Confidence threshold:** only checks scoring ≥0.9 confidence open tickets. *Why:* SAST false-positive rates run 68–78%. Uncalibrated audit systems destroy their own credibility — analysts grow desensitized. The confidence threshold is the anti-fatigue mechanism.

## Cadence model (the cron jobs)

| Cadence | When it runs | Mechanism |
|---|---|---|
| `PR` | On every pull request | GitHub Actions on `pull_request` trigger |
| `nightly` | 02:00 UTC daily | GitHub Actions on `schedule: '0 2 * * *'` |
| `weekly` | Mon 06:00 UTC | GitHub Actions on `schedule: '0 6 * * 1'` |
| `real-time` | On health endpoint hit | Checkly continuous monitoring + on-deploy webhook |
| `on-demand` | Admin "Re-run all" button | `apps/admin/api/audit/run/route.ts` |

## Live drift dashboard

`apps/admin/app/(admin)/audits/drift/page.tsx` shows continuous drift signals (not just cron-driven):

- Introspected Postgres schema ↔ ZModel-generated Prisma
- Payload collections ↔ ZModel
- Vale dict ↔ glossary codegen output
- ESLint forbidden-identifiers ↔ glossary codegen output
- Page files ↔ template catalog (which pages drifted from their declared template?)
- Catalog frontmatter ↔ file content (drift between declared metadata and reality)
- AGENTS.md ↔ principles.yaml codegen output

## Hotspot dashboard

`apps/admin/app/(admin)/audits/hotspots/page.tsx` — weekly recomputation of `churn × complexity` per file. Top decile listed with refactor priority. The architectural-refactor signal (per Adam Tornhill's research: ~1-2% of files account for ~70% of dev work).

## Main dashboard

`apps/admin/app/(admin)/audits/page.tsx` — Tremor `Grid` with:

- One big `ProgressCircle` (platform health 0–100, weighted average across categories)
- Category cards (Schema / Security / Sanity / Vocabulary / Quality / Catalog / Skills / Cost / Integrity / Meta) with current letter grade and 30-day sparkline
- "What changed since last run" panel — diff of new failures vs. fixed ones (the signal that makes the dashboard *checked*, not forgotten)
- Failing-check table sortable by severity / category / age
- "Re-run all" button (on-demand cadence trigger)

**Default category weights** (stored in DB; tune without redeploy):
- Security 0.20
- Schema 0.15
- Sanity 0.10
- Vocabulary 0.10
- Quality 0.10
- Catalog 0.10
- Skills 0.15
- Cost 0.05
- Integrity 0.05

## Severity → routing implementation

`libs/audits/runner/src/route-result.ts`:

```ts
async function routeResult(result: AuditResult): Promise<void> {
  // Confidence gate
  if (result.confidence < 0.9 && (result.status === "error" || result.status === "critical")) {
    return; // log only; below threshold
  }

  switch (result.status) {
    case "info":
      await logToFile(result);
      break;
    case "warn":
      await writeToDashboard(result);
      await maybeAddToWeeklyDigest(result);
      break;
    case "error":
      await writeToDashboard(result);
      await openLinearTicket(result, { priority: "Medium" });
      break;
    case "critical":
      await writeToDashboard(result);
      await openLinearTicket(result, { priority: "Urgent" });
      await pageOnSlack(result);
      if (result.check.cadence === "real-time") {
        await openIncident(result);
      }
      break;
  }
}
```

## Integration with the rule registry + principles.yaml

Per [rule-registry.md](./rule-registry.md), every rule has at least one enforcer; many enforcers are audit checks. The relationship:

- **Principles** (`packages/principles/principles.yaml`) — the "what" of the rules
- **Rules** (`docs/rules/RULE-NNNN.yaml`) — the PR-trackable derivative
- **Audit checks** (`libs/audits/checks/<slug>.ts`) — the executable enforcer for each rule

The audit runner verifies the bidirectional invariants:
1. Every principle has its required number of enforcers per severity (P-META-001)
2. Every `// @enforces:` annotation references a real principle (`enforcer-orphans` check)

When `principles.yaml` changes, `pnpm principles:codegen` may emit new audit check stubs for new enforcers; the audit runner picks them up automatically on the next cadence run.

## Anti-patterns to avoid

1. **Audit fatigue** — too many warnings → all ignored. Mitigation: confidence threshold ≥0.9 for tickets; weekly digest grouping.
2. **False positives** — bad checks erode trust. Mitigation: every check has a `mutedUntil` field and a `lastTunedAt` date; checks unchanged for 90 days are reviewed.
3. **Audit-of-audit drift** — the checker itself rots. Mitigation: meta-check `audit-of-audit` asserts every check ran in its expected interval.
4. **Compute cost** — recurring audits can dwarf the platform. Mitigation: `nx affected` for code audits, incremental Atlas for schema, cached facts (recompute only when source-of-truth hash changes).
5. **Dashboards checked once and forgotten** — Mitigation: weekly digest email with deltas; "what changed since last run" panel.
6. **Audits that can't be traced to a fix** — Mitigation: every failed check has `quickfix_url` (PR, migration, doc) or it's not a real check yet.

## Reuse-first applied to audit checks

Before adding a new audit check:

1. **Search `libs/audits/checks/`** for similar patterns
2. **Could the new check be a parameter on an existing check?** (e.g., new schema-drift target → enhance existing `schema-*-drift.ts` family)
3. **If genuinely new**, follow the slice contract (the audit slice itself meets it per P-ARCH-015) and register the check via principles.yaml or rule-registry

## Sources

- [Backstage Tech Insights](https://github.com/backstage/community-plugins/blob/main/workspaces/tech-insights/plugins/tech-insights/README.md) — the Facts/Checks/Scorecards model
- [Cortex Scorecards](https://docs.cortex.io/standardize/scorecards/scorecards-as-code) — commercial GitOps version
- [OpsLevel Rubrics](https://www.opslevel.com/resources/how-scorecards-work-in-opslevel-a-truly-flexible-model)
- [Spotify Soundcheck](https://backstage.spotify.com/docs/plugins/soundcheck/core-concepts/tech-insights) — the original
- [OpenSSF Scorecard Action](https://github.com/ossf/scorecard-action)
- [Squawk migration linter](https://squawkhq.com/)
- [Atlas schema drift](https://atlasgo.io/monitoring/drift-detection)
- [Snyk ToxicSkills](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/) — informs the skill-prompt-injection-scan check
- Adam Tornhill — *Your Code as a Crime Scene* (hotspot analysis)
- [Contrast Security: AppSec noise & fatigue](https://www.contrastsecurity.com/infographics/appsec-noise-and-fatigue-by-the-numbers) — informs the confidence threshold
