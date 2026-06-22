---
id: csps.handoff.HANDOFF-S087-to-S088
name: HANDOFF-S087-to-S088
description: "S087→S088 handoff. Phase-0.1 COMPLETE. RECEIPT-STABILIZE done (single-commit cadence, SSoT exclusion list). B_CONTEXT_CHECKPOINT_GATE 5-surface engraved. Phase-0.2 = Enforced-Universal-Threshold-Intake (threshold→PE→CIE), Opus seeds at S088 open."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
authored_by: Sonnet-S087
authored_at: "2026-06-22"
core_spine: GVRN
diataxis_type: reference
schema_anchor: vault_files
impl_status: session-close
precedent_checked: true
---

# HANDOFF S087 → S088

═══════════════════════════════════════════════════════════════════
I AM: Sonnet S087 (builder, closing)
YOU ARE: the next tab (Opus director or Sonnet builder)
THIS IS: no-drop inheritance of S087 — Phase-0.1 sealed + parks + Phase-0.2 directive pending
DO NOW: read this fully → run verify → confirm HEAD → await Opus seed for Phase-0.2
═══════════════════════════════════════════════════════════════════

## ZONE A — STATE (S087 CLOSE — FINAL)

| Key | Value |
|-----|-------|
| **verify exit_code** | 0 (Re-run to confirm; re-run IS the proof) |
| **HEAD** | `662089dc` (pushed to main) |
| **tree_hash** | `e181afc60c001cc4` |
| **blocking_set_hash** | `f3ba28e2145c55b8` |
| **validators_run** | 228 |
| **receipt_ts** | 2026-06-22T08:24:37.963Z |
| **SSoT exclusion list** | `tools/config/treehash-exclude.txt` — LIVE |
| **Single-commit cadence** | PROVEN (code+receipt in ONE commit, TWICE this session) |
| **Phase-0.1** | ✅ COMPLETE (all items disposed — see ZONE B) |
| **Phase-0.2** | PENDING Opus seed (threshold→PE→CIE as Enforced-Universal-Intake) |
| **PARK-009 hard gate** | 2026-06-27 — Supabase pw rotate + `prisma db push` (Phase 1) |
| **session** | S087 |

**FIRST ACTION (any new tab):**
```bash
node tools/verify.mjs --skip-install 2>&1 | tail -5
# then: node tools/validators/validate-green-receipt.mjs
```
Expected: `exit_code=0 tree_hash=e181afc6` or newer if auto-commits ran.

---

## ZONE B — COMPLETED THIS SESSION (SEALED — build ON these, do NOT rebuild)

### PROTO-S087-PAGE-COMPLETE (early session, before compact)
- `B_PAGE_COMPLETE`: 5-point page completeness prevention (nav-registered + fetch-resilient + hrefs-resolve + M-47-wired + scaffold-default)
- `validate-fetch-resilience.mjs` final fix (core-contamination removed; catch-without-param cleaned)
- `validate-page-completeness.mjs` engraved

### PROTO-S087-GREENUP+CHECKPOINT
- **Green-receipt design fix (0a):** tree_hash computed from `git ls-tree -r HEAD` (excluding receipt). Stable across receipt-only commits. `validate-green-receipt.mjs` updated to compare tree_hash.
- **session-state.json advanced to S087 (0b):** session_close_completeness PASS.
- **B_CONTEXT_CHECKPOINT_GATE 5-surface engraving (Step 1):**
  - T5 AGENTS.md hard-rule: B_CONTEXT_CHECKPOINT_GATE entry ~line 181
  - T4 Contract: `docs/plan/pillar-0-governance/context-checkpoint-gate.md` (created)
  - T3 Opus: `tools/council/opus-context.md` (B_CONTEXT_CHECKPOINT_GATE wired)
  - T3 Sonnet: `tools/council/sonnet-context.md` (B_CONTEXT_CHECKPOINT_GATE wired)
  - T3 Haiku: `tools/templates/haiku-spawn-template.md` (B_CONTEXT_CHECKPOINT_GATE wired)
  - T2 Backstop: `validate-agent-inheritance-parity.mjs` PASS blocking=0

### PROTO-S087-RECEIPT-STABILIZE
- **`tools/config/treehash-exclude.txt`** (CREATED) — SSoT exclusion list for tree_hash.
  Excludes: all `*-last-run.json`, session logs, verify outputs, `.csps/` relay files, `SESSION-BRIEF.md`, `governor-comments/`.
- **`tools/verify.mjs`** — switched to `git ls-files --stage` + exclusion list filter + normalize + sort. Reads `treehash-exclude.txt`.
- **`tools/validators/validate-green-receipt.mjs`** — same algorithm, identical `matchTreeExclusion` helper.
- **`audit-runner.md`** — green_receipt entry updated + `pnpm audit-runner:split` (28 slices).
- **PROVEN single-commit cadence:** `git add -A` → verify → `git add receipt` → ONE commit → `validate-green-receipt PASS`.
- **PARK-S086-053** (circular model-orchestration loop) — registered in park-register.yaml.
- **PARK-S087-001** (B_TWO_PARTY_SEAL) — registered in park-register.yaml.
- **Phase-0.1 COMPLETE** — OPUS-S087-MASTER-PLAN-5-SYSTEMS.md updated with changelog + all dispositions.

---

## ZONE C — OPEN OBLIGATIONS + CARRY-FORWARD PARKS

### ACTIVE PHASE GATE
- **PARK-009 db-push HARD GATE: 2026-06-27** — rotate Supabase pw → `prisma db push`.
  Unlocks: PARK-043 journey hardwires (Phase 2), system-5 schema, persistent journey-event write-path.
  Owner: Governor. Trigger: 2026-06-27. NEVER BUILD PARK-043 before this gate.

### PHASE-0.2 NEXT (Opus seeds at S088 open)
- **Enforced-Universal-Threshold-Intake** = PARK-S084-032 (Tab-Move Universal Input Pipeline)
  + System 1 in master plan (threshold as UNIVERSAL front-door for ALL inputs).
  Phase-0.2 scope: `threshold→PE→CIE` in-session loop on our OWN work. Opus sends seed at S088 open.

### OBLIGATIONS LEDGER — ALL OPEN PARKS WITH DISPOSITIONS

| Park ID | Name | Owner | Trigger | Phase |
|---------|------|-------|---------|-------|
| PARK-009 | Supabase pw rotate + db-push | Governor | 2026-06-27 (HARD GATE) | 1 |
| PARK-S084-032 | Enforced-Universal-Intake (Tab-Move Universal Pipeline) | Opus | S088 open — Phase-0.2 seed | 0.2 |
| PARK-S084-039 | Haiku MCP overflow blocker | Governor | Governor scopes/disables global MCP servers for CSPS | unblocked-by-restricted-spawn |
| PARK-S084-040 | Learning Orchestrator / D·W·M Improvement Loop | Opus | After PARK-039 resolved via restricted-tool Haiku; Phase 0.2/2 | 2 |
| PARK-S084-043 | Journey orchestrator hardwires (5 hardwires) | Sonnet | AFTER 2026-06-27 db-push (PHASE 2 gate) | 2 |
| PARK-S086-048 | Inline/modal/popup vs dedicated-page DNA axis | Sonnet-S088+ | PARK-043 journey-orchestrator build OR any new app-facing feature | 3 |
| PARK-S086-049 | Consolidation gaps A-F (incl. D-fold item D) | Opus→Sonnet | S088 opening: Opus schedules A-F; item D (audit pre-commit) first win | 0.2 residual |
| PARK-S086-050 | Insights signal definition | Governor | Governor defines "insight signal" before enforcing BLOCKING | Governor |
| PARK-S086-051 | Park-processing protocol (4-step standard) | Sonnet | BEFORE next PARK item enters active processing | 0.2 setup |
| PARK-S086-052 | Human-AI consumption gap + Trio concept | Opus | After PARK-043 + PARK-048 decided | 3 |
| PARK-S086-053 | Circular model-orchestration loop | Opus | After PARK-039 resolved (restricted-tool Haiku spawn) | 2 |
| PARK-S087-001 | B_TWO_PARTY_SEAL mechanization | Opus | S088 open — Opus sends mechanization seed | S088 |
| APP-001 | Voice Sorting App / STT capability | Governor | Separate app-build track; Governor pivots when platform core is stable | app-track |

**Haiku restricted-tool spawn (NEW ENABLER — not yet registered):**
> Spawning Haiku with ONLY file tools (no MCP injection) may resolve PARK-039 without Governor MCP config change.
> This enables: PARK-040 (Learning Orchestrator), PARK-053 (circular orchestration), PARK-026 (PE improvement loop).
> REGISTER AS PARK at S088 open if Opus confirms viability. Owner: Sonnet experiment → Opus ratify.

---

## ZONE D — FIRST ACTIONS FOR S088

### Opener sequence (Opus director tab)
1. Read `tools/council/opus-turn.md` — latest directive
2. Run `node tools/verify.mjs --skip-install && node tools/validators/validate-green-receipt.mjs`
   — confirm exit_code=0 + tree_hash matches
3. Check `tools/data/park-register.yaml` → PARK-S087-001 + PARK-S086-053 newly registered
4. Emit Phase-0.2 seed: threshold→PE→CIE chain as "Enforced-Universal-Threshold-Intake"
   (Opus sends WHO/WARRANT/ACTION one-click block to Sonnet)
5. Emit B_TWO_PARTY_SEAL seed (PARK-S087-001 trigger)
6. Schedule PARK-049 items A-F (Opus decides priority in the directive)
7. Emit CADENCE-AUDIT: what drifted in S087, what got structurally fixed

### Opener sequence (Sonnet builder tab)
1. Read `tools/council/opus-turn.md` top → get Opus Phase-0.2 directive
2. Read this HANDOFF fully
3. Run `node tools/verify.mjs --skip-install` → confirm exit_code=0
4. DO NOT start Phase-0.2 build before Opus seed arrives
5. While waiting: build PARK-051 (park-processing protocol, 4-step standard) — owner=Sonnet, trigger=before next PARK item

### WHAT NOT TO DO
- DO NOT build Phase-0.2 before Opus seed arrives (C2 direction-setting; cannot self-direct)
- DO NOT build PARK-043 (journey hardwires) before 2026-06-27 db-push HARD GATE
- DO NOT push on red (exit_code=1 = fix first)
- DO NOT compact with uncommitted changes (B_CONTEXT_CHECKPOINT_GATE: harvest → commit → compact)
- DO NOT fork an orchestrator — PARK-040/042/043 = one spine, three faces
- DO NOT start PARK-051 mid-build (build only when the active PARK item is complete or PARK-051 is first)

---

## ALIGNMENT QUESTIONS

**Q1 (restricted-tool Haiku unblock):** Spawn Haiku via `Agent(model='haiku')` with NO MCP tools declared — only file tools (Read/Grep/Glob/Bash only). Does this avoid the MCP overflow and unblock PARK-039? If YES → register enabler as PARK-S088-XXX and unlock PARK-040/053/026. Sonnet should test at S088 open (1-file activation test first).

**Q2 (PARK-051 build order vs. Phase-0.2):** PARK-051 trigger is "BEFORE next PARK item enters active processing." Does Opus want PARK-051 (park-processing protocol, 4-step standard) built as the VERY FIRST S088 item, before Phase-0.2 pipeline? Or is Phase-0.2 seed sufficient to proceed?

**Q3 (Phase-0.2 scope):** Is S088 Phase-0.2: (a) wire threshold→PE→CIE as ONE continuous in-session loop script, or (b) un-park each system individually (threshold pipeline first, PE second, CIE third, then wire them)?

**Q4 (B_TWO_PARTY_SEAL format):** For PARK-S087-001 mechanization — does Opus prefer: (a) extend `green-receipt.json` with a `director_countersign` field written by Opus verify runs, or (b) a separate `director-receipt.json` file? Both need a blocking validator. Opus sends seed with format choice.

---

## MOAT REVIEW (SEED-B S085)

**Moats touched this session:**

| Moat | Status | How touched |
|------|--------|-------------|
| B_DETERMINISTIC_GATE | ✅ Strengthened | tree_hash design: stable across receipt-only commits; git ls-files --stage replaces git ls-tree |
| B_CONTEXT_CHECKPOINT_GATE | ✅ Created | 5-surface engraving; checklist artifact; all 3 entry points; parity validator backstop |
| B_PAGE_COMPLETE | ✅ Strengthened | fetch-resilience fix (core-contamination removed); 5-point completeness rule active |
| validate-green-receipt | ✅ Strengthened | Single-commit cadence proven; SSoT exclusion list eliminates runtime-file churn |
| B_TWO_PARTY_SEAL | 🔲 Registered only | PARKED-to-S088 as PARK-S087-001 (mechanization seed needed from Opus) |
| Green-receipt ordering | ✅ Resolved | RECEIPT-STABILIZE removes the "two-commit tax"; one commit with code+receipt |

**At-risk moat:** B_TWO_PARTY_SEAL is still manual-only (no mechanization yet). Until PARK-S087-001 is built, Director must remember to counter-verify independently — the manual-safety-net pattern persists.

---

## SONNET STARTUP BLOCK

```
═══════════════════════════════════════════════════════════════════
YOU ARE: Sonnet S088 (builder)
I AM:    The S087 closing context via HANDOFF-S087-to-S088.md
THIS IS: S088 session open — Phase-0.1 sealed, Phase-0.2 pending Opus seed
YOUR TASK:
  1. Run: node tools/verify.mjs --skip-install 2>&1 | tail -5
     Expected: exit_code=0, tree_hash= (any — re-run is the proof)
  2. Run: node tools/validators/validate-green-receipt.mjs
     Expected: PASS blocking=0
  3. Read tools/council/opus-turn.md → get Opus Phase-0.2 directive
  4. WAIT for Opus seed before starting Phase-0.2 build (C2 — cannot self-direct)
  5. While waiting: consider PARK-051 (park-processing protocol) — Sonnet-owned, trigger=now
─────────────────────────────────────────────────────────────────
CRITICAL carries from S087:
  • tree_hash design: git ls-files --stage + tools/config/treehash-exclude.txt (SSoT)
  • Single-commit cadence: git add -A → verify → git add receipt → ONE commit
  • B_CONTEXT_CHECKPOINT_GATE active (5 surfaces; checklist: docs/plan/pillar-0-governance/context-checkpoint-gate.md)
  • Phase-0.1 COMPLETE; master plan HEAD: docs/plan/_handoff/OPUS-S087-MASTER-PLAN-5-SYSTEMS.md
  • PARK-009 HARD GATE: 2026-06-27 — no PARK-043 before this date
  • PARK-S087-001 registered: B_TWO_PARTY_SEAL (awaiting Opus seed)
  • PARK-S086-053 registered: circular model-orchestration loop (awaiting PARK-039 unblock)
─────────────────────────────────────────────────────────────────
WHO:     Sonnet S088 (builder) — confirm at first response
WARRANT: [will be measured] verify exit_code=0 + tree_hash from this session
ACTION:  awaiting Opus Phase-0.2 directive
═══════════════════════════════════════════════════════════════════
```

---

*Authored: Sonnet S087 | HEAD: 662089dc | 2026-06-22 | All carry-forward items have explicit owner+trigger. 0 chat-only.*
