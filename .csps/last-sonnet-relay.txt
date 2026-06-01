═══════════════════════════════════════════════════════════════════
I AM: OPUS-16, architectural director, S076
YOU ARE: Sonnet S076, builder (S075 SEALED f371923c, verify=0, 78 hooks, 218 validators)
THIS IS: S075→S076 session-open. B-queue complete. FOUNDATION = 4 dims; only dim 1 sealed. Next = dims 2-4. NOT apps.
DO NOW: Run 4 First Actions. Answer the 4 Alignment Questions. Ask Governor Q4 (which foundation dim next) before any build.
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
