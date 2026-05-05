---
id: csps.pillar-0-governance.context-loss-pains
name: context-loss-pains
description: Canonical SINGLE-SOURCE-OF-TRUTH catalog of all known context-loss pains in AI-integrated systems. Every CSPS plan, topic-plan, closing-summary, and handoff REFERENCES this file (not restates) per the consolidation discipline. Catalog includes D1-D10 AI failure modes (CSP file #2) + permission-popup + auto-compaction + model-switch + token-budget violations + closed-enum drift + skill-location wildcards + handoff degradation + subagent-output-context-loss + 95% context ceiling + more. Per S008 turn 12 user directive "create a list of all the known pains of context related losses in ai integrated systems. Make it mechanical this list in mentioned in every part of any plan by referencing to a dedicated file of this list."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: pillar-leaf
template_status: novel-pending-pattern-evaluation
core_spine: GVRN
core_spines: [GVRN, AI, VALD, OPER]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
session: S008
file_depth_markers:
  l1_lines: "1-80"
  l2_lines: "81-280"
  l3_lines: "281-end"
  read_protocol: "L1 = catalog summary + plan-checklist convention. L2 = per-pain detail (id / trigger / cause / mitigation / discipline cross-ref). L3 = composition + audit + references."
links:
  - { rel: parent, href: ./README.md }
  - { rel: plan-creation-protocol, href: ./plan-creation-protocol.md }
  - { rel: csps-dna, href: ./csps-platform-dna.md }
  - { rel: d1-d10-source, href: ../_handoff/VAULT/contexts/governance/mechanical-completion/EXT-20260505-002-D-mechanical-completion-directive-D1-D10-false-lexicon.md }
  - { rel: edge-case-source, href: ../_handoff/VAULT/contexts/governance/edge-case-handling/EXT-20260505-006-B-7-forward-going-patterns-edge-cases-as-signals.md }
---

# Context-Loss Pains Catalog — CSPS

> **Single canonical home for ALL known context-loss pains in AI-integrated systems.** Every plan REFERENCES this file via the "Context-Loss Prevention Checklist" section (per [plan-creation-protocol.md §3 Step 4](./plan-creation-protocol.md)) — not restates. Per CSP file #5 unified principle: savings + SSoT same discipline.

## §1 — Why this catalog exists

**The drift class:** AI-integrated systems lose context in predictable ways. Each pain has a name, trigger, cause, and mitigation. Without a canonical catalog, plans re-discover pains after they cause failures. **With this catalog: every plan references it, applying named mitigations preventatively.**

**The mechanical convention** (per S008 turn 12 user directive "make it mechanical this list in mentioned in every part of any plan"):

```yaml
# In every plan's frontmatter OR §X header section:
context_loss_prevention:
  consulted: docs/plan/pillar-0-governance/context-loss-pains.md (this file)
  applies_to_this_plan:
    - PAIN-D1: <how mitigated>
    - PAIN-AUTO-COMPACT: <how mitigated>
    - ...
  not_applicable:
    - PAIN-X: <reason>
```

**Validator** `plan-context-loss-section-present` (week-4) audits every plan has this section + non-empty.

## §2 — The 22 named pains catalog (with mitigations)

Each pain has a stable PAIN-* ID. Plans reference by ID.

### Class A — AI cognitive failure modes (D1-D10 from CSP file #2 §11)

> **Per S009 L1.5 fleshed atomic per FSE (Q4=B reuse-first — extends this leaf rather than authoring parallel d1-d10-catalog.md per EXT-20260505-002-D §10).** Each row maps to canonical CSPS memory entry where one exists; D1/D3/D4/D5/D9/D10 are NEW for CSPS catalog. Self-monitoring discipline at [`feedback_d1_d10_self_monitoring.md`](memory) — AI-internal continuous catch.

| ID | Pain | Cause | Mitigation | Maps to canonical CSPS |
|---|---|---|---|---|
| **PAIN-D1** | Time-pressure → declare schema, defer validator | "I'll implement the validator next batch" thinking | Mechanical-completion is FIRST batch; do FEWER things FULLY | NEW S009 L1.5 — `feedback_d1_d10_self_monitoring.md` D1 entry |
| **PAIN-D2** | Doctrine-completion-feels-like-completion | Authoring docs FEELS like work done; execution stalls | BATCH_CLOSE checklist requires 5-element-pattern citation | [`feedback_protocol_compression_is_skipping.md`](memory) (memory entry 11; CSPS analog) |
| **PAIN-D3** | Sequential not parallel | Authoring 5 surfaces across 5 commits | Author all 5 elements same humble batch | [`feedback_five_surface_engraving.md`](memory) (memory entry 14; FSE atomic mandate) + NEW S009 L1.5 D3 entry |
| **PAIN-D4** | Governor-said-mechanical-so-call-it-mechanical | Claiming BUILT without all 4 conditions | All 4 conditions: validator runs + emits findings + wired hook + not blocked | NEW S009 L1.5 — composes with [`feedback_re_run_is_proof.md`](memory) (RZF) |
| **PAIN-D5** | Continuity-bias (replicate prior patterns without question) | Copy-paste convention without asking "does this need to enforce anything?" | At every CD authoring: ask "is this required to enforce anything?" | NEW S009 L1.5 — directly mitigated by [`depth-discipline.md §5`](./depth-discipline.md) anti-pattern table (Phase 6 spawn templates) |
| **PAIN-D6** | 5-element-pattern as checklist not gate | Marking BUILT after authoring 3 of 5 surfaces | Refuse `BUILT` unless all 5 verified end-to-end | [`feedback_five_surface_engraving.md`](memory) (memory entry 14) — 2/5 anti-pattern clause |
| **PAIN-D7** | Honest-acknowledgment-substitutes-for-mechanical-fix | "I noticed the gap" without fixing it | Honest acknowledgment + completion deadline required | [`feedback_catch_to_engraving.md`](memory) (memory entry 13) |
| **PAIN-D8** | Future-session-defer-default | "I'll do this next session" without registering completion debt | Register completion debt with target session + auto-fire mechanical reminder | [`feedback_catch_to_engraving.md`](memory) (memory entry 13) "default-to-engrave when uncertain" |
| **PAIN-D9** | Cite-honesty-in-prose-substitutes-for-data-correction | Note in prose about a stale value vs editing the value | Every cite-honesty observation produces CD-NNN entry | NEW S009 L1.5 — composes with `principle-count-staleness` audit (S005 turn 8) |
| **PAIN-D10** | Patched-because-Governor-asked-not-fully-fixed | Fixing the specific instance Governor named without closing the class | Distinguish respond-to-question from close-the-class-gap | NEW S009 L1.5 — composes with [`B_STRUCTURAL_PREVENTION_DISCIPLINE`](./behavioral-contracts.md) Q-2 (instance-vs-structural) |

### Class B — Token / context-budget pains

| ID | Pain | Cause | Mitigation |
|---|---|---|---|
| **PAIN-AUTO-COMPACT** | Auto-compaction at 95% context with default content-loss | Reaching 95% without strategic /compact | Strategic `/compact <focus>` at IMPL_BATCH boundaries proactively per B_TOKEN_BUDGET R3 |
| **PAIN-MODEL-SWITCH** | Mid-task model switch breaks Anthropic prompt cache | `/model opus` mid-task | Switch only at task boundary OR after `/clear` per B_TOKEN_BUDGET R2 |
| **PAIN-OVERREAD** | Reading large files at full size when L1 sufficient | No file_depth_markers on referenced artifacts | Per [EXT-20260505-004-A](../_handoff/VAULT/contexts/governance/depth-discipline/EXT-20260505-004-A-four-distinct-depth-level-semantics-and-unified-principle.md) — depth-discipline + PE.read_budget |
| **PAIN-TOKEN-R-VIOLATION** | Violating B_TOKEN_BUDGET R1-R5 (default L1 / model tier / /compact / /clear / tool-output-summary-first) | AI ignores rules under load | Per [B_TOKEN_BUDGET](./behavioral-contracts.md) memory entry 40 |

### Class C — Cross-session / cross-chat pains

| ID | Pain | Cause | Mitigation |
|---|---|---|---|
| **PAIN-CHAT-JUMP-DEGRADATION** | Context lost when new chat opens | New AI lacks prior-chat context; HANDOFF insufficient | Chat-jump-prompt LEAN per memory entry 43 + HANDOFF Zone A/B/C/D + receipt-signature |
| **PAIN-N-TO-1-CHAT** | Multiple sessions in one chat after close | Forgetting chat-vs-session distinction | Per memory entry 28; once §17 attestation signed, chat closes for new-session work |
| **PAIN-PROTOCOL-COMPRESSION** | Skipping closing-protocol items under time pressure | "I'll just write a brief handoff" | Per memory entry 11 + transcribe-every-protocol-item-to-TodoWrite at session-open |
| **PAIN-SUBAGENT-FABRICATION** | Subagent claims work it didn't do | Subagent hallucination + AI not verifying | Per memory entry 3 (B_VALIDATE_BEFORE_ASSUME) + always cite tool-call evidence in same response |

### Class D — Operational friction pains (CSP file #6 §3 patterns)

| ID | Pain | Cause | Mitigation |
|---|---|---|---|
| **PAIN-PERMISSION-POPUP** | Permission popups for `.claude/**` writes interrupt user | Blind Write/Edit on protected paths | Per memory entry 44 (feedback_diff_before_protected_path_writes.md) — diff first + ask + WAIT |
| **PAIN-SETTINGS-MID-SESSION** | Mid-session settings.json edits create permission loops | Settings edits at non-boundary | Per memory entry 38 — batch at session-open OR session-close |
| **PAIN-COMPOUND-COMMAND-FAIL** | Bash hook intercepts `git commit && git push` mid-chain | Compound commands break unexpectedly | Separate steps; verify commit landed before push |
| **PAIN-PS5-EM-DASH** | PowerShell 5.1 parser error on em-dash in scripts | Non-ASCII punctuation in PS scripts | ASCII-only in PS scripts |
| **PAIN-TODO-WRITE-NOISE** | "TodoWrite hasn't been used recently" reminders interrupt | Reminders fire every turn | Treat as advisory; CSPS discipline takes precedence |

### Class E — Validation / drift pains

| ID | Pain | Cause | Mitigation |
|---|---|---|---|
| **PAIN-CLOSED-ENUM-DRIFT** | Frontmatter values not in declared closed enum | AI guessing instead of consulting canonical | Per [frontmatter-closed-enums.md](./frontmatter-closed-enums.md) + memory entry 41 |
| **PAIN-FALSE-ZF-0** | Claiming ZF-0 without re-running validator | Memory of earlier run ≠ validation | Per memory entry 7 + B_RZF re-run-IS-the-proof |
| **PAIN-NOMINAL-RZF** | Closing summary RZF block without §10.0 verify ran | "I think it passed" without running | Per memory entry 20 + B_PRE_CLOSE_VERIFICATION mandatory gate |
| **PAIN-SKILL-WILDCARD** | New SKILL.md location not in validate-aap-frontmatter SKILL_PATHS | New skill folder not added to glob | Per memory entry 42 + multi-location AAP coverage |

### Class F — Validator false-positive (FP) classes (5 known per CSP file #2 §10)

> **NEW S009 L1.5 per Q4=B reuse-first — engraved here as Class F instead of standalone false-positive-classes.md leaf.** Per [EXT-20260505-002-D §10](../_handoff/VAULT/contexts/governance/mechanical-completion/EXT-20260505-002-D-mechanical-completion-directive-D1-D10-false-lexicon.md) verbatim. Mandatory consultation BEFORE authoring any new validator (Phase 9 measurement validator S013 + future).

| ID | FP Class | Trigger | Mitigation template |
|---|---|---|---|
| **PAIN-FP1** | Documentation context FP | Validator flags retired token IN A DOC that documents what's retired (e.g., `frontmatter-closed-enums.md` mentions `lifecycle_state: draft` as the K=2 catch — validator scans and flags its own documentation) | Line-level scan ±2 lines for documentation indicators (markdown header context / code block / "as the catch" phrase / etc.); skip flag if context indicates documentation purpose |
| **PAIN-FP2** | Path-prefix vs entity-ID FP | Lowercase entity ID in file path is convention not violation (e.g., `extraction_id: EXT-20260505-001-A` flagged as "lowercase ID violation" when path itself has the ID) | Path-prefix exclusion regex; entity-ID-in-path is canonical not violation |
| **PAIN-FP3** | Multi-line vs single-line regex FP | Pattern matches across lines unintentionally (e.g., `\bdraft\b` matches `lifecycle_state:` on one line + `draft` on next line in YAML continuation) | Multi-line flag `(?m)` discipline + explicit line-anchor regex when single-line scan intended |
| **PAIN-FP4** | Brace escape FP | Curly braces in regex requiring escape for literal match (e.g., ripgrep `interface{}` requires `interface\{\}`) | ripgrep-pattern documentation in tool prompts + regex-literal-discipline at validator authoring |
| **PAIN-FP5** | Validator-on-validator self-reference FP | Validator's own commit body / frontmatter triggers its own checks (e.g., `frontmatter-closed-enum-drift-prevention` validator's own commit message mentions `lifecycle_state: draft` and triggers itself) | Same documentation-context exclusion as FP1; validator-self-exclusion path-glob (`tools/validators/**`) |

## §3 — How plans use this catalog

**Every plan declares applicable pains** in frontmatter OR §X section per [plan-creation-protocol.md §3 Step 4](./plan-creation-protocol.md):

```yaml
context_loss_prevention:
  consulted: docs/plan/pillar-0-governance/context-loss-pains.md
  applies_to_this_plan:
    - PAIN-D2: "Plan execution validators run at every IMPL_BATCH boundary"
    - PAIN-AUTO-COMPACT: "/compact at L<N>→L<N+1> transitions per B_TOKEN_BUDGET R3"
    - PAIN-CHAT-JUMP-DEGRADATION: "Chat-jump-prompt LEAN authored at close per memory 43"
  not_applicable:
    - PAIN-N-TO-1-CHAT: "Single-session task; no chat-vs-session boundary"
```

**Counterweight (don't bloat):** plan declares applicable pains only. Listing all 22 every time = noise. Per pain class:
- Class A (D1-D10) — most plans cite 2-3 most-relevant
- Class B (token) — multi-session plans always cite PAIN-AUTO-COMPACT + PAIN-MODEL-SWITCH
- Class C (cross-session) — plans crossing session boundaries cite PAIN-CHAT-JUMP + PAIN-PROTOCOL-COMPRESSION
- Class D (friction) — operational plans cite PAIN-PERMISSION-POPUP + PAIN-SETTINGS
- Class E (validation) — engraving plans cite PAIN-CLOSED-ENUM-DRIFT + PAIN-FALSE-ZF-0 + PAIN-NOMINAL-RZF

## §4 — Composition with audit framework

This catalog composes with audit-runner.md Pipeline 1 (governance):
- `plan-context-loss-section-present` audit (week-4) — every plan has the section
- `pain-id-references-resolve` audit (week-4) — referenced PAIN-* IDs exist in this catalog
- `pain-coverage-by-class` audit (per-quarter) — across all plans, which classes are most-cited (signals which pains are most-load-bearing)

## §5 — Maintenance

**Append-only catalog.** Existing PAIN-* IDs immutable. New pains get next ID + class.

**Adding a new pain:**
1. K=2 promotion check — has it occurred 2+ times? (Per [B_STRUCTURAL_PREVENTION_DISCIPLINE Q-2](./behavioral-contracts.md))
2. Engrave 5/5 atomic if structural fix needed (per FSE)
3. Append to this catalog with new PAIN-* ID + class assignment + mitigation cross-ref
4. Update plans that NOW must cite the new pain

**Retiring a pain (rare):** if mitigation is mechanical + drift-class fully closed, mark `RETIRED` in the table; preserve ID for historical reference.

## §6 — Cross-references

- [plan-creation-protocol.md](./plan-creation-protocol.md) — Step 4 references this catalog
- [csps-platform-dna.md](./csps-platform-dna.md) — DNA element "context-loss-discipline" (NEW per S008 turn 12)
- [behavioral-contracts.md](./behavioral-contracts.md) — many pains map to existing B_* contracts
- [extractions-ledger.md](../_intake/extractions-ledger.md) — pains sourced from CSP extracts (file #2 D1-D10 + file #6 §3 patterns)
- Memory entries: 7 (re-run-is-proof) / 11 (protocol-compression) / 20 (pre-close-verification) / 38 (no-settings-edits) / 40 (token-budget) / 42 (skill-location) / 44 (diff-before-protected-paths)

**Catalog signature:** `S008-AI-context-loss-pains-catalog-v1.0-2026-05-05`
