---
name: wip-check
description: Query in-flight work ledger; report threshold status. Triggers on "should we start X?", "ready for new work?", "WIP status", or before starting any new slice / app / pillar. Per P-OP-002 (FWWS — Finish What We Started), surfaces in-flight count vs threshold (default 3 slices, 2 apps).
allowed_tools: [Read, Grep, Glob]
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: [read]
sensitive_data_access: false
backed_by_principle: P-OP-002
generated_by: principles-codegen
generated_from: packages/principles/principles.yaml#P-OP-002
last_generated_at: 2026-05-03T08:30:00Z
references_future_artifact: true
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
---

# /wip-check — Finish What We Started threshold gate

## When to invoke

Before starting any new substantive work:
- New slice / app / feature pack
- New pillar leaf migration
- New ADR draft
- New persona / agent / wizard
- New refactor / restructuring effort

## When to skip

- Bug fixes (don't count as new WIP — they finish existing work)
- Documentation updates (not new substantive work)
- Configuration changes (no in-flight tracking needed)
- Inside an approved batch (per P-OP-004 — batched execution skip-clause)

## Procedure

1. **Query in-flight ledger** — read `_handoff/VAULT/pending-work.md` + grep for `lifecycle_state: pending-review` and `lifecycle_state: pending-protocol` artifacts
2. **Count by category:**
   - In-flight slices (slices not at 100% scorecard)
   - In-flight apps (apps not yet shipped)
   - In-flight pillar migrations (leaves at 🟡 to migrate)
   - In-flight ADRs (draft state)
3. **Compare to thresholds:**
   - Default: 3 slices, 2 apps, 5 pillar leaves, 3 ADRs
   - User may override per session via explicit reason
4. **Emit report**

## Output format

```markdown
## WIP threshold report

| Category | In-flight | Threshold | Status |
|---|---|---|---|
| Slices | <N> | 3 | ✅ within / ⚠️ at / ❌ exceeded |
| Apps | <N> | 2 | ✅ / ⚠️ / ❌ |
| Pillar migrations | <N> | 5 | ✅ / ⚠️ / ❌ |
| ADRs | <N> | 3 | ✅ / ⚠️ / ❌ |

**FWWS verdict:** [✅ proceed / ⚠️ approaching threshold / ❌ blocked — finish or park first]

**Items currently in-flight:**
- <list with EXT-ID / ADR-ID / slice-name>

**If threshold exceeded:** explicit park decision required. Per FWWS counterweight: parking is allowed with stated reason; silent-drop is NOT.
```

## Discipline rules

1. **Threshold is a soft-cap, not a hard wall** — exceeding it is a signal, not a blocker
2. **Parking requires reason** — "I'm parking slice X because Y" is OK; silently dropping is the failure mode
3. **WIP for AI assistant ≠ WIP for human** — count only items the user is actively tracking, not every-file-in-progress
4. **The in-flight ledger IS the source of truth** — don't infer in-flight state from chat context

## Industry lineage

- Lean / Kanban WIP limits (cap-and-finish pattern)
- David Allen's GTD (Getting Things Done — open-loops as cognitive load)
- US military Mission Command — disciplined initiative within commander's intent

## Backed by

P-OP-002 (FWWS — Finish What We Started). Full text in [packages/principles/principles.yaml#P-OP-002](../../principles/principles.yaml).
