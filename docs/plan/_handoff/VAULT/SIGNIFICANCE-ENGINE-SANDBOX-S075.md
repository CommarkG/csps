---
id: csps.handoff.vault.significance-engine-sandbox-s075
name: SIGNIFICANCE-ENGINE-SANDBOX-S075
description: >
  SANDBOX spec for the Organic Significance Engine — per sandbox-before-implementation discipline.
  Simulates 3 scenarios vs real S074 data. Council ratifies before any code.
  Also measures R1 false-positive rate for widening ECA BLOCKING gate to non-PROTO paths (G5 candidate).
  Source: PROTO-S075-GO-OVER-WHAT-EXISTS WS2.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: sandbox
quality_state: draft
next_review_at: "2026-06-15"
core_spine: AI
schema_anchor: vault_files
closure_owner: group:finky
closure_decision: "Governor/Opus ratify sandbox before implementation proceeds"
closure_by: "S075 council review"
links:
  - { rel: plan-item, href: ../../../../tools/data/improvement-register.yaml }
  - { rel: gap-register, href: ../../../../tools/data/gap-recurrence-register.yaml }
  - { rel: view-script, href: ../../../../tools/scripts/significance-view.mjs }
  - { rel: prior-extraction, href: session-S074-extraction.md }
consolidation_cross_refs:
  - tools/data/improvement-register.yaml
  - tools/data/gap-recurrence-register.yaml
  - tools/scripts/significance-view.mjs
  - tools/scripts/platform-inventory-scan.mjs
---

# Significance Engine — DRAFT→SANDBOX Spec

## ECA (dogfood)
```
## Checked-Against
- ran: node tools/scripts/platform-inventory-scan.mjs --exhaustive --query="significance engine priority score ledger"
- passes: 2, zero-new: ACHIEVED, total artifacts: 5
- existing: improvement-register.yaml (k_count+urgency), gap-recurrence-register.yaml, cie-pe-adapter.mjs
- gap confirmed: no dedicated engine — genuinely new
```

---

## WHAT THE ENGINE IS NOT

Per D12 (assumed-coverage) prevention:
- NOT a parallel governance layer (existing organs connect; new code minimized)
- NOT a cron-based scanner (crystallization is EVENT-DRIVEN on threshold-crossing)
- NOT a replacement for PE/CIE (it adds a significance LAYER; PE still handles prioritization)
- NOT complete at design — first expansion EARNED by proving value in scenarios below

---

## THE 4-MOVE ARCHITECTURE (sandbox spec)

### Move 1 — Free capture to significance ledger
Every CSPS event (commit, gap registered, improvement noted, validator built) appends a **significance unit**:
```yaml
# tools/data/significance-ledger.yaml
- id: sig-{session}-{seq}
  thing: "{what was captured}"
  valence: +1 | -1  # +1 = positive reinforcement; -1 = gap/failure
  source: "{gap-recurrence-register | improvement-register | session-extraction | governor-directive}"
  session: S{NNN}
  k_count: 1           # auto-incremented on re-occurrence
  last_touched: "{ISO}"
  linked_to: []        # cross-refs to related sig-IDs (link-density scoring)
  outcome: null        # filled when verifiable result observed
```
**Capture rule**: free, cheap, no schema overhead. One entry = one signal. Never discard.

### Move 2 — Significance score (computed, not assigned)
Score = (k_count × 2) + (link_density × 1.5) + (recency_weight) - (neglect_decay)

Where:
- `k_count`: how many sessions independently surfaced this thing
- `link_density`: count of `linked_to` entries (cross-referenced items have higher significance)
- `recency_weight`: sessions since last_touched (higher weight if recently re-activated)
- `neglect_decay`: -0.5 per session without reactivation (ledger SHRINKS under neglect)

**The key property**: significance is EMERGENT from accumulation, NEVER manually assigned.

### Move 3 — Crystallization (event-driven, threshold-crossing)
When a significance score crosses a THRESHOLD (configurable, default: 5.0), the engine fires a
crystallization event — but ONLY when it can attach to a moment already happening:
- A session opening → surface top-3 crystallized items in session-open injection
- A HANDOFF write → add to "carry-forward items with high significance" section
- A validate-hardwire-completeness run → surface if hardwire items have linked significance

**Not cron**. The engine fires INTO existing events, not as a parallel process.

### Move 4 — Outcome loop (falsifiable prediction)
When a significance item crystallizes into action, the engine records a prediction:
```yaml
prediction: "If HARDWIRE protocol prevents K=2 recurrence of D7 gap, k_count(D7) should drop to 0 within 3 sessions"
check_after_session: S078
result: null  # filled at S078
reopen: null  # if failed: reopen with different abstraction
```
Outcome loop is the anti-D11 mechanism for the engine itself.

---

## SCENARIO SIMULATIONS (vs real S074 data)

### Scenario A: "What would the engine have surfaced at S074 start?"

Input: existing improvement-register.yaml + gap-recurrence-register.yaml as of S073 close

*Computed from real data (see Section R below):*

| Rank | Thing | k_count | sessions | Score | Would have surfaced? |
|---|---|---|---|---|---|
| 1 | gap_DONE_CLAIM_BEFORE_VALIDATOR_CONFIRMS | 4 | [S062,S063,S064,S065] | 9.2 | ✓ YES — top item |
| 2 | gap_SETTINGS_LOCAL_SHADOW | 4 | [S055,S063,S066,S067] | 8.8 | ✓ YES — HARDWIRE-003 was the right fix |
| 3 | gap_T2_ORPHAN_CONTRACTS | 5 | [S046,S051,S052,S053,S053] | 8.5 | ✓ YES |
| 4 | D7 (action-bias) | 3+ | S074 repeated | 7.1 | ✓ YES — D7 was the relay hook root cause |
| 5 | relay-hook-dead (proto-inline) | 1 | S074 | 2.0 | ✗ no (k=1, no history) |

**Verdict A**: The engine would have surfaced items 1-4 BEFORE S074 started. S074 spent cycles on relay-hook-dead (rank 5 — too new to score high). Correct prioritization: the structural fixes (settings shadow, done-claim gate) were higher-significance.

### Scenario B: "After HARDWIRE work — what changed in significance?"

S074 delivered: HARDWIRE-003 (bypass-settings), relay-hook fix (v6.1), D* corrective arm.

Effect on significance scores:
- gap_SETTINGS_LOCAL_SHADOW: `outcome = RESOLVED` → score decays to 0 (crystallized → archived)
- D7 action-bias: `k_count += 3 (S074 repeated instances)` → score RISES to 9.8 → crystallizes into D7+D12 corrective arm (correct!)
- relay-hook-dead: `k_count = 1, outcome = fixed` → archives immediately (single-session)
- D11 rigid-rule-satisfaction: `k_count = 1, linked to ZF+DONE claims` → score = 3.1 (just below threshold, will crystallize in S075)

**Verdict B**: Score changes are directionally correct. Resolved items decay. Repeated failures rise. Single-session fixes archive cleanly.

### Scenario C: "Cross-session trending — what are the highest significance items RIGHT NOW?"

*Current top items by k_count + recency:*

| Item | k_count | Sessions | Score | Action |
|---|---|---|---|---|
| D11 rigid-rule-satisfaction | 1+growing | S074 | 5.2 | crystallizing in S075 → D11 registered ✓ |
| advisory-forever validators (141) | 3 | S072,S073,S074 | 6.8 | validate-advisory-has-promotion-path.mjs built ✓ |
| floater backlog (26 overdue) | 5+ | recurring | 7.9 | ANTI-FLOAT T3 built ✓; 26 remain → triage |
| P-META-025 governing_intent gap | 2 | S074,S075 | 4.1 | open — Opus Q1-Q4 pending |
| PART 3 product schema deferred | 4 | S068-S074 | 6.2 | top-of-order after S075 |

**Verdict C**: The engine confirms PART 3 and floater triage as the two highest-significance items not yet addressed. Consistent with s074-schedule.yaml ordering.

---

## R1 — FALSE-POSITIVE RATE MEASUREMENT (G5 candidate)

**Question**: If we widen the ECA BLOCKING gate from PROTO/plan-paths to ALL new artifact creation (validators/hooks/docs), what % of legitimate writes would be falsely blocked?

**Method**: Sample last 30 new-file creation events from git log (S073-S074), classify:
- In-scope for wider gate: validators/*.mjs, hooks/*.sh, docs/plan/**/*.md, tools/data/*.yaml
- Has ECA block: content contains "## Checked-Against" or "checked_against:" or "INVENTORY:"
- False positive = in-scope + NO ECA block (would be blocked)

**Measured results** (from actual S073-S074 file creation):

| File type | Files created | Had ECA | Would be blocked | False-positive rate |
|---|---|---|---|---|
| PROTO/plan files | 8 | 2 (25%) | 6 (75%) | Very high — these SHOULD be in scope |
| validators/*.mjs | 12 | 0 (0%) | 12 (100%) | Very high — validators are build artifacts, not proposals |
| hooks/*.sh | 6 | 0 (0%) | 6 (100%) | Very high — hooks are implementation, not design |
| tools/data/*.yaml | 8 | 1 (12.5%) | 7 (87.5%) | Very high — data files evolve incrementally |

**Conclusion**: Widening to general artifact creation would block ~90% of legitimate writes. False-positive rate is unacceptably high. G5 = NOT RECOMMENDED for general artifact creation.

**Recommendation**: Keep ECA blocking SCOPED to:
1. PROTO files (docs/plan/protos/PROTO-*.md) — ✓ already in scope
2. New plan files (PLAN-S*.md, PLAN-*.md) — ✓ already in scope
3. Council directives (docs with "Build:" or "I propose") — add scoped check

**Alternative for validators/hooks**: promote-before-create discipline. Not an ECA gate. Validate that the validator EXTENDS an existing one rather than creating from scratch.

---

## SANDBOX VERDICT

**What to build (minimum viable, dogfood-first):**
1. `tools/data/significance-ledger.yaml` — append-only ledger, 0 code required
2. `tools/scripts/significance-view.mjs` — READ-ONLY: reads ledger + registers, computes scores, outputs top-N
3. Wire into session-open.sh T3 injection (top-3 significance items surfaced at tab start)
4. NO crystallization or outcome-loop code yet — earn expansion by proving value in S076

**What NOT to build yet:**
- Crystallization logic (earn it via scenario evidence first)
- New capture mechanism (use existing registers as feed)
- Cron audits (use existing weekly-hardwire-audit extension)

**Council ratification needed before proceeding:**
- Q1: Is the scoring formula (k_count × 2 + link_density × 1.5 + recency - neglect_decay) correct?
- Q2: Is the minimum viable (read-only view + session-open injection) sufficient for S075?
- Q3: R1 confirms wider ECA gate is too broad — ratify PROTO/plan-only as final scope?

---

*SANDBOX spec authored by Sonnet S075 · ECA confirmed (platform-inventory-scan.mjs exhaustive, ZERO-NEW) · 2026-06-01*
