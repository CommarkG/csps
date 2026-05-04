---
id: csps.governance.audit-hub
name: audit-hub
description: The orchestration layer above audit-runner.md registry. Defines audit PIPELINES (grouped sequenced runs) + triggers (PR / per-session / nightly / weekly / on-demand) + per-pipeline handling (severity routing → Linear ticket / Slack page / digest / carry-forward) + orchestration architecture + dashboard spec + dynamic schema-connection audit. Audit-runner.md is the slug-level REGISTRY (~129 audits); this hub is how they're SEQUENCED + TRIGGERED + ROUTED. Engraved as P-META-011 + B_AUDIT_ORCHESTRATION.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:admin
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - observability
  - security
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: registry, href: ./audit-runner.md }
  - { rel: principle, href: ../../../packages/principles/principles.yaml }
  - { rel: spine, href: ./ai-behavior-spine.md }
  - { rel: contracts, href: ./behavioral-contracts.md }
  - { rel: cca, href: ./cognitive-context-architecture.md }
  - { rel: aap, href: ./agent-alignment-protocol.md }
  - { rel: zero-findings, href: ./zero-findings-discipline.md }
  - { rel: dashboards, href: ../pillar-6-operations-and-delivery/dashboards.md }
created-new-because: |
  audit-runner.md is the slug-level REGISTRY (each audit has slug + cadence + severity + description),
  but it does NOT define the orchestration layer above: pipelines (which audits run together), triggers
  (when each pipeline fires), per-pipeline handling (severity routing), orchestration (parallel vs serial,
  dependencies), or the dashboard spec for visualizing run results. User S005 turn 26 directive: "create
  an audit hub registered in the schema in the proper place and include a set of audits + various
  handling predefined pipelines and orchestrated with a front end dashboard". This hub IS that orchestration.
---

# Audit Hub

> **The registry says WHAT audits exist. The hub says HOW + WHEN + WHO-HANDLES + WHAT-NEXT.**

## What this leaf locks

The orchestration layer above [`audit-runner.md`](./audit-runner.md) registry. Defines:

1. **Pipelines** — named groups of audits run together (e.g., `pipeline_pr_blocking_pre_merge` runs all PR-blocking error/critical audits)
2. **Triggers** — when each pipeline fires (PR open / pre-merge / per-session-close / nightly cron / weekly digest / on-demand `pnpm audit:run --pipeline <name>`)
3. **Per-pipeline handling** — severity routing per result (info → log; warn → dashboard + weekly digest; error → Linear ticket + PR block; critical → Linear urgent + Slack page + incident if real-time)
4. **Orchestration architecture** — parallel vs serial groups; dependencies (e.g., `principles_validate` must pass before `agent_alignment_coverage` runs because AAP audits depend on principles.yaml schema integrity)
5. **Dashboard spec** — interim markdown dashboards (this leaf + dashboards.md sections); week-10 admin app pages on Vercel
6. **Dynamic schema connections** — how every audit ties back to principles + contracts + closing-summary headers; the bidirectional link AUDITS.md ↔ principles.yaml

## The 9 pipelines

### Pipeline 1 — `pre-close-verification` (B_PRE_CLOSE_VERIFICATION + P-META-008)

**Trigger:** session close (mandatory gate per closing-summary §10.0); also on-demand via `pnpm verify`.

**Audits in pipeline (ordered):**

```
1. pnpm install --frozen-lockfile     ─── verify monorepo bootstraps
2. pnpm -r typecheck                  ─── all package TS code compiles
3. pnpm --filter @csps/principles validate:all  ─── principles.yaml parses + 0 findings
4. pnpm lint:frontmatter              ─── frontmatter schema across artifacts
5. pnpm audit:run --strict            ─── DEFERRED-WITH-REASON until week-4 ship
```

**Handling:**
- All PASS → exit_code 0 → close summary §10.0 evidence block emitted
- Any FAIL → close blocked → BLK-S<NNN>-* surfaced OR explicit DEFERRED-WITH-REASON carry-forward
- Silent skip: forbidden

**Orchestrator:** `tools/verify.mjs` (LIVE — exit_code 0/1 enforces today)

**Schema connection:** every cycle in this pipeline maps to a closing-summary-template required header (§10.0) + a principle (P-META-008 / P-META-006) + a contract (B_PRE_CLOSE_VERIFICATION).

### Pipeline 2 — `agent-alignment` (B_AGENT_ALIGNMENT_PROTOCOL + P-META-010)

**Trigger:** PR (any change to `packages/skills/*/SKILL.md` / `libs/agents/*` / Agent tool spawn); also per-session close (Class B preamble check).

**Audits in pipeline:**

```
1. agent-alignment-coverage           ─── Class A SKILL.md/agent.zmodel AAP frontmatter populated
2. subagent-spawn-preamble-required   ─── Class B builtin spawn prompts contain alignment preamble
3. skill-vendor-integrity             ─── SHA-pin matches lock; integrity verified
4. skill-capability-drift             ─── declared capability set hasn't expanded silently
5. skill-banned-tools                 ─── community-tier skill doesn't reference banned tools
6. skill-prompt-injection-scan        ─── static scanner pattern library
7. skill-collision-check              ─── no naming/feature_key collisions
```

**Handling:**
- PASS → continue
- WARN → dashboard + weekly digest
- ERROR → PR block + Linear ticket
- CRITICAL → PR block + Slack page + Linear urgent

**Schema connection:** every audit ties to AAP's 9-check protocol + pillar-3/sandboxed-skill-governance trust tiers + capability declarations.

### Pipeline 3 — `cognitive-context-discipline` (B_COGNITIVE_CONTEXT_DISCIPLINE + P-META-009)

**Trigger:** per-session close + PR for any session-log artifact.

**Audits in pipeline:**

```
1. cognitive-context-discipline-coverage  ─── §10.0 + §10.11b + §10.13b + §10.13c + §10.13d coverage
2. model-routing-on-ratification          ─── QG1 enforcer (Opus on hard reasoning)
3. cache-content-hash-fresh               ─── QG4 enforcer (cache breakpoints on stable content)
```

**Handling:** same severity routing as Pipeline 2.

**Schema connection:** maps to the 5-layer architecture + 4 Quality Gates per cognitive-context-architecture.md.

### Pipeline 4 — `zero-findings-cycle` (P-META-006 RZF + CEC)

**Trigger:** every artifact reaching `lifecycle_state ∈ {validated, closed}`; every ratification (principle / leaf / ADR / B_* contract).

**Audits in pipeline:**

```
1. rzf-coverage                          ─── evidence_block_ref present at terminal states
2. cec-walk-trail-completeness           ─── walk-trail present for ratifications
3. cycle-count-as-target-detection       ─── language pattern check
4. nominal-rzf-detection                 ─── RZF claim paired with this-session validator output
5. positive-value-extraction-coverage    ─── §10.11b walk-trails for significant positive events
6. audit-of-audits                       ─── audit registry healthy (recursive)
```

**Handling:** ERROR severity blocks ratification PR; WARN routes to dashboard.

**Schema connection:** the umbrella P-META-006 + amendments + all closing-summary template headers.

### Pipeline 5 — `engraving-completeness` (B_FIVE_SURFACE_ENGRAVING + P-META-007)

**Trigger:** PR introducing new B_* contract / new P-META-* / new ADR.

**Audits in pipeline:**

```
1. catch-engraving-completeness          ─── §10.13b entries OR explicit NO_CATCHES_THIS_SESSION
2. catch-engraving-coverage              ─── 5-surface coverage per new discipline
3. single-surface-engraving-anti-pattern ─── new B_* with surfaces_count = 1 = error
4. atomic-validator-registration          ─── new B_* registers validator slug atomically (FSE amendment)
5. discipline-engraving-completeness     ─── spine matrix row exists + 5 surfaces accounted for
```

**Handling:** ERROR severity blocks B_* / P-META-* / ADR PR until 5/5 surfaces atomic.

**Schema connection:** maps to FSE 7-stage cycle + spine matrix + closing-summary §10.13c FSE evidence block.

### Pipeline 6 — `schema-integrity` (P-ARCH-001 nothing-stands-alone + P-ARCH-004 single-source-of-truth)

**Trigger:** PR + nightly cron.

**Audits in pipeline:**

```
1. cross-ref-resolution                  ─── every link resolves
2. principle-coverage                    ─── enforcer minimums satisfied
3. enforcer-orphans                      ─── @enforces annotations reference real principles
4. principles-codegen-fresh              ─── AGENTS.md regenerated from yaml; no drift
5. frontmatter-completeness              ─── universal-core fields per ADR-0023
6. frontmatter-per-file-type-schema-coverage  ─── ADR/SKILL.md/AGENTS.md per-file-type variants
7. principle-count-staleness             ─── decorative count text drift detection
8. dual-registration-drift               ─── files exist with catalog entry; catalog rows have files
9. orphan-without-lifecycle-state        ─── every artifact declares lifecycle_state
```

**Handling:** ERROR severity blocks PR; WARN to dashboard.

**Schema connection:** the schema integrity audits ARE the mechanical enforcement of nothing-stands-alone (P-ARCH-001).

### Pipeline 7 — `intake-and-learning` (P-META-005 Learning Loop + B_INTAKE_DISCIPLINE)

**Trigger:** every UserPromptSubmit hook (when content / paste / URL detected); per-session close.

**Audits in pipeline:**

```
1. manual-protocol-skipped               ─── EXT-IDs paired with manual-protocol walk
2. missing-timestamp-or-origin           ─── 4 mandatory stamping fields per EXT-ID
3. content-modality-required-on-extraction
4. learning-loop-coverage                ─── ≥1 item extracted per session OR explicit no-insights
5. repeat-issue-detection                ─── K=2-within-90d auto-creates ADR
6. unresolved-observation-stale          ─── observed-state items >7d escalate
7. fix-without-validation                ─── fixing-state items >14d flagged
8. validation-without-recurrence-check   ─── closed-items get 30/90-day recurrence check
9. meta-loop-audit                       ─── resolution-cycle-time trend monthly
10. schema-gap-promotion-eligibility     ─── K=2 schema-gap promotion mechanism
```

**Handling:** ERROR blocks merge; WARN dashboard; INFO log only.

**Schema connection:** Learning Loop pipeline IS the input-state-machine; observed → triaged → routed → fixing → validated → closed transitions are mechanically gated by these audits.

### Pipeline 8 — `complexity-and-hotspots` (complexity-contract + P-ARCH-018)

**Trigger:** PR + weekly cron.

**Audits in pipeline:**

```
1. file-size-ratchet                     ─── no diff makes file size worse on changed files
2. cognitive-complexity                  ─── ≤15 on changed functions
3. module-folder-trigger                 ─── slice exceeded thresholds; nx g platform:split suggested
4. hotspot-analysis                      ─── top decile of churn × complexity (weekly)
5. orphan-file-detection                 ─── files with no bundle membership AND no links.index ref
```

**Handling:** ERROR blocks PR; WARN to dashboard with refactor priority.

**Schema connection:** maps to pillar-1/complexity-contract.md hard limits + module-folder-pattern.md decomposition trigger conditions.

### Pipeline 9 — `runtime-health` (operational; week-4+ as runtime ships)

**Trigger:** real-time (health checks) + nightly cron.

**Audits in pipeline:**

```
1. health-endpoints                      ─── /api/health + /api/ready respond 200
2. rls-coverage                          ─── every tenant table has rowsecurity=true
3. audit-log-integrity                   ─── no >5min gap per tenant in audit.events
4. ai-smoke-agent                        ─── Mastra agent uses product end-to-end weekly
5. crisis-detector-recall                ─── eval-time 100% recall (must = not ≥)
6. tier-feature-key-reconcile            ─── Stripe ↔ feature_keys consistent
```

**Handling:** CRITICAL → page on Slack + open incident if real-time; ERROR → Linear urgent.

**Schema connection:** runtime audits map to ADR-0007 (postgres-trigger-based-audit) + ADR-0008 (one Mastra agent) + crisis-escalation slice.

## Orchestration architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Trigger Sources                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐│
│  │ PR open  │  │ Session  │  │ Nightly  │  │ On-demand   ││
│  │          │  │ close    │  │ cron     │  │ pnpm audit  ││
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬──────┘│
│       │             │              │               │       │
└───────┼─────────────┼──────────────┼───────────────┼───────┘
        ▼             ▼              ▼               ▼
   ┌─────────────────────────────────────────────────────┐
   │ Pipeline Dispatcher (libs/audits/dispatcher.ts)     │
   │  ─ matches trigger to applicable pipelines           │
   │  ─ honors dependency graph (e.g., principles_validate│
   │    must pass before agent_alignment runs)            │
   │  ─ runs serial-within-pipeline; parallel-across      │
   └───────────────────────┬─────────────────────────────┘
                           ▼
   ┌──────────────────────────────────────────────────────┐
   │ Pipelines (executed in dependency order)             │
   │                                                      │
   │ 1. schema-integrity     (depends: nothing)           │
   │ 2. pre-close-verification  (depends: 1)              │
   │ 3. zero-findings-cycle  (depends: 1, 2)              │
   │ 4. engraving-completeness  (depends: 1, 3)           │
   │ 5. agent-alignment      (depends: 1)                 │
   │ 6. cognitive-context-discipline (depends: 1, 2)      │
   │ 7. intake-and-learning  (depends: 1)                 │
   │ 8. complexity-and-hotspots  (depends: 1)             │
   │ 9. runtime-health       (depends: nothing — operational)│
   └──────────────────────┬───────────────────────────────┘
                          ▼
   ┌──────────────────────────────────────────────────────┐
   │ Severity Router (libs/audits/runner/route-result.ts) │
   │  ─ confidence ≥ 0.9 gate                              │
   │  ─ severity → action mapping                          │
   └────────┬───────────────┬───────────────┬─────────────┘
            ▼               ▼               ▼
   ┌────────────┐  ┌──────────────┐  ┌─────────────────┐
   │ Dashboard  │  │ Linear       │  │ Slack page +    │
   │ + digest   │  │ ticket       │  │ Incident open   │
   │ (warn/info)│  │ (error)      │  │ (critical real- │
   │            │  │              │  │ time)           │
   └────────────┘  └──────────────┘  └─────────────────┘
```

## Severity → handling matrix

| Severity | Confidence gate | Routing |
|---|---|---|
| `info` | n/a | Log only; visible in dashboard but no alert |
| `warn` | n/a | Dashboard fact + scorecard impact; weekly digest |
| `error` | ≥0.9 | Linear ticket (auto-created, Medium priority); blocks PR if PR-cadence |
| `critical` | ≥0.9 | Linear ticket (Urgent); blocks PR if PR-cadence; Slack page; opens incident if real-time |

**Confidence threshold rationale:** SAST false-positive rates run 68-78%. Uncalibrated audit systems destroy their own credibility. The confidence gate is the anti-fatigue mechanism (per `audit-runner.md` integration).

## Dashboard spec

### Interim (now — markdown dashboards)

| Dashboard | Where | Status |
|---|---|---|
| Cognitive Context Architecture | [cognitive-context-architecture.md](./cognitive-context-architecture.md) | ✅ ACTIVE |
| Agent Alignment Protocol | [agent-alignment-protocol.md](./agent-alignment-protocol.md) | ✅ ACTIVE |
| Audit Hub (this leaf) | [audit-hub.md](./audit-hub.md) | ✅ ACTIVE NEW S005 turn 26 |
| Audit registry | [audit-runner.md](./audit-runner.md) | ✅ ACTIVE (~129 audits) |
| Spine matrix | [ai-behavior-spine.md](./ai-behavior-spine.md) | ✅ ACTIVE |
| `pnpm verify` last-run | [tools/verify-last-run.md](../../../tools/verify-last-run.md) | ✅ AUTO-GENERATED on each verify run |

### Week-10+ (live admin app on Vercel)

| Page | Path | Tech |
|---|---|---|
| Audit Hub overview | `apps/admin/app/(admin)/audits/page.tsx` | Next.js 15 + Tremor |
| Per-pipeline view | `apps/admin/app/(admin)/audits/pipeline/[name]/page.tsx` | Drill-down with sparkline |
| Per-audit detail | `apps/admin/app/(admin)/audits/check/[slug]/page.tsx` | Run history + last result |
| Drift dashboard | `apps/admin/app/(admin)/audits/drift/page.tsx` | Continuous drift signals |
| Hotspot dashboard | `apps/admin/app/(admin)/audits/hotspots/page.tsx` | Adam Tornhill churn × complexity |
| AAP compliance | `apps/admin/app/(admin)/audits/aap/page.tsx` | NEW per S005 turn 26 — per-skill AAP frontmatter status |
| CCA compliance | `apps/admin/app/(admin)/audits/cca/page.tsx` | NEW — per-session QG compliance |
| Closing summary checklist | `apps/admin/app/(admin)/audits/closing-summaries/page.tsx` | Per-session §10.0/§10.11b/§10.13b coverage |

**Hosting:** Vercel (canonical Next.js host; ADR-0024 candidate for S006).

**Data source:** the audit-runner's `AuditRun` + `AuditResult` Postgres tables per [audit-runner.md schema](./audit-runner.md#schema-foundation-slices-69).

## Dynamic schema connections (the audit ↔ principle bidirectional graph)

Every audit in the registry has TWO mandatory fields linking it to the schema:

1. **`backed_by_principle:`** in audit metadata — points to `principles.yaml#<P-ID>`
2. **`audit-runner.md#<slug>` reference in principle's `enforcers:` array** — points back

The bidirectional graph is mechanically maintained by:

- `enforcer-orphans` audit — every audit slug has matching principle reference
- `principle-coverage` audit — every principle has its declared enforcers present
- `cross-ref-resolution` audit — every cross-link resolves

**Schema integrity invariant:** for every audit in `audit-runner.md`, there is exactly one principle in `principles.yaml` it backs; for every principle, there are ≥N audits backing it (N = enforcer minimum per severity per P-META-001).

**Bidirectional update:** when principles.yaml changes (add/remove/amend principle), `principles:codegen-fresh` audit catches drift if AGENTS.md / audit-runner.md / spine matrix didn't update in same commit. **The schema is alive — every change ripples through ALL coupled artifacts in the same PR.**

## Mechanical enforcement state (honest audit S005 turn 26)

| Pipeline | ACTIVE-MECHANICAL today | DECLARED-DEFERRED (week-N ship) | TEMP-FIX risk |
|---|---|---|---|
| pre-close-verification | ✅ tools/verify.mjs runs; exit_code 0/1 | 2 audits week-4 | LOW (orchestrator catches base failures) |
| agent-alignment | Partial — 5 SKILL.md retrofitted with AAP frontmatter S005 turn 26 ✓ | 2 audits + 1 hook week-4 | MEDIUM (Class B preamble currently AI-cooperation) |
| cognitive-context-discipline | — | 3 audits + 1 hook week-4 | HIGH until week-4 |
| zero-findings-cycle | Partial — closing-summary-template required headers + AGENTS.md NOs | 6 audits week-4 | MEDIUM (template enforces structure; audit catches drift) |
| engraving-completeness | Partial — closing-template §10.13b/c headers | 5 audits week-4 | MEDIUM |
| schema-integrity | Partial — `pnpm validate:all` enumerates principles findings | 9 audits week-4 | LOW for principles; HIGH for cross-pillar |
| intake-and-learning | manual-protocol.md ACTIVE; AGENTS.md hard NOs | 10 audits week-4 + UserPromptSubmit hook | MEDIUM |
| complexity-and-hotspots | ESLint pre-commit + PR gate (planned) | 5 audits week-3+ as ESLint config ships | LOW |
| runtime-health | — (runtime not shipped) | 6 audits week-6+ | n/a (no runtime to fail) |

**Honest verdict:** out of 9 pipelines, **1 is fully ACTIVE-MECHANICAL today** (pre-close-verification via `pnpm verify`); **6 are PARTIALLY MECHANICAL** (template structure + AGENTS.md NOs catch some failures at AI-cooperation level); **2 are not-yet-applicable** (runtime; complexity ratchets ship with ESLint config). Full mechanical coverage lands week-4 with audit-runner ship + week-6 with Mastra runtime ship.

## Composes with existing principles

| Audit Hub element | Composes with |
|---|---|
| Pipeline orchestration | P-META-008 cycle-mandatory-in-plan (the hub IS the plan-mechanical for cycles) |
| Severity routing | P-META-001 defense-in-depth (handling matches enforcement layers) |
| Dynamic schema connections | P-ARCH-001 nothing-stands-alone + P-ARCH-004 single-source-of-truth |
| Confidence gate | P-META-001 audit-the-audits (anti-fatigue) |
| Dashboard spec | pillar-6/dashboards.md (admin app week-10) |
| AAP pipeline | P-META-010 + B_AGENT_ALIGNMENT_PROTOCOL |
| CCA pipeline | P-META-009 + B_COGNITIVE_CONTEXT_DISCIPLINE |
| Pre-close pipeline | P-META-008 + B_PRE_CLOSE_VERIFICATION |
| ZF pipeline | P-META-006 RZF + CEC + B_RZF + B_CEC |
| Engraving pipeline | P-META-007 + B_FIVE_SURFACE_ENGRAVING |

## Sources

- [audit-runner.md](./audit-runner.md) — the slug-level registry
- [pillar-6/dashboards.md](../pillar-6-operations-and-delivery/dashboards.md) — admin app architecture
- [Backstage Tech Insights](https://backstage.io/docs/features/tech-insights/) — Facts/Checks/Scorecards model the hub orchestrates
- [Cortex Scorecards as Code](https://docs.cortex.io/standardize/scorecards/scorecards-as-code) — pipeline-as-code reference
- [Spotify Soundcheck](https://backstage.spotify.com/docs/plugins/soundcheck/core-concepts/tech-insights) — the original
- User S005 turn 26 directive — audit hub creation
