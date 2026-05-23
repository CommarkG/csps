---
id: csps.pillar-0-governance.system-health-plan
name: system-health-plan
description: Canonical CSPS system health plan — maps the 10 audit-hub pipelines to daily/weekly/monthly/quarterly cadences. Consolidates pnpm verify (every-session), weekly-health hook, and quarterly calibration into ONE coherent health picture. Covers think / plan / implement / validate dimensions. Authored S011 §24+++++ per user directive to see how the implicit→explicit insight applies platform-wide.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: pillar-leaf
template_status: stable
core_spine: GVRN
core_spines: [GVRN, VALD, OPER, AI]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - domain:ops
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S011
file_depth_markers:
  l1_lines: "1-80"
  l2_lines: "81-180"
  l3_lines: "181-end"
  read_protocol: "L1 = cadence map + pipeline table. L2 = per-cadence checklists. L3 = gap analysis + think/plan/implement/validate dimension breakdown."
links:
  - { rel: audit-hub, href: ./audit-hub.md }
  - { rel: know-how, href: ../_handoff/VAULT/know-how/README.md }
  - { rel: weekly-hook, href: ../../../.claude/hooks/cron-weekly-tag-status-deep-audit.sh }
domain_path: platform
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# System Health Plan — CSPS

> **One-page picture of platform health.** Every audit-hub pipeline mapped to a cadence. The implicit→explicit insight applied: health checks are EXPLICIT (run by validators/hooks/cron) not BEHAVIORAL (the AI "remembers" to check).

## §1 — The health cadence map

| Cadence | Trigger | Tool | Pipelines | ACTIVE now |
|---|---|---|---|---|
| **Every session** | `pnpm verify --skip-install` | tools/verify.mjs | P1 + P4 partial + P6 partial + P10 partial | 19 validators PASS |
| **Weekly** | CronCreate Monday 08:03 + manual | cron-weekly-tag-status-deep-audit.sh | P5 partial + P7 + P10 | PARTIAL-ACTIVE (S011) |
| **Monthly** | Manual at month-boundary | know-how-extractor.mjs + 10-scenario test | P4 + P8 | Spec only |
| **Quarterly** | Manual at quarter-boundary | measure-token-cost.mjs + calibration | P3 + P4 + P8 | Not started |

## §2 — Pipeline → cadence mapping

| Pipeline | What it checks | Cadence | ACTIVE today | Gap |
|---|---|---|---|---|
| **P1 pre-close-verification** | pnpm verify ZF evidence + cycle PASS | Every session | ✅ 19 validators | rzf_evidence validator added |
| **P2 agent-alignment** | AAP 9-field + Class B preamble + spawn rules | Weekly | ⚠️ PARTIAL (aap_frontmatter_coverage active; preamble behavioral) | Pre-spawn hook STUB |
| **P3 cognitive-context-discipline** | Model tier compliance + CCA 4 QGs + Layer 4 MCP use | Quarterly | ⚠️ PARTIAL (context-orchestrator advisory; model drift behavioral) | model-routing-on-ratification not built |
| **P4 zero-findings-cycle** | RZF evidence quality + CEC completeness | Every session + Monthly | ⚠️ PARTIAL (rzf_evidence validator active; CEC self-assessed) | CEC template not structured |
| **P5 engraving-completeness** | 5/5 FSE surfaces + K=2 promotions | Weekly | ⚠️ PARTIAL (weekly hook checks K=2; FSE coverage behavioral) | audit-principle-bidirectional not built |
| **P6 schema-integrity** | Slice freshness + nothing-stands-alone + SSoT | Every session | ⚠️ PARTIAL (slice_freshness + slice sync active; canonical-home-field deferred) | consolidation-pass-coverage STUB |
| **P7 intake-and-learning** | Know-how extraction + EP classification + source-class coverage | Weekly | ✅ ACTIVE (know-how-extractor + intake validators + weekly hook §1) | intake-router not wired automatically |
| **P8 complexity-and-hotspots** | File size growth + line count trends | Monthly | ❌ Not started | tools/measure-token-cost.mjs exists; no trend tracking |
| **P9 runtime-health** | Vercel/Cloudflare/Supabase health | Monthly (when runtime ships) | ❌ N/A | week-6+ runtime build |
| **P10 csps-alignment** | Inner-default drift + B_* contract alignment + 10-scenario | Every session + Quarterly | ⚠️ PARTIAL (behavioral-contracts-sync active; inner-defaults behavioral) | 10-scenario quarterly cadence |

## §3 — The think / plan / implement / validate gap table

### THINK gaps → explicit enforcement path

| Implicit today | Explicit target | Priority |
|---|---|---|
| AI uses right model tier | model-routing-on-ratification validator (register P3 slug) | HIGH |
| AI uses MCP before monolith | context-orchestrator exits advisory → actual injection | HIGH |
| D1-D10 fires before DONE claim | post-stop hook that prompts D1-D10 scan | MED |
| CCA Layer 4 respected | measure: ratio of MCP calls vs file reads per session | MED |

### PLAN gaps → explicit enforcement path

| Implicit today | Explicit target | Priority |
|---|---|---|
| PE §6 inputs are real reasoning | validate-pe-inputs.mjs (score range + non-zero cost) | HIGH |
| §KH quality not just presence | Upgrade validate-plan-know-how to check specific text per item | HIGH |
| Foundation stable before L<N+1> | validate-level-sequencing.mjs | MED |
| Arc realistic given session velocity | validate-topic-plan-progress CHECK C (velocity tracking) | MED |

### IMPLEMENT gaps → explicit enforcement path

| Implicit today | Explicit target | Priority |
|---|---|---|
| Smoke test every new .mjs | validate-mjs-smoke-tests.mjs OR pre-commit hook | HIGH (EP-006) |
| Regenerate slices after monolith edit | validate-slice-freshness.mjs ✅ ACTIVE | DONE |
| Consolidation pass on new facts | post-stop-consolidation-pass.sh STUB → active | MED |
| intake-router processes new source classes | source-class-coverage validator ✅ ACTIVE | DONE |

### VALIDATE gaps → explicit enforcement path

| Implicit today | Explicit target | Priority |
|---|---|---|
| RZF is THIS-SESSION evidence | validate-rzf-evidence.mjs ✅ ACTIVE | DONE |
| CEC walk is actually complete | Structured CEC template with 8 mandatory artifact types | HIGH |
| HPFA self-assessment has evidence | Machine-checkable HPFA sub-items | MED |
| Token savings measurement done | validate-measurement-currency.mjs (staleness on Phase 1 promise) | MED |

## §4 — Every-session health checklist (pnpm verify output — 21 validators)

```
typecheck_recursive          PASS  (0 TS errors)
principles_validate          PASS  (53 principles, 0 findings)
frontmatter_validate         PASS  (0 errors, 0 warnings)
aap_frontmatter_coverage     PASS  (17 skills, 0 missing)
principle_count_staleness    PASS  (0 stale)
ai_behavior_spine_slices_sync PASS (10 sections)
audit_runner_slices_sync     PASS  (28 pipelines)
behavioral_contract_slices_sync PASS (40 contracts)
principle_slices_sync        PASS  (53 IDs)
mjs_syntax_check             PASS  (syntax OK)
rzf_evidence                 PASS  (THIS-SESSION ZF confirmed)
slice_freshness              PASS  (0 stale monolith/slice pairs)
plan_know_how                PASS  (0 plans missing §KH)
intake_source_class_coverage PASS  (4 source classes)
intake_event_validate        PASS  (JSONL schema OK)
git_pushed_state             PASS  (advisory)
topic_plan_progress          PASS  (0 orphans)
session_artifact_sync        PASS  (0 warnings)
audit_slug_coverage          PASS  (0 orphans)
token_budget_validate        PASS  (0 RED, 0 YELLOW)
corespine_depth_markers      PASS  (5 L1_CORE, 16 L2_DOMAIN, 5 L3_INSTANCES)
```

## §5 — Weekly health checklist (Monday 08:03)

Run: `bash .claude/hooks/cron-weekly-tag-status-deep-audit.sh`

```
§1 Know-how extraction       (know-how-extractor.mjs — EP classification)
§2 Slice freshness           (validate-slice-freshness.mjs)
§3 Hook staleness            (count STUB vs active; flag overdue promotions)
§4 Topic-plan orphan         (validate-topic-plan-progress.mjs)
§5 Session artifact sync     (validate-session-artifact-sync.mjs)
§6 EP recurrence K=2         (any EP with recurrence_count ≥ 2 → promotion required)
```

**Week-4 additions:** tag/status state-machine validation + SLA compliance + Pipeline 7 full.

## §6 — Monthly health checklist (month boundary)

```
□ know-how-extractor.mjs --all  (extract from all sessions, not just latest)
□ EP K=2 review — any patterns firing repeatedly → mandatory B_* contract amendment
□ 10-scenario re-run (tools/test-scenarios/token-optimization-10-scenario.json)
□ PE inputs calibration — review score accuracy vs actual session difficulty
□ P8 complexity scan — file size trends, hotspot accumulation
□ pnpm verify --all (with frozen install, not skip-install)
```

## §7 — Quarterly health checklist (quarter boundary)

```
□ Token savings HONEST CALIBRATION — measure-token-cost.mjs vs Phase 1 baseline
□ D1-D10 drift assessment — has any cognitive failure mode become habitual?
□ ADR compliance scan — are all ratified ADRs mechanically enforced?
□ Architecture drift — do L1_CORE doctrine files match actual platform behavior?
□ Inner-AI defaults alignment — continuous-drift-log review + new registrations
□ P-GOV-24 equivalent reassessment — topic-plan §11 closure where applicable
```

## §8 — Health signal evolution

| Metric | S007 close | S011 close | Target |
|---|---|---|---|
| Active validators | 5 | 21 | 30+ (week-4) |
| Active hooks | 2 | 2 | 12+ (week-4) |
| Registered audit slugs | ~140 | 246+ | 300+ (as platform grows) |
| Error patterns documented | 0 | 10 (EP-001→010) | 20+ (quarterly growth) |
| Weekly health score | 0% | 40% | 100% (week-4) |

**The honest gap:** 246 slugs registered, 21 running = **8.5% mechanical coverage.** Week-4 audit-runner ship targets ~80% coverage. This file IS the plan for closing that gap.
