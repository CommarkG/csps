---
id: csps.governance.rzf-latest
name: RZF-LATEST
description: >
  Canonical consolidated "latest version" of the CSPS Real-Zero-Findings (RZF) discipline as of S071.
  Distillation of zero-findings-discipline.md (long-form) + B_RZF (contract) + zf-mandate-protocol +
  EP-008 nominal-rzf failure pattern + S069-S070-S071 lived learnings. RZF is defect verification:
  the cost of one false-clean is greater than N validator runs; mechanical re-execution is the only
  proof. Numbers and cycle counts here are MEASUREMENTS (sample/tunable), not caps.
type: governance
diataxis_type: reference
protection_level: protected
status: ratified
impl_status: swift-implemented
core_spine: GVRN
core_spines: [GVRN, VALD, AI]
schema_anchor: pillar_0_governance_leaves
version: "1.1"
session: S071
owner: group:finky
authored_by: OPUS-15
lifecycle: production
lifecycle_state: active
ns_quality: [core-first, synergetic]
ns_path: "this → GVRN spine → North Star (evidence-based completion)"
context_question: "Before any DONE/RATIFIED/COMPLETE claim: does THIS turn cite a re-run of verify whose top-level $? = 0, and does Cycle 2+ name the specific files it re-examined?"
context_quote: "The cost of ONE false-clean is far greater than the cost of N validator runs. Mechanical re-execution is the only proof that holds. — CSP S333"
context_quote_sibling: "Iteration is a virtue until it becomes avoidance of closure. RZF is the discipline that preserves improvement without sacrificing completion. — external-research absorption S071 Turn 9 (vaulted at _handoff/VAULT/external-input/rzf-refined-definition-S071/)"
inherits_from: "zero-findings-discipline.md (long-form canon) + B_RZF (contract) + zf-mandate-protocol + EP-008 nominal-rzf + P-META-006 (RZF principle) + P-META-028 cornerstone (context-refined communication)"
links:
  - { rel: long-form, href: ./zero-findings-discipline.md }
  - { rel: contract, href: ./behavioral-contracts/B_RZF.md }
  - { rel: protocol, href: ./zf-mandate-protocol.md }
  - { rel: error-pattern, href: ../_handoff/VAULT/know-how/error-patterns/EP-008-nominal-rzf.md }
  - { rel: validators, href: ../../../tools/validators/ }
---

# RZF — Real-Zero-Findings · Latest (S071)

> **One sentence:** A claim is DONE only when this-turn evidence (a re-run) shows zero findings AND the cycles that produced that zero **name specifically what they re-examined**. Memory of earlier runs is not evidence.

## 1 · Mechanics (the discipline)
- **Cycle.** A ZF cycle is one pass of "what did I miss / what is wrong or incomplete here?" Each finding is named, with file/line if applicable.
- **Classify-before-fix (v1.1 — external absorption).** For each finding, classify severity at surface BEFORE deciding fix-now-vs-vault: `BLOCKING` (gates the current scope — fix in this cycle) · `ADVISORY` (warn-level — note in PREVENTION, proceed) · `DEFERRABLE-to-vault-pending` (real value, wrong cycle — route to `tools/data/vault-pending.yaml` with traceable context). Skipping classification = scatter; everything-treated-as-blocker = closure failure; everything-treated-as-advisory = nominal-RZF.
- **Termination.** The cycle terminates only when **0 new findings** at the BLOCKING level. A cycle that *finds a BLOCKING something* is non-terminal; the next cycle is mandatory. ADVISORY + DEFERRABLE findings do NOT block termination — they are noted/vaulted.
- **Cycle 1 / Cycle 2 rule.** Cycle 1 surfaces findings (or none). Cycle 2+ **re-examines Cycle-1 areas by NAME** (files, validators, registries) and confirms 0 new. *"Cycle 2: 0 new findings"* without naming areas is **nominal** — not real (EP-008).
- **Re-run is the proof.** Every DONE/RATIFIED/COMPLETE claim cites a re-run of `node tools/verify.mjs --skip-install` whose **top-level `$?` = 0** in THIS turn. The per-validator JSON `exit_code: 0` lines are not the top-level — checking only those is the recurring trap.
- **Cycle count is measurement, not target.** N cycles is data about how iteration-rich the work was. A turn that genuinely has 0 new after 2 cycles is DONE.
- **Pre-directive RZF (Opus only).** Before any directive to Sonnet: draft → Cycle 1 (what would a reader find incomplete?) → amend → Cycle 2 re-examines amended areas by name → present only after termination.

## 2 · CEC — the positive companion
CEC (Complete Extraction Cycle) runs after any significant finding/ratification: "where does the essence of this enhance other platform elements?" — walk until 0 new applications. CEC + RZF together convert *"I think it's done"* into *"evidence shows it's done + maximally extracted."*

## 3 · Failure modes (named — taxonomy, v1.1)
RZF has two parent failure-mode classes and one named subclass. Each is a separate diagnostic — the prevention surface differs per class.

### 3.A · FCC — False Completion Claim (parent class · v1.1)
A `DONE / READY / COMPLETE / RATIFIED / SEALED` claim made without this-session evidence sufficient to support the scope claimed. Broader than FZF/nominal-RZF: covers cases where the claim isn't strictly a ZF assertion but is still un-evidenced (e.g., *"deployed"* without verifying the URL responds, *"feature works"* without testing). **Inaugural instance:** the S070 M3 dashboard-404 incident (claimed M3 DONE before WebFetch confirmed `/platform/communication` rendered). Prevention surface: the post-edit-verify trap (§5) + `verify_top_exit:<int>` (§6.I3) + sealed-milestone OPIA (the director's verification check).

### 3.B · EP-008 Nominal-RZF (subclass of FCC · CSPS-native)
Claiming ZF/PASS without this-session re-run evidence — narrative assertion instead of evidence. Forms it takes:
- "Cycle 2: 0 new findings" without naming areas (vague).
- Citing per-validator `exit_code:0` while top-level `$?` is non-zero.
- Re-using memory of an earlier green run as proof.
- Editing a CHECKPOINT *after* the verify run, then claiming "verify=0" (the CHECKPOINT change itself can introduce a RED).
- Timestamp-touching or `verify --bypass` to manufacture a green.

Prevention surface: `validate-zf-cycle-format.mjs` (Cycle 2+ requires named files with extensions) + `validate-rzf-evidence.mjs` + `validate-nominal-rzf-detector.mjs` (planned M1 sibling).

### 3.C · PSP — Premature Satisfaction Point (parent class · v1.1, external absorption)
Claiming termination by consulting ONE signal when the discipline mandates consulting multiple — declaring "done" because one indicator went green while other required indicators were never checked. Distinct from FCC (FCC = no evidence at all; PSP = partial evidence misread as complete). **Inaugural instance:** S014 single-source-navigation reminder (`#4` in this session's turn-discipline header) — *"Consulting ONLY session-state = satisfaction point"* — the named failure mode where a consequential decision consulted session-state but skipped PENDING VLTs / open-plan-levels / PE scoring. Prevention surface: the SINGLE-SOURCE NAVIGATION WARNING in every turn-discipline header + the ALL-FOUR-MUST-AGREE rule for consequential decisions.

## 4 · Active enforcement (validators)
- `validate-zf-cycle-format.mjs` — Cycle 2+ must name specific files (extension required by the regex, e.g., `.md / .mjs / .yaml`).
- `validate-rzf-evidence.mjs` — DONE claims cite a this-session verify run.
- `validate-opus-turn-rzf.mjs` — Opus turns include an RZF section.
- `validate-opus-rzf-gap-tracking.mjs` — surfaced gaps have a tracked SROF/backlog entry (not decoration).
- `validate-directive-has-rzf.mjs` — directives carry pre-directive RZF.
- Hook: `post-stop-rzf-reminder.sh` (T1, advisory now); `pre-tool-use-rzf-evidence-gate.sh`.

## 5 · S069-S070-S071 lived learnings (new in this version)
- **Post-edit verify trap.** Writing a CHECKPOINT/ZF block can itself introduce a RED via `validate-zf-cycle-format` (vague Cycle 2). Discipline: run verify *after* the final CHECKPOINT edit, not before.
- **Per-item vs top-level.** `grep "exit_code"` in verify JSON shows per-validator zeros that mask a top-level 1. Always capture `$?` of the top-level invocation, not lines from the body.
- **File-extension citation.** `validate-zf-cycle-format`'s regex needs filename + extension (`PLAN-S069-COMMS-AND-JOURNEY.md`), not bare names (`PLAN-S069 §BUILD SEQUENCE`).
- **Cornerstone interaction.** RZF claims about counts must be *context-wrapped* per P-META-028 (e.g., "validators_checked=8 (sample tier — expandable)"), not bare integers.
- **ZF-deep cadence.** When the platform signals `ZF deep required (iter N)` across many turns without one firing, the deep itself becomes nominal-deferred — schedule it, don't carry it.

## 6 · Expert improvements (proposed; numbers are sample/tunable)
- **I1 · Symmetric cycle check.** Extend `validate-zf-cycle-format` to also flag missing/empty Cycle 1 (currently only Cycle 2 is checked).
- **I2 · Post-edit auto-verify trigger.** A post-tool-use hook on `sonnet-turn.md` / `opus-turn.md` edits that runs verify and posts the top-level `$?` into the same artifact — eliminates the "wrote CHECKPOINT then claimed green from a stale run" trap.
- **I3 · Top-level-only evidence schema.** Standardize the ZF block to require `verify_top_exit: <int>` (a field), not free-text "verify exit_code=0" — un-fakeable.
- **I4 · ZF-deep scheduling.** Promote `cron-weekly-tag-status-deep-audit.sh` to also fire when the `ZF deep required (iter N)` signal crosses a tunable threshold (sample default N=12) — converts the "always overdue" pattern into a triggered event.
- **I5 · Nominal-RZF detector.** A post-stop validator that scans the latest CHECKPOINT for the *shape* of a Cycle-2 line and flags `0 new` without ≥1 filename-with-extension in the same sentence — kills the loophole at its source.

## 7 · Quick-reference (paste-ready)
```
ZF Cycle 1: <finding(s), each with file/line>.
ZF Cycle 2: re-examined <file1.ext> + <file2.ext> (the Cycle-1 areas, named) — 0 new.
Status: ZF ACHIEVED.
verify_top_exit: <$? of `node tools/verify.mjs --skip-install`>
```

## 8 · v1.1 acknowledgment (S071 Turn 9 — external absorption)
v1.1 absorbed 3 named items + 1 cycle-mechanic refinement from external research vaulted at [_handoff/VAULT/external-input/rzf-refined-definition-S071/](../_handoff/VAULT/external-input/rzf-refined-definition-S071/INDEX.md):
1. **PSP — Premature Satisfaction Point** (new parent class — §3.C)
2. **FCC — False Completion Claim** (new parent class — §3.A; EP-008 nominal-RZF is now its subclass §3.B)
3. **Iteration-vs-closure aphorism** (sibling `context_quote:` in frontmatter)
4. **Explicit classify-before-fix step** (§1 mechanics — BLOCKING / ADVISORY / DEFERRABLE-to-vault-pending)

Rejected (preserved decision-of-record in [INDEX.md](../_handoff/VAULT/external-input/rzf-refined-definition-S071/INDEX.md) §REJECTED): the external doc's RZF acronym ("Repeated" — collides with CSPS canonical "Real") · CEC (already CSPS-native) · Material/Non-Material (already BLOCKING/ADVISORY platform-wide) · Declared-Review-Scope/Named-Re-Examination (already in §1 + `validate-zf-cycle-format`) · Save-and-Schedule (already VAULT_DEFER + `vault-pending.yaml` + WIRING PASS) · `completion_evidence:` YAML block (duplicate of ZF block + `verify_top_exit:<int>`).

CSPS-native vocabulary preserved (no RZF acronym reassignment; no parallel taxonomies). S071 milestone scope unaffected — v1.1 is additive.

— OPUS-14 (S071 v1.1 amendment · 2026-05-30)

— OPUS-15 (S071 v1.0 author) · authored 2026-05-29
