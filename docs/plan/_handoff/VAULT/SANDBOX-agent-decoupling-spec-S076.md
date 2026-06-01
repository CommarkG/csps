---
id: csps.handoff.vault.sandbox-agent-decoupling-spec-s076
name: SANDBOX-agent-decoupling-spec-S076
description: >
  SANDBOX design spec for Foundation dim 3: AGENT-DECOUPLING.
  Covers 4 design surfaces — LAYER-SPLIT / AGENT-DELETION-TEST /
  GENERALIZE-FLOORS-OFF-ROLES / EXECUTOR-CONTRACT — plus 3 scenario
  simulations (one-agent / different-model / CI-verifier).
  NO code, NO migrations until Opus ratifies. Source: AGENT-DECOUPLING-ARCHITECTURE-S075.md.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: sandbox
quality_state: draft
next_review_at: "2026-06-15"
core_spine: ARCH
core_spines: [ARCH, GVRN, AI]
schema_anchor: vault_files
session: S076
authored_by: Sonnet S076
closure_owner: group:finky
closure_decision: "Opus OPIA ratifies spec before any code/wiring is written"
closure_by: "S076 after OPIA"
links:
  - { rel: source-vault, href: AGENT-DECOUPLING-ARCHITECTURE-S075.md }
  - { rel: hardwire-register, href: ../../../../tools/data/hardwire-register.yaml }
  - { rel: default-registry, href: ../../../../tools/data/default-correction-registry.yaml }
  - { rel: director-profile, href: inner-ai-defaults/director-seat-profile-S075.md }
consolidation_cross_refs:
  - tools/data/hardwire-register.yaml
  - tools/data/default-correction-registry.yaml
  - docs/plan/_handoff/VAULT/AGENT-DECOUPLING-ARCHITECTURE-S075.md
  - docs/plan/_handoff/VAULT/inner-ai-defaults/director-seat-profile-S075.md
---

# SANDBOX: Agent-Decoupling Design Spec (Foundation dim 3)

## Context: Why this exists
Source: Governor S075 (DPR-4) + AGENT-DECOUPLING-ARCHITECTURE-S075.md.
The platform accreted machinery COUPLED to the specific Opus/Sonnet two-agent arrangement.
If that arrangement changes (one agent / different models / CI verifier), several governance surfaces
break or become theater. This spec designs the path to proper decoupling — four design surfaces,
then three simulation scenarios to prove the design survives agent-swap.

---

## DESIGN SURFACE 1 — LAYER-SPLIT

### Proposed Field
Every governance artifact's YAML frontmatter gains one field:

```yaml
layer: system      # model-agnostic — survives any agent swap
# OR
layer: scaffold    # current Opus/Sonnet arrangement — explicitly DISPOSABLE
```

Rule: **`scaffold` frontmatter must include `disposable_if: arrangement_changes`.**
No scaffold artifact may be load-bearing for a system validator, hook, or principle.

### Classification Map (definitive — not exhaustive)

#### SYSTEM layer (model-agnostic, permanent)
| Artifact | Location | Reason |
|----------|----------|--------|
| All principles (P-META-*, P-ARCH-*, P-OPER-*) | `.csps/principles/` | Intent-level, executor-neutral |
| All validators (`tools/validators/*.mjs`) | `tools/validators/` | Gate the WORK, not the role |
| `verify.mjs` | `tools/verify.mjs` | Model-agnostic quality gate |
| Schema (ZModel, Prisma) | `libs/policies/` | Data is model-agnostic |
| Satisfaction-point-registry | `tools/data/` | Defines DONE for any executor |
| Threshold router | `.csps/threshold/` | Routes intent, not identity |
| D1-D12 (universal LLM training defaults) | `default-correction-registry.yaml` | Applies to ANY LLM |
| All pre-tool-use hooks that gate WORK | `.claude/hooks/pre-tool-use-*.sh` | Gate actions, not identities |
| git history, vault files, principles | various | Permanent store, not chat-dependent |
| External-integration-registry | `tools/config/` | Platform health, model-agnostic |
| Hardwire floors (ONCE generalized off roles — see Surface 3) | `hardwire-register.yaml` | Becomes model-agnostic after generalization |

#### SCAFFOLD layer (arrangement-specific, DISPOSABLE)
| Artifact | Location | Why scaffold | What replaces it at decoupling |
|----------|----------|-------------|-------------------------------|
| `opus-turn.md`, `sonnet-turn.md` | `tools/council/` | Role-specific relay files | Any RELAY format (file/CI artifact/stdout) |
| `post-tool-use-proto-inline.sh` | `.claude/hooks/` | Fires only in Opus/Sonnet tabs | Executor-agnostic RELAY hook |
| `post-tool-use-sonnet-relay-inline.sh` | `.claude/hooks/` | Sonnet-specific | Executor-agnostic relay |
| `post-tool-use-handoff-relay-inline.sh` | `.claude/hooks/` | Tab-transfer between roles | Executor-agnostic handoff |
| `pre-tool-use-council-address-required.sh` | `.claude/hooks/` | "I AM: Opus" check | Remove or replace with generic executor-id |
| OPIA protocol (session docs) | `_handoff/` | Requires two-role review | Single-executor SEAL gate |
| `director-seat-profile-S075.md` | `VAULT/inner-ai-defaults/` | Director-role-specific defaults | No equivalent needed if one-agent |
| D13 (doc-feels-like-mechanism) | `default-correction-registry.yaml` | Universal? — see NOTE below | Keep as SYSTEM (borderline) |
| D14 (unverified-agreement) | `default-correction-registry.yaml` | Already executor-agnostic | Keep as SYSTEM |
| **D15** (pasted-command-as-go) | `default-correction-registry.yaml` | Director-specific framing | Generalize to "executor reviewing runnable artifacts" |
| **D16** (builder-drift-acceptance) | `default-correction-registry.yaml` | Director-specific | Remove or generalize to "any verifier catching drift" |
| **D17** (verdict-inflation) | `default-correction-registry.yaml` | Director-specific | Remove — not meaningful for single-agent |
| **D18** (cascade-approval) | `default-correction-registry.yaml` | Director-specific | Remove — not meaningful for single-agent |
| **D19** (scope-expansion-under-LGTM) | `default-correction-registry.yaml` | Director-OPIA-specific | Remove or generalize to "scope guard on any batch" |
| HARDWIRE-008 AS FRAMED ("director verdict") | `hardwire-register.yaml` | Director-framed floor | Generalize (Surface 3) |
| HARDWIRE-009 (Sonnet relay format) | `hardwire-register.yaml` | Sonnet-specific relay format | Executor-agnostic relay format |
| `comments-before-code` hook trigger ("PROTO") | `.claude/hooks/` | Multi-batch PROTO = scaffold concept | Generalize to "batch intent declared before code" |

**NOTE on D13**: D13 (doc-feels-like-mechanism) fires on "writing a doc without wiring" — this is universal
(not role-specific). Classify as SYSTEM.

### Validation Design (spec-level — not yet written)
A new validator `validate-layer-split.mjs` would:
1. Scan all YAML frontmatter for `layer:` field
2. Report ADVISORY for any governed artifact missing `layer:`
3. Report BLOCKING if any scaffold artifact is referenced from a system validator
4. Report BLOCKING if any scaffold artifact is registered in SP-registry as a DONE criterion

**Block-test design** (not yet implemented):
```
# Attempt to register scaffold artifact as system dependency
# validator should exit 1 with: "[layer-split] scaffold artifact referenced from system surface — BLOCKING"
```

---

## DESIGN SURFACE 2 — AGENT-DELETION-TEST

### The Test Definition
A runnable checklist that answers: "If I delete the scaffold and swap to one-agent/CI, does the
durable system still enforce quality?"

### Proposed Deletion Test (checklist form — script not yet written)

**PRECONDITION**: Run `pnpm verify` → expect exit_code=0 (baseline).

**Step 1 — Disable scaffold hooks** (simulation only — comment out, not delete)
- Disable: `pre-tool-use-council-address-required.sh`
- Disable: `post-tool-use-proto-inline.sh`
- Disable: `post-tool-use-sonnet-relay-inline.sh`
- Disable: `post-tool-use-handoff-relay-inline.sh`

**Step 2 — Remove scaffold relay files** (simulation only — rename to `.bak`)
- `tools/council/opus-turn.md` → `opus-turn.md.bak`
- `tools/council/sonnet-turn.md` → `sonnet-turn.md.bak`

**Step 3 — Run quality gates**
```
pnpm verify                         # must still exit_code=0
```

**Step 4 — Run claim-without-evidence test**
```
# Submit a state-claim (DONE/SEAL) without citing tool evidence
# Pre-tool-use-rzf-evidence-gate.sh must still BLOCK → exit 1
```
Expected: BLOCKING. If it passes → system is coupled to council channel.

**Step 5 — Run pre-commit gate test**
```
# Attempt commit without B_* compliance
# pre-commit-bstar-engraving-gate.sh must still BLOCK → exit 1
```
Expected: BLOCKING. If it passes → system is coupled to OPIA flow.

**Step 6 — Run threshold routing test**
```
node tools/threshold/route.mjs --simulate "I want to build a new feature"
# must route without council input
```
Expected: Routing works. If it breaks → coupled to two-agent intake.

**PASS CRITERIA**: Steps 3-6 all behave as expected.
**FAIL CRITERIA**: Any step passes when it should BLOCK, or breaks when it should route.
If FAIL → that surface is scaffold-coupled and must be generalized before decoupling.

### Proposed Script Signature (not yet implemented)
```
node tools/validators/agent-deletion-test.mjs --simulate
# Runs Steps 1-6 in simulation mode, restores scaffold artifacts
# Reports: PASS (fully decoupled) | FAIL (list of coupled surfaces)
```

---

## DESIGN SURFACE 3 — GENERALIZE FLOORS OFF ROLES

### The Problem
HARDWIRE-008 current framing: *"Director verdict cites a re-run."*
HARDWIRE-009 current framing: *"Sonnet relay format — fenced block + Paste-ready header."*

These floors are correct in principle but wrong in scope — they are framed on roles that may not exist.

### The Generalization

**HARDWIRE-008 → Proposed reframe**:
> "ANY state-claim (DONE / SEAL / RATIFIED / ACCEPTED / BLOCKED) — by ANY executor (human, Opus,
> Sonnet, one agent, CI, Governor) — MUST cite THIS-SESSION tool evidence in the same message."

Enforcement surfaces (already exist, need de-roling):
- `validate-nominal-rzf-detector.mjs` — currently ADVISORY for "director verdict without citation"
  → Reframe check pattern to "any state-claim keyword without tool citation"
  → Remove `director` from detection signal language
- `pre-tool-use-rzf-evidence-gate.sh` — already executor-agnostic in detection
  → No change needed; already fires regardless of role
- `pre-tool-use-state-claim-gate.sh` — already generic
  → No change needed

**HARDWIRE-009 → Proposed reframe**:
> "ANY relay from executor A to executor B uses: fenced code block + paste-ready header.
> The relay FORMAT is mandatory; the executor names are scaffold (vary by arrangement)."

Enforcement surfaces:
- `post-tool-use-sonnet-relay-inline.sh` — rename to `post-tool-use-executor-relay-inline.sh`
  → Remove "Sonnet" from header; use `EXECUTOR_RELAY_FROM` env var or generic header
  → Keep the fenced-block + paste-target format as SYSTEM

**D14 (unverified-agreement)** — already executor-agnostic:
> "AI accepts a factual claim without independently re-running a tool."
→ No change needed. This IS the generalized HARDWIRE-008 floor.

**D15-D19** — reclassify as scaffold:
- D15 (pasted-command-as-go): reframe as "any executor reviewing runnable artifacts pre-execution"
- D16 (builder-drift-acceptance): scaffold — only meaningful with a separate director role
- D17 (verdict-inflation): scaffold — only meaningful with a verdict-issuing role
- D18 (cascade-approval): scaffold — only meaningful with a multi-batch OPIA pattern
- D19 (scope-expansion-under-LGTM): scaffold — only meaningful with OPIA approval pattern

**COMMENTS-BEFORE-CODE trigger**:
Current: fires on "multi-batch PROTO" (scaffold concept).
Proposed generalization: "any batch of ≥4 files requires a written intent declaration BEFORE code
begins — regardless of format (PROTO, PLAN-ITEM, or single-agent memo)."
→ The MECHANISM is correct. The trigger (PROTO) is scaffold. Separate them.

### Registry Change (spec-level — no file writes yet)
`default-correction-registry.yaml` gains a `layer:` field per default:
- D1-D14: `layer: system`
- D15: `layer: system` (generalized — applies to any executor reviewing runnable artifacts)
- D16-D19: `layer: scaffold`
`hardwire-register.yaml` rows gain `layer:` field per item.

---

## DESIGN SURFACE 4 — EXECUTOR CONTRACT

### The Contract (model-agnostic)

```
CSPS EXECUTOR CONTRACT v1.0
Applies to: Opus, Sonnet, one-agent, different-model, CI verifier, Governor
Any executor satisfying this contract may participate in CSPS quality governance.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLAUSE 1 — CITE EVIDENCE
  Every state-claim (DONE / SEAL / VERIFIED / ACCEPTED / BLOCKED) includes
  a THIS-SESSION tool result proving it. Memory of a prior run ≠ evidence.
  Enforced by: validate-nominal-rzf-detector.mjs (T2) + pre-tool-use-rzf-evidence-gate.sh (T1)

CLAUSE 2 — VERIFY-BEFORE-SEAL
  Before any SEAL/DONE/RATIFIED claim: verify.mjs exit_code=0 cited.
  Enforced by: post-stop-pnpm-verify.sh (T1) + validate-push-status.mjs (T2)

CLAUSE 3 — THRESHOLD-ROUTING
  Every new intent: threshold routing before implementation begins.
  Enforced by: pre-tool-use-plan-coverage-gate.sh (T1) + validate-completion-before-new.mjs (T2)

CLAUSE 4 — SP-REGISTRY-COMPLIANCE
  Every completion checked against satisfaction_point.verify_mechanically before marking done.
  Enforced by: post-stop-exists-not-equals-active.sh (T1) + satisfaction-point-registry (T2/T3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### How the Current Opus/Sonnet Council Fits
The council (Opus director + Sonnet builder + OPIA + relay hooks) is ONE IMPLEMENTATION of this contract.
It is the **mutual-review amplifier** — it adds quality by having one executor independently re-derive
what the other claimed. That is an AMPLIFIER ON TOP of Clause 1, not a replacement for it.

```
EXECUTOR CONTRACT (floor)
        │
        ├─ Opus/Sonnet council (amplifier — current impl) ← scaffold, disposable
        ├─ One-agent + self-review loop (alternative impl)
        └─ CI verifier + human spot-check (alternative impl)
```

The contract guarantees the floor. The council raises quality above the floor. If the council goes away,
the floor remains enforced by the four clauses.

### Validator Design (spec-level)
A new `validate-executor-contract.mjs` would:
1. Check that each clause has a registered T1+T2+T3 enforcement surface
2. Report BLOCKING if any clause has 0 active T1 hooks
3. Report ADVISORY if any clause has only scaffold enforcements (no system-layer enforcement)

---

## SCENARIO SIMULATIONS

### Scenario A — ONE-AGENT (no council)

**Setup**: One Claude instance. No opus-turn.md / sonnet-turn.md. No OPIA. No relay hooks.

**What SURVIVES (system layer holds)**:
- `pnpm verify` → all system-layer validators run, exit_code=0 enforced
- `pre-tool-use-rzf-evidence-gate.sh` → blocks state-claims without evidence (Clause 1)
- `pre-tool-use-plan-coverage-gate.sh` → blocks un-planned work (Clause 3)
- Threshold routing → works (routes intent regardless of who's routing)
- Pre-commit hooks → gate code quality regardless of who commits
- D1-D12 → universal LLM defaults still fire against a single Claude instance
- SP-registry → checks DONE mechanically, not by role

**What BREAKS or becomes theater**:
- Council-address check (`I AM: Opus/Sonnet`) → hook fires but no meaningful enforcement
- OPIA approval format → no second agent to provide independent re-derivation
- HARDWIRE-008 AS FRAMED → "director verdict" means nothing; the CLAUSE 1 floor remains
- D16-D19 → scaffold defaults, no director to misfire them
- `post-stop-consolidation-pass.sh` → references "Sonnet reports to Governor" — theater only
- Relay hooks (proto-inline / sonnet-relay) → never fire, cluttering session

**Gap requiring design**:
The OPIA independent re-derivation (quality amplifier) has no equivalent for one-agent.
Options: (1) mandatory self-review cycle before any SEAL (loop tool / verify re-run),
         (2) human spot-check on state-claims,
         (3) CI verifier replaces OPIA gate.
**→ Design choice for council ratification, not resolved here.**

**Verdict**: Durable system holds. Quality amplifier lost. Floor survives, ceiling drops.

---

### Scenario B — DIFFERENT MODEL (e.g., Gemini Ultra + Claude Haiku)

**Setup**: Two agents but neither is Opus-16 or Sonnet-4.6. Different training distributions.

**What SURVIVES (system layer holds)**:
- `pnpm verify` → model-agnostic; any executor runs `node tools/verify.mjs`
- All validators → run in CI/shell, not inside the model; fully model-agnostic
- Schema / ZModel / Prisma → model-agnostic
- Satisfaction-point-registry → model-agnostic
- D1-D12 → UNIVERSAL LLM training defaults; Gemini/Claude Haiku both have eager-helpfulness,
  authority-pleasing, etc. (different magnitudes but same class). Counter-instructions still valid.
- Threshold routing → model-agnostic routing logic
- git hooks → model-agnostic

**What BREAKS**:
- `pre-tool-use-council-address-required.sh` → checks "I AM: Opus" / "I AM: Sonnet" by name;
  Gemini would never emit these → hook blocks every turn → **false blocking**
- Director-seat-profile (D15-D19) → framed on Opus patterns; Gemini director may have different
  native defaults. D15-D19 counter-instructions reference "director" Opus-specifically.
- HARDWIRE-008 "director verdict" → Gemini playing director doesn't know about this HARDWIRE
  unless it's in context — the floor is verbal, not mechanical.
- HARDWIRE-009 "Sonnet relay format" → would need to become "Gemini relay format" etc.

**Gap requiring design**:
The council-address hook must gate on "executor identifies itself" (any name) not on
"executor says I AM: Opus or Sonnet". Replace static-name check with: "response identifies
the executor role (director/builder/CI) regardless of model name."
**→ Design choice for council ratification.**

**Verdict**: Durable system holds. Several scaffold hooks become false-blockers. Requires
hook generalization before model swap, not after.

---

### Scenario C — CI-VERIFIER (automated pipeline, no LLM)

**Setup**: GitHub Actions or similar. No AI. `pnpm verify` runs on every PR. Humans spot-check.

**What SURVIVES (system layer holds)**:
- `pnpm verify` → runs in CI, exit_code gates merge; ALL system validators run
- Pre-commit hooks → git hooks run on every commit regardless of who commits
- Schema migrations → blocked by migration validators in CI
- Validator test-required gate → `pre-commit-validator-test-required.sh` runs on commit
- Threshold routing → human-triggered (Governor routes manually); not CI's job but not broken
- SP-registry → can be read by CI to generate checklist; DONE criteria explicit

**What BREAKS**:
- Everything in `.claude/hooks/` → these are Claude Code hooks, NOT git hooks; CI doesn't run them
- D1-D19 defaults → meaningless without an AI actor
- OPIA → meaningless without AI
- Relay files → meaningless without AI

**Critical insight**: The OVERLAP between `.claude/hooks/` (AI gates) and `pre-commit hooks` (git gates):
- `pre-commit-*.sh` → run by git during commits → CI-compatible
- `pre-tool-use-*.sh` → run by Claude Code only → NOT CI-compatible
- **Any floor that lives ONLY in `pre-tool-use-*.sh` has zero CI coverage.**

Gap: Clause 1 (cite evidence) is enforced by `pre-tool-use-rzf-evidence-gate.sh` — a Claude Code hook.
CI cannot run this. For CI to enforce Clause 1, `validate-nominal-rzf-detector.mjs` must become BLOCKING
(currently ADVISORY) — then CI runs verify.mjs which catches evidence-less SEAL claims in commit messages.

**→ Design choice for council ratification: promote validate-nominal-rzf-detector to BLOCKING in verify.mjs.**

**Verdict**: System core holds in CI (schema/validators/pre-commit). Claude Code hooks are invisible to CI.
Making validate-nominal-rzf-detector BLOCKING closes the gap.

---

## OPEN QUESTIONS FOR COUNCIL RATIFICATION

**Q1 — One-agent quality amplifier**: What replaces OPIA for one-agent scenario?
Options: (a) mandatory self-review cycle, (b) human spot-check, (c) CI verifier gate.
**Governor's call.**

**Q2 — Council-address hook generalization**: Replace static-name check with role-identification check.
Proposed: hook looks for "executor identifies role" not "executor names itself Opus/Sonnet".
**Design approval needed.**

**Q3 — validate-nominal-rzf-detector promotion**: Promote from ADVISORY → BLOCKING in verify.mjs
to give CI coverage of Clause 1. Current advisory count (S076 verify: 51 advisories from
boundary_prompt_format). Impact: this validator adding BLOCKING entries affects exit_code.
**Threshold decision: promote immediately or after boundary_prompt_format is cleared?**

**Q4 — D15-D19 reclassification**: Mark D15-D19 as `layer: scaffold` in registry.
D16/D17/D18/D19 become advisory-scaffold (no system validator depends on them).
D15 generalized to "executor reviewing runnable artifacts" → stays SYSTEM.
**Confirm classification.**

**Q5 — COMMENTS-BEFORE-CODE trigger generalization**: Current hook fires on "multi-batch PROTO".
Proposed: fires on "batch of ≥4 files, intent declaration required regardless of format".
**Confirm scope of generalization.**

---

## PROPOSED IMPLEMENTATION ORDER (council ratifies before any code)

After Opus OPIA ratifies this spec:

**Phase A — Classification (no code, low risk)**
1. Add `layer:` field to `default-correction-registry.yaml` (D1-D19)
2. Add `layer:` field to `hardwire-register.yaml` (rows)
3. Add `layer:` to scaffold relay file frontmatter (opus-turn.md, sonnet-turn.md)

**Phase B — Generalize floors (low risk)**
4. Reframe HARDWIRE-008 in hardwire-register.yaml: remove "director" from description
5. Reframe `validate-nominal-rzf-detector.mjs` detection pattern: remove "director" reference
6. Update HARDWIRE-009 to executor-agnostic relay format (rename hook, generalize header)

**Phase C — Agent-Deletion-Test (medium risk)**
7. Write `validate-agent-deletion-test.mjs` (simulation mode — restores artifacts after test)
8. Block-test the deletion test itself
9. Register in verify.mjs

**Phase D — Executor Contract formalization**
10. Write `validate-executor-contract.mjs` (checks 4 clauses have system-layer T1+T2)
11. Add EXECUTOR-CONTRACT.md to docs/architecture/
12. Block-test: remove T1 hook for Clause 1 → validator exits 1

**Phase E — Council-address generalization** (requires Q2 answer)
13. Reframe `pre-tool-use-council-address-required.sh` from name-check to role-check
14. Update block-test

**STOP CONDITION**: All five phases complete + `pnpm verify` exit_code=0 + Agent-Deletion-Test PASS
→ dim 3 SEALED.

---

## AUTHOR / SEAL STATUS
- Author: Sonnet S076
- Status: SANDBOX — awaiting Opus OPIA ratification
- Source: AGENT-DECOUPLING-ARCHITECTURE-S075.md (Governor DPR-4, S075)
- No code written. No validators changed. Spec only.
- Next: STOP → Sonnet reports → Opus OPIA → ratify or course-correct
