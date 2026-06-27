---
enforcement_trio:
  t1:
    tier: hook
    path: null
    status: queued
    note: "Plan/decision authoring reminder via session-open + plan-creation-protocol; no per-edit hook (too coarse). HARDWIRE-queued."
  t2:
    tier: validator
    path: "tools/validators/validate-decision-ledger.mjs"
    status: queued
    note: "STRUCTURAL: a consequential decision/plan MUST (a) carry a Decision Ledger (chosen + >=1 rejected-option-with-reasoning) AND (b) cite the existing research/ledger it consulted (or explicitly 'searched X, none found'). Does NOT block NEW research — it ensures prior-art was reviewed FIRST so the decision is informed/context-driven. exits-1 + block-test. HARDWIRE-queued (batch w/ validate-challenge-on-merit)."
  t3:
    tier: session
    path: "session-open injection + AGENTS.md + plan-creation-protocol amendment"
    status: queued
    note: "Plan-creation-protocol: every CSPS plan includes a Decision Ledger section. Queued."
  exempt_reason: "none — full trio intended; validator queued under HARDWIRE with block-test."
---

## B_DECISION_LEDGER — preserve the reasoning, including roads not taken (S089 Governor directive — CONSTITUTIONAL, UNIVERSAL)

**Canonical:** Every consequential decision — when the platform builds **ITSELF** and when it builds **SaaS/app
solutions** for users/tenants/developers — records a **Decision Ledger**: the chosen option, the **rejected
options each with their reasoning**, minority/dissenting views, and source/vote. **The ledger exists to be
CONSULTED and BUILT ON.** Before any research or decision, review what we already have — then decide on
**context**: reuse · refine · extend · or run **new research that starts from the existing baseline and names
the specific gap it fills.** This is *"know and use what we have to make better decisions,"* **not** a rigid
*"never re-research"* rule.

### Context-driven, not rigid (Governor refinement S089)
The principle guards **two opposite failures equally**:
- **Re-research waste** — redoing a deep dive already done (ignoring the ledger).
- **Stale-reuse** — blindly reusing old findings when context genuinely changed (ignoring that fresh research is warranted).
New research is welcome when it's the meritful move — the requirement is only that it be **informed**: written
knowing what exists, starting from that mature baseline, and stating the gap/staleness/new-angle it addresses.
The choice (reuse / refine / extend / research-anew) is on **merit + context**, and is itself recorded in the ledger.

**Scope — both cases, universal:**
- **Platform self-build:** every CSPS plan / design / protocol carries a Decision Ledger.
  First instance: `OPUS-S089-CONSOLIDATED-PLAN.md` §4.
- **SaaS/app solution build:** every solution the platform generates carries its own ledger (the app's build
  decisions + rejected options), so the tenant/developer inherits a mature starting point and never re-researches.

**Ledger entry schema (per consequential decision):**
`{ decision, chosen, rejected_options[]:{option, reasoning}, minority_views[], source_or_vote, date, links }`

**Why it is load-bearing (self-build north star):** the Decision Ledger IS the CIE's memory of what was
considered and rejected. You cannot "consolidate/enhance over create-new" if you don't remember what already
exists AND what was already rejected-and-why. Preserving reasoning is therefore not documentation overhead — it
is the **fuel of the Humble Engine** and an **existing-research-aware decision mechanism**: Ledger → CIE →
Humble Engine → context-driven choice (reuse / refine / extend / new-from-baseline). It cuts wasteful re-dives
AND prevents the opposite failure (ignoring prior work) by making "what we have" the mandatory starting context.

**Wiring (universal tools — reused every build):**
- **Plan-creation-protocol:** every plan includes a Decision Ledger section.
- **Humble Engine (core-seed CS-B):** every create/enhance/consolidate/reuse decision auto-emits a ledger
  entry (options + reasoning + provenance).
- **CIE:** ingests ledger entries → "what exists + what was rejected + why" is queryable → every research/
  decision starts INFORMED (consult-first); new research builds from this baseline rather than from scratch.
- **Verification:** `validate-decision-ledger` checks consequential decisions carry a ledger (structural).

## FSE — engraving across surfaces, >1 way
| # | Surface | Way | Status |
|---|---|---|---|
| 1 | This contract (B_DECISION_LEDGER) | contract | ✅ |
| 2 | Memory `feedback_decision_ledger` | memory | ✅ |
| 3 | Consolidated plan §4 (first instance) + §8 wiring | plan-instance | ✅ |
| 4 | Humble Engine core-seed CS-B emits ledger | core-seed | ✅ (spec) |
| 5 | CIE ingest of ledger (anti-re-research) | mechanism-spec | ✅ (spec) |
| 6 | plan-creation-protocol amendment | doc-rule | ⏳ queued |
| 7 | session-open + AGENTS.md hard rule | prompt/doc-rule | ⏳ queued |
| 8 | `validate-decision-ledger.mjs` + block-test | validator | ⏳ HARDWIRE-queued (batch) |

**Ways:** contract · memory · plan-instance · core-seed · mechanism · doc-rule · validator — >1 way ✓. ≥8 surfaces ✓.

## HARDWIRE queue
The validator (surface 8) ships in the same HARDWIRE batch as `validate-challenge-on-merit`, each with a
block-test proving it FAILS when a consequential decision is recorded with no rejected-options/reasoning.
Writing enforcement blind would violate the rigor; built next, deterministically.
