---
id: csps.handoff.vault.open-questions-ledger
name: handoff-vault-open-questions-ledger
description: Tracked ledger of every Open Question harvested from CSPS leaf docs. Each question is an individually trackable LearningLoopItem-equivalent — `lifecycle_state: pending-review`, `next_review_at: 2026-08-01` (90 days from session of harvest, S002 @ 2026-05-02). When a question is answered, mark resolved and link to the resolution (ADR / leaf doc edit / runtime config). Backfill executed in S002 per P-META-004 step 7.
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
  - { rel: stewardship, href: ../../pillar-0-governance/stewardship-protocol.md }
domain_path: platform
---

# Open Questions Ledger

> **Saved-without-trigger = orphan-in-waiting.** — P-META-004

## What this file holds

Every "Open Questions" entry from every CSPS leaf doc, extracted into individually-trackable items. Each carries `lifecycle_state: pending-review` and `next_review_at: 2026-08-01` (90 days from S002 session date 2026-05-02). When answered, mark `resolved` and link to the resolution.

This is the P-META-004 backfill of pre-existing open questions: per the handoff, "All 'Open questions' sections in leaf docs become individually trackable items with `lifecycle_state: pending-review` and a `next_review_at`."

## Ledger entries

### From `pillar-0/operating-principles.md`

| ID | Question | next_review_at | State | Notes |
|---|---|---|---|---|
| OQ-OP-001 | PCR scope boundary — when is a decision "trivial enough" to skip PCR? Currently judgment-call; may need a heuristic (e.g., "if reversal cost < 5 minutes, skip PCR"). | 2026-08-01 | pending-review | Tied to P-OP-003. May produce ADR if heuristic locks. |
| OQ-OP-002 | FWWS WIP threshold — defaults are 3 slices / 2 apps. May need tuning based on actual flow rate. Add audit metric: "average completion time per WIP-cap-bypass." | 2026-08-01 | pending-review | Tied to P-OP-002 config. |
| OQ-OP-003 | Batched-execution failure mode — what if user wants per-item review for a SPECIFIC batch (e.g., security-sensitive migrations)? Escape: user pre-emptively requests "per-item mode" before batch starts; AI honors and offers per-item approvals. | 2026-08-01 | pending-review | Tentative answer in question; verify via use. |
| OQ-OP-004 | Acronym memorability — FWWS, PCR are user's coinages; "batched execution" has no acronym. BAE / ACBE were rejected. Watching whether users want a 3-letter shorthand. | 2026-08-01 | pending-review | Low priority; monitor only. |

### From `pillar-0/reuse-first-principle.md`

| ID | Question | next_review_at | State | Notes |
|---|---|---|---|---|
| OQ-RF-001 | Where does "always reuse" conflict with extraction-readiness? CSPS apps must be extractable; hard reuse of platform internals defeats this. Resolution sketch: distinguish `packages/*` (public, extractable) from `libs/*/internal/**` (internal, must inline at extraction). | 2026-08-01 | pending-review | Resolution sketch present; needs ADR to lock. |
| OQ-RF-002 | Goodhart's Law on reuse rate — if measure %-enhanced, devs pad `enhances:` to game it. Mitigation: don't gate on the metric; sample-audit `enhances:` justifications quarterly; track *trend*, not absolute level. | 2026-08-01 | pending-review | Mitigation sketch present; verify in practice. |
| OQ-RF-003 | Solo-dev Conway risk — one person *is* the org. Conway's Law applies through *time*. Slice boundaries should reflect bounded contexts the user actually maintains in their head, not aspirational team boundaries. | 2026-08-01 | pending-review | Cultural; no mechanical fix. |
| OQ-RF-004 | The principle's own failure mode — "always enhance" → "never refactor wrong abstractions" → Metz-style debt. The counterweight clause is the antidote; quote it as often as the main principle. | 2026-08-01 | pending-review | Awareness item; verify counterweight visibility in audits. |

### From `pillar-0/rule-registry.md`

| ID | Question | next_review_at | State | Notes |
|---|---|---|---|---|
| OQ-RR-001 | Granularity — does "use Zod for request bodies" become 1 rule or 1-per-route? Tentative answer: 1 rule + N route-level enforcer instances. | 2026-08-01 | pending-review | Tentative answer present. |
| OQ-RR-002 | Cross-stack rules — a rule that spans both code (ESLint) and data (ZenStack `@@allow`) declares multiple enforcers. Audit aggregates pass/fail; rule fails if any enforcer fails. | 2026-08-01 | pending-review | Tentative answer present. |
| OQ-RR-003 | AI-proposed vs human-written rules — add `proposed_by: ai \| human` to frontmatter. AI-proposed rules require label `human-reviewed` on PR before merge. | 2026-08-01 | pending-review | Resolution sketched; ADR-pending. |
| OQ-RR-004 | ZenStack vs Cerbos (long-term) — ZenStack handles all data-layer authz today. Heuristic for adding Cerbos: needs `prisma`'s query context → ZenStack; stateless yes/no on principal+resource+action with no DB shape → Cerbos. | 2026-08-01 | pending-review | Heuristic present; lock via ADR if Cerbos joins stack. |

### From `pillar-0/adr-process.md`

| ID | Question | next_review_at | State | Notes |
|---|---|---|---|---|
| OQ-ADR-001 | Granularity — when does a small decision deserve an ADR vs. a code comment? Heuristic: if reversal would require touching ≥3 files OR an existing ADR, write an ADR. | 2026-08-01 | pending-review | Heuristic present. |
| OQ-ADR-002 | Lifespan — ADRs are immutable once accepted (only superseded). "Open questions" section can be appended to. Consensus: appending to "Open questions" is allowed; everything else requires a new ADR. | 2026-08-01 | pending-review | Tentative answer present. |
| OQ-ADR-003 | AI vs human authorship — AI-drafted ADRs require human acceptance before status moves from `proposed` to `accepted`. Add `drafted_by: ai \| human` field. | 2026-08-01 | pending-review | Resolution sketched. |

### From `pillar-0/stewardship-protocol.md` (S002 introduction)

| ID | Question | next_review_at | State | Notes |
|---|---|---|---|---|
| OQ-STEW-001 | Should `lifecycle_state` be inheritable via `tools/catalog/variants.ts` cascade so per-glob defaults reduce per-file declaration burden? Tentative: yes. | 2026-08-01 | pending-review | |
| OQ-STEW-002 | Are 14/30/90-day SLAs the right defaults, or should they tier with severity (`critical` artifacts get 7/14/30)? | 2026-08-01 | pending-review | |
| OQ-STEW-003 | Should the `promoted` state require a co-signed approver field (not just `owner:`) to make promotion auditable as a 4-eyes step? | 2026-08-01 | pending-review | |
| OQ-STEW-004 | When a leaf doc is in `pending-review` but its principle is `active`, what's the consumer's authoritative source — the principle or the doc? Tentative: principles.yaml is always authoritative; the doc is narrative. | 2026-08-01 | pending-review | |

### From `pillar-0/learning-loop.md` (S002 introduction)

| ID | Question | next_review_at | State | Notes |
|---|---|---|---|---|
| OQ-LL-001 | Should the human-review-band SLA be tighter than auto-accept SLA? (Linear: same tier; Toyota: tighter for boundary cases) | 2026-08-01 | pending-review | |
| OQ-LL-002 | When a `closed` item's recurrence-check fires and detects recurrence, should auto-reopen carry priority-tier from original or be re-tiered? Tentative: re-tiered (recurrence implies original tier was wrong). | 2026-08-01 | pending-review | |
| OQ-LL-003 | Should `near-miss` source items have a different default confidence threshold than `ai-extraction` items? Tentative: near-miss is human-reported; treat as ≥0.90 by default. | 2026-08-01 | pending-review | |
| OQ-LL-004 | For meta-loop-audit, should trigger be cycle-time degradation OR root-cause-diversity collapse, or both? Tentative: both — either signal alone fires the ADR. | 2026-08-01 | pending-review | |

### From `principles.yaml` open_questions section

| ID | Question | next_review_at | State | Notes |
|---|---|---|---|---|
| OQ-PRIN-001 | Should principles.yaml be split into per-category files (operating.yaml, architecture.yaml, meta.yaml) once it grows past ~500 lines? | 2026-08-01 | pending-review | File now ~830 lines after S002 additions; threshold approached. |
| OQ-PRIN-002 | How do we version individual principles (semver on principle level vs registry level)? | 2026-08-01 | pending-review | |
| OQ-PRIN-003 | When a principle is deprecated, do its enforcers get a grace period or are they removed atomically? | 2026-08-01 | pending-review | |
| OQ-PRIN-004 | Should AI-proposed principles (drafted by Claude) require human review before merge? Recommend yes — add `proposed_by: ai \| human` field on next iteration. | 2026-08-01 | pending-review | Resolution sketched; align with OQ-ADR-003 + OQ-RR-003 (same pattern). |

## Summary counts (S002 close)

| State | Count |
|---|---|
| `pending-review` | 22 |
| `resolved` | 0 |
| `deprecated` | 0 |
| **Total tracked** | **22** |

## How to use this ledger

### When answering a question

1. Find the OQ-ID. Mark its row `state: resolved`.
2. Add `Notes`: link to the resolution (ADR / leaf-doc edit / config change / discussion thread).
3. If the answer is locked-in, write/update the corresponding ADR.

### When extending a review

If a question's `next_review_at` arrives without an answer:
- Verify it's still load-bearing (not stale).
- Extend by another 90 days with a stated reason in the Notes column.
- Never silently extend without reason (that's stewardship-theater per P-META-004 anti-pattern).

### When marking deprecated

Some questions become irrelevant — superseded by an architectural shift, or the underlying decision was made elsewhere. Mark `state: deprecated` with a Notes link to the superseding decision. Audits skip `deprecated` items.

### When promoting

If a question's resolution gets ratified into an ADR or canonical leaf-doc edit, mark `state: resolved` AND link the ratified artifact in Notes. The question may remain valuable as historical context — keep the row, just transition state.

## Why this ledger exists (not embedded in leaf docs)

Per P-META-004 backfill in S002: embedding open questions inline in leaf docs leaves them as orphan-in-waiting (no recurring trigger advances them). Pulling them into a dedicated ledger gives:

1. **Single triage queue** — `/stewardship-review` surfaces all `pending-review` items at session-start, not requiring a recursive walk of every leaf doc.
2. **SLA enforcement** — the `stale-pending-review` audit operates on this ledger directly.
3. **Cross-document patterns visible** — questions like OQ-RR-003, OQ-ADR-003, OQ-PRIN-004 all sketch the same `proposed_by: ai|human` pattern. Centralized ledger surfaces the pattern; embedded questions hide it.
4. **Resolution provenance** — when a question is resolved, the ledger row is the canonical record of resolution, linkable from the originating leaf doc.

The leaf docs themselves can keep brief "Open questions" sections that link to this ledger by OQ-ID rather than restating each question.
