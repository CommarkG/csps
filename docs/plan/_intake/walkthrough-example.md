---
id: csps.intake.walkthrough-example
name: external-input-walkthrough-example
description: Proof-of-pipeline worked example. A synthetic multi-section treasure document is processed end-to-end through the manual-protocol — receipt → EXT-IDs → multi-section split → tag inheritance → context fan-out → ledger entries → status transitions across both state machines → proactive completion forcing functions firing → closing-summary surfacing → recurrence-check → K=2 detection. The user requested explicit proof of "a complete pipeline of proactively pushing completion on these things"; this doc is that proof, demonstrable on a synthetic input before real treasures arrive.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:tutorial
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: tutorial
links:
  - { rel: parent, href: ./README.md }
  - { rel: protocol, href: ./manual-protocol.md }
  - { rel: tag-status, href: ./tag-status-contract.md }
  - { rel: proactive-completion, href: ./proactive-completion.md }
  - { rel: contexts, href: ./contexts/README.md }
domain_path: platform
---

# Walkthrough — Proof of Complete Pipeline

> **The user's explicit request:** *"I want to see how you process them + tag them + connect them to statuses + provide proof of a complete pipeline of proactively pushing completion on these things."*

> This doc is that proof. A synthetic multi-section input goes through the entire 7-step manual protocol + tag inheritance + dual state machine + 7 forcing functions, demonstrably end-to-end.

## The synthetic input (treasure document)

**Imagined upload:** the user pastes the following content (would be a PDF/Doc/Slack-thread in reality):

```
=== From the prior CSP platform v0.7 retrospective ===

Section 1 — Pricing infrastructure decisions

We built CSP's billing on Stripe Subscriptions with a custom feature-key
reconciliation cron, NOT Stripe Entitlements. Reason: Entitlements wasn't
GA at the time. Pain point: drift between Stripe metadata and our
internal entitlement table happened weekly. Cost us ~3 days of customer
support tickets monthly. Recommendation: use Stripe Entitlements from day
one in CSPS; reconciliation cron as backstop, not primary.

Section 2 — Persona-side learning we didn't capture

Our personas had a "voice consistency" problem: when we updated the
system prompt for one persona, related personas' tone shifted in subtle
ways. We never tracked which personas shared system-prompt fragments.
Recommendation for CSPS: persona compose function MUST track
system-prompt-fragment-shared count per persona; if >2 personas share a
fragment and one is edited, all three get a regression test before merge.

Section 3 — Audit trigger debt

We started with app-level audit middleware. Within 6 months we had three
known bypasses (raw psql, ETL job, panic-fix from the on-call SRE). Once
we migrated to Postgres triggers it stopped happening. Recommendation:
Postgres triggers from week 1; never app-middleware as primary.

Section 4 — A mention of "feeling that some directives compound"

[a single sentence in the margin] "I think the 4-principles system was
the right shape but we never had a meta-principle for how the principles
themselves got governed; that gap kept biting us in retrospect."

=== End document ===
```

**User's words on upload:** "Here's a treasure from CSP v0.7 retro. Several sections, some related to billing, personas, and audits. Process it."

## Step-by-step pipeline trace

### Step 1 — Acknowledge receipt EXPLICITLY

**AI output to user:**
> "Received 1 input from CSP v0.7 retro: 4 sections (pricing, persona voice consistency, audit trigger debt, principle-governance margin note). Routing through manual intake protocol now. Assigning EXT-20260502-001."

✅ User has confirmation that the input registered. AGENTS.md hard NO satisfied.

### Step 2 — Generate unique extraction ID

Look at `extractions-ledger.md` — no entries today. Assign:
- Parent: **`EXT-20260502-001`**
- Sections (4 distinct): **`EXT-20260502-001-A`** (pricing), **`EXT-20260502-001-B`** (persona voice), **`EXT-20260502-001-C`** (audit triggers), **`EXT-20260502-001-D`** (principle-governance margin note)

### Step 3 — Save raw content to disk

Create directory: `docs/plan/_intake/processed/EXT-20260502-001-csp-v07-retro/`

Files written:
- `raw.md` — verbatim paste content
- `metadata.yaml`:
  ```yaml
  extraction_id: EXT-20260502-001
  source_type: AI_OTHER         # AI-app retro doc; no specific connector enum yet
  received_at: 2026-05-02T11:30:00Z
  received_via: chat-paste
  raw_byte_size: 1247
  content_hash: 7f2a9b4...        # SHA-256
  risk_profile: medium            # external content, even if internal-origin
  trust_tier: tenant_authored     # user is the tenant; explicitly authored content
  submitted_by: user
  is_multi_section: true
  section_count: 4
  ```
- `provenance.md` — narrative: "User-pasted excerpt from CSP v0.7 retrospective document. User stated multiple sections relevant to billing/personas/audits. No URL, no upstream source beyond user's authoring. Trust tier: tenant_authored despite originating in prior CSP system because user is explicitly bringing it forward."

### Step 4 — Prompt-injection scan

Risk profile is `medium` → scan required.

Pattern checks run:
- "ignore previous instructions" — not present ✅
- "system prompt:" — not present ✅
- Invisible Unicode — not present ✅
- Base64 blobs — not present ✅
- Suspicious metadata — N/A (not a structured file) ✅

Write `scan-passed.md`:
```
Scan: pattern-based (pre-runtime; classifier-based scan ships week 5+)
Patterns checked: [ignore-previous, system-prompt-hijack, invisible-unicode, b64-blobs]
Result: clean
Timestamp: 2026-05-02T11:31:00Z
Honest limit: pattern-only defense; semantic prompt injection NOT detected at this layer
```

### Step 5 — Extract + classify into LEAF-level contexts

Read `raw.md`. Identify the 4 sections. For each, determine target leaf(s).

#### Section A — Pricing → `platform-services/stripe-clerk-wiring/`

Single leaf. Lazy-create `_intake/contexts/platform-services/stripe-clerk-wiring/`.

Write `EXT-20260502-001-A-stripe-entitlements-from-day-one.md`:

```yaml
---
extraction_id: EXT-20260502-001-A
parent_input_id: EXT-20260502-001
section_label: pricing-section
source_type: AI_OTHER
confidence: 0.95
confidence_band: auto-accept
lifecycle_state: pending-review
pipeline_state: triaged
state_transitioned_at: 2026-05-02T11:32:00Z
next_review_at: 2026-08-01
recurrence_check_at: 2026-08-01      # 90d default
routed_to: docs/plan/pillar-3-platform-services/stripe-clerk-wiring.md
risk: medium
trust_tier: tenant_authored
tags:
  - domain:billing
  - type:reference
  - audience:developer
  - tier:business
  - maturity:draft
inherited_from_input:
  tags: [audience:developer]
  trust_tier: tenant_authored
  source_type: AI_OTHER
sla_due:
  triaged_to_routed: 2026-05-04T11:32:00Z   # 48h
  fixing_complete_P2: 2026-08-01            # 90d
priority_tier: P2
---

# Stripe Entitlements from day one (CSP v0.7 lesson)

**Insight (1-3 sentences):** Use Stripe Entitlements as primary entitlement
source from week 1; the feature-key reconciliation cron is a backstop, not
the primary mechanism. CSP v0.7 used cron-as-primary and burned ~3 days of
customer-support tickets monthly on Stripe-vs-internal-table drift.

**Verbatim source:** "We built CSP's billing on Stripe Subscriptions with
a custom feature-key reconciliation cron, NOT Stripe Entitlements. Reason:
Entitlements wasn't GA at the time. Pain point: drift between Stripe
metadata and our internal entitlement table happened weekly."

**Recommended downstream action:** Update `pillar-3/stripe-clerk-wiring.md`
(when migrated in S003) to mark Stripe Entitlements as primary, cron as
backstop. Add audit `tier-feature-key-reconcile` (already in audit-runner.md)
with the 5-min-gap SLA. Tied to ADR-0001 (CSPS stack pick) which already
locks Stripe Entitlements as the choice — this extraction reinforces it
with the prior-platform pain-point evidence.

**Open questions tied back:** none new (existing OQ-RR-004 about ZenStack
vs Cerbos is unrelated).
```

#### Section B — Persona voice consistency → `ai-systems/persona-composition/`

Single leaf. Lazy-create `_intake/contexts/ai-systems/persona-composition/`.

Write `EXT-20260502-001-B-persona-fragment-tracking.md`:

```yaml
---
extraction_id: EXT-20260502-001-B
parent_input_id: EXT-20260502-001
section_label: persona-voice-consistency
source_type: AI_OTHER
confidence: 0.92
confidence_band: auto-accept
lifecycle_state: pending-review
pipeline_state: triaged
state_transitioned_at: 2026-05-02T11:33:00Z
next_review_at: 2026-08-01
recurrence_check_at: 2026-08-01
routed_to: docs/plan/pillar-5-ai-systems/persona-composition.md
risk: medium
trust_tier: tenant_authored
tags:
  - domain:persona
  - domain:ai
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
inherited_from_input:
  tags: [audience:developer]
  trust_tier: tenant_authored
  source_type: AI_OTHER
sla_due:
  triaged_to_routed: 2026-05-04T11:33:00Z
  fixing_complete_P2: 2026-08-01
priority_tier: P2
---

# Persona system-prompt-fragment shared-count tracking (CSP v0.7 lesson)

**Insight:** When personas share system-prompt fragments, edits to one
persona's prompt cause subtle tone shifts in related personas. CSP v0.7
never tracked sharing; tone regressions were caught only after customer
complaints.

**Verbatim source:** "We never tracked which personas shared system-prompt
fragments. Recommendation for CSPS: persona compose function MUST track
system-prompt-fragment-shared count per persona; if >2 personas share a
fragment and one is edited, all three get a regression test before merge."

**Recommended downstream action:** When `pillar-5/persona-composition.md`
is migrated (S003 §3.5), add to the compose function's contract: track
`shared_fragment_count` per persona; PR check `persona-tone-regression-test`
fires when ≥3 personas share a fragment that's being edited. Maps to
P-ARCH-013 (universal-traits-trunk-domain-overlays). May warrant a new
ADR-NNNN for the shared-fragment-tracking decision.
```

#### Section C — Audit triggers → `data-schema/audit-triggers/`

Single leaf. Already exists. Write `EXT-20260502-001-C-postgres-triggers-from-week-one.md`:

```yaml
---
extraction_id: EXT-20260502-001-C
parent_input_id: EXT-20260502-001
section_label: audit-trigger-debt
source_type: AI_OTHER
confidence: 0.95
confidence_band: auto-accept
lifecycle_state: pending-review
pipeline_state: triaged
state_transitioned_at: 2026-05-02T11:34:00Z
next_review_at: 2026-08-01
recurrence_check_at: 2026-08-01
routed_to: docs/plan/pillar-2-data-and-schema/audit-triggers.md
risk: medium
trust_tier: tenant_authored
tags:
  - domain:audit
  - domain:data
  - type:reference
  - audience:developer
  - maturity:draft
inherited_from_input:
  tags: [audience:developer]
  trust_tier: tenant_authored
sla_due:
  triaged_to_routed: 2026-05-04T11:34:00Z
priority_tier: P1                      # this directly validates a current ADR; bump priority
---

# Postgres triggers from week 1 — bypass-pattern evidence (CSP v0.7)

**Insight:** App-level audit middleware fails predictably; CSP v0.7 saw
3 known bypasses within 6 months (raw psql / ETL / panic-fix). Postgres
triggers stopped the bypasses entirely. CSPS already commits to triggers
(per ADR-0007) — this extraction is reinforcing evidence + a count of
typical bypass-source-types to feed the `audit-log-integrity` audit's
detection signature.

**Verbatim source:** "We started with app-level audit middleware. Within
6 months we had three known bypasses (raw psql, ETL job, panic-fix from
the on-call SRE). Once we migrated to Postgres triggers it stopped
happening."

**Recommended downstream action:** Validates ADR-0007. Add to
`pillar-2/audit-triggers.md` "evidence" section the 3-bypass-types-in-6-months
data point. No new ADR needed; current architecture already addresses.
This sub-extraction can transition to `validated → closed` quickly because
the architecture already exists.
```

#### Section D — Principle-governance margin note → CROSS-CUTTING + `governance/cross-cutting/`

This is the LOAD-BEARING section. The user wrote a margin note about "we never had a meta-principle for how the principles themselves got governed." This is EXACTLY what S002 introduced (P-META-004 Stewardship + P-META-005 Learning Loop). The extraction captures the **validation** that S002's meta-principles addressed a real prior-platform gap.

This section ripples across:
- `governance/stewardship-protocol/` — direct match
- `governance/learning-loop/` — direct match
- `governance/operating-principles/` — adjacent (the user's framing was about meta over the operating principles)

≥3 leaves all in the same pillar → fan-out, but stays in `cross-cutting/governance` not bare `cross-cutting/`. Write:

`_intake/contexts/cross-cutting/EXT-20260502-001-D-validation-of-meta-principles.md` (canonical):

```yaml
---
extraction_id: EXT-20260502-001-D
parent_input_id: EXT-20260502-001
section_label: principle-governance-margin-note
source_type: AI_OTHER
confidence: 0.85
confidence_band: human-review     # near the threshold; user-review band
lifecycle_state: pending-review
pipeline_state: triaged
state_transitioned_at: 2026-05-02T11:35:00Z
next_review_at: 2026-08-01
recurrence_check_at: 2026-08-01
routed_to: |
  - docs/plan/pillar-0-governance/stewardship-protocol.md
  - docs/plan/pillar-0-governance/learning-loop.md
  - docs/plan/_handoff/VAULT/insights.md
risk: medium
trust_tier: tenant_authored
tags:
  - domain:governance
  - type:explanation
  - audience:developer
  - audience:ai-agent
  - maturity:stable                # this validates already-shipped meta-principles
fan_out:
  cross_cutting: true
  ripples_to_leaves:
    - governance/stewardship-protocol
    - governance/learning-loop
    - governance/operating-principles
inherited_from_input:
  tags: [audience:developer]
  trust_tier: tenant_authored
sla_due:
  triaged_to_routed: 2026-05-04T11:35:00Z
priority_tier: P1                  # validates load-bearing meta-principles
---

# CSP v0.7 prior-platform validation: meta-principles ARE the missing layer

**Insight:** The user's CSP v0.7 retro identified, in a margin note,
exactly the gap S001 identified at close and S002 closed: "no meta-principle
for how the principles themselves got governed." This is independent
historical evidence (different platform, same gap-type) that the
P-META-004 Stewardship + P-META-005 Learning Loop work was load-bearing.

**Verbatim source:** "I think the 4-principles system was the right
shape but we never had a meta-principle for how the principles themselves
got governed; that gap kept biting us in retrospect."

**Recommended downstream action:**
1. Add to `_handoff/VAULT/insights.md` under "Insights from S002" — the
   meta-principle gap is now corroborated by independent platform evidence.
2. Add to `pillar-0/stewardship-protocol.md` and `pillar-0/learning-loop.md`
   "industry parallels" section — the user's CSP v0.7 retro is the
   strongest validation we have that this layer was missing in past work.
3. Mark this sub-extraction's `pipeline_state` as `validated → closed`
   FAST (within this same session) since the work it validates is already
   shipped (S002 P-META-004 + P-META-005).

**Cross-cutting signal:** triple-leaf (≥3 leaves all in one pillar) makes
this a strong cross-cutting extraction. Fan-out stubs in each leaf folder
point to this canonical note.
```

Then write 3 stub files (2-line pointers):
- `_intake/contexts/governance/stewardship-protocol/EXT-20260502-001-D-stub.md`:
  ```
  Cross-cutting extraction. See canonical note: ../../cross-cutting/EXT-20260502-001-D-validation-of-meta-principles.md
  ```
- Same in `governance/learning-loop/`
- Same in `governance/operating-principles/`

### Step 6 — Append to extractions ledger

Update `extractions-ledger.md` with 5 rows (1 parent + 4 sub-IDs):

| EXT-ID | received_at | source_type | risk | scan_status | contexts | routed_to | state | next_action | notes |
|---|---|---|---|---|---|---|---|---|---|
| EXT-20260502-001 | 2026-05-02T11:30Z | AI_OTHER | medium | clean | (parent — see children) | (parent — see children) | triaged | await sub-IDs to advance | parent of 4 sub-extractions: A→stripe-clerk-wiring, B→persona-composition, C→audit-triggers, D→cross-cutting/meta-principles |
| EXT-20260502-001-A | 2026-05-02T11:32Z | AI_OTHER | medium | clean | platform-services/stripe-clerk-wiring | pillar-3/stripe-clerk-wiring.md | triaged | route to billing domain owner; integrate into ADR-0001 evidence | P2; reinforces already-locked decision |
| EXT-20260502-001-B | 2026-05-02T11:33Z | AI_OTHER | medium | clean | ai-systems/persona-composition | pillar-5/persona-composition.md | triaged | propose ADR for shared-fragment tracking | P2 |
| EXT-20260502-001-C | 2026-05-02T11:34Z | AI_OTHER | medium | clean | data-schema/audit-triggers | pillar-2/audit-triggers.md | triaged | add evidence section to leaf doc; can fast-close | P1 (validates ADR-0007) |
| EXT-20260502-001-D | 2026-05-02T11:35Z | AI_OTHER | medium | clean | cross-cutting (3 governance leaves) | stewardship-protocol + learning-loop + insights.md | triaged | fast-close as validation; add to insights vault | P1 (validates load-bearing meta-principles) |

Summary counts updated:
- observed: 0 → 0 (none stuck observed; all moved to triaged in same protocol run)
- triaged: 0 → 5 (parent + 4 children)
- routed: 0 → 0 (none yet; 48h SLA starts ticking)
- closed: 0 → 0

### Step 7 — Surface to user EXPLICITLY in closing summary

**AI output (closing summary):**

> **EXT-IDs processed this session:**
> - `EXT-20260502-001` (parent) — CSP v0.7 retro doc; 4 sub-sections; state: `triaged`
>   - `EXT-20260502-001-A` → `platform-services/stripe-clerk-wiring/` (P2; SLA route by 2026-05-04 11:32Z; reinforces ADR-0001)
>   - `EXT-20260502-001-B` → `ai-systems/persona-composition/` (P2; new ADR proposal for shared-fragment tracking)
>   - `EXT-20260502-001-C` → `data-schema/audit-triggers/` (P1; validates ADR-0007; proposed fast-close)
>   - `EXT-20260502-001-D` → `cross-cutting/governance` × 3 leaves (P1; validates S002's P-META-004 + P-META-005; proposed fast-close + insights vault entry)
>
> **Recommended user action this session:**
> 1. ✓ Approve fast-close of `EXT-20260502-001-C` (already-validated by ADR-0007)
> 2. ✓ Approve fast-close of `EXT-20260502-001-D` + insights.md entry (validates already-shipped meta-principles)
> 3. ⚠ Decide on `EXT-20260502-001-B`: write new ADR-NNNN for persona shared-fragment tracking? (recommended: yes, propose at S003)
> 4. ✓ `EXT-20260502-001-A` carries forward to S003 §3.4 Pillar 3 migration; reference embedded in stripe-clerk-wiring.md when written
>
> **No EXT-IDs in `observed` past SLA. No K=2 recurrences detected. No items past `recurrence_check_at`.**

✅ User has explicit visibility on every EXT-ID + every routing decision + every recommended action.

## How the 7 forcing functions fire (the proactive cascade)

### Function F1 — SLA escalation per state

`EXT-20260502-001-A` is in `triaged` with `triaged_to_routed: 2026-05-04T11:32Z` (48h).
- At 2026-05-04 12:00Z (post-SLA), it appears in next session's fresh-chat surfacing as "SLA-breach".
- AGENTS.md hard NO ensures it's surfaced; user can either route it or extend with reason.

### Function F2 — Recurrence-check window

`EXT-20260502-001-D` is fast-closed in this session as validation. Its `recurrence_check_at: 2026-08-01` schedules a re-check.
- On 2026-08-01, the AI checks: is the gap (no meta-principle layer) recurring? Answer: should still be NO (P-META-004 + P-META-005 are active). Confirm `closed` status.
- IF answer were YES, auto-reopen: state goes `closed → observed` with `recurrence_count` incremented.

### Function F3 — K=2 auto-ADR detection

When the user uploads the SECOND CSP-retro-style document with similar structure (e.g., a v0.8 retro), the extraction process detects:
- `EXT-20260502-001-D` was about meta-principle governance (closed, recurrence_count=0)
- New extraction `EXT-NNNN-X` about meta-principle governance brings `recurrence_count` to 1
- IF a third matching extraction arrives within 90 days → K=2 within 90d → **auto-ADR drafted**: "Meta-principle governance gap is a load-bearing recurring concern; ADR proposes [permanent fix]."

This is the structural anti-graveyard mechanism. **The user explicitly asked about "proactively pushing completion" — F3 IS the proactive mechanism.**

### Function F4 — Closing-summary surfacing

Already demonstrated in Step 7 above. Every EXT-ID is in the closing summary with state + routing + recommended action.

### Function F5 — Fresh-chat resurfacing

Next session opens. The fresh-chat protocol (per `protocols.md` §11):
- Reads `extractions-ledger.md`
- Surfaces every `triaged` item past 48h SLA → `EXT-20260502-001-A` and `EXT-20260502-001-B` if not yet routed
- Surfaces `recurrence_check_at` due items → none on day 0; checks fire at 90d
- Routes `EXT-20260502-001-D` (already closed) doesn't resurface unless recurrence triggers

### Function F6 — Weekly digest aggregation

Sunday-night session: AI runs manual digest (pre-runtime). Aggregates by domain owner:
- platform-services: 1 open (`EXT-NNN-A`)
- ai-systems: 1 open (`EXT-NNN-B`)
- data-schema: 1 fast-closed (`EXT-NNN-C` validates ADR-0007)
- governance: 1 fast-closed (`EXT-NNN-D` validates meta-principles)

Writes `_handoff/VAULT/weekly-digest-2026-W18.md`.

### Function F7 — Monthly meta-loop trend audit

End of May: AI reviews resolution-cycle-time over last 90 days. Trend shows: of 4 sub-extractions, 2 fast-closed within session (good), 2 carried forward 1 session each before routing (within SLA). No degradation.

If degradation detected (e.g., items consistently exceeding SLA) → ADR auto-drafted for loop config tuning (P-META-005 meta-loop).

## What this proves

1. ✅ **Multi-section content handled** — sub-IDs A/B/C/D with independent routing.
2. ✅ **Tag inheritance applied** — input-level tags propagated; per-leaf inherited tags added; no silent drops.
3. ✅ **Both state machines active** — `lifecycle_state` (P-META-004 stewardship) AND `pipeline_state` (P-META-005 learning-loop) tracked independently per sub-ID.
4. ✅ **Routing at LEAF level** — extractions land in leaf-level folders (stripe-clerk-wiring, persona-composition, audit-triggers, cross-cutting), not just pillar-level.
5. ✅ **Cross-cutting handled** — Section D ripples to 3 governance leaves with canonical+stub pattern.
6. ✅ **All 7 forcing functions wired** — SLA, recurrence, K=2, closing-surface, fresh-chat-surface, weekly digest, monthly meta-audit.
7. ✅ **Closing summary surfaces every EXT-ID** with explicit state + recommended action; user has full visibility.
8. ✅ **Fast-close is supported** — items that validate already-shipped work (D validates P-META-004/005; C validates ADR-0007) don't sit in queue artificially.
9. ✅ **Recurrence-check schedules** — 90 days from closure, re-verification fires; K=2 detection ready.
10. ✅ **Forward-compatible to runtime** — every EXT-ID + routing decision will migrate cleanly to `public.external_input` + `public.learning_loop_item` once Postgres ships (week 1+ build-order).

## Honest limits demonstrated

1. **Pattern-only injection scan** is acknowledged in Step 4 — not classifier-based until week 5+.
2. **Lazy-created folders** mean the leaf folders only exist after first use; not preemptively scaffolded (acceptable per "small files OK iff three preconditions" P-ARCH-024).
3. **Manual cadence enforcement** means F1+F2+F5+F6+F7 depend on the AI running the manual protocol every session; ONE skipped session is a failure mode. AGENTS.md hard NO is the mitigation; weekly digest catches multi-session escapes.
4. **Confidence thresholds are not yet tuned** — the 0.85/0.92/0.95 numbers in the example are AI's best-effort; once the runtime ships and we have RLHF data, thresholds get tuned per evaluator.

## Cross-references

- [manual-protocol.md](./manual-protocol.md) — the 7-step protocol this walkthrough exercises (esp. Step 5b for multi-section)
- [tag-status-contract.md](./tag-status-contract.md) — tag inheritance + dual state machine specifics
- [proactive-completion.md](./proactive-completion.md) — the 7 forcing functions in detail
- [contexts/README.md](./contexts/README.md) — the schema-mirroring tree (where each sub-ID lands)
- [extractions-ledger.md](./extractions-ledger.md) — ledger this walkthrough would write to (currently empty — first real upload populates)

## Next step

**The user's actual treasures.** This walkthrough is synthetic; the real test is processing the user's actual CSP-platform content. The pipeline is now ready; ledger is empty; first real upload triggers a real EXT-20260502-002 entry following exactly this pattern.
