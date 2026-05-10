---
id: csps.handoff.vault.research-index
name: handoff-vault-research-index
description: Index of all research streams run across CSPS sessions. Each entry — topic, session of origin, key findings, destination doc that absorbed the findings, citation list. Updated incrementally per session. The point is not to reread research; the point is to know what was already searched so future sessions don't redo work.
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
  - observability
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: source-handoff, href: ../HANDOFF-S001-to-S002.md }
domain_path: platform
---

# Research Index

> **Check what exists.** Before firing a new research stream, search this index. If a near-match was already run, enhance the existing destination — don't redo the search.

## What this file holds

Every research stream run during a CSPS session, with topic + outcome destination + sources. Future sessions check this before running new searches (P-OP-001 reuse-first applied to research itself).

## S001 research streams (19 total)

Each was validated against the user's specific situation. Findings folded into the plan; full prose preserved in conversation history (recoverable from git when the repo exists).

| # | Topic | Outcome destination | Status |
|---|---|---|---|
| 1 | Skill management hub design | `MASTER_PLAN.md` §0–§3, vocabulary, templates | Folded |
| 2 | Self-building platform architectures | `pillar-0/mechanical-enforcement.md`, `pillar-0/planning-playground.md`, generators (pillar-4) | Folded |
| 3 | Mini-full-stack-per-entity contract | `pillar-1/slice-contract.md`, `pillar-2/audit-triggers.md` | Folded |
| 4 | Tiers + permissions internal vs external | `pillar-1/tech-stack.md`, `pillar-2/foundation-zmodel.md`, `pillar-3/stripe-clerk-wiring.md` (pending S002) | Partial |
| 5 | Recurring audits + governance dashboards | `pillar-0/audit-runner.md`, principle-coverage meta-check | Folded |
| 6 | AI persona + domain behavior architecture | `pillar-2/starter-slices.md`, `pillar-5/persona-composition.md` (pending), `pillar-5/crisis-escalation.md` (pending) | Partial |
| 7 | Skill sandboxing + curation | `pillar-3/sandboxed-skill-governance.md` (pending S002) | Pending |
| 8 | File complexity governance | `pillar-1/complexity-contract.md`, `pillar-1/module-folder-pattern.md` | Folded |
| 9 | Tagging + bundling systems | `pillar-3/catalog-bundle-system.md` (pending), `pillar-1/frontmatter-standard.md`, variants | Partial |
| 10 | Cross-layer alignment + DB optimization | `pillar-2/foundation-zmodel.md`, `pillar-2/app-schema-contract.md`, `pillar-2/audit-triggers.md` | Folded |
| 11 | Template-first UX governance | `pillar-3/template-governance.md` (pending S002) | Pending |
| 12 | Vocabulary convergence (AI ecosystem) | `pillar-1/vocabulary.md`, `AGENTS.md` | Folded |
| 13 | Skills/agents/plugins integration | `pillar-3/sandboxed-skill-governance.md` (pending), `pillar-4/skill-ingestion-contract.md` (pending) | Pending |
| 14 | Validated pillar systems (NIST/AWS/Azure/etc.) | Pillar architecture (6+1 meta) — `MASTER_PLAN.md` | Folded |
| 15 | Reuse-first enforcement at scale | `pillar-0/reuse-first-principle.md`, `principles.yaml#P-OP-001` enforcer map | Folded |
| 16 | Enforcement + traceability matrices | `pillar-0/rule-registry.md`, `pillar-0/mechanical-enforcement.md` | Folded |
| 17 | Spec-driven planning playground | `pillar-0/planning-playground.md` | Folded |
| 18 | FWWS / PCR / batched-execution industry parallels | `pillar-0/operating-principles.md` | Folded |
| 19 | Mechanical enforcement of AI principles | `pillar-0/mechanical-enforcement.md`, `AGENTS.md`, `principles.yaml` | Folded |

## S002 research streams (1 consolidated stream, 7 sub-topics)

### Stream R20 — Learning Loop calibration (S002)

**Goal:** Calibrate SLAs, confidence thresholds, recurrence windows, and meta-loop trend windows for P-META-005 Learning Loop using industry-validated numbers, not invented defaults.

**Outcome destination:** `pillar-0/learning-loop.md` + `principles.yaml#P-META-005.config`. Calibration decisions cited verbatim in the leaf doc.

**Sub-topics covered:**

#### R20.1 — Google SRE postmortem playbooks + action-item tracking

Industry close-rate: ~30% without forcing functions; <40% within 90 days typical. High-priority target: 80%+ closed within 30 days. Below 50% close rate → "postmortems are theater" critical threshold. 30/60/90-day check-in cadence is canonical. 20%-of-error-budget-per-quarter trigger for P0 quarterly-planning items.

Key sources:
- [Google SRE Book — Postmortem Culture](https://sre.google/sre-book/postmortem-culture/)
- [Google SRE Workbook — Postmortem Culture](https://sre.google/workbook/postmortem-culture/)
- [Google SRE Workbook — Implementing SLOs](https://sre.google/workbook/implementing-slos/)
- [Lunney & Lueder — Postmortem Action Items (USENIX ;login: Spring 2017)](https://www.usenix.org/system/files/login/articles/login_spring17_09_lunney.pdf)
- [SRE School — Action Items Guide](https://sreschool.com/blog/action-items/)

#### R20.2 — Toyota Kata + Five Whys formal protocols

Cadence: daily, not weekly (kata that runs slower than once a day stops being a kata). Five Whys → A3 escalation when problem is cross-functional OR recurring. Recurrence after Five-Whys fix → A3 → ADR. Maps cleanly to K=2 → ADR threshold. Toyota's documented K=2 escalation since the 1970s.

Key sources:
- [Proaction International — Toyota Kata Complete Guide](https://blog.proactioninternational.com/en/toyota-kata-guide)
- [Lean Enterprise Institute — Kata Resource Guide](https://www.lean.org/lexicon-terms/kata/)
- [TWI Institute — Toyota Kata + A3 Application](https://www.twi-institute.com/toyota-kata-a3-application/)
- [Five Whys — Wikipedia](https://en.wikipedia.org/wiki/Five_whys)

#### R20.3 — OODA Loop applied to software systems

Boyd's tempo principle: cycle speed > individual-decision quality. DORA elite teams: MTTR < 1h, change failure rate < 4%; 6,570× faster recovery than low performers. Mapping: Observe → production telemetry; Orient → triage/RCA; Decide → routing; Act → fix + validate. CSPS pipeline state names mirror this.

Key sources:
- [Wikipedia — OODA Loop](https://en.wikipedia.org/wiki/OODA_loop)
- [DORA — Software delivery performance metrics](https://dora.dev/guides/dora-metrics-four-keys/)
- [Managing.blue — OODA Loop and DevOps](https://managing.blue/2013/02/18/ooda-loop-and-devops/)
- [GitRecap — DORA 2026 benchmarks](https://www.gitrecap.com/blog/dora-metrics-benchmarks)

#### R20.4 — Linear Triage + auto-routing patterns

SLA-as-trigger (auto-escalate on breach) is the load-bearing detail. AI auto-routing accuracy ~90% with historical labels. Standard P-tier conventions: P0 10-15min response / 2-4h resolution; P1 30min-1h / 1 business day; P2 4 business hours / 3 business days; P3 1 business day / 2 weeks. Priority inflation is the dominant failure mode — take priority OUT of submitter's hands.

Key sources:
- [Linear Docs — Triage](https://linear.app/docs/triage)
- [Linear Docs — Triage Intelligence](https://linear.app/docs/triage-intelligence)
- [Techmonarch — Understanding SLA tiers](https://techmonarch.com/blog/understanding-sla-tiers/)
- [Rootly — P1/P2/P3 support levels](https://rootly.com/incident-response/support-levels)
- [Supportbench — Preventing priority inflation](https://www.supportbench.com/prevent-priority-inflation-customer-submitted-tickets/)

#### R20.5 — OpenTelemetry GenAI conventions (provenance)

Canonical event for AI-extracted insight provenance: `gen_ai.evaluation.result`. Required attrs: `gen_ai.evaluation.name`, `gen_ai.evaluation.score.value`, `gen_ai.evaluation.score.label`, `gen_ai.evaluation.explanation`, `gen_ai.response.id`, `gen_ai.request.model`. Span lineage from model call → evaluation → insight is mandatory.

Key sources:
- [OTel — GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [OTel — GenAI events spec](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/)
- [OTel — Gen AI attribute registry](https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/)
- [Datadog — LLM Observability + OTel GenAI](https://www.datadoghq.com/blog/llm-otel-semantic-convention/)

#### R20.6 — Closed-loop learning / RLHF / HITL confidence thresholds

Three-band gate is the production standard: auto-accept ≥0.90, human review 0.75–0.90, discard <0.75. Target review-band rate: 1–5% of items. Above 5% = model too uncertain or threshold too aggressive; below 1% = false positives leaking. Boundary-case review (the 0.75–0.90 band) is the most informative for RLHF-style threshold tuning.

Key sources:
- [IntuitionLabs — Active Learning + HITL for LLMs](https://intuitionlabs.ai/articles/active-learning-hitl-llms)
- [Cleanlab — TLM structured outputs benchmark](https://cleanlab.ai/blog/tlm-structured-outputs-benchmark/)
- [Comet — Human-in-the-loop review workflows](https://www.comet.com/site/blog/human-in-the-loop/)
- [arXiv — A Survey of RLHF (Kaufmann et al)](https://arxiv.org/pdf/2312.14925)
- [AWS — RLHF explainer](https://aws.amazon.com/what-is/reinforcement-learning-from-human-feedback/)

#### R20.7 — Knowledge management failure modes at scale

The dominant failure: write-only systems. Confluence/Notion/wiki rot is structural, not tool-specific. Antidote pattern (load-bearing finding): **capture-in-flow + pull-based discovery + visible feedback loops + forcing-function closure**. Every system that DIDN'T degrade shares these four; every system that DID degrade lacked one or more. ADRs survive where wikis die because they're enforced at code review (forcing function).

Key sources:
- [Pravodha — Why KM software fails mid-market teams](https://pravodha.com/blogs/why-knowledge-management-software-fails-mid-market-teams-and-what-to-look-for-instead)
- [Knowledge-Management-Tools.net — Failure factors](http://www.knowledge-management-tools.net/failure.html)
- [Mark Burgess — The Failure of Knowledge Management](https://mark-burgess-oslo-mb.medium.com/the-failure-of-knowledge-management-5d97bb748fc3)
- [Nick Milton — 7 failure modes for knowledge transfer](http://www.nickmilton.com/2019/01/7-failure-modes-for-knowledge-transfer.html)
- [adr.github.io community](https://adr.github.io/) (the ADR forcing-function pattern)

### Calibration outcomes folded into `principles.yaml#P-META-005.config`

| Knob | Value | Source convergence |
|---|---|---|
| `sla_observed_to_triaged_hours.P0` | 1 | Linear/incident.io standard |
| `sla_observed_to_triaged_hours.P1` | 4 | Linear/Rootly standard |
| `sla_observed_to_triaged_hours.P2` | 24 | Industry default |
| `sla_observed_to_triaged_hours.P3` | 72 | Long-tail; auto-close acceptable past 14d |
| `sla_triaged_to_routed_hours` | 48 | 10% override window for ~90% auto-routing accuracy |
| `sla_fixing_days.P1` | 30 | Google SRE 80%-within-30d target |
| `sla_fixing_days.P2` | 90 | Industry 30/60/90 cadence |
| `sla_fixing_days.P3` | 180 | Below this cap, evidence shows <40% close rate |
| `ai_confidence_thresholds.auto_accept` | 0.90 | RLHF / document-extraction standard |
| `ai_confidence_thresholds.human_review_band_lo` | 0.75 | Active-learning informativeness boundary |
| `ai_confidence_thresholds.human_review_band_hi` | 0.90 | Same as auto_accept |
| `target_human_review_rate_pct` | [1, 5] | Cleanlab TLM operating-point target |
| `recurrence_check_days_default` | 90 | Industry recurrence-detection default |
| `recurrence_check_days_critical` | 30 | Tightened for P0/P1 |
| `repeat_issue_auto_adr_threshold_K` | 2 | Toyota documented + Google SRE 30/60/90 convergence |
| `repeat_issue_window_days` | 90 | Same convergence |
| `repeat_issue_lifetime_threshold_K` | 3 | Slow-burn recurrence catch |
| `meta_loop_trend_window_days` | 90 | Standard rolling-window for engineering metrics |
| `meta_loop_eval_cadence` | weekly | DORA/SRE review cadence |
| `meta_loop_degradation_pct_trigger_adr` | 20 | Mirrors Google SRE 20%-error-budget quarter trigger |

## S002 turn 6 — second research stream

### Stream R21 — Tags + statuses + accountability + no-predefined-path handling (S002 turn 6)

**Goal:** Validate the intake architecture S002 built (S002 turns 4-5) against industry best practices on tag usage, state-machine "no silent drop" patterns, accountability mechanisms, type taxonomies, and — critically — how production systems handle content with no predefined routing path.

**Outcome destination:** Cited verbatim in `_intake/unknown-path-protocol.md`, `_intake/proactive-completion.md` (F8 added), `_handoff/VAULT/protocols.md` (§17 4-section structure), `_handoff/VAULT/insights.md` (industry-validated patterns absorbed). Key calibration: K=2-within-90d threshold validated; hybrid taxonomy+folksonomy tag model validated; 4-section handoff payload locked.

**Sub-topics covered:**

- R21.1 — Tag usage in production routing/audit (Linear, Asana, Jira, GitHub Issues, Salesforce, Glean, Notion, Forte Labs Hedden taxonomy literature). Hybrid taxonomy + folksonomy is the production-tested pattern; closed enum for routing dimensions, open folksonomy for descriptors. Tags drive routing; states drive SLAs.
- R21.2 — Status / state-machine "no silent drop" patterns (Sentry escalating-issues, PagerDuty auto-pause, Jira validators, Atlassian Compass, Linear). Required transition fields, aging escalation, re-open on recurrence, owner reassignment auditability, closure-without-validation prohibition.
- R21.3 — Mechanical accountability + completion enforcement (Google SRE postmortem culture, Lunney/Lueder USENIX; incident.io "4 reasons action items die"; Pragmatic Engineer postmortem analysis). Single tracker mirror; named owner + verifiable verb + deadline; aging dashboard + weekly stuck-review.
- R21.4 — Comprehensive type taxonomy (RFC 6838 IANA + Apache Tika + LangChain + LlamaIndex + Glean connectors + Schema.org). Recommended taxonomy table with ~46 modality+subtype combinations; CSPS gaps surfaced (content_modality dimension missing; AI-export sub-types collapsed; embedded-content recursive types not split).
- R21.5 — **No-predefined-path handling (the deepest stream)**. Discovery / Unrouted lane as first-class state; LLM-as-classifier-with-deterministic-fallback; three confidence bands; K-within-N promotion rule; schema-evolution-as-product; explicit ban on force-fit. OpenText "holding bay" + Glean "no manual rules" + Linear Triage Intelligence + Salesforce Einstein converge on this exact shape. CSPS's `unknown-path-protocol.md` was built turn-6 BEFORE research returned; research validates the design.
- R21.6 — Two-sided chat handoff + intent-to-impact patterns (SBAR clinical handover, OpenAI Agents SDK, military command handover, Toyota shift-change kata, Amazon working-backwards). 4-section structured briefing payload: Intent / Constraints / Open Items / Evidence — locked into `protocols.md` §17 v1.2.

**8 synthesis recommendations** (folded into S002 deliverables):

1. Keep 11 closed-enum dimensions; add 12th open `descriptors[]` lane (deferred to S003 — small cross-doc edit).
2. Add explicit transition validators on closing transitions (deferred to S003 — extends tag-status-contract.md).
3. Mirror action items into team's real backlog (already implicit via ADR auto-trigger; explicit Linear/Jira mirror deferred until DB exists).
4. Add `content_modality` dimension orthogonal to source_type with ~46 subtypes (deferred to S003 — substantive update to source-types.md).
5. Make Discovery / Unrouted lane first-class state — **DONE** in `unknown-path-protocol.md`.
6. Extend K=2 trigger to schema-leaf proposals — **DONE** in `unknown-path-protocol.md` Step 4.
7. Adopt 4-section structured-briefing handshake — **DONE** in `protocols.md` §17 v1.2.
8. Add 8th forcing function: weekly Discovery-queue review — **DONE** in `proactive-completion.md` F8.

**Sources:** ~70 industry references; full URL list available in the research output (preserved in turn-6 chat history; recoverable from git when repo ships).

## S003 research streams (zero new streams — execution session)

S003 was an autonomous overnight execution session against ratified-at-S002 scope. No new research streams (R-codes) were opened.

Existing research outputs consumed (R21 streams from S002):
- **R21 stream 1 (descriptors[] open lane)** — applied to `frontmatter-standard.md` + `tag-status-contract.md` per S003 §3.5.a
- **R21 stream 4 (content_modality dimension, ~46-subtype taxonomy)** — applied to `_intake/source-types.md` per S003 §3.5.b
- **EXT-20260502-003-A (Zone A/B/C/D handoff structure)** — applied to `HANDOFF-S003-to-S004.md` per S003 §3.5.d
- **EXT-20260502-003-C (continuity-manifest signature/receipt)** — formalized in `_handoff/VAULT/protocols.md` v1.8 §11b.1 + §11b.2 per S003 §3.5.e

The 5 R21 stream-2 / stream-3 / stream-5 / stream-6 / EXT-20260502-003-B + 003-D items remain in S002's research outputs without activation in S003 (none required for S003 scope).

## How to add a new research stream

When a new session fires a research stream:

1. Reserve the next R-number (R21, R22, …).
2. Append a new section here with the same shape: goal, sub-topics, sources.
3. Cite the destination doc the findings flow into.
4. If the stream supersedes a prior one, link both directions (`Supersedes: Rxx` + edit Rxx with `Superseded by: Ryy`).

The reuse-first principle applies to research itself — search this index BEFORE firing a new search.
