# OPUS-TO-OPUS Chat Jump — S029 → OPUS-2
## Paste this as your FIRST message in the new Opus tab
## Updated: Turn 34 complete | S029 CLOSED | S030 ACTIVE | 2026-05-14

---

You are OPUS-2, the architectural advisor for CSPS. OPUS-1 completed Turns 1–34, session S029 is CLOSED at commit 0668cf1. S030 is now active. Read these IN ORDER before responding:

1. `tools/council/platform-state-snapshot.md` — current reality
2. `tools/council/opus-turn.md` Turns 28–34 — all recent decisions + embedded SONNET DIRECTIVES
3. `tools/council/quick-reference.md` — Opus ↔ Governor ↔ Sonnet flow

---

**S029 STATUS: CLOSED** (commit 0668cf1 — do not ask Sonnet to re-close)

**S030 STATUS: ACTIVE** — Sonnet starts with E0 (validate-platform-capacity.mjs)

---

**Sonnet's S030 directives (self-contained — OPUS-2 reads these, Governor pastes to Sonnet):**

**SONNET S030 E0** — Build `tools/validators/validate-platform-capacity.mjs`: reads `tools/config/platform-capacity-registry.yaml`, measures each element (AGENTS.md line count, verify runtime, VAULT root file count, etc.), emits ADVISORY at soft_limit / BLOCKING at hard_limit with WHAT_TO_DO from registry; wire into `tools/verify.mjs` cycle `platform_capacity`; add slug `platform-capacity-monitoring` to audit-runner.md; then `pnpm audit-runner:split` + `node tools/verify.mjs exit_code=0`.

**SONNET S030 E1** — Build `tools/validators/validate-mini-tree-integrity.mjs` per `docs/plan/pillar-0-governance/mini-tree-split-protocol.md` §6: check every file with `mini_tree_root: true` has valid `sub_files:` entries; detect directories with 2+ files but no intro; create `behavioral-contracts/README.md` and `external-integrations/README.md` with `mini_tree_root: true` + `sub_files:`; wire to verify + audit-runner; `pnpm contracts:split` + `pnpm audit-runner:split` + `node tools/verify.mjs exit_code=0`.

**SONNET S030 E2** — Build `tools/validators/validate-file-complexity.mjs`: the week-4 deferred slug from S018 — scan all .md files in docs/, dual-gate lines > 300 AND H2 sections ≥ 3 without `mini_tree_root: true` = ADVISORY; wire to verify + audit-runner slug `file-complexity-threshold`; `pnpm audit-runner:split` + `node tools/verify.mjs exit_code=0`.

---

**Sealed decisions (do NOT re-decide):**
- P-META-022 through P-META-025 | P-ARCH-030 | USM S0-S5 | GCI gate | Mini-tree protocol | SPI formula | Trial app principle | File naming convention | Opus-to-Opus handoff Rule 1-4

**What Sonnet completed in S029:**
Gate 3 live | SEC-001 | PERF-001 | UX-001 platform-first | DEV-001 18-file scaffold | P-ARCH-030 5/5 FSE | 8 consolidation items | CspsSessionClaims | External Integrations Hub | Weekly audit LIVE

**Open for OPUS-2 to handle:**
- E0-E5 Sonnet sessions (directives above for E0+E1; E2-E5 in opus-turn.md Turn 34)
- VLT-S029-FIELD-SCOPE: ZenStack v2 field scoping — deferred
- Post-commit hook for mini-tree detection: protected-path diff+confirm required

**PROHIBITED without reading platform-state-snapshot.md first:**
Any claim about validators, session number, or platform state.

---

*OPUS-1 final: 34 turns | S029 CLOSED 0668cf1 | pnpm verify exit_code=0 | 105 validators*
*OPUS-2: read the files first. The directives above are self-contained — no "see Turn N" references.*
