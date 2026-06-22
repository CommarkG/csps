---
id: csps.handoff.HANDOFF-S086-to-S087
name: HANDOFF-S086-to-S087
description: "S086→S087 handoff. PROTO-S086-INHERITANCE-LOOP all phases complete. AMENDMENT-1 (canonical prompt library) built. FOLLOWUP-2+3 done. Consolidation gaps A-F registered. PHASE 2 (db-push) due 2026-06-27. PARK-043 gated on PHASE 2."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
authored_by: Sonnet-S086
authored_at: "2026-06-22"
core_spine: GVRN
diataxis_type: reference
schema_anchor: vault_files
impl_status: session-close
precedent_checked: true
---

# HANDOFF S086 → S087

═══════════════════════════════════════════════════════════════════
I AM: Sonnet S086 (builder, closing)
YOU ARE: the next tab (Opus director or Sonnet builder)
THIS IS: the no-drop inheritance of S086 — PROTO-S086-INHERITANCE-LOOP + AMENDMENT-1 + consolidation gaps
DO NOW: read this fully → run verify → confirm HEAD → read consolidation gaps A-F → await Governor directive
═══════════════════════════════════════════════════════════════════

## ZONE A — STATE (S086 CLOSE)

- **verify exit_code=0 · HEAD 70a7779b** (Re-run to confirm; re-run IS the proof.)
- **PROTO-S086-INHERITANCE-LOOP**: all phases A/B/C/D complete (SROF-S086-002 in sonnet-turn.md)
- **AMENDMENT-1**: all 6 prompt-reading user-prompt-submit hooks source `tools/lib/hook-read-prompt.sh`.
  Zero hand-rolled STDIN readers. Zero inline .md header writers. `emit-governed-md.mjs` is the only sanctioned governed-.md creator.
- **gp-hook**: now writes to S086.md via `session-source.mjs`. S067.md is a historical artifact from the broken-session period.
- **FOLLOWUP-2+3**: complete per Opus #25 directive. See SROF-S086-003+004 in `tools/council/sonnet-turn.md`.
- **Consolidation gaps A-F**: identified, NOT yet scheduled. See ZONE B below.
- **PARK-043** (journey orchestrator hardwires): GATED on 2026-06-27 db-push + pw rotation (PHASE 2).
- **Haiku tab**: broken by design — session hooks inject ~23.5KB; Haiku's input budget consumed before user types. Use Haiku as sub-agent spawned from Sonnet, not standalone tab.

## ZONE B — COMPLETED THIS TAB (SEALED — build ON these, do NOT rebuild)

### PROTO-S086-INHERITANCE-LOOP (Opus #24-D directive)

**Phase A — Bleeding stopped:**
- A1. gp-hook + raw-comments hook: frontmatter added at file CREATE (via emit-governed-md.mjs)
- A2. Both hooks resolve session via `tools/lib/session-source.mjs` → S086
- A3. .gitignore: `.csps/_preview_tmp.txt` pattern added

**Phase B — Instance hardwires:**
- B1. `validate-hook-prompt-source.mjs` v2.0.0 — BLOCKING if hook reads prompt but doesn't source canonical reader
- B2. `tools/config/frontmatter-exempt-paths.yaml` SSoT created; validate-universal-alignment.mjs updated
- B3. `validate-hook-activation-smoke.mjs` — smoke-tests all user-prompt-submit hooks at runtime
- B4. `B_ACTIVATION_STEADY_STATE_VERIFY` in AGENTS.md

**Phase C — The Loop:**
- C1. `tools/lib/obligations-ledger.mjs` (total_open=53)
- C3. `validate-session-close-completeness.mjs`
- C4. `validate-inheritance-integrity.mjs`
- C5. SROF-S086-002 in sonnet-turn.md (Sonnet receipt)
- C6. `session-open.sh` inheritance-loop obligations surfacing block ← C6 Opus receipt still pending

**Phase D — Data threads closed:**
- D1. THRESHOLD-ROUTER-CONTRACT in session-state.json
- D2. Q3/Q4 resolutions propagated to session-state.json `resolved_questions`
- D3. AGENTS.md updated

### FOLLOWUP-2 (Opus #25) — AMENDMENT-1 build

| Built | What |
|-------|------|
| `tools/lib/hook-read-prompt.sh` | Canonical 3-source prompt reader (stdin JSON → arg → CLAUDE_USER_PROMPT fallback) |
| `tools/lib/emit-governed-md.mjs` | Canonical governed .md creator (Windows CLI bug fixed via fileURLToPath + resolve) |
| 6 hooks migrated | ai-profiler, comments-before-code, context-orchestrator, governor-prompts, raw-comments, (intake) |
| `validate-hook-prompt-source.mjs` v2.0.0 | AMENDMENT-1 backstop — READS_PROMPT pattern → CANONICAL_SOURCE check |
| `validate-hook-activation-smoke.mjs` | REPO_ROOT fix: `env: { ...process.env, REPO_ROOT: ROOT }` in spawnSync |
| gp-hook session fix | `session-source.mjs` call → S086.md with full YAML frontmatter |

**Regression proofs (RED→GREEN):**
- B1 RED: ai-profiler broken (stale STDIN_JSON inline reader) → BLOCKING → GREEN after hook-read-prompt.sh
- B2: 3-source fallback chain verified (stdin JSON → arg → empty)
- C4 RED: session-state S000 → hook logs S000.md | GREEN: session-state S086 → S086.md with frontmatter

### FOLLOWUP-3 (Opus #25) — Structural fixes

- `validate-register-reference-integrity.mjs`: `rotating: true` on PROTO pattern. Severity capped at ADVISORY for rotating-channel (opus-turn.md) refs regardless of `isCurrentHandoff`. Result: blocking=0 advisory=193.
- `user-prompt-submit-context-orchestrator.sh`: stale `CLAUDE_USER_PROMPT` comment on line 6 purged. Zero CLAUDE_USER_PROMPT refs in any user-prompt-submit hook (code or comments).

**ZF evidence (FOLLOWUP-3 close):**
```
register_reference_integrity: PASS blocking=0 advisory=193
grep CLAUDE_USER_PROMPT .claude/hooks/user-prompt-submit-*.sh = 0
verify exit_code=0 HEAD 70a7779b
```

## CONSOLIDATION GAPS — CARRY FORWARD (A-F)

These were identified in SROF-S086-004 but NOT scheduled. Governor/Opus must decide disposition.

**A. PROTO-S086-AMENDMENT-1 not registered** (HIGH)
- AMENDMENT-1 canonical library mandate only in commit messages + SROF-S086-004
- Fix: register in opus-turn.md as PROTO-S086-AMENDMENT-1 OR note as ratified in session-state.json
- Without this, S087 won't know AMENDMENT-1 is a formal platform commitment

**B. Block-test fixture name misleading** (LOW)
- `tools/validators/fixtures/hook-with-env-primary.sh.fixture` → named for old CLAUDE_USER_PROMPT detection
- Rename to `hook-without-canonical-reader.sh.fixture`

**C. tools/lib/ has no inventory/README** (MEDIUM)
- hook-read-prompt.sh + emit-governed-md.mjs are start of canonical library; only discoverable via grep
- Fix: `tools/lib/README.md` — what each lib does, how to source/import, AMENDMENT-1 mandate

**D. audit-runner.md 3-step ritual has no pre-commit gate** (MEDIUM)
- Validator change → edit validator → edit audit-runner.md → pnpm audit-runner:split (3 steps, no hook enforces step 2+3)
- Repeated 5x this session; detected only at verify time (freshness check)
- Fix: pre-commit hook that checks validator mtime vs audit-runner.md mtime → BLOCKING if stale

**E. Smoke validator env gap — no hook-test-env.sh helper** (MEDIUM)
- REPO_ROOT fix was reactive (5 BLOCKING false positives before discovered)
- No canonical list of what Claude Code sets in hook env
- Fix: `tools/lib/hook-test-env.sh` — documents + exports all vars Claude Code sets in hook environment

**F. Session-close artifacts written at compaction warning** (HIGH — pattern to break)
- HANDOFF + SROF-S086-004 written only after compaction warning
- C6 Opus receipt never written this session
- Fix: validate-session-close-completeness.mjs should check for HANDOFF file existence AND Opus receipt

## OPEN THREADS — NO-DROP LIST

1. **C6 — Opus inheritance receipt** (PENDING): Opus must acknowledge PROTO-S086-INHERITANCE-LOOP receipt in opus-turn.md. Not done this session.
2. **PHASE 2 (2026-06-27)**: PARK-009 rotate→db-push + password rotation. Governor action.
3. **PARK-043** (journey orchestrator 5 hardwires): GATED on PHASE 2. Do not touch until db-push confirmed.
4. **Consolidation gaps A-F**: all unscheduled. Needs Opus disposition.
5. **AQ1**: Threshold backfill — should S085 classifications be backfilled to threshold-intake-log.yaml?
6. **AQ2**: PARK-042 assessment written (PARK-042-ASSESSMENT-S086.md) — next action?
7. **AQ3**: PARK-045 prerequisite — what must be confirmed before compact-vs-new-tab goes live?
8. **AQ4**: "Insights" signal source for validate-session-insight-capture — definition needed.
9. **session-state.json**: still shows stale `current_session: S086` + many legacy S015-S022 fields. Needs a session-state update pass.

## ALIGNMENT QUESTIONS (answer before S087 build)

Q1 — Is AMENDMENT-1 a formal PROTO? Should it be registered in opus-turn.md as PROTO-S086-AMENDMENT-1?
Q2 — Which consolidation gaps (A-F) are PARK entries vs S087 immediate tasks?
Q3 — Is C6 Opus receipt required before HANDOFF-S086-to-S087 is considered sealed?
Q4 — PHASE 2 (2026-06-27) confirmed as Governor action only; confirm Sonnet should not touch db-push prep?

## SONNET STARTUP BLOCK (paste to new tab)

```
You are continuing CSPS S086→S087. Read docs/plan/_handoff/HANDOFF-S086-to-S087.md FULLY first.
FIRST: node tools/verify.mjs --skip-install (confirm exit_code=0, HEAD 70a7779b or newer).
AMENDMENT-1 is in force: all user-prompt-submit hooks source tools/lib/hook-read-prompt.sh.
tools/lib/ now has hook-read-prompt.sh + emit-governed-md.mjs — use these, do not hand-roll.
CONSOLIDATION GAPS A-F are open — do not start new build without Governor disposition on them.
PHASE 2 (2026-06-27): PARK-009 db-push is Governor-only. PARK-043 gated on it.
Report FROM SONNET | FOR OPUS. verify=0 before any DONE. Re-run IS the proof.
Read tools/council/sonnet-turn.md for SROF-S086-002/003/004 context.
```
