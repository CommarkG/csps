---
id: csps.intake.proactive-completion
name: external-input-proactive-completion
description: The closure forcing functions that proactively push every extracted input toward completion. SLA escalation per state, recurrence-check window (30/90 days per tier), K=2-within-90-days auto-ADR (the killer enforcer), closing-summary surfacing, fresh-chat resurfacing of stale items, weekly digest aggregation, monthly meta-loop trend audit. The mechanical answer to KM failure literature's "write-only graveyard" pattern. Pre-runtime, the AI runs these manually per `manual-protocol.md`; post-runtime, audits + cron jobs + Mastra extractor automate.
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
  - { rel: protocol, href: ./manual-protocol.md }
  - { rel: tag-status, href: ./tag-status-contract.md }
  - { rel: contexts, href: ./contexts/README.md }
  - { rel: learning-loop, href: ../pillar-0-governance/learning-loop.md }
---

# Proactive Completion — the closure forcing functions

> **Closure must be a forcing function, not a request.** — P-META-005 design principle 2 (KM failure literature antidote)

## What this file holds

The 7 mechanical forcing functions that prevent the "write-only graveyard" failure mode. Every extraction carries an SLA, a recurrence-check schedule, and gets surfaced repeatedly until it advances or closes. The user's request — *"proof of a complete pipeline of proactively pushing completion on these things"* — is answered by these 7 functions running together.

## The 9 forcing functions (F1–F7 original + F8 turn-6 research + F9 turn-10 Zero-Findings Discipline)

### F1 — SLA escalation per state (the per-state pressure)

Every extraction lives in a `pipeline_state` with an SLA. Aging items escalate:

| State | SLA | Escalation |
|---|---|---|
| `observed` (P0) | 1 hour | warn at 1h → error at 4h → critical at 24h |
| `observed` (P1) | 4 hours | warn at 4h → error at 24h → critical at 72h |
| `observed` (P2) | 24 hours | warn at 24h → error at 7d → critical at 30d |
| `observed` (P3) | 72 hours | warn at 72h → error at 14d → critical at 90d |
| `triaged` | 48 hours | warn at 48h → error at 7d → critical at 30d |
| `routed` | depends on tier | warn at 1× SLA → error at 2× → critical at 3× |
| `fixing` (P1) | 30 days | as above |
| `fixing` (P2) | 90 days | as above |
| `fixing` (P3) | 180 days | as above |
| `validated` | 30/90d recurrence-check | warn at recurrence-check date |

**Mechanical enforcement:**
- Pre-runtime: each chat-close runs `/stewardship-review` (per `protocols.md` §10) which surfaces every EXT-ID past its SLA
- Post-runtime: nightly audit `unresolved-observation-stale` + `pending-too-long` open Linear tickets at `error`+ severity

### F2 — Recurrence-check window (the post-closure trap)

When an extraction reaches `pipeline_state: closed`, a recurrence-check fires after a window:

| Tier | Window | Mechanism |
|---|---|---|
| P0/P1 (critical) | 30 days | Schedule a re-check; if same root cause appears again, auto-reopen with `parent_item_id` link |
| P2/P3 (default) | 90 days | Same |

**Why:** the KM failure literature shows ~30% of "we fixed it" closures are wrong. Recurrence-check is the structural antidote.

**Mechanical enforcement:**
- Pre-runtime: at chat-close, check the ledger for `closed` items whose `recurrence_check_at` has arrived; surface for re-verification
- Post-runtime: weekly audit `validation-without-recurrence-check` + automatic re-open on detected recurrence

### F3 — K=2-within-90-days auto-ADR (the killer enforcer)

If the same root-cause class appears in `observed` or `triaged` ≥2 times within a 90-day window, the system auto-creates an ADR for permanent fix.

**Why:** Toyota Five-Whys → A3 escalation pattern. Recurrence implies the original Five-Whys fix was insufficient or the wrong abstraction. ADR is the forcing function for permanent structural change.

**Mechanical enforcement:**
- Pre-runtime: at chat-close, the AI scans the ledger for `recurrence_count >= 2` within last 90 days; if found, drafts an ADR proposal in the closing summary; user accepts → ADR is written
- Post-runtime: weekly audit `repeat-issue-detection` auto-creates ADR draft + flags for human review

This is the structural mechanism that converts "the same gap keeps showing up" from a frustration into a permanent fix. **The single most important forcing function.**

### F4 — Closing-summary surfacing (the per-session checkpoint)

Every chat-close (per `protocols.md` §10) MUST surface:

1. Every EXT-ID processed this session (the new arrivals)
2. Every EXT-ID that transitioned states this session (the in-progress)
3. Every EXT-ID past its SLA (the escalations)
4. Every EXT-ID with recurrence-check due (the re-verifications)
5. Every K=2 detection (the auto-ADR proposals)

The user reading the closing summary IS the manual subscriber-acknowledgement. If an EXT-ID isn't surfaced, it's a P-META-005 escape — the absence is itself a signal.

**AGENTS.md hard NO #last:** *"Never end a session without surfacing every EXT-ID processed in the closing summary."*

### F5 — Fresh-chat resurfacing (the per-session restart)

Every fresh-chat open (per `protocols.md` §11) runs `/stewardship-review` AND reads the inbox `LearningLoopItem` table. The fresh-chat protocol surfaces:

1. Items in `observed` past SLA (need triage)
2. Items in `triaged` not yet `routed` past SLA (need owner assignment)
3. Items in `fixing` past SLA without `validated` (closure-theater suspects)
4. Items in `validated` whose recurrence-check is due (re-verification needed)
5. Items in `routed` matching the new session's scope (auto-considered for the work plan)

**The pattern:** items can be deferred between sessions, but they ALWAYS resurface at the next session's open. They don't go quiet.

This closes the chat-jump information-loss failure mode the user identified: *"Chat 'jumps' are where golden coins fall off pockets."* Fresh-chat resurfacing is the pocket-seal applied to in-progress extractions.

### F6 — Weekly digest aggregation (the cross-session view)

Once runtime ships (week 4), a weekly digest job aggregates:
- Open EXT-IDs by state, by tier, by domain owner
- Recently-closed EXT-IDs (validation success rate)
- Recurrence-check failures (K=1 → K=2 transitions)
- Per-domain owner SLA adherence
- Cross-cutting items spanning ≥3 leaves

The digest emails to the domain owners (and the platform owner). The point: **per-session surfacing isn't enough; some signals only emerge at the week scale.**

Pre-runtime: at every Sunday-night session close, the AI runs a manual digest (read ledger + group + summarize); writes to `_handoff/VAULT/weekly-digest-<YYYY-WW>.md`.

### F9 — Zero-Findings Discipline at every ratification (RZF + CEC — added S002 turn 10)

Per P-META-006 (umbrella) + B_RZF (defect verification) + B_CEC (complete extraction). Adopted from CSP S333 (treasure #5 EXT-20260502-005) + CSPS user-extension (S002 turn 10).

**The mechanism:**
- **RZF** fires at every artifact reaching DONE / COMPLETE / RATIFIED / VALIDATED / CLOSED. Re-run validators (mechanical / semantic / propagation / user-visible-outcome-when-applicable) until ZERO findings; emit evidence block.
- **CEC** fires at every new principle / leaf / ADR / behavioral contract / pattern / insight ratification. Distill essence in ONE sentence; walk WALK_SCOPE iteratively until ZERO new application opportunities; emit walk-trail.

**Why:** addresses AI's UNIVERSAL failure pattern (named explicitly in user S002 turn 10): "AI systems are programmed to: avoid audit and run forwards / be satisfied with partial results / declare done when not done / focus on validation of negative aspect !! and ignore Complete extraction." RZF catches the first three; CEC catches the fourth.

**Anti-patterns this resists:** the 14 cataloged in `pillar-0-governance/zero-findings-discipline.md` § "Anti-patterns this discipline resists" — including the dominant failure pattern "AI-default moving-on" which is specifically what CEC mechanically counteracts.

**Pre-runtime:** AI applies manually per `zero-findings-discipline.md` cycle structure + emits evidence-block / walk-trail in closing summary.
**Post-runtime (week 4+):** PostStop hook auto-fires; `rzf-coverage` + `cec-walk-trail-completeness` audits PR-block missing evidence; `/rzf-cycle` + `/cec-walk` skills orchestrate.

### F8 — Weekly Discovery-queue review (the schema-gap forcing function — added v1.0+research)

Per S002-turn-6 research stream 5 (the no-predefined-path handling deep dive), Discovery / Unrouted lanes become graveyards without a **scheduled review with required decision per cluster**.

The mechanism:
- Every Sunday-night (manual pre-runtime; cron post-runtime) the schema-gap registry (`_intake/contexts/governance/learning-loop/_schema-gap-registry.md`) is reviewed.
- For each cluster (group of EXT-IDs with the same proposed_leaf_name), the user MUST make one of three decisions:
  - **Promote** — accept the proposed leaf; create ADR + leaf doc + `contexts/<pillar>/<leaf>/` folder; re-route originating EXT-IDs.
  - **Merge** — proposed leaf collapses into an existing leaf; mark cluster `superseded` with link.
  - **Reject** — cluster's content not load-bearing for the schema; mark `deprecated` with reason; archive.
- "No decision this week" is itself a state — but if a cluster sits at `observed` with K≥2 for >2 weeks without decision, it auto-escalates to `error` severity.

**Anti-pattern this resists:** "Discovery queue = new graveyard." Without a forcing-function review, the discovery channel becomes the same write-only graveyard P-META-005 was designed to prevent. F8 is the discovery-channel-specific forcing function.

**Pre-runtime:** AI runs review at every Sunday-night chat-close as part of weekly digest (F6).
**Post-runtime:** weekly cron + admin dashboard `/admin/intake/schema-gaps` page (per `dashboard-plan.md`).

### F7 — Monthly meta-loop trend audit (the "is the loop itself working" check)

Once runtime ships, a monthly meta-loop audit (`meta-loop-audit` per `learning-loop.md`) tracks:
- Resolution-cycle-time trend over 90-day rolling window
- Root-cause diversity (is the same class consuming all closures?)
- AI-vs-human disagreement rate (are extractions calibrated?)
- Throughput trend (is the loop draining or accumulating?)

If cycle time degrades >20% over the window, an ADR is auto-filed for the loop's configuration (this is the **meta-meta-loop** — Toyota's "coaching kata" pattern: when the kata stops producing improvements, the kata itself needs intervention).

Pre-runtime: monthly review at the user's request; produces a `monthly-meta-loop-S<NNN>.md` doc.

## How the 7 functions chain (the proactive cascade)

```
input arrives
   │
   ▼
F1 SLA starts ticking (state-aware pressure)
   │
   ▼
F4 surfaced in closing summary (user sees it this session)
   │
   ▼
F5 resurfaced in next fresh-chat (user sees it next session, IF unresolved)
   │
   ▼
[loop F1+F4+F5 until extraction reaches `closed`]
   │
   ▼
F2 recurrence-check schedules at closure (30/90-day trap)
   │
   ▼
[F2 fires; if recurrence detected → reopen + increment recurrence_count]
   │
   ▼
F3 K=2-within-90d → auto-ADR drafted (permanent fix forcing function)
   │
   ▼
F6 weekly digest captures throughput + SLA adherence
   │
   ▼
F7 monthly meta-loop trend → if degrading, ADR for loop config itself
```

**At every loop iteration, there's a forcing function.** No place where an extraction can quietly disappear.

## Anti-patterns these forcing functions resist

1. **Knowledge graveyard** — write-only insight capture; the dominant KM failure mode. Antidote: F1+F4+F5 keep items surfaced; F2+F3 catch closure-theater.
2. **Closure-theater** — items marked closed but not actually fixed. Antidote: F2 recurrence-check + audit `fix-without-validation`.
3. **Silent-park** — items abandoned without explicit reason. Antidote: F4 closing summary REQUIRES every transition to be visible; AGENTS.md hard NO bans silent-park.
4. **Same-issue-keeps-recurring** — gap appears repeatedly without permanent fix. Antidote: F3 K=2 auto-ADR.
5. **Loop-fatigue** — too many items, signal-to-noise drops. Antidote: confidence-band gating in extraction (per learning-loop.md); only ≥0.90 auto-routes; 0.75–0.90 needs review; <0.75 discarded with metric capture.
6. **Loop degrading silently** — cycle time grows monotonically. Antidote: F7 meta-loop trend audit.

## Pre-runtime vs post-runtime split

| Function | Pre-runtime (manual) | Post-runtime (automated, week 4–6) |
|---|---|---|
| F1 SLA | AI runs `/stewardship-review` at chat-close, computes ages, surfaces breaches | Nightly audit `unresolved-observation-stale` + `pending-too-long` |
| F2 recurrence-check | AI scans ledger at chat-close for `closed` items past `recurrence_check_at` | Weekly audit `validation-without-recurrence-check` |
| F3 K=2 auto-ADR | AI scans ledger for `recurrence_count >= 2` within 90d at chat-close; drafts ADR proposal | Weekly audit `repeat-issue-detection` auto-creates ADR draft |
| F4 closing-summary | AGENTS.md hard NO; AI surfaces all EXT-IDs in closing summary | Same hard NO; PostStop hook auto-fires extraction surfacing |
| F5 fresh-chat resurface | `protocols.md` §11 step 7+8 (read inbox + run review) | Same protocol; runtime queries `LearningLoopItem` table |
| F6 weekly digest | AI runs Sunday-night digest manually | Weekly cron job |
| F7 monthly meta-loop | User-requested manual review | Monthly audit `meta-loop-audit` |

**The point:** every forcing function has a pre-runtime manual mode AND a post-runtime automated mode. Continuity is preserved across the runtime-ship boundary; the migration is a one-shot port of ledger entries into the runtime tables (per `tools/intake/migrate-manual-ledger.ts` planned week 6).

## Cross-references

- [manual-protocol.md](./manual-protocol.md) — the per-upload protocol
- [tag-status-contract.md](./tag-status-contract.md) — the tag + status state machines
- [contexts/README.md](./contexts/README.md) — the fan-out destinations
- [walkthrough-example.md](./walkthrough-example.md) — proof-of-pipeline (these 7 functions in action)
- [../pillar-0-governance/learning-loop.md](../pillar-0-governance/learning-loop.md) — the principle these functions enforce
