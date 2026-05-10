---
id: csps.intake.dashboard-plan
name: external-input-dashboard-plan
description: Plan for the dev front-end dashboard that makes the intake plane + LearningLoopItem pipeline + schema state visible AND editable. Surfaces 6 admin pages under apps/admin/app/(admin)/intake/ — Inbox, Pipeline (kanban-style state machine view), Contexts (per-leaf navigation), Schema-Gaps (discovery channel), Blockers (registry), Audit. Pre-runtime, the admin app doesn't exist; this plan is the spec it'll be built against in week 4-10. EXT-20260502-001-D — treasure #3 section D processed live as proof.
version: 1.0
owner: group:finky
lifecycle: experimental
lifecycle_state: pending-review
next_review_at: 2026-08-01
tags:
  - domain:ops
  - type:reference
  - audience:developer
  - audience:admin
  - maturity:draft
crosscutting:
  - observability
  - reliability
  - ai-native
diataxis_type: explanation
links:
  - { rel: parent, href: ./README.md }
  - { rel: protocol, href: ./manual-protocol.md }
  - { rel: contexts, href: ./contexts/README.md }
  - { rel: ledger, href: ./extractions-ledger.md }
  - { rel: tag-status, href: ./tag-status-contract.md }
  - { rel: proactive-completion, href: ./proactive-completion.md }
domain_path: platform
---

# Dev Front-End Dashboard Plan — Intake + LearningLoop + Schema

> **Make it all available and editable.** — User directive S002 turn 6 (treasure #3 section D)

## What this plan locks

The admin pages that surface the entire intake plane + LearningLoopItem pipeline + schema state in a single dev-facing dashboard, with EDIT capability where it makes sense. Path: `apps/admin/app/(admin)/intake/*` (Payload-backed Next.js route group).

## Routes (6 pages)

### `/admin/intake/inbox` — drop-zone surface

Shows pending uploads + their pipeline state + manual-protocol completion.

**Columns:** EXT-ID, source_type badge, risk badge, gate_state, ingested_at, sub-ID count, fan-out target leaves, current `pipeline_state`, `lifecycle_state`, time-since-last-transition.

**Edit affordances:**
- Re-classify source_type (closed enum dropdown)
- Override risk profile with reason (audit-logged)
- Manually trigger re-scan
- Force-route to specific leaf (with reason audit)
- Promote `pending-review` → `active` (sets state_transitioned_at)
- Demote / deprecate with reason

**Filters:** by source_type, risk, gate_state, age (>SLA highlighted), tenant_id.

**Bulk operations:** Re-route N items to same leaf; mark N as duplicates; close N with reason.

### `/admin/intake/pipeline` — Kanban-style pipeline state-machine view

The 6 pipeline_state columns (`observed → triaged → routed → fixing → validated → closed`) as kanban swimlanes. Each card is an EXT-ID with at-a-glance summary + age.

**Card colors per SLA breach:**
- Green: within SLA
- Yellow: 1× SLA exceeded
- Orange: 2× SLA exceeded
- Red: 3× SLA exceeded (critical escalation)

**Drag-and-drop transitions** (with mandatory reason field):
- Drag from `observed` → `triaged`: requires confidence band + classification confidence
- Drag from `triaged` → `routed`: requires `routed_to` slug
- Drag from `routed` → `fixing`: requires `fixing_pr_url` (or "manual fix" reason)
- Drag from `fixing` → `validated`: requires validation evidence link
- Drag from `validated` → `closed`: requires `closed_reason` (closed enum dropdown)
- Backward drags require reason + audit-log entry

**Lane summary metrics:** count per lane, average age per lane, SLA-breach count per lane, P0/P1/P2/P3 distribution.

### `/admin/intake/contexts` — per-leaf navigation tree

Mirrors the schema tree (`_intake/contexts/`). 9 pillar-level branches collapsed by default; expand to leaf-level. Each leaf shows:

- Active EXT-IDs landed there (count + most-recent)
- Average dwell time per state
- SLA adherence rate
- Last activity timestamp
- "View full content" link to the markdown extraction notes (or DB rows post-runtime)

**Edit affordances:**
- Per-leaf SLA tier override (with audit-logged reason)
- Per-leaf inheritable-tags edit
- Move EXT-IDs between leaves (with audit-logged reason; preserves provenance via `parent_input_id`)

### `/admin/intake/schema-gaps` — discovery channel

Lists every active schema-gap from `_schema-gap-registry.md` (or `public.schema_gap_proposal` post-runtime).

**Columns:** proposed_leaf_name, proposed_pillar, first_seen, k_count_90d, k_count_lifetime, latest_ext_id, state.

**Threshold indicators:** K=1 (gray), K=2 (yellow — ADR draft auto-created), K=3 (orange — escalation), K≥4 (red — auto-promotion to pending-protocol if user hasn't acted).

**Edit affordances:**
- Accept proposed leaf (creates ADR + leaf doc + `contexts/` folder; re-routes EXT-IDs)
- Reject proposed leaf (marks state `deprecated` with reason; archives the registry row)
- Modify proposed_pillar / proposed_leaf_name before accepting
- Manually trigger ADR draft creation at any K count

### `/admin/intake/blockers` — blocker registry surface

Lists every BLK-S<NNN>-* across all sessions. Default filter: `state: open`.

**Columns:** BLK-ID, asked_at, question, awaiting_from, state, age, session.

**Edit affordances:**
- Mark `answered` with verbatim user response (audit-logged)
- Mark `explicitly-dropped` with reason
- Mark `superseded` with link to superseding BLK-ID
- Add new manual blocker (with reason)

**Bulk surfacing:** "Open blockers older than 3 sessions" filter (audit-flagged).

### `/admin/intake/zero-findings` — RZF + CEC observability (NEW S002 turn 10 per P-META-006)

Surfaces the cycle-count + findings trends per artifact across the Zero-Findings Discipline.

**Columns (RZF):** artifact_id / lifecycle_state / cycles_run_history / latest_findings_count / coverage_tokens (mechanical/semantic/propagation/user-visible-outcome) / last_evidence_block_timestamp / validator_health.

**Columns (CEC):** ratified_artifact / extracted_essence (1 sentence) / cycles_walked_history / latest_opportunities_count / walk_scope_coverage_pct / last_walk_trail_timestamp / applications_made_count.

**Edit affordances:**
- Drill into any artifact → view full evidence-block / walk-trail (read-only — append-only ledger)
- Filter by `cycles_required > N` (high-complexity-zone surfacing — high-cycle artifacts are candidates for refactoring)
- Filter by `walk_scope_coverage < 100%` (incomplete walks — flagged for re-run)
- "Re-run cycle" button — manually trigger RZF cycle for an artifact (audit-logged)
- "Re-walk" button — manually trigger CEC walk (audit-logged)
- Export findings/walk-trail to CSV for compliance/audit

**Anti-pattern detection:**
- "Cycle count as target" pattern detector — flags any commit message or doc using language like "run 3 cycles" or "predetermined cycles"
- "Mechanical-only declared as RZF" — flags artifacts with `coverage.mechanical: true` but `coverage.semantic: false` AND `coverage.propagation: false`
- "Premature CEC-0" — flags walk-trails with `cycles_walked: 1` AND `applications_made > 0` (suggests re-walk wasn't done after applications)

### `/admin/intake/audit` — pipeline observability

Real-time view of:
- Throughput (EXT-IDs/day, /week, /month — by source_type)
- Cycle time (observed → closed) trend over 90-day rolling window (per `meta-loop-audit`)
- AI-extraction confidence distribution histogram (auto-accept / human-review band / discard)
- Recurrence-check fire rate + reopen rate (per F2 of proactive-completion.md)
- K=2 ADR auto-creation events (per F3)
- SLA adherence per state per tier
- AGENTS.md hard NO violations log (mechanical compliance signal)

**Edit affordances (config only, not historical data):**
- Tune confidence thresholds per evaluator (currently 0.75 / 0.90; tunable per `principles.yaml#P-META-005.config.ai_confidence_thresholds`)
- Tune K-thresholds for ADR auto-creation (currently K=2 / 90d)
- Tune meta-loop trend window (currently 90d rolling, weekly evaluation)
- Tune SLA per-tier (currently P0 1h / P1 4h / P2 24h / P3 72h triage)

All config edits write to `principles.yaml` via PR (not direct DB write) — preserves "files are truth, DB is index" principle (P-ARCH-003). Config edits trigger `pnpm principles:codegen` to regenerate downstream artifacts.

## Cross-page features

- **Search:** full-text + EXT-ID lookup across all pages
- **Tenant filter:** sticky per-session; staffRole only sees own tenant unless multi-tenant flag set
- **Audit log per action:** every edit writes a `public.audit.events` row with actor + timestamp + before/after diff (per ADR-0007 trigger-based audit)
- **Stewardship-review widget:** floating button surfaces `/stewardship-review` skill output any time
- **Learning-loop-extract widget:** floating button manually triggers extractor on a session log

## Tech stack (per existing CSPS choices)

| Layer | Choice |
|---|---|
| Framework | Next.js 15 App Router (per ADR-0001) |
| Routes | App router under `apps/admin/app/(admin)/intake/` |
| Styling | Tailwind + `@csps/templates` (per ADR-0004) |
| Charts | Tremor (per pillar-1/tech-stack.md) |
| Tables | shadcn/ui DataTable wrapped in `@csps/templates` |
| Forms | react-hook-form + Zod schemas auto-generated from ZModel |
| Real-time | tRPC + WebSockets for pipeline-kanban live updates |
| State | Zustand for client-side filter state |
| Backing CMS | Payload CMS 3.0 mounted in same Next.js process (per ADR-0001) |

## Implementation order (mapped to build-order)

| Week | Dashboard milestone |
|---|---|
| 4 | `/admin/intake/audit` first — observability over the runtime that just shipped |
| 5 | `/admin/intake/inbox` — surfaces the connector cohort that ships this week |
| 6 | `/admin/intake/pipeline` kanban — depends on Mastra-runtime extractions populating LearningLoopItem |
| 7 | `/admin/intake/contexts` tree navigation |
| 8 | `/admin/intake/schema-gaps` discovery channel surface |
| 9 | `/admin/intake/blockers` registry |
| 10 | Cross-page search + tenant filter + audit-log integration |
| 11 | First app's intake dashboard (verifies extraction-readiness — graduated app gets its own admin) |
| 12 | Polish + load test |

## Forward compatibility (pre-runtime → post-runtime)

Pre-runtime: the markdown ledgers (`extractions-ledger.md`, `_schema-gap-registry.md`,
`blockers-S<NNN>.md`) are the source data. Dashboard could be a static-site preview.

Post-runtime: dashboards read from `public.external_input` + `public.learning_loop_item` +
`public.schema_gap_proposal` + `public.session_blocker`. Migration script
`tools/intake/migrate-manual-ledger.ts` ports markdown ledgers into DB rows.

The dashboard pages above are designed against the DB schema; pre-runtime mode is a
read-only preview reading the markdown.

## Open questions (added to ledger)

Will be added to `open-questions-ledger.md` as `OQ-DASH-NNN`:

| ID | Question | Recommendation sketch |
|---|---|---|
| OQ-DASH-001 | Should the kanban-pipeline view auto-refresh in real-time, or manual refresh? | Real-time via tRPC subscription; auto-refresh with throttle (5s) for SLA-sensitive cards. |
| OQ-DASH-002 | Edit-affordance scope — which fields are user-editable vs system-only? | All `state` transitions editable with mandatory reason; `confidence_score` editable as override (audit-logged). `state_transitioned_at` system-only. |
| OQ-DASH-003 | Multi-tenant view for platform-staff — does the admin show all tenants by default? | No; default = current user's tenant. "View all tenants" requires platform-admin role + 2-factor confirmation per session. |
| OQ-DASH-004 | Should the dashboard offer bulk-export of EXT-IDs (e.g., CSV download)? | Yes; required for compliance + offline analysis. Audit-log every export. |
| OQ-DASH-005 | What's the dashboard's auth model — Clerk Org-based, or separate? | Clerk Org-based; staff-role permission set per `pillar-3/sandboxed-skill-governance` capability model. |

## Cross-references

- [_intake/README.md](./README.md) — intake architecture
- [pillar-6/dashboards.md](../pillar-6-operations-and-delivery/dashboards.md) (pending S003 §3.5) — the broader dashboards plan this is part of
- [pillar-3/customer-kit.md](../pillar-3-platform-services/customer-kit.md) (pending S003 §3.4) — the `<EntityList>`, `<EntityDetail>` primitives this dashboard composes
- [tag-status-contract.md](./tag-status-contract.md) — every edit-affordance respects this contract
- [proactive-completion.md](./proactive-completion.md) — the dashboard is the visible-feedback-loop for these forcing functions
