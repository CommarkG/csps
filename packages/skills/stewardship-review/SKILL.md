---
name: stewardship-review
description: Surfaces all artifacts in `pending-protocol`, `pending-review`, and `active`-stale states for current-session triage; flags `_legacy/` items past `next_review_at`. Runs at fresh-chat open and at chat-close (per protocols.md §10/§11). Use this skill to enforce P-META-004 Stored Content Lifecycle — every saved artifact has a recurring trigger that advances it. Triggered by /stewardship-review or by the fresh-chat / closing protocols.
version: 1.0.0
license: internal-only
allowed_tools: [Read, Grep, Glob]
allowed_subagents: []
enforces: [P-META-004]
lifecycle: production
lifecycle_state: active
---

# /stewardship-review — Surface stale items for triage

> **Saved-without-trigger = orphan-in-waiting.** — P-META-004

## When to invoke

Two activation paths per `docs/plan/_handoff/VAULT/protocols.md`:

1. **Fresh-chat open (§11):** every new session runs this skill before any other work. Items in `pending-*` get triaged; `active`-stale items get reviewed; `_legacy/` items past their `next_review_at` get flagged.
2. **Chat close (§10):** every session-close runs this again as the closing-protocol checklist item. Either advance every `pending-*` item or extend its `next_review_at` with reason. Never silent-park.

## What this skill does

For each artifact under the project root with frontmatter:

1. **Parse frontmatter** — extract `lifecycle_state`, `next_review_at`, `state_transitioned_at`, `owner`.
2. **Classify** by state and SLA breach:

   | Bucket | Criterion |
   |---|---|
   | `pending-protocol` queue | `lifecycle_state == "pending-protocol"` |
   | `pending-review` queue | `lifecycle_state == "pending-review"` |
   | `active`-stale | `lifecycle_state == "active"` AND `now() - state_transitioned_at > review_cadence_active_stale_days` (default 90) |
   | `_legacy/` review-due | path matches `_legacy/**` AND `next_review_at < now()` |
   | SLA breach: pending-review | bucket is `pending-review` AND `now() - state_transitioned_at > sla_pending_review_days` (default 14) |
   | SLA breach: pending-protocol | bucket is `pending-protocol` AND `now() - state_transitioned_at > sla_pending_protocol_days` (default 30) |

3. **Output a triage table** grouped by bucket, sorted by age (oldest first):

   ```
   bucket                  | id                                  | owner          | age   | next_review_at
   pending-protocol        | csps.foo.bar                        | group:finky    | 12d   | 2026-08-01
   pending-review (BREACH) | csps.baz.qux                        | group:finky    | 18d   | 2026-05-16
   active-stale            | csps.governance.architecture-prin… | group:finky    | 95d   | -
   _legacy/ review-due     | csps.plan.legacy.master-plan-v1.3   | group:finky    | -     | 2026-04-30
   ```

4. **Suggest transitions** for each item: advance state OR extend `next_review_at` with reason.

## How invocation works

### Inputs

- `--root` (optional, default: project root) — directory to walk
- `--bucket` (optional) — limit output to one bucket: `pending-protocol | pending-review | active-stale | legacy-review`
- `--breach-only` (optional flag) — show only SLA-breached items

### Outputs (stdout)

Triage table + summary counters:

```
PENDING-PROTOCOL <count> items (<breach_count> breached SLA)
PENDING-REVIEW <count> items (<breach_count> breached SLA)
ACTIVE-STALE <count> items (>90d since last review)
LEGACY-REVIEW-DUE <count> items past next_review_at
```

Plus one line per item, formatted as the triage table above.

## Why this matters

Without this skill running at every session boundary, the place + process the user cares about — `_handoff/`, `_legacy/`, "Open questions" sections, ADR proposals, vault entries — silently rot into Confluence-equivalent graveyards. The four enforcing audits in `audit-runner.md` are the long-cycle backstop; this skill is the per-session human checkpoint.

## Status (S002)

**STUB.** Initial implementation: manual `grep` over the repo for `lifecycle_state:` and computing ages from git log. The full implementation lands at week 4 with the audit-runner; the per-session human checkpoint (this skill's primary value) ships at week 1 alongside the rest of the principle skills (`/pcr`, `/wip-check`, `/reuse-check`).

Until the runtime is online: the closing protocol's stewardship-review checklist item (per `protocols.md` §10) requires explicit enumeration of what was advanced, and the fresh-chat protocol does the same on the open. The mechanical enforcement is the audit; the AI surfacing is this skill.

## Anti-patterns (what this skill must NOT do)

1. **Stewardship-theater** — running the review without actually advancing or retiring items. The closing summary must list state transitions.
2. **Silent-park** — leaving a `pending-*` item past SLA without either advancing or extending `next_review_at` with a reason. Per the configured SLAs, this is a P-META-004 violation.
3. **Bulk-extend without reason** — extending every breached item's `next_review_at` by another period without a stated reason is bikeshedding the audit. Each extension must include the reason inline.

## Sources

- [Linear Triage docs](https://linear.app/docs/triage) — modern triage state-machine reference
- [Backstage Catalog lifecycle](https://backstage.io/docs/features/software-catalog/descriptor-format/) — orthogonal lifecycle field this skill respects
- See `docs/plan/pillar-0-governance/stewardship-protocol.md` for the canonical state machine + cadence definitions
