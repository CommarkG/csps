---
id: csps.handoff.vault.topic-plan.enforcement-rate-uplift
name: enforcement-rate-uplift
description: >
  Close the two governance coverage gaps opened by S019 Opus review:
  (1) enforcement_rate 6% → 25% — wire live mechanical enforcement to
  inner-AI-defaults behavioral overrides that already have live hooks or small
  buildable validators; (2) drift_coverage 57% → 71% — promote conceptual-ai-drift
  from partial→active by extending the freshness validator with a behavioral-quality
  check. Executed in one continuous shot: audit → fix citations → build validators →
  update registries → ZF. Composition rationale: both gaps are on the same
  governance layer (AI behavior coverage) and share the same test surface
  (pnpm verify + validate-inner-ai-defaults-enforcement-rate.mjs).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
impl_status: swift-implemented
template_used: gradual-build-plan
template_version: 1.0
template_status: stable
core_spine: VALD
core_spines: [VALD, AI, GVRN]
schema_anchor: topic_plans
session: S020
topic_id: enforcement-rate-uplift
priority_score: 89
priority_band: 1
multi_session_arc: [S021]
alignment_verified_session: S020
know_how_consulted: true
execution_mode: balanced
depth_chosen: 3
depth_rationale: |
  depth-3 chosen:
  - leverage: HIGH — 31 inner-AI-defaults entries affected; enforcement_rate is session-close invariant
  - cross-actor: LOW — no customer-facing code; no schema migrations; no cross-persona impact
  - reversibility: HIGH — all changes are additive (updating citation strings + small validators)
  - multi_session_cost: LOW — single S021 session; 2 tracks in parallel
  - dependency-graph: SHALLOW — depends only on existing inner-ai-defaults files + post-stop hooks
  depth-4 rejected: no schema changes, no cross-spine architectural decisions
  depth-5 rejected: no Opus-level synthesis required; all paths are specified
backtrack_register:
  - trigger-id: hook-not-covering-expected-pattern
    action: >
      If reading post-stop-banned-phrase.sh reveals it does NOT ban the expected
      pattern → move that entry from Track A (citation update) to Track B (build validator)
      Rebalance L2 workload estimate before continuing.
  - trigger-id: enforcement-rate-arithmetic-off
    action: >
      If after all fixes enforcement_rate still < 25% → audit the validator's
      LIVE_INDICATORS regex against updated entries; regex may need extension.
      Do NOT claim target hit without pasting the tool output.
  - trigger-id: freshness-validator-change-breaks-verify
    action: >
      If extending validate-inner-ai-defaults-freshness.mjs causes pnpm verify exit_code 1
      → revert to read-only investigation; do not ship a broken validation.
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:ai-agent
  - maturity:stable
diataxis_type: how-to
links:
  - { rel: parent, href: ./README.md }
  - { rel: spec-source, href: ../sonnet-task-list-S020.md }
  - { rel: enforcement-validator, href: ../../../../tools/validators/validate-inner-ai-defaults-enforcement-rate.mjs }
  - { rel: inner-ai-defaults, href: ../inner-ai-defaults/ }
  - { rel: drift-registry, href: ../../../../tools/config/drift-registry.yaml }
  - { rel: sap-protocol, href: ../../../plan/pillar-0-governance/sonnet-audit-protocol.md }
domain_path: platform
scope_level: S1
context_question: "What is the current depth level of this topic plan, and have all prior depth gates been verified clean before proceeding to the next level?"
---
## §0 — CONSOLIDATION CHECK (mandatory — read before any implementation)

CHECK WHAT EXISTS before any implementation step in this plan.
- Search: tools/validators/ for existing validators covering this area
- Search: tools/generators/ for existing generators
- Search: .claude/hooks/ for existing hooks
- Search: docs/plan/pillar-0-governance/audit-runner.md for registered slugs
- Search: docs/plan/_handoff/VAULT/topic-plans/ for overlapping plans
- Search: libs/ for existing integrations and patterns

Consolidation finding: [update with findings when implementing each step]



# Enforcement Rate Uplift Plan
## enforcement_rate 6% → 25% + drift_coverage 57% → 71%
## Single-session execution — S021

---

## §0 — Triad Governance Check

**Consequential decisions:**

| Decision | Context layer | Principle | Mechanical enforcer |
|---|---|---|---|
| Marking an entry "live" when only a hook (not .mjs) covers it | AI L2 — inner-defaults domain | P-META-019 (structural prevention) — is a hook sufficient? | validate-inner-ai-defaults-enforcement-rate.mjs classifies live vs deferred |
| Extending validate-inner-ai-defaults-freshness.mjs to cover behavioral quality | VALD L2 — coverage discipline | P-META-006 (RZF) — extension must not degrade existing coverage | pnpm verify exit_code gate |
| Which entries qualify as "live" (hook vs .mjs threshold) | GVRN L2 — decision rights | B_VALIDATE_BEFORE_ASSUME — confirm hook ACTUALLY catches the pattern before updating | post-stop hook output; read hook file content first |

**VLTs required:** None — all decisions are within Sonnet authority at `execution_mode: balanced`. No schema changes, no new behavioral contracts, no cross-actor impact.

**Config hierarchy:** No hierarchical configs touched. EXPLICIT_OVER_IMPLICIT not triggered.

---

## §KH Know-How Consultation (B_KNOW_HOW_DISCIPLINE)

**1. Duplication check:** Scanned existing topic-plans — no existing plan targets enforcement_rate uplift specifically. `platform-core-alignment.md` (S018) addressed CDP + GDE + infrastructure alignment but not inner-AI-defaults enforcement coverage. This plan is net-new scope.

**2. Validator existence check:** `validate-inner-ai-defaults-enforcement-rate.mjs` already exists and runs in pnpm verify. This plan ADDS live validators / citation fixes to entries it monitors — not rebuilding the monitor itself. No duplication with drift-registry work (different axis: behavioral enforcement vs. structural drift).

**3. Scope boundary:** Track A (citation fixes) and Track B (new validators) are complementary. Track A fixes measurement accuracy; Track B adds genuine new coverage. Both are required to hit 25% — neither duplicates the other.

**4. Infrastructure needed:** No new infrastructure. All required surfaces exist: inner-AI-defaults files, enforcement-rate validator, post-stop hooks, verify.mjs pipeline, audit-runner.md. This plan wires and corrects, does not build new platform foundations.

**5. Hook equivalence question:** Whether a post-stop `.sh` hook counts as "live mechanical enforcement" equivalent to a `.mjs` validator is a genuine open question addressed explicitly in L1 audit gate — resolved by reading hook content + confirming the enforcement-rate validator's LIVE_INDICATORS regex accepts it.

---

## §1 — Foundation: Audit All 29 Deferred Entries (L1)

**Objective:** Categorize every deferred entry before touching anything. No writes at this level.

**Step 1.1 — Read all 4 inner-AI-defaults files:**
- `docs/plan/_handoff/VAULT/inner-ai-defaults/prose-patterns.md`
- `docs/plan/_handoff/VAULT/inner-ai-defaults/output-distribution.md`
- `docs/plan/_handoff/VAULT/inner-ai-defaults/code-patterns.md`
- `docs/plan/_handoff/VAULT/inner-ai-defaults/reasoning-patterns.md`

Extract each entry's `name` + `caught_by_validator` value → build the categorization table.

**Step 1.2 — Read all live hooks to confirm coverage:**
- `.claude/hooks/post-stop-banned-phrase.sh` — what phrases does it actually ban?
- `.claude/hooks/post-stop-link-discipline.sh` — what patterns does it flag?

Cross-reference: which deferred entries are covered by these running hooks?

**Step 1.3 — Categorize into 3 tracks:**

| Track | Criterion | Action |
|---|---|---|
| **Track A — Citation fix** | Entry has a live hook that provably covers it; `caught_by_validator` says `impl deferred` | Update `caught_by_validator` to reference the live hook with `(LIVE — hookname.sh)` |
| **Track B — Build validator** | Entry has no live mechanism but the pattern is mechanically detectable in .mjs | Build a minimal validator (ADVISORY, exits 0) |
| **Track C — Exempt** | Entry requires human judgment; mechanical detection would be imprecise or misleading | Add to `EXEMPT_ENTRIES` in enforcement-rate validator with documented reasoning |

**Step 1.4 — Emit the categorization table before any writes:**

```
CATEGORIZATION COMPLETE (L1 gate evidence):
Track A (citation fix): [N entries]
  - [entry_name]: covered by [hook_file], confirming by reading hook
Track B (build validator): [N entries — target: 4-6]
  - [entry_name]: pattern [describe], buildable via [approach]
Track C (exempt): [N entries]
  - [entry_name]: reason [why human-judgment only]

Arithmetic check:
  current live: 2
  Track A additions: +N
  Track B additions: +N (after builds)
  Total live after L2: N
  enforcement_rate after L2: N/31 = X%
  Reaches 25% target: YES/NO
```

**L1 exit criteria:**
- [ ] All 4 inner-AI-defaults files read
- [ ] Both hook files read (content confirmed, not assumed)
- [ ] Categorization table emitted with arithmetic check showing path to 25%
- [ ] If arithmetic check shows target NOT achievable: surface as FINDING before L2
- [ ] `pnpm verify` exit_code=0 (no writes yet; baseline confirmed)

---

## §2 — Build: Execute Both Tracks (L2)

**Depends on:** L1 categorization table + arithmetic check confirming 25% is achievable.

### Track A — Citation Updates

For each Track A entry:
1. Read the hook file content (already done at L1)
2. Confirm the hook's ban-pattern covers the entry's default behavior
3. Edit the entry's `caught_by_validator` field: replace `(registered; impl deferred)` with `(LIVE — [hookname.sh])` — the `LIVE` keyword is what the enforcement-rate validator detects

**Quality gate per citation update:** Re-run `node tools/validators/validate-inner-ai-defaults-enforcement-rate.mjs` after each Track A batch to confirm the live count increases. Do NOT batch all 6 updates and verify once at the end.

### Track B — Validator Builds

**Target: 4 validators** (exact list determined at L1, these are the expected candidates):

**B1: `validate-prose-no-confirmation-seeking.mjs`**
- Scans: `tools/verify-last-run.md` + any session artifacts for confirmation-seeking tail patterns
- Detects: "shall I proceed?", "would you like me to", "should I continue?", "do you want me to", "is that OK?", "ready for me to"
- Exit: ADVISORY (0) — reports count and location
- Wires: `caught_by_validator` for `prose-confirmation-seeking`

**B2: `validate-prose-clickable-links.mjs`**
- Scans: `tools/verify-last-run.md` for backtick-wrapped file paths without markdown link format
- Detects: `` `path/to/file.ts` `` without `[text](link)` wrapping
- Exit: ADVISORY (0)
- Wires: `caught_by_validator` for `output-non-clickable-references`
- Note: `post-stop-link-discipline.sh` may already cover this → check at L1; if covered, this becomes Track A

**B3: `validate-tooling-parallel-tool-calls.mjs`**
- Scans: session artifacts for sequential tool call patterns that could run in parallel
- Detects: sequential Read calls to unrelated files (should be parallel)
- Exit: ADVISORY (0)
- Wires: `caught_by_validator` for `tooling-sequential-tool-calls`

**B4: Extend `validate-inner-ai-defaults-freshness.mjs`** ← drift_coverage upgrade
- Add check: `drift_log_last_updated` in `continuous-drift-log.md` is within 90 days
- Add check: all 4 inner-AI-defaults category files have `opus_pattern` field on at least 80% of entries (now 13/13 for reasoning-patterns ✓)
- Effect: promotes `conceptual-ai-drift` from `partial` → `active` in drift-registry
- Then: update `drift-registry.yaml` status for conceptual-ai-drift → active
- Coverage: 5/7 = **71%** ✓ target hit

**After all Track B builds:**
- Wire each new validator into `pnpm verify` CYCLES array
- Add audit-runner.md entry for each
- Run `pnpm audit-runner:split`

### Track B validation gate (per build-verification-map.yaml):

For each new `.mjs` file created:
- [ ] Coverage Levels header present (✓ Level 1 | ✗ Level 2 → VLT)
- [ ] audit-runner.md entry added
- [ ] `pnpm audit-runner:split` run
- [ ] `node tools/validators/validate-[name].mjs` output pasted
- [ ] `pnpm verify` exit_code=0 confirmed after each wire

**L2 exit criteria:**
- [ ] All Track A citation updates applied; enforcement-rate validator confirms each increase
- [ ] All 4 Track B validators created + wired + passing
- [ ] `validate-inner-ai-defaults-enforcement-rate.mjs` output shows live >= 8
- [ ] enforcement_rate >= 25% (paste tool output as evidence)
- [ ] `validate-drift-registry.mjs` shows coverage=71% (paste output)
- [ ] `pnpm verify` exit_code=0 (full run, paste last line)

---

## §3 — Seal: Registries + Session State (L3)

**Depends on:** L2 exit criteria all ✓ with tool outputs pasted.

**Step 3.1 — Update drift-registry.yaml:**
- `conceptual-ai-drift`: status `partial` → `active`
- validator: `validate-inner-ai-defaults-freshness.mjs`
- `meta.active`: 4 → 5
- `meta.partial`: 1 → 0
- `meta.coverage_percentage`: 57 → 71
- `meta.last_updated`: S021
- Run `node tools/validators/validate-drift-registry.mjs` → paste output confirming 71%

**Step 3.2 — Update session-state.json:**
```json
{
  "current_session": "S021",
  "s019_opus_artifacts": {
    "enforcement_rate_baseline": 25
  },
  "platform_state": {
    "pnpm_verify": "exit_code 0 (45+ validators)",
    "enforcement_rate": "25% — target hit S021"
  }
}
```

**Step 3.3 — Run SAP Abbreviated (Sweeps 2+5):**
- Drift: paste `validate-drift-registry.mjs` last line → coverage=71% status=ACCEPTABLE
- Enforcement: paste `validate-inner-ai-defaults-enforcement-rate.mjs` last line → rate=25%+
- Session-close invariants: both maintained ✓

**Step 3.4 — Run final pnpm verify:**
- Paste full output (or last 15 lines minimum)
- Confirm exit_code=0

**Step 3.5 — Commit:**
```
git commit -m "S021: enforcement_rate 6%→25% + drift_coverage 57%→71% — close S019 Opus gaps"
```

**L3 exit criteria:**
- [ ] drift-registry.yaml updated: active=5, coverage_percentage=71
- [ ] session-state.json updated with new baselines
- [ ] SAP Abbreviated Sweeps 2+5 completed with tool output
- [ ] `pnpm verify` exit_code=0 — final run pasted
- [ ] git commit created with correct message

---

## §6 — Priority Engine

```yaml
priority_engine:
  topic_id: enforcement-rate-uplift
  depth_chosen: 3
  inputs_per_level:
    L1_foundation:
      leverage: 9
      dependency_satisfied: 1
      reversibility: 10
      risk_of_rework: 2
      multi_session_cost: 0.3
      priority_score: 88
    L2_build:
      leverage: 9
      dependency_satisfied: 1
      reversibility: 8
      risk_of_rework: 4
      multi_session_cost: 0.5
      priority_score: 85
    L3_seal:
      leverage: 7
      dependency_satisfied: 1
      reversibility: 9
      risk_of_rework: 1
      multi_session_cost: 0.2
      priority_score: 82
  ranked_next_layers:
    1: L1 (no dependencies; read-only audit; no risk)
    2: L2 (after L1 categorization table emitted)
    3: L3 (after L2 enforcement_rate >= 25% confirmed)
  push_back_log:
    - rejected_attempt: >
        Batching all citation updates without reading hook files first
        (assumption that hook covers pattern without confirmation)
      reason: B_VALIDATE_BEFORE_ASSUME — must read hook content before claiming LIVE
    - rejected_attempt: >
        Running all Track B builds in parallel before L1 categorization
      reason: foundation-stability-before-layer-N — L1 audit determines which validators to build
```

---

## §7 — Cross-layer Audits

| Audit slug | What it catches | Pipeline |
|---|---|---|
| `inner-ai-defaults-enforcement-rate` | enforcement_rate regression | Pipeline 10 |
| `drift-registry` | drift_coverage regression | Pipeline 10 |
| `audit-slug-coverage` | new validators not registered | Pipeline 3 |
| `slice-freshness` | audit-runner.md modified without split | Pipeline 3 |
| `frontmatter-validate` | new files without valid frontmatter | Pipeline 1 |

---

## §8 — Backtrack Triggers

| Trigger | What surfaces it | Action |
|---|---|---|
| Hook doesn't cover expected pattern | Reading hook file at L1 reveals different ban-patterns than assumed | Move entry Track A → Track B; rebalance arithmetic |
| enforcement_rate arithmetic wrong | Tool output after L2 shows < 8 live | Audit LIVE_INDICATORS regex; check entry format |
| Freshness validator extension breaks verify | pnpm verify exit_code=1 after B4 | Revert extension; open VLT; document scope limitation |
| conceptual-drift registry update premature | validate-inner-ai-defaults-freshness doesn't yet run the new checks | Do NOT update drift-registry status until validator change is confirmed |

---

## §9 — Execution Sequence (S021)

| Turn | Level | Work | Estimated files |
|---|---|---|---|
| 1 | L1 | Read 4 inner-AI-defaults files + 2 hook files; emit categorization table | 0 writes |
| 2 | L2-A | Apply Track A citation updates (batch of 4-6 entries); verify after each pair | 2-4 files |
| 3 | L2-B | Build B1 + B2 validators; wire; run verify | 4-6 files |
| 4 | L2-B | Build B3 + B4 (freshness extension); wire; verify enforcement_rate >= 25% | 3-4 files |
| 5 | L3 | Update drift-registry; update session-state; SAP; final verify; commit | 3 files |

**Discipline:** never start L+1 before L ZF passes. If L1 categorization shows arithmetic doesn't reach 25% → surface FINDING and stop — do not proceed to L2 on optimism.

---

## §9.5 — Context-Loss Prevention

```yaml
context_loss_prevention:
  consulted: docs/plan/pillar-0-governance/context-loss-pains.md
  applies_to_this_plan:
    - PAIN-D2: >
        Categorization table at L1 prevents completion-feels-like-completion —
        arithmetic must confirm 25% before L2 starts; no optimism shortcuts
    - PAIN-AUTO-COMPACT: >
        If /compact fires mid-L2: L1 categorization table was emitted to chat;
        retrieve it from context before continuing. Track A and Track B lists
        are in the categorization table — don't rebuild from scratch.
    - PAIN-CHAT-JUMP-DEGRADATION: >
        Single-session plan — chat-jump unlikely. If it occurs:
        HANDOFF paste-target must include categorization table verbatim.
    - PAIN-FALSE-ZF-0: >
        Each Track B validator must be run individually with output pasted
        before claiming "validator built." pnpm verify alone is insufficient —
        must also paste the specific validator's standalone output.
    - PAIN-PROTOCOL-COMPRESSION: >
        TodoWrite used at session open with all 5 execution turns enumerated.
        Each turn marked complete only after tool output pasted — not after write.
  not_applicable:
    - PAIN-PERMISSION-POPUP: No .claude/* writes in this plan
    - PAIN-MODEL-SWITCH: Single model (Sonnet); no Haiku delegation needed
```

---

## §HARVEST

```yaml
harvest_triggers:
  - on: phase_gate
    collect:
      - which_entries_were_already_covered_by_hooks
      - which_validators_were_genuinely_missing
      - hook_vs_mjs_coverage_equivalence_decision
    destination: vault
    vault_path: docs/plan/_intake/vault/enforcement-rate-uplift/

  - on: discovery
    collect: [divergence_from_arithmetic, unexpected_hook_coverage_gaps]
    destination: raw-thoughts-queue

  - on: plan_close
    collect: [full_extraction_cycle, enforcement_rate_target_reached_pattern]
    destination:
      - extraction_note: docs/plan/_handoff/VAULT/session-S021-extraction.md
      - pattern_home: docs/plan/_handoff/VAULT/inner-ai-defaults/

harvest_questions:
  - "Which inner-AI-defaults entries are already covered by live hooks but incorrectly cited?"
  - "What is the minimum validator surface needed to reach 25% enforcement?"
  - "Does a hook count as 'live mechanical enforcement' equivalent to a .mjs validator?"
```

---

## §10 — Topic-Plan Attestation

```yaml
topic_plan_zf:
  ran_at: 2026-05-08T20:20:00Z
  cycles_run: 0
  findings:
    - Plan authored S020; execution begins S021
  status: PLAN-AUTHORED-AWAITING-EXECUTION
  signature: S020-AI-topic-plan-attest-2026-05-08T20:20:00Z-enforcement-rate-uplift-L0
```

---

## Paste-Target for S021 Session Open

```
CSPS Session S021 — execute enforcement-rate-uplift plan.
Plan: docs/plan/_handoff/VAULT/topic-plans/enforcement-rate-uplift.md
Goal: enforcement_rate 6%→25% + drift_coverage 57%→71% in one session.

MANDATORY first action: READ the plan §1 L1 steps BEFORE writing anything.
L1 = audit only (no writes). Emit categorization table. Confirm arithmetic reaches 25%.
THEN proceed to L2.

Key files:
- docs/plan/_handoff/VAULT/inner-ai-defaults/ (4 files — read all)
- .claude/hooks/post-stop-banned-phrase.sh (read content — confirm what it bans)
- .claude/hooks/post-stop-link-discipline.sh (read content)
- tools/validators/validate-inner-ai-defaults-enforcement-rate.mjs (baseline: 6%)
- tools/config/drift-registry.yaml (current: 57% active=4/7)

Current state: enforcement_rate=6% (2/31 live), drift_coverage=57% (4/7 active).
Target: enforcement_rate>=25% (8/31 live), drift_coverage>=71% (5/7 active).
pnpm verify baseline: exit_code=0, 45 validators.

Do NOT declare target hit without pasting tool output from validate-inner-ai-defaults-enforcement-rate.mjs.
```
