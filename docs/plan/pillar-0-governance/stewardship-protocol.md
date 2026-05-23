---
id: csps.governance.stewardship-protocol
name: stewardship-protocol
description: The Stored Content Lifecycle Principle — every saved artifact (handoff, vault entry, legacy archive, open question, ADR proposal, draft, intake item, third-party skill, rule, audit finding) declares a lifecycle_state and has a recurring trigger that advances it. Saved-without-trigger = orphan-in-waiting. Defines the 6-state machine, transitions, cadences, SLAs, and the four enforcing audits. Industry parallel = backlog grooming + DDD stewardship + GTD inbox-zero + SharePoint metadata reviews; canonical CSPS naming = Stewardship Protocol.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:doc
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - observability
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ./reuse-first-principle.md }
  - { rel: enforcement-architecture, href: ./mechanical-enforcement.md }
  - { rel: registry, href: ../../../packages/principles/principles.yaml }
  - { rel: frontmatter-standard, href: ../pillar-1-architecture-and-stack/frontmatter-standard.md }
  - { rel: audit-runner, href: ./audit-runner.md }
  - { rel: learning-loop, href: ./learning-loop.md }
domain_path: platform
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# Stewardship Protocol — P-META-004 (Stored Content Lifecycle)

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The mandatory lifecycle every saved artifact in CSPS travels through, the recurring triggers that advance state, the per-state SLAs, the four audits that enforce non-orphaning, and the integration with the universal frontmatter standard.

## Why this exists (the gap S001 identified)

S001 created **places** — `docs/plan/_handoff/`, `docs/plan/_legacy/`, the future `VAULT/`, "Open questions" sections embedded in leaf docs — but the system did not yet have **processes** that recurringly advance those saved items. This violated the cardinal CSPS principle ("nothing stands alone — place + process") applied recursively to AI outputs themselves.

The user's framing:

> *"Every INPUT either has a place to be and a predefined process to follow OR the system alerts itself to solve one."*

Stewardship Protocol is the predefined process for the "stored content" input class. It is a sibling principle to the **Learning Loop** (P-META-005) — Stewardship handles the things that *are* saved; Learning Loop handles the things that *should be* saved but might not be (chat content, near-misses, AI-extracted insights).

## Canonical wording (the principle, save verbatim)

> **Stored Content Lifecycle Principle**: Every saved artifact (handoff, vault entry, legacy archive, open question, ADR proposal, draft doc, intake item, third-party skill, rule, audit finding) must declare a `lifecycle_state` and have a recurring trigger that advances it. Saved-without-trigger = orphan-in-waiting. The default state for newly-saved-without-process is `pending-protocol` — which itself triggers a protocol-creation flow.

Source of truth: `packages/principles/principles.yaml#P-META-004`. This document is the human-readable narrative form.

## Industry parallels (the pattern, not invented here)

| Domain | Pattern | What CSPS adopts |
|---|---|---|
| **Scrum / Kanban** | Backlog grooming as recurring stewardship | Per-session pending-* triage; weekly active-stale review |
| **Linear / Jira / Shortcut** | Issue triage loop with state-machine + SLA per state | The 6-state machine + SLA-per-state + auto-escalation on breach |
| **Domain-Driven Design** (Eric Evans, 2003) | Stewardship as ownership of bounded-context artifacts | `owner:` field on every artifact; ownership reviews on transitions |
| **GTD + Inbox Zero** (David Allen) | Every captured input must have a next-action or be archived | `pending-protocol` is the default for unprocessed; never silent-save |
| **PARA Method** (Tiago Forte, *Building a Second Brain*) | Project / Area / Resource / Archive routing for every captured note | Mirrored in `lifecycle_state` enum (active = Area, pending-* = Project inbox, resolved/promoted = Resource, deprecated = Archive) |
| **SharePoint Managed Metadata** | Quarterly review of open-tag values for promotion/retirement | `legacy-archive-review-due` audit running on weekly cadence over `_legacy/` |
| **Backstage Catalog lifecycle** | experimental → production → deprecated | The existing `lifecycle:` field is the *product-stage* axis; `lifecycle_state` is the *content-stewardship* axis (orthogonal) |

CSPS naming = **Stewardship Protocol**. Selected because it's the single industry term that captures both "ownership" and "recurring care," matching the user's *"never leave anything floating or orphaned"* directive.

## Lifecycle states (the closed enum)

| State | Meaning | Allowed transitions |
|---|---|---|
| `pending-protocol` | Newly saved without a defined process; the **default** for unprocessed input. The state itself triggers a protocol-creation flow (write a process for handling this artifact class, then advance). | → `active` (protocol now exists) → `deprecated` (rejected; this kind of input should not be saved) |
| `pending-review` | Has a process but is awaiting human/AI review before being treated as canonical. | → `active` (accepted) → `promoted` (promoted-to-canonical, e.g., ADR draft accepted as ratified ADR) → `deprecated` (rejected) |
| `active` | Currently load-bearing. Default state for every leaf doc, principle, README, runtime config. | → `pending-review` (re-review triggered) → `promoted` (elevated, e.g., a leaf doc promoted to a pillar README) → `resolved` (the work it represents is closed) → `deprecated` (no longer load-bearing) |
| `promoted` | Has been elevated to canonical status. Survives at higher visibility; can still be re-reviewed. | → `active` (demoted back) → `deprecated` |
| `resolved` | The work the artifact represented is closed. Kept for provenance; eventually retired. | → `deprecated` (retired) |
| `deprecated` | Terminal. Kept for provenance; not load-bearing. Audit checks STOP firing on deprecated items. | (terminal — no transitions) |

### State transition diagram

```
                ┌──────────────────┐
                │ pending-protocol │  ← default for newly-saved-without-process
                └────────┬─────────┘
            (protocol    │      (rejected)
              created)   ▼              ▼
                     ┌────────┐    ┌────────────┐
                     │ active │◄───┤ deprecated │  (terminal)
                     └───┬────┘    └────────────┘
              (re-review)│ ▲          ▲    ▲
                         ▼ │          │    │
                    ┌────────────┐    │    │
                    │ pending-   │    │    │
                    │  review    │────┼────┘  (rejected)
                    └─────┬──────┘    │
              (promoted)  │           │
                          ▼           │
                     ┌──────────┐     │
                     │ promoted │─────┤  (deprecated; demoted-then-retired)
                     └──────────┘     │
                          ▲           │
                          │           │
                     ┌──────────┐     │
                     │ resolved │─────┘  (work closed; eventually retired)
                     └──────────┘
                          ▲
                          │
                     (work closed)
                          │
                       active
```

**Default state for new artifacts:** `active` (for canonical content) OR `pending-protocol` (for inputs without a defined process). Validators reject artifacts without an explicit `lifecycle_state`.

## Cadences (the recurring triggers — the load-bearing piece)

The whole point of the protocol is that "saved" implies "advanced over time." Each state has a recurring trigger.

| State | Trigger cadence | Mechanism |
|---|---|---|
| `pending-protocol` | **Per-session** + nightly | Fresh-chat protocol surfaces all `pending-protocol` items; nightly audit `stale-pending-protocol` flags any past SLA |
| `pending-review` | **Per-session** + nightly + on-PR | Fresh-chat protocol surfaces; nightly audit `stale-pending-review` flags; PR check blocks merge if a referenced item is past SLA |
| `active` | **Weekly** for staleness | Audit `active-stale` flags items beyond `review_cadence_active_stale_days` (default 90) since last review |
| `promoted` | **Quarterly** | Promoted items are reviewed for continued canonical status |
| `resolved` | **30 days** | Resolved items are reviewed once for retirement to `deprecated` (clean up provenance) |
| `deprecated` | None — terminal | Audits skip deprecated items; the state is the tombstone |
| `_legacy/` archive items | **Weekly** | Audit `legacy-archive-review-due` flags any item past its `next_review_at` |

**Per-session triggers** are the most important. The fresh-chat protocol (§11 of every handoff) and the chat-closing protocol (§10) both run a stewardship review — surface the queue, advance or extend each item.

## SLAs per state (in `principles.yaml#P-META-004.config`)

```yaml
sla_pending_review_days: 14
sla_pending_protocol_days: 30
sla_legacy_archive_review_days: 90
review_cadence_active_stale_days: 90
```

Rationale:

- **14 days for `pending-review`** — Linear/Jira P2 convention; long enough for considered review, short enough that queues don't accumulate.
- **30 days for `pending-protocol`** — protocol creation is real work; double the review SLA. Beyond 30 days the system is implicitly saying "we don't know how to handle this kind of input" — escalation is mandatory.
- **90 days for `_legacy/` review** — quarterly cadence; matches Backstage Catalog and SharePoint Managed Metadata standard.
- **90 days `active`-stale threshold** — leaf docs that haven't been touched or reviewed in a quarter get flagged for ownership confirmation.

These are tunable via the YAML config, no doc changes needed.

## The frontmatter contract (the integration point)

Per [frontmatter-standard.md](../pillar-1-architecture-and-stack/frontmatter-standard.md), every artifact carries:

```yaml
---
lifecycle_state: active                           # closed enum
next_review_at: 2026-08-01                        # ISO date — REQUIRED when state != active
state_transitioned_at: 2026-05-02                 # ISO date — last transition (auto-updated by tooling)
---
```

`lifecycle_state` is **distinct** from the existing `lifecycle:` field:

- `lifecycle:` (Backstage convention) = product-stage of the artifact: `experimental | beta | production | deprecated`. Stable property; rarely changes.
- `lifecycle_state` (CSPS Stewardship Protocol) = stewardship-state of the content: `active | pending-review | pending-protocol | promoted | resolved | deprecated`. Active property; advances over time.

A leaf doc can be `lifecycle: production` (mature) AND `lifecycle_state: pending-review` (currently being reconsidered) simultaneously. They're orthogonal axes.

`next_review_at` is required when state ≠ `active`. For `active` items it's optional (audited via `active-stale` against the 90-day default).

## The four audits (registered in `principles.yaml#P-META-004.enforcers`)

These are the **mechanical enforcers** of the principle. Without them, the protocol is prose.

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `orphan-without-lifecycle-state` | PR | error | Every artifact has `lifecycle_state` declared (or inherited via `tools/catalog/variants.ts`). PRs adding artifacts without it fail. |
| `stale-pending-review` | PR + nightly | warn | Items in `pending-review` past `sla_pending_review_days` (14) are flagged. PR check blocks merge if a *referenced* item is breached; nightly opens a Linear ticket. |
| `stale-pending-protocol` | nightly | error | Items in `pending-protocol` past `sla_pending_protocol_days` (30) are flagged for protocol creation. Severity = error because pending-protocol implies the system has no process for this input class — a real gap. |
| `legacy-archive-review-due` | weekly | warn | `_legacy/` items past their `next_review_at` are flagged for review or retirement. |

Implementation lives at `libs/audits/checks/stewardship/<slug>.ts`. Registration in `audit-runner.md` under the **Stewardship** category.

## Workflows

### At fresh-chat open (per `protocols.md` §11)

1. Read latest handoff.
2. Run `/stewardship-review` (skill at `packages/skills/stewardship-review/SKILL.md`) — surfaces:
   - All items in `pending-protocol` (need a protocol designed)
   - All items in `pending-review` (need a review decision)
   - All `active` items past their stale threshold
   - All `_legacy/` items past their `next_review_at`
3. For each surfaced item, either advance the state or extend `next_review_at` with a reason.
4. **Never silently leave a `pending-*` item unexamined at session start.**

### At chat-close (per `protocols.md` §10)

1. Run `/stewardship-review` again — does anything new need state advancement?
2. For every artifact created or modified during the session, verify `lifecycle_state` is declared.
3. The closing checklist contains: *"Run stewardship review — advance every pending-* item or extend its next_review_at with reason."*

### On every PR

1. `orphan-without-lifecycle-state` runs at PR time — blocks merge if any new artifact lacks `lifecycle_state`.
2. `stale-pending-review` runs at PR time — comments if any *referenced* artifact is past its SLA, block-vs-warn determined by configuration.
3. PRs that promote artifacts (`pending-review → active` or `active → promoted`) require an explicit transition note in the PR description.

### Nightly + weekly automated audits

Per the cadence table above. Severity routing follows the standard `audit-runner.md` model — warn → dashboard fact, error → Linear ticket, critical → page on Slack.

## Backfill (S002 task — completed in this session)

S002 backfilled `lifecycle_state` on every existing artifact (33 files):

- All pillar READMEs + leaf docs → `lifecycle_state: active`
- `MASTER_PLAN.md` → `active`
- `AGENTS.md` → `active` (note: it is generated; the source is `principles.yaml`)
- `_legacy/README.md` → `active` (it is the canonical migration provenance, not stale)
- `_handoff/HANDOFF-S001-to-S002.md` → `active` for the duration of S002, then `resolved` once S002→S003 handoff supersedes
- `principles.yaml` → header-level `lifecycle_state: active` (registry-wide, not per-principle)
- All "Open questions" sections in leaf docs → extracted into a tracked ledger `docs/plan/_handoff/VAULT/open-questions-ledger.md` with each question marked `lifecycle_state: pending-review`, `next_review_at: 2026-08-01` (90 days from creation)

Going forward, every new artifact carries `lifecycle_state` from creation. The `orphan-without-lifecycle-state` audit prevents regression.

## Anti-patterns (what the protocol resists)

1. **Silent-save** — artifact persisted without `lifecycle_state`. The orphan-in-waiting. PR audit catches.
2. **Perpetual-pending** — state stuck in `pending-*` indefinitely. SLA audits catch.
3. **Orphan-archive** — `_legacy/` items never re-reviewed. Weekly audit catches.
4. **Knowledge-graveyard** — saved-but-unread, no recurring trigger (Confluence-rot equivalent). The whole protocol is the antidote: every saved item has a state-advancing trigger.
5. **State-without-transition** — `lifecycle_state` declared but no trigger advances it. Treated as a bug; nightly audit flags items in non-terminal state with no transition in 90 days.
6. **Stewardship-theater** — running the review without actually advancing or retiring items. Caught by trend audit: if `pending-*` queue length grows monotonically week over week, the review is theater.

## Why P-META-004, not P-OP-005

This is a **meta-principle** about how principles/artifacts persist, not an operating principle about how humans+AI collaborate during a single session. It lives alongside:

- P-META-001 (defense in depth — how enforcement is layered)
- P-META-002 (principles travel with artifacts — how they propagate during graduation)
- P-META-003 (inheritance via shared runtime — how they propagate to sub-agents)
- **P-META-004 (stored-content-lifecycle — how saved content stays alive)**
- P-META-005 (learning-loop — how the system learns about itself; new content)

The seven meta-principles together form CSPS's self-governance spine: defense-in-depth (001), travels-with-artifacts (002), inheritance-via-shared-runtime (003), stewardship-of-saved-content (004), learning-from-everything (005), zero-findings-discipline (006), five-surface-engraving (007).

## RZF cycle counts as state-transition metadata (S002 turn 10 extension)

Per P-META-006 B_RZF, every artifact reaching `validated` or `closed` state must emit an evidence block. The evidence block's `cycles_run` field becomes state-transition metadata: useful for audit (how iteration-rich was the work?) + future learning (which artifacts required many cycles? — those are the high-complexity zones).

The `state_transitioned_at` timestamp + `cycles_run` value together form the audit signature. Pre-runtime: stored in artifact frontmatter `evidence_block_ref:` field pointing to the evidence-block record. Post-runtime: stored as `public.artifact_state_transition.cycles_run` column.

**Lifecycle states extended:**
- `pending-review → active`: optional RZF (review didn't ratify validated state)
- `active → validated`: **RZF mandatory** (ratification → cycle count required)
- `validated → closed`: **RZF mandatory** (terminal state — evidence block becomes the audit record)
- `closed → deprecated`: optional RZF (terminal cleanup)

## Composition with B_POSITIVE_VALUE_EXTRACTION (added S005 turn 22)

Per amended P-META-006 trigger-cadence + `B_POSITIVE_VALUE_EXTRACTION` ([behavioral-contracts.md](./behavioral-contracts.md#B_POSITIVE_VALUE_EXTRACTION)): every state transition that represents POSITIVE progress (not just terminal-state RZF requirement) is a candidate trigger for the positive-value-extraction cycle:

| Transition | RZF required? | Positive-value cycle fires? | Why |
|---|---|---|---|
| `pending-review → active` | optional | **fires when activation surfaces an insight** | Activation is positive progress; if the activated artifact's essence applies to neighbors, walk |
| `active → validated` | **mandatory** | **mandatory** (already covered by P-META-006 CEC original trigger set — every ratification → CEC walk) | Ratification = formal positive event |
| `pending-protocol → promoted` | optional | **fires** — promotion to a permanent leaf is significant positive progress | Walk platform for places the new leaf's essence applies |
| `validated → closed` | **mandatory** | typically not (terminal cleanup; no new value to extract) | Closure isn't a positive event in the sense the contract targets |
| `closed → deprecated` | optional | (rare; only if deprecation reveals a class-level lesson) | One-off |

**Composition with K=2 promotion:** when a `pending-protocol` item promotes to a permanent leaf (per `_intake/unknown-path-protocol.md` K=2 mechanism), promotion = positive significant event = B_POSITIVE_VALUE_EXTRACTION cycle fires. The walk surfaces all places where the newly-promoted leaf's essence applies; outcome captured in closing-summary §10.11b.

## Cross-references

- **Within principles.yaml**: `P-META-001` (the audit-the-audits meta-check that verifies P-META-004's enforcers are present), `P-META-005` (Learning Loop — the sibling that handles things that *should be* saved), `P-OP-002` (FWWS — Stewardship is the long-horizon companion to FWWS's session-scope completion discipline), `P-ARCH-001` (nothing-stands-alone — Stewardship is the recursive application of this principle to AI outputs).
- **Within docs**: [frontmatter-standard.md](../pillar-1-architecture-and-stack/frontmatter-standard.md) (the schema integration point), [audit-runner.md](./audit-runner.md) (the four enforcing audits), [learning-loop.md](./learning-loop.md) (the sibling principle).

## Open questions (tracked separately as of S002)

These are extracted into the open-questions ledger (per the backfill protocol above) — not embedded here for inline review. See `docs/plan/_handoff/VAULT/open-questions-ledger.md`.

- Should `lifecycle_state` be inheritable via the `tools/catalog/variants.ts` cascade so per-glob defaults reduce the per-file declaration burden? (likely yes — saves 30-line helpers from boilerplate)
- Are 14/30/90-day SLAs the right defaults, or should they tier with severity (`critical` artifacts get 7/14/30)?
- Should the `promoted` state require a co-signed approver field (not just `owner:`) to make promotion auditable as a 4-eyes step?
- When a leaf doc is in `pending-review` but its principle is `active`, what's the consumer's authoritative source — the principle or the doc? (Tentative answer: principles.yaml is always authoritative; the doc is narrative.)

## Sources

- [Eric Evans, Domain-Driven Design (2003)](https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215) — the Stewardship concept
- [David J. Anderson, Kanban Method (2010)](https://www.amazon.com/Kanban-Successful-Evolutionary-Change-Technology/dp/0984521402) — backlog grooming
- [Linear Triage docs](https://linear.app/docs/triage) — modern triage state-machine reference implementation
- [Atlassian — GTD and Inbox Zero](https://www.atlassian.com/agile) — capture + next-action discipline
- [Tiago Forte, Building a Second Brain (2022)](https://www.buildingasecondbrain.com/book) — PARA method
- [SharePoint Managed Metadata](https://learn.microsoft.com/en-us/sharepoint/managed-metadata) — quarterly metadata reviews
- [Backstage Catalog lifecycle field](https://backstage.io/docs/features/software-catalog/descriptor-format/) — the lifecycle convention this protocol extends
- [Knowledge-Management-Tools.net — KM failure factors](http://www.knowledge-management-tools.net/failure.html) — why saved-without-trigger fails
- [Mark Burgess — The Failure of Knowledge Management](https://mark-burgess-oslo-mb.medium.com/the-failure-of-knowledge-management-5d97bb748fc3) — the static-vs-flow distinction
