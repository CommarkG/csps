---
id: csps.governance.learning-loop
name: learning-loop
description: P-META-005 Learning Loop — every input stream (chat conversations, error logs, audit failures, user feedback, AI-extracted insights, near-misses) is routed through a single observed → triaged → routed → fixing → validated → closed pipeline. Inputs that escape the loop trigger a self-healing audit that identifies the gap, applies a permanent control, and validates the gap is closed. Saving is not the goal; permanent system improvement is. Calibration is research-backed (Google SRE, Toyota Kata, OODA, Linear Triage, OTel GenAI conventions, RLHF, KM failure literature).
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
  - ai-native
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ./reuse-first-principle.md }
  - { rel: enforcement-architecture, href: ./mechanical-enforcement.md }
  - { rel: registry, href: ../../../packages/principles/principles.yaml }
  - { rel: stewardship, href: ./stewardship-protocol.md }
  - { rel: audit-runner, href: ./audit-runner.md }
domain_path: platform
---

# Learning Loop — P-META-005 (Closed-Loop System Improvement)

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The single intake pipeline that routes every input stream into CSPS through `observed → triaged → routed → fixing → validated → closed`, the calibration knobs (SLAs, confidence bands, recurrence windows, auto-ADR thresholds), the six enforcing audits, the `LearningLoopItem` Foundation slice, the extraction skill + PostStop hook, and the meta-loop that watches the loop itself.

## Why this exists (the gap S001 identified)

The Stewardship Protocol (P-META-004) handles "things that **are** saved." But it doesn't handle the more dangerous failure mode: **things that should be saved but might not be.**

- A user surfaces a near-miss in chat — does anything route it?
- An audit fails three times before someone notices the same root cause — what makes the system itself learn?
- An AI extracts an insight from a session — what stops it from disappearing into a write-only graveyard?
- A `// TODO` is left behind — what makes sure it actually gets done?
- A hook fails silently — what bridges the gap between "logged" and "fixed"?

Without a closed-loop pipeline with forcing-function closure, every captured input becomes Confluence-rot: saved-but-unread. The KM failure literature is unusually consistent across two decades on this — without closure incentives and instrumentation, capture systems decay within ~6 months.

The user's framing:

> *"Every INPUT either has a place to be and a predefined process to follow OR the system alerts itself to solve one."*

Learning Loop is that "the system alerts itself to solve one." It's the recursive application: when an input has no defined process, the system notices the gap and creates one (auto-ADR at K=2 within 90 days).

## Canonical wording (the principle, save verbatim)

> **Learning Loop**: every input stream into CSPS — chat conversations, error logs, audit failures, user feedback, AI-extracted insights, near-misses — is routed through a single intake → triage → routing → permanent-fix → validation pipeline. Inputs that escape the loop trigger a self-healing audit that identifies the gap, applies a permanent control, and validates the gap is closed. **Saving is not the goal; permanent system improvement is.**

Source of truth: `packages/principles/principles.yaml#P-META-005`.

## Industry lineage (the calibration is borrowed, not invented)

| Domain | Pattern | What CSPS adopts |
|---|---|---|
| **OODA Loop** (John Boyd, 1976) | Observe → Orient → Decide → Act; tempo as competitive advantage | The 6-state pipeline (observed/triaged/routed/fixing/validated/closed) is OODA + validation + recurrence |
| **Google SRE** (postmortem culture, action-item SLOs, FixIt weeks) | Action items must be specific, owned, due-dated; SLOs feed backlog; "if a single class of outage consumes >20% of error budget over a quarter, the team must have a P0 item on quarterly planning" | The 30/60/90-day recurrence-check cadence; the 20%-degradation auto-ADR trigger; the meta-loop pattern |
| **Toyota Kata + Five Whys** (Mike Rother, 2009) | Daily improvement cadence; Five Whys → A3 escalation when problem cross-functional or recurring; **K=2 → escalate** | The K=2-within-90-days auto-ADR threshold; the cycle-time trend as kata-health signal |
| **Lean / Kaizen** | Continuous improvement as built-in process, not project | The pipeline lives inside the platform; not a separate "improvement initiative" |
| **DORA / DevOps Research** | Change failure rate, MTTR, lead time, deployment frequency as the four meta-metrics | The four pipeline metrics CSPS tracks: throughput, cycle time, reopen rate, recurrence rate |
| **Linear Triage** (Triage Intelligence, 2025) | Auto-routing achieves ~90% accuracy with historical labels; SLA-as-trigger; priority-out-of-submitter's-hands | The 24h triage SLA, P0/P1/P2/P3 tier conventions, AI-suggested + human-confirmed routing |
| **OpenTelemetry GenAI** (semantic conventions) | `gen_ai.evaluation.result` event for AI-extracted insight provenance; `gen_ai.request.model` for reproducibility | Every AI-extracted observation attaches an OTel evaluation event; lineage from model call → evaluation → insight is mandatory |
| **RLHF / Active Learning** | Three-band confidence gate (auto-accept ≥0.90, review 0.75–0.90, discard <0.75); target 1–5% in human review band | The exact thresholds in CSPS; capture human-override as RLHF signal back to threshold tuning |
| **KM failure literature** (Nick Milton 7 failure modes; Mark Burgess "Failure of KM"; Confluence-rot case studies) | Antidote: capture-in-flow + pull-based discovery + visible feedback loops + forcing-function closure | The four design principles: capture in flow, pull-based discovery at observe-time, visible meta-loop telemetry, K=2 → ADR forcing function |
| **ADR culture** ([adr.github.io](https://adr.github.io/)) | ADRs survive where wikis die because they're enforced at code review | K=2-within-90d → auto-ADR; ADR is the forcing function for permanent fixes |

## The 6-state pipeline

| State | Meaning | Trigger to advance | Allowed transitions |
|---|---|---|---|
| `observed` | Input captured (chat/log/audit/feedback/AI extraction/near-miss). Not yet validated as actionable. | Triage SLA based on priority tier (P0:1h, P1:4h, P2:24h, P3:72h) | → `triaged` (kept) → `closed` (auto-discard below confidence threshold) |
| `triaged` | Confirmed actionable. Priority assigned. Owner candidate identified. | 48h to route | → `routed` → `closed` (duplicate or dismissed with reason) |
| `routed` | Owner accepted; routed to specific fix workstream (slice / ADR / skill / generator / etc.). | SLA depends on fix scope | → `fixing` → `closed` (won't-fix with reason) |
| `fixing` | Permanent fix in progress. P1: 30d, P2: 90d, P3: 180d. | Fix shipped + validated | → `validated` → `closed` (abandoned; rare, requires reason) |
| `validated` | Fix shipped + verified. Awaiting recurrence-check window. | 30d (critical) or 90d (default) recurrence check | → `closed` (no recurrence) → `fixing` (re-opened; validation failed) |
| `closed` | Permanently resolved; recurrence window passed without re-occurrence. | None (terminal) | → `observed` (re-opened by recurrence-check trigger if same gap reappears) |

### State transition diagram

```
              ┌──────────┐
              │ observed │  ← input from chat/log/audit/feedback/AI/near-miss
              └────┬─────┘
                   │
            ┌──────┴──────┐
            ▼ (kept)      ▼ (auto-discard, below confidence)
        ┌─────────┐   ┌────────┐
        │ triaged │   │ closed │
        └────┬────┘   └────────┘
             │
       ┌─────┴─────┐
       ▼ (route)   ▼ (duplicate/dismissed)
   ┌────────┐   ┌────────┐
   │ routed │   │ closed │
   └───┬────┘   └────────┘
       │
   ┌───┴───┐
   ▼       ▼ (won't-fix)
┌────────┐ ┌────────┐
│ fixing │ │ closed │
└───┬────┘ └────────┘
    │
┌───┴───┐
▼       ▼ (abandoned)
┌──────────┐  ┌────────┐
│ validated│  │ closed │
└────┬─────┘  └────────┘
     │
     ├── recurrence-check fails → fixing  (re-opened)
     └── recurrence-check passes → closed (terminal*)

closed ──── recurrence detected (K=2/90d) ──→ observed (auto-reopen + auto-ADR)
```

*Terminal until recurrence-check trigger fires.

## Calibration knobs (research-backed)

All numbers live in `packages/principles/principles.yaml#P-META-005.config` and can be tuned without doc changes. The defaults below are sourced from at least two independent industry references each.

### SLAs per state

| Path | SLA | Reasoning |
|---|---|---|
| `observed → triaged` (P0) | 1 hour | Linear/Jira P0 convention; incident.io SRE guidance |
| `observed → triaged` (P1) | 4 hours | Linear/Jira P1; Rootly support-level guide |
| `observed → triaged` (P2) | 24 hours | Industry default; Techmonarch tier guide |
| `observed → triaged` (P3) | 72 hours | Long-tail; auto-close acceptable at 14d |
| `triaged → routed` | 48 hours | Triage Intelligence ~90% routing accuracy; SLA is for the 10% needing human override |
| `fixing` (P1) | 30 days | Google SRE high-priority target ("80%+ closed within 30 days") |
| `fixing` (P2) | 90 days | Industry-standard 30/60/90 cadence |
| `fixing` (P3) | 180 days | Below this cap, evidence shows close rate <40% |

### AI-confidence gate (three bands, RLHF-pattern)

| Band | Threshold | Action |
|---|---|---|
| Auto-accept | confidence ≥ 0.90 | Item enters `triaged` directly; no human review |
| Human review | 0.75 ≤ confidence < 0.90 | Item routes to review queue; humans label/correct; corrections feed back as RLHF signal |
| Discard | confidence < 0.75 | Item logged for extraction-precision metrics, not added to pipeline |

**Operating-point target:** 1–5% of AI-extracted items land in the human-review band. Outside this range, the system is mis-calibrated:
- Below 1% → threshold too lax; false positives leaking through to auto-accept
- Above 5% → model too uncertain or threshold too aggressive; review fatigue grows

The threshold values are **per-evaluator** (extraction-confidence, hallucination-check, sentiment, etc.) — there isn't one global confidence threshold. Per OTel GenAI conventions, each evaluator name gets its own threshold registry entry.

### Recurrence checks

| Tier | Window | Mechanism |
|---|---|---|
| Critical (P0/P1) | 30 days | After `validated → closed`, schedule a check at +30d; if same gap reappears, auto-reopen |
| Default (P2/P3) | 90 days | Standard recurrence window |

### Repeat-issue auto-ADR threshold

| Trigger | Threshold | Action |
|---|---|---|
| Same root-cause class in ≥K sessions within W days | **K=2, W=90** | Auto-create ADR for permanent fix (the killer enforcer) |
| Lifetime threshold (slow-burn) | **K=3 over lifetime** | Catches recurrences spanning multiple windows |

This is Toyota's documented Five-Whys → A3 escalation pattern, and Google SRE's 30/60/90 follow-up cadence converging on the same number.

### Meta-loop trend window

| Knob | Default | Reasoning |
|---|---|---|
| Trend window | 90 days rolling | Standard rolling-window for engineering-metric regression detection |
| Evaluation cadence | weekly | Matches DORA/SRE review cadences |
| ADR-trigger degradation | >20% cycle-time degradation over the window | If the loop's resolution speed degrades by 20%, the loop's configuration becomes the next ADR |

## The 6 enforcing audits

Per [audit-runner.md](./audit-runner.md) under the Learning Loop category. Each registered as an enforcer of P-META-005.

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `learning-loop-coverage` | per-session | warn | Every session produced ≥1 extracted item OR explicitly marked "no insights" with justification |
| `repeat-issue-detection` | weekly | error | Same gap appearing in ≥2 sessions within 90d auto-creates ADR (the K=2/90d threshold) |
| `unresolved-observation-stale` | nightly | warn | Items in `observed` past their priority-tier SLA escalate |
| `fix-without-validation` | nightly | error | Items in `fixing` past SLA without `validated` flagged (prevents closure-theater) |
| `validation-without-recurrence-check` | weekly | warn | `closed` items get a 30/90d recurrence check based on tier; reopen on recurrence |
| `meta-loop-audit` | monthly | warn | Resolution-cycle-time trend over 90-day rolling; >20% degradation files an ADR |

## The `LearningLoopItem` Foundation slice

Lives at `libs/policies/slices/public/learning-loop-item.zmodel`. The schema is the pipeline state machine.

```prisma
model LearningLoopItem extends Base {
  source              String                   // "chat" | "audit" | "error-log" | "feedback" | "near-miss" | "ai-extraction"
  source_ref          String?                  // session-id, audit-run-id, error-id, feedback-id
  summary             String                   // ≤512 chars
  evidence            Json                     // structured detail; for AI-extraction includes OTel gen_ai.evaluation.result event
  pipeline_state      String                   // observed | triaged | routed | fixing | validated | closed
  priority_tier       String                   // P0 | P1 | P2 | P3
  confidence          Float?                   // 0..1; only present for AI-extracted items
  evaluator_name      String?                  // OTel evaluator name (e.g., "extraction_confidence")
  owner               String?                  // group:<handle> | user:<handle>; null when in `observed`
  sla_minutes         Int?                     // computed per state + tier
  state_transitioned_at DateTime              // last transition; drives SLA computation
  routed_to           String?                  // slice / ADR / skill / generator slug the fix targets
  fixing_pr_url       String?                  // PR implementing the fix
  validated_at        DateTime?
  recurrence_check_at DateTime?               // scheduled recurrence check
  recurrence_count    Int       @default(0)   // increments on auto-reopen
  permanent_fix_ref   String?                  // link to ratified ADR or merged PR
  closed_reason       String?                  // when state == closed: "fixed" | "duplicate" | "won't-fix" | "auto-discard" | "abandoned"
  parent_item_id      String?                  // for recurrence-reopened items, points to the original

  @@schema("public")
  @@allow('read', auth().staffRole != null)
  @@deny('update', state_transitioned_at != null && /* attempt to skip a state */)
}

// Enforces ledger:
// observed → triaged | closed
// triaged → routed | closed
// routed → fixing | closed
// fixing → validated | closed
// validated → closed | fixing
// closed → observed (only via recurrence-check trigger)
```

## The extraction skill + PostStop hook

### `/learning-loop-extract` skill

Lives at `packages/skills/learning-loop-extract/SKILL.md`. Mastra skill that:

1. Receives session log (chat transcript, audit run output, error log)
2. Calls extraction LLM with prompt: *"Identify insights, errors, gaps, decisions, near-misses in this session. For each, extract: source, summary, evidence, suggested priority_tier, confidence."*
3. For each candidate:
   - confidence ≥ 0.90 → INSERT LearningLoopItem with `pipeline_state: triaged` (auto-accept)
   - 0.75 ≤ confidence < 0.90 → INSERT with `pipeline_state: observed` + flag for human review
   - confidence < 0.75 → log to extraction-precision metrics; do NOT add to pipeline
4. Attaches OTel `gen_ai.evaluation.result` event with `gen_ai.request.model`, `gen_ai.response.id`, `gen_ai.evaluation.score.value`, `gen_ai.evaluation.explanation`

### PostStop hook

Lives at `.claude/hooks/post-stop-learning-loop.sh`. Auto-triggers the extractor at session end. Captures session transcript, calls `/learning-loop-extract`, reports count of items routed.

The hook is the **mechanical guarantor**: an AI assistant cannot end a session without the extractor running. The `learning-loop-coverage` audit asserts ≥1 item per session OR explicit "no insights, reason: <X>" in the closing summary.

## Workflows

### At session start (per `protocols.md` §11)

1. Read latest handoff + run `/stewardship-review`.
2. **Read inbox** `LearningLoopItem` table — items in `observed` or `triaged` may need attention this session.
3. Items in `observed` past their priority-tier SLA route to top-of-mind for triage.
4. Items in `routed` matching the session's scope (e.g., editing pillar-3 → check for routed items targeting pillar-3) get auto-considered for the work plan.

### At session close (per `protocols.md` §10)

1. Run `/stewardship-review`.
2. **Run `/learning-loop-extract` on the session transcript** — capture insights, errors, gaps, decisions.
3. Verify ≥1 item routed OR explicitly mark "no insights" with reason in closing summary.
4. PostStop hook ensures step 2 fires even if AI forgets.

### On every PR

1. PRs that close items reference `closed_reason`; auto-validates against allowed enum.
2. PRs that promote a recurring observation to ADR auto-link the originating LearningLoopItems via `permanent_fix_ref`.
3. The `repeat-issue-detection` audit runs weekly; PRs cannot land if they would close an item flagged for K=2 ADR creation without the corresponding ADR.

### Nightly + weekly + monthly automated audits

Per the cadence column in the audits table above. Severity routing follows the standard `audit-runner.md` model.

## The 5 design principles (synthesized from research)

These are CSPS-level synthesis — they constrain how the loop is built and how it must NOT be built.

1. **Tempo over completeness.** A 24-hour triage SLA with 80% routing accuracy beats a 7-day SLA with 95% accuracy. Boyd's OODA: speed of the cycle matters more than perfection of any individual step.

2. **Closure must be a forcing function, not a request.** Below 50% close rate, the loop becomes theater. Implement: SLA-breach triggers auto-escalation; 30/60/90-day recurrence checks auto-reopen; K=2-within-90d auto-promotes to ADR (which is itself enforced at code review).

3. **Confidence-banded automation, not binary thresholds.** Auto-accept ≥0.90, human-review 0.75–0.90, discard <0.75. Target 1–5% of AI-extracted insights in the review band. Capture human overrides as RLHF signal back into per-evaluator threshold tuning.

4. **Capture in flow, surface on demand.** Never require documentation separate from work. Observations originate from chat, logs, audits, near-misses *as they happen*. At observation time, auto-surface related prior items and their resolutions — pull-based discovery is the anti-graveyard pattern.

5. **The meta-loop watches the loop.** Track resolution-cycle-time trend (90-day rolling, weekly evaluation), root-cause diversity, AI-vs-human disagreement rate. When the kata stops producing improvements, the kata itself needs intervention — Toyota's coaching kata pattern. >20% cycle-time degradation files an ADR for re-tuning.

## Backfill (S002 task — completed in this session)

The Stewardship Protocol gap and the Learning Loop gap themselves are the first two `LearningLoopItem`s. They are documented in `docs/plan/_handoff/VAULT/insights.md` until the runtime DB ships at week 2. Items:

| ID | Source | Summary | State | Routed-to |
|---|---|---|---|---|
| S001-LL-0001 | chat (S001 close) | "Stewardship Protocol gap — saved-without-trigger = orphan-in-waiting" | `closed` (fixed by P-META-004 in S002) | `docs/plan/pillar-0-governance/stewardship-protocol.md` + `principles.yaml#P-META-004` |
| S001-LL-0002 | chat (S001 close) | "Learning Loop gap — universal intake + closed-loop learning missing" | `closed` (fixed by P-META-005 in S002) | this doc + `principles.yaml#P-META-005` |

Going forward, every session produces ≥1 item OR explicit "no insights" with reason; the PostStop hook is the mechanical guarantor.

## Anti-patterns (what the loop resists)

1. **Knowledge-graveyard** — write-only insight capture; the dominant KM failure mode. Antidote: closure-as-forcing-function (K=2 → ADR + recurrence check).
2. **Confidence-cliff** — binary auto-accept threshold without review band; loses the RLHF signal. Antidote: three-band confidence gate.
3. **Closure-theater** — items marked closed without validation. Caught by `fix-without-validation` audit.
4. **Silent-escape** — insight observed but no one noticed. Caught by per-session coverage audit + weekly transcript rescan.
5. **Loop-fatigue** — too many low-confidence items in review queue. Calibration: target 1–5% review rate.
6. **Meta-loop-rot** — resolution-cycle-time degrades silently. Caught by `meta-loop-audit` monthly check.
7. **False-positive flood** — extraction precision degrades. Weekly extraction-precision audit + RLHF threshold tuning.
8. **Insight-without-owner** — no one accountable for routing. SLA escalation routes; orphans = routing failures.

## Why P-META-005, not P-OP-005

This is meta — about how the system **learns about itself**. Lives alongside:

- P-META-001 (defense in depth — how enforcement is layered)
- P-META-002 (principles travel with artifacts — how they propagate during graduation)
- P-META-003 (inheritance via shared runtime — how they propagate to sub-agents)
- P-META-004 (stored-content-lifecycle — how saved content stays alive)
- **P-META-005 (learning-loop — how the system learns from everything)**

The seven meta-principles together form CSPS's self-governance spine: *defense-in-depth + travels-with-artifacts + inheritance-via-shared-runtime + stewardship-of-saved-content + learning-from-everything + zero-findings-discipline (RZF + CEC) + five-surface-engraving (the meta-mechanism by which every other discipline gets engraved atomically across schema + validator + hook + memory + contract)*.

## CEC propagation events as K=2 inputs (S002 turn 10 extension)

Per P-META-006 B_CEC, every ratified artifact triggers a Complete Extraction Cycle walk. The walk surfaces "application opportunities" — places where the new artifact's essence enhances existing artifacts.

When a CEC walk surfaces the SAME application-opportunity pattern across multiple sessions, this counts as a K=N occurrence per the K=2-within-90-days threshold. If K=2 is reached, the K=2 auto-ADR mechanism fires for the meta-pattern (e.g., "the same opportunity-shape keeps emerging across N sessions — consolidate into a permanent leaf or principle").

This composition makes Learning Loop's K=2 mechanism a backstop for CEC walks: even if individual walks miss applications, the recurrence-detection across walks catches the pattern.

## Composition with B_POSITIVE_VALUE_EXTRACTION (added S005 turn 22)

Per `B_POSITIVE_VALUE_EXTRACTION` ([behavioral-contracts.md](./behavioral-contracts.md#B_POSITIVE_VALUE_EXTRACTION)) + amended P-META-006 trigger-cadence: the Learning Loop's `observed → triaged → routed → fixing → validated → closed` pipeline now ALSO fires the positive-value-extraction cycle whenever an `observed`-state input surfaces a significant insight (not just defect/gap). The two pipelines are **parallel-but-composable**:

| Trigger | Learning Loop pipeline | B_POSITIVE_VALUE_EXTRACTION cycle |
|---|---|---|
| Defect / gap / error in `observed` state | observed → triaged → routed → fixing → validated → closed (with K=2 recurrence-check) | (does NOT fire — defect-class) |
| Insight surfaced in `observed` state | observed → triaged → routed → validated (no fixing needed) → closed | **fires** — walk platform for max value extraction; emit walk-trail in closing-summary §10.11b |
| Positive event outside the standard 6-state pipeline (e.g., user directive, AI self-correction, generator output) | (not Learning Loop scope) | **fires** — same walk-trail discipline |

**Why the parity matters:** P-META-005's K=2-within-90-days mechanism applies to **defect recurrence** (K=2 same-bug → auto-ADR). The B_POSITIVE_VALUE_EXTRACTION amendment to P-META-006 means: positive-value walks ALSO trigger K=2 when the SAME opportunity-shape keeps emerging across walks → recurrence-detection promotes the pattern to ADR/principle/leaf. So K=2 mechanism now backstops BOTH defect-recurrence (Learning Loop) AND opportunity-recurrence (positive-value-extraction walks).

## Cross-references

- **Within principles.yaml**: `P-META-004` (Stewardship — sibling; handles things saved while Learning Loop handles things to-be-saved), `P-META-001` (audit-the-audits ensures Learning Loop's enforcers exist), `P-META-002` (Learning Loop travels with graduated apps), `P-OP-001` (reuse-first; Learning Loop surfaces prior items at observe-time = pull-based discovery), `P-ARCH-014` (crisis escalation as a parallel always-on pipeline; Learning Loop is its non-crisis sibling).
- **Within docs**: [stewardship-protocol.md](./stewardship-protocol.md), [audit-runner.md](./audit-runner.md), eventually `pillar-2-data-and-schema/starter-slices.md` (`LearningLoopItem` is a Foundation slice).

## Open questions (tracked separately as of S002)

Tracked in `docs/plan/_handoff/VAULT/open-questions-ledger.md` — not embedded for inline review.

- Should the human-review-band SLA be tighter than the auto-accept SLA? (Linear convention: same SLA tier; Toyota convention: tighter for boundary cases)
- When a `closed` item's recurrence-check fires and detects recurrence, should the auto-reopen carry priority-tier from the original or be re-tiered? (Tentative: re-tiered, since recurrence implies the original tier was wrong)
- Should `near-miss` source items have a different default confidence threshold than `ai-extraction` items? (Near-miss is human-reported; treat as ≥0.90 by default)
- For the meta-loop-audit, should the trigger be cycle-time degradation OR root-cause-diversity collapse, or both? (Tentative: both — either signal alone fires the ADR)

## Sources

### Google SRE / postmortem culture
- [Google SRE Book — Postmortem Culture](https://sre.google/sre-book/postmortem-culture/)
- [Google SRE Workbook — Postmortem Culture](https://sre.google/workbook/postmortem-culture/)
- [Google SRE Workbook — Implementing SLOs](https://sre.google/workbook/implementing-slos/)
- [Lunney & Lueder — Postmortem Action Items (USENIX ;login: Spring 2017)](https://www.usenix.org/system/files/login/articles/login_spring17_09_lunney.pdf)
- [SRE School — Action Items Guide](https://sreschool.com/blog/action-items/)

### Toyota Kata + Five Whys
- [Proaction International — Toyota Kata Complete Guide](https://blog.proactioninternational.com/en/toyota-kata-guide)
- [Lean Enterprise Institute — Kata Resource Guide](https://www.lean.org/lexicon-terms/kata/)
- [TWI Institute — Toyota Kata + A3 Application](https://www.twi-institute.com/toyota-kata-a3-application/)
- [Five Whys — Wikipedia](https://en.wikipedia.org/wiki/Five_whys)

### OODA + tempo
- [Wikipedia — OODA Loop](https://en.wikipedia.org/wiki/OODA_loop)
- [Mitosystems — Boyd's OODA Loop](https://mitosystems.com/boyds-ooda-loop/)
- [Managing.blue — OODA Loop and DevOps](https://managing.blue/2013/02/18/ooda-loop-and-devops/)

### DORA / DevOps tempo
- [DORA — Software delivery performance metrics](https://dora.dev/guides/dora-metrics-four-keys/)
- [GitRecap — DORA 2026 benchmarks](https://www.gitrecap.com/blog/dora-metrics-benchmarks)

### Linear + triage
- [Linear Docs — Triage](https://linear.app/docs/triage)
- [Linear Docs — Triage Intelligence](https://linear.app/docs/triage-intelligence)
- [Techmonarch — Understanding SLA tiers](https://techmonarch.com/blog/understanding-sla-tiers/)
- [Rootly — P1/P2/P3 support levels](https://rootly.com/incident-response/support-levels)

### OpenTelemetry GenAI
- [OTel — GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [OTel — GenAI events](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/)
- [OTel — Gen AI attribute registry](https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/)
- [Datadog — LLM Observability + OTel GenAI](https://www.datadoghq.com/blog/llm-otel-semantic-convention/)

### RLHF / HITL / confidence thresholds
- [IntuitionLabs — Active Learning + HITL for LLMs](https://intuitionlabs.ai/articles/active-learning-hitl-llms)
- [Cleanlab — TLM structured outputs benchmark](https://cleanlab.ai/blog/tlm-structured-outputs-benchmark/)
- [Comet — Human-in-the-loop review workflows](https://www.comet.com/site/blog/human-in-the-loop/)
- [arXiv — A Survey of RLHF (Kaufmann et al)](https://arxiv.org/pdf/2312.14925)

### KM failure modes (the antidote pattern)
- [Pravodha — Why KM software fails mid-market teams](https://pravodha.com/blogs/why-knowledge-management-software-fails-mid-market-teams-and-what-to-look-for-instead)
- [Knowledge-Management-Tools.net — Failure factors](http://www.knowledge-management-tools.net/failure.html)
- [Mark Burgess — The Failure of Knowledge Management](https://mark-burgess-oslo-mb.medium.com/the-failure-of-knowledge-management-5d97bb748fc3)
- [Nick Milton — 7 failure modes for knowledge transfer](http://www.nickmilton.com/2019/01/7-failure-modes-for-knowledge-transfer.html)

### ADR / forcing functions
- [Martin Fowler — Architecture Decision Record](https://martinfowler.com/bliki/ArchitectureDecisionRecord.html)
- [adr.github.io — ADR community](https://adr.github.io/)
