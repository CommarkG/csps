---
id: csps.handoff.S076-to-S077
name: HANDOFF-S076-to-S077
description: >
  S076 close → S077 open. S076 = Foundation dims 1-4 (1+2+3 SEALED, 4 spec+phase1+2) +
  CQS Alignment Layer + boundary-crossing HARDWIRED + EXTENDED tier. 
  CRITICAL: Foundation-first. Apps only after ALL 4 dims proven + load gate passes.
  S077 opens with: Q3 promotion (DIM3-01 behavioral), UUID migration (2026-06-16),
  dim-4 Surface 2 quota, CQS Phase 1 build.
version: 1.0
session: S076
authored_by: Sonnet S076
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
core_spines: [GVRN, AI, ARCH, VALD]
schema_anchor: vault_files
links:
  - { rel: extraction, href: VAULT/session-S076-extraction.md }
  - { rel: dim4-spec, href: VAULT/sandbox-specs/SANDBOX-multi-tenant-scale-readiness-spec-S076.md }
  - { rel: cqs-spec, href: VAULT/sandbox-specs/SANDBOX-cqs-alignment-layer-S076.md }
  - { rel: boundary-spec, href: VAULT/sandbox-specs/SANDBOX-boundary-crossing-protocol-S076.md }
  - { rel: hardwire-register, href: ../../tools/data/hardwire-register.yaml }
  - { rel: boundaries-register, href: ../../tools/data/boundaries-register.yaml }
  - { rel: cqs-sets, href: ../../tools/config/cqs-sets.yaml }
---

# HANDOFF S076 → S077

## ZONE A — IMMEDIATE (§0 PASTE TARGET)

## SONNET STARTUP BLOCK

YOU ARE: Sonnet S077, builder
I AM: S076 closing session
THIS IS: S076→S077 handoff. Foundation dims 1-4 complete (1+2+3 SEALED, 4 spec+phase1+2).
YOUR TASK: Run 4 first actions, answer alignment questions, await Opus direction.

You are Sonnet S077, builder.

**Previous session**: S076 — Foundation dims 1-4 (1+2+3 SEALED, 4 spec+phase1+2) + CQS Alignment Layer.

**Verify first**:
```bash
node tools/verify.mjs --skip-install  # must exit 0
node tools/verify.mjs --skip-install --extended  # confirms 8 EXTENDED validators
```

**What S076 completed**:
- dim 2 PART 3 SEALED (6 defects fixed, Governor block-tests A+B confirmed)
- dim 3 agent-decoupling SEALED (structural; FINDING-S076-DIM3-01 pending Q3)
- dim 4 spec (5 surfaces) + Phase 1 (connection-pool) + Phase 2 (RLS budget) EXTENDED
- CQS Alignment Layer: cqs-sets.yaml (3 pilots) + question-library.md + NP1 gate
- Boundary-crossing HARDWIRED: boundaries-register.yaml + T1+T2
- EXTENDED tier: 8 structural validators weekly (verify --extended)
- Calendar enforcement: validate-finding-scheduling.mjs + must_address_by_date

**S077 first actions** (in priority order):
1. Run cross-tab-diff-review: `node tools/scripts/cross-tab-diff-review.mjs --role sonnet`
2. Check gap-recurrence-register for k≥3 open entries (BLOCK if any)
3. Check improvement-register.yaml for not_yet_propagated entries
4. Read opus-turn.md TOP for any pending PROTO from Opus-17

**Hard rules (inherited)**:
- Foundation-first: apps only after ALL 4 dims proven + 30-app load gate passes
- boundary-crossing protocol: 5 steps before changing any value in boundaries-register.yaml
- EXTENDED tier: 8 validators run weekly (--extended or --deep triggers them)
- Calendar enforcement: UUID migration due 2026-06-16 (gap_DIM2_CORE_ID_UUID_UPGRADE)
- verify=0 required before any SEAL/DONE/RATIFIED claim
- "Opus, this is Sonnet." at every Opus response

**Active governance files**:
- `tools/data/boundaries-register.yaml` — boundary-001 (verify-cap-200), boundary-002 (L1-spine-5)
- `tools/config/cqs-sets.yaml` — 3 CQS pilot sets + universal PP0
- `tools/data/hardwire-register.yaml` — 9 hardwire items (HARDWIRE-001 to HARDWIRE-009)

---

## ZONE B — CONTEXT

### What S076 accomplished

S076 was the foundation completion session. The S075 scorecard entered S076 with:
dim 1 SEALED · dim 2 pending · dim 3 vaulted · dim 4 undesigned

S076 exits with:
- dim 1 ✅ (S075)
- dim 2 ✅ SEALED — 6 defects, Governor live run, block-tests at correct gates
- dim 3 ✅ SEALED structural (behavioral pending Q3+FINDING-S076-DIM3-01)
- dim 4 ◑ 5-surface spec + Phase 1+2 + EXTENDED tier

Additionally:
- Simulation spine registered (VALD)
- CQS Alignment Layer (DNA-as-questions, dual-polarity, 3 pilots)
- Boundary-crossing protocol HARDWIRED
- Calendar enforcement for dated obligations
- EXTENDED tier (weekly cron for structural invariants)
- Accountability wiring (6 registers CIE+PE)
- Calendar gate: UUID migration 2026-06-16

### Key decisions (Governor-ratified in S076)
1. dim-2 id-type: Option A (keep TEXT, defer native-UUID to dim-4 by 2026-06-16)
2. subscriptionStatus: 'free' deprecated; free-tier = 'active' + planId=null
3. dim-4 Q2: connection_limit=1 standard; override requires documented reason
4. dim-4 Q4: RLS budget 10ms provisional; ratchet to 5ms post-UUID migration
5. simulation: VALD spine entry, NOT a 6th L1 spine
6. CQS unification: 4 alignment initiatives → 1 engine
7. verify-cycle cap: HELD at 200; EXTENDED tier resolves the architectural pressure
8. boundary-crossing: rigid META (5-step), flexible OBJECT (the value)

---

## ZONE C — SCOPE (S077 likely work)

### PRIORITY 1: Q3 + FINDING-S076-DIM3-01 (after clean window)
When validate-nominal-rzf-detector has 0 false positives across A-E sessions:
- Promote ADVISORY→BLOCKING in verify.mjs
- Upgrade validate-agent-deletion-test.mjs Step 4 to behavioral negative control
- These ship in ONE commit (FINDING-S076-DIM3-01 closure)

### PRIORITY 2: UUID migration (hard date: 2026-06-16)
- Governor runs ALTER TABLE one-transaction (text→uuid, all id + FK columns)
- schema.zmodel: restore @db.Uuid on Base/AppendOnlyBase + FK fields
- validate-uuid-column-types.mjs: promotes advisory→blocking after migration
- Deadline calendar-enforced by validate-finding-scheduling.mjs

### PRIORITY 3: dim-4 Surface 2 quota validator
- Awaits Governor Q1 (Supabase tier) + Q6 (libs/platform-quota approval)
- When answered: validate-tenant-quota-policy.mjs — checks app middleware registered
- First bottleneck at 30 apps: no quota enforcement (Surface 2 is the highest-risk gap)

### PRIORITY 4: CQS Alignment Layer Phase 1
- validate-cqs-coverage.mjs from tools/wip/ → tools/validators/
- Add block-test + register in verify.mjs (using boundary-crossing protocol first!)
- dna-registry.yaml full validation for dna_element references (Q4)

### PRIORITY 5: boundary_crossing_protocol → STANDARD
- T2 validator is EXTENDED; promoting to STANDARD is the first worked example of the protocol
- Use 5-step: surface → Governor approve → assess (first-of-many? it is!) → schedule EXTENDED tier → record

### DEFERRED (S077+): dim-4 load-test harness, cie-pe-adapter Phase 2, instruction-integrity CQS sets

---

## ZONE D — REFERENCE

### Foundation scorecard (end of S076)
| Dim | Status | Note |
|-----|--------|------|
| 1 governance | ✅ SEALED S075 | B1-B5 complete |
| 2 PART 3 schema | ✅ SEALED S076 | 6 defects, Governor confirmed |
| 3 agent-decoupling | ✅ SEALED structural | ⏳ behavioral pending Q3 |
| 4 multi-tenant scale | ◑ spec + phase 1+2 | Phases 3-5 + load gate remain |

### Open obligations with deadlines
| Obligation | Deadline | Register |
|-----------|---------|---------|
| UUID migration text→uuid | 2026-06-16 (calendar) | gap_DIM2_CORE_ID_UUID_UPGRADE |
| subscriptionStatus 'free' DB enum cleanup | dim-4 window | dim-2 carry-forward |
| Q3 rzf-detector promotion | next clean window | FINDING-S076-DIM3-01 |
| dim-4 Surface 2 quota | Governor Q1+Q6 | SANDBOX-multi-tenant-scale... |
| CQS Phase 1 | S077 | CQS-ALIGNMENT-LAYER-S076 |
| boundary_crossing_protocol → STANDARD | S077 | BOUNDARY-CROSSING-PROTOCOL-S076 |

### Key files created in S076
- `tools/data/boundaries-register.yaml` (2 boundaries)
- `tools/config/cqs-sets.yaml` (3 pilot CQS sets)
- `tools/vault/wisdom/question-library.md` (named gap closed)
- `docs/architecture/EXECUTOR-CONTRACT.md` (4-clause model-agnostic)
- `.github/workflows/verify-extended.yml` (weekly EXTENDED cron)
- `docs/plan/_handoff/VAULT/sandbox-specs/SANDBOX-*.md` (5 sandbox specs)
- `tools/wip/validate-cqs-coverage-S077.mjs` (S077 build)

### Active hooks added S076 (registered in settings.json)
- `pre-tool-use-boundary-crossing-gate.sh` (T1 boundary protection)
- `pre-commit-layer-classification-gate.sh` (NP1 fix: D-defaults require layer:)
- `pre-tool-use-check-existing.sh v1.1.0` (PP0 on AskUserQuestion+EnterPlanMode)

### Validators status (EXTENDED tier — run weekly/pre-seal)
layer_split · agent_deletion_test · executor_contract · register_connectivity ·
connection_pool_contract · rls_perf_budget · uuid_column_types · boundary_crossing_protocol

---

## ALIGNMENT QUESTIONS

For Sonnet S077 to confirm before acting:

Q1: Scope — Has S077 run `cross-tab-diff-review.mjs --role sonnet` and absorbed all S076 commits (163b655b → 41b16e2f)?
Q2: Boundary — Is S077 clear that apps are BLOCKED until ALL 4 foundation dims proven + 30-app load gate passes?
Q3: Priority — What is the single most urgent S077 obligation? (calendar deadline — not the most exciting)
Q4: Q3-gate — Does S077 understand that rzf-detector promotion requires a "clean window" AND ships WITH deletion-test Step 4 in one commit?
Q5: UUID — gap_DIM2_CORE_ID_UUID_UPGRADE is due 2026-06-16. What does S077 do when that date arrives without a fix?
Q6: CQS — Can S077 cite the difference between tools/config/cqs-sets.yaml and tools/vault/wisdom/question-library.md?
Q7: Boundary — Before changing verify-cycle-cap (boundary-001), what 5 steps must S077 follow?
Q8: EXTENDED — The 8 EXTENDED validators do NOT run in default verify. When DO they run?
Q9: dim-4 quota — Surface 2 quota is the highest-risk dim-4 gap. What is S077 blocked on for this?
Q10: Close gate — Has S077 run verify=0 THIS SESSION and cited exit_code before any SEAL/DONE/RATIFIED claim?

## §17 TWO-SIDED HANDSHAKE ATTESTATION

```yaml
handoff_attestation:
  prior_session: S076
  next_session: S077
  attested_by: Sonnet S076
  attested_at: "2026-06-02T23:59:00.000Z"
  intent: "Foundation dims 1-4 complete (3 sealed, 4 spec+phase1+2). CQS Alignment Layer established. Close cleanly; S077 opens with Q3 + UUID + dim-4 Surface 2."
  constraints_decisions:
    - "dim-2 Option A: TEXT ids kept; UUID migration due 2026-06-16 (calendar-enforced)"
    - "dim-3 behavioral seal pending Q3 + FINDING-S076-DIM3-01 Step 4"
    - "dim-4 Surface 2 blocked on Governor Q1+Q6"
    - "verify cycle cap HELD at 200; EXTENDED tier resolves pressure"
    - "CQS build S077; spec + pilots + question-library.md committed S076"
  open_items_deferred:
    - { id: "Q3-promotion", sla: "next clean window", register: "FINDING-S076-DIM3-01" }
    - { id: "UUID-migration", sla: "2026-06-16", register: "gap_DIM2_CORE_ID_UUID_UPGRADE" }
    - { id: "dim-4-quota", sla: "after Governor Q1+Q6", register: "SANDBOX-multi-tenant..." }
    - { id: "cqs-phase1", sla: "S077", register: "CQS-ALIGNMENT-LAYER-S076" }
    - { id: "boundary-protocol-standard", sla: "S077", register: "BOUNDARY-CROSSING-PROTOCOL-S076" }
  evidence:
    - { claim: "verify=0", evidenced_in: "node tools/verify.mjs --skip-install → exit_code=0 (2026-06-02)" }
    - { claim: "dim-2 SEALED", evidenced_in: "OPUS-17 OPIA commit 5fde0c26 block-tests A+B at correct gates" }
    - { claim: "dim-3 SEALED structural", evidenced_in: "agent-deletion-test PASS 6/6 commit 163b655b" }
    - { claim: "dim-4 Phase 1+2", evidenced_in: "commits b4f44a70 (pool) + 5f63e8fb (RLS+UUID EXTENDED)" }
    - { claim: "CQS foundations", evidenced_in: "commit 7488bd82 cqs-sets.yaml + NP1 gate BT exit 1" }
    - { claim: "78 hooks present", evidenced_in: "verify-hooks-functional.sh present=78 missing=0" }
  signature: "S076-AI-attest-2026-06-02-foundation-complete-cqs-aligned"
```

**Receipt format for S077**: `S077-AI-receipt-<iso>-against-S076-AI-attest-2026-06-02-foundation-complete-cqs-aligned`
