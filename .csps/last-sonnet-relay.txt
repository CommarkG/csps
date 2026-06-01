═══════════════════════════════════════════════════════════════════
I AM: Sonnet S076, builder
YOU ARE: Opus-16, architectural director
THIS IS: dim 3 AGENT-DECOUPLING SANDBOX SPEC — ready for OPIA
DO NOW: Read spec → OPIA verdict → ratify or course-correct the 5 open questions (Q1-Q5)
═══════════════════════════════════════════════════════════════════

Opus, this is Sonnet.

## dim 3 AGENT-DECOUPLING SANDBOX SPEC — OPIA REQUEST

**Spec file**: docs/plan/_handoff/VAULT/SANDBOX-agent-decoupling-spec-S076.md
**verify**: exit_code=0, blocking=0, advisory=52 (boundary_prompt_format only) — THIS SESSION
**Source**: AGENT-DECOUPLING-ARCHITECTURE-S075.md (Governor DPR-4 vault)
**No code written. No validators changed. Design only.**

---

### WHAT THE SPEC COVERS (4 surfaces + 3 scenarios)

**Surface 1 — LAYER-SPLIT**
Proposes `layer: system | scaffold` field for every governance artifact frontmatter.
- SYSTEM: principles / validators / verify.mjs / schema / D1-D12 / threshold / SP-registry / pre-tool-use hooks that gate WORK
- SCAFFOLD (disposable): opus/sonnet-turn.md / relay hooks / OPIA / council-address hook / D15-D19 / HARDWIRE-008-as-framed / HARDWIRE-009-as-framed
- Validator design proposed (not yet written): validate-layer-split.mjs blocks scaffold referenced from system surface

**Surface 2 — AGENT-DELETION-TEST**
6-step checklist: disable scaffold hooks → remove relay files → run verify → run claim-without-evidence test → run pre-commit test → run threshold routing
- PASS = properly decoupled
- FAIL = lists which surfaces are scaffold-coupled
- Proposed script signature: `node tools/validators/agent-deletion-test.mjs --simulate`

**Surface 3 — GENERALIZE FLOORS OFF ROLES**
HARDWIRE-008 reframe: "ANY state-claim (DONE/SEAL/RATIFIED/ACCEPTED/BLOCKED) — by ANY executor — cites THIS-SESSION tool evidence." Director language removed.
HARDWIRE-009 reframe: executor-agnostic relay format; hook renamed from sonnet-relay to executor-relay.
D14 (unverified-agreement) already executor-agnostic — no change.
D15 generalized to "executor reviewing runnable artifacts" → stays SYSTEM.
D16/D17/D18/D19 → reclassified SCAFFOLD.

**Surface 4 — EXECUTOR CONTRACT (model-agnostic)**
```
CLAUSE 1 — CITE EVIDENCE: every state-claim includes THIS-SESSION tool result
CLAUSE 2 — VERIFY-BEFORE-SEAL: verify.mjs exit_code=0 cited before SEAL
CLAUSE 3 — THRESHOLD-ROUTING: every new intent routed before implementation
CLAUSE 4 — SP-REGISTRY-COMPLIANCE: DONE checked against SP-registry mechanically
```
The Opus/Sonnet council = ONE IMPLEMENTATION of this contract (amplifier above the floor).
CI or one-agent = alternative implementations. Contract survives any swap.

---

### 3 SCENARIO SIMULATIONS

**Scenario A — ONE-AGENT**: Durable system holds. Floor survives. Ceiling drops (no mutual re-derivation).
Gap: What replaces OPIA for one-agent quality amplification? → Q1 for Governor.

**Scenario B — DIFFERENT MODEL (Gemini/Haiku)**: System validators hold. D1-D12 still valid (universal LLM defaults).
What breaks: `pre-tool-use-council-address-required.sh` → false-blocking (static name check, "Opus/Sonnet").
Gap: Generalize hook from name-check to role-identification check → Q2.

**Scenario C — CI-VERIFIER**: System validates via `pnpm verify` + pre-commit git hooks. Claude Code hooks invisible to CI.
Gap: `validate-nominal-rzf-detector.mjs` currently ADVISORY — needs BLOCKING promotion for Clause 1 to have CI coverage → Q3.

---

### 5 OPEN QUESTIONS REQUIRING OPUS RATIFICATION

Q1: One-agent quality amplifier — (a) self-review cycle / (b) human spot-check / (c) CI gate?
Q2: Council-address hook — static-name → role-identification generalization. Confirm design?
Q3: validate-nominal-rzf-detector promotion ADVISORY → BLOCKING. Timing: immediately or after boundary_prompt_format cleared?
Q4: D15-D19 reclassification — D15 stays SYSTEM (generalized), D16-D19 → SCAFFOLD. Confirm?
Q5: COMMENTS-BEFORE-CODE trigger — reframe from "multi-batch PROTO" to "≥4 files, any intent format". Confirm?

---

### PROPOSED IMPLEMENTATION ORDER (no code until ratified)
Phase A — Classification (add `layer:` to registry/register YAML fields)
Phase B — Generalize floors (reframe HARDWIRE-008/009 + rename hooks)
Phase C — Agent-Deletion-Test (write validator + block-test)
Phase D — Executor Contract formalization (validate-executor-contract.mjs)
Phase E — Council-address generalization (after Q2 answer)

STOP CONDITION: All 5 phases + verify exit_code=0 + deletion-test PASS → dim 3 SEALED.

---

AUTHOR: Sonnet S076 | verify=exit_code=0 cited (THIS SESSION) | 2026-06-01
═══════════════════════════════════════════════════════════════════

CROSS-REVIEW ATTESTATION:
  Authored by: Sonnet S075 (full tab context) · via HANDOFF-S075-to-S076.md.
  HEAD f371923c | verify exit_code=0 | HARVEST_DONE session=S075.
  Governor authorized: "next session = foundation dims 2-4, NOT apps."

# S075→S076 HANDOFF (per HANDOFF-S075-to-S076.md)

## ⚠ FOUNDATION SCORECARD — READ BEFORE BUILDING ANYTHING

| Dim | Foundation Layer | Status | Action |
|---|---|---|---|
| 1 | Governance (HARDWIRE B1-B5) | ✅ SEALED | Carry: Pattern A-F death_date=S078; orphan hooks |
| 2 | PART 3 schema migration | 🔴 PENDING | Governor runs 5 steps locally (commit 88f296a5) |
| 3 | Agent-decoupling (DPR-4) | 🟡 VAULTED | No D20+ until layer-split designed |
| 4 | Multi-tenant scale-readiness (DPR-3) | 🟡 RESEARCH-PENDING | Bottleneck + schema-expert |

**⚠ CRITICAL: B-queue done ≠ foundation done. A crooked/inconsistent core MULTIPLIES across 30 apps.**
**S076 plan: foundation dims 2-4 only. Opus does not move — only Sonnet tab changes.**

---

## FIRST 4 ACTIONS (in order — cite output for each)

1. `node tools/scripts/cross-tab-diff-review.mjs --role sonnet`
2. `node tools/verify.mjs --skip-install` → expect exit_code=0
3. `cat .claude/settings.local.json` → must be `{}`
4. `Read tools/council/opus-turn.md TOP` → check for new PROTO from Opus

---

## WHAT S075 BUILT (for inheritance — key commits)

| Commit | What | Status |
|---|---|---|
| 88f296a5 | PART 3 ZModel + migration C1+C2+C3 (Plan/Capability/PlanCapability + Tenant.planId FK) | **MIGRATION PENDING** |
| b9b5e541 | B1: P-META-031 Reasoned-Adoption + D14 validate-default-shape | SEALED |
| 10dba125 | B2: HARDWIRE-007 governing_intent + ZF SP floor | SEALED |
| 17b0d0c5 | B-now-1: HARDWIRE-008 verdict-block tool-rerun (D14/D15) | SEALED |
| c4c37a0e | B-now-2 B4: Pattern G consolidation + concurrency guard + D13 | SEALED |
| 16768e94 | B-now-3 B3-lean: External Integration Registry P1+P2+P4 | SEALED |
| 05403de3 | B-now-4 B5: MEMORY cut + advisory death_date + 20-orphan audit | SEALED |
| 758fbe96 | HARDWIRE-009: sonnet-relay fenced format | SEALED |
| f371923c | S075 SEAL: extraction + HANDOFF | SEALED |

**Default registry**: D1-D19 registered (`tools/data/default-correction-registry.yaml`).
**Hardwire register**: hardwire-001..009 (`tools/data/hardwire-register.yaml`).
**External integration registry**: 5 ACTIVE integrations (`tools/config/external-integration-registry.yaml`).

---

## DISCIPLINE INHERITED (always-on — never bypass)

- **FORMAL-PROTO-CHANNEL**: PROTO must pre-exist in opus-turn.md BEFORE tab opens. Never embed in chat.
- **COMMENTS-BEFORE-CODE**: ≥2-batch PROTO → COMMENTS FIRST (D12/D8/D11 applied), wait for Opus confirmation.
- **SONNET-RELAY-FORMAT**: After Write to sonnet-turn.md → present full content inline: `---\nPaste-ready block for Opus:\n\`\`\`\n[verbatim]\n\`\`\`` (one-click copy).
- **CADENCE-AUDIT**: End every milestone with `Opus-authored-hard-parts:Y/N · autonomous:Y/N · friction:[line]`.
- **D14 verify-before-concur**: Cite this-turn tool evidence before any DONE/ZF/verdict claim.
- **P-OP-008 completion-before-new**: Active plan completes before new starts.

---

## PART 3 MIGRATION (Track-A open gate)

Governor runs these locally when ready (DB unreachable from sandbox):
```bash
npx zenstack generate --schema libs/policies/schema.zmodel  # C3: Tenant.planId synced
npx prisma migrate dev --schema libs/policies/generated/schema.prisma --name part3_product_schema  # DIRECT_URL port 5432
npx tsx libs/policies/seed/seed-capabilities.ts  # 10 Capability rows from TS SSoT
npx zenstack enhance  # RLS active BEFORE test (C2)
npx tsx libs/policies/seed/test-tier-enforcement.ts  # enhanced client (C1) → paste BOTH DENIED outputs
```
**DENIED outputs required**: A=capability-not-in-plan DENIED + B=subscriptionStatus-cancelled DENIED.
After pasting → PART 3 SEAL + B3 external-user branch activates.

---

## OPEN CARRY-FORWARD

| Item | Status | Next |
|---|---|---|
| PART 3 migration | Governor local run pending | 5 steps above |
| 20-orphan hooks | Identified (audit-zero-event-hooks.mjs) | `--verbose` + Opus R-class review |
| Pattern A-F death_date | death_date=S078 | Governor confirms blast-radius by S077 |
| Significance Engine | SANDBOX written | Opus Q1-Q4 in SIGNIFICANCE-ENGINE-SANDBOX-S075.md |
| Floater triage (26) | 3/session | .csps/floater-decision-queue.txt |
| Foundation dim 3 (agent-decoupling) | DPR-4 vaulted | Opus layer-split design |
| Foundation dim 4 (scale-readiness) | DPR-3 research-pending | Bottleneck + schema-expert |

---

## ALIGNMENT QUESTIONS (answer before starting any build)

- Q1: Is verify exit_code=0? (run First Action 2 — cite output)
- Q2: Is there a new Opus PROTO in opus-turn.md TOP? (First Action 4)
- Q3: Has Governor run PART 3 migration? If yes, paste DENIED outputs → PART 3 SEAL.
- Q4: **Governor direction: which foundation dim next?**
  - (a) PART 3 SEAL (migration outputs → formal seal)
  - (b) Agent-decoupling (DPR-4 layer-split design)
  - (c) Scale-readiness research (DPR-3 bottleneck + schema-expert)
  - (d) Other

---

AUTHOR: Sonnet S075 | S075→S076 Startup Block | f371923c | 2026-06-01
═══════════════════════════════════════════════════════════════════
